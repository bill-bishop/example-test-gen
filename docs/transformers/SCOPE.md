# Transformers Feature Scope

## Requirements Analysis

### TRANS01: Jest Mapper
**Status**: Partially Implemented

**Current State**: Creates test file with `it()` blocks inside `describe()`, but missing:
- Auto-import of source file exports (TRANS08)
- Proper output header (TRANS03)

**Required Changes**:
- `src/builtins.ts:1-34` - Update to use separate imports/body from SnippetInfo
- `src/builtins.ts:20` - Update header format per TRANS03
- `src/builtins.ts:22-27` - Add auto-import of source file (TRANS08)
- `src/builtins.ts:29-30` - Ensure output filepath follows co-location pattern (`<src-path>.test.js`)

### TRANS02: Vitest Mapper
**Status**: Implemented (missing TRANS03 and TRANS08)

**Current State**: Creates test file with `test()` blocks

**Required Changes**:
- `src/builtins.ts:36-67` - Same changes as Jest mapper for TRANS03 and TRANS08
- `src/builtins.ts:63` - Ensure output filepath follows co-location pattern (`<src-path>.test.ts`)

### TRANS03: Output Header
**Status**: Not Implemented

**Required Changes**:
- `src/builtins.ts:20` (Jest) - Update header to include:
  - Source file path (full relative path)
  - Description (from first snippet or generated)
  - Auto-generated notice
- `src/builtins.ts:53` (Vitest) - Same header format

**Header Format**:
```typescript
// Auto-generated test file from @example snippets
// Source: <relative-path-to-source>
// Generated: <timestamp>
```

### TRANS04: Output Structure
**Status**: Partially Implemented

**Current State**: Imports are deduplicated but passed inline; should be provided separately to mapper

**Required Changes**:
- `src/types.ts:1-7` - Ensure `SnippetInfo` has `imports: string[]` and `body: string` (currently `snippet`)
- `src/builtins.ts:11-18` and `src/builtins.ts:44-51` - Mappers already using `s.imports`, verify structure

### TRANS07: File Overwriting
**Status**: Partially Implemented

**Current State**: Files are overwritten without prompting (fs.writeFile behavior)

**Required Changes**:
- `src/types.ts:16-22` - Add `overwrite?: boolean` to Config
- `src/generator.ts:77-78` - Check overwrite flag before writing (or add warning logging)
- `src/cli.ts:92-107` - Add `--overwrite` flag parsing

### TRANS08: Auto Source Import
**Status**: Not Implemented

**Required Changes**:
- `src/types.ts:1-7` - Add `sourceFilePath: string` to `SnippetInfo`
- `src/extractor.ts:35-74` - Pass full source file path in SnippetInfo
- `src/builtins.ts:1-34` (Jest) - Add auto-import of all exports from source file:
  - Compute relative path from test output location to source file
  - Add `import { <exports> } from '<relative-path>';` or `import * as <name> from '<relative-path>';`
- `src/builtins.ts:36-67` (Vitest) - Same auto-import logic

### TRANS09: Jest Built-in Defaults (tsconfig integration)
**Status**: Not Implemented

**Required Changes**:
- `src/builtins.ts:69-78` - Read tsconfig.json at process.cwd() for:
  - `compilerOptions.rootDir`
  - `include`
  - `exclude`
- `src/builtins.ts:69-78` - Fallback defaults when no tsconfig:
  - `rootDir: './src'`
  - `include: ['src/**/*']`
  - `exclude: ['node_modules', 'dist', '**/*.test.ts', '**/*.test.js']`
- `src/builtins.ts:70-73` - MVP output location: co-located with source (`<src-path>.test.js`)

### TRANS10: Vitest Built-in Defaults (tsconfig integration)
**Status**: Not Implemented

**Required Changes**:
- `src/builtins.ts:69-78` - Same tsconfig reading as TRANS09
- `src/builtins.ts:74-77` - Same fallback defaults
- `src/builtins.ts:74-77` - MVP output location: co-located with source (`<src-path>.test.ts`)

## Files to Modify

1. `src/builtins.ts` - All mapper implementations and builtin config resolution
2. `src/types.ts` - Update SnippetInfo with sourceFilePath
3. `src/extractor.ts` - Pass source file path to mappers
4. `src/generator.ts` - Handle overwrite option
5. `src/config.ts` - Add overwrite to Config interface

## Note on TRANS05

TRANS05 (Import Path Transformation) is marked as Post-MVP in requirements and excluded from this scope.
