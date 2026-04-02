import { GenerateOptions } from './types.js';
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
export declare function generate(options: GenerateOptions): Promise<number>;
//# sourceMappingURL=generator.d.ts.map