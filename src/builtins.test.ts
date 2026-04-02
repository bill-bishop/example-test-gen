// Auto-generated test file from @example snippets
// Source: src/builtins.ts
// Generated: 2026-04-02T04:20:57.424Z

import { resolveBuiltInConfig } from './builtins.ts';
import { mkTempDir, writeFile, rmDir } from '../test/helpers/environment.js';
import { createJestMapper } from './builtins.ts';
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

test('TRANS09_jest_uses_tsconfig_defaults', async () => {
  const testDir = mkTempDir('jest-defaults-test');
  writeFile(`${testDir}/tsconfig.json`, JSON.stringify({
    compilerOptions: { rootDir: './source' },
    include: ['source/**\\/*']
  }));
  const config = await resolveBuiltInConfig('jest', testDir);
  expect(config.rootDir).toBe('./source');
  expect(config.include).toContain('source/**\/*');
  rmDir(testDir);
});

test('TRANS01_createJestMapper_generates_test_file_with_it_blocks', async () => {
  const mapper = createJestMapper();
  const snippets = [
    { imports: [], snippet: "expect(1 + 1).toBe(2);", description: "addition works", dir: "src", filename: "math.ts" }
  ];
  const result = mapper(snippets);
  expect(result).not.toBeNull();
  expect(result!.output).toContain("describe");
  expect(result!.output).toContain("it('addition works'");
  expect(result!.output).toContain("expect(1 + 1).toBe(2)");
  expect(result!.filepath).toBe("src/math.test.js");
});

test('TRANS03_includes_source_path_and_notice_in_header', async () => {
  const mapper = createJestMapper();
  const snippets = [
    { imports: [], snippet: "expect(true).toBe(true);", description: "test", dir: "lib", filename: "utils.ts" }
  ];
  const result = mapper(snippets);
  expect(result!.output).toContain("Auto-generated test file from @example snippets");
  expect(result!.output).toContain("Source: lib/utils.ts");
  expect(result!.output).toContain("Generated:");
});

test('TRANS04_deduplicates_imports_in_generated_tests', async () => {
  const mapper = createJestMapper();
  const snippets = [
    { imports: ["import { foo } from './bar';"], snippet: "foo();", description: "test1", dir: "src", filename: "test.ts" },
    { imports: ["import { foo } from './bar';"], snippet: "foo();", description: "test2", dir: "src", filename: "test.ts" }
  ];
  const result = mapper(snippets);
  // Should only have one import of './bar' even though both snippets have it
  const importMatches = result!.output.match(/from '.*bar'/g);
  expect(importMatches).toHaveLength(1);
});

test('TRANS08_auto_imports_source_file_exports', async () => {
  const mapper = createJestMapper();
  const snippets = [
    { imports: [], snippet: "expect(true).toBe(true);", description: "test", dir: "src", filename: "example.ts" }
  ];
  const result = mapper(snippets);
  // Should include auto-import of source file
  expect(result!.output).toContain("import * as example from './src/example.ts';");
});

test('TRANS10_vitest_uses_tsconfig_defaults', async () => {
  const testDir = mkTempDir('vitest-defaults-test');
  writeFile(`${testDir}/tsconfig.json`, JSON.stringify({
    compilerOptions: { rootDir: './lib' },
    include: ['lib/**\\/*'],
    exclude: ['**\\/*.test.ts']
  }));
  const config = await resolveBuiltInConfig('vitest', testDir);
  expect(config.rootDir).toBe('./lib');
  expect(config.include).toContain('lib/**\/*');
  expect(config.exclude).toContain('**\/*.test.ts');
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