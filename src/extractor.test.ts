// Generated test from @example snippet
// Source: src/extractor.ts

import { extractSnippets } from './extractor.ts';

import { test, expect } from 'vitest';

test('CORE05_extracts_multiple_snippets_from_cli', async () => {
  const snippets = await extractSnippets('./src/cli.ts', process.cwd());
  expect(snippets.length).toBeGreaterThan(1);
});