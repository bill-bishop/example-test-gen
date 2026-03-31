import { SnippetInfo } from './types.js';
/**
 * Extracts @example code snippets from a file
 * @example extracts snippets correctly
 * ```ts
 * import { extractSnippets } from './extractor.ts';
 *
 * const snippets = await extractSnippets('./src/extractor.ts', process.cwd());
 * expect(snippets[0].description).toBe('extracts snippets correctly');
 * expect(snippets[0].filename).toBe('extractor.ts');
 * expect(snippets[0].dir).toBe('src');
 * // FOOBARBAZBAT
 * expect(snippets[0].snippet).toContain('FOOBARBAZBAT');
 * ```
 */
export declare function extractSnippets(filePath: string, cwd: string): Promise<SnippetInfo[]>;
export declare function findFiles(patterns: string | string[], cwd: string): AsyncGenerator<string>;
//# sourceMappingURL=extractor.d.ts.map