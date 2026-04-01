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
async function generate(options) {
    const { pattern, mapper, cwd = process.cwd(), outDir } = options;
    for await (const filePath of (0, extractor_js_1.findFiles)(pattern, cwd)) {
        const snippets = await (0, extractor_js_1.extractSnippets)(filePath, cwd);
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
        await fs_1.promises.writeFile(absoluteOutputPath, output, 'utf-8');
    }
}
//# sourceMappingURL=generator.js.map