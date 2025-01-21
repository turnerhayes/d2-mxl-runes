import {
    EffectType,
    ChanceToCastEffect,
    SkillLevelEffect,
    CharacterClass,
    ParseError,
    TriggerCondition,
    Range,
    Unit,
    AttackRatingPerCharacterLevelEffect,
    MaxDamagePerCharacterLevelEffect,
    FlatManaBonusEffect,
    BonusBloodlustDamageEffect,
    FlatDamageRangeEffect,
    ResistBonusEffect,
    DamageElement,
    ReanimateChanceEffect,
    ElementalDamageBonusEffect,
    SpellDamageBonusEffect,
    ElementalPierceBonusEffect,
    StatBonusEffect,
    Stat,
    SkillBonusEffect,
    RegenerateLifePerCharacterLevelEffect,
    RangeOfRanges,
    AttackerElementalDamageEffect,
    DamageElementWithoutPhysical,
    WeaponPhysicalDamagePerCharacterLevelEffect,
    MarkOfTheWildBonusDamageEffect,
    MarkOfTheWildBonusElementalDamageEffect,
    LifeStealPerHitEffect,
    ManaStealPerHitEffect,
    ScalarOrRangeEffect,
    MaxResistBonusEffect,
    SpellDamagePerCharacterLevelEffect,
    SpellFocusEffect,
    AllAttributesBonusEffect,
    DefenseBonusEffect,
    CrushingBlowPerCharacterLevelEffect,
    SkillChargesEffect,
    LifePerCharacterLevelEffect,
    CannotBeFrozenEffect,
    StunAttackEffect,
    FlatElementalDamageEffect,
    BonusBloodlustElementalDamageEffect,
    ZeroTotalDefenseEffect,
    FlatMagicDamageRangeEffect,
    IgnoreTargetDefenseEffect,
    ReducedCooldownEffect,
    EnhancedDefensePerCharacterLevelEffect,
} from "./parser_types.mjs";

export const CHARACTER_CLASSES_REGEX = new RegExp(Object.values(CharacterClass).join("|"));

const ELEMENT_REGEX = new RegExp(Object.values(DamageElement).join("|"));

const STAT_REGEX = new RegExp(Object.values(Stat).join("|"));

const TRIGGER_CONDITION_REGEX = new RegExp(Object.values(TriggerCondition).join("|"));

const NUMBER_REGEX = /(?:\d+(?:\.\d+)?)/;

function getRangeOfRangesRegex(capture = false) {
    if (capture) {
        return new RegExp(`(?:(${
            getScalarOrRangeRegex(false, false).source
        })-(${
            getScalarOrRangeRegex(false, false).source
        }))`);
    }

    return new RegExp(`(?:${
        getScalarOrRangeRegex(false, false).source
    }-${
        getScalarOrRangeRegex(false, false).source
    })`);
}

function getRangeRegex(capture = false) {
    if (capture) {
        return new RegExp(`\\((${NUMBER_REGEX.source}) to (${NUMBER_REGEX.source})\\)`);
    }
    
    return new RegExp(`\\(${NUMBER_REGEX.source} to ${NUMBER_REGEX.source}\\)`);
}

function getScalarOrRangeRegex(capture = false, signed = true) {
    const rangeRegex = new RegExp(`(?:${getRangeRegex(capture).source})`);
    const signRegex = signed ? (
        capture ? /([+-]?)/ : /[+-]?/
    ) : null;
    const parensStart = capture ? "(" : "";
    const parensEnd = capture ? ")" : "";
    const scalarRegex = new RegExp(`${parensStart}${NUMBER_REGEX.source}${parensEnd}`);
    

    const regex = new RegExp(`${signRegex?.source ?? ""}(?:${scalarRegex.source}|${rangeRegex.source})`);
    return regex;
}

function parseScalarOrRangeString(str: string): {
    range?: Range;
    scalar?: number;
} {
    const regex = new RegExp(`([+-]?)${getScalarOrRangeRegex(true, false).source}`);
    const matches = regex.exec(str);

    if (!matches) {
        throw new ParseError(`Unable to parse string as a scalar/range specification: ${str}`);
    }

    const negative = matches[1] === '-';
    const scalarString = matches[2];
    const rangeStartString = matches[3];
    const rangeEndString = matches[4];

    const rangeStart = Number(rangeStartString);
    const rangeEnd = Number(rangeEndString);
    const scalar = Number(scalarString);

    if (scalarString) {
        if (Number.isNaN(scalar)) {
            throw new ParseError(`Scalar ${scalarString} not a number`);
        }
    }
    else {
        if (Number.isNaN(rangeStart)) {
            throw new ParseError(`Range start ${rangeStartString} not a number`);
        }
        if (Number.isNaN(rangeEnd)) {
            throw new ParseError(`Range end ${rangeEndString} not a number`);
        }
    }

    return {
        range: scalarString ? undefined : (
            negative ?
                [-1 * rangeEnd, -1 * rangeStart] :
                [rangeStart, rangeEnd]
        ),
        scalar: scalarString ? (
            negative ? -1 * scalar : scalar
        ) : undefined,
    };
}

function parseRangeOfRangesString(str: string): RangeOfRanges {
    const regex = getRangeOfRangesRegex(true);

    const matches = regex.exec(str);

    if (!matches) {
        throw new ParseError(`Unable to parse ${str} as a range of ranges`);
    }

    const rangeStartString = matches[1];
    const rangeEndString = matches[2];

    const {range: rangeStartRange, scalar: rangeStartScalar} = parseScalarOrRangeString(rangeStartString);
    const {range: rangeEndRange, scalar: rangeEndScalar} = parseScalarOrRangeString(rangeEndString);

    return [(rangeStartRange ?? rangeStartScalar)!, (rangeEndRange ?? rangeEndScalar)!];
}

