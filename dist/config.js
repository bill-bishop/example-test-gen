"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = validateConfig;
exports.validateConfigAsync = validateConfigAsync;
exports.resolveConfig = resolveConfig;
exports.loadConfig = loadConfig;
exports.buildConfigFromFlags = buildConfigFromFlags;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
/**
 * Validates a configuration object synchronously
 * Note: For async validation including rootDir existence check, use validateConfigAsync
 * @example SDK05_validates_required_include_field
 * @example SDK05_validates_mapper_is_present
 * @example SDK05_accepts_valid_config
 */
function validateConfig(config, cwd = process.cwd()) {
    const errors = [];
    // Validate include
    if (!config.include || !Array.isArray(config.include) || config.include.length === 0) {
        errors.push('include is required and must be a non-empty array of file patterns');
    }
    // Validate mapper
    if (!config.mapper) {
        errors.push('mapper is required (must be a function or "jest" | "vitest")');
    }
    else if (typeof config.mapper !== 'function' && config.mapper !== 'jest' && config.mapper !== 'vitest') {
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
async function validateConfigAsync(config, cwd = process.cwd()) {
    const errors = [];
    // Validate include
    if (!config.include || !Array.isArray(config.include) || config.include.length === 0) {
        errors.push('include is required and must be a non-empty array of file patterns');
    }
    // Validate mapper
    if (!config.mapper) {
        errors.push('mapper is required (must be a function or "jest" | "vitest")');
    }
    else if (typeof config.mapper !== 'function' && config.mapper !== 'jest' && config.mapper !== 'vitest') {
        errors.push('mapper must be a function or one of: "jest", "vitest"');
    }
    // Validate rootDir exists if provided
    if (config.rootDir) {
        const rootDirPath = path_1.default.resolve(cwd, config.rootDir);
        try {
            const stats = await fs_1.promises.stat(rootDirPath);
            if (!stats.isDirectory()) {
                errors.push(`rootDir is not a directory: ${config.rootDir}`);
            }
        }
        catch {
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
 * Resolves a Config to a ResolvedConfig by loading built-in mappers if needed
 * @example SDK04_resolves_builtin_mapper_names_to_functions
 */
async function resolveConfig(config, cwd) {
    const { loadBuiltInMapper } = await import('./builtins.js');
    let mapper;
    if (typeof config.mapper === 'function') {
        mapper = config.mapper;
    }
    else {
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
async function loadConfig(configPath, cwd) {
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
    const resolvedPath = path_1.default.resolve(cwd, configPath);
    const fileUrl = (0, url_1.pathToFileURL)(resolvedPath).href;
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
function buildConfigFromFlags(flags, baseConfig) {
    return {
        include: flags.include ? [flags.include] : (baseConfig.include ?? []),
        exclude: flags.exclude ? [flags.exclude] : baseConfig.exclude,
        outDir: flags.outDir ?? baseConfig.outDir,
        rootDir: flags.rootDir ?? baseConfig.rootDir,
        overwrite: flags.overwrite ?? baseConfig.overwrite,
        mapper: baseConfig.mapper ?? 'vitest'
    };
}
//# sourceMappingURL=config.js.map