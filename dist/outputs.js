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
async function readOutputFile(filename, cwd) {
    const filePath = path_1.default.join(getOutputsDir(cwd), filename);
    return fs_1.promises.readFile(filePath, 'utf-8');
}
function substituteVariables(template, variables) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, name) => variables[name] ?? match);
}
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
function formatErrorList(errors) {
    return errors.map((err, i) => `  ${i + 1}. ${err}`).join('\n');
}
//# sourceMappingURL=outputs.js.map