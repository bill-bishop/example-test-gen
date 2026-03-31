import { generate } from './generator.js';
import { GenerateOptions, MapperFunction } from './types.js';

export { generate } from './generator.js';
export { GenerateOptions, MapperFunction, MapperResult, SnippetInfo } from './types.js';
export { createJestMapper, createVitestMapper, builtInConfigs } from './builtins.js';

export async function generateTests(
  pattern: string | string[],
  mapper: MapperFunction,
  cwd?: string
): Promise<void> {
  return generate({ pattern, mapper, cwd });
}
