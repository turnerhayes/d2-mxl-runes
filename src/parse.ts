import { CHARACTER_CLASSES_REGEX, PARSE_METHODS } from "./parse_methods";
import {
    CharacterClass,
    Effect,
    EffectType,
    ItemType,
    ParseError,
    PlaintextEffect,
    Runeword,
    SpecialEffect
} from "./parser_types";



export const parse = (
    content: string,
    Parser: typeof DOMParser = DOMParser,
    ResultType: typeof XPathResult = XPathResult
): Runeword[] => {
    const doc = new Parser().parseFromString(content, "text/html");

    const tablesSnapshot = doc.evaluate(
        "//table[contains(@class, 'runewords_table')]/tbody/tr",
        doc,
        null,
        ResultType.ORDERED_NODE_SNAPSHOT_TYPE,
        null
    );

    const runewords: Runeword[] = [];
    
    for (let i = 0; i < tablesSnapshot.snapshotLength; i++) {
        // DEBUG: REMOVE WHEN DONE
        // if (i !== 127) {
        //     continue;
        // }
        // END DEBUG
        console.log("Runeword number", i);
        const tableNode = tablesSnapshot.snapshotItem(i)!;
        const runeword = parseTableNode(tableNode, doc, ResultType)
        runewords.push(runeword);
    }

    return runewords;
};

function parseTableNode(node: Node, doc: Document, ResultType: typeof XPathResult): Runeword {
    const {name, runeword, flavorText} = parseName(node, doc, ResultType);
    const itemLevel = parseItemLevel(node, doc, ResultType);
    const runes = parseRuneList(node, doc, ResultType);
    const itemTypes = parseItemTypes(node, doc, ResultType);
    const classRestriction = parseClassRestriction(node, doc, ResultType);
    const effects = parseEffects(node, doc, ResultType);

    return {
        name,
        flavorText,
        runeword,
        itemLevel,
        runes,
        itemTypes,
        classRestriction,
        effects,
        fullText: (node as HTMLElement).innerHTML.trim(),
    };
}

function parseName(node: Node, doc: Document, ResultType: typeof XPathResult): {
    name: string,
    runeword: string,
    flavorText?: string,
 } {
    const itemNameResult = doc.evaluate(
        ".//td[contains(@class, 'item-name')]",
        node,
        null,
        ResultType.FIRST_ORDERED_NODE_TYPE,
        null
    );

    const nameNode = itemNameResult.singleNodeValue;

    if (!nameNode) {
        throw new ParseError("Unable to find item cell in table");
    }

    const runewordNameResult = doc.evaluate(
        ".//span[contains(@class, 'item-unique')]",
        nameNode,
        null,
        ResultType.FIRST_ORDERED_NODE_TYPE,
        null
    );

    const runewordNameNode = runewordNameResult.singleNodeValue;

    if (!runewordNameNode) {
        throw new ParseError("Unable to find runeword name in table");
    }

    const [name, flavorText] = runewordNameNode.textContent?.trim().split("\n") ?? [];

    if (!name) {
        throw new ParseError("Runeword name is empty");
    }

    console.log("runeword name:", name);
    
    const runewordResult = doc.evaluate(
        ".//span[contains(@class, 'item-runeword')]",
        nameNode,
        null,
        ResultType.FIRST_ORDERED_NODE_TYPE,
        null
    );
    
    const runewordNode = runewordResult.singleNodeValue;
    
    if (!runewordNode) {
        throw new ParseError("Unable to find runeword in table");
    }
    
    const runeword = runewordNode.textContent?.trim().replace(/(^')|('$)/g, "");

    if (!runeword) {
        throw new ParseError("Runeword is empty");
    }

    return {
        name,
        runeword,
        flavorText: flavorText?.trim().replace(/(^\()|(\)$)/g, ""),
    };
}

function getItemLevelNode(node: Node, doc: Document, ResultType: typeof XPathResult): Node {
    const itemNameResult = doc.evaluate(
        ".//td[contains(@class, 'item-level')]",
        node,
        null,
        ResultType.FIRST_ORDERED_NODE_TYPE,
        null
    );

    const itemLevelNode = itemNameResult.singleNodeValue;

    if (!itemLevelNode) {
        throw new ParseError("Unable to find item level node");
    }

    return itemLevelNode;
}

function parseItemLevel(node: Node, doc: Document, ResultType: typeof XPathResult): number {
    const itemLevelNode = getItemLevelNode(node, doc, ResultType);
    const itemLevel = Number(itemLevelNode.textContent?.trim());

    if (Number.isNaN(itemLevel)) {
        throw new ParseError("Item level could not be parsed as a number");
    }

    return itemLevel;
}

function parseRuneList(node: Node, doc: Document, ResultType: typeof XPathResult): string[] {
    const itemLevelNode = getItemLevelNode(node, doc, ResultType);

    const runesContainerResult = doc.evaluate(
        "./following-sibling::td[2]",
        itemLevelNode,
        null,
        ResultType.FIRST_ORDERED_NODE_TYPE,
        null
    );

    const runesContainerCell = runesContainerResult.singleNodeValue;

    if (!runesContainerCell) {
        throw new ParseError("Unable to find runes container cell");
    }

    const runes: string[] = [];

    const runeItemsSnapshot = doc.evaluate(
        ".//span[contains(@class, 'item-eruneword')]",
        runesContainerCell,
        null,
        ResultType.ORDERED_NODE_SNAPSHOT_TYPE,
        null
    );

    for (let i = 0; i < runeItemsSnapshot.snapshotLength; i++) {
        const runeItemNode = runeItemsSnapshot.snapshotItem(i)!;
        if (!runeItemNode.textContent) {
            continue;
        }
        const runeText = runeItemNode.textContent.trim();
        let num = 1;
        const previousSibling = runeItemNode.previousSibling;
        if (
            previousSibling &&
            previousSibling.nodeType === Node.TEXT_NODE &&
            previousSibling.textContent !== null
        ) {
            const matches = /(\d+)x/.exec(previousSibling.textContent.trim());
            if (matches) {
                const numStr = matches[1];
                num = Number(numStr);
                if (Number.isNaN(num)) {
                    throw new ParseError(`Rune multiplier string "${numStr}" is not a number`);
                }
            }
        }
        const rune = runeText.replace(/ Rune$/, "");
        for (let i = 0; i < num; i++) {
            runes.push(rune);
        }
    }

    return runes;
}

