# NEXUS Fantasy MOBA Weapon System Design
## Implementation Guide & Technical Specifications

---

## QUICK SUMMARY

For NEXUS (a top-down fantasy PvP MOBA), weapons should:
- **Complement abilities** (not replace them as damage source)
- **Enable playstyle variety** (same role, different weapons = different tactics)
- **Create team synergies** (weapon types support team compositions)
- **Provide visual clarity** (players instantly recognize weapon types)
- **Scale with hero stats** (AD/AP, not gold/items like traditional MOBAs)

---

## 1. WEAPON SYSTEM DATA STRUCTURE

### Hero-to-Weapon Assignment

Each hero has **Primary** and **Secondary** weapons assigned at hero creation:

```javascript
// In hero-system.js weapon assignments
{
  id: 'warrior_01_blade',
  role: 'Warrior',
  name: 'Blade',
  lore: 'Ancient swordmaster of the Northern reaches',

  // WEAPONS (NEW)
  primaryWeapon: 'greatsword_heavy',
  secondaryWeapon: 'shield_bash',

  // Existing stats
  stats: {
    health: 650,
    armor: 25,
    attackDamage: 55,
    abilityPower: 20,
    attackSpeed: 0.8,
    cooldownReduction: 0,
  },
  // ... rest of hero data
}

// NEW: Weapon Type Database
const weaponDatabase = {
  'greatsword_heavy': {
    type: 'Melee',
    name: 'Greatsword',
    element: 'Slashing',
    baseRange: 100,
    baseDamage: 1.0,    // Multiplied by hero AD
    attackSpeed: 0.8,   // Inherits from hero
    special: 'charge',  // Can charge for higher damage
    projectile: false,
    aoe: false,
    description: 'Heavy blade - High damage, slow attack'
  },

  'shield_bash': {
    type: 'Melee',
    name: 'Shield Bash',
    element: 'Crushing',
    baseRange: 80,
    baseDamage: 0.7,
    attackSpeed: 0.9,
    special: 'stun_chance',  // 30% chance to stun on hit
    projectile: false,
    aoe: true,             // Cone attack
    aoeRadius: 150,
    description: 'Defensive counter - Lower damage, stun capability'
  },

  'bow_ranger': {
    type: 'Ranged',
    name: 'Bow',
    element: 'Piercing',
    baseRange: 400,
    baseDamage: 0.85,
    attackSpeed: 1.0,
    special: 'none',
    projectile: true,
    projectileSpeed: 500,  // pixels per second
    arrowTrail: true,
    description: 'Precision ranged - Medium damage, skill shot'
  },

  'staff_mage': {
    type: 'Magic',
    name: 'Staff',
    element: 'Arcane',
    baseRange: 350,
    baseDamage: 0.6,       // Scales with AP, not AD
    apScaling: 0.8,        // +0.8 AP per ability power point
    attackSpeed: 1.2,      // Fast projectiles
    special: 'none',
    projectile: true,
    projectileSpeed: 600,
    aoe: false,
    description: 'Magical projectile - Fast attack, scales with AP'
  }
};
```

---

## 2. ATTACK SYSTEM MECHANICS

### Attack Calculation Formula

```javascript
// Pseudo-code for weapon attack damage
calculateWeaponDamage(attacker, weapon, defender) {
  // Base damage from weapon
  let baseDamage = weapon.baseDamage;

  // Scaling with attacker stats
  if (weapon.type === 'Magic') {
    baseDamage += attacker.stats.abilityPower * weapon.apScaling;
  } else {
    baseDamage += attacker.stats.attackDamage * 0.75;  // AD scaling
  }

  // Crit damage (bonus from items/abilities)
  if (isCriticalHit()) {
    baseDamage *= 1.5;  // 150% critical multiplier
  }

  // Armor reduction
  let armorReduction = 1 - (defender.stats.armor / 100);
  let finalDamage = baseDamage * armorReduction;

  // Element type bonus/penalty
  finalDamage *= getElementalMultiplier(weapon.element, defender);

  return Math.max(1, finalDamage);  // Min 1 damage
}
```

### Element Type System

