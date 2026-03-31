// Generated test from @example snippet
// Source: src/extractor.ts
// Snippet:
//   const snippets = await extractSnippets('./extractor.ts', process.cwd());
//   expect(snippets[0].description).toBe('extracts snippets correctly');
//   expect(snippets[0].filename).toBe('extractor.ts');
//   expect(snippets[0].dir).toBe('src');
//   // FOOBARBAZBAT
//   expect(snippets[0].snippet).toContain('FOOBARBAZBAT');
//   

import { test, expect } from 'vitest';

test('extracts snippets correctly', async () => {
  const snippets = await extractSnippets('./extractor.ts', process.cwd());
  expect(snippets[0].description).toBe('extracts snippets correctly');
  expect(snippets[0].filename).toBe('extractor.ts');
  expect(snippets[0].dir).toBe('src');
  // FOOBARBAZBAT
  expect(snippets[0].snippet).toContain('FOOBARBAZBAT');
  
});