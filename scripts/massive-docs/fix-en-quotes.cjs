const fs = require('fs');

const file = 'src/docsContent/en.ts';
let content = fs.readFileSync(file, 'utf8');

// Replace double-backslash-quote with single-backslash-quote
// This fixes over-escaped quotes from previous scripts
content = content.replace(/\\'/g, "\\'");

fs.writeFileSync(file, content);
console.log('Fixed double-escaped quotes in en.ts');