```javascript
// Damage type interactions (Rock-paper-scissors)
const elementalAdvantages = {
  'Slashing': {      // Warriors
    effective: ['unarmored'],
    weak: ['armor'],
    effect: 'bleed'   // Applies DoT
  },
  'Piercing': {      // Rangers
    effective: ['armor'],  // Ignores 20% armor
    weak: ['none'],
    effect: 'none'
  },
  'Crushing': {      // Guardians/Warriors
    effective: ['unarmored'],
    weak: ['magic_resistant'],
    effect: 'stun'    // Chance to stun
  },
  'Arcane': {        // Mages
    effective: ['magic_resistant'],
    weak: ['none'],
    effect: 'none'    // Pure damage
  },
  'Fire': {          // Mage specialty
    effective: ['nature'],
    weak: ['water'],
    effect: 'burn'    // DoT, reduces healing
  },
  'Frost': {         // Mage specialty
    effective: ['none'],
    weak: ['fire'],
    effect: 'slow'    // Movement speed -30%
  },
  'Poison': {        // Rogue specialty
    effective: ['none'],
    weak: ['none'],
    effect: 'poison'  // DoT + armor reduction
  },
  'Lightning': {     // Mage specialty
    effective: ['water'],
    weak: ['none'],
    effect: 'chain'   // Bounces to nearby enemies
  }
};

function getElementalMultiplier(attackerElement, defenderResistance) {
  if (attackerElement === 'Piercing' && defenderResistance.armor > 30) {
    return 1.2;  // +20% vs heavy armor
  }
  if (attackerElement === 'Crushing') {
    return 1.15; // +15% base
  }
  return 1.0;  // Neutral by default
}
```

---

## 3. ATTACK SPEED & COOLDOWN SYSTEM

### Attack Speed Calculation

```javascript
// Attack speed determines weapon attack rate
calculateAttackSpeed(hero) {
  let baseAS = hero.stats.attackSpeed;  // 0.8-1.3 depending on hero

  // Agility stat increases AS (+10% per point above base)
  baseAS *= (1 + hero.stats.agility * 0.1);

  // Ability effects can modify AS
  if (hero.hasPassiveEffect('attackSpeedBuff')) {
    baseAS *= 1.15;  // +15% from ability
  }

  return Math.min(baseAS, 2.5);  // Cap at 2.5 attacks per second
}

// Attack cooldown is inverse of attack speed
getAttackCooldown(hero) {
  const as = calculateAttackSpeed(hero);
  return 1.0 / as;  // If AS = 1.0, cooldown = 1.0 second
}

// Track individual attack cooldown per weapon
heroInstance.primaryWeaponCooldown = 0;  // Current remaining cooldown
heroInstance.secondaryWeaponCooldown = 0;

// In game loop update:
if (heroInstance.primaryWeaponCooldown > 0) {
  heroInstance.primaryWeaponCooldown -= deltaTime;
}

// Attack available when cooldown <= 0
canAttack(hero, weaponSlot) {
  return weaponSlot === 'primary'
    ? hero.primaryWeaponCooldown <= 0
    : hero.secondaryWeaponCooldown <= 0;
}
```

### Weapon Switching Mechanics

```javascript
// Switching weapons has a cost (interrupts attack chain)
switchWeapon(hero, targetSlot) {
  const switchTime = 0.5;  // Half second to switch

  // Immediately reset current weapon cooldown
  if (targetSlot === 'primary') {
    hero.secondaryWeaponCooldown = 0;
  } else {
    hero.primaryWeaponCooldown = 0;
  }

  // New weapon has cooldown to prevent instant attacking
  hero.weaponSwitchCooldown = switchTime;

  // During switch, hero movement reduced (visual vulnerability)
  hero.movementSpeed *= 0.5;

  // Hero cannot attack during switch
  hero.canAttack = false;

  // After switch completes
  setTimeout(() => {
    hero.canAttack = true;
    hero.movementSpeed = hero.baseMovementSpeed;
    hero.currentWeapon = targetSlot;
  }, switchTime * 1000);
}

// Special: Support heroes can reset ally weapon cooldown on switch
if (hero.role === 'Guardian' && swappedNearAlly()) {
  allyHero.primaryWeaponCooldown = 0;  // Reset ally weapon
}
```

