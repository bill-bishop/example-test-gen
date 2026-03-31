import { MapperFunction } from './types.js';

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
    const importSection = allImports.size > 0 ? Array.from(allImports).join('\n') + '\n\n' : '';

    const header = `// Generated test from @example snippets\n// Source: ${first.dir ? first.dir + '/' : ''}${first.filename}\n\n`;

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
    const importSection = allImports.size > 0 ? Array.from(allImports).join('\n') + '\n\n' : '';

    const header = `// Generated test from @example snippets\n// Source: ${first.dir ? first.dir + '/' : ''}${first.filename}\n\n`;

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

export const builtInConfigs: Record<string, { pattern: string | string[]; mapper: MapperFunction }> = {
  jest: {
    pattern: 'src/**/*.{ts,js,tsx,jsx}',
    mapper: createJestMapper()
  },
  vitest: {
    pattern: 'src/**/*.{ts,js,tsx,jsx}',
    mapper: createVitestMapper()
  }
};
