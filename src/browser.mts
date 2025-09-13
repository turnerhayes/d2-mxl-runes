import { parse} from "./parse";
import { AllCharacterClasses, CharacterClass, Effect, EffectType, Runeword } from "./parser_types";


const local = false;

const RUNEWORDS_URL = local ? "./runewords/index/html" : "/proxy/doc/items/runewords";

const RUNE_FILES: {[runeName: string]: string} = {
    "Vez": "https://docs.median-xl.com/images/runes/xisVex.jpg",
    "Lo": "https://docs.median-xl.com/images/runes/invrLo.jpg",
    "Zod": "https://docs.median-xl.com/images/runes/invrZod.jpg",
    "Stone": "https://docs.median-xl.com/images/runes/phys-rune.jpg",
    "Fire": "https://docs.median-xl.com/images/runes/fire-rune.jpg",
    "Zol": "https://docs.median-xl.com/images/runes/xisSol.jpg",
    "Eld": "https://docs.median-xl.com/images/runes/invrEld.jpg",
    "Sur": "https://docs.median-xl.com/images/runes/invrSur.jpg",
    "Cham": "https://docs.median-xl.com/images/runes/invrCham.jpg",
    "Ohm": "https://docs.median-xl.com/images/runes/invrOhm.jpg",
    "Eth": "https://docs.median-xl.com/images/runes/invrEth.jpg",
    "Ith": "https://docs.median-xl.com/images/runes/invrIth.jpg",
    "Shael": "https://docs.median-xl.com/images/runes/invrShae.jpg",
    "Ort": "https://docs.median-xl.com/images/runes/invrOrt.jpg",
    "Fal": "https://docs.median-xl.com/images/runes/invrFal.jpg",
    "Taha": "https://docs.median-xl.com/images/runes/r-d-02.jpg",
    "Jah": "https://docs.median-xl.com/images/runes/invrJo.jpg",
    "Qor": "https://docs.median-xl.com/images/runes/r-d-11.jpg",
    "Ber": "https://docs.median-xl.com/images/runes/invrBer.jpg",
    "Ist": "https://docs.median-xl.com/images/runes/invrIst.jpg",
    "Ahmn": "https://docs.median-xl.com/images/runes/xisAmn.jpg",
    "Vex": "https://docs.median-xl.com/images/runes/invrVex.jpg",
    "Gur": "https://docs.median-xl.com/images/runes/xisGul.jpg",
    "Um": "https://docs.median-xl.com/images/runes/invrUm.jpg",
    "Tir": "https://docs.median-xl.com/images/runes/invrTir.jpg",
    "Gul": "https://docs.median-xl.com/images/runes/invrGul.jpg",
    "Tyr": "https://docs.median-xl.com/images/runes/xisTir.jpg",
    "Ral": "https://docs.median-xl.com/images/runes/invrRal.jpg",
    "El": "https://docs.median-xl.com/images/runes/invrEl.jpg",
    "Dol": "https://docs.median-xl.com/images/runes/invrDol.jpg",
    "Light": "https://docs.median-xl.com/images/runes/ltng-rune.jpg",
    "Phul": "https://docs.median-xl.com/images/runes/xisPul.jpg",
    "Lew": "https://docs.median-xl.com/images/runes/xisLem.jpg",
    "Ghal": "https://docs.median-xl.com/images/runes/r-d-05.jpg",
    "Poison": "https://docs.median-xl.com/images/runes/pois-rune.jpg",
    "Nif": "https://docs.median-xl.com/images/runes/xisNef.jpg",
    "Zur": "https://docs.median-xl.com/images/runes/xisSur.jpg",
    "Hem": "https://docs.median-xl.com/images/runes/xisHel.jpg",
    "Arcane": "https://docs.median-xl.com/images/runes/magic-rune.jpg",
    "Un": "https://docs.median-xl.com/images/runes/xisUm.jpg",
    "Pul": "https://docs.median-xl.com/images/runes/invrPul.jpg",
    "Mhal": "https://docs.median-xl.com/images/runes/xisMal.jpg",
    "Elq": "https://docs.median-xl.com/images/runes/xisEld.jpg",
    "Nef": "https://docs.median-xl.com/images/runes/invrNef.jpg",
    "Ice": "https://docs.median-xl.com/images/runes/cold-rune.jpg",
    "Iu": "https://docs.median-xl.com/images/runes/xisIo.jpg",
    "Mal": "https://docs.median-xl.com/images/runes/invrMal.jpg",
    "Thul": "https://docs.median-xl.com/images/runes/invrThul.jpg",
    "Rhal": "https://docs.median-xl.com/images/runes/xisRal.jpg",
    "Hel": "https://docs.median-xl.com/images/runes/invrHel.jpg",
    "Tal": "https://docs.median-xl.com/images/runes/invrTal.jpg",
    "Xith": "https://docs.median-xl.com/images/runes/xisIth.jpg",
    "Xeth": "https://docs.median-xl.com/images/runes/xisEth.jpg",
    "Loz": "https://docs.median-xl.com/images/runes/xisLo.jpg",
    "Ol": "https://docs.median-xl.com/images/runes/xisEl.jpg",
    "Lem": "https://docs.median-xl.com/images/runes/invrLem.jpg",
    "Amn": "https://docs.median-xl.com/images/runes/invrAmn.jpg",
    "Yst": "https://docs.median-xl.com/images/runes/xisIst.jpg",
    "Sol": "https://docs.median-xl.com/images/runes/invrSol.jpg",
    "Ko": "https://docs.median-xl.com/images/runes/invrKo.jpg",
    "Xod": "https://docs.median-xl.com/images/runes/xisZod.jpg",
    "Bur": "https://docs.median-xl.com/images/runes/xisBer.jpg",
    "Shaen": "https://docs.median-xl.com/images/runes/xisShael.jpg",
    "Ohn": "https://docs.median-xl.com/images/runes/xisOhm.jpg",
    "Ka": "https://docs.median-xl.com/images/runes/xisKo.jpg",
    "Iah": "https://docs.median-xl.com/images/runes/xisJah.jpg",
    "Io": "https://docs.median-xl.com/images/runes/invrIo.jpg",
    "Doj": "https://docs.median-xl.com/images/runes/xisDol.jpg",
    "Fel": "https://docs.median-xl.com/images/runes/xisFal.jpg",
    "Lux": "https://docs.median-xl.com/images/runes/xisLum.jpg",
    "Lum": "https://docs.median-xl.com/images/runes/invrLum.jpg",
    "Thal": "https://docs.median-xl.com/images/runes/xisTal.jpg",
    "Yham": "https://docs.median-xl.com/images/runes/xisCham.jpg",
    "Tuul": "https://docs.median-xl.com/images/runes/xisThul.jpg",
    "Urt": "https://docs.median-xl.com/images/runes/xisOrt.jpg",
};

