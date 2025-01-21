import { parse} from "./parse.mjs";
import { Effect, EffectType, Runeword } from "./parser_types.mjs";

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
    nameEl.appendChild(document.createTextNode(`${runeword.name} `));
    if (runeword.flavorText) {
        const flavorTextEl = document.createElement("span");
        flavorTextEl.classList.add("flavor-text");
        flavorTextEl.textContent = `${runeword.flavorText} `;
        nameEl.appendChild(flavorTextEl);
    }
    nameEl.appendChild(document.createTextNode(`(${runeword.runeword})`));

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
}

async function main() {
    const response = await fetch("./runewords/index.html");
    const content = await response.text();
    const parsed = parse(content);

    const searchForm = document.getElementById("search-form") as HTMLFormElement;

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(searchForm);
        history.pushState({}, "", `?${
            new URLSearchParams(
                // Typescript doesn't like FormData being passed to
                // URLSearchParams because it can contain non-string values,
                // such as File objects. Force cast this because I know the
                // form data only contains strings.
                formData as unknown as Record<string, string>
            )
        }`);
        const effectTypes = formData.getAll("effect-types") as EffectType[];
        console.log("effectTypes:", effectTypes);

        const filtered = parsed.filter((runeword) => {
            for (const effect of runeword.effects) {
                if (effectTypes.includes(effect.type)) {
                    return true;
                }
            }
            return false;
        });
        console.log("filtered:", filtered);
        renderRunewordList(filtered);
    });

    const effectTypeSelectEl = document.getElementById("effect-type-select") as HTMLSelectElement;

    for (const effectType of Object.values(EffectType)) {
        const option = document.createElement("option");
        option.value = effectType;
        option.textContent = effectType.split(/(?=[A-Z])/).join(" ");
        effectTypeSelectEl.appendChild(option);
    }

    handleSearchParams();

    renderRunewordList(parsed.slice(0, 3));
}

main().then(
    () => {
        console.log("done");
    }
);
