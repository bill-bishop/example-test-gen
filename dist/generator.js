"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const extractor_js_1 = require("./extractor.js");
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
 *   include: 'src/extractor.ts',
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
 *   include: 'src/cli.ts',
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
async function generate(options) {
    const { include, exclude, mapper, cwd = process.cwd(), outDir, rootDir, overwrite } = options;
    const generatedFiles = [];
    for await (const filePath of (0, extractor_js_1.findFiles)(include, exclude, cwd)) {
        const snippets = await (0, extractor_js_1.extractSnippets)(filePath, cwd, rootDir);
        if (snippets.length === 0)
            continue;
        const result = await mapper(snippets);
        if (!result)
            continue;
        const { output, filepath: relativeOutputPath } = result;
        // Use outDir if provided, otherwise use the mapper's directory
        const filename = path_1.default.basename(relativeOutputPath);
        const finalRelativePath = outDir ? `${outDir}/${filename}` : relativeOutputPath;
        const absoluteOutputPath = path_1.default.resolve(cwd, finalRelativePath);
        const outputDir = path_1.default.dirname(absoluteOutputPath);
        await fs_1.promises.mkdir(outputDir, { recursive: true });
        // Check if file exists and overwrite is not enabled
        if (!overwrite) {
            try {
                await fs_1.promises.access(absoluteOutputPath);
                // File exists, skip
                continue;
            }
            catch {
                // File doesn't exist, proceed with writing
            }
        }
        await fs_1.promises.writeFile(absoluteOutputPath, output, 'utf-8');
        generatedFiles.push(finalRelativePath);
    }
    return generatedFiles;
}
//# sourceMappingURL=generator.js.map