// Auto-generated test file from @example snippets
// Source: src/extractor.ts
// Generated: 2026-04-02T04:27:59.772Z

import { findFiles } from './extractor.ts';
import { extractSnippets } from './extractor.ts';
import * as extractor from './src/extractor.ts';

import { test, expect } from 'vitest';

test('CORE01_findFiles_finds_matching_files', async () => {
  const files: string[] = [];
  for await (const file of findFiles('src/*.ts', undefined, process.cwd())) {
    files.push(file);
  }
  expect(files.length).toBeGreaterThan(0);
  expect(files.some(f => f.includes('extractor.ts'))).toBe(true);
});

test('CORE01_findFiles_respects_exclude_patterns', async () => {
  const files: string[] = [];
  for await (const file of findFiles('src/*.ts', '**\/*.test.ts', process.cwd())) {
    files.push(file);
  }
  expect(files.every(f => !f.includes('.test.'))).toBe(true);
});

test('extracts snippets correctly', async () => {
  // Interestingly, the extractor.ts path we provide to extractSnippets
  // is different from the path we use in the import statement.
  // This is because extractSnippets expects a project-relative path,
  // while the import statement depends on the test file's location
  // relative to this file.
  
  const snippets = await extractSnippets('./src/extractor.ts', process.cwd());
  // Find the specific snippet by description instead of relying on order
  const targetSnippet = snippets.find(s => s.description === 'extracts snippets correctly');
  expect(targetSnippet).toBeDefined();
  expect(targetSnippet!.description).toBe('extracts snippets correctly');
  expect(targetSnippet!.filename).toBe('extractor.ts');
  expect(targetSnippet!.dir).toBe('src');
  
  // FOOBARBAZBAT <-- should be in the snippet, since I wrote it here.
  expect(targetSnippet!.snippet).toContain('FOOBARBAZBAT');
});

test('CORE03_extracts_description_and_code_fence_language', async () => {
  const snippets = await extractSnippets('./src/extractor.ts', process.cwd());
  // Find snippet by description instead of relying on order
  const targetSnippet = snippets.find(s => s.description === 'extracts snippets correctly');
  expect(targetSnippet).toBeDefined();
  expect(targetSnippet!.description).toBe('extracts snippets correctly');
});

test('CORE04_separates_imports_from_executable_code', async () => {
  // Look for a snippet that has imports in the cli.ts file
  const snippets = await extractSnippets('./src/cli.ts', process.cwd());
  // CLI snippets typically have imports at the top
  const snippetWithImports = snippets.find(s => s.imports.length > 0);
  if (snippetWithImports) {
    expect(snippetWithImports.imports.some(i => i.includes('import'))).toBe(true);
  }
});

test('CORE02_extracts_all_snippets_as_batch', async () => {
  const snippets = await extractSnippets('./src/builtins.ts', process.cwd());
  // Should extract multiple snippets as a batch from builtins.ts
  expect(snippets.length).toBeGreaterThanOrEqual(1);
  // Each snippet should have the expected structure
  expect(snippets[0]).toHaveProperty('imports');
  expect(snippets[0]).toHaveProperty('snippet');
  expect(snippets[0]).toHaveProperty('description');
  expect(snippets[0]).toHaveProperty('filename');
});

test('CORE06_strips_rootDir_prefix_from_paths', async () => {
  // When rootDir is provided, paths should be relative to it
  const snippets = await extractSnippets('./src/extractor.ts', process.cwd(), 'src');
  // Find the snippet we're looking for by description
  const targetSnippet = snippets.find(s => s.description === 'extracts snippets correctly');
  expect(targetSnippet).toBeDefined();
  expect(targetSnippet!.dir).toBe('src');
  expect(targetSnippet!.filename).toBe('extractor.ts');
});

test('CORE05_extracts_multiple_snippets_from_cli', async () => {
  const snippets = await extractSnippets('./src/cli.ts', process.cwd());
  expect(snippets.length).toBeGreaterThan(1);
});

test('CORE07_accepts_glob_arrays_for_include_exclude', async () => {
  const files: string[] = [];
  // Pass array of patterns for include and exclude
  for await (const file of findFiles(['src/*.ts', 'src/**\/*.ts'], ['**\/*.test.ts', 'node_modules/**'], process.cwd())) {
    files.push(file);
  }
  expect(files.length).toBeGreaterThan(0);
  // Should not contain test files
  expect(files.every(f => !f.includes('.test.'))).toBe(true);
  expect(files.every(f => !f.includes('node_modules'))).toBe(true);
});