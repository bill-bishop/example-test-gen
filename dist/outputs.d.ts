/**
 * Read an output file from the outputs directory
 * @example outputs_readOutputFile_reads_file_content
 * ```ts
 * const testDir = mkTempDir('outputs-test');
 * await fs.mkdir(path.join(testDir, 'outputs'), { recursive: true });
 * await fs.writeFile(path.join(testDir, 'outputs', 'test.txt'), 'Hello World');
 * const content = await readOutputFile('test.txt', testDir);
 * expect(content).toBe('Hello World');
 * rmDir(testDir);
 * ```
 */
export declare function readOutputFile(filename: string, cwd?: string): Promise<string>;
/**
 * Substitute variables in a template string
 * @example outputs_substituteVariables_replaces_placeholders
 * ```ts
 * const result = substituteVariables('Hello {{name}}! Welcome to {{place}}.', {
 *   name: 'Alice',
 *   place: 'Wonderland'
 * });
 * expect(result).toBe('Hello Alice! Welcome to Wonderland.');
 * ```
 * @example outputs_substituteVariables_preserves_unknown_placeholders
 * ```ts
 * const result = substituteVariables('Hello {{name}}! Unknown: {{unknown}}.', {
 *   name: 'Alice'
 * });
 * expect(result).toBe('Hello Alice! Unknown: {{unknown}}.');
 * ```
 */
export declare function substituteVariables(template: string, variables: Record<string, string>): string;
/**
 * Render an output file with optional variable substitution
 * @example outputs_renderOutput_renders_template_with_variables
 * ```ts
 * const testDir = mkTempDir('render-test');
 * await fs.mkdir(path.join(testDir, 'outputs'), { recursive: true });
 * await fs.writeFile(path.join(testDir, 'outputs', 'template.txt'), 'Hello {{name}}!');
 * const content = await renderOutput('template.txt', { name: 'World' }, testDir);
 * expect(content).toBe('Hello World!');
 * rmDir(testDir);
 * ```
 * @example outputs_renderOutput_reads_file_without_variables
 * ```ts
 * const testDir = mkTempDir('render-test2');
 * await fs.mkdir(path.join(testDir, 'outputs'), { recursive: true });
 * await fs.writeFile(path.join(testDir, 'outputs', 'plain.txt'), 'Plain content');
 * const content = await renderOutput('plain.txt', undefined, testDir);
 * expect(content).toBe('Plain content');
 * rmDir(testDir);
 * ```
 */
export declare function renderOutput(filename: string, variables?: Record<string, string>, cwd?: string): Promise<string>;
export declare function printOutput(filename: string, variables?: Record<string, string>, cwd?: string): Promise<void>;
export declare function printErrorAndExit(filename: string, variables?: Record<string, string>, exitCode?: number, cwd?: string): Promise<void>;
/**
 * Format a list of errors with numbered prefixes
 * @example outputs_formatErrorList_formats_errors_with_numbers
 * ```ts
 * const formatted = formatErrorList(['First error', 'Second error', 'Third error']);
 * expect(formatted).toContain('1. First error');
 * expect(formatted).toContain('2. Second error');
 * expect(formatted).toContain('3. Third error');
 * expect(formatted.split('\n')).toHaveLength(3);
 * ```
 * @example outputs_formatErrorList_returns_empty_string_for_empty_array
 * ```ts
 * const formatted = formatErrorList([]);
 * expect(formatted).toBe('');
 * ```
 */
export declare function formatErrorList(errors: string[]): string;
//# sourceMappingURL=outputs.d.ts.map