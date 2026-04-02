# example-test-gen

Generate test files from `@example` snippets in your code.

[ UNDER CONSTRUCTION ] 2026-03-31 - This package is still being built! Tune in later!

## Documentation

- **[Requirements](./docs/REQUIREMENTS.md)** - Detailed requirements specification
- **[Backlog](./backlog/_INDEX.md)** - TODOs, Post-MVP features, and deferred work

## Quick Start

```bash
npx example-test-gen --config=vitest
```

## Overview

`example-test-gen` extracts test code from JSDoc `@example` annotations and generates runnable test files.

## Adding Tests

**DO:**
- DO Use existing or new helpers to keep tests highly readable
- DO reference existing tests which the user agrees are good examples
- DO Iterate on test patterns with the user before making changes to ensure alignment on beauty, readability, and modularity

**DON'T:**
- DO NOT Clutter the helpers directory with redundant functions
- DO NOT Clutter @examples with child_process or fs operations
- DO NOT Tuck away **assertions** or **method-under-test** calls into helpers as it harms readability and debuggability