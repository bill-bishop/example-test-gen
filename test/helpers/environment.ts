import { execSync } from 'child_process';
import { existsSync, rmSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

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
 * Write a file with given content
 * @param filepath - Path to write
 * @param content - Content to write
 */
export function writeFile(filepath: string, content: string): void {
  writeFileSync(filepath, content, 'utf-8');
}

/**
 * Create a temporary directory
 * @param prefix - Prefix for the directory name
 * @returns Path to the created directory
 */
export function mkTempDir(prefix: string): string {
  const dir = join(tmpdir(), `${prefix}-${Date.now()}`);
  mkdirSync(dir, { recursive: true });
  return dir;
}

/**
 * Remove a directory recursively
 * @param dir - Directory path to remove
 */
export function rmDir(dir: string): void {
  if (existsSync(dir)) rmSync(dir, { recursive: true });
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
