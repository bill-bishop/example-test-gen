// Auto-generated test file from @example snippets
// Source: src/extractor.ts
// Generated: 2026-04-02T02:17:57.245Z

import { extractSnippets } from './extractor.ts';
import * as extractor from './src/extractor.ts';

describe('extractor', () => {
  it('extracts snippets correctly', async () => {
    // Interestingly, the extractor.ts path we provide to extractSnippets
    // is different from the path we use in the import statement.
    // This is because extractSnippets expects a project-relative path,
    // while the import statement depends on the test file's location
    // relative to this file.
    
    const snippets = await extractSnippets('./src/extractor.ts', process.cwd());
    expect(snippets[0].description).toBe('extracts snippets correctly');
    expect(snippets[0].filename).toBe('extractor.ts');
    expect(snippets[0].dir).toBe('src');
    
    // FOOBARBAZBAT <-- should be in the snippet, since I wrote it here.
    expect(snippets[0].snippet).toContain('FOOBARBAZBAT');
  });

  it('CORE05_extracts_multiple_snippets_from_cli', async () => {
    const snippets = await extractSnippets('./src/cli.ts', process.cwd());
    expect(snippets.length).toBeGreaterThan(1);
  });
});