import { promises as fs } from 'fs';
import path from 'path';
import { GenerateOptions, MapperResult } from './types.js';
import { extractSnippets, findFiles } from './extractor.js';

export async function generate(options: GenerateOptions): Promise<void> {
  const { pattern, mapper, cwd = process.cwd() } = options;
  
  for await (const filePath of findFiles(pattern, cwd)) {
    const snippets = await extractSnippets(filePath, cwd);
    
    for (const snippetInfo of snippets) {
      const result = await mapper(snippetInfo);
      
      if (!result) continue;
      
      const { output, filepath: relativeOutputPath } = result;
      const absoluteOutputPath = path.resolve(cwd, relativeOutputPath);
      const outputDir = path.dirname(absoluteOutputPath);
      
      await fs.mkdir(outputDir, { recursive: true });
      await fs.writeFile(absoluteOutputPath, output, 'utf-8');
    }
  }
}
