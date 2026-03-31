# example-test-gen

Generate test files from `@example` snippets in your code.

[ UNDER CONSTRUCTION ] 2026-03-31 - This package is still being built! Tune in later!

## Contents

- [Overview](#overview)
- [Requirements](#requirements)

## Overview

`example-test-gen` extracts test code from JSDoc `@example` annotations and generates runnable test files.

## Requirements

These requirements have been rewritten and defined since the core code was initially created.
When implementing new features or modifying existing ones, please refer to these requirements to ensure compliance.

The existing code should be updated to meet these requirements where applicable.

| ID | Requirement (plain language) | Test Pattern(s) | User Reviewed | Tests Completed |
|----|------------------------------|-----------------|---------------|-----------|
| **CLI01** | **CLI Entry**: Executable as `npx example-test-gen` with `--help` and `--version` flags | End-to-end CLI tests via @example in `cli.ts` | [x] | [x] |
| **CLI02** | **Built-in Configs**: Support `--config=jest` and `--config=vitest` for zero-config test generation | End-to-end CLI tests via @example in `cli.ts` | [x] | [x] |
| **CLI03** | **Custom Config Path**: Support `--config=./path.mjs` for user-defined config files | End-to-end CLI tests via @example in `cli.ts` | [x] | [x] |
| **CLI04** | **CLI Error Handling**: Clear error messages for missing config, invalid config paths, and config load failures | End-to-end CLI tests via @example in `cli.ts` | [x] | [x] |
| **CLI05** | **CLI Files Override**: Support `--files` flag for ad-hoc file selection without config file (e.g., `--files="src/**/*.ts"` or `--files="src/a.ts,src/b.ts"`) | End-to-end CLI tests via @example in `cli.ts` | [x] | [x] |
| **CLI06** | **CLI Output Directory**: Support `--outDir` flag to override the default output directory (e.g., `--outDir=./generated-tests`) | End-to-end CLI tests via @example in `cli.ts` | [x] | [x] |
| **SDK01** | **Programmatic API**: Export `generateTests()` function as primary entry point | Contract tests via @example in `index.ts` | [x] | [ ] |
| **SDK02** | **API Types**: Export TypeScript types (`SnippetInfo`, `MapperResult[]`, `MapperFn`, `Config`). MapperFn receives `SnippetInfo[]` and returns `MapperResult[]` | Contract tests via @example in `index.ts` | [x] | [ ] |
| **SDK03** | **Built-in Mappers Export**: Export `jestMapper` and `vitestMapper` for SDK consumers | Contract tests via @example in `builtins.ts` | [x] | [ ] |
| **SDK04** | **Config Object Support**: Accept `files` (string or string[] with glob support), `mapper` (function or built-in name), and `outDir` (string) | Integration tests via @example in `config.ts` | [x] | [ ] |
| **SDK05** | **Config Validation**: Validate required fields (`files`, `mapper` or built-in ref) with helpful error messages | Unit tests via @example in `config.ts` | [x] | [ ] |
| **CORE01** | **Source Discovery**: Find source files from `files` glob(s) (supports `**/*` style paths) | Unit tests via @example in `extractor.ts` | [x] | [ ] |
| **CORE02** | **@example Extraction**: Extract ALL code snippets from JSDoc `@example` blocks in a file and pass them as a batch to the mapper | Unit tests via @example in `extractor.ts` | [x] | [ ] |
| **CORE03** | **Snippet Parsing**: Parse optional description, code fence language hint, and snippet body | Unit tests via @example in `extractor.ts` | [x] | [ ] |
| **CORE04** | **Import Extraction**: Identify and separate ES module imports from executable code in snippets | Unit tests via @example in `extractor.ts` | [x] | [ ] |
| **CORE05** | **Multiple Snippets**: Detect and extract all @example blocks when multiple are present in a single source file | Unit tests via @example in `extractor.ts` | [x] | [ ] |
| **TRANS01** | **Jest Mapper**: Receive all snippets from a source file, generate ONE test file with multiple `it()` blocks (one per snippet) inside a `describe()` block | Unit tests via @example in `builtins.ts` | [x] | [ ] |
| **TRANS02** | **Vitest Mapper**: Receive all snippets from a source file, generate ONE test file with multiple `test()` blocks (one per snippet) | Unit tests via @example in `builtins.ts` | [x] | [ ] |
| **TRANS03** | **Output Header**: Include source file path, description, and auto-generated notice in test file header (remove "Snippet:" section) | Unit tests via @example in `builtins.ts` | [x] | [ ] |
| **TRANS04** | **Output Structure**: Separate imports section from test body; deduplicate imports | Unit tests via @example in `builtins.ts` | [x] | [ ] |
| **TRANS05** | **Import Path Transformation**: Rewrite relative imports (`./foo.ts`) to be valid from test file location (`../src/foo.js`) | Unit tests via @example in `builtins.ts` | [x] | [ ] |
| **TRANS06** | **Output Directory Mirroring**: Write generated tests to `outDir` preserving relative directory structure (`src/foo.ts` → `tests/foo.test.ts`) | Integration tests via @example in `config.ts` | [x] | [ ] |
| **TRANS07** | **File Overwriting**: Overwrite existing test files without prompting; idempotent generation | Integration tests via @example in `config.ts` | [x] | [ ] |
| **TRANS08** | **Auto Source Import**: Generated test files automatically import all exports from the source file, removing the need for users to manually import the method-under-test in their @example blocks | Unit tests via @example in `builtins.ts` | [x] | [ ] |
| **META01** | **Self-Testing**: Library generates and runs its own tests via `@example` annotations (dogfooding) | @example in all source files, generated to `tests/` | [x] | [ ] |

**Requirement Notes:**
- **TRANS05**: When the Vitest/Jest mapper generates tests in `tests/` directory, it must transform `import { x } from './src/foo.ts'` in the snippet to `import { x } from '../src/foo.js'` (or equivalent) in the output
- **TRANS06**: Config should support `outDir: 'tests'` which mirrors source structure (`src/foo.ts` → `tests/foo.test.ts`)
- **SDK05**: Config validation should check required fields (`files`, `mapper` or built-in ref) and provide helpful error messages
