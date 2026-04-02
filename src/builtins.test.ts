// Auto-generated test file from @example snippets
// Source: src/builtins.ts
// Generated: 2026-04-02T02:22:20.154Z

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import * as builtins from './src/builtins.ts';

import { test, expect } from 'vitest';

test('reads_tsconfig_correctly', async () => {
  const tmpDir = tmpdir();
  const testDir = join(tmpDir, 'test-' + Date.now());
  mkdirSync(testDir, { recursive: true });
  writeFileSync(join(testDir, 'tsconfig.json'), JSON.stringify({ compilerOptions: { rootDir: './src' } }));
  const result = await readTsConfig(testDir);
  expect(result?.compilerOptions?.rootDir).toBe('./src');
  rmSync(testDir, { recursive: true });
});