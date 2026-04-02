/**
 * Options for rendering output
 */
export interface RenderOptions {
    /** Variables to substitute in the template */
    variables?: Record<string, string>;
    /** Width of the frame (auto if not specified) */
    width?: number;
    /** Title for the frame */
    title?: string;
    /** Color theme for the frame */
    theme?: 'default' | 'error' | 'success' | 'info' | 'warning';
}
/**
 * Read an output file from the outputs directory
 */
export declare function readOutputFile(filename: string, cwd?: string): Promise<string>;
/**
 * Substitute variables in a template string
 * Format: {{variableName}}
 */
export declare function substituteVariables(template: string, variables: Record<string, string>): string;
/**
 * Render an output file with optional framing and variable substitution
 */
export declare function renderOutput(filename: string, options?: RenderOptions, cwd?: string): Promise<string>;
/**
 * Print output directly to console
 */
export declare function printOutput(filename: string, options?: RenderOptions, cwd?: string): Promise<void>;
/**
 * Print error output and exit
 */
export declare function printErrorAndExit(filename: string, options?: RenderOptions, exitCode?: number, cwd?: string): Promise<void>;
/**
 * Helper to format a list of errors for display
 */
export declare function formatErrorList(errors: string[]): string;
/**
 * Helper to format a sample config file for display in errors
 */
export declare function formatSampleConfig(): string;
//# sourceMappingURL=outputs.d.ts.map