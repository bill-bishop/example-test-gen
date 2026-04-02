# SDK Feature Scope

## Requirements Analysis

### SDK01: Programmatic API
**Status**: Partially Implemented

**Required Changes**:
- `src/index.ts:8-14` - Update `generateTests()` signature to accept config object instead of positional args
- `src/index.ts:1-15` - Ensure `generate()` is properly exported as primary entry point

### SDK02: API Types
**Status**: Partially Implemented

**Required Changes**:
- `src/types.ts:14` - Rename `MapperFunction` to `MapperFn` (or add alias)
- `src/types.ts:1-26` - Ensure `SnippetInfo`, `MapperResult[]`, `MapperFn`, and `Config` are all exported
- `src/index.ts:5` - Verify all required types are re-exported

### SDK03: Built-in Mappers Export
**Status**: Partially Implemented

**Required Changes**:
- `src/index.ts:6` - `builtInConfigs` already exported, verify structure matches `{ jest: Config, vitest: Config }`
- `src/builtins.ts:69-78` - Ensure builtInConfigs structure includes both `pattern` and `mapper` for each

### SDK04: Config Object Support
**Status**: Not Implemented

**Required Changes**:
- `src/types.ts:16-26` - Define new `Config` interface with:
  - `include: string[]` (required)
  - `exclude: string[]` (optional)
  - `rootDir: string` (optional, default: './src')
  - `mapper: MapperFn | 'jest' | 'vitest'` (required)
  - `outDir: string` (optional)
- `src/config.ts` - Create new file for config loading and resolution
- `src/index.ts:8-14` - Update `generateTests()` to accept `Config` object
- `src/cli.ts:8-18` - Update CLI to build Config object from flags
- `src/generator.ts:56-79` - Update `generate()` to accept Config object

### SDK05: Config Validation
**Status**: Not Implemented

**Required Changes**:
- `src/config.ts` - Create new file with validation functions
- `src/config.ts` - Validate required fields: `include` must be present and non-empty array
- `src/config.ts` - Validate `mapper` is present (either function or builtin name)
- `src/config.ts` - Validate `rootDir` exists if provided
- `src/config.ts` - Provide helpful error messages for each validation failure
- `src/index.ts:8-14` - Call validation before generating
- `src/cli.ts:97-104` - Integrate validation into CLI error handling

## New Files to Create

1. `src/config.ts` - Config interface definition, loading, and validation

## Files to Modify

1. `src/types.ts` - Update type definitions
2. `src/index.ts` - Update exports and `generateTests()` signature
3. `src/generator.ts` - Accept Config object
4. `src/cli.ts` - Build and validate Config from CLI flags
5. `src/builtins.ts` - Ensure structure matches SDK requirements
