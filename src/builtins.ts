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
 * import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'fs';
 * import { tmpdir } from 'os';
 * import { join } from 'path';
 * const tmpDir = tmpdir();
 * const testDir = join(tmpDir, 'test-' + Date.now());
 * mkdirSync(testDir, { recursive: true });
 * writeFileSync(join(testDir, 'tsconfig.json'), JSON.stringify({ compilerOptions: { rootDir: './src' } }));
 * const result = await readTsConfig(testDir);
 * expect(result?.compilerOptions?.rootDir).toBe('./src');
 * rmSync(testDir, { recursive: true });
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
 * @example SDK03_loads_vitest_builtin_mapper
 */
export async function loadBuiltInMapper(name: 'jest' | 'vitest', cwd: string): Promise<MapperFunction> {
  const config = await resolveBuiltInConfig(name, cwd);
  return config.mapper;
}

/**
 * Built-in configurations for SDK consumers
 * @example SDK03_exports_builtInConfigs_with_jest_and_vitest
 */
export const builtInConfigs = {
  jest: { mapper: createJestMapper(), name: 'jest' as const },
  vitest: { mapper: createVitestMapper(), name: 'vitest' as const }
};
