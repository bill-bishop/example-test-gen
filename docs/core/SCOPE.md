# Core Feature Scope

## Requirements Analysis

### CORE01: Source Discovery
**Status**: Implemented

**Current State**: `findFiles()` in `extractor.ts` accepts both `include` (patterns) and `exclude` parameters, passing `exclude` to fast-glob as `ignore` option

**Implementation**: `src/extractor.ts:87-98`

### CORE02: @example Extraction
**Status**: Implemented

**Current State**: `extractSnippets()` correctly extracts all snippets and passes as batch to mapper

### CORE03: Snippet Parsing
**Status**: Implemented

**Current State**: Extracts description, code fence language (ignored), and snippet body

### CORE04: Import Extraction
**Status**: Implemented

**Current State**: `SnippetInfo` interface provides `imports` and `snippet` (body) separately; `extractSnippets()` parses and separates import statements from code

**Implementation**: `src/types.ts:1-7`, `src/extractor.ts:66-81`

### CORE05: Multiple Snippets
**Status**: Implemented

### CORE06: rootDir Config
**Status**: Implemented

**Current State**: `rootDir` in `GenerateOptions`, CLI `--root-dir` flag parsed, used in `extractSnippets()` for computing relative paths

**Implementation**: `src/types.ts:16-25`, `src/cli.ts:146-147`, `src/extractor.ts:44-48`

### CORE07: include / exclude Config
**Status**: Implemented

**Current State**: `include` and `exclude` arrays in `GenerateOptions`, CLI `--include`/`--exclude` flags parsed, builtin configs use include/exclude

**Implementation**: `src/types.ts:17-18`, `src/cli.ts:137-141`, `src/builtins.ts:28-29`

## Files to Modify

1. `src/types.ts` - Update interfaces for include/exclude/rootDir
2. `src/extractor.ts` - Update file discovery and path computation
3. `src/generator.ts` - Pass new options through
4. `src/config.ts` - Handle defaults and tsconfig reading
5. `src/builtins.ts` - Update for new path computation and config structure
6. `src/cli.ts` - Parse new flags

## Dependencies

- CORE06 depends on SDK04 (Config object with rootDir)
- CORE07 depends on SDK04 (Config object with include/exclude)
- CORE01 changes align with CORE07
