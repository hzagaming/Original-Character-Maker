const fs = require('fs');

const file = 'src/docsContent/zh.ts';
let content = fs.readFileSync(file, 'utf8');

function findOverviewEnd(toolId) {
  const toolStart = content.indexOf(`id: '${toolId}',`);
  if (toolStart === -1) return -1;
  const ovStart = content.indexOf('overview: `', toolStart);
  if (ovStart === -1) return -1;
  const start = ovStart + 'overview: `'.length;
  let escape = false;
  for (let i = start; i < content.length; i++) {
    if (escape) { escape = false; continue; }
    if (content[i] === '\\') { escape = true; continue; }
    if (content[i] === '`') return i;
  }
  return -1;
}

function appendToOverview(toolId, text) {
  const end = findOverviewEnd(toolId);
  if (end === -1) { console.error('Could not find overview for', toolId); return false; }
  content = content.slice(0, end) + '\n\n' + text + content.slice(end);
  console.log('Expanded overview for', toolId);
  return true;
}

function setOverview(toolId, text) {
  const toolStart = content.indexOf(`id: '${toolId}',`);
  if (toolStart === -1) { console.error('Tool not found', toolId); return false; }
  // Check if overview already exists
  const ovStart = content.indexOf('overview: `', toolStart);
  if (ovStart !== -1) {
    // Already has overview, append
    return appendToOverview(toolId, text);
  }
  // Insert overview after title
  const titleEnd = content.indexOf("',", toolStart);
  if (titleEnd === -1) { console.error('Title end not found for', toolId); return false; }
  content = content.slice(0, titleEnd + 2) + '\n      overview: `' + text + '`,' + content.slice(titleEnd + 2);
  console.log('Set overview for', toolId);
  return true;
}

