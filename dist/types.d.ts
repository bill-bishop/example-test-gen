/**
 * Information about an extracted code snippet
 * @example SDK02_snippetInfo_type_usage
 * ```ts
 * import { SnippetInfo } from './types.ts';
 *
 * const snippet: SnippetInfo = {
 *   imports: ["import { foo } from './bar';"],
 *   snippet: "expect(foo()).toBe(42);",
 *   description: "test example",
 *   dir: "src",
 *   filename: "example.ts"
 * };
 * expect(snippet.imports).toHaveLength(1);
 * expect(snippet.dir).toBe("src");
 * ```
 */
export interface SnippetInfo {
    imports: string[];
    snippet: string;
    description: string | null;
    dir: string;
    filename: string;
}
/**
 * Result returned by a mapper function
 * @example SDK02_mapperResult_type_usage
 * ```ts
 * import { MapperResult } from './types.ts';
 *
 * const result: MapperResult = {
 *   output: "describe('test', () => { it('works', () => {}); });",
 *   filepath: "test/example.test.ts"
 * };
 * expect(result.output).toContain("describe");
 * expect(result.filepath).toMatch(/\.test\.ts$/);
 * ```
 */
export interface MapperResult {
    output: string;
    filepath: string;
}
/**
 * Mapper function type that transforms snippets into test output
 * @example SDK02_mapperFunction_type_usage
 * ```ts
 * import { MapperFunction } from './types.ts';
 *
 * const myMapper: MapperFunction = (snippets) => {
 *   if (snippets.length === 0) return null;
 *   return {
 *     output: `// ${snippets.length} tests`,
 *     filepath: "output.test.ts"
 *   };
 * };
 * expect(typeof myMapper).toBe("function");
 * const result = myMapper([]);
 * expect(result).toBeNull();
 * ```
 */
export type MapperFunction = (info: SnippetInfo[]) => MapperResult | null | Promise<MapperResult | null>;
/** @alias MapperFunction - shorter alias for convenience */
export type MapperFn = MapperFunction;
/**
 * Options for test generation
 * @example SDK02_generateOptions_type_usage
 * ```ts
 * import { GenerateOptions } from './types.ts';
 *
 * const options: GenerateOptions = {
 *   include: "src/**\/*.ts",
 *   exclude: ["**\/*.test.ts", "node_modules/**"],
 *   mapper: (snippets) => null,
 *   cwd: ".",
 *   outDir: "tests",
 *   rootDir: "./src",
 *   overwrite: true
 * };
 * expect(Array.isArray(options.exclude)).toBe(true);
 * expect(options.overwrite).toBe(true);
 * ```
 */
export interface GenerateOptions {
    include: string | string[];
    exclude?: string | string[];
    mapper: MapperFunction;
    cwd?: string;
    /** Output directory for generated tests (default: 'tests') */
    outDir?: string;
    /** Root directory for finding source files */
    rootDir?: string;
    /** Overwrite existing test files without prompting */
    overwrite?: boolean;
}
/** @deprecated Use GenerateOptions instead - maintained for backwards compatibility */
/**
 * Configuration interface for CLI usage (deprecated, use GenerateOptions)
 * @example SDK02_config_type_usage
 * ```ts
 * import { Config } from './types.ts';
 *
 * const config: Config = {
 *   include: ["src/**\/*.ts"],
 *   exclude: ["**\/*.test.ts"],
 *   rootDir: "./src",
 *   mapper: "jest",
 *   outDir: "generated",
 *   overwrite: false
 * };
 * expect(config.mapper).toBe("jest");
 * expect(Array.isArray(config.include)).toBe(true);
 * ```
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
//# sourceMappingURL=types.d.ts.map