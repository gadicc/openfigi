# Repository Guidelines

## Project Structure & Module Organization

The runtime lives in `lib/`, with `openfigi.ts` exporting the client and
`exchanges.ts` shipping exchange helpers. Scripts in `scripts/` fetch upstream
data (`retrieve.ts`, `exchanges.ts`, `mic_map.ts`) and support the npm build.
Tests reside under `tests/` using BDD helpers, with recorded HTTP fixtures in
`tests/fixtures/http`. Reference data snapshots are kept in `data/`, while
`npm/` holds the generated package when running the build pipeline. Coverage
artifacts such as `coverage/` and `lcov.info` are disposable outputs.

## Build, Test, and Development Commands

Use `deno task test` for the full suite; it runs with `-A` to exercise live
fetch logic against the cache. `deno task coverage` aggregates coverage and
writes `lcov.info`. Refresh remote datasets with `deno task retrieve`,
`deno task exchanges`, and `deno task mic-map` before shipping data updates.
Build the npm package via `deno task build:npm`, which writes to `npm/`. Run
`deno task pre-commit` to type-check, lint, and format-check before opening a
PR. For unit tests, co-locate alongst source file (e.g. `mapping.ts` has a
`mapping_test.ts`). Tests against code from multiple files (e.g. E2E if any) can
go in `tests/` if it makes sense.

## Coding Style & Naming Conventions

Code is TypeScript targeting Deno's standard style: `deno fmt` enforces 2-space
indentation and trailing commas. Default to ES module syntax and named exports
unless a default mirrors the client API. File names are lowercased with hyphens
only for scripts; library modules stick to concise nouns (e.g., `openfigi.ts`).
Use camelCase for variables and functions, PascalCase for classes such as
`OpenFIGI`, and align imports using Deno's `jsr:` specifiers.

## Testing Guidelines

Tests rely on `@std/testing/bdd` (`describe`, `it`, `beforeAll`) and
`@std/expect`. Start new specs in `tests/` with descriptive `*.test.ts`
filenames. Reuse `tests/common.ts`'s `useCache()` helper to stub fetch through
cached fixtures. If recording new HTTP interactions, commit the generated JSON
fixtures under `tests/fixtures/http` for deterministic runs.

## Commit & Pull Request Guidelines

Commits follow Conventional Commits (`feat:`, `chore(pkg):`, etc.); include a
scope when touching a sub-area like `lib` or `scripts`. Keep subjects imperative
and under 72 characters. PRs should explain the feature or fix, link issues when
applicable, note data refresh commands run, and attach screenshots or sample
output when touching developer tooling. Confirm `deno task pre-commit` and
`deno task test` in the PR description.
