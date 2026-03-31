// Generated test from @example snippets
// Source: src/generator.ts

import { cleanDir, generateWithVitest, assertFileContains, listTestFiles } from '../test/helpers/generator.js';

import { test, expect } from 'vitest';

test('CORE05_generates_one_test_file_with_multiple_tests_per_source', async () => {
  cleanDir('tmp');
  await generateWithVitest('src/cli.ts', 'tmp');
  expect(listTestFiles('tmp').length).toBe(1);
  expect(listTestFiles('tmp')).toContain('cli.test.ts');
  assertFileContains('tmp/cli.test.ts', 'CLI01');
  assertFileContains('tmp/cli.test.ts', 'CLI02');
  assertFileContains('tmp/cli.test.ts', 'CLI03');
  assertFileContains('tmp/cli.test.ts', 'CLI04');
  assertFileContains('tmp/cli.test.ts', 'CLI05');
  assertFileContains('tmp/cli.test.ts', 'CLI06');
  cleanDir('tmp');
});