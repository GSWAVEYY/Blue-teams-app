/**
 * NEXUS Social System
 * Phase 11: Friends, Activity Feeds, Social Profiles
 *
 * Comprehensive social infrastructure:
 * - Friend list management with requests
 * - Player blocking system
 * - Activity feed for friend activity
 * - Social profile extensions
 * - Friend discovery
 */

class FriendRequest {
    constructor(fromUserId, toUserId) {
        this.id = this.generateUUID();
        this.fromUserId = fromUserId;
        this.toUserId = toUserId;
        this.status = 'pending';      // pending, accepted, declined
        this.sentAt = Date.now();
        this.respondedAt = null;
    }

    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    accept() {
        this.status = 'accepted';
        this.respondedAt = Date.now();
        return true;
    }

    decline() {
        this.status = 'declined';
        this.respondedAt = Date.now();
        return true;
    }
}

class ActivityEntry {
    constructor(userId, type, data) {
        this.id = this.generateUUID();
        this.userId = userId;
        this.type = type; // match_completed, ranked_up, achievement_unlocked, etc.
        this.data = data;
        this.timestamp = Date.now();
        this.likes = 0;
        this.likedBy = [];
    }

    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    like(likerUserId) {
        if (!this.likedBy.includes(likerUserId)) {
            this.likedBy.push(likerUserId);
            this.likes++;
            return true;
        }
        return false;
    }

    unlike(likerUserId) {
        const index = this.likedBy.indexOf(likerUserId);
        if (index > -1) {
            this.likedBy.splice(index, 1);
            this.likes--;
            return true;
        }
        return false;
    }
}

class SocialProfile {
    constructor(userId, username) {
        this.userId = userId;
        this.username = username;

        // Social graph
        this.friends = [];
        this.blockedPlayers = [];
        this.friendRequests = {
            sent: [],      // FriendRequest[]
            received: []   // FriendRequest[]
        };

        // Profile data
        this.bio = '';
        this.website = '';
        this.twitchChannel = '';
        this.youtubeChannel = '';

        // Status
        this.onlineStatus = 'offline';      // online, offline, in-match, in-queue
        this.lastSeen = Date.now();
        this.currentActivity = '';

        // Social metrics
        this.followers = 0;
        this.following = 0;
        this.badges = [];
        this.achievements = [];

        // Activity
        this.activityFeed = [];
        this.maxActivitySize = 50;

        // Privacy
        this.privacy = {
            profileVisibility: 'public',    // public, friends, private
            allowFriendRequests: true,
            allowDMs: true,
            showOnlineStatus: true,
            showActivity: true
        };
    }

    /**
     * Add activity to feed
     */
    addActivity(type, data) {
        const entry = new ActivityEntry(this.userId, type, data);
        this.activityFeed.unshift(entry);

        if (this.activityFeed.length > this.maxActivitySize) {
            this.activityFeed.pop();
        }

        return entry;
    }

    /**
     * Get activity feed
     */
    getActivityFeed(limit = 20) {
        return this.activityFeed.slice(0, limit);
    }

    /**
     * Update online status
     */
    setOnlineStatus(status) {
        this.onlineStatus = status;
        this.lastSeen = Date.now();
    }

    /**
     * Get profile summary
     */
    getSummary() {
        return {
            userId: this.userId,
            username: this.username,
            bio: this.bio,
            onlineStatus: this.onlineStatus,
            followers: this.followers,
            following: this.following,
            badges: this.badges,
            website: this.website,
            twitchChannel: this.twitchChannel
        };
    }
}

class SocialManager {
    constructor(networkManager) {
        this.network = networkManager;
        this.profiles = new Map();          // userId -> SocialProfile
        this.friendRequests = new Map();    // requestId -> FriendRequest
        this.blockList = new Map();         // userId -> Set of blocked users

        // Analytics
        this.socialStats = {
            totalFriendships: 0,
            totalBlocks: 0,
            averageFriendsPerPlayer: 0
        };

        // Setup network listeners
        this.setupNetworkListeners();
    }

    /**
     * Setup network listeners
     */
    setupNetworkListeners() {
        this.network.on('FRIEND_REQUEST_RECEIVED', (payload) => this.onFriendRequestReceived(payload));
        this.network.on('FRIEND_REQUEST_ACCEPTED', (payload) => this.onFriendRequestAccepted(payload));
        this.network.on('PLAYER_BLOCKED', (payload) => this.onPlayerBlocked(payload));
        this.network.on('ACTIVITY_POSTED', (payload) => this.onActivityPosted(payload));
    }

    /**
     * Get or create social profile
     */
    getOrCreateProfile(userId, username) {
        if (!this.profiles.has(userId)) {
            this.profiles.set(userId, new SocialProfile(userId, username));
        }
        return this.profiles.get(userId);
    }

    /**
     * Get social profile
     */
    getProfile(userId) {
        return this.profiles.get(userId);
    }

