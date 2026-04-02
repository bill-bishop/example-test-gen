# Skip Unchanged Files

**Status**: Not implemented  
**Priority**: Medium  
**Created**: 2026-04-01

## Overview

Currently, test files are regenerated every time `npm run generate` is executed, even if the source file and the generated test file have not changed. This causes:
- Unnecessary file writes
- Timestamp churn in generated headers
- Noisy git diffs
- Slower builds

## Problem

The generator has an `overwrite` flag, but it only controls whether to overwrite **existing** files. There's no mechanism to detect that a source file's @examples haven't changed since the last generation.

## Proposed Solutions

### Option 1: Hash-based detection
Store a hash of the source file's @example snippets in a metadata comment at the top of generated test files. When regenerating:
1. Read the existing test file's metadata hash
2. Hash the current source file's @examples
3. Only regenerate if hashes differ

**Pros**: Simple, accurate  
**Cons**: Requires parsing metadata from generated files

### Option 2: Timestamp comparison with mtime
Compare source file mtime vs generated file mtime. Only regenerate if source is newer.

**Pros**: Simple, no metadata needed  
**Cons**: Doesn't detect when @examples are unchanged but other parts of file changed; could skip needed updates if build process touches files

### Option 3: Content comparison
Store the full generated content hash and compare before writing.

**Pros**: Most accurate, catches all changes  
**Cons**: Requires reading entire file content

## Recommendation

**Option 1 (Hash-based)** seems best. Store metadata like:

```typescript
// Auto-generated test file from @example snippets
// Source: src/outputs.ts
// Generated: 2026-04-01T21:30:00.000Z
// SourceHash: abc123def456
```

When generating:
1. Compute hash of concatenated @example snippets (imports + snippet content)
2. If existing file exists and has matching SourceHash, skip
3. If no file or hash differs, write new file with updated hash

## Implementation Notes

- Add `skipIfUnchanged` option to `GenerateOptions`
- Default to `true` for performance
- Hash should include snippet content + imports (not description)
- Consider: should timestamps still update even if content unchanged? Probably not

## Related

- `TRANS07` - overwrite flag (already implemented)
- `builtins.ts` - where the header generation happens
