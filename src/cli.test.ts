// Generated test from @example snippets
// Source: src/cli.ts

import { runCli, readFile } from '../test/helpers/environment.js';
import { runCli, cleanDir, fileExists } from '../test/helpers/environment.js';
import { runCli } from '../test/helpers/environment.js';

import { test, expect } from 'vitest';

test('CLI01_help_flag_shows_usage_info', async () => {
  const output = runCli('--help');
  expect(output).toContain(readFile('outputs/help.txt'));
});

test('CLI01_version_flag_shows_package_version', async () => {
  const pkg = JSON.parse(readFile('package.json'));
  const output = runCli('--version').trim();
  expect(output).toBe(pkg.version);
});

test('CLI02_builtin_config_jest_generates_jest_tests', async () => {
  cleanDir('generated-tests');
  runCli('--config=jest');
  expect(fileExists('generated-tests/cli.test.js')).toBe(true);
});

test('CLI02_builtin_config_vitest_generates_vitest_tests', async () => {
  cleanDir('tests');
  runCli('--config=vitest');
  expect(fileExists('tests/cli.test.ts')).toBe(true);
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

test('CLI05_files_flag_overrides_config_pattern', async () => {
  cleanDir('tests');
  runCli('--config=vitest --files="src/cli.ts"');
  expect(fileExists('tests/cli.test.ts')).toBe(true);
});

test('CLI06_outDir_flag_overrides_default_output_directory', async () => {
  cleanDir('my-custom-tests');
  runCli('--config=vitest --outDir=my-custom-tests');
  expect(fileExists('my-custom-tests/cli.test.ts')).toBe(true);
  cleanDir('my-custom-tests');
});