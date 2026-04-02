# Examples Documentation

## Description

Add minimal input -> output examples per builtin with project structure, example source file, and expected test file content. These samples should demonstrate the auto-import functionality and path rewriting.

## Content to Document

### Example 1: Basic Function with Auto-Import

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

### Example 2: Detecting and Copying Imports from Source

TODO: decide whether to detect and copy *imports* from the source file to the test file (if they are used in the snippet)

Sample of detecting imports:

The src/math.ts test below imports `src/multiply.ts` outside of the @example and uses it in the @example (note that multiply is not exported in this file):

source file:
```typescript
import { multiply } from './multiply.ts';

/**
 * Adds two numbers.
 * @example
 * ```ts
 * expect(multiply(1, 2)).toBe(2);
 * ```
 */
export function unused(a: number, b: number) {
  return multiply(a, b);
}
```

Command: `npx example-test-gen --config=vitest`

test file:
```typescript
import { describe, it, expect } from 'vitest';
import { multiply } from '../../src/math/multiply.ts';

describe('main', () => {
  it('Adds two numbers', () => {
    expect(multiply(1, 2)).toBe(2);
  });
});
```

### Example 3: Import Path Rewriting

The following sample illustrates a case where an import is used in the @example block itself and rewriteImports is set to true, which should rewrite the import path to be relative to the test file's output location:

Input file:
```
src/unused.ts
```
File contents:
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

Output:
```
tests/unused.test.ts
```

The test file should have the import path rewritten to be relative to the test file's output location:
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

## Notes

These examples demonstrate how the tool should detect and copy imports from the source file to the test file when they are used in the @example block. This is not yet fully implemented and the requirements are not fully specified. These examples should be used as a reference for future implementation and cleaned up for presentability and readability and clarity once the feature is complete.
