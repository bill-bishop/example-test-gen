import { GenerateOptions } from './types.js';
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
export declare function generate(options: GenerateOptions): Promise<void>;
//# sourceMappingURL=generator.d.ts.map