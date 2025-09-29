// https://www.openfigi.com/api/documentation#v3-post-mapping
import type OpenFIGI from "./main.ts";

export const mappingValues = [
  "idType",
  "exchCode",
  "micCode",
  "currency",
  "marketSecDes",
  "securityType",
  "securityType2",
  "stateCode",
] as const;
export type MappingValueKey = typeof mappingValues[number];

/**
 * @see {link https://www.openfigi.com/api/documentation#v3-id-type-values}
 */
export type IdType =
  /**
   * ISIN - International Securities Identification Number.
   * @example
   * [{"idType":"ID_ISIN","idValue":"XX1234567890"}]
   */
  | "ID_ISIN"
  | "ID_BB_UNIQUE"
  | "ID_SEDOL"
  | "ID_COMMON"
  | "ID_WERTPAPIER"
  | "ID_CUSIP"
  | "ID_CINS"
  | "ID_BB"
  | "ID_BB_8_CHR"
  | "ID_TRACE"
  | "ID_ITALY"
  | "ID_EXCH_SYMBOL"
  | "ID_FULL_EXCHANGE_SYMBOL"
  | "COMPOSITE_ID_BB_GLOBAL"
  | "ID_BB_GLOBAL_SHARE_CLASS_LEVEL"
  | "ID_BB_GLOBAL"
  | "ID_BB_SEC_NUM_DES"
  | "TICKER"
  | "BASE_TICKER"
  | "ID_CUSIP_8_CHR"
  | "OCC_SYMBOL"
  | "UNIQUE_ID_FUT_OPT"
  | "OPRA_SYMBOL"
  | "TRADING_SYSTEM_IDENTIFIER"
  | "ID_SHORT_CODE"
  | "VENDOR_INDEX_CODE";

export interface GetMappingParams {
  value: MappingValueKey;
}
export interface GetMappingResponse {
  values: string[];
}

export interface MappingRequest {
  /**
   * Type of third party identifier.
   * @see {@linkcode IdType}
   */
  idType: IdType;
  /** The value for the represented third party identifier. */
  idValue: string;
  // -- Above are required, below are optional -- //
  /**
   * Exchange code of the desired instrument(s) (cannot use in conjunction with `micCode`).
   * @see {@link https://api.openfigi.com/v3/mapping/values/exchCode | List of `exchCode` values}
   */
  exchCode?: string;
  /**
   * ISO market identification code(MIC) of the desired instrument(s) (canno
   * use in conjunction with `exchCode`)
   * @see {@link https://api.openfigi.com/v3/mapping/values/micCode | List of `micCode` values}
   */
  micCode?: string;
  currency?: string;
  marketSecDes?: string;
  securityType?: string;
  securityType2?: string;
  includeUnlistedEquities?: boolean;
  optionType?: "Call" | "Put";
  strike?: [null, number] | [number, null];
  contractSize?: [null, number] | [number, null];
  coupon?: [null, number] | [number, null];
  expiration?: [null, number] | [number, null];
  maturity?: [null, number] | [number, null];
  /**
   * State code of the desired instrument(s).
   * @see {@link https://api.openfigi.com/v3/mapping/values/stateCode | List of `stateCode` values}
   */
  stateCode?: string;
}
export type PostMappingRequest = MappingRequest[];

export type MappingJobObject = {
  figi: string;
  // Enum-like attributes of the instrument.
  securityType: string | null;
  marketSector: string | null;
  exchCode: string | null;
  securityType2: string | null;
  // Various attributes of the instrument.
  ticker: string | null;
  name: string | null;
  shareClassFIGI: string | null;
  compositeFIGI: string | null;
  securityDescription: string | null;
  /** When the above attributes are unavailable or unable to be shown, this property is present. */
  metadata?: "Metadata N/A" | unknown;
};

export interface PostMappingResponse {
  data?: MappingJobObject[];
}

export default async function mapping(
  this: OpenFIGI,
  params: GetMappingParams,
): Promise<GetMappingResponse>;

export default async function mapping(
  this: OpenFIGI,
  params: PostMappingRequest,
): Promise<PostMappingResponse[]>;

export default async function mapping(
  this: OpenFIGI,
  params: GetMappingParams | PostMappingRequest,
): Promise<GetMappingResponse | PostMappingResponse[]> {
  if (typeof params !== "object" || params === null) {
    throw new Error("params must be an object");
  }

  // GetMappingParams
  if ("value" in params) {
    if (!mappingValues.includes(params.value)) {
      throw new Error(
        `Invalid value for params.value. Must be one of: ${
          mappingValues.join(
            ", ",
          )
        }`,
      );
    }
    const response = await this.fetch("/mapping/values/" + params.value);
    return (await response.json()) as GetMappingResponse;
  }

  if (Array.isArray(params) === false) {
    throw new Error(
      "params must {value: 'type'} or an array of mapping requests",
    );
  }

  const response = await this.fetch("/mapping", {
    method: "POST",
    body: params as unknown as Record<string, unknown>,
  });

  return (await response.json()) as PostMappingResponse[];
}
