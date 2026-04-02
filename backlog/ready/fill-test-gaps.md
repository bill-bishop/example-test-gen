# Fill Test Gaps

**Status**: Ready  
**Priority**: Medium  
**Created**: 2026-04-01

## Overview

This document identifies test coverage gaps in the codebase. Requirements from `docs/REQUIREMENTS.md` that lack `@example` test annotations, and source files without any `@example` tests.

---

## Requirements Missing @example Tests

| Req ID | Description | Target File | Notes |
|--------|-------------|-------------|-------|
| **CLI07** | `--root-dir` flag to override source root for finding @examples | `cli.ts` | Flag exists in code, needs @example test |
| **SDK02** | Export TypeScript types (`SnippetInfo`, `MapperResult[]`, `MapperFn`, `Config`) | `types.ts` or `index.ts` | Types exported but not tested via @example |
| **CORE01** | Source discovery: Find files matching `include` globs, excluding `exclude` globs | `extractor.ts` | `findFiles()` function untested |
| **CORE02** | Extract ALL code snippets from JSDoc @example blocks and pass as batch to mapper | `extractor.ts` | Partially covered by CORE05 test, needs dedicated test |
| **CORE03** | Parse optional description, code fence language hint, snippet body | `extractor.ts` | Description parsing tested indirectly, needs explicit test |
| **CORE04** | Identify and separate ES module imports from executable code | `extractor.ts` | Import extraction logic untested |
| **CORE06** | Strip `rootDir` prefix from source file paths when computing output structure | `config.ts` | Config property exists, needs @example verification |
| **CORE07** | Accept glob arrays for `include`/`exclude` controlling source file matching | `config.ts` | Config property exists, needs @example verification |
| **TRANS01** | Jest mapper: Generate ONE test file with multiple `it()` blocks per source | `builtins.ts` | `createJestMapper()` needs @example test |
| **TRANS03** | Include source file path, description, auto-generated notice in test file header | `builtins.ts` | Header generation untested |
| **TRANS04** | Separate imports section from test body; deduplicate imports | `builtins.ts` | Deduplication logic needs @example verification |
| **TRANS07** | Overwrite existing test files without prompting (idempotent generation) | `config.ts` | `overwrite` flag exists, needs @example test |
| **TRANS08** | Auto-import all exports from source file in generated tests | `builtins.ts` | Auto-import logic needs @example verification |
| **TRANS09** | Jest built-in defaults: tsconfig.json detection, default paths | `builtins.ts` | Default resolution logic needs @example coverage |
| **TRANS10** | Vitest built-in defaults: tsconfig.json detection, default paths | `builtins.ts` | Default resolution logic needs @example coverage |
| **META01** | Self-testing: Library generates/runs its own tests via @example | All files | Dogfooding - requires running generated tests |

---

## Source Files Without @example Tests

| File | Lines | Has Tests | Missing Coverage |
|------|-------|-----------|------------------|
| `src/types.ts` | 47 | **NO** | All type definitions - should have @example showing usage |
| `src/outputs.ts` | 39 | **NO** | Output utilities (`readOutputFile`, `renderOutput`, `printOutput`, `printErrorAndExit`, `formatErrorList`) |

---

## Summary

- **Total Requirements**: 24
- **Requirements with @example coverage**: 8
- **Requirements MISSING @example coverage**: 16
- **Source files with @example tests**: 6 / 8
- **Source files WITHOUT @example tests**: 2 / 8

### Coverage by Category

| Category | Total | Covered | Missing |
|----------|-------|---------|---------|
| CLI | 7 | 6 | 1 (CLI07) |
| SDK | 5 | 3 | 2 (SDK02) |
| CORE | 7 | 1 | 6 (CORE01-04, 06-07) |
| TRANS | 9 | 1 | 8 (TRANS01, 03-04, 07-10) |
| META | 1 | 0 | 1 (META01) |

---

## Recommended Priority

### High Priority
1. `src/types.ts` - Add @example tests for type usage patterns (blocks SDK02)
2. `src/outputs.ts` - Add @example tests for output utilities
3. CORE01, CORE02, CORE03, CORE04 - Core extraction functionality
4. TRANS01 - Jest mapper (Vitest mapper TRANS02 has coverage, Jest lacks parity)

### Medium Priority
5. CLI07 - Root directory flag test
6. TRANS03, TRANS04 - Output generation features
7. CORE06, CORE07 - Config path/glob handling

### Lower Priority
8. TRANS07-10 - Additional mapper features
9. META01 - Full dogfooding (requires test runner integration)

---

## Notes

- Some requirements (TRANS05) are marked Post-MVP/deferred and are excluded from this gap analysis
- The requirements table in `docs/REQUIREMENTS.md` shows "Tests Completed" column which aligns with this analysis
- Files `types.ts` and `outputs.ts` are utility modules that may have been overlooked for @example coverage
