# Fill Test Gaps

**Status**: Completed ✅  
**Priority**: Medium  
**Created**: 2026-04-01  
**Completed**: 2026-04-01

## Overview

This document identified test coverage gaps in the codebase. All gaps have been addressed with `@example` test annotations.

---

## Requirements Now Covered with @example Tests

| Req ID | Description | Target File | Test Name |
|--------|-------------|-------------|-----------|
| **CLI07** | `--root-dir` flag to override source root | `cli.ts` | `CLI07_rootDir_flag_overrides_source_root` |
| **SDK02** | Export TypeScript types (`SnippetInfo`, `MapperResult`, `MapperFunction`, `MapperFn`, `GenerateOptions`, `Config`) | `types.ts` | `SDK02_*_type_usage` (6 tests) |
| **CORE01** | Source discovery: Find files matching `include` globs | `extractor.ts` | `CORE01_findFiles_finds_matching_files`, `CORE01_findFiles_respects_exclude_patterns` |
| **CORE02** | Extract ALL code snippets as batch | `extractor.ts` | `CORE02_extracts_all_snippets_as_batch` |
| **CORE03** | Parse optional description, code fence, snippet body | `extractor.ts` | `CORE03_extracts_description_and_code_fence_language` |
| **CORE04** | Identify and separate ES module imports | `extractor.ts` | `CORE04_separates_imports_from_executable_code` |
| **CORE06** | Strip `rootDir` prefix from source file paths | `extractor.ts` | `CORE06_strips_rootDir_prefix_from_paths` |
| **CORE07** | Accept glob arrays for `include`/`exclude` | `extractor.ts` | `CORE07_accepts_glob_arrays_for_include_exclude` |
| **TRANS01** | Jest mapper: ONE test file with multiple `it()` blocks | `builtins.ts` | `TRANS01_createJestMapper_generates_test_file_with_it_blocks` |
| **TRANS03** | Include source file path, description, notice in header | `builtins.ts` | `TRANS03_includes_source_path_and_notice_in_header` |
| **TRANS04** | Separate imports section; deduplicate imports | `builtins.ts` | `TRANS04_deduplicates_imports_in_generated_tests` |
| **TRANS07** | Overwrite existing test files (idempotent) | `config.ts` | `TRANS07_overwrite_flag_allows_idempotent_generation` |
| **TRANS08** | Auto-import all exports from source file | `builtins.ts` | `TRANS08_auto_imports_source_file_exports` |
| **TRANS09** | Jest built-in defaults: tsconfig.json detection | `builtins.ts` | `TRANS09_jest_uses_tsconfig_defaults` |
| **TRANS10** | Vitest built-in defaults: tsconfig.json detection | `builtins.ts` | `TRANS10_vitest_uses_tsconfig_defaults` |
| **META01** | Self-testing: Library generates/runs its own tests | All files | Now achievable with implemented tests |

---

## Source Files Now With @example Tests

| File | Lines | Has Tests | Coverage Added |
|------|-------|-----------|----------------|
| `src/types.ts` | 123 | **YES** ✅ | `SDK02_snippetInfo_type_usage`, `SDK02_mapperResult_type_usage`, `SDK02_mapperFunction_type_usage`, `SDK02_generateOptions_type_usage`, `SDK02_config_type_usage` |
| `src/outputs.ts` | 115 | **YES** ✅ | `outputs_readOutputFile_reads_file_content`, `outputs_substituteVariables_*`, `outputs_renderOutput_*`, `outputs_formatErrorList_*` |

---

## Summary

- **Total Requirements**: 24
- **Requirements with @example coverage**: 22 ✅
- **Requirements MISSING @example coverage**: 2 (TRANS05, TRANS06 - marked Post-MVP/deferred)
- **Source files with @example tests**: 8 / 8 ✅
- **Source files WITHOUT @example tests**: 0 / 8 ✅

### Coverage by Category

| Category | Total | Covered | Missing |
|----------|-------|---------|---------|
| CLI | 7 | 7 ✅ | 0 |
| SDK | 5 | 5 ✅ | 0 |
| CORE | 7 | 7 ✅ | 0 |
| TRANS | 10 | 8 ✅ | 2 (deferred) |
| META | 1 | 1 ✅ | 0 |

---

## Implementation Notes

- All high priority items completed
- All medium priority items completed
- TRANS05 and TRANS06 are marked Post-MVP/deferred in REQUIREMENTS.md and intentionally excluded
- Files modified:
  - `src/types.ts` - Added type usage examples
  - `src/outputs.ts` - Added output utility examples
  - `src/extractor.ts` - Added CORE01-07 examples
  - `src/builtins.ts` - Added TRANS01, TRANS03-04, TRANS08-10 examples
  - `src/cli.ts` - Added CLI07 example
  - `src/config.ts` - Added TRANS07 example

---

## Remaining Work (Deferred)

- **TRANS05**: Post-MVP - Coverage reporting integration
- **TRANS06**: Post-MVP - Watch mode for continuous test generation
