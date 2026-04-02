# JSDoc Comment Placement

**Status**: Not implemented  
**Priority**: Medium  
**Created**: 2026-04-02

## Overview

Ensure all JSDoc comments throughout the codebase are placed directly above the method or type under test, not separated by blank lines or other code.

## Problem

Currently, some JSDoc comments may be positioned incorrectly:
- Separated from their target by blank lines
- Placed above imports or other statements instead of directly above the function/type
- Misaligned with the code they document

This affects the tool's ability to correctly associate @example snippets with their intended targets.

## Expected Behavior

JSDoc comments should follow this pattern:

```typescript
// ✅ Correct - directly above the function
/**
 * Adds two numbers together.
 * @example
 * add(2, 3) // => 5
 */
export function add(a: number, b: number): number {
  return a + b;
}

// ❌ Incorrect - blank line separation
/**
 * Adds two numbers together.
 * @example
 * add(2, 3) // => 5
 */

export function add(a: number, b: number): number {
  return a + b;
}
```

## Scope

- All source files in `src/`
- Test files (if they contain documented functions)
- Any examples in documentation

## Implementation Notes

- Audit existing codebase for misplaced JSDoc comments
- Update the extractor logic in `extractor.ts` if needed to handle edge cases
- Consider adding a linting rule to enforce this convention going forward

## Related

- `src/extractor.ts` - handles parsing JSDoc comments and @examples
