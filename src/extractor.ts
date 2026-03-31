import { promises as fs } from 'fs';
import path from 'path';
import { SnippetInfo } from './types.js';

const EXAMPLE_REGEX = /@example(?:\s+([^\n`]+))?\s*\n?\s*(?:\*\s*)?```[a-z]*\n?([\s\S]*?)```/g;

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
export async function extractSnippets(
  filePath: string,
  cwd: string
): Promise<SnippetInfo[]> {
  const content = await fs.readFile(filePath, 'utf-8');
  const dir = path.dirname(path.relative(cwd, filePath));
  const filename = path.basename(filePath);
  
  const snippets: SnippetInfo[] = [];
  let match: RegExpExecArray | null;
  
  while ((match = EXAMPLE_REGEX.exec(content)) !== null) {
    const description = match[1]?.trim() ?? null;
    const rawSnippet = match[2].trim();
    // Strip JSDoc comment prefixes from each line
    const cleanedSnippet = rawSnippet
      .split('\n')
      .map(line => line.replace(/^\s*\*\s?/, ''))
      .join('\n');
    
    // Separate import statements from the rest of the snippet
    const lines = cleanedSnippet.split('\n');
    const imports: string[] = [];
    const codeLines: string[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('import ') || trimmed.startsWith('require(')) {
        imports.push(line);
      } else {
        codeLines.push(line);
      }
    }
    
    const snippet = codeLines.join('\n').trim();
    snippets.push({ imports, snippet, description, dir, filename });
  }
  
  return snippets;
}

export async function* findFiles(
  patterns: string | string[],
  cwd: string
): AsyncGenerator<string> {
  const fg = await import('fast-glob');
  const files = await fg.default(patterns, { cwd, absolute: true });
  for (const file of files) {
    yield file;
  }
}
