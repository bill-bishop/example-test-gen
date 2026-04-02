#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { generate } from './generator.js';
import { MapperFunction } from './types.js';
import { builtInConfigs } from './builtins.js';
import { Config, validateConfigAsync, buildConfigFromFlags, loadConfig } from './config.js';

async function loadConfigAndValidate(configPath: string, cwd: string): Promise<Config> {
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
  
  return loadConfig(configPath, cwd);
}

/**
 * CLI entry point for example-test-gen
 *
 * @example CLI01_help_flag_shows_usage_info
 * ```ts
 * import { runCli, readFile } from '../test/helpers/environment.js';
 * const output = runCli('--help');
 * expect(output).toContain(readFile('outputs/help.txt'));
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
 * import { runCli, cleanDir, fileExists } from '../test/helpers/environment.js';
 * cleanDir('generated-tests');
 * runCli('--config=jest');
 * expect(fileExists('generated-tests/cli.test.js')).toBe(true);
 * ```
 *
 * @example CLI02_builtin_config_vitest_generates_vitest_tests
 * ```ts
 * import { runCli, cleanDir, fileExists } from '../test/helpers/environment.js';
 * cleanDir('tests');
 * runCli('--config=vitest');
 * expect(fileExists('tests/cli.test.ts')).toBe(true);
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
 * @example CLI05_include_flag_overrides_config_pattern
 * ```ts
 * import { runCli, cleanDir, fileExists } from '../test/helpers/environment.js';
 * cleanDir('tests');
 * runCli('--config=vitest --include="src/cli.ts"');
 * expect(fileExists('tests/cli.test.ts')).toBe(true);
 * ```
 *
 * @example CLI05_exclude_flag_filters_out_files
 * ```ts
 * import { runCli, cleanDir, fileExists } from '../test/helpers/environment.js';
 * cleanDir('tests');
 * runCli('--config=vitest --include="src/*.ts" --exclude="**\/cli.ts"');
 * expect(fileExists('tests/cli.test.ts')).toBe(false);
 * expect(fileExists('tests/builtins.test.ts')).toBe(true);
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
  
  // Handle help and version flags
  if (args.includes('--help')) {
    console.log('Usage: npx example-test-gen [options]');
    console.log('');
    console.log('Options:');
    console.log('  --config=<name|path>   Built-in config (jest|vitest) or custom config file path');
    console.log('  --include=<pattern>    File pattern(s) to include (overrides config)');
    console.log('  --exclude=<pattern>    File pattern(s) to exclude (overrides config)');
    console.log('  --outDir=<dir>         Output directory for generated tests');
    console.log('  --root-dir=<dir>       Root directory for finding source files');
    console.log('  --help                 Show this help message');
    console.log('  --version              Show package version');
    console.log('');
    console.log('Examples:');
    console.log('  npx example-test-gen --config=vitest');
    console.log('  npx example-test-gen --config=jest --include="src/**/*.ts"');
    console.log('  npx example-test-gen --config=./my-config.mjs --outDir=./tests');
    process.exit(0);
  }
  
  const cwd = process.cwd();
  
  if (args.includes('--version')) {
    const pkgPath = path.resolve(cwd, 'package.json');
    const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8'));
    console.log(pkg.version);
    process.exit(0);
  }
  
  const configFlag = args.find((arg: string) => arg.startsWith('--config='));
  const configPath = configFlag ? configFlag.replace('--config=', '') : 'example-test-gen.config.mjs';
  
  const includeFlag = args.find((arg: string) => arg.startsWith('--include='));
  const include = includeFlag ? includeFlag.replace('--include=', '') : undefined;
  
  const excludeFlag = args.find((arg: string) => arg.startsWith('--exclude='));
  const exclude = excludeFlag ? excludeFlag.replace('--exclude=', '') : undefined;
  
  const outDirFlag = args.find((arg: string) => arg.startsWith('--outDir='));
  const outDir = outDirFlag ? outDirFlag.replace('--outDir=', '') : undefined;
  
  const rootDirFlag = args.find((arg: string) => arg.startsWith('--root-dir='));
  const rootDir = rootDirFlag ? rootDirFlag.replace('--root-dir=', '') : undefined;
  
  try {
    // Load base config
    const baseConfig = await loadConfigAndValidate(configPath, cwd);
    
    // Build final config from CLI flags
    const finalConfig = buildConfigFromFlags(
      { include, exclude, outDir, rootDir },
      baseConfig
    );
    
    // Validate final config (SDK05: Config Validation)
    const validation = await validateConfigAsync(finalConfig, cwd);
    if (!validation.valid) {
      console.error('Config validation failed:');
      validation.errors.forEach(err => console.error(`  - ${err}`));
      process.exit(1);
    }
    
    // Resolve mapper if it's a builtin name
    let mapper: MapperFunction;
    if (typeof finalConfig.mapper === 'function') {
      mapper = finalConfig.mapper;
    } else {
      mapper = builtInConfigs[finalConfig.mapper].mapper;
    }
    
    await generate({
      include: finalConfig.include,
      exclude: finalConfig.exclude,
      mapper,
      outDir: finalConfig.outDir,
      rootDir: finalConfig.rootDir,
      cwd
    });
    console.log('Test files generated successfully');
  } catch (err) {
    console.error('Error:', (err as Error).message);
    process.exit(1);
  }
}

main();
