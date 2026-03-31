import { MapperFunction } from './types.js';

export function createJestMapper(): MapperFunction {
  return ({ imports, snippet, description, dir, filename }) => {
    const testName = filename.replace(/\.(ts|js|tsx|jsx|mjs|cjs)$/, '');
    const outputDir = dir || '.';
    const itDescription = description ?? 'example test';
    
    const importSection = imports.length > 0 ? imports.join('\n') + '\n\n' : '';
    const header = `// Generated test from @example snippet\n// Source: ${dir ? dir + '/' : ''}${filename}\n// Snippet:\n${snippet.split('\n').map(line => '//   ' + line).join('\n')}\n\n`;
    
    return {
      output: `${header}${importSection}describe('${testName}', () => {\n  it('${itDescription}', async () => {\n${snippet.split('\n').map(line => '    ' + line).join('\n')}\n  });\n});`,
      filepath: `${outputDir}/${testName}.test.js`
    };
  };
}

export function createVitestMapper(): MapperFunction {
  return ({ imports, snippet, description, dir, filename }) => {
    const testName = filename.replace(/\.(ts|js|tsx|jsx|mjs|cjs)$/, '');
    const outputDir = dir || '.';
    const itDescription = description ?? `${testName} example`;
    
    const importSection = imports.length > 0 ? imports.join('\n') + '\n\n' : '';
    const header = `// Generated test from @example snippet\n// Source: ${dir ? dir + '/' : ''}${filename}\n// Snippet:\n${snippet.split('\n').map(line => '//   ' + line).join('\n')}\n\n`;
    
    return {
      output: `${header}${importSection}import { test, expect } from 'vitest';\n\ntest('${itDescription}', async () => {\n${snippet.split('\n').map(line => '  ' + line).join('\n')}\n});`,
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
