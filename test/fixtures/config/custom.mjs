export default {
  include: 'src/**/*.ts',
  mapper: (snippets) => {
    const { filename } = snippets[0];
    const name = filename.replace(/\.(ts|js|tsx|jsx|mjs|cjs)$/, '');
    return {
      output: `// Custom test for ${filename}`,
      filepath: `custom-output/${name}.test.js`
    };
  }
};
