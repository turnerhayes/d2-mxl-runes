export class ParseError extends Error {
}

export enum CharacterClass {
    Amazon = "Amazon",
    Assassin = "Assassin",
    Barbarian = "Barbarian",
    Druid = "Druid",
    Necromancer = "Necromancer",
    Sorceress = "Sorceress",
}

export const AllCharacterClasses: CharacterClass[] = [
    CharacterClass.Amazon,
    CharacterClass.Assassin,
    CharacterClass.Barbarian,
    CharacterClass.Druid,
    CharacterClass.Necromancer,
    CharacterClass.Sorceress,
];

export enum DamageElement {
    Cold = "Cold",
    Lightning = "Lightning",
    Fire = "Fire",
    Poison = "Poison",
    Magic = "Magic",
    PhysicalMagic = "Physical/Magic",
}

export type DamageElementWithoutPhysical = DamageElement.Cold | DamageElement.Lightning | DamageElement.Fire | DamageElement.Poison | DamageElement.Magic;

export enum Stat {
    Strength = "Strength",
    Dexterity = "Dexterity",
    Vitality = "Vitality",
    Energy = "Energy",
}

export enum EffectType {
    Plaintext = "Plaintext",
    SkillLevel = "SkillLevel",
    CastSpeed = "CastSpeed",
    AttackSpeed = "AttackSpeed",
    ChanceToCast = "ChanceToCast",
    EnhancedDamage = "EnhancedDamage",
    EnhancedDefense = "EnhancedDefense",
    FlatMaxDamage = "FlatMaxDamage",
    FlatDamage = "FlatDamage",
    FlatMagicDamageRange = "FlatMagicDamageRange",
    FlatDamageRange = "FlatDamageRange",
    FlatManaBonus = "FlatManaBonus",
    AttackRatingPerCharacterLevel = "AttackRatingPerCharacterLevel",
    MaxDamagePerCharacterLevel = "MaxDamagePerCharacterLevel",
    RegenerateLifePerCharacterLevel = "RegenerateLifePerCharacterLevel",
    WeaponPhysicalDamagePerCharacterLevel = "WeaponPhysicalDamagePerCharacterLevel",
    SpellDamagePerCharacterLevel = "SpellDamagePerCharacterLevel",
    CrushingBlowPerCharacterLevel = "CrushingBlowPerCharacterLevel",
    EnhancedDefensePerCharacterLevel = "EnhancedDefensePerCharacterLevel",
    LifePerCharacterLevel = "LifePerCharacterLevel",
    BonusBloodlustDamage = "BonusBloodlustDamage",
    BonusBloodlustElementalDamage = "BonusBloodlustElementalDamage",
    SlowTarget = "SlowTarget",
    SlowsAttacker = "SlowsAttacker",
    RegenerateMana = "RegenerateMana",
    ResistBonus = "ResistBonus",
    MaxResistBonus = "MaxResistBonus",
    PhysicalDamageReduction = "PhysicalDamageReduction",
    ElementalMagicDamageReduction = "ElementalMagicDamageReduction",
    ManaOnStriking = "ManaOnStriking",
    ManaWhenStruck = "ManaWhenStruck",
    ManaOnMeleeAttack = "ManaOnMeleeAttack",
    ReanimateChance = "ReanimateChance",
    BlockSpeedBonus = "BlockSpeedBonus",
    HitRecoveryBonus = "HitRecoveryBonus",
    ElementalDamageBonus = "ElementalDamageBonus",
    SpellDamageBonus = "SpellDamageBonus",
    ElementalPierceBonus = "ElementalPierceBonus",
    MaxLifeBonus = "MaxLifeBonus",
    MaxManaBonus = "MaxManaBonus",
    RequirementsBonus = "RequirementsBonus",
    AttackRatingBonus = "AttackRatingBonus",
    StatBonus = "StatBonus",
    GoldFindBonus = "GoldFindBonus",
    MagicFindBonus = "MagicFindBonus",
    LightRadiusBonus = "LightRadiusBonus",
    MovementSpeedBonus = "MovementSpeedBonus",
    ElementalAbsorbBonus = "ElementalAbsorbBonus",
    PoisonSkillDurationBonus = "PoisonSkillDurationBonus",
    SkillBonus = "SkillBonus",
    LifeAfterKill = "LifeAfterKill",
    LifeOnStriking = "LifeOnStriking",
    LifeOnMeleeAttack = "LifeOnMeleeAttack",
    ManaAfterKill = "ManaAfterKill",
    CrushingBlowChanceBonus = "CrushingBlowChanceBonus",
    DeadlyStrikeBonus = "DeadlyStrikeBonus",
    DamageToMana = "DamageToMana",
    PhysicalResist = "PhysicalResist",
    AttackerElementalDamage = "AttackerElementalDamage",
    LifeStealPerHit = "LifeStealPerHit",
    ManaStealPerHit = "ManaStealPerHit",
    IdolOfScosglenCooldownBonus = "IdolOfScosglenCooldownBonus",
    MarkOfTheWildBonusDamage = "MarkOfTheWildBonusDamage",
    MarkOfTheWildBonusElementalDamage = "MarkOfTheWildBonusElementalDamage",
    CombatSpeeds = "CombatSpeeds",
    MinionLifeBonus = "MinionLifeBonus",
    MinionDamageBonus = "MinionDamageBonus",
    MinionResistanceBonus = "MinionResistanceBonus",
    MinionAttackRatingBonus = "MinionAttackRatingBonus",
    MaxBlockChance = "MaxBlockChance",
    ExperienceBonus = "ExperienceBonus",
    StunAttack = "StunAttack",
    CannotBeFrozen = "CannotBeFrozen",
    SpellFocus = "SpellFocus",
    DefenseVsMissile = "DefenseVsMissile",
    MaxLifeAndManaBonus = "MaxLifeAndManaBonus",
    DefenseBonus = "DefenseBonus",
    LifeRegenPerSecond = "LifeRegenPerSecond",
    LifeWhenStruck = "LifeWhenStruck",
    PoisonLengthReduction = "PoisonLengthReduction",
    AttackerFlees = "AttackerFlees",
    AvoidDamage = "AvoidDamage",
    AllAttributesBonus = "AllAttributesBonus",
    VendorDiscount = "VendorDiscount",
    BaseBlockChance = "BaseBlockChance",
    WeaponPhysicalDamage = "WeaponPhysicalDamage",
    InnateElementalDamage = "InnateElementalDamage",
    SkillCharges = "SkillCharges",
    FlatElementalDamage = "FlatElementalDamage",
    ZeroTotalDefense = "ZeroTotalDefense",
    DamageToUndead = "DamageToUndead",
    IgnoreTargetDefense = "IgnoreTargetDefense",
    ReducedCooldown = "ReducedCooldown",
    HitCausesFlee = "HitCausesFlee",
    AdditionalDexterityBonus = "AdditionalDexterityBonus",
    HitBlindsTarget = "HitBlindsTarget",
    Special = "Special",
};

