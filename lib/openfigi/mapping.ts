// https://www.openfigi.com/api/documentation#v3-post-mapping
import type OpenFIGI from "../openfigi.ts";
import type {
  CurrencyValue,
  ExchCodeValue,
  MarketSecDesValue,
  MicCodeValue,
  SecurityType2Value,
  SecurityTypeValue,
  StateCodeValue,
} from "./all_values.ts";
export * from "./all_values.ts";

/**
 * The properties that can be used in a *Mapping Job*.
 */
export const mappingJobProperties = [
  "idType",
  "exchCode",
  "micCode",
  "currency",
  "marketSecDes",
  "securityType",
  "securityType2",
  "stateCode",
] as const;
/**
 * The properties that can be used in a *Mapping Job*.
 */
export type MappingJobProperty = typeof mappingJobProperties[number];

/**
 * Type of third party identifier.
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

/** Options when performing a GET mapping request */
export interface GetMappingParams {
  value: MappingJobProperty;
}
/** Response for a GET mapping request */
export interface GetMappingResponse {
  values: string[];
}

/** Mapping Job criteria */
export interface MappingRequest {
  // -- These two are always required -- //

  /** Type of third party identifier. */
  idType: IdType;
  /** The value for the represented third party identifier. */
  idValue: string;

  // -- These rest are usually optional -- //

  /**
   * Exchange code of the desired instrument(s) (cannot use in conjunction
   * with `micCode`).
   */
  exchCode?: ExchCodeValue;
  /**
   * ISO market identification code(MIC) of the desired instrument(s)
   * (cannot use in conjunction with `exchCode`)
   */
  micCode?: MicCodeValue;
  /** Currency associated to the desired instrument(s). */
  currency?: CurrencyValue;
  /** Market sector description of the desired instrument(s). */
  marketSecDes?: MarketSecDesValue;
  /** Security type of the desired instrument(s). */
  securityType?: SecurityTypeValue;
  /**
   * An alternative security type of the desired instrument(s).
   * `securityType2` is typically less specific than `securityType`.
   * Use Market sector description if securityType2 is not available.
   * REQUIRED when `idType` is `BASE_TICKER` or `ID_EXCH_SYMBOL`.
   */
  securityType2?: SecurityType2Value | MarketSecDesValue;
  /** Set to true to include equity instruments that are not listed on an exchange. */
  includeUnlistedEquities?: boolean;
  /** Will filter instruments based on option type. */
  optionType?: "Call" | "Put";
  /**
   * Will find instruments whose strike price falls in an interval. Value
   * should be an `Array` interval of the form `[a, b]` where `a`, `b` are
   * `Numbers` or `null`. At least one entry must be a `Number`. When both
   * are `Number`s, it is required that `a <= b`. Also, `[a, null]` is
   * equivalent to the interval `[a, ∞)` and `[null, b]` is equivalent to
   * (-∞, b] .
   */
  strike?: [null, number] | [number, null] | [number, number];
  /**
   * Will find instruments whose contract size falls in an interval. Value
   * should be an `Array` interval of the form `[a, b]` where `a`, `b` are
   * `Numbers` or `null`. At least one entry must be a `Number`. When both
   * are `Number`s, it is required that `a <= b`. Also, `[a, null]` is
   * equivalent to the interval `[a, ∞)` and `[null, b]` is equivalent to
   * (-∞, b] .
   */
  contractSize?: [null, number] | [number, null] | [number, number];
  /**
   * Will find instruments whose coupon falls in an interval. Value
   * should be an `Array` interval of the form `[a, b]` where `a`, `b` are
   * `Numbers` or `null`. At least one entry must be a `Number`. When both
   * are `Number`s, it is required that `a <= b`. Also, `[a, null]` is
   * equivalent to the interval `[a, ∞)` and `[null, b]` is equivalent to
   * (-∞, b] .
   */
  coupon?: [null, number] | [number, null] | [number, number];
  /**
   * Will find instruments whose expiration date falls in an interval. Value
   * should be an `Array` interval of the form `[a, b]` where `a`, `b` are
   * date `string` or `null`. At least one entry must be a date `string`.
   * When both are date `string`s, it is required that `a` and `b` are not
   * more than one year apart. Also, `[a, null]` is equivalent to the interval
   * `[a, a + (1 year)]` and `[null, b]` is equivalent to `[b - (1 year), b]`.
   *
   * REQUIRED when `securityType2` is `Option` or `Warrant`.
   */
  expiration?: [null, string] | [string, null] | [string, string];
  /**
   * Will find instruments whose expiration date falls in an interval. Value
   * should be an `Array` interval of the form `[a, b]` where `a`, `b` are
   * date `string` or `null`. At least one entry must be a date `string`.
   * When both are date `string`s, it is required that `a` and `b` are not
   * more than one year apart. Also, `[a, null]` is equivalent to the interval
   * `[a, a + (1 year)]` and `[null, b]` is equivalent to `[b - (1 year), b]`.
   *
   * REQUIRED when `securityType2` is `Pool`.
   */
  maturity?: [null, string] | [string, null] | [string, string];
  /** State code of the desired instrument(s). */
  stateCode?: StateCodeValue;
}

