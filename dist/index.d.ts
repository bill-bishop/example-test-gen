import { MapperFunction } from './types.js';
export { generate } from './generator.js';
export { GenerateOptions, MapperFunction, MapperResult, SnippetInfo } from './types.js';
export { createJestMapper, createVitestMapper, builtInConfigs } from './builtins.js';
export declare function generateTests(pattern: string | string[], mapper: MapperFunction, cwd?: string): Promise<void>;
//# sourceMappingURL=index.d.ts.map