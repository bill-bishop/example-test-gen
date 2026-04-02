# Backlog Index

This directory contains backlog items - features, improvements, and technical debt that are tracked but not currently being worked on.

## Active Backlog

| Feature | Description | Priority | Status |
|---------|-------------|----------|--------|
| [Import Deduplication](./import-deduplication.md) | Fix duplicate imports in generated test files | High | Partially implemented |
| [Auto Source Import](./auto-source-import.md) | Auto-import exports from source files in generated tests | Medium | Implemented, needs refinement |
| [Import Path Transformation](./import-path-transformation.md) | Rewrite relative import paths for test file locations | Medium | Not implemented |
| [Jest Tests Directory](./jest-tests-directory.md) | Post-MVP: Output Jest tests to `__tests__/` folder | Low | Post-MVP |
| [Vitest Tests Directory](./vitest-tests-directory.md) | Post-MVP: Output Vitest tests to `tests/` folder | Low | Post-MVP |
| [Self-Testing](./self-testing.md) | Dogfooding: Library tests itself via @example | Low | Not implemented |
| [Examples Documentation](./examples-documentation.md) | Complete examples with input/output samples | Low | Draft |

## Legend

- **Priority**: High (blocking/near-term), Medium (nice-to-have), Low (future consideration)
- **Status**: Not implemented | In progress | Partially implemented | Implemented | Post-MVP
