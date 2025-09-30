import type OpenFIGI from "./main.ts";
import type { MappingJobObject, MappingRequest } from "./mapping.ts";

export interface SearchRequest
  extends Omit<MappingRequest, "idType" | "idValue"> {
  /** Key words */
  query?: string;
  /**
   * The number of results returned for any given request is fixed. When
   * more results are accessible, the response will contain a `next` property
   * whose value should be sent in succeeding requests as the value of the
   * `start` property. This will notify the API to return the next "page" of
   * results.
   */
  start?: string;
}

export type SearchResponse = {
  /** The FIGI results matching the search */
  data: MappingJobObject[];
  /**
   * Present when more results are accessible for the query. To get the next
   * "page" of results for the query, send the same search request except with
   * the `start` property's value set to the value provided here.
   */
  next?: string;
  /**
   * Is present when
   * - Single job result exceeds 15,000 FIGIs.
   * - There was an unexpected error when processing the request.
   */
  error?: string;
};

/**
 * Search for FIGIs using key words and other filters.
 */
export default async function search(
  this: OpenFIGI,
  query: SearchRequest,
): Promise<SearchResponse> {
  const response = await this.fetch("/search", {
    method: "POST",
    body: query as Record<string, unknown>,
  });

  return await response.json() as Promise<SearchResponse>;
}
