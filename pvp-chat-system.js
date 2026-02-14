/**
 * NEXUS Chat System
 * Phase 11: Global, Team, Direct Messages, and Party Chat
 *
 * Comprehensive messaging infrastructure:
 * - Global chat with moderation
 * - Team chat (private to team members)
 * - Direct messages between players
 * - Party chat for pre-match coordination
 * - Message moderation and rate limiting
 */

class Message {
    constructor(sender, content, channel, channelId) {
        this.id = this.generateUUID();
        this.sender = {
            userId: sender.userId,
            username: sender.username,
            tier: sender.tier
        };
        this.content = content.substring(0, 512); // Max 512 chars
        this.channel = channel;                    // global, team, dm, party
        this.channelId = channelId;

        this.metadata = {
            timestamp: Date.now(),
            edited: false,
            editedAt: null,
            pinned: false,
            pinnedBy: null
        };

        this.engagement = {
            likes: 0,
            likedBy: [],
            replies: 0
        };

        this.filtering = {
            flagged: false,
            flagReason: null,
            deleted: false
        };
    }

    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    edit(newContent) {
        this.content = newContent.substring(0, 512);
        this.metadata.edited = true;
        this.metadata.editedAt = Date.now();
    }

    delete() {
        this.filtering.deleted = true;
        this.content = '[Message deleted]';
    }

    pin(userId) {
        this.metadata.pinned = true;
        this.metadata.pinnedBy = userId;
    }

    like(userId) {
        if (!this.engagement.likedBy.includes(userId)) {
            this.engagement.likedBy.push(userId);
            this.engagement.likes++;
        }
    }
}

class ChatChannel {
    constructor(name, type, maxSize = 1000) {
        this.id = this.generateUUID();
        this.name = name;
        this.type = type;                        // global, team, dm, party
        this.messages = [];
        this.maxSize = maxSize;
        this.createdAt = Date.now();
        this.participants = [];
    }

    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    addMessage(message) {
        this.messages.push(message);
        if (this.messages.length > this.maxSize) {
            this.messages.shift(); // Remove oldest
        }
        return message;
    }

    getMessages(limit = 50, offset = 0) {
        return this.messages.slice(-limit - offset, -offset || undefined).reverse();
    }

    getPinnedMessages() {
        return this.messages.filter(m => m.metadata.pinned);
    }
}

class ChatManager {
    constructor(networkManager) {
        this.network = networkManager;

        // Channels
        this.channels = new Map();              // channelId -> ChatChannel
        this.globalChannel = null;
        this.teamChannels = new Map();          // teamId -> ChatChannel
        this.dmChannels = new Map();            // userId+userId -> ChatChannel
        this.partyChannels = new Map();         // partyId -> ChatChannel

        // User state
        this.userStatuses = new Map();          // userId -> typing status
        this.mutedUsers = new Map();            // userId -> mutedUsers set
        this.userJoinTime = new Map();          // userId -> join timestamp

        // Moderation
        this.bannedWords = [
            'racist_term1', 'racist_term2',     // Would contain actual banned words
            'toxic_phrase1', 'toxic_phrase2'
        ];

        this.reportedMessages = new Map();      // messageId -> reports
        this.mutedPlayers = new Map();          // userId -> { duration, until }

        // Rate limiting
        this.messageCount = new Map();          // userId -> count in time window
        this.rateLimitWindow = 1000;            // 1 second
        this.messageLimits = {
            'global': 1,
            'team': 2,
            'dm': 1,
            'party': 3
        };

        // Initialize global channel
        this.globalChannel = new ChatChannel('Global', 'global');
        this.channels.set('global', this.globalChannel);

        // Setup network listeners
        this.setupNetworkListeners();

        console.log('[ChatManager] Initialized');
    }

    /**
     * Setup network listeners
     */
    setupNetworkListeners() {
        this.network.on('MESSAGE_RECEIVED', (payload) => this.onMessageReceived(payload));
        this.network.on('MESSAGE_DELETED', (payload) => this.onMessageDeleted(payload));
        this.network.on('USER_MUTED', (payload) => this.onUserMuted(payload));
        this.network.on('CHAT_HISTORY', (payload) => this.onChatHistory(payload));
    }

    /**
     * Create team chat channel
     */
    createTeamChannel(teamId, teamName) {
        const channel = new ChatChannel(`${teamName} Team Chat`, 'team');
        this.teamChannels.set(teamId, channel);
        this.channels.set(channel.id, channel);
        return channel;
    }

    /**
     * Get or create DM channel
     */
    getOrCreateDMChannel(userId1, userId2) {
        const key = [userId1, userId2].sort().join('-');

        if (!this.dmChannels.has(key)) {
            const channel = new ChatChannel(`DM: ${userId1}-${userId2}`, 'dm', 500);
            this.dmChannels.set(key, channel);
            this.channels.set(channel.id, channel);
        }

        return this.dmChannels.get(key);
    }

