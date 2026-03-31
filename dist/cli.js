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
/**
 * CLI entry point for example-test-gen
 *
 * @example CLI01_help_flag_shows_usage_info
 * ```ts
 * import { runCli, readFile } from './test/helpers/cli.js';
 * expect(runCli('--help')).toContain(readFile('outputs/help.txt'));
 * ```
 *
 * @example CLI01_version_flag_shows_package_version
 * ```ts
 * import { runCli, getPackageVersion } from './test/helpers/cli.js';
 * const output = runCli('--version').trim();
 * expect(output).toBe(getPackageVersion());
 * ```
 *
 * @example CLI02_builtin_config_jest_generates_jest_tests
 * ```ts
 * import { runCliWith, cleanDir, assertExists } from './test/helpers/cli.js';
 * cleanDir('generated-tests');
 * runCliWith({ config: 'jest' });
 * assertExists('cli.test.js');
 * ```
 *
 * @example CLI02_builtin_config_vitest_generates_vitest_tests
 * ```ts
 * import { runCliWith, cleanDir, assertExists } from './test/helpers/cli.js';
 * cleanDir('tests');
 * runCliWith({ config: 'vitest' });
 * assertExists('tests/cli.test.ts');
 * ```
 *
 * @example CLI03_custom_config_path_loads_user_defined_config
 * ```ts
 * import { runCliWith, cleanDir, assertExists } from './test/helpers/cli.js';
 * cleanDir('custom-output');
 * runCliWith({ config: 'test/fixtures/config/custom.mjs' });
 * assertExists('custom-output/cli.test.js');
 * cleanDir('custom-output');
 * ```
 *
 * @example CLI04_missing_config_shows_clear_error
 * ```ts
 * import { runCli, expectError } from './test/helpers/cli.js';
 * const err = expectError(() => runCli('--config=nonexistent-config.mjs'));
 * expect(err.message).toContain('Error');
 * ```
 *
 * @example CLI04_invalid_config_path_shows_error
 * ```ts
 * import { runCli, expectError } from './test/helpers/cli.js';
 * const err = expectError(() => runCli('--config=/path/that/does/not/exist.mjs'));
 * expect(err.message).toMatch(/Error|Cannot find module/);
 * ```
 *
 * @example CLI05_files_flag_overrides_config_pattern
 * ```ts
 * import { runCliWith, cleanDir, assertExists } from './test/helpers/cli.js';
 * cleanDir('tests');
 * runCliWith({ config: 'vitest', files: 'src/cli.ts' });
 * assertExists('tests/cli.test.ts');
 * ```
 *
 * @example CLI05_files_flag_supports_multiple_patterns
 * ```ts
 * import { runCliWith, cleanDir, assertExists } from './test/helpers/cli.js';
 * cleanDir('tests');
 * runCliWith({ config: 'vitest', files: 'src/cli.ts,src/index.ts' });
 * assertExists('tests/cli.test.ts');
 * assertExists('tests/index.test.ts');
 * ```
 *
 * @example CLI06_outDir_flag_overrides_default_output_directory
 * ```ts
 * import { runCliWith, cleanDir, assertExists } from '../test/helpers/cli.js';
 * cleanDir('my-custom-tests');
 * runCliWith({ config: 'vitest', outDir: 'my-custom-tests' });
 * assertExists('my-custom-tests/cli.test.ts');
 * cleanDir('my-custom-tests');
 * ```
 */
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