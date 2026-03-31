import { promises as fs } from 'fs';
import path from 'path';
import { GenerateOptions, MapperResult } from './types.js';
import { extractSnippets, findFiles } from './extractor.js';

/**
 * Generates test files from @example snippets
 *
 * @example CORE05_generates_one_test_file_with_multiple_tests_per_source
 * ```ts
 * import { cleanDir, generateWithVitest, assertFileContains, listTestFiles } from '../test/helpers/generator.js';
 * cleanDir('tmp');
 * await generateWithVitest('src/cli.ts', 'tmp');
 * expect(listTestFiles('tmp').length).toBe(1);
 * expect(listTestFiles('tmp')).toContain('cli.test.ts');
 * assertFileContains('tmp/cli.test.ts', 'CLI01');
 * assertFileContains('tmp/cli.test.ts', 'CLI02');
 * assertFileContains('tmp/cli.test.ts', 'CLI03');
 * assertFileContains('tmp/cli.test.ts', 'CLI04');
 * assertFileContains('tmp/cli.test.ts', 'CLI05');
 * assertFileContains('tmp/cli.test.ts', 'CLI06');
 * cleanDir('tmp');
 * ```
 */
export async function generate(options: GenerateOptions): Promise<void> {
  const { pattern, mapper, cwd = process.cwd() } = options;
  
  for await (const filePath of findFiles(pattern, cwd)) {
    const snippets = await extractSnippets(filePath, cwd);
    
    for (const snippetInfo of snippets) {
      const result = await mapper(snippetInfo);
      
      if (!result) continue;
      
      const { output, filepath: relativeOutputPath } = result;
      const absoluteOutputPath = path.resolve(cwd, relativeOutputPath);
      const outputDir = path.dirname(absoluteOutputPath);
      
      await fs.mkdir(outputDir, { recursive: true });
      await fs.writeFile(absoluteOutputPath, output, 'utf-8');
    }
  }
}
