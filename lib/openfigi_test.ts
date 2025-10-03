import OpenFIGI from "./openfigi.ts";
import { describe, expect, it, useCache } from "../tests/common.ts";

describe("openfigi", () => {
  useCache();
  const openfigi = new OpenFIGI();

  describe("error handling", () => {
    it("http errors", async () => {
      await expect(openfigi.fetch("/invalid-endpoint", { method: "GET" }))
        .rejects.toThrow("HTTP 404: Not Found; Invalid url.");
    });

    it("invalid API key", async () => {
      const of = new OpenFIGI({ apiKey: "INVALID" });
      await expect(
        of.mapping([{
          idType: "TICKER",
          idValue: "AAPL",
          exchCode: "US",
        }]),
      )
        .rejects.toThrow("HTTP 401: Unauthorized; Invalid API key.");
    });
  });
});
