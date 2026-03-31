export default {
  pattern: 'src/**/*.ts',
  mapper: ({ filename }) => ({
    output: `// Custom test for ${filename}`,
    filepath: `custom-output/${filename}.test.js`
  })
};
