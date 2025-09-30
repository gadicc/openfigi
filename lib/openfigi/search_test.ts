import OpenFIGI from "../openfigi.ts";
import { describe, expect, it, useCache } from "../../tests/common.ts";

describe("search", () => {
  useCache();
  const openfigi = new OpenFIGI();

  it("fetches search results", async () => {
    const searchResult = await openfigi.search({
      query: "Apple",
    });
    expect(searchResult).toBeDefined();
    expect(searchResult.data).toBeDefined();
    expect(searchResult.data.length).toBeGreaterThan(0);
    expect(searchResult.data[0].name).toBe("APPLE INC");
  });
});
