import { MapperFunction } from './types.js';

/**
 * Configuration schema for example-test-gen
 * @example loads and validates a valid config
 * ```ts
 * import { loadConfig, Config } from './src/config.ts';
 * 
 * const config: Config = await loadConfig('vitest');
 * expect(config.pattern).toBeDefined();
 * expect(config.mapper).toBeDefined();
 * expect(config.outDir).toBe('tests');
 * ```
 * 
 * @example throws on invalid config with helpful message
 * ```ts
 * import { loadConfig } from './src/config.ts';
 * 
 * await expect(loadConfig('./invalid-config.mjs')).rejects.toThrow(/pattern is required/);
 * ```
 */

export interface Config {
  /** Glob pattern(s) to find source files with @example annotations */
  pattern: string | string[];
  /** Mapper function to transform snippets into test files */
  mapper: MapperFunction;
  /** Output directory for generated tests (default: 'tests') */
  outDir?: string;
  /** Working directory (default: process.cwd()) */
  cwd?: string;
}

/**
 * Built-in configurations for zero-config usage
 * @example returns vitest built-in config
 * ```ts
 * import { builtInConfigs } from './src/config.ts';
 * 
 * const vitestConfig = builtInConfigs['vitest'];
 * expect(vitestConfig.pattern).toBe('src/**/*.{ts,js,tsx,jsx}');
 * expect(vitestConfig.outDir).toBe('tests');
 * ```
 */
export const builtInConfigs: Record<string, Config> = {
  // To be populated by createJestConfig() and createVitestConfig()
  // These will include outDir: 'tests' for R10
};

/**
 * Load and validate a configuration
 * @param configPath - Built-in name ('jest', 'vitest') or path to custom config file
 * @param cwd - Working directory
 * @returns Validated Config object
 * 
 * Validation rules:
 * - pattern is required (string or array of strings)
 * - mapper is required (function) unless loading a built-in
 * - outDir defaults to 'tests' if not specified
 * 
 * @throws Error with helpful message if config is invalid
 */
export async function loadConfig(
  configPath: string,
  cwd: string = process.cwd()
): Promise<Config> {
  // Implementation to be added in implementation phase
  // This will handle:
  // - Loading built-in configs
  // - Loading user config files via dynamic import
  // - Validating required fields
  // - Applying defaults (outDir: 'tests')
  // - Providing helpful error messages for invalid configs
  throw new Error('Not implemented');
}

/**
 * Create Vitest configuration with proper output directory
 * @example creates vitest config with tests/ output
 * ```ts
 * import { createVitestConfig } from './src/config.ts';
 * 
 * const config = createVitestConfig();
 * expect(config.outDir).toBe('tests');
 * expect(config.pattern).toBe('src/**/*.{ts,js,tsx,jsx}');
 * expect(typeof config.mapper).toBe('function');
 * ```
 */
export function createVitestConfig(): Config {
  // Implementation to be added
  // Returns config with:
  // - pattern: 'src/**/*.{ts,js,tsx,jsx}'
  // - mapper: Vitest mapper with import path transformation
  // - outDir: 'tests'
  throw new Error('Not implemented');
}

/**
 * Create Jest configuration with proper output directory
 * @example creates jest config with __tests__/ output
 * ```ts
 * import { createJestConfig } from './src/config.ts';
 * 
 * const config = createJestConfig();
 * expect(config.outDir).toBe('__tests__');
 * expect(config.pattern).toBe('src/**/*.{ts,js,tsx,jsx}');
 * expect(typeof config.mapper).toBe('function');
 * ```
 */
export function createJestConfig(): Config {
  // Implementation to be added
  // Returns config with:
  // - pattern: 'src/**/*.{ts,js,tsx,jsx}'
  // - mapper: Jest mapper with import path transformation
  // - outDir: '__tests__'
  throw new Error('Not implemented');
}

/**
 * Validate a configuration object
 * @param config - Config object to validate
 * @throws Error if config is invalid
 */
function validateConfig(config: Partial<Config>): asserts config is Config {
  // Implementation to be added
  // Validates:
  // - pattern exists and is string or array of strings
  // - mapper exists and is a function
  // - Provides specific error messages for each validation failure
}
