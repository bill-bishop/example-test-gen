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
async function generate(options) {
    const { pattern, mapper, cwd = process.cwd() } = options;
    for await (const filePath of (0, extractor_js_1.findFiles)(pattern, cwd)) {
        const snippets = await (0, extractor_js_1.extractSnippets)(filePath, cwd);
        if (snippets.length === 0)
            continue;
        const result = await mapper(snippets);
        if (!result)
            continue;
        const { output, filepath: relativeOutputPath } = result;
        const absoluteOutputPath = path_1.default.resolve(cwd, relativeOutputPath);
        const outputDir = path_1.default.dirname(absoluteOutputPath);
        await fs_1.promises.mkdir(outputDir, { recursive: true });
        await fs_1.promises.writeFile(absoluteOutputPath, output, 'utf-8');
    }
}
//# sourceMappingURL=generator.js.map