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
}

/** @deprecated Use GenerateOptions instead - maintained for backwards compatibility */
export type Config = GenerateOptions;
