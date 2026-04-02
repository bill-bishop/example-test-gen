// Auto-generated test file from @example snippets
// Source: src/types.ts
// Generated: 2026-04-02T04:14:59.433Z

import * as types from './src/types.ts';

import { test, expect } from 'vitest';

test('SDK02_snippetInfo_type_usage', async () => {
  const snippet: SnippetInfo = {
    imports: ["import { foo } from './bar';"],
    snippet: "expect(foo()).toBe(42);",
    description: "test example",
    dir: "src",
    filename: "example.ts"
  };
  expect(snippet.imports).toHaveLength(1);
  expect(snippet.dir).toBe("src");
});

test('SDK02_mapperResult_type_usage', async () => {
  const result: MapperResult = {
    output: "describe('test', () => { it('works', () => {}); });",
    filepath: "test/example.test.ts"
  };
  expect(result.output).toContain("describe");
  expect(result.filepath).toMatch(/\.test\.ts$/);
});

test('SDK02_mapperFunction_type_usage', async () => {
  const myMapper: MapperFunction = (snippets) => {
    if (snippets.length === 0) return null;
    return {
      output: `// ${snippets.length} tests`,
      filepath: "output.test.ts"
    };
  };
  expect(typeof myMapper).toBe("function");
  const result = myMapper([]);
  expect(result).toBeNull();
});

test('SDK02_generateOptions_type_usage', async () => {
  const options: GenerateOptions = {
    include: "src/**\/*.ts",
    exclude: ["**\/*.test.ts", "node_modules/**"],
    mapper: (snippets) => null,
    cwd: ".",
    outDir: "tests",
    rootDir: "./src",
    overwrite: true
  };
  expect(Array.isArray(options.exclude)).toBe(true);
  expect(options.overwrite).toBe(true);
});

test('SDK02_config_type_usage', async () => {
  const config: Config = {
    include: ["src/**\/*.ts"],
    exclude: ["**\/*.test.ts"],
    rootDir: "./src",
    mapper: "jest",
    outDir: "generated",
    overwrite: false
  };
  expect(config.mapper).toBe("jest");
  expect(Array.isArray(config.include)).toBe(true);
});