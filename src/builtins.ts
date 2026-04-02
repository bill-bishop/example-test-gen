import { promises as fs } from 'fs';
import path from 'path';
import { MapperFunction } from './types.js';

interface TsConfig {
  compilerOptions?: {
    rootDir?: string;
  };
  include?: string[];
  exclude?: string[];
}

/**
 * @example reads_tsconfig_correctly
 * ```ts
 * import { resolveBuiltInConfig } from './builtins.ts';
 * import { mkTempDir, writeFile, rmDir } from '../test/helpers/environment.js';
 * 
 * const testDir = mkTempDir('tsconfig-test');
 * writeFile(`${testDir}/tsconfig.json`, JSON.stringify({ compilerOptions: { rootDir: './lib' } }));
 * const config = await resolveBuiltInConfig('vitest', testDir);
 * expect(config.rootDir).toBe('./lib');
 * rmDir(testDir);
 * ```
 */
/**
 * @example TRANS09_jest_uses_tsconfig_defaults
 * ```ts
 * import { resolveBuiltInConfig } from './builtins.ts';
 * import { mkTempDir, writeFile, rmDir } from '../test/helpers/environment.js';
 * const testDir = mkTempDir('jest-defaults-test');
 * writeFile(`${testDir}/tsconfig.json`, JSON.stringify({
 *   compilerOptions: { rootDir: './source' },
 *   include: ['source/**\\/*']
 * }));
 * const config = await resolveBuiltInConfig('jest', testDir);
 * expect(config.rootDir).toBe('./source');
 * expect(config.include).toContain('source/**\/*');
 * rmDir(testDir);
 * ```
 */
async function readTsConfig(cwd: string): Promise<TsConfig | null> {
  try {
    const tsconfigPath = path.join(cwd, 'tsconfig.json');
    const content = await fs.readFile(tsconfigPath, 'utf-8');
    return JSON.parse(content) as TsConfig;
  } catch {
    return null;
  }
}

export async function resolveBuiltInConfig(name: 'jest' | 'vitest', cwd: string): Promise<{ include: string | string[]; exclude: string | string[]; mapper: MapperFunction; rootDir: string }> {
  const tsconfig = await readTsConfig(cwd);
  
  // Default values
  const rootDir = tsconfig?.compilerOptions?.rootDir ?? './src';
  const include = tsconfig?.include ?? [`${rootDir.replace(/^\.\//, '').replace(/\/$/, '')}/**/*`];
  const exclude = tsconfig?.exclude ?? ['node_modules', 'dist', '**/*.test.ts', '**/*.test.js'];
  
  const mapper = name === 'jest' ? createJestMapper() : createVitestMapper();
  
  return { include, exclude, mapper, rootDir };
}

export function createJestMapper(): MapperFunction {
  /**
   * @example TRANS01_createJestMapper_generates_test_file_with_it_blocks
   * ```ts
   * import { createJestMapper } from './builtins.ts';
   * const mapper = createJestMapper();
   * const snippets = [
   *   { imports: [], snippet: "expect(1 + 1).toBe(2);", description: "addition works", dir: "src", filename: "math.ts" }
   * ];
   * const result = mapper(snippets);
   * expect(result).not.toBeNull();
   * expect(result!.output).toContain("describe");
   * expect(result!.output).toContain("it('addition works'");
   * expect(result!.output).toContain("expect(1 + 1).toBe(2)");
   * expect(result!.filepath).toBe("src/math.test.js");
   * ```
   * @example TRANS03_includes_source_path_and_notice_in_header
   * ```ts
   * import { createJestMapper } from './builtins.ts';
   * const mapper = createJestMapper();
   * const snippets = [
   *   { imports: [], snippet: "expect(true).toBe(true);", description: "test", dir: "lib", filename: "utils.ts" }
   * ];
   * const result = mapper(snippets);
   * expect(result!.output).toContain("Auto-generated test file from @example snippets");
   * expect(result!.output).toContain("Source: lib/utils.ts");
   * expect(result!.output).toContain("Generated:");
   * ```
   * @example TRANS04_deduplicates_imports_in_generated_tests
   * ```ts
   * import { createJestMapper } from './builtins.ts';
   * const mapper = createJestMapper();
   * const snippets = [
   *   { imports: ["import { foo } from './bar';"], snippet: "foo();", description: "test1", dir: "src", filename: "test.ts" },
   *   { imports: ["import { foo } from './bar';"], snippet: "foo();", description: "test2", dir: "src", filename: "test.ts" }
   * ];
   * const result = mapper(snippets);
   * // Should only have one import of './bar' even though both snippets have it
   * const importMatches = result!.output.match(/from '.*bar'/g);
   * expect(importMatches).toHaveLength(1);
   * ```
   * @example TRANS08_auto_imports_source_file_exports
   * ```ts
   * import { createJestMapper } from './builtins.ts';
   * const mapper = createJestMapper();
   * const snippets = [
   *   { imports: [], snippet: "expect(true).toBe(true);", description: "test", dir: "src", filename: "example.ts" }
   * ];
   * const result = mapper(snippets);
   * // Should include auto-import of source file
   * expect(result!.output).toContain("import * as example from './src/example.ts';");
   * ```
   */
  return (snippets) => {
    if (snippets.length === 0) return null;

    const first = snippets[0];
    const testName = first.filename.replace(/\.(ts|js|tsx|jsx|mjs|cjs)$/, '');
    const outputDir = first.dir || '.';

    // Collect and deduplicate imports from all snippets
    const allImports = new Set<string>();
    for (const s of snippets) {
      for (const imp of s.imports) {
        allImports.add(imp);
      }
    }

    // Add auto-import of source file
    const sourceRelativePath = first.dir ? `./${first.dir}/${first.filename}` : `./${first.filename}`;
    allImports.add(`import * as ${testName} from '${sourceRelativePath}';`);

    const importSection = allImports.size > 0 ? Array.from(allImports).join('\n') + '\n\n' : '';

    const header = `// Auto-generated test file from @example snippets\n// Source: ${first.dir ? first.dir + '/' : ''}${first.filename}\n// Generated: ${new Date().toISOString()}\n\n`;

    // Generate multiple it() blocks, one per snippet
    const testBlocks = snippets.map(s => {
      const itDescription = s.description ?? 'example test';
      const indentedSnippet = s.snippet.split('\n').map((line: string) => '    ' + line).join('\n');
      return `  it('${itDescription}', async () => {\n${indentedSnippet}\n  });`;
    }).join('\n\n');

    return {
      output: `${header}${importSection}describe('${testName}', () => {\n${testBlocks}\n});`,
      filepath: `${outputDir}/${testName}.test.js`
    };
  };
}

