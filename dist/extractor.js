"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractSnippets = extractSnippets;
exports.findFiles = findFiles;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const EXAMPLE_REGEX = /@example(?:\s+([^\n`]+))?\s*\n?\s*(?:\*\s*)?```[a-z]*\n?([\s\S]*?)```/g;
/**
 * Extracts @example code snippets from a file
 * @example extracts snippets correctly
 * ```ts
 * import { extractSnippets } from './extractor';
 *
 * const snippets = await extractSnippets('./extractor.ts', process.cwd());
 * expect(snippets[0].description).toBe('extracts snippets correctly');
 * expect(snippets[0].filename).toBe('extractor.ts');
 * expect(snippets[0].dir).toBe('src');
 * // FOOBARBAZBAT
 * expect(snippets[0].snippet).toContain('FOOBARBAZBAT');
 * ```
 */
async function extractSnippets(filePath, cwd) {
    const content = await fs_1.promises.readFile(filePath, 'utf-8');
    const dir = path_1.default.dirname(path_1.default.relative(cwd, filePath));
    const filename = path_1.default.basename(filePath);
    const snippets = [];
    let match;
    while ((match = EXAMPLE_REGEX.exec(content)) !== null) {
        const description = match[1]?.trim() ?? null;
        const rawSnippet = match[2].trim();
        // Strip JSDoc comment prefixes from each line
        const cleanedSnippet = rawSnippet
            .split('\n')
            .map(line => line.replace(/^\s*\*\s?/, ''))
            .join('\n');
        // Separate import statements from the rest of the snippet
        const lines = cleanedSnippet.split('\n');
        const imports = [];
        const codeLines = [];
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('import ') || trimmed.startsWith('require(')) {
                imports.push(line);
            }
            else {
                codeLines.push(line);
            }
        }
        const snippet = codeLines.join('\n').trim();
        snippets.push({ imports, snippet, description, dir, filename });
    }
    return snippets;
}
async function* findFiles(patterns, cwd) {
    const fg = await import('fast-glob');
    const files = await fg.default(patterns, { cwd, absolute: true });
    for (const file of files) {
        yield file;
    }
}
//# sourceMappingURL=extractor.js.map