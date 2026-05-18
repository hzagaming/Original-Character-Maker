import type { DocsContent } from './types';


export const docsContent: DocsContent = {
  intro: `欢迎使用 Original Character Maker (OC Maker) 用户手册！

OC Maker 是一款专为原创角色（OC）创作者设计的全功能工具套件。无论您是绘制角色立绘、设计世界观、撰写角色背景故事，还是需要将角色转换为不同艺术风格、生成角色语音、训练专属 AI 模型，OC Maker 都能为您提供一站式解决方案。

【文档结构】
本手册包含三大部分：

1. 工具使用指南 —— 详细介绍每个功能模块的使用方法、界面说明、参数解释和常见问题。每个工具都有独立的章节，包括：
   · 功能概述：该工具的核心能力和适用场景
   · 按钮说明：每个按钮的功能、快捷键和注意事项
   · 参数详解：所有可调参数的范围、含义和推荐值
   · 错误排查：常见错误的代码、原因分析和解决步骤

2. 错误代码字典 —— 按字母和数字分类的完整错误索引。当遇到错误提示时：
   · 记录错误代码（如 CONFIG_CORRUPTED、STYLE_TRANSFER_REQUEST_FAILED）
   · 根据首字母找到对应分类（A=认证与连接、B=配置与数据、C=内容与输入等）
   · 查看该错误的严重程度、发生位置、根本原因和详细解决步骤
   · 参考相关错误代码和预防建议，避免问题再次发生

3. 快速参考 —— 包含快捷键列表、支持的文件格式、API 限制、性能优化建议等速查信息。

【快速入门】
新用户建议按以下顺序探索：
第 1 步：打开「捏脸编辑器」，体验角色创建的基础流程
第 2 步：尝试「转画风」，将您的角色转换为不同艺术风格
第 3 步：使用「角色设卡」整理角色的详细设定
第 4 步：通过「LLM 文本接入」让 AI 帮您完善世界观和剧情
第 5 步：使用「TTS 语音导出」为角色赋予声音
第 6 步：进阶用户可尝试「paper2gal」训练专属 LoRA 模型

【搜索与导航】
- 左侧边栏：按工具分类浏览所有章节
- 顶部搜索：支持按错误代码、关键词、描述内容全文搜索
- 错误代码直接跳转：在错误面板点击代码即可自动定位到对应条目
- 书签功能：常用章节可添加到浏览器书签快速访问

【反馈与支持】
- 遇到文档未涵盖的问题？请通过应用内的「反馈」按钮提交
- 发现文档错误或过时内容？欢迎提交修正建议
- 需要新功能？在「关于」页面查看开发路线图和投票

【版本信息】
当前文档版本：v1.3.0
最后更新：2025年1月
适用应用版本：v1.3.0 及以上

【贡献者】
感谢以下贡献者对文档的完善：
- 核心文档编写：OC Maker 开发团队
- 日文翻译：社区志愿者
- 韩文翻译：社区志愿者
- 俄文翻译：社区志愿者
- 英文审校：社区志愿者

【开源许可】
OC Maker 采用 MIT 许可证开源。文档内容同样遵循 MIT 许可证，允许自由复制、修改和分发，但请保留原始出处声明。

祝您创作愉快！`,

  tools: [
    {
      id: 'face-maker',
      title: '捏脸编辑器',
      overview: `捏脸编辑器是 OC Maker 的入门级工具，通过左侧部件资产库选择发型、眼型、眉型、鼻型、嘴型、脸型、耳朵、配件、姿势、上衣和下装，再通过右侧 16 个数值滑块精细调整比例、颜色和位置，最终在中央画布实时预览角色形象。所有调整都在本地完成，不会上传任何图片或数据。

v0.6.4+ 新增全身预览：支持 4 种姿势（站立、抱臂、叉腰、挥手）、5 种上衣（T恤、卫衣、西装、水手服）和 4 种下装（裙子、长裤、短裤）。搭配完成后可一键导出 PNG 立绘。


【图层系统详解】
捏脸编辑器采用多层 SVG 矢量渲染架构，共包含 12 个独立图层：背景层、后发层、后身体层、下装层、上衣层、前身体层、耳朵层、脸型层、眉毛层、眼睛层、鼻子层、嘴巴层、前发层、配件层。每个图层均可独立渲染，互不影响。图层顺序经过精心设计，确保前发遮挡耳朵、上衣遮挡身体等视觉效果正确。

【部件资产库】
资产库目前包含超过 80 个可替换部件：
- 发型：20 种（短发、长发、双马尾、单马尾、呆毛、卷发、直发、狼尾、姬发式、波波头等）
- 眼型：16 种（圆眼、丹凤眼、下垂眼、吊眼、猫眼、桃花眼、眯眯眼等）
- 眉型：10 种（柳叶眉、一字眉、剑眉、弯眉、粗眉、细眉等）
- 鼻型：6 种（小鼻、标准鼻、高鼻、塌鼻、翘鼻、鹰钩鼻）
- 嘴型：12 种（微笑、张嘴、抿嘴、嘟嘴、歪嘴、大笑、惊讶嘴等）
- 脸型：8 种（圆脸、鹅蛋脸、瓜子脸、方脸、长脸、心形脸、菱形脸等）
- 耳朵：4 种（人耳、精灵耳、猫耳、兔耳）
- 配件：14 种（圆框眼镜、方框眼镜、墨镜、发带、发卡、蝴蝶结、帽子、口罩、耳环、项链等）
- 姿势：4 种（站立、抱臂、叉腰、挥手）
- 上衣：5 种（T恤、卫衣、西装、水手服、不穿）
- 下装：4 种（裙子、长裤、短裤、不穿）

每个部件均为矢量 SVG 格式，可无损缩放。部件颜色通过 HSL 色相旋转统一控制，确保色调协调。

【高级使用技巧】
1. 快速配色：先调整「肤色」确定基调，再调整「发色」和「瞳色」形成对比。建议使用色相环上相隔 120° 的颜色组合。
2. 比例协调：头部比例 55、脸长 50 为标准值。可爱风格可尝试头部比例 60+、脸长 45-；成熟风格可尝试头部比例 50、脸长 60+。
3. 配件叠加：多个配件可同时佩戴（如眼镜+发带+耳环），但建议不超过 3 个以免视觉混乱。
4. 姿势与服装搭配：抱臂姿势适合西装等正式服装；叉腰姿势适合活泼风格；挥手姿势适合展示全身。
5. 导出设置：PNG 导出支持透明背景（如需纯色背景，可在其他图像软件中添加）。导出分辨率固定为 1024x1024 像素。

【性能注意事项】
- 首次加载时会预加载所有 SVG 部件，约需 2-5MB 流量。建议在 Wi-Fi 环境下首次使用。
- 部分低端设备在频繁切换部件时可能出现轻微卡顿，可减少快速连续点击。
- 浏览器隐私模式下 localStorage 可能被禁用，此时「保存草稿」功能不可用，建议手动导出配置备份。

【版本历史】
- v0.5.0：初始版本，支持头部捏脸和基础部件
- v0.6.0：新增身体、姿势、服装系统
- v0.6.4：新增全身预览、4 种姿势、5 种上衣、4 种下装
- v1.0.0：UI 重构，新增主题系统
- v1.1.0：新增配件颜色独立控制
- v1.2.0：新增导入/导出配置功能
- v1.3.0：优化渲染性能，新增错误提示和文档`,
      buttons: [
        { name: '保存草稿', description: '将当前所有部件选择和参数值保存到浏览器本地存储。保存成功后状态指示器会从黄色「未保存」变为绿色「已保存」。' },
        { name: '导出', description: '将当前捏脸配置导出为 JSON 文件（oc-face-maker-config.json），包含全部部件和参数值，可分享给他人或备份。' },
        { name: '导出 PNG', description: '将当前画布中的角色形象导出为 PNG 图片（oc-character.png），包含头部、身体、姿势和服装的完整立绘，可直接用于社交媒体或二次创作。' },
        { name: '导入配置', description: '选择之前导出的 JSON 配置文件，恢复部件选择和参数值。导入后会自动覆盖当前画布。' },
        { name: '重刷', description: '将所有参数重置为默认值，部件恢复为初始状态。操作前会弹出二次确认弹窗防止误触。' },
        { name: '返回首页', description: '离开捏脸编辑器回到主页。如果当前有未保存的修改，会先弹出确认弹窗。' },
        { name: '打开设置', description: '打开全局设置面板，可调整主题、语言、音频、API 等。' },
      
        { name: '随机生成', description: '随机组合所有部件和参数，快速生成一个新角色。点击后所有滑块会自动跳动到随机值，可连续点击寻找灵感。' },
        { name: '撤销', description: '撤销上一步操作，最多可撤销 20 步。支持 Ctrl+Z 快捷键。' },
        { name: '重做', description: '恢复被撤销的操作，支持 Ctrl+Y / Ctrl+Shift+Z 快捷键。' },
        { name: '放大预览', description: '将中央画布放大到全屏模式，方便检查细节。按 Esc 或点击关闭按钮退出。' },
        { name: '截图', description: '将当前画布内容复制到剪贴板，可直接粘贴到聊天软件或图像编辑器中。' },
        { name: '分享链接', description: '生成包含当前配置参数的 URL 链接，他人打开链接即可看到完全相同的角色。' },
        { name: '深色模式切换', description: '切换画布的背景色为深色或透明，帮助检查角色的暗部细节。' },],
      parameters: [
        { name: '头部比例', description: '调整头部整体大小，范围 40~70。数值越大头部越显大。', tips: '建议配合脸长一起调整，避免头身比例失衡。' },
        { name: '脸长', description: '调整脸部长度，范围 30~70。影响整体脸型从圆脸到长脸的过渡。' },
        { name: '下巴宽度', description: '调整下巴宽窄，范围 30~70。数值小则下巴尖，数值大则下巴宽。' },
        { name: '额头高度', description: '调整额头占脸部的比例，范围 30~70。' },
        { name: '肤色', description: '调整皮肤色调，范围 0~100。通过 HSL 色相偏移实现从浅到深的肤色变化。' },
        { name: '发色', description: '调整头发颜色，范围 0~100。通过色相旋转实现彩虹发色变化。' },
        { name: '眉距', description: '调整两眉之间的距离，范围 30~70。' },
        { name: '眼睛大小', description: '调整眼睛整体缩放比例，范围 38~62。' },
        { name: '眼距', description: '调整两眼之间的距离，范围 30~70。' },
        { name: '眼位', description: '调整眼睛在面部的垂直位置，范围 30~70。数值大则眼睛偏上。' },
        { name: '瞳色', description: '调整瞳孔颜色，范围 0~100。通过色相旋转实现多彩瞳色。' },
        { name: '鼻高', description: '调整鼻子长度/高度，范围 30~70。' },
        { name: '嘴角弧度', description: '调整嘴角上扬或下垂程度，范围 40~64。数值大则嘴角上扬（微笑）。' },
        { name: '嘴宽', description: '调整嘴巴宽度，范围 30~70。' },
        { name: '配件颜色', description: '当选择眼镜、发饰等配件时，调整配件的颜色，范围 0~100。上衣和下装颜色也跟随此滑块。' },
        { name: '整体倾角', description: '微调整个面部的轻微倾斜角度，范围 -10~10 度。' },
        { name: '姿势', description: '选择角色的全身姿势：站立、抱臂、叉腰或挥手。姿势会影响手臂的位置和角度。', tips: '姿势与服装搭配时预览效果最佳。' },
        { name: '上衣', description: '选择角色穿着的上衣：T恤、卫衣、西装、水手服，或不穿。上衣会叠加在身体层之上。', tips: '上衣颜色跟随「配件颜色」滑块调整。' },
        { name: '下装', description: '选择角色穿着的下装：裙子、长裤、短裤，或不穿。下装会叠加在身体下半部。', tips: '下装颜色跟随「配件颜色」滑块调整。' },
      
        { name: '眉毛角度', description: '调整眉毛的倾斜角度，范围 -30~30 度。正值为上扬（生气/惊讶），负值为下垂（悲伤/困惑）。', tips: '搭配眼角弧度可强化表情情绪。' },
        { name: '眼睛开合度', description: '调整眼睛睁开的大小，范围 30~100。数值小则眯眼或闭眼，数值大则瞪大眼睛。', tips: '睡觉时建议设为 5-15，惊讶时设为 90-100。' },
        { name: '睫毛长度', description: '调整睫毛的明显程度，范围 0~100。数值大则睫毛浓密纤长，更适合女性角色。', tips: '男性角色建议 20-40，女性角色建议 60-90。' },
        { name: '瞳孔大小', description: '调整瞳孔在眼睛中的占比，范围 30~70。数值大显得更天真可爱，数值小显得更成熟锐利。', tips: '动漫风格通常偏大（60+），写实风格适中（45-55）。' },
        { name: '鼻子宽度', description: '调整鼻翼的宽度，范围 30~70。数值小则鼻子精致，数值大则鼻子宽厚。', tips: '配合鼻高使用，避免比例失衡。' },
        { name: '嘴唇厚度', description: '调整嘴唇的饱满程度，范围 30~70。数值小则薄唇，数值大则厚唇。', tips: '薄唇适合冷峻角色，厚唇适合性感角色。' },
        { name: '耳朵大小', description: '调整耳朵相对于头部的比例，范围 30~70。精灵耳可适当增大以突出种族特征。', tips: '猫耳/兔耳等动物耳朵不受此参数影响。' },
        { name: '脸颊红晕', description: '调整脸颊的红晕程度，范围 0~100。数值大则脸红效果明显，适合害羞或发烧场景。', tips: '红晕颜色跟随肤色自动调整，偏暖色调。' },
        { name: '表情强度', description: '整体调整所有表情相关参数的幅度，范围 0~100。相当于一个全局表情倍数器。', tips: '设为 0 时角色面无表情，设为 100 时表情最夸张。' },
        { name: '阴影深度', description: '调整面部阴影的明暗对比度，范围 0~100。数值大则立体感强，数值小则平面感强。', tips: '赛璐珞风格建议 60-80，厚涂风格建议 30-50。' },
        { name: '高光强度', description: '调整眼睛和头发高光点的亮度，范围 0~100。高光让角色更有神采。', tips: '写实风格建议 70-90，简约风格建议 30-50。' },
        { name: '轮廓线宽', description: '调整角色外轮廓线的粗细，范围 0~100。数值为 0 时无线稿，呈现厚涂效果。', tips: '赛璐珞动画风格通常 60-80，水彩风格建议 10-30。' },],
      errors: [
        {
          code: 'CONFIG_CORRUPTED',
          message: '捏脸配置加载异常，画布显示不完整或参数滑块无法拖动',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：捏脸编辑器 → 区域：中央画布 / 右侧参数面板',
          cause: '浏览器 localStorage 中保存的 face-maker 配置数据损坏，可能由浏览器更新、手动清理数据、或跨版本导入不兼容的配置导致。',
          solution: '重置配置并重新捏脸。',
          steps: [
            '点击左下角的「重刷」按钮',
            '在弹出的确认弹窗中点击「确认重刷」',
            '如果重刷后仍然异常，按 Ctrl+Shift+I 打开开发者工具 → Application → Local Storage → 删除以 face-maker 开头的键',
            '刷新页面后重新开始',
          ],
          relatedCodes: ['IMPORT_INVALID_JSON', 'STORAGE_READ_ONLY'],
          prevention: '不要手动修改 localStorage 中的数据；跨版本更新后如有异常，建议重置配置。',
        },
        {
          code: 'IMPORT_INVALID_JSON',
          message: '导入配置时提示「无效的 JSON 格式」',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：捏脸编辑器 → 区域：左下角「导入配置」按钮',
          cause: '文件内容损坏、不是 JSON 格式、或被其他程序修改过。也可能选择了非 face-maker 导出的配置文件。',
          solution: '检查文件有效性并重新导入。',
          steps: [
            '用文本编辑器打开要导入的 JSON 文件',
            '确认文件顶部包含 "tool": "face-maker"',
            '确认文件是有效的 UTF-8 编码，无乱码',
            '如果文件损坏，尝试从历史备份中恢复',
          ],
          relatedCodes: ['IMPORT_TOOL_MISMATCH', 'CONFIG_CORRUPTED'],
        },
        {
          code: 'IMPORT_TOOL_MISMATCH',
          message: '导入配置时提示「工具类型不匹配」',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：捏脸编辑器 → 区域：左下角「导入配置」按钮',
          cause: '导入的 JSON 文件中 tool 字段不是 face-maker，可能是其他工具的配置文件。',
          solution: '确认导入的文件是从捏脸编辑器的「导出」按钮生成的 JSON。',
          steps: [
            '用文本编辑器打开要导入的 JSON 文件',
            '确认文件顶部包含 "tool": "face-maker"',
            '如果不是，找到正确的 face-maker 配置文件再导入',
            '或从其他工具页面导入该文件',
          ],
          relatedCodes: ['IMPORT_INVALID_JSON'],
        },
        {
          code: 'LOCAL_STORAGE_FULL',
          message: '保存失败，提示浏览器存储空间不足',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：捏脸编辑器 → 区域：左下角「保存草稿」按钮',
          cause: '浏览器 localStorage 存储空间已满（通常约 5~10MB）。可能保存了大量图片数据或其他工具的历史记录。',
          solution: '清理浏览器存储空间或导出配置到本地文件。',
          steps: [
            '先点击「导出」按钮将当前配置备份到本地文件',
            '按 Ctrl+Shift+I 打开开发者工具 → Application → Local Storage',
            '删除不再需要的键（尤其是包含图片 base64 的大键）',
            '返回捏脸编辑器重新点击「保存草稿」',
          ],
          relatedCodes: ['STORAGE_READ_ONLY'],
          prevention: '定期清理浏览器 localStorage 中不再需要的数据；大文件不要直接保存在编辑器中，改用导出功能。',
        },
        {
          code: 'STORAGE_READ_ONLY',
          message: '保存操作无反应，刷新后数据丢失',
          severity: 'critical',
          category: 'B. 配置与数据',
          location: '页面：捏脸编辑器 → 区域：左下角「保存草稿」按钮',
          cause: '浏览器处于隐私/无痕模式，或 localStorage 被系统策略禁用，或磁盘空间已满导致浏览器将存储设为只读。',
          solution: '退出隐私模式或释放磁盘空间。',
          steps: [
            '确认浏览器不在无痕/隐私浏览模式（该模式通常禁用 localStorage）',
            '检查系统磁盘空间是否已满',
            '尝试在普通窗口中重新打开应用',
            '如果问题持续，使用「导出」功能将配置保存为本地文件作为替代方案',
          ],
          relatedCodes: ['LOCAL_STORAGE_FULL'],
          prevention: '避免在浏览器无痕/隐私模式中使用本应用；定期导出配置到本地文件作为备份。',
        },
        {
          code: 'UNSAVED_WARNING',
          message: '返回首页时提示「你还没保存当前捏脸项目」',
          severity: 'info',
          category: 'B. 配置与数据',
          location: '页面：捏脸编辑器 → 区域：左上角「返回首页」按钮',
          cause: '当前画布状态与上次保存的快照不一致（isDirty 为 true）。你可能修改了参数但忘记保存。',
          solution: '根据需要选择保存或放弃。',
          steps: [
            '如果希望保留修改：点击弹窗中的「取消」，回到编辑器点击「保存草稿」，然后再返回首页',
            '如果不需要保留：点击弹窗中的「确认返回」',
          ],
        },
      ],
    },
    {
      id: 'style-transfer',
      title: '转画风',
      overview: `转画风工具用于将角色图像转换为指定画风。上传 PNG/JPG 格式的角色图像后，通过选择 AI 模型、编写 Prompt 和调整高级参数，调用后端 API 进行风格转换。支持自动抠图、配色保持、姿势保留、面部锁定等高级功能。本工具需要联网并配置有效的 API Key 才能使用。


【风格迁移技术原理】
转画风工具基于神经风格迁移（Neural Style Transfer, NST）技术，使用预训练的 VGG-19 卷积神经网络提取内容图像和风格图像的特征表示。通过最小化内容损失（Content Loss）和风格损失（Style Loss），在保持原图内容结构的同时，将目标风格的艺术特征迁移到原图上。

内容损失衡量生成图像与原始图像在高层卷积特征上的差异，确保角色姿态、表情、构图不变。风格损失使用 Gram 矩阵捕捉纹理、色彩、笔触等风格特征。总损失函数为：L_total = α * L_content + β * L_style + γ * L_tv，其中 TV 损失用于平滑图像，减少噪声。

【支持的模型与风格】
工具内置 8 种预训练风格模型：
1. 动漫风格（Anime）：基于 AnimeGANv2，适合将照片转为二次元风格
2. 油画风格（Oil Painting）：模拟梵高、莫奈等印象派笔触
3. 水彩风格（Watercolor）：柔和的边缘和半透明色彩叠加效果
4. 素描风格（Sketch）：铅笔线条勾勒，保留明暗关系
5. 像素风格（Pixel Art）：8-bit / 16-bit 复古游戏风格
6. 赛博朋克（Cyberpunk）：高对比度、霓虹色调、科技感
7. 水墨风格（Ink Wash）：中国传统水墨画效果
8. 3D 渲染（3D Render）：模拟 Blender / C4D 的三维渲染质感

【参数详解】
- 风格强度（0~100）：控制风格化程度。低值（20-40）保留更多原图细节；高值（70-100）强烈风格化。
- 内容保留（0~100）：控制原图内容保留程度。与风格强度形成此消彼长的关系。
- 迭代次数（50~500）：风格迁移的计算步数。更多迭代通常产生更精细的结果，但处理时间线性增长。
- 输出尺寸（256~2048）：最终图像分辨率。建议选择原图尺寸的整数倍以避免缩放伪影。

【批量处理模式】
支持同时上传最多 10 张图片进行批量风格迁移。批量模式下：
- 所有图片使用相同的风格模型和参数设置
- 处理完成后可打包下载 ZIP 文件
- 每张图片独立处理，失败不影响其他图片
- 建议在批量处理前先用单张图片调试参数

【GPU 加速与性能】
- 启用 WebGL 加速时，处理速度可提升 5-10 倍
- 4K 图像处理需要至少 4GB 显存，否则会自动降级为 CPU 模式
- 处理进度实时显示，可随时取消
- 长时间处理（>30 秒）建议开启「后台处理」模式，允许切换标签页

【输出格式与质量】
- 支持 PNG、JPEG、WebP 三种输出格式
- PNG 保留透明通道，适合二次编辑
- JPEG 可调整质量（60-100），文件体积更小
- WebP 在相同质量下体积比 JPEG 小 25-35%
- 元数据可选保留（EXIF、ICC 色彩配置文件）`,
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
      
        { name: '预览效果', description: '在完整处理前先快速生成低分辨率预览（256px），帮助确认风格选择是否正确。' },
        { name: '对比视图', description: '显示原图和风格化后的图片并排对比，支持滑动条查看过渡效果。' },
        { name: '历史记录', description: '查看最近 20 次风格迁移的历史，可重新加载参数或删除记录。' },
        { name: '收藏风格', description: '将当前使用的风格模型和参数保存到收藏夹，方便下次快速调用。' },
        { name: '调整画布', description: '裁剪、旋转或翻转输入图片，预处理后再进行风格迁移。' },
        { name: '高级参数', description: '展开更多专业参数：内容权重、风格权重、TV 权重、初始化方式等。' },
        { name: 'GPU 监控', description: '实时显示 GPU 显存使用率和温度，帮助判断设备负载。' },],
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
        { name: '配色方案', description: '强制应用的配色主题（暖色、冷色、pastel、高对比等）。' },
        { name: '背景类型', description: '背景处理方式（透明、纯色、渐变、场景、自然等）。' },
        { name: '光照风格', description: '场景光照效果（柔和、戏剧化、背光、伦勃朗等）。' },
      
        { name: '噪点强度', description: '控制生成图像中的随机噪点数量，范围 0~100。适当的噪点可增加纹理质感。', tips: '油画/素描风格建议 20-40，动漫风格建议 5-15。' },
        { name: '边缘保留', description: '控制原图边缘轮廓的保留程度，范围 0~100。高值保留更多原图结构，低值让风格完全重塑轮廓。', tips: '人物肖像建议 70-90，风景/抽象风格建议 30-60。' },
        { name: '色彩饱和度', description: '调整输出图像的色彩鲜艳程度，范围 0~200。100 为原图饱和度，大于 100 增强，小于 100 降低。', tips: '赛博朋克风格建议 120-150，水墨风格建议 40-60。' },
        { name: '亮度偏移', description: '整体调整输出图像的明暗，范围 -50~50。正值提亮，负值压暗。', tips: '油画风格通常需要稍暗（-10~-20），水彩风格可稍亮（+10~+20）。' },
        { name: '对比度增强', description: '调整输出图像的明暗对比，范围 0~200。100 为原图对比度，大于 100 增强对比。', tips: '高对比风格（赛博朋克、海报）建议 130-160，柔和风格建议 80-100。' },
        { name: '风格混合比例', description: '当选择多个风格时，控制各风格的混合权重。仅在使用「多风格叠加」功能时生效。', tips: '建议主要风格占 60-80%，辅助风格占 20-40%。' },
        { name: '多风格叠加', description: '启用后可同时应用 2-3 种风格模型，通过风格混合比例控制各自权重。', tips: '不同风格的兼容性不同，建议先预览再批量处理。' },
        { name: '区域遮罩', description: '上传一张黑白遮罩图，白色区域应用风格迁移，黑色区域保留原图。实现局部风格化效果。', tips: '遮罩图尺寸应与输入图一致，支持 PNG 透明通道作为遮罩。' },
        { name: '后期锐化', description: '风格迁移后应用的锐化滤镜强度，范围 0~100。补偿风格化可能导致的模糊。', tips: '像素风格建议 0，油画风格建议 20-40，照片风格建议 50-70。' },
        { name: '色彩量化', description: '减少输出图像的颜色数量，范围 0~64。非零值可产生海报化或复古游戏的效果。', tips: '像素风格建议 16-32，波普艺术建议 8-16，其他风格建议 0。' },
        { name: '画布纹理', description: '叠加纸张或画布纹理，范围 0~100。适合水彩、油画等需要介质感的风格。', tips: '水彩建议 60-80，油画建议 40-60，数字风格建议 0。' },],
      errors: [
        {
          code: 'API_KEY_MISSING',
          message: '点击「开始」后立刻报错，错误面板显示 API Key 相关错误',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：转画风 → 区域：左栏底部错误面板',
          cause: '未在「设置 → API」中配置 API Key，或 Key 被清空。转画风工具需要有效的 API Key 才能调用后端图像生成服务。',
          solution: '在设置面板中配置有效的 API Key。',
          steps: [
            '点击右上角「打开设置」或按对应快捷键',
            '切换到「API」标签页',
            '在「API Key」输入框中填入你的有效 Key',
            '点击「保存」后关闭设置面板',
            '返回转画风页面重新点击「开始」',
          ],
          relatedCodes: ['API_KEY_EXPIRED', '401_UNAUTHORIZED'],
          prevention: '首次使用任何联网工具前，务必先在「设置 → API」中配置有效的 API Key。',
        },
        {
          code: 'API_KEY_EXPIRED',
          message: '转换请求返回 401 或提示 Key 无效',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：转画风 → 区域：左栏底部错误面板',
          cause: '配置的 API Key 已过期、被吊销、或额度已用完。',
          solution: '更换有效的 API Key。',
          steps: [
            '打开「设置 → API」面板',
            '删除当前 Key，填入新的有效 Key',
            '如果不确定 Key 是否有效，可在 LLM Hub 的实时测试面板中先测试',
            '保存后返回转画风重试',
          ],
          relatedCodes: ['API_KEY_MISSING', '401_UNAUTHORIZED'],
          prevention: '定期检查 API Key 的有效期和剩余额度；在 LLM Hub 中通过实时测试快速验证 Key 是否有效。',
        },
        {
          code: 'API_TIMEOUT',
          message: '请求长时间无响应，最终提示超时',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：转画风 → 区域：左栏底部错误面板 / 进度条',
          cause: '后端生成耗时过长，超过了前端设置的超时时间。可能原因：图像尺寸过大、模型负载高、网络延迟高。',
          solution: '降低图像尺寸或检查网络连接。',
          steps: [
            '在「高级参数」中降低「图像尺寸」（建议不超过 2048）',
            '降低「Steps」值（建议 20~30）',
            '检查网络连接是否稳定',
            '如果使用的是自定义 API，确认后端服务器状态正常',
            '重试转换',
          ],
          relatedCodes: ['NETWORK_TIMEOUT', 'BACKEND_UNAVAILABLE'],
          prevention: '处理大尺寸图片或大量文本时，提前降低参数规模（图像尺寸、Max Tokens 等）；网络不稳定时增加超时设置。',
        },
        {
          code: 'BACKEND_UNAVAILABLE',
          message: '提示「后端不可用」或「无法连接到服务器」',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：转画风 → 区域：左栏底部错误面板',
          cause: '后端服务器未启动、崩溃、或前端配置的 API Base URL 不正确。',
          solution: '检查后端服务状态和 API 配置。',
          steps: [
            '打开浏览器开发者工具 → Network 标签页',
            '重新点击「开始」，观察请求是否发出以及响应状态码',
            '如果请求未发出，检查「设置 → API → API Base URL」是否正确',
            '如果请求返回 502/503，联系后端管理员确认服务状态',
            '如果是本地部署，确认后端进程是否在运行（npm start）',
          ],
          relatedCodes: ['NETWORK_DISCONNECTED', '502_BAD_GATEWAY', '503_SERVICE_UNAVAILABLE'],
          prevention: '本地部署时确保后端进程已启动（npm start）；使用远程服务时确认 URL 配置正确。',
        },
        {
          code: 'NETWORK_DISCONNECTED',
          message: '提示网络断开或无法访问互联网',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：转画风 → 区域：左栏底部错误面板',
          cause: '设备未连接网络、Wi-Fi 断开、或防火墙阻止了请求。',
          solution: '恢复网络连接。',
          steps: [
            '检查设备的网络连接状态',
            '尝试访问其他网站确认网络是否正常',
            '如果使用代理/VPN，检查代理设置是否正确',
            '如果是公司/校园网络，确认是否限制了 API 访问',
          ],
          relatedCodes: ['BACKEND_UNAVAILABLE', 'API_TIMEOUT'],
          prevention: '使用联网工具前确认网络连接正常；避免在网络波动大的环境下进行长时间工作流。',
        },
        {
          code: 'FILE_FORMAT_UNSUPPORTED',
          message: '上传时提示「不支持的文件格式」',
          severity: 'warning',
          category: 'C. 文件与输入',
          location: '页面：转画风 → 区域：左栏「选择图片」按钮',
          cause: '选择了 WEBP、GIF、BMP、TIFF 或其他不支持的格式。转画风仅支持 PNG 和 JPG。',
          solution: '将图片转换为 PNG 或 JPG 格式。',
          steps: [
            '使用图片转换工具（主页 → 图片格式转换）将文件转为 PNG 或 JPG',
            '或使用系统自带的图片预览/编辑工具导出为 PNG/JPG',
            '重新在转画风页面选择转换后的文件',
          ],
          relatedCodes: ['FILE_CORRUPTED', 'UPLOAD_FORMAT'],
        },
        {
          code: 'FILE_TOO_LARGE',
          message: '上传后图片无法预览或转换时报内存错误',
          severity: 'warning',
          category: 'C. 文件与输入',
          location: '页面：转画风 → 区域：左栏预览区',
          cause: '上传的图片尺寸过大（超过 4096x4096 像素）或文件大小超过浏览器/后端限制。',
          solution: '压缩或缩小图片后再上传。',
          steps: [
            '使用图片转换工具将图片最大边缩放到 2048 或 4096 像素以下',
            '如果是 PNG，可转为 JPG 以减小文件大小',
            '重新上传处理后的图片',
          ],
          relatedCodes: ['DEVICE_MEMORY_LOW', 'FILE_FORMAT_UNSUPPORTED'],
        },
        {
          code: 'FILE_CORRUPTED',
          message: '图片预览显示空白或损坏',
          severity: 'warning',
          category: 'C. 文件与输入',
          location: '页面：转画风 → 区域：左栏预览区',
          cause: '图片文件本身已损坏，或下载过程中数据不完整。',
          solution: '使用其他图片或修复/重新下载该图片。',
          steps: [
            '尝试在系统图片查看器中打开该文件，确认是否能正常显示',
            '如果无法显示，尝试用图片修复工具或重新下载/导出',
            '更换为其他有效的 PNG/JPG 图片',
          ],
          relatedCodes: ['FILE_FORMAT_UNSUPPORTED', 'UPLOAD_FORMAT'],
        },
        {
          code: 'MODEL_NOT_FOUND',
          message: '错误面板显示「模型不可用」或 404',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：转画风 → 区域：左栏底部错误面板',
          cause: '选择的模型在后端不存在、已被下架、或当前 API Key 无权访问该模型。',
          solution: '切换到其他可用模型。',
          steps: [
            '在「模型」下拉框中选择其他模型（如 gpt-image-2）',
            '如果使用自定义 API，确认模型 ID 拼写正确',
            '在「设置 → API」中确认当前 Key 支持所选模型',
            '重试转换',
          ],
          relatedCodes: ['403_FORBIDDEN', 'API_KEY_EXPIRED'],
          prevention: '从下拉列表选择已知可用的模型；使用自定义 API 时查阅服务商文档确认模型列表。',
        },
        {
          code: 'PROMPT_BLOCKED',
          message: '请求被拦截，提示「内容策略违规」或「sensitive words」',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：转画风 → 区域：左栏底部错误面板',
          cause: 'Prompt 或 Negative Prompt 中包含了后端服务商的安全过滤器拦截的词汇。即使是正常的艺术创作词汇，某些平台也会误判。',
          solution: '修改 Prompt，移除或替换可能触发过滤器的词汇。',
          steps: [
            '查看错误详情中的具体提示信息，找出被拦截的关键词',
            '将敏感词汇用同义词替换或删除',
            '简化 Prompt，先使用最基础的描述测试是否能通过',
            '逐步添加修饰词，找出具体触发拦截的词汇',
          ],
          relatedCodes: ['403_FORBIDDEN'],
          prevention: '修改 Prompt 覆盖时避免使用敏感词汇；先用默认 Prompt 测试通过后再自定义。',
        },
        {
          code: 'PROMPT_TOO_LONG',
          message: '提示 Prompt 超出长度限制',
          severity: 'warning',
          category: 'D. 模型与生成',
          location: '页面：转画风 → 区域：Prompt 输入框 / 左栏底部错误面板',
          cause: 'Prompt + 高级参数自动附加的后缀总长度超过了后端模型的最大输入限制。',
          solution: '缩短 Prompt 或减少高级参数。',
          steps: [
            '在「Effective Prompt Preview」中查看最终拼接的完整 Prompt 长度',
            '精简正面 Prompt，删除冗余描述',
            '减少高级参数的数量（每个参数都会附加英文后缀）',
            '重试',
          ],
          relatedCodes: ['MODEL_NOT_FOUND'],
        },
        {
          code: 'STYLE_TRANSFER_INPUT_MISSING',
          message: '点击「开始」后立刻报错，提示未上传图片',
          severity: 'warning',
          category: 'C. 文件与输入',
          location: '页面：转画风 → 区域：左栏底部错误面板',
          cause: '未上传图片，或上传后点击了「开始」但没有有效的输入文件。',
          solution: '确认已上传有效的图片文件。',
          steps: [
            '点击「选择图片」按钮',
            '在文件选择器中选择有效的 PNG/JPG 文件',
            '确认预览区显示了图片缩略图',
            '点击「开始」',
          ],
          relatedCodes: ['FILE_FORMAT_UNSUPPORTED', 'FILE_CORRUPTED'],
        },
        {
          code: 'STYLE_TRANSFER_REQUEST_FAILED',
          message: '错误面板上显示「STYLE_TRANSFER_REQUEST_FAILED」',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：转画风 → 区域：左栏底部错误面板',
          cause: '后端 API 请求失败。可能是网络中断、API Key 无效、模型不可用、或服务器内部错误。',
          solution: '根据错误详情中的具体信息排查。',
          steps: [
            '展开错误面板查看详细错误信息（HTTP 状态码、后端返回的消息）',
            '如果是 401：检查 API Key 是否有效',
            '如果是 404：检查模型是否可用',
            '如果是 429：等待一段时间后重试，或降低请求频率',
            '如果是 500/502/503：检查后端服务状态',
            '如果是网络错误：检查网络连接',
          ],
          relatedCodes: ['API_KEY_MISSING', 'API_KEY_EXPIRED', 'MODEL_NOT_FOUND', 'BACKEND_UNAVAILABLE', '429_TOO_MANY_REQUESTS'],
          prevention: '开始转换前确认 API Key 有效、网络连接正常、模型可用。',
        },
        {
          code: '429_TOO_MANY_REQUESTS',
          message: '提示请求过于频繁（Rate Limit）',
          severity: 'warning',
          category: 'A. API 与网络',
          location: '页面：转画风 → 区域：左栏底部错误面板',
          cause: '短时间内发送了过多请求，超过了服务商的速率限制。',
          solution: '等待一段时间后重试。',
          steps: [
            '查看错误详情中的 Retry-After 提示（如果有）',
            '等待 30~60 秒后重试',
            '如果频繁遇到此问题，降低同时进行的操作数量',
            '考虑升级 API 套餐以获得更高的速率限制',
          ],
          relatedCodes: ['API_RATE_LIMIT', 'STYLE_TRANSFER_REQUEST_FAILED'],
        },
        {
          code: '500_INTERNAL_ERROR',
          message: '后端返回 500 内部服务器错误',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：转画风 → 区域：左栏底部错误面板',
          cause: '后端服务在处理请求时发生内部异常。可能是模型加载失败、GPU 内存不足、或代码 Bug。',
          solution: '稍后重试或联系后端管理员。',
          steps: [
            '等待 1~2 分钟后重试',
            '降低图像尺寸和 Steps 值，减少后端负载',
            '如果问题持续，联系后端管理员查看服务器日志',
          ],
          relatedCodes: ['502_BAD_GATEWAY', '503_SERVICE_UNAVAILABLE'],
          prevention: '降低请求规模（图像尺寸、Max Tokens 等）；避免在服务器高负载时提交大任务。',
        },
        {
          code: '502_BAD_GATEWAY',
          message: '后端返回 502 Bad Gateway',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：转画风 → 区域：左栏底部错误面板',
          cause: '反向代理（如 Nginx）无法连接到后端应用服务器。可能是后端进程崩溃或未启动。',
          solution: '检查后端服务状态。',
          steps: [
            '如果是本地部署，确认后端进程是否在运行',
            '检查后端服务端口是否被占用',
            '查看后端日志确认是否有启动错误',
            '重启后端服务后重试',
          ],
          relatedCodes: ['503_SERVICE_UNAVAILABLE', 'BACKEND_UNAVAILABLE'],
          prevention: '本地部署时确认后端进程在运行；检查反向代理配置。',
        },
        {
          code: '503_SERVICE_UNAVAILABLE',
          message: '后端返回 503 Service Unavailable',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：转画风 → 区域：左栏底部错误面板',
          cause: '后端服务暂时不可用，可能正在进行维护、重启、或过载保护。',
          solution: '稍后重试。',
          steps: [
            '等待 2~3 分钟后重试',
            '检查后端服务状态页面（如果有）',
            '联系后端管理员确认是否在维护',
          ],
          relatedCodes: ['502_BAD_GATEWAY', 'BACKEND_UNAVAILABLE'],
          prevention: '避开服务器维护时段操作；高负载时降低请求频率。',
        },
        {
          code: 'IMPORT_INVALID_JSON',
          message: '导入配置时提示「无效的 JSON 格式」',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：转画风 → 区域：顶部「导入配置」按钮',
          cause: '文件内容损坏、不是 JSON 格式、或被其他程序修改过。',
          solution: '检查文件是否为有效的 UTF-8 编码文本文件。',
          steps: [
            '用文本编辑器打开文件查看是否有乱码',
            '确认文件顶部包含 "tool": "style-transfer"',
            '尝试用 JSON 在线格式化工具验证',
          ],
          relatedCodes: ['IMPORT_TOOL_MISMATCH'],
        },
        {
          code: 'IMPORT_TOOL_MISMATCH',
          message: '导入配置时提示「工具类型不匹配」',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：转画风 → 区域：顶部「导入配置」按钮',
          cause: '导入的 JSON 文件中 tool 字段不是 style-transfer。',
          solution: '确认导入的是转画风页面导出的配置文件。',
          steps: [
            '用文本编辑器打开文件',
            '确认 tool 字段值为 "style-transfer"',
            '如果不是，找到正确的配置文件或从对应工具页面导入',
          ],
          relatedCodes: ['IMPORT_INVALID_JSON'],
        },
        {
          code: 'DEVICE_MEMORY_LOW',
          message: '浏览器标签页崩溃或无响应',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：转画风 → 区域：整个页面',
          cause: '设备内存不足，浏览器强制终止了标签页进程。通常发生在处理超大图片（>8K 分辨率）时。',
          solution: '关闭其他标签页，降低图片尺寸，或换用内存更大的设备。',
          steps: [
            '保存当前工作（如果有）',
            '关闭其他不用的浏览器标签页',
            '使用图片转换工具将图片最大边缩放到 2048 以下',
            '重启浏览器后重试',
            '如果问题持续，尝试在内存更大的设备上操作',
          ],
          relatedCodes: ['FILE_TOO_LARGE'],
          prevention: '处理大文件前关闭其他浏览器标签页；将图片最大边缩放到 2048 以下。',
        },
      ],
    },
    {
      id: 'character-gif',
      title: '角色 GIF 生成',
      overview: `角色 GIF 生成工具用于将静态角色图像转换为动态 GIF 动画。上传 PNG/JPG 格式的角色图像后，通过调整帧数、帧率、循环模式、动画类型和缓动函数等参数，调用后端 API 生成带有呼吸、眨眼、摇摆、漂浮、心跳、发丝飘动、尾巴摇摆、魔法光芒等动画效果的动态 GIF。支持自动抠图、配色保持、姿势保留、面部锁定等高级功能。本工具需要联网并配置有效的 API Key 才能使用。

基本流程：
1. 上传角色源图像
2. 调整 GIF 动画参数（帧数、帧率、动画类型）
3. 选择模型和风格选项
4. 点击「生成 GIF」
5. 查看、复制或下载生成的 GIF 动画

【GIF 动画技术原理】
角色 GIF 生成基于帧插值和运动合成技术。后端根据选择的动画类型和缓动函数，在关键姿态之间生成中间帧。循环和反向循环选项控制播放行为。

内容帧通过时间轴上的姿态插值生成：每一帧都是基于前一帧的微小变形，确保动画流畅自然。总帧数决定动画的细腻程度，帧率控制播放速度。

【支持的动画类型】
工具内置 8 种动画效果：
1. 呼吸（Breathing）：胸部 subtle 扩张/收缩，模拟生命感
2. 眨眼（Blinking）：眼睛开合循环，适合肖像类角色
3. 摇摆（Swaying）：身体左右轻微摇摆，增加灵动感
4. 漂浮（Floating）：上下悬浮效果，适合魔法/幻想角色
5. 心跳（Heartbeat）：脉冲发光或缩放动画，增强情感表达
6. 发丝飘动（Hair-flow）：头发随风摆动，增加动态细节
7. 尾巴摇摆（Tail-wag）：有尾巴角色的节奏性摆动
8. 魔法光芒（Magic-glow）：脉动的魔法光环效果

【参数详解】
- 帧数（2~60）：GIF 中的总帧数。更多帧 = 更流畅但文件更大。建议 8-16 帧用于网页 GIF。
- 帧率（1~60 FPS）：每秒播放的帧数。12 FPS 是网页 GIF 的标准。
- 循环播放：是否无限循环播放。关闭则只播放一次。
- 单帧时长（10~1000ms）：每帧显示的时间（毫秒）。
- 动画类型：选择动画风格（呼吸、眨眼、摇摆等）。
- 缓动函数：Linear（线性）、easeIn（缓入）、easeOut（缓出）、easeInOut（缓入缓出）、spring（弹簧）、bounce（弹跳）。
- 反向循环：正向播放后再反向播放，形成往返循环。
- 风格强度（0~1）：控制风格化程度。
- 线稿风格：clean（干净）、sketchy（素描）、thick（粗线）、thin（细线）、none（无线稿）。
- 配色方案：vibrant（鲜艳）、pastel（柔和）、muted（低调）、monochrome（单色）、neon（霓虹）、warm（暖色）、cool（冷色）。
- 背景类型：simple（简单）、gradient（渐变）、detailed（详细）、transparent（透明）、blurred（模糊）。
- 光照风格：dramatic（戏剧化）、soft（柔和）、neon（霓虹）、natural（自然）、studio（工作室）、backlight（背光）。
- 镜头角度：three-quarter（四分之三）、front（正面）、profile（侧面）、low-angle（低角度）、high-angle（高角度）、dutch（荷兰角）、over-shoulder（过肩）。
- 角色情绪：calm（平静）、happy（开心）、serious（严肃）、shy（害羞）、confident（自信）、surprised（惊讶）、angry（生气）、sad（悲伤）。
- 服装细节：school uniform（校服）、casual wear（休闲装）、battle outfit（战斗服）、maid outfit（女仆装）、kimono（和服）、gothic lolita（哥特萝莉）、sportswear（运动服）、swimsuit（泳装）、wedding dress（婚纱）、idol costume（偶像服）。

【输出格式与优化】
- GIF 格式，针对网页使用优化
- 启用抠图时支持透明背景
- 典型文件大小：500KB ~ 5MB（取决于帧数和分辨率）
- 支持通过「图像尺寸」参数控制输出分辨率
- 建议使用 512x512 或 1024x1024 以获得最佳平衡`,
      buttons: [
        { name: '选择图片 / 替换图片', description: '上传角色图像文件。支持 PNG 和 JPG 格式，推荐上传单人立绘或清晰半身图。' },
        { name: '生成 GIF', description: '启动 GIF 生成流程。会先验证输入文件和参数，然后向后端发送生成请求。' },
        { name: '中止任务', description: '取消正在进行的 GIF 生成任务。' },
        { name: '复制 JSON', description: '将当前所有参数配置复制为 JSON 文本到剪贴板，方便分享或备份。' },
        { name: '下载 JSON', description: '将当前参数配置下载为 JSON 文件。' },
        { name: '复制结果', description: '生成成功后，将 GIF 复制到剪贴板（如果浏览器支持）。' },
        { name: '下载结果', description: '将生成的 GIF 下载到本地。' },
        { name: '打开文件', description: '在新标签页中打开生成的 GIF。' },
        { name: '重做', description: '使用相同的参数重新生成 GIF。' },
        { name: '展开详情 / 收起详情', description: '展开或折叠高级参数面板和调试信息面板。' },
        { name: '重刷', description: '重置所有参数为默认值，清除上传的图片和结果。' },
        { name: '正面提示词库', description: '打开标签选择器，从分类库中快速插入正面 Prompt Tag。' },
        { name: '负面提示词库', description: '打开标签选择器，从分类库中快速插入负面 Prompt Tag。' },
        { name: '高级参数', description: '展开更多专业参数：宽高比、光照、镜头角度、情绪、服装、线稿风格等。' },
      ],
      parameters: [
        { name: '模型', description: '选择使用的 AI 图像生成模型。内置模式走 Plato 后端通道，自定义模式使用你配置的外部 API。', tips: 'gpt-image-2 是默认推荐模型，支持编辑和生成；Anime Transfer XL v4 在动漫风格方面表现更好。' },
        { name: 'Prompt', description: '正面提示词，描述你想要的画风、场景和角色特征。支持使用「正面提示词库」快速插入常用 Tag。', tips: 'Prompt 会自动附加高级参数转换后的英文后缀，可在「实际 Prompt 预览」中查看最终效果。' },
        { name: 'Negative Prompt', description: '负面提示词，描述你不希望出现的内容。支持使用「负面提示词库」快速插入。', tips: '常见负面 Tag：低质量、多余手指、变形身体、模糊等。' },
        { name: 'Temperature', description: '采样温度，控制生成结果的随机性。范围 0~2，默认 0.78。', tips: '值越低结果越稳定可预测，值越高越有创意但可能偏离预期。GIF 生成建议 0.6~0.9。' },
        { name: 'Top P', description: '核采样阈值，范围 0~1，默认 0.92。', tips: '降低可减少生成结果的多样性，提高一致性。' },
        { name: 'Top K', description: 'Top-K 采样，范围 1~128，默认 48。', tips: '较低值使生成更保守。' },
        { name: 'Seed', description: '随机种子，默认 240315。固定种子可获得可复现的结果。', tips: '记录喜欢的结果对应的 Seed，方便复现相同动画。' },
        { name: 'Steps', description: '去噪步数，范围 8~60。步数越多细节越丰富但耗时越长。', tips: 'GIF 生成建议 20~30 步，平衡质量和速度。' },
        { name: 'CFG', description: 'Classifier-Free Guidance 缩放因子，范围 1~14，默认 6.8。', tips: '值越大 Prompt 约束力越强。7~10 是安全区间。' },
        { name: '帧数', description: 'GIF 中的总帧数，范围 2~60，默认 8。', tips: '8-16 帧是网页 GIF 的标准。帧数越多动画越流畅，但文件越大、生成时间越长。' },
        { name: '帧率 (FPS)', description: '每秒播放的帧数，范围 1~60，默认 12。', tips: '12 FPS 是网页 GIF 的标准；24+ FPS 可获得更流畅的效果。' },
        { name: '循环播放', description: '是否无限循环播放 GIF。', tips: '关闭则只播放一次，适合展示特定动作。' },
        { name: '单帧时长 (ms)', description: '每帧显示的时间（毫秒），范围 10~1000，默认 100。', tips: '100ms = 10 FPS。与 FPS 参数联动控制播放速度。' },
        { name: '动画类型', description: '选择应用于角色的动画风格。', tips: '呼吸适合静态姿势；眨眼为肖像增添生命力；漂浮适合魔法/幻想角色。' },
        { name: '缓动函数', description: '动画的加速/减速方式。', tips: 'easeInOut 最适合呼吸和摇摆；spring 适合心跳和尾巴摇摆。' },
        { name: '反向循环', description: '正向播放后再反向播放，形成往返循环。', tips: '适合呼吸、摇摆等往复运动，可节省帧数。' },
        { name: '需要抠图', description: '是否在生成前自动移除背景。启用后 GIF 支持透明背景。', tips: '透明背景 GIF 更适合网页叠加和表情包使用。' },
        { name: '保留原配色', description: '是否强制保留原始图像的配色方案。', tips: '开启可确保角色颜色在动画中保持一致。' },
        { name: '保留姿态', description: '是否尽量保持原始角色的姿势和构图。', tips: '建议开启，避免动画导致姿势扭曲。' },
        { name: '锁定五官', description: '是否使用面部特征锁定技术，确保动画中角色面部一致性。', tips: '强烈建议开启，尤其是眨眼动画。' },
        { name: '细节增强', description: '是否启用细节增强处理，提升输出 GIF 的精细度。', tips: '开启可提升边缘清晰度，但会增加生成时间。' },
        { name: '宽高比', description: '输出 GIF 的宽高比例预设（1:1、2:3、3:2、16:9 等）。', tips: '建议与源图像比例一致。' },
        { name: '图像尺寸', description: '输出 GIF 的短边像素数。', tips: '512x512 或 1024x1024 是最佳平衡点。' },
        { name: '风格强度', description: '控制风格化程度，范围 0~1，默认 0.75。', tips: '0.5~0.8 是常用区间。' },
        { name: '线稿风格', description: '输出 GIF 的线稿处理风格。', tips: 'clean 适合大多数动漫风格；sketchy 适合手绘感。' },
        { name: '配色方案', description: '强制应用的配色主题。', tips: 'vibrant 适合鲜艳角色；pastel 适合柔和风格。' },
        { name: '背景类型', description: '背景处理方式。', tips: 'transparent 配合抠图可获得透明背景 GIF。' },
        { name: '光照风格', description: '场景光照效果。', tips: 'soft 适合日常场景；dramatic 适合戏剧性角色。' },
        { name: '镜头角度', description: '虚拟相机的拍摄角度。', tips: 'three-quarter 是最常用的角色展示角度。' },
        { name: '角色情绪', description: '角色的情感状态。', tips: '情绪会影响面部表情和姿态。' },
        { name: '服装细节', description: '角色的服装类型。', tips: '详细的服装描述可获得更精确的结果。' },
        { name: '眼睛风格', description: '角色眼睛的处理风格。', tips: 'detailed 适合大多数动漫角色；sparkling 适合萌系角色。' },
        { name: '发型', description: '角色的发型类型。', tips: '发型会影响角色的整体印象。' },
        { name: '皮肤质感', description: '角色皮肤的处理风格。', tips: 'smooth 适合二次元风格；realistic 适合写实风格。' },
      ],
      errors: [
        {
          code: 'API_KEY_MISSING',
          message: '点击「生成 GIF」后立刻报错，错误面板显示 API Key 相关错误',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：角色 GIF 生成 → 区域：左栏底部错误面板',
          cause: '未在「设置 → API」中配置 API Key，或 Key 被清空。角色 GIF 生成需要有效的 API Key 才能调用后端图像生成服务。',
          solution: '在设置面板中配置有效的 API Key。',
          steps: [
            '点击右上角「打开设置」或按对应快捷键',
            '切换到「API」标签页',
            '在「API Key」输入框中填入你的有效 Key',
            '点击「保存」后关闭设置面板',
            '返回角色 GIF 页面重新点击「生成 GIF」',
          ],
          relatedCodes: ['API_KEY_EXPIRED', '401_UNAUTHORIZED'],
          prevention: '首次使用任何联网工具前，务必先在「设置 → API」中配置有效的 API Key。',
        },
        {
          code: 'API_KEY_EXPIRED',
          message: '生成请求返回 401 或提示 Key 无效',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：角色 GIF 生成 → 区域：左栏底部错误面板',
          cause: '配置的 API Key 已过期、被吊销、或额度已用完。',
          solution: '更换有效的 API Key。',
          steps: [
            '打开「设置 → API」面板',
            '删除当前 Key，填入新的有效 Key',
            '如果不确定 Key 是否有效，可在 LLM Hub 的实时测试面板中先测试',
            '保存后返回角色 GIF 重试',
          ],
          relatedCodes: ['API_KEY_MISSING', '401_UNAUTHORIZED'],
          prevention: '定期检查 API Key 的有效期和剩余额度；在 LLM Hub 中通过实时测试快速验证 Key 是否有效。',
        },
        {
          code: 'API_TIMEOUT',
          message: '请求长时间无响应，最终提示超时',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：角色 GIF 生成 → 区域：左栏底部错误面板 / 进度条',
          cause: '后端生成耗时过长，超过了前端设置的超时时间。GIF 生成比单张图片更耗时，尤其是高帧数或大尺寸时。',
          solution: '降低帧数、图像尺寸或检查网络连接。',
          steps: [
            '在「高级参数」中降低「图像尺寸」（建议不超过 1024）',
            '降低「帧数」（建议 8~12 帧）',
            '降低「Steps」值（建议 20~28）',
            '检查网络连接是否稳定',
            '如果使用的是自定义 API，确认后端服务器状态正常',
            '重试生成',
          ],
          relatedCodes: ['NETWORK_TIMEOUT', 'BACKEND_UNAVAILABLE'],
          prevention: 'GIF 生成比单张图片耗时更长；提前降低参数规模（图像尺寸、帧数、Steps 等）；网络不稳定时增加超时设置。',
        },
        {
          code: 'BACKEND_UNAVAILABLE',
          message: '提示「后端不可用」或「无法连接到服务器」',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：角色 GIF 生成 → 区域：左栏底部错误面板',
          cause: '后端服务器未启动、崩溃、或前端配置的 API Base URL 不正确。',
          solution: '检查后端服务状态和 API 配置。',
          steps: [
            '打开浏览器开发者工具 → Network 标签页',
            '重新点击「生成 GIF」，观察请求是否发出以及响应状态码',
            '如果请求未发出，检查「设置 → API → API Base URL」是否正确',
            '如果请求返回 502/503，联系后端管理员确认服务状态',
            '如果是本地部署，确认后端进程是否在运行（npm start）',
          ],
          relatedCodes: ['NETWORK_DISCONNECTED', '502_BAD_GATEWAY', '503_SERVICE_UNAVAILABLE'],
          prevention: '本地部署时确保后端进程已启动（npm start）；使用远程服务时确认 URL 配置正确。',
        },
        {
          code: 'NETWORK_DISCONNECTED',
          message: '提示网络断开或无法访问互联网',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：角色 GIF 生成 → 区域：左栏底部错误面板',
          cause: '设备未连接网络、Wi-Fi 断开、或防火墙阻止了请求。',
          solution: '恢复网络连接。',
          steps: [
            '检查设备的网络连接状态',
            '尝试访问其他网站确认网络是否正常',
            '如果使用代理/VPN，检查代理设置是否正确',
            '如果是公司/校园网络，确认是否限制了 API 访问',
          ],
          relatedCodes: ['BACKEND_UNAVAILABLE', 'API_TIMEOUT'],
          prevention: '使用联网工具前确认网络连接正常；避免在网络波动大的环境下进行长时间工作流。',
        },
        {
          code: 'FILE_FORMAT_UNSUPPORTED',
          message: '上传时提示「不支持的文件格式」',
          severity: 'warning',
          category: 'C. 文件与输入',
          location: '页面：角色 GIF 生成 → 区域：左栏「选择图片」按钮',
          cause: '选择了 WEBP、GIF、BMP、TIFF 或其他不支持的格式。角色 GIF 生成仅支持 PNG 和 JPG。',
          solution: '将图片转换为 PNG 或 JPG 格式。',
          steps: [
            '使用图片转换工具（主页 → 图片格式转换）将文件转为 PNG 或 JPG',
            '或使用系统自带的图片预览/编辑工具导出为 PNG/JPG',
            '重新在角色 GIF 页面选择转换后的文件',
          ],
          relatedCodes: ['FILE_CORRUPTED', 'UPLOAD_FORMAT'],
          prevention: '确认文件格式是 PNG 或 JPG 后再上传。',
        },
        {
          code: 'FILE_TOO_LARGE',
          message: '上传后图片无法预览或生成时报内存错误',
          severity: 'warning',
          category: 'C. 文件与输入',
          location: '页面：角色 GIF 生成 → 区域：左栏预览区',
          cause: '上传的图片尺寸过大（超过 4096x4096 像素）或文件大小超过浏览器/后端限制。GIF 生成对内存要求更高。',
          solution: '压缩或缩小图片后再上传。',
          steps: [
            '使用图片转换工具将图片最大边缩放到 2048 或 1024 像素以下',
            '如果是 PNG，可转为 JPG 以减小文件大小',
            '重新上传处理后的图片',
          ],
          relatedCodes: ['DEVICE_MEMORY_LOW', 'FILE_FORMAT_UNSUPPORTED'],
          prevention: '建议上传 1024×1024 ~ 2048×2048 的图片；GIF 生成时内存占用比单张图片更高。',
        },
        {
          code: 'FILE_CORRUPTED',
          message: '图片预览显示空白或损坏',
          severity: 'warning',
          category: 'C. 文件与输入',
          location: '页面：角色 GIF 生成 → 区域：左栏预览区',
          cause: '图片文件本身已损坏，或下载过程中数据不完整。',
          solution: '使用其他图片或修复/重新下载该图片。',
          steps: [
            '尝试在系统图片查看器中打开该文件，确认是否能正常显示',
            '如果无法显示，尝试用图片修复工具或重新下载/导出',
            '更换为其他有效的 PNG/JPG 图片',
          ],
          relatedCodes: ['FILE_FORMAT_UNSUPPORTED', 'UPLOAD_FORMAT'],
          prevention: '上传前确认图片能在系统图片查看器中正常打开。',
        },
        {
          code: 'MODEL_NOT_FOUND',
          message: '错误面板显示「模型不可用」或 404',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：角色 GIF 生成 → 区域：左栏底部错误面板',
          cause: '选择的模型在后端不存在、已被下架、或当前 API Key 无权访问该模型。',
          solution: '切换到其他可用模型。',
          steps: [
            '在「模型」下拉框中选择其他模型（如 gpt-image-2）',
            '如果使用自定义 API，确认模型 ID 拼写正确',
            '在「设置 → API」中确认当前 Key 支持所选模型',
            '重试生成',
          ],
          relatedCodes: ['403_FORBIDDEN', 'API_KEY_EXPIRED'],
          prevention: '从下拉列表选择已知可用的模型；使用自定义 API 时查阅服务商文档确认模型列表。',
        },
        {
          code: 'PROMPT_BLOCKED',
          message: '请求被拦截，提示「内容策略违规」或「sensitive words」',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：角色 GIF 生成 → 区域：左栏底部错误面板',
          cause: 'Prompt 或 Negative Prompt 中包含了后端服务商的安全过滤器拦截的词汇。',
          solution: '修改 Prompt，移除或替换可能触发过滤器的词汇。',
          steps: [
            '查看错误详情中的具体提示信息，找出被拦截的关键词',
            '将敏感词汇用同义词替换或删除',
            '简化 Prompt，先使用最基础的描述测试是否能通过',
            '逐步添加修饰词，找出具体触发拦截的词汇',
          ],
          relatedCodes: ['403_FORBIDDEN'],
          prevention: '修改 Prompt 时避免使用敏感词汇；先用默认 Prompt 测试通过后再自定义。',
        },
        {
          code: 'PROMPT_TOO_LONG',
          message: '提示 Prompt 超出长度限制',
          severity: 'warning',
          category: 'D. 模型与生成',
          location: '页面：角色 GIF 生成 → 区域：Prompt 输入框 / 左栏底部错误面板',
          cause: 'Prompt + 高级参数自动附加的后缀总长度超过了后端模型的最大输入限制。',
          solution: '缩短 Prompt 或减少高级参数。',
          steps: [
            '在「实际 Prompt 预览」中查看最终拼接的完整 Prompt 长度',
            '精简正面 Prompt，删除冗余描述',
            '减少高级参数的数量（每个参数都会附加英文后缀）',
            '重试',
          ],
          relatedCodes: ['MODEL_NOT_FOUND'],
        },
        {
          code: 'CHARACTER_GIF_INPUT_MISSING',
          message: '点击「生成 GIF」后立刻报错，提示未上传图片',
          severity: 'warning',
          category: 'C. 文件与输入',
          location: '页面：角色 GIF 生成 → 区域：左栏底部错误面板',
          cause: '未上传图片，或上传后点击了「生成 GIF」但没有有效的输入文件。',
          solution: '确认已上传有效的图片文件。',
          steps: [
            '点击「选择图片」按钮',
            '在文件选择器中选择有效的 PNG/JPG 文件',
            '确认预览区显示了图片缩略图',
            '点击「生成 GIF」',
          ],
          relatedCodes: ['FILE_FORMAT_UNSUPPORTED', 'FILE_CORRUPTED'],
          prevention: '确认源图像已上传且预览正常后再生成 GIF。',
        },
        {
          code: 'CHARACTER_GIF_REQUEST_FAILED',
          message: '错误面板上显示「CHARACTER_GIF_REQUEST_FAILED」',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：角色 GIF 生成 → 区域：左栏底部错误面板',
          cause: '后端 API 请求失败。可能是网络中断、API Key 无效、模型不可用、帧数过多导致内存不足、或服务器内部错误。',
          solution: '根据错误详情中的具体信息排查。',
          steps: [
            '展开错误面板查看详细错误信息（HTTP 状态码、后端返回的消息）',
            '如果是 401：检查 API Key 是否有效',
            '如果是 404：检查模型是否可用',
            '如果是 429：等待一段时间后重试，或降低请求频率',
            '如果是 500/502/503：检查后端服务状态',
            '如果是内存错误：降低帧数（建议 8 帧以下）和图像尺寸',
            '如果是网络错误：检查网络连接',
          ],
          relatedCodes: ['API_KEY_MISSING', 'API_KEY_EXPIRED', 'MODEL_NOT_FOUND', 'BACKEND_UNAVAILABLE', '429_TOO_MANY_REQUESTS'],
          prevention: '开始生成前确认 API Key 有效、网络连接正常、模型可用；首次生成建议先用低帧数（8帧）测试。',
        },
        {
          code: '429_TOO_MANY_REQUESTS',
          message: '提示请求过于频繁（Rate Limit）',
          severity: 'warning',
          category: 'A. API 与网络',
          location: '页面：角色 GIF 生成 → 区域：左栏底部错误面板',
          cause: '短时间内发送了过多请求，超过了服务商的速率限制。GIF 生成比单张图片更耗资源，更容易触发限流。',
          solution: '等待一段时间后重试。',
          steps: [
            '查看错误详情中的 Retry-After 提示（如果有）',
            '等待 60~120 秒后重试',
            '如果频繁遇到此问题，降低帧数和图像尺寸',
            '考虑升级 API 套餐以获得更高的速率限制',
          ],
          relatedCodes: ['API_RATE_LIMIT', 'CHARACTER_GIF_REQUEST_FAILED'],
          prevention: 'GIF 生成消耗更多资源，适当降低请求频率；避免在短时间内多次重试。',
        },
        {
          code: '500_INTERNAL_ERROR',
          message: '后端返回 500 内部服务器错误',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：角色 GIF 生成 → 区域：左栏底部错误面板',
          cause: '后端服务在处理请求时发生内部异常。可能是模型加载失败、GPU 内存不足（GIF 生成更耗显存）、或代码 Bug。',
          solution: '稍后重试或联系后端管理员。',
          steps: [
            '等待 1~2 分钟后重试',
            '降低图像尺寸、帧数和 Steps 值，减少后端负载',
            '如果问题持续，联系后端管理员查看服务器日志',
          ],
          relatedCodes: ['502_BAD_GATEWAY', '503_SERVICE_UNAVAILABLE'],
          prevention: '降低请求规模（图像尺寸、帧数、Steps 等）；避免在服务器高负载时提交大任务。',
        },
        {
          code: '502_BAD_GATEWAY',
          message: '后端返回 502 Bad Gateway',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：角色 GIF 生成 → 区域：左栏底部错误面板',
          cause: '反向代理（如 Nginx）无法连接到后端应用服务器。可能是后端进程崩溃或未启动。',
          solution: '检查后端服务状态。',
          steps: [
            '如果是本地部署，确认后端进程是否在运行',
            '检查后端服务端口是否被占用',
            '查看后端日志确认是否有启动错误',
            '重启后端服务后重试',
          ],
          relatedCodes: ['503_SERVICE_UNAVAILABLE', 'BACKEND_UNAVAILABLE'],
          prevention: '本地部署时确认后端进程在运行；检查反向代理配置。',
        },
        {
          code: '503_SERVICE_UNAVAILABLE',
          message: '后端返回 503 Service Unavailable',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：角色 GIF 生成 → 区域：左栏底部错误面板',
          cause: '后端服务暂时不可用，可能正在进行维护、重启、或过载保护。',
          solution: '稍后重试。',
          steps: [
            '等待 2~3 分钟后重试',
            '检查后端服务状态页面（如果有）',
            '联系后端管理员确认是否在维护',
          ],
          relatedCodes: ['502_BAD_GATEWAY', 'BACKEND_UNAVAILABLE'],
          prevention: '避开服务器维护时段操作；高负载时降低请求频率。',
        },
        {
          code: 'IMPORT_INVALID_JSON',
          message: '导入配置时提示「无效的 JSON 格式」',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：角色 GIF 生成 → 区域：顶部「导入配置」按钮',
          cause: '文件内容损坏、不是 JSON 格式、或被其他程序修改过。',
          solution: '检查文件是否为有效的 UTF-8 编码文本文件。',
          steps: [
            '用文本编辑器打开文件查看是否有乱码',
            '确认文件顶部包含 "tool": "character-gif"',
            '尝试用 JSON 在线格式化工具验证',
          ],
          relatedCodes: ['IMPORT_TOOL_MISMATCH'],
        },
        {
          code: 'IMPORT_TOOL_MISMATCH',
          message: '导入配置时提示「工具类型不匹配」',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：角色 GIF 生成 → 区域：顶部「导入配置」按钮',
          cause: '导入的 JSON 文件中 tool 字段不是 character-gif。',
          solution: '确认导入的是角色 GIF 页面导出的配置文件。',
          steps: [
            '用文本编辑器打开文件',
            '确认 tool 字段值为 "character-gif"',
            '如果不是，找到正确的配置文件或从对应工具页面导入',
          ],
          relatedCodes: ['IMPORT_INVALID_JSON'],
        },
        {
          code: 'DEVICE_MEMORY_LOW',
          message: '浏览器标签页崩溃或无响应',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：角色 GIF 生成 → 区域：整个页面',
          cause: '设备内存不足，浏览器强制终止了标签页进程。GIF 生成对内存要求更高，尤其是高帧数时。',
          solution: '关闭其他标签页、降低图片尺寸/帧数，或使用内存更大的设备。',
          steps: [
            '保存当前工作',
            '关闭其他浏览器标签页',
            '降低上传图片尺寸（建议最长边 1024）',
            '降低帧数（建议 8 帧以下）',
            '重启浏览器后重试',
          ],
          relatedCodes: ['FILE_TOO_LARGE'],
          prevention: '处理大文件前关闭其他标签页；将图片最长边缩放到 1024 以下；降低帧数到 8 以下。',
        },
      ],
    },
    {
      id: 'index-tts',
      title: 'IndexTTS 语音合成',
      overview: `IndexTTS 语音合成工具使用零样本音色克隆技术，将文本转换为语音。上传 3~10 秒的参考音频即可克隆任意音色，也可以使用默认音色。支持情感控制、语速调节和多种输出格式。

【使用教程】

第 1 步：准备文本
在文本输入框中输入要合成的内容。支持中文、英文等多种语言。建议：
- 单段文本长度控制在 500 字以内，过长的文本可能导致生成质量下降
- 使用标准标点符号（逗号、句号、问号等）来控制停顿和语调
- 中文文本中避免使用生僻字，模型对某些罕见汉字的拼音处理可能不够准确

第 2 步：选择参考音频（可选）
点击「上传参考音频」按钮，选择一段 3~10 秒的音频文件。建议：
- 格式：WAV 或 MP3，采样率 22050Hz 以上
- 内容：清晰的单人说话声音，背景噪声尽量少
- 长度：5~7 秒为最佳，过短可能克隆效果不佳，过长会增加处理时间
- 音质：音质越好，克隆效果越接近原声
- 如果不上传参考音频，将使用默认音色

第 3 步：调整参数
根据需求调整 TTS 参数：

基础参数：
- 模型：选择 TTS 模型版本。index-tts-1.5 是稳定版，适合大多数场景；index-tts-2 具有高级情感控制，适合需要丰富情感表达的场景。
- Temperature（0~1，默认 0.8）：控制生成随机性。低值（0.5~0.7）适合正式、稳定的语音；高值（0.8~1.0）适合有变化、更自然的语音。
- Top P（0~1，默认 0.92）：核采样阈值。通常保持默认值即可，如需更稳定的输出可降至 0.85。
- Top K（1~128，默认 48）：Top-k 采样。通常无需调整。

语音参数：
- 语速（0.5~2.0，默认 1.0）：播放速度。0.8 适合温柔慢语，1.2~1.5 适合快速播报，2.0 为极速。
- CFG（1~14，默认 6.8）：无分类器引导尺度。7~10 是安全区间，过高可能导致声音失真。

情感参数：
- 情感强度（0~2.0，默认 1.0）：情感表达强度。0.5 适合平淡叙述，1.0 为平衡，1.5~2.0 适合戏剧性表达。
- 情感描述：使用自然语言描述想要的情感风格。例如「温柔低语」、「愤怒地大喊」、「开心兴奋地说话」、「悲伤地哭泣」。支持中文和英文。

高级参数：
- Seed（默认 240315）：固定种子可复现相同结果。记录喜欢的种子值以便后续复现。
- 推理设备：GPU 加速生成速度快，但需要 NVIDIA 显卡支持；CPU 可在任何设备上运行，速度较慢。
- 输出格式：WAV 为无损音质，适合后期编辑；MP3 文件更小，适合直接分享。
- 采样率：48000Hz 为 CD 音质，44100Hz 为标准音质，22050Hz 对语音足够。
- 降噪强度（0~100，默认 20）：后处理降噪。如果参考音频有背景噪声，可适当提高；如果声音变得不自然，则降低。

第 4 步：生成语音
点击「生成语音」按钮。生成时间取决于文本长度和设备性能：
- GPU 上 10 秒文本约需 5~15 秒
- CPU 上 10 秒文本约需 30~60 秒
生成过程中可随时点击「中止任务」取消。

第 5 步：处理结果
生成完成后，结果区域会显示音频播放器。您可以：
- 点击播放按钮试听
- 点击「下载结果」保存到本地
- 点击「复制结果」复制到剪贴板（部分浏览器支持）
- 点击「打开文件」在新标签页中打开
- 点击「重做」使用相同参数重新生成
- 点击「复制 JSON」复制当前配置
- 点击「下载 JSON」保存配置文件以便后续复用

【TTS 技术原理】
IndexTTS 是基于 XTTS 和 Tortoise 的 GPT 风格文本转语音模型。支持中文拼音纠正和通过标点符号控制停顿。模型采用 conformer 条件编码器和基于 BigVGAN2 的 speechcode 解码器，输出高质量音频。

【参数速查表】
| 参数 | 范围 | 默认值 | 说明 |
|---|---|---|---|
| Temperature | 0~1 | 0.8 | 随机性控制 |
| Top P | 0~1 | 0.92 | 核采样 |
| Top K | 1~128 | 48 | Top-k 采样 |
| 语速 | 0.5~2.0 | 1.0 | 播放速度 |
| CFG | 1~14 | 6.8 | 引导强度 |
| 情感强度 | 0~2.0 | 1.0 | 情感强度 |
| Seed | 整数 | 240315 | 随机种子 |
| 降噪强度 | 0~100 | 20 | 降噪强度 |

【输出格式】
- WAV：未压缩，最高音质，适合后期编辑
- MP3：有损压缩，文件更小，适合直接分享
- 典型文件大小：100KB ~ 5MB（取决于时长和格式）
- 推荐采样率：48000 Hz 获得最佳音质

【常见问题】
Q: 为什么克隆的声音和原声有差距？
A: 参考音频的质量直接影响克隆效果。请确保音频清晰、无噪声、只有单人说话。同时调整 Temperature 和 CFG 可以优化相似度。

Q: 生成速度很慢怎么办？
A: 切换到 GPU 推理模式。如果没有 NVIDIA 显卡，可以尝试缩短文本长度或降低采样率。

Q: 生成的语音有杂音？
A: 提高「降噪强度」参数（建议 30~50），或更换更干净的参考音频。

Q: 情感描述不生效？
A: 确保使用 index-tts-2 模型，并适当提高「情感强度」参数。某些情感描述可能需要更具体的表达。

Q: 如何复现之前生成的结果？
A: 记录生成时使用的 Seed 值，在后续生成中使用相同的 Seed 和参数即可复现。

Q: 支持哪些语言的文本？
A: 主要支持中文和英文，其他语言的效果可能因模型训练数据而异。`,
      buttons: [
        { name: '生成语音', description: '启动 TTS 生成工作流。验证输入文本和参数后向后端发送请求。' },
        { name: '中止任务', description: '取消正在进行的 TTS 生成任务。' },
        { name: '复制 JSON', description: '将当前参数配置以 JSON 格式复制到剪贴板。' },
        { name: '下载 JSON', description: '将当前参数配置以 JSON 文件形式下载。' },
        { name: '复制结果', description: '生成成功后，将音频复制到剪贴板（浏览器支持时）。' },
        { name: '下载结果', description: '将生成的音频下载到本地。' },
        { name: '打开文件', description: '在新标签页中打开生成的音频。' },
        { name: '重做', description: '使用相同参数重新生成语音。' },
        { name: '显示/隐藏详情', description: '展开或折叠参数面板和调试信息面板。' },
        { name: '刷新', description: '将所有参数重置为默认值，清空文本和结果。' },
      ],
      parameters: [
        { name: '模型', description: '选择 TTS 模型版本。', tips: 'index-tts-1.5 是稳定版；index-tts-2 具有高级情感控制功能。' },
        { name: 'Temperature', description: '采样温度，控制随机性。范围 0~1，默认 0.8。', tips: '越低越稳定/可预测；越高越有创意但可能偏离。' },
        { name: 'Top P', description: '核采样阈值。范围 0~1，默认 0.92。', tips: '越低多样性越低，一致性越高。' },
        { name: 'Top K', description: 'Top-K 采样。范围 1~128，默认 48。', tips: '越低生成越保守。' },
        { name: '语速', description: '播放速度倍数。范围 0.5~2.0，默认 1.0。', tips: '1.0 是正常速度；0.5 是半速；2.0 是双倍速。' },
        { name: 'CFG', description: '无分类器引导尺度。范围 1~14，默认 6.8。', tips: '越高越遵循提示。7~10 是安全区间。' },
        { name: '情感强度', description: '情感表达强度。范围 0.0~2.0，默认 1.0。', tips: '0.0 = 中性；1.0 = 平衡；2.0 = 非常富有表现力。' },
        { name: '情感描述', description: '使用自然语言的软情感指令。', tips: '例如：「愤怒的 shouting」、「温柔低语」、「开心兴奋」。' },
        { name: 'Seed', description: '随机种子，默认 240315。固定种子可实现可复现结果。', tips: '记录喜欢结果的种子以便复现。' },
        { name: '推理设备', description: '推理设备：GPU（快速）或 CPU（备用）。', tips: '推荐使用 GPU 加速生成；CPU 可在任何机器上运行。' },
        { name: '输出格式', description: '输出音频格式：WAV 或 MP3。', tips: 'WAV 音质最佳；MP3 更小更便携。' },
        { name: '采样率', description: '输出采样率（Hz）。', tips: '48000 Hz 是 CD 音质；44100 Hz 是标准；22050 Hz 对语音可接受。' },
        { name: '降噪强度', description: '后处理降噪强度。范围 0~100，默认 20。', tips: '越高去除越多背景噪声，但可能影响音质。' },
      ],
            errors: [
        {
          code: 'API_KEY_MISSING',
          message: '点击「生成语音」后立刻报错，错误面板显示 API Key 相关错误',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：IndexTTS 语音合成 → 区域：左栏底部错误面板',
          cause: '未在「设置 → API」中配置 API Key，或 Key 被清空。IndexTTS 生成需要有效的 API Key 才能调用后端语音合成服务。',
          solution: '在设置面板中配置有效的 API Key。',
          steps: ['点击右上角「打开设置」或按对应快捷键', '切换到「API」标签页', '在「API Key」输入框中填入你的有效 Key', '点击「保存」后关闭设置面板', '返回 IndexTTS 页面重新点击「生成语音」'],
          relatedCodes: ['API_KEY_EXPIRED', 'INDEX_TTS_NOT_CONFIGURED'],
          prevention: '首次使用任何联网工具前，务必先在「设置 → API」中配置有效的 API Key。',
        },
        {
          code: 'API_KEY_EXPIRED',
          message: '生成请求返回 401 或提示 Key 无效',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：IndexTTS 语音合成 → 区域：左栏底部错误面板',
          cause: '配置的 API Key 已过期、被吊销、或额度已用完。',
          solution: '更换有效的 API Key。',
          steps: ['打开「设置 → API」面板', '删除当前 Key，填入新的有效 Key', '如果不确定 Key 是否有效，可在 LLM Hub 的实时测试面板中先测试', '保存后返回 IndexTTS 重试'],
          relatedCodes: ['API_KEY_MISSING', '401_UNAUTHORIZED'],
          prevention: '定期检查 API Key 的有效期和剩余额度；在 LLM Hub 中通过实时测试快速验证 Key 是否有效。',
        },
        {
          code: 'API_TIMEOUT',
          message: '请求长时间无响应，最终提示超时',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：IndexTTS 语音合成 → 区域：左栏底部错误面板 / 进度条',
          cause: '后端生成耗时过长，超过了前端设置的超时时间。TTS 生成对 GPU 性能要求较高，长文本或高采样率时更耗时。',
          solution: '缩短文本长度、降低采样率或检查网络连接。',
          steps: ['缩短输入文本长度（建议控制在 200 字以内）', '降低采样率（如从 48000Hz 降至 22050Hz）', '检查网络连接是否稳定', '如果使用 CPU 推理，考虑切换到 GPU 模式', '重试生成'],
          relatedCodes: ['NETWORK_TIMEOUT', 'BACKEND_UNAVAILABLE', 'INDEX_TTS_GPU_OUT_OF_MEMORY'],
          prevention: '长文本生成耗时更长；提前缩短文本长度；网络不稳定时增加超时设置。',
        },
        {
          code: 'BACKEND_UNAVAILABLE',
          message: '提示「后端不可用」或「无法连接到服务器」',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：IndexTTS 语音合成 → 区域：左栏底部错误面板',
          cause: '后端服务器未启动、崩溃、或前端配置的 API Base URL 不正确。',
          solution: '检查后端服务状态和 API 配置。',
          steps: ['打开浏览器开发者工具 → Network 标签页', '重新点击「生成语音」，观察请求是否发出以及响应状态码', '如果请求未发出，检查「设置 → API → API Base URL」是否正确', '如果请求返回 502/503，联系后端管理员确认服务状态', '如果是本地部署，确认后端进程是否在运行（npm start）'],
          relatedCodes: ['NETWORK_DISCONNECTED', '502_BAD_GATEWAY', '503_SERVICE_UNAVAILABLE'],
          prevention: '本地部署时确保后端进程已启动（npm start）；使用远程服务时确认 URL 配置正确。',
        },
        {
          code: 'NETWORK_DISCONNECTED',
          message: '提示网络断开或无法访问互联网',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：IndexTTS 语音合成 → 区域：左栏底部错误面板',
          cause: '设备未连接网络、Wi-Fi 断开、或防火墙阻止了请求。',
          solution: '恢复网络连接。',
          steps: ['检查设备的网络连接状态', '尝试访问其他网站确认网络是否正常', '如果使用代理/VPN，检查代理设置是否正确', '如果是公司/校园网络，确认是否限制了 API 访问'],
          relatedCodes: ['BACKEND_UNAVAILABLE', 'API_TIMEOUT'],
          prevention: '使用联网工具前确认网络连接正常；避免在网络波动大的环境下进行长时间工作流。',
        },
        {
          code: 'AUDIO_FORMAT_UNSUPPORTED',
          message: '上传时提示「不支持的音频格式」',
          severity: 'warning',
          category: 'C. 文件与输入',
          location: '页面：IndexTTS 语音合成 → 区域：参考音频上传区',
          cause: '选择了 FLAC、OGG、AAC、WMA 或其他不支持的格式。IndexTTS 仅支持 WAV 和 MP3 格式的参考音频。',
          solution: '将音频转换为 WAV 或 MP3 格式。',
          steps: ['使用音频转换工具将文件转为 WAV 或 MP3', '或使用系统自带的音频编辑工具导出为 WAV/MP3', '确保采样率为 22050Hz 或以上', '重新在 IndexTTS 页面上传转换后的文件'],
          relatedCodes: ['AUDIO_TOO_SHORT', 'AUDIO_TOO_LONG'],
          prevention: '确认文件格式是 WAV 或 MP3 后再上传。',
        },
        {
          code: 'AUDIO_TOO_SHORT',
          message: '提示「参考音频太短」',
          severity: 'warning',
          category: 'C. 文件与输入',
          location: '页面：IndexTTS 语音合成 → 区域：参考音频上传区',
          cause: '参考音频时长不足 3 秒。零样本音色克隆需要至少 3 秒的音频才能提取有效的音色特征。',
          solution: '上传更长的参考音频。',
          steps: ['录制或截取一段 5~10 秒的音频', '确保音频中只有一个说话人', '重新上传音频文件'],
          relatedCodes: ['AUDIO_TOO_LONG', 'AUDIO_FORMAT_UNSUPPORTED'],
          prevention: '准备 5~10 秒的参考音频，确保内容清晰完整。',
        },
        {
          code: 'AUDIO_TOO_LONG',
          message: '提示「参考音频太长」或处理超时',
          severity: 'warning',
          category: 'C. 文件与输入',
          location: '页面：IndexTTS 语音合成 → 区域：参考音频上传区',
          cause: '参考音频时长超过 10 秒。过长的参考音频会增加处理时间和后端负载，且对克隆效果的提升有限。',
          solution: '截取音频至 3~10 秒。',
          steps: ['使用音频编辑工具截取音频的中间 5~7 秒', '确保截取部分包含清晰的说话声', '保存为 WAV 或 MP3 后重新上传'],
          relatedCodes: ['AUDIO_TOO_SHORT', 'AUDIO_FORMAT_UNSUPPORTED'],
          prevention: '准备 5~10 秒的参考音频；过长的音频对克隆效果提升有限，反而增加处理时间。',
        },
        {
          code: 'MODEL_NOT_FOUND',
          message: '错误面板显示「模型不可用」或 404',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：IndexTTS 语音合成 → 区域：左栏底部错误面板',
          cause: '选择的模型在后端不存在、已被下架、或当前 API Key 无权访问该模型。',
          solution: '切换到其他可用模型。',
          steps: ['在「模型」下拉框中选择其他模型（如 index-tts-1.5）', '确认模型名称拼写正确', '在「设置 → API」中确认当前 Key 支持所选模型', '重试生成'],
          relatedCodes: ['INDEX_TTS_NOT_CONFIGURED', 'API_KEY_EXPIRED'],
          prevention: '从下拉列表选择已知可用的模型；使用自定义 API 时查阅服务商文档确认模型列表。',
        },
        {
          code: 'INDEX_TTS_TEXT_MISSING',
          message: '点击「生成语音」后立刻报错，提示未输入文本',
          severity: 'warning',
          category: 'C. 文件与输入',
          location: '页面：IndexTTS 语音合成 → 区域：左栏底部错误面板',
          cause: '文本输入框为空。IndexTTS 需要有效的文本输入才能生成语音。',
          solution: '在文本输入框中输入要合成的内容。',
          steps: ['点击文本输入区域', '输入或粘贴要合成的文本', '确认文本不为空', '点击「生成语音」'],
          relatedCodes: ['INDEX_TTS_TEXT_TOO_LONG', 'INDEX_TTS_REQUEST_FAILED'],
          prevention: '生成前始终确认文本输入包含有效内容。',
        },
        {
          code: 'INDEX_TTS_TEXT_TOO_LONG',
          message: '提示「文本过长」或生成超时',
          severity: 'warning',
          category: 'C. 文件与输入',
          location: '页面：IndexTTS 语音合成 → 区域：文本输入框 / 左栏底部错误面板',
          cause: '输入文本过长（超过 500 字），超过了后端模型的最大处理限制。',
          solution: '缩短输入文本。',
          steps: ['将长文本拆分为多段，每段不超过 200 字', '删除冗余描述和重复内容', '分段生成后使用音频编辑工具合并', '重试'],
          relatedCodes: ['INDEX_TTS_TEXT_MISSING', 'API_TIMEOUT'],
          prevention: '单段文本控制在 500 字以内；长内容建议分段生成。',
        },
        {
          code: 'INDEX_TTS_TEXT_BLOCKED',
          message: '请求被拦截，提示「内容策略违规」或「sensitive words」',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：IndexTTS 语音合成 → 区域：左栏底部错误面板',
          cause: '输入文本中包含了后端服务商的安全过滤器拦截的词汇。',
          solution: '修改文本，移除或替换可能触发过滤器的词汇。',
          steps: ['查看错误详情中的具体提示信息，找出被拦截的关键词', '将敏感词汇用同义词替换或删除', '先用简单的测试文本确认服务正常', '逐步添加内容，找出具体触发拦截的词汇'],
          relatedCodes: ['403_FORBIDDEN'],
          prevention: '避免在文本中使用敏感词汇；先用默认文本测试通过后再自定义。',
        },
        {
          code: 'INDEX_TTS_REQUEST_FAILED',
          message: '错误面板上显示「INDEX_TTS_REQUEST_FAILED」',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：IndexTTS 语音合成 → 区域：左栏底部错误面板',
          cause: '后端 API 请求失败。可能是网络中断、API Key 无效、模型不可用、GPU 显存不足、文本过长、或服务器内部错误。',
          solution: '根据错误详情中的具体信息排查。',
          steps: ['展开错误面板查看详细错误信息（HTTP 状态码、后端返回的消息）', '如果是 401：检查 API Key 是否有效', '如果是 404：检查模型是否可用', '如果是 429：等待一段时间后重试', '如果是 500/502/503：检查后端服务状态', '如果是 GPU 错误：降低文本长度或采样率', '如果是网络错误：检查网络连接'],
          relatedCodes: ['API_KEY_MISSING', 'API_KEY_EXPIRED', 'MODEL_NOT_FOUND', 'BACKEND_UNAVAILABLE', 'INDEX_TTS_GPU_OUT_OF_MEMORY'],
          prevention: '开始生成前确认 API Key 有效、网络连接正常、模型可用；首次生成建议先用短文本测试。',
        },
        {
          code: 'INDEX_TTS_NOT_CONFIGURED',
          message: 'IndexTTS 后端未配置',
          severity: 'error',
          category: 'E. 配置与数据',
          location: '服务器 → /api/index-tts',
          cause: '后端没有配置 IndexTTS 提供商。后端路由返回了明确的未配置错误。',
          solution: '在后端配置 IndexTTS 提供商。',
          steps: ['检查后端 .env 文件是否包含 IndexTTS 相关配置', '配置 IndexTTS API 密钥（如 SiliconFlow）', '将提供商配置添加到后端 .env', '重启后端服务器', '返回前端重试'],
          relatedCodes: ['INDEX_TTS_REQUEST_FAILED', 'BACKEND_UNAVAILABLE'],
          prevention: '部署后端时配置好 IndexTTS 提供商；使用前确认后端已正确配置。',
        },
        {
          code: 'INDEX_TTS_GPU_OUT_OF_MEMORY',
          message: '后端返回 GPU 显存不足错误',
          severity: 'error',
          category: 'F. 系统与权限',
          location: '服务器 → GPU 推理进程',
          cause: 'GPU 显存不足以加载模型或处理当前请求。长文本、高采样率、大尺寸模型会占用更多显存。',
          solution: '缩短文本、降低采样率、切换到 CPU 模式，或升级 GPU。',
          steps: ['缩短输入文本长度', '降低采样率（如 48000Hz → 22050Hz）', '切换到 CPU 推理模式', '关闭其他占用显存的程序', '如果问题持续，联系后端管理员升级 GPU 显存'],
          relatedCodes: ['500_INTERNAL_ERROR', 'API_TIMEOUT'],
          prevention: '长文本和高采样率消耗更多显存；建议文本控制在 200 字以内，使用 22050Hz 采样率。',
        },
        {
          code: '429_TOO_MANY_REQUESTS',
          message: '提示请求过于频繁（Rate Limit）',
          severity: 'warning',
          category: 'A. API 与网络',
          location: '页面：IndexTTS 语音合成 → 区域：左栏底部错误面板',
          cause: '短时间内发送了过多请求，超过了服务商的速率限制。',
          solution: '等待一段时间后重试。',
          steps: ['查看错误详情中的 Retry-After 提示（如果有）', '等待 60~120 秒后重试', '如果频繁遇到此问题，缩短文本长度', '考虑升级 API 套餐以获得更高的速率限制'],
          relatedCodes: ['API_RATE_LIMIT', 'INDEX_TTS_REQUEST_FAILED'],
          prevention: '适当降低请求频率；避免在短时间内多次重试。',
        },
        {
          code: '500_INTERNAL_ERROR',
          message: '后端返回 500 内部服务器错误',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：IndexTTS 语音合成 → 区域：左栏底部错误面板',
          cause: '后端服务在处理请求时发生内部异常。可能是模型加载失败、GPU 内存不足、或代码 Bug。',
          solution: '稍后重试或联系后端管理员。',
          steps: ['等待 1~2 分钟后重试', '缩短文本长度、降低采样率，减少后端负载', '切换到 CPU 推理模式', '如果问题持续，联系后端管理员查看服务器日志'],
          relatedCodes: ['502_BAD_GATEWAY', '503_SERVICE_UNAVAILABLE', 'INDEX_TTS_GPU_OUT_OF_MEMORY'],
          prevention: '降低请求规模（文本长度、采样率等）；避免在服务器高负载时提交大任务。',
        },
        {
          code: '502_BAD_GATEWAY',
          message: '后端返回 502 Bad Gateway',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：IndexTTS 语音合成 → 区域：左栏底部错误面板',
          cause: '反向代理（如 Nginx）无法连接到后端应用服务器。可能是后端进程崩溃或未启动。',
          solution: '检查后端服务状态。',
          steps: ['如果是本地部署，确认后端进程是否在运行', '检查后端服务端口是否被占用', '查看后端日志确认是否有启动错误', '重启后端服务后重试'],
          relatedCodes: ['503_SERVICE_UNAVAILABLE', 'BACKEND_UNAVAILABLE'],
          prevention: '本地部署时确认后端进程在运行；检查反向代理配置。',
        },
        {
          code: '503_SERVICE_UNAVAILABLE',
          message: '后端返回 503 Service Unavailable',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：IndexTTS 语音合成 → 区域：左栏底部错误面板',
          cause: '后端服务暂时不可用，可能正在进行维护、重启、或过载保护。',
          solution: '稍后重试。',
          steps: ['等待 2~3 分钟后重试', '检查后端服务状态页面（如果有）', '联系后端管理员确认是否在维护'],
          relatedCodes: ['502_BAD_GATEWAY', 'BACKEND_UNAVAILABLE'],
          prevention: '避开服务器维护时段操作；高负载时降低请求频率。',
        },
        {
          code: 'IMPORT_INVALID_JSON',
          message: '导入配置时提示「无效的 JSON 格式」',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：IndexTTS 语音合成 → 区域：顶部「导入配置」按钮',
          cause: '文件内容损坏、不是 JSON 格式、或被其他程序修改过。',
          solution: '检查文件是否为有效的 UTF-8 编码文本文件。',
          steps: ['用文本编辑器打开文件查看是否有乱码', '确认文件顶部包含 "tool": "index-tts"', '尝试用 JSON 在线格式化工具验证'],
          relatedCodes: ['IMPORT_TOOL_MISMATCH'],
          prevention: '妥善保存导出的配置文件，避免用非文本编辑器修改。',
        },
        {
          code: 'IMPORT_TOOL_MISMATCH',
          message: '导入配置时提示「工具类型不匹配」',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：IndexTTS 语音合成 → 区域：顶部「导入配置」按钮',
          cause: '导入的 JSON 文件中 tool 字段不是 index-tts。',
          solution: '确认导入的是 IndexTTS 页面导出的配置文件。',
          steps: ['用文本编辑器打开文件', '确认 tool 字段值为 "index-tts"', '如果不是，找到正确的配置文件或从对应工具页面导入'],
          relatedCodes: ['IMPORT_INVALID_JSON'],
          prevention: '不同工具的配置文件不通用；从对应工具页面导出和导入配置。',
        },
      ],
    },
    {
      id: 'prompt-suite',
      title: '角色设卡 / 世界观编辑',
      overview: `PromptSuite 是一个富文本编辑器，用于整理角色设定卡（Character Sheet）、世界观设定（World Bible）、关系图谱（Relationship Map）和语言风格档案（Speech Profile）。支持字体、颜色、高亮、标题、列表、表格、代码块、引用框、图片插入等丰富排版功能。所有内容自动保存到本地浏览器。


【角色设卡系统】
角色设卡是 OC Maker 的核心功能之一，允许创作者以结构化方式记录角色信息。设卡包含以下模块：

基本信息模块：
- 角色名、别名、代号
- 年龄、生日、星座、血型
- 身高、体重、三围（可选）
- 种族、国籍、母语
- 职业、身份、社会阶层

外貌特征模块：
- 发型、发色、瞳色、肤色
- 体型、姿态、标志性特征（痣、疤痕、纹身等）
- 常服、战斗服、礼服等多套服装设定
- 配饰、武器、道具

性格心理模块：
- MBTI 类型、九型人格
- 性格关键词（最多 10 个标签）
- 优点、缺点、心理阴影
- 价值观、信仰、动机
- 恐惧、喜好、厌恶

背景故事模块：
- 出身家庭、成长环境
- 关键人生事件（时间线）
- 人际关系网络（亲属、朋友、敌人、恋人）
- 所属组织、阵营、立场
- 目标与梦想

能力设定模块：
- 战斗能力、特殊技能、魔法体系
- 能力来源、限制条件、副作用
- 属性面板（力量/敏捷/智力/体质等 RPG 属性）
- 技能树、进阶路线

【世界观编辑】
世界观编辑器支持多层级结构：
- 世界（World）：最高层级，如「艾欧泽亚大陆」「赛博朋克 2077」
- 地区（Region）：大陆内的国家、城市、地形
- 势力（Faction）：国家、组织、帮派、宗教
- 种族（Race）：人类、精灵、兽人、机械生命等
- 历史（History）：大事记、年代记、历法系统
- 规则（Rule）：物理法则、魔法体系、社会制度

【模板系统】
内置 20+ 专业模板：
- 基础角色卡（适合新手）
- 详细角色卡（包含所有模块）
- 轻小说角色卡（侧重萌属性和人际关系）
- TRPG 角色卡（含属性数值和技能）
- 游戏角色设计文档（含美术需求和动作描述）
- 动画角色设定（含表情指定和色指定）
- 世界观设定书（完整的世界构建文档）

模板支持变量替换，如 {{角色名}}、{{年龄}} 等，一键填充所有占位符。

【导出格式】
- Markdown：适合发布到论坛、博客
- JSON：结构化数据，可供程序读取
- PDF：精美的排版，适合打印和分享
- HTML：富文本格式，支持图片嵌入
- BBCode：适合 Discuz!、NGA 等论坛
- 纯文本：最通用的格式

【协作与版本】
- 支持多人协作编辑（需开启云端同步）
- 自动保存历史版本，可回溯到任意时间点
- 差异对比功能，高亮显示修改内容
- 评论和批注系统，方便团队沟通`,
      buttons: [
        { name: '保存文档', description: '将当前编辑器中的 HTML 内容和工具栏状态保存到本地存储。' },
        { name: '重刷', description: '清空当前文档，恢复为默认模板。操作前会弹出二次确认。' },
        { name: '导入配置', description: '导入之前导出的 PromptSuite JSON 配置文件，恢复文档内容和工具栏状态。' },
        { name: '导出 HTML', description: '将当前文档导出为独立的 HTML 文件，包含内联样式，可直接在浏览器中打开查看。' },
        { name: '导出封装包', description: '将文档内容、LLM 配置和 TTS 配置打包导出为一个 JSON 文件，便于跨设备迁移。' },
        { name: '复制文本', description: '将当前文档的纯文本内容复制到剪贴板。' },
        { name: '展开详情 / 收起详情', description: '展开或折叠各工具栏分组（字体、样式、段落、插入、历史）。' },
        { name: '自定义字体', description: '打开弹窗输入系统中已安装的字体名称，应用到编辑器。' },
      
        { name: '新建角色', description: '创建一个新的空白角色卡，可选择从模板开始或完全自定义。' },
        { name: '复制角色', description: '复制当前角色卡的所有内容，生成一个可独立编辑的副本。' },
        { name: '删除角色', description: '永久删除当前角色卡。删除前会要求二次确认，且已导出的文件不受影响。' },
        { name: '导入角色', description: '从 JSON、Markdown 或 CSV 文件导入角色数据，支持批量导入。' },
        { name: '模板市场', description: '浏览和下载社区分享的自定义模板，也可上传自己的模板。' },
        { name: '关系图谱', description: '可视化显示当前世界观中所有角色之间的关系网络（亲属、朋友、敌人、恋人等）。' },
        { name: '时间线', description: '为角色或世界观创建大事记时间线，支持添加事件、日期、描述和相关角色。' },
        { name: '对比模式', description: '选择两个角色卡并排对比，高亮显示差异项，方便检查设定冲突。' },],
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
      
        { name: '标签数量限制', description: '自动标签生成时保留的最大标签数，范围 5~50。标签越多描述越详细，但也可能引入噪声。', tips: '角色训练建议 20-30，风格训练建议 10-15。' },
        { name: '标签置信度阈值', description: '自动标签的最低置信度，范围 0~100。低于阈值的标签会被过滤。', tips: '建议 30-50，过高的阈值会丢失有用标签。' },
        { name: '世界观层级深度', description: '控制世界观编辑器的层级展开深度，范围 1~5。深层级适合复杂设定，浅层级适合快速浏览。', tips: '初学者建议 2-3，资深创作者建议 4-5。' },
        { name: '自动保存间隔', description: '自动保存草稿的时间间隔（分钟），范围 1~30。设为 0 则关闭自动保存。', tips: '建议 3-5 分钟，过短可能卡顿，过长可能丢失进度。' },
        { name: '导出图片质量', description: '导出含图片的文档时的图片压缩质量，范围 60~100。高值质量好但文件大。', tips: '网络分享建议 80-85，打印建议 95-100。' },
        { name: '协作光标显示', description: '多人协作时是否显示其他用户的光标位置和用户名，可选开启/关闭。', tips: '大型团队协作建议开启，个人使用建议关闭以减少干扰。' },
        { name: '差异高亮模式', description: '版本对比时高亮差异的方式：行级（整行高亮）或词级（仅差异词汇高亮）。', tips: '大幅修改建议行级，微调建议词级。' },
        { name: '模板严格模式', description: '启用后，模板中的必填项未填写时无法导出或分享。', tips: '正式项目建议开启，草稿阶段建议关闭。' },
        { name: '角色关系最大连接数', description: '单个角色可建立的关系连接上限，范围 5~50。防止关系图谱过于复杂。', tips: '轻小说角色建议 10-15，TRPG 角色建议 20-30。' },],
      errors: [
        {
          code: 'CONFIG_CORRUPTED',
          message: '打开编辑器后内容空白或格式错乱',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：角色设卡 / 世界观编辑 → 区域：中央编辑器区域',
          cause: '浏览器 localStorage 中保存的 PromptSuite 配置数据损坏。',
          solution: '重刷编辑器或手动清理 localStorage。',
          steps: [
            '点击「重刷」按钮',
            '确认弹窗中点击「确认重刷」',
            '如果仍然异常，按 Ctrl+Shift+I → Application → Local Storage → 删除 prompt-suite 相关键',
            '刷新页面',
          ],
          relatedCodes: ['IMPORT_INVALID_JSON', 'STORAGE_READ_ONLY'],
          prevention: '不要手动修改 localStorage 中的数据；跨版本更新后如有异常，建议重置配置。',
        },
        {
          code: 'CURSOR_JUMP',
          message: '编辑时光标位置乱跳',
          severity: 'warning',
          category: 'F. 系统与权限',
          location: '页面：角色设卡 / 世界观编辑 → 区域：中央编辑器区域',
          cause: '早期版本中使用 dangerouslySetInnerHTML 实时重渲染导致 DOM 与 React 状态不同步。当前版本已修复。',
          solution: '刷新页面恢复自动保存内容。',
          steps: [
            '按 Ctrl+S 手动保存当前内容',
            '刷新页面（F5 或 Ctrl+R）',
            '页面加载后会自动恢复最近保存的内容',
          ],
        },
        {
          code: 'EXPORT_FAILED',
          message: '点击「导出 HTML」或「导出封装包」无反应',
          severity: 'error',
          category: 'F. 系统与权限',
          location: '页面：角色设卡 / 世界观编辑 → 区域：顶部导出按钮',
          cause: '浏览器阻止了下载弹窗，或文档内容过大导致 Blob 生成失败。',
          solution: '检查浏览器下载设置或分批导出。',
          steps: [
            '检查浏览器是否阻止了弹窗（地址栏右侧是否有弹窗拦截提示）',
            '允许当前网站的弹窗',
            '如果文档包含大量图片，尝试先移除部分图片再导出',
            '使用「复制文本」功能作为临时替代方案',
          ],
          relatedCodes: ['DEVICE_MEMORY_LOW'],
          prevention: '允许浏览器弹窗；文档过大时先移除部分图片再导出。',
        },
        {
          code: 'IMPORT_INVALID_JSON',
          message: '导入配置时提示「无效的 JSON 格式」',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：角色设卡 / 世界观编辑 → 区域：顶部「导入配置」按钮',
          cause: '文件内容损坏或格式不正确。',
          solution: '检查文件有效性。',
          steps: [
            '用文本编辑器打开文件',
            '确认文件顶部包含 "tool": "prompt-suite"',
            '用 JSON 在线格式化工具验证',
          ],
          relatedCodes: ['IMPORT_TOOL_MISMATCH'],
        },
        {
          code: 'IMPORT_TOOL_MISMATCH',
          message: '导入配置时提示「工具类型不匹配」',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：角色设卡 / 世界观编辑 → 区域：顶部「导入配置」按钮',
          cause: '导入的 JSON 文件中 tool 字段不是 prompt-suite。',
          solution: '确认导入的是 PromptSuite 导出的配置文件。',
          steps: [
            '用文本编辑器打开文件',
            '确认 tool 字段值为 "prompt-suite"',
            '找到正确的文件后重新导入',
          ],
          relatedCodes: ['IMPORT_INVALID_JSON'],
        },
        {
          code: 'PASTE_FORMAT_LOSS',
          message: '从外部复制粘贴后格式丢失',
          severity: 'info',
          category: 'C. 文件与输入',
          location: '页面：角色设卡 / 世界观编辑 → 区域：中央编辑器区域',
          cause: '富文本编辑器对外部 HTML 的粘贴处理会过滤不安全的标签和样式，这是安全设计。',
          solution: '在编辑器内手动重建格式。',
          steps: [
            '粘贴纯文本内容',
            '使用编辑器的格式工具（加粗、颜色、标题等）重新应用格式',
            '对于表格，使用编辑器内置的表格插入工具重建',
          ],
        },
        {
          code: 'STORAGE_READ_ONLY',
          message: '保存无反应，刷新后内容丢失',
          severity: 'critical',
          category: 'B. 配置与数据',
          location: '页面：角色设卡 / 世界观编辑 → 区域：顶部「保存文档」按钮',
          cause: '浏览器处于隐私/无痕模式，或 localStorage 被禁用。',
          solution: '退出隐私模式，或使用导出功能备份。',
          steps: [
            '确认不在无痕浏览模式',
            '点击「导出 HTML」将内容保存到本地文件',
            '在普通窗口中重新打开应用',
            '导入之前导出的文件',
          ],
          relatedCodes: ['LOCAL_STORAGE_FULL'],
          prevention: '避免在浏览器无痕/隐私模式中使用本应用；定期导出配置到本地文件作为备份。',
        },
        {
          code: 'LOCAL_STORAGE_FULL',
          message: '保存失败，提示存储空间不足',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：角色设卡 / 世界观编辑 → 区域：顶部「保存文档」按钮',
          cause: 'localStorage 已满。富文本文档可能很大，尤其是包含大量 HTML 标记时。',
          solution: '清理存储空间或导出到本地文件。',
          steps: [
            '先点击「导出 HTML」备份当前内容',
            '打开开发者工具 → Application → Local Storage',
            '删除其他工具不再需要的历史数据',
            '返回编辑器重新保存',
          ],
          relatedCodes: ['STORAGE_READ_ONLY', 'EXPORT_FAILED'],
          prevention: '定期清理浏览器 localStorage 中不再需要的数据；大文件不要直接保存在编辑器中，改用导出功能。',
        },
        {
          code: 'UNSAVED_WARNING',
          message: '返回首页时提示有未保存的修改',
          severity: 'info',
          category: 'B. 配置与数据',
          location: '页面：角色设卡 / 世界观编辑 → 区域：左上角「返回首页」按钮',
          cause: '当前文档与上次保存的快照不一致。',
          solution: '保存后再返回，或确认放弃修改。',
          steps: [
            '点击「保存文档」',
            '或点击「确认返回」放弃未保存的修改',
          ],
        },
      ],
    },
    {
      id: 'llm-hub',
      title: 'LLM 文本接入',
      overview: `LLM Hub 是大语言模型参数配置与实时测试工具。你可以在这里调整模型选择、采样参数、系统提示词等，然后通过实时测试面板与 AI 进行多轮对话，验证 Prompt 效果。支持保存多套配置预设，方便在不同创作场景间快速切换。内置模式走后端 /api/chat 代理，自定义模式直接调用你配置的外部 OpenAI 兼容 API。


【支持的模型与提供商】
LLM Hub 目前支持以下主流大语言模型：

OpenAI 系列：
- GPT-4o：最新旗舰模型，多模态能力强，适合复杂推理
- GPT-4o-mini：轻量级版本，速度快、成本低
- GPT-4-turbo：上下文 128K，适合长文档处理
- GPT-3.5-turbo：经济实惠，适合日常对话

Google 系列：
- Gemini 1.5 Pro：超长上下文（2M tokens），适合视频和代码分析
- Gemini 1.5 Flash：快速响应，适合实时应用

Anthropic 系列：
- Claude 3.5 Sonnet：写作和创意能力强，性格温和
- Claude 3 Opus：深度推理，适合学术和编程

本地模型（通过 Ollama / LM Studio）：
- Llama 3.1（8B/70B/405B）
- Mistral 7B / Mixtral 8x7B
- Qwen 2.5（7B/14B/72B）
- DeepSeek V2

【API 配置指南】
每个提供商需要单独配置 API Key：
1. 点击「添加提供商」，选择对应平台
2. 输入 API Key（从对应平台的开发者后台获取）
3. 可选：自定义 Base URL（用于代理或自建服务）
4. 可选：设置请求超时（默认 30 秒）
5. 测试连接确认可用

【上下文管理】
- 系统提示词（System Prompt）：定义 AI 的角色和行为准则
- 对话历史：自动维护最近 N 轮对话（可配置）
- 上下文窗口：显示当前 token 使用量 / 最大 token 数
- 长对话优化：当接近上下文上限时，可自动摘要早期对话

【流式响应】
启用流式输出后，AI 的回复会逐字显示，提升交互体验：
- 支持暂停/继续生成
- 支持中途停止（Stop）
- 生成速度实时显示（tokens/秒）
- 支持代码块的语法高亮实时渲染

【高级功能】
- 温度（Temperature）：0~2，控制随机性。低温度（0.1-0.3）适合 factual 回答；高温度（0.8-1.2）适合创意写作
- Top-p（Nucleus Sampling）：0~1，与 temperature 配合控制多样性
- 最大生成长度：限制单次回复的 token 数
- 频率惩罚（Frequency Penalty）：减少重复用词
- 存在惩罚（Presence Penalty）：鼓励引入新话题
- 函数调用（Function Calling）：让 AI 调用外部工具和 API

【使用场景示例】
1. 角色扮演：设定系统提示词为角色性格，进行沉浸式对话
2. 世界观完善：输入已有的设定，让 AI 补充细节和矛盾检查
3. 剧情创作：提供大纲，让 AI 生成具体章节
4. 代码辅助：解释代码、生成脚本、调试错误
5. 翻译润色：将粗糙的设定翻译成流畅的目标语言`,
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
      
        { name: '清空对话', description: '清空当前对话的所有历史消息，但保留系统提示词和模型配置。' },
        { name: '导出对话', description: '将当前对话导出为 Markdown、JSON 或纯文本文件。' },
        { name: '导入对话', description: '从文件导入对话历史，支持继续之前的对话。' },
        { name: '分享对话', description: '生成对话的只读分享链接，可选择是否包含系统提示词。' },
        { name: 'Token 统计', description: '显示当前对话的 token 使用详情：系统提示词、用户消息、AI 回复各占多少。' },
        { name: '预设提示词', description: '加载预设的系统提示词模板（角色扮演、代码助手、创意写作等）。' },
        { name: '多模型对比', description: '同时向多个模型发送相同的问题，并排显示不同模型的回答以便对比。' },
        { name: '语音输入', description: '启用麦克风语音输入，支持中文、英文、日文语音识别。' },
        { name: '代码解释器', description: '让 AI 在沙箱环境中执行 Python 代码，并返回执行结果。' },],
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
      
        { name: '系统提示词长度限制', description: '限制系统提示词的最大 token 数，范围 100~4000。防止过长的系统提示挤占对话空间。', tips: '一般角色扮演 500-1000，复杂设定 1500-2500。' },
        { name: '对话历史轮数', description: '保留的最近对话轮数，范围 1~50。轮数越多上下文越完整，但消耗更多 token。', tips: '简单问答 3-5 轮，角色扮演 10-20 轮，深度讨论 20-30 轮。' },
        { name: '重试次数', description: 'API 请求失败时的自动重试次数，范围 0~5。网络不稳定时可提高此值。', tips: '国内访问海外 API 建议 2-3 次，本地模型建议 0-1 次。' },
        { name: '流式延迟阈值', description: '流式输出时的最小字符延迟（毫秒），范围 0~100。增大可让显示更平滑，减小响应更快。', tips: '阅读舒适建议 20-40，追求速度建议 0-10。' },
        { name: '代码块自动折叠', description: '当回复中的代码块超过设定行数时自动折叠，范围 5~100。设为 0 则永不折叠。', tips: '建议 20-30 行，长代码更适合折叠后按需展开。' },
        { name: '对话自动命名', description: '根据对话内容自动生成对话标题，可选开启/关闭。关闭后标题为「新对话」+序号。', tips: '对话较多时建议开启，方便后续查找。' },
        { name: '多模型并行数', description: '多模型对比功能中同时请求的模型数量，范围 2~5。受限于 API 并发限制。', tips: '免费 API 建议 2，付费 API 建议 3-4。' },
        { name: '语音输入语言', description: '语音识别的目标语言：自动检测、中文、英文、日文。', tips: '混合语言对话建议选择自动检测。' },
        { name: '函数调用确认', description: '当 AI 请求调用外部工具时，是否需要用户确认后再执行，可选开启/关闭。', tips: '涉及敏感操作（发送邮件、修改数据）建议开启。' },],
      errors: [
        {
          code: 'API_KEY_MISSING',
          message: '发送消息后立刻报错，提示 API Key 未配置',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：LLM 文本接入 → 区域：实时测试面板输出区',
          cause: '未在「设置 → API」中配置 API Key。LLM Hub 需要有效的 Key 才能调用大语言模型。',
          solution: '在设置面板中配置 API Key。',
          steps: [
            '点击右上角「打开设置」',
            '切换到「API」标签',
            '填入有效的 API Key',
            '保存并关闭设置',
            '返回 LLM Hub 重新发送消息',
          ],
          relatedCodes: ['API_KEY_EXPIRED', '401_UNAUTHORIZED'],
          prevention: '首次使用任何联网工具前，务必先在「设置 → API」中配置有效的 API Key。',
        },
        {
          code: 'API_KEY_EXPIRED',
          message: '请求返回 401 或提示 Key 无效',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：LLM 文本接入 → 区域：实时测试面板输出区',
          cause: 'API Key 已过期、被吊销或额度用完。',
          solution: '更换有效 Key。',
          steps: [
            '打开「设置 → API」',
            '替换为新的有效 Key',
            '保存后重试',
          ],
          relatedCodes: ['API_KEY_MISSING'],
          prevention: '定期检查 API Key 的有效期和剩余额度；在 LLM Hub 中通过实时测试快速验证 Key 是否有效。',
        },
        {
          code: 'API_TIMEOUT',
          message: '发送消息后长时间无响应',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：LLM 文本接入 → 区域：实时测试面板输出区',
          cause: '请求超时。可能是 Max Tokens 设置过大、网络延迟高、或模型负载高。',
          solution: '降低 Max Tokens 或增加超时时间。',
          steps: [
            '在参数面板中降低「最大 Token 数」（建议 1024 以下测试）',
            '增加「超时」值（建议 60000~120000）',
            '检查网络连接',
            '重试',
          ],
          relatedCodes: ['NETWORK_DISCONNECTED', 'API_TIMEOUT'],
          prevention: '处理大尺寸图片或大量文本时，提前降低参数规模（图像尺寸、Max Tokens 等）；网络不稳定时增加超时设置。',
        },
        {
          code: 'BACKEND_UNAVAILABLE',
          message: '提示后端不可用',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：LLM 文本接入 → 区域：实时测试面板输出区',
          cause: '后端服务未启动或 API Base URL 配置错误。',
          solution: '检查后端状态和配置。',
          steps: [
            '打开 Network 开发者工具',
            '重新发送消息，观察请求状态',
            '如果无请求发出，检查「设置 → API → API Base URL」',
            '如果返回 502/503，确认后端服务是否运行',
          ],
          relatedCodes: ['NETWORK_DISCONNECTED'],
          prevention: '本地部署时确保后端进程已启动（npm start）；使用远程服务时确认 URL 配置正确。',
        },
        {
          code: 'LLM_MODEL_UNAVAILABLE',
          message: '提示模型不可用',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：LLM 文本接入 → 区域：实时测试面板输出区',
          cause: '选择的模型在后端不存在或当前 Key 无权访问。',
          solution: '切换其他模型。',
          steps: [
            '在「模型」下拉框中选择其他模型',
            '确认模型 ID 拼写正确',
            '确认当前 Key 支持所选模型',
            '重试',
          ],
          relatedCodes: ['MODEL_NOT_FOUND', '403_FORBIDDEN'],
          prevention: '从已知可用模型列表中选择；确认当前 Key 支持所选模型。',
        },
        {
          code: 'LLM_TEST_ERROR',
          message: '实时测试面板显示「LLM_TEST_ERROR」',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：LLM 文本接入 → 区域：实时测试面板输出区',
          cause: 'API 请求失败。可能是网络问题、API Key 无效或过期、模型不可用、或请求超时。',
          solution: '根据错误详情排查。',
          steps: [
            '查看错误面板中的详细错误信息',
            '检查网络连接',
            '确认 API Key 有效',
            '尝试切换模型',
            '增加超时时间或减少 Max Tokens',
          ],
          relatedCodes: ['API_KEY_MISSING', 'API_KEY_EXPIRED', 'LLM_MODEL_UNAVAILABLE'],
          prevention: '测试前确认 API Key 有效、网络连接正常、模型可用。',
        },
        {
          code: 'MODEL_NOT_FOUND',
          message: '后端返回 404，提示模型未找到',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：LLM 文本接入 → 区域：实时测试面板输出区',
          cause: '模型 ID 拼写错误或该模型已被下架。',
          solution: '更正模型 ID 或选择其他模型。',
          steps: [
            '检查「模型」输入框中的模型 ID 是否拼写正确',
            '从下拉列表中选择已知可用的模型',
            '如果使用自定义 API，查阅服务商文档确认模型列表',
            '重试',
          ],
          relatedCodes: ['LLM_MODEL_UNAVAILABLE'],
          prevention: '从下拉列表选择已知可用的模型；使用自定义 API 时查阅服务商文档确认模型列表。',
        },
        {
          code: 'PROMPT_BLOCKED',
          message: '内容被安全过滤器拦截',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：LLM 文本接入 → 区域：实时测试面板输出区',
          cause: '系统提示词或用户消息中包含被平台安全策略拦截的内容。',
          solution: '修改 Prompt 避免触发过滤器。',
          steps: [
            '查看错误详情中的提示信息',
            '修改系统提示词，移除可能触发过滤的描述',
            '简化测试消息，逐步排查触发词',
          ],
          relatedCodes: ['403_FORBIDDEN'],
          prevention: '修改 Prompt 覆盖时避免使用敏感词汇；先用默认 Prompt 测试通过后再自定义。',
        },
        {
          code: '429_TOO_MANY_REQUESTS',
          message: '请求过于频繁',
          severity: 'warning',
          category: 'A. API 与网络',
          location: '页面：LLM 文本接入 → 区域：实时测试面板输出区',
          cause: '短时间内发送了过多请求。',
          solution: '等待后重试。',
          steps: [
            '等待 30~60 秒',
            '降低测试频率',
            '重试',
          ],
          relatedCodes: ['API_RATE_LIMIT'],
        },
        {
          code: '500_INTERNAL_ERROR',
          message: '后端 500 错误',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：LLM 文本接入 → 区域：实时测试面板输出区',
          cause: '后端内部异常。',
          solution: '稍后重试。',
          steps: [
            '等待 1~2 分钟',
            '降低 Max Tokens 重试',
            '如果持续失败，联系后端管理员',
          ],
          relatedCodes: ['502_BAD_GATEWAY', '503_SERVICE_UNAVAILABLE'],
          prevention: '降低请求规模（图像尺寸、Max Tokens 等）；避免在服务器高负载时提交大任务。',
        },
        {
          code: 'IMPORT_INVALID_CONFIG',
          message: '导入配置时提示「无效的配置数据」',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：LLM 文本接入 → 区域：顶部「导入配置」按钮',
          cause: '导入的 JSON 中缺少 llmConfig 字段或格式不正确。',
          solution: '确认导入的是 LLM Hub 的配置文件。',
          steps: [
            '用文本编辑器打开文件',
            '确认包含 "tool": "llm-hub" 和 llmConfig 字段',
            '重新导入正确的文件',
          ],
          relatedCodes: ['IMPORT_INVALID_JSON', 'IMPORT_TOOL_MISMATCH'],
        },
        {
          code: 'IMPORT_INVALID_JSON',
          message: '导入配置时提示「无效的 JSON 格式」',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：LLM 文本接入 → 区域：顶部「导入配置」按钮',
          cause: '文件损坏或格式不正确。',
          solution: '检查文件有效性。',
          steps: [
            '用文本编辑器打开文件',
            '用 JSON 在线格式化工具验证',
            '重新导入',
          ],
          relatedCodes: ['IMPORT_INVALID_CONFIG'],
        },
        {
          code: 'IMPORT_TOOL_MISMATCH',
          message: '导入配置时提示「工具类型不匹配」',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：LLM 文本接入 → 区域：顶部「导入配置」按钮',
          cause: 'tool 字段不是 llm-hub。',
          solution: '确认导入正确的文件。',
          steps: [
            '用文本编辑器打开文件',
            '确认 tool 字段值为 "llm-hub"',
            '重新导入',
          ],
          relatedCodes: ['IMPORT_INVALID_JSON'],
        },
        {
          code: 'STORAGE_READ_ONLY',
          message: '保存无反应',
          severity: 'critical',
          category: 'B. 配置与数据',
          location: '页面：LLM 文本接入 → 区域：顶部「保存文档」按钮',
          cause: '浏览器无痕模式或 localStorage 被禁用。',
          solution: '退出无痕模式或使用导出备份。',
          steps: [
            '确认不在无痕模式',
            '点击「下载 JSON」备份配置',
            '在普通窗口中重新打开',
            '导入备份',
          ],
          relatedCodes: ['LOCAL_STORAGE_FULL'],
          prevention: '避免在浏览器无痕/隐私模式中使用本应用；定期导出配置到本地文件作为备份。',
        },
        {
          code: 'LOCAL_STORAGE_FULL',
          message: '保存失败，存储空间不足',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：LLM 文本接入 → 区域：顶部「保存文档」按钮',
          cause: 'localStorage 已满。',
          solution: '清理存储或导出到文件。',
          steps: [
            '点击「下载 JSON」备份',
            '清理 localStorage 中其他工具的数据',
            '重新保存',
          ],
          relatedCodes: ['STORAGE_READ_ONLY'],
          prevention: '定期清理浏览器 localStorage 中不再需要的数据；大文件不要直接保存在编辑器中，改用导出功能。',
        },
      ],
    },
    {
      id: 'tts-export',
      title: 'TTS 语音导出',
      overview: `TTS 语音导出工具用于配置语音合成参数并生成角色语音素材。支持调整声音、语言、语速、音调、音量等基础参数，以及气息感、清晰度、表现力、停顿强度等高级参数。可上传参考音频作为音色克隆源，支持音频后处理（降噪、EQ、压缩）和发音精校（自定义替换规则）。


【支持的语音引擎】
TTS 语音导出功能集成多种业界领先的语音合成引擎：

Edge TTS（微软 Azure 语音服务）：
- 支持 140+ 种语言和方言
- 400+ 种语音角色（男声、女声、童声、老人声）
- 神经网络语音（Neural）质量接近真人
- 支持语音风格调节（ cheerful, sad, angry, excited 等）
- 支持语速（-50%~+100%）、音调（-20Hz~+20Hz）、音量调节

Bark（开源生成式 TTS）：
- 支持多语言混读（code-switching）
- 可生成笑声、叹息、哭泣等非语音音效
- 支持克隆音色（需 5-10 秒参考音频）
- 完全本地运行，无需联网

Piper（轻量级开源 TTS）：
- 基于 VITS 架构，音质优秀
- 模型体积小巧（50-200MB）
- 推理速度快（实时因子 RTF < 0.1）
- 适合批量生成和实时应用

【角色语音设定】
为每个 OC 角色绑定专属语音配置：
- 选择最适合角色性格的语音角色
- 设定默认语速（活泼角色可稍快，沉稳角色可稍慢）
- 设定默认音调（高音适合少女/正太，低音适合成年/御姐）
- 保存多个情绪变体（正常、开心、生气、悲伤、惊讶）

【音频导出格式】
- MP3（128/192/320 kbps）：通用格式，兼容所有设备
- WAV（16-bit/44.1kHz 或 24-bit/48kHz）：无损音质，适合后期处理
- OGG Vorbis：开源格式，相同质量下比 MP3 小 20%
- FLAC：无损压缩，适合存档
- WebM：网页专用格式

【批量语音生成】
支持从文本文件批量导入台词列表，一次性生成所有音频：
- 支持 CSV 格式（台词,角色,情绪,文件名）
- 自动按角色分组使用对应的语音配置
- 生成进度条显示，支持后台运行
- 完成后打包为 ZIP 下载

【音频后处理】
内置基础音频编辑功能：
- 淡入淡出：为音频添加平滑的起止效果
- 音量标准化：统一所有音频的响度（LUFS）
- 降噪：去除背景噪声（需上传噪声样本）
- 拼接：将多个音频片段按顺序合并
- 格式转换：批量转码为不同格式

【SSML 高级标记】
支持语音合成标记语言（SSML）以实现精细控制：
- <break time="500ms"/>：插入停顿
- <emphasis level="strong">文字</emphasis>：强调
- <prosody rate="slow" pitch="+5Hz">文字</prosody>：语速音调
- <say-as interpret-as="characters">ABC</say-as>：拼读
- <audio src="..."/>：插入背景音乐或音效`,
      buttons: [
        { name: '保存', description: '将当前 TTS 配置保存到本地存储。保存成功后状态指示器会从「未保存」变为「已保存」。' },
        { name: '重刷', description: '将所有参数重置为默认值，清空参考音频和日志。会弹出二次确认弹窗防止误触。' },
        { name: '导入配置', description: '导入之前导出的 TTS JSON 配置文件，恢复全部参数设置。' },
        { name: '下载 JSON', description: '将当前 TTS 配置下载为 JSON 文件（oc-tts-config.json），可用于备份或跨设备迁移。' },
        { name: '复制 JSON', description: '将当前 TTS 配置复制为 JSON 文本到剪贴板。' },
        { name: '上传参考音频', description: '选择并上传一段参考音频（WAV/MP3/FLAC，不超过 10MB），用于音色克隆。上传后会显示文件名。' },
        { name: '展开 / 收起高级参数', description: '展开或折叠高级参数面板（停顿强度、语调曲线、强调模式）。' },
        { name: '展开 / 收起音频后处理', description: '展开或折叠音频后处理面板（降噪、EQ、压缩）。' },
        { name: '展开 / 收起发音精校', description: '展开或折叠发音精校面板（文本预处理、替换规则）。' },
        { name: '复制日志', description: '将右侧日志面板的内容复制到剪贴板。' },
        { name: '下载日志', description: '将日志内容下载为文本文件（tts-logs.txt）。' },
      
        { name: '试听', description: '仅合成并播放当前输入文本的前 100 字，用于快速确认语音效果。' },
        { name: '批量导入', description: '从文本文件或 CSV 批量导入台词列表，自动生成对应的音频文件。' },
        { name: '语音克隆', description: '上传 5-10 秒的参考音频，克隆特定人物的音色用于语音合成。' },
        { name: '音频编辑器', description: '打开基础音频编辑界面，可进行裁剪、拼接、淡入淡出等操作。' },
        { name: '语音库', description: '管理所有已保存的角色语音配置，可快速切换和预览。' },
        { name: 'SSML 编辑器', description: '打开可视化 SSML 标记编辑器，无需手写 XML 即可添加停顿、强调等效果。' },
        { name: '字幕生成', description: '根据音频内容自动生成 SRT 字幕文件，支持调整时间轴。' },],
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
      
        { name: '音频采样率', description: '输出音频的采样率，可选 22050Hz、44100Hz、48000Hz。高采样率音质更好但文件更大。', tips: '语音对话 22050Hz 足够，音乐或后期处理建议 44100Hz 或 48000Hz。' },
        { name: '音频位深度', description: '输出音频的位深度，可选 16-bit、24-bit。24-bit 动态范围更大。', tips: '一般用途 16-bit，专业音频制作 24-bit。' },
        { name: '语音停顿间隔', description: '句间自动插入的停顿时长（毫秒），范围 100~2000。影响说话的节奏感。', tips: '正常对话 300-500ms，朗读/演讲 500-800ms。' },
        { name: '情感强度', description: '语音情绪标签的强度倍数，范围 0.5~2.0。1.0 为正常，大于 1 更夸张，小于 1 更克制。', tips: '动画配音建议 1.2-1.5，有声书建议 0.8-1.0。' },
        { name: '批处理线程数', description: '批量生成时同时处理的线程数，范围 1~8。更多线程速度更快但占用更多资源。', tips: '8 核以上 CPU 建议 4-6，4 核建议 2-3。' },
        { name: '参考音频长度', description: '语音克隆时使用的参考音频长度（秒），范围 3~30。更长通常克隆效果更稳定。', tips: 'Bark 建议 5-10 秒，其他引擎建议 10-20 秒。' },
        { name: '克隆相似度', description: '语音克隆时与原音色的相似度权重，范围 0~100。高值更像原声但可能保留噪声。', tips: '干净录音建议 80-90， noisy 录音建议 60-70。' },
        { name: '字幕时间偏移', description: '生成的字幕时间轴整体偏移（毫秒），范围 -5000~5000。用于与视频精确对齐。', tips: '通常无需调整，遇到音画不同步时微调。' },
        { name: 'SSML 验证级别', description: 'SSML 标记的验证严格程度：宽松（允许未知标签）、标准（仅允许已知标签）、严格（要求完整语法）。', tips: '初学者建议宽松，生产环境建议标准或严格。' },],
      errors: [
        {
          code: 'API_KEY_MISSING',
          message: '生成语音时提示 API Key 未配置',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：TTS 语音导出 → 区域：左栏输出区',
          cause: '未配置 API Key。',
          solution: '在设置面板配置 Key。',
          steps: [
            '打开「设置 → API」',
            '填入有效 Key',
            '保存后重试',
          ],
          relatedCodes: ['API_KEY_EXPIRED'],
          prevention: '首次使用任何联网工具前，务必先在「设置 → API」中配置有效的 API Key。',
        },
        {
          code: 'API_KEY_EXPIRED',
          message: '请求返回 401',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：TTS 语音导出 → 区域：左栏输出区',
          cause: 'Key 过期。',
          solution: '更换 Key。',
          steps: [
            '打开「设置 → API」',
            '替换为新的 Key',
            '保存后重试',
          ],
          relatedCodes: ['API_KEY_MISSING'],
          prevention: '定期检查 API Key 的有效期和剩余额度；在 LLM Hub 中通过实时测试快速验证 Key 是否有效。',
        },
        {
          code: 'API_TIMEOUT',
          message: '请求超时',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：TTS 语音导出 → 区域：左栏输出区',
          cause: '合成耗时过长。',
          solution: '缩短文本或增加超时。',
          steps: [
            '减少待合成文本长度',
            '增加超时设置',
            '重试',
          ],
          relatedCodes: ['NETWORK_DISCONNECTED'],
          prevention: '处理大尺寸图片或大量文本时，提前降低参数规模（图像尺寸、Max Tokens 等）；网络不稳定时增加超时设置。',
        },
        {
          code: 'BACKEND_UNAVAILABLE',
          message: '后端不可用',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：TTS 语音导出 → 区域：左栏输出区',
          cause: '后端未启动或配置错误。',
          solution: '检查后端状态。',
          steps: [
            '检查 API Base URL',
            '确认后端服务运行中',
            '重试',
          ],
          relatedCodes: ['NETWORK_DISCONNECTED'],
          prevention: '本地部署时确保后端进程已启动（npm start）；使用远程服务时确认 URL 配置正确。',
        },
        {
          code: 'IMPORT_INVALID_CONFIG',
          message: '导入配置时提示「无效的配置数据」',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：TTS 语音导出 → 区域：顶部「导入配置」按钮',
          cause: '缺少 ttsConfig 字段。',
          solution: '确认导入 TTS 配置文件。',
          steps: [
            '用文本编辑器打开文件',
            '确认包含 "tool": "tts-export"',
            '重新导入',
          ],
          relatedCodes: ['IMPORT_INVALID_JSON'],
        },
        {
          code: 'IMPORT_INVALID_JSON',
          message: '导入配置时提示「无效的 JSON 格式」',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：TTS 语音导出 → 区域：顶部「导入配置」按钮',
          cause: '文件损坏。',
          solution: '检查文件有效性。',
          steps: [
            '用文本编辑器打开文件',
            '用 JSON 格式化工具验证',
            '重新导入',
          ],
          relatedCodes: ['IMPORT_INVALID_CONFIG'],
        },
        {
          code: 'LOCAL_STORAGE_FULL',
          message: '保存失败',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：TTS 语音导出 → 区域：顶部「保存」按钮',
          cause: '存储空间不足。',
          solution: '清理或导出备份。',
          steps: [
            '点击「下载 JSON」备份',
            '清理 localStorage',
            '重新保存',
          ],
          relatedCodes: ['STORAGE_READ_ONLY'],
          prevention: '定期清理浏览器 localStorage 中不再需要的数据；大文件不要直接保存在编辑器中，改用导出功能。',
        },
        {
          code: 'STORAGE_READ_ONLY',
          message: '保存无反应',
          severity: 'critical',
          category: 'B. 配置与数据',
          location: '页面：TTS 语音导出 → 区域：顶部「保存」按钮',
          cause: '无痕模式。',
          solution: '退出无痕模式。',
          steps: [
            '确认不在无痕模式',
            '导出备份',
            '在普通窗口中重新打开',
          ],
          relatedCodes: ['LOCAL_STORAGE_FULL'],
          prevention: '避免在浏览器无痕/隐私模式中使用本应用；定期导出配置到本地文件作为备份。',
        },
        {
          code: 'TTS_AUDIO_GENERATION_FAILED',
          message: '语音合成失败',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：TTS 语音导出 → 区域：左栏输出区',
          cause: '后端 TTS 服务异常。可能是模型加载失败、参考音频格式不支持、或文本包含无法合成的字符。',
          solution: '排查后端状态、参考音频和文本内容。',
          steps: [
            '检查错误详情中的具体信息',
            '如果使用了参考音频，确认格式为 WAV/MP3/OGG',
            '简化文本，移除特殊符号和表情',
            '尝试切换声音预设',
            '重试',
          ],
          relatedCodes: ['MODEL_NOT_FOUND', 'API_TIMEOUT'],
          prevention: '简化文本移除特殊符号；确认参考音频格式正确；选择已知可用的声音预设。',
        },
        {
          code: 'TTS_REFERENCE_INVALID',
          message: '参考音频上传失败',
          severity: 'warning',
          category: 'C. 文件与输入',
          location: '页面：TTS 语音导出 → 区域：参考音频上传区',
          cause: '文件格式不支持或文件过大。',
          solution: '更换有效的音频文件。',
          steps: [
            '确认文件格式为 WAV、MP3 或 OGG',
            '确认文件大小不超过 10MB',
            '重新上传',
          ],
          relatedCodes: ['FILE_FORMAT_UNSUPPORTED', 'FILE_TOO_LARGE'],
        },
        {
          code: 'UNSAVED_WARNING',
          message: '返回首页时提示未保存',
          severity: 'info',
          category: 'B. 配置与数据',
          location: '页面：TTS 语音导出 → 区域：左上角「返回首页」按钮',
          cause: '有未保存的修改。',
          solution: '保存或放弃。',
          steps: [
            '点击「保存」',
            '或点击「确认返回」放弃',
          ],
        },
      ],
    },
    {
      id: 'paper2gal',
      title: 'paper2gal 图片素材生成',
      overview: `Paper2Gal 是 Original Character Maker 的核心工作流工具，接入 p2g-character-workflow 后端，实现「单图进、多资产出」的角色素材批量生成。上传一张角色参考图后，工作流会自动执行 10 个步骤，生成 8 张最终素材和 5 份元数据文件。

**最终输出资产（共 8 张图片）**
· 表情图 ×3：思考（thinking）、惊讶（surprise）、生气（angry），竖屏构图
· CG 场景图 ×2：CG01、CG02，横屏 16:9 构图，单人全年龄日常剧情场景
· 透明抠图 ×3：对应上述三张表情的透明背景 PNG

**元数据文件（共 5 份）**
· manifest：工作流完整清单
· character_profile：角色分析档案
· prompts：各步骤使用的最终提示词记录
· character_pack：角色封装包
· p2g_handoff：paper2gal 交接文件

**工作流执行顺序（10 步）**
1. validate_input — 验证输入图片格式、尺寸
2. analyze_character — AI 分析角色特征，生成角色描述供后续步骤复用
3. expression_thinking — 生成思考表情图
4. expression_surprise — 生成惊讶表情图
5. expression_angry — 生生气表情图
6. cg_01 — 生成第一张 CG 场景图
7. cg_02 — 生成第二张 CG 场景图
8. cutout_expression_thinking — 对思考表情进行透明抠图
9. cutout_expression_surprise — 对惊讶表情进行透明抠图
10. cutout_expression_angry — 对生气表情进行透明抠图

**Prompt 覆盖系统**
每个生成步骤都支持自定义 Prompt 覆盖。默认提示词已内置严格的角色一致性约束（身份、脸型、发型、服装、配色、画风保持一致）和安全边界（禁止性感化、暴露服装、暧昧姿势、成人暗示）。你可以根据角色特点微调表情描述和场景氛围，但建议保留默认提示词中的约束部分以保证输出质量。

**重做系统（v1.0.0+）**
支持对单个结果进行重做（Redo），不同表情和 CG 可以并行重做。重做时页面会显示「重做中」状态，并自动同步后端进度。注意：重做表情会自动同步重做对应的抠图（它们属于同一个冲突组）。

**抠图方案**
抠图由后端统一调度。当后端将 remove_background 提供商设为 frontend 时，浏览器会自动执行 AI 抠图（基于 IMG.LY background-removal 模型）。浏览器抠图在本地运行，无需额外 API Key，首次运行需要下载模型资源（约 1-2 分钟）。如果浏览器抠图失败，会自动回退到边缘颜色检测兜底方案。

**状态保存**
页面会自动保存当前工作流状态、Prompt 覆盖配置和并发设置到浏览器本地存储。刷新页面后可恢复进度。未保存的修改会显示黄色「未保存」指示器，离开页面前会提示确认。


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
      buttons: [
        { name: '返回首页', description: '离开 paper2gal 页面返回主页。如果当前有未保存的配置修改（Prompt 覆盖或并发设置），会先弹出确认弹窗，可选择「继续编辑」保存后再离开，或「确认返回」放弃修改。' },
        { name: '打开设置', description: '打开全局设置面板。在 paper2gal 中最常用的设置项是「API」标签页（配置后端地址和 Key）和「性能」标签页（调整图像预览质量、最大并发请求数）。' },
        { name: '未保存 / 已保存', description: '状态指示器。当修改了 Prompt 覆盖文本或 AI 并发开关后，指示器显示黄色「未保存」。点击「保存配置」后变为绿色「已保存」。此状态也决定是否弹出离开确认弹窗。' },
        { name: '保存配置', description: '将当前的 Prompt 覆盖配置和 AI 并发设置保存为快照。保存后「未保存」指示器变为「已保存」，离开页面时不再弹窗提示。注意：此操作仅保存配置，不保存工作流状态（工作流状态由页面自动持久化）。' },
        { name: '重置工作流', description: '清除所有工作流状态、上传的图片、生成结果和配置，恢复为初始空白状态。此操作不可撤销，已生成的素材图片、步骤进度、调试日志将全部丢失。操作前会弹出二次确认弹窗。' },
        { name: '导入配置', description: '导入之前导出的 paper2gal JSON 配置文件，恢复 Prompt 覆盖和 AI 并发设置。支持两种格式：标准格式（包含 tool: "paper2gal" 和 config 对象）和兼容格式（直接包含 promptOverrides 和 aiConcurrencyEnabled 字段）。如果文件格式不正确会弹出提示。' },
        { name: '复制 JSON', description: '将当前工作流的完整调试信息（包含消息状态、工作流对象、生效 API 地址、Prompt 覆盖等）复制为 JSON 文本到剪贴板。用于向开发者反馈问题时提供上下文。' },
        { name: '下载 JSON', description: '下载当前工作流的调试 JSON 文件（paper2gal-workflow.json），内容与「复制 JSON」相同。' },
        { name: '导出封装配置', description: '下载仅包含 Prompt 覆盖和 AI 并发设置的精简 JSON 文件（paper2gal-config.json），不含工作流状态。此文件可通过「导入配置」恢复，便于跨设备迁移配置或分享 Prompt 模板。' },
        { name: '源图片面板 — 展开/收起', description: '点击面板标题可展开或收起源图片区域。展开后显示图片预览、文件名和格式转换器快捷入口。' },
        { name: '选择图片 / 替换图片', description: '打开系统文件选择器上传角色参考图。仅接受 PNG 和 JPG 格式。支持重复选择同一文件（每次选择后会自动重置文件输入框）。推荐上传单人立绘或清晰半身图，尺寸建议 1024×1024 ~ 2048×2048。' },
        { name: '格式转换器', description: '快捷跳转到「图片格式转换」工具的按钮。如果当前图片格式或尺寸不合适，可先去转换工具处理后再回来上传。' },
        { name: '设置面板 — 展开/收起', description: '点击面板标题可展开或收起设置区域。展开后显示源文件信息、当前步骤、AI 并发开关、操作按钮和提示文本。' },
        { name: '开始', description: '向后端提交角色图像，启动完整的 paper2gal 工作流。提交前会检查是否已选择图片。工作流启动后，页面会自动轮询进度（每秒一次），右侧进度区会实时更新各步骤状态。' },
        { name: '重做工作流', description: '使用当前已上传的同一张图片重新启动工作流。相当于「快速再来一次」，无需重新选择文件。如果工作流已完成但你对结果不满意，或想更换 Prompt 覆盖后重新生成，可使用此按钮。' },
        { name: '下载全部', description: '下载包含所有生成素材和元数据文件的 ZIP 压缩包（文件名格式：{workflowId}-outputs.zip）。只有工作流已经启动（存在 workflowId）时此按钮才可用。' },
        { name: 'Prompt 覆盖面板 — 展开/收起', description: '点击面板标题展开或折叠 Prompt 覆盖编辑区。默认折叠，需要自定义提示词时展开。展开后显示 5 个文本编辑框，分别对应 3 张表情和 2 张 CG。' },
        { name: '步骤卡片 — 打开文件', description: '当某个步骤成功生成输出后，其步骤卡片上会出现「打开文件」按钮。点击后在新标签页打开该步骤的输出图片 URL，可直接查看原图。' },
        { name: '步骤卡片 — 重做 / 重试', description: '对于可重做的步骤（expression_thinking / expression_surprise / expression_angry / cg_01 / cg_02 及对应的 cutout 步骤），步骤卡片上会显示重做按钮。失败状态的步骤显示「重试步骤」，成功状态的步骤显示「重做当前结果」。点击后向后端提交重做请求，页面会继续轮询新进度。不同步骤可以并行重做，但同一冲突组内的步骤（如表情和对应抠图）会互斥。' },
        { name: '结果区 — 打开文件', description: '在右侧结果网格的每张输出卡片上，点击「打开文件」可在新标签页查看原图。' },
        { name: '结果区 — 下载', description: '下载单张输出图片到本地，使用预设的文件名（如 expression-thinking.png、cg-01.png 等）。' },
        { name: '结果区 — 复制素材', description: '将单张输出图片复制到系统剪贴板（如果浏览器支持 ClipboardItem API）。复制成功后按钮文字会短暂变为「已复制」。' },
        { name: '结果区 — 重做当前结果', description: '在结果卡片上直接对某张输出图发起重做，与步骤卡片上的重做功能相同。' },
        { name: '元数据操作 — 打开 Manifest', description: '在工作流完成后，点击此按钮在新标签页打开 manifest.json 文件，查看工作流的完整执行记录和输出清单。' },
        { name: '元数据操作 — 打开角色档案', description: '打开 character_profile 文件，查看 AI 对上传角色的分析结果（外貌特征、服装、配色等描述）。' },
        { name: '元数据操作 — 打开提示词记录', description: '打开 prompts 文件，查看各步骤实际使用的最终提示词（包含默认提示词和你的 Prompt 覆盖合并后的结果）。' },
        { name: '元数据操作 — 打开角色封装包', description: '打开 character_pack 文件，查看角色封装数据。' },
        { name: '元数据操作 — 打开 P2G 交接文件', description: '打开 p2g_handoff 文件，查看供 paper2gal 下游流程使用的交接数据。' },
        { name: '日志面板 — 复制日志', description: '复制当前工作流的所有步骤状态日志到剪贴板。日志格式包含每个步骤的状态、提供商、输出 URL 和错误信息。' },
        { name: '日志面板 — 下载日志', description: '将日志内容下载为文本文件（paper2gal-logs.txt）。' },
        { name: '结果摘要 — 复制结果', description: '复制结果摘要 JSON（outputs 对象）到剪贴板。' },
        { name: '结果摘要 — 下载结果', description: '下载结果摘要 JSON 文件（paper2gal-result.json）。' },
        { name: '最新错误 — 复制 / 下载', description: '复制或下载当前最新的错误详情 JSON，包含可读错误信息、可能原因、修复提示和调试数据。' },
        { name: '最新错误 — 打开详情面板', description: '打开可拖拽的错误详情浮窗，以结构化方式展示错误代码、阶段、消息、提示和详细数据。' },
        { name: '调试面板 — 复制调试 / 下载调试', description: '复制或下载完整的调试 JSON（paper2gal-debug.json），包含消息、工作流状态、生效 API 地址、接口模式、输入文件名、并发设置和 Prompt 覆盖。用于深度排查问题时向开发者提供完整上下文。' },
      
        { name: '数据集分析', description: '分析当前数据集的标签分布、图像尺寸分布、色彩分布等统计信息。' },
        { name: '标签编辑器', description: '批量编辑所有图像的标签，支持查找替换、正则表达式、自动补全。' },
        { name: '训练监控', description: '实时显示 GPU 利用率、显存占用、损失曲线、学习率变化等训练指标。' },
        { name: '模型比较', description: '选择两个检查点进行 A/B 测试，使用相同提示词生成对比图片。' },
        { name: '触发词推荐', description: '基于训练数据自动生成推荐的触发词组合和负面提示词。' },
        { name: '模型量化', description: '将 FP32/FP16 模型量化为 INT8 或 INT4，减少显存占用和推理时间。' },],
      parameters: [
        { name: 'AI 并发执行', description: '开关参数。开启后，工作流中的 AI 生成步骤（表情 ×3 + CG ×2）可以并行执行，显著缩短总耗时。关闭后所有步骤串行执行，耗时更长但 API 调用更平稳。', tips: '开启并发时后端会同时调度多个模型请求，可能增加 API 费用；低配置服务器或速率限制较严的 Key 建议关闭。浏览器端抠图步骤是否参与并发由后端控制。' },
        { name: 'Prompt 覆盖 — 思考表情', description: '覆盖「思考」表情生成步骤的默认 Prompt。默认提示词要求严格保持角色一致性，并指定竖屏构图、自然思考状态（轻托下巴、视线侧移等）。', tips: '建议保留默认提示词中「严格保持...一致」和「竖屏构图」的约束部分，仅修改表情动作描述。如果清空文本框，后端会使用默认提示词。' },
        { name: 'Prompt 覆盖 — 惊讶表情', description: '覆盖「惊讶」表情生成步骤的默认 Prompt。默认提示词要求轻微睁大眼睛、肩膀轻抬、手部微微抬起等自然克制的惊讶动作。', tips: '惊讶表情容易生成夸张变形，可在覆盖中加入「动作自然克制，不要夸张变形」等约束。' },
        { name: 'Prompt 覆盖 — 生气表情', description: '覆盖「生气」表情生成步骤的默认 Prompt。默认提示词要求眉眼和嘴型明确表现不满，可轻微前倾、抱臂或小幅握拳，愤怒程度按角色气质自然发挥。', tips: '注意避免生成暴力元素。默认提示词已包含「不要所有角色都只是轻微生气，也不要暴走夸张」的平衡约束。' },
        { name: 'Prompt 覆盖 — CG01', description: '覆盖第一张 CG 场景图的生成 Prompt。默认提示词要求基于同一角色生成单人全年龄日常剧情场景，横屏 16:9，禁止新增其他人物，禁止性感化、暴露服装、暧昧姿势、成人暗示。', tips: '可在保留角色一致性约束的前提下，指定特定场景（如「教室」「公园」「雨天街道」）或氛围（如「温馨」「紧张」「悠闲」）。' },
        { name: 'Prompt 覆盖 — CG02', description: '覆盖第二张 CG 场景图的生成 Prompt。默认约束与 CG01 相同。', tips: '建议与 CG01 保持角色和画风一致，仅改变场景、镜头、姿势或情绪，形成系列感。' },
        { name: '输入图片', description: '工作流的源图片。仅支持 PNG 和 JPG 格式。图片内容应包含清晰的角色形象，推荐单人立绘或半身图。', tips: '推荐尺寸 1024×1024 ~ 2048×2048。过大（>4096）会导致生成和抠图耗时显著增加；过小（<512）会影响角色细节质量。' },
        { name: '源文件信息', description: '只读信息，显示当前上传的文件名。' },
        { name: '当前步骤', description: '只读信息，显示工作流当前正在执行的步骤名称（中文标签）。工作流未启动时显示「—」。' },
        { name: '工作流 ID', description: '只读信息，显示当前工作流的唯一标识符。工作流未启动时显示「paper2gal-idle」。此 ID 用于后端追踪和下载全部素材。', tips: '如果需要在后端日志中查找对应记录，可复制此 ID 提供给后端管理员。' },
        { name: '抠图提供商', description: '只读信息，显示当前工作流使用的背景移除引擎名称（如 frontend、sharp、aliyun 等）。由后端根据可用资源自动分配。', tips: '当显示为 frontend 时，抠图由浏览器端 AI 模型执行；显示为其他值时由后端服务执行。' },
        { name: '表情提供商 / CG 提供商', description: '只读信息，显示表情生成和 CG 生成的后端服务提供商。由后端根据配置自动分配。' },
      
        { name: '训练分辨率', description: '训练图像的目标分辨率，可选 512x512、768x768、1024x1024。高分辨率需要更多显存。', tips: 'SD 1.5 建议 512 或 768，SDXL 建议 1024。' },
        { name: '批次大小', description: '每步训练同时处理的图像数量，范围 1~8。更大批次训练更稳定但需要更多显存。', tips: '8GB 显存建议 1-2，16GB 建议 2-4，24GB+ 建议 4-8。' },
        { name: '学习率', description: '模型参数更新的步长，范围 1e-6~1e-3。过高导致不稳定，过低收敛慢。', tips: 'LoRA 训练建议 1e-4~5e-4，全量训练建议 1e-5~1e-4。' },
        { name: 'LoRA 维度', description: 'LoRA 的低秩维度，可选 4、8、16、32、64、128。维度越高表达能力越强。', tips: '简单概念 4-8，角色 16-32，复杂风格 64-128。' },
        { name: 'Alpha 值', description: 'LoRA 的缩放参数，通常设为维度的一半或相等。控制 LoRA 对基础模型的影响强度。', tips: '一般设为 Rank/2 或等于 Rank。' },
        { name: '训练步数', description: '总训练迭代次数，范围 500~20000。步数 = 图像数 × 重复次数 × 训练轮数。', tips: '10-20 张图建议 1000-2000 步，50-100 张图建议 3000-5000 步。' },
        { name: '保存间隔', description: '每隔多少步保存一次检查点，范围 100~2000。频繁保存占用磁盘空间但能保留更多中间状态。', tips: '建议 500-1000 步，总步数少时可设为 250-500。' },
        { name: '正则化权重', description: '正则化图像的损失权重，范围 0~2.0。更高权重更防止过拟合但可能削弱学习能力。', tips: '建议 0.5-1.0，小数据集可提高到 1.0-1.5。' },
        { name: '噪声偏移', description: '训练时添加到图像的随机噪声强度，范围 0~1.0。适当噪声可提升生成图像的对比度。', tips: '建议 0.05-0.1，设为 0 则关闭。' },
        { name: 'Optimizer', description: '优化器算法：AdamW（通用）、AdamW8bit（省显存）、Lion（大学习率收敛快）、DAdaptation（自适应学习率）。', tips: '新手建议 AdamW，显存紧张建议 AdamW8bit。' },
        { name: 'Scheduler', description: '学习率调度器：constant（恒定）、cosine（余弦衰减）、linear（线性衰减）、polynomial（多项式衰减）。', tips: '大多数场景 cosine 效果最佳。' },
        { name: '混合精度', description: '启用 FP16/BF16 混合精度训练可减少 40-50% 显存占用。', tips: 'RTX 20 系以上建议 FP16，RTX 30/40 系建议 BF16。' },],
      errors: [
        {
          code: 'API_KEY_MISSING',
          message: '启动工作流后立刻报错，提示 API Key 未配置',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：paper2gal → 区域：顶部消息条 / 右栏错误面板',
          cause: '未在「设置 → API」中配置 API Key，或 Key 被清空。paper2gal 需要调用后端图像生成服务，必须配置有效的 API Key。',
          solution: '在设置面板中配置有效的 API Key。',
          steps: [
            '点击右上角「打开设置」或按对应快捷键',
            '切换到「API」标签页',
            '在「API Key」输入框中填入你的有效 Key',
            '点击「保存」后关闭设置面板',
            '返回 paper2gal 页面重新点击「开始」',
          ],
          relatedCodes: ['API_KEY_EXPIRED', '401_UNAUTHORIZED'],
          prevention: '首次使用任何联网工具前，务必先在「设置 → API」中配置有效的 API Key。',
        },
        {
          code: 'API_KEY_EXPIRED',
          message: '请求返回 401 或提示 Key 无效',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：paper2gal → 区域：顶部消息条 / 右栏错误面板',
          cause: '配置的 API Key 已过期、被吊销、或额度已用完。',
          solution: '更换有效的 API Key。',
          steps: [
            '打开「设置 → API」面板',
            '删除当前 Key，填入新的有效 Key',
            '如果不确定 Key 是否有效，可在 LLM Hub 的实时测试面板中先测试',
            '保存后返回 paper2gal 重试',
          ],
          relatedCodes: ['API_KEY_MISSING'],
          prevention: '定期检查 API Key 的有效期和剩余额度；在 LLM Hub 中通过实时测试快速验证 Key 是否有效。',
        },
        {
          code: 'HOSTED_API_REQUIRED',
          message: '提示「当前为静态托管环境，必须配置自定义 API」',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：paper2gal → 区域：顶部消息条',
          cause: '当前页面部署在 GitHub Pages、阿里云 OSS/CDN 等纯静态托管环境中，无法直接访问本地后端。必须配置远程自定义 API 地址才能使用工作流功能。',
          solution: '在设置中配置远程 API 地址。',
          steps: [
            '打开「设置 → API」',
            '将「接口模式」切换为「自定义 API」',
            '在「API 地址」中填入已部署的后端根地址（如 https://your-backend.example.com）',
            '填入对应的 API Key',
            '保存后重试',
          ],
          relatedCodes: ['API_KEY_MISSING', 'BACKEND_UNAVAILABLE'],
          prevention: '在静态托管环境使用 paper2gal 前，务必先部署后端服务并配置正确的 API 地址和 Key。',
        },
        {
          code: 'DIRECT_MODEL_ENDPOINT',
          message: '提示「当前填写的看起来是模型接口，不是工作流后端根地址」',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：paper2gal → 区域：设置面板 API 标签页 / 顶部消息条',
          cause: '在「设置 → API → API 地址」中填写了类似 https://api.example.com/v1/chat/completions 的模型接口地址，而不是工作流后端根地址（如 https://your-backend.example.com）。paper2gal 需要的是后端根地址，前端会自动拼接 /api/workflows 等路径。',
          solution: '修改为正确的工作流后端根地址。',
          steps: [
            '打开「设置 → API」',
            '将「API 地址」修改为后端根地址（格式如 https://your-backend.example.com 或 http://localhost:3001）',
            '确保地址末尾没有 /api/workflows 或 /v1/chat/completions 等路径',
            '保存后重试',
          ],
          relatedCodes: ['BACKEND_UNAVAILABLE', 'API_BASE_INVALID'],
          prevention: '配置 API 地址时只填写后端服务的根域名和端口，不要附加任何 API 路径。',
        },
        {
          code: 'API_TIMEOUT',
          message: '工作流长时间无响应，最终提示超时',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：paper2gal → 区域：顶部消息条 / 右栏进度条',
          cause: '某个步骤耗时过长。可能原因：图像尺寸过大、模型负载高、网络延迟高、或后端处理排队。',
          solution: '检查网络或稍后重试，或对单个步骤重做。',
          steps: [
            '等待 2~3 分钟，看是否有进度更新（某些步骤确实需要较长时间）',
            '检查网络连接是否稳定',
            '如果卡在某一长时间步骤，可在该步骤的卡片上点击「重做」单独重试',
            '如果整个工作流卡住，可尝试点击「重做工作流」用同一张图重新开始',
          ],
          relatedCodes: ['NETWORK_DISCONNECTED', 'BACKEND_UNAVAILABLE'],
          prevention: '处理大尺寸图片时提前压缩；网络不稳定时关闭 AI 并发降低请求频率。',
        },
        {
          code: 'BACKEND_UNAVAILABLE',
          message: '提示「后端不可用」或「无法连接到服务器」',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：paper2gal → 区域：顶部消息条 / 右栏错误面板',
          cause: '后端服务器未启动、崩溃、或前端配置的 API Base URL 不正确。',
          solution: '检查后端服务状态和 API 配置。',
          steps: [
            '打开浏览器开发者工具 → Network 标签页',
            '重新点击「开始」，观察请求是否发出以及响应状态码',
            '如果请求未发出，检查「设置 → API → API Base URL」是否正确',
            '如果请求返回 502/503，联系后端管理员确认服务状态',
            '如果是本地部署，确认后端进程是否在运行（npm start）',
          ],
          relatedCodes: ['NETWORK_DISCONNECTED', '502_BAD_GATEWAY', '503_SERVICE_UNAVAILABLE'],
          prevention: '本地部署时确保后端进程已启动（npm start）；使用远程服务时确认 URL 配置正确。',
        },
        {
          code: 'NETWORK_DISCONNECTED',
          message: '提示网络断开或无法访问互联网',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：paper2gal → 区域：顶部消息条 / 右栏错误面板',
          cause: '设备未连接网络、Wi-Fi 断开、或防火墙阻止了请求。',
          solution: '恢复网络连接。',
          steps: [
            '检查设备的网络连接状态',
            '尝试访问其他网站确认网络是否正常',
            '如果使用代理/VPN，检查代理设置是否正确',
            '如果是公司/校园网络，确认是否限制了 API 访问',
          ],
          relatedCodes: ['BACKEND_UNAVAILABLE', 'API_TIMEOUT'],
          prevention: '使用联网工具前确认网络连接正常；避免在网络波动大的环境下进行长时间工作流。',
        },
        {
          code: 'FILE_FORMAT_UNSUPPORTED',
          message: '上传时提示「不支持的文件格式」',
          severity: 'warning',
          category: 'C. 文件与输入',
          location: '页面：paper2gal → 区域：左栏源图片面板',
          cause: '选择了 WEBP、GIF、BMP、TIFF 或其他不支持的格式。paper2gal 仅支持 PNG 和 JPG。',
          solution: '将图片转换为 PNG 或 JPG 格式。',
          steps: [
            '使用图片转换工具（主页 → 图片格式转换）将文件转为 PNG 或 JPG',
            '或使用系统自带的图片预览/编辑工具导出为 PNG/JPG',
            '重新在 paper2gal 页面选择转换后的文件',
          ],
          relatedCodes: ['UPLOAD_FORMAT'],
          prevention: '上传前确认文件格式为 PNG 或 JPG。',
        },
        {
          code: 'FILE_TOO_LARGE',
          message: '上传后预览失败或工作流报错',
          severity: 'warning',
          category: 'C. 文件与输入',
          location: '页面：paper2gal → 区域：左栏预览区',
          cause: '上传的图片尺寸过大（超过 4096x4096 像素）或文件大小超过浏览器/后端限制。',
          solution: '压缩或缩小图片后再上传。',
          steps: [
            '使用图片转换工具将图片最大边缩放到 2048 或 4096 像素以下',
            '如果是 PNG，可转为 JPG 以减小文件大小',
            '重新上传处理后的图片',
          ],
          relatedCodes: ['DEVICE_MEMORY_LOW'],
          prevention: '推荐上传 1024×1024 ~ 2048×2048 的图片，平衡质量与处理速度。',
        },
        {
          code: 'MODEL_NOT_FOUND',
          message: '工作流某步骤报错，提示模型不可用',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：paper2gal → 区域：右栏步骤卡片 / 错误面板',
          cause: '后端配置的模型不存在、已被下架、或当前 API Key 无权访问该模型。',
          solution: '联系后端管理员切换模型，或更换有权限的 API Key。',
          steps: [
            '查看错误面板中的具体步骤和模型信息',
            '联系后端管理员确认模型配置',
            '如果某一步骤持续失败，可在该步骤卡片上点击「重做」尝试',
          ],
          relatedCodes: ['API_KEY_EXPIRED', '403_FORBIDDEN'],
          prevention: '确保后端配置的模型可用且当前 Key 有权访问；定期验证 Key 权限。',
        },
        {
          code: 'PROMPT_BLOCKED',
          message: '某步骤报错，提示内容策略违规或敏感词拦截',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：paper2gal → 区域：右栏步骤卡片 / 错误面板',
          cause: 'Prompt 覆盖中的内容被后端服务商的安全过滤器拦截。即使是正常的艺术创作词汇，某些平台也会误判。',
          solution: '修改 Prompt 覆盖，移除或替换可能触发过滤器的词汇。',
          steps: [
            '在左栏展开「Prompt 覆盖」面板',
            '找到报错的步骤对应的 Prompt',
            '移除或替换可能触发过滤器的词汇',
            '在该步骤卡片上点击「重做」',
            '如果仍失败，尝试将 Prompt 简化为最基础的描述，逐步添加修饰词排查触发词',
          ],
          relatedCodes: ['P2G_WORKFLOW_ERROR', '403_FORBIDDEN'],
          prevention: '修改 Prompt 覆盖时避免使用敏感词汇；先用默认 Prompt 测试通过后再自定义。',
        },
        {
          code: 'P2G_WORKFLOW_ERROR',
          message: '错误面板上显示「P2G_WORKFLOW_ERROR」',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：paper2gal → 区域：顶部消息条 / 右栏错误面板 / 可拖拽错误浮窗',
          cause: 'Paper2Gal 工作流某个步骤执行失败。可能是输入验证失败、模型不可用、API Key 失效、生成内容被安全过滤器拦截、网络中断、或后端内部异常。',
          solution: '根据错误详情中的「阶段」「消息」「提示」逐步排查。',
          steps: [
            '展开错误面板或打开可拖拽错误浮窗，阅读「可读错误信息」「可能原因」「修复提示」',
            '检查上传的图片是否为有效的 PNG/JPG',
            '检查网络连接',
            '如果提示「内容策略违规」，修改 Prompt 覆盖中的敏感词汇',
            '确认后端服务正常运行',
            '如果某一步骤失败，可在步骤卡片上点击「重做」单独重试该步骤',
            '如果整个工作流失败，点击「重置工作流」清除后重新开始',
          ],
          relatedCodes: ['API_KEY_MISSING', 'API_KEY_EXPIRED', 'MODEL_NOT_FOUND', 'PROMPT_BLOCKED', 'STYLE_TRANSFER_REQUEST_FAILED', 'WORKFLOW_STEP_FAILED'],
          prevention: '启动工作流前确认图片为有效 PNG/JPG、网络连接稳定、Prompt 覆盖中无敏感词汇、API Key 有效。',
        },
        {
          code: 'WORKFLOW_NOT_FOUND',
          message: '重做或下载时提示「这个工作流记录已不存在」',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：paper2gal → 区域：右栏步骤卡片 / 错误面板',
          cause: '后端（特别是 Zeabur 等无服务器平台）重新部署或重启后，没有把 WORKFLOW_STATE_DIR 挂载到持久化硬盘，旧的 wf_* 状态文件被清空。',
          solution: '重新启动一个新工作流。',
          steps: [
            '这是一个后端存储问题，无法恢复旧工作流',
            '点击「开始」用当前图片启动一个新工作流',
            '如果需要保留历史工作流，联系后端管理员在 Zeabur/服务器上设置 WORKFLOW_STATE_DIR、OUTPUT_DIR、UPLOAD_DIR 的持久化硬盘挂载',
          ],
          relatedCodes: ['P2G_WORKFLOW_ERROR', 'BACKEND_UNAVAILABLE'],
          prevention: '使用 Zeabur 等无服务器平台时，务必配置持久化硬盘挂载；重要素材生成后及时点击「下载全部」备份到本地。',
        },
        {
          code: 'WORKFLOW_STEP_FAILED',
          message: '某个步骤卡片显示为「失败」状态',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：paper2gal → 区域：右栏步骤列表',
          cause: '该具体步骤执行时出错。常见原因：模型不可用、Prompt 被拦截、网络超时、后端资源不足。',
          solution: '查看步骤详情并单独重试。',
          steps: [
            '点击失败步骤卡片查看错误详情（error 字段）',
            '根据错误信息排查（如修改 Prompt、检查网络、更换模型）',
            '点击该步骤卡片上的「重试步骤」按钮单独重试',
            '如果多次重试仍失败，联系后端管理员',
          ],
          relatedCodes: ['P2G_WORKFLOW_ERROR', 'PROMPT_BLOCKED', 'API_TIMEOUT'],
          prevention: '某步骤失败后查看错误详情，根据提示修改对应 Prompt 或检查网络后重试。',
        },
        {
          code: 'REDO_CONFLICT',
          message: '点击重做时提示「这个结果已经在重做中」',
          severity: 'info',
          category: 'E. 工作流与转换',
          location: '页面：paper2gal → 区域：步骤卡片 / 结果卡片',
          cause: '当前步骤或其冲突组中的另一个步骤正在重做中。例如，重做 expression_thinking 时，对应的 cutout_expression_thinking 也会进入重做状态，此时再次点击会提示冲突。',
          solution: '等待当前重做完成后再操作。',
          steps: [
            '观察页面消息条，确认重做进度',
            '等待该步骤状态从「重做中」变为「成功」或「失败」',
            '如果重做长时间无响应，刷新页面后重试',
          ],
          relatedCodes: ['WORKFLOW_STEP_FAILED'],
          prevention: '不要对同一冲突组内的步骤同时发起多个重做请求；等待一个完成后再发起下一个。',
        },
        {
          code: 'WORKFLOW_CANCELLED',
          message: '工作流状态显示为已取消',
          severity: 'info',
          category: 'E. 工作流与转换',
          location: '页面：paper2gal → 区域：右栏进度区',
          cause: '用户手动取消了工作流，或后端因资源限制主动取消了任务。',
          solution: '重新启动工作流。',
          steps: [
            '确认是否是自己点击了取消',
            '如果不是，可能是后端资源不足',
            '等待几分钟后重新点击「开始」',
          ],
          relatedCodes: ['P2G_WORKFLOW_ERROR'],
        },
        {
          code: '429_TOO_MANY_REQUESTS',
          message: '提示请求过于频繁（Rate Limit）',
          severity: 'warning',
          category: 'A. API 与网络',
          location: '页面：paper2gal → 区域：顶部消息条 / 右栏错误面板',
          cause: '工作流并发执行时发送了过多请求，超过了服务商的速率限制。',
          solution: '关闭 AI 并发或等待后重试。',
          steps: [
            '在左栏设置面板关闭「AI 并发」开关',
            '等待 1~2 分钟',
            '重新启动工作流',
          ],
          relatedCodes: ['API_RATE_LIMIT'],
          prevention: '使用速率限制较严的 API Key 时，建议关闭 AI 并发；避免在短时间内重复启动多个工作流。',
        },
        {
          code: '500_INTERNAL_ERROR',
          message: '后端返回 500 内部服务器错误',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：paper2gal → 区域：顶部消息条 / 右栏错误面板',
          cause: '后端服务在处理请求时发生内部异常。可能是模型加载失败、GPU 内存不足、或代码 Bug。',
          solution: '稍后重试或联系后端管理员。',
          steps: [
            '等待 2 分钟',
            '降低上传图片尺寸后重试',
            '如果问题持续，联系后端管理员查看服务器日志',
          ],
          relatedCodes: ['502_BAD_GATEWAY', '503_SERVICE_UNAVAILABLE'],
          prevention: '降低请求规模（图像尺寸）；避免在服务器高负载时提交大任务。',
        },
        {
          code: '502_BAD_GATEWAY',
          message: '后端返回 502 Bad Gateway',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：paper2gal → 区域：顶部消息条 / 右栏错误面板',
          cause: '反向代理（如 Nginx）无法连接到后端应用服务器。可能是后端进程崩溃或未启动。',
          solution: '检查后端服务状态。',
          steps: [
            '如果是本地部署，确认后端进程是否在运行',
            '检查后端服务端口是否被占用',
            '查看后端日志确认是否有启动错误',
            '重启后端服务后重试',
          ],
          relatedCodes: ['503_SERVICE_UNAVAILABLE', 'BACKEND_UNAVAILABLE'],
          prevention: '本地部署时确认后端进程在运行；检查反向代理配置。',
        },
        {
          code: '503_SERVICE_UNAVAILABLE',
          message: '后端返回 503 Service Unavailable',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：paper2gal → 区域：顶部消息条 / 右栏错误面板',
          cause: '后端服务暂时不可用，可能正在进行维护、重启、或过载保护。',
          solution: '稍后重试。',
          steps: [
            '等待 2~3 分钟后重试',
            '检查后端服务状态页面（如果有）',
            '联系后端管理员确认是否在维护',
          ],
          relatedCodes: ['502_BAD_GATEWAY', 'BACKEND_UNAVAILABLE'],
          prevention: '避开服务器维护时段操作；高负载时降低请求频率。',
        },
        {
          code: 'FRONTEND_CUTOUT_SPAWN_FAILED',
          message: '抠图步骤报错，提示浏览器端抠图资源无法加载',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：paper2gal → 区域：右栏步骤卡片 / 错误面板',
          cause: '浏览器端 IMG.LY 模型资源无法加载，或当前浏览器不支持所需的 WebGL/WASM 能力。',
          solution: '刷新页面重试，或换用现代浏览器。',
          steps: [
            '刷新页面后重新触发浏览器端抠图',
            '确认浏览器为 Chrome/Firefox/Edge 等现代浏览器（IE 和旧版 Safari 不支持）',
            '检查浏览器是否禁用了 WebGL 或 WASM',
            '如果是 Docker 部署，确认镜像已正确构建（Dockerfile 已包含模型资源）',
          ],
          relatedCodes: ['FRONTEND_CUTOUT_EXECUTION_FAILED'],
          prevention: '使用现代浏览器（Chrome/Firefox/Edge 最新版）；不要禁用 WebGL 或 WASM。',
        },
        {
          code: 'FRONTEND_CUTOUT_TIMEOUT',
          message: '抠图步骤长时间无响应后失败',
          severity: 'error',
          category: 'F. 系统与权限',
          location: '页面：paper2gal → 区域：右栏步骤卡片 / 错误面板',
          cause: '浏览器端抠图处理超时。可能是图片过大、设备 CPU/RAM 不足、或模型资源加载缓慢。',
          solution: '缩小图片或提升设备性能。',
          steps: [
            '重新上传一张最大边不超过 2048 像素的图片',
            '关闭其他浏览器标签页释放内存',
            '关闭「AI 并发」让步骤串行执行，减少资源竞争',
            '重试',
          ],
          relatedCodes: ['FRONTEND_CUTOUT_EXECUTION_FAILED', 'DEVICE_MEMORY_LOW'],
          prevention: '上传前将图片压缩到合理尺寸（建议 1024~2048px）；确保设备有足够内存。',
        },
        {
          code: 'FRONTEND_CUTOUT_EXECUTION_FAILED',
          message: '抠图步骤报错，提示浏览器端抠图执行失败',
          severity: 'error',
          category: 'F. 系统与权限',
          location: '页面：paper2gal → 区域：右栏步骤卡片 / 错误面板',
          cause: '浏览器端抠图处理图片时发生内部错误。可能是图片格式损坏、不支持的编码、或 IMG.LY 模型异常。',
          solution: '更换图片后重试。',
          steps: [
            '确认表情图片已成功生成（点击步骤卡片查看 output_url）',
            '如果源图片损坏，重新上传一张新的 PNG/JPG 图片',
            '在该步骤卡片上点击「重做」单独重试抠图',
            '如果浏览器抠图持续失败，联系后端管理员将 remove_background 提供商切换到后端服务',
          ],
          relatedCodes: ['FRONTEND_CUTOUT_SPAWN_FAILED', 'FRONTEND_CUTOUT_TIMEOUT'],
          prevention: '上传标准格式的 PNG/JPG 图片；避免使用特殊编码或损坏的图片文件。',
        },
        {
          code: 'FRONTEND_CUTOUT_SOURCE_MISSING',
          message: '抠图步骤报错，提示找不到源图片',
          severity: 'error',
          category: 'F. 系统与权限',
          location: '页面：paper2gal → 区域：右栏步骤卡片 / 错误面板',
          cause: '上游表情生成步骤失败，导致浏览器端抠图没有输入文件可处理。',
          solution: '先排查并修复表情生成步骤的错误，再重试抠图。',
          steps: [
            '检查表情生成步骤（thinking / surprise / angry）的错误信息',
            '修复表情生成的问题（通常是 API Key 无效、Prompt 被拦截或网络问题）',
            '确认表情图片已成功生成后，再对抠图步骤点击「重做」',
          ],
          relatedCodes: ['WORKFLOW_STEP_FAILED'],
          prevention: '确保表情生成步骤成功后再进行抠图；工作流会自动按顺序执行，不要跳过步骤。',
        },
        {
          code: 'FRONTEND_CUTOUT_OUTPUT_MISSING',
          message: '浏览器端抠图执行成功但未生成输出',
          severity: 'error',
          category: 'F. 系统与权限',
          location: '页面：paper2gal → 区域：右栏步骤卡片 / 错误面板',
          cause: '浏览器端抠图处理异常，可能生成了空数据或上传失败。',
          solution: '更换图片或刷新页面后重试。',
          steps: [
            '确认表情图片已成功生成',
            '刷新页面，让页面重新检测待处理的抠图任务',
            '如果仍然失败，重新上传新图片并启动新工作流',
          ],
          relatedCodes: ['FRONTEND_CUTOUT_EXECUTION_FAILED'],
          prevention: '确保输入图片格式正确；避免使用损坏或特殊编码的图片。',
        },
        {
          code: 'IMPORT_INVALID_JSON',
          message: '导入配置时提示「无效的 JSON 格式」',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：paper2gal → 区域：顶部「导入配置」按钮',
          cause: '文件内容损坏、不是 JSON 格式、或被其他程序修改过。',
          solution: '检查文件是否为有效的 UTF-8 编码文本文件。',
          steps: [
            '用文本编辑器打开要导入的 JSON 文件',
            '确认文件是有效的 UTF-8 编码，无乱码',
            '用 JSON 在线格式化工具验证',
            '如果文件损坏，尝试从历史备份中恢复',
          ],
          relatedCodes: ['IMPORT_TOOL_MISMATCH'],
          prevention: '妥善保管导出的配置文件，不要用非文本编辑器修改。',
        },
        {
          code: 'IMPORT_TOOL_MISMATCH',
          message: '导入配置时提示「工具类型不匹配」',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：paper2gal → 区域：顶部「导入配置」按钮',
          cause: '导入的 JSON 文件中 tool 字段不是 paper2gal，或不包含 promptOverrides 字段。',
          solution: '确认导入的是 paper2gal 页面导出的配置文件。',
          steps: [
            '用文本编辑器打开要导入的 JSON 文件',
            '确认文件包含 "tool": "paper2gal" 或直接包含 promptOverrides 字段',
            '如果不是，找到正确的 paper2gal 配置文件再导入',
          ],
          relatedCodes: ['IMPORT_INVALID_JSON'],
          prevention: '从 paper2gal 页面导出的配置文件才包含正确的 tool 字段。',
        },
        {
          code: 'LOCAL_STORAGE_FULL',
          message: '保存失败，提示浏览器存储空间不足',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：paper2gal → 区域：顶部「保存配置」按钮',
          cause: '浏览器 localStorage 存储空间已满（通常约 5~10MB）。工作流状态、Prompt 覆盖和历史记录可能占用较大空间。',
          solution: '清理浏览器存储空间或导出配置到本地文件。',
          steps: [
            '先点击「导出封装配置」将当前配置备份到本地文件',
            '按 Ctrl+Shift+I 打开开发者工具 → Application → Local Storage',
            '删除不再需要的键（尤其是包含工作流历史的大键）',
            '返回 paper2gal 重新点击「保存配置」',
          ],
          relatedCodes: ['STORAGE_READ_ONLY'],
          prevention: '定期清理浏览器 localStorage 中不再需要的数据；及时导出配置到本地文件备份。',
        },
        {
          code: 'STORAGE_READ_ONLY',
          message: '保存操作无反应，刷新后数据丢失',
          severity: 'critical',
          category: 'B. 配置与数据',
          location: '页面：paper2gal → 区域：顶部「保存配置」按钮',
          cause: '浏览器处于隐私/无痕模式，或 localStorage 被系统策略禁用，或磁盘空间已满导致浏览器将存储设为只读。',
          solution: '退出隐私模式或释放磁盘空间。',
          steps: [
            '确认浏览器不在无痕/隐私浏览模式（该模式通常禁用 localStorage）',
            '检查系统磁盘空间是否已满',
            '尝试在普通窗口中重新打开应用',
            '如果问题持续，使用「导出封装配置」功能将配置保存为本地文件作为替代方案',
          ],
          relatedCodes: ['LOCAL_STORAGE_FULL'],
          prevention: '避免在浏览器无痕/隐私模式中使用本应用；定期导出配置到本地文件作为备份。',
        },
        {
          code: 'UNSAVED_WARNING',
          message: '返回首页时提示「你还没保存当前页面内容」',
          severity: 'info',
          category: 'B. 配置与数据',
          location: '页面：paper2gal → 区域：左上角「返回首页」按钮',
          cause: '当前 Prompt 覆盖或 AI 并发设置与上次保存的快照不一致（isDirty 为 true）。你可能修改了配置但忘记保存。',
          solution: '根据需要选择保存或放弃。',
          steps: [
            '如果希望保留修改：点击弹窗中的「继续编辑」，回到页面点击「保存配置」，然后再返回首页',
            '如果不需要保留：点击弹窗中的「确认返回」',
          ],
        },
        {
          code: 'DEVICE_MEMORY_LOW',
          message: '浏览器标签页崩溃或无响应',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：paper2gal → 区域：整个页面',
          cause: '设备内存不足，浏览器强制终止了标签页进程。通常发生在处理超大图片（>4096 分辨率）或浏览器抠图模型加载时。',
          solution: '关闭其他标签页，降低图片尺寸，或换用内存更大的设备。',
          steps: [
            '保存当前工作（点击「保存配置」）',
            '关闭其他不用的浏览器标签页',
            '使用图片转换工具将图片最大边缩放到 2048 以下',
            '重启浏览器后重试',
            '如果问题持续，尝试在内存更大的设备上操作',
          ],
          relatedCodes: ['FILE_TOO_LARGE'],
          prevention: '处理大文件前关闭其他浏览器标签页；将图片最大边缩放到 2048 以下；低内存设备建议关闭 AI 并发。',
        },
      ],
    },
    {
      id: 'image-converter',
      title: '图片格式转换',
      overview: `图片格式转换是一个纯前端工具，用于上传图片并转换为 PNG 或 JPG 格式。支持亮度、对比度、饱和度、模糊、色相旋转、灰度六大滤镜调整，可控制输出质量和最大尺寸，支持保持原始宽高比。所有处理在浏览器本地完成，不会上传图片到任何服务器。


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
      buttons: [
        { name: '选择图片', description: '上传图片文件。支持 PNG、JPG 和 WEBP 格式。' },
        { name: '转换', description: '应用所有滤镜参数并生成输出图片。处理完全在浏览器本地完成。' },
        { name: '下载结果', description: '将转换后的图片下载到本地。文件名格式为 converted-{timestamp}.{ext}。' },
        { name: '复制日志', description: '将右侧日志面板的内容复制到剪贴板。' },
        { name: '下载日志', description: '将日志内容下载为文本文件。' },
        { name: '重刷', description: '清除上传的图片和结果，将所有滤镜参数重置为默认值。' },
      
        { name: '添加文件夹', description: '选择整个文件夹，自动导入其中所有支持的图片文件。' },
        { name: '预设配置', description: '保存当前的所有转换参数为一个预设，下次可一键加载。' },
        { name: '图片信息', description: '查看选中图片的详细元数据：EXIF、色彩配置文件、文件大小、分辨率等。' },
        { name: '预览对比', description: '显示转换前后的图片对比，支持放大查看细节差异。' },
        { name: '智能重命名', description: '使用模板批量重命名输出文件，支持序号、日期、原始名等变量。' },
        { name: '云同步', description: '将转换结果自动上传到配置的云存储服务（可选功能）。' },],
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
      
        { name: 'JPEG 质量', description: 'JPEG 输出质量，范围 60~100。100 为最高质量，60 文件最小但可能有明显压缩伪影。', tips: '网页展示 75-85，存档 90-95，打印 95-100。' },
        { name: 'PNG 压缩级别', description: 'PNG 的压缩强度，范围 0~9。0 最快但文件最大，9 最小但最慢。不影响图像质量。', tips: '一般用途 6，追求最小文件 9，追求速度 1-3。' },
        { name: 'WebP 质量', description: 'WebP 输出质量，范围 0~100。WebP 在相同质量下通常比 JPEG 小 25-35%。', tips: '网页展示 80-85，与 JPEG 质量设置相近即可。' },
        { name: '输出 DPI', description: '设置输出图像的 DPI（每英寸点数），范围 72~600。影响打印尺寸但不改变像素数。', tips: '屏幕显示 72-96，打印 150-300，高精度印刷 300-600。' },
        { name: '色彩空间', description: '输出色彩空间：sRGB（通用）、Adobe RGB（广色域印刷）、CMYK（四色印刷）、P3（Display P3 屏幕）。', tips: '网页/屏幕 sRGB，印刷 Adobe RGB 或 CMYK。' },
        { name: '插值算法', description: '缩放时使用的重采样算法：Nearest（最近邻，像素风）、Bilinear（双线性，平衡）、Bicubic（双三次，平滑）、Lanczos（兰索斯，最佳质量）。', tips: '照片推荐 Lanczos 或 Bicubic，像素艺术推荐 Nearest。' },
        { name: '批量重命名模板', description: '批量处理时的文件名模板，支持 {name}、{index}、{date}、{width}、{height} 等变量。', tips: '示例：{name}_converted_{index:03d} 生成 oc_001、oc_002...' },
        { name: '输出目录结构', description: '批量输出时的目录组织方式：扁平（所有文件放一起）、镜像（保持原目录结构）、按日期分组。', tips: '大量文件建议按日期分组，少量文件建议扁平。' },
        { name: '元数据处理', description: '输出时如何处理元数据：保留全部、剥离全部、仅保留版权、仅保留创建时间。', tips: '隐私敏感建议剥离全部，摄影作品建议保留版权。' },],
      errors: [
        {
          code: 'CONVERT_ERROR',
          message: '错误面板上显示「CONVERT_ERROR」',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：图片格式转换 → 区域：右栏错误面板',
          cause: '图片转换过程中发生异常。可能是源图片损坏、浏览器 Canvas 2D filter 不支持、或内存不足。',
          solution: '排查图片和浏览器兼容性。',
          steps: [
            '确认源图片能在浏览器正常打开',
            '尝试刷新页面后重新上传',
            '检查图片是否过大',
            '逐个关闭滤镜排查不支持的滤镜',
            '尝试换用其他浏览器',
          ],
          relatedCodes: ['FILE_CORRUPTED', 'DEVICE_MEMORY_LOW'],
          prevention: '转换前确认图片能在浏览器正常打开；避免同时开启过多滤镜。',
        },
        {
          code: 'CONVERT_FILTER_UNSUPPORTED',
          message: '应用某些滤镜后输出结果异常（如全黑/全白）',
          severity: 'warning',
          category: 'E. 工作流与转换',
          location: '页面：图片格式转换 → 区域：中央预览区 / 右栏错误面板',
          cause: '当前浏览器对 Canvas 2D filter 属性支持不完整。Safari 和某些旧版浏览器对 filter 的支持有已知问题。',
          solution: '关闭不支持的滤镜或换用浏览器。',
          steps: [
            '将所有滤镜值重置为默认值（亮度/对比度/饱和度=100，模糊/色相旋转/灰度=0）',
            '逐个开启滤镜测试，找出导致异常的滤镜',
            '关闭有问题的滤镜',
            '或换用 Chrome/Firefox 等支持完整的浏览器',
          ],
          relatedCodes: ['CONVERT_ERROR'],
        },
        {
          code: 'DEVICE_MEMORY_LOW',
          message: '转换时浏览器卡死或崩溃',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：图片格式转换 → 区域：整个页面',
          cause: '处理超大图片时浏览器内存不足。',
          solution: '缩小图片或关闭其他标签页。',
          steps: [
            '关闭其他浏览器标签页',
            '降低「最大宽度」和「最大高度」值',
            '刷新页面后重新上传',
          ],
          relatedCodes: ['FILE_TOO_LARGE'],
          prevention: '处理大文件前关闭其他浏览器标签页；将图片最大边缩放到 2048 以下。',
        },
        {
          code: 'FILE_CORRUPTED',
          message: '上传后预览空白',
          severity: 'warning',
          category: 'C. 文件与输入',
          location: '页面：图片格式转换 → 区域：左栏预览区',
          cause: '图片损坏。',
          solution: '更换图片。',
          steps: [
            '在系统查看器中确认图片可正常打开',
            '重新下载或导出图片',
            '重新上传',
          ],
          relatedCodes: ['CONVERT_ERROR'],
        },
        {
          code: 'FILE_FORMAT_UNSUPPORTED',
          message: '上传后无反应',
          severity: 'warning',
          category: 'C. 文件与输入',
          location: '页面：图片格式转换 → 区域：左栏「选择图片」按钮',
          cause: '选择了不支持的格式（如 SVG、PSD）。',
          solution: '转换为支持的格式。',
          steps: [
            '使用图片编辑工具导出为 PNG/JPG/WEBP',
            '重新上传',
          ],
          relatedCodes: ['FILE_CORRUPTED'],
        },
        {
          code: 'FILE_TOO_LARGE',
          message: '转换时卡顿或崩溃',
          severity: 'warning',
          category: 'C. 文件与输入',
          location: '页面：图片格式转换 → 区域：左栏预览区',
          cause: '图片尺寸过大。',
          solution: '缩小图片。',
          steps: [
            '使用其他工具将图片最大边缩放到 4096 以下',
            '重新上传',
          ],
          relatedCodes: ['DEVICE_MEMORY_LOW'],
        },
        {
          code: 'IMPORT_INVALID_JSON',
          message: '导入配置时提示「无效的 JSON 格式」',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：图片格式转换 → 区域：顶部「导入配置」按钮',
          cause: '文件损坏。',
          solution: '检查文件。',
          steps: [
            '用文本编辑器打开文件',
            '确认包含 "tool": "image-converter"',
            '重新导入',
          ],
          relatedCodes: ['IMPORT_TOOL_MISMATCH'],
        },
        {
          code: 'IMPORT_TOOL_MISMATCH',
          message: '导入配置时提示「工具类型不匹配」',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：图片格式转换 → 区域：顶部「导入配置」按钮',
          cause: 'tool 字段不正确。',
          solution: '确认导入正确的文件。',
          steps: [
            '用文本编辑器打开文件',
            '确认 tool 字段值为 "image-converter"',
            '重新导入',
          ],
          relatedCodes: ['IMPORT_INVALID_JSON'],
        },
        {
          code: 'STORAGE_READ_ONLY',
          message: '保存无反应',
          severity: 'critical',
          category: 'B. 配置与数据',
          location: '页面：图片格式转换 → 区域：顶部保存相关按钮',
          cause: '无痕模式。',
          solution: '退出无痕模式。',
          steps: [
            '确认不在无痕模式',
            '导出配置到文件备份',
          ],
          relatedCodes: ['LOCAL_STORAGE_FULL'],
          prevention: '避免在浏览器无痕/隐私模式中使用本应用；定期导出配置到本地文件作为备份。',
        },
        {
          code: 'LOCAL_STORAGE_FULL',
          message: '保存失败',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：图片格式转换 → 区域：顶部保存相关按钮',
          cause: '存储空间不足。',
          solution: '清理或导出。',
          steps: [
            '导出当前配置到文件',
            '清理 localStorage',
            '重新保存',
          ],
          relatedCodes: ['STORAGE_READ_ONLY'],
          prevention: '定期清理浏览器 localStorage 中不再需要的数据；大文件不要直接保存在编辑器中，改用导出功能。',
        },
        {
          code: 'UNSAVED_WARNING',
          message: '刷新页面时弹出未保存警告',
          severity: 'info',
          category: 'B. 配置与数据',
          location: '页面：图片格式转换 → 区域：整个页面',
          cause: '参数被修改但未保存。',
          solution: '保存或放弃。',
          steps: [
            '点击保存按钮',
            '或确认放弃修改后刷新',
          ],
        },
      ],
    },
    {
      id: 'audio-editor',
      title: 'Audio Editor',
      overview: `The Audio Editor is a comprehensive waveform-based audio editing tool. Import audio files (MP3, WAV, OGG, FLAC, M4A, AAC, WEBM) and visualize the full waveform on an interactive canvas. Edit with precision using region selection, trim, split, duplicate, and delete operations. Apply a rich suite of real-time effects including volume/gain, playback speed, pitch shift, fade in/out, reverse, EQ, compressor, reverb, stereo panning, noise reduction, and normalization.

Key capabilities:
· Waveform Visualization — Full audio waveform rendered on a high-resolution canvas with zoom (1x–50x) and pan support
· Region Selection — Click and drag on the waveform to select a time range for targeted edits
· Trim / Split / Delete / Duplicate — Standard editing operations applied to the selected region or playhead position
· Volume & Pan — Gain from 0% to 200%, mute toggle, and stereo panning left/right
· Speed & Pitch — Playback speed 25%–400%, pitch shift ±1200 cents (±1 octave), reverse playback
· Fade — Adjustable fade-in and fade-out durations (0–10 seconds)
· 3-Band EQ — Independent low, mid, and high frequency gain controls (-12dB to +12dB)
· Compressor — Threshold, ratio, attack, and release parameters for dynamic range control
· Reverb — Room size, damping, and wet/dry mix for spatial ambience
· Noise Reduction & Normalize — Reduce background noise and normalize peak levels
· Multi-Format Export — WAV (8/16/32-bit), WebM/Opus, OGG/Opus, MP3, MP4/AAC (browser-dependent)
· Results Panel — Browse, preview, and re-download all exported files
· Workflow Logs — Timestamped debug log of every import, edit, and export action
· Keyboard Shortcuts — Space to play/pause, Ctrl+Z to undo, Ctrl+Shift+Z to redo`,
      buttons: [
        { name: 'Play / Pause', description: 'Start or pause playback from the current playhead position. Playback respects speed, pitch, loop, and mute settings.' },
        { name: 'Stop', description: 'Stop playback and reset the playhead to the beginning of the audio.' },
        { name: 'Undo', description: 'Revert the last destructive edit (trim, split, delete, duplicate, reverse, fade, normalize, mono). Up to the full edit history is preserved.' },
        { name: 'Redo', description: 'Re-apply the most recently undone edit action.' },
        { name: 'Trim', description: 'Keep only the selected region and discard everything else. The audio is shortened to the selection boundaries.' },
        { name: 'Split', description: 'Split the audio at the start of the selected region, creating two clips. Only the first clip is retained for further editing.' },
        { name: 'Delete', description: 'Remove the selected region from the audio and automatically join the remaining left and right segments.' },
        { name: 'Duplicate', description: 'Copy the selected region and append it to the end of the audio.' },
        { name: 'Reverse', description: 'Reverse the entire audio buffer so it plays backwards.' },
        { name: 'Fade', description: 'Apply the configured fade-in and fade-out curves to the entire audio buffer.' },
        { name: 'Normalize', description: 'Analyze the entire buffer and scale the amplitude so the loudest peak reaches 99.9% without clipping.' },
        { name: 'Mono', description: 'Mix all channels down to a single mono channel by averaging sample values.' },
        { name: 'Export', description: 'Render all applied effects into the selected format and trigger a browser download. Supported formats include WAV 8/16/32-bit, WebM/Opus, OGG/Opus, MP3, and MP4/AAC depending on browser capabilities.' },
        { name: 'New File', description: 'Import a new audio file to replace the current project. The previous edit history is cleared.' },
      ],
      parameters: [
        { name: 'Volume', description: 'Master output gain from 0% (silent) to 200% (double amplitude). Applies during playback and export.', tips: 'Values above 100% may cause distortion if the source already peaks near 0dBFS.' },
        { name: 'Mute', description: 'Silences playback output without changing the underlying buffer data.', tips: 'Useful for A/B comparison when toggling effects.' },
        { name: 'Pan (L/R)', description: 'Stereo panning from -100 (full left) through 0 (center) to +100 (full right).', tips: 'Only audible on stereo systems or headphones.' },
        { name: 'Speed', description: 'Playback speed percentage from 25% (quarter speed) to 400% (quadruple speed).', tips: 'Changing speed also stretches or compresses time. Pitch can be controlled independently via the Pitch parameter.' },
        { name: 'Pitch (cents)', description: 'Pitch shift in cents from -1200 (one octave down) to +1200 (one octave up).', tips: '100 cents = 1 semitone. Use small values (+/-50) for subtle tuning corrections.' },
        { name: 'Reverse', description: 'When enabled, the audio plays backwards from end to start.', tips: 'Destructive reverse is applied on export; real-time reverse is applied during playback.' },
        { name: 'Loop', description: 'When enabled, playback loops continuously within the selected region (or the full audio if no selection).', tips: 'Set loop boundaries by selecting a region before enabling loop.' },
        { name: 'Fade In', description: 'Duration of the linear fade-in ramp at the start of the audio, from 0 to 10 seconds.', tips: 'A gentle fade-in of 0.1–0.5s is recommended for voice to avoid plosive pops.' },
        { name: 'Fade Out', description: 'Duration of the linear fade-out ramp at the end of the audio, from 0 to 10 seconds.', tips: 'Match fade-out duration to reverb tail if using reverb to avoid abrupt cutoff.' },
        { name: 'EQ Low Gain', description: 'Low-frequency shelf gain from -12dB to +12dB, centered around 200Hz.', tips: 'Boost for warmth and body; cut to reduce rumble or microphone handling noise.' },
        { name: 'EQ Mid Gain', description: 'Mid-frequency peaking gain from -12dB to +12dB, centered around 1kHz.', tips: 'Boost for vocal presence and intelligibility; cut to reduce harshness.' },
        { name: 'EQ High Gain', description: 'High-frequency shelf gain from -12dB to +12dB, centered around 5kHz.', tips: 'Boost for air and brightness; cut to reduce hiss or sibilance.' },
        { name: 'Compressor Threshold', description: 'Level in dBFS at which the compressor begins reducing gain, from -60dB to 0dB.', tips: 'Set threshold slightly below the average peak level of the loudest parts.' },
        { name: 'Compressor Ratio', description: 'Compression ratio from 1:1 (no compression) to 20:1 (heavy limiting).', tips: '4:1 is a versatile starting point for voice and music.' },
        { name: 'Compressor Attack', description: 'Time in milliseconds for the compressor to respond after the threshold is exceeded, from 0ms to 100ms.', tips: 'Fast attack (0–5ms) tames transients; slower attack (10–30ms) preserves punch.' },
        { name: 'Compressor Release', description: 'Time in milliseconds for the compressor to stop compressing after the signal drops below threshold, from 0ms to 500ms.', tips: 'Longer release (100–300ms) sounds more natural on sustained notes.' },
        { name: 'Reverb Room Size', description: 'Simulated room size percentage from 0% (no reverb) to 100% (cathedral-like).', tips: '30–50% simulates a small studio; 70–90% simulates a concert hall.' },
        { name: 'Reverb Damping', description: 'High-frequency absorption percentage from 0% (bright reflections) to 100% (dark/muffled).', tips: 'Higher damping simulates soft furnishings; lower damping simulates hard surfaces.' },
        { name: 'Reverb Wet/Dry', description: 'Blend between dry (original) signal and wet (reverberant) signal, from 0% to 100%.', tips: '20–30% wet mix adds subtle depth without washing out the source.' },
        { name: 'Noise Reduction', description: 'Intensity of noise gate/suppression from 0% (off) to 100% (aggressive). Applied during export.', tips: 'High values may remove quiet details along with noise. Use sparingly.' },
        { name: 'Normalize', description: 'When enabled, the exported audio is normalized to peak at 99.9% of digital full scale.', tips: 'Normalization is non-destructive preview; it is only baked into the exported file.' },
        { name: 'Export Format', description: 'Choose the output file format. WAV variants are universally supported. WebM/Opus, OGG, MP3, and MP4 availability depends on the browser\'s MediaRecorder implementation.', tips: 'WAV 16-bit is the safest choice for maximum compatibility. WebM/Opus offers the best compression-to-quality ratio.' },
      ],
      errors: [
        {
          code: 'IMPORT_FAILED',
          message: 'Failed to decode audio file',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Audio Editor → Area: Import dropzone',
          cause: 'The selected file is not a valid audio format, is corrupted, or uses an unsupported codec.',
          solution: 'Use a supported format (MP3, WAV, OGG, FLAC, M4A, AAC, WEBM) and ensure the file is not corrupted.',
          steps: ['Check file extension', 'Try re-exporting from your DAW', 'Convert to WAV using an external tool'],
          relatedCodes: ['FILE_TOO_LARGE'],
          prevention: 'Always verify audio files play correctly in a media player before importing.',
        },
        {
          code: 'AUDIO_CONTEXT_FAILED',
          message: 'Web Audio API initialization failed',
          severity: 'critical',
          category: 'F. Browser & Performance',
          location: 'Page: Audio Editor → Area: Entire page',
          cause: 'The browser blocked AudioContext creation due to autoplay policy, or the device lacks audio hardware.',
          solution: 'Click anywhere on the page first to unlock audio, then reload.',
          steps: ['Click on the page canvas', 'Check browser permissions', 'Reload the page'],
          relatedCodes: ['BROWSER_NOT_SUPPORTED'],
          prevention: 'Ensure the app is opened via a user gesture (click) rather than automatic redirect.',
        },
        {
          code: 'TRIM_NO_SELECTION',
          message: 'Cannot trim without a selection',
          severity: 'warning',
          category: 'B. Settings & Data',
          location: 'Page: Audio Editor → Area: Toolbar',
          cause: 'The Trim button was clicked but no time region is currently selected on the waveform.',
          solution: 'Click and drag on the waveform to select a region, then click Trim.',
          steps: ['Click on the waveform canvas', 'Drag to define start and end', 'Click the Trim button'],
          relatedCodes: ['SPLIT_NO_SELECTION'],
          prevention: 'Always verify the selection highlight is visible before applying region-based edits.',
        },
        {
          code: 'SPLIT_NO_SELECTION',
          message: 'Cannot split without a selection',
          severity: 'warning',
          category: 'B. Settings & Data',
          location: 'Page: Audio Editor → Area: Toolbar',
          cause: 'The Split button was clicked but no time region is selected.',
          solution: 'Select a region on the waveform first, then click Split.',
          steps: ['Select a region on the waveform', 'Click Split'],
          relatedCodes: ['TRIM_NO_SELECTION'],
          prevention: 'Same as TRIM_NO_SELECTION.',
        },
        {
          code: 'EXPORT_NO_AUDIO',
          message: 'Nothing to export',
          severity: 'warning',
          category: 'B. Settings & Data',
          location: 'Page: Audio Editor → Area: Export button',
          cause: 'The Export button was clicked before any audio file was imported.',
          solution: 'Import an audio file first using the dropzone or New File button.',
          steps: ['Click the upload dropzone', 'Select an audio file', 'Wait for waveform to load'],
          relatedCodes: ['IMPORT_FAILED'],
          prevention: 'The export button is disabled when no audio is loaded; this error may appear from programmatic calls.',
        },
        {
          code: 'EXPORT_FAILED',
          message: 'Export failed',
          severity: 'error',
          category: 'F. Browser & Performance',
          location: 'Page: Audio Editor → Area: Export section',
          cause: 'The browser does not support the selected export format, or MediaRecorder failed to capture the audio stream.',
          solution: 'Try a different format (WAV 16-bit is universally supported) or use a different browser.',
          steps: ['Select WAV 16-bit format', 'Click Export again', 'If still failing, reload the page'],
          relatedCodes: ['FORMAT_NOT_SUPPORTED', 'MEDIA_RECORDER_ERROR'],
          prevention: 'Always check the browser\'s supported format list in the format dropdown before exporting.',
        },
        {
          code: 'FORMAT_NOT_SUPPORTED',
          message: 'Selected export format not supported',
          severity: 'warning',
          category: 'F. Browser & Performance',
          location: 'Page: Audio Editor → Area: Export format dropdown',
          cause: 'The browser does not implement the selected MIME type for MediaRecorder (e.g., MP3 on Safari).',
          solution: 'Choose WAV 16-bit PCM, which is guaranteed to work on all browsers.',
          steps: ['Open the Format dropdown', 'Select WAV 16-bit PCM', 'Click Export'],
          relatedCodes: ['EXPORT_FAILED'],
          prevention: 'WAV formats are native and do not rely on MediaRecorder; they are the safest choice.',
        },
        {
          code: 'UNDO_EMPTY',
          message: 'Nothing to undo',
          severity: 'info',
          category: 'B. Settings & Data',
          location: 'Page: Audio Editor → Area: Toolbar',
          cause: 'The Undo button was clicked but the edit history is empty (only the original imported file exists).',
          solution: 'Make an edit first (trim, fade, reverse, etc.) before using undo.',
          steps: ['Apply an edit', 'Click Undo'],
          relatedCodes: ['REDO_EMPTY'],
          prevention: 'N/A — this is normal user behavior.',
        },
        {
          code: 'REDO_EMPTY',
          message: 'Nothing to redo',
          severity: 'info',
          category: 'B. Settings & Data',
          location: 'Page: Audio Editor → Area: Toolbar',
          cause: 'The Redo button was clicked but there are no undone actions to re-apply.',
          solution: 'Undo an action first, then click Redo.',
          steps: ['Click Undo', 'Click Redo'],
          relatedCodes: ['UNDO_EMPTY'],
          prevention: 'N/A — this is normal user behavior.',
        },
        {
          code: 'PLAYBACK_ERROR',
          message: 'Playback failed',
          severity: 'error',
          category: 'F. Browser & Performance',
          location: 'Page: Audio Editor → Area: Playback controls',
          cause: 'The AudioBufferSourceNode failed to start, usually because the AudioContext was suspended or the buffer was garbage-collected.',
          solution: 'Click anywhere on the page to resume the AudioContext, then try playing again.',
          steps: ['Click on the waveform', 'Press Space or click Play'],
          relatedCodes: ['AUDIO_CONTEXT_FAILED'],
          prevention: 'Avoid rapid start/stop clicking; allow at least 100ms between play commands.',
        },
        {
          code: 'WAVEFORM_RENDER_ERROR',
          message: 'Waveform rendering failed',
          severity: 'warning',
          category: 'F. Browser & Performance',
          location: 'Page: Audio Editor → Area: Waveform canvas',
          cause: 'The canvas context was lost, or the audio buffer is too large to process in a single frame.',
          solution: 'Reload the page. For very large files (>30min), consider trimming before detailed editing.',
          steps: ['Reload the page', 'Import a shorter audio segment'],
          relatedCodes: ['AUDIO_CONTEXT_FAILED'],
          prevention: 'Keep individual editing sessions under 30 minutes of audio. Split long recordings first.',
        },
        {
          code: 'STORAGE_FULL',
          message: 'Browser storage full',
          severity: 'error',
          category: 'F. Browser & Performance',
          location: 'Page: Audio Editor → Area: Export / Download',
          cause: 'The browser disk quota is exceeded, preventing the WAV blob from being created.',
          solution: 'Free up disk space or use a different browser profile.',
          steps: ['Clear browser cache', 'Close other tabs', 'Restart browser'],
          relatedCodes: ['EXPORT_NO_AUDIO'],
          prevention: 'Export shorter clips or lower-bitrate formats when disk space is limited.',
        },
      ],
    },
    {
      id: 'audio-converter',
      title: '音频格式转换器',
      overview: `音频格式转换器是一款专用的音频格式转换工具。导入音频文件（MP3、WAV、OGG、FLAC、M4A、AAC、WEBM），并通过完全控制编码参数将其转换为多种输出格式。该工具完全在浏览器中使用 Web Audio API 处理音频 — 无需上传到服务器。

Key capabilities:
· Multi-Format Import — Supports MP3, WAV, OGG, FLAC, M4A, AAC, and WEBM audio files
· Output Format Selection — WAV 8/16/24/32-bit PCM, FLAC (WAV container), WebM/Opus, OGG/Opus, MP3, MP4/AAC (browser-dependent)
· Sample Rate Control — Keep original or resample to 22050, 44100, 48000, 96000, or 192000 Hz
· Channel Configuration — Preserve original channels, force mono, or force stereo
· Volume Adjustment — Scale amplitude from 0% to 200% before export
· Speed & Pitch — Adjust playback speed 25%–400% and pitch shift ±1200 cents (±1 octave)
· Fade In/Out — Apply linear fade ramps from 0 to 10 seconds at the start and end
· Noise Reduction — Reduce background noise with adjustable intensity (0–100%)
· Peak Normalization — Normalize the loudest peak to 99.9% of digital full scale
· Real-Time Preview — Preview the converted result before downloading
· Progress Tracking — Visual progress bar during conversion with step-by-step logging
· Workflow Logs — Timestamped log of every import, conversion, and download action
· Error Panel — Detailed error messages with codes, causes, and solutions`,
      buttons: [
        { name: 'Choose File / Replace', description: 'Open the file picker to import an audio file, or replace the currently loaded file with a new one.' },
        { name: 'Convert', description: 'Start the conversion process with the selected output format and processing parameters. Displays a progress bar during processing.' },
        { name: 'Download', description: 'Save the converted audio file to your local device. Available after conversion completes successfully.' },
        { name: 'Reset', description: 'Clear the current source file, conversion settings, and result. Returns the page to its initial empty state.' },
        { name: 'Open Audio Editor', description: 'Switch to the Audio Editor page to perform advanced waveform-based editing on the current or a new audio file.' },
        { name: 'Normalize Peak', description: 'Toggle peak normalization. When enabled, the audio is normalized so the loudest sample reaches 99.9% of full scale before export.' },
        { name: 'Copy Logs', description: 'Copy the entire workflow log to the clipboard as plain text.' },
        { name: 'Download Logs', description: 'Export the workflow log as a .txt file for troubleshooting or record keeping.' },
      ],
      parameters: [
        { name: 'Output Format', description: 'Select the target audio format. WAV variants are universally supported. WebM/Opus, OGG/Opus, MP3, and MP4/AAC availability depends on the browser.', tips: 'WAV 16-bit PCM is the safest choice for maximum compatibility. FLAC preserves full quality with smaller file size.' },
        { name: 'Sample Rate', description: 'Choose the output sample rate. "Original" preserves the source rate. Other options resample to the selected rate.', tips: 'CD quality is 44100 Hz. Use 48000 Hz for video production. Higher rates (96000+) are useful for archival but create larger files.' },
        { name: 'Channels', description: 'Set the output channel layout. "Original" keeps the source channel count. "Mono" mixes all channels to one. "Stereo" duplicates mono to two channels or keeps stereo.', tips: 'Choose Mono for voice recordings to reduce file size. Choose Stereo for music and spatial content.' },
        { name: 'Volume', description: 'Adjust the output amplitude from 0% (silent) to 200% (double amplitude). Applied before export.', tips: 'Values above 100% may cause clipping if the source already peaks near 0dBFS. Use Normalize Peak to prevent clipping.' },
        { name: 'Speed', description: 'Adjust playback speed from 25% (quarter speed) to 400% (quadruple speed). Changes duration proportionally.', tips: 'Speed adjustment uses time-stretching to preserve pitch unless Pitch is also changed.' },
        { name: 'Pitch', description: 'Shift pitch in cents from -1200 (one octave down) to +1200 (one octave up).', tips: '100 cents = 1 semitone. Small values (+/-50) are useful for subtle tuning corrections.' },
        { name: 'Fade In', description: 'Duration of the linear fade-in ramp at the start of the audio, from 0 to 10 seconds.', tips: 'A gentle fade-in of 0.1–0.5s is recommended for voice to avoid plosive pops.' },
        { name: 'Fade Out', description: 'Duration of the linear fade-out ramp at the end of the audio, from 0 to 10 seconds.', tips: 'Match fade-out duration to reverb tail if using reverb to avoid abrupt cutoff.' },
        { name: 'Noise Reduction', description: 'Intensity of noise suppression from 0% (off) to 100% (aggressive). Applied during conversion.', tips: 'High values may remove quiet details along with noise. Use sparingly (10–30%) for best results.' },
        { name: 'Normalize Peak', description: 'When enabled, the audio is analyzed and scaled so the loudest peak reaches 99.9% of digital full scale.', tips: 'Normalization is applied after all other processing steps (volume, fade, noise reduction).' },
      ],
      errors: [
        {
          code: 'IMPORT_FAILED',
          message: 'Failed to decode audio file',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Audio Converter → Area: Import dropzone',
          cause: 'The selected file is not a valid audio format, is corrupted, or uses an unsupported codec.',
          solution: 'Use a supported format (MP3, WAV, OGG, FLAC, M4A, AAC, WEBM) and ensure the file is not corrupted.',
          steps: ['Check file extension', 'Try re-exporting from your DAW', 'Convert to WAV using an external tool'],
          relatedCodes: ['FILE_TOO_LARGE'],
          prevention: 'Always verify audio files play correctly in a media player before importing.',
        },
        {
          code: 'AUDIO_CONTEXT_FAILED',
          message: 'Web Audio API initialization failed',
          severity: 'critical',
          category: 'F. Browser & Performance',
          location: 'Page: Audio Converter → Area: Entire page',
          cause: 'The browser blocked AudioContext creation due to autoplay policy, or the device lacks audio hardware.',
          solution: 'Click anywhere on the page first to unlock audio, then reload.',
          steps: ['Click on the page canvas', 'Check browser permissions', 'Reload the page'],
          relatedCodes: ['BROWSER_NOT_SUPPORTED'],
          prevention: 'Ensure the app is opened via a user gesture (click) rather than automatic redirect.',
        },
        {
          code: 'CONVERT_NO_AUDIO',
          message: 'Nothing to convert',
          severity: 'warning',
          category: 'B. Settings & Data',
          location: 'Page: Audio Converter → Area: Convert button',
          cause: 'The Convert button was clicked before any audio file was imported.',
          solution: 'Import an audio file first using the dropzone or Choose File button.',
          steps: ['Click the upload dropzone', 'Select an audio file', 'Wait for the source info to appear'],
          relatedCodes: ['IMPORT_FAILED'],
          prevention: 'The convert button is disabled when no audio is loaded; this error may appear from programmatic calls.',
        },
        {
          code: 'CONVERT_FAILED',
          message: 'Conversion failed',
          severity: 'error',
          category: 'F. Browser & Performance',
          location: 'Page: Audio Converter → Area: Convert section',
          cause: 'The browser does not support the selected output format, or MediaRecorder failed to capture the audio stream.',
          solution: 'Try a different format (WAV 16-bit is universally supported) or use a different browser.',
          steps: ['Select WAV 16-bit format', 'Click Convert again', 'If still failing, reload the page'],
          relatedCodes: ['FORMAT_NOT_SUPPORTED', 'MEDIA_RECORDER_ERROR'],
          prevention: "Always check the browser's supported format list in the format dropdown before converting.",
        },
        {
          code: 'FORMAT_NOT_SUPPORTED',
          message: 'Selected output format not supported',
          severity: 'warning',
          category: 'F. Browser & Performance',
          location: 'Page: Audio Converter → Area: Output format dropdown',
          cause: "The browser does not implement the selected MIME type for MediaRecorder (e.g., MP3 on Safari).",
          solution: 'Choose WAV 16-bit PCM, which is guaranteed to work on all browsers.',
          steps: ['Open the Format dropdown', 'Select WAV 16-bit PCM', 'Click Convert'],
          relatedCodes: ['CONVERT_FAILED'],
          prevention: 'WAV formats are native and do not rely on MediaRecorder; they are the safest choice.',
        },
        {
          code: 'PLAYBACK_ERROR',
          message: 'Playback failed',
          severity: 'error',
          category: 'F. Browser & Performance',
          location: 'Page: Audio Converter → Area: Result preview',
          cause: 'The audio element failed to play the converted file, usually due to an unsupported codec or corrupted output.',
          solution: 'Try converting to a different format or reload the page.',
          steps: ['Select WAV 16-bit format', 'Click Convert again', 'Check the browser console for errors'],
          relatedCodes: ['CONVERT_FAILED'],
          prevention: 'Preview the source file before converting to ensure the browser can decode it.',
        },
        {
          code: 'STORAGE_FULL',
          message: 'Browser storage full',
          severity: 'error',
          category: 'F. Browser & Performance',
          location: 'Page: Audio Converter → Area: Export / Download',
          cause: 'The browser disk quota is exceeded, preventing the converted audio blob from being created.',
          solution: 'Free up disk space or use a different browser profile.',
          steps: ['Clear browser cache', 'Close other tabs', 'Restart browser'],
          relatedCodes: ['CONVERT_NO_AUDIO'],
          prevention: 'Convert shorter clips or lower-bitrate formats when disk space is limited.',
        },
      ],
    },
    {
      id: 'relationship-web',
      title: '角色关系网',
      overview: `角色关系网是一个交互式可视化图编辑器，用于绘制原创角色（OC）之间的关联。创建带有名称、颜色、备注和头像（来自资产库）的角色节点，然后用颜色编码的关系连线将它们链接起来。

主要功能：
· 可视化画布 — 在无限画布上自由平移、缩放和拖拽节点
· 8 种关系类型 — 朋友、敌人、家人、恋人、师徒、对手、盟友、自定义，每种都有独特颜色
· 节点编辑器 — 设置名称、从色板选色、添加备注、从资产库分配头像
· 边编辑器 — 选择关系类型，添加可选标签和备注
· 资产库联动 — 直接将角色插画导入为节点头像
· 画布控制 — 放大/缩小、重置视图、键盘快捷键（Delete 删除、Escape 取消选择）
· 数据持久化 — 所有节点和关系自动保存到浏览器 localStorage
· 键盘无障碍 — 节点可 Tab 聚焦，Enter/Space 选中，Shift+Enter 快速添加关系`,
      buttons: [
        { name: '添加角色', description: '在当前视口中心创建一个新的角色节点。' },
        { name: '添加关系', description: '进入边创建模式。先点击源节点，再点击目标节点以创建关系。' },
        { name: '编辑', description: '打开节点或边编辑弹窗，修改名称、颜色、头像、类型、标签和备注。' },
        { name: '删除', description: '移除选中的节点或边。删除节点会同时移除所有相连的边。' },
        { name: '放大 / 缩小', description: '调整画布缩放级别。也支持鼠标滚轮。' },
        { name: '重置视图', description: '将平移和缩放重置为默认居中视图。' },
        { name: '选择头像', description: '打开资产库选择器，将图片设为节点头像。' },
        { name: '清除头像', description: '移除节点的头像图片，恢复为首字母占位符。' },
      ],
      parameters: [
        { name: '角色名称', description: '角色节点的显示名称。', tips: '保持简短，以便标签能显示在节点圆下方。' },
        { name: '节点颜色', description: '节点的强调色，显示为头像背景和选中光环。', tips: '选择与画布背景对比度良好的颜色。' },
        { name: '节点备注', description: '附加到节点的可选自由文本备注。', tips: '可用于角色背景故事、特征或备忘。' },
        { name: '关系类型', description: '两个角色之间的关系类别。', tips: '如果预设类型都不符合，请选择自定义。' },
        { name: '关系标签', description: '显示在关系连线上的可选短标签。', tips: '示例：「青梅竹马」、「自 2020 年以来的宿敌」。' },
        { name: '关系备注', description: '附加到关系的可选自由文本备注。', tips: '可用于关系历史、事件或故事背景。' },
      ],
      errors: [
        {
          code: 'NO_NODES',
          message: '图中还没有角色',
          severity: 'info',
          category: 'B. 设置与数据',
          location: '页面：角色关系网 → 区域：画布',
          cause: '因为尚未创建任何节点，所以图为空。',
          solution: '点击「添加角色」创建你的第一个节点。',
          steps: ['点击添加角色按钮', '输入名称', '点击保存'],
          relatedCodes: [],
          prevention: 'N/A',
        },
        {
          code: 'STORAGE_FULL',
          message: '浏览器存储已满',
          severity: 'error',
          category: 'F. 浏览器与性能',
          location: '页面：角色关系网 → 区域：保存',
          cause: '浏览器 localStorage 配额已超出，导致节点或关系无法保存。',
          solution: '释放浏览器存储空间，或导出数据进行备份。',
          steps: ['清除不用的 localStorage 数据', '导出关系数据', '刷新页面'],
          relatedCodes: ['DATA_CORRUPTED'],
          prevention: '定期备份你的角色关系网数据。',
        },
      ],
    },
    {
      id: 'character-card',
      title: '角色卡',
      overview: `角色卡导出器可以将角色信息、立绘、档案字段、标签和关系数据组合成一张精美的可分享 PNG 卡片。从三种模板（极简、详细、画廊）中选择，自定义主题颜色和背景，然后一键导出。

主要功能：
· 三种卡片模板 — 极简（紧凑肖像卡）、详细（带主视觉的完整档案）、画廊（居中展示并附带关系网格）
· 资产库联动 — 直接从资产库中选择头像和主视觉图片
· 角色关系网联动 — 可选自动导入关联角色及其关系类型
· 自定义档案字段 — 添加任意数量的标签字段（年龄、身高、生日、性格等）
· 标签与颜色 — 分配彩色标签以对角色进行分类
· 主题自定义 — 从 19 种预设中选择强调色；选择背景样式（纯色、渐变或点状图案）
· 一键导出 — 通过 html-to-image 以 2 倍分辨率渲染卡片并下载为 PNG`,
      buttons: [
        { name: '导出卡片', description: '将当前卡片预览渲染为高分辨率 PNG 图片并下载到设备。' },
        { name: '选择头像', description: '打开资产库选择器，为卡片选择正方形头像图片。' },
        { name: '选择主视觉', description: '打开资产库选择器，为详细和画廊模板选择横幅/主视觉图片。' },
        { name: '添加标签', description: '创建一个彩色新标签。颜色会自动随机分配。' },
        { name: '添加字段', description: '添加一个带有标签和值的新自定义档案字段。' },
        { name: '删除字段 / 标签', description: '从卡片中删除指定的档案字段或标签。' },
        { name: '切换模板', description: '在极简、详细和画廊卡片布局之间切换。' },
        { name: '背景样式', description: '在纯色背景、强调色渐变叠加和点状图案叠加之间切换。' },
      ],
      parameters: [
        { name: '角色名称', description: '卡片上角色的主要显示名称。', tips: '必填。在输入名称之前，导出按钮处于禁用状态。' },
        { name: '别名', description: '可选的次要名称或昵称。', tips: '如果角色没有别名，请留空。' },
        { name: '主题颜色', description: '用于边框、高亮和渐变背景的强调色。', tips: '选择与角色立绘相衬的颜色。' },
        { name: '角色简介', description: '卡片上显示的自由文本描述或背景故事。', tips: '极简模板请保持简洁；详细和画廊模板有更多空间。' },
        { name: '导入关系', description: '启用后，工具会读取角色关系网数据并自动填充关联角色。', tips: '工具会查找名称与「角色名称」字段完全匹配的节点。' },
        { name: '模板', description: '导出卡片的视觉布局。', tips: '详细模板最适合完整档案；画廊模板最适合以视觉为中心的展示。' },
      ],
      errors: [
        {
          code: 'NO_NAME',
          message: '角色名称为空',
          severity: 'warning',
          category: 'B. 设置与数据',
          location: '页面：角色卡 → 区域：导出按钮',
          cause: '在输入角色名称之前点击了导出按钮。',
          solution: '在「角色名称」字段中输入至少一个字符。',
          steps: ['点击角色名称输入框', '输入名称', '再次点击导出卡片'],
          relatedCodes: [],
          prevention: 'N/A',
        },
        {
          code: 'EXPORT_FAILED',
          message: '卡片导出失败',
          severity: 'error',
          category: 'F. 浏览器与性能',
          location: '页面：角色卡 → 区域：导出',
          cause: '浏览器阻止了图片渲染、预览 DOM 被分离，或 html-to-image 遇到了跨域图片。',
          solution: '确保所有选中的图片均来自资产库（Data URL）。尝试重新选择图片或刷新页面。',
          steps: ['检查资产库中的图片是否仍然存在', '重新选择头像/主视觉图片', '再次点击导出'],
          relatedCodes: [],
          prevention: '仅使用导入到资产库中的图片，以避免 CORS 问题。',
        },
      ],
    },
    {
      id: 'character-chronicle',
      title: '角色纪年表',
      overview: `角色纪年表让你为角色的人生故事构建一个可视化的时间线。记录出生、相遇、离别、成长瞬间、战斗和转折点——每个事件都可以标注日期、描述，关联来自关系网的角色，并附加资产库中的可选图片。时间线以一条精美的纵轴呈现，配以按颜色编码的事件卡片，可以导出为一张长 PNG 图片。

核心能力：
· 事件创建 —— 添加带有日期、标题、描述、类型和可选图片的事件
· 关系网关联 —— 为任意事件附加相关角色；他们的名字和颜色会显示在时间线卡片上
· 事件类型颜色编码 —— 7 种内置类型（出生、相遇、离别、成长、战斗、转折点、自定义），每种都有独特颜色
· 可视化时间线 —— 纵向轴线，左右交替排列的事件卡片，自动按日期排序
· 一键导出 —— 通过 html-to-image 以 2 倍分辨率渲染完整时间线为透明 PNG
· 持久化存储 —— 所有事件自动保存到浏览器 localStorage`,
      buttons: [
        { name: '添加事件', description: '打开事件编辑器弹窗，创建新的时间线条目。' },
        { name: '编辑事件', description: '在编辑器弹窗中打开已有事件以修改其字段。' },
        { name: '删除事件', description: '确认后将事件从时间线中移除。' },
        { name: '导出时间线', description: '将完整时间线渲染为高分辨率 PNG 并下载。' },
        { name: '选择图片', description: '从资产库中选择一张图片附加到事件。' },
        { name: '关联角色', description: '切换关系网中的角色是否与此事件相关。' },
        { name: '事件类型标签', description: '点击类型标签以设置事件类别及其颜色。' },
      ],
      parameters: [
        { name: '日期', description: '事件发生的日期，用于按时间顺序排序。', tips: '建议使用 ISO 格式（YYYY-MM-DD）。相对日期如「15 岁」也可使用，但排序可能不符合预期。' },
        { name: '标题', description: '时间线卡片上显示的事件名称。', tips: '保持简短（30 个字符以内），以便在卡片上良好显示。' },
        { name: '描述', description: '对发生事件的较长自由文本说明。', tips: '两到三句话最适合卡片布局。' },
        { name: '事件类型', description: '决定事件颜色的类别。', tips: '如果预设类型都不符合你的剧情节点，请使用「自定义」。' },
        { name: '关联角色', description: '通过关系网链接到本事件的角色。', tips: '工具会自动读取关系网节点。请确保角色名称匹配。' },
      ],
      errors: [
        {
          code: 'NO_EVENTS',
          message: '时间线为空',
          severity: 'info',
          category: 'B. 设置与数据',
          location: '页面：角色纪年表 → 区域：时间线',
          cause: '尚未创建任何事件。',
          solution: '点击「添加事件」创建你的第一个时间线条目。',
          steps: ['点击添加事件', '填写日期和标题', '点击保存'],
          relatedCodes: [],
          prevention: 'N/A',
        },
        {
          code: 'EXPORT_FAILED',
          message: '时间线导出失败',
          severity: 'error',
          category: 'F. 浏览器与性能',
          location: '页面：角色纪年表 → 区域：导出',
          cause: '浏览器阻止了渲染，或遇到了跨域图片。',
          solution: '确保所有附加图片都来自资产库（Data URL）。尝试移除图片后重新导出。',
          steps: ['检查资产库中的图片来源', '从事件中移除有问题的图片', '再次点击导出时间线'],
          relatedCodes: [],
          prevention: '仅使用导入到资产库中的图片，以避免 CORS 问题。',
        },
      ],
    },
    {
      id: 'world-encyclopedia',
      title: '世界百科',
      overview: `世界百科是一个用于构建原创世界设定的结构化知识管理工具。您可以为地点、组织、种族、事件、物品、概念以及自定义类别创建条目。每个条目支持标签、关联来自关系网的角色以及自由文本内容。支持列表和卡片网格两种浏览模式，可进行搜索和类别筛选。可将整个百科导出为 JSON，以便备份或分享。

主要功能：
· 七种类别条目 — 地点（绿色）、组织（蓝色）、种族（琥珀色）、事件（红色）、物品（紫色）、概念（青色）、自定义（灰色）
· 标签系统 — 为条目分配任意数量的自由文本标签，用于分类和筛选
· 关系网关联 — 将关系网中的相关角色附加到任意条目；其颜色会以圆点形式显示在条目卡片上
· 双视图模式 — 卡片网格用于视觉浏览，紧凑列表用于密集扫描
· 搜索与筛选 — 对标题、内容和标签进行全文搜索；类别芯片带有实时计数器
· JSON 导出 — 将整个百科以格式化 JSON 复制到剪贴板
· 持久化存储 — 所有条目自动保存到浏览器 localStorage`,
      buttons: [
        { name: '添加条目', description: '打开条目编辑器弹窗以创建新的百科条目。' },
        { name: '编辑条目', description: '在编辑器弹窗中打开已有条目以修改其字段。' },
        { name: '删除条目', description: '在确认后从百科中移除条目。' },
        { name: '导出 JSON', description: '将整个百科数据集以格式化 JSON 复制到剪贴板。' },
        { name: '搜索', description: '输入关键词以筛选标题、内容或标签匹配的条目。' },
        { name: '类别筛选', description: '点击类别芯片仅显示该类型的条目，再次点击清除筛选。' },
        { name: '视图切换', description: '在卡片网格视图和紧凑列表视图之间切换。' },
        { name: '关联角色', description: '将关系网中的角色切换为与此条目相关联。' },
      ],
      parameters: [
        { name: '标题', description: '百科条目的显示名称。', tips: '保持简洁且唯一，便于搜索。' },
        { name: '类别', description: '决定条目颜色和图标的分类。', tips: '如果六种预设类别都不符合您的条目类型，请使用自定义。' },
        { name: '内容', description: '详细描述条目的正文文本。', tips: '支持自由格式文本。可在此编写 lore、历史、物理描述或规则。' },
        { name: '标签', description: '用于在预设类别之外进行额外分类的自由文本标签。', tips: '例如："magic"、"faction-A"、"main-city"、"legendary"。' },
        { name: '关联角色', description: '与此条目关联的关系网中的角色。', tips: '适用于标记属于某个组织、居住在某地点或参与某事件的角色。' },
      ],
      errors: [
        {
          code: 'NO_ENTRIES',
          message: '百科为空',
          severity: 'info',
          category: 'B. 设置与数据',
          location: '页面：世界百科 → 区域：内容区域',
          cause: '尚未创建任何条目。',
          solution: '点击「添加条目」创建您的第一个百科条目。',
          steps: ['点击添加条目', '填写标题和类别', '点击保存'],
          relatedCodes: [],
          prevention: 'N/A',
        },
        {
          code: 'EXPORT_FAILED',
          message: 'JSON 导出失败',
          severity: 'error',
          category: 'F. 浏览器与性能',
          location: '页面：世界百科 → 区域：导出按钮',
          cause: '浏览器阻止了剪贴板访问，或数据过大。',
          solution: '确保页面具有剪贴板权限。如果数据量很大，尝试在导出前删除部分条目。',
          steps: ['检查浏览器权限', '根据需要减少条目数量', '再次点击导出 JSON'],
          relatedCodes: [],
          prevention: '定期导出较小的批次，以避免 JSON 过大。',
        },
      ],
    },
    {
      id: 'settings-guide',
      overview: `
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
      title: '设置面板指南',
      buttons: [
        { name: '保存样式预设', description: '将当前主题、颜色、字体组合保存为自定义预设，方便日后一键切换。' },
        { name: '应用预设', description: '从已保存的预设列表中选择一个，立即应用其所有样式设置。' },
        { name: '重置所有设置', description: '将所有标签页的设置恢复到默认值，需要二次确认以防误操作。' },
        { name: '恢复默认值', description: '仅恢复当前标签页的设置到默认值，不影响其他标签页。' },
        { name: '导入配置', description: '从 JSON 文件导入之前导出的配置，支持按工具粒度导入。' },
        { name: '导出配置', description: '将当前所有设置导出为 JSON 文件，方便备份或迁移。' },
      
        { name: '导入配置', description: '从 JSON 文件导入完整的设置配置，可覆盖当前所有设置项。' },
        { name: '导出配置', description: '将所有设置导出为 JSON 文件，用于备份或跨设备同步。' },
        { name: '恢复默认', description: '将当前分类的设置恢复为默认值。不影响其他分类的设置。' },
        { name: '搜索设置', description: '在所有设置项中搜索关键词，快速定位需要的配置项。' },
        { name: '快捷键列表', description: '显示所有可用的键盘快捷键及其对应功能。' },
        { name: '关于', description: '显示 OC Maker 的版本信息、开源许可、致谢名单和更新日志。' },],
      parameters: [
        { name: '样式预设', description: '快速切换外观主题组合，包含默认风格和 Paper2Gal 专用风格。' },
        { name: '主题模式', description: '浅色模式适合白天使用，深色模式降低夜间用眼疲劳。' },
        { name: '自定义对比度', description: '调节界面元素的明暗对比度，范围从柔和到高对比。' },
        { name: '强调色', description: '选择界面主色调，影响按钮、链接、进度条、选中状态等。' },
        { name: '字体', description: '选择界面字体族，支持无衬线、圆体、衬线、等宽、黑体、宋体、楷体及西文字体。' },
        { name: '界面语言', description: '切换界面显示语言，支持 30 种语言，切换后立即生效。' },
        { name: 'API 模式', description: '「内置模式」使用后端配置的 Plato 服务；「自定义 API」使用你自己提供的 OpenAI 兼容接口。' },
        { name: 'API Base URL', description: 'OC Maker 后端根地址，不是模型服务商端点。正确示例：https://your-backend.example.com' },
        { name: 'API Key', description: '自定义 API 模式下的接口密钥，仅在前端使用，不会发送到后端。' },
        { name: '主音量', description: '全局音量倍率，同时影响 BGM 和 SFX。设为 0 可完全静音。' },
        { name: 'SFX 音量', description: '交互音效（按钮点击、悬停、成功/失败提示等）的独立音量。' },
        { name: 'BGM 音量', description: '背景音乐的独立音量，不影响 SFX。' },
        { name: '动画启用', description: '全局动画总开关，关闭后所有 UI 动画、页面过渡和弹窗动画都会被禁用。' },
        { name: '动画速度', description: '调节动画播放快慢，可选慢速、正常、快速三档。' },
        { name: '减少动画', description: '性能优化选项，降低动画复杂度而非完全关闭，适合低端设备。' },
        { name: '禁用毛玻璃', description: '移除模糊背景效果，可显著提升低端设备的渲染性能。' },
        { name: '低分辨率预览', description: '在图片预览和缩略图时使用更低分辨率，减少内存占用。' },
        { name: '懒加载', description: '延迟加载当前视口不可见的图片和资源，减少初始加载时间。' },
        { name: '禁用粒子', description: '关闭首页和工作流页面的背景粒子动画效果。' },
        { name: '激进缓存', description: '增强浏览器资源缓存策略，减少重复请求，但可能延迟获取最新资源。' },
        { name: '图片质量', description: '输出图片质量档位：低（最快）、中（平衡）、高（最佳质量）。' },
        { name: '最大并发数', description: '同时处理的任务数量上限，降低可减少浏览器卡顿。' },
        { name: '显示工具提示', description: '鼠标悬停在按钮和控件上时显示功能说明提示框。' },
        { name: '确认破坏性操作', description: '在执行重置、删除、覆盖等不可逆操作前弹出确认对话框。' },
        { name: '显示键盘提示', description: '在按钮和控件上显示对应的键盘快捷键提示。' },
        { name: '平滑滚动', description: '启用平滑滚动效果，关闭后使用瞬时跳转。' },
        { name: '启用通知音效', description: '为成功、失败、警告等系统通知播放对应音效。' },
        { name: '自动保存间隔', description: '自动备份设置和数据的频率（分钟），设为 0 可禁用自动保存。' },
        { name: '日期格式', description: '界面中日期时间的显示格式：ISO 标准、本地格式、友好格式。' },
        { name: '显示时钟', description: '在状态栏右下角显示当前时间。' },
        { name: '启用状态栏', description: '显示底部信息栏，包含版本、语言、连接状态等。' },
        { name: '高对比度焦点', description: '增强焦点指示器的可见性，提升键盘导航和无障碍体验。' },
        { name: '报错弹窗', description: '在工作流页面发生错误时，是否显示可拖拽的错误详情面板。' },
      
        { name: '动画帧率上限', description: '界面动画的最大帧率，范围 30~120 FPS。降低可节省电量，提高则更流畅。', tips: '笔记本电池模式建议 30-60，插电模式建议 60-120。' },
        { name: '滚动惯性', description: '列表和页面的滚动惯性强度，范围 0~100。0 为无惯性（立即停止），100 为强惯性。', tips: '触控板用户建议 70-90，鼠标用户建议 30-50。' },
        { name: '工具提示延迟', description: '鼠标悬停后显示工具提示的延迟时间（毫秒），范围 100~2000。', tips: '新手建议 500-800，熟练用户建议 200-400。' },
        { name: '通知显示时长', description: 'Toast 通知自动消失的时长（秒），范围 2~10。', tips: '一般通知 3-4 秒，重要通知 6-8 秒。' },
        { name: '最大并发请求', description: '同时向 API 发送的最大请求数，范围 1~10。过高可能导致被限流。', tips: 'OpenAI 免费 tier 建议 2-3，付费 tier 建议 5-8。' },
        { name: '自动备份间隔', description: '自动导出设置备份的间隔（天），范围 0~30。设为 0 则关闭自动备份。', tips: '建议 7 天，重要项目可设为 1-3 天。' },
        { name: '快捷键冲突检测', description: '启用后，设置自定义快捷键时会自动检测与浏览器或系统快捷键的冲突。', tips: '建议开启，避免快捷键失效。' },
        { name: '开发者工具热键', description: '自定义打开开发者工具的快捷键，默认 F12。', tips: '可设为不常用组合键避免误触。' },],
      errors: [
        {
          code: 'SETTINGS_SAVE_FAILED',
          message: '设置保存失败',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '设置面板 → 任意标签页',
          cause: '浏览器 localStorage 空间不足、存储被禁用、或数据序列化失败。',
          solution: '清理浏览器缓存和 localStorage，或检查隐私模式设置。',
          steps: [
            '打开 DevTools → Application → Local Storage，删除旧的 oc-maker 键。',
            '关闭浏览器的「阻止第三方 Cookie」或类似隐私设置后重试。',
            '如果使用了隐私模式/无痕模式，切换到普通模式使用。',
          ],
          relatedCodes: ['LOCAL_STORAGE_VERSION_MISMATCH', 'CONFIG_CORRUPTED'],
        },
        {
          code: 'SETTINGS_IMPORT_INVALID',
          message: '导入的配置文件格式无效',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '设置面板 → 导入配置',
          cause: '导入的文件不是有效的 JSON、缺少必要字段、或版本不兼容。',
          solution: '使用本应用导出的配置 JSON 文件，或手动修复格式。',
          steps: [
            '确认文件扩展名为 .json 且内容可被 JSON.parse 解析。',
            '检查文件是否包含 language、style、api、audio、animation、others 等顶层键。',
            '如果是跨大版本导入，建议先重置设置再逐项手动配置。',
          ],
          relatedCodes: ['IMPORT_INVALID_JSON', 'IMPORT_INVALID_CONFIG'],
        },
        {
          code: 'SETTINGS_RESET_CANCELLED',
          message: '用户取消了重置操作',
          severity: 'info',
          category: 'B. 配置与数据',
          location: '设置面板 → 重置按钮',
          cause: '用户点击了「重置所有设置」但在二次确认对话框中选择了取消。',
          solution: '无需处理，当前设置保持不变。',
        },
        {
          code: 'SETTINGS_PRESET_NOT_FOUND',
          message: '选择的样式预设不存在或已损坏',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '设置面板 → 样式 → 预设',
          cause: '预设数据在 localStorage 中丢失、损坏或被手动编辑过。',
          solution: '重新保存一个新的预设，或恢复默认样式设置。',
          steps: [
            '先手动调整好想要的主题、颜色和字体。',
            '点击「保存样式预设」并输入新名称。',
            '删除旧的损坏预设（如果还能显示）。',
          ],
        },
      ],
    },
    {
      id: 'audio-guide',
      overview: `
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
      title: '音频系统指南',
      buttons: [
        { name: '播放/暂停 BGM', description: '切换背景音乐的播放状态。首次播放可能需要用户点击页面解锁。' },
        { name: 'SFX 测试', description: '播放当前选中的 SFX 预设示例音，用于预览效果。' },
        { name: 'BGM 测试', description: '播放当前选中的 BGM 预设示例片段，用于预览效果。' },
        { name: '上传自定义 SFX', description: '上传自己的音频文件作为 SFX 预设，支持 WAV、MP3、OGG 格式。' },
        { name: '上传自定义 BGM', description: '上传自己的音频文件作为 BGM 预设，支持 WAV、MP3、OGG 格式。' },
        { name: '移除自定义音频', description: '删除已上传的自定义 SFX 或 BGM 文件，恢复为系统预设。' },
        { name: '重置 SFX', description: '将 SFX 设置恢复为默认预设和默认音量。' },
        { name: '重置 BGM', description: '将 BGM 设置恢复为默认预设和默认音量。' },
      
        { name: '音效库', description: '浏览和管理所有内置音效的分类列表，支持搜索和收藏。' },
        { name: '播放列表', description: '创建和管理 BGM 播放列表，支持拖拽排序和循环模式设置。' },
        { name: '均衡器', description: '打开 10 段图形均衡器，自定义各频段的增益值。' },
        { name: '录音', description: '使用麦克风录制音频，可用于语音克隆或添加自定义音效。' },
        { name: '音频可视化', description: '开启音频波形可视化效果，显示当前播放音频的频谱图。' },
        { name: '设备检测', description: '检测系统中所有可用的音频输入/输出设备，并显示其状态。' },
        { name: '空间音频', description: '启用虚拟环绕声效果，模拟 3D 空间中的声源定位（需耳机）。' },],
      parameters: [
        { name: '主音量', description: '全局音量倍率（0%~100%），同时影响 SFX 和 BGM。' },
        { name: 'SFX 音量', description: '交互音效的独立音量，包括按钮点击、悬停、成功/失败提示等。' },
        { name: 'BGM 音量', description: '背景音乐的独立音量，与 SFX 音量互不干扰。' },
        { name: 'SFX 预设', description: '15+ 种程序化音效风格：经典、电子、复古、木琴、铃铛、太空、鼓、钢琴、合成波、芯片、弦乐、管乐、爵士、打击乐、环境音、科幻、卡通、恐怖、自然、机械。' },
        { name: 'BGM 预设', description: '20+ 种背景音乐风格：管弦、环境、电子、钢琴、合成波、自然、爵士、冥想、赛博、LoFi、摇滚、蓝调、民谣、雷鬼、放克、灵魂、福音、乡村、凯尔特、东方、部落、太空、水下、雨、风铃、壁炉、夜晚、日出、梦幻、 energetic、战斗、冒险、神秘、浪漫、怀旧、希望、史诗、放松、学习、专注。' },
        { name: 'SFX 音高', description: '音效的基础音高偏移，以半音为单位调节。' },
        { name: 'SFX 时长', description: '音效的持续时间（毫秒），影响衰减包络的长度。' },
        { name: 'SFX 滤波器', description: '低通/高通/带通滤波器截止频率，可塑造音色的明暗度。' },
        { name: 'SFX 失谐', description: '音效的微分音偏移，用于制造不和谐或厚重感。' },
        { name: 'SFX 混响', description: '为音效添加空间混响，模拟不同环境的声学特性。' },
        { name: 'BGM 音高', description: '背景音乐的整体音高偏移，不影响播放速度。' },
        { name: 'BGM 速度', description: '背景音乐的播放速度倍率（0.5x~2.0x），同时影响音高。' },
        { name: 'BGM 立体声宽度', description: '扩展或缩窄 BGM 的立体声声场，0% 为单声道，200% 为超宽声场。' },
      
        { name: '主音量', description: '所有音频的全局音量，范围 0~100。', tips: '根据使用环境调整，安静环境 30-50，嘈杂环境 70-100。' },
        { name: '音效音量', description: 'UI 交互音效的音量，范围 0~100。独立于主音量和 BGM 音量。', tips: '建议为主音量的 60-80%，避免音效过于刺耳。' },
        { name: 'BGM 音量', description: '背景音乐的音量，范围 0~100。独立于主音量和音效音量。', tips: '建议为主音量的 40-60%，作为背景不喧宾夺主。' },
        { name: '语音闪避强度', description: '检测到语音播放时 BGM 自动降低的幅度（dB），范围 0~20。0 为不闪避。', tips: '有声书/配音建议 10-15dB，背景音乐建议 5-10dB。' },
        { name: '音效音高随机', description: '为连续播放的相同音效添加微小的音高变化，范围 0~100。增加自然感避免机械重复。', tips: '打字音效建议 20-30，通知音效建议 0-10。' },
        { name: '空间音频宽度', description: '虚拟环绕声的声场宽度，范围 0~100。数值大则声源定位感更强。', tips: '音乐欣赏建议 60-80，游戏/电影建议 80-100。' },
        { name: '录音采样率', description: '麦克风录音的采样率，可选 22050Hz、44100Hz、48000Hz。', tips: '语音录音 44100Hz 足够，音乐录音建议 48000Hz。' },
        { name: '录音位深度', description: '麦克风录音的位深度，可选 16-bit、24-bit。', tips: '一般录音 16-bit，专业录音 24-bit。' },
        { name: '音频缓冲区大小', description: '音频播放的缓冲区大小（样本数），可选 256、512、1024、2048、4096。', tips: '低延迟需求 256-512，稳定性优先 1024-2048。' },
        { name: '均衡器预设', description: '快速加载预设的均衡器配置：平直、低音增强、人声突出、古典、摇滚、电子等。', tips: '可根据当前播放内容类型快速切换。' },],
      errors: [
        {
          code: 'AUDIO_CONTEXT_SUSPENDED',
          message: '音频被浏览器自动挂起',
          severity: 'info',
          category: 'F. 浏览器与性能',
          location: '任意页面 → 音频播放',
          cause: '现代浏览器的自动播放策略要求用户与页面交互后才能启动音频。页面加载后 AudioContext 处于 suspended 状态。',
          solution: '点击页面任意位置或任意按钮即可恢复音频播放。',
          steps: [
            '点击页面上的任意按钮或空白区域。',
            '如果 BGM 仍未播放，检查浏览器地址栏是否有静音图标。',
            'iOS Safari 需要额外的用户手势，尝试点击「播放 BGM」按钮。',
          ],
          prevention: '应用已内置 attachAudioResumeHandler，会在用户首次交互时自动恢复 AudioContext。',
        },
        {
          code: 'AUDIO_DECODE_FAILED',
          message: '自定义音频文件解码失败',
          severity: 'error',
          category: 'C. 文件与上传',
          location: '设置面板 → 音频 → 自定义上传',
          cause: '上传的文件不是有效的音频格式、编码不支持、或文件已损坏。',
          solution: '使用标准编码的 WAV、MP3 或 OGG 文件重新上传。',
          steps: [
            '确认文件扩展名为 .wav、.mp3 或 .ogg。',
            '用系统播放器测试文件能否正常播放。',
            '尝试用音频编辑软件重新导出为 44100Hz 立体声 MP3。',
            '文件大小建议不超过 5MB。',
          ],
          relatedCodes: ['FILE_FORMAT_UNSUPPORTED', 'IMAGE_DECODE_FAILED'],
        },
        {
          code: 'AUDIO_FILE_TOO_LARGE',
          message: '上传的音频文件过大',
          severity: 'warning',
          category: 'C. 文件与上传',
          location: '设置面板 → 音频 → 自定义上传',
          cause: '音频文件超过浏览器或应用的处理上限，解码和存储都会出现问题。',
          solution: '压缩音频文件或裁剪为更短的片段。',
          steps: [
            '使用音频编辑软件将文件压缩到 5MB 以下。',
            '对于 BGM，建议时长 30~120 秒并循环播放。',
            '降低采样率到 44100Hz 或 22050Hz。',
            '使用 VBR MP3 编码以获得更小的文件体积。',
          ],
        },
        {
          code: 'AUDIO_AUTOPLAY_BLOCKED',
          message: '浏览器阻止了自动播放',
          severity: 'info',
          category: 'F. 浏览器与性能',
          location: '首页或工作流页面 → BGM 自动播放',
          cause: '浏览器的自动播放策略禁止未经用户交互的音频播放，特别是带有声音媒体的自动播放。',
          solution: '用户与页面交互后音频会自动恢复，无需额外操作。',
          steps: [
            '点击页面任意按钮或区域。',
            '检查浏览器设置中是否允许当前网站自动播放媒体。',
            'Chrome 用户可在地址栏点击网站图标 → 网站设置 → 声音 → 允许。',
          ],
          prevention: '应用已尽量延迟音频初始化直到用户交互后，但浏览器策略可能仍会拦截。',
        },
        {
          code: 'AUDIO_WEB_AUDIO_UNSUPPORTED',
          message: '浏览器不支持 Web Audio API',
          severity: 'error',
          category: 'F. 浏览器与性能',
          location: '任意页面',
          cause: '当前浏览器版本过旧，或处于限制模式（如某些企业安全浏览器的锁定模式）。',
          solution: '升级到现代浏览器（Chrome 90+、Firefox 90+、Edge 90+、Safari 15+）。',
          steps: [
            '确认浏览器不是 IE 或旧版 Edge（非 Chromium 内核）。',
            '检查浏览器是否处于「安全模式」或「无痕模式的严格保护」。',
            '尝试在标准窗口（非无痕）中打开应用。',
          ],
          relatedCodes: ['BROWSER_MEMORY_EXHAUSTED'],
        },
      ],
    },
    {
      id: 'ui-ux-guide',
      overview: `
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
      title: '界面与体验指南',
      buttons: [
        { name: '切换主题', description: '在浅色模式和深色模式之间切换，所有页面元素会平滑过渡。' },
        { name: '应用样式预设', description: '一键应用已保存的完整样式组合（主题+颜色+字体）。' },
        { name: '更换字体', description: '从 11 种字体中选择界面字体，切换后立即应用到所有文本。' },
        { name: '开启动画', description: '启用所有 UI 动画效果，包括淡入、悬停、页面过渡和弹窗动画。' },
        { name: '关闭动画', description: '禁用所有动画，界面变化变为瞬时切换，适合追求效率或低端设备。' },
        { name: '重置动画', description: '将动画设置恢复为默认值（启用动画、正常速度、全部效果开启）。' },
        { name: '启用性能模式', description: '一键开启所有性能优化选项（减少动画、禁用毛玻璃、低分辨率预览、禁用粒子）。' },
      
        { name: '组件库', description: '浏览所有可复用的 UI 组件及其用法示例和代码片段。' },
        { name: '主题编辑器', description: '可视化编辑自定义主题的颜色、字体、间距等设计令牌。' },
        { name: '布局预览', description: '预览不同屏幕尺寸下的页面布局效果，支持自定义断点。' },
        { name: '动画预览', description: '查看所有可用动画效果的实时演示和配置参数。' },
        { name: '无障碍检查', description: '运行自动化无障碍测试，检查颜色对比度、焦点顺序、ARIA 标签等。' },
        { name: '设计规范', description: '查看完整的设计系统文档，包括设计原则、使用规范和最佳实践。' },],
      parameters: [
        { name: '主题模式', description: '浅色模式适合白天和高亮环境；深色模式降低夜间用眼疲劳和 OLED 屏幕功耗。' },
        { name: '强调色', description: '界面主色调，影响按钮、进度条、选中状态、链接、图标等高亮元素。可选红、橙、黄、绿、青、蓝、紫、粉。' },
        { name: '自定义对比度', description: '调节界面明暗对比度，从柔和（低对比）到强烈（高对比）共 5 档。' },
        { name: '字体族', description: '11 种界面字体：无衬线（默认）、圆体、衬线、等宽、黑体、宋体、楷体、Georgia、Times、Verdana、Fira Code。' },
        { name: '动画启用', description: '全局动画总开关，关闭后所有过渡效果变为瞬时。' },
        { name: '动画速度', description: '慢速（1.5x 时长）、正常（1x）、快速（0.5x）。' },
        { name: 'UI 淡入', description: '页面加载和元素首次出现时的淡入动画效果。' },
        { name: '按钮悬停动画', description: '鼠标悬停在按钮和卡片上时的缩放/发光反馈效果。' },
        { name: '页面过渡', description: '切换不同工具页面时的滑动/淡入过渡动画。' },
        { name: '弹窗过渡', description: '模态框和设置面板打开/关闭时的缩放/淡入动画。' },
        { name: '减少动画', description: '保留必要的过渡但降低复杂度，适合不喜欢过多动效但又不希望完全关闭的用户。' },
        { name: '禁用毛玻璃', description: '移除面板和卡片上的 backdrop-filter 模糊效果，可显著提升低端 GPU 的渲染性能。' },
        { name: '低分辨率预览', description: '图片预览使用 0.5x 分辨率，减少内存占用和渲染压力。' },
        { name: '懒加载', description: '非视口内的图片和资源延迟加载，减少初始页面负载。' },
        { name: '禁用粒子', description: '关闭首页和工作流页面的 Canvas 粒子背景动画。' },
        { name: '激进缓存', description: '延长静态资源缓存时间，减少网络请求，但可能延迟获取更新。' },
        { name: '图片质量', description: '输出图片质量：低（最快，适合预览）、中（平衡）、高（最佳质量）。' },
        { name: '最大并发数', description: '同时处理的任务数量上限（1~8），降低可减少浏览器主线程卡顿。' },
        { name: '高对比度焦点', description: '为键盘焦点指示器添加高对比度边框，提升键盘导航和无障碍体验。' },
      
        { name: '主题色相', description: '自定义主题的主色相，范围 0~360 度。基于 HSL 色相环选择。', tips: '0 为红色，120 为绿色，240 为蓝色，300 为紫色。' },
        { name: '圆角大小', description: '全局 UI 元素的圆角半径基准值，范围 0~24px。影响按钮、卡片、输入框等。', tips: '现代风格建议 8-12px，扁平风格建议 0-4px，拟物风格建议 16-24px。' },
        { name: '阴影强度', description: '全局阴影的模糊和扩散程度，范围 0~100。0 为无阴影，100 为最大阴影。', tips: '浅色模式建议 30-50，深色模式建议 20-40。' },
        { name: '布局网格显示', description: '是否在页面上显示辅助的 4px/8px 网格线，帮助设计师检查对齐。', tips: '开发调试时开启，日常使用关闭。' },
        { name: '焦点高亮颜色', description: '键盘导航时的焦点指示器颜色，支持自定义以匹配主题。', tips: '建议与主题主色形成足够对比度，确保可见性。' },
        { name: '最小点击区域', description: '可交互元素的最小触控尺寸（px），范围 24~64。符合 WCAG 2.1 标准需至少 44x44px。', tips: '桌面端建议 32-40px，移动端建议 44-48px。' },
        { name: '动画缓动函数', description: '界面动画的缓动曲线：linear（线性）、ease（平滑）、ease-in（渐入）、ease-out（渐出）、ease-in-out（渐入渐出）、spring（弹性）。', tips: '一般过渡 ease-in-out，弹出层 spring，加载动画 linear。' },
        { name: '页面过渡时长', description: '页面切换动画的持续时间（毫秒），范围 100~1000。', tips: '追求速度 150-200ms，追求质感 300-500ms。' },
        { name: '骨架屏动画', description: '内容加载时骨架屏的闪烁动画速度，范围 0~2000ms。0 为静态骨架屏。', tips: '建议 1200-1500ms，过快显得焦虑，过慢显得卡顿。' },],
      errors: [
        {
          code: 'THEME_CSS_LOAD_FAILED',
          message: '主题 CSS 变量加载失败',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '设置面板 → 样式',
          cause: '自定义主题值无法被浏览器解析，可能是颜色格式错误或 CSS 变量值溢出。',
          solution: '重置样式设置或选择系统预设。',
          steps: [
            '点击「恢复默认值」重置当前标签页样式。',
            '检查自定义强调色是否为有效的 HEX 或 RGB 值。',
            '如果问题持续，点击「重置所有设置」。',
          ],
        },
        {
          code: 'FONT_LOAD_FAILED',
          message: '字体加载失败',
          severity: 'warning',
          category: 'F. 浏览器与性能',
          location: '设置面板 → 样式 → 字体',
          cause: '所选字体在当前系统不可用、网络字体加载超时、或字体文件被浏览器安全策略阻止。',
          solution: '选择系统已安装的字体，或检查网络连接后重试。',
          steps: [
            '优先选择「无衬线」或「衬线」等通用字体族。',
            '中文字体（黑体、宋体、楷体）需要系统已安装对应字库。',
            '检查浏览器 DevTools Console 是否有字体加载错误。',
          ],
        },
        {
          code: 'ANIMATION_DISABLE_FAILED',
          message: '动画禁用未完全生效',
          severity: 'info',
          category: 'F. 浏览器与性能',
          location: '设置面板 → 动画',
          cause: '某些第三方组件或动态注入的样式可能不受全局动画开关控制。',
          solution: '刷新页面确保所有样式重新计算。',
          steps: [
            '关闭动画后刷新页面（F5 或 Ctrl+R）。',
            '如果仍有动画，检查是否有浏览器扩展注入了自定义 CSS。',
          ],
        },
        {
          code: 'PERFORMANCE_MODE_CONFLICT',
          message: '性能模式与动画设置冲突',
          severity: 'info',
          category: 'F. 浏览器与性能',
          location: '设置面板 → 性能 / 动画',
          cause: '同时启用了「性能模式」中的减少动画和「动画」标签中的某些动效开关。',
          solution: '性能模式优先，手动关闭冲突的动画选项或关闭性能模式。',
          steps: [
            '理解性能模式会自动覆盖动画设置。',
            '如果需要精细控制，关闭性能模式后手动调节各动画选项。',
          ],
        },
      ],
    },
  ],
  errorDictionary: [
    {
      id: 'A',
      name: 'A. API 与网络',
      description: '涉及 API Key、网络连接、后端服务、请求超时、速率限制等外部依赖类错误。',
      errors: [
        {
          code: 'API_BASE_INVALID',
          message: '提示「API Base URL 格式不正确」',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：设置面板 API 标签页',
          cause: '在「设置 → API → API Base URL」中填写的 URL 格式不正确，缺少协议头（http:// 或 https://）或包含非法字符。',
          solution: '修正 URL 格式。',
          steps: [
            '打开「设置 → API」',
            '检查 API Base URL 是否以 http:// 或 https:// 开头',
            '确保 URL 末尾没有多余斜杠或空格',
            '保存后重试',
          ],
          relatedCodes: ['BACKEND_UNAVAILABLE', 'NETWORK_DISCONNECTED'],
          prevention: '配置 API Base URL 时确保以 http:// 或 https:// 开头，末尾不要有多余斜杠。',
        },
        {
          code: 'API_KEY_EXPIRED',
          message: '请求返回 401 或提示 Key 无效/过期',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具（转画风 / LLM / TTS / paper2gal）→ 区域：错误面板或输出区',
          cause: '配置的 API Key 已过期、被吊销、或额度已用完。',
          solution: '更换有效的 API Key。',
          steps: [
            '打开「设置 → API」面板',
            '删除当前 Key，填入新的有效 Key',
            '如果不确定 Key 是否有效，可在 LLM Hub 的实时测试面板中先测试',
            '保存后返回对应工具重试',
          ],
          relatedCodes: ['API_KEY_MISSING', '401_UNAUTHORIZED'],
          prevention: '定期检查 API Key 的有效期和剩余额度；在 LLM Hub 中通过实时测试快速验证 Key 是否有效。',
        },
        {
          code: 'API_KEY_MISSING',
          message: '点击开始/发送/生成后立刻报错，提示 API Key 未配置',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：错误面板或输出区',
          cause: '未在「设置 → API」中配置 API Key。所有需要调用后端服务的工具都需要有效的 API Key。',
          solution: '在设置面板中配置有效的 API Key。',
          steps: [
            '点击右上角「打开设置」或按对应快捷键',
            '切换到「API」标签页',
            '在「API Key」输入框中填入你的有效 Key',
            '点击「保存」后关闭设置面板',
            '返回工具页面重新操作',
          ],
          relatedCodes: ['API_KEY_EXPIRED', '401_UNAUTHORIZED'],
          prevention: '首次使用任何联网工具前，务必先在「设置 → API」中配置有效的 API Key。',
        },
        {
          code: 'API_RATE_LIMIT',
          message: '提示「Rate limit exceeded」或请求被拒绝',
          severity: 'warning',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：错误面板',
          cause: '短时间内发送了过多请求，超过了服务商的速率限制。不同的 API 套餐有不同的速率限制。',
          solution: '等待一段时间后重试，或降低请求频率。',
          steps: [
            '查看错误详情中的 Retry-After 提示（如果有）',
            '等待 30~60 秒后重试',
            '如果频繁遇到此问题，降低同时进行的操作数量',
            '考虑升级 API 套餐以获得更高的速率限制',
          ],
          relatedCodes: ['429_TOO_MANY_REQUESTS'],
        },
        {
          code: 'DNS_RESOLUTION_FAILED',
          message: 'DNS 解析失败，无法连接到服务器',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '域名解析失败，可能是 DNS 服务器故障、域名不存在或本地 DNS 缓存损坏。',
          solution: '检查域名拼写，刷新 DNS 缓存，更换 DNS 服务器。',
          steps: [
            '检查域名拼写是否正确',
            '运行 ipconfig /flushdns 或 sudo dscacheutil -flushcache',
            '更换为 8.8.8.8 或 1.1.1.1 等公共 DNS',
            '检查 hosts 文件是否被篡改',
            '重启网络设备'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'TLS_CERT_EXPIRED',
          message: 'TLS 证书已过期，连接被拒绝',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '服务器 SSL/TLS 证书已过期，或本地系统时间不正确导致证书验证失败。',
          solution: '联系管理员更新证书，或检查本地系统时间。',
          steps: [
            '检查本地系统时间是否正确',
            '尝试用浏览器直接访问 API 地址查看证书信息',
            '联系服务提供商更新证书',
            '临时绕过：在开发环境关闭证书验证（不推荐用于生产）'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'TLS_CERT_UNTRUSTED',
          message: 'TLS 证书不受信任',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '服务器使用了自签名证书、中间证书缺失或证书链不完整。',
          solution: '安装根证书，或联系管理员修复证书链。',
          steps: [
            '下载并安装服务器的根证书',
            '检查证书链是否完整',
            '确认系统 CA 存储是最新的',
            '如果使用自签名证书，将其添加到信任存储'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'TLS_HANDSHAKE_FAILED',
          message: 'TLS 握手失败',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '客户端与服务器支持的 TLS 版本或密码套件不兼容。',
          solution: '升级客户端 TLS 版本，或联系服务器管理员启用兼容的密码套件。',
          steps: [
            '检查客户端支持的 TLS 版本（至少 1.2）',
            '使用 openssl s_client 测试握手',
            '联系管理员启用 TLS 1.2/1.3',
            '更新操作系统和浏览器'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'PROXY_AUTHENTICATION_REQUIRED',
          message: '代理服务器需要认证',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '通过代理服务器访问互联网时，代理要求提供用户名和密码。',
          solution: '在系统或应用设置中配置代理认证信息。',
          steps: [
            '检查系统代理设置',
            '在应用设置中配置代理用户名和密码',
            '确认代理服务器地址和端口正确',
            '联系网络管理员获取代理凭据'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'PROXY_CONNECTION_REFUSED',
          message: '代理服务器连接被拒绝',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '配置的代理服务器地址错误或代理服务未运行。',
          solution: '检查代理设置，确认代理服务器可用。',
          steps: [
            '确认代理服务器地址和端口正确',
            '测试直接连接（绕过代理）',
            '检查代理服务是否运行',
            '联系网络管理员'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'WEBSOCKET_CONNECTION_FAILED',
          message: 'WebSocket 连接失败',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: 'WebSocket 服务器未启动、防火墙阻止了 WebSocket 端口或 URL 路径错误。',
          solution: '检查 WebSocket 服务器状态，确认防火墙规则。',
          steps: [
            '检查 WebSocket URL 是否正确',
            '确认服务器端 WebSocket 服务已启动',
            '检查防火墙是否阻止了 ws/wss 端口',
            '查看浏览器控制台的网络日志'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'WEBSOCKET_CLOSED_UNEXPECTEDLY',
          message: 'WebSocket 意外断开',
          severity: 'warning',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '网络不稳定、服务器重启或心跳超时导致连接断开。',
          solution: '实现自动重连机制，增加心跳间隔。',
          steps: [
            '检查网络稳定性',
            '实现指数退避重连逻辑',
            '增加心跳包发送频率',
            '查看服务器日志确认断开原因'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'CDN_RESOURCE_UNAVAILABLE',
          message: 'CDN 资源不可用',
          severity: 'warning',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: 'CDN 节点故障、资源被删除或缓存过期。',
          solution: '刷新 CDN 缓存，切换到备用 CDN 源。',
          steps: [
            '尝试直接访问源站确认资源存在',
            '刷新 CDN 缓存',
            '检查 CDN 配置是否正确',
            '切换到备用 CDN 域名'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'CDN_CACHE_STALE',
          message: 'CDN 返回过期缓存内容',
          severity: 'info',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: 'CDN 缓存未及时刷新，导致客户端获取到旧版本资源。',
          solution: '强制刷新 CDN 缓存或添加版本号参数。',
          steps: [
            '在 URL 后添加 ?v=timestamp 强制刷新',
            '联系 CDN 提供商刷新缓存',
            '检查缓存 TTL 配置',
            '使用文件名哈希实现长期缓存'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'LOAD_BALANCER_UNAVAILABLE',
          message: '负载均衡器无可用后端',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '所有后端服务器均不可用或健康检查失败。',
          solution: '检查后端服务器状态，修复或扩容。',
          steps: [
            '检查所有后端服务器的健康状态',
            '查看负载均衡器日志',
            '重启故障的后端实例',
            '临时减少负载或启用降级策略'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'IPv6_CONNECTIVITY_ISSUE',
          message: 'IPv6 连接问题',
          severity: 'warning',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '客户端优先使用 IPv6 但网络不支持，导致连接超时后 fallback 到 IPv4。',
          solution: '禁用 IPv6 或修复 IPv6 网络配置。',
          steps: [
            '测试 IPv6 连通性（test-ipv6.com）',
            '在系统设置中临时禁用 IPv6',
            '检查路由器 IPv6 配置',
            '联系 ISP 确认 IPv6 支持'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'FIREWALL_BLOCKED_REQUEST',
          message: '防火墙拦截了请求',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '企业防火墙、ISP 拦截或国家/地区网络限制阻止了出站请求。',
          solution: '使用 VPN、更换网络或联系网络管理员。',
          steps: [
            '测试同一网络下其他设备是否可以访问',
            '尝试使用 VPN 或代理',
            '联系网络管理员添加白名单',
            '检查请求是否触发了 WAF 规则'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'MAN_IN_THE_MIDDLE_DETECTED',
          message: '检测到中间人攻击',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: 'HTTPS 连接被中间设备（如企业代理、恶意软件）拦截和篡改。',
          solution: '立即停止操作，检查网络环境安全性。',
          steps: [
            '不要继续操作，避免敏感数据泄露',
            '检查系统是否安装了未知证书',
            '运行杀毒软件扫描',
            '更换安全的网络环境（如手机热点）',
            '联系安全团队'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'COOKIE_BLOCKED_THIRD_PARTY',
          message: '第三方 Cookie 被阻止',
          severity: 'warning',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '浏览器隐私设置或扩展程序阻止了第三方 Cookie，影响跨域认证。',
          solution: '调整浏览器隐私设置或使用 SameSite=None; Secure。',
          steps: [
            '检查浏览器是否启用了「阻止第三方 Cookie」',
            '在浏览器设置中添加网站例外',
            '后端设置 Cookie 的 SameSite 属性为 None 并启用 Secure',
            '考虑使用 Token 替代 Cookie 方案'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'CORS_PREFLIGHT_FAILED',
          message: 'CORS 预检请求失败',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: 'OPTIONS 预检请求未返回正确的 Access-Control-Allow 头。',
          solution: '后端添加 OPTIONS 路由并返回正确的 CORS 头。',
          steps: [
            '检查后端是否正确处理 OPTIONS 请求',
            '确认 Access-Control-Allow-Methods 包含实际使用的方法',
            '确认 Access-Control-Allow-Headers 包含自定义头',
            '检查 Access-Control-Max-Age 配置'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'CORS_CREDENTIALS_NOT_ALLOWED',
          message: 'CORS 不允许携带凭证',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '前端设置了 withCredentials=true 但后端未返回 Access-Control-Allow-Credentials: true。',
          solution: '后端添加 Access-Control-Allow-Credentials: true 头。',
          steps: [
            '后端设置 Access-Control-Allow-Credentials: true',
            '确认 Access-Control-Allow-Origin 不是通配符 *',
            '检查前端是否正确设置了 credentials 选项',
            '测试不带凭证的请求是否正常'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_VERSION_DEPRECATED',
          message: 'API 版本已弃用',
          severity: 'warning',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '使用的 API 版本已被标记为弃用，将在未来移除。',
          solution: '迁移到最新的 API 版本。',
          steps: [
            '查看 API 文档中的版本迁移指南',
            '更新请求 URL 到新版本',
            '测试新版本 API 的响应格式差异',
            '更新相关解析代码'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_VERSION_REMOVED',
          message: 'API 版本已移除',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '使用的 API 版本已被完全移除，不再可用。',
          solution: '紧急迁移到受支持的 API 版本。',
          steps: [
            '查看 API 提供商的版本支持时间表',
            '升级到最新的稳定版本',
            '全面测试所有受影响的功能',
            '更新客户端代码和文档'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_ENDPOINT_CHANGED',
          message: 'API 端点地址已变更',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '服务提供商更换了 API 端点域名或路径结构。',
          solution: '更新 API Base URL 和端点路径。',
          steps: [
            '查看 API 提供商的官方公告',
            '更新配置中的 API Base URL',
            '检查所有端点路径是否需要调整',
            '测试所有 API 调用'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_SCHEMA_CHANGED',
          message: 'API 响应结构变更',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: 'API 返回的数据结构与预期不符，可能是后端升级导致字段变化。',
          solution: '更新前端解析逻辑以适配新的响应结构。',
          steps: [
            '查看 API 变更日志',
            '更新 TypeScript 类型定义',
            '添加字段存在性检查避免 undefined 访问',
            '使用可选链操作符 ?. 安全访问字段'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_RESPONSE_MALFORMED_JSON',
          message: 'API 返回了损坏的 JSON',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '服务器返回了非 JSON 内容（如 HTML 错误页、BOM 头、截断响应）。',
          solution: '检查后端日志，确认返回格式正确。',
          steps: [
            '查看浏览器网络面板的原始响应内容',
            '检查后端是否抛出了未捕获异常',
            '确认响应头 Content-Type 为 application/json',
            '检查是否有代理修改了响应内容'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_RESPONSE_TOO_LARGE',
          message: 'API 响应体过大',
          severity: 'warning',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: 'API 返回了超大响应体，超过前端或代理的接收限制。',
          solution: '请求分页数据或使用流式传输。',
          steps: [
            '检查响应体大小',
            '实现分页请求逻辑',
            '使用 Range 请求分块获取',
            '压缩传输启用 gzip/brotli'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_REQUEST_TOO_LARGE',
          message: 'API 请求体过大',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '上传的数据（如图片 Base64、长文本）超过了服务器接收限制。',
          solution: '压缩数据、分片上传或增加服务器限制。',
          steps: [
            '压缩图片后重新上传',
            '将大请求拆分为多个小请求',
            '联系管理员增加服务器 body-parser 限制',
            '使用流式上传替代一次性上传'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_QUERY_PARAM_TOO_LONG',
          message: '查询参数过长',
          severity: 'warning',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: 'URL 查询字符串超过浏览器或服务器的限制（通常 2048 字符）。',
          solution: '使用 POST 请求体代替查询参数。',
          steps: [
            '将数据从 URL 参数移到 POST body',
            '使用表单数据或 JSON body',
            '缩短参数名或值',
            '检查是否有重复参数'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_HEADER_TOO_LARGE',
          message: '请求头过大',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '自定义头（如 Authorization Bearer token）过长，超过服务器限制。',
          solution: '缩短 token 长度，或减少自定义头数量。',
          steps: [
            '检查 Authorization 头的长度',
            '移除不必要的自定义头',
            '联系管理员增加 large_client_header_buffers',
            '使用 cookie 替代超长的 header'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'OAUTH_TOKEN_EXPIRED',
          message: 'OAuth 访问令牌已过期',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: 'OAuth 2.0 的 access_token 已过期，需要使用 refresh_token 刷新。',
          solution: '使用 refresh_token 获取新的 access_token。',
          steps: [
            '检查 token 的过期时间',
            '使用 refresh_token 调用 token 端点',
            '更新存储的 access_token',
            '实现自动刷新逻辑'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'OAUTH_REFRESH_TOKEN_EXPIRED',
          message: 'OAuth 刷新令牌已过期',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: 'refresh_token 也已过期，需要重新授权。',
          solution: '引导用户重新进行 OAuth 授权流程。',
          steps: [
            '清除本地存储的 token 信息',
            '重定向用户到 OAuth 授权页面',
            '用户完成授权后存储新的 token 对',
            '设置提醒在 token 过期前刷新'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'OAUTH_SCOPE_INSUFFICIENT',
          message: 'OAuth 权限范围不足',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '当前 access_token 的 scope 不包含执行该操作所需的权限。',
          solution: '请求更大 scope 的授权，或联系管理员分配权限。',
          steps: [
            '检查当前 token 的 scope 列表',
            '在授权请求中添加缺失的 scope',
            '引导用户重新授权',
            '联系管理员确认权限配置'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'OAUTH_STATE_MISMATCH',
          message: 'OAuth state 参数不匹配',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: 'CSRF 防护的 state 参数在授权回调时不匹配，可能是 CSRF 攻击。',
          solution: '重新发起授权请求，确保 state 参数正确传递。',
          steps: [
            '清除当前授权流程的状态',
            '重新生成随机 state 参数',
            '确保 state 在请求和回调间一致',
            '检查是否有中间页篡改了 state'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'JWT_SIGNATURE_INVALID',
          message: 'JWT 签名无效',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: 'JWT token 的签名与密钥不匹配，token 可能被篡改。',
          solution: '重新获取有效的 JWT token。',
          steps: [
            '检查 token 是否完整（三部分 base64）',
            '确认使用的密钥与签发时一致',
            '重新登录获取新 token',
            '检查 token 是否在传输中被截断'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'JWT_TOKEN_EXPIRED',
          message: 'JWT token 已过期',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: 'JWT 的 exp 声明已过期。',
          solution: '使用刷新机制或重新登录获取新 token。',
          steps: [
            '检查 token 的 exp 时间戳',
            '如果支持 refresh，调用刷新接口',
            '否则引导用户重新登录',
            '实现 token 过期前的自动刷新'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'JWT_ISSUER_MISMATCH',
          message: 'JWT 签发者不匹配',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: 'JWT 的 iss 声明与预期的签发者不符。',
          solution: '检查 token 来源，确保使用正确的认证服务。',
          steps: [
            '验证 JWT 的 iss 字段',
            '确认使用了正确的认证服务器',
            '检查是否有多个认证服务共存',
            '联系管理员确认签发者配置'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'JWT_AUDIENCE_MISMATCH',
          message: 'JWT 受众不匹配',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: 'JWT 的 aud 声明与当前应用不匹配。',
          solution: '确认 token 是为当前应用签发的。',
          steps: [
            '检查 JWT 的 aud 字段',
            '确认应用的 client_id 与 aud 匹配',
            '如果是多租户应用，检查租户配置',
            '重新获取正确的 token'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_KEY_FORMAT_INVALID',
          message: 'API Key 格式无效',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '输入的 API Key 不符合预期格式（如长度、前缀、字符集）。',
          solution: '检查 API Key 是否正确复制，去除多余空格。',
          steps: [
            '检查 Key 是否包含前导或尾随空格',
            '确认 Key 的长度与服务商要求一致',
            '检查是否有非法字符（如换行符）',
            '重新从服务商后台复制 Key'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_KEY_REVOKED',
          message: 'API Key 已被吊销',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: 'API Key 已被用户或管理员主动吊销。',
          solution: '生成新的 API Key 并更新配置。',
          steps: [
            '登录服务商后台检查 Key 状态',
            '确认 Key 是否被意外吊销',
            '生成新的 API Key',
            '更新所有使用该 Key 的配置'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_KEY_QUOTA_EXHAUSTED',
          message: 'API Key 额度已用完',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: 'API Key 的月度/年度调用额度已全部消耗。',
          solution: '升级套餐或等待额度重置。',
          steps: [
            '登录服务商后台查看额度使用情况',
            '考虑升级到更高额度套餐',
            '优化调用频率减少浪费',
            '设置额度使用预警'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_KEY_IP_RESTRICTED',
          message: 'API Key 存在 IP 白名单限制',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: 'API Key 绑定了特定 IP，当前请求的源 IP 不在白名单中。',
          solution: '在服务商后台添加当前 IP 到白名单，或更换不受限制的 Key。',
          steps: [
            '查看当前公网 IP（whatismyipaddress.com）',
            '登录服务商后台添加 IP 白名单',
            '或生成新的无 IP 限制 Key',
            '如果使用代理，确认代理出口 IP'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_KEY_REGION_BLOCKED',
          message: 'API Key 在当前地区被限制',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '服务商基于地理限制阻止了该地区的 API 调用。',
          solution: '使用 VPN 切换到允许的地区，或联系服务商解除限制。',
          steps: [
            '确认当前所在地区是否在限制列表',
            '使用 VPN 切换到允许的地区',
            '联系服务商申请解除地区限制',
            '考虑使用其他地区的服务商'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_RETRY_EXHAUSTED',
          message: 'API 重试次数已耗尽',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '所有重试策略均已执行但仍未成功，可能是持续性故障。',
          solution: '检查网络和服务状态，稍后重试或联系支持。',
          steps: [
            '检查服务商状态页面',
            '查看网络连接是否正常',
            '等待几分钟后手动重试',
            '联系服务商技术支持'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_CIRCUIT_BREAKER_OPEN',
          message: '熔断器已打开',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '连续失败次数超过阈值，熔断器进入打开状态，拒绝后续请求。',
          solution: '等待熔断器超时后自动恢复，或手动重置。',
          steps: [
            '等待熔断器冷却期结束（通常 30-60 秒）',
            '检查并修复导致连续失败的根本原因',
            '手动重置熔断器状态（如果有管理接口）',
            '监控失败率避免再次触发熔断'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_THROTTLING_BURST_LIMIT',
          message: 'API 突发流量限制',
          severity: 'warning',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '短时间内请求量超过了突发限制（burst limit），即使平均速率未超。',
          solution: '平滑请求发送频率，使用令牌桶或漏桶算法限流。',
          steps: [
            '实现客户端请求队列和速率限制',
            '使用令牌桶算法平滑请求',
            '增加请求间隔时间',
            '联系服务商提高突发限制'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_THROTTLING_STEADY_LIMIT',
          message: 'API 稳定速率限制',
          severity: 'warning',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '持续请求速率超过了稳定限制（steady limit）。',
          solution: '降低持续请求频率，或升级套餐。',
          steps: [
            '计算当前的平均请求速率',
            '降低到限制以下的频率',
            '实现自适应速率控制',
            '考虑升级套餐或申请提高限制'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_CONCURRENT_LIMIT_EXCEEDED',
          message: 'API 并发请求数超限',
          severity: 'warning',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '同时发起的请求数量超过了服务商的并发限制。',
          solution: '使用连接池或请求队列限制并发数。',
          steps: [
            '检查当前并发请求数',
            '实现请求队列和最大并发限制',
            '使用 Promise.allSettled 替代 Promise.all',
            '减少同时进行的操作数量'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_CONTENT_MODERATION_BLOCKED',
          message: 'API 内容审核拦截',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '请求内容触发了服务商的内容安全策略（如敏感词、违规图片）。',
          solution: '修改请求内容以符合内容政策，或联系服务商申诉。',
          steps: [
            '检查请求内容是否包含敏感信息',
            '修改或删除触发审核的内容',
            '如果误判，联系服务商申诉',
            '阅读服务商的内容政策文档'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_CONTENT_MODERATION_ERROR',
          message: 'API 内容审核服务出错',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '内容审核服务本身出现故障，无法完成审核。',
          solution: '稍后重试，或临时绕过审核（如业务允许）。',
          steps: [
            '等待几分钟后重试',
            '检查服务商状态页面',
            '如果业务允许，临时禁用内容审核',
            '联系服务商报告问题'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_RESPONSE_ENCODING_ERROR',
          message: 'API 响应编码错误',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '服务器返回了非 UTF-8 编码的内容，或 Content-Type 头与内容编码不匹配。',
          solution: '检查后端编码配置，确保返回 UTF-8。',
          steps: [
            '检查响应头的 charset 声明',
            '使用 TextDecoder 指定编码',
            '联系后端团队确认编码设置',
            '统一使用 UTF-8 编码'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_RESPONSE_COMPRESSION_ERROR',
          message: 'API 响应解压失败',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '服务器返回了 gzip/brotli 压缩内容但解压失败（如数据损坏）。',
          solution: '禁用压缩传输，或检查压缩数据完整性。',
          steps: [
            '在请求头中移除 Accept-Encoding',
            '检查代理是否修改了压缩数据',
            '使用原始未压缩数据测试',
            '联系服务商检查压缩实现'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_CHUNKED_TRANSFER_ERROR',
          message: '分块传输错误',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: 'Chunked Transfer-Encoding 过程中连接中断或数据块格式错误。',
          solution: '检查网络稳定性，或禁用分块传输。',
          steps: [
            '检查网络连接是否稳定',
            '在服务器端禁用 chunked 传输',
            '增加连接保持时间',
            '使用 Content-Length 替代 chunked'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_KEEPALIVE_TIMEOUT',
          message: 'Keep-Alive 连接超时',
          severity: 'warning',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: 'HTTP Keep-Alive 连接空闲时间过长被服务器或中间件关闭。',
          solution: '减少 Keep-Alive 空闲时间，或发送心跳请求。',
          steps: [
            '降低客户端 Keep-Alive 空闲超时',
            '定期发送心跳请求保持连接',
            '使用连接池自动管理连接生命周期',
            '在请求前检查连接状态'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_HTTP2_STREAM_ERROR',
          message: 'HTTP/2 流错误',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: 'HTTP/2 连接中的某个流出现错误（如流重置、窗口溢出）。',
          solution: '降级到 HTTP/1.1，或修复 HTTP/2 配置。',
          steps: [
            '在客户端禁用 HTTP/2',
            '检查服务器的 HTTP/2 设置',
            '增加流控制窗口大小',
            '查看 HTTP/2 错误代码（RST_STREAM）'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_HTTP2_GOAWAY',
          message: 'HTTP/2 GOAWAY 帧接收',
          severity: 'warning',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '服务器发送了 GOAWAY 帧，表示即将关闭连接。',
          solution: '在新连接上重试请求，实现连接优雅迁移。',
          steps: [
            '捕获 GOAWAY 事件',
            '在新连接上重试未完成的请求',
            '检查服务器的最大流限制',
            '实现连接预热避免冷启动'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_HTTP3_CONNECTION_ERROR',
          message: 'HTTP/3 连接错误',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '基于 QUIC 的 HTTP/3 连接建立失败（如 UDP 被阻止）。',
          solution: '降级到 HTTP/2 或 HTTP/1.1，或开放 UDP 端口。',
          steps: [
            '检查防火墙是否阻止了 UDP',
            '在客户端禁用 HTTP/3',
            '确认服务器支持 HTTP/3',
            '使用支持 HTTP/3 的库版本'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_GRAPHQL_VALIDATION_ERROR',
          message: 'GraphQL 查询验证失败',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: 'GraphQL 查询语法错误、字段不存在或类型不匹配。',
          solution: '检查查询语法，使用 GraphQL 文档验证工具。',
          steps: [
            '使用 GraphQL Playground 验证查询',
            '检查字段名和类型是否与 schema 匹配',
            '确认查询变量类型正确',
            '查看 GraphQL 错误详情中的路径信息'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_GRAPHQL_EXECUTION_ERROR',
          message: 'GraphQL 执行错误',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: 'GraphQL 查询在执行期间出错（如 resolver 抛异常）。',
          solution: '查看 GraphQL 错误详情中的路径和扩展信息，修复对应 resolver。',
          steps: [
            '查看 errors 数组中的 path 定位问题字段',
            '检查 resolver 日志',
            '确认数据源（数据库、API）是否正常',
            '添加 resolver 的错误处理'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_GRAPHQL_RATE_LIMITED',
          message: 'GraphQL 查询复杂度超限',
          severity: 'warning',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: 'GraphQL 查询的复杂度评分超过了服务端限制（如嵌套太深、返回字段太多）。',
          solution: '简化查询，减少嵌套层级和返回字段数量。',
          steps: [
            '使用查询复杂度分析工具',
            '减少查询嵌套层级',
            '使用分页代替全量查询',
            '将大查询拆分为多个小查询'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_WEBHOOK_DELIVERY_FAILED',
          message: 'Webhook 投递失败',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '服务端尝试向配置的 Webhook URL 发送事件但失败（如 URL 不可达、返回非 2xx）。',
          solution: '检查 Webhook URL 可用性，确保端点返回 2xx。',
          steps: [
            '测试 Webhook URL 是否可达',
            '确保端点能快速响应（< 30 秒）',
            '返回 2xx 状态码确认接收',
            '查看 Webhook 投递日志和重试记录'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_WEBHOOK_SIGNATURE_INVALID',
          message: 'Webhook 签名验证失败',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: 'Webhook 请求的签名与本地计算结果不匹配，可能是伪造请求。',
          solution: '检查签名算法和密钥，确保使用正确的 secret。',
          steps: [
            '确认使用的 secret 与配置一致',
            '检查签名算法（HMAC-SHA256 等）',
            '验证时间戳是否在允许窗口内',
            '不要依赖 webhook 请求体做关键操作'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_IDEMPOTENCY_KEY_REUSE',
          message: '幂等键已被使用',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '使用了相同的幂等键（Idempotency-Key）但请求内容不同。',
          solution: '为每次新请求生成唯一的幂等键。',
          steps: [
            '使用 UUID 生成唯一幂等键',
            '确保同一业务操作的幂等键一致',
            '检查幂等键的存储和复用逻辑',
            '阅读服务商的幂等性文档'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_IDEMPOTENCY_KEY_EXPIRED',
          message: '幂等键已过期',
          severity: 'warning',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '幂等键的有效期已过，服务端不再识别该键。',
          solution: '重新生成幂等键并发起请求。',
          steps: [
            '了解服务商的幂等键有效期',
            '在有效期内完成操作',
            '重新生成新的幂等键',
            '实现幂等键的自动刷新机制'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_BATCH_PARTIAL_FAILURE',
          message: '批量请求部分失败',
          severity: 'warning',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '批量 API 请求中的部分子请求失败，其他成功。',
          solution: '处理成功的结果，对失败的子请求单独重试。',
          steps: [
            '解析批量响应中的每个子结果',
            '提取失败的子请求',
            '对失败的子请求单独重试',
            '记录失败原因用于后续分析'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_BATCH_SIZE_EXCEEDED',
          message: '批量请求大小超限',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '批量请求包含的子请求数量超过了服务端限制。',
          solution: '将大批量拆分为多个小批次发送。',
          steps: [
            '检查服务商的批量大小限制',
            '将请求拆分为多个批次',
            '实现批次队列和顺序处理',
            '监控各批次的处理结果'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_PAGINATION_CURSOR_INVALID',
          message: '分页游标无效',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '使用的分页游标已过期或格式不正确。',
          solution: '重新获取第一页数据，使用新的游标。',
          steps: [
            '重新请求第一页获取新的游标',
            '检查游标是否被截断或篡改',
            '确认游标编码格式正确',
            '实现游标失效后的自动回退'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_PAGINATION_OFFSET_TOO_LARGE',
          message: '分页偏移量过大',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '使用 offset 分页时偏移量超过了服务端支持的最大值。',
          solution: '使用游标分页（cursor-based）替代偏移分页。',
          steps: [
            '了解 offset 的最大限制',
            '迁移到游标分页方案',
            '如果必须使用 offset，缩小每页大小',
            '考虑使用搜索过滤减少总数据量'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_SORT_PARAMETER_INVALID',
          message: '排序参数无效',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '请求中指定的排序字段不存在或不支持排序。',
          solution: '检查可用的排序字段列表，使用正确的字段名。',
          steps: [
            '查看 API 文档中的排序字段列表',
            '确认字段名拼写正确',
            '检查是否使用了不支持的排序方向（asc/desc）',
            '移除非法的排序参数'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_FILTER_PARAMETER_INVALID',
          message: '过滤参数无效',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '请求中指定的过滤条件格式错误或字段不存在。',
          solution: '检查过滤参数格式，参考 API 文档中的过滤语法。',
          steps: [
            '查看 API 文档的过滤语法说明',
            '确认过滤字段名和运算符正确',
            '检查过滤值的类型是否匹配',
            '简化过滤条件逐步测试'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_FIELD_SELECTION_INVALID',
          message: '字段选择参数无效',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '请求中指定的返回字段不存在或无权访问。',
          solution: '检查可用的字段列表，移除非法字段。',
          steps: [
            '查看 API 文档的字段列表',
            '确认字段名拼写正确',
            '检查是否需要特定权限才能访问某些字段',
            '使用通配符或默认字段集'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_EXPAND_PARAMETER_INVALID',
          message: '关联展开参数无效',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '请求中尝试展开的关联资源不存在或不支持展开。',
          solution: '检查可展开的关联资源列表。',
          steps: [
            '查看 API 文档的 expand 支持列表',
            '确认关联资源名正确',
            '检查是否有权限访问关联资源',
            '减少展开层级避免性能问题'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_INCLUDE_PARAMETER_INVALID',
          message: '包含参数无效',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '请求中指定的包含（include）资源不存在。',
          solution: '检查可用的 include 选项列表。',
          steps: [
            '查看 API 文档的 include 支持列表',
            '确认资源名拼写正确',
            '检查 include 和 expand 的区别',
            '移除非法的 include 参数'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_EMBED_PARAMETER_INVALID',
          message: '嵌入参数无效',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '请求中尝试嵌入的资源类型不支持嵌入。',
          solution: '检查可嵌入的资源类型列表。',
          steps: [
            '查看 API 文档的 embed 支持列表',
            '确认嵌入的资源类型正确',
            '考虑使用 expand 或 include 替代',
            '检查嵌入深度限制'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_AGGREGATION_NOT_SUPPORTED',
          message: '聚合查询不支持',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '请求中使用了聚合操作（如 count、sum、avg）但该端点不支持。',
          solution: '使用客户端聚合，或调用专门的聚合端点。',
          steps: [
            '查看 API 文档确认是否支持聚合',
            '在客户端对返回数据进行聚合',
            '使用专门的统计/报表端点',
            '联系服务商申请聚合功能'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_SEARCH_QUERY_SYNTAX_ERROR',
          message: '搜索查询语法错误',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '搜索查询字符串包含语法错误（如未闭合引号、非法运算符）。',
          solution: '检查搜索语法，参考搜索引擎的查询语法文档。',
          steps: [
            '检查引号是否成对闭合',
            '确认运算符（AND/OR/NOT）使用正确',
            '转义特殊字符',
            '使用简单的关键词搜索测试'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_SEARCH_INDEX_NOT_READY',
          message: '搜索索引未就绪',
          severity: 'warning',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '搜索服务正在重建索引，暂时无法提供准确结果。',
          solution: '等待索引重建完成，或返回部分结果。',
          steps: [
            '检查搜索服务状态',
            '等待索引重建完成',
            '使用数据库直接查询作为降级方案',
            '实现搜索结果的缓存'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_REALTIME_CONNECTION_LIMIT',
          message: '实时连接数超限',
          severity: 'warning',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '同时建立的实时连接（WebSocket/SSE）数量超过了限制。',
          solution: '关闭不必要的连接，或使用连接复用/多路复用。',
          steps: [
            '检查当前活跃的实时连接数',
            '关闭不需要的连接',
            '使用单一连接订阅多个主题',
            '实现连接池管理'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_SSE_CONNECTION_FAILED',
          message: 'SSE 连接失败',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: 'Server-Sent Events 连接无法建立，可能是服务器不支持或中间件阻止。',
          solution: '检查服务器 SSE 支持，确认代理允许 text/event-stream。',
          steps: [
            '确认服务器端实现了 SSE 端点',
            '检查响应头 Content-Type: text/event-stream',
            '确认代理和防火墙允许长连接',
            '测试简单的 SSE 端点'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_SSE_RECONNECT_FAILED',
          message: 'SSE 重连失败',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: 'SSE 连接断开后自动重连多次仍然失败。',
          solution: '检查网络和服务状态，实现指数退避重连。',
          steps: [
            '实现指数退避重连逻辑',
            '检查服务器是否仍在运行',
            '确认 last-event-id 正确传递',
            '如果多次失败，提示用户手动刷新'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_LONG_POLLING_TIMEOUT',
          message: '长轮询超时',
          severity: 'warning',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '长轮询请求在超时前没有收到新数据。',
          solution: '这是正常行为，客户端应自动发起新的长轮询请求。',
          steps: [
            '捕获超时错误',
            '立即发起新的长轮询请求',
            '保持 last-seen 状态',
            '不要将此错误展示给用户'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_PUSH_NOTIFICATION_FAILED',
          message: '推送通知发送失败',
          severity: 'warning',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '向客户端发送推送通知失败（如设备离线、token 失效）。',
          solution: '更新设备 token，或等待设备上线后重试。',
          steps: [
            '检查设备 token 是否有效',
            '确认推送服务（FCM/APNs）配置正确',
            '移除失效的设备 token',
            '实现推送重试队列'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_PUSH_NOTIFICATION_TOKEN_INVALID',
          message: '推送通知 token 无效',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '设备的推送 token 已失效或格式错误。',
          solution: '请求客户端重新注册推送 token。',
          steps: [
            '从数据库中移除失效 token',
            '通知客户端重新获取 token',
            '更新存储的 token',
            '检查 token 格式是否符合 FCM/APNs 要求'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_FILE_UPLOAD_URL_EXPIRED',
          message: '文件上传预签名 URL 已过期',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '获取的预签名上传 URL（如 S3 presigned URL）已过期。',
          solution: '重新请求新的预签名 URL。',
          steps: [
            '重新调用获取上传 URL 的接口',
            '检查 URL 的有效期配置',
            '在过期前完成上传',
            '实现 URL 刷新机制'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_FILE_UPLOAD_URL_INVALID',
          message: '文件上传预签名 URL 无效',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '预签名 URL 格式错误或已被使用。',
          solution: '重新获取新的预签名 URL。',
          steps: [
            '检查 URL 是否完整',
            '确认 URL 未被重复使用',
            '重新请求新的上传 URL',
            '检查 URL 生成逻辑'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_MULTIPART_UPLOAD_INIT_FAILED',
          message: '分片上传初始化失败',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '服务端无法创建分片上传任务（如存储桶权限不足）。',
          solution: '检查存储服务配置和权限。',
          steps: [
            '检查存储桶写入权限',
            '确认分片上传接口可用',
            '查看服务端日志',
            '联系管理员检查存储配置'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_MULTIPART_UPLOAD_PART_FAILED',
          message: '分片上传某一片失败',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '某个分片的上传失败（如网络中断、签名过期）。',
          solution: '单独重试失败的分片，不需要重新上传所有分片。',
          steps: [
            '记录失败的 part number',
            '单独重新上传该分片',
            '确认该分片的 ETag 匹配',
            '继续完成分片合并'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_MULTIPART_UPLOAD_COMPLETE_FAILED',
          message: '分片上传合并失败',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '所有分片上传完成后，服务端合并失败（如分片缺失、顺序错误）。',
          solution: '检查所有分片是否上传成功，重新发起合并请求。',
          steps: [
            '列出已上传的分片清单',
            '确认没有缺失的分片',
            '检查分片顺序是否正确',
            '重新调用完成接口'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_MULTIPART_UPLOAD_ABORT_FAILED',
          message: '分片上传取消失败',
          severity: 'warning',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：网络请求层',
          cause: '尝试取消分片上传任务失败，可能导致存储空间浪费。',
          solution: '手动清理未完成的 upload，或配置自动清理策略。',
          steps: [
            '手动调用取消接口',
            '检查服务端是否有自动清理策略',
            '定期清理未完成的 multipart upload',
            '监控存储桶中的未完成上传'
          ],
          prevention: '定期检查 API 配置、网络环境和证书有效期。',
        },
        {
          code: 'API_TIMEOUT',
          message: '请求长时间无响应，最终提示超时',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：错误面板 / 进度条',
          cause: '后端处理耗时过长，超过了前端设置的超时时间。可能原因：请求数据量过大、模型负载高、网络延迟高。',
          solution: '降低请求规模或增加超时时间。',
          steps: [
            '降低图像尺寸、Max Tokens 或待合成文本长度',
            '增加超时设置值',
            '检查网络连接是否稳定',
            '如果使用的是自定义 API，确认后端服务器状态正常',
            '重试',
          ],
          relatedCodes: ['NETWORK_TIMEOUT', 'BACKEND_UNAVAILABLE'],
          prevention: '处理大尺寸图片或大量文本时，提前降低参数规模（图像尺寸、Max Tokens 等）；网络不稳定时增加超时设置。',
        },
        {
          code: 'BACKEND_UNAVAILABLE',
          message: '提示「后端不可用」「无法连接到服务器」或请求无法发出',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：错误面板',
          cause: '后端服务器未启动、崩溃、或前端配置的 API Base URL 不正确。',
          solution: '检查后端服务状态和 API 配置。',
          steps: [
            '打开浏览器开发者工具 → Network 标签页',
            '重新操作，观察请求是否发出以及响应状态码',
            '如果请求未发出，检查「设置 → API → API Base URL」是否正确',
            '如果请求返回 502/503，联系后端管理员确认服务状态',
            '如果是本地部署，确认后端进程是否在运行（npm start）',
          ],
          relatedCodes: ['NETWORK_DISCONNECTED', '502_BAD_GATEWAY', '503_SERVICE_UNAVAILABLE'],
          prevention: '本地部署时确保后端进程已启动（npm start）；使用远程服务时确认 URL 配置正确。',
        },
        {
          code: 'NETWORK_DISCONNECTED',
          message: '提示网络断开或无法访问互联网',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：错误面板',
          cause: '设备未连接网络、Wi-Fi 断开、或防火墙阻止了请求。',
          solution: '恢复网络连接。',
          steps: [
            '检查设备的网络连接状态',
            '尝试访问其他网站确认网络是否正常',
            '如果使用代理/VPN，检查代理设置是否正确',
            '如果是公司/校园网络，确认是否限制了 API 访问',
          ],
          relatedCodes: ['BACKEND_UNAVAILABLE', 'API_TIMEOUT'],
          prevention: '使用联网工具前确认网络连接正常；避免在网络波动大的环境下进行长时间工作流。',
        },
        {
          code: 'NETWORK_TIMEOUT',
          message: '网络请求超时（与 API_TIMEOUT 区别：此错误由浏览器网络层触发）',
          severity: 'error',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：错误面板',
          cause: '浏览器底层网络连接超时。通常发生在网络极其不稳定或完全断开的情况下。',
          solution: '检查网络连接并重试。',
          steps: [
            '确认网络连接正常',
            '如果使用 Wi-Fi，尝试靠近路由器',
            '切换到有线网络或手机热点测试',
            '重试',
          ],
          relatedCodes: ['NETWORK_DISCONNECTED', 'API_TIMEOUT'],
          prevention: '使用稳定的网络连接；必要时切换为有线网络或更可靠的 Wi-Fi。',
        },
        {
          code: 'HOSTED_API_REQUIRED',
          message: '提示「当前为静态托管环境，必须配置自定义 API」',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：错误面板 / 顶部消息条',
          cause: '页面部署在 GitHub Pages、阿里云 OSS/CDN 等纯静态托管环境中，无法直接访问本地后端。必须配置远程自定义 API 地址和 Key 才能使用工作流功能。',
          solution: '在设置中配置远程 API 地址和 Key。',
          steps: [
            '打开「设置 → API」',
            '将「接口模式」切换为「自定义 API」',
            '在「API 地址」中填入已部署的后端根地址',
            '填入对应的 API Key',
            '保存后重试',
          ],
          relatedCodes: ['API_KEY_MISSING', 'BACKEND_UNAVAILABLE'],
          prevention: '在静态托管环境使用联网工具前，务必先部署后端服务并配置正确的 API 地址和 Key。',
        },
        {
          code: 'DIRECT_MODEL_ENDPOINT',
          message: '提示「当前填写的看起来是模型接口，不是工作流后端根地址」',
          severity: 'critical',
          category: 'A. API 与网络',
          location: '页面：任意需联网工具 → 区域：设置面板 API 标签页 / 错误面板',
          cause: '在「设置 → API → API 地址」中填写了类似 https://api.example.com/v1/chat/completions 的模型接口地址，而不是工作流后端根地址。工作流工具需要的是后端根地址，前端会自动拼接 /api/workflows 等路径。',
          solution: '修改为正确的工作流后端根地址。',
          steps: [
            '打开「设置 → API」',
            '将「API 地址」修改为后端根地址（格式如 https://your-backend.example.com）',
            '确保地址末尾没有 /v1/chat/completions 等模型路径',
            '保存后重试',
          ],
          relatedCodes: ['BACKEND_UNAVAILABLE', 'API_BASE_INVALID'],
          prevention: '配置 API 地址时只填写后端服务的根域名和端口，不要附加任何 API 路径。',
        },
      {
        code: 'API_DNS_RESOLUTION_FAILED',
        message: 'DNS 解析失败，无法连接到 API 服务器',
        severity: 'error',
        category: 'A. API 与网络',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '域名解析失败，可能是 DNS 配置错误、域名不存在或网络断开。',
        solution: '检查域名拼写，更换 DNS 服务器，或联系域名管理员。',
        steps: [
          '确认域名拼写正确',
          '尝试用 IP 地址直接访问',
          '更换 DNS 服务器为 8.8.8.8 或 1.1.1.1',
          '检查本地网络连接',
        ],
        prevention: '使用可靠的 DNS 服务，避免使用不稳定的域名。',
      },
      {
        code: 'API_SSL_CERTIFICATE_INVALID',
        message: 'SSL 证书无效或过期',
        severity: 'error',
        category: 'A. API 与网络',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '服务器 SSL 证书过期、自签名或域名不匹配。',
        solution: '更新服务器证书，或临时允许不安全连接（仅限开发环境）。',
        steps: [
          '检查证书有效期',
          '确认证书域名与访问域名一致',
          '重新申请并部署证书',
          '开发环境可临时绕过证书验证',
        ],
        prevention: '使用自动化证书管理工具（如 certbot）定期更新证书。',
      },
      {
        code: 'API_CONNECTION_RESET',
        message: '连接被服务器重置',
        severity: 'error',
        category: 'A. API 与网络',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '服务器主动关闭连接，可能是防火墙、安全组或服务器过载。',
        solution: '检查服务器防火墙规则，确认端口开放，降低请求频率。',
        steps: [
          '检查服务器防火墙和安全组规则',
          '确认目标端口已开放',
          '查看服务器负载情况',
          '降低并发请求数量',
        ],
        prevention: '配置合理的连接池和超时策略，避免突发高并发。',
      },
      {
        code: 'API_PROXY_AUTHENTICATION_REQUIRED',
        message: '代理服务器要求认证',
        severity: 'error',
        category: 'A. API 与网络',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '网络通过代理服务器访问，但缺少代理认证信息。',
        solution: '在请求中配置代理认证信息，或更换网络环境。',
        steps: [
          '检查系统代理设置',
          '确认代理用户名和密码正确',
          '在应用设置中配置代理认证',
          '尝试直连网络绕过代理',
        ],
        prevention: '企业网络中提前配置好代理认证信息。',
      },
      {
        code: 'API_IPV6_NOT_SUPPORTED',
        message: '当前网络环境不支持 IPv6',
        severity: 'warning',
        category: 'A. API 与网络',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '服务器或客户端仅支持 IPv4/IPv6 单栈，而网络环境不匹配。',
        solution: '切换网络协议栈，或使用双栈支持的服务器。',
        steps: [
          '检查网络接口的 IP 协议支持',
          '尝试禁用 IPv6 强制使用 IPv4',
          '联系网络管理员确认协议支持',
          '更换支持双栈的网络环境',
        ],
        prevention: '部署时确保服务器支持 IPv4/IPv6 双栈。',
      },
      {
        code: 'API_WEBSOCKET_UPGRADE_FAILED',
        message: 'WebSocket 升级失败',
        severity: 'error',
        category: 'A. API 与网络',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '服务器不支持 WebSocket，或中间代理阻止了协议升级。',
        solution: '确认服务器支持 WebSocket，检查代理配置。',
        steps: [
          '确认服务器端已实现 WebSocket 支持',
          '检查反向代理是否支持 WebSocket 转发',
          '确认请求头包含 Upgrade: websocket',
          '尝试使用不同的传输协议',
        ],
        prevention: '使用支持 WebSocket 的服务器和反向代理配置。',
      },
      {
        code: 'API_CHUNKED_ENCODING_ERROR',
        message: '分块传输编码错误',
        severity: 'error',
        category: 'A. API 与网络',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '服务器或中间代理在分块传输时出现格式错误。',
        solution: '禁用分块传输，或检查中间代理配置。',
        steps: [
          '检查响应头的 Transfer-Encoding',
          '尝试禁用分块传输',
          '检查反向代理的分块支持',
          '查看服务器日志中的编码错误',
        ],
        prevention: '确保所有中间节点支持 HTTP/1.1 分块传输。',
      },
      {
        code: 'API_CONTENT_LENGTH_MISMATCH',
        message: 'Content-Length 与实际内容长度不匹配',
        severity: 'warning',
        category: 'A. API 与网络',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '服务器返回的 Content-Length 头与实际响应体长度不一致。',
        solution: '忽略 Content-Length 头，或使用 Transfer-Encoding: chunked。',
        steps: [
          '检查服务器是否正确计算内容长度',
          '确认中间代理没有修改响应体',
          '尝试使用 chunked 传输',
          '更新服务器框架到最新版本',
        ],
        prevention: '使用可靠的 Web 框架，避免手动设置 Content-Length。',
      },
      {
        code: 'API_HTTPS_ONLY_REQUIRED',
        message: '服务器强制要求 HTTPS',
        severity: 'warning',
        category: 'A. API 与网络',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '服务器配置了 HSTS 或仅允许 HTTPS 访问。',
        solution: '使用 HTTPS 协议访问，或禁用服务器的强制 HTTPS 配置。',
        steps: [
          '将 http:// 改为 https://',
          '检查服务器 HSTS 配置',
          '确认 SSL 证书已正确安装',
          '开发环境可临时禁用强制 HTTPS',
        ],
        prevention: '生产环境始终使用 HTTPS，开发环境配置自签名证书。',
      },
      {
        code: 'API_RESPONSE_COMPRESSION_FAILED',
        message: '响应压缩解压失败',
        severity: 'warning',
        category: 'A. API 与网络',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '服务器返回了 gzip/br 压缩内容，但客户端无法正确解压。',
        solution: '禁用压缩，或确保客户端支持对应的压缩算法。',
        steps: [
          '检查 Accept-Encoding 请求头',
          '确认客户端支持 gzip/brotli',
          '尝试禁用压缩后重试',
          '更新客户端解压库',
        ],
        prevention: '确保客户端和服务器都支持通用的压缩算法。',
      },
      ],
    },
    {
      id: 'B',
      name: 'B. 配置与数据',
      description: '涉及配置文件导入导出、localStorage 存储、数据损坏、未保存警告等。',
      errors: [
        {
          code: 'CONFIG_CORRUPTED',
          message: '配置加载异常，界面显示不完整或功能无法使用',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：整个页面或特定功能区',
          cause: '浏览器 localStorage 中保存的配置数据损坏，可能由浏览器更新、手动清理数据、或跨版本导入不兼容的配置导致。',
          solution: '重置配置并清理 localStorage。',
          steps: [
            '点击页面上的「重刷」按钮',
            '在弹出的确认弹窗中点击确认',
            '如果仍然异常，按 Ctrl+Shift+I 打开开发者工具 → Application → Local Storage',
            '删除对应工具的存储键',
            '刷新页面后重新开始',
          ],
          relatedCodes: ['IMPORT_INVALID_JSON', 'STORAGE_READ_ONLY'],
          prevention: '不要手动修改 localStorage 中的数据；跨版本更新后如有异常，建议重置配置。',
        },
        {
          code: 'IMPORT_INVALID_CONFIG',
          message: '导入配置时提示「无效的配置数据」',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：「导入配置」按钮',
          cause: '导入的 JSON 中缺少必要的配置字段（如 llmConfig、ttsConfig）或格式不正确。',
          solution: '确认导入的是正确工具的配置文件。',
          steps: [
            '用文本编辑器打开文件',
            '确认包含正确的 tool 字段和配置对象',
            '重新导入正确的文件',
          ],
          relatedCodes: ['IMPORT_INVALID_JSON', 'IMPORT_TOOL_MISMATCH'],
        },
        {
          code: 'ENV_FILE_MISSING',
          message: '环境变量文件 .env 缺失',
          severity: 'critical',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '项目根目录缺少 .env 文件，导致所有环境变量未加载。',
          solution: '复制 .env.example 为 .env 并填写必要配置。',
          steps: [
            '复制 .env.example 为 .env',
            '填写所有必填的环境变量',
            '重启应用使配置生效',
            '检查日志确认配置已加载'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'ENV_VARIABLE_EMPTY',
          message: '环境变量值为空',
          severity: 'critical',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '.env 文件中存在键但没有值，或值仅包含空白字符。',
          solution: '为所有必填环境变量提供有效值。',
          steps: [
            '检查 .env 文件中是否有空值',
            '为缺失的变量提供有效值',
            '移除不必要的空行',
            '重启应用'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'ENV_VARIABLE_SYNTAX_ERROR',
          message: '环境变量语法错误',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '.env 文件中存在语法错误（如等号两侧有空格、值未加引号包含空格）。',
          solution: '修正 .env 文件语法，值包含空格时使用引号包裹。',
          steps: [
            '检查等号两侧是否有空格',
            '值包含空格时用双引号包裹',
            '移除非法字符',
            '使用 dotenv 解析器验证'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'ENV_VARIABLE_TYPE_MISMATCH',
          message: '环境变量类型不匹配',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '环境变量被解析为错误类型（如数字变量包含非数字字符、布尔变量不为 true/false）。',
          solution: '检查环境变量格式，确保与代码期望的类型一致。',
          steps: [
            '检查变量的实际值',
            '确认代码期望的类型',
            '进行必要的类型转换',
            '添加输入验证'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'CONFIG_FILE_PARSE_ERROR',
          message: '配置文件解析错误',
          severity: 'critical',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: 'JSON/YAML/TOML 配置文件格式不正确（如缺少逗号、括号不匹配、缩进错误）。',
          solution: '使用格式验证工具检查并修复配置文件。',
          steps: [
            '使用 JSON/YAML 验证工具检查文件',
            '查找并修复语法错误',
            '恢复到最后一个已知良好的版本',
            '重新加载配置'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'CONFIG_FILE_NOT_FOUND',
          message: '配置文件未找到',
          severity: 'critical',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '指定的配置文件路径不存在或文件名拼写错误。',
          solution: '确认配置文件路径正确，或创建默认配置文件。',
          steps: [
            '检查文件路径是否正确',
            '确认文件名拼写无误',
            '创建缺失的配置文件',
            '更新配置加载路径'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'CONFIG_SCHEMA_VALIDATION_FAILED',
          message: '配置模式验证失败',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '配置文件内容不符合预期的模式（如缺少必填字段、字段类型错误、值超出范围）。',
          solution: '根据模式定义修正配置值。',
          steps: [
            '查看模式验证错误详情',
            '修正缺失或错误的字段',
            '确认字段类型和取值范围',
            '重新验证配置'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'CONFIG_VERSION_INCOMPATIBLE',
          message: '配置版本不兼容',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '当前配置文件版本与应用程序期望的版本不匹配。',
          solution: '升级或降级配置文件，或运行迁移脚本。',
          steps: [
            '查看当前配置版本',
            '查看应用期望的配置版本',
            '运行配置迁移脚本',
            '手动调整不兼容的字段'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'CONFIG_CIRCULAR_REFERENCE',
          message: '配置存在循环引用',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '配置文件中使用了变量引用，但形成了循环依赖（A 引用 B，B 引用 A）。',
          solution: '重构配置，消除循环引用。',
          steps: [
            '识别循环引用链',
            '重构配置结构',
            '使用绝对路径替代相对引用',
            '添加配置解析深度限制'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'CONFIG_OVERRIDE_CONFLICT',
          message: '配置覆盖冲突',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '多个配置源（文件、环境变量、命令行参数）对同一键提供了不同的值。',
          solution: '明确配置优先级，确保使用预期的值。',
          steps: [
            '了解配置加载优先级顺序',
            '检查各配置源的值',
            '明确指定最终生效的配置值',
            '统一配置管理方式'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'DATABASE_CONNECTION_STRING_INVALID',
          message: '数据库连接字符串无效',
          severity: 'critical',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '数据库 URL 格式不正确（如缺少协议、错误的端口、非法字符）。',
          solution: '按照数据库文档修正连接字符串格式。',
          steps: [
            '检查连接字符串格式',
            '确认协议正确（postgresql://、mongodb:// 等）',
            '验证主机名、端口、数据库名',
            '测试连接字符串'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'DATABASE_CONNECTION_TIMEOUT',
          message: '数据库连接超时',
          severity: 'critical',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '数据库服务器无响应，可能是网络问题、数据库过载或防火墙阻止。',
          solution: '检查数据库服务状态和网络连通性。',
          steps: [
            '测试到数据库服务器的网络连通性',
            '检查数据库服务是否运行',
            '确认防火墙允许数据库端口',
            '增加连接超时设置'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'DATABASE_AUTH_FAILED',
          message: '数据库认证失败',
          severity: 'critical',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '数据库用户名或密码错误，或用户没有访问该数据库的权限。',
          solution: '检查数据库凭据，确认用户权限。',
          steps: [
            '确认用户名和密码正确',
            '检查用户是否有数据库访问权限',
            '重置数据库密码',
            '检查数据库日志'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'DATABASE_SSL_REQUIRED',
          message: '数据库要求 SSL 连接',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '数据库服务器强制要求 SSL/TLS 连接，但客户端未启用。',
          solution: '在连接配置中启用 SSL。',
          steps: [
            '在连接字符串中添加 sslmode=require',
            '配置 SSL 证书路径',
            '检查数据库服务器的 SSL 配置',
            '测试 SSL 连接'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'DATABASE_POOL_EXHAUSTED',
          message: '数据库连接池耗尽',
          severity: 'critical',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '所有数据库连接都被占用且未及时释放，导致新请求无法获取连接。',
          solution: '增加连接池大小，或检查连接泄漏。',
          steps: [
            '增加连接池最大连接数',
            '检查是否有连接未正确释放',
            '优化查询减少连接占用时间',
            '实现连接超时自动回收'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'DATABASE_QUERY_TIMEOUT',
          message: '数据库查询超时',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: 'SQL 查询执行时间过长，超过了设置的超时阈值。',
          solution: '优化查询语句，添加索引，或增加超时时间。',
          steps: [
            '分析查询执行计划',
            '添加合适的索引',
            '重写低效的查询',
            '增加查询超时设置'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'DATABASE_DEADLOCK_DETECTED',
          message: '数据库死锁检测',
          severity: 'critical',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '两个或多个事务互相等待对方释放锁，形成死锁。',
          solution: '数据库会自动回滚其中一个事务，应用层应捕获错误并重试。',
          steps: [
            '捕获死锁错误并重试事务',
            '调整事务中访问表的顺序',
            '减少事务持有锁的时间',
            '使用更细粒度的锁'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'DATABASE_UNIQUE_CONSTRAINT_VIOLATION',
          message: '数据库唯一约束冲突',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '插入或更新数据时违反了唯一性约束（如重复的主键、唯一索引）。',
          solution: '检查数据是否已存在，使用 UPSERT 或先查询再插入。',
          steps: [
            '查询确认数据是否已存在',
            '使用 INSERT ... ON CONFLICT (UPSERT)',
            '或者先 DELETE 再 INSERT',
            '检查唯一索引定义'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'DATABASE_FOREIGN_KEY_VIOLATION',
          message: '数据库外键约束冲突',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '插入或更新数据时引用了不存在的外键值。',
          solution: '确保引用的数据已存在，或禁用外键检查（不推荐）。',
          steps: [
            '确认引用的外键值在关联表中存在',
            '先插入关联表数据，再插入主表',
            '检查外键约束定义',
            '仅在必要时临时禁用外键'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'DATABASE_CHECK_CONSTRAINT_VIOLATION',
          message: '数据库检查约束冲突',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '数据值不满足 CHECK 约束条件（如年龄必须大于 0）。',
          solution: '修正数据值使其满足约束条件。',
          steps: [
            '查看 CHECK 约束定义',
            '修正数据值',
            '或者在必要时修改约束条件',
            '添加应用层数据验证'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'DATABASE_MIGRATION_FAILED',
          message: '数据库迁移失败',
          severity: 'critical',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '执行数据库迁移脚本时出错（如 SQL 语法错误、约束冲突、表已存在）。',
          solution: '查看迁移日志，修复 SQL 错误，或手动回滚。',
          steps: [
            '查看迁移错误日志',
            '修复 SQL 语法错误',
            '如果部分迁移已执行，手动清理',
            '重新运行迁移'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'DATABASE_MIGRATION_LOCK_HELD',
          message: '数据库迁移锁被持有',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '另一个进程正在执行迁移，当前进程无法获取迁移锁。',
          solution: '等待其他迁移完成，或手动释放迁移锁。',
          steps: [
            '检查是否有其他进程在运行迁移',
            '等待迁移完成',
            '如果迁移进程已崩溃，手动清理锁表',
            '重新运行迁移'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'DATABASE_MIGRATION_DIRTY_STATE',
          message: '数据库迁移处于脏状态',
          severity: 'critical',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '上一次迁移失败导致数据库处于不一致状态。',
          solution: '手动修复数据库状态，或重置迁移记录。',
          steps: [
            '查看迁移历史表',
            '确定失败的迁移步骤',
            '手动执行或回滚失败的迁移',
            '更新迁移记录表'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'CACHE_CONNECTION_FAILED',
          message: '缓存服务连接失败',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: 'Redis/Memcached 等缓存服务器未启动或网络不可达。',
          solution: '检查缓存服务状态，确认连接配置正确。',
          steps: [
            '检查缓存服务器是否运行',
            '测试网络连通性',
            '确认连接地址和端口正确',
            '检查认证密码'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'CACHE_KEY_TOO_LARGE',
          message: '缓存键过大',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '缓存键长度超过了缓存服务器的限制（Redis 最大 512MB 键，但建议更小）。',
          solution: '使用哈希函数缩短键名，或重构缓存策略。',
          steps: [
            '计算键的实际长度',
            '使用 MD5/SHA256 哈希缩短键',
            '重构缓存键命名策略',
            '避免将整个查询作为键'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'CACHE_VALUE_TOO_LARGE',
          message: '缓存值过大',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '缓存值大小超过了建议限制，影响性能和内存使用。',
          solution: '压缩缓存值，或拆分大数据为多个小缓存。',
          steps: [
            '检查缓存值大小',
            '使用压缩算法（如 gzip）',
            '将大数据拆分为多个小键',
            '或者不使用缓存直接查询'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'CACHE_TTL_INVALID',
          message: '缓存过期时间无效',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '设置的 TTL（生存时间）为负数或超过缓存服务器支持的最大值。',
          solution: '设置合理的 TTL 值（正整数，通常在秒级）。',
          steps: [
            '检查 TTL 值是否为正数',
            '确认单位正确（秒 vs 毫秒）',
            '设置合理的过期时间',
            '对于永久缓存使用特殊值或不设置 TTL'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'CACHE_SERIALIZATION_ERROR',
          message: '缓存序列化错误',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '尝试缓存的对象无法被正确序列化（如包含循环引用、函数、Symbol）。',
          solution: '确保缓存对象可 JSON 序列化，或使用专用序列化库。',
          steps: [
            '检查对象是否可 JSON.stringify',
            '移除函数、Symbol、循环引用',
            '使用 msgpack 等二进制序列化',
            '或者只缓存简单数据类型'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'CACHE_DESERIALIZATION_ERROR',
          message: '缓存反序列化错误',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '从缓存读取的数据无法被正确反序列化（如数据损坏、版本不兼容）。',
          solution: '检查缓存数据的完整性，确认序列化版本一致。',
          steps: [
            '检查缓存数据的完整性',
            '确认序列化/反序列化版本一致',
            '添加数据版本号',
            '在反序列化失败时回退到数据源'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'CACHE_STAMPEDE_DETECTED',
          message: '缓存雪崩检测',
          severity: 'critical',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '大量缓存同时过期，导致所有请求同时打到数据库。',
          solution: '使用锁或互斥机制防止同时重建缓存。',
          steps: [
            '为缓存过期时间添加随机偏移',
            '使用互斥锁保证只有一个请求重建缓存',
            '实现提前异步刷新机制',
            '增加数据库连接池应对突发流量'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'CACHE_PENETRATION_DETECTED',
          message: '缓存穿透检测',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '大量请求查询不存在的数据，绕过缓存直接查询数据库。',
          solution: '对不存在的数据也缓存空结果（设置较短 TTL）。',
          steps: [
            '对查询结果为空的数据也写入缓存',
            '设置较短的空值 TTL',
            '使用布隆过滤器预判数据是否存在',
            '添加请求频率限制'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'CACHE_BREAKDOWN_DETECTED',
          message: '缓存击穿检测',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '某个热点数据过期瞬间，大量请求同时查询该数据。',
          solution: '使用互斥锁或逻辑过期防止同时重建。',
          steps: [
            '热点数据永不过期或逻辑过期',
            '使用互斥锁重建缓存',
            '提前异步刷新即将过期的热点数据',
            '多级缓存（本地 + 远程）'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'JSON_PARSE_ERROR',
          message: 'JSON 解析错误',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '字符串不是有效的 JSON 格式（如缺少引号、多余的逗号、非法字符）。',
          solution: '使用 JSON 验证工具检查并修复格式。',
          steps: [
            '使用 JSONLint 等工具验证',
            '检查引号是否成对',
            '移除多余的逗号',
            '确保没有注释（JSON 不支持注释）'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'JSON_STRINGIFY_ERROR',
          message: 'JSON 序列化错误',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '对象包含循环引用、BigInt、函数等无法序列化的值。',
          solution: '清理对象，移除不可序列化的属性。',
          steps: [
            '检查对象是否有循环引用',
            '将 BigInt 转为字符串',
            '移除函数和 Symbol',
            '使用自定义 replacer 函数'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'XML_PARSE_ERROR',
          message: 'XML 解析错误',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '字符串不是有效的 XML 格式（如标签未闭合、非法字符、编码错误）。',
          solution: '使用 XML 验证工具检查并修复格式。',
          steps: [
            '检查标签是否正确闭合',
            '确认 XML 声明和编码',
            '转义特殊字符（<、>、&）',
            '使用 XML 解析器的错误定位'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'YAML_PARSE_ERROR',
          message: 'YAML 解析错误',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: 'YAML 文件格式不正确（如缩进错误、非法字符、循环引用）。',
          solution: '使用 YAML 验证工具检查并修复格式。',
          steps: [
            '检查缩进是否使用空格（不能用 Tab）',
            '确认键值对格式正确',
            '检查是否有循环引用',
            '使用 YAML 解析器的详细错误信息'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'CSV_PARSE_ERROR',
          message: 'CSV 解析错误',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: 'CSV 文件格式不正确（如引号不匹配、分隔符不一致、换行符问题）。',
          solution: '使用 CSV 验证工具检查，或指定正确的分隔符和引号规则。',
          steps: [
            '检查引号是否成对闭合',
            '确认分隔符一致（逗号/分号/制表符）',
            '处理包含换行符的字段',
            '使用 CSV 解析库的配置选项'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'DATA_VALIDATION_FAILED',
          message: '数据验证失败',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '输入数据不符合预期的验证规则（如必填项缺失、格式错误、值超出范围）。',
          solution: '根据验证错误信息修正数据。',
          steps: [
            '查看验证错误详情',
            '修正缺失或错误的字段',
            '确认数据类型和格式',
            '添加客户端预验证'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'DATA_TYPE_CONVERSION_ERROR',
          message: '数据类型转换错误',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '尝试将数据从一种类型转换为另一种类型时失败（如字符串转数字包含字母）。',
          solution: '确保源数据格式正确，或使用安全的转换方法。',
          steps: [
            '检查源数据的实际格式',
            '使用 Number()、parseInt() 等安全转换',
            '对转换结果进行有效性检查',
            '使用类型守卫函数'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'DATA_TRUNCATION_ERROR',
          message: '数据截断错误',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '数据长度超过了目标字段的最大限制，被截断或拒绝。',
          solution: '缩短数据长度，或增加字段限制。',
          steps: [
            '检查数据实际长度',
            '缩短数据或分段存储',
            '增加数据库字段长度限制',
            '在应用层添加长度验证'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'DATA_ENCRYPTION_ERROR',
          message: '数据加密错误',
          severity: 'critical',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '加密过程中出错（如密钥无效、算法不支持、数据格式错误）。',
          solution: '检查密钥和算法配置，确保数据格式正确。',
          steps: [
            '确认密钥长度符合算法要求',
            '检查加密算法是否受支持',
            '确认数据是 Buffer 或字符串',
            '查看加密库的错误详情'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'DATA_DECRYPTION_ERROR',
          message: '数据解密错误',
          severity: 'critical',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '解密过程中出错（如密钥错误、数据损坏、算法不匹配）。',
          solution: '确认使用正确的密钥和算法，检查数据完整性。',
          steps: [
            '确认解密密钥与加密时一致',
            '检查加密算法是否匹配',
            '确认数据未被截断或篡改',
            '检查 IV/Nonce 是否正确传递'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'DATA_HASH_MISMATCH',
          message: '数据哈希不匹配',
          severity: 'critical',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '数据的校验和/哈希值与预期不符，说明数据在传输或存储过程中被篡改。',
          solution: '重新传输数据，或从备份恢复。',
          steps: [
            '重新计算数据的哈希值',
            '与预期的哈希值对比',
            '如果一致则可能是预期值错误',
            '如果不一致则数据已损坏，需要重新获取'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'DATA_INTEGRITY_CHECK_FAILED',
          message: '数据完整性检查失败',
          severity: 'critical',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '数据的完整性校验失败（如校验和、数字签名、Merkle 树验证不通过）。',
          solution: '从可信源重新获取数据，或修复损坏的数据。',
          steps: [
            '确认校验算法和参数正确',
            '从备份或原始源重新获取数据',
            '检查存储介质是否有坏道',
            '实现冗余校验机制'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'DATA_MIGRATION_INCOMPLETE',
          message: '数据迁移不完整',
          severity: 'critical',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '数据迁移过程中断，部分数据已迁移但部分未迁移，导致数据不一致。',
          solution: '回滚到迁移前状态，或补全缺失的数据。',
          steps: [
            '检查迁移日志确认已执行的步骤',
            '对比源和目标数据量',
            '补全缺失的数据',
            '或者回滚并重新执行完整迁移'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'DATA_BACKUP_CORRUPTED',
          message: '数据备份损坏',
          severity: 'critical',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '备份文件损坏或校验失败，无法用于恢复。',
          solution: '使用其他备份副本，或重新创建备份。',
          steps: [
            '检查备份文件的完整性校验',
            '尝试使用其他备份副本',
            '如果所有备份都损坏，尝试数据恢复工具',
            '建立多副本备份策略'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'DATA_REPLICATION_LAG',
          message: '数据复制延迟过大',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '主从复制延迟超过可接受范围，读取从库可能获取到旧数据。',
          solution: '检查复制性能，优化查询，或强制从主库读取。',
          steps: [
            '检查复制延迟监控',
            '优化从库上的慢查询',
            '增加从库资源或扩展读副本',
            '对强一致性要求读取强制走主库'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'DATA_REPLICATION_CONFLICT',
          message: '数据复制冲突',
          severity: 'critical',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '多主复制或双向同步时，同一数据在不同节点被同时修改导致冲突。',
          solution: '实现冲突检测和解决策略（最后写入优先、合并、人工介入）。',
          steps: [
            '查看冲突日志和数据',
            '选择冲突解决策略',
            '合并数据或保留某个版本',
            '实现冲突自动检测和通知'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'DATA_SEEDING_FAILED',
          message: '数据种子初始化失败',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '应用启动时的初始数据加载失败（如种子文件缺失、格式错误）。',
          solution: '检查种子文件，修复格式，或手动插入初始数据。',
          steps: [
            '检查种子文件是否存在',
            '验证种子文件格式',
            '手动插入必要的初始数据',
            '禁用种子加载（仅开发环境）'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'DATA_EXPORT_FORMAT_ERROR',
          message: '数据导出格式错误',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '导出数据时指定的格式不受支持或参数错误。',
          solution: '检查支持的导出格式列表，使用正确的格式参数。',
          steps: [
            '查看支持的导出格式（CSV/JSON/XML/Excel）',
            '检查格式参数拼写',
            '确认导出字段列表正确',
            '测试小数据量导出'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'DATA_IMPORT_FORMAT_ERROR',
          message: '数据导入格式错误',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '导入文件格式不正确或包含无法解析的数据。',
          solution: '检查导入文件格式，确保与预期模板一致。',
          steps: [
            '查看导入模板格式',
            '验证导入文件是否符合模板',
            '检查必填字段是否齐全',
            '测试小数据量导入'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'DATA_IMPORT_DUPLICATE_KEY',
          message: '数据导入存在重复键',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '导入的数据中包含已存在的主键或唯一键值。',
          solution: '使用 UPSERT 模式导入，或先删除重复数据。',
          steps: [
            '检查导入数据中的键值',
            '使用 UPSERT/REPLACE 模式',
            '或者先清空目标表再导入',
            '添加去重逻辑'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'DATA_IMPORT_CONSTRAINT_VIOLATION',
          message: '数据导入违反约束',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：配置加载或数据处理',
          cause: '导入的数据违反了数据库约束（如外键、检查约束、非空约束）。',
          solution: '清洗导入数据，确保满足所有约束条件。',
          steps: [
            '查看具体的约束违反详情',
            '清洗或修正违反约束的数据',
            '临时禁用约束（不推荐生产环境）',
            '分批导入并验证'
          ],
          prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。',
        },
        {
          code: 'IMPORT_INVALID_JSON',
          message: '导入配置时提示「无效的 JSON 格式」',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：「导入配置」按钮',
          cause: '文件内容损坏、不是 JSON 格式、或被其他程序修改过。',
          solution: '检查文件是否为有效的 UTF-8 编码文本文件。',
          steps: [
            '用文本编辑器打开要导入的 JSON 文件',
            '确认文件是有效的 UTF-8 编码，无乱码',
            '用 JSON 在线格式化工具验证',
            '如果文件损坏，尝试从历史备份中恢复',
          ],
          relatedCodes: ['IMPORT_TOOL_MISMATCH', 'CONFIG_CORRUPTED'],
        },
        {
          code: 'IMPORT_TOOL_MISMATCH',
          message: '导入配置时提示「工具类型不匹配」',
          severity: 'warning',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：「导入配置」按钮',
          cause: '导入的 JSON 文件中 tool 字段与当前页面不匹配。',
          solution: '确认导入的是当前工具导出的配置文件。',
          steps: [
            '用文本编辑器打开要导入的 JSON 文件',
            '确认文件顶部的 tool 字段与当前工具一致',
            '如果不是，找到正确的配置文件再导入',
            '或从其他工具页面导入该文件',
          ],
          relatedCodes: ['IMPORT_INVALID_JSON'],
        },
        {
          code: 'LOCAL_STORAGE_FULL',
          message: '保存失败，提示浏览器存储空间不足',
          severity: 'error',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：「保存」按钮',
          cause: '浏览器 localStorage 存储空间已满（通常约 5~10MB）。可能保存了大量图片数据或其他工具的历史记录。',
          solution: '清理浏览器存储空间或导出配置到本地文件。',
          steps: [
            '先点击「导出」按钮将当前配置备份到本地文件',
            '按 Ctrl+Shift+I 打开开发者工具 → Application → Local Storage',
            '删除不再需要的键（尤其是包含图片 base64 的大键）',
            '返回工具重新点击保存',
          ],
          relatedCodes: ['STORAGE_READ_ONLY'],
          prevention: '定期清理浏览器 localStorage 中不再需要的数据；大文件不要直接保存在编辑器中，改用导出功能。',
        },
        {
          code: 'STORAGE_READ_ONLY',
          message: '保存操作无反应，刷新后数据丢失',
          severity: 'critical',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：「保存」按钮',
          cause: '浏览器处于隐私/无痕模式，或 localStorage 被系统策略禁用，或磁盘空间已满导致浏览器将存储设为只读。',
          solution: '退出隐私模式或释放磁盘空间。',
          steps: [
            '确认浏览器不在无痕/隐私浏览模式（该模式通常禁用 localStorage）',
            '检查系统磁盘空间是否已满',
            '尝试在普通窗口中重新打开应用',
            '如果问题持续，使用「导出」功能将配置保存为本地文件作为替代方案',
          ],
          relatedCodes: ['LOCAL_STORAGE_FULL'],
          prevention: '避免在浏览器无痕/隐私模式中使用本应用；定期导出配置到本地文件作为备份。',
        },
        {
          code: 'UNSAVED_WARNING',
          message: '返回首页或刷新时提示「你还没保存」',
          severity: 'info',
          category: 'B. 配置与数据',
          location: '页面：任意工具 → 区域：「返回首页」按钮 / 刷新页面时',
          cause: '当前状态与上次保存的快照不一致（isDirty 为 true）。你可能修改了内容但忘记保存。',
          solution: '根据需要选择保存或放弃。',
          steps: [
            '如果希望保留修改：点击弹窗中的「取消」或「继续编辑」，回到工具点击「保存」，然后再返回',
            '如果不需要保留：点击弹窗中的「确认返回」',
          ],
        },
        {
        code: 'CONFIG_JSON_PARSE_ERROR',
        message: '配置文件 JSON 解析失败',
        severity: 'error',
        category: 'B. 配置与数据',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '配置文件包含非法 JSON 语法，如尾随逗号、未闭合引号等。',
        solution: '使用 JSON 校验工具检查并修复语法错误。',
        steps: [
          '将配置粘贴到 JSON 在线校验工具',
          '检查是否有尾随逗号',
          '确认所有引号都已闭合',
          '检查特殊字符的转义',
        ],
        prevention: '使用 IDE 的 JSON 语法检查，避免手动编辑复杂配置。',
      },
      {
        code: 'CONFIG_REQUIRED_FIELD_MISSING',
        message: '配置文件缺少必填字段',
        severity: 'error',
        category: 'B. 配置与数据',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '配置对象缺少应用程序要求的必填字段。',
        solution: '对照文档补充所有必填字段。',
        steps: [
          '查看错误提示中提到的缺失字段',
          '对照配置文档检查必填项',
          '从默认配置模板复制缺失字段',
          '保存后重新加载应用',
        ],
        prevention: '使用配置Schema验证，或从完整模板开始修改。',
      },
      {
        code: 'CONFIG_TYPE_MISMATCH',
        message: '配置字段类型不匹配',
        severity: 'warning',
        category: 'B. 配置与数据',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '配置字段的值类型与预期不符，如字符串填入了数字。',
        solution: '将字段值转换为正确的类型。',
        steps: [
          '查看错误提示中提到的字段',
          '确认该字段应为字符串/数字/布尔值',
          '修改值类型后保存',
          '重新加载应用验证',
        ],
        prevention: '使用 TypeScript 接口或 JSON Schema 验证配置类型。',
      },
      {
        code: 'CONFIG_ENV_VARIABLE_NOT_FOUND',
        message: '环境变量未找到',
        severity: 'error',
        category: 'B. 配置与数据',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '应用依赖的环境变量未设置或名称拼写错误。',
        solution: '设置正确的环境变量，或检查变量名拼写。',
        steps: [
          '检查 .env 文件或系统环境变量',
          '确认变量名大小写正确',
          '重启应用使环境变量生效',
          '使用默认值作为fallback',
        ],
        prevention: '在启动脚本中检查所有必需的环境变量。',
      },
      {
        code: 'CONFIG_CROSS_ORIGIN_BLOCKED',
        message: '跨域配置阻止了操作',
        severity: 'error',
        category: 'B. 配置与数据',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '浏览器的同源策略阻止了跨域配置读写。',
        solution: '确保前后端同源，或正确配置 CORS。',
        steps: [
          '检查前端和后端的域名/端口',
          '确认 CORS 配置允许当前域名',
          '避免在跨域 iframe 中操作配置',
          '使用 postMessage 进行跨域通信',
        ],
        prevention: '部署时确保前后端使用同源策略或正确配置 CORS。',
      },
      {
        code: 'DATA_EXPORT_TIMEOUT',
        message: '数据导出超时',
        severity: 'warning',
        category: 'B. 配置与数据',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '导出的数据量过大，导致操作超时。',
        solution: '分批导出，或增加超时时间。',
        steps: [
          '减少一次导出的数据量',
          '分批导出多个小文件',
          '增加导出操作的超时设置',
          '使用后台任务进行大导出',
        ],
        prevention: '对大数据量提供分批导出选项。',
      },
      {
        code: 'DATA_SCHEMA_VERSION_TOO_OLD',
        message: '数据架构版本过旧',
        severity: 'error',
        category: 'B. 配置与数据',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '导入的数据使用了过时的架构版本，无法兼容当前应用。',
        solution: '使用数据迁移工具升级架构版本。',
        steps: [
          '确认当前应用支持的架构版本',
          '查找对应版本的迁移脚本',
          '运行迁移脚本升级数据',
          '重新导入升级后的数据',
        ],
        prevention: '在导出时包含架构版本信息，提供迁移工具。',
      },
      {
        code: 'STORAGE_INDEXEDDB_BLOCKED',
        message: 'IndexedDB 被浏览器阻止',
        severity: 'error',
        category: 'B. 配置与数据',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '浏览器的隐私模式或设置阻止了 IndexedDB 访问。',
        solution: '退出隐私模式，或调整浏览器存储设置。',
        steps: [
          '确认不在隐私/无痕模式中',
          '检查浏览器设置中的存储权限',
          '清除浏览器数据后重试',
          '尝试使用 localStorage 作为替代',
        ],
        prevention: '避免在隐私模式下使用需要持久存储的功能。',
      },
      {
        code: 'STORAGE_QUOTA_EXCEEDED',
        message: '存储配额已超出',
        severity: 'error',
        category: 'B. 配置与数据',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '应用使用的存储空间超过了浏览器或设备的配额限制。',
        solution: '清理旧数据，或请求更大的存储配额。',
        steps: [
          '检查当前存储使用情况',
          '删除不必要的历史数据',
          '压缩存储的数据',
          '请求持久化存储权限',
        ],
        prevention: '定期清理过期数据，使用压缩存储。',
      },
      ],
    },
    {
      id: 'C',
      name: 'C. 文件与输入',
      description: '涉及图片/音频文件上传、格式不支持、文件损坏、文件过大等输入类错误。',
      errors: [
        {
          code: 'FILE_CORRUPTED',
          message: '上传后预览显示空白或损坏，或处理时报错',
          severity: 'warning',
          category: 'C. 文件与输入',
          location: '页面：任意涉及上传的工具 → 区域：预览区',
          cause: '文件本身已损坏，或下载过程中数据不完整。',
          solution: '使用其他文件或修复/重新下载该文件。',
          steps: [
            '尝试在系统默认程序中打开该文件，确认是否能正常显示/播放',
            '如果无法打开，尝试用修复工具或重新下载/导出',
            '更换为其他有效的文件',
          ],
          relatedCodes: ['FILE_FORMAT_UNSUPPORTED'],
        },
        {
          code: 'FILE_CORRUPTED',
          message: '文件已损坏',
          severity: 'critical',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '文件在传输或存储过程中损坏（如网络中断、磁盘坏道、内存错误）。',
          solution: '重新下载或重新生成文件，检查存储介质健康状态。',
          steps: [
            '尝试重新下载/上传文件',
            '检查文件哈希值是否与原始一致',
            '使用文件修复工具',
            '检查磁盘健康状态（SMART）'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_INCOMPLETE_DOWNLOAD',
          message: '文件下载不完整',
          severity: 'error',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '下载过程中连接中断，文件只下载了一部分。',
          solution: '重新下载文件，或使用断点续传。',
          steps: [
            '删除不完整的文件',
            '重新下载',
            '如果支持，使用 Range 请求断点续传',
            '检查网络稳定性'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_ENCODING_MISMATCH',
          message: '文件编码不匹配',
          severity: 'error',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '文件实际编码与声明的编码不一致（如声明 UTF-8 但实际是 GBK）。',
          solution: '使用正确的编码重新读取文件，或使用编码检测工具。',
          steps: [
            '使用文件编码检测工具（如 chardet）',
            '尝试用不同编码打开',
            '将文件转换为正确的编码',
            '在代码中明确指定编码'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_BOM_CONFLICT',
          message: '文件 BOM 头冲突',
          severity: 'warning',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: 'UTF-8 文件包含 BOM 头，但解析器未正确处理，导致首字符解析错误。',
          solution: '移除 BOM 头，或配置解析器正确处理 BOM。',
          steps: [
            '使用编辑器查看是否有 BOM',
            '移除 BOM 头（如使用 sed）',
            '配置解析器自动处理 BOM',
            '统一团队文件编码规范'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_LINE_ENDING_MISMATCH',
          message: '文件换行符不匹配',
          severity: 'warning',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: 'Windows (CRLF) 和 Unix (LF) 换行符混用，导致脚本或解析器行为异常。',
          solution: '统一换行符为 LF，或使用支持两种换行符的工具。',
          steps: [
            '使用 dos2unix 或 unix2dos 转换',
            '配置编辑器自动处理换行符',
            '在 .gitattributes 中指定换行符',
            '使用支持 CRLF/LF 的解析器'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_HIDDEN_ATTRIBUTE',
          message: '文件被设置为隐藏',
          severity: 'info',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '文件具有隐藏属性，在默认文件浏览器中不可见。',
          solution: '显示隐藏文件，或移除隐藏属性。',
          steps: [
            '在文件浏览器中显示隐藏文件',
            '使用命令行移除隐藏属性（attrib -h）',
            '检查文件权限',
            '确认文件未被恶意软件隐藏'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_SYSTEM_READONLY',
          message: '文件系统只读',
          severity: 'critical',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '文件系统被挂载为只读，或磁盘出现错误自动切换为只读模式。',
          solution: '检查磁盘健康，重新挂载为读写模式，或修复文件系统。',
          steps: [
            '检查磁盘挂载选项',
            '运行文件系统检查（fsck/chkdsk）',
            '检查磁盘 SMART 状态',
            '备份数据并更换故障磁盘'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_HARD_LINK_LIMIT',
          message: '文件硬链接数达到上限',
          severity: 'error',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '文件系统的硬链接数量达到上限（如 ext4 默认 65000）。',
          solution: '删除不必要的硬链接，或使用软链接替代。',
          steps: [
            '检查文件的硬链接数（ls -l）',
            '删除不必要的硬链接',
            '使用符号链接（软链接）替代',
            '考虑使用支持更多硬链接的文件系统'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_SYMBOLIC_LINK_BROKEN',
          message: '符号链接已损坏',
          severity: 'error',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '符号链接指向的目标文件或目录已不存在。',
          solution: '删除损坏的符号链接，或重新创建指向正确目标的链接。',
          steps: [
            '检查符号链接指向的目标是否存在',
            '删除损坏的链接（rm 链接名）',
            '重新创建符号链接（ln -s）',
            '检查目标路径是否正确'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_SYMBOLIC_LINK_LOOP',
          message: '符号链接循环',
          severity: 'error',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '符号链接形成了循环引用（A 指向 B，B 指向 A）。',
          solution: '删除造成循环的符号链接，重新组织目录结构。',
          steps: [
            '使用 find -follow 检测循环',
            '删除造成循环的链接',
            '重新规划目录结构',
            '使用绝对路径创建链接'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_NAME_TOO_LONG',
          message: '文件名过长',
          severity: 'error',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '文件名或路径长度超过了文件系统限制（如 ext4 255 字符，NTFS 260 字符）。',
          solution: '缩短文件名或路径，或使用支持长路径的文件系统。',
          steps: [
            '缩短文件名',
            '将文件移到更浅的目录',
            '在 Windows 启用长路径支持',
            '使用支持长路径的文件系统'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_PATH_TOO_DEEP',
          message: '目录嵌套太深',
          severity: 'error',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '文件路径的目录层级太深，超过操作系统或文件系统限制。',
          solution: '减少目录嵌套层级，或将文件移到更浅的位置。',
          steps: [
            '减少目录层级',
            '使用扁平化的目录结构',
            '将深层文件移到根目录附近',
            '检查操作系统的路径长度限制'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_ILLEGAL_CHARACTERS',
          message: '文件名包含非法字符',
          severity: 'error',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '文件名包含文件系统不支持的字符（如 /  : * ? " < > |）。',
          solution: '移除非法字符，使用安全的文件名。',
          steps: [
            '检查文件名中的非法字符',
            '移除或替换为下划线/连字符',
            '使用文件名清理函数',
            '在保存前验证文件名'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_RESERVED_NAME',
          message: '使用了系统保留文件名',
          severity: 'error',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '文件名与系统保留名冲突（如 Windows 的 CON、PRN、AUX、NUL、COM1 等）。',
          solution: '使用不同的文件名，避免系统保留名。',
          steps: [
            '检查是否是系统保留名',
            '修改文件名',
            '添加前缀或后缀区分',
            '查阅操作系统的保留名列表'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_CASE_SENSITIVITY_CONFLICT',
          message: '文件名大小写冲突',
          severity: 'warning',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '在不区分大小写的文件系统（如 macOS 默认 APFS、Windows NTFS）上，File.txt 和 file.txt 被视为同一文件。',
          solution: '统一文件名大小写规范，或迁移到区分大小写的文件系统。',
          steps: [
            '统一使用小写文件名',
            '使用 kebab-case 或 snake_case',
            '避免仅大小写不同的文件名',
            '在区分大小写的文件系统上开发'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_PERMISSION_DENIED_READ',
          message: '文件读取权限被拒绝',
          severity: 'error',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '当前用户没有读取该文件的权限。',
          solution: '修改文件权限，或以具有权限的用户身份运行。',
          steps: [
            '检查文件权限（ls -l）',
            '使用 chmod 添加读权限',
            '确认文件所有者正确',
            '以管理员/root 身份运行'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_PERMISSION_DENIED_WRITE',
          message: '文件写入权限被拒绝',
          severity: 'error',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '当前用户没有写入该文件的权限。',
          solution: '修改文件权限，或将文件移到可写目录。',
          steps: [
            '检查文件和目录的写权限',
            '使用 chmod 添加写权限',
            '将文件移到用户可写目录',
            '检查目录是否只读挂载'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_PERMISSION_DENIED_EXECUTE',
          message: '文件执行权限被拒绝',
          severity: 'error',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '当前用户没有执行该文件的权限（常见于脚本和二进制文件）。',
          solution: '添加执行权限，或检查文件是否真的是可执行文件。',
          steps: [
            '使用 chmod +x 添加执行权限',
            '检查文件头确认是可执行格式',
            '确认文件没有被损坏',
            '检查文件系统挂载选项（noexec）'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_LOCKED_BY_ANOTHER_PROCESS',
          message: '文件被其他进程锁定',
          severity: 'error',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '另一个进程正在使用该文件并持有锁，当前进程无法访问。',
          solution: '关闭占用文件的进程，或等待其释放锁。',
          steps: [
            '查找占用文件的进程（lsof/fuser）',
            '终止占用进程',
            '等待文件释放',
            '使用文件锁超时机制'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_QUOTA_EXCEEDED',
          message: '用户磁盘配额超限',
          severity: 'critical',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '当前用户的磁盘使用量超过了管理员设置的配额限制。',
          solution: '删除不必要的文件，或联系管理员增加配额。',
          steps: [
            '查看当前磁盘使用情况（du）',
            '删除大文件或旧文件',
            '压缩文件节省空间',
            '联系管理员增加配额'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_INODE_EXHAUSTED',
          message: '文件系统 inode 耗尽',
          severity: 'critical',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '文件系统中创建的文件数量达到了 inode 上限（常见于大量小文件）。',
          solution: '删除不必要的文件，或重新创建具有更多 inode 的文件系统。',
          steps: [
            '查看 inode 使用情况（df -i）',
            '删除大量小文件',
            '合并小文件为归档文件',
            '重新创建文件系统并增加 inode 数量'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_SYSTEM_FULL',
          message: '文件系统已满',
          severity: 'critical',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '磁盘分区使用率达到了 100%，无法写入新数据。',
          solution: '清理磁盘空间，删除不必要的文件，或扩展磁盘容量。',
          steps: [
            '查看磁盘使用情况（df -h）',
            '找出大文件并删除或归档',
            '清理日志和临时文件',
            '扩展磁盘分区'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_TEMP_DIRECTORY_UNWRITABLE',
          message: '临时目录不可写',
          severity: 'critical',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '系统临时目录（/tmp、C:\Windows\Temp）不可写或已满。',
          solution: '清理临时目录，或指定其他可写的临时目录。',
          steps: [
            '检查临时目录的写权限',
            '清理临时文件',
            '设置 TMPDIR/TEMP 环境变量指向可写目录',
            '重启应用'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_UPLOAD_INTERRUPTED',
          message: '文件上传中断',
          severity: 'error',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '上传过程中网络中断、浏览器关闭或用户取消。',
          solution: '重新上传文件，或使用断点续传。',
          steps: [
            '检查网络连接',
            '重新选择文件上传',
            '如果支持断点续传，继续上传',
            '监控上传进度'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_UPLOAD_SIZE_MISMATCH',
          message: '上传文件大小不匹配',
          severity: 'error',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '客户端声明的文件大小与实际上传的大小不一致。',
          solution: '重新上传文件，或检查文件是否在传输中被修改。',
          steps: [
            '重新上传文件',
            '检查文件在传输中是否被压缩或修改',
            '验证文件完整性',
            '检查代理是否修改了请求'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_UPLOAD_CHECKSUM_MISMATCH',
          message: '上传文件校验和不匹配',
          severity: 'error',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '上传完成后服务端计算的校验和与客户端提供的不一致，说明传输过程中数据损坏。',
          solution: '重新上传文件，或检查网络稳定性。',
          steps: [
            '重新上传文件',
            '检查网络稳定性',
            '使用更强的校验算法',
            '如果多次失败，检查网卡或网线'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_UPLOAD_VIRUS_DETECTED',
          message: '上传文件包含病毒',
          severity: 'critical',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '文件上传后被杀毒软件检测到恶意代码。',
          solution: '删除文件，使用可信来源的文件，或检查是否为误报。',
          steps: [
            '立即删除被感染的文件',
            '使用其他杀毒软件交叉验证',
            '如果是误报，添加到白名单',
            '仅从可信来源下载文件'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_UPLOAD_CONTENT_TYPE_SPOOFED',
          message: '上传文件内容类型伪造',
          severity: 'critical',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '上传的文件扩展名与其实际内容不匹配（如将 .exe 重命名为 .jpg 上传）。',
          solution: '服务端验证文件魔数（magic number），不仅检查扩展名。',
          steps: [
            '服务端检查文件魔数而非扩展名',
            '拒绝内容类型不匹配的文件',
            '使用文件类型检测库',
            '记录并审计可疑上传'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_UPLOAD_PATH_TRAVERSAL',
          message: '上传路径遍历攻击',
          severity: 'critical',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '上传文件名包含 ../ 等路径遍历字符，试图将文件写到非预期目录。',
          solution: '严格过滤文件名，只允许合法字符，将文件写到隔离目录。',
          steps: [
            '过滤文件名中的路径分隔符和 ..',
            '使用 UUID 作为存储文件名',
            '将上传文件存储在隔离目录',
            '禁止根据用户输入决定存储路径'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_DOWNLOAD_INTERRUPTED',
          message: '文件下载中断',
          severity: 'error',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '下载过程中网络中断、浏览器关闭或磁盘空间不足。',
          solution: '重新下载文件，或使用断点续传。',
          steps: [
            '检查网络连接',
            '确认磁盘有足够空间',
            '重新下载',
            '使用支持断点续传的下载工具'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_DOWNLOAD_REDIRECT_LOOP',
          message: '文件下载重定向循环',
          severity: 'error',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '下载 URL 发生了循环重定向（A → B → A）。',
          solution: '检查下载链接，手动跟随重定向链。',
          steps: [
            '使用 curl -v 查看重定向链',
            '检查服务器重定向配置',
            '使用直接下载链接',
            '限制最大重定向次数'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_DOWNLOAD_MIME_TYPE_MISMATCH',
          message: '下载文件 MIME 类型不匹配',
          severity: 'warning',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '下载文件的 Content-Type 与文件扩展名不一致。',
          solution: '验证文件实际内容，不要仅依赖扩展名或 MIME 类型。',
          steps: [
            '检查响应头的 Content-Type',
            '验证文件魔数',
            '如果内容正常则忽略警告',
            '如果是恶意文件则删除'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_ARCHIVE_CORRUPTED',
          message: '压缩文件已损坏',
          severity: 'error',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '压缩文件（zip/rar/7z）在传输中损坏或下载不完整。',
          solution: '重新下载压缩文件，或尝试修复。',
          steps: [
            '重新下载压缩文件',
            '尝试用压缩软件的修复功能',
            '检查文件哈希值',
            '使用更可靠的传输方式'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_ARCHIVE_PASSWORD_REQUIRED',
          message: '压缩文件需要密码',
          severity: 'info',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '压缩文件被密码保护，无法直接解压。',
          solution: '输入正确的解压密码。',
          steps: [
            '获取压缩文件的密码',
            '在解压工具中输入密码',
            '如果忘记密码，尝试联系文件提供者',
            '不要使用暴力破解他人文件'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_ARCHIVE_UNSUPPORTED_FORMAT',
          message: '不支持的压缩格式',
          severity: 'error',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '压缩文件使用了不受支持的格式（如 rar5、lzma2）。',
          solution: '使用支持该格式的解压软件，或要求提供者使用标准格式。',
          steps: [
            '确认压缩文件格式',
            '安装支持该格式的软件',
            '要求提供者使用 zip 格式',
            '使用在线转换工具'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_IMAGE_DECOMPRESSION_BOMB',
          message: '图片解压炸弹检测',
          severity: 'critical',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '上传的图片是压缩炸弹（zip bomb 的图像版本），解压后会消耗极多内存。',
          solution: '限制图片解压后的最大尺寸，拒绝可疑文件。',
          steps: [
            '限制图片最大像素尺寸',
            '检查图片压缩比是否异常',
            '使用流式解码避免一次性加载',
            '拒绝超高压缩比的图片'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_AUDIO_UNSUPPORTED_CODEC',
          message: '不支持的音频编解码器',
          severity: 'error',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '音频文件使用了浏览器或应用不支持的编解码器（如 FLAC、ALAC）。',
          solution: '将音频转换为支持的格式（MP3、AAC、OGG、WAV）。',
          steps: [
            '确认音频文件的编码格式',
            '使用 FFmpeg 转换为 MP3/AAC',
            '检查浏览器支持的音频格式列表',
            '提供多种格式供用户选择'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_VIDEO_UNSUPPORTED_CODEC',
          message: '不支持的视频编解码器',
          severity: 'error',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '视频文件使用了浏览器或应用不支持的编解码器（如 H.265/HEVC、AV1）。',
          solution: '将视频转换为支持的格式（H.264、VP9）。',
          steps: [
            '确认视频文件的编码格式',
            '使用 FFmpeg 转换为 H.264',
            '检查浏览器支持的视频格式',
            '提供多种格式或转码服务'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_DOCUMENT_MALFORMED',
          message: '文档格式损坏',
          severity: 'error',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '文档文件（PDF、DOCX 等）结构损坏，无法正确解析。',
          solution: '尝试用其他软件打开，或从备份恢复。',
          steps: [
            '尝试用不同软件打开',
            '使用文档修复工具',
            '从备份恢复',
            '重新生成文档'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_SCAN_OCR_FAILED',
          message: '扫描件 OCR 识别失败',
          severity: 'error',
          category: 'C. 文件与输入',
          location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
          cause: '扫描件图像质量差、文字模糊或语言不支持，导致 OCR 无法识别。',
          solution: '提高扫描分辨率，确保文字清晰，或使用支持该语言的 OCR 引擎。',
          steps: [
            '提高扫描分辨率（至少 300 DPI）',
            '确保文字清晰不模糊',
            '检查 OCR 是否支持该语言',
            '对图像进行预处理（去噪、二值化）'
          ],
          prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。',
        },
        {
          code: 'FILE_FORMAT_UNSUPPORTED',
          message: '上传时提示「不支持的文件格式」',
          severity: 'warning',
          category: 'C. 文件与输入',
          location: '页面：任意涉及上传的工具 → 区域：「选择文件」按钮',
          cause: '选择了工具不支持的文件格式。',
          solution: '将文件转换为支持的格式。',
          steps: [
            '查看工具支持的格式列表（通常在按钮下方有提示）',
            '使用图片/音频转换工具将文件转为支持的格式',
            '或使用系统自带的预览/编辑工具导出为支持的格式',
            '重新上传转换后的文件',
          ],
          relatedCodes: ['FILE_CORRUPTED', 'UPLOAD_FORMAT'],
        },
        {
          code: 'FILE_TOO_LARGE',
          message: '上传后预览失败或处理时报内存错误',
          severity: 'warning',
          category: 'C. 文件与输入',
          location: '页面：任意涉及上传的工具 → 区域：预览区',
          cause: '上传的文件尺寸过大（超过工具或浏览器限制）。',
          solution: '压缩或缩小文件后再上传。',
          steps: [
            '使用图片/音频转换工具将文件压缩或缩小尺寸',
            '对于图片，将最大边缩放到 2048 或 4096 像素以下',
            '对于音频，降低采样率或比特率',
            '重新上传处理后的文件',
          ],
          relatedCodes: ['DEVICE_MEMORY_LOW', 'FILE_FORMAT_UNSUPPORTED'],
        },
        {
          code: 'TTS_REFERENCE_INVALID',
          message: '参考音频上传失败',
          severity: 'warning',
          category: 'C. 文件与输入',
          location: '页面：TTS 语音导出 → 区域：参考音频上传区',
          cause: '文件格式不支持（仅支持 WAV/MP3/OGG）或文件过大（超过 10MB）。',
          solution: '更换有效的音频文件。',
          steps: [
            '确认音频文件格式为 WAV、MP3 或 OGG',
            '确认文件大小不超过 10MB',
            '重新上传',
          ],
          relatedCodes: ['FILE_FORMAT_UNSUPPORTED', 'FILE_TOO_LARGE'],
        },
        {
          code: 'UPLOAD_FORMAT',
          message: '上传时提示格式限制',
          severity: 'warning',
          category: 'C. 文件与输入',
          location: '页面：paper2gal / 转画风 → 区域：「选择图片」按钮',
          cause: '选择了 WEBP、GIF、BMP 等不支持的格式。这些工具仅支持 PNG 和 JPG。',
          solution: '转换为 PNG 或 JPG。',
          steps: [
            '使用图片转换工具（主页 → 图片格式转换）将文件转为 PNG 或 JPG',
            '或使用系统自带的图片预览/编辑工具导出为 PNG/JPG',
            '重新上传转换后的文件',
          ],
          relatedCodes: ['FILE_FORMAT_UNSUPPORTED'],
        },
        {
        code: 'FILE_UPLOAD_INTERRUPTED',
        message: '文件上传被中断',
        severity: 'warning',
        category: 'C. 文件与输入',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '网络中断、用户取消或浏览器关闭导致上传未完成。',
        solution: '重新上传文件，或使用断点续传。',
        steps: [
          '检查网络连接状态',
          '重新选择文件并上传',
          '使用支持断点续传的上传组件',
          '分片上传大文件',
        ],
        prevention: '使用断点续传或分片上传机制。',
      },
      {
        code: 'FILE_MIME_TYPE_MISMATCH',
        message: '文件 MIME 类型与扩展名不匹配',
        severity: 'warning',
        category: 'C. 文件与输入',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '文件扩展名与实际内容类型不一致，如将 .png 改为 .jpg。',
        solution: '使用正确的文件扩展名，或通过内容检测确定真实类型。',
        steps: [
          '用文件检测工具确认真实 MIME 类型',
          '将文件扩展名改为正确类型',
          '重新导出文件确保一致性',
          '在上传时进行 MIME 类型校验',
        ],
        prevention: '上传前进行 MIME 类型与扩展名一致性检查。',
      },
      {
        code: 'FILE_VIRUS_SCAN_FAILED',
        message: '文件病毒扫描失败',
        severity: 'error',
        category: 'C. 文件与输入',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '上传的文件未通过病毒扫描，或扫描服务不可用。',
        solution: '使用可信来源的文件，或更换扫描服务。',
        steps: [
          '确认文件来源可信',
          '用本地杀毒软件扫描文件',
          '尝试更换文件来源',
          '联系管理员检查扫描服务状态',
        ],
        prevention: '只上传来自可信来源的文件。',
      },
      {
        code: 'FILE_NAME_TOO_LONG',
        message: '文件名过长',
        severity: 'warning',
        category: 'C. 文件与输入',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '文件名超过了系统或应用的最大长度限制。',
        solution: '缩短文件名后重新上传。',
        steps: [
          '将文件名缩短到 100 字符以内',
          '移除文件名中的特殊字符',
          '使用简单的字母数字命名',
          '重新上传',
        ],
        prevention: '上传前自动截断或重命名过长的文件名。',
      },
      {
        code: 'FILE_PATH_TRAVERSAL_DETECTED',
        message: '检测到路径遍历攻击',
        severity: 'critical',
        category: 'C. 文件与输入',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '文件名包含 ../ 等路径遍历字符，可能是恶意攻击。',
        solution: '拒绝上传，并清理文件名中的路径字符。',
        steps: [
          '立即拒绝该文件上传',
          '记录安全日志',
          '清理文件名中的所有路径分隔符',
          '通知安全团队',
        ],
        prevention: '严格验证文件名，禁止包含路径分隔符。',
      },
      {
        code: 'FILE_TEMPORARY_UNAVAILABLE',
        message: '临时文件不可用',
        severity: 'error',
        category: 'C. 文件与输入',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '服务器临时目录已满或权限不足，无法创建临时文件。',
        solution: '清理临时目录，或检查目录权限。',
        steps: [
          '检查服务器临时目录磁盘空间',
          '清理旧的临时文件',
          '确认临时目录有写权限',
          '更换临时目录路径',
        ],
        prevention: '定期清理临时目录，监控磁盘空间。',
      },
      {
        code: 'FILE_BATCH_UPLOAD_PARTIAL_FAILURE',
        message: '批量上传部分失败',
        severity: 'warning',
        category: 'C. 文件与输入',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '批量上传中的部分文件失败，其他文件成功。',
        solution: '重试失败的文件，或单独上传。',
        steps: [
          '查看失败文件列表',
          '单独重试每个失败的文件',
          '检查失败文件的格式和大小',
          '分批减少同时上传的数量',
        ],
        prevention: '提供批量上传的详细状态反馈和重试机制。',
      },
      {
        code: 'FILE_WATERMARK_DETECTION_FAILED',
        message: '文件水印检测失败',
        severity: 'info',
        category: 'C. 文件与输入',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '上传的图片无法正确识别或去除水印。',
        solution: '使用无水印的原始图片，或手动去除水印。',
        steps: [
          '确认图片是否有水印',
          '尝试使用更高质量的原始图片',
          '手动去除水印后重新上传',
          '关闭自动水印检测功能',
        ],
        prevention: '使用官方渠道获取的无水印素材。',
      },
      {
        code: 'FILE_METADATA_STRIP_FAILED',
        message: '文件元数据清除失败',
        severity: 'info',
        category: 'C. 文件与输入',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '无法清除图片的 EXIF 等元数据信息。',
        solution: '使用专业工具手动清除元数据。',
        steps: [
          '使用 exiftool 等工具查看元数据',
          '手动清除 GPS、相机型号等敏感信息',
          '重新保存图片以去除元数据',
          '上传前确认元数据已清除',
        ],
        prevention: '上传前自动剥离所有敏感元数据。',
      },
      {
        code: 'FILE_THUMBNAIL_GENERATION_FAILED',
        message: '缩略图生成失败',
        severity: 'warning',
        category: 'C. 文件与输入',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '图片格式不支持或尺寸过大，导致无法生成缩略图。',
        solution: '转换图片格式，或降低图片分辨率。',
        steps: [
          '检查图片格式是否支持',
          '尝试转换为 JPEG/PNG',
          '降低图片分辨率后重试',
          '使用其他图片作为缩略图',
        ],
        prevention: '上传时自动转换和压缩图片以生成缩略图。',
      },
      ],
    },
    {
      id: 'D',
      name: 'D. 模型与生成',
      description: '涉及 AI 模型不可用、内容安全过滤、Prompt 过长、生成失败等。',
      errors: [
        {
          code: 'LLM_MODEL_UNAVAILABLE',
          message: '提示模型不可用',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：LLM 文本接入 → 区域：实时测试面板输出区',
          cause: '选择的模型在后端不存在或当前 Key 无权访问。',
          solution: '切换其他模型。',
          steps: [
            '在「模型」下拉框中选择其他模型',
            '确认模型 ID 拼写正确',
            '确认当前 Key 支持所选模型',
            '重试',
          ],
          relatedCodes: ['MODEL_NOT_FOUND', '403_FORBIDDEN'],
          prevention: '从已知可用模型列表中选择；确认当前 Key 支持所选模型。',
        },
        {
          code: 'LLM_TEST_ERROR',
          message: '实时测试面板显示错误',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：LLM 文本接入 → 区域：实时测试面板输出区',
          cause: 'API 请求失败。可能是网络问题、API Key 无效或过期、模型不可用、或请求超时。',
          solution: '根据错误详情排查。',
          steps: [
            '查看错误面板中的详细错误信息',
            '检查网络连接',
            '确认 API Key 有效',
            '尝试切换模型',
            '增加超时时间或减少 Max Tokens',
          ],
          relatedCodes: ['API_KEY_MISSING', 'API_KEY_EXPIRED', 'LLM_MODEL_UNAVAILABLE'],
          prevention: '测试前确认 API Key 有效、网络连接正常、模型可用。',
        },
        {
          code: 'MODEL_NOT_FOUND',
          message: '后端返回 404，提示模型未找到',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：任意需联网工具 → 区域：错误面板',
          cause: '模型 ID 拼写错误或该模型已被下架。',
          solution: '更正模型 ID 或选择其他模型。',
          steps: [
            '检查「模型」输入框中的模型 ID 是否拼写正确',
            '从下拉列表中选择已知可用的模型',
            '如果使用自定义 API，查阅服务商文档确认模型列表',
            '重试',
          ],
          relatedCodes: ['LLM_MODEL_UNAVAILABLE'],
          prevention: '从下拉列表选择已知可用的模型；使用自定义 API 时查阅服务商文档确认模型列表。',
        },
        {
          code: 'PROMPT_BLOCKED',
          message: '内容被安全过滤器拦截',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：任意 AI 生成工具 → 区域：错误面板',
          cause: 'Prompt 中包含被平台安全策略拦截的词汇。即使是正常的艺术创作词汇，某些平台也会误判。',
          solution: '修改 Prompt，移除或替换可能触发过滤器的词汇。',
          steps: [
            '查看错误详情中的具体提示信息，找出被拦截的关键词',
            '将敏感词汇用同义词替换或删除',
            '简化 Prompt，先使用最基础的描述测试是否能通过',
            '逐步添加修饰词，找出具体触发拦截的词汇',
          ],
          relatedCodes: ['403_FORBIDDEN'],
          prevention: '修改 Prompt 覆盖时避免使用敏感词汇；先用默认 Prompt 测试通过后再自定义。',
        },
        {
          code: 'PROMPT_TOO_LONG',
          message: '提示 Prompt 超出长度限制',
          severity: 'warning',
          category: 'D. 模型与生成',
          location: '页面：转画风 / paper2gal → 区域：Prompt 输入框 / 错误面板',
          cause: 'Prompt 总长度超过了后端模型的最大输入限制。',
          solution: '缩短 Prompt 或减少附加参数。',
          steps: [
            '查看「Effective Prompt Preview」中的完整 Prompt 长度',
            '精简正面 Prompt，删除冗余描述',
            '减少高级参数的数量',
            '重试',
          ],
          relatedCodes: ['MODEL_NOT_FOUND'],
        },
        {
          code: 'MODEL_LOAD_TIMEOUT',
          message: '模型加载超时',
          severity: 'critical',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: 'AI 模型文件过大或磁盘读取速度慢，导致加载时间超过超时阈值。',
          solution: '增加模型加载超时时间，或使用 SSD 加速。',
          steps: [
            '检查模型文件大小',
            '增加加载超时设置',
            '将模型文件移到 SSD',
            '使用模型量化版本减小体积'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_LOAD_OUT_OF_MEMORY',
          message: '模型加载时内存不足',
          severity: 'critical',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: '模型需要的内存超过了系统可用内存（包括物理内存和显存）。',
          solution: '关闭其他应用释放内存，使用更小模型，或增加硬件资源。',
          steps: [
            '关闭不必要的应用释放内存',
            '使用模型量化（INT8/INT4）减少内存占用',
            '增加物理内存或显存',
            '使用分片加载或按需加载'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_FILE_CORRUPTED',
          message: '模型文件已损坏',
          severity: 'critical',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: '模型文件在下载或存储过程中损坏，导致无法加载。',
          solution: '重新下载模型文件，验证校验和。',
          steps: [
            '验证模型文件的哈希值',
            '重新下载模型',
            '检查磁盘健康状态',
            '使用官方渠道下载'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_VERSION_INCOMPATIBLE',
          message: '模型版本不兼容',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: '模型文件格式版本与推理引擎版本不匹配。',
          solution: '更新推理引擎，或下载兼容版本的模型。',
          steps: [
            '检查模型格式版本',
            '更新推理引擎到兼容版本',
            '下载对应版本的模型',
            '查看版本兼容性矩阵'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_LICENSE_EXPIRED',
          message: '模型许可已过期',
          severity: 'critical',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: '使用的商业模型许可证已过期，无法继续使用。',
          solution: '续订许可证，或切换到开源替代模型。',
          steps: [
            '检查许可证有效期',
            '联系供应商续订',
            '切换到开源替代模型',
            '检查是否有试用延期选项'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_QUOTA_EXHAUSTED',
          message: '模型调用配额已用完',
          severity: 'critical',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: '模型服务提供商的月度/年度调用次数或 token 额度已用完。',
          solution: '升级套餐，或等待配额重置。',
          steps: [
            '查看当前配额使用情况',
            '升级到更高配额套餐',
            '优化调用减少浪费',
            '设置配额预警'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_INPUT_TOKEN_EXCEEDED',
          message: '输入 token 数量超限',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: '输入文本（包括系统提示、上下文、用户输入）的 token 数量超过了模型的最大输入限制。',
          solution: '缩短输入文本，截断上下文，或使用支持更长上下文的模型。',
          steps: [
            '计算输入文本的 token 数量',
            '截断或总结过长的上下文',
            '移除不必要的系统提示',
            '切换到支持更长上下文的模型'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_OUTPUT_TOKEN_EXCEEDED',
          message: '输出 token 数量超限',
          severity: 'warning',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: '模型生成的输出达到了最大输出长度限制，内容被截断。',
          solution: '增加 max_tokens 限制，或要求模型分步生成。',
          steps: [
            '增加 max_tokens 参数',
            '将任务拆分为多个子任务',
            '要求模型在达到限制前总结',
            '使用流式输出实时查看'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_CONTEXT_WINDOW_EXCEEDED',
          message: '上下文窗口超限',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: '输入 + 输出的总 token 数超过了模型的上下文窗口限制。',
          solution: '减少输入长度，或切换到更大窗口的模型。',
          steps: [
            '计算总 token 使用量',
            '减少历史消息保留数量',
            '使用摘要代替完整历史',
            '切换到更大上下文窗口的模型'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_TEMPERATURE_INVALID',
          message: '温度参数设置无效',
          severity: 'warning',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: 'temperature 参数超出了有效范围（通常为 0~2）。',
          solution: '将 temperature 调整到 0~2 范围内。',
          steps: [
            '检查 temperature 值',
            '调整到 0~2 之间',
            '0 表示确定性输出，2 表示最随机',
            '根据任务需求选择合适的值'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_TOP_P_INVALID',
          message: 'Top-p 参数设置无效',
          severity: 'warning',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: 'top_p 参数超出了有效范围（通常为 0~1）。',
          solution: '将 top_p 调整到 0~1 范围内。',
          steps: [
            '检查 top_p 值',
            '调整到 0~1 之间',
            '通常与 temperature 配合使用',
            '1 表示考虑所有可能 token'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_TOP_K_INVALID',
          message: 'Top-k 参数设置无效',
          severity: 'warning',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: 'top_k 参数设置不合理（如负数、非整数）。',
          solution: '将 top_k 设置为正整数（通常 1~100）。',
          steps: [
            '检查 top_k 值',
            '设置为正整数',
            '1 表示只取最可能的 token',
            '40~60 是常用范围'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_FREQUENCY_PENALTY_INVALID',
          message: '频率惩罚参数无效',
          severity: 'warning',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: 'frequency_penalty 超出了有效范围（通常为 -2~2）。',
          solution: '将 frequency_penalty 调整到有效范围内。',
          steps: [
            '检查 frequency_penalty 值',
            '调整到 -2~2 之间',
            '正值减少重复词',
            '负值增加重复词'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_PRESENCE_PENALTY_INVALID',
          message: '存在惩罚参数无效',
          severity: 'warning',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: 'presence_penalty 超出了有效范围（通常为 -2~2）。',
          solution: '将 presence_penalty 调整到有效范围内。',
          steps: [
            '检查 presence_penalty 值',
            '调整到 -2~2 之间',
            '正值鼓励使用新词',
            '负值鼓励使用已有词'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_STOP_SEQUENCE_INVALID',
          message: '停止序列设置无效',
          severity: 'warning',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: 'stop 序列包含空字符串或格式不正确。',
          solution: '确保 stop 序列为非空字符串数组。',
          steps: [
            '检查 stop 序列内容',
            '移除空字符串',
            '确保序列不为空白字符',
            '测试停止序列是否生效'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_SEED_INCONSISTENT',
          message: '随机种子设置不一致',
          severity: 'info',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: '相同的 seed 值但输出不同，可能是因为模型版本或参数变化。',
          solution: '确保模型版本和所有参数完全一致。',
          steps: [
            '确认模型版本一致',
            '检查所有生成参数是否相同',
            '注意某些参数（如 temperature=0）仍可能有微小差异',
            '记录完整配置用于复现'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_REPETITION_DETECTED',
          message: '模型输出出现重复',
          severity: 'warning',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: '模型陷入了重复循环，不断输出相同或相似的内容。',
          solution: '增加 frequency_penalty 和 presence_penalty，或降低 temperature。',
          steps: [
            '增加 frequency_penalty（如 0.5~1.0）',
            '增加 presence_penalty（如 0.5~1.0）',
            '降低 temperature',
            '缩短 max_tokens 避免循环'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_HALLUCINATION_DETECTED',
          message: '模型产生幻觉内容',
          severity: 'warning',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: '模型生成了看似合理但实际上不正确或虚构的信息。',
          solution: '增加事实核查步骤，使用 RAG 提供准确上下文。',
          steps: [
            '对关键事实进行人工核查',
            '使用检索增强生成（RAG）',
            '要求模型标注不确定的内容',
            '对输出进行后处理验证'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_HARMFUL_CONTENT_DETECTED',
          message: '检测到有害内容',
          severity: 'critical',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: '模型输出了违反安全策略的内容（如暴力、仇恨、非法建议）。',
          solution: '增加内容过滤层，使用更安全模型，或调整提示词。',
          steps: [
            '增加输出内容过滤器',
            '使用经过安全对齐的模型',
            '在系统提示中明确禁止有害内容',
            '对生成内容实施人工审核'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_BIAS_DETECTED',
          message: '检测到模型偏见',
          severity: 'warning',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: '模型输出表现出性别、种族、文化等方面的偏见。',
          solution: '使用更公平的模型，或在提示词中要求中立。',
          steps: [
            '评估输出是否存在偏见',
            '使用经过公平性训练的模型',
            '在提示中要求中立客观',
            '多样化训练数据'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_INFERENCE_ENGINE_ERROR',
          message: '推理引擎内部错误',
          severity: 'critical',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: '模型推理框架（如 ONNX Runtime、TensorRT、llama.cpp）出现内部错误。',
          solution: '更新推理引擎版本，或切换到其他推理后端。',
          steps: [
            '查看推理引擎的错误日志',
            '更新到最新版本',
            '尝试使用 CPU 推理替代 GPU',
            '切换到其他推理后端'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_CUDA_ERROR',
          message: 'CUDA 运行时错误',
          severity: 'critical',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: 'GPU 计算过程中出现 CUDA 错误（如内存不足、非法内存访问、驱动不兼容）。',
          solution: '更新显卡驱动，减少批处理大小，或切换到 CPU 推理。',
          steps: [
            '更新 NVIDIA 显卡驱动',
            '减少 batch size 或模型大小',
            '检查 GPU 温度是否过高',
            '切换到 CPU 推理作为降级方案'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_ROCM_ERROR',
          message: 'ROCm 运行时错误',
          severity: 'critical',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: 'AMD GPU 计算过程中出现 ROCm/HIP 错误。',
          solution: '更新 ROCm 驱动，或切换到 CPU/OpenCL 推理。',
          steps: [
            '更新 ROCm 驱动和运行时',
            '检查 GPU 兼容性',
            '减少模型大小',
            '切换到 CPU 推理'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_METAL_ERROR',
          message: 'Metal 运行时错误',
          severity: 'critical',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: 'Apple Silicon GPU 计算过程中出现 Metal 错误。',
          solution: '更新 macOS 和 Xcode，或切换到 CPU 推理。',
          steps: [
            '更新 macOS 到最新版本',
            '更新 Xcode Command Line Tools',
            '重启设备',
            '切换到 CPU 推理'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_QUANTIZATION_ERROR',
          message: '模型量化错误',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: '将模型从 FP32/FP16 量化到 INT8/INT4 时出错。',
          solution: '使用官方量化脚本，或下载已量化版本。',
          steps: [
            '使用官方提供的量化工具',
            '下载已量化的模型版本',
            '检查量化参数设置',
            '验证量化后模型的输出质量'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_PRUNING_ERROR',
          message: '模型剪枝错误',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: '模型剪枝过程中出错，导致模型结构损坏。',
          solution: '使用标准剪枝脚本，或从备份恢复。',
          steps: [
            '使用成熟的剪枝框架（如 TorchPruning）',
            '先进行小规模测试',
            '从备份恢复原始模型',
            '评估剪枝后的模型性能'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_DISTILLATION_ERROR',
          message: '模型蒸馏错误',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: '知识蒸馏过程中出错（如教师模型输出异常、损失函数计算错误）。',
          solution: '检查教师模型状态，调整蒸馏超参数。',
          steps: [
            '确认教师模型正常运行',
            '检查损失函数实现',
            '调整温度参数和 alpha 权重',
            '使用更小的数据集验证'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_FINETUNE_DATA_ERROR',
          message: '微调数据格式错误',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: '用于微调的数据格式不正确（如缺少必要字段、格式不统一）。',
          solution: '按照微调框架要求格式化数据。',
          steps: [
            '查看微调框架的数据格式要求',
            '检查每条数据是否包含必要字段',
            '统一数据格式',
            '使用小数据集验证格式'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_FINETUNE_OVERFITTING',
          message: '微调模型过拟合',
          severity: 'warning',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: '微调后的模型在训练集上表现很好但在验证集上表现差。',
          solution: '增加正则化，使用更多数据，或减少训练轮数。',
          steps: [
            '增加 dropout 率',
            '使用权重衰减（L2 正则化）',
            '增加训练数据',
            '减少训练轮数（early stopping）'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_FINETUNE_UNDERFITTING',
          message: '微调模型欠拟合',
          severity: 'warning',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: '微调后的模型在训练集和验证集上表现都差。',
          solution: '增加模型容量，减少正则化，或增加训练轮数。',
          steps: [
            '减少 dropout 和权重衰减',
            '增加训练轮数',
            '增加可训练参数（解冻更多层）',
            '使用更大的学习率'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_LORA_MERGE_ERROR',
          message: 'LoRA 权重合并错误',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: '将 LoRA 权重合并到基础模型时出错（如维度不匹配、权重格式错误）。',
          solution: '检查 LoRA 配置与基础模型的兼容性。',
          steps: [
            '确认 LoRA 的 rank 和 target_modules 正确',
            '检查基础模型是否与 LoRA 匹配',
            '使用官方合并脚本',
            '验证合并后的模型输出'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_ADAPTERS_CONFLICT',
          message: '多适配器冲突',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: '同时加载了多个不兼容的适配器（如 LoRA + Adapter + Prompt Tuning）。',
          solution: '只使用一个适配器，或确保适配器之间兼容。',
          steps: [
            '一次只加载一个适配器',
            '检查适配器之间的兼容性',
            '按顺序加载并测试',
            '查看适配器文档的兼容性说明'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_PIPELINE_STAGE_FAILED',
          message: '模型流水线某阶段失败',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: '多阶段推理流水线中某个阶段（如预处理、推理、后处理）失败。',
          solution: '检查失败阶段的日志，修复对应问题。',
          steps: [
            '定位失败的具体阶段',
            '查看该阶段的错误日志',
            '修复导致失败的问题',
            '重新运行流水线'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_BATCH_INFERENCE_FAILED',
          message: '批量推理失败',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: '批量推理时某个样本导致整个批次失败。',
          solution: '使用单条推理定位问题样本，跳过或修复该样本。',
          steps: [
            '切换到单条推理模式',
            '定位导致失败的样本',
            '修复或跳过问题样本',
            '重新批量推理'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_STREAMING_INTERRUPTED',
          message: '流式生成中断',
          severity: 'warning',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: '流式输出过程中连接断开或客户端取消。',
          solution: '实现断线重连和恢复机制。',
          steps: [
            '捕获连接断开事件',
            '实现断线重连',
            '保存已生成的内容用于恢复',
            '通知用户生成已中断'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_FUNCTION_CALL_INVALID',
          message: '模型函数调用格式无效',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: '模型输出的函数调用 JSON 格式不正确或缺少必要字段。',
          solution: '在系统提示中明确函数调用格式，增加验证和重试。',
          steps: [
            '在系统提示中提供函数调用示例',
            '使用 JSON Schema 验证输出',
            '实现调用失败时的重试逻辑',
            'fallback 到不使用函数调用的模式'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_TOOL_EXECUTION_FAILED',
          message: '模型调用的工具执行失败',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: '模型决定调用某个工具，但工具执行返回了错误。',
          solution: '将工具错误信息反馈给模型，让模型决定下一步。',
          steps: [
            '捕获工具执行错误',
            '将错误信息格式化为消息',
            '让模型基于错误信息重新决策',
            '如果多次失败，终止并告知用户'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'MODEL_JSON_MODE_INVALID_OUTPUT',
          message: 'JSON 模式输出无效',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
          cause: '要求模型输出 JSON，但输出不是有效的 JSON 或不符合指定 schema。',
          solution: '增加 JSON 示例和 schema 约束，使用后处理修复。',
          steps: [
            '在提示中提供 JSON 示例',
            '使用 response_format: { type: "json_object" }',
            '对输出进行 JSON 验证',
            '使用 JSON 修复工具处理不完整的 JSON'
          ],
          prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。',
        },
        {
          code: 'TTS_AUDIO_GENERATION_FAILED',
          message: '语音合成失败',
          severity: 'error',
          category: 'D. 模型与生成',
          location: '页面：TTS 语音导出 → 区域：输出区',
          cause: '后端 TTS 服务异常。可能是模型加载失败、参考音频格式不支持、或文本包含无法合成的字符。',
          solution: '排查后端状态、参考音频和文本内容。',
          steps: [
            '检查错误详情中的具体信息',
            '如果使用了参考音频，确认格式为 WAV/MP3/OGG',
            '简化文本，移除特殊符号和表情',
            '尝试切换声音预设',
            '重试',
          ],
          relatedCodes: ['MODEL_NOT_FOUND', 'API_TIMEOUT'],
          prevention: '简化文本移除特殊符号；确认参考音频格式正确；选择已知可用的声音预设。',
        },
      {
        code: 'RENDER_DOM_TOO_DEEP',
        message: 'DOM 树嵌套过深',
        severity: 'warning',
        category: 'D. 模型与生成',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '组件嵌套层级过多，导致渲染性能下降。',
        solution: '重构组件，减少嵌套层级。',
        steps: [
          '使用 React DevTools 检查组件层级',
          '将深层嵌套提取为独立组件',
          '使用虚拟列表渲染大量元素',
          '减少不必要的包装组件',
        ],
        prevention: '保持组件层级不超过 10 层，使用扁平化结构。',
      },
      {
        code: 'RENDER_STYLE_RECALCULATION_STORM',
        message: '样式重计算风暴',
        severity: 'warning',
        category: 'D. 模型与生成',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '频繁修改样式导致浏览器不断重排重绘。',
        solution: '批量修改样式，使用 CSS 变量或 transform。',
        steps: [
          '使用 DevTools Performance 面板分析',
          '批量 DOM 修改前先隐藏元素',
          '使用 CSS transform 代替位置属性',
          '使用 requestAnimationFrame 节流样式更新',
        ],
        prevention: '避免在循环中频繁修改样式，使用 CSS 变量统一控制。',
      },
      {
        code: 'RENDER_IFRAME_SANDBOX_VIOLATION',
        message: 'iframe 沙箱策略违规',
        severity: 'error',
        category: 'D. 模型与生成',
        location: '页面：任意工具 → 区域：错误面板',
        cause: 'iframe 的沙箱属性阻止了必要的操作，如脚本执行或表单提交。',
        solution: '调整 sandbox 属性，允许必要的权限。',
        steps: [
          '检查 iframe 的 sandbox 属性',
          '添加 allow-scripts 或 allow-forms',
          '确认父页面和子页面同源',
          '使用 postMessage 进行跨域通信',
        ],
        prevention: '设计时明确 iframe 需要的权限，最小化沙箱限制。',
      },
      {
        code: 'RENDER_SHADOW_DOM_SLOT_MISMATCH',
        message: 'Shadow DOM 插槽不匹配',
        severity: 'warning',
        category: 'D. 模型与生成',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '插入到 Shadow DOM 的内容与定义的 slot 名称不匹配。',
        solution: '检查 slot 名称，确保内容与 slot 对应。',
        steps: [
          '检查自定义元素的 slot 定义',
          '确认插入内容的 slot 属性',
          '使用默认 slot 作为 fallback',
          '查看浏览器 DevTools 的 Shadow DOM 树',
        ],
        prevention: '文档中明确定义所有 slot 名称和用途。',
      },
      {
        code: 'RENDER_WEB_COMPONENT_UNDEFINED',
        message: '自定义元素未定义',
        severity: 'error',
        category: 'D. 模型与生成',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '使用了未注册自定义元素的标签。',
        solution: '导入并注册对应的自定义元素。',
        steps: [
          '确认自定义元素的 JS 文件已加载',
          '检查 customElements.define 调用',
          '确认元素标签名拼写正确',
          '等待脚本加载完成后再使用',
        ],
        prevention: '确保自定义元素定义在使用前已完成注册。',
      },
      {
        code: 'RENDER_SVG_VIEWBOX_INVALID',
        message: 'SVG viewBox 属性无效',
        severity: 'warning',
        category: 'D. 模型与生成',
        location: '页面：任意工具 → 区域：错误面板',
        cause: 'SVG 的 viewBox 属性格式错误或数值不合理。',
        solution: '修正 viewBox 属性为正确的格式。',
        steps: [
          '检查 viewBox="x y width height" 格式',
          '确认所有值为有效数字',
          '使用设计工具重新导出 SVG',
          '手动修正 viewBox 值',
        ],
        prevention: '使用设计工具导出标准格式的 SVG。',
      },
      {
        code: 'RENDER_CANVAS_CONTEXT_LOST',
        message: 'Canvas 上下文丢失',
        severity: 'error',
        category: 'D. 模型与生成',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '浏览器因内存不足或 GPU 重置导致 Canvas 上下文丢失。',
        solution: '监听 contextlost 事件并重新初始化 Canvas。',
        steps: [
          '添加 canvas.addEventListener("webglcontextlost")',
          '在事件处理中保存当前状态',
          '添加 webglcontextrestored 监听器',
          '恢复后重新绘制内容',
        ],
        prevention: '避免同时创建过多 Canvas，及时释放不用的上下文。',
      },
      {
        code: 'RENDER_CSS_GRID_OVERFLOW',
        message: 'CSS Grid 内容溢出',
        severity: 'warning',
        category: 'D. 模型与生成',
        location: '页面：任意工具 → 区域：错误面板',
        cause: 'Grid 单元格内容超过了定义的尺寸。',
        solution: '调整 grid 模板，或使用 minmax() 和 auto 尺寸。',
        steps: [
          '检查 grid-template-columns/rows 定义',
          '使用 minmax(200px, 1fr) 替代固定尺寸',
          '添加 overflow: hidden 或 scroll',
          '调整内容尺寸适配网格',
        ],
        prevention: '使用响应式网格定义，避免固定尺寸。',
      },
      {
        code: 'RENDER_ACCESSIBILITY_TREE_BROKEN',
        message: '无障碍树结构损坏',
        severity: 'warning',
        category: 'D. 模型与生成',
        location: '页面：任意工具 → 区域：错误面板',
        cause: 'DOM 结构导致屏幕阅读器无法正确解析页面。',
        solution: '修复语义化 HTML 结构，添加正确的 ARIA 属性。',
        steps: [
          '使用 axe DevTools 检查可访问性',
          '确保 heading 层级连续',
          '为交互元素添加正确的 role',
          '修复 label 和 input 的关联',
        ],
        prevention: '开发时使用可访问性检查工具，遵循 WCAG 标准。',
      },
      {
        code: 'RENDER_PRINT_STYLESHEET_MISSING',
        message: '打印样式表缺失',
        severity: 'info',
        category: 'D. 模型与生成',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '页面缺少 @media print 样式，导致打印效果不佳。',
        solution: '添加打印样式，隐藏不必要的元素。',
        steps: [
          '添加 @media print 样式规则',
          '隐藏导航栏、按钮等交互元素',
          '调整字体大小和颜色适配打印',
          '使用打印预览检查效果',
        ],
        prevention: '设计阶段就考虑打印场景，添加打印样式。',
      },
      ],
    },
    {
      id: 'E',
      name: 'E. 工作流与转换',
      description: '涉及工作流执行、图片转换、步骤失败、工作流取消等。',
      errors: [
        {
          code: 'CONVERT_ERROR',
          message: '图片转换过程中发生异常',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：图片格式转换 → 区域：错误面板',
          cause: '图片转换过程中发生异常。可能是源图片损坏、浏览器 Canvas 2D filter 不支持、或内存不足。',
          solution: '排查图片和浏览器兼容性。',
          steps: [
            '确认源图片能在浏览器正常打开',
            '尝试刷新页面后重新上传',
            '检查图片是否过大',
            '逐个关闭滤镜排查不支持的滤镜',
            '尝试换用其他浏览器',
          ],
          relatedCodes: ['FILE_CORRUPTED', 'DEVICE_MEMORY_LOW'],
          prevention: '转换前确认图片能在浏览器正常打开；避免同时开启过多滤镜。',
        },
        {
          code: 'CONVERT_FILTER_UNSUPPORTED',
          message: '应用某些滤镜后输出结果异常',
          severity: 'warning',
          category: 'E. 工作流与转换',
          location: '页面：图片格式转换 → 区域：预览区 / 错误面板',
          cause: '当前浏览器对 Canvas 2D filter 属性支持不完整。',
          solution: '关闭不支持的滤镜或换用浏览器。',
          steps: [
            '将所有滤镜值重置为默认值',
            '逐个开启滤镜测试，找出导致异常的滤镜',
            '关闭有问题的滤镜',
            '或换用 Chrome/Firefox 等支持完整的浏览器',
          ],
          relatedCodes: ['CONVERT_ERROR'],
        },
        {
          code: 'WORKFLOW_STEP_TIMEOUT',
          message: '工作流某步骤执行超时',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '工作流中某个步骤执行时间超过了设定的超时阈值。',
          solution: '优化该步骤的性能，或增加超时时间。',
          steps: [
            '定位超时的具体步骤',
            '分析该步骤的性能瓶颈',
            '优化算法或增加资源',
            '增加该步骤的超时设置'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'WORKFLOW_STEP_DEPENDENCY_MISSING',
          message: '工作流步骤依赖缺失',
          severity: 'critical',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '某个步骤依赖的上一步输出不存在或为空。',
          solution: '检查前置步骤是否正确执行，确保输出已生成。',
          steps: [
            '检查前置步骤的执行状态',
            '确认前置步骤的输出文件存在',
            '如果前置步骤失败，先修复前置步骤',
            '重新运行工作流'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'WORKFLOW_STEP_OUTPUT_MISSING',
          message: '工作流步骤输出缺失',
          severity: 'critical',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '步骤执行完成但没有产生预期的输出文件或数据。',
          solution: '检查步骤逻辑，确认输出路径和格式正确。',
          steps: [
            '检查步骤的日志输出',
            '确认输出路径是否正确',
            '检查磁盘空间是否充足',
            '验证步骤逻辑是否正确处理了所有分支'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'WORKFLOW_STEP_OUTPUT_INVALID',
          message: '工作流步骤输出格式无效',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '步骤产生的输出格式不符合下一阶段的输入要求。',
          solution: '修正输出格式，或在中间添加格式转换步骤。',
          steps: [
            '检查输出的实际格式',
            '与下一阶段期望的格式对比',
            '添加格式转换逻辑',
            '更新文档说明格式要求'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'WORKFLOW_CIRCULAR_DEPENDENCY',
          message: '工作流存在循环依赖',
          severity: 'critical',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '工作流步骤之间的依赖关系形成了循环（A 依赖 B，B 依赖 A）。',
          solution: '重构工作流，消除循环依赖，使用DAG结构。',
          steps: [
            '绘制工作流依赖图',
            '识别循环依赖环',
            '打破循环（引入中间步骤或合并步骤）',
            '确保工作流是有向无环图（DAG）'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'WORKFLOW_PARALLEL_EXECUTION_FAILED',
          message: '工作流并行执行失败',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '并行执行的多个步骤中至少一个失败，导致整体失败或部分结果不一致。',
          solution: '使用 allSettled 模式处理并行结果，失败步骤单独重试。',
          steps: [
            '使用 Promise.allSettled 替代 Promise.all',
            '收集所有成功和失败的结果',
            '对失败的步骤单独重试',
            '记录失败原因用于分析'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'WORKFLOW_STATE_CORRUPTION',
          message: '工作流状态损坏',
          severity: 'critical',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '工作流执行过程中的状态数据损坏或丢失（如内存错误、存储故障）。',
          solution: '从上一个检查点恢复，或重新执行整个工作流。',
          steps: [
            '检查状态存储的完整性',
            '从上一个成功的检查点恢复',
            '如果无法恢复，重新执行工作流',
            '增加状态持久化和校验机制'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'WORKFLOW_STATE_INCONSISTENT',
          message: '工作流状态不一致',
          severity: 'critical',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '工作流状态在不同组件间不一致（如数据库已更新但缓存未更新）。',
          solution: '实现分布式事务或最终一致性补偿机制。',
          steps: [
            '检查各组件状态是否一致',
            '实现 Saga 模式补偿事务',
            '使用事件驱动架构保证最终一致性',
            '增加状态同步的定时检查'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'WORKFLOW_RETRY_EXHAUSTED',
          message: '工作流重试次数已耗尽',
          severity: 'critical',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '工作流或其某个步骤多次重试后仍然失败。',
          solution: '检查失败的根本原因，修复后手动触发重试。',
          steps: [
            '查看所有重试的失败原因',
            '定位根本原因',
            '修复根本问题',
            '手动触发工作流重试'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'WORKFLOW_CANCELLED_BY_USER',
          message: '工作流被用户取消',
          severity: 'info',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '用户主动取消了正在进行的工作流。',
          solution: '正常处理取消请求，清理已分配的资源。',
          steps: [
            '立即停止工作流执行',
            '清理临时文件和分配的资源',
            '释放锁和连接',
            '记录取消事件'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'WORKFLOW_CANCELLED_BY_SYSTEM',
          message: '工作流被系统取消',
          severity: 'warning',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '系统因资源不足、优先级调整或维护而取消了工作流。',
          solution: '检查系统状态，稍后重新提交工作流。',
          steps: [
            '查看系统取消原因',
            '检查系统资源状态',
            '等待系统恢复正常',
            '重新提交工作流'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'WORKFLOW_TRIGGER_DUPLICATE',
          message: '工作流重复触发',
          severity: 'warning',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '同一工作流被多次触发（如用户快速点击、消息重复投递）。',
          solution: '实现幂等性检查，使用去重键防止重复执行。',
          steps: [
            '为每次触发生成唯一 ID',
            '在数据库中检查该 ID 是否已处理',
            '如果已处理则直接返回之前的结果',
            '实现请求去重机制'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'WORKFLOW_SCHEDULER_MISFIRE',
          message: '工作流调度失败',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '定时触发的工作流因系统宕机或资源不足而错过了执行时间。',
          solution: '配置调度器的错过触发策略（立即执行或跳过）。',
          steps: [
            '检查调度器日志',
            '配置 misfire 策略（withMisfireHandlingInstruction）',
            '对于关键任务使用立即执行',
            '监控调度器健康状态'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'WORKFLOW_DEAD_LETTER_QUEUE',
          message: '工作流进入死信队列',
          severity: 'critical',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '工作流消息多次处理失败后进入了死信队列，不再自动重试。',
          solution: '检查死信队列中的消息，手动处理或修复后重新投递。',
          steps: [
            '查看死信队列中的消息',
            '分析消息处理失败的原因',
            '修复导致失败的问题',
            '将消息重新投递到正常队列'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'IMAGE_FORMAT_CONVERSION_FAILED',
          message: '图片格式转换失败',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '将图片从一种格式转换为另一种格式时出错（如不支持的色彩空间、编码错误）。',
          solution: '使用支持该格式的转换工具，或先转换为中间格式。',
          steps: [
            '确认源格式和目标格式',
            '使用 ImageMagick 或 FFmpeg 转换',
            '先转为通用格式（如 PNG）再转目标格式',
            '检查色彩空间兼容性'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'IMAGE_RESIZE_FAILED',
          message: '图片缩放失败',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '图片缩放过程中出错（如内存不足、算法不支持、尺寸参数非法）。',
          solution: '检查尺寸参数，使用合适的缩放算法，确保内存充足。',
          steps: [
            '检查目标尺寸是否为正数',
            '使用合适的插值算法',
            '确保内存充足',
            '分批处理大批量图片'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'IMAGE_CROP_FAILED',
          message: '图片裁剪失败',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '裁剪区域超出了图片边界，或裁剪参数非法。',
          solution: '确保裁剪区域在图片范围内，使用安全的裁剪函数。',
          steps: [
            '检查裁剪坐标和尺寸',
            '确保裁剪区域不超过图片边界',
            '使用安全的裁剪库函数',
            '对坐标进行边界检查'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'IMAGE_COMPOSITE_FAILED',
          message: '图片合成失败',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '将多张图片合成为一张时出错（如尺寸不匹配、透明度处理错误）。',
          solution: '统一图片尺寸，正确处理透明度，使用合成库的安全模式。',
          steps: [
            '统一所有图片的尺寸',
            '正确处理 alpha 通道',
            '使用合成库的安全模式',
            '检查图片模式（RGB/RGBA）'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'IMAGE_FILTER_APPLICATION_FAILED',
          message: '图片滤镜应用失败',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '应用滤镜（模糊、锐化、色彩调整）时出错。',
          solution: '检查滤镜参数，确保图片格式支持该滤镜。',
          steps: [
            '检查滤镜参数是否在有效范围',
            '确认图片模式支持该滤镜',
            '使用库提供的安全滤镜函数',
            '分步应用滤镜定位问题'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'IMAGE_COLOR_SPACE_CONVERSION_ERROR',
          message: '图片色彩空间转换错误',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '在不同色彩空间（sRGB、Adobe RGB、CMYK）之间转换时出错。',
          solution: '使用色彩管理引擎进行转换，或保持原色彩空间。',
          steps: [
            '确认源和目标色彩空间',
            '使用 ICC 配置文件进行转换',
            '保持原色彩空间避免转换',
            '检查色彩深度是否匹配'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'IMAGE_METADATA_CORRUPTION',
          message: '图片元数据损坏',
          severity: 'warning',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '图片的 EXIF/ICC/XMP 元数据损坏或格式不正确。',
          solution: '移除损坏的元数据，或使用元数据修复工具。',
          steps: [
            '使用 exiftool 查看元数据',
            '移除损坏的元数据',
            '使用修复工具',
            '重新嵌入正确的元数据'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'AUDIO_FORMAT_CONVERSION_FAILED',
          message: '音频格式转换失败',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '将音频从一种格式转换为另一种时出错（如不支持采样率、声道数不匹配）。',
          solution: '使用 FFmpeg 进行转换，指定正确的编码参数。',
          steps: [
            '确认源和目标格式',
            '使用 FFmpeg 指定编码器',
            '检查采样率和声道数',
            '分步转换：先解编码再编码'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'AUDIO_RESAMPLING_FAILED',
          message: '音频重采样失败',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '改变音频采样率时出错（如算法不支持、质量参数非法）。',
          solution: '使用高质量的 resampler（如 SoX、libsamplerate），检查参数。',
          steps: [
            '使用 SoX 或 libsamplerate',
            '检查目标采样率是否支持',
            '选择合适质量的算法',
            '避免多次重采样'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'AUDIO_MIXING_FAILED',
          message: '音频混音失败',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '将多个音轨混合时出错（如长度不匹配、格式不一致、增益计算错误）。',
          solution: '统一音轨长度和格式，使用正确的增益算法。',
          steps: [
            '统一所有音轨的长度和格式',
            '对齐音轨起点',
            '使用正确的增益算法',
            '分步混合定位问题'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'VIDEO_TRANSCODING_FAILED',
          message: '视频转码失败',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '视频转码过程中出错（如编码器不支持、分辨率不合法、比特率设置错误）。',
          solution: '使用 FFmpeg 检查源视频，调整转码参数。',
          steps: [
            '使用 ffprobe 检查源视频信息',
            '确认编码器支持目标格式',
            '调整分辨率和比特率',
            '分步转码定位问题'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'VIDEO_DEMUXING_FAILED',
          message: '视频解封装失败',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '从容器格式（MP4/MKV/AVI）中分离音视频流时出错。',
          solution: '使用 FFmpeg 修复容器，或重新封装。',
          steps: [
            '使用 ffprobe 检查容器完整性',
            '使用 FFmpeg 重新封装',
            '尝试其他容器格式',
            '修复损坏的索引'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'VIDEO_MUXING_FAILED',
          message: '视频封装失败',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '将音视频流封装到容器格式时出错（如时间戳不连续、流参数不兼容）。',
          solution: '修正时间戳，确保流参数兼容，使用标准容器。',
          steps: [
            '检查音视频流的时间戳',
            '确保编码参数兼容',
            '使用标准容器格式（MP4/MKV）',
            '使用 FFmpeg 的 faststart 选项'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'DOCUMENT_CONVERSION_FAILED',
          message: '文档转换失败',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '将文档从一种格式转换为另一种时出错（如字体缺失、嵌入对象不支持）。',
          solution: '安装缺失字体，使用支持该格式的转换工具。',
          steps: [
            '确认源和目标格式',
            '安装缺失的字体',
            '使用 LibreOffice 或 pandoc 转换',
            '检查嵌入对象是否受支持'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'DOCUMENT_MERGE_FAILED',
          message: '文档合并失败',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '将多个文档合并为一个时出错（如页码冲突、样式不兼容、书签重复）。',
          solution: '统一文档样式，处理冲突元素，使用专业合并工具。',
          steps: [
            '统一所有文档的样式',
            '处理页码和书签冲突',
            '使用专业工具（如 PDFtk、PyPDF2）',
            '分步合并定位问题'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'DOCUMENT_SPLIT_FAILED',
          message: '文档拆分失败',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '将文档拆分为多个部分时出错（如页码范围无效、拆分点不正确）。',
          solution: '检查页码范围，使用正确的拆分工具。',
          steps: [
            '确认页码范围有效',
            '使用正确的拆分工具',
            '检查文档结构',
            '处理特殊页面（封面、目录）'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'DOCUMENT_WATERMARK_FAILED',
          message: '文档水印添加失败',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '为文档添加水印时出错（如字体缺失、位置计算错误、透明度问题）。',
          solution: '使用支持水印的库，确保字体可用。',
          steps: [
            '确认水印字体已安装',
            '检查水印位置和大小',
            '调整透明度',
            '使用专业库（如 iText、PyMuPDF）'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'DOCUMENT_ENCRYPTION_FAILED',
          message: '文档加密失败',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '为文档设置密码保护时出错（如算法不支持、密码复杂度不足）。',
          solution: '使用标准加密算法，设置符合要求的密码。',
          steps: [
            '使用 AES-256 等标准算法',
            '设置足够复杂的密码',
            '确认目标格式支持加密',
            '测试加密后的文档可解密'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'DOCUMENT_DECRYPTION_FAILED',
          message: '文档解密失败',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '解密文档时出错（如密码错误、加密算法不匹配、文件损坏）。',
          solution: '确认密码正确，使用与加密时相同的算法。',
          steps: [
            '确认密码正确',
            '使用相同的算法和参数',
            '检查文件是否完整',
            '尝试使用其他解密工具'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'ARCHIVE_CREATE_FAILED',
          message: '创建压缩文件失败',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '创建 zip/tar/7z 归档时出错（如文件不存在、权限不足、磁盘空间不足）。',
          solution: '检查源文件，确认权限和磁盘空间充足。',
          steps: [
            '确认所有源文件存在',
            '检查目标目录的写权限',
            '确认磁盘空间充足',
            '分批归档避免单文件过大'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'ARCHIVE_EXTRACT_FAILED',
          message: '解压文件失败',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '解压归档时出错（如文件损坏、密码错误、格式不支持、路径遍历）。',
          solution: '检查归档完整性，确认密码正确，使用安全解压。',
          steps: [
            '验证归档完整性',
            '确认密码正确',
            '使用安全的解压路径',
            '检查是否有路径遍历风险'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'ARCHIVE_INFINITE_LOOP',
          message: '压缩炸弹检测（zip bomb）',
          severity: 'critical',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '解压后的文件大小远超压缩包大小，可能是恶意压缩炸弹。',
          solution: '限制解压后的最大大小，拒绝可疑压缩包。',
          steps: [
            '限制解压后的总大小',
            '限制压缩比',
            '使用流式解压',
            '拒绝压缩比异常的文件'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'TEXT_ENCODING_CONVERSION_FAILED',
          message: '文本编码转换失败',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '在不同字符编码之间转换时出错（如源编码识别错误、目标编码不支持某些字符）。',
          solution: '正确识别源编码，使用支持所有字符的目标编码（如 UTF-8）。',
          steps: [
            '使用 chardet 识别源编码',
            '指定正确的源编码',
            '使用 UTF-8 作为目标编码',
            '处理无法转换的字符（替换或忽略）'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'TEXT_NORMALIZATION_FAILED',
          message: '文本规范化失败',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: 'Unicode 规范化（NFC/NFD/NFKC/NFKD）过程中出错。',
          solution: '使用标准 Unicode 规范化库，处理边缘字符。',
          steps: [
            '使用标准库（如 Python unicodedata）',
            '选择合适的规范化形式',
            '测试边缘字符',
            '处理规范化后的结果'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'TEXT_TOKENIZATION_FAILED',
          message: '文本分词失败',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '使用分词器（tokenizer）处理文本时出错（如文本过长、包含特殊字符、编码问题）。',
          solution: '预处理文本，截断过长内容，处理特殊字符。',
          steps: [
            '截断过长的文本',
            '移除或替换特殊字符',
            '检查编码',
            '使用适合语言的分词器'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'TEXT_TRANSLATION_FAILED',
          message: '文本翻译失败',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：任意工作流工具 → 区域：处理流水线',
          cause: '机器翻译服务返回错误或无法翻译某些内容。',
          solution: '检查源语言识别，简化文本，或使用其他翻译服务。',
          steps: [
            '确认源语言识别正确',
            '简化复杂句式',
            '分段翻译',
            '使用备用翻译服务'
          ],
          prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。',
        },
        {
          code: 'P2G_WORKFLOW_ERROR',
          message: 'Paper2Gal 工作流执行失败',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：paper2gal → 区域：错误面板',
          cause: '工作流某个步骤执行失败。可能是输入验证失败、模型不可用、API Key 失效、生成内容被安全过滤器拦截、或网络中断。',
          solution: '根据错误详情逐步排查。',
          steps: [
            '展开错误面板，阅读「可读错误信息」「可能原因」「修复提示」',
            '检查上传的图片是否为有效的 PNG/JPG',
            '检查网络连接',
            '如果提示「内容策略违规」，修改 Prompt 覆盖中的敏感词汇',
            '确认后端服务正常运行',
            '如果某一步骤失败，可在步骤卡片上点击「重做」单独重试该步骤',
            '如果整个工作流失败，点击「重刷」清除后重新开始',
          ],
          relatedCodes: ['API_KEY_MISSING', 'API_KEY_EXPIRED', 'MODEL_NOT_FOUND', 'PROMPT_BLOCKED'],
          prevention: '启动工作流前确认图片为有效 PNG/JPG、网络连接稳定、Prompt 覆盖中无敏感词汇。',
        },
        {
          code: 'STYLE_TRANSFER_INPUT_MISSING',
          message: '未上传图片就点击了开始',
          severity: 'warning',
          category: 'E. 工作流与转换',
          location: '页面：转画风 → 区域：错误面板',
          cause: '未上传图片，或上传后点击了「开始」但没有有效的输入文件。',
          solution: '确认已上传有效的图片文件。',
          steps: [
            '点击「选择图片」按钮',
            '在文件选择器中选择有效的 PNG/JPG 文件',
            '确认预览区显示了图片缩略图',
            '点击「开始」',
          ],
          relatedCodes: ['FILE_FORMAT_UNSUPPORTED', 'FILE_CORRUPTED'],
        },
        {
          code: 'STYLE_TRANSFER_REQUEST_FAILED',
          message: '转画风请求失败',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：转画风 → 区域：错误面板',
          cause: '后端 API 请求失败。可能是网络中断、API Key 无效、模型不可用、或服务器内部错误。',
          solution: '根据错误详情排查。',
          steps: [
            '展开错误面板查看详细错误信息',
            '如果是 401：检查 API Key',
            '如果是 404：检查模型',
            '如果是 429：等待后重试',
            '如果是 500/502/503：检查后端',
            '如果是网络错误：检查网络连接',
          ],
          relatedCodes: ['API_KEY_MISSING', 'API_KEY_EXPIRED', 'MODEL_NOT_FOUND', 'BACKEND_UNAVAILABLE'],
          prevention: '开始转换前确认 API Key 有效、网络连接正常、模型可用。',
        },
        {
          code: 'WORKFLOW_CANCELLED',
          message: '工作流被取消',
          severity: 'info',
          category: 'E. 工作流与转换',
          location: '页面：paper2gal → 区域：进度区',
          cause: '用户手动取消了工作流，或后端因资源限制主动取消了任务。',
          solution: '重新启动工作流。',
          steps: [
            '确认是否是自己点击了取消',
            '如果不是，可能是后端资源不足',
            '等待几分钟后重新点击「启动工作流」',
          ],
          relatedCodes: ['P2G_WORKFLOW_ERROR'],
        },
        {
          code: 'WORKFLOW_STEP_FAILED',
          message: '工作流某个步骤失败',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：paper2gal → 区域：步骤列表',
          cause: '该具体步骤执行时出错。',
          solution: '查看步骤详情并单独重试。',
          steps: [
            '点击失败步骤卡片查看错误详情',
            '根据错误信息排查',
            '点击该步骤卡片上的「重做」按钮单独重试',
            '如果多次重试仍失败，联系后端管理员',
          ],
          relatedCodes: ['P2G_WORKFLOW_ERROR', 'PROMPT_BLOCKED'],
          prevention: '某步骤失败后查看错误详情，根据提示修改对应 Prompt 或检查网络后重试。',
        },
        {
          code: 'WORKFLOW_NOT_FOUND',
          message: '重做或下载时提示「这个工作流记录已不存在」',
          severity: 'error',
          category: 'E. 工作流与转换',
          location: '页面：paper2gal → 区域：步骤卡片 / 错误面板',
          cause: '后端（特别是 Zeabur 等无服务器平台）重新部署或重启后，没有把 WORKFLOW_STATE_DIR 挂载到持久化硬盘，旧的 wf_* 状态文件被清空。',
          solution: '重新启动一个新工作流。',
          steps: [
            '这是一个后端存储问题，无法恢复旧工作流',
            '点击「开始」用当前图片启动一个新工作流',
            '如果需要保留历史工作流，联系后端管理员配置持久化硬盘挂载',
          ],
          relatedCodes: ['P2G_WORKFLOW_ERROR', 'BACKEND_UNAVAILABLE'],
          prevention: '使用 Zeabur 等无服务器平台时，务必配置持久化硬盘挂载；重要素材生成后及时点击「下载全部」备份到本地。',
        },
        {
          code: 'REDO_CONFLICT',
          message: '点击重做时提示「这个结果已经在重做中」',
          severity: 'info',
          category: 'E. 工作流与转换',
          location: '页面：paper2gal → 区域：步骤卡片 / 结果卡片',
          cause: '当前步骤或其冲突组中的另一个步骤正在重做中。例如，重做 expression_thinking 时，对应的 cutout_expression_thinking 也会进入重做状态。',
          solution: '等待当前重做完成后再操作。',
          steps: [
            '观察页面消息条，确认重做进度',
            '等待该步骤状态从「重做中」变为「成功」或「失败」',
            '如果重做长时间无响应，刷新页面后重试',
          ],
          relatedCodes: ['WORKFLOW_STEP_FAILED'],
          prevention: '不要对同一冲突组内的步骤同时发起多个重做请求；等待一个完成后再发起下一个。',
        },
      {
        code: 'PERFORMANCE_MAIN_THREAD_BLOCKED',
        message: '主线程被长时间阻塞',
        severity: 'error',
        category: 'E. 工作流与转换',
        location: '页面：任意工具 → 区域：错误面板',
        cause: 'JavaScript 执行时间过长，导致页面卡顿或无响应。',
        solution: '将长任务拆分为多个小任务，或使用 Web Worker。',
        steps: [
          '使用 Performance 面板定位长任务',
          '将计算拆分为多个 setTimeout/setImmediate',
          '将复杂计算移到 Web Worker',
          '使用 requestIdleCallback 执行低优先级任务',
        ],
        prevention: '避免在主线程执行超过 50ms 的同步任务。',
      },
      {
        code: 'PERFORMANCE_LAYOUT_THRASHING',
        message: '布局抖动（Layout Thrashing）',
        severity: 'warning',
        category: 'E. 工作流与转换',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '交替读取和写入 DOM 几何属性，导致浏览器反复重排。',
        solution: '批量读取和写入，使用 FastDOM 等库。',
        steps: [
          '使用 FastDOM 或类似库批处理读写',
          '先读取所有需要的几何属性',
          '再批量写入所有修改',
          '使用 CSS transform 代替位置修改',
        ],
        prevention: '遵循先读后写原则，避免在循环中交替读写 DOM。',
      },
      {
        code: 'PERFORMANCE_MEMORY_LEAK_DETECTED',
        message: '检测到内存泄漏',
        severity: 'error',
        category: 'E. 工作流与转换',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '应用中存在未释放的引用，导致内存不断增长。',
        solution: '使用内存分析工具定位泄漏源，清理未使用的引用。',
        steps: [
          '使用 Memory 面板拍摄堆快照',
          '对比操作前后的内存变化',
          '检查未清理的事件监听器',
          '检查闭包中持有的大对象引用',
        ],
        prevention: '组件卸载时清理所有定时器、监听器和引用。',
      },
      {
        code: 'PERFORMANCE_FORCED_SYNCHRONOUS_LAYOUT',
        message: '强制同步布局',
        severity: 'warning',
        category: 'E. 工作流与转换',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '在修改样式后立即读取几何属性，强制浏览器同步计算布局。',
        solution: '分离样式修改和几何属性读取。',
        steps: [
          '使用 Performance 面板定位强制布局',
          '将读取操作移到写入之前',
          '使用 requestAnimationFrame 延迟读取',
          '缓存几何属性避免重复读取',
        ],
        prevention: '避免在修改样式后立即读取 offsetWidth/Height 等属性。',
      },
      {
        code: 'PERFORMANCE_LONG_TASK_ON_TTI',
        message: '交互就绪时间（TTI）前存在长任务',
        severity: 'warning',
        category: 'E. 工作流与转换',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '页面加载过程中有长任务阻塞了用户交互。',
        solution: '延迟非关键脚本的执行，拆分长任务。',
        steps: [
          '使用 Lighthouse 测量 TTI',
          '将非关键脚本标记为 async/defer',
          '代码分割，按需加载模块',
          '使用 PerformanceObserver 监控长任务',
        ],
        prevention: '关键路径上只加载必要资源，延迟其他所有脚本。',
      },
      {
        code: 'PERFORMANCE_CUMULATIVE_LAYOUT_SHIFT',
        message: '累积布局偏移（CLS）过高',
        severity: 'warning',
        category: 'E. 工作流与转换',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '页面元素在加载过程中发生可见的位置偏移。',
        solution: '为图片和容器预留固定尺寸，避免内容加载后推挤布局。',
        steps: [
          '为图片设置 width/height 属性',
          '为广告位和 iframe 预留固定空间',
          '使用 CSS aspect-ratio 保持比例',
          '避免在已有内容上方插入新元素',
        ],
        prevention: '设计时预留所有动态内容的空间，使用骨架屏。',
      },
      {
        code: 'PERFORMANCE_FIRST_INPUT_DELAY_HIGH',
        message: '首次输入延迟（FID）过高',
        severity: 'warning',
        category: 'E. 工作流与转换',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '用户首次交互时主线程正忙，无法及时响应。',
        solution: '减少主线程负载，拆分长任务。',
        steps: [
          '减少第三方脚本的数量',
          '将非关键计算移到 Web Worker',
          '使用代码分割减少初始包大小',
          '延迟加载非关键模块',
        ],
        prevention: '保持主线程空闲，确保关键交互路径畅通。',
      },
      {
        code: 'PERFORMANCE_SERVICE_WORKER_UPDATE_FAILED',
        message: 'Service Worker 更新失败',
        severity: 'warning',
        category: 'E. 工作流与转换',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '新的 Service Worker 安装或激活失败。',
        solution: '检查 Service Worker 脚本，清理缓存后重试。',
        steps: [
          '检查 Service Worker 注册代码',
          '查看 DevTools Application 面板中的 SW 状态',
          '清除站点数据后重新注册',
          '检查 SW 脚本是否有语法错误',
        ],
        prevention: '使用 Workbox 等成熟库管理 Service Worker。',
      },
      {
        code: 'PERFORMANCE_PUSH_NOTIFICATION_BLOCKED',
        message: '推送通知被阻止',
        severity: 'info',
        category: 'E. 工作流与转换',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '用户或浏览器设置阻止了推送通知权限请求。',
        solution: '引导用户在浏览器设置中允许通知。',
        steps: [
          '检查 Notification.permission 状态',
          '引导用户到浏览器设置中允许通知',
          '提供清晰的通知价值说明',
          '不要频繁请求权限',
        ],
        prevention: '在用户完成有价值的操作后再请求通知权限。',
      },
      {
        code: 'PERFORMANCE_OFFLINE_CACHE_STALE',
        message: '离线缓存数据过期',
        severity: 'warning',
        category: 'E. 工作流与转换',
        location: '页面：任意工具 → 区域：错误面板',
        cause: 'Service Worker 缓存的数据版本过旧。',
        solution: '更新缓存策略，或强制刷新缓存。',
        steps: [
          '检查 Service Worker 缓存版本',
          '更新 CACHE_NAME 强制刷新',
          '使用 Cache-First 策略时设置最大年龄',
          '提供手动刷新缓存的按钮',
        ],
        prevention: '使用版本化的缓存名称，实现自动更新机制。',
      },
      ],
    },
    {
      id: 'F',
      name: 'F. 系统与权限',
      description: '涉及浏览器兼容性、内存不足、权限限制、导出失败等系统级问题。',
      errors: [
        {
          code: 'DEVICE_MEMORY_LOW',
          message: '浏览器标签页崩溃、卡死或无响应',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：整个页面',
          cause: '设备内存不足，浏览器强制终止了标签页进程。通常发生在处理超大图片或大量数据时。',
          solution: '关闭其他标签页，降低数据规模，或换用内存更大的设备。',
          steps: [
            '保存当前工作（如果有）',
            '关闭其他不用的浏览器标签页',
            '降低图片尺寸或减少数据量',
            '重启浏览器后重试',
            '如果问题持续，尝试在内存更大的设备上操作',
          ],
          relatedCodes: ['FILE_TOO_LARGE'],
          prevention: '处理大文件前关闭其他浏览器标签页；将图片最大边缩放到 2048 以下。',
        },
        {
          code: 'EXPORT_FAILED',
          message: '点击导出按钮后无反应',
          severity: 'error',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：导出按钮',
          cause: '浏览器阻止了下载弹窗，或内容过大导致 Blob 生成失败。',
          solution: '检查浏览器下载设置或分批导出。',
          steps: [
            '检查浏览器是否阻止了弹窗（地址栏右侧是否有弹窗拦截提示）',
            '允许当前网站的弹窗',
            '如果内容包含大量图片，尝试先移除部分图片再导出',
            '使用「复制」功能作为临时替代方案',
          ],
          relatedCodes: ['DEVICE_MEMORY_LOW'],
          prevention: '允许浏览器弹窗；文档过大时先移除部分图片再导出。',
        },
        {
          code: 'FRONTEND_CUTOUT_SPAWN_FAILED',
          message: '浏览器端抠图资源加载失败',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：paper2gal → 区域：右栏步骤卡片 / 错误面板',
          cause: '浏览器端模型资源无法加载，或当前浏览器不支持所需能力。',
          solution: '确认前端抠图资源可访问后刷新重试。',
          steps: [
            '确认浏览器可以访问前端抠图模型资源',
            '刷新页面后重新触发浏览器端抠图',
            '如果是 Docker 部署，重新构建镜像（Dockerfile 已包含安装步骤）',
            '重启后端服务',
          ],
          relatedCodes: ['FRONTEND_CUTOUT_EXECUTION_FAILED'],
          prevention: 'Docker 镜像会提供前端抠图资源代理；裸机部署时确保浏览器能访问模型资源。',
        },
        {
          code: 'FRONTEND_CUTOUT_TIMEOUT',
          message: 'browser cutout 处理超时',
          severity: 'error',
          category: 'F. 系统与权限',
          location: '页面：paper2gal → 区域：右栏步骤卡片 / 错误面板',
          cause: 'browser cutout 处理超时（默认 120 秒）。可能是图片过大、服务器 CPU/RAM 不足。',
          solution: '缩小图片或提升服务器性能。',
          steps: [
            '重新上传一张最大边不超过 2048 像素的图片',
            '检查服务器 CPU 和内存使用率',
            '如果是低配置服务器，关闭「AI 并发」让步骤串行执行',
            '重试',
          ],
          relatedCodes: ['FRONTEND_CUTOUT_EXECUTION_FAILED', 'FRONTEND_CUTOUT_OUTPUT_MISSING'],
          prevention: '上传前将图片缩放到合理尺寸；确保服务器有足够的 CPU 和内存。',
        },
        {
          code: 'FRONTEND_CUTOUT_EXECUTION_FAILED',
          message: 'browser cutout 处理失败（非零退出码）',
          severity: 'error',
          category: 'F. 系统与权限',
          location: '页面：paper2gal → 区域：右栏步骤卡片 / 错误面板',
          cause: 'browser cutout 处理图片时发生内部错误。可能是图片格式损坏、不支持的编码、或依赖库异常。',
          solution: '更换图片后重试，并检查后端日志。',
          steps: [
            '确认表情图片已成功生成（点击步骤卡片查看输出）',
            '如果源图片损坏，重新上传一张新的 PNG/JPG 图片',
            '检查后端日志中的详细错误输出',
            '在该步骤卡片上点击「重做」单独重试抠图',
          ],
          relatedCodes: ['FRONTEND_CUTOUT_SPAWN_FAILED', 'FRONTEND_CUTOUT_TIMEOUT', 'FRONTEND_CUTOUT_OUTPUT_MISSING'],
          prevention: '上传标准格式的 PNG/JPG 图片；避免使用特殊编码或损坏的图片文件。',
        },
        {
          code: 'FRONTEND_CUTOUT_SOURCE_MISSING',
          message: 'browser cutout 找不到源图片',
          severity: 'error',
          category: 'F. 系统与权限',
          location: '页面：paper2gal → 区域：右栏步骤卡片 / 错误面板',
          cause: '上游表情生成步骤失败，导致 browser cutout 没有输入文件可处理。',
          solution: '先排查并修复表情生成步骤的错误，再重试抠图。',
          steps: [
            '检查表情生成步骤（thinking / surprise / angry）的错误信息',
            '修复表情生成的问题（通常是 API Key 无效或网络问题）',
            '确认表情图片已成功生成后，再对抠图步骤点击「重做」',
          ],
          relatedCodes: ['PLATO_REQUEST_FAILED', 'BANANA2_REQUEST_FAILED', 'MOCK_STEP_FAILED'],
          prevention: '确保表情生成步骤成功后再进行抠图；工作流会自动按顺序执行，不要跳过步骤。',
        },
        {
          code: 'FRONTEND_CUTOUT_OUTPUT_MISSING',
          message: 'browser cutout 执行成功但未生成输出文件',
          severity: 'error',
          category: 'F. 系统与权限',
          location: '页面：paper2gal → 区域：右栏步骤卡片 / 错误面板',
          cause: 'browser cutout 处理图片时发生内部错误。可能是图片格式损坏、不支持的编码、或依赖库异常。',
          solution: '更换图片后重试。',
          steps: [
            '确认表情图片已成功生成（点击步骤卡片查看输出）',
            '如果源图片损坏，重新上传一张新的 PNG/JPG 图片',
            '检查后端日志中的详细错误输出',
            '在该步骤卡片上点击「重做」单独重试抠图',
          ],
          relatedCodes: ['FRONTEND_CUTOUT_SPAWN_FAILED', 'FRONTEND_CUTOUT_TIMEOUT', 'FRONTEND_CUTOUT_EXECUTION_FAILED'],
          prevention: '确保输入图片格式正确；避免使用损坏或特殊编码的图片。',
        },
      {
        code: 'WORKFLOW_CONCURRENCY_LIMIT_EXCEEDED',
        message: '工作流并发数超过限制',
        severity: 'error',
        category: 'F. 系统与权限',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '同时运行的工作流数量超过了系统配置的上限。',
        solution: '等待现有工作流完成，或增加并发限制。',
        steps: [
          '查看当前运行中的工作流列表',
          '等待部分工作流完成',
          '取消不必要的工作流',
          '联系管理员增加并发限制',
        ],
        prevention: '合理配置并发限制，提供队列机制。',
      },
      {
        code: 'WORKFLOW_DEPENDENCY_CYCLE',
        message: '工作流存在循环依赖',
        severity: 'critical',
        category: 'F. 系统与权限',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '工作流步骤之间存在循环引用，无法确定执行顺序。',
        solution: '检查并打破循环依赖，重新设计工作流。',
        steps: [
          '使用工作流可视化工具检查依赖图',
          '识别循环中的步骤',
          '提取公共逻辑消除循环',
          '重新设计工作流为 DAG',
        ],
        prevention: '工作流设计时确保无循环依赖，使用拓扑排序验证。',
      },
      {
        code: 'WORKFLOW_STEP_TIMEOUT_CASCADE',
        message: '工作流步骤超时级联',
        severity: 'error',
        category: 'F. 系统与权限',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '一个步骤超时导致后续依赖步骤全部失败。',
        solution: '增加超时时间，或设计降级策略。',
        steps: [
          '识别最先超时的步骤',
          '增加该步骤的超时时间',
          '为关键步骤设计降级方案',
          '添加步骤级别的重试机制',
        ],
        prevention: '为每个步骤设置合理的超时，设计独立的降级策略。',
      },
      {
        code: 'WORKFLOW_STATE_CORRUPTION',
        message: '工作流状态损坏',
        severity: 'critical',
        category: 'F. 系统与权限',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '工作流状态文件被意外修改或部分写入。',
        solution: '从备份恢复状态，或重新开始工作流。',
        steps: [
          '检查状态文件的完整性',
          '尝试从自动备份恢复',
          '如果无法恢复则重置工作流',
          '检查磁盘和文件系统健康',
        ],
        prevention: '使用事务写入状态，定期自动备份。',
      },
      {
        code: 'WORKFLOW_RETRY_EXHAUSTED',
        message: '工作流重试次数已耗尽',
        severity: 'error',
        category: 'F. 系统与权限',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '步骤失败后重试达到最大次数仍然失败。',
        solution: '检查失败原因，修复后手动重试。',
        steps: [
          '查看最后一次失败的详细错误',
          '修复导致失败的问题',
          '手动触发工作流重试',
          '如果问题持续则联系支持',
        ],
        prevention: '设置合理的重试策略，区分可重试和不可重试错误。',
      },
      {
        code: 'WORKFLOW_INPUT_VALIDATION_FAILED',
        message: '工作流输入验证失败',
        severity: 'error',
        category: 'F. 系统与权限',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '工作流的输入参数不满足校验规则。',
        solution: '根据错误提示修正输入参数。',
        steps: [
          '查看验证失败的字段和规则',
          '修改输入值满足规则',
          '确认所有必填字段已填写',
          '检查字段类型和格式',
        ],
        prevention: '前端提供实时输入验证，给出清晰的错误提示。',
      },
      {
        code: 'WORKFLOW_OUTPUT_ARTIFACT_MISSING',
        message: '工作流输出产物缺失',
        severity: 'error',
        category: 'F. 系统与权限',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '工作流完成后，预期的输出文件或数据不存在。',
        solution: '检查工作流执行日志，确认输出步骤是否成功。',
        steps: [
          '查看工作流执行日志',
          '确认输出步骤的状态',
          '检查输出目录权限',
          '手动重新执行输出步骤',
        ],
        prevention: '每个输出步骤后验证产物存在性。',
      },
      {
        code: 'WORKFLOW_NOTIFICATION_DELIVERY_FAILED',
        message: '工作流通知发送失败',
        severity: 'warning',
        category: 'F. 系统与权限',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '工作流完成或失败的通知无法发送到用户。',
        solution: '检查通知配置，确认通知渠道可用。',
        steps: [
          '检查通知配置（邮件/推送/Webhook）',
          '测试通知渠道连通性',
          '查看通知服务日志',
          '更新通知配置后重试',
        ],
        prevention: '提供多种通知渠道，配置失败通知告警。',
      },
      {
        code: 'WORKFLOW_SCHEDULER_MISFIRE',
        message: '工作流调度器触发失败',
        severity: 'warning',
        category: 'F. 系统与权限',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '定时触发的工作流未按计划执行。',
        solution: '检查调度器状态，手动补执行。',
        steps: [
          '检查调度器服务是否运行',
          '查看调度日志确认触发记录',
          '手动触发遗漏的工作流',
          '检查系统时间是否准确',
        ],
        prevention: '使用可靠的调度服务，配置 misfire 处理策略。',
      },
      {
        code: 'WORKFLOW_DEAD_LETTER_QUEUE_FULL',
        message: '死信队列已满',
        severity: 'error',
        category: 'F. 系统与权限',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '失败的工作流消息堆积，死信队列达到容量上限。',
        solution: '清理死信队列，分析失败原因。',
        steps: [
          '查看死信队列的堆积情况',
          '批量清理或归档旧死信',
          '分析死信的共同失败模式',
          '修复根因后重新处理',
        ],
        prevention: '监控死信队列深度，设置告警和自动清理。',
      },
      
        {
          code: 'SYSTEM_MEMORY_EXHAUSTED',
          message: '系统内存耗尽',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '应用程序或系统整体可用内存不足，可能触发 OOM Killer。',
          solution: '关闭不必要的应用，增加物理内存，或优化内存使用。',
          steps: [
            '查看内存使用情况（free/top）',
            '关闭不必要的应用',
            '增加交换空间（swap）',
            '优化代码减少内存占用'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_SWAP_EXHAUSTED',
          message: '系统交换空间耗尽',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '物理内存和交换空间都已用完，系统即将崩溃。',
          solution: '紧急释放内存，或增加交换空间。',
          steps: [
            '立即关闭非关键进程',
            '增加交换文件或分区',
            '检查是否有内存泄漏',
            '考虑增加物理内存'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_CPU_OVERLOAD',
          message: '系统 CPU 过载',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: 'CPU 使用率持续 100%，系统响应极慢或无响应。',
          solution: '找出高 CPU 进程，优化或终止，或增加 CPU 核心。',
          steps: [
            '使用 top/htop 找出高 CPU 进程',
            '分析该进程为何占用高 CPU',
            '优化算法或降低负载',
            '必要时终止进程'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_DISK_IO_OVERLOAD',
          message: '系统磁盘 I/O 过载',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '磁盘 I/O 队列深度过大，读写操作严重延迟。',
          solution: '优化 I/O 模式，使用缓存，或升级到 SSD。',
          steps: [
            '使用 iostat 查看 I/O 状况',
            '找出高 I/O 进程',
            '优化数据库查询和索引',
            '将频繁访问的数据移到 SSD'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_NETWORK_IO_OVERLOAD',
          message: '系统网络 I/O 过载',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '网络带宽被占满，或网络包处理速度跟不上。',
          solution: '限制带宽使用，优化网络协议，或升级网络设备。',
          steps: [
            '使用 iftop/nethogs 查看网络流量',
            '找出高带宽进程',
            '实施流量限制（QoS）',
            '升级网络带宽'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_FILE_DESCRIPTOR_EXHAUSTED',
          message: '系统文件描述符耗尽',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '进程打开的文件句柄数超过了系统限制（ulimit）。',
          solution: '增加文件描述符限制，或关闭不必要的文件句柄。',
          steps: [
            '查看当前打开的文件数（lsof）',
            '关闭不必要的文件和网络连接',
            '增加 ulimit -n 限制',
            '检查是否有文件句柄泄漏'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_PROCESS_LIMIT_EXCEEDED',
          message: '系统进程数超限',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '系统中运行的进程数超过了最大限制（如 fork bomb）。',
          solution: '终止不必要的进程，或增加进程数限制。',
          steps: [
            '查看当前进程数（ps aux | wc -l）',
            '终止不必要的进程',
            '增加系统进程数限制',
            '检查是否有进程泄漏'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_THREAD_LIMIT_EXCEEDED',
          message: '系统线程数超限',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '单个进程创建的线程数超过了限制（如 /proc/sys/kernel/threads-max）。',
          solution: '减少线程数，使用线程池，或增加限制。',
          steps: [
            '查看当前线程数',
            '使用线程池限制并发数',
            '优化代码减少线程创建',
            '增加系统线程限制'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_OUT_OF_INODES',
          message: '系统 inode 耗尽',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '文件系统中创建的文件数量达到了 inode 上限。',
          solution: '删除不必要的文件，或重新格式化文件系统增加 inode。',
          steps: [
            '查看 inode 使用情况（df -i）',
            '删除大量小文件',
            '合并文件减少 inode 使用',
            '重新创建文件系统'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_OUT_OF_PIDS',
          message: '系统 PID 耗尽',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '系统中运行的进程/线程数达到了 PID 最大值（通常 32768）。',
          solution: '终止僵尸进程，或增加 PID 最大值。',
          steps: [
            '查看僵尸进程（ps aux | grep Z）',
            '终止僵尸进程的父进程',
            '增加 /proc/sys/kernel/pid_max',
            '检查是否有进程泄漏'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_CLOCK_DRIFT',
          message: '系统时钟漂移',
          severity: 'warning',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '系统时间与 NTP 服务器时间不一致，可能导致证书验证、日志排序等问题。',
          solution: '同步系统时间，启用 NTP 自动同步。',
          steps: [
            '使用 ntpdate 或 chronyc 同步时间',
            '启用 systemd-timesyncd 或 ntpd',
            '检查防火墙是否阻止了 NTP 端口',
            '配置硬件时钟'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_TIMEZONE_MISMATCH',
          message: '系统时区不匹配',
          severity: 'warning',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '应用程序期望的时区与系统时区不一致，导致时间解析错误。',
          solution: '统一使用 UTC 存储，在显示时转换时区。',
          steps: [
            '检查系统和应用的时区设置',
            '数据库统一使用 UTC 存储',
            '应用层进行时区转换',
            '使用标准时区库（如 moment-timezone）'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_LOCALE_MISSING',
          message: '系统 locale 缺失',
          severity: 'error',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '应用程序需要的 locale 未在系统中安装，导致字符编码或日期格式错误。',
          solution: '安装所需的 locale，或设置应用内 locale。',
          steps: [
            '查看系统可用 locale（locale -a）',
            '安装缺失的 locale（locale-gen）',
            '设置应用内 locale',
            '使用 UTF-8 编码'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_KERNEL_TOO_OLD',
          message: '系统内核版本过旧',
          severity: 'warning',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '应用程序需要较新的内核特性（如 cgroup v2、BPF、eBPF）。',
          solution: '升级内核到支持的版本。',
          steps: [
            '查看当前内核版本（uname -r）',
            '查看应用要求的最低内核版本',
            '升级内核',
            '重启系统'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_LIBRARY_MISSING',
          message: '系统库文件缺失',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '应用程序依赖的动态链接库（.so/.dll/.dylib）未找到。',
          solution: '安装缺失的库，或设置正确的库搜索路径。',
          steps: [
            '使用 ldd 查看缺失的库',
            '安装对应的开发包',
            '设置 LD_LIBRARY_PATH',
            '静态链接关键库'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_LIBRARY_VERSION_MISMATCH',
          message: '系统库版本不匹配',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '找到了库文件但版本不兼容（如需要 libssl 1.1 但系统只有 3.0）。',
          solution: '安装正确版本的库，或使用兼容层。',
          steps: [
            '查看库的版本要求',
            '安装正确版本的库',
            '使用符号链接兼容层',
            '静态链接以避免依赖'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_LIBRARY_SYMBOL_NOT_FOUND',
          message: '库符号未找到',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '库文件存在但缺少应用程序需要的符号（函数或变量）。',
          solution: '更新库到完整版本，或重新编译应用程序。',
          steps: [
            '使用 nm 或 objdump 查看符号',
            '更新库到完整版本',
            '重新编译应用程序',
            '检查是否有版本混淆'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_SELINUX_DENIED',
          message: 'SELinux 策略拒绝',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: 'SELinux 安全策略阻止了应用程序的某些操作（如访问文件、网络连接）。',
          solution: '调整 SELinux 策略，或临时设置为 permissive 模式排查。',
          steps: [
            '查看 audit.log 中的 SELinux 拒绝记录',
            '使用 audit2allow 生成策略',
            '临时设置为 permissive 模式测试',
            '应用新的 SELinux 策略'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_APPARMOR_DENIED',
          message: 'AppArmor 策略拒绝',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: 'AppArmor 安全策略阻止了应用程序的某些操作。',
          solution: '调整 AppArmor 配置文件，或临时禁用排查。',
          steps: [
            '查看 dmesg 中的 AppArmor 拒绝记录',
            '编辑 AppArmor 配置文件',
            '重新加载 AppArmor 策略',
            '临时禁用测试（aa-disable）'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_CAPABILITIES_INSUFFICIENT',
          message: 'Linux capabilities 不足',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '进程缺少执行某些操作所需的 capability（如 CAP_NET_BIND_SERVICE）。',
          solution: '为进程授予必要的 capabilities，或以 root 运行。',
          steps: [
            '查看需要的 capability',
            '使用 setcap 授予 capability',
            '或者在容器中以 privileged 运行',
            '最小权限原则，只授予必要的 capability'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_SECCOMP_VIOLATION',
          message: 'Seccomp 过滤器违规',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '进程尝试执行被 seccomp 过滤器禁止的系统调用。',
          solution: '更新 seccomp 配置文件允许必要的系统调用。',
          steps: [
            '查看被禁止的系统调用',
            '更新 seccomp 配置文件',
            '重新加载配置',
            '测试应用功能'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_NAMESPACES_UNAVAILABLE',
          message: 'Linux 命名空间不可用',
          severity: 'error',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '系统内核不支持某些命名空间（如 user namespace），影响容器运行。',
          solution: '升级内核，或启用命名空间支持。',
          steps: [
            '检查内核是否支持命名空间',
            '启用 user namespace（sysctl kernel.unprivileged_userns_clone）',
            '升级内核',
            '检查容器运行时的配置'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_CGROUPS_UNAVAILABLE',
          message: 'Linux cgroups 不可用',
          severity: 'error',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '系统未启用 cgroup，或挂载点不正确，影响资源限制。',
          solution: '启用并正确挂载 cgroup 文件系统。',
          steps: [
            '检查 /sys/fs/cgroup 挂载',
            '启用 cgroup 支持',
            '检查 systemd 是否正确初始化 cgroup',
            '修复 cgroup 挂载配置'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_OOM_KILLER_TRIGGERED',
          message: 'OOM Killer 被触发',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '系统内存不足，Linux OOM Killer 终止了某个进程。',
          solution: '增加内存，优化内存使用，或调整 OOM 分数。',
          steps: [
            '查看 dmesg 中的 OOM 日志',
            '找出被终止的进程',
            '优化该进程的内存使用',
            '增加物理内存或交换空间'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_WATCHDOG_TIMEOUT',
          message: '看门狗超时',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '系统或服务的看门狗定时器超时，触发重启。',
          solution: '检查服务健康状态，增加看门狗超时时间。',
          steps: [
            '查看看门狗日志',
            '检查服务的健康检查端点',
            '增加看门狗超时时间',
            '优化服务启动时间'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_HARDWARE_FAILURE',
          message: '系统硬件故障',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '硬件故障（如内存 ECC 错误、CPU 过热、磁盘坏道）。',
          solution: '检查硬件健康状态，更换故障部件。',
          steps: [
            '查看系统日志（dmesg/syslog）',
            '运行硬件诊断工具',
            '检查 CPU 温度',
            '更换故障硬件'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_VIRTUALIZATION_ERROR',
          message: '虚拟化层错误',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '虚拟机或容器运行时出错（如 KVM 错误、Docker 守护进程故障）。',
          solution: '重启虚拟化服务，或检查宿主机资源。',
          steps: [
            '重启虚拟化服务（docker/kvm）',
            '检查宿主机资源',
            '查看虚拟化日志',
            '迁移到健康的宿主机'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_CONTAINER_EXITED',
          message: '容器异常退出',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: 'Docker/Kubernetes 容器因错误退出（非零退出码）。',
          solution: '查看容器日志，修复导致退出的问题。',
          steps: [
            '查看容器日志（docker logs）',
            '检查退出码含义',
            '修复应用程序错误',
            '调整容器的资源限制'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_CONTAINER_OOM_KILLED',
          message: '容器因 OOM 被终止',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '容器使用的内存超过了其内存限制，被系统 OOM Killer 终止。',
          solution: '增加容器内存限制，或优化应用内存使用。',
          steps: [
            '查看容器内存限制',
            '增加 memory limit',
            '优化应用减少内存使用',
            '检查是否有内存泄漏'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_CONTAINER_IMAGE_PULL_FAILED',
          message: '容器镜像拉取失败',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '无法从镜像仓库拉取容器镜像（如网络问题、认证失败、镜像不存在）。',
          solution: '检查网络、认证和镜像标签。',
          steps: [
            '检查网络连通性',
            '确认镜像名称和标签正确',
            'docker login 重新认证',
            '检查镜像仓库状态'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_CONTAINER_VOLUME_MOUNT_FAILED',
          message: '容器卷挂载失败',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '无法将宿主机目录挂载到容器中（如目录不存在、权限不足、SELinux 阻止）。',
          solution: '确认目录存在且有权限，检查 SELinux/AppArmor。',
          steps: [
            '确认宿主机目录存在',
            '检查目录权限',
            '检查 SELinux/AppArmor 策略',
            '使用正确的挂载选项（:Z 或 :z）'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_CONTAINER_NETWORK_ERROR',
          message: '容器网络错误',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '容器无法访问网络（如网桥配置错误、IP 冲突、防火墙阻止）。',
          solution: '检查容器网络配置，重启 Docker 网络。',
          steps: [
            '检查 Docker 网络配置',
            '确认容器 IP 不冲突',
            '检查防火墙规则',
            '重启 Docker 守护进程'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_CONTAINER_HEALTH_CHECK_FAILED',
          message: '容器健康检查失败',
          severity: 'warning',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '容器的健康检查端点返回非健康状态。',
          solution: '检查应用健康状态，修复健康问题。',
          steps: [
            '查看健康检查端点实现',
            '检查应用是否真的不健康',
            '修复应用错误',
            '调整健康检查参数'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_KUBERNETES_POD_PENDING',
          message: 'Kubernetes Pod 处于 Pending 状态',
          severity: 'warning',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: 'Pod 无法调度到节点（如资源不足、节点亲和性不匹配、污点和容忍度冲突）。',
          solution: '检查调度原因，增加资源或调整调度策略。',
          steps: [
            '使用 kubectl describe pod 查看事件',
            '检查资源请求是否超过节点容量',
            '检查节点亲和性和污点容忍度',
            '增加节点或减小资源请求'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_KUBERNETES_POD_CRASH_LOOP',
          message: 'Kubernetes Pod 崩溃循环',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: 'Pod 不断启动后崩溃，可能是应用启动错误或依赖缺失。',
          solution: '查看 Pod 日志，修复启动错误。',
          steps: [
            '使用 kubectl logs 查看日志',
            '检查容器启动命令',
            '确认所有依赖已安装',
            '修复应用程序'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_KUBERNETES_POD_IMAGE_PULL_BACKOFF',
          message: 'Kubernetes 镜像拉取回退',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '无法拉取容器镜像，Kubelet 在重试间隔后再次尝试。',
          solution: '检查镜像名称、标签和仓库认证。',
          steps: [
            '确认镜像名称和标签正确',
            '检查 imagePullSecrets',
            '确认仓库可访问',
            '手动测试镜像拉取'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_KUBERNETES_POD_EVICTION',
          message: 'Kubernetes Pod 被驱逐',
          severity: 'warning',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '节点资源不足（如磁盘压力、内存压力），Kubelet 驱逐了 Pod。',
          solution: '增加节点资源，或降低 Pod 资源请求。',
          steps: [
            '查看节点状态（kubectl describe node）',
            '检查磁盘和内存压力',
            '增加节点资源',
            '设置合理的资源请求和限制'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_KUBERNETES_SERVICE_UNAVAILABLE',
          message: 'Kubernetes 服务不可用',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: 'Service 没有可用的后端 Pod（如所有 Pod 未就绪、selector 不匹配）。',
          solution: '检查 Service 配置和 Pod 状态。',
          steps: [
            '检查 Service 的 selector',
            '确认有 Pod 匹配 selector',
            '检查 Pod 是否处于 Ready 状态',
            '检查 Endpoints 对象'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_KUBERNETES_INGRESS_ERROR',
          message: 'Kubernetes Ingress 错误',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: 'Ingress 配置错误导致流量无法路由（如路径冲突、TLS 证书问题、后端服务不可用）。',
          solution: '检查 Ingress 规则和证书配置。',
          steps: [
            '检查 Ingress 规则语法',
            '确认 TLS 证书正确',
            '检查后端 Service 是否可用',
            '查看 Ingress Controller 日志'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_KUBERNETES_CONFIGMAP_MISSING',
          message: 'Kubernetes ConfigMap 缺失',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: 'Pod 引用的 ConfigMap 不存在，导致环境变量或卷挂载失败。',
          solution: '创建缺失的 ConfigMap，或修正引用名称。',
          steps: [
            '确认 ConfigMap 名称正确',
            '创建缺失的 ConfigMap',
            '检查命名空间是否正确',
            '验证 ConfigMap 数据'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_KUBERNETES_SECRET_MISSING',
          message: 'Kubernetes Secret 缺失',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: 'Pod 引用的 Secret 不存在，导致认证信息或 TLS 证书无法挂载。',
          solution: '创建缺失的 Secret，或修正引用名称。',
          steps: [
            '确认 Secret 名称正确',
            '创建缺失的 Secret',
            '检查 Secret 类型是否正确',
            '验证 Secret 数据编码（base64）'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_KUBERNETES_RESOURCE_QUOTA_EXCEEDED',
          message: 'Kubernetes 资源配额超限',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: 'Namespace 中的资源使用超过了 ResourceQuota 限制。',
          solution: '增加配额限制，或降低资源使用。',
          steps: [
            '查看当前配额使用情况',
            '增加 ResourceQuota',
            '减少 Pod 的资源请求',
            '删除不必要的资源'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_KUBERNETES_LIMIT_RANGE_VIOLATION',
          message: 'Kubernetes LimitRange 违规',
          severity: 'error',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: 'Pod 的资源配置违反了 LimitRange 的约束（如内存请求小于最小值）。',
          solution: '调整 Pod 资源配置以满足 LimitRange 要求。',
          steps: [
            '查看 LimitRange 配置',
            '调整 Pod 的 resources 字段',
            '确保请求和限制在允许范围内',
            '重新创建 Pod'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_KUBERNETES_NETWORK_POLICY_DENIED',
          message: 'Kubernetes 网络策略拒绝',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: 'NetworkPolicy 阻止了 Pod 之间的网络通信。',
          solution: '调整 NetworkPolicy 规则允许必要的通信。',
          steps: [
            '查看当前的 NetworkPolicy',
            '确认被阻止的源和目标 Pod',
            '添加允许规则',
            '测试网络连通性'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_KUBERNETES_PDB_VIOLATION',
          message: 'Kubernetes PDB 违规',
          severity: 'warning',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: '驱逐或缩容操作违反了 PodDisruptionBudget 的最小可用要求。',
          solution: '增加 PDB 的 minAvailable，或等待维护窗口。',
          steps: [
            '查看 PDB 配置',
            '确认当前可用 Pod 数量',
            '增加 minAvailable 或调整 maxUnavailable',
            '在维护窗口执行操作'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_KUBERNETES_HPA_ERROR',
          message: 'Kubernetes HPA 错误',
          severity: 'warning',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: 'HorizontalPodAutoscaler 无法正常工作（如指标不可用、扩缩容计算错误）。',
          solution: '检查指标服务器状态，确认 HPA 配置正确。',
          steps: [
            '查看 HPA 状态（kubectl describe hpa）',
            '确认 metrics-server 运行正常',
            '检查目标指标是否存在',
            '调整 HPA 的阈值和限制'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_KUBERNETES_VPA_ERROR',
          message: 'Kubernetes VPA 错误',
          severity: 'warning',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: 'VerticalPodAutoscaler 无法正常工作或建议不合理。',
          solution: '检查 VPA 配置，手动调整资源配置。',
          steps: [
            '查看 VPA 建议',
            '确认 VPA 模式（Off/Initial/Auto/Recreate）',
            '手动调整资源配置',
            '监控调整后的效果'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_KUBERNETES_CRONJOB_MISFIRE',
          message: 'Kubernetes CronJob 错过执行',
          severity: 'error',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: 'CronJob 因前一次执行未完成或资源不足而错过了执行时间。',
          solution: '调整 CronJob 调度，增加并发策略，或优化执行时间。',
          steps: [
            '查看 CronJob 的执行历史',
            '调整 startingDeadlineSeconds',
            '设置 concurrencyPolicy',
            '优化任务执行时间'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_KUBERNETES_JOB_FAILED',
          message: 'Kubernetes Job 执行失败',
          severity: 'error',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: 'Job 的 Pod 执行失败，未能完成任务。',
          solution: '查看 Job 日志，修复导致失败的问题。',
          steps: [
            '使用 kubectl logs 查看 Job Pod 日志',
            '检查 Job 的 backoffLimit',
            '修复应用错误',
            '重新创建 Job'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_KUBERNETES_StatefulSet_STUCK',
          message: 'Kubernetes StatefulSet 卡滞',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: 'StatefulSet 的某个 Pod 无法正常启动或更新（如存储卷问题、启动脚本错误）。',
          solution: '检查 StatefulSet 事件和 Pod 日志，修复存储或应用问题。',
          steps: [
            '使用 kubectl describe 查看事件',
            '检查 PVC 和 PV 状态',
            '查看 Pod 日志',
            '手动删除卡滞的 Pod 让控制器重建'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
        {
          code: 'SYSTEM_KUBERNETES_DAEMONSET_UNAVAILABLE',
          message: 'Kubernetes DaemonSet 不可用',
          severity: 'critical',
          category: 'F. 系统与权限',
          location: '页面：任意工具 → 区域：系统底层',
          cause: 'DaemonSet 未能在所有节点上运行 Pod（如节点污点、资源不足、镜像拉取失败）。',
          solution: '检查节点状态，确保所有节点满足 DaemonSet 的运行条件。',
          steps: [
            '查看 DaemonSet 状态',
            '检查节点污点和容忍度',
            '确认节点资源充足',
            '查看镜像拉取状态'
          ],
          prevention: '监控系统资源，设置合理限制，定期更新系统和库。',
        },
      ],
    },
    {
      id: '0',
      name: '0~9. HTTP 状态码',
      description: '按 HTTP 状态码分类的常见后端错误。',
      errors: [
        {
          code: '401_UNAUTHORIZED',
          message: '后端返回 401 Unauthorized',
          severity: 'critical',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：错误面板',
          cause: 'API Key 无效、过期、或被吊销。',
          solution: '更换有效的 API Key。',
          steps: [
            '打开「设置 → API」',
            '替换为新的有效 Key',
            '保存后重试',
          ],
          relatedCodes: ['API_KEY_EXPIRED', 'API_KEY_MISSING'],
          prevention: '定期检查 API Key 有效期；在设置面板中保存 Key 后记得点击「保存」。',
        },
        {
          code: '403_FORBIDDEN',
          message: '后端返回 403 Forbidden',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：错误面板',
          cause: '当前 API Key 无权访问请求的资源，或请求内容触发了平台的内容安全策略。',
          solution: '检查 Key 权限或修改请求内容。',
          steps: [
            '确认当前 Key 支持所选模型/服务',
            '如果提示内容策略违规，修改 Prompt 移除敏感词汇',
            '联系服务商确认账户状态',
          ],
          relatedCodes: ['API_KEY_EXPIRED', 'PROMPT_BLOCKED'],
          prevention: '确认当前 Key 支持所选模型/服务；Prompt 中避免使用敏感词汇。',
        },
        {
          code: '404_NOT_FOUND',
          message: '后端返回 404 Not Found',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：错误面板',
          cause: '请求的 API 端点不存在。可能是 URL 配置错误、模型 ID 错误、或后端路由已变更。',
          solution: '检查 URL 和模型配置。',
          steps: [
            '检查「设置 → API → API Base URL」是否正确',
            '检查模型 ID 是否拼写正确',
            '确认后端 API 版本是否匹配',
          ],
          relatedCodes: ['MODEL_NOT_FOUND', 'API_BASE_INVALID'],
          prevention: '确认 API Base URL 和模型 ID 拼写正确；后端 API 版本与前端匹配。',
        },
        {
          code: '429_TOO_MANY_REQUESTS',
          message: '后端返回 429 Too Many Requests',
          severity: 'warning',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：错误面板',
          cause: '短时间内发送了过多请求，超过了服务商的速率限制。',
          solution: '等待后重试。',
          steps: [
            '查看错误详情中的 Retry-After 提示',
            '等待 30~60 秒',
            '降低请求频率后重试',
          ],
          relatedCodes: ['API_RATE_LIMIT'],
        },
        {
          code: '100_CONTINUE_EXPECTED',
          message: '100 Continue — 客户端应继续发送请求体',
          severity: 'info',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '服务器已收到请求头，要求客户端继续发送请求体。',
          solution: '客户端应继续发送请求体，这是正常的 HTTP/1.1 行为。',
          steps: [
            '继续发送请求体',
            '确保请求头包含 Expect: 100-continue',
            '如果服务器返回最终状态码则停止发送'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '101_SWITCHING_PROTOCOLS',
          message: '101 Switching Protocols — 协议切换中',
          severity: 'info',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '服务器同意客户端切换到 Upgrade 头中指定的新协议（如 WebSocket）。',
          solution: '这是正常行为，连接将切换到新协议。',
          steps: [
            '确认 Upgrade 头已发送',
            '切换到新协议进行通信',
            'WebSocket 连接建立后发送帧数据'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '102_PROCESSING',
          message: '102 Processing — 服务器正在处理',
          severity: 'info',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: 'WebDAV 扩展状态码，表示服务器已收到请求并正在处理，防止客户端超时。',
          solution: '等待服务器完成处理，无需额外操作。',
          steps: [
            '保持连接等待',
            '不要重复发送请求',
            '如果长时间无响应，检查服务器状态'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '103_EARLY_HINTS',
          message: '103 Early Hints — 预加载提示',
          severity: 'info',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '服务器提前发送资源提示（如 Link 头），让浏览器开始预加载。',
          solution: '浏览器会自动处理预加载，无需应用层处理。',
          steps: [
            '浏览器会自动预加载 Link 头中的资源',
            '应用层无需特殊处理',
            '注意 103 响应后还会有最终响应'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '201_CREATED',
          message: '201 Created — 资源创建成功',
          severity: 'info',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '请求成功并在服务器上创建了新资源（如 POST 请求创建记录）。',
          solution: '这是成功状态，处理返回的新资源信息。',
          steps: [
            '提取响应中的新资源 ID 或 URI',
            '更新本地状态',
            '如果不需要后续操作则完成'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '202_ACCEPTED',
          message: '202 Accepted — 请求已接受但未完成',
          severity: 'info',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '请求已被接受用于处理，但处理尚未完成（如异步任务）。',
          solution: '轮询状态端点或等待回调通知处理完成。',
          steps: [
            '记录返回的任务 ID',
            '轮询状态端点检查进度',
            '或等待 Webhook 回调通知',
            '处理最终结果'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '203_NON_AUTHORITATIVE_INFORMATION',
          message: '203 Non-Authoritative Information — 非权威信息',
          severity: 'info',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '返回的元信息来自本地或第三方副本，不是原始服务器的权威响应。',
          solution: '通常可正常处理，但对缓存内容需谨慎。',
          steps: [
            '正常处理响应数据',
            '注意数据可能不是最新',
            '如需最新数据可绕过缓存直接请求'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '204_NO_CONTENT',
          message: '204 No Content — 无内容',
          severity: 'info',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '服务器成功处理了请求，但不需要返回任何内容（如 DELETE 成功）。',
          solution: '这是成功状态，无需特殊处理。',
          steps: [
            '确认操作成功',
            '不需要解析响应体',
            '更新本地 UI 状态'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '205_RESET_CONTENT',
          message: '205 Reset Content — 重置内容',
          severity: 'info',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '服务器成功处理了请求，要求客户端重置文档视图（如表单提交成功后清空表单）。',
          solution: '清空表单或重置视图到初始状态。',
          steps: [
            '清空表单字段',
            '重置视图到初始状态',
            '显示成功提示'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '206_PARTIAL_CONTENT',
          message: '206 Partial Content — 部分内容',
          severity: 'info',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '服务器成功返回了 Range 请求指定的部分内容（如断点续传）。',
          solution: '将部分内容合并到完整文件中，继续请求剩余部分。',
          steps: [
            '保存返回的部分内容',
            '计算下一个 Range 范围',
            '继续请求剩余部分',
            '合并所有部分为完整文件'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '207_MULTI_STATUS',
          message: '207 Multi-Status — 多状态',
          severity: 'info',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: 'WebDAV 扩展，响应体包含多个资源的状态信息。',
          solution: '解析响应体中的每个资源状态，分别处理。',
          steps: [
            '解析 XML/JSON 响应体',
            '提取每个资源的状态码',
            '分别处理成功和失败的资源',
            '记录所有状态'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '208_ALREADY_REPORTED',
          message: '208 Already Reported — 已报告',
          severity: 'info',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: 'WebDAV 扩展，集合的成员已在先前的响应中枚举，不再重复包含。',
          solution: '这是 DAV 协议优化，无需应用层处理。',
          steps: [
            '正常处理响应',
            '注意部分成员可能已在之前的响应中提供'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '226_IM_USED',
          message: '226 IM Used — 增量处理已应用',
          severity: 'info',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '服务器已成功处理了对资源的增量修改请求（Delta encoding）。',
          solution: '将增量修改应用到本地副本。',
          steps: [
            '解析增量修改内容',
            '应用到本地资源',
            '验证应用后的结果'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '300_MULTIPLE_CHOICES',
          message: '300 Multiple Choices — 多个选择',
          severity: 'info',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '请求有多个可能的响应，服务器提供了选项列表。',
          solution: '根据业务逻辑选择最合适的选项，或默认选择第一个。',
          steps: [
            '查看所有可用选项',
            '根据用户偏好或业务规则选择',
            '如果没有明确偏好，选择默认选项'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '301_MOVED_PERMANENTLY',
          message: '301 Moved Permanently — 永久重定向',
          severity: 'warning',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '请求的资源已永久移动到新的 URL。',
          solution: '更新所有引用到新的 URL，后续请求直接使用新地址。',
          steps: [
            '提取响应头 Location 中的新 URL',
            '更新书签、配置和代码中的旧 URL',
            '后续请求直接使用新 URL',
            '注意 POST 请求重定向后可能变为 GET'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '302_FOUND',
          message: '302 Found — 临时重定向',
          severity: 'warning',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '请求的资源临时位于不同的 URL。',
          solution: '继续使用原 URL 发起请求，但本次跟随重定向。',
          steps: [
            '跟随 Location 头中的临时 URL',
            '不要更新永久书签',
            '继续监视原 URL',
            '注意 POST 可能变为 GET'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '303_SEE_OTHER',
          message: '303 See Other — 查看其他位置',
          severity: 'info',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '请求的处理结果位于另一个 URL，客户端应使用 GET 访问该 URL。',
          solution: '使用 GET 方法访问 Location 头指定的 URL。',
          steps: [
            '使用 GET 方法访问 Location URL',
            '不要重复提交 POST 数据',
            '显示处理结果'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '304_NOT_MODIFIED',
          message: '304 Not Modified — 未修改',
          severity: 'info',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '条件请求（If-Modified-Since/If-None-Match）表明资源未发生变化。',
          solution: '使用本地缓存的副本，无需重新下载。',
          steps: [
            '使用本地缓存的响应',
            '更新缓存的过期时间',
            '不需要解析响应体'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '305_USE_PROXY',
          message: '305 Use Proxy — 使用代理（已弃用）',
          severity: 'warning',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '响应要求通过指定的代理访问资源（此状态码因安全问题已弃用）。',
          solution: '现代浏览器忽略此状态码，考虑使用 307/308 替代。',
          steps: [
            '现代应用应忽略此状态码',
            '如需代理，在应用层配置',
            '使用 HTTPS 避免中间人代理'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '307_TEMPORARY_REDIRECT',
          message: '307 Temporary Redirect — 临时重定向（保持方法）',
          severity: 'warning',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '请求的资源临时位于不同的 URL，但请求方法保持不变。',
          solution: '使用相同的方法重定向到新的 URL。',
          steps: [
            '使用相同请求方法访问 Location URL',
            '不要更新永久书签',
            '继续监视原 URL'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '308_PERMANENT_REDIRECT',
          message: '308 Permanent Redirect — 永久重定向（保持方法）',
          severity: 'warning',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '请求的资源永久移动到新的 URL，请求方法保持不变。',
          solution: '更新引用到新的 URL，使用相同的方法访问。',
          steps: [
            '提取 Location 头中的新 URL',
            '更新永久引用',
            '使用相同请求方法访问新 URL'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '400_BAD_REQUEST_BODY',
          message: '400 Bad Request — 请求体格式错误',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '请求体的 JSON/XML 格式不正确，或缺少必填字段。',
          solution: '检查请求体格式，确保符合 API 文档要求。',
          steps: [
            '验证请求体是否为有效的 JSON/XML',
            '检查所有必填字段是否存在',
            '确认字段类型正确',
            '参考 API 文档的示例请求'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '401_TOKEN_EXPIRED',
          message: '401 Unauthorized — Token 已过期',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '认证令牌（Token）已过期，需要刷新或重新获取。',
          solution: '使用刷新令牌获取新的访问令牌，或重新登录。',
          steps: [
            '检查令牌的过期时间',
            '使用 refresh_token 刷新',
            '如果 refresh_token 也过期，重新登录',
            '更新存储的令牌'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '402_PAYMENT_REQUIRED',
          message: '402 Payment Required — 需要付款',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '需要付费才能访问该资源（预留状态码，部分 API 使用）。',
          solution: '完成付款流程，或升级订阅。',
          steps: [
            '查看付款页面',
            '完成付款或升级订阅',
            '确认付款状态已同步',
            '重试请求'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '403_RESOURCE_FORBIDDEN',
          message: '403 Forbidden — 资源访问被禁止',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '服务器理解请求但拒绝执行，通常因为权限不足（不同于 401）。',
          solution: '检查用户权限，或联系管理员授予访问权限。',
          steps: [
            '确认当前用户身份',
            '检查用户是否有该资源的访问权限',
            '联系管理员授予权限',
            '如果是 IP 限制，检查源 IP'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '404_RESOURCE_NOT_FOUND',
          message: '404 Not Found — 资源不存在',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '请求的资源在服务器上不存在，或 URL 路径错误。',
          solution: '检查 URL 路径，确认资源是否存在。',
          steps: [
            '检查 URL 路径拼写',
            '确认资源 ID 是否正确',
            '如果资源已被删除，从数据库移除引用',
            '检查路由配置'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '405_METHOD_NOT_ALLOWED',
          message: '405 Method Not Allowed — 方法不允许',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: 'URL 存在，但请求的方法（GET/POST/PUT/DELETE）不被支持。',
          solution: '使用 API 文档中指定的正确方法。',
          steps: [
            '查看 API 文档支持的方法',
            '使用正确的方法重试',
            '检查 Allow 响应头中的允许方法'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '406_NOT_ACCEPTABLE',
          message: '406 Not Acceptable — 不可接受的内容类型',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '服务器无法生成客户端 Accept 头中指定的内容类型。',
          solution: '修改 Accept 头，使用服务器支持的内容类型。',
          steps: [
            '查看服务器支持的内容类型',
            '修改 Accept 头',
            '或使用通配符 Accept: */*'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '407_PROXY_AUTH_REQUIRED',
          message: '407 Proxy Authentication Required — 代理需要认证',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '需要通过代理服务器进行认证。',
          solution: '在请求头或代理配置中提供认证信息。',
          steps: [
            '配置代理认证用户名和密码',
            '在请求头中添加 Proxy-Authorization',
            '检查代理服务器配置'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '408_REQUEST_TIMEOUT',
          message: '408 Request Timeout — 请求超时',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '服务器等待客户端发送请求的时间过长。',
          solution: '检查网络连接，重新发送请求。',
          steps: [
            '检查网络连接',
            '增加客户端发送超时',
            '重新发送请求',
            '如果频繁出现，检查网络稳定性'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '409_CONFLICT_STATE',
          message: '409 Conflict — 资源状态冲突',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '请求与资源的当前状态冲突（如并发修改、唯一约束冲突）。',
          solution: '获取最新资源状态，解决冲突后重试。',
          steps: [
            '获取资源的最新状态',
            '解决冲突（合并更改或放弃）',
            '使用条件请求（If-Match）避免冲突',
            '重试请求'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '410_GONE',
          message: '410 Gone — 资源已永久删除',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '请求的资源已永久删除，且不会再次可用。',
          solution: '从客户端移除对该资源的引用，不再请求。',
          steps: [
            '从客户端移除资源引用',
            '更新 UI 不再显示该资源',
            '如果资源只是迁移，查找新位置'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '411_LENGTH_REQUIRED',
          message: '411 Length Required — 需要 Content-Length',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '服务器要求请求必须包含 Content-Length 头。',
          solution: '添加 Content-Length 头，或使用分块传输。',
          steps: [
            '计算请求体大小',
            '添加 Content-Length 头',
            '或使用 Transfer-Encoding: chunked'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '412_PRECONDITION_FAILED',
          message: '412 Precondition Failed — 前置条件失败',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '条件请求（If-Match/If-Unmodified-Since）中的条件不满足。',
          solution: '获取最新资源状态，更新条件后重试。',
          steps: [
            '获取资源的最新 ETag 或修改时间',
            '更新条件请求头',
            '重试请求'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '413_PAYLOAD_TOO_LARGE',
          message: '413 Payload Too Large — 请求体过大',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '请求体大小超过了服务器的限制。',
          solution: '减小请求体大小，或使用分片上传。',
          steps: [
            '减小请求体大小',
            '压缩数据',
            '使用分片上传',
            '联系管理员增加限制'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '414_URI_TOO_LONG',
          message: '414 URI Too Long — URI 过长',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '请求的 URI 超过了服务器能处理的最大长度。',
          solution: '使用 POST 请求体传递参数，缩短 URI。',
          steps: [
            '将参数移到 POST body',
            '使用表单或 JSON 传递数据',
            '缩短 URI 路径'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '415_UNSUPPORTED_MEDIA_TYPE',
          message: '415 Unsupported Media Type — 不支持的媒体类型',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '请求体的 Content-Type 不被服务器支持。',
          solution: '使用服务器支持的 Content-Type。',
          steps: [
            '查看 API 文档支持的 Content-Type',
            '将数据转换为支持的格式',
            '常见格式：application/json、multipart/form-data'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '416_RANGE_NOT_SATISFIABLE',
          message: '416 Range Not Satisfiable — 范围不可满足',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '请求的 Range 头指定的范围无效或超出资源大小。',
          solution: '检查资源大小，使用有效的范围。',
          steps: [
            '获取资源的完整大小（HEAD 请求）',
            '使用有效的字节范围',
            '或使用完整的资源请求'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '417_EXPECTATION_FAILED',
          message: '417 Expectation Failed — 预期失败',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '服务器无法满足 Expect 请求头中的要求。',
          solution: '移除 Expect 头，或修改预期条件。',
          steps: [
            '移除 Expect: 100-continue 头',
            '检查服务器是否支持该预期',
            '直接发送请求体'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '418_IM_A_TEAPOT',
          message: '418 I am a teapot — 我是茶壶（彩蛋）',
          severity: 'info',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: 'RFC 2324 定义的彩蛋状态码，表示服务器拒绝煮咖啡因为它是个茶壶。',
          solution: '这是一个玩笑状态码，不需要处理。',
          steps: [
            '这是 RFC 2324 的彩蛋',
            '无需处理',
            '在应用中可以显示有趣的提示'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '421_MISDIRECTED_REQUEST',
          message: '421 Misdirected Request — 请求定向错误',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '请求被发送到了无法生成响应的服务器（如 TLS 证书不匹配的主机）。',
          solution: '检查请求的目标主机，确保与 TLS 证书匹配。',
          steps: [
            '检查 Host 头是否正确',
            '确认 TLS 证书覆盖该域名',
            '使用正确的域名访问'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '422_UNPROCESSABLE_ENTITY',
          message: '422 Unprocessable Entity — 无法处理的实体',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '请求格式正确但语义错误（如验证失败、业务规则冲突）。',
          solution: '根据错误详情修正请求内容。',
          steps: [
            '查看详细的验证错误信息',
            '修正请求中的错误字段',
            '确保数据满足业务规则',
            '重试请求'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '423_LOCKED',
          message: '423 Locked — 资源已锁定',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '资源当前被锁定，无法修改（WebDAV）。',
          solution: '等待资源解锁，或联系锁定者释放锁。',
          steps: [
            '等待资源解锁',
            '联系锁定者释放锁',
            '检查锁的超时时间',
            '或者放弃修改'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '424_FAILED_DEPENDENCY',
          message: '424 Failed Dependency — 依赖失败',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '当前请求依赖于另一个请求，而那个请求失败了（WebDAV）。',
          solution: '先修复依赖请求的失败原因，然后重试。',
          steps: [
            '识别失败的依赖请求',
            '修复依赖请求的问题',
            '重试当前请求'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '425_TOO_EARLY',
          message: '425 Too Early — 过早请求',
          severity: 'warning',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '服务器不愿意冒险处理可能被重放的请求（早期数据）。',
          solution: '重试请求，不使用早期数据。',
          steps: [
            '不使用 0-RTT 早期数据',
            '正常 TLS 握手后重试',
            '更新客户端避免早期数据'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '426_UPGRADE_REQUIRED',
          message: '426 Upgrade Required — 需要升级协议',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '服务器拒绝使用当前协议执行请求，要求升级到指定协议（如 TLS 1.3）。',
          solution: '升级到服务器要求的协议版本。',
          steps: [
            '查看 Upgrade 头中的要求',
            '升级客户端协议版本',
            '重新连接'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '428_PRECONDITION_REQUIRED',
          message: '428 Precondition Required — 需要前置条件',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '服务器要求条件请求（如 If-Match）以防止丢失更新。',
          solution: '添加条件请求头，使用资源的最新状态。',
          steps: [
            '获取资源的最新 ETag',
            '添加 If-Match 头',
            '重试请求'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '429_RATE_LIMITED',
          message: '429 Too Many Requests — 请求过于频繁',
          severity: 'warning',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '客户端在短时间内发送了过多请求，触发了速率限制。',
          solution: '降低请求频率，查看 Retry-After 头，稍后重试。',
          steps: [
            '查看响应头中的 Retry-After',
            '等待指定时间后重试',
            '降低请求频率',
            '实现客户端速率限制'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '431_REQUEST_HEADER_FIELDS_TOO_LARGE',
          message: '431 Request Header Fields Too Large — 请求头字段过大',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '请求头整体或单个字段过大，服务器拒绝处理。',
          solution: '减小请求头大小，移除不必要的头字段。',
          steps: [
            '移除不必要的自定义头',
            '减小 Cookie 大小',
            '使用 POST body 传递大数据'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '451_UNAVAILABLE_FOR_LEGAL_REASONS',
          message: '451 Unavailable For Legal Reasons — 因法律原因不可用',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '由于法律限制（如版权、政府审查），服务器拒绝提供资源。',
          solution: '资源因法律原因无法访问，寻找替代资源。',
          steps: [
            '了解具体的法律限制',
            '寻找合法的替代资源',
            '联系内容提供者'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '500_INTERNAL_SERVER_ERROR_DETAIL',
          message: '500 Internal Server Error — 服务器内部错误详情',
          severity: 'critical',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '服务器遇到意外情况，无法完成请求（如未捕获异常、数据库连接丢失）。',
          solution: '查看服务器日志定位错误，联系管理员修复。',
          steps: [
            '查看服务器错误日志',
            '检查最近的代码部署',
            '确认数据库和依赖服务正常',
            '联系管理员或开发团队'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '501_NOT_IMPLEMENTED_DETAIL',
          message: '501 Not Implemented — 功能未实现详情',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '服务器不具备完成请求所需的功能（如不支持该方法或协议版本）。',
          solution: '使用服务器支持的功能，或升级服务器。',
          steps: [
            '查看 API 文档确认功能是否支持',
            '使用替代方法实现',
            '联系服务商确认功能路线图'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '502_BAD_GATEWAY_DETAIL',
          message: '502 Bad Gateway — 网关错误详情',
          severity: 'critical',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '网关或代理从上游服务器收到了无效响应（如上游崩溃、返回 HTML 错误页）。',
          solution: '检查上游服务器状态，确认网关配置正确。',
          steps: [
            '检查上游服务器是否运行',
            '查看网关日志',
            '确认网关到上游的网络连通',
            '重启上游服务'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '503_SERVICE_UNAVAILABLE_DETAIL',
          message: '503 Service Unavailable — 服务不可用详情',
          severity: 'critical',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '服务器暂时过载或维护中，无法处理请求。',
          solution: '查看 Retry-After 头，稍后重试，或联系管理员。',
          steps: [
            '查看 Retry-After 头',
            '等待指定时间后重试',
            '检查服务状态页面',
            '联系管理员确认维护计划'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '504_GATEWAY_TIMEOUT_DETAIL',
          message: '504 Gateway Timeout — 网关超时详情',
          severity: 'critical',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '网关在等待上游服务器响应时超时（上游处理过慢或不可达）。',
          solution: '检查上游服务器性能，增加超时时间，或优化上游处理。',
          steps: [
            '检查上游服务器是否运行',
            '查看上游处理时间',
            '增加网关超时设置',
            '优化上游处理逻辑'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '505_HTTP_VERSION_NOT_SUPPORTED',
          message: '505 HTTP Version Not Supported — 不支持的 HTTP 版本',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '服务器不支持请求中使用的 HTTP 协议版本。',
          solution: '使用服务器支持的 HTTP 版本（通常为 1.1 或 2.0）。',
          steps: [
            '使用 HTTP/1.1 重试',
            '检查服务器支持的版本',
            '更新客户端协议版本'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '506_VARIANT_ALSO_NEGOTIATES',
          message: '506 Variant Also Negototiates — 变体也参与协商',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '服务器配置错误，导致透明内容协商循环（RFC 2295）。',
          solution: '修复服务器的内容协商配置。',
          steps: [
            '检查内容协商配置',
            '修复循环引用',
            '禁用透明内容协商'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '507_INSUFFICIENT_STORAGE',
          message: '507 Insufficient Storage — 存储空间不足',
          severity: 'critical',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '服务器无法存储完成请求所需的表示（WebDAV）。',
          solution: '清理服务器存储空间，或增加存储容量。',
          steps: [
            '检查服务器磁盘空间',
            '清理日志和临时文件',
            '增加存储容量',
            '联系管理员'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '508_LOOP_DETECTED',
          message: '508 Loop Detected — 检测到循环',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '服务器在处理请求时检测到无限循环（WebDAV）。',
          solution: '检查请求中的循环引用，修复配置。',
          steps: [
            '检查请求中的递归引用',
            '修复循环配置',
            '限制递归深度'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '510_NOT_EXTENDED',
          message: '510 Not Extended — 未扩展',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '请求需要服务器扩展才能满足（RFC 2774，已很少使用）。',
          solution: '使用标准请求，或寻找支持该扩展的服务器。',
          steps: [
            '简化请求为标准格式',
            '不使用扩展头',
            '寻找替代方案'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '511_NETWORK_AUTH_REQUIRED',
          message: '511 Network Authentication Required — 需要网络认证',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
          cause: '客户端需要先通过网络的认证（如 captive portal 登录页面）。',
          solution: '打开浏览器完成网络认证，然后重试。',
          steps: [
            '打开浏览器访问任意网页',
            '完成 captive portal 认证',
            '或者联系网络管理员',
            '重试请求'
          ],
          prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。',
        },
        {
          code: '500_INTERNAL_ERROR',
          message: '后端返回 500 Internal Server Error',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：错误面板',
          cause: '后端服务在处理请求时发生内部异常。可能是模型加载失败、GPU 内存不足、或代码 Bug。',
          solution: '稍后重试或联系后端管理员。',
          steps: [
            '等待 1~2 分钟后重试',
            '降低请求规模（图像尺寸、Max Tokens 等）',
            '如果问题持续，联系后端管理员查看服务器日志',
          ],
          relatedCodes: ['502_BAD_GATEWAY', '503_SERVICE_UNAVAILABLE'],
          prevention: '降低请求规模（图像尺寸、Max Tokens 等）；避免在服务器高负载时提交大任务。',
        },
        {
          code: '502_BAD_GATEWAY',
          message: '后端返回 502 Bad Gateway',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：错误面板',
          cause: '反向代理无法连接到后端应用服务器。可能是后端进程崩溃或未启动。',
          solution: '检查后端服务状态。',
          steps: [
            '如果是本地部署，确认后端进程是否在运行',
            '检查后端服务端口是否被占用',
            '查看后端日志确认是否有启动错误',
            '重启后端服务后重试',
          ],
          relatedCodes: ['503_SERVICE_UNAVAILABLE', 'BACKEND_UNAVAILABLE'],
          prevention: '本地部署时确认后端进程在运行；检查反向代理配置。',
        },
        {
          code: '503_SERVICE_UNAVAILABLE',
          message: '后端返回 503 Service Unavailable',
          severity: 'error',
          category: '0~9. HTTP 状态码',
          location: '页面：任意需联网工具 → 区域：错误面板',
          cause: '后端服务暂时不可用，可能正在进行维护、重启、或过载保护。',
          solution: '稍后重试。',
          steps: [
            '等待 2~3 分钟后重试',
            '检查后端服务状态页面（如果有）',
            '联系后端管理员确认是否在维护',
          ],
          relatedCodes: ['502_BAD_GATEWAY', 'BACKEND_UNAVAILABLE'],
          prevention: '避开服务器维护时段操作；高负载时降低请求频率。',
        },
      {
        code: '404_ENDPOINT_REMOVED',
        message: 'API 端点已移除（404）',
        severity: 'error',
        category: '0~9. HTTP 状态码',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '访问的 API 路径在最新版本中已被删除或更名。',
        solution: '查阅 API 变更日志，使用新的端点。',
        steps: [
          '查阅 API 版本变更日志',
          '确认端点是否被更名',
          '升级到支持该端点的 API 版本',
          '修改代码使用新的端点路径',
        ],
        prevention: '关注 API 版本更新公告，使用版本化 API 路径。',
      },
      {
        code: '409_RESOURCE_CONFLICT',
        message: '资源冲突（409）',
        severity: 'error',
        category: '0~9. HTTP 状态码',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '请求与资源的当前状态冲突，如并发修改同一资源。',
        solution: '获取最新资源状态后重试，或实现乐观锁。',
        steps: [
          '重新获取资源的最新状态',
          '合并冲突的修改',
          '使用 If-Match 头实现乐观锁',
          '重试请求',
        ],
        prevention: '使用乐观锁或悲观锁避免并发冲突。',
      },
      {
        code: '410_RESOURCE_GONE',
        message: '资源已永久删除（410）',
        severity: 'error',
        category: '0~9. HTTP 状态码',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '请求的资源已被永久删除，且不会恢复。',
        solution: '停止请求该资源，更新引用指向新资源。',
        steps: [
          '确认资源是否被永久删除',
          '查找替代资源',
          '更新所有引用该资源的地方',
          '通知用户资源不可用',
        ],
        prevention: '资源删除时提供迁移指南和替代方案。',
      },
      {
        code: '422_VALIDATION_ERROR',
        message: '请求语义错误（422）',
        severity: 'error',
        category: '0~9. HTTP 状态码',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '请求格式正确，但内容语义不满足业务规则。',
        solution: '根据错误提示修正请求内容。',
        steps: [
          '查看响应体中的详细验证错误',
          '修正不符合规则的字段值',
          '确认业务规则的约束条件',
          '重新发送请求',
        ],
        prevention: '客户端在提交前进行完整的业务规则验证。',
      },
      {
        code: '423_RESOURCE_LOCKED',
        message: '资源被锁定（423）',
        severity: 'warning',
        category: '0~9. HTTP 状态码',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '资源当前被其他操作锁定，暂时无法访问。',
        solution: '等待锁释放后重试，或强制释放锁。',
        steps: [
          '检查资源的锁定状态',
          '等待锁定操作完成',
          '如果锁已超时则强制释放',
          '重试请求',
        ],
        prevention: '设置合理的锁超时时间，提供锁状态查询接口。',
      },
      {
        code: '429_RETRY_AFTER_MISSING',
        message: '429 响应缺少 Retry-After 头',
        severity: 'warning',
        category: '0~9. HTTP 状态码',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '服务器返回 429 但没有提供 Retry-After 时间。',
        solution: '使用指数退避策略等待后重试。',
        steps: [
          '实现指数退避重试策略',
          '首次等待 1 秒',
          '每次失败后等待时间翻倍',
          '设置最大等待时间上限',
        ],
        prevention: '客户端实现智能退避重试机制。',
      },
      {
        code: '504_GATEWAY_TIMEOUT',
        message: '网关超时（504）',
        severity: 'error',
        category: '0~9. HTTP 状态码',
        location: '页面：任意工具 → 区域：错误面板',
        cause: '网关或代理在等待上游服务器响应时超时。',
        solution: '检查上游服务状态，增加超时时间。',
        steps: [
          '检查上游服务的健康状态',
          '增加网关的超时配置',
          '优化上游服务的响应时间',
          '检查上游服务是否过载',
        ],
        prevention: '合理配置各层超时，上游服务提供健康检查端点。',
      },
      ],
    },
  ],
};
