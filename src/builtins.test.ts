// Auto-generated test file from @example snippets
// Source: src/builtins.ts
// Generated: 2026-04-02T03:50:40.936Z

import { resolveBuiltInConfig } from './builtins.ts';
import { mkTempDir, writeFile, rmDir } from '../test/helpers/environment.js';
import { loadBuiltInMapper } from './builtins.ts';
import { builtInConfigs } from './builtins.ts';
import * as builtins from './src/builtins.ts';

import { test, expect } from 'vitest';

test('reads_tsconfig_correctly', async () => {
  const testDir = mkTempDir('tsconfig-test');
  writeFile(`${testDir}/tsconfig.json`, JSON.stringify({ compilerOptions: { rootDir: './lib' } }));
  const config = await resolveBuiltInConfig('vitest', testDir);
  expect(config.rootDir).toBe('./lib');
  rmDir(testDir);
});

test('SDK03_loads_jest_builtin_mapper', async () => {
  const mapper = await loadBuiltInMapper('jest', '.');
  expect(typeof mapper).toBe('function');
});

test('SDK03_loads_vitest_builtin_mapper', async () => {
  const mapper = await loadBuiltInMapper('vitest', '.');
  expect(typeof mapper).toBe('function');
});

test('SDK03_exports_builtInConfigs_with_jest_and_vitest', async () => {
  expect(builtInConfigs.jest).toBeDefined();
  expect(builtInConfigs.vitest).toBeDefined();
  expect(builtInConfigs.jest.name).toBe('jest');
  expect(builtInConfigs.vitest.name).toBe('vitest');
  expect(typeof builtInConfigs.jest.mapper).toBe('function');
  expect(typeof builtInConfigs.vitest.mapper).toBe('function');
});