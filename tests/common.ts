import { afterAll, beforeAll, describe, it } from "@std/testing/bdd";
import { spy } from "@std/testing/mock";
import { expect } from "@std/expect";
import createFetchCache from "@gadicc/fetch-mock-cache/runtimes/deno.ts";
import Store from "@gadicc/fetch-mock-cache/stores/fs.ts";

const fetchCache = createFetchCache({ Store });

export function useCache() {
  let originalFetch: typeof fetch;
  beforeAll(() => {
    originalFetch = globalThis.fetch;
    globalThis.fetch = fetchCache;
  });
  afterAll(() => {
    globalThis.fetch = originalFetch;
  });
}

export { describe, expect, it, spy };
