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
 * import { cleanDir, listTestFiles, readFile } from '../test/helpers/environment.js';
 * import { generate } from './generator.ts';
 * import { builtInConfigs } from './builtins.ts';
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
 * const content = readFile('tmp/cli.test.ts');
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
export async function generate(options: GenerateOptions): Promise<number> {
  const { include, exclude, mapper, cwd = process.cwd(), outDir, rootDir, overwrite } = options;
  let fileCount = 0;
  
  for await (const filePath of findFiles(include, exclude, cwd)) {
    const snippets = await extractSnippets(filePath, cwd, rootDir);
    
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
    
    // Check if file exists and overwrite is not enabled
    if (!overwrite) {
      try {
        await fs.access(absoluteOutputPath);
        // File exists, skip
        continue;
      } catch {
        // File doesn't exist, proceed with writing
      }
    }
    
    await fs.writeFile(absoluteOutputPath, output, 'utf-8');
    fileCount++;
  }
  
  return fileCount;
}
