import { execSync } from 'child_process';
import { existsSync, rmSync, readFileSync } from 'fs';
import * as path from 'path';

const CLI_PATH = 'dist/cli.js';

export interface RunOptions {
  config?: string;
  files?: string;
  outDir?: string;
}

export function runCli(args: string): string {
  return execSync(`node ${CLI_PATH} ${args}`, { encoding: 'utf-8' });
}

export function runCliWith(options: RunOptions): string {
  const args: string[] = [];
  if (options.config) args.push(`--config=${options.config}`);
  if (options.files) args.push(`--files="${options.files}"`);
  if (options.outDir) args.push(`--outDir=${options.outDir}`);
  return runCli(args.join(' '));
}

export function cleanDir(dir: string): void {
  if (existsSync(dir)) rmSync(dir, { recursive: true });
}

export function assertExists(filepath: string): void {
  expect(existsSync(filepath)).toBe(true);
}

export function assertNotExists(filepath: string): void {
  expect(existsSync(filepath)).toBe(false);
}

export function readOutput(filepath: string): string {
  return readFileSync(filepath, 'utf-8');
}

export const readFile = readOutput;

export function getPackageVersion(): string {
  const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
  return pkg.version;
}

export function expectError(fn: () => void): Error {
  try {
    fn();
    throw new Error('Expected function to throw');
  } catch (err) {
    return err as Error;
  }
}