function parseScalarOrRangeEffect(line: string, regex: RegExp, type: EffectType): ScalarOrRangeEffect<typeof type>|null {
    const matches = regex.exec(line);

    if (!matches) {
        return null;
    }

    const {scalar, range} = parseScalarOrRangeString(matches[1]);

    if (range) {
        return {
            type,
            range,
        };
    }

    return {
        type,
        scalar: scalar!,
    };
}

function parseSkillLevelBonus(line: string): SkillLevelEffect|null {
    const skillLevelRegex = new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        }) to (?:(?:(${
            CHARACTER_CLASSES_REGEX.source
        }) Skill Levels)|(All Skills))$`
    );
    const matches = skillLevelRegex.exec(line);
    
    if (!matches) {
        return null;
    }

    const magnitudeString = matches[1];
    const characterClass = (matches[2] as CharacterClass) || null;
    const {range, scalar} = parseScalarOrRangeString(magnitudeString);

    if (range) {
        return {
            type: EffectType.SkillLevel,
            characterClass,
            range,
        };
    }

    return {
        type: EffectType.SkillLevel,
        characterClass,
        scalar: scalar!,
    };
}

function parseSkillBonus(line: string): SkillBonusEffect|null {
    const skillLevelRegex = new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        }) to ([\\w\\s-]+\\w)(?: \\((${CHARACTER_CLASSES_REGEX.source}) Only\\))?$`
    );
    const matches = skillLevelRegex.exec(line);

    if (!matches) {
        return null;
    }

    const magnitudeString = matches[1];
    const {range, scalar} = parseScalarOrRangeString(magnitudeString);
    const skill = matches[2];
    const classRestriction = matches[3] ? matches[3] as CharacterClass : null;

    if (range) {
        return {
            type: EffectType.SkillBonus,
            skill,
            range,
            classRestriction,
        };
    }

    return {
        type: EffectType.SkillBonus,
        skill,
        scalar: scalar!,
        classRestriction,
    };
}

const parseCastSpeedBonus = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(`^(${getScalarOrRangeRegex(false, false).source})% Cast Speed$`),
    EffectType.CastSpeed
);

const parseAttackSpeedBonus = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(`^(${getScalarOrRangeRegex(false, false).source})% Attack Speed$`),
    EffectType.AttackSpeed,
);

function parseChanceToCast(line: string): ChanceToCastEffect|null {
    const regex = new RegExp(`^(\\d+)% Chance to cast level (\\d+) ([\\w\\s-]+) (${
        TRIGGER_CONDITION_REGEX.source
    })$`);

    const matches = regex.exec(line);

    if (!matches) {
        return null;
    }

    const chanceString = matches[1];
    const skillLevelString = matches[2];
    const skill = matches[3];
    const trigger = matches[4] as TriggerCondition;

    const chancePercent = Number(chanceString);

    if (Number.isNaN(chancePercent)) {
        throw new ParseError(`Unable to parse chance percentage ${chanceString} as a number`);
    }
    
    const skillLevel = Number(skillLevelString);
    
    if (Number.isNaN(skillLevel)) {
        throw new ParseError(`Unable to skill level ${skillLevelString} as a number`);
    }

    return {
        type: EffectType.ChanceToCast,
        chancePercent,
        skill,
        skillLevel,
        trigger,
    };
}

const parseEnhancedDamage = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        })% Enhanced Damage$`
    ),
    EffectType.EnhancedDamage
);

const parseEnhancedDefense = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        })% Enhanced Defense$`
    ),
    EffectType.EnhancedDefense
);

const parseFlatMaxDamage = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        }) to Maximum Damage$`
    ),
    EffectType.FlatMaxDamage,
);

const parseFlatDamage = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        }) Damage$`
    ),
    EffectType.FlatDamage,
);

function parseFlatDamageRange(line: string): FlatDamageRangeEffect|null {
    const flatDamageRegex = new RegExp(`^Adds (${
        getRangeOfRangesRegex().source
    }) Damage$`);

    const matches = flatDamageRegex.exec(line);

    if (!matches) {
        return null;
    }

    const range = parseRangeOfRangesString(matches[1]);

    return {
        type: EffectType.FlatDamageRange,
        range,
    };
}

function parseFlatMagicDamageRange(line: string): FlatMagicDamageRangeEffect|null {
    const regex = new RegExp(`^Adds (${
        getRangeOfRangesRegex().source
    }) Magic Damage$`);

    const matches = regex.exec(line);

    if (!matches) {
        return null;
    }

    const range = parseRangeOfRangesString(matches[1]);

    return {
        type: EffectType.FlatMagicDamageRange,
        range,
    };
}