---

## 4. WEAPON SPECIAL MECHANICS

### Charging System (Heavy Weapons)

```javascript
// For Greatswords, Axes, Heavy Maces
class ChargingWeapon {
  constructor(hero, weapon) {
    this.hero = hero;
    this.weapon = weapon;
    this.chargeLevel = 0;  // 0-1.0
    this.maxChargeTime = 1.5;  // Seconds to full charge
    this.chargeStartTime = 0;
    this.isCharging = false;
  }

  startCharge() {
    this.isCharging = true;
    this.chargeStartTime = gameTime;
  }

  updateCharge(deltaTime) {
    if (!this.isCharging) return;

    const elapsed = gameTime - this.chargeStartTime;
    this.chargeLevel = Math.min(1.0, elapsed / this.maxChargeTime);

    // Visual feedback: enlarge weapon on screen as charge builds
    const scale = 1.0 + (this.chargeLevel * 0.3);  // 1.0 to 1.3x size
    this.weapon.scale = scale;

    // Particle effect showing charge intensity
    if (this.chargeLevel > 0.5) {
      spawnChargeParticles(this.hero.position, this.chargeLevel);
    }
  }

  release() {
    if (!this.isCharging) return;

    this.isCharging = false;

    // Damage scales with charge level
    const chargeDamageMultiplier = 1.0 + (this.chargeLevel * 1.0);  // 1.0x to 2.0x
    const finalDamage = calculateWeaponDamage(this.hero, this.weapon) * chargeDamageMultiplier;

    // Knockback increases with charge
    const knockback = 100 + (this.chargeLevel * 200);  // 100-300 pixels

    // Fully charged (1.0) grants bonus effect
    if (this.chargeLevel >= 0.95) {
      applyFullChargeBonus(finalDamage, knockback);  // Stun on hit
    }

    this.chargeLevel = 0;
    this.weapon.scale = 1.0;

    return { damage: finalDamage, knockback: knockback };
  }
}
```

### Multi-Strike Combo System (Rogues, Dual-Wielders)

```javascript
class ComboWeapon {
  constructor(hero, weapon) {
    this.hero = hero;
    this.weapon = weapon;
    this.comboCount = 0;  // Current combo hits (0-3)
    this.maxCombo = 3;
    this.comboResetTime = 2.0;  // Seconds before combo resets
    this.lastHitTime = 0;
  }

  executeComboAttack() {
    // Check if last hit was recent enough to continue combo
    if (gameTime - this.lastHitTime > this.comboResetTime) {
      this.comboCount = 0;  // Reset combo
    }

    // Advance combo counter
    const comboIndex = Math.min(this.comboCount, this.maxCombo - 1);
    this.comboCount += 1;

    // Each hit in combo does more damage
    const comboDamageMultipliers = [0.6, 0.8, 1.0];
    const multiplier = comboDamageMultipliers[comboIndex];

    const damage = calculateWeaponDamage(this.hero, this.weapon) * multiplier;

    // Final hit (3rd) grants knockback or stun
    if (this.comboCount >= this.maxCombo) {
      applyKnockback(150);
      this.comboCount = 0;  // Reset for next combo
    }

    this.lastHitTime = gameTime;
    return damage;
  }

  // Visual feedback: show combo counter above hero
  renderComboIndicator(ctx, screenPos) {
    if (this.comboCount === 0) return;

    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = `rgb(${255 - this.comboCount * 50}, 200, 100)`;
    ctx.fillText(`${this.comboCount}/${this.maxCombo}`, screenPos.x, screenPos.y - 50);
  }
}
```

### Cone/Spread Attacks (Warrior AOE)

