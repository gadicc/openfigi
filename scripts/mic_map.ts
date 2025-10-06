import * as path from "@std/path";
import createFetchCache from "@gadicc/fetch-mock-cache/runtimes/deno.ts";
import Store from "@gadicc/fetch-mock-cache/stores/fs.ts";
import * as XLSX from "xlsx";

const DEV_MODE = false;
const OUTPUT_FILE = path.join(Deno.cwd(), "data", "mic_map.json");
const XLS_MAP_URL =
  "https://f.hubspotusercontent20.net/hubfs/8446674/Blog%20Post%20Uploads/Bloomberg-Exchange-Code-to-MIC-Mapping.xlsx";

if (DEV_MODE) {
  const fetchCache = createFetchCache({ Store });
  globalThis.fetch = fetchCache;
}

const request = await fetch(XLS_MAP_URL);
const arrayBuffer = await request.arrayBuffer();
const workbook = XLSX.read(arrayBuffer);
const sheetName = workbook.SheetNames[1]; // 0:disclaimer 1:MIC
const sheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 2 }) as {
  MIC: string;
  "Operating MIC": string;
  "MIC EXCHANGE NAME": string;
  "CORP EXCHANGE": string;
  "EQUITY EXCH CODE": string;
  "EQUITY EXCH NAME": string;
  "Composite Code": string;
  "ISO COUNTRY": string;
}[];

const exchCodeMap: Record<string, { MIC: string; operatingMIC: string }> = {};
const MICMap: Record<string, string> = {};
const operatingMICMap: Record<string, string> = {};

console.log(`Processing ${rows.length} rows...`);

for (const row of rows) {
  const exchCode = row["EQUITY EXCH CODE"];
  const MIC = row["MIC"];
  const operatingMIC = row["Operating MIC"];
  if (MIC && exchCode && exchCode !== "NONE") {
    exchCodeMap[exchCode] = { MIC, operatingMIC };
    MICMap[MIC] = exchCode;
    operatingMICMap[operatingMIC] = exchCode;
  }
}

const out = {
  exchCode: exchCodeMap,
  MIC: MICMap,
  operatingMIC: operatingMICMap,
};

await Deno.writeTextFile(
  OUTPUT_FILE,
  JSON.stringify(out, null, 2),
);

console.log(`Wrote ${OUTPUT_FILE}`);