function getEffectElement(effect: Effect<EffectType>): HTMLElement {
    const container = document.createElement("div");
    container.classList.add("effect");
    container.textContent = `${JSON.stringify(effect, null, "\t")}`;

    return container;
}

function getRunewordElement(runeword: Runeword): HTMLElement {
    const container = document.createElement("div");

    const nameEl = document.createElement("div");
    nameEl.style.display = "flex";
    nameEl.appendChild(document.createTextNode(`${runeword.name} `));
    if (runeword.flavorText) {
        const flavorTextEl = document.createElement("span");
        flavorTextEl.classList.add("flavor-text");
        flavorTextEl.textContent = `${runeword.flavorText} `;
        nameEl.appendChild(flavorTextEl);
    }
    nameEl.appendChild(document.createTextNode(`(${runeword.runeword})`));

    const returnToTopLink = document.createElement("a");
    returnToTopLink.href = "#";
    returnToTopLink.textContent = "🔝";
    returnToTopLink.style.marginLeft = "auto";
    nameEl.appendChild(returnToTopLink);

    container.appendChild(nameEl);

    const itemLevelEl = document.createElement("div");
    itemLevelEl.textContent = `Item level: ${runeword.itemLevel}`;
    container.appendChild(itemLevelEl);

    if (runeword.classRestriction !== null) {
        const classRestrictionTitleEl = document.createElement("h3");
        classRestrictionTitleEl.textContent = "Class Restriction:";
        container.appendChild(classRestrictionTitleEl);
        const classRestrictionEl = document.createElement("dev");
        classRestrictionEl.textContent = runeword.classRestriction;
        container.appendChild(classRestrictionEl);
    }

    const itemTypesListTitleEl = document.createElement("h3");
    itemTypesListTitleEl.textContent = "Valid Item Types:";
    container.appendChild(itemTypesListTitleEl);
    const itemTypesList = document.createElement("ul");
    for (const itemType of runeword.itemTypes) {
        const {type, exceptions} = itemType;
        const li = document.createElement("li");
        li.textContent = type;
        if (exceptions?.length ?? 0 > 0) {
            const exceptionsTitleEl = document.createElement("h4");
            exceptionsTitleEl.textContent = "Exceptions:";
            li.appendChild(exceptionsTitleEl);
            const exceptionsList = document.createElement("ul");
            for (const exception of exceptions!) {
                const exLi = document.createElement("li");
                exLi.textContent = exception;
                exceptionsList.appendChild(exLi);
            }
            li.appendChild(exceptionsList);
        }
        itemTypesList.appendChild(li);
    }
    container.appendChild(itemTypesList);
    

    const runeListTitleEl = document.createElement("h3");
    runeListTitleEl.textContent = "Runes:";
    container.appendChild(runeListTitleEl);
    const runeList = document.createElement("ol");
    for (const rune of runeword.runes) {
        const li = document.createElement("li");
        const img = document.createElement("img");
        img.src = RUNE_FILES[rune];
        img.alt = `${rune} rune image`;
        const nameNode = document.createTextNode(rune);
        li.appendChild(img);
        li.appendChild(nameNode);
        runeList.appendChild(li);
    }

    container.appendChild(runeList);

    const effectListTitleEl = document.createElement("h3");
    effectListTitleEl.textContent = "Effects:";
    container.appendChild(effectListTitleEl);
    const effectListEl = document.createElement("ul");
    for (const effect of runeword.effects) {
        const li = document.createElement("li");
        li.appendChild(getEffectElement(effect));
        effectListEl.appendChild(li);
    }
    container.appendChild(effectListEl);
    container.appendChild(document.createElement("hr"));
    const original = document.createElement("div");
    original.innerHTML = runeword.fullText;
    const effectsContainer = original.querySelector(".item-level");
    if (effectsContainer !== null) {
        original.innerHTML = effectsContainer.innerHTML;
        container.appendChild(original);
    }

    return container;
}

