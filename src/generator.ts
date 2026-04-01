import { promises as fs } from 'fs';
import path from 'path';
import { GenerateOptions, MapperResult } from './types.js';
import { extractSnippets, findFiles } from './extractor.js';

/**
 * Generates test files from @example snippets
 *
 * @example SDK01_generateTests_produces_output_file_from_pattern
 * ```ts
 * // TODO: revisit this test after clarifying outDir/filepath alignment (see README TODO)
 * import { generate } from './generator.ts';
 * import { builtInConfigs } from './builtins.ts';
 * import { cleanDir, fileExists, readFile } from '../test/helpers/environment.js';
 *
 * cleanDir('tmp');
 * await generate({
 *   pattern: 'src/extractor.ts',
 *   mapper: builtInConfigs.vitest.mapper,
 *   outDir: 'tmp'
 * });
 * expect(fileExists('tmp/extractor.test.ts')).toBe(true);
 * expect(readFile('tmp/extractor.test.ts')).toContain('extracts snippets correctly');
 * cleanDir('tmp');
 * ```
 *
 * @example CORE05_generates_one_test_file_with_multiple_tests_per_source
 * ```ts
 * import { cleanDir, listTestFiles, readTestFile } from '../test/helpers/generator.js';
 * import { generate } from './generator.js';
 * import { builtInConfigs } from './builtins.js';
 *
 * cleanDir('tmp');
 *
 * await generate({
 *   pattern: 'src/cli.ts',
 *   mapper: builtInConfigs.vitest.mapper,
 *   outDir: 'tmp'
 * });
 *
 * const files = listTestFiles('tmp');
 * expect(files.length).toBe(1);
 * expect(files).toContain('cli.test.ts');
 *
 * const content = readTestFile('tmp/cli.test.ts');
 * expect(content).toContain('CLI01');
 * expect(content).toContain('CLI02');
 * expect(content).toContain('CLI03');
 * expect(content).toContain('CLI04');
 * expect(content).toContain('CLI05');
 * expect(content).toContain('CLI06');
 *
 * cleanDir('tmp');
 * ```
 */
export async function generate(options: GenerateOptions): Promise<void> {
  const { pattern, mapper, cwd = process.cwd(), outDir } = options;
  
  for await (const filePath of findFiles(pattern, cwd)) {
    const snippets = await extractSnippets(filePath, cwd);
    
    if (snippets.length === 0) continue;
    
    const result = await mapper(snippets);
    
    if (!result) continue;
    
    const { output, filepath: relativeOutputPath } = result;
    
    // Use outDir if provided, otherwise use the mapper's directory
    const filename = path.basename(relativeOutputPath);
    const finalRelativePath = outDir ? `${outDir}/${filename}` : relativeOutputPath;
    
    const absoluteOutputPath = path.resolve(cwd, finalRelativePath);
    const outputDir = path.dirname(absoluteOutputPath);
    
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(absoluteOutputPath, output, 'utf-8');
  }
}