/** Options when performing a POST mapping request */
export type PostMappingRequest = MappingRequest[];

/** The result format of a Mapping Job */
export type MappingJobObject = {
  /**
   * @example "BBG000B9XVV8"
   */
  figi: string;

  // --- Enum-like attributes of the instrument. --- //

  /**
   * Security type of the desired instrument(s).
   * @example "Common Stock"
   */
  securityType: SecurityTypeValue | null;
  /**
   * Market sector description of the desired instrument(s).
   * @example "Equity"
   */
  marketSector: MarketSecDesValue | null;
  /**
   * Exchange code of the desired instrument(s).
   * @example "UN"
   */
  exchCode: ExchCodeValue | null;
  /**
   * An alternative security type of the desired instrument(s).
   * @example "Common Stock"
   */
  securityType2: SecurityType2Value | null;

  // --- Various attributes of the instrument --- //

  /**
   * Ticker is a specific identifier for a financial instrument that reflects common usage.
   * @example "AAPL"
   */
  ticker: string | null;
  /** @example "APPLE INC" */
  name: string | null;
  /** @example "BBG001S5N8V8" */
  shareClassFIGI: string | null;
  /** @example "BBG000B9XRY4" */
  compositeFIGI: string | null;
  /** @example "AAPL" */
  securityDescription: string | null;
  /** Exists when API is unable to show non-FIGI fields. */
  metadata?: string | null;
};

/** Response for a POST mapping request */
export interface PostMappingResponse {
  /** Is present when FIGI(s) are found for the associated Mapping Job. */
  data?: MappingJobObject[];
  /**
   * Is present when
   * - Single job result exceeds 15,000 FIGIs.
   * - There was an unexpected error when processing the request.
   */
  error?: string;
  /** Is present when no FIGI is found. */
  warning?: string;
}

/**
 * Get the current list of values for the enum-like properties on *Mapping Jobs*.
 * @example
 * ```ts
 * // [ "Comdty", "Corp", "Curncy", "Equity", "Govt", "Index", "M-Mkt", ... ]
 * const values = await openfigi.mapping({ value: "marketSecDes" });
 * ```
 */
export default async function mapping(
  this: OpenFIGI,
  params: GetMappingParams,
): Promise<GetMappingResponse>;

/**
 * Map third party identifiers to FIGIs.
 * @example
 * ```ts
 * const figi = await openfigi.mapping([
 *   { "idType": "TICKER", "idValue": "IBM", "exchCode": "UN" }
 * ]);
 *
 * // Results:
 * [
 *  {
 *    "data": [
 *      {
 *        "figi": "BBG000NHN466",
 *        "securityType": "Common Stock",
 *        "marketSector": "Equity",
 *        "ticker": "IBMGBX",
 *        "name": "INTL BUSINESS MACHINES CORP",
 *        "exchCode": "EU",
 *        "shareClassFIGI": "BBG001S5S399",
 *        "compositeFIGI": "BBG000NHN304",
 *        "securityType2": "Common Stock",
 *        "securityDescription": "IBMGBX"
 *      }
 *    ],
 *    // ...
 *  },
 *  // ...
 * ]
 * ```
 */
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
    if (!mappingJobProperties.includes(params.value)) {
      throw new Error(
        `Invalid value for params.value. Must be one of: ${
          mappingJobProperties.join(
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