export enum TriggerCondition {
    OnKill = "on Kill",
    OnStriking = "on Striking",
    OnMeleeAttack = "on Melee Attack",
    OnDeathBlow = "on Death Blow",
    WhenStruck = "when Struck",
    WhenBlocking = "when Blocking",
}

export type Range = [number, number];

export type RangeOfRanges = [number|Range, number|Range];

export enum Unit {
    Percentage = "Percentage",
    Flat = "Flat",
}

export interface ItemType {
    type: string;
    exceptions?: string[];
}

export interface Effect<T extends EffectType> {
    type: T;
    characterClassLimit?: CharacterClass;
}

export interface RangeEffect<T extends EffectType> extends Effect<T> {
    range: Range;
}

export interface RangeOfRangesEffect<T extends EffectType> extends Effect<T> {
    range: RangeOfRanges;
}

export type ScalarOrRangeEffect<T extends EffectType> = Effect<T> & (
    {
        scalar: number;
        range?: never;
    } | {
        scalar?: never;
        range: Range;
    }
);

export type CharacterLevelEffect<T extends EffectType> = Effect<T> & {
    amountPerCharacterLevel: number|Range;
    unit: Unit;
};

export interface PlaintextEffect extends Effect<EffectType.Plaintext> {
    effectText: string;
}

