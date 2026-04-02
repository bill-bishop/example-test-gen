"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readOutputFile = readOutputFile;
exports.substituteVariables = substituteVariables;
exports.renderOutput = renderOutput;
exports.printOutput = printOutput;
exports.printErrorAndExit = printErrorAndExit;
exports.formatErrorList = formatErrorList;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
function getOutputsDir(cwd = process.cwd()) {
    return path_1.default.resolve(cwd, 'outputs');
}
/**
 * Read an output file from the outputs directory
 * @example outputs_readOutputFile_reads_file_content
 * ```ts
 * const testDir = mkTempDir('outputs-test');
 * await fs.mkdir(path.join(testDir, 'outputs'), { recursive: true });
 * await fs.writeFile(path.join(testDir, 'outputs', 'test.txt'), 'Hello World');
 * const content = await readOutputFile('test.txt', testDir);
 * expect(content).toBe('Hello World');
 * rmDir(testDir);
 * ```
 */
async function readOutputFile(filename, cwd) {
    const filePath = path_1.default.join(getOutputsDir(cwd), filename);
    return fs_1.promises.readFile(filePath, 'utf-8');
}
/**
 * Substitute variables in a template string
 * @example outputs_substituteVariables_replaces_placeholders
 * ```ts
 * const result = substituteVariables('Hello {{name}}! Welcome to {{place}}.', {
 *   name: 'Alice',
 *   place: 'Wonderland'
 * });
 * expect(result).toBe('Hello Alice! Welcome to Wonderland.');
 * ```
 * @example outputs_substituteVariables_preserves_unknown_placeholders
 * ```ts
 * const result = substituteVariables('Hello {{name}}! Unknown: {{unknown}}.', {
 *   name: 'Alice'
 * });
 * expect(result).toBe('Hello Alice! Unknown: {{unknown}}.');
 * ```
 */
function substituteVariables(template, variables) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, name) => variables[name] ?? match);
}
/**
 * Render an output file with optional variable substitution
 * @example outputs_renderOutput_renders_template_with_variables
 * ```ts
 * const testDir = mkTempDir('render-test');
 * await fs.mkdir(path.join(testDir, 'outputs'), { recursive: true });
 * await fs.writeFile(path.join(testDir, 'outputs', 'template.txt'), 'Hello {{name}}!');
 * const content = await renderOutput('template.txt', { name: 'World' }, testDir);
 * expect(content).toBe('Hello World!');
 * rmDir(testDir);
 * ```
 * @example outputs_renderOutput_reads_file_without_variables
 * ```ts
 * const testDir = mkTempDir('render-test2');
 * await fs.mkdir(path.join(testDir, 'outputs'), { recursive: true });
 * await fs.writeFile(path.join(testDir, 'outputs', 'plain.txt'), 'Plain content');
 * const content = await renderOutput('plain.txt', undefined, testDir);
 * expect(content).toBe('Plain content');
 * rmDir(testDir);
 * ```
 */
async function renderOutput(filename, variables, cwd) {
    let content = await readOutputFile(filename, cwd);
    if (variables) {
        content = substituteVariables(content, variables);
    }
    return content;
}
async function printOutput(filename, variables, cwd) {
    const rendered = await renderOutput(filename, variables, cwd);
    console.log(rendered);
}
async function printErrorAndExit(filename, variables, exitCode = 1, cwd) {
    const rendered = await renderOutput(filename, variables, cwd);
    console.error(rendered);
    process.exit(exitCode);
}
/**
 * Format a list of errors with numbered prefixes
 * @example outputs_formatErrorList_formats_errors_with_numbers
 * ```ts
 * const formatted = formatErrorList(['First error', 'Second error', 'Third error']);
 * expect(formatted).toContain('1. First error');
 * expect(formatted).toContain('2. Second error');
 * expect(formatted).toContain('3. Third error');
 * expect(formatted.split('\n')).toHaveLength(3);
 * ```
 * @example outputs_formatErrorList_returns_empty_string_for_empty_array
 * ```ts
 * const formatted = formatErrorList([]);
 * expect(formatted).toBe('');
 * ```
 */
function formatErrorList(errors) {
    return errors.map((err, i) => `  ${i + 1}. ${err}`).join('\n');
}
//# sourceMappingURL=outputs.js.map