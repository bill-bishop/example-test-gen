"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const extractor_js_1 = require("./extractor.js");
async function generate(options) {
    const { pattern, mapper, cwd = process.cwd() } = options;
    for await (const filePath of (0, extractor_js_1.findFiles)(pattern, cwd)) {
        const snippets = await (0, extractor_js_1.extractSnippets)(filePath, cwd);
        for (const snippetInfo of snippets) {
            const result = await mapper(snippetInfo);
            if (!result)
                continue;
            const { output, filepath: relativeOutputPath } = result;
            const absoluteOutputPath = path_1.default.resolve(cwd, relativeOutputPath);
            const outputDir = path_1.default.dirname(absoluteOutputPath);
            await fs_1.promises.mkdir(outputDir, { recursive: true });
            await fs_1.promises.writeFile(absoluteOutputPath, output, 'utf-8');
        }
    }
}
//# sourceMappingURL=generator.js.map