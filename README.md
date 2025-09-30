# OpenFigi

A tiny type-safe API around OpenFIGI

Copyright (c) 2025 by Gadi Cohen <dragon@wastelands.net>.
[MIT licensed](./LICENSE.txt).

[![npm](https://img.shields.io/npm/v/openfigi)](https://www.npmjs.com/package/openfigi)
[![Tests](https://github.com/gadicc/openfigi/actions/workflows/test-release.yaml/badge.svg)](https://github.com/gadicc/openfigi/actions/workflows/test-release.yaml)
[![coverage](https://img.shields.io/codecov/c/github/gadicc/openfigi)](https://codecov.io/gh/gadicc/openfigi)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

## Quick Start

```ts
import OpenFIGI from "openfigi";

// with optional: { apiKey: "" } or OPENFIGI_API_KEY in env.
const openfigi = new OpenFIGI();

const result = await openfigi.mapping([{
  idType: "TICKER",
  idValue: "AAPL",
  exchCode: "US",
}]);

[
  {
    data: [
      {
        figi: "BBG000B9XRY4",
        name: "APPLE INC",
        ticker: "AAPL",
        exchCode: "US",
        compositeFIGI: "BBG000B9XRY4",
        securityType: "Common Stock",
        marketSector: "Equity",
        shareClassFIGI: "BBG001S5N8V8",
        securityType2: "Common Stock",
        securityDescription: "AAPL",
      },
    ],
  },
];

// or with openfigi.search()
const result = await openfigi.filter({
  query: "Amazon",
  currency: "USD",
  marketSecDes: "Equity",
  securityType: "Common Stock",
});
```

**API docs**: https://jsr.io/@gadicc/openfigi/doc/~/OpenFIGI

## Intro

> "The Open Financial Instrument Global Identifier web portal (OpenFIGI) is your
> entry point to multiple tools for identifying, mapping and requesting the free
> and Open Symbology dataset."

_Source: https://openfigi.com/_

This package provides a small wrapper for better DX in TypeScript. This is a
**new package since October 2025** and is still a **work in progress**. Types
and symbol names might still change, and feedback is welcome.

OpenFIGI already provide an [OpenAPI schema](https://api.openfigi.com/schema).
This package servers as an opinionated, less-verbose alternative to simply using
the schema with regular tools - the overriding goal being a good developer
experience (DX).

## OpenFIGI Limitations

1. **OpenFIGI does not return third-party proprietary identifiers** (examples:
   ISIN, CUSIP, SEDOL) through its public API because of licensing /
   redistribution restrictions.

   **You can submit those identifiers as input** (they’re accepted as
   idType/idValue in mapping requests), but they will not be returned back in
   the mapping results. Some identifier fields are available only in Bloomberg’s
   licensed products / data license offerings or terminal, not via the free
   OpenFIGI site/API.

   Practically speaking, even if you specify an identifier for a **single
   listing** (e.g. a SEDOL), your request will map back to an underlying
   identifier and return **all listings of that identifier** (and not a single
   result). So, you can't reconstruct such data through reverse queries. You can
   however, use request filters such as `exchCode`, `micCode`, `marketSecDes`,
   etc., to narrow mapping results when you need a specific listing or
   market-level match.

   If you’re new to finance or coming from the open-source world, these
   restrictions are common - redistributable copies of proprietary identifiers
   typically require a commercial license and contractual controls, and even
   audits.

## Exchange Info

We provide exchange info and mappings from a number of publicly available
sources. **They are neither complete nor guaranteed to be up-to-date**, however,
are still useful. Since it's a lot of data, it's not part of the main export and
you should import separately.

```ts
import { getExchange } from "openfigi/exchanges";
const exchange = getExchange("UA") // or getExchange({ exchCode: "UA", ... })
{
  exchCode: "UA",
  asOf: 2024,
  type: "local",
  figiName: "NYSEAmerican",
  compositeCode: "US",
  compositeName: "United States",
  countryCode: "US",
  trueComposite: true,
  fullName: "NYSE American",
  MIC: "XASE",
  operatingMIC: "XNYS"
}
```

All exchanges:

```ts
import { exchanges } from "openfigi/exchanges";
exchanges;
{
  AC: {
    exchCode: 'AC',
    // ...
  }
}
```

See the [exchanges API docs](https://jsr.io/@gadicc/openfigi/doc/exchanges) for
all methods.

NB: only `getExchange()` automatically maps `MIC` and `operatingMIC` when
available. When using other methods, you should combine with
`getMICByExchCode()` and/or `getOperatingMICByExchCode()`.

See [`scripts/mic_map.ts`](./scripts/mic_map.ts) and
[`scripts/exchanges.ts`](./scripts/exchanges.ts) to see how this data is
generated and what sources were used.

## Roadmap

- [ ] Validation
