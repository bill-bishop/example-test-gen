const fs = require('fs');
const path = require('path');

const srcDir = path.join(process.cwd(), 'src');
const files = fs.readdirSync(srcDir);

files
  .filter(f => f.endsWith('.test.js') || f.endsWith('.test.ts'))
  .forEach(f => {
    const filepath = path.join(srcDir, f);
    fs.rmSync(filepath);
    console.log(`Removed: ${filepath}`);
  });