function renderRunewordLinks(runewords: Runeword[]): HTMLUListElement {
    const runewordListEl = document.createElement("ul");
    runewordListEl.classList.add("runeword-list");
    for (const runeword of runewords) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `#${encodeURIComponent(runeword.name)}`;
        a.textContent = runeword.name;
        li.appendChild(a);
        runewordListEl.appendChild(li);
    }
    return runewordListEl;
}

function renderRunewordList(runewords: Runeword[]): void {
    const resultsEl = document.getElementById("results")!;
    resultsEl.innerHTML = "";
    const linkContainer = document.createElement("div");
    linkContainer.classList.add("runeword-links");
    linkContainer.appendChild(renderRunewordLinks(runewords));
    resultsEl.appendChild(linkContainer);
    const runewordListEl = document.createElement("ul");
    runewordListEl.classList.add("runeword-list");
    for (const runeword of runewords) {
        const li = document.createElement("li");
        li.id = encodeURIComponent(runeword.name);
        li.appendChild(getRunewordElement(runeword));
        runewordListEl.appendChild(li);
    }
    resultsEl.appendChild(runewordListEl);
}

function handleSearchParams(): void {
    const params = new URLSearchParams(location.search);
    console.log("Params:", params);

    const formData = new FormData(); 

    for (const [key, value] of params.entries()) {
        formData.append(key, value);
    }

    renderSearchForm(formData);
    renderFilteredList();
}

