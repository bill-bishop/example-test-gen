# Jest Built-in Defaults - Tests Directory

## Description

Implement the Post-MVP output directory structure for Jest: `<rootDir-relative path>` → `./__tests__/<rootDir-relative path>`

## Original Requirement

**TRANS09**: Jest Built-in Defaults - Post-MVP: `<rootDir-relative path>` → `./__tests__/<rootDir-relative path>`

## Status

- User Reviewed: [x]
- Tests Completed: [ ]
- Implemented: [x] (MVP only)

## Notes

**MVP (Current)**: Tests co-located with source (`<src-path>.test.ts`)

**Post-MVP**: Change output structure to place tests in a `__tests__` directory:
- Input: `src/math/add.ts`
- Output: `__tests__/math/add.test.ts`

The full requirement includes:
- If `tsconfig.json` is present at `process.cwd()`, read `rootDir`/`include`/`exclude` from it
- Otherwise default to `rootDir: './src'`, `include: ['src/**/*']`, `exclude: ['node_modules', 'dist', '**/*.test.ts', '**/*.test.js']`
- MVP: Tests co-located with source (`<src-path>.test.ts`)
- **Post-MVP**: `<rootDir-relative path>` → `./__tests__/<rootDir-relative path>`
