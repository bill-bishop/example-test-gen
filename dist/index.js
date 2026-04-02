"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveBuiltInConfig = exports.loadBuiltInMapper = exports.builtInConfigs = exports.createVitestMapper = exports.createJestMapper = exports.generate = void 0;
exports.generateTests = generateTests;
const generator_js_1 = require("./generator.js");
const config_js_1 = require("./config.js");
// Export main generation function
var generator_js_2 = require("./generator.js");
Object.defineProperty(exports, "generate", { enumerable: true, get: function () { return generator_js_2.generate; } });
var builtins_js_1 = require("./builtins.js");
Object.defineProperty(exports, "createJestMapper", { enumerable: true, get: function () { return builtins_js_1.createJestMapper; } });
Object.defineProperty(exports, "createVitestMapper", { enumerable: true, get: function () { return builtins_js_1.createVitestMapper; } });
Object.defineProperty(exports, "builtInConfigs", { enumerable: true, get: function () { return builtins_js_1.builtInConfigs; } });
Object.defineProperty(exports, "loadBuiltInMapper", { enumerable: true, get: function () { return builtins_js_1.loadBuiltInMapper; } });
Object.defineProperty(exports, "resolveBuiltInConfig", { enumerable: true, get: function () { return builtins_js_1.resolveBuiltInConfig; } });
/**
 * Generate tests from @example snippets
 * @example SDK01_generateTests_accepts_config_object
 */
async function generateTests(config) {
    // Validate config
    const validation = await (0, config_js_1.validateConfigAsync)(config);
    if (!validation.valid) {
        throw new Error(`Config validation failed: ${validation.errors.join(', ')}`);
    }
    // Resolve config (convert builtin names to mapper functions)
    const resolved = await (0, config_js_1.resolveConfig)(config, process.cwd());
    // Call generate with resolved config
    return (0, generator_js_1.generate)({
        include: resolved.include,
        exclude: resolved.exclude,
        mapper: resolved.mapper,
        cwd: process.cwd(),
        outDir: resolved.outDir,
        rootDir: resolved.rootDir
    });
}
//# sourceMappingURL=index.js.map