    /**
     * Send friend request
     */
    sendFriendRequest(fromUserId, toUserId) {
        const fromProfile = this.getOrCreateProfile(fromUserId, '');
        const toProfile = this.getOrCreateProfile(toUserId, '');

        // Check if already friends
        if (fromProfile.friends.includes(toUserId)) {
            console.error('[SocialManager] Already friends');
            return false;
        }

        // Check if blocked
        if (this.isBlocked(fromUserId, toUserId)) {
            console.error('[SocialManager] User has blocked you');
            return false;
        }

        // Check if request already pending
        if (fromProfile.friendRequests.sent.some(r => r.toUserId === toUserId)) {
            console.error('[SocialManager] Friend request already sent');
            return false;
        }

        // Create request
        const request = new FriendRequest(fromUserId, toUserId);
        this.friendRequests.set(request.id, request);

        // Add to profiles
        fromProfile.friendRequests.sent.push(request);
        toProfile.friendRequests.received.push(request);

        // Send to server
        this.network.send('FRIEND_REQUEST_SENT', {
            requestId: request.id,
            fromUserId,
            toUserId
        });

        console.log(`[SocialManager] Friend request sent from ${fromUserId} to ${toUserId}`);
        return true;
    }

    /**
     * Accept friend request
     */
    acceptFriendRequest(requestId, userId) {
        const request = this.friendRequests.get(requestId);
        if (!request) return false;

        if (request.toUserId !== userId) return false;
        if (request.status !== 'pending') return false;

        // Accept request
        request.accept();

        // Add to friends
        const fromProfile = this.profiles.get(request.fromUserId);
        const toProfile = this.profiles.get(request.toUserId);

        fromProfile.friends.push(request.toUserId);
        toProfile.friends.push(request.fromUserId);

        // Remove from request lists
        fromProfile.friendRequests.sent = fromProfile.friendRequests.sent.filter(r => r.id !== requestId);
        toProfile.friendRequests.received = toProfile.friendRequests.received.filter(r => r.id !== requestId);

        // Update stats
        this.socialStats.totalFriendships++;

        // Send to server
        this.network.send('FRIEND_REQUEST_ACCEPTED', {
            requestId,
            userId
        });

        console.log(`[SocialManager] Friend request accepted: ${request.fromUserId} <-> ${request.toUserId}`);
        return true;
    }

    /**
     * Decline friend request
     */
    declineFriendRequest(requestId, userId) {
        const request = this.friendRequests.get(requestId);
        if (!request) return false;

        if (request.toUserId !== userId) return false;
        if (request.status !== 'pending') return false;

        // Decline request
        request.decline();

        // Remove from request lists
        const fromProfile = this.profiles.get(request.fromUserId);
        const toProfile = this.profiles.get(request.toUserId);

        fromProfile.friendRequests.sent = fromProfile.friendRequests.sent.filter(r => r.id !== requestId);
        toProfile.friendRequests.received = toProfile.friendRequests.received.filter(r => r.id !== requestId);

        this.network.send('FRIEND_REQUEST_DECLINED', { requestId });
        return true;
    }

    /**
     * Remove friend
     */
    removeFriend(userId, friendId) {
        const profile = this.profiles.get(userId);
        const friendProfile = this.profiles.get(friendId);

        if (!profile || !friendProfile) return false;

        profile.friends = profile.friends.filter(id => id !== friendId);
        friendProfile.friends = friendProfile.friends.filter(id => id !== userId);

        this.socialStats.totalFriendships--;

        this.network.send('FRIEND_REMOVED', {
            userId,
            friendId
        });

        console.log(`[SocialManager] Friendship removed: ${userId} <-> ${friendId}`);
        return true;
    }

    /**
     * Block player
     */
    blockPlayer(userId, blockedUserId) {
        if (!this.blockList.has(userId)) {
            this.blockList.set(userId, new Set());
        }

        this.blockList.get(userId).add(blockedUserId);

        // If they were friends, remove friendship
        this.removeFriend(userId, blockedUserId);

        this.socialStats.totalBlocks++;

        this.network.send('PLAYER_BLOCKED', {
            userId,
            blockedUserId
        });

        console.log(`[SocialManager] ${userId} blocked ${blockedUserId}`);
        return true;
    }

    /**
     * Unblock player
     */
    unblockPlayer(userId, blockedUserId) {
        const blocked = this.blockList.get(userId);
        if (!blocked) return false;

        blocked.delete(blockedUserId);

        this.socialStats.totalBlocks--;

        this.network.send('PLAYER_UNBLOCKED', {
            userId,
            blockedUserId
        });

        return true;
    }

    /**
     * Check if player is blocked
     */
    isBlocked(userId, potentialBlockerId) {
        const blocked = this.blockList.get(potentialBlockerId);
        return blocked ? blocked.has(userId) : false;
    }

    /**
     * Get friends list
     */
    getFriends(userId) {
        const profile = this.profiles.get(userId);
        if (!profile) return [];

        return profile.friends.map(friendId => {
            const friendProfile = this.profiles.get(friendId);
            return {
                userId: friendId,
                username: friendProfile?.username,
                onlineStatus: friendProfile?.onlineStatus,
                lastSeen: friendProfile?.lastSeen
            };
        });
    }

