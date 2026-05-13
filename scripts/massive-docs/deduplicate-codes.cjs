const fs = require('fs');

const files = [
  'src/docsContent/zh.ts',
  'src/docsContent/en.ts',
  'src/docsContent/ja.ts',
  'src/docsContent/ko.ts',
  'src/docsContent/ru.ts',
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let totalRemoved = 0;

  // Find all "errors: [" arrays
  let searchStart = 0;
  while (true) {
    const arrStart = content.indexOf('errors: [', searchStart);
    if (arrStart === -1) break;
    
    const bracketStart = content.indexOf('[', arrStart + 'errors: '.length);
    if (bracketStart === -1) { searchStart = arrStart + 1; continue; }
    
    // Find end of this array using bracket depth
    let depth = 1;
    let inString = false;
    let stringChar = null;
    let escape = false;
    let bracketEnd = -1;
    for (let i = bracketStart + 1; i < content.length; i++) {
      if (escape) { escape = false; continue; }
      if (content[i] === '\\') { escape = true; continue; }
      if (!inString && (content[i] === "'" || content[i] === '"' || content[i] === '`')) {
        inString = true; stringChar = content[i];
      } else if (inString && content[i] === stringChar) {
        inString = false; stringChar = null;
      } else if (!inString) {
        if (content[i] === '[') depth++;
        else if (content[i] === ']') {
          depth--;
          if (depth === 0) { bracketEnd = i; break; }
        }
      }
    }
    if (bracketEnd === -1) { searchStart = arrStart + 1; continue; }
    
    const arrayContent = content.slice(bracketStart + 1, bracketEnd);
    
    // Find all entries in this array
    // An entry starts with "{" followed by optional whitespace/newlines then "code:"
    const entryRegex = /\{\s*\n\s*code:/g;
    const entries = [];
    let m;
    while ((m = entryRegex.exec(arrayContent)) !== null) {
      entries.push(m.index);
    }
    
    if (entries.length === 0) { searchStart = bracketEnd + 1; continue; }
    
    // For each entry, find its code and end position
    const entryInfos = [];
    for (let i = 0; i < entries.length; i++) {
      const entryStart = entries[i];
      const entryEnd = i < entries.length - 1 ? entries[i + 1] : arrayContent.length;
      const entryBlock = arrayContent.slice(entryStart, entryEnd);
      const codeMatch = entryBlock.match(/code:\s*['`]([^'`]+)['`]/);
      if (codeMatch) {
        entryInfos.push({
          code: codeMatch[1],
          start: entryStart,
          end: entryEnd,
          block: entryBlock,
        });
      }
    }
    
    // Find duplicates to remove
    const seen = new Set();
    const toRemove = [];
    for (const info of entryInfos) {
      if (seen.has(info.code)) {
        toRemove.push(info);
      } else {
        seen.add(info.code);
      }
    }
    
    if (toRemove.length > 0) {
      // Remove duplicate entries from arrayContent
      // We need to remove from end to start to preserve indices
      let newArrayContent = arrayContent;
      for (let i = toRemove.length - 1; i >= 0; i--) {
        const info = toRemove[i];
        newArrayContent = newArrayContent.slice(0, info.start) + newArrayContent.slice(info.end);
        totalRemoved++;
      }
      
      // Replace in content
      content = content.slice(0, bracketStart + 1) + newArrayContent + content.slice(bracketEnd);
    }
    
    searchStart = bracketEnd + 1;
  }
  
  if (totalRemoved > 0) {
    fs.writeFileSync(file, content);
    console.log(file + ': removed ' + totalRemoved + ' duplicate entries');
  } else {
    console.log(file + ': no duplicates found');
  }
}
