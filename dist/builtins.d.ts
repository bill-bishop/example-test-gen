import { MapperFunction } from './types.js';
export declare function resolveBuiltInConfig(name: 'jest' | 'vitest', cwd: string): Promise<{
    include: string | string[];
    exclude: string | string[];
    mapper: MapperFunction;
    rootDir: string;
}>;
export declare function createJestMapper(): MapperFunction;
export declare function createVitestMapper(): MapperFunction;
/**
 * Loads a built-in mapper by name
 * @example SDK03_loads_jest_builtin_mapper
 * @example SDK03_loads_vitest_builtin_mapper
 */
export declare function loadBuiltInMapper(name: 'jest' | 'vitest', cwd: string): Promise<MapperFunction>;
/**
 * Built-in configurations for SDK consumers
 * @example SDK03_exports_builtInConfigs_with_jest_and_vitest
 */
export declare const builtInConfigs: {
    jest: {
        mapper: MapperFunction;
        name: "jest";
    };
    vitest: {
        mapper: MapperFunction;
        name: "vitest";
    };
};
//# sourceMappingURL=builtins.d.ts.map