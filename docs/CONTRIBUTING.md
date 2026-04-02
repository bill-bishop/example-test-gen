# Contributing to example-test-gen

## Adding Tests

**DO:**
- DO Use existing or new helpers to keep tests highly readable
- DO reference existing tests which the user agrees are good examples
- DO Iterate on test patterns with the user before making changes to ensure alignment on beauty, readability, and modularity

**DON'T:**
- DO NOT Clutter the helpers directory with redundant functions
- DO NOT Clutter @examples with child_process or fs operations
- DO NOT Tuck away **assertions** or **method-under-test** calls into helpers as it harms readability and debuggability