```javascript
// Battle Axe, Hammer attacks hit enemies in cone
class ConeAttack {
  constructor(hero, weapon) {
    this.hero = hero;
    this.weapon = weapon;
    this.coneAngle = 90;  // Degrees of cone
    this.coneRange = 150;  // Pixels from hero
  }

  executeAttack(direction) {
    const originPos = this.hero.position;
    const angleStart = direction - (this.coneAngle / 2);
    const angleEnd = direction + (this.coneAngle / 2);

    // Find all enemies in cone
    const enemiesInCone = [];
    for (const enemy of this.hero.enemies) {
      const toEnemy = subtract(enemy.position, originPos);
      const distance = magnitude(toEnemy);

      if (distance > this.coneRange) continue;

      const angleToEnemy = Math.atan2(toEnemy.y, toEnemy.x);
      if (angleToEnemy >= angleStart && angleToEnemy <= angleEnd) {
        enemiesInCone.push(enemy);
      }
    }

    // Damage all enemies (slight reduction for multi-hit)
    const damageMultiplier = enemiesInCone.length > 1 ? 0.85 : 1.0;

    for (const enemy of enemiesInCone) {
      const damage = calculateWeaponDamage(this.hero, this.weapon) * damageMultiplier;
      enemy.takeDamage(damage);
    }

    // Visual feedback: cone indicator
    drawConeIndicator(originPos, direction, this.coneAngle, this.coneRange);

    return enemiesInCone.length;
  }
}
```

---

## 5. WEAPON-ABILITY SYNERGIES

### Ability Enhancement Hooks

```javascript
// Heroes can enhance weapon attacks with abilities
class WeaponAbilitySynergy {
  // When Q ability is used, enhance next weapon attack
  onQAbilityUsed(hero) {
    hero.nextWeaponAttackEnhanced = true;
    hero.enhancedDamageMultiplier = 1.4;  // +40% damage
    hero.enhancementDuration = 3.0;  // Seconds
  }

  // When E ability is used, apply its element to weapon
  onEAbilityUsed(hero, elementType) {
    hero.weaponElement = elementType;  // Override weapon element

    // Example: Frost mage applies freeze effect
    if (elementType === 'Frost') {
      hero.nextWeaponAttack.slowAmount = 0.3;  // 30% slow
    }
  }

  // When R ultimate is used, weapon transforms
  onRUltimateUsed(hero) {
    const ultimateWeapon = hero.getUltimateWeaponForm();
    hero.primaryWeapon = ultimateWeapon;
    hero.primaryWeapon.scale = 1.5;  // Visually larger
    hero.primaryWeapon.damageMultiplier = 2.0;  // +100% damage

    // Lasts duration of ultimate ability
    setTimeout(() => {
      hero.primaryWeapon = hero.baseWeapon;
      hero.primaryWeapon.scale = 1.0;
      hero.primaryWeapon.damageMultiplier = 1.0;
    }, hero.getRUltimateRemaining() * 1000);
  }

  // Passive ability increases weapon attack speed
  onPassiveEffect(hero, effectType) {
    if (effectType === 'attackSpeedBuff') {
      hero.stats.attackSpeed *= 1.15;  // +15% AS
    }
  }
}

// In pvp-hero-instance.js attack() method:
attack(direction) {
  if (!this.canAttack()) return;

  const weapon = this.currentWeapon;
  let damage = calculateWeaponDamage(this, weapon);

  // Apply enhancement if active
  if (this.nextWeaponAttackEnhanced) {
    damage *= this.enhancedDamageMultiplier;
    this.nextWeaponAttackEnhanced = false;
  }

  // Apply elemental effect if overridden
  if (this.weaponElement) {
    weapon.element = this.weaponElement;
  }

  // Deal damage to hit enemies
  const hitEnemies = this.raycastWeaponAttack(direction, damage);

  // Start attack cooldown
  this.primaryWeaponCooldown = this.getAttackCooldown();
}
```

---

## 6. TEAM WEAPON SYNERGIES

### Role-Based Team Bonuses

