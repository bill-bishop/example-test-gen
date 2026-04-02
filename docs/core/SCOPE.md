# Core Feature Scope

## Requirements Analysis

### CORE01: Source Discovery
**Status**: Partially Implemented

**Current State**: `findFiles()` in `extractor.ts` handles include patterns but not exclude

**Required Changes**:
- `src/extractor.ts:76-85` - Update `findFiles()` to accept `exclude` parameter
- `src/extractor.ts:80` - Pass `ignore` option to fast-glob for exclude patterns
- `src/generator.ts:56-79` - Pass exclude patterns to `findFiles()`

### CORE02: @example Extraction
**Status**: Implemented

**Current State**: `extractSnippets()` correctly extracts all snippets and passes as batch to mapper

### CORE03: Snippet Parsing
**Status**: Implemented

**Current State**: Extracts description, code fence language (ignored), and snippet body

### CORE04: Import Extraction
**Status**: Partially Implemented

**Current State**: Imports are extracted and separated but not provided to mapper separately from body

**Required Changes**:
- `src/types.ts:1-7` - Update `SnippetInfo` to provide `imports` and `body` separately (currently has `snippet` which is the body)
- `src/extractor.ts:55-71` - Ensure imports are properly parsed and returned
- `src/builtins.ts:11-18` and `src/builtins.ts:44-51` - Update mappers to receive imports separately (currently accessing `s.imports`)

### CORE05: Multiple Snippets
**Status**: Implemented

### CORE06: rootDir Config
**Status**: Not Implemented

**Required Changes**:
- `src/types.ts:16-22` - Add `rootDir` to `GenerateOptions`/`Config`
- `src/config.ts` - Add default rootDir resolution (from tsconfig or './src')
- `src/extractor.ts:35-42` - Use rootDir when computing relative paths for `dir` field
- `src/builtins.ts:3-33` and `src/builtins.ts:36-66` - Use rootDir for computing output file paths
- `src/generator.ts:56-79` - Pass rootDir through to extractor and mappers

### CORE07: include / exclude Config
**Status**: Not Implemented

**Required Changes**:
- `src/types.ts:16-22` - Replace `pattern: string | string[]` with `include: string[]` and `exclude: string[]`
- `src/extractor.ts:76-85` - Update `findFiles()` signature to use `include` instead of `patterns`
- `src/generator.ts:56-79` - Update to pass include/exclude to file discovery
- `src/cli.ts:92-107` - Parse `--include` and `--exclude` flags into arrays
- `src/builtins.ts:69-78` - Update builtin configs to use `include`/`exclude` instead of `pattern`

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
