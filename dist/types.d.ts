export interface SnippetInfo {
    imports: string[];
    snippet: string;
    description: string | null;
    dir: string;
    filename: string;
}
export interface MapperResult {
    output: string;
    filepath: string;
}
export type MapperFunction = (info: SnippetInfo[]) => MapperResult | null | Promise<MapperResult | null>;
/** @alias MapperFunction - shorter alias for convenience */
export type MapperFn = MapperFunction;
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