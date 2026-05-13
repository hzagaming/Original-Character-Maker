const fs = require('fs');

const file = 'src/docsContent/zh.ts';
let content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');
let removed = 0;
const newLines = [];

function getPrevNonEmptyLine(idx) {
  for (let i = idx - 1; i >= 0; i--) {
    if (lines[i].trim().length > 0) return lines[i].trim();
  }
  return '';
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Check if this is an orphaned prevention line
  if (line.trim().startsWith("prevention: '") && i > 0) {
    const prevLine = getPrevNonEmptyLine(i);
    const nextLine = (i + 1 < lines.length) ? lines[i + 1].trim() : '';
    // Orphaned if previous non-empty line is '},' or '}', and next starts with '},'
    if ((prevLine === '},' || prevLine === '}') && nextLine.startsWith('},')) {
      removed++;
      console.log('Removed orphaned prevention at line', i + 1, 'prev:', prevLine, 'next:', nextLine);
      continue;
    }
  }
  newLines.push(line);
}

content = newLines.join('\n');
fs.writeFileSync(file, content);
console.log('Removed', removed, 'orphaned prevention lines');
