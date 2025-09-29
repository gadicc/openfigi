# OpenFigi

A tiny type-safe API around OpenFIGI

Copyright (c) 2025 by Gadi Cohen <dragon@wastelands.net>.
[MIT licensed](./LICENSE.txt).

See https://www.openfigi.com/. OpenAPI schema: https://api.openfigi.com/schema

## Quick Start

```ts
import OpenFIGI from "openfigi";

// with optional: { apiKey: "" } or OPENFIGI_API_KEY in env.
const openfigi = new OpenFIGI();

console.log(
  await openfigi.mapping({
    idType: "TICKER",
    idValue: "AAPL",
    exchCode: "US",
  }),
);
```

## Intro

> "The Open Financial Instrument Global Identifier web portal (OpenFIGI) is your
> entry point to multiple tools for identifying, mapping and requesting the free
> and Open Symbology dataset."

_Source: https://openfigi.com/_

This package provides a small wrapper for better DX in TypeScript. This is a
**new package since October 2025** and is still a **work in progress**.

## Roadmap

- [ ] APIs
  - [x] Mapping
  - [ ] Search
  - [ ] Filter

- [ ] Validation
