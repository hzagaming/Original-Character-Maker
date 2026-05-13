const fs = require('fs');

const file = 'src/docsContent/zh.ts';
let content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');
let removed = 0;
const newLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Check if this is an orphaned prevention line
  if (line.trim().startsWith("prevention: '") && i > 0) {
    const prevLine = lines[i - 1].trim();
    const nextLine = (i + 1 < lines.length) ? lines[i + 1].trim() : '';
    // Orphaned if previous is '},' or empty, and next starts with '},'
    if ((prevLine === '},' || prevLine === '}') && nextLine.startsWith('},')) {
      removed++;
      console.log('Removed orphaned prevention at line', i + 1);
      continue;
    }
  }
  newLines.push(line);
}

content = newLines.join('\n');
fs.writeFileSync(file, content);
console.log('Removed', removed, 'orphaned prevention lines');
