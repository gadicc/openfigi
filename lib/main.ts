import mapping from "./mapping.ts";
export * from "./mapping.ts";

function envApiKey(): string | null | undefined {
  const status = Deno.permissions.querySync({
    name: "env",
    variable: "OPENFIGI_API_KEY",
  });
  if (status.state === "granted") {
    return Deno.env.get("OPENFIGI_API_KEY");
  }
  return null;
}

/**
 * Creates a new OpenFIGI client.
 *
 * @param apiKey Optional API key. If not provided, will look for `OPENFIGI_API_KEY` environment variable.
 * If not found, will proceed without an API key (with lower limits).
 *
 * @see {link https://www.openfigi.com/api/documentation#api-key}
 * @see {link https://www.openfigi.com/api/documentation#rate-limits}
 */
export default class OpenFIGI {
  BASE_URL = "https://api.openfigi.com/v3";
  API_KEY = envApiKey() as string | undefined | null;

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
  } = {}): Promise<Response> {
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
