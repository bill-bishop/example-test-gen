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
export type MapperFunction = (info: SnippetInfo) => MapperResult | null | Promise<MapperResult | null>;
export interface GenerateOptions {
    pattern: string | string[];
    mapper: MapperFunction;
    cwd?: string;
    /** Output directory for generated tests (default: 'tests') */
    outDir?: string;
}
/** @deprecated Use GenerateOptions instead - maintained for backwards compatibility */
export type Config = GenerateOptions;
//# sourceMappingURL=types.d.ts.map