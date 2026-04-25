export type DocsErrorItem = {
  code: string;
  message: string;
  cause: string;
  solution: string;
};

export type DocsButtonItem = {
  name: string;
  description: string;
};

export type DocsParamItem = {
  name: string;
  description: string;
  tips?: string;
};

export type DocsToolSection = {
  id: string;
  title: string;
  overview: string;
  buttons: DocsButtonItem[];
  parameters: DocsParamItem[];
  errors: DocsErrorItem[];
};

export type DocsContent = {
  intro: string;
  tools: DocsToolSection[];
};

export const docsContentZh: DocsContent = {
  intro: `欢迎使用 Original Character Maker 用户手册！

本手册涵盖全部 7 个功能模块的详细说明。当你在某个工具中遇到报错或不清楚某个按钮/参数的作用时，可以打开本手册查阅对应的章节。每个章节都包含：功能概述、按钮讲解、参数说明、常见报错与解决方法。`,

  tools: [
    {
      id: 'face-maker',
      title: '捏脸编辑器',
      overview: `捏脸编辑器是 OC Maker 的入门级工具，通过左侧部件资产库选择发型、眼型、眉型、鼻型、嘴型、脸型、耳朵和配件，再通过右侧 16 个数值滑块精细调整比例、颜色和位置，最终在中央画布实时预览角色形象。所有调整都在本地完成，不会上传任何图片或数据。`,
      buttons: [
        { name: '保存草稿', description: '将当前所有部件选择和参数值保存到浏览器本地存储。保存成功后状态指示器会从黄色「未保存」变为绿色「已保存」。' },
        { name: '导出', description: '将当前捏脸配置导出为 JSON 文件（oc-face-maker-config.json），包含全部部件和参数值，可分享给他人或备份。' },
        { name: '导入配置', description: '选择之前导出的 JSON 配置文件，恢复部件选择和参数值。导入后会自动覆盖当前画布。' },
        { name: '重刷', description: '将所有参数重置为默认值，部件恢复为初始状态。操作前会弹出二次确认弹窗防止误触。' },
        { name: '返回首页', description: '离开捏脸编辑器回到主页。如果当前有未保存的修改，会先弹出确认弹窗。' },
        { name: '打开设置', description: '打开全局设置面板，可调整主题、语言、音频、API 等。' },
      ],
      parameters: [
        { name: '头部比例', description: '调整头部整体大小，范围 80~120。数值越大头部越显大。', tips: '建议配合脸长一起调整，避免头身比例失衡。' },
        { name: '脸长', description: '调整脸部长度，范围 80~120。影响整体脸型从圆脸到长脸的过渡。' },
        { name: '下巴宽度', description: '调整下巴宽窄，范围 80~120。数值小则下巴尖，数值大则下巴宽。' },
        { name: '额头高度', description: '调整额头占脸部的比例，范围 80~120。' },
        { name: '肤色', description: '通过颜色选择器调整角色皮肤色调。' },
        { name: '发色', description: '调整头发颜色，支持任意 HEX 颜色值。' },
        { name: '眉距', description: '调整两眉之间的距离，范围 80~120。' },
        { name: '眼睛大小', description: '调整眼睛整体缩放比例，范围 80~120。' },
        { name: '眼距', description: '调整两眼之间的距离，范围 80~120。' },
        { name: '眼位', description: '调整眼睛在面部的垂直位置，范围 80~120。数值大则眼睛偏上。' },
        { name: '瞳色', description: '调整瞳孔颜色。' },
        { name: '鼻高', description: '调整鼻子长度/高度，范围 80~120。' },
        { name: '嘴角弧度', description: '调整嘴角上扬或下垂程度，范围 80~120。数值大则嘴角上扬（微笑）。' },
        { name: '嘴宽', description: '调整嘴巴宽度，范围 80~120。' },
        { name: '配件颜色', description: '当选择眼镜、发饰等配件时，调整配件的颜色。' },
        { name: '整体倾角', description: '微调整个面部的轻微倾斜角度，范围 -10~10 度。' },
      ],
      errors: [
        { code: 'IMPORT_TOOL_MISMATCH', message: '导入配置时提示「工具类型不匹配」', cause: '导入的 JSON 文件中 tool 字段不是 face-maker，可能是其他工具的配置文件。', solution: '确认导入的文件是从捏脸编辑器的「导出」按钮生成的 JSON，文件顶部应包含 "tool": "face-maker"。' },
        { code: 'IMPORT_INVALID_JSON', message: '导入配置时提示「无效的 JSON 格式」', cause: '文件内容损坏、不是 JSON 格式、或被其他程序修改过。', solution: '检查文件是否为有效的 UTF-8 编码文本文件。可以尝试用文本编辑器打开查看是否有乱码。' },
        { code: 'UNSAVED_WARNING', message: '返回首页时提示「你还没保存当前捏脸项目」', cause: '当前画布状态与上次保存的快照不一致（isDirty 为 true）。', solution: '点击「保存草稿」后再返回首页，或确认不需要保存后点击「确认返回」。' },
        { code: 'STORAGE_FULL', message: '保存失败，localStorage 空间不足', cause: '浏览器 localStorage 存储空间已满（通常约 5~10MB）。', solution: '清理浏览器其他网站的 localStorage 数据，或导出配置到本地文件后清除应用数据。' },
      ],
    },
    {
      id: 'style-transfer',
      title: '转画风',
      overview: `转画风工具用于将角色图像转换为指定画风。上传 PNG/JPG 格式的角色图像后，通过选择 AI 模型、编写 Prompt 和调整高级参数，调用后端 API 进行风格转换。支持自动抠图、配色保持、姿势保留、面部锁定等高级功能。`,
      buttons: [
        { name: '选择图片 / 替换图片', description: '上传角色图像文件。支持 PNG 和 JPG 格式，推荐上传单人立绘或清晰半身图。' },
        { name: '开始', description: '启动风格转换流程。会先验证输入文件和参数，然后向后端发送转换请求。' },
        { name: '复制 JSON', description: '将当前所有参数配置复制为 JSON 文本到剪贴板，方便分享或备份。' },
        { name: '下载 JSON', description: '将当前参数配置下载为 JSON 文件。' },
        { name: '复制结果', description: '转换成功后，将结果图片复制到剪贴板（如果浏览器支持）。' },
        { name: '下载结果', description: '将转换后的结果图片下载到本地。' },
        { name: '复制错误', description: '转换失败时，将错误详情 JSON 复制到剪贴板，便于排查问题。' },
        { name: '下载错误', description: '将错误详情下载为 JSON 文件。' },
        { name: '展开详情 / 收起详情', description: '展开或折叠高级参数面板、Prompt 预览面板和调试信息面板。' },
        { name: '重刷', description: '重置所有参数为默认值，清除上传的图片和结果。' },
      ],
      parameters: [
        { name: '模型', description: '选择使用的 AI 图像生成模型。内置模式走 Plato 后端通道，自定义模式使用你配置的外部 API。', tips: 'gpt-image-2 是默认推荐模型，支持编辑和生成；claude-4-sonnet 在角色一致性方面表现更好。' },
        { name: 'Prompt', description: '正面提示词，描述你想要的画风、场景和角色特征。支持使用「正面提示词库」快速插入常用 Tag。', tips: 'Prompt 会自动附加高级参数转换后的英文后缀，可在「Effective Prompt Preview」中查看最终效果。' },
        { name: 'Negative Prompt', description: '负面提示词，描述你不希望出现的内容。支持使用「负面提示词库」快速插入。', tips: '常见负面 Tag：低质量、多余手指、变形身体、模糊等。' },
        { name: 'Temperature', description: '采样温度，控制生成结果的随机性。范围 0~2，默认 0.7。', tips: '值越低结果越稳定可预测，值越高越有创意但可能偏离预期。' },
        { name: 'Steps', description: '去噪步数，范围 10~50。步数越多细节越丰富但耗时越长。' },
        { name: 'Strength', description: '风格强度/重绘幅度，范围 0~1。值越大原始图像保留越少，画风改变越彻底。', tips: '0.4~0.6 是常用区间，既能改变画风又能保留角色特征。' },
        { name: 'CFG', description: 'Classifier-Free Guidance 缩放因子，范围 1~20。值越大 Prompt 约束力越强。', tips: '7~12 是安全区间，过高会导致画面失真。' },
        { name: '需要抠图', description: '是否在转换前自动移除背景。启用后只保留角色主体进行风格转换。' },
        { name: '保持配色', description: '是否强制保留原始图像的配色方案。' },
        { name: '保留姿势', description: '是否尽量保持原始角色的姿势和构图。' },
        { name: '面部锁定', description: '是否使用面部特征锁定技术，确保转换后角色面部一致性。' },
        { name: '细节增强', description: '是否启用细节增强处理，提升输出图像的精细度。' },
        { name: '宽高比', description: '输出图像的宽高比例预设（1:1、2:3、3:2、16:9 等）。' },
        { name: '图像尺寸', description: '输出图像的短边像素数。' },
        { name: '线稿风格', description: '输出图像的线稿处理风格（无、精细、粗犷、水彩等）。' },
        { name: '配色方案', description: '强制应用的配色主题（暖色、冷色、 pastel、高对比等）。' },
        { name: '背景类型', description: '背景处理方式（透明、纯色、渐变、场景、自然等）。' },
        { name: '光照风格', description: '场景光照效果（柔和、戏剧化、背光、伦勃朗等）。' },
      ],
      errors: [
        { code: 'VALIDATION_ERROR', message: '提示「验证错误」', cause: '未上传图片、Prompt 为空、或参数值超出有效范围。', solution: '确认已上传角色图像，Prompt 字段已填写，所有滑块参数在有效范围内。' },
        { code: 'API_401', message: '提示「API Key 无效或已过期」', cause: '后端使用的 Plato API Key 失效或额度用尽；或自定义 API 的密钥不正确。', solution: '在「设置 → API」中检查自定义 API Key 是否正确；如果是内置模式，等待管理员更新后端 API Key。' },
        { code: 'RUNTIME_ERROR', message: '提示「运行时错误」', cause: '后端处理过程中出现异常，可能是模型不可用、图片格式不支持、或服务器资源不足。', solution: '检查上传的图片是否为标准 PNG/JPG；尝试更换模型或降低图像尺寸后重试；查看错误详情中的具体报错信息。' },
        { code: 'DIRECT_ENDPOINT', message: 'API 设置中提示「当前 URL 看起来是模型接口」', cause: '在自定义 API 地址中填写了类似 /v1/chat/completions 的模型端点，而不是工作流后端根地址。', solution: '将 API 地址改为工作流后端根地址，如 http://localhost:3001 或 https://your-backend.example.com，不要包含 /v1/chat/completions 等路径。' },
        { code: 'FETCH_ABORTED', message: '转换过程中离开页面导致请求中断', cause: 'StyleTransferPage 组件卸载时未完成的 fetch 请求被 AbortController 取消。', solution: '这是预期行为，不会导致数据丢失。重新进入页面后重新上传图片并启动转换即可。' },
      ],
    },
    {
      id: 'prompt-suite',
      title: '角色设卡 / 世界观编辑',
      overview: `PromptSuite 是一个富文本编辑器，用于整理角色设定卡（Character Sheet）、世界观设定（World Bible）、关系图谱（Relationship Map）和语言风格档案（Speech Profile）。支持字体、颜色、高亮、标题、列表、表格、代码块、引用框、图片插入等丰富排版功能。所有内容自动保存到本地浏览器。`,
      buttons: [
        { name: '保存文档', description: '将当前编辑器中的 HTML 内容和工具栏状态保存到本地存储。' },
        { name: '重刷', description: '清空当前文档，恢复为默认模板。操作前会弹出二次确认。' },
        { name: '导入配置', description: '导入之前导出的 PromptSuite JSON 配置文件，恢复文档内容和工具栏状态。' },
        { name: '导出 HTML', description: '将当前文档导出为独立的 HTML 文件，包含内联样式，可直接在浏览器中打开查看。' },
        { name: '导出封装包', description: '将文档内容、LLM 配置和 TTS 配置打包导出为一个 JSON 文件，便于跨设备迁移。' },
        { name: '复制文本', description: '将当前文档的纯文本内容复制到剪贴板。' },
        { name: '展开详情 / 收起详情', description: '展开或折叠各工具栏分组（字体、样式、段落、插入、历史）。' },
        { name: '自定义字体', description: '打开弹窗输入系统中已安装的字体名称，应用到编辑器。' },
      ],
      parameters: [
        { name: '模板选择', description: '快速切换预设模板：世界观设定、角色设卡、关系图谱、语言风格档案、时间线。' },
        { name: '字体', description: '设置编辑器正文字体族。支持系统字体和自定义字体。' },
        { name: '字号', description: '设置基础字号，支持 px/rem 单位。' },
        { name: '文本颜色', description: '设置当前选中文本的颜色。' },
        { name: '高亮色', description: '设置当前选中文本的背景高亮颜色。' },
        { name: '块样式', description: '设置当前段落的全局块样式预设。' },
        { name: '行高', description: '调整段落行高倍率。' },
        { name: '加粗 / 斜体 / 下划线 / 删除线', description: '基础文本格式按钮，支持 Ctrl+Alt+B/I/U 等快捷键。' },
        { name: '下标 / 上标', description: '将选中文本转为下标或上标格式。' },
        { name: '引用块', description: '插入带有装饰性边框的引用块。' },
        { name: '代码 / 代码块', description: '插入行内代码或预格式化代码块。' },
        { name: '链接', description: '插入可点击的超链接。' },
        { name: '表格', description: '插入可编辑的 HTML 表格。' },
        { name: '图片', description: '插入图片（使用占位符链接）。' },
        { name: '强调框 / 详情折叠 / 徽章', description: '插入特殊样式的内容块，用于突出显示重要信息。' },
        { name: '清除格式', description: '移除当前选中文本的所有格式。' },
        { name: '撤销 / 重做', description: '撤销或重做最近的编辑操作。支持 Ctrl+Z / Ctrl+Y 快捷键。' },
      ],
      errors: [
        { code: 'IMPORT_TOOL_MISMATCH', message: '导入配置时提示「工具类型不匹配」', cause: '导入的 JSON 文件中 tool 字段不是 prompt-suite。', solution: '确认导入的是 PromptSuite 导出的配置文件，tool 字段应为 "prompt-suite"。' },
        { code: 'IMPORT_INVALID_JSON', message: '导入配置时提示「无效的 JSON 格式」', cause: '文件内容损坏或格式不正确。', solution: '检查文件是否为有效的 JSON 文本文件。' },
        { code: 'CURSOR_JUMP', message: '编辑时光标位置乱跳', cause: '早期版本中使用 dangerouslySetInnerHTML 实时重渲染导致 DOM 与 React 状态不同步。', solution: '当前版本已修复此问题。如仍遇到，尝试刷新页面并恢复自动保存的内容。' },
        { code: 'PASTE_FORMAT_LOSS', message: '从外部复制粘贴后格式丢失', cause: '富文本编辑器对外部 HTML 的粘贴处理会过滤不安全的标签和样式。', solution: '这是安全设计。如需保留特定格式，建议先在编辑器内使用对应工具创建结构，再填入内容。' },
      ],
    },
    {
      id: 'llm-hub',
      title: 'LLM 文本接入',
      overview: `LLM Hub 是大语言模型参数配置与实时测试工具。你可以在这里调整模型选择、采样参数、系统提示词等，然后通过实时测试面板与 AI 进行多轮对话，验证 Prompt 效果。支持保存多套配置预设，方便在不同创作场景间快速切换。内置模式走后端 /api/chat 代理，自定义模式直接调用你配置的外部 OpenAI 兼容 API。`,
      buttons: [
        { name: '保存文档', description: '将当前 LLM 配置保存到本地存储。' },
        { name: '重刷', description: '将所有参数重置为默认值。会弹出二次确认弹窗。' },
        { name: '导入配置', description: '导入之前导出的 LLM Hub JSON 配置文件。' },
        { name: '下载 JSON', description: '将当前 LLM 配置下载为 JSON 文件。' },
        { name: '参数 / 实时测试 / 预设', description: '三个模块切换按钮。参数面板调整模型配置；实时测试面板进行对话；预设面板管理配置快照。' },
        { name: '复制提示词', description: '将当前的系统提示词（System Prompt）复制到剪贴板。' },
        { name: '恢复为设置默认值', description: '从全局设置中读取默认的 LLM 配置并应用。' },
        { name: '发送', description: '在实时测试面板中发送输入的消息给 AI。' },
        { name: '清空', description: '清空当前对话历史和输出内容。' },
        { name: '保存为预设', description: '将当前所有参数保存为一个命名预设，方便后续快速加载。' },
        { name: '加载', description: '从已保存的预设中加载配置。' },
        { name: '删除', description: '删除已保存的预设。' },
      ],
      parameters: [
        { name: '模型', description: '选择使用的大语言模型。', tips: 'gpt-5.4 是默认推荐；gpt-5.4-mini 速度更快；claude-4-sonnet 在创意写作方面表现出色。' },
        { name: '温度 (Temperature)', description: '控制生成结果的随机性，范围 0~2。', tips: '创意写作建议 0.7~1.0；角色设定补全建议 0.3~0.5 以保证一致性。' },
        { name: 'Top P', description: '核采样参数，范围 0~1。控制候选词集合的大小。', tips: '通常与 Temperature 配合使用，默认 0.92 适合大多数场景。' },
        { name: '最大 Token 数', description: '单次响应的最大生成长度，范围 1~8192。', tips: '角色设定生成建议 1024~2048；短对话可设为 512。' },
        { name: '频率惩罚', description: '降低已出现词汇的重复概率，范围 -2~2。', tips: '正值可减少重复用词，负值可增加词汇多样性。' },
        { name: '存在惩罚', description: '降低整体重复主题的概率，范围 -2~2。', tips: '与频率惩罚配合使用，避免 AI 陷入循环表达。' },
        { name: '响应格式', description: '指定 AI 的输出格式：text（纯文本）或 json_object（强制 JSON）。', tips: '选择 json_object 时，Prompt 中需明确说明期望的 JSON 结构。' },
        { name: '随机种子', description: '固定随机种子以获得可复现的结果。设为 0 表示随机。', tips: '调试 Prompt 时固定种子，可以准确对比参数调整带来的效果差异。' },
        { name: 'Top K', description: '仅保留概率最高的 K 个候选词，范围 1~128。', tips: '部分模型不支持此参数，会被后端忽略。' },
        { name: '超时 (毫秒)', description: '单次请求的最大等待时间，范围 1000~120000。', tips: '网络不稳定时可适当增加，但过长会导致界面卡死感。' },
        { name: '重试次数', description: '请求失败时的自动重试次数，范围 0~5。', tips: '设为 2 可在网络波动时提高成功率。' },
        { name: '停止序列', description: '遇到指定文本时停止生成，多个序列用逗号分隔。', tips: '例如设为 "Human:,Assistant:" 可控制对话轮次切换。' },
        { name: '系统提示词', description: '定义 AI 的角色和行为准则的全局提示词。', tips: '这是影响输出质量最重要的参数。建议使用详细的角色设定和输出格式要求。' },
      ],
      errors: [
        { code: 'NO_CUSTOM_API', message: '提示「没有配置自定义 API」', cause: '自定义模式下未在设置中配置有效的 API 地址和密钥。', solution: '前往「设置 → API」，切换到「自定义 API」模式，填写 API 根地址和 API Key。' },
        { code: 'LLM_TEST_ERROR', message: '实时测试面板显示红色错误信息', cause: 'API 请求失败，可能是网络问题、API Key 无效、模型不可用或请求超时。', solution: '检查网络连接；确认 API Key 有效且未过期；尝试切换模型；增加超时时间或减少 Max Tokens。' },
        { code: 'NON_JSON_RESPONSE', message: '提示「Upstream returned non-JSON」', cause: '后端返回了非 JSON 格式的响应，通常是 502/503 错误或 HTML 错误页面。', solution: '检查后端服务是否正常运行；如果是自定义 API，确认地址是 chat/completions 端点而非工作流后端地址。' },
        { code: 'HTTP_ERROR', message: '提示 HTTP 4xx/5xx 错误', cause: '请求被拒绝或服务器内部错误。', solution: '查看错误详情中的状态码：401 表示认证失败（检查 API Key），429 表示频率限制（降低请求频率），500 表示服务器错误（联系管理员）。' },
        { code: 'ABORTED', message: '离开页面后测试请求被中断', cause: '组件卸载时 AbortController 取消了进行中的请求。', solution: '这是预期行为。重新进入 LLM Hub 后可以继续测试。' },
      ],
    },
    {
      id: 'tts-export',
      title: 'TTS 语音导出',
      overview: `TTS 语音导出工具用于配置语音合成参数并生成角色语音素材。支持调整声音、语言、语速、音调、音量等基础参数，以及气息感、清晰度、表现力、停顿强度等高级参数。可上传参考音频作为音色克隆源，支持音频后处理（降噪、EQ、压缩）和发音精校（自定义替换规则）。`,
      buttons: [
        { name: '保存', description: '将当前 TTS 配置保存到本地存储。' },
        { name: '重刷', description: '将所有参数重置为默认值。会弹出二次确认。' },
        { name: '导入配置', description: '导入之前导出的 TTS JSON 配置文件。' },
        { name: '下载 JSON', description: '将当前 TTS 配置下载为 JSON 文件。' },
        { name: '展开 / 收起高级参数', description: '展开或折叠高级参数面板（停顿强度、语调曲线、强调模式）。' },
        { name: '展开 / 收起音频后处理', description: '展开或折叠音频后处理面板（降噪、EQ、压缩）。' },
        { name: '展开 / 收起发音精校', description: '展开或折叠发音精校面板（文本预处理、替换规则）。' },
      ],
      parameters: [
        { name: '声音', description: '选择预设的语音音色。', tips: 'Hanazora 是默认女声；Mirako 是元气女声；Rin 是少年声。' },
        { name: '语言', description: '合成语音的目标语言。', tips: '切换全局界面语言时，此字段会自动同步更新。' },
        { name: '语速', description: '语音播放速度倍率，范围 0.6~1.6。', tips: '1.0 是正常速度；角色情绪激动时可设为 1.2~1.4。' },
        { name: '情感', description: '描述期望的情感风格标签，如「温柔」「坚定」「忧郁」等。', tips: '部分后端模型支持情感标签，会被拼入合成提示词。' },
        { name: '音调', description: '音高偏移，范围 -12~12（半音单位）。', tips: '正值音调更高更明亮，负值更低沉。' },
        { name: '音量', description: '输出音量百分比，范围 40~140。', tips: '100 是原始音量；背景音较多时可设为 110~120。' },
        { name: '采样率', description: '输出音频的采样率（Hz）。', tips: '24000 是标准语音质量；44100/48000 提供更高音质但文件更大。' },
        { name: '气息感', description: '控制语音中的呼吸感强度，范围 0~100。', tips: '值越高越像真人自然呼吸，但过高会显得喘息。' },
        { name: '清晰度', description: '控制发音清晰度，范围 0~100。', tips: '值越高咬字越清晰，但可能显得机械。' },
        { name: '表现力', description: '控制情感表现力强度，范围 0~100。', tips: '值越高语调变化越丰富，适合戏剧性场景。' },
        { name: '语速变化', description: '控制语速的自然波动程度，范围 0~100。', tips: '值越高越像真人说话时的快慢变化。' },
        { name: '停顿强度', description: '控制句间停顿的长度，范围 0~100。', tips: '朗读诗歌或严肃内容时可适当提高。' },
        { name: '语调曲线', description: '预设的语调变化模式：平直、自然、戏剧化、旋律化。', tips: '「自然」适合日常对话；「戏剧化」适合动画配音；「旋律化」适合歌唱或朗诵。' },
        { name: '强调模式', description: '关键词强调强度：正常、强烈、微妙。', tips: '「强烈」会让 AI 在关键词处加重音；「微妙」则轻微提示。' },
        { name: '降噪', description: '输出音频的降噪强度，范围 0~100。', tips: '参考音频有背景噪音时可提高此值。' },
        { name: 'EQ 预设', description: '均衡器预设：平直、温暖、明亮、广播、清晰。', tips: '「温暖」适合叙事；「明亮」适合少女角色；「广播」适合旁白。' },
        { name: '压缩', description: '动态范围压缩强度，范围 0~100。', tips: '压缩可使音量更均匀，防止忽大忽小。' },
        { name: '后处理总开关', description: '是否启用音频后处理（降噪+EQ+压缩）。', tips: '关闭后处理可获得原始合成音质，但可能有底噪。' },
        { name: '文本预处理', description: '是否在合成前对文本进行标准化处理。', tips: '建议开启，可自动处理数字读法、英文缩写等。' },
        { name: '自定义替换规则', description: '输入替换规则，每行一条，格式为「原文=替换文」。', tips: '例如：「OC=欧西」会让合成时将「OC」读作「欧西」。' },
      ],
      errors: [
        { code: 'IMPORT_INVALID_CONFIG', message: '导入配置时提示「无效的配置数据」', cause: '导入的 JSON 中缺少 ttsConfig 字段或格式不正确。', solution: '确认导入的是 TTS 页面导出的配置文件，tool 字段应为 "tts-export"。' },
        { code: 'REFERENCE_AUDIO_INVALID', message: '参考音频上传失败', cause: '文件格式不支持（仅支持 WAV/MP3/OGG）或文件过大。', solution: '确认音频文件格式为 WAV、MP3 或 OGG，大小不超过 10MB。' },
        { code: 'LANGUAGE_SYNC', message: '语言设置不同步', cause: '全局语言切换后，TTS 配置中的语言字段未自动更新。', solution: '当前版本已修复此问题。TTS 语言会自动跟随全局语言设置。如需手动调整，直接在语言下拉框中选择。' },
      ],
    },
    {
      id: 'paper2gal',
      title: 'paper2gal 图片素材生成',
      overview: `Paper2Gal 工具接入 p2g-character-workflow 后端工作流，负责上传角色图像并自动生成系列素材：表情图（思考、惊讶、生气）、CG 场景图和抠图素材。支持 Prompt 覆盖和 AI 并发控制，可实时查看工作流进度和下载结果。`,
      buttons: [
        { name: '选择图片', description: '上传角色图像。仅接受 PNG 和 JPG 格式，最大尺寸建议不超过 4096x4096。' },
        { name: '启动工作流', description: '向后端提交角色图像，启动 paper2gal 工作流。工作流会依次执行：验证输入、分析角色、生成表情、生成 CG、执行抠图。' },
        { name: '复制 JSON', description: '复制当前 Prompt 覆盖配置为 JSON 文本。' },
        { name: '下载 JSON', description: '下载当前配置为 JSON 文件。' },
        { name: '导出工作流 JSON', description: '下载包含工作流完整状态、步骤详情和调试信息的 JSON 文件，用于排查问题。' },
        { name: '展开 / 收起 Prompt 覆盖', description: '展开或折叠 Prompt 覆盖面板，可自定义各步骤的生成提示词。' },
        { name: '重刷', description: '清除工作流状态、上传的图片和结果，恢复为初始状态。' },
      ],
      parameters: [
        { name: '表情 Prompt 覆盖 - 思考', description: '覆盖「思考」表情生成步骤的默认 Prompt。' },
        { name: '表情 Prompt 覆盖 - 惊讶', description: '覆盖「惊讶」表情生成步骤的默认 Prompt。' },
        { name: '表情 Prompt 覆盖 - 生气', description: '覆盖「生气」表情生成步骤的默认 Prompt。' },
        { name: 'CG Prompt 覆盖 - CG01', description: '覆盖第一张 CG 场景图的生成 Prompt。' },
        { name: 'CG Prompt 覆盖 - CG02', description: '覆盖第二张 CG 场景图的生成 Prompt。' },
        { name: 'AI 并发', description: '是否允许多个 AI 生成步骤并行执行。开启后可显著缩短总耗时。', tips: '开启并发时后端会同时调度多个模型请求，但可能增加 API 费用。' },
      ],
      errors: [
        { code: 'VALIDATION_ERROR', message: '提示「验证错误」', cause: '上传的文件不是 PNG/JPG，或文件损坏无法读取。', solution: '确认文件格式为 PNG 或 JPG；尝试用图片查看器打开确认文件未损坏。' },
        { code: 'WORKFLOW_FAILED', message: '工作流状态显示「失败」', cause: '某个步骤执行失败，可能是模型不可用、API Key 失效、或生成内容被安全过滤器拦截。', solution: '查看失败步骤的错误详情；检查后端日志；尝试修改 Prompt 覆盖中的敏感词汇。' },
        { code: 'POLLING_ERROR', message: '轮询工作流状态时出错', cause: '前端向后端轮询 /api/workflows/{id} 时网络中断或后端返回错误。', solution: '检查网络连接；确认后端服务正常运行；等待几秒后工作流结果可能仍在后端处理中。' },
        { code: 'CUTOUT_FAILURE', message: '抠图步骤失败', cause: '背景移除服务不可用、角色图像质量过低、或 provider 配置错误。', solution: '检查上传的角色图像是否有清晰的主体轮廓；确认后端 remove_background provider 配置正确。' },
        { code: 'UPLOAD_FORMAT', message: '上传时提示「仅支持 PNG / JPG」', cause: '选择了 WEBP、GIF 或其他格式的文件。', solution: '使用图片转换工具将文件转为 PNG 或 JPG 后再上传。' },
      ],
    },
    {
      id: 'image-converter',
      title: '图片格式转换',
      overview: `图片格式转换是一个纯前端工具，用于上传图片并转换为 PNG 或 JPG 格式。支持亮度、对比度、饱和度、模糊、色相旋转、灰度六大滤镜调整，可控制输出质量和最大尺寸，支持保持原始宽高比。所有处理在浏览器本地完成，不会上传图片到任何服务器。`,
      buttons: [
        { name: '选择图片', description: '上传图片文件。支持 PNG、JPG 和 WEBP 格式。' },
        { name: '转换', description: '应用所有滤镜参数并生成输出图片。处理完全在浏览器本地完成。' },
        { name: '下载结果', description: '将转换后的图片下载到本地。文件名格式为 converted-{timestamp}.{ext}。' },
        { name: '复制日志', description: '将右侧日志面板的内容复制到剪贴板。' },
        { name: '下载日志', description: '将日志内容下载为文本文件。' },
        { name: '重刷', description: '清除上传的图片和结果，将所有滤镜参数重置为默认值。' },
      ],
      parameters: [
        { name: '输出格式', description: '输出图片的 MIME 类型：image/png 或 image/jpeg。', tips: 'PNG 支持透明通道但文件较大；JPG 文件小但不支持透明。' },
        { name: '质量', description: 'JPG 输出的压缩质量，范围 10~100。仅对 JPG 格式生效。', tips: '90~95 是画质和文件大小的最佳平衡点。' },
        { name: '最大宽度', description: '输出图片的最大宽度（像素）。如果原始图片更宽则会等比缩小。', tips: '设为 2048 可满足大多数社交平台的上传要求。' },
        { name: '最大高度', description: '输出图片的最大高度（像素）。', tips: '通常与最大宽度配合使用，保持宽高比开启时以较小边为准。' },
        { name: '保持宽高比', description: '缩放时是否保持原始宽高比。', tips: '建议始终开启，避免图片变形。' },
        { name: '亮度', description: '调整图片整体亮度，范围 0~200，100 为原始亮度。', tips: '低于 50 会明显变暗，高于 150 可能过曝丢失细节。' },
        { name: '对比度', description: '调整图片对比度，范围 0~200，100 为原始对比度。', tips: '值越高明暗反差越强烈，适合增强线条感。' },
        { name: '饱和度', description: '调整颜色鲜艳程度，范围 0~200，100 为原始饱和度。', tips: '设为 0 可得黑白图片；超过 150 可能出现色偏。' },
        { name: '模糊', description: '添加高斯模糊效果，范围 0~20 像素。', tips: '用于柔化背景或创建景深效果。' },
        { name: '色相旋转', description: '旋转图片整体色相，范围 0~360 度。', tips: '180 度可得到近似负片效果。' },
        { name: '灰度', description: '将图片转为灰度的强度，范围 0~100。', tips: '100 为完全黑白；0 为原始彩色。与饱和度为 0 的效果类似但算法不同。' },
      ],
      errors: [
        { code: 'INVALID_DIMENSIONS', message: '提示「图片尺寸无效，无法转换」', cause: '上传的图片宽或高为 0 像素，或图片文件损坏导致 Canvas 无法读取尺寸。', solution: '尝试用图片查看器打开确认文件正常；重新导出图片后再次上传。' },
        { code: 'FILE_READ_ERROR', message: '文件读取失败', cause: 'FileReader 无法读取文件，可能是文件被其他程序锁定或浏览器权限问题。', solution: '关闭其他可能占用该文件的程序；尝试刷新页面后重新选择文件。' },
        { code: 'IMPORT_TOOL_MISMATCH', message: '导入配置时提示「工具类型不匹配」', cause: '导入的 JSON 中 tool 字段不是 image-converter。', solution: '确认导入的是图片转换器导出的配置文件。' },
        { code: 'UNSAVED_WARNING', message: '刷新页面时弹出未保存警告', cause: '滤镜参数被修改但尚未点击保存。', solution: '在离开页面前点击「保存」按钮，或确认放弃修改后继续刷新。' },
      ],
    },
  ],
};