let parsed: Runeword[] = [];

function getFormData(): FormData {
    const searchForm = document.getElementById("search-form") as HTMLFormElement;
    return new FormData(searchForm);
}

function renderFilteredList() {
    if (parsed.length === 0) {
        return;
    }
    const formData = getFormData();
    const effectTypes = formData.getAll("effect-type") as EffectType[];

    const filtered = parsed.filter((runeword) => {
        for (const effect of runeword.effects) {
            if (effectTypes.includes(effect.type)) {
                return true;
            }
        }
        return false;
    });
    renderRunewordList(filtered);
}

function createEffectTypeField(effectType: EffectType|null = null): HTMLElement {
    const effectTypesFieldTemplate = document.getElementById("effect-type-field-template") as HTMLTemplateElement;

    const effectTypesField = effectTypesFieldTemplate.content.cloneNode(true) as HTMLElement;
    
    const effectTypeSelectEl = effectTypesField.querySelector(".effect-type-select") as HTMLSelectElement;

    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "-- Select Effect Type --";
    effectTypeSelectEl.appendChild(emptyOption);
    for (const effectTypeOption of Object.values(EffectType)) {
        if (effectTypeOption === EffectType.Plaintext) {
            continue;
        }
        const option = document.createElement("option");
        option.value = effectTypeOption;
        option.textContent = effectTypeOption.split(/(?=[A-Z])/).join(" ");
        if (effectType === effectTypeOption) {
            option.selected = true;
        }
        effectTypeSelectEl.appendChild(option);
    }

    effectTypeSelectEl.addEventListener("change", handleEffectTypeChange);

    return effectTypesField;
}

function createClassSelectField(): HTMLElement {
    const classSelectTemplate = document.getElementById("effect-field-additions--class");
    if (classSelectTemplate == null) {
        throw new Error("Class select template not found");
    }

    const classSelect = classSelectTemplate.cloneNode(true) as HTMLElement;

    const selectField = classSelect.getElementsByTagName("select")[0] as HTMLSelectElement|undefined;
    if (selectField == undefined) {
        throw new Error("Select field not found in class select template");
    }
    selectField.name = "class-restriction";

    for (const characterClass of AllCharacterClasses) {
        const option = document.createElement("option");
        option.value = characterClass;
        option.textContent = characterClass;
        selectField.appendChild(option);
    }

    return classSelect;
}

function addConjunctionSelect(
    parent: HTMLElement,
    name: string,
    containerEl: keyof HTMLElementTagNameMap|undefined = undefined
): void {
    const conjunctionSelect = document.createElement("select");
    conjunctionSelect.name = name;
    const andOption = document.createElement("option");
    andOption.value = "and";
    andOption.textContent = "AND";
    conjunctionSelect.appendChild(andOption);
    const orOption = document.createElement("option");
    orOption.value = "or";
    orOption.textContent = "OR";
    conjunctionSelect.appendChild(orOption);
    if (containerEl !== undefined) {
        const container = document.createElement(containerEl);
        container.appendChild(conjunctionSelect);
        parent.appendChild(container);
    }
    else {
        parent.appendChild(conjunctionSelect);
    }
}

function handleEffectTypeChange(event: Event): void {
    const effectContainer = (event.target as HTMLElement).closest(".effect-type-field");
    const additionalFieldsContainer = effectContainer?.querySelector(".effect-type-additional-fields");
    if (additionalFieldsContainer == null) {
        throw new Error("Additional fields container not found");
    }
    const select = event.target as HTMLSelectElement;
    const effectType = select.value as EffectType|"";
    additionalFieldsContainer.innerHTML = "";
    if (effectType === "") {
        return;
    }
}

