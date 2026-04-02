# CLI Feature Scope

## Requirements Analysis

### CLI05: CLI Include/Exclude Override
**Status**: Not Implemented

**Required Changes**:
- `src/cli.ts:92-107` - Replace `--files` parsing with `--include` and add `--exclude` flag parsing
- `src/cli.ts:75-90` - Update example comments to use `--include` instead of `--files`
- `src/cli.ts:8-18` - Change `loadConfig` return type from `{ mapper, pattern: string | string[] }` to `{ mapper, include: string | string[], exclude?: string | string[] }`
- `src/types.ts:16-22` - Rename `pattern` to `include` and add `exclude?: string | string[]` to `GenerateOptions`
- `src/generator.ts:56-79` - Update to use `include` instead of `pattern`
- `src/builtins.ts:69-78` - Update builtin configs to use `include` instead of `pattern`

### CLI06: CLI Output Directory
**Status**: Not Implemented

**Required Changes**:
- `src/cli.ts:92-107` - Add parsing for `--outDir` flag
- `src/cli.ts:98` - Pass `outDir` to generator
- `src/types.ts:16-22` - Verify `outDir` field exists in `GenerateOptions`
- `src/generator.ts:72` - Ensure outDir handling works correctly (currently implemented but may need adjustment)

### CLI07: CLI Root Directory
**Status**: Not Implemented

**Required Changes**:
- `src/cli.ts:92-107` - Add parsing for `--root-dir` flag
- `src/cli.ts:16-18` - Pass rootDir through config loading
- `src/types.ts:16-22` - Add `rootDir` field to `GenerateOptions`
- `src/generator.ts:56-79` - Use rootDir for computing relative paths and output structure
- `src/extractor.ts:35-74` - Use rootDir for computing snippet directory paths

### CLI02: Built-in Configs (tsconfig integration)
**Status**: Partially Implemented (builtins exist, no tsconfig reading)

**Required Changes**:
- `src/builtins.ts:69-78` - Modify `builtInConfigs` to be a function that reads tsconfig.json
- `src/builtins.ts:1-79` - Add tsconfig.json parsing logic to read `compilerOptions.rootDir`, `include`, `exclude`
- `src/cli.ts:8-18` - Update config loading to handle async builtin resolution
- `src/builtins.ts:69-78` - Implement fallback defaults when no tsconfig found (rootDir: './src', include: ['**/*'], exclude: ['node_modules', 'dist', '**/*.test.ts', '**/*.test.js'])

### CLI04: CLI Error Handling
**Status**: Partially Implemented

**Required Changes**:
- `src/cli.ts:97-104` - Add specific error handling for missing config (distinguish between builtin not found vs file not found)
- `src/cli.ts:97-104` - Add validation for invalid config paths with helpful messages
- `src/cli.ts:97-104` - Add validation for config load failures (syntax errors, missing exports)

## Files to Modify

1. `src/cli.ts` - Flag parsing, config loading, error handling
2. `src/types.ts` - Type definitions for new options
3. `src/builtins.ts` - tsconfig.json reading, default resolution
4. `src/generator.ts` - outDir and rootDir handling
5. `src/extractor.ts` - rootDir path computation
