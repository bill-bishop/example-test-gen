import { execSync } from 'child_process';
import { existsSync, rmSync, readFileSync, readdirSync } from 'fs';

const CLI_PATH = 'dist/cli.js';

/**
 * Run the CLI with given arguments
 * @param args - Arguments string to pass to CLI
 * @returns CLI output as string
 */
export function runCli(args: string): string {
  return execSync(`node ${CLI_PATH} ${args}`, { encoding: 'utf-8' });
}

/**
 * Remove a file if it exists
 * @param filepath - File path to remove
 */
export function rm(filepath: string): void {
  if (existsSync(filepath)) rmSync(filepath);
}

/**
 * Remove a directory if it exists
 * @param dir - Directory path to clean
 */
export function cleanDir(dir: string): void {
  if (existsSync(dir)) rmSync(dir, { recursive: true });
}

/**
 * Check if a file exists
 * @param filepath - Path to check
 * @returns True if file exists
 */
export function fileExists(filepath: string): boolean {
  return existsSync(filepath);
}

/**
 * Read a file as UTF-8 string
 * @param filepath - Path to read
 * @returns File contents
 */
export function readFile(filepath: string): string {
  return readFileSync(filepath, 'utf-8');
}

/**
 * List all test files (.test.ts) in a directory
 * @param testDir - Directory to scan
 * @returns Array of test file names
 */
export function listTestFiles(testDir: string): string[] {
  if (!existsSync(testDir)) return [];
  return readdirSync(testDir).filter(f => f.endsWith('.test.ts'));
}
