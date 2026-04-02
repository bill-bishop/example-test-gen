import { SnippetInfo } from './types.js';
/**
 * Extracts @example code snippets from a file
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
 * @example CORE05_extracts_multiple_snippets_from_cli
 * ```ts
 * import { extractSnippets } from './extractor.ts';
 * const snippets = await extractSnippets('./src/cli.ts', process.cwd());
 * expect(snippets.length).toBeGreaterThan(1);
 * ```
 */
export declare function extractSnippets(filePath: string, cwd: string, rootDir?: string): Promise<SnippetInfo[]>;
export declare function findFiles(patterns: string | string[], exclude: string | string[] | undefined, cwd: string): AsyncGenerator<string>;
//# sourceMappingURL=extractor.d.ts.map