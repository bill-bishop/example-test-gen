#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const generator_js_1 = require("./generator.js");
const builtins_js_1 = require("./builtins.js");
const config_js_1 = require("./config.js");
const outputs_js_1 = require("./outputs.js");
async function loadConfigAndValidate(configPath, cwd) {
    // Check for built-in configs first
    if (configPath === 'jest' || configPath === 'vitest') {
        const { resolveBuiltInConfig } = await import('./builtins.js');
        const resolved = await resolveBuiltInConfig(configPath, cwd);
        return {
            include: Array.isArray(resolved.include) ? resolved.include : [resolved.include],
            exclude: Array.isArray(resolved.exclude) ? resolved.exclude : resolved.exclude ? [resolved.exclude] : undefined,
            rootDir: resolved.rootDir,
            mapper: configPath
        };
    }
    return (0, config_js_1.loadConfig)(configPath, cwd);
}
/**
 * CLI entry point for example-test-gen
 *
 * @example CLI01_help_flag_shows_usage_info
 * ```ts
 * import { runCli } from '../test/helpers/environment.js';
 * const output = runCli('--help');
 * expect(output).toContain('example-test-gen');
 * expect(output).toContain('--config');
 * expect(output).toContain('--help');
 * ```
 *
 * @example CLI01_version_flag_shows_package_version
 * ```ts
 * import { runCli, readFile } from '../test/helpers/environment.js';
 * const pkg = JSON.parse(readFile('package.json'));
 * const output = runCli('--version').trim();
 * expect(output).toBe(pkg.version);
 * ```
 *
 * @example CLI02_builtin_config_jest_generates_jest_tests
 * ```ts
 * import { runCli, rm, fileExists } from '../test/helpers/environment.js';
 * rm('src/cli.test.js');
 * runCli('--config=jest');
 * expect(fileExists('src/cli.test.js')).toBe(true);
 * ```
 *
 * @example CLI02_builtin_config_vitest_generates_vitest_tests
 * ```ts
 * import { runCli, rm, fileExists } from '../test/helpers/environment.js';
 * rm('src/cli.test.ts');
 * runCli('--config=vitest');
 * expect(fileExists('src/cli.test.ts')).toBe(true);
 * ```
 *
 * @example CLI03_custom_config_path_loads_user_defined_config
 * ```ts
 * import { runCli, cleanDir, fileExists } from '../test/helpers/environment.js';
 * cleanDir('custom-output');
 * runCli('--config=test/fixtures/config/custom.mjs');
 * expect(fileExists('custom-output/cli.test.js')).toBe(true);
 * cleanDir('custom-output');
 * ```
 *
 * @example CLI04_missing_config_shows_clear_error
 * ```ts
 * import { runCli } from '../test/helpers/environment.js';
 * expect(() => runCli('--config=nonexistent-config.mjs')).toThrow();
 * ```
 *
 * @example CLI04_invalid_config_path_shows_error
 * ```ts
 * import { runCli } from '../test/helpers/environment.js';
 * expect(() => runCli('--config=/path/that/does/not/exist.mjs')).toThrow();
 * ```
 *
 * @example CLI05_include_flag_overrides_config_pattern todo: fix this test - it will always pass
 * ```ts
 * import { runCli, cleanDir, fileExists } from '../test/helpers/environment.js';
 * cleanDir('custom-output');
 * runCli('--config=vitest --include="src/cli.ts" --outDir="custom-output"');
 * expect(fileExists('custom-output/cli.test.ts')).toBe(true);
 * cleanDir('custom-output');
 * ```
 *
 * @example CLI05_exclude_flag_filters_out_files
 * ```ts
 * import { runCli, cleanDir, fileExists } from '../test/helpers/environment.js';
 * cleanDir('custom-output');
 * expect(fileExists('custom-output/cli.test.ts')).toBe(false);
 * expect(fileExists('custom-output/builtins.test.ts')).toBe(false);
 * runCli('--config=vitest --include="src/*.ts" --exclude="**\/cli.ts" --outDir="custom-output"');
 * expect(fileExists('custom-output/cli.test.ts')).toBe(false);
 * expect(fileExists('custom-output/builtins.test.ts')).toBe(true);
 * cleanDir('custom-output');
 * ```
 *
 * @example CLI06_outDir_flag_overrides_default_output_directory
 * ```ts
 * import { runCli, cleanDir, fileExists } from '../test/helpers/environment.js';
 * cleanDir('my-custom-tests');
 * runCli('--config=vitest --outDir=my-custom-tests');
 * expect(fileExists('my-custom-tests/cli.test.ts')).toBe(true);
 * cleanDir('my-custom-tests');
 * ```
 */
