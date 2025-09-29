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

console.log(
  await openfigi.mapping({
    idType: "TICKER",
    idValue: "AAPL",
    exchCode: "US",
  }),
);
```

**API docs**: https://jsr.io/@gadicc/openfigi/doc

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

## Roadmap

- [ ] APIs
  - [x] Mapping
  - [ ] Search
  - [ ] Filter

- [ ] Validation
- [ ] "next" support for long queries
