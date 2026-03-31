# example-test-gen

Generate test files from `@example` snippets in your code.

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

## API

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