function parseItemTypes(node: Node, doc: Document, ResultType: typeof XPathResult): ItemType[] {
    const itemLevelNode = getItemLevelNode(node, doc, ResultType);

    const itemTypesCellResult = doc.evaluate(
        "./following-sibling::td[3]",
        itemLevelNode,
        null,
        ResultType.FIRST_ORDERED_NODE_TYPE,
        null
    );

    const itemTypesCell = itemTypesCellResult.singleNodeValue;

    if (!itemTypesCell) {
        throw new ParseError("Unable to find item types container cell");
    }

    if (!itemTypesCell.textContent) {
        throw new ParseError("Item types container cell is empty");
    }

    const itemTypes = itemTypesCell.textContent.trim().split(/,\s*/).map(
        (type) => {
            type = type.trim();
            const matches = /^([\w\s-]+\w)\s+(\([\w()\s-]+)$/.exec(type);
            if (matches) {
                type = matches[1];
                const exceptionsString = matches[2];
                const exceptions: string[] = [];
                for (const match of exceptionsString.matchAll(/^\(except ([\w\s-]+)\)$/gm)) {
                    exceptions.push(match[1]);
                }
                return {
                    type,
                    exceptions,
                };
            }
            return {type};
        }
    );


    return itemTypes;
}

function parseClassRestriction(node: Node, doc: Document, ResultType: typeof XPathResult): CharacterClass|null {
    const itemLevelNode = getItemLevelNode(node, doc, ResultType);

    const classRestrictionNodeResult = doc.evaluate(
        "./following-sibling::td[4]//span[contains(@class, 'item-red')]",
        itemLevelNode,
        null,
        ResultType.FIRST_ORDERED_NODE_TYPE,
        null
    );

    const classRestrictionNode = classRestrictionNodeResult.singleNodeValue;

    if (!classRestrictionNode) {
        return null;
    }

    const classRestrictionString = classRestrictionNode.textContent;

    if (!classRestrictionString) {
        return null;
    }

    const regex = new RegExp(`^\\((${CHARACTER_CLASSES_REGEX.source}) Only\\)$`);
    const matches = regex.exec(classRestrictionString.trim());

    if (matches) {
        return matches[1] as CharacterClass;
    }

    return null;
}

function parseEffects(node: Node, doc: Document, ResultType: typeof XPathResult): Effect<EffectType>[] {
    const itemLevelNode = getItemLevelNode(node, doc, ResultType);

    const effectsNodeResult = doc.evaluate(
        "./following-sibling::td[4]//span[contains(@class, 'item-magic')]|./following-sibling::td[4]//span[contains(@class, 'item-orange')]",
        itemLevelNode,
        null,
        ResultType.ORDERED_NODE_SNAPSHOT_TYPE,
        null
    );

    if (effectsNodeResult.snapshotLength === 0) {
        throw new ParseError("Unable to find effects container cell");
    }

    const effects: Effect<EffectType>[] = [];

    for (let i = 0; i < effectsNodeResult.snapshotLength; i++) {
        const effectsNode = effectsNodeResult.snapshotItem(i)!;
    
        if (!effectsNode.textContent) {
            throw new ParseError("Effects container cell is empty");
        }
    
        const effectsStrings = effectsNode.textContent.trim().split("\n");
        
        const isSpecialEffect = (effectsNode as Element).classList.contains("item-orange");

        let subEffects: Effect<EffectType>[]|undefined;

        if (isSpecialEffect) {
            const subEffectsNodeResult = doc.evaluate(
                "./following-sibling::span[contains(@class, 'item-runeword')]",
                effectsNode,
                null,
                ResultType.FIRST_ORDERED_NODE_TYPE,
                null
            );

            const subEffectsNode = subEffectsNodeResult.singleNodeValue;

            if (subEffectsNode?.textContent) {
                const effectsStrings = subEffectsNode.textContent.trim().split("\n");
                subEffects = effectsStrings.map(
                    (effectLine) => ({
                        type: EffectType.Plaintext,
                        effectText: effectLine.trim(),
                    })
                );
            }
        }
        
        effects.push(...effectsStrings.map(
            (effectLine: string) => {
                effectLine = effectLine.trim();
                if (isSpecialEffect) {
                    return {
                        type: EffectType.Special,
                        text: effectLine,
                        subEffects,
                    } as SpecialEffect;
                }
                return parseEffectLine(effectLine);
            }
        ));
    }

    // console.log("Effects:", effects);

    return effects;
}

function parseEffectLine(line: string): Effect<EffectType> {
    // console.log("parseEffectLine :> line:", line);
    for (const parser of PARSE_METHODS) {
        const result = parser(line);
        if (result !== null) {
            return result;
        }
    }
    console.log("parseEffectLine :> unparsed effect:", line);
    return {
        type: EffectType.Plaintext,
        effectText: line,
    } as PlaintextEffect;
}
