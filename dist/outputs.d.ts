export declare function readOutputFile(filename: string, cwd?: string): Promise<string>;
export declare function substituteVariables(template: string, variables: Record<string, string>): string;
export declare function renderOutput(filename: string, variables?: Record<string, string>, cwd?: string): Promise<string>;
export declare function printOutput(filename: string, variables?: Record<string, string>, cwd?: string): Promise<void>;
export declare function printErrorAndExit(filename: string, variables?: Record<string, string>, exitCode?: number, cwd?: string): Promise<void>;
export declare function formatErrorList(errors: string[]): string;
//# sourceMappingURL=outputs.d.ts.map