function parseFlatManaBonus(line: string): FlatManaBonusEffect|null {
    const flatMaxDamageRegex = new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        }) to Mana$`
    );
    const matches = flatMaxDamageRegex.exec(line);
    
    if (!matches) {
        return null;
    }

    const magnitudeString = matches[1];
    const {range, scalar} = parseScalarOrRangeString(magnitudeString);

    if (range) {
        return {
            type: EffectType.FlatManaBonus,
            range,
        };
    }

    return {
        type: EffectType.FlatManaBonus,
        scalar: scalar!,
    };
}

function parseAttackRatingPerCharacterLevel(line: string): AttackRatingPerCharacterLevelEffect|null {
    const attackRatingRegex = new RegExp(
        `^(${
            getScalarOrRangeRegex(false, false).source
        })% Bonus to Attack Rating \\(Based on Character Level\\)$`
    );
    const matches = attackRatingRegex.exec(line);

    if (!matches) {
        return null;
    }

    const magnitudeString = matches[1];
    const {range, scalar} = parseScalarOrRangeString(magnitudeString);

    return {
        type: EffectType.AttackRatingPerCharacterLevel,
        unit: Unit.Percentage,
        amountPerCharacterLevel: range || scalar!,
    };
}

function parseMaxDamagePerCharacterLevel(line: string): MaxDamagePerCharacterLevelEffect|null {
    const maxDamageRegex = new RegExp(
        `^(${
            getScalarOrRangeRegex(false, true).source
        }) to Maximum Damage \\(Based on Character Level\\)$`
    );
    const matches = maxDamageRegex.exec(line);

    if (!matches) {
        return null;
    }

    const magnitudeString = matches[1];
    const {range, scalar} = parseScalarOrRangeString(magnitudeString);

    return {
        type: EffectType.MaxDamagePerCharacterLevel,
        unit: Unit.Flat,
        amountPerCharacterLevel: range || scalar!,
    };
}

function parseRegenerateLifePerCharacterLevel(line: string): RegenerateLifePerCharacterLevelEffect|null {
    const lifeRegenRegex = new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        }) Life Regenerated per Second \\(Based on Character Level\\)$`
    );
    const matches = lifeRegenRegex.exec(line);

    if (!matches) {
        return null;
    }

    const magnitudeString = matches[1];
    const {range, scalar} = parseScalarOrRangeString(magnitudeString);

    return {
        type: EffectType.RegenerateLifePerCharacterLevel,
        unit: Unit.Flat,
        amountPerCharacterLevel: range || scalar!,
    };
}

function parseSpellDamagePerCharacterLevel(line: string): SpellDamagePerCharacterLevelEffect|null {
    const regex = new RegExp(
        `^(${
            getScalarOrRangeRegex(false, false).source
        })% to (?:(${ELEMENT_REGEX.source}) )?Spell Damage \\(Based on Character Level\\)$`
    );
    const matches = regex.exec(line);

    if (!matches) {
        return null;
    }

    const magnitudeString = matches[1];
    const {range, scalar} = parseScalarOrRangeString(magnitudeString);
    const element = matches[2] ? matches[2] as DamageElement : null;

    return {
        type: EffectType.SpellDamagePerCharacterLevel,
        unit: Unit.Percentage,
        amountPerCharacterLevel: range || scalar!,
        element,
    };
}

function parseBonusBloodlustDamage(line: string): BonusBloodlustDamageEffect|BonusBloodlustElementalDamageEffect|null {
    const maxDamageRegex = new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        })% Bonus( Elemental)? Damage to Bloodlust$`
    );
    const matches = maxDamageRegex.exec(line);

    if (!matches) {
        return null;
    }

    const magnitudeString = matches[1];
    const {range, scalar} = parseScalarOrRangeString(magnitudeString);
    const type = matches[2] ? EffectType.BonusBloodlustElementalDamage : EffectType.BonusBloodlustDamage;

    if (range) {
        return {
            type,
            range,
        };
    }

    return {
        type,
        scalar: scalar!,
    };
}

const parseSlowTarget = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^Slow Target (${
            getScalarOrRangeRegex(false, false).source
        })%$`
    ),
    EffectType.SlowTarget
);

const parseSlowsAttacker = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^Slows Attacker by (${
            getScalarOrRangeRegex(false, false).source
        })%$`
    ),
    EffectType.SlowsAttacker
);

const parseRegenerateMana = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^Regenerate Mana (${
            getScalarOrRangeRegex().source
        })%$`
    ),
    EffectType.RegenerateMana
);

function parseResistBonus(line: string): ResistBonusEffect|null {
    const resistBonusRegex = new RegExp(
        `^(?:(${ELEMENT_REGEX.source}) Resist (${
            getScalarOrRangeRegex().source
        })%)|(?:Elemental Resists (${
            getScalarOrRangeRegex().source
        })%)$`
    );
    const matches = resistBonusRegex.exec(line);

    if (!matches) {
        return null;
    }

    const magnitudeString = matches[2];
    const resistAllString = matches[3];
    let range: Range|undefined;
    let scalar: number|undefined;
    if (magnitudeString) {
        const {
            range: elementRange,
            scalar: elementScalar
        } = parseScalarOrRangeString(magnitudeString);
        range = elementRange;
        scalar = elementScalar;
    }
    else if (resistAllString) {
        const {
            range: resistAllRange,
            scalar: resistAllScalar,
        } = parseScalarOrRangeString(resistAllString);
        range = resistAllRange;
        scalar = resistAllScalar;
    }
    const element = resistAllString ? null : matches[1] as DamageElement;

    if (range) {
        return {
            type: EffectType.ResistBonus,
            element,
            range,
        };
    }

    return {
        type: EffectType.ResistBonus,
        element,
        scalar: scalar!,
    };
}

function parseMaxResistBonus(line: string): MaxResistBonusEffect|null {
    const resistBonusRegex = new RegExp(
        `^Maximum ((?:${ELEMENT_REGEX.source})|Elemental) Resists? (${
            getScalarOrRangeRegex().source
        })%$`
    );
    const matches = resistBonusRegex.exec(line);

    if (!matches) {
        return null;
    }

    const elementString = matches[1];
    const magnitudeString = matches[2];
    const {
        range,
        scalar
    } = parseScalarOrRangeString(magnitudeString);
    const element = elementString === "Elemental" ? null : elementString as DamageElement;
    const type = EffectType.MaxResistBonus;

    if (range) {
        return {
            type,
            element,
            range,
        };
    }

    return {
        type,
        element,
        scalar: scalar!,
    };
}

