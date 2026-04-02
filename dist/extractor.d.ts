import { SnippetInfo } from './types.js';
/**
 * Extracts @example code snippets from a file
 *
 * @example CORE01_findFiles_finds_matching_files
 * ```ts
 * import { findFiles } from './extractor.ts';
 * const files: string[] = [];
 * for await (const file of findFiles('src/*.ts', undefined, process.cwd())) {
 *   files.push(file);
 * }
 * expect(files.length).toBeGreaterThan(0);
 * expect(files.some(f => f.includes('extractor.ts'))).toBe(true);
 * ```
 * @example CORE01_findFiles_respects_exclude_patterns
 * ```ts
 * import { findFiles } from './extractor.ts';
 * const files: string[] = [];
 * for await (const file of findFiles('src/*.ts', '**\/*.test.ts', process.cwd())) {
 *   files.push(file);
 * }
 * expect(files.every(f => !f.includes('.test.'))).toBe(true);
 * ```
 * @example extracts snippets correctly
 * ```ts
 * import { extractSnippets } from './extractor.ts';
 *
 * // Interestingly, the extractor.ts path we provide to extractSnippets
 * // is different from the path we use in the import statement.
 * // This is because extractSnippets expects a project-relative path,
 * // while the import statement depends on the test file's location
 * // relative to this file.
 *
 * const snippets = await extractSnippets('./src/extractor.ts', process.cwd());
 * expect(snippets[0].description).toBe('extracts snippets correctly');
 * expect(snippets[0].filename).toBe('extractor.ts');
 * expect(snippets[0].dir).toBe('src');
 *
 * // FOOBARBAZBAT <-- should be in the snippet, since I wrote it here.
 * expect(snippets[0].snippet).toContain('FOOBARBAZBAT');
 * ```
 *
 * @example CORE03_extracts_description_and_code_fence_language
 * ```ts
 * import { extractSnippets } from './extractor.ts';
 * const snippets = await extractSnippets('./src/extractor.ts', process.cwd());
 * // The first snippet in this file has a description
 * expect(snippets[0].description).toBe('extracts snippets correctly');
 * ```
 * @example CORE04_separates_imports_from_executable_code
 * ```ts
 * import { extractSnippets } from './extractor.ts';
 * // Look for a snippet that has imports in the cli.ts file
 * const snippets = await extractSnippets('./src/cli.ts', process.cwd());
 * // CLI snippets typically have imports at the top
 * const snippetWithImports = snippets.find(s => s.imports.length > 0);
 * if (snippetWithImports) {
 *   expect(snippetWithImports.imports.some(i => i.includes('import'))).toBe(true);
 * }
 * ```
 * @example CORE02_extracts_all_snippets_as_batch
 * ```ts
 * import { extractSnippets } from './extractor.ts';
 * const snippets = await extractSnippets('./src/builtins.ts', process.cwd());
 * // Should extract multiple snippets as a batch from builtins.ts
 * expect(snippets.length).toBeGreaterThanOrEqual(1);
 * // Each snippet should have the expected structure
 * expect(snippets[0]).toHaveProperty('imports');
 * expect(snippets[0]).toHaveProperty('snippet');
 * expect(snippets[0]).toHaveProperty('description');
 * expect(snippets[0]).toHaveProperty('filename');
 * ```
 * @example CORE06_strips_rootDir_prefix_from_paths
 * ```ts
 * import { extractSnippets } from './extractor.ts';
 * // When rootDir is provided, paths should be relative to it
 * const snippets = await extractSnippets('./src/extractor.ts', process.cwd(), 'src');
 * expect(snippets[0].dir).toBe('.');  // Path relative to src
 * expect(snippets[0].filename).toBe('extractor.ts');
 * ```
 * @example CORE05_extracts_multiple_snippets_from_cli
 * ```ts
 * import { extractSnippets } from './extractor.ts';
 * const snippets = await extractSnippets('./src/cli.ts', process.cwd());
 * expect(snippets.length).toBeGreaterThan(1);
 * ```
 */
export declare function extractSnippets(filePath: string, cwd: string, rootDir?: string): Promise<SnippetInfo[]>;
/**
 * Find files matching patterns with exclusion support
 *
 * @example CORE07_accepts_glob_arrays_for_include_exclude
 * ```ts
 * import { findFiles } from './extractor.ts';
 * const files: string[] = [];
 * // Pass array of patterns for include and exclude
 * for await (const file of findFiles(['src/*.ts', 'src/**\/*.ts'], ['**\/*.test.ts', 'node_modules/**'], process.cwd())) {
 *   files.push(file);
 * }
 * expect(files.length).toBeGreaterThan(0);
 * // Should not contain test files
 * expect(files.every(f => !f.includes('.test.'))).toBe(true);
 * expect(files.every(f => !f.includes('node_modules'))).toBe(true);
 * ```
 */
export declare function findFiles(patterns: string | string[], exclude: string | string[] | undefined, cwd: string): AsyncGenerator<string>;
//# sourceMappingURL=extractor.d.ts.map