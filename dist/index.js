"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.builtInConfigs = exports.createVitestMapper = exports.createJestMapper = exports.generate = void 0;
exports.generateTests = generateTests;
const generator_js_1 = require("./generator.js");
var generator_js_2 = require("./generator.js");
Object.defineProperty(exports, "generate", { enumerable: true, get: function () { return generator_js_2.generate; } });
var builtins_js_1 = require("./builtins.js");
Object.defineProperty(exports, "createJestMapper", { enumerable: true, get: function () { return builtins_js_1.createJestMapper; } });
Object.defineProperty(exports, "createVitestMapper", { enumerable: true, get: function () { return builtins_js_1.createVitestMapper; } });
Object.defineProperty(exports, "builtInConfigs", { enumerable: true, get: function () { return builtins_js_1.builtInConfigs; } });
async function generateTests(pattern, mapper, cwd) {
    return (0, generator_js_1.generate)({ pattern, mapper, cwd });
}
//# sourceMappingURL=index.js.map