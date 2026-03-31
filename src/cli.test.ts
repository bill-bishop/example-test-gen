// Generated test from @example snippet
// Source: src/cli.ts

import { runCliWith, cleanDir, assertExists } from '../test/helpers/cli.js';

import { test, expect } from 'vitest';

test('CLI06_outDir_flag_overrides_default_output_directory', async () => {
  cleanDir('my-custom-tests');
  runCliWith({ config: 'vitest', outDir: 'my-custom-tests' });
  assertExists('my-custom-tests/cli.test.ts');
  cleanDir('my-custom-tests');
});