```javascript
// Different weapon roles grant team buffs
class TeamWeaponSynergy {
  // When warrior attacks nearby allies, grant armor buff
  applyWarriorSynergy(warrior, allyTeam) {
    for (const ally of allyTeam) {
      const distance = distanceTo(warrior, ally);
      if (distance < 200) {  // Aura range
        ally.armorBuff = 10;  // +10 armor nearby allies
      }
    }
  }

  // When ranger attacks, grant nearby allies vision buff
  applyRangerSynergy(ranger, allyTeam) {
    for (const ally of allyTeam) {
      const distance = distanceTo(ranger, ally);
      if (distance < 200) {
        ally.visionRange *= 1.15;  // +15% vision
      }
    }
  }

  // When mage attacks, grant nearby allies ability power
  applyMageSynergy(mage, allyTeam) {
    for (const ally of allyTeam) {
      const distance = distanceTo(mage, ally);
      if (distance < 150) {
        ally.abilityPowerBuff = 15;  // +15 AP
      }
    }
  }

  // When support attacks, grant nearby allies shield
  applyGuardianSynergy(guardian, allyTeam) {
    for (const ally of allyTeam) {
      const distance = distanceTo(guardian, ally);
      if (distance < 200) {
        ally.shieldGain = Math.max(0, 50 - guardian.recentDamageDealt);
      }
    }
  }

  // When rogue attacks, mark enemy for increased damage
  applyRogueSynergy(rogue, enemy) {
    const distance = distanceTo(rogue, enemy);
    if (distance < 300) {
      enemy.vulnerabilityMark = true;  // +10% damage taken

      // Nearby allies deal bonus damage to marked enemies
      for (const allyAttack of alliedAttacks) {
        if (allyAttack.target === enemy) {
          allyAttack.damage *= 1.1;
        }
      }
    }
  }
}
```

---

## 7. WEAPON PROGRESSION (Optional Level Scaling)

### Hero Level Unlocks Weapon Forms

```javascript
// As hero levels up, weapons can enhance
class WeaponProgression {
  unlockWeaponEnhancements(hero, newLevel) {
    switch (newLevel) {
      case 6:
        // Level 6: Weapon gains first enhancement
        hero.primaryWeapon.damage *= 1.15;  // +15% damage
        hero.primaryWeapon.name += ' Enhanced';
        spawnLevelUpEffect(hero.position);
        break;

      case 12:
        // Level 12: Secondary effect unlocks
        hero.primaryWeapon.specialEffect = 'critical_boost';
        hero.primaryWeapon.critChance = 0.15;  // +15% crit
        break;

      case 18:
        // Level 18: Ultimate weapon form (only at max level)
        hero.primaryWeapon = hero.getUltimateWeaponForm();
        hero.primaryWeapon.damage *= 1.5;
        hero.primaryWeapon.attackSpeed *= 1.2;
        spawnUltimateUnlockEffect(hero.position);
        break;
    }
  }

  getUltimateWeaponForm(hero) {
    // Each hero has unique ultimate weapon
    const ultimateWeapons = {
      'Blade': {
        name: 'Legendary Greatsword',
        baseDamage: 2.0,
        attackSpeed: 0.9,
        special: 'cleave',  // Hits all enemies in line
        element: 'Slashing'
      },
      // ... more heroes
    };

    return ultimateWeapons[hero.name];
  }
}
```

---

## 8. WEAPON DATABASE STRUCTURE

### Complete Weapon Catalog

