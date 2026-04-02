// Auto-generated test file from @example snippets
// Source: src/outputs.ts
// Generated: 2026-04-02T04:27:59.775Z

import { readOutputFile } from './outputs.ts';
import { mkTempDir, rmDir } from '../test/helpers/environment.js';
import { promises as fs } from 'fs';
import path from 'path';
import { substituteVariables } from './outputs.ts';
import { renderOutput } from './outputs.ts';
import { formatErrorList } from './outputs.ts';
import * as outputs from './src/outputs.ts';

import { test, expect } from 'vitest';

test('outputs_readOutputFile_reads_file_content', async () => {
  const testDir = mkTempDir('outputs-test');
  await fs.mkdir(path.join(testDir, 'outputs'), { recursive: true });
  await fs.writeFile(path.join(testDir, 'outputs', 'test.txt'), 'Hello World');
  const content = await readOutputFile('test.txt', testDir);
  expect(content).toBe('Hello World');
  rmDir(testDir);
});

test('outputs_substituteVariables_replaces_placeholders', async () => {
  const result = substituteVariables('Hello {{name}}! Welcome to {{place}}.', {
    name: 'Alice',
    place: 'Wonderland'
  });
  expect(result).toBe('Hello Alice! Welcome to Wonderland.');
});

test('outputs_substituteVariables_preserves_unknown_placeholders', async () => {
  const result = substituteVariables('Hello {{name}}! Unknown: {{unknown}}.', {
    name: 'Alice'
  });
  expect(result).toBe('Hello Alice! Unknown: {{unknown}}.');
});

test('outputs_renderOutput_renders_template_with_variables', async () => {
  const testDir = mkTempDir('render-test');
  await fs.mkdir(path.join(testDir, 'outputs'), { recursive: true });
  await fs.writeFile(path.join(testDir, 'outputs', 'template.txt'), 'Hello {{name}}!');
  const content = await renderOutput('template.txt', { name: 'World' }, testDir);
  expect(content).toBe('Hello World!');
  rmDir(testDir);
});

test('outputs_renderOutput_reads_file_without_variables', async () => {
  const testDir = mkTempDir('render-test2');
  await fs.mkdir(path.join(testDir, 'outputs'), { recursive: true });
  await fs.writeFile(path.join(testDir, 'outputs', 'plain.txt'), 'Plain content');
  const content = await renderOutput('plain.txt', undefined, testDir);
  expect(content).toBe('Plain content');
  rmDir(testDir);
});

test('outputs_formatErrorList_formats_errors_with_numbers', async () => {
  const formatted = formatErrorList(['First error', 'Second error', 'Third error']);
  expect(formatted).toContain('1. First error');
  expect(formatted).toContain('2. Second error');
  expect(formatted).toContain('3. Third error');
  expect(formatted.split('\n')).toHaveLength(3);
});

test('outputs_formatErrorList_returns_empty_string_for_empty_array', async () => {
  const formatted = formatErrorList([]);
  expect(formatted).toBe('');
});