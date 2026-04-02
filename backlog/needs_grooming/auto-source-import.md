# Auto Source Import

## Description

Generated test files automatically detect & import all *used* exports from the source file, removing the need for users to manually import the methods-under-test in their @example blocks.

## Original Requirement

**TRANS08**: Auto Source Import - Generated test files automatically import all exports from the source file, removing the need for users to manually import the method-under-test in their @example blocks (TODO: decide whether this happens before, during, or after mapping)

## Status

- User Reviewed: [x]
- Tests Completed: [ ]
- Implemented: [x]

## Notes

Decision needed on whether this happens before, during, or after mapping. Not yet implemented - existing equivalent just imports * as the source file name.

### Example

Input:
```
src/math/add.ts
```
File contents:
```typescript
/**
 * Adds two numbers.
 * @example
 * ```ts
 * expect(add(1, 2)).toBe(3);
 * ```
 */
export function add(a: number, b: number) {
  return a + b;
}
```

Command: `npx example-test-gen --config=vitest`

Output:
```
tests/math/add.test.ts
```

Functions under test are automatically imported from the source file:
```typescript
import { describe, it, expect } from 'vitest';
import { add } from '../../src/math/add.ts';

describe('add', () => {
  it('adds two numbers', () => {
    expect(add(1, 2)).toBe(3);
  });
});
```