const parsePhysicalDamageReduction = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^Physical Damage Reduced by (${
            getScalarOrRangeRegex(false, false).source
        })$`
    ),
    EffectType.PhysicalDamageReduction
);

const parseElementalMagicDamageReduction = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^Elemental/Magic Damage Reduced by (${
            getScalarOrRangeRegex(false, false).source
        })$`
    ),
    EffectType.ElementalMagicDamageReduction
);

const parseManaOnStriking = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        }) Mana on Striking$`
    ),
    EffectType.ManaOnStriking
);

const parseManaWhenStruck = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        }) Mana when Struck by an Enemy$`
    ),
    EffectType.ManaWhenStruck
);

const parseManaOnMeleeAttack = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        }) Mana on Melee Attack$`
    ),
    EffectType.ManaOnMeleeAttack
);

function parseReanimateChance(line: string): ReanimateChanceEffect|null {
    const reanimateChanceRegex = new RegExp(
        `^(${
            getScalarOrRangeRegex(false, false).source
        })% Reanimate as: (?:([\w\s-]+[\w])|(Random Monster))$`
    );
    const matches = reanimateChanceRegex.exec(line);

    if (!matches) {
        return null;
    }

    const magnitudeString = matches[1];
    const {range, scalar} = parseScalarOrRangeString(magnitudeString);
    const monster = matches[2];
    const randomMonster = Boolean(matches[3]);

    if (range) {
        return {
            type: EffectType.ReanimateChance,
            monster: randomMonster ? null : monster,
            range,
        };
    }

    return {
        type: EffectType.ReanimateChance,
        monster: randomMonster ? null : monster,
        scalar: scalar!,
    };
}

const parseBlockSpeedBonus = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex(false, false).source
        })% Block Speed$`
    ),
    EffectType.BlockSpeedBonus
);

const parseHitRecoveryBonus = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex(false, false).source
        })% Hit Recovery$`
    ),
    EffectType.HitRecoveryBonus
);

function parseElementalDamageBonus(line: string): ElementalDamageBonusEffect|null {
    const elementalDamageRegex = new RegExp(
        `^Adds (\\d+)-(\\d+) (${ELEMENT_REGEX.source}) Damage(?: over (\\d+) seconds)?$`
    );
    const matches = elementalDamageRegex.exec(line);

    if (!matches) {
        return null;
    }

    const rangeStartString = matches[1];
    const rangeEndString = matches[2];
    const rangeStart = Number(rangeStartString);
    const rangeEnd = Number(rangeEndString);

    if (Number.isNaN(rangeStart)) {
        throw new ParseError(`Unable to parse range start "${rangeStartString}" as a number`);
    }
    if (Number.isNaN(rangeEnd)) {
        throw new ParseError(`Unable to parse range end "${rangeEndString}" as a number`);
    }
    const range: Range = [rangeStart, rangeEnd];
    const element = matches[3] as DamageElement;
    const durationString = matches[4];
    let durationSeconds: number|undefined = Number(durationString);
    if (Number.isNaN(durationSeconds)) {
        if (element === DamageElement.Poison) {
            throw new ParseError(`Unable to parse "${durationString}" as a poison duration`);
        }
        durationSeconds = undefined;
    }

    return {
        type: EffectType.ElementalDamageBonus,
        element,
        durationSeconds,
        range,
    } as ElementalDamageBonusEffect;
}

function parseSpellDamageBonus(line: string): SpellDamageBonusEffect|null {
    const spellDamageRegex = new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        })% to (?:(${ELEMENT_REGEX.source}) )?Spell Damage$`
    );
    const matches = spellDamageRegex.exec(line);

    if (!matches) {
        return null;
    }

    const magnitudeString = matches[1];
    const {range, scalar} = parseScalarOrRangeString(magnitudeString);
    const element = matches[2] ? matches[2] as DamageElement : null;

    if (range) {
        return {
            type: EffectType.SpellDamageBonus,
            element,
            range,
        };
    }

    return {
        type: EffectType.SpellDamageBonus,
        element,
        scalar: scalar!,
    };
}

function parseElementalPierceBonus(line: string): ElementalPierceBonusEffect|null {
    const spellDamageRegex = new RegExp(
        `^-(${
            getScalarOrRangeRegex(false, false).source
        })% to Enemy ((?:${ELEMENT_REGEX.source})|Elemental) Resistances?$`
    );
    const matches = spellDamageRegex.exec(line);

    if (!matches) {
        return null;
    }

    const magnitudeString = matches[1];
    const {range, scalar} = parseScalarOrRangeString(magnitudeString);
    const elementString = matches[2];
    const element = elementString === "Elemental" ? null : elementString as DamageElement;

    if (range) {
        return {
            type: EffectType.ElementalPierceBonus,
            element,
            range,
        };
    }

    return {
        type: EffectType.ElementalPierceBonus,
        element,
        scalar: scalar!,
    };
}

const parseMaxLifeBonus = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^Maximum Life (${
            getScalarOrRangeRegex().source
        })%$`
    ),
    EffectType.MaxLifeBonus
);

const parseMaxManaBonus = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^Maximum Mana (${
            getScalarOrRangeRegex().source
        })%$`
    ),
    EffectType.MaxManaBonus
);