export type SkillLevelEffect = ScalarOrRangeEffect<EffectType.SkillLevel> & {
    characterClass: CharacterClass|null;
};

export type CastSpeedEffect = ScalarOrRangeEffect<EffectType.CastSpeed>;

export type AttackSpeedEffect = ScalarOrRangeEffect<EffectType.AttackSpeed>;

export interface ChanceToCastEffect extends Effect<EffectType.ChanceToCast> {
    chancePercent: number;
    skill: string;
    skillLevel: number;
    trigger: TriggerCondition;
}

export type EnhancedDamageEffect = ScalarOrRangeEffect<EffectType.EnhancedDamage>;

export type EnhancedDefenseEffect = ScalarOrRangeEffect<EffectType.EnhancedDefense>;

export type FlatMaxDamageEffect = ScalarOrRangeEffect<EffectType.FlatMaxDamage>;

export type AttackRatingPerCharacterLevelEffect = CharacterLevelEffect<EffectType.AttackRatingPerCharacterLevel>;

export type MaxDamagePerCharacterLevelEffect = CharacterLevelEffect<EffectType.MaxDamagePerCharacterLevel>;

export type RegenerateLifePerCharacterLevelEffect = CharacterLevelEffect<EffectType.RegenerateLifePerCharacterLevel>;

export type FlatManaBonusEffect = ScalarOrRangeEffect<EffectType.FlatManaBonus>;

export type BonusBloodlustDamageEffect = ScalarOrRangeEffect<EffectType.BonusBloodlustDamage>;

export type BonusBloodlustElementalDamageEffect = ScalarOrRangeEffect<EffectType.BonusBloodlustElementalDamage>;

export type FlatDamageEffect = RangeOfRangesEffect<EffectType.FlatDamage>;

export type FlatDamageRangeEffect = RangeOfRangesEffect<EffectType.FlatDamageRange>;

export type FlatMagicDamageRangeEffect = RangeOfRangesEffect<EffectType.FlatMagicDamageRange>;

export type SlowTargetEffect = ScalarOrRangeEffect<EffectType.SlowTarget>;

export type SlowsAttackerEffect = ScalarOrRangeEffect<EffectType.SlowsAttacker>;

export type RegenerateManaEffect = ScalarOrRangeEffect<EffectType.RegenerateMana>;

export type ResistBonusEffect = ScalarOrRangeEffect<EffectType.ResistBonus> & {
    element: DamageElement|null;
};

export type MaxResistBonusEffect = ScalarOrRangeEffect<EffectType.MaxResistBonus> & {
    element: DamageElement|null;
};

export type PhysicalDamageReductionEffect = ScalarOrRangeEffect<EffectType.PhysicalDamageReduction>;

export type ElementalMagicDamageReductionDamageReductionEffect = ScalarOrRangeEffect<EffectType.ElementalMagicDamageReduction>;

export type ManaOnStrikingEffect = ScalarOrRangeEffect<EffectType.ManaOnStriking>;

export type ManaWhenStruckEffect = ScalarOrRangeEffect<EffectType.ManaWhenStruck>;

export type ManaOnMeleeAttackEffect = ScalarOrRangeEffect<EffectType.ManaOnMeleeAttack>;

export type ReanimateChanceEffect = ScalarOrRangeEffect<EffectType.ReanimateChance> & {
    monster: string|null;
};

export type BlockSpeedBonusEffect = ScalarOrRangeEffect<EffectType.BlockSpeedBonus>;

export type HitRecoveryBonusEffect = ScalarOrRangeEffect<EffectType.HitRecoveryBonus>;

export type ElementalDamageBonusEffect = RangeEffect<EffectType.ElementalDamageBonus> & (
    {
        element: DamageElement.Cold|DamageElement.Fire|DamageElement.Lightning|DamageElement.Magic;
        durationSeconds?: never;
    } &
    {
        element: DamageElement.Poison;
        durationSeconds: number;
    }
);

export type SpellDamageBonusEffect = ScalarOrRangeEffect<EffectType.SpellDamageBonus> & {
    element: DamageElement|null;
};

export type ElementalPierceBonusEffect = ScalarOrRangeEffect<EffectType.ElementalPierceBonus> & {
    element: DamageElement|null;
};

