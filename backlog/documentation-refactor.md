# User-Friendly Documentation Refactor

## Description

Break the monolithic requirements document into user-friendly artifacts organized by user surface and audience:

1. **CLI Documentation** - For end users using the command-line tool
2. **SDK Documentation** - For developers integrating programmatically
3. **Internal/Implementation Documentation** - For contributors and maintainers

## Motivation

The current `REQUIREMENTS.md` is comprehensive but serves multiple audiences poorly:
- End users need installation, quickstart, and CLI reference
- SDK consumers need API docs, types, and configuration examples
- Contributors need architecture, internal design, and implementation details

## Proposed Structure

```
docs/
├── README.md                    # Documentation index
├── cli/
│   ├── README.md               # CLI overview
│   ├── installation.md         # Installation & setup
│   ├── quickstart.md           # Getting started guide
│   └── reference.md            # Complete CLI flag reference
├── sdk/
│   ├── README.md               # SDK overview
│   ├── api.md                  # API reference (generateTests, types)
│   ├── configuration.md        # Config object schema
│   └── examples.md             # Common usage patterns
├── internal/
│   ├── README.md               # Contributing guide
│   ├── architecture.md         # High-level design
│   ├── requirements.md         # Current REQUIREMENTS.md content
│   └── decisions/              # ADRs (Architecture Decision Records)
└── guides/
    ├── jest-setup.md           # Jest-specific setup guide
    ├── vitest-setup.md         # Vitest-specific setup guide
    └── advanced/               # Advanced topics (custom mappers, etc.)
```

## Proposed Content for Each Section

### CLI Documentation (`docs/cli/`)

Target audience: Developers using the tool from command line

- **README.md**: Overview of CLI capabilities
- **installation.md**: 
  - `npm install -g example-test-gen`
  - npx usage
  - Requirements (Node.js version, etc.)
- **quickstart.md**:
  - Basic usage with `--config=vitest`
  - Expected project structure
  - Adding first @example annotation
  - Running generated tests
- **reference.md**:
  - All CLI flags (`--help`, `--version`, `--config`, `--include`, `--exclude`, `--outDir`, `--root-dir`)
  - Exit codes
  - Error messages and troubleshooting

### SDK Documentation (`docs/sdk/`)

Target audience: Developers integrating programmatically

- **README.md**: When to use SDK vs CLI
- **api.md**:
  - `generateTests(config)` function signature
  - TypeScript types: `SnippetInfo`, `MapperResult`, `MapperFn`, `Config`
  - `builtInConfigs.jest` and `builtInConfigs.vitest`
- **configuration.md**:
  - Config object schema
  - All properties with types and descriptions
  - Validation rules
- **examples.md**:
  - Basic programmatic usage
  - Custom mapper example
  - Integration with build tools

### Internal Documentation (`docs/internal/`)

Target audience: Contributors and maintainers

- **README.md**: How to contribute, dev setup
- **architecture.md**:
  - System overview diagram
  - Data flow: source files → extractor → mapper → test files
  - Built-in mappers architecture
- **requirements.md**: Current REQUIREMENTS.md (moved here)
- **decisions/**: ADRs for key decisions

## Migration Steps

1. Create new directory structure
2. Move REQUIREMENTS.md → docs/internal/requirements.md
3. Extract CLI content from requirements into docs/cli/
4. Extract SDK content from requirements into docs/sdk/
5. Create new user-facing docs/cli/quickstart.md
6. Create new docs/README.md as documentation index
7. Update root README.md to point to new docs

## Status

- Priority: Medium
- Not yet started

## Related

- Current requirements: [REQUIREMENTS.md](../docs/REQUIREMENTS.md)
- Backlog organization pattern established in [_INDEX.md](./_INDEX.md)
