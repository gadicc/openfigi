import { build, emptyDir } from "@deno/dnt";
import denoJson from "../deno.json" with { type: "json" };

await emptyDir("./npm");

await build({
  entryPoints: Object.entries(denoJson.exports).map(([key, value]) => ({
    name: key,
    path: value,
  })),
  outDir: "./npm",
  test: false,
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: "openfigi",
    // version: Deno.args[0],
    version: "0.0.1", // semantic-release will replace this
    description: denoJson.description,
    author: "Gadi Cohen <dragon@wastelands.net>",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/gadicc/openfigi.git",
    },
    bugs: {
      url: "https://github.com/gadicc/openfigi/issues",
    },
    keywords: [
      "openfigi",
      "finance",
      "isin",
      "sedol",
    ],
    "engines": {
      "node": ">=20.0.0",
    },
  },
  importMap: "deno.json",

  // Use jsr import in deno.json for valibot once we get
  // https://github.com/jsr-que/async/pull/3

  // until we can solve @namespace/imports from jsr.  mappings don't work.
  typeCheck: false,

  postBuild() {
    Deno.copyFileSync("LICENSE.txt", "npm/LICENSE.txt");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