export type MaxLifeBonusEffect = ScalarOrRangeEffect<EffectType.MaxLifeBonus>;

export type MaxManaBonusEffect = ScalarOrRangeEffect<EffectType.MaxManaBonus>;

export type RequirementsBonusEffect = ScalarOrRangeEffect<EffectType.RequirementsBonus>;

export type AttackRatingBonusEffect = ScalarOrRangeEffect<EffectType.AttackRatingBonus>;

export type StatBonusEffect = ScalarOrRangeEffect<EffectType.StatBonus> & {
    stat: Stat;
    unit: Unit;
};

export type GoldFindBonusEffect = ScalarOrRangeEffect<EffectType.GoldFindBonus>;

export type MagicFindBonusEffect = ScalarOrRangeEffect<EffectType.MagicFindBonus>;

export type LightRadiusBonusEffect = ScalarOrRangeEffect<EffectType.LightRadiusBonus>;

export type MovementSpeedBonusEffect = ScalarOrRangeEffect<EffectType.MovementSpeedBonus>;

export type ElementalAbsorbBonusEffect = ScalarOrRangeEffect<EffectType.ElementalAbsorbBonus> & {
    element: DamageElement;
    unit: Unit;
};

export type PoisonSkillDurationBonusEffect = ScalarOrRangeEffect<EffectType.PoisonSkillDurationBonus>;

export type SkillBonusEffect = ScalarOrRangeEffect<EffectType.SkillBonus> & {
    skill: string;
    classRestriction: CharacterClass|null
};

export type LifeAfterKillEffect = ScalarOrRangeEffect<EffectType.LifeAfterKill>;

export type ManaAfterKillEffect = ScalarOrRangeEffect<EffectType.ManaAfterKill>;

export type LifeOnStrikingEffect = ScalarOrRangeEffect<EffectType.LifeOnStriking>;

export type LifeOnMeleeAttackEffect = ScalarOrRangeEffect<EffectType.LifeOnMeleeAttack>;

export type CrushingBlowChanceBonusEffect = ScalarOrRangeEffect<EffectType.CrushingBlowChanceBonus>;

export type DeadlyStrikeBonusEffect = ScalarOrRangeEffect<EffectType.DeadlyStrikeBonus>;

export type DamageToManaEffect = ScalarOrRangeEffect<EffectType.DamageToMana>;

export type PhysicalResistEffect = ScalarOrRangeEffect<EffectType.PhysicalResist>;

export type AttackerElementalDamageEffect = ScalarOrRangeEffect<EffectType.AttackerElementalDamage> & (
    {
        element: DamageElement.Cold|DamageElement.Fire|DamageElement.Lightning|DamageElement.Magic;
        duration?: never;
    } | {
        element: DamageElement.Poison;
        duration: number;
    }
);

export type IdolOfScosglenCooldownBonusEffect = ScalarOrRangeEffect<EffectType.IdolOfScosglenCooldownBonus>;

export type LifeStealPerHitEffect = ScalarOrRangeEffect<EffectType.LifeStealPerHit>;

export type ManaStealPerHitEffect = ScalarOrRangeEffect<EffectType.ManaStealPerHit>;

export type MarkOfTheWildBonusDamageEffect = ScalarOrRangeEffect<EffectType.MarkOfTheWildBonusDamage>;

export type MarkOfTheWildBonusElementalDamageEffect = ScalarOrRangeEffect<EffectType.MarkOfTheWildBonusElementalDamage>;

export type CombatSpeedsEffect = ScalarOrRangeEffect<EffectType.CombatSpeeds>;

export type MaxBlockChanceEffect = ScalarOrRangeEffect<EffectType.MaxBlockChance>;

export interface SpecialEffect extends Effect<EffectType.Special> {
    text: string;
    subEffects?: Effect<EffectType>[];
}

export type WeaponPhysicalDamagePerCharacterLevelEffect = CharacterLevelEffect<EffectType.WeaponPhysicalDamagePerCharacterLevel>;

export type MinionLifeBonusEffect = ScalarOrRangeEffect<EffectType.MinionLifeBonus>;

export type MinionDamageBonusEffect = ScalarOrRangeEffect<EffectType.MinionDamageBonus>;