```javascript
const completeWeaponDatabase = {
  // WARRIOR WEAPONS
  'greatsword_heavy': {
    role: 'Warrior',
    type: 'Melee',
    rarity: 'Common',
    name: 'Greatsword',
    element: 'Slashing',
    baseDamage: 1.0,
    attackSpeed: 0.8,
    baseRange: 100,
    projectile: false,
    aoe: false,
    special: 'charge',
    maxChargeTime: 1.5,
    chargeMaxDamage: 2.0,
    description: 'Heavy blade for warriors - High damage, slow attack, can charge'
  },
  'battleaxe_cleave': {
    role: 'Warrior',
    type: 'Melee',
    rarity: 'Uncommon',
    name: 'Battle Axe',
    element: 'Crushing',
    baseDamage: 0.9,
    attackSpeed: 0.85,
    baseRange: 120,
    projectile: false,
    aoe: true,
    aoeRadius: 150,
    coneAngle: 90,
    description: 'Cone attack - Hits all enemies in arc, chance to stun'
  },

  // RANGER WEAPONS
  'bow_ranger': {
    role: 'Ranger',
    type: 'Ranged',
    rarity: 'Common',
    name: 'Bow',
    element: 'Piercing',
    baseDamage: 0.85,
    attackSpeed: 1.0,
    baseRange: 400,
    projectile: true,
    projectileSpeed: 500,
    arrowTrail: true,
    special: 'none',
    description: 'Ranged precision weapon - Medium damage, long range'
  },
  'crossbow_heavy': {
    role: 'Ranger',
    type: 'Ranged',
    rarity: 'Uncommon',
    name: 'Crossbow',
    element: 'Piercing',
    baseDamage: 1.1,
    attackSpeed: 0.7,
    baseRange: 450,
    projectile: true,
    projectileSpeed: 700,
    special: 'armor_pen',  // +20% armor penetration
    description: 'Heavy crossbow - High damage, slower reload, penetrates armor'
  },

  // MAGE WEAPONS
  'staff_fire': {
    role: 'Mage',
    type: 'Magic',
    rarity: 'Common',
    name: 'Fire Staff',
    element: 'Fire',
    baseDamage: 0.6,
    apScaling: 0.8,
    attackSpeed: 1.2,
    baseRange: 350,
    projectile: true,
    projectileSpeed: 600,
    aoe: true,
    aoeRadius: 100,
    special: 'burn_effect',
    burnDamagePerSec: 0.2,
    description: 'Fire magic - Fast attacks, applies burn DoT'
  },
  'staff_frost': {
    role: 'Mage',
    type: 'Magic',
    rarity: 'Common',
    name: 'Frost Staff',
    element: 'Frost',
    baseDamage: 0.55,
    apScaling: 0.75,
    attackSpeed: 1.15,
    baseRange: 350,
    projectile: true,
    projectileSpeed: 550,
    special: 'slow_effect',
    slowAmount: 0.3,
    description: 'Frost magic - Slows enemies on hit'
  },

  // GUARDIAN WEAPONS
  'shield_holy': {
    role: 'Guardian',
    type: 'Melee',
    rarity: 'Common',
    name: 'Holy Shield',
    element: 'Crushing',
    baseDamage: 0.5,
    apScaling: 0.5,
    attackSpeed: 0.9,
    baseRange: 80,
    projectile: false,
    special: 'shield_ally',
    shieldAmount: 50,
    description: 'Support weapon - Low damage, shields allies on attack'
  },

  // ROGUE WEAPONS
  'dagger_combo': {
    role: 'Rogue',
    type: 'Melee',
    rarity: 'Common',
    name: 'Dagger',
    element: 'Piercing',
    baseDamage: 0.65,
    attackSpeed: 1.3,
    baseRange: 70,
    projectile: false,
    aoe: false,
    special: 'combo_attack',
    comboHits: 3,
    comboMaxDamage: 1.0,
    description: '3-hit combo weapon - Fast attacks, high burst on combo'
  },
  'poisondagger': {
    role: 'Rogue',
    type: 'Melee',
    rarity: 'Uncommon',
    name: 'Poison Dagger',
    element: 'Poison',
    baseDamage: 0.6,
    attackSpeed: 1.4,
    baseRange: 75,
    projectile: false,
    special: 'poison_effect',
    poisonDamagePerSec: 0.25,
    armorReduction: 0.15,  // Reduces enemy armor by 15%
    description: 'Assassin weapon - Fast attacks, applies poison DoT'
  }
};
```

---

## 9. IMPLEMENTATION CHECKLIST

### Phase 1: Core System (Week 1-2)
- [ ] Add weapon data structure to hero-system.js
- [ ] Create calculateWeaponDamage() function
- [ ] Implement attack speed + cooldown system
- [ ] Add basic melee + ranged attack types
- [ ] Connect to existing pvp-hero-instance.js attack()
- [ ] Create visual impact effects (screen shake, particles)
- [ ] Test damage scaling with hero stats

