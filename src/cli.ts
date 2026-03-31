#!/usr/bin/env node

import path from 'path';
import { pathToFileURL } from 'url';
import { generate } from './generator.js';
import { MapperFunction } from './types.js';
import { builtInConfigs } from './builtins.js';

async function loadConfig(configPath: string): Promise<{ mapper: MapperFunction; pattern: string | string[] }> {
  // Check for built-in configs first
  if (builtInConfigs[configPath]) {
    return builtInConfigs[configPath];
  }
  
  const resolvedPath = path.resolve(configPath);
  const fileUrl = pathToFileURL(resolvedPath).href;
  const module = await import(fileUrl);
  return module.default || module;
}

async function main() {
  const args = process.argv.slice(2);
  const configFlag = args.find((arg: string) => arg.startsWith('--config='));
  const configPath = configFlag ? configFlag.replace('--config=', '') : 'example-test-gen.config.mjs';
  
  try {
    const { mapper, pattern } = await loadConfig(configPath);
    await generate({ pattern, mapper });
    console.log('Test files generated successfully');
  } catch (err) {
    console.error('Error:', (err as Error).message);
    process.exit(1);
  }
}

main();
