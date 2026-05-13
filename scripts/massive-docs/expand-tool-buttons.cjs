const fs = require('fs');

const file = 'src/docsContent/zh.ts';
let content = fs.readFileSync(file, 'utf8');

function insertIntoButtonsArray(toolId, newEntries) {
  const toolStart = content.indexOf(`id: '${toolId}',`);
  if (toolStart === -1) { console.error('Tool not found:', toolId); return false; }
  const btnStart = content.indexOf('buttons: [', toolStart);
  if (btnStart === -1) { console.error('Buttons not found for:', toolId); return false; }
  let depth = 1;
  let inString = false;
  let stringChar = null;
  let escape = false;
  for (let i = btnStart + 'buttons: ['.length; i < content.length; i++) {
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
        if (depth === 0) {
          content = content.slice(0, i) + '\n' + newEntries + content.slice(i);
          return true;
        }
      }
    }
  }
  console.error('Could not find end of buttons array for:', toolId);
  return false;
}

function makeButton(name, desc) {
  return `        { name: '${name}', description: '${desc}' },`;
}

const newButtons = {
  'face-maker': [
    makeButton('随机生成', '随机组合所有部件和参数，快速生成一个新角色。点击后所有滑块会自动跳动到随机值，可连续点击寻找灵感。'),
    makeButton('撤销', '撤销上一步操作，最多可撤销 20 步。支持 Ctrl+Z 快捷键。'),
    makeButton('重做', '恢复被撤销的操作，支持 Ctrl+Y / Ctrl+Shift+Z 快捷键。'),
    makeButton('放大预览', '将中央画布放大到全屏模式，方便检查细节。按 Esc 或点击关闭按钮退出。'),
    makeButton('截图', '将当前画布内容复制到剪贴板，可直接粘贴到聊天软件或图像编辑器中。'),
    makeButton('分享链接', '生成包含当前配置参数的 URL 链接，他人打开链接即可看到完全相同的角色。'),
    makeButton('深色模式切换', '切换画布的背景色为深色或透明，帮助检查角色的暗部细节。'),
  ],
  'style-transfer': [
    makeButton('预览效果', '在完整处理前先快速生成低分辨率预览（256px），帮助确认风格选择是否正确。'),
    makeButton('对比视图', '显示原图和风格化后的图片并排对比，支持滑动条查看过渡效果。'),
    makeButton('历史记录', '查看最近 20 次风格迁移的历史，可重新加载参数或删除记录。'),
    makeButton('收藏风格', '将当前使用的风格模型和参数保存到收藏夹，方便下次快速调用。'),
    makeButton('调整画布', '裁剪、旋转或翻转输入图片，预处理后再进行风格迁移。'),
    makeButton('高级参数', '展开更多专业参数：内容权重、风格权重、TV 权重、初始化方式等。'),
    makeButton('GPU 监控', '实时显示 GPU 显存使用率和温度，帮助判断设备负载。'),
  ],
  'prompt-suite': [
    makeButton('新建角色', '创建一个新的空白角色卡，可选择从模板开始或完全自定义。'),
    makeButton('复制角色', '复制当前角色卡的所有内容，生成一个可独立编辑的副本。'),
    makeButton('删除角色', '永久删除当前角色卡。删除前会要求二次确认，且已导出的文件不受影响。'),
    makeButton('导入角色', '从 JSON、Markdown 或 CSV 文件导入角色数据，支持批量导入。'),
    makeButton('模板市场', '浏览和下载社区分享的自定义模板，也可上传自己的模板。'),
    makeButton('关系图谱', '可视化显示当前世界观中所有角色之间的关系网络（亲属、朋友、敌人、恋人等）。'),
    makeButton('时间线', '为角色或世界观创建大事记时间线，支持添加事件、日期、描述和相关角色。'),
    makeButton('对比模式', '选择两个角色卡并排对比，高亮显示差异项，方便检查设定冲突。'),
  ],
  'llm-hub': [
    makeButton('清空对话', '清空当前对话的所有历史消息，但保留系统提示词和模型配置。'),
    makeButton('导出对话', '将当前对话导出为 Markdown、JSON 或纯文本文件。'),
    makeButton('导入对话', '从文件导入对话历史，支持继续之前的对话。'),
    makeButton('分享对话', '生成对话的只读分享链接，可选择是否包含系统提示词。'),
    makeButton('Token 统计', '显示当前对话的 token 使用详情：系统提示词、用户消息、AI 回复各占多少。'),
    makeButton('预设提示词', '加载预设的系统提示词模板（角色扮演、代码助手、创意写作等）。'),
    makeButton('多模型对比', '同时向多个模型发送相同的问题，并排显示不同模型的回答以便对比。'),
    makeButton('语音输入', '启用麦克风语音输入，支持中文、英文、日文语音识别。'),
    makeButton('代码解释器', '让 AI 在沙箱环境中执行 Python 代码，并返回执行结果。'),
  ],
  'tts-export': [
    makeButton('试听', '仅合成并播放当前输入文本的前 100 字，用于快速确认语音效果。'),
    makeButton('批量导入', '从文本文件或 CSV 批量导入台词列表，自动生成对应的音频文件。'),
    makeButton('语音克隆', '上传 5-10 秒的参考音频，克隆特定人物的音色用于语音合成。'),
    makeButton('音频编辑器', '打开基础音频编辑界面，可进行裁剪、拼接、淡入淡出等操作。'),
    makeButton('语音库', '管理所有已保存的角色语音配置，可快速切换和预览。'),
    makeButton('SSML 编辑器', '打开可视化 SSML 标记编辑器，无需手写 XML 即可添加停顿、强调等效果。'),
    makeButton('字幕生成', '根据音频内容自动生成 SRT 字幕文件，支持调整时间轴。'),
  ],
  'paper2gal': [
    makeButton('数据集分析', '分析当前数据集的标签分布、图像尺寸分布、色彩分布等统计信息。'),
    makeButton('标签编辑器', '批量编辑所有图像的标签，支持查找替换、正则表达式、自动补全。'),
    makeButton('训练监控', '实时显示 GPU 利用率、显存占用、损失曲线、学习率变化等训练指标。'),
    makeButton('模型比较', '选择两个检查点进行 A/B 测试，使用相同提示词生成对比图片。'),
    makeButton('触发词推荐', '基于训练数据自动生成推荐的触发词组合和负面提示词。'),
    makeButton('模型量化', '将 FP32/FP16 模型量化为 INT8 或 INT4，减少显存占用和推理时间。'),
  ],
  'image-converter': [
    makeButton('添加文件夹', '选择整个文件夹，自动导入其中所有支持的图片文件。'),
    makeButton('预设配置', '保存当前的所有转换参数为一个预设，下次可一键加载。'),
    makeButton('图片信息', '查看选中图片的详细元数据：EXIF、色彩配置文件、文件大小、分辨率等。'),
    makeButton('预览对比', '显示转换前后的图片对比，支持放大查看细节差异。'),
    makeButton('智能重命名', '使用模板批量重命名输出文件，支持序号、日期、原始名等变量。'),
    makeButton('云同步', '将转换结果自动上传到配置的云存储服务（可选功能）。'),
  ],
  'settings-guide': [
    makeButton('导入配置', '从 JSON 文件导入完整的设置配置，可覆盖当前所有设置项。'),
    makeButton('导出配置', '将所有设置导出为 JSON 文件，用于备份或跨设备同步。'),
    makeButton('恢复默认', '将当前分类的设置恢复为默认值。不影响其他分类的设置。'),
    makeButton('搜索设置', '在所有设置项中搜索关键词，快速定位需要的配置项。'),
    makeButton('快捷键列表', '显示所有可用的键盘快捷键及其对应功能。'),
    makeButton('关于', '显示 OC Maker 的版本信息、开源许可、致谢名单和更新日志。'),
  ],
  'audio-guide': [
    makeButton('音效库', '浏览和管理所有内置音效的分类列表，支持搜索和收藏。'),
    makeButton('播放列表', '创建和管理 BGM 播放列表，支持拖拽排序和循环模式设置。'),
    makeButton('均衡器', '打开 10 段图形均衡器，自定义各频段的增益值。'),
    makeButton('录音', '使用麦克风录制音频，可用于语音克隆或添加自定义音效。'),
    makeButton('音频可视化', '开启音频波形可视化效果，显示当前播放音频的频谱图。'),
    makeButton('设备检测', '检测系统中所有可用的音频输入/输出设备，并显示其状态。'),
    makeButton('空间音频', '启用虚拟环绕声效果，模拟 3D 空间中的声源定位（需耳机）。'),
  ],
  'ui-ux-guide': [
    makeButton('组件库', '浏览所有可复用的 UI 组件及其用法示例和代码片段。'),
    makeButton('主题编辑器', '可视化编辑自定义主题的颜色、字体、间距等设计令牌。'),
    makeButton('布局预览', '预览不同屏幕尺寸下的页面布局效果，支持自定义断点。'),
    makeButton('动画预览', '查看所有可用动画效果的实时演示和配置参数。'),
    makeButton('无障碍检查', '运行自动化无障碍测试，检查颜色对比度、焦点顺序、ARIA 标签等。'),
    makeButton('设计规范', '查看完整的设计系统文档，包括设计原则、使用规范和最佳实践。'),
  ],
};

for (const [toolId, entries] of Object.entries(newButtons)) {
  if (insertIntoButtonsArray(toolId, entries.join('\n'))) {
    console.log(`Added ${entries.length} buttons to ${toolId}`);
  }
}

fs.writeFileSync(file, content);
console.log('Done expanding buttons');