    /**
     * Create party channel
     */
    createPartyChannel(partyId, memberIds) {
        const channel = new ChatChannel(`Party #${partyId}`, 'party', 200);
        channel.participants = memberIds;
        this.partyChannels.set(partyId, channel);
        this.channels.set(channel.id, channel);
        return channel;
    }

    /**
     * Check rate limit
     */
    canSendMessage(userId, channel) {
        const limit = this.messageLimits[channel] || 1;
        const count = this.messageCount.get(userId) || 0;

        return count < limit;
    }

    /**
     * Reset rate limit after time window
     */
    resetRateLimit(userId) {
        setTimeout(() => {
            this.messageCount.delete(userId);
        }, this.rateLimitWindow);
    }

    /**
     * Update message count
     */
    incrementMessageCount(userId) {
        const count = this.messageCount.get(userId) || 0;
        this.messageCount.set(userId, count + 1);
    }

    /**
     * Check message for toxic content
     */
    filterMessage(content) {
        let filtered = content;
        let flagged = false;

        for (const word of this.bannedWords) {
            if (filtered.toLowerCase().includes(word)) {
                filtered = filtered.replace(new RegExp(word, 'gi'), '*'.repeat(word.length));
                flagged = true;
            }
        }

        return { filtered, flagged };
    }

    /**
     * Send message to channel
     */
    sendMessage(sender, content, channel, channelId) {
        // Check if user is muted
        if (this.isUserMuted(sender.userId)) {
            console.warn('[ChatManager] User is muted');
            return null;
        }

        // Check rate limit
        if (!this.canSendMessage(sender.userId, channel)) {
            console.warn('[ChatManager] Rate limit exceeded');
            return null;
        }

        // Filter content
        const { filtered, flagged } = this.filterMessage(content);

        // Create message
        const message = new Message(sender, filtered, channel, channelId);
        message.filtering.flagged = flagged;
        if (flagged) message.filtering.flagReason = 'Toxic content detected';

        // Add to channel
        const targetChannel = this.channels.get(channelId) || this.globalChannel;
        targetChannel.addMessage(message);

        // Update rate limit
        this.incrementMessageCount(sender.userId);
        this.resetRateLimit(sender.userId);

        // Send to server
        this.network.send('MESSAGE_SENT', {
            messageId: message.id,
            sender: message.sender,
            content: message.content,
            channel,
            channelId,
            flagged
        });

        console.log(`[ChatManager] Message sent to ${channel}: ${message.id}`);
        return message;
    }

    /**
     * Send direct message
     */
    sendDM(fromUserId, fromUsername, toUserId, content, fromTier = 'bronze') {
        const channel = this.getOrCreateDMChannel(fromUserId, toUserId);

        const sender = {
            userId: fromUserId,
            username: fromUsername,
            tier: fromTier
        };

        return this.sendMessage(sender, content, 'dm', channel.id);
    }

    /**
     * Send team message
     */
    sendTeamMessage(sender, content, teamId) {
        const channel = this.teamChannels.get(teamId);
        if (!channel) {
            console.error('[ChatManager] Team channel not found');
            return null;
        }

        return this.sendMessage(sender, content, 'team', channel.id);
    }

    /**
     * Send global message
     */
    sendGlobalMessage(sender, content) {
        return this.sendMessage(sender, content, 'global', 'global');
    }

    /**
     * Delete message
     */
    deleteMessage(messageId, userId) {
        let message = null;

        // Find message in all channels
        for (const channel of this.channels.values()) {
            const msg = channel.messages.find(m => m.id === messageId);
            if (msg) {
                // Check if user is sender or moderator
                if (msg.sender.userId === userId) {
                    msg.delete();
                    message = msg;
                    break;
                }
            }
        }

        if (message) {
            this.network.send('MESSAGE_DELETED', {
                messageId,
                deletedBy: userId
            });
        }

        return message;
    }

    /**
     * Pin message
     */
    pinMessage(messageId, userId, channelId) {
        const channel = this.channels.get(channelId);
        if (!channel) return false;

        const message = channel.messages.find(m => m.id === messageId);
        if (message) {
            message.pin(userId);
            return true;
        }
        return false;
    }

    /**
     * Get messages from channel
     */
    getMessages(channelId, limit = 50) {
        const channel = this.channels.get(channelId);
        if (!channel) return [];

        return channel.getMessages(limit);
    }

    /**
     * Mute user
     */
    muteUser(userId, durationMs = 1800000) {
        // 30 minutes default
        const until = Date.now() + durationMs;
        this.mutedPlayers.set(userId, {
            duration: durationMs,
            until: until
        });

        console.log(`[ChatManager] ${userId} muted until ${new Date(until).toISOString()}`);

        this.network.send('USER_MUTED', {
            userId,
            until
        });
    }

    /**
     * Unmute user
     */
    unmuteUser(userId) {
        this.mutedPlayers.delete(userId);
        this.network.send('USER_UNMUTED', { userId });
    }

