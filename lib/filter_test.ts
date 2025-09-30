import OpenFIGI from "../lib/main.ts";
import { describe, expect, it, useCache } from "../tests/common.ts";

describe("filter", () => {
  useCache();
  const openfigi = new OpenFIGI();

  it("fetches filter results", async () => {
    const filterResult = await openfigi.filter({
      exchCode: "US",
    });
    expect(filterResult).toBeDefined();
    expect(filterResult.data).toBeDefined();
    expect(filterResult.data.length).toBeGreaterThan(0);
    expect(filterResult.data[0].exchCode).toBe("US");
  });
});
