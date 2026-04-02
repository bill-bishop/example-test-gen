# example-test-gen

Write tests as `@example` snippets in your source code. Generate and run them with one command.

## Quick Start

```bash
# Generate Vitest tests from all @example snippets
npx example-test-gen --config=vitest

# Or Jest tests
npx example-test-gen --config=jest
```

Your tests appear next to your source files, ready to run.

---

## How It Works

**1. Write examples in your source code:**

```typescript
// src/math.ts

/**
 * Adds two numbers
 * @example basic addition
 * ```ts
 * import { add } from './math.ts';
 * expect(add(2, 3)).toBe(5);
 * ```
 */
export function add(a: number, b: number): number {
  return a + b;
}
```

**2. Generate tests:**

```bash
npx example-test-gen --config=vitest
```

**3. Run your tests:**

```bash
npm test
```

---

## What Gets Generated

From the `@example` above, `example-test-gen` creates `src/math.test.ts`:

```typescript
// Auto-generated test file from @example snippets
// Source: src/math.ts
// Generated: 2026-04-01T21:30:00.000Z

import { add } from './math.ts';
import { test, expect } from 'vitest';

test('basic addition', async () => {
  expect(add(2, 3)).toBe(5);
});
```

**Note about imports:** Any `import` statements in your `@example` snippet get automatically moved to the top of the generated test file. The test body contains only your assertions and method calls—no import clutter.

---

## CLI Options

| Flag | Description | Default |
|------|-------------|---------|
| `--config=<name>` | Use built-in config: `vitest` or `jest` | Required |
| `--config=<path>` | Path to custom config file | — |
| `--include=<pattern>` | Override which files to scan | From config |
| `--exclude=<pattern>` | Override which files to skip | From config |
| `--outDir=<dir>` | Where to put generated tests | Same as source |
| `--rootDir=<dir>` | Source root for path calculations | `./src` |
| `--overwrite` | Replace existing test files | false |

### Examples

```bash
# Scan only utils directory
npx example-test-gen --config=vitest --include="src/utils/*.ts"

# Output to tests/ directory
npx example-test-gen --config=vitest --outDir=tests

# Custom config file
npx example-test-gen --config=./my-config.mjs
```

---

## Custom Configuration

Create a `.mjs` file for full control:

```javascript
// test-config.mjs
export default {
  include: ['src/**/*.ts'],
  exclude: ['**/*.test.ts'],
  outDir: 'tests',
  mapper: 'vitest'  // or 'jest', or a custom function
};
```

Then run:

```bash
npx example-test-gen --config=./test-config.mjs
```

---

## Installation

```bash
npm install --save-dev example-test-gen
```

Or use directly via npx (no install needed).

---

## Documentation

- **[Requirements](./docs/REQUIREMENTS.md)** - Detailed requirements specification
- **[Backlog](./backlog/_INDEX.md)** - TODOs, Post-MVP features, and deferred work
- **[Contributing](./docs/CONTRIBUTING.md)** - Guidelines for adding tests