import { existsSync, rmSync, readFileSync, readdirSync } from 'fs';
import { generate } from '../../src/generator.js';
import { builtInConfigs } from '../../src/builtins.js';

export function cleanDir(dir: string): void {
  if (existsSync(dir)) rmSync(dir, { recursive: true });
}

export function readTestFile(filepath: string): string {
  return readFileSync(filepath, 'utf-8');
}

export function assertFileContains(filepath: string, substring: string): void {
  const content = readTestFile(filepath);
  expect(content).toContain(substring);
}

export function assertTestExists(testDir: string, testName: string): void {
  expect(existsSync(`${testDir}/${testName}.test.ts`)).toBe(true);
}

export function listTestFiles(testDir: string): string[] {
  if (!existsSync(testDir)) return [];
  return readdirSync(testDir).filter(f => f.endsWith('.test.ts'));
}

export async function generateWithVitest(pattern: string, outDir = 'tests'): Promise<void> {
  await generate({
    pattern,
    mapper: builtInConfigs.vitest.mapper,
    outDir
  });
}

export async function generateWithJest(pattern: string, outDir = 'tests'): Promise<void> {
  await generate({
    pattern,
    mapper: builtInConfigs.jest.mapper,
    outDir
  });
}