async function main() {
    const args = process.argv.slice(2);
    const cwd = process.cwd();
    // Handle help and version flags
    if (args.includes('--help')) {
        await (0, outputs_js_1.printOutput)('help.txt', undefined, cwd);
        process.exit(0);
    }
    if (args.includes('--version')) {
        const pkgPath = path_1.default.resolve(cwd, 'package.json');
        const pkg = JSON.parse(await fs_1.promises.readFile(pkgPath, 'utf-8'));
        console.log(pkg.version);
        process.exit(0);
    }
    const configFlag = args.find((arg) => arg.startsWith('--config='));
    const configPath = configFlag ? configFlag.replace('--config=', '') : 'example-test-gen.config.mjs';
    const includeFlag = args.find((arg) => arg.startsWith('--include='));
    const include = includeFlag ? includeFlag.replace('--include=', '') : undefined;
    const excludeFlag = args.find((arg) => arg.startsWith('--exclude='));
    const exclude = excludeFlag ? excludeFlag.replace('--exclude=', '') : undefined;
    const outDirFlag = args.find((arg) => arg.startsWith('--outDir='));
    const outDir = outDirFlag ? outDirFlag.replace('--outDir=', '') : undefined;
    const rootDirFlag = args.find((arg) => arg.startsWith('--root-dir='));
    const rootDir = rootDirFlag ? rootDirFlag.replace('--root-dir=', '') : undefined;
    const overwriteFlag = args.find((arg) => arg.startsWith('--overwrite'));
    const overwrite = overwriteFlag !== undefined;
    try {
        // Load base config
        const baseConfig = await loadConfigAndValidate(configPath, cwd);
        // Build final config from CLI flags
        const finalConfig = (0, config_js_1.buildConfigFromFlags)({ include, exclude, outDir, rootDir, overwrite }, baseConfig);
        // Validate final config (SDK05: Config Validation)
        const validation = await (0, config_js_1.validateConfigAsync)(finalConfig, cwd);
        if (!validation.valid) {
            await (0, outputs_js_1.printErrorAndExit)('config-error.txt', { errors: (0, outputs_js_1.formatErrorList)(validation.errors) }, 1, cwd);
        }
        // Resolve mapper if it's a builtin name
        let mapper;
        if (typeof finalConfig.mapper === 'function') {
            mapper = finalConfig.mapper;
        }
        else {
            mapper = builtins_js_1.builtInConfigs[finalConfig.mapper].mapper;
        }
        const generatedFiles = await (0, generator_js_1.generate)({
            include: finalConfig.include,
            exclude: finalConfig.exclude,
            mapper,
            outDir: finalConfig.outDir,
            rootDir: finalConfig.rootDir,
            overwrite: finalConfig.overwrite,
            cwd
        });
        const fileList = generatedFiles.map(f => `  \u001b[33m•\u001b[0m ${f}`).join('\n') || '  \u001b[90m(no new files generated)\u001b[0m';
        await (0, outputs_js_1.printOutput)('success.txt', {
            fileCount: String(generatedFiles.length),
            fileList: fileList,
            outDir: finalConfig.outDir ?? 'same directory as source files',
            mapper: typeof finalConfig.mapper === 'function' ? 'custom function' : finalConfig.mapper
        }, cwd);
    }
    catch (err) {
        await (0, outputs_js_1.printErrorAndExit)('general-error.txt', { message: err.message }, 1, cwd);
    }
}
main();
//# sourceMappingURL=cli.js.map