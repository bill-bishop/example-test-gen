// Auto-generated test file from @example snippets
// Source: src/generator.ts
// Generated: 2026-04-02T02:17:57.246Z

import { generate } from './generator.ts';
import { builtInConfigs } from './builtins.ts';
import { cleanDir, fileExists, readFile } from '../test/helpers/environment.js';
import { cleanDir, listTestFiles, readFile } from '../test/helpers/environment.js';
import * as generator from './src/generator.ts';

describe('generator', () => {
  it('SDK01_generateTests_produces_output_file_from_pattern', async () => {
    // TODO: revisit this test after clarifying outDir/filepath alignment (see README TODO)
    
    cleanDir('tmp');
    await generate({
      pattern: 'src/extractor.ts',
      mapper: builtInConfigs.vitest.mapper,
      outDir: 'tmp'
    });
    expect(fileExists('tmp/extractor.test.ts')).toBe(true);
    expect(readFile('tmp/extractor.test.ts')).toContain('extracts snippets correctly');
    cleanDir('tmp');
  });

  it('CORE05_generates_one_test_file_with_multiple_tests_per_source', async () => {
    cleanDir('tmp');
    
    await generate({
      pattern: 'src/cli.ts',
      mapper: builtInConfigs.vitest.mapper,
      outDir: 'tmp'
    });
    
    const files = listTestFiles('tmp');
    expect(files.length).toBe(1);
    expect(files).toContain('cli.test.ts');
    
    const content = readFile('tmp/cli.test.ts');
    expect(content).toContain('CLI01');
    expect(content).toContain('CLI02');
    expect(content).toContain('CLI03');
    expect(content).toContain('CLI04');
    expect(content).toContain('CLI05');
    expect(content).toContain('CLI06');
    
    cleanDir('tmp');
  });
});