const parseRequirementsBonus = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^Requirements (${
            getScalarOrRangeRegex().source
        })%$`
    ),
    EffectType.RequirementsBonus,
);

const parseAttackRatingBonus = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex(false, false).source
        })% Bonus to Attack Rating$`
    ),
    EffectType.AttackRatingBonus
);

function parseStatBonus(line: string): StatBonusEffect|null {
    const attackRatingRegex = new RegExp(
        `^(${
            getScalarOrRangeRegex(false, false).source
        })(%)? to (${STAT_REGEX.source})$`
    );
    const matches = attackRatingRegex.exec(line);

    if (!matches) {
        return null;
    }

    const magnitudeString = matches[1];
    const {range, scalar} = parseScalarOrRangeString(magnitudeString);
    const isPercentage = matches[2] === "%";
    const stat = matches[3] as Stat;

    if (range) {
        return {
            type: EffectType.StatBonus,
            stat,
            unit: isPercentage ? Unit.Percentage : Unit.Flat,
            range,
        };
    }

    return {
        type: EffectType.StatBonus,
        stat,
        unit: isPercentage ? Unit.Percentage : Unit.Flat,
        scalar: scalar!,
    };
}

const parseGoldFindBonus = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        })% Gold Find$`
    ),
    EffectType.GoldFindBonus
);

const parseMagicFindBonus = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex(false, false).source
        })% Magic Find$`
    ),
    EffectType.MagicFindBonus
);

const parseLightRadiusBonus = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        }) to Light Radius$`
    ),
    EffectType.LightRadiusBonus
);

const parseMovementSpeedBonus = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex(false, false).source
        })% Movement Speed$`
    ),
    EffectType.MovementSpeedBonus
);

function parseElementalAbsorbBonus(line: string) {
    const regex = new RegExp(
        `^(?:(${ELEMENT_REGEX.source}) Absorb (${
            getScalarOrRangeRegex().source
        })%)|(?:(${getScalarOrRangeRegex().source}) (${ELEMENT_REGEX.source}) Absorb)$`
    );

    const matches = regex.exec(line);

    if (!matches) {
        return null;
    }

    const type = EffectType.ElementalAbsorbBonus;
    let element: DamageElementWithoutPhysical;
    let range: Range|undefined;
    let scalar: number|undefined;
    let unit: Unit;
    if (matches[1]) {
        element = matches[1] as DamageElementWithoutPhysical;
        ({range, scalar} = parseScalarOrRangeString(matches[2]));
        unit = Unit.Percentage;
    }
    else {
        element = matches[4] as DamageElementWithoutPhysical;
        ({range, scalar} = parseScalarOrRangeString(matches[3]));
        unit = Unit.Flat;
    }

    if (range) {
        return {
            type,
            element,
            range,
            unit,
        };
    }

    return {
        type,
        element,
        scalar: scalar!,
        unit,
    };
}

const parsePoisonSkillDurationBonus = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        })% Bonus to Poison Skill Duration$`
    ),
    EffectType.PoisonSkillDurationBonus
);

const parseLifeAfterKill = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        }) Life after each Kill$`
    ),
    EffectType.LifeAfterKill
);

const parseManaAfterKill = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        }) Mana after each Kill$`
    ),
    EffectType.ManaAfterKill
);

const parseLifeOnStriking = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        }) Life on Striking$`
    ),
    EffectType.LifeOnStriking
);

const parseLifeOnMeleeAttack = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        }) Life on Melee Attack$`
    ),
    EffectType.LifeOnMeleeAttack
);

const parseCrushingBlowChanceBonus = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex(false, false).source
        })% Chance of Crushing Blow$`
    ),
    EffectType.CrushingBlowChanceBonus
);

const parseDeadlyStrikeBonus = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex(false, false).source
        })% Deadly Strike$`
    ),
    EffectType.DeadlyStrikeBonus
);

const parseDamageToMana = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex(false, false).source
        })% Weapon Damage Taken Restores Mana$`
    ),
    EffectType.DamageToMana
);

const parsePhysicalResist = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^Physical Resist (${
            getScalarOrRangeRegex().source
        })%$`
    ),
    EffectType.PhysicalResist
);

function parseAttackerElementalDamage(line: string): AttackerElementalDamageEffect|null {
    const physicalResistRegex = new RegExp(
        `^Attacker Takes (${ELEMENT_REGEX.source}) Damage of (${
            getScalarOrRangeRegex(false, false).source
        })(?: over (\d+) seconds)?$`
    );
    const matches = physicalResistRegex.exec(line);
    
    if (!matches) {
        return null;
    }
    
    const element = matches[1] as DamageElementWithoutPhysical;
    const magnitudeString = matches[2];
    const {range, scalar} = parseScalarOrRangeString(magnitudeString);
    const durationString = matches[3];
    const duration = durationString ? Number(durationString) : undefined;
    
    let effect: Partial<AttackerElementalDamageEffect> = {};
    
    if (range) {
        effect = {
            type: EffectType.AttackerElementalDamage,
            element,
            range,
        };
    }
    else {
        effect = {
            type: EffectType.AttackerElementalDamage,
            element,
            scalar: scalar!,
        };
    }
    
    if (effect.element === DamageElement.Poison) {
        effect.duration = duration;
    }
    
    return effect as AttackerElementalDamageEffect;
}

function parseWeaponPhysicalDamagePerCharacterLevel(line: string): WeaponPhysicalDamagePerCharacterLevelEffect|null {
    const damageRegex = new RegExp(
        `^Weapon Physical Damage (${
            getScalarOrRangeRegex().source
        })% \\(Based on Character Level\\)$`
    );

    const matches = damageRegex.exec(line);
    
    if (!matches) {
        return null;
    }

    const magnitudeString = matches[1];
    const {range, scalar} = parseScalarOrRangeString(magnitudeString);

    if (range) {
        return {
            type: EffectType.WeaponPhysicalDamagePerCharacterLevel,
            amountPerCharacterLevel: range,
            unit: Unit.Percentage,
        };
    }

    return {
        type: EffectType.WeaponPhysicalDamagePerCharacterLevel,
        amountPerCharacterLevel: scalar!,
        unit: Unit.Percentage,
    };
}

function parseCrushingBlowPerCharacterLevel(line: string): CrushingBlowPerCharacterLevelEffect|null {
    const damageRegex = new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        })% Chance of Crushing Blow \\(Based on Character Level\\)$`
    );

    const matches = damageRegex.exec(line);
    
    if (!matches) {
        return null;
    }

    const magnitudeString = matches[1];
    const {range, scalar} = parseScalarOrRangeString(magnitudeString);
    const type = EffectType.CrushingBlowPerCharacterLevel;
    const unit = Unit.Percentage;

    if (range) {
        return {
            type,
            amountPerCharacterLevel: range,
            unit,
        };
    }

    return {
        type,
        amountPerCharacterLevel: scalar!,
        unit,
    };
}

