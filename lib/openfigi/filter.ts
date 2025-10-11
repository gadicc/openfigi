import type OpenFIGI from "../openfigi.ts";
import type { SearchRequest, SearchResponse } from "./search.ts";

interface FilterResponse extends SearchResponse {
  total?: number;
}

/**
 * Search for FIGIs using key words and other filters. The results are
 * listed alphabetically by FIGI and include the number of results.
 */
export default async function filter(
  this: OpenFIGI,
  query: SearchRequest,
): Promise<FilterResponse> {
  const response = await this._fetch("/filter", {
    method: "POST",
    body: query as Record<string, unknown>,
  });

  return await response.json() as FilterResponse;
}
