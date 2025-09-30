import OpenFIGI from "../openfigi.ts";
import { describe, expect, it, useCache } from "../../tests/common.ts";

describe("mapping", () => {
  useCache();
  const openfigi = new OpenFIGI();

  it("fetches mapping values", async () => {
    const mapping = await openfigi.mapping({ value: "idType" });
    expect(mapping).toBeDefined();
    expect(mapping!.values).toBeDefined();
    expect(mapping!.values.length).toBeGreaterThan(0);
  });

  it("posts mapping request", async () => {
    const response = await openfigi.mapping([{
      idType: "TICKER",
      idValue: "AAPL",
      exchCode: "US",
    }]);
    expect(response).toBeDefined();
    expect(response.length).toBe(1);
    expect(response?.[0].data).toBeDefined();
    expect(response?.[0].data?.length).toBeGreaterThan(0);
    expect(response?.[0].data?.[0].figi).toBe("BBG000B9XRY4");
  });
});
