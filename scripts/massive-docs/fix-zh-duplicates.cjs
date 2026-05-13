const fs = require('fs');

const file = 'src/docsContent/zh.ts';
let content = fs.readFileSync(file, 'utf8');

// Fix pattern: }, followed by whitespace/newlines, followed by },{
// This is caused by the add-prevention script adding an extra },
const pattern = /(\s*\},)\s*\},\{/g;
let fixed = 0;
content = content.replace(pattern, (match, p1) => {
  fixed++;
  return p1 + '\n        {';
});

fs.writeFileSync(file, content);
console.log('Fixed', fixed, 'duplicate },{ patterns');
