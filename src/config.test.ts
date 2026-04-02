// Auto-generated test file from @example snippets
// Source: src/config.ts
// Generated: 2026-04-02T04:14:59.427Z

import { buildConfigFromFlags } from './config.ts';
import * as config from './src/config.ts';

import { test, expect } from 'vitest';

test('TRANS07_overwrite_flag_allows_idempotent_generation', async () => {
  const baseConfig = { include: ['src/**\/*.ts'], mapper: 'vitest' as const };
  const config = buildConfigFromFlags({ overwrite: true }, baseConfig);
  expect(config.overwrite).toBe(true);
});