# example-test-gen

Generate test files from `@example` snippets in your code.

## Contents

- [Overview](#overview)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Running Tests](#running-tests)
- [@example Format](#example-format)

## Overview

`example-test-gen` extracts test code from JSDoc `@example` annotations and generates runnable test files.

## Requirements

| ID | Requirement (plain language) | Test Pattern(s) | User Reviewed |
|----|------------------------------|-----------------|---------------|
| **R01** | **Self-testing**: Library generates and runs its own tests via `@example` annotations | Dogfooding: @example in all source files, generated to `tests/` | [x] |
| **R02** | **CLI**: Support `--config=jest` and `--config=vitest` for zero-config test generation | End-to-end CLI tests via @example in `cli.ts` | [x] |
| **R03** | **CLI**: Support `--config=./path.mjs` for custom user config files | End-to-end CLI tests via @example in `cli.ts` | [x] |
| **R04** | **Programmatic API**: Export `generateTests()`, types, and mappers for library consumers | Contract tests via @example in `index.ts` | [x] |
| **R05** | **Source Discovery**: Find files matching glob patterns and extract `@example` snippets | Unit tests via @example in `extractor.ts` | [ ] |
| **R06** | **Snippet Extraction**: Parse optional description, strip JSDoc prefixes, separate imports from code | Unit tests via @example in `extractor.ts` | [x] |
| **R07** | **Built-in Mappers**: Provide Jest and Vitest mappers that wrap snippets in appropriate test blocks | Unit tests via @example in `builtins.ts` | [x] |
| **R08** | **Generated Output Format**: Include header with source file and description; imports section; test body | Unit tests via @example in `builtins.ts` | [x] |
| **R09** | **Built-in Import Path Transformation**: Rewrite relative imports in snippets to be valid from test file location | Unit tests via @example in `builtins.ts` | [ ] |
| **R10** | **Configurable Output Directory**: Allow config to specify where generated tests go (e.g., `tests/` mirror structure) | Integration tests via @example in `config.ts` | [ ] |
| **R11** | **Config Schema/Validation**: Load and validate config files with clear error messages | Unit tests via @example in `config.ts` | [ ] |

**Requirement Notes:**
- **R09**: When the Vitest/Jest mapper generates tests in `tests/` directory, it must transform `import { x } from './src/foo.ts'` in the snippet to `import { x } from '../src/foo.js'` (or equivalent) in the output
- **R10**: Config should support `outDir: 'tests'` which mirrors source structure (`src/foo.ts` → `tests/foo.test.ts`)
- **R11**: Config validation should check required fields (`pattern`, `mapper` or `config` reference) and provide helpful error messages

## Installation

```bash
npm install --save-dev example-test-gen
```

## Usage

### Programmatic API

```typescript
import { generateTests } from 'example-test-gen';

await generateTests(
  'src/**/*.ts',
  ({ snippet, dir, filename }) => {
    // Return null to skip this snippet
    if (!snippet.includes('test')) return null;
    
    return {
      output: `import { test, expect } from 'vitest';
${snippet}`,
      filepath: `tests/${dir}/${filename.replace('.ts', '.test.ts')}`
    };
  }
);
```

### CLI with Built-in Configs

Use `--config=jest` or `--config=vitest` for zero-config test generation:

```bash
# Generate Jest tests
npx example-test-gen --config=jest

# Generate Vitest tests
npx example-test-gen --config=vitest
```

These built-in configs:
- Scan `src/**/*.{ts,js,tsx,jsx}` for `@example` snippets
- Generate tests in `__tests__/` (Jest) or `tests/` (Vitest)
- Include a comment header showing the source file and original snippet

### CLI with Custom Config

```javascript
export default {
  pattern: 'src/**/*.ts',
  mapper: ({ snippet, dir, filename }) => {
    return {
      output: `// Auto-generated test\n${snippet}`,
      filepath: `generated-tests/${dir}/${filename}.test.js`
    };
  }
};
```

Then run:

```bash
npx example-test-gen
```

Or with a custom config path:

```bash
npx example-test-gen --config=./my-config.mjs
```

## API Reference

### `generateTests(pattern, mapper, cwd?)`

- **pattern**: `string | string[]` - Glob pattern(s) to find source files
- **mapper**: `(SnippetInfo) => MapperResult | null | Promise<...>` - Transform function
- **cwd**: `string` - Working directory (default: `process.cwd()`)

### SnippetInfo

```typescript
{
  snippet: string;   // The @example code content
  dir: string;       // Directory relative to cwd
  filename: string;  // Source filename
}
```

### MapperResult

```typescript
{
  output: string;    // Generated file content
  filepath: string;  // Relative path for output file
}
```

Return `null` from the mapper to skip a snippet.

## Running Tests

This library dogfoods itself - all tests are written as `@example` annotations in the source files and generated using the built-in Vitest config:

```bash
# Generate tests from @example annotations
npx example-test-gen --config=vitest

# Run the generated tests
vitest run
```

Or combined:
```bash
npm test
```

## @example Format

```typescript
/**
 * Adds two numbers
 * @example
 * ```ts
 * const result = add(2, 3);
 * expect(result).toBe(5);
 * ```
 */
function add(a: number, b: number): number {
  return a + b;
}
```