    /**
     * Get pending friend requests
     */
    getPendingRequests(userId) {
        const profile = this.profiles.get(userId);
        if (!profile) return [];

        return profile.friendRequests.received.filter(r => r.status === 'pending');
    }

    /**
     * Get sent friend requests
     */
    getSentRequests(userId) {
        const profile = this.profiles.get(userId);
        if (!profile) return [];

        return profile.friendRequests.sent.filter(r => r.status === 'pending');
    }

    /**
     * Post activity
     */
    postActivity(userId, type, data) {
        const profile = this.getOrCreateProfile(userId, '');
        const activity = profile.addActivity(type, data);

        // Broadcast to friends
        const friends = profile.friends;
        friends.forEach(friendId => {
            const friendProfile = this.profiles.get(friendId);
            if (friendProfile && friendProfile.privacy.showActivity) {
                // In a real system, would add to friend's activity feed
            }
        });

        this.network.send('ACTIVITY_POSTED', {
            userId,
            activity
        });

        return activity;
    }

    /**
     * Get friend activity feed
     */
    getFriendActivityFeed(userId, limit = 50) {
        const profile = this.profiles.get(userId);
        if (!profile) return [];

        const friendIds = profile.friends;
        const feed = [];

        friendIds.forEach(friendId => {
            const friendProfile = this.profiles.get(friendId);
            if (friendProfile && friendProfile.privacy.showActivity) {
                feed.push(...friendProfile.getActivityFeed(10));
            }
        });

        // Sort by timestamp descending
        feed.sort((a, b) => b.timestamp - a.timestamp);

        return feed.slice(0, limit);
    }

    /**
     * Search for players
     */
    searchPlayers(query) {
        const results = [];
        this.profiles.forEach(profile => {
            if (profile.username.toLowerCase().includes(query.toLowerCase())) {
                results.push(profile.getSummary());
            }
        });
        return results;
    }

    /**
     * Like activity
     */
    likeActivity(userId, activityId) {
        let found = false;
        this.profiles.forEach(profile => {
            profile.activityFeed.forEach(activity => {
                if (activity.id === activityId) {
                    activity.like(userId);
                    found = true;
                }
            });
        });
        return found;
    }

    /**
     * Update online status
     */
    updateOnlineStatus(userId, status) {
        const profile = this.getOrCreateProfile(userId, '');
        profile.setOnlineStatus(status);

        this.network.send('ONLINE_STATUS_CHANGED', {
            userId,
            status
        });
    }

    /**
     * Handle friend request received from server
     */
    onFriendRequestReceived(payload) {
        const { fromUserId, toUserId, requestId } = payload;
        const request = new FriendRequest(fromUserId, toUserId);
        request.id = requestId;
        this.friendRequests.set(requestId, request);

        const toProfile = this.getOrCreateProfile(toUserId, '');
        toProfile.friendRequests.received.push(request);
    }

    /**
     * Handle friend request accepted
     */
    onFriendRequestAccepted(payload) {
        const { fromUserId, toUserId } = payload;
        const fromProfile = this.profiles.get(fromUserId);
        const toProfile = this.profiles.get(toUserId);

        if (fromProfile && toProfile) {
            fromProfile.friends.push(toUserId);
            toProfile.friends.push(fromUserId);
        }
    }

    /**
     * Handle player blocked
     */
    onPlayerBlocked(payload) {
        const { userId, blockedUserId } = payload;
        if (!this.blockList.has(userId)) {
            this.blockList.set(userId, new Set());
        }
        this.blockList.get(userId).add(blockedUserId);
    }

    /**
     * Handle activity posted
     */
    onActivityPosted(payload) {
        const { userId, activity } = payload;
        const profile = this.getOrCreateProfile(userId, '');
        profile.activityFeed.unshift(activity);
    }

    /**
     * Get social statistics
     */
    getStatistics() {
        const totalPlayers = this.profiles.size;
        const totalFriends = this.socialStats.totalFriendships * 2; // Bidirectional

        return {
            totalPlayers,
            totalFriendships: this.socialStats.totalFriendships,
            totalBlocks: this.socialStats.totalBlocks,
            averageFriendsPerPlayer: totalPlayers > 0
                ? (totalFriends / totalPlayers).toFixed(2)
                : 0,
            activeNow: Array.from(this.profiles.values()).filter(p => p.onlineStatus !== 'offline').length
        };
    }
}

/**
 * Global social manager instance
 */
let socialManager = null;

function initializeSocial(networkManager) {
    if (!socialManager) {
        socialManager = new SocialManager(networkManager);
    }
    return socialManager;
}

function getSocialManager() {
    if (!socialManager) {
        console.error('[SocialManager] Not initialized! Call initializeSocial first.');
        return null;
    }
    return socialManager;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FriendRequest,
        ActivityEntry,
        SocialProfile,
        SocialManager,
        initializeSocial,
        getSocialManager
    };
}