function parseEnhancedDefensePerCharacterLevel(line: string): EnhancedDefensePerCharacterLevelEffect|null {
    const damageRegex = new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        })% Enhanced Defense \\(Based on Character Level\\)$`
    );

    const matches = damageRegex.exec(line);
    
    if (!matches) {
        return null;
    }

    const magnitudeString = matches[1];
    const {range, scalar} = parseScalarOrRangeString(magnitudeString);
    const type = EffectType.EnhancedDefensePerCharacterLevel;
    const unit = Unit.Percentage;

    if (range) {
        return {
            type,
            amountPerCharacterLevel: range,
            unit,
        };
    }

    return {
        type,
        amountPerCharacterLevel: scalar!,
        unit,
    };
}

function parseLifePerCharacterLevel(line: string): LifePerCharacterLevelEffect|null {
    const damageRegex = new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        }) to Life \\(Based on Character Level\\)$`
    );

    const matches = damageRegex.exec(line);
    
    if (!matches) {
        return null;
    }

    const magnitudeString = matches[1];
    const {range, scalar} = parseScalarOrRangeString(magnitudeString);
    const type = EffectType.LifePerCharacterLevel;
    const unit = Unit.Flat;

    if (range) {
        return {
            type,
            amountPerCharacterLevel: range,
            unit,
        };
    }

    return {
        type,
        amountPerCharacterLevel: scalar!,
        unit,
    };
}

const parseIdolOfScosglenCooldownBonus = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^Idol of Scosglen Cooldown Reduced by (${
            getScalarOrRangeRegex(false, false).source
        }) seconds$`
    ),
    EffectType.IdolOfScosglenCooldownBonus
);

function parseMarkOfTheWildBonusDamage(line: string): MarkOfTheWildBonusDamageEffect|MarkOfTheWildBonusElementalDamageEffect|null {
    const markOfTheWildRegex = new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        })% Bonus( Elemental)? Damage to Mark of the Wild$`
    );

    const matches = markOfTheWildRegex.exec(line);

    if (!matches) {
        return null;
    }

    const magnitudeString = matches[1];
    const {range, scalar} = parseScalarOrRangeString(magnitudeString);

    if (range) {
        return {
            type: matches[2] ?
                EffectType.MarkOfTheWildBonusElementalDamage :
                EffectType.MarkOfTheWildBonusDamage,
            range,
        };
    }

    return {
        type: matches[2] ?
            EffectType.MarkOfTheWildBonusElementalDamage :
            EffectType.MarkOfTheWildBonusDamage,
        scalar: scalar!,
    };
}

function parseLifeOrManaSteal(line: string): LifeStealPerHitEffect|ManaStealPerHitEffect|null {
    const stealRegex = new RegExp(
        `^(${
            getScalarOrRangeRegex(false, false).source
        })% (Life|Mana) stolen per Hit$`
    );

    const matches = stealRegex.exec(line);

    if (!matches) {
        return null;
    }

    const magnitudeString = matches[1];
    const {range, scalar} = parseScalarOrRangeString(magnitudeString);
    const type = matches[2] === "Life" ?
        EffectType.LifeStealPerHit :
        EffectType.ManaStealPerHit;

    if (range) {
        return {
            type,
            range,
        };
    }

    return {
        type,
        scalar: scalar!,
    };
}

const parseCombatSpeeds = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex(false, false).source
        })% Combat Speeds$`
    ),
    EffectType.CombatSpeeds
);

const parseMinionLifeBonus = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        })% to Summoned Minion Life$`
    ),
    EffectType.MinionLifeBonus
);

const parseMinionDamageBonus = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        })% to Summoned Minion Damage$`
    ),
    EffectType.MinionDamageBonus
);

const parseMinionResistanceBonus = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        })% to Summoned Minion Resistances$`
    ),
    EffectType.MinionResistanceBonus
);

const parseMinionAttackRatingBonus = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        })% to Summoned Minion Attack Rating$`
    ),
    EffectType.MinionAttackRatingBonus
);

const parseMaxBlockChance = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^Maximum Block Chance (${
            getScalarOrRangeRegex().source
        })%$`
    ),
    EffectType.MaxBlockChance
);

