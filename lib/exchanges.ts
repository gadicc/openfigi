import _exchanges from "../data/exchanges.json" with { type: "json" };
import _micMap from "../data/mic_map.json" with { type: "json" };
import type { ExchCodeValue, MicCodeValue } from "./openfigi/all_values.ts";
import type { MappingJobObject } from "./openfigi/mapping.ts";
export type { MappingJobObject };

const micMap = _micMap as unknown as {
  exchCode: Partial<
    Record<ExchCodeValue, { MIC: MicCodeValue; operatingMIC: string }>
  >;
  MIC: Record<MicCodeValue, ExchCodeValue>;
  operatingMIC: Record<string, ExchCodeValue>;
};

export interface LocalExchange {
  type: "local";
  asOf: number;
  exchCode: ExchCodeValue;
  figiName: string;
  compositeCode: string;
  compositeName: string;
  countryCode: string;
  trueComposite: boolean;
  fullName: string;
}

export interface CryptoExchange {
  type: "crypto";
  asOf: number;
  exchCode: ExchCodeValue;
  name: string;
}

/**
 * @discriminator type
 */
export type Exchange = LocalExchange | CryptoExchange;

export type ExchangeWithMICs = Exchange & {
  MIC?: MicCodeValue | null;
  operatingMIC?: string | null;
};

export const exchanges = _exchanges as Partial<Record<ExchCodeValue, Exchange>>;

/**
 * Get Exchange by Exchange Code (exchCode)
 * @param exchCode - Exchange Code (exchCode)
 * @returns Exchange object with MIC and operatingMIC if available, otherwise null
 */
export function getExchange(exchCode: ExchCodeValue): Exchange | null;
/**
 * Get Exchange by object containing Exchange Code (exchCode)
 * @param MappingJobObject - Object with { exchCode: ExchCodeValue }
 * @returns Exchange object with MIC and operatingMIC if available, otherwise null
 */
export function getExchange(
  MappingJobObject: MappingJobObject,
): Exchange | null;

export function getExchange(
  exchCodeOrMappedObject: ExchCodeValue | MappingJobObject,
): Exchange | null {
  const exchCode = typeof exchCodeOrMappedObject === "string"
    ? exchCodeOrMappedObject
    : exchCodeOrMappedObject.exchCode;
  if (!exchCode) return null;

  const exchange = exchanges[exchCode];
  if (!exchange) return null;
  return {
    ...exchange,
    ...(micMap.exchCode[exchCode] && {
      MIC: micMap.exchCode[exchCode].MIC,
      operatingMIC: micMap.exchCode[exchCode].operatingMIC,
    }),
  };
}

/**
 * Get Exchange by Exchange Code (exchCode)
 * @param exchCode - Exchange Code (exchCode)
 * @returns Exchange object with MIC and operatingMIC if available, otherwise null
 */
export function getExchangeByExchCode(
  exchCode: ExchCodeValue,
): Exchange | null {
  return exchanges[exchCode] || null;
}

/**
 * Get Exchange Code (exchCode) by MIC
 * @param mic - MIC code
 * @returns Exchange Code (exchCode) if found, otherwise null
 */
export function getExchCodeByMIC(mic: MicCodeValue): ExchCodeValue | null {
  return micMap.MIC[mic] || null;
}

/**
 * Get Exchange Code (exchCode) by Operating MIC
 * @param operatingMIC - Operating MIC code
 * @returns Exchange Code (exchCode) if found, otherwise null
 */
export function getExchCodeByOperatingMIC(
  operatingMIC: string,
): ExchCodeValue | null {
  return micMap.operatingMIC[operatingMIC] || null;
}

/**
 * Get MIC by Exchange Code (exchCode)
 * @param exchCode - Exchange Code (exchCode)
 * @returns MIC code if found, otherwise null
 */
export function getMICByExchCode(
  exchCode: ExchCodeValue,
): MicCodeValue | null {
  return micMap.exchCode[exchCode]?.MIC || null;
}

/**
 * Get Operating MIC by Exchange Code (exchCode)
 * @param exchCode - Exchange Code (exchCode)
 * @returns Operating MIC code if found, otherwise null
 */
export function getOperatingMICByExchCode(
  exchCode: ExchCodeValue,
): string | null {
  return micMap.exchCode[exchCode]?.operatingMIC || null;
}
