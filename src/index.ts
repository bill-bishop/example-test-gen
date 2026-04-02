import { generate } from './generator.js';
import { Config, validateConfigAsync, resolveConfig } from './config.js';
import { GenerateOptions, MapperFn, MapperFunction, SnippetInfo, MapperResult } from './types.js';

// Export main generation function
export { generate } from './generator.js';

// Export types
export { GenerateOptions, MapperFn, MapperFunction, SnippetInfo, MapperResult } from './types.js';
export { Config, ValidationResult, ResolvedConfig } from './config.js';
export { createJestMapper, createVitestMapper, builtInConfigs, loadBuiltInMapper, resolveBuiltInConfig } from './builtins.js';

/**
 * Generate tests from @example snippets
 * @example SDK01_generateTests_accepts_config_object
 */
export async function generateTests(config: Config): Promise<number> {
  // Validate config
  const validation = await validateConfigAsync(config);
  if (!validation.valid) {
    throw new Error(`Config validation failed: ${validation.errors.join(', ')}`);
  }

  // Resolve config (convert builtin names to mapper functions)
  const resolved = await resolveConfig(config, process.cwd());

  // Call generate with resolved config
  return generate({
    include: resolved.include,
    exclude: resolved.exclude,
    mapper: resolved.mapper,
    cwd: process.cwd(),
    outDir: resolved.outDir,
    rootDir: resolved.rootDir
  });
}