export function createVitestMapper(): MapperFunction {
  /**
   * @example TRANS10_vitest_uses_tsconfig_defaults
   * ```ts
   * import { resolveBuiltInConfig } from './builtins.ts';
   * import { mkTempDir, writeFile, rmDir } from '../test/helpers/environment.js';
   * const testDir = mkTempDir('vitest-defaults-test');
   * writeFile(`${testDir}/tsconfig.json`, JSON.stringify({
   *   compilerOptions: { rootDir: './lib' },
   *   include: ['lib/**\\/*'],
   *   exclude: ['**\\/*.test.ts']
   * }));
   * const config = await resolveBuiltInConfig('vitest', testDir);
   * expect(config.rootDir).toBe('./lib');
   * expect(config.include).toContain('lib/**\/*');
   * expect(config.exclude).toContain('**\/*.test.ts');
   * rmDir(testDir);
   * ```
   */
  return (snippets) => {
    if (snippets.length === 0) return null;

    const first = snippets[0];
    const testName = first.filename.replace(/\.(ts|js|tsx|jsx|mjs|cjs)$/, '');
    const outputDir = first.dir || '.';

    // Collect and deduplicate imports from all snippets
    const allImports = new Set<string>();
    for (const s of snippets) {
      for (const imp of s.imports) {
        allImports.add(imp);
      }
    }

    // Add auto-import of source file
    const sourceRelativePath = first.dir ? `./${first.dir}/${first.filename}` : `./${first.filename}`;
    allImports.add(`import * as ${testName} from '${sourceRelativePath}';`);

    const importSection = allImports.size > 0 ? Array.from(allImports).join('\n') + '\n\n' : '';

    const header = `// Auto-generated test file from @example snippets\n// Source: ${first.dir ? first.dir + '/' : ''}${first.filename}\n// Generated: ${new Date().toISOString()}\n\n`;

    // Generate multiple test() blocks, one per snippet
    const testBlocks = snippets.map(s => {
      const itDescription = s.description ?? `${testName} example`;
      const indentedSnippet = s.snippet.split('\n').map((line: string) => '  ' + line).join('\n');
      return `test('${itDescription}', async () => {\n${indentedSnippet}\n});`;
    }).join('\n\n');

    return {
      output: `${header}${importSection}import { test, expect } from 'vitest';\n\n${testBlocks}`,
      filepath: `${outputDir}/${testName}.test.ts`
    };
  };
}

/**
 * Loads a built-in mapper by name
 * @example SDK03_loads_jest_builtin_mapper
 * ```ts
 * import { loadBuiltInMapper } from './builtins.ts';
 * const mapper = await loadBuiltInMapper('jest', '.');
 * expect(typeof mapper).toBe('function');
 * ```
 * @example SDK03_loads_vitest_builtin_mapper
 * ```ts
 * import { loadBuiltInMapper } from './builtins.ts';
 * const mapper = await loadBuiltInMapper('vitest', '.');
 * expect(typeof mapper).toBe('function');
 * ```
 */
export async function loadBuiltInMapper(name: 'jest' | 'vitest', cwd: string): Promise<MapperFunction> {
  const config = await resolveBuiltInConfig(name, cwd);
  return config.mapper;
}

/**
 * Built-in configurations for SDK consumers
 * @example SDK03_exports_builtInConfigs_with_jest_and_vitest
 * ```ts
 * import { builtInConfigs } from './builtins.ts';
 * expect(builtInConfigs.jest).toBeDefined();
 * expect(builtInConfigs.vitest).toBeDefined();
 * expect(builtInConfigs.jest.name).toBe('jest');
 * expect(builtInConfigs.vitest.name).toBe('vitest');
 * expect(typeof builtInConfigs.jest.mapper).toBe('function');
 * expect(typeof builtInConfigs.vitest.mapper).toBe('function');
 * ```
 */
export const builtInConfigs = {
  jest: { mapper: createJestMapper(), name: 'jest' as const },
  vitest: { mapper: createVitestMapper(), name: 'vitest' as const }
};
