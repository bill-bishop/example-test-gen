import { promises as fs } from 'fs';
import path from 'path';

function getOutputsDir(cwd: string = process.cwd()): string {
  return path.resolve(cwd, 'outputs');
}

export async function readOutputFile(filename: string, cwd?: string): Promise<string> {
  const filePath = path.join(getOutputsDir(cwd), filename);
  return fs.readFile(filePath, 'utf-8');
}

export function substituteVariables(template: string, variables: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, name) => variables[name] ?? match);
}

export async function renderOutput(filename: string, variables?: Record<string, string>, cwd?: string): Promise<string> {
  let content = await readOutputFile(filename, cwd);
  if (variables) {
    content = substituteVariables(content, variables);
  }
  return content;
}

export async function printOutput(filename: string, variables?: Record<string, string>, cwd?: string): Promise<void> {
  const rendered = await renderOutput(filename, variables, cwd);
  console.log(rendered);
}

export async function printErrorAndExit(filename: string, variables?: Record<string, string>, exitCode = 1, cwd?: string): Promise<void> {
  const rendered = await renderOutput(filename, variables, cwd);
  console.error(rendered);
  process.exit(exitCode);
}

export function formatErrorList(errors: string[]): string {
  return errors.map((err, i) => `  ${i + 1}. ${err}`).join('\n');
}
