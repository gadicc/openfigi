import * as path from "@std/path";
import createFetchCache from "@gadicc/fetch-mock-cache/runtimes/deno.ts";
import Store from "@gadicc/fetch-mock-cache/stores/fs.ts";
import __micMap from "../data/mic_map.json" with { type: "json" };
import type { ExchCodeValue } from "../lib/openfigi/all_values.ts";

const _micMap: Partial<
  Record<ExchCodeValue, { MIC: string; operatingMIC: string }>
> = __micMap;

const DEV_MODE = true;
const OUTPUT_FILE = path.join(Deno.cwd(), "data", "exchanges.json");
const EXCHANGE_CODES_URL =
  "https://www.openfigi.com/assets/content/OpenFIGI_Exchange_Codes-3d3e5936ba.csv";

if (DEV_MODE) {
  const fetchCache = createFetchCache({ Store });
  globalThis.fetch = fetchCache;
}

const request = await fetch(EXCHANGE_CODES_URL);
const text = await request.text();
const rows = text
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith("#"))
  .map((l) => l.split(",").map((cell) => cell.trim()));

const headerMap = {
  local: {
    "Exchange Code": "exchCode",
    "OpenFIGI Exchange Name": "figiName",
    "Composite Code": "compositeCode",
    "Composite Name": "compositeName",
    "ISO Country Code (where applicable)": "countryCode",
    "Is this a True Composite?": "trueComposite:boolean",
    "Full Exchange Name": "fullName",
  },
  crypto: {
    "Exchange Code": "exchCode",
    "Exchange Name": "name",
  },
};

let asOf: number | null = null;
let type: null | "local" | "crypto" = null;
let typeCount = 0;
let headings: string[] | null = null;
const out = {} as Record<string, Record<string, number | string | boolean>>;

for (let i = 0; i < rows.length; i++) {
  const row = rows[i];

  const asOfMatch = row[0].match(/^as of (\d+)$/);
  if (asOfMatch) {
    asOf = parseInt(asOfMatch[1]);
    continue;
  }

  if (row[0] === "~" || row[0] === "") {
    continue;
  } else if (row[0] === "Local Info") {
    type = "local";
    headings = rows[i + 1];
    for (const heading of headings) {
      if (!heading) continue;
      if (!(heading in headerMap.local)) {
        console.warn(`Unknown heading in Local Info: ${heading}`);
      }
    }
    typeCount++;
    i++;
    continue;
  } else if (row[0] === "Crypto Exchanges") {
    type = "crypto";
    headings = rows[i + 1];
    for (const heading of headings) {
      if (!heading) continue;
      if (!(heading in headerMap.crypto)) {
        console.warn(`Unknown heading in Crypto Exchanges: ${heading}`);
      }
    }
    typeCount++;
    i++;
    continue;
  }

  if (!type) throw new Error("Missing type before data rows");
  if (!headings) throw new Error("Missing headings before data rows");

  const map = type === "local" ? headerMap.local : headerMap.crypto;
  const obj: Record<string, string | number | boolean> = {};
  for (let j = 0; j < row.length; j++) {
    const cell = row[j];
    const heading = headings[j];
    if (!heading) continue;
    const [key, keyType] = map[heading as keyof typeof map].split(":");
    if (!key) continue;
    obj[key] = keyType === "number"
      ? parseFloat(cell)
      : keyType === "boolean"
      ? (cell === "Yes" ? true : cell === "No" ? false : Boolean(cell))
      : cell;
    obj["asOf"] = asOf!;
    obj["type"] = type;
  }
  out[obj.exchCode as string] = obj;
}

if (typeCount !== 2) {
  throw new Error(
    `Expected 2 types of rows, got ${typeCount}; this means the format of the source data has changed`,
  );
}

console.log(`Total rows: ${Object.keys(out).length} (${type} types)`);

Deno.writeTextFile(
  OUTPUT_FILE,
  JSON.stringify(out, null, 2),
);

console.log(`Wrote ${OUTPUT_FILE}`);
