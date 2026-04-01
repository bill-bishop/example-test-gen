import { GenerateOptions } from './types.js';
/**
 * Generates test files from @example snippets
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
export declare function generate(options: GenerateOptions): Promise<void>;
//# sourceMappingURL=generator.d.ts.map