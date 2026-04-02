# Import Path Transformation

## Description

Rewrite relative imports in snippets to be valid from the generated test file's location, computed from the relative path between test file and source file.

## Original Requirement

**TRANS05**: Import Path Transformation - Rewrite relative imports in snippets to be valid from the generated test file's location, computed from the relative path between test file and source file

## Status

- User Reviewed: [x]
- Tests Completed: [ ]
- Implemented: [ ]

## Notes

This is a **Post-MVP** feature that was deferred.

The implementation should handle cases where imports in the @example block itself need path rewriting when `rewriteImports` is set to true. The import path should be rewritten to be relative to the test file's output location.

### Example

Input file with an import inside the @example block:

```typescript
/**
 * Does something
 * @example
 * ```ts
 * import { testHelper } from './testHelper.ts';
 * expect(unused(testHelper(1, 2))).toBe(5);
 * ```
 */
export function unused(data: string) {
    if (data === 'test') {
        return 5;
    }
    return 10;
}
```

Command: `npx example-test-gen --config=vitest --rewrite-imports`

Expected output in `tests/unused.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { unused } from '../../src/unused.ts';
import { testHelper } from '../../src/testHelper.ts'; // <-- rewritten to be relative to test file

describe('unused', () => {
  it('Does something', () => {
    expect(unused(testHelper(1, 2))).toBe(5);
  });
});
```
