#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const generator_js_1 = require("./generator.js");
const builtins_js_1 = require("./builtins.js");
async function loadConfig(configPath) {
    // Check for built-in configs first
    if (builtins_js_1.builtInConfigs[configPath]) {
        return builtins_js_1.builtInConfigs[configPath];
    }
    const resolvedPath = path_1.default.resolve(configPath);
    const fileUrl = (0, url_1.pathToFileURL)(resolvedPath).href;
    const module = await import(fileUrl);
    return module.default || module;
}
async function main() {
    const args = process.argv.slice(2);
    const configFlag = args.find((arg) => arg.startsWith('--config='));
    const configPath = configFlag ? configFlag.replace('--config=', '') : 'example-test-gen.config.mjs';
    try {
        const { mapper, pattern } = await loadConfig(configPath);
        await (0, generator_js_1.generate)({ pattern, mapper });
        console.log('Test files generated successfully');
    }
    catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=cli.js.map