function renderSearchForm(formData: FormData|null = null): void {
    const formContainer = document.querySelector("#search-form > fieldset");

    if (formContainer == null) {
        throw new Error("Form container not found");
    }

    const effectTypesFieldset = document.getElementById("effect-types-fieldset");

    if (effectTypesFieldset == null) {
        throw new Error("Effect types fieldset not found");
    }

    effectTypesFieldset.innerHTML = "";

    const effectTypesList = document.createElement("ol");
    effectTypesList.classList.add("effect-types-list");
    
    const addEffectTypeButton = document.createElement("button");
    addEffectTypeButton.type = "button";
    addEffectTypeButton.textContent = "+ Add Effect Type";
    addEffectTypeButton.addEventListener("click", () => {
        const formData = getFormData();
        const effectTypes = formData.getAll("effect-type") as (EffectType|"")[];
        const hasEmpty = effectTypes.some((et) => et === "");
        if (hasEmpty) {
            return;
        }
        const hasEffectType = effectTypes.some((et) => et !== "");
        if (hasEffectType) {
            addConjunctionSelect(effectTypesList, `effect-types-conjunction-${effectTypes.length - 1}`, "li");
        }
        const li = document.createElement("li");
        li.appendChild(createEffectTypeField());
        effectTypesList.appendChild(li);
    });
    effectTypesFieldset.appendChild(addEffectTypeButton);

    effectTypesFieldset.appendChild(effectTypesList);

    const effectTypes = formData != null ? formData.getAll("effect-type") as EffectType[] : [];

    if (effectTypes.length === 0) {
        const li = document.createElement("li");
        li.appendChild(createEffectTypeField());
        effectTypesList.appendChild(li);
    }
    else {
        for (const effectType of effectTypes) {
            const field = createEffectTypeField(effectType);

            const li = document.createElement("li");
            li.appendChild(field);
            effectTypesList.appendChild(li);
        }
    }
}

async function main() {
    const response = await fetch(RUNEWORDS_URL);
    const content = await response.text();
    parsed = parse(content);

    const searchForm = document.getElementById("search-form") as HTMLFormElement;

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(searchForm);
        const effectTypes = formData.getAll("effect-type");

        if (effectTypes.length > 0) {
            const removedIndexes: number[] = [];
            const filteredTypes: EffectType[] = [];
            effectTypes.forEach((et, index) => {
                if (et === "") {
                    removedIndexes.push(index);
                }
                else {
                    filteredTypes.push(et as EffectType);
                }
            });

            if (removedIndexes.length > 0) {
                const magnitudes = formData.getAll("effect-type-magnitude");
                for (let i = removedIndexes.length - 1; i >= 0; i--) {
                    const removeIndex = removedIndexes[i];
                    magnitudes.splice(removeIndex, 1);
                }
                formData.delete("effect-type-magnitude");
                for (const magnitude of magnitudes) {
                    formData.append("effect-type-magnitude", magnitude as string);
                }
            }
            if (filteredTypes.length < effectTypes.length) {
                formData.delete("effect-type");
                for (const filteredType of filteredTypes) {
                    formData.append("effect-type", filteredType);
                }
            } 
        }

        history.pushState({}, "", `?${
            new URLSearchParams(
                // Typescript doesn't like FormData being passed to
                // URLSearchParams because it can contain non-string values,
                // such as File objects. Force cast this because I know the
                // form data only contains strings.
                formData as unknown as Record<string, string>
            )
        }`);

        renderFilteredList();
    });

    const formData = getFormData();
    
    if (Array.from(formData.values()).length === 0) {
        renderSearchForm();
        renderRunewordList(parsed.slice(0, 3));
    }
    else {
        handleSearchParams();
    }
}

main();
