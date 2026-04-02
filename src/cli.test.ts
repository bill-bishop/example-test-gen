// Auto-generated test file from @example snippets
// Source: src/cli.ts
// Generated: 2026-04-02T06:32:01.489Z

import { runCli } from '../test/helpers/environment.js';
import { runCli, readFile } from '../test/helpers/environment.js';
import { runCli, rm, fileExists } from '../test/helpers/environment.js';
import { runCli, cleanDir, fileExists } from '../test/helpers/environment.js';
import * as cli from './src/cli.ts';

import { test, expect } from 'vitest';

test('CLI01_help_flag_shows_usage_info', async () => {
  const output = runCli('--help');
  expect(output).toContain('example-test-gen');
  expect(output).toContain('--config');
  expect(output).toContain('--help');
});

test('CLI01_version_flag_shows_package_version', async () => {
  const pkg = JSON.parse(readFile('package.json'));
  const output = runCli('--version').trim();
  expect(output).toBe(pkg.version);
});

test('CLI02_builtin_config_jest_generates_jest_tests', async () => {
  rm('src/cli.test.js');
  runCli('--config=jest');
  expect(fileExists('src/cli.test.js')).toBe(true);
});

test('CLI02_builtin_config_vitest_generates_vitest_tests', async () => {
  rm('src/cli.test.ts');
  runCli('--config=vitest');
  expect(fileExists('src/cli.test.ts')).toBe(true);
});

test('CLI03_custom_config_path_loads_user_defined_config', async () => {
  cleanDir('custom-output');
  runCli('--config=test/fixtures/config/custom.mjs');
  expect(fileExists('custom-output/cli.test.js')).toBe(true);
  cleanDir('custom-output');
});

test('CLI04_missing_config_shows_clear_error', async () => {
  expect(() => runCli('--config=nonexistent-config.mjs')).toThrow();
});

test('CLI04_invalid_config_path_shows_error', async () => {
  expect(() => runCli('--config=/path/that/does/not/exist.mjs')).toThrow();
});

test('CLI05_include_flag_overrides_config_pattern todo: fix this test - it will always pass', async () => {
  cleanDir('custom-output');
  runCli('--config=vitest --include="src/cli.ts" --outDir="custom-output"');
  expect(fileExists('custom-output/cli.test.ts')).toBe(true);
  cleanDir('custom-output');
});

test('CLI05_exclude_flag_filters_out_files', async () => {
  cleanDir('custom-output');
  expect(fileExists('custom-output/cli.test.ts')).toBe(false);
  expect(fileExists('custom-output/builtins.test.ts')).toBe(false);
  runCli('--config=vitest --include="src/*.ts" --exclude="**\/cli.ts" --outDir="custom-output"');
  expect(fileExists('custom-output/cli.test.ts')).toBe(false);
  expect(fileExists('custom-output/builtins.test.ts')).toBe(true);
  cleanDir('custom-output');
});

test('CLI06_outDir_flag_overrides_default_output_directory', async () => {
  cleanDir('my-custom-tests');
  runCli('--config=vitest --outDir=my-custom-tests');
  expect(fileExists('my-custom-tests/cli.test.ts')).toBe(true);
  cleanDir('my-custom-tests');
});

test('CLI07_rootDir_flag_overrides_source_root', async () => {
  cleanDir('root-tests');
  runCli('--config=vitest --root-dir=src --outDir=root-tests');
  // Files should be generated relative to the rootDir
  expect(fileExists('root-tests/cli.test.ts')).toBe(true);
  cleanDir('root-tests');
});