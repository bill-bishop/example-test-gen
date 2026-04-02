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
 * ```ts
 * import { loadBuiltInMapper } from './builtins.ts';
 * const mapper = await loadBuiltInMapper('jest', '.');
 * expect(typeof mapper).toBe('function');
 * ```
 * @example SDK03_loads_vitest_builtin_mapper
 * ```ts
 * import { loadBuiltInMapper } from './builtins.ts';
 * const mapper = await loadBuiltInMapper('vitest', '.');
 * expect(typeof mapper).toBe('function');
 * ```
 */
export declare function loadBuiltInMapper(name: 'jest' | 'vitest', cwd: string): Promise<MapperFunction>;
/**
 * Built-in configurations for SDK consumers
 * @example SDK03_exports_builtInConfigs_with_jest_and_vitest
 * ```ts
 * import { builtInConfigs } from './builtins.ts';
 * expect(builtInConfigs.jest).toBeDefined();
 * expect(builtInConfigs.vitest).toBeDefined();
 * expect(builtInConfigs.jest.name).toBe('jest');
 * expect(builtInConfigs.vitest.name).toBe('vitest');
 * expect(typeof builtInConfigs.jest.mapper).toBe('function');
 * expect(typeof builtInConfigs.vitest.mapper).toBe('function');
 * ```
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