export type MinionResistanceBonusEffect = ScalarOrRangeEffect<EffectType.MinionResistanceBonus>;

export type MinionAttackRatingBonusEffect = ScalarOrRangeEffect<EffectType.MinionAttackRatingBonus>;

export type ExperienceBonusEffect = ScalarOrRangeEffect<EffectType.ExperienceBonus>;

export type SpellFocusEffect = ScalarOrRangeEffect<EffectType.SpellFocus> & {
    unit: Unit;
};

export type StunAttackEffect = Effect<EffectType.StunAttack>;

export type CannotBeFrozenEffect = Effect<EffectType.CannotBeFrozen>;

export type ZeroTotalDefenseEffect = Effect<EffectType.ZeroTotalDefense>;

export type IgnoreTargetDefenseEffect = Effect<EffectType.IgnoreTargetDefense>;

export type DefenseVsMissileEffect = ScalarOrRangeEffect<EffectType.DefenseVsMissile>;

export type MaxLifeAndManaBonusEffect = ScalarOrRangeEffect<EffectType.MaxLifeAndManaBonus>;

export type SpellDamagePerCharacterLevelEffect = CharacterLevelEffect<EffectType.SpellDamagePerCharacterLevel> & {
    element: DamageElement|null;
};

export type CrushingBlowPerCharacterLevelEffect = CharacterLevelEffect<EffectType.CrushingBlowPerCharacterLevel>;

export type EnhancedDefensePerCharacterLevelEffect = CharacterLevelEffect<EffectType.EnhancedDefensePerCharacterLevel>;

export type LifePerCharacterLevelEffect = CharacterLevelEffect<EffectType.LifePerCharacterLevel>;

export type DefenseBonusEffect = ScalarOrRangeEffect<EffectType.DefenseBonus> & {
    unit: Unit;
};

export type LifeRegenPerSecondEffect = ScalarOrRangeEffect<EffectType.LifeRegenPerSecond>;

export type LifeWhenStruckEffect = ScalarOrRangeEffect<EffectType.LifeWhenStruck>;

export type PoisonLengthReductionEffect = ScalarOrRangeEffect<EffectType.PoisonLengthReduction>;

export type AttackerFleesEffect = ScalarOrRangeEffect<EffectType.AttackerFlees>;

export type AvoidDamageEffect = ScalarOrRangeEffect<EffectType.AvoidDamage>;

export type AllAttributesBonusEffect = ScalarOrRangeEffect<EffectType.AllAttributesBonus> & {
    unit: Unit;
};

export type VendorDiscountEffect = ScalarOrRangeEffect<EffectType.VendorDiscount>;

export type BaseBlockChanceEffect = ScalarOrRangeEffect<EffectType.BaseBlockChance>;

export type WeaponPhysicalDamageEffect = ScalarOrRangeEffect<EffectType.WeaponPhysicalDamage>;

export type InnateElementalDamageEffect = ScalarOrRangeEffect<EffectType.InnateElementalDamage>;

export type DamageToUndeadEffect = ScalarOrRangeEffect<EffectType.DamageToUndead>;

export type HitCausesFleeEffect = ScalarOrRangeEffect<EffectType.HitCausesFlee>;

export type AdditionalDexterityBonusEffect = ScalarOrRangeEffect<EffectType.AdditionalDexterityBonus>;

export type HitBlindsTargetEffect = ScalarOrRangeEffect<EffectType.HitBlindsTarget>;

export type SkillChargesEffect = ScalarOrRangeEffect<EffectType.SkillCharges> & {
    skill: string;
    numCharges: number;
};

export type ReducedCooldownEffect = ScalarOrRangeEffect<EffectType.ReducedCooldown> & {
    skill: string;
    reductionSeconds: Range|number;
};

export type FlatElementalDamageEffect = ScalarOrRangeEffect<EffectType.FlatElementalDamage> & {
    element: DamageElementWithoutPhysical;
};

export interface Runeword {
    name: string;
    flavorText?: string;
    runeword: string;
    itemLevel: number;
    runes: string[];
    itemTypes: ItemType[];
    classRestriction: CharacterClass|null;
    effects: Effect<EffectType>[];
    fullText: string;
}