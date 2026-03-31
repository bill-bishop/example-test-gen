// Generated test from @example snippets
// Source: src/cli.ts

import { runCli, readFile } from '../test/helpers/cli.js';
import { runCli, getPackageVersion } from '../test/helpers/cli.js';
import { runCliWith, cleanDir, assertExists } from '../test/helpers/cli.js';
import { runCli, expectError } from '../test/helpers/cli.js';

import { test, expect } from 'vitest';

test('CLI01_help_flag_shows_usage_info', async () => {
  expect(runCli('--help')).toContain(readFile('outputs/help.txt'));
});

test('CLI01_version_flag_shows_package_version', async () => {
  const output = runCli('--version').trim();
  expect(output).toBe(getPackageVersion());
});

test('CLI02_builtin_config_jest_generates_jest_tests', async () => {
  cleanDir('generated-tests');
  runCliWith({ config: 'jest' });
  assertExists('cli.test.js');
});

test('CLI02_builtin_config_vitest_generates_vitest_tests', async () => {
  cleanDir('tests');
  runCliWith({ config: 'vitest' });
  assertExists('tests/cli.test.ts');
});

test('CLI03_custom_config_path_loads_user_defined_config', async () => {
  cleanDir('custom-output');
  runCliWith({ config: 'test/fixtures/config/custom.mjs' });
  assertExists('custom-output/cli.test.js');
  cleanDir('custom-output');
});

test('CLI04_missing_config_shows_clear_error', async () => {
  const err = expectError(() => runCli('--config=nonexistent-config.mjs'));
  expect(err.message).toContain('Error');
});

test('CLI04_invalid_config_path_shows_error', async () => {
  const err = expectError(() => runCli('--config=/path/that/does/not/exist.mjs'));
  expect(err.message).toMatch(/Error|Cannot find module/);
});

test('CLI05_files_flag_overrides_config_pattern', async () => {
  cleanDir('tests');
  runCliWith({ config: 'vitest', files: 'src/cli.ts' });
  assertExists('tests/cli.test.ts');
});

test('CLI05_files_flag_supports_multiple_patterns', async () => {
  cleanDir('tests');
  runCliWith({ config: 'vitest', files: 'src/cli.ts,src/index.ts' });
  assertExists('tests/cli.test.ts');
  assertExists('tests/index.test.ts');
});

test('CLI06_outDir_flag_overrides_default_output_directory', async () => {
  cleanDir('my-custom-tests');
  runCliWith({ config: 'vitest', outDir: 'my-custom-tests' });
  assertExists('my-custom-tests/cli.test.ts');
  cleanDir('my-custom-tests');
});