const expansions = {
  'paper2gal': `
【训练流程详解】
完整的 LoRA 训练流程分为以下阶段：

1. 数据准备阶段
   - 图像预处理：自动检测并裁剪人脸区域，统一调整为 512x512 或 768x768
   - 数据增强：随机水平翻转、轻微旋转、色彩抖动、高斯噪声
   - 标签生成：使用 WD 1.4 Tagger 自动打标，生成描述性标签
   - 手动校验：检查自动标签的准确性，修正错误标签
   - 数据集划分：80% 训练集、10% 验证集、10% 测试集

2. 模型配置阶段
   - 选择基础模型：SD 1.5、SDXL、SD 3.0 或自定义模型
   - 设置 LoRA 维度（Rank）：4/8/16/32/64/128，维度越高学习能力越强但过拟合风险越大
   - 配置训练参数：学习率、批次大小、训练步数、保存间隔
   - 设置正则化图像：防止过拟合的通用图像集

3. 训练执行阶段
   - 支持全量训练（Full Fine-tune）和 LoRA 训练
   - 实时显示损失曲线（Loss Curve）和学习率衰减
   - 每 N 步自动保存检查点（Checkpoint）
   - 支持从断点恢复训练
   - 支持多 GPU 分布式训练（需配置 accelerate）

4. 模型验证阶段
   - 使用验证集评估模型质量
   - 生成对比图：原始模型 vs 微调后模型
   - 计算 FID（Fréchet Inception Distance）分数
   - 人工评审生成质量

5. 模型部署阶段
   - 导出为标准 LoRA 格式（.safetensors）
   - 生成模型卡（Model Card），包含触发词、推荐参数、示例图
   - 支持一键上传到 Civitai、Hugging Face

【高级训练技巧】
- 学习率调度：Cosine Annealing 适合大多数场景；Warmup + Cosine 适合大数据集
- 正则化策略：使用 10-20 张通用图像作为正则化集，防止过拟合到训练数据的特定背景
- 标签策略：对于风格训练，删除所有人物标签保留风格标签；对于角色训练，保留角色特征标签
- 分辨率训练：SDXL 建议 1024x1024；SD 1.5 建议 512x512 或 768x768
- 多概念训练：使用 <concept1>、<concept2> 等实例提示词训练多个角色

【模型格式说明】
- .safetensors：安全格式，无代码执行风险，推荐格式
- .ckpt：传统格式，兼容性好但存在安全风险
- Diffusers：Hugging Face 目录格式，适合推理部署`,

  'image-converter': `
【支持的格式矩阵】
图片格式转换器支持以下输入和输出格式的任意组合：

输入格式：PNG、JPEG、WebP、GIF、BMP、TIFF、AVIF、HEIC/HEIF、ICO、SVG、RAW（CR2、NEF、ARW、DNG）
输出格式：PNG、JPEG、WebP、GIF、BMP、TIFF、AVIF、ICO、PDF、Base64

特殊转换场景：
- 透明通道处理：PNG/WebP 转 JPEG 时，可选填充背景色或保留 Alpha 通道为单独文件
- 动画处理：GIF/WebP 动画可提取为帧序列，或转换为静态首帧
- SVG 渲染：矢量图可渲染为任意分辨率的位图，支持自定义 DPI
- RAW 处理：相机原始格式可调整白平衡、曝光补偿后导出

【批量转换模式】
- 支持同时选择最多 50 张图片
- 统一输出格式和参数设置
- 保持原始目录结构或扁平化输出
- 支持文件名模板：{原始名}_{序号}.{扩展名}
- 转换完成后生成处理报告（成功/失败/警告统计）

【图像处理选项】
- 尺寸调整：按百分比缩放、指定最大边长、精确宽高（保持或拉伸比例）
- 裁剪：中心裁剪、智能裁剪（保留主体）、自定义区域
- 旋转：90°/180°/270° 或任意角度
- 翻转：水平翻转、垂直翻转
- 滤镜：灰度、 sepia、反色、模糊、锐化
- 水印：文字水印或图片水印，支持位置、透明度、旋转
- 元数据：保留、剥离或修改 EXIF、IPTC、XMP 信息

【压缩与优化】
- 智能压缩：在视觉质量损失可接受的前提下最大化压缩率
- 目标文件大小：指定输出文件的最大体积
- 渐进式 JPEG：适合网页加载，先显示低分辨率预览
- 无损 PNG 优化：减少文件大小而不损失质量
- WebP 有损/无损：根据内容类型自动选择最优模式`,

  'settings-guide': `
设置面板是 OC Maker 的全局配置中心，集中管理所有用户偏好和系统参数。所有设置均保存在浏览器本地存储中，支持导入/导出以便跨设备同步。

【界面设置】
- 主题模式：浅色、深色、自动（跟随系统）
- 强调色：12 种预设主题色（樱花粉、天空蓝、薄荷绿、紫罗兰等）
- 字体大小：小（14px）、中（16px）、大（18px）、特大（20px）
- 界面密度：紧凑、标准、宽松
- 动画效果：开/关（关闭可提升低端设备性能）
- 语言：简体中文、繁体中文、English、日本語、Русский、한국어

【音频设置】
- 主音量：0-100% 全局音量控制
- 音效音量：独立控制 UI 交互音效的音量
- 背景音乐音量：独立控制 BGM 音量
- 音效开关：全局启用/禁用所有音效
- BGM 开关：全局启用/禁用背景音乐
- 音频设备：选择输出设备（扬声器、耳机、蓝牙设备）
- 音频格式：Web Audio API 或 HTML5 Audio（兼容性选项）

【API 设置】
- 文本生成 API：配置 OpenAI、Google、Anthropic 等提供商的 API Key
- 图像生成 API：配置 Stable Diffusion WebUI、ComfyUI 等后端地址
- 语音合成 API：配置 Edge TTS、Bark、Piper 等引擎参数
- 代理设置：HTTP/HTTPS/SOCKS5 代理配置
- 请求超时：自定义各 API 的请求超时时间
- 并发限制：控制同时进行的 API 请求数量

【隐私与安全】
- 数据本地模式：完全禁用所有网络请求，纯离线运行
- 自动清除历史：设置对话历史和操作日志的保留时长
- 导出数据：打包下载所有本地存储的数据
- 导入数据：从备份文件恢复所有设置和数据
- 重置所有设置：一键恢复出厂默认配置

【高级设置】
- 开发者模式：显示额外的调试信息和工具
- 实验性功能：启用尚未正式发布的新功能
- 性能监控：显示 FPS、内存占用、渲染耗时
- 缓存管理：查看和清理各模块的缓存数据
- 快捷键自定义：修改或禁用全局快捷键`,

  'audio-guide': `
【音频引擎架构】
OC Maker 的音频系统采用分层架构设计：

1. 音频资源层
   - 管理所有音频文件的加载、解码和缓存
   - 支持格式：MP3、WAV、OGG、AAC、FLAC、WebM
   - 自动格式降级：优先使用压缩格式，不支持时回退到兼容格式
   - 预加载策略：根据使用频率智能预加载常用音效

2. 音频控制层
   - 全局音量管理：主音量 × 分类音量（音效/BGM/语音）
   - 音频上下文管理：自动处理 AudioContext 的 suspended/resumed 状态
   - 多轨混音：支持最多 16 条同时播放的音频轨道
   - 3D 音频定位：支持简单的声像（Pan）控制

3. 音频输出层
   - Web Audio API：高性能、低延迟，首选方案
   - HTML5 Audio：兼容性后备方案
   - MediaStream API：用于语音合成和录音

【音效系统】
内置 60+ 种 UI 音效，按场景分类：

交互反馈类：
- 点击（Click）：标准按钮点击音
- 悬停（Hover）：鼠标悬停提示音
- 切换（Toggle）：开关状态切换音
- 滑动（Slider）：滑块拖动反馈音
- 输入（Type）：键盘输入打字音

操作结果类：
- 成功（Success）：操作成功提示音
- 失败（Fail）：操作失败或错误提示音
- 警告（Warning）：需要注意的提示音
- 完成（Complete）：长任务完成提示音
- 取消（Cancel）：操作取消提示音

系统通知类：
- 通知（Notification）：新消息或提醒
- 消息（Message）：聊天消息提示音
- 连接（Connect）：网络连接成功
- 断开（Disconnect）：网络连接断开

【背景音乐系统】
- 支持播放列表管理，可添加本地音频文件
- 循环模式：单曲循环、列表循环、随机播放
- 淡入淡出：切换曲目时的平滑过渡
- 智能音量：检测到语音播放时自动降低 BGM 音量（闪避效果）
- 场景音乐：根据不同页面/工具自动切换对应的背景音乐

【语音合成集成】
- 与 TTS 导出模块无缝集成
- 支持实时语音预览（边输入边合成）
- 语音情绪标签：正常、开心、生气、悲伤、惊讶
- 批量语音队列管理`,

  'ui-ux-guide': `
【设计系统概述】
OC Maker 采用一套完整的设计系统（Design System），确保全站视觉和交互的一致性。设计系统包含颜色、字体、间距、圆角、阴影、动画等基础设计令牌（Design Tokens）。

【颜色系统】
- 主色（Primary）：用于主要按钮、链接、高亮
- 次色（Secondary）：用于辅助操作、标签
- 成功色（Success）：用于成功状态、完成提示
- 警告色（Warning）：用于警告状态、需要注意的信息
- 错误色（Error）：用于错误状态、失败提示
- 信息色（Info）：用于提示信息、帮助文本
- 中性色（Neutral）：用于文本、边框、背景、分割线
- 每种颜色提供 12 个色阶（50-950），支持浅色和深色模式自动适配

【字体排版】
- 标题字体：系统无衬线字体栈（-apple-system、BlinkMacSystemFont、Segoe UI、Roboto）
- 正文字体：同样的字体栈，确保跨平台一致性
- 等宽字体：用于代码、数值显示（Consolas、Monaco、monospace）
- 字号体系：从 xs（12px）到 4xl（36px），共 9 个级别
- 行高：正文 1.6、标题 1.3、代码 1.5
- 字重：400（正常）、500（中等）、600（半粗）、700（粗体）

【间距系统】
- 基于 4px 的基数单位
- 提供 14 个级别：0、0.5、1、1.5、2、2.5、3、4、5、6、8、10、12、16（单位：rem 倍数）
- 用于 margin、padding、gap、width、height 等属性

【圆角与阴影】
- 圆角：none、sm（2px）、md（6px）、lg（8px）、xl（12px）、2xl（16px）、full（9999px）
- 阴影：5 个级别，从微妙的内阴影到强烈的弹出层阴影
- 边框：1px 实线，颜色使用中性色的 200/300 色阶

【布局系统】
- 响应式断点：sm（640px）、md（768px）、lg（1024px）、xl（1280px）、2xl（1536px）
- 网格系统：12 列栅格，支持自动填充和固定列数
- 容器：最大宽度限制，居中显示，两侧留白
- 侧边栏：可折叠，移动端自动隐藏为抽屉式导航

【动画与过渡】
- 基础过渡：150ms 的 ease-in-out，用于颜色、透明度、变换
- 页面过渡：300ms 的淡入淡出
- 模态框：缩放 + 淡入，backdrop 模糊渐变
- 列表动画：新项目插入时的滑入效果
- 骨架屏：内容加载时的占位动画
- 微交互：按钮点击缩放、悬停上浮、加载旋转

【无障碍设计（a11y）】
- 键盘导航：所有交互元素支持 Tab 键聚焦和 Enter/Space 激活
- 焦点管理：明显的焦点指示器（outline），支持自定义焦点样式
- ARIA 标签：为屏幕阅读器提供语义化信息
- 颜色对比度：文本与背景对比度满足 WCAG 2.1 AA 标准（4.5:1）
- 动态字体：支持系统字体大小设置，界面自动缩放
- 减少动画：尊重 prefers-reduced-motion 设置，关闭非必要动画

【暗黑模式】
- 使用 CSS 变量实现一键切换
- 图片自动降低亮度（filter: brightness(0.9)）
- 阴影调整为发光效果（box-shadow → drop-shadow with light color）
- 彩色元素饱和度自动降低 10% 以适应深色背景`,
};

for (const [toolId, text] of Object.entries(expansions)) {
  if (toolId === 'paper2gal') {
    appendToOverview(toolId, text);
  } else {
    setOverview(toolId, text);
  }
}

fs.writeFileSync(file, content);
console.log('Done expanding tool overviews part 2');
