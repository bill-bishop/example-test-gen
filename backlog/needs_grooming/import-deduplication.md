# Import Deduplication

## Description

Import deduplication is partially implemented but not working correctly - generated test files contain duplicate import statements from the same module (e.g., `cli.test.ts` has 4 separate imports from `../test/helpers/environment.js` that should be consolidated into one).

## Example

`src/generator.test.ts` demonstrates this issue with **duplicate imports** from the same module:

```typescript
import { cleanDir, fileExists, readFile } from '../test/helpers/environment.js';
import { cleanDir, listTestFiles, readFile } from '../test/helpers/environment.js';
```

These should be consolidated into a single import:

```typescript
import { cleanDir, fileExists, readFile, listTestFiles } from '../test/helpers/environment.js';
```

## Original Requirement

**TRANS04**: Output Structure - Separate imports section from test body; deduplicate imports (TODO: move to CORE and provide `imports` and `body` to mapper separately)

## Status

- User Reviewed: [x]
- Tests Completed: [ ]
- Implemented: [x]

## Notes

The implementation should be moved to CORE and provide `imports` and `body` to the mapper separately, rather than handling deduplication in the mapper itself.
