const fs = require('fs');

const file = 'src/docsContent/zh.ts';
let content = fs.readFileSync(file, 'utf8');

// Generic prevention messages by category prefix
const preventionMap = {
  'A': '定期检查 API Key 的有效期和剩余额度；使用配置验证工具测试连接；实施网络健康监控和自动告警。',
  'B': '使用配置验证工具，定期备份数据，实施 schema 版本控制；在修改配置前导出备份；避免在隐私模式下使用需要 localStorage 的功能。',
  'C': '在提交前预览和验证内容格式；使用支持的文件格式和编码；控制输入内容的长度和复杂度；避免使用特殊字符和非法 Unicode。',
  'D': '选择合适的基础模型和分辨率；使用正则化图像防止过拟合；监控 GPU 温度和显存；保持训练环境稳定。',
  'E': '确认文件格式兼容性；保持足够的磁盘空间；使用稳定的网络连接；分批处理大量文件；验证输出路径权限。',
  'F': '定期清理浏览器缓存和 localStorage；关闭不必要的浏览器标签页；使用性能监控工具；在稳定网络环境下操作。',
  '0': '实现请求重试和退避机制；监控 API 限流状态；使用缓存减少重复请求；配置合理的超时时间；实施服务健康检查。',
};

function getCategoryPrefix(code) {
  const firstChar = code.charAt(0);
  if (/[A-F]/.test(firstChar)) return firstChar;
  if (/[0-9]/.test(firstChar)) return '0';
  return 'B';
}

// Find all error entries in errorDictionary
const errorDictStart = content.indexOf('errorDictionary: [');
const errorDictEnd = content.lastIndexOf('],') + 2;
let errorDictContent = content.slice(errorDictStart, errorDictEnd);

let fixed = 0;
// Replace entries missing prevention
errorDictContent = errorDictContent.replace(
  /(\{[\s\S]*?code: '([^']+)'[\s\S]*?prevention:)[\s\S]*?(\},?\s*(?=\{|$))/g,
  (match, prefix, code, suffix) => {
    // This regex doesn't work well for entries without prevention
    return match;
  }
);

// Better approach: find entries without prevention and add it
const entryRegex = /(\{\s*code: '([^']+)'[\s\S]*?)(\},?\s*(?=\{|$))/g;
let m;
const replacements = [];
while ((m = entryRegex.exec(errorDictContent)) !== null) {
  const entry = m[0];
  const code = m[2];
  if (!entry.includes('prevention:')) {
    const prefix = getCategoryPrefix(code);
    const prevention = preventionMap[prefix] || preventionMap['B'];
    const newEntry = entry.slice(0, -3) + `\n          prevention: '${prevention}',\n        },`;
    replacements.push({ old: entry, new: newEntry });
  }
}

for (const r of replacements) {
  errorDictContent = errorDictContent.replace(r.old, r.new);
  fixed++;
}

content = content.slice(0, errorDictStart) + errorDictContent + content.slice(errorDictEnd);
fs.writeFileSync(file, content);
console.log(`Added prevention to ${fixed} entries`);
