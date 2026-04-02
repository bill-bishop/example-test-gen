import { MapperFn } from './types.js';
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
    /** Overwrite existing test files without prompting */
    overwrite?: boolean;
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
export declare function validateConfig(config: Partial<Config>, cwd?: string): ValidationResult;
/**
 * Validates config asynchronously (for rootDir existence check)
 * @example SDK05_validates_rootDir_exists_if_provided
 */
export declare function validateConfigAsync(config: Partial<Config>, cwd?: string): Promise<ValidationResult>;
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
export declare function resolveConfig(config: Config, cwd: string): Promise<ResolvedConfig>;
/**
 * Loads a configuration from a file or built-in name
 * @example SDK04_loads_config_from_builtin_name
 */
export declare function loadConfig(configPath: string, cwd: string): Promise<Config>;
/**
 * Creates a Config object from CLI flags
 * @example SDK04_builds_config_from_cli_flags
 */
export declare function buildConfigFromFlags(flags: {
    include?: string;
    exclude?: string;
    outDir?: string;
    rootDir?: string;
    overwrite?: boolean;
}, baseConfig: Partial<Config>): Config;
//# sourceMappingURL=config.d.ts.map