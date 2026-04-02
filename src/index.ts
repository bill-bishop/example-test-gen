import { generate } from './generator.js';
import { GenerateOptions, MapperFunction, SnippetInfo } from './types.js';

export { generate } from './generator.js';
export { GenerateOptions, MapperFunction, SnippetInfo } from './types.js';
export { createJestMapper, createVitestMapper, builtInConfigs } from './builtins.js';

export async function generateTests(
  include: string | string[],
  mapper: MapperFunction,
  cwd?: string
): Promise<void> {
  return generate({ include, mapper, cwd });
}
