import { promises as fs } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { MapperFn, MapperResult } from './types.js';

/**
 * Configuration interface for test generation
 * @example SDK04_config_object_supports_all_required_fields
 */
export interface Config {
  /** File patterns to include */
  include: string[];
  /** File patterns to exclude */
  exclude?: string[];
  /** Root directory for finding source files (default: './src') */
  rootDir?: string;
  /** Mapper function or built-in name ('jest' | 'vitest') */
  mapper: MapperFn | 'jest' | 'vitest';
  /** Output directory for generated tests */
  outDir?: string;
}

/**
 * Validation result type
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates a configuration object synchronously
 * Note: For async validation including rootDir existence check, use validateConfigAsync
 * @example SDK05_validates_required_include_field
 * @example SDK05_validates_mapper_is_present
 * @example SDK05_accepts_valid_config
 */
export function validateConfig(config: Partial<Config>, cwd: string = process.cwd()): ValidationResult {
  const errors: string[] = [];

  // Validate include
  if (!config.include || !Array.isArray(config.include) || config.include.length === 0) {
    errors.push('include is required and must be a non-empty array of file patterns');
  }

  // Validate mapper
  if (!config.mapper) {
    errors.push('mapper is required (must be a function or "jest" | "vitest")');
  } else if (typeof config.mapper !== 'function' && config.mapper !== 'jest' && config.mapper !== 'vitest') {
    errors.push('mapper must be a function or one of: "jest", "vitest"');
  }

  // Validate exclude is array if provided
  if (config.exclude !== undefined && !Array.isArray(config.exclude)) {
    errors.push('exclude must be an array of file patterns if provided');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates config asynchronously (for rootDir existence check)
 * @example SDK05_validates_rootDir_exists_if_provided
 */
export async function validateConfigAsync(config: Partial<Config>, cwd: string = process.cwd()): Promise<ValidationResult> {
  const errors: string[] = [];

  // Validate include
  if (!config.include || !Array.isArray(config.include) || config.include.length === 0) {
    errors.push('include is required and must be a non-empty array of file patterns');
  }

  // Validate mapper
  if (!config.mapper) {
    errors.push('mapper is required (must be a function or "jest" | "vitest")');
  } else if (typeof config.mapper !== 'function' && config.mapper !== 'jest' && config.mapper !== 'vitest') {
    errors.push('mapper must be a function or one of: "jest", "vitest"');
  }

  // Validate rootDir exists if provided
  if (config.rootDir) {
    const rootDirPath = path.resolve(cwd, config.rootDir);
    try {
      const stats = await fs.stat(rootDirPath);
      if (!stats.isDirectory()) {
        errors.push(`rootDir is not a directory: ${config.rootDir}`);
      }
    } catch {
      errors.push(`rootDir does not exist: ${config.rootDir}`);
    }
  }

  // Validate exclude is array if provided
  if (config.exclude !== undefined && !Array.isArray(config.exclude)) {
    errors.push('exclude must be an array of file patterns if provided');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Resolved configuration with mapper function
 */
export interface ResolvedConfig {
  include: string[];
  exclude: string[];
  rootDir: string;
  mapper: MapperFn;
  outDir?: string;
}

/**
 * Resolves a Config to a ResolvedConfig by loading built-in mappers if needed
 * @example SDK04_resolves_builtin_mapper_names_to_functions
 */
export async function resolveConfig(config: Config, cwd: string): Promise<ResolvedConfig> {
  const { loadBuiltInMapper } = await import('./builtins.js');

  let mapper: MapperFn;
  if (typeof config.mapper === 'function') {
    mapper = config.mapper;
  } else {
    mapper = await loadBuiltInMapper(config.mapper, cwd);
  }

  return {
    include: config.include,
    exclude: config.exclude ?? [],
    rootDir: config.rootDir ?? './src',
    mapper,
    outDir: config.outDir
  };
}

/**
 * Loads a configuration from a file or built-in name
 * @example SDK04_loads_config_from_builtin_name
 */
export async function loadConfig(configPath: string, cwd: string): Promise<Config> {
  // Check for built-in configs first
  if (configPath === 'jest' || configPath === 'vitest') {
    const { resolveBuiltInConfig } = await import('./builtins.js');
    const builtIn = await resolveBuiltInConfig(configPath, cwd);
    return {
      include: Array.isArray(builtIn.include) ? builtIn.include : [builtIn.include],
      exclude: Array.isArray(builtIn.exclude) ? builtIn.exclude : builtIn.exclude ? [builtIn.exclude] : undefined,
      rootDir: builtIn.rootDir,
      mapper: configPath
    };
  }

  // Load custom config file
  const resolvedPath = path.resolve(cwd, configPath);
  const fileUrl = pathToFileURL(resolvedPath).href;
  const module = await import(fileUrl);
  const config = module.default || module;
  
  // Normalize include/exclude to arrays
  return {
    ...config,
    include: Array.isArray(config.include) ? config.include : config.include ? [config.include] : [],
    exclude: Array.isArray(config.exclude) ? config.exclude : config.exclude ? [config.exclude] : undefined
  };
}

/**
 * Creates a Config object from CLI flags
 * @example SDK04_builds_config_from_cli_flags
 */
export function buildConfigFromFlags(
  flags: {
    include?: string;
    exclude?: string;
    outDir?: string;
    rootDir?: string;
  },
  baseConfig: Partial<Config>
): Config {
  return {
    include: flags.include ? [flags.include] : (baseConfig.include ?? []),
    exclude: flags.exclude ? [flags.exclude] : baseConfig.exclude,
    outDir: flags.outDir ?? baseConfig.outDir,
    rootDir: flags.rootDir ?? baseConfig.rootDir,
    mapper: baseConfig.mapper ?? 'vitest'
  };
}