const parseExperienceBonus = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        })% to Experience Gained$`
    ),
    EffectType.ExperienceBonus
);

function parseSpellFocus(line: string): SpellFocusEffect|null {
    const regex = new RegExp(`^(${getScalarOrRangeRegex().source})(% Bonus to)? Spell Focus$`);

    const matches = regex.exec(line);

    if (!matches) {
        return null;
    }

    const magnitudeString = matches[1];
    const {range, scalar} = parseScalarOrRangeString(magnitudeString);
    const unit = matches[2] !== undefined ? Unit.Percentage : Unit.Flat;
    const type = EffectType.SpellFocus;

    if (range) {
        return {
            type,
            range,
            unit,
        };
    }

    return {
        type,
        scalar: scalar!,
        unit,
    };
}

const parseDefenseVsMissile = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        }) Defense vs. Missile$`
    ),
    EffectType.SpellFocus
);

const parseMaxLifeAndManaBonus = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^Maximum Life and Mana (${
            getScalarOrRangeRegex().source
        })%$`
    ),
    EffectType.MaxLifeAndManaBonus
);

function parseDefenseBonus(line: string): DefenseBonusEffect|null {
    const regex = new RegExp(`^(${
        getScalarOrRangeRegex().source
    })(% Bonus to)? Defense$`);

    const matches = regex.exec(line);

    if (!matches) {
        return null;
    }

    const magnitudeString = matches[1];
    const {range, scalar} = parseScalarOrRangeString(magnitudeString);
    const unit = matches[2] !== undefined ? Unit.Percentage : Unit.Flat;
    const type = EffectType.DefenseBonus;

    if (range) {
        return {
            type,
            range,
            unit,
        };
    }

    return {
        type,
        scalar: scalar!,
        unit,
    };
}

const parseLifeRegenPerSecond = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        }) Life Regenerated per Second$`
    ),
    EffectType.LifeRegenPerSecond
);

const parseLifeWhenStruck = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        }) Life when Struck by an Enemy$`
    ),
    EffectType.LifeWhenStruck
);

const parsePoisonLengthReduction = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^Poison Length Reduced by (${
            getScalarOrRangeRegex(false, false).source
        })%$`
    ),
    EffectType.PoisonLengthReduction
);

const parseAttackerFlees = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^Attacker Flees after Striking (${
            getScalarOrRangeRegex(false, false).source
        })%$`
    ),
    EffectType.AttackerFlees
);

const parseAvoidDamage = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex(false, false).source
        })% Chance to Avoid Damage$`
    ),
    EffectType.AvoidDamage
);


function parseAllAttributesBonus(line: string): AllAttributesBonusEffect|null {
    const regex = new RegExp(`^(${
            getScalarOrRangeRegex(false, false).source
        })(%?) to All Attributes$`);

    const matches = regex.exec(line);

    if (!matches) {
        return null;
    }

    const magnitudeString = matches[1];
    const {range, scalar} = parseScalarOrRangeString(magnitudeString);
    const unit = matches[2] !== undefined ? Unit.Percentage : Unit.Flat;
    const type = EffectType.AllAttributesBonus;

    if (range) {
        return {
            type,
            range,
            unit,
        };
    }

    return {
        type,
        scalar: scalar!,
        unit,
    };
}

const parseVendorDiscount = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        })% to All Vendor Prices$`
    ),
    EffectType.VendorDiscount
);

const parseBaseBlockChance = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        })% Base Block Chance$`
    ),
    EffectType.BaseBlockChance
);

const parseWeaponPhysicalDamage = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^Weapon Physical Damage (${
            getScalarOrRangeRegex().source
        })%$`
    ),
    EffectType.WeaponPhysicalDamage
);

const parseInnateElementalDamage = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        })% Innate Elemental Damage$`
    ),
    EffectType.InnateElementalDamage
);

const parseDamageToUndead = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        })% Damage to Undead$`
    ),
    EffectType.DamageToUndead
);

const parseHitCausesFlee = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^Hit Causes Monster to Flee (${
            getScalarOrRangeRegex().source
        })%$`
    ),
    EffectType.HitCausesFlee
);

