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

> **Note**: See [`../backlog/_INDEX.md`](../backlog/_INDEX.md) for backlog items including TODOs, Post-MVP features, and deferred work.

| ID | Requirement (plain language) | Test Pattern(s) | User Reviewed | Tests Completed | Implemented |
|----|------------------------------|-----------------|---------------|-----------|-------------|
| **CLI01** | **CLI Entry**: Executable as `npx example-test-gen` with `--help` and `--version` flags | End-to-end CLI tests via @example in `cli.ts` | [x] | [x] | [x] |
| **CLI02** | **Built-in Configs**: Support `--config=jest` and `--config=vitest` for zero-config test generation. These builtins use `tsconfig.json` properties (`compilerOptions.rootDir`, `include` and `exclude`) to detect source files.  If no `tsconfig.json` is found, `./src` is used as the rootDir, and all files will be scanned for `@example` tags | End-to-end CLI tests via @example in `cli.ts` | [x] | [x] | [x] |
| **CLI03** | **Custom Config Path**: Support `--config=./path.ts` for user-defined config files | End-to-end CLI tests via @example in `cli.ts` | [x] | [x] | [x] |
| **CLI04** | **CLI Error Handling**: Clear error messages for missing config, invalid config paths, and config load failures | End-to-end CLI tests via @example in `cli.ts` | [x] | [x] | [x] |
| **CLI05** | **CLI Include/Exclude Override**: Support `--include` and `--exclude` flags for ad-hoc file selection (e.g., `--include="src/**/*.ts"`, `--exclude="**/*.test.ts"`) | End-to-end CLI tests via @example in `cli.ts` | [x] | [ ] | [x] |
| **CLI06** | **CLI Output Directory**: Support `--outDir` flag to override the built-in mapper's default output directory (e.g., `--outDir=./generated-tests`) | End-to-end CLI tests via @example in `cli.ts` | [x] | [ ] | [x] |
| **CLI07** | **CLI Root Directory**: Support `--root-dir` flag to override the source root used for finding @examples  (e.g., `--root-dir=./src`) | End-to-end CLI tests via @example in `cli.ts` | [x] | [ ] | [x] |
| **SDK01** | **Programmatic API**: Export `generateTests()` function as primary entry point | Contract tests via @example in `index.ts` | [x] | [ ] | [x] |
| **SDK02** | **API Types**: Export TypeScript types (`SnippetInfo`, `MapperResult[]`, `MapperFn`, `Config`). MapperFn receives `SnippetInfo[]` and returns `MapperResult[]` | Contract tests via @example in `index.ts` | [x] | [ ] | [x] |
| **SDK03** | **Built-in Mappers Export**: Export `builtInConfigs.jest` and `builtInConfigs.vitest` for SDK consumers | Contract tests via @example in `builtins.ts` | [x] | [ ] | [x] |
| **SDK04** | **Config Object Support**: Accept `include` (string[]), `exclude` (string[]), `rootDir` (string), `mapper` (function or built-in name), and `outDir` (string) | Integration tests via @example in `config.ts` | [x] | [ ] | [x] |
| **SDK05** | **Config Validation**: Validate required fields (`include`, `mapper` or built-in ref) with helpful error messages | Unit tests via @example in `config.ts` | [x] | [ ] | [x] |
| **CORE01** | **Source Discovery**: Find source files matching `include` globs, excluding files matched by `exclude` globs | Unit tests via @example in `extractor.ts` | [x] | [ ] | [x] |
| **CORE02** | **@example Extraction**: Extract ALL code snippets from JSDoc `@example` blocks in a file and pass them as a batch to the mapper | Unit tests via @example in `extractor.ts` | [x] | [ ] | [x] |
| **CORE03** | **Snippet Parsing**: Parse optional description, code fence language hint, and snippet body | Unit tests via @example in `extractor.ts` | [x] | [ ] | [x] |
| **CORE04** | **Import Extraction**: Identify and separate ES module imports from executable code in snippets | Unit tests via @example in `extractor.ts` | [x] | [ ] | [x] |
| **CORE05** | **Multiple Snippets**: Detect and extract all @example blocks when multiple are present in a single source file | Unit tests via @example in `extractor.ts` | [x] | [x] | [x] |
| **CORE06** | **rootDir Config**: Strip the `rootDir` prefix from source file paths when computing output structure; user-configurable | Unit tests via @example in `config.ts` | [x] | [ ] | [x] |
| **CORE07** | **include / exclude Config**: Accept glob arrays controlling which source files are matched; user-configurable | Unit tests via @example in `config.ts` | [x] | [ ] | [x] |
| **TRANS01** | **Jest Mapper**: Receive all snippets from a source file, generate ONE test file with multiple `it()` blocks (one per snippet) inside a `describe()` block | Unit tests via @example in `builtins.ts` | [x] | [ ] | [x] |
| **TRANS02** | **Vitest Mapper**: Receive all snippets from a source file, generate ONE test file with multiple `test()` blocks (one per snippet) | Unit tests via @example in `builtins.ts` | [x] | [x] | [x] |
| **TRANS03** | **Output Header**: (Both Builtins) Include source file path, description, and auto-generated notice in test file header | Unit tests via @example in `builtins.ts` | [x] | [ ] | [x] |
| **TRANS04** | **Output Structure**: Separate imports section from test body; deduplicate imports (see [backlog](../backlog/import-deduplication.md)) | Unit tests via @example in `builtins.ts` | [x] | [ ] | [x] |
| **TRANS05** | **Import Path Transformation**: (POST-MVP - deferred, see [backlog](../backlog/import-path-transformation.md)) Rewrite relative imports in snippets to be valid from the generated test file's location, computed from the relative path between test file and source file | Unit tests via @example in `builtins.ts` | [x] | [ ] | [ ] |
| **TRANS07** | **File Overwriting**: Overwrite existing test files without prompting; idempotent generation | Integration tests via @example in `config.ts` | [x] | [ ] | [x] |
| **TRANS08** | **Auto Source Import**: Generated test files automatically import all exports from the source file, removing the need for users to manually import the method-under-test in their @example blocks (see [backlog](../backlog/auto-source-import.md)) | Unit tests via @example in `builtins.ts` | [x] | [ ] | [ ] |
| **TRANS09** | **Jest Built-in Defaults**: If `tsconfig.json` is present at `process.cwd()`, read `rootDir`/`include`/`exclude` from it; otherwise default to `rootDir: './src'`, `include: ['src/**/*']`, `exclude: ['node_modules', 'dist', '**/*.test.ts', '**/*.test.js']`. **MVP**: Tests co-located with source (`<src-path>.test.ts`). **Post-MVP**: `<rootDir-relative path>` → `./__tests__/<rootDir-relative path>` (see [backlog](../backlog/jest-tests-directory.md)) | Integration tests via @example in `builtins.ts` | [x] | [ ] | [x] |
| **TRANS10** | **Vitest Built-in Defaults**: If `tsconfig.json` is present at `process.cwd()`, read `rootDir`/`include`/`exclude` from it; otherwise default to `rootDir: './src'`, `include: ['src/**/*']`, `exclude: ['node_modules', 'dist', '**/*.test.ts', '**/*.test.js']`. **MVP**: Tests co-located with source (`<src-path>.test.ts`). **Post-MVP**: `<rootDir-relative path>` → `./tests/<rootDir-relative path>` (see [backlog](../backlog/vitest-tests-directory.md)) | Integration tests via @example in `builtins.ts` | [x] | [ ] | [x] |
| **META01** | **Self-Testing**: Library generates and runs its own tests via `@example` annotations (dogfooding) (see [backlog](../backlog/self-testing.md)) | @example in all source files, generated to `tests/` | [x] | [ ] | [ ] |