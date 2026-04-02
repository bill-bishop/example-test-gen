"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.builtInConfigs = void 0;
exports.resolveBuiltInConfig = resolveBuiltInConfig;
exports.createJestMapper = createJestMapper;
exports.createVitestMapper = createVitestMapper;
exports.loadBuiltInMapper = loadBuiltInMapper;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
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
async function readTsConfig(cwd) {
    try {
        const tsconfigPath = path_1.default.join(cwd, 'tsconfig.json');
        const content = await fs_1.promises.readFile(tsconfigPath, 'utf-8');
        return JSON.parse(content);
    }
    catch {
        return null;
    }
}
async function resolveBuiltInConfig(name, cwd) {
    const tsconfig = await readTsConfig(cwd);
    // Default values
    const rootDir = tsconfig?.compilerOptions?.rootDir ?? './src';
    const include = tsconfig?.include ?? [`${rootDir.replace(/^\.\//, '').replace(/\/$/, '')}/**/*`];
    const exclude = tsconfig?.exclude ?? ['node_modules', 'dist', '**/*.test.ts', '**/*.test.js'];
    const mapper = name === 'jest' ? createJestMapper() : createVitestMapper();
    return { include, exclude, mapper, rootDir };
}
function createJestMapper() {
    return (snippets) => {
        if (snippets.length === 0)
            return null;
        const first = snippets[0];
        const testName = first.filename.replace(/\.(ts|js|tsx|jsx|mjs|cjs)$/, '');
        const outputDir = first.dir || '.';
        // Collect and deduplicate imports from all snippets
        const allImports = new Set();
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
            const indentedSnippet = s.snippet.split('\n').map((line) => '    ' + line).join('\n');
            return `  it('${itDescription}', async () => {\n${indentedSnippet}\n  });`;
        }).join('\n\n');
        return {
            output: `${header}${importSection}describe('${testName}', () => {\n${testBlocks}\n});`,
            filepath: `${outputDir}/${testName}.test.js`
        };
    };
}
function createVitestMapper() {
    return (snippets) => {
        if (snippets.length === 0)
            return null;
        const first = snippets[0];
        const testName = first.filename.replace(/\.(ts|js|tsx|jsx|mjs|cjs)$/, '');
        const outputDir = first.dir || '.';
        // Collect and deduplicate imports from all snippets
        const allImports = new Set();
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
            const indentedSnippet = s.snippet.split('\n').map((line) => '  ' + line).join('\n');
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
async function loadBuiltInMapper(name, cwd) {
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
exports.builtInConfigs = {
    jest: { mapper: createJestMapper(), name: 'jest' },
    vitest: { mapper: createVitestMapper(), name: 'vitest' }
};
//# sourceMappingURL=builtins.js.map