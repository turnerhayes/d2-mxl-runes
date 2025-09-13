import path from "node:path";
import {readFile} from "node:fs/promises";
import xpath from "xpath";
import { DOMParser } from "@xmldom/xmldom";
import { parse } from "./parse";


async function main() {
    const pagepath = path.join(".", "runewords", "index.html");

    const content = await readFile(pagepath, {encoding: "utf-8"});

    // console.log("Content:\n\n" + content);

    parse(content, DOMParser as unknown as typeof globalThis.DOMParser, xpath.XPathResult);
}

main().then(
    () => {
        console.log("done");
    }
);