### Phase 2: Special Mechanics (Week 3-4)
- [ ] Implement charging system for heavy weapons
- [ ] Create combo attack system for rogues
- [ ] Add cone/AoE attacks for warriors
- [ ] Implement weapon switching mechanics
- [ ] Add status effect application (bleed, burn, slow)
- [ ] Balance damage between weapon types

### Phase 3: Synergies & Progression (Week 5-6)
- [ ] Create ability-weapon enhancement hooks
- [ ] Implement team synergy bonuses
- [ ] Add level-based weapon unlocks
- [ ] Test ultimate weapon forms
- [ ] Balance crit system if added

### Phase 4: Polish (Week 7-8)
- [ ] Add sound effects for weapon impacts
- [ ] Create visual feedback for charge/combo
- [ ] Implement weapon swap animations
- [ ] Test element type interactions
- [ ] Balance pass on damage values

---

## 10. QUICK REFERENCE: WEAPON BY ROLE

| Role | Primary | Secondary | Element | Special |
|------|---------|-----------|---------|---------|
| **Warrior** | Greatsword | Battle Axe | Slash/Crush | Charge / Cone |
| **Ranger** | Bow | Crossbow | Piercing | Projectile / ArmorPen |
| **Mage** | Fire Staff | Frost Staff | Fire/Frost | AoE / Slow |
| **Guardian** | Holy Shield | Mace | Crush | Shield / Support |
| **Rogue** | Dagger | Poison Dagger | Pierce/Poison | Combo / DoT |

---

## 11. ELEMENT EFFECTIVENESS CHART

```
Slashing (Warriors)
├─ Effective vs: Unarmored enemies
├─ Weak vs: Heavy armor
└─ Effect: Bleed (damage over time)

Piercing (Rangers)
├─ Effective vs: Armor (20% penetration)
├─ Weak vs: Magic resistance
└─ Effect: None

Crushing (Warriors/Guardians)
├─ Effective vs: Unarmored
├─ Weak vs: None
└─ Effect: Stun (30% chance)

Arcane (Mages)
├─ Effective vs: Magic resistance
├─ Weak vs: None
└─ Effect: None (pure damage)

Fire (Mages)
├─ Effective vs: Nature-based
├─ Weak vs: Frost
└─ Effect: Burn (DoT + reduced healing)

Frost (Mages)
├─ Effective vs: None
├─ Weak vs: Fire
└─ Effect: Slow (movement speed -30%)

Poison (Rogues)
├─ Effective vs: None
├─ Weak vs: None
└─ Effect: Poison (DoT + armor shred)

Lightning (Mages)
├─ Effective vs: Water
├─ Weak vs: None
└─ Effect: Chain (bounces to nearby)
```

---

## Quick Tips for Implementation

1. **Start Simple**: Get basic melee attacks working before adding special mechanics
2. **Visual Clarity**: Always show weapon impact effects (particles, screen shake, numbers)
3. **Balance Pass**: Playtest frequently - weapon balance breaks easily
4. **Scaling Test**: Ensure damage scales properly with hero stats (AD/AP)
5. **Status Effects**: Keep track of active effects per hero instance
6. **Sound Design**: Add weapon SFX early (makes combat feel satisfying)
7. **Animation Frames**: Weapon attacks need attack animations in future iterations
8. **Documentation**: Keep weapon database organized and well-commented
9. **Testing Tools**: Create debug UI to visualize attack ranges, damage numbers, cooldowns
10. **Community Feedback**: Balance weapons based on hero winrate data

---

## Files to Modify/Create

**New Files:**
- `/home/user/Blue-teams-app/pvp-weapon-system.js` - Main weapon mechanics
- `/home/user/Blue-teams-app/pvp-weapon-database.js` - Weapon data
- `/home/user/Blue-teams-app/pvp-element-system.js` - Element type interactions

**Modify Existing:**
- `hero-system.js` - Add weapon assignments to heroes
- `pvp-hero-instance.js` - Integrate attack() with weapon system
- `pvp-ability-mechanics.js` - Add synergy hooks
- `pvp-vfx-system.js` - Add weapon impact effects

This weapon system design should give NEXUS the depth of competitive games while maintaining the fast-paced MOBA gameplay loop.
