import mapping from "./mapping.ts";
export * from "./mapping.ts";

function envApiKey() {
  const status = Deno.permissions.querySync({
    name: "env",
    variable: "OPENFIGI_API_KEY",
  });
  if (status.state === "granted") {
    return Deno.env.get("OPENFIGI_API_KEY");
  }
  return null;
}

export default class OpenFIGI {
  BASE_URL = "https://api.openfigi.com/v3";
  API_KEY = envApiKey();

  constructtor(apiKey?: string) {
    if (apiKey) {
      this.API_KEY = apiKey;
    }
  }

  mapping = mapping;

  async fetch(endpoint: string, opts: {
    method?: "GET" | "POST";
    body?: Record<string, unknown>;
    params?: Record<string, string | number>;
  } = {}) {
    const headers = new Headers({
      "Content-Type": "application/json",
    });
    if (this.API_KEY) {
      headers.append("X-OPENFIGI-APIKEY", this.API_KEY);
    }

    const response = await fetch(
      this.BASE_URL + endpoint + (opts.params
        ? "?" +
          new URLSearchParams(opts.params as Record<string, string>).toString()
        : ""),
      {
        method: opts.method || "GET",
        headers,
        body: opts.body ? JSON.stringify(opts.body) : undefined,
      },
    );

    if (!response.ok) {
      throw new Error(
        `Error fetching mapping values: HTTP ${response.status}: ${response.statusText}; ${await response
          .text()}`,
      );
    }

    return response;
  }
}
