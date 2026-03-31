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
| **CLI01** | **CLI Entry**: Executable as `npx example-test-gen` with `--help` and `--version` flags | End-to-end CLI tests via @example in `cli.ts` | [ ] |
| **CLI02** | **Built-in Configs**: Support `--config=jest` and `--config=vitest` for zero-config test generation | End-to-end CLI tests via @example in `cli.ts` | [ ] |
| **CLI03** | **Custom Config Path**: Support `--config=./path.mjs` for user-defined config files | End-to-end CLI tests via @example in `cli.ts` | [ ] |
| **CLI04** | **CLI Error Handling**: Clear error messages for missing config, invalid config paths, and config load failures | End-to-end CLI tests via @example in `cli.ts` | [ ] |
| **SDK01** | **Programmatic API**: Export `generateTests()` function as primary entry point | Contract tests via @example in `index.ts` | [ ] |
| **SDK02** | **API Types**: Export TypeScript types (`SnippetInfo`, `MapperResult`, `MapperFn`, `Config`) | Contract tests via @example in `index.ts` | [ ] |
| **SDK03** | **Built-in Mappers Export**: Export `jestMapper` and `vitestMapper` for SDK consumers | Contract tests via @example in `builtins.ts` | [ ] |
| **SDK04** | **Config Object Support**: Accept `pattern` (glob), `mapper` (function or built-in name), `files` (array), and `outDir` (string) | Integration tests via @example in `config.ts` | [ ] |
| **SDK05** | **Config Validation**: Validate required fields (`pattern` or `files`, `mapper` or built-in ref) with helpful error messages | Unit tests via @example in `config.ts` | [ ] |
| **CORE01** | **Source Discovery**: Find source files from `pattern` glob or `files` array (supports `**/*` style paths) | Unit tests via @example in `extractor.ts` | [ ] |
| **CORE02** | **@example Extraction**: Extract code snippets from JSDoc `@example` blocks | Unit tests via @example in `extractor.ts` | [ ] |
| **CORE03** | **Snippet Parsing**: Parse optional description, code fence language hint, and snippet body | Unit tests via @example in `extractor.ts` | [ ] |
| **CORE04** | **Import Extraction**: Identify and separate ES module imports from executable code in snippets | Unit tests via @example in `extractor.ts` | [ ] |
| **TRANS01** | **Jest Mapper**: Wrap snippets in `describe`/`it` blocks with Jest-compatible imports | Unit tests via @example in `builtins.ts` | [ ] |
| **TRANS02** | **Vitest Mapper**: Wrap snippets in `describe`/`it` blocks with Vitest-compatible imports | Unit tests via @example in `builtins.ts` | [ ] |
| **TRANS03** | **Output Header**: Include source file path, description, and auto-generated notice in test file header | Unit tests via @example in `builtins.ts` | [ ] |
| **TRANS04** | **Output Structure**: Separate imports section from test body; deduplicate imports | Unit tests via @example in `builtins.ts` | [ ] |
| **TRANS05** | **Import Path Transformation**: Rewrite relative imports (`./foo.ts`) to be valid from test file location (`../src/foo.js`) | Unit tests via @example in `builtins.ts` | [ ] |
| **TRANS06** | **Output Directory Mirroring**: Write generated tests to `outDir` preserving relative directory structure (`src/foo.ts` → `tests/foo.test.ts`) | Integration tests via @example in `config.ts` | [ ] |
| **META01** | **Self-Testing**: Library generates and runs its own tests via `@example` annotations (dogfooding) | @example in all source files, generated to `tests/` | [ ] |

**Requirement Notes:**
- **TRANS05**: When the Vitest/Jest mapper generates tests in `tests/` directory, it must transform `import { x } from './src/foo.ts'` in the snippet to `import { x } from '../src/foo.js'` (or equivalent) in the output
- **TRANS06**: Config should support `outDir: 'tests'` which mirrors source structure (`src/foo.ts` → `tests/foo.test.ts`)
- **SDK05**: Config validation should check required fields (`pattern` or `files`, `mapper` or built-in ref) and provide helpful error messages

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
