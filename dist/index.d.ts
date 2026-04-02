import { Config } from './config.js';
export { generate } from './generator.js';
export { GenerateOptions, MapperFn, MapperFunction, SnippetInfo, MapperResult } from './types.js';
export { Config, ValidationResult, ResolvedConfig } from './config.js';
export { createJestMapper, createVitestMapper, builtInConfigs, loadBuiltInMapper, resolveBuiltInConfig } from './builtins.js';
/**
 * Generate tests from @example snippets
 * @example SDK01_generateTests_accepts_config_object
 */
export declare function generateTests(config: Config): Promise<void>;
//# sourceMappingURL=index.d.ts.map