const parseAdditionalDexterityBonus = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^Additional Dexterity Damage Bonus: (${
            getScalarOrRangeRegex().source
        })%$`
    ),
    EffectType.AdditionalDexterityBonus
);

const parseHitBlindsTarget = (line: string) => parseScalarOrRangeEffect(
    line,
    new RegExp(
        `^Hit Blinds Target (${
            getScalarOrRangeRegex().source
        })$`
    ),
    EffectType.HitBlindsTarget
);

function parseFlatElementalDamage(line: string): FlatElementalDamageEffect|null {
    const regex = new RegExp(
        `^(${
            getScalarOrRangeRegex().source
        }) (${ELEMENT_REGEX.source}) Damage$`
    );

    const matches = regex.exec(line);

    if (!matches) {
        return null;
    }

    const type = EffectType.FlatElementalDamage;
    const magnitudeString = matches[1];
    const {range, scalar} = parseScalarOrRangeString(magnitudeString);
    const element = matches[2] as DamageElementWithoutPhysical;

    if (range) {
        return {
            type,
            element,
            range,
        };
    }

    return {
        type,
        element,
        scalar: scalar!,
    };
}

function parseSkillCharges(line: string): SkillChargesEffect|null {
    const regex = new RegExp(
        `^Level (${
            getScalarOrRangeRegex().source
        }) ([\\w\\s-]+[\\w]) \\((\\d+)/\\3 Charges\\)$`
    );

    const matches = regex.exec(line);

    if (!matches) {
        return null;
    }

    const type = EffectType.SkillCharges;
    const magnitudeString = matches[1];
    const {range, scalar} = parseScalarOrRangeString(magnitudeString);
    const skill = matches[2];
    const numCharges = Number(matches[3]);

    if (Number.isNaN(numCharges)) {
        return null;
    }

    if (range) {
        return {
            type,
            skill,
            range,
            numCharges,
        };
    }

    return {
        type,
        skill,
        scalar: scalar!,
        numCharges,
    };
}

function parseReducedCooldown(line: string): ReducedCooldownEffect|null {
    const regex = new RegExp(
        `^([\\w\\s-]+[\\w]) Cooldown Reduced by (${
            getScalarOrRangeRegex().source
        }) seconds$`
    );

    const matches = regex.exec(line);

    if (!matches) {
        return null;
    }

    const type = EffectType.ReducedCooldown;
    const skill = matches[1];
    const magnitudeString = matches[2];
    const {range, scalar} = parseScalarOrRangeString(magnitudeString);

    return {
        type,
        skill,
        scalar: scalar!,
        reductionSeconds: range ?? scalar!,
    };
}

function parseStunAttack(line: string): StunAttackEffect|null {
    if (/^Stun Attack$/.test(line)) {
        return {
            type: EffectType.StunAttack,
        };
    }

    return null;
}

function parseCannotBeFrozen(line: string): CannotBeFrozenEffect|null {
    if (/^Cannot Be Frozen$/.test(line)) {
        return {
            type: EffectType.CannotBeFrozen,
        };
    }

    return null;
}

function parseZeroTotalDefense(line: string): ZeroTotalDefenseEffect|null {
    if (/^Total Defense = 0$/.test(line)) {
        return {
            type: EffectType.ZeroTotalDefense,
        };
    }

    return null;
}

function parseIgnoreTargetDefense(line: string): IgnoreTargetDefenseEffect|null {
    if (/^Ignore Target's Defense$/.test(line)) {
        return {
            type: EffectType.IgnoreTargetDefense,
        };
    }

    return null;
}

export const PARSE_METHODS = [
    parseSkillLevelBonus,
    parseCastSpeedBonus,
    parseAttackSpeedBonus,
    parseChanceToCast,
    parseEnhancedDamage,
    parseEnhancedDefense,
    parseFlatMaxDamage,
    parseFlatDamage,
    parseFlatDamageRange,
    parseFlatMagicDamageRange,
    parseFlatManaBonus,
    parseAttackRatingPerCharacterLevel,
    parseMaxDamagePerCharacterLevel,
    parseRegenerateLifePerCharacterLevel,
    parseBonusBloodlustDamage,
    parseSlowTarget,
    parseSlowsAttacker,
    parseRegenerateMana,
    parseResistBonus,
    parseMaxResistBonus,
    parsePhysicalDamageReduction,
    parseElementalMagicDamageReduction,
    parseManaOnStriking,
    parseManaWhenStruck,
    parseManaOnMeleeAttack,
    parseReanimateChance,
    parseBlockSpeedBonus,
    parseHitRecoveryBonus,
    parseElementalDamageBonus,
    parseSpellDamageBonus,
    parseElementalPierceBonus,
    parseMaxLifeBonus,
    parseMaxManaBonus,
    parseRequirementsBonus,
    parseAttackRatingBonus,
    parseStatBonus,
    parseGoldFindBonus,
    parseMagicFindBonus,
    parseLightRadiusBonus,
    parseMovementSpeedBonus,
    parseElementalAbsorbBonus,
    parsePoisonSkillDurationBonus,
    parseSkillBonus,
    parseLifeAfterKill,
    parseLifeOnStriking,
    parseLifeOnMeleeAttack,
    parseManaAfterKill,
    parseCrushingBlowChanceBonus,
    parseDeadlyStrikeBonus,
    parseDamageToMana,
    parsePhysicalResist,
    parseAttackerElementalDamage,
    parseWeaponPhysicalDamagePerCharacterLevel,
    parseCrushingBlowPerCharacterLevel,
    parseSpellDamagePerCharacterLevel,
    parseEnhancedDefensePerCharacterLevel,
    parseLifePerCharacterLevel,
    parseIdolOfScosglenCooldownBonus,
    parseMarkOfTheWildBonusDamage,
    parseLifeOrManaSteal,
    parseCombatSpeeds,
    parseMinionLifeBonus,
    parseMinionDamageBonus,
    parseMinionResistanceBonus,
    parseMinionAttackRatingBonus,
    parseMaxBlockChance,
    parseExperienceBonus,
    parseStunAttack,
    parseCannotBeFrozen,
    parseZeroTotalDefense,
    parseIgnoreTargetDefense,
    parseSpellFocus,
    parseDefenseVsMissile,
    parseMaxLifeAndManaBonus,
    parseDefenseBonus,
    parseLifeRegenPerSecond,
    parseLifeWhenStruck,
    parsePoisonLengthReduction,
    parseAttackerFlees,
    parseAvoidDamage,
    parseAllAttributesBonus,
    parseVendorDiscount,
    parseBaseBlockChance,
    parseWeaponPhysicalDamage,
    parseInnateElementalDamage,
    parseFlatElementalDamage,
    parseSkillCharges,
    parseReducedCooldown,
    parseDamageToUndead,
    parseHitCausesFlee,
    parseAdditionalDexterityBonus,
    parseHitBlindsTarget,
];