    /**
     * Check if user is muted
     */
    isUserMuted(userId) {
        const muted = this.mutedPlayers.get(userId);
        if (!muted) return false;

        if (Date.now() > muted.until) {
            this.unmuteUser(userId);
            return false;
        }

        return true;
    }

    /**
     * Block user in chat
     */
    blockUserChat(userId, blockedUserId) {
        if (!this.mutedUsers.has(userId)) {
            this.mutedUsers.set(userId, new Set());
        }
        this.mutedUsers.get(userId).add(blockedUserId);
    }

    /**
     * Report message
     */
    reportMessage(messageId, reporterId, reason) {
        if (!this.reportedMessages.has(messageId)) {
            this.reportedMessages.set(messageId, []);
        }

        this.reportedMessages.get(messageId).push({
            reporterId,
            reason,
            timestamp: Date.now()
        });

        // If 3+ reports, auto-flag for moderation
        if (this.reportedMessages.get(messageId).length >= 3) {
            console.warn(`[ChatManager] Message flagged by moderation: ${messageId}`);
        }

        this.network.send('MESSAGE_REPORTED', {
            messageId,
            reporterId,
            reason
        });
    }

    /**
     * Set typing status
     */
    setTypingStatus(userId, isTyping, channelId) {
        if (isTyping) {
            this.userStatuses.set(`${userId}:${channelId}`, {
                isTyping: true,
                timestamp: Date.now()
            });
        } else {
            this.userStatuses.delete(`${userId}:${channelId}`);
        }
    }

    /**
     * Get DM messages
     */
    getDMMessages(userId1, userId2, limit = 50) {
        const channel = this.getOrCreateDMChannel(userId1, userId2);
        return channel.getMessages(limit);
    }

    /**
     * Get team messages
     */
    getTeamMessages(teamId, limit = 50) {
        const channel = this.teamChannels.get(teamId);
        if (!channel) return [];

        return channel.getMessages(limit);
    }

    /**
     * Get global messages
     */
    getGlobalMessages(limit = 50) {
        return this.globalChannel.getMessages(limit);
    }

    /**
     * Search messages
     */
    searchMessages(query, channelId = null, limit = 20) {
        const channels = channelId
            ? [this.channels.get(channelId)]
            : Array.from(this.channels.values());

        const results = [];
        const queryLower = query.toLowerCase();

        for (const channel of channels) {
            if (channel) {
                const matching = channel.messages.filter(m =>
                    !m.filtering.deleted &&
                    m.content.toLowerCase().includes(queryLower)
                );
                results.push(...matching);
            }
        }

        // Sort by timestamp descending
        results.sort((a, b) => b.metadata.timestamp - a.metadata.timestamp);

        return results.slice(0, limit);
    }

    /**
     * Get chat statistics
     */
    getStatistics() {
        let totalMessages = 0;
        let totalFlaggedMessages = 0;

        for (const channel of this.channels.values()) {
            totalMessages += channel.messages.length;
            totalFlaggedMessages += channel.messages.filter(m => m.filtering.flagged).length;
        }

        return {
            totalChannels: this.channels.size,
            totalMessages,
            totalFlaggedMessages,
            toxicityRate: totalMessages > 0
                ? ((totalFlaggedMessages / totalMessages) * 100).toFixed(1)
                : 0,
            mutedUsers: this.mutedPlayers.size
        };
    }

    /**
     * Handle message received from server
     */
    onMessageReceived(payload) {
        const { message, channelId } = payload;
        const channel = this.channels.get(channelId) || this.globalChannel;
        const msg = Object.assign(new Message({}, '', 'global', ''), message);
        channel.addMessage(msg);
    }

    /**
     * Handle message deleted
     */
    onMessageDeleted(payload) {
        const { messageId } = payload;

        for (const channel of this.channels.values()) {
            const message = channel.messages.find(m => m.id === messageId);
            if (message) {
                message.delete();
                break;
            }
        }
    }

    /**
     * Handle user muted
     */
    onUserMuted(payload) {
        const { userId, until } = payload;
        const durationMs = until - Date.now();
        this.mutedPlayers.set(userId, {
            duration: durationMs,
            until: until
        });
    }

    /**
     * Handle chat history from server
     */
    onChatHistory(payload) {
        const { channelId, messages } = payload;
        const channel = this.channels.get(channelId);
        if (channel) {
            messages.forEach(msg => {
                const message = Object.assign(new Message({}, '', 'global', ''), msg);
                channel.messages.push(message);
            });
        }
    }
}

/**
 * Global chat manager instance
 */
let chatManager = null;

function initializeChat(networkManager) {
    if (!chatManager) {
        chatManager = new ChatManager(networkManager);
    }
    return chatManager;
}

function getChatManager() {
    if (!chatManager) {
        console.error('[ChatManager] Not initialized! Call initializeChat first.');
        return null;
    }
    return chatManager;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Message,
        ChatChannel,
        ChatManager,
        initializeChat,
        getChatManager
    };
}
