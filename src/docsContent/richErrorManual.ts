import type { DocsContent, DocsErrorCategory, DocsErrorItem } from './types';

type ErrorPatchMap = Record<string, Partial<DocsErrorItem>>;

function mergeUnique(base: string[] | undefined, extra: string[] | undefined): string[] | undefined {
  if (!base?.length && !extra?.length) return undefined;
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of [...(base ?? []), ...(extra ?? [])]) {
    const normalized = item.trim();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(item);
  }
  return result;
}

function mergeErrorPatch(error: DocsErrorItem, patch: Partial<DocsErrorItem> | undefined): DocsErrorItem {
  if (!patch) return error;
  return {
    ...error,
    cause: patch.cause ? `${error.cause}\n${patch.cause}` : error.cause,
    solution: patch.solution ? `${error.solution}\n${patch.solution}` : error.solution,
    steps: mergeUnique(error.steps, patch.steps),
    relatedCodes: mergeUnique(error.relatedCodes, patch.relatedCodes),
    prevention: patch.prevention ? `${error.prevention ? `${error.prevention}\n` : ''}${patch.prevention}` : error.prevention,
    detailBlocks: [...(error.detailBlocks ?? []), ...(patch.detailBlocks ?? [])],
  };
}

function patchCategory(category: DocsErrorCategory, patches: ErrorPatchMap): DocsErrorCategory {
  return {
    ...category,
    errors: category.errors.map((error) => mergeErrorPatch(error, patches[error.code])),
  };
}

function patchToolErrors(content: DocsContent, patches: ErrorPatchMap): DocsContent {
  return {
    ...content,
    tools: content.tools.map((tool) => ({
      ...tool,
      errors: tool.errors.map((error) => mergeErrorPatch(error, patches[error.code])),
    })),
    errorDictionary: content.errorDictionary.map((category) => patchCategory(category, patches)),
  };
}

const zhSharedPatches: ErrorPatchMap = {
  API_KEY_MISSING: {
    solution: '不要只检查前端设置框，还要确认后端实际读取到的环境变量。Paper2Gal、转画风和 LLM Hub 的错误来源不同：前端自定义 API Key 只会发给自定义通道；内置 Plato 通道依赖后端 .env 或部署平台环境变量中的 PLATO_API_KEY。',
    steps: [
      '确认当前是「内置模式」还是「自定义 API」模式：内置模式检查后端 PLATO_API_KEY，自定义模式检查设置面板里的 API Key。',
      '打开 /api/health，确认你连接的是正确后端，而不是 Vite 或静态页面的 SPA fallback。',
      '本地开发时重启后端进程；环境变量只在进程启动时读取，修改 .env 后不重启不会生效。',
      '云部署时检查平台变量是否配置在 Web Service 上，而不是配置在构建任务、数据库或其他服务上。',
    ],
    detailBlocks: [
      {
        title: '应当收集的信息',
        items: [
          '当前页面：转画风、Paper2Gal、LLM Hub 或 TTS。',
          '当前接口模式：内置模式 / 自定义 API / GitHub Pages 或 OSS 静态部署。',
          '错误面板里的完整 JSON，尤其是 details.code、details.status_code、provider、route、workflow_id。',
          '后端启动日志中是否出现 PLATO_API_KEY is not set、provider will fail、CORS origin 等提示。',
        ],
      },
    ],
  },
  BACKEND_UNAVAILABLE: {
    solution: '优先区分“前端找错地址”和“后端真的挂了”。很多 502/404 看起来像模型错误，实际是 API Base URL 指到了 /v1/chat/completions、GitHub Pages 静态站、Vite 前端端口，或 Zeabur 容器健康检查失败。',
    steps: [
      '在浏览器直接打开 API Base URL + /api/health，正确结果应该是 JSON：{"status":"ok"}。',
      '如果看到的是 HTML、首页、404 静态文件或 GitHub Pages 页面，说明 API Base URL 配错。',
      '本地开发优先检查后端端口：项目默认后端是 8080，旧脚本或文档可能仍提到 3001。',
      '如果 Zeabur 返回 502，先看 Runtime Logs，而不是只看浏览器错误；502 多数发生在进程未监听 PORT、构建产物缺失或健康检查失败。',
    ],
    detailBlocks: [
      {
        title: '快速判断表',
        items: [
          '访问 /api/health 返回 JSON：后端在线，继续查具体接口、Key 或模型。',
          '访问 /api/health 返回 HTML：你打到了前端静态站或 Vite fallback。',
          '访问 /api/health 连接被拒绝：后端进程没启动、端口不对或防火墙阻止。',
          '访问 /api/health 返回 502/503：云平台网关能到服务，但服务未健康运行。',
        ],
      },
    ],
  },
  STYLE_TRANSFER_REQUEST_FAILED: {
    solution: '把错误按 HTTP 状态码拆开处理，不要笼统重试。401 查 Key，404 查模型和接口路径，413 查文件大小，429 查限流，500/502/503 查后端和上游模型服务，AbortError 或 TimeoutError 查超时与网络。',
    detailBlocks: [
      {
        title: '状态码含义',
        items: [
          '400：请求体格式或参数错误，重点检查 prompt、model、image 字段是否为空或类型错误。',
          '401/403：认证失败或权限不足，重点检查 API Key、模型权限、服务商账号状态。',
          '404：模型不存在、接口路径不对，或 API Base URL 写到了具体模型端点。',
          '413：上传图片或请求体过大，压缩图片后再试。',
          '429：达到模型服务商限流或余额策略，降低并发、等待冷却或换 Key。',
          '500/502/503：后端或上游服务异常，查看后端日志里的 upstream status、traceid、fallback_code。',
        ],
      },
      {
        title: '建议复制给开发者的内容',
        items: [
          '错误面板完整 JSON。',
          'Network 面板中失败请求的 URL、Status、Response body。',
          '上传图片格式、大小、分辨率。',
          '当前模型名、Prompt 前 300 字、Negative Prompt 前 300 字。',
        ],
      },
    ],
  },
  P2G_WORKFLOW_ERROR: {
    solution: 'Paper2Gal 是多步骤工作流，不能只看总错误。要定位失败的是 validate_input、analyze_character、expression_thinking、expression_surprise、expression_angry、cutout_expression_*、cg_01 还是 cg_02。',
    steps: [
      '在错误面板里展开 details，找到 latest_step_error、workflow_error、current_step 和 failed_steps。',
      '打开工作流详情接口：/api/workflows/{workflow_id}，查看每个 steps.*.status。',
      '如果只有 cutout_expression_* 失败，通常不是角色生成失败，而是浏览器抠图或服务端 fallback 抠图失败。',
      '如果 expression_* 全失败，多半是图像编辑模型、Key、内容策略或上游接口问题。',
      '如果 cg_01/cg_02 失败但表情成功，说明角色基础理解和表情生成可用，问题集中在 CG prompt 或模型生成。',
    ],
    detailBlocks: [
      {
        title: '工作流步骤对照',
        items: [
          'validate_input：检查上传文件、格式、大小、尺寸。',
          'analyze_character：根据图片尺寸和文件名建立角色基础 profile。',
          'expression_thinking / surprise / angry：用图像编辑模型生成三张表情。',
          'cutout_expression_*：前端 IMG.LY 或服务端边缘色 fallback 生成透明 PNG。',
          'cg_01 / cg_02：生成两张场景 CG。',
        ],
      },
    ],
  },
  WORKFLOW_NOT_FOUND: {
    solution: '这不是前端缓存问题，而是后端状态文件找不到。旧 workflow_id 没有对应 tmp/workflows/wf_*.json 时，重做、下载和继续轮询都会失败。',
    detailBlocks: [
      {
        title: '部署侧重点',
        items: [
          'Zeabur、Render、Railway 等平台重启后本地临时目录可能清空，必须把 WORKFLOW_STATE_DIR、OUTPUT_DIR、UPLOAD_DIR 挂载到持久卷。',
          '如果只挂载 OUTPUT_DIR，没有挂载 WORKFLOW_STATE_DIR，图片文件可能还在，但工作流状态不可恢复。',
          '如果只挂载 WORKFLOW_STATE_DIR，没有挂载 OUTPUT_DIR，状态可读，但下载和预览图片会 404。',
          '修复挂载后，旧的已丢失 workflow 通常无法自动恢复，需要用户重新开始。',
        ],
      },
    ],
  },
  WORKFLOW_STEP_FAILED: {
    detailBlocks: [
      {
        title: '定位顺序',
        items: [
          '先看 step.provider：system、plato、mock、frontend、server-edge-cutout 分别代表不同故障域。',
          'provider=system：通常是输入、文件、状态或内部逻辑问题。',
          'provider=plato：重点查 PLATO_API_KEY、PLATO_BASE_URL、PLATO_MODEL、上游响应体。',
          'provider=frontend：重点查浏览器控制台、IMG.LY 模型资源、COOP/COEP、WebAssembly/WebGPU 支持。',
          'provider=server-edge-cutout：重点查 sharp 是否安装成功、源图是否可读、输出目录是否可写。',
        ],
      },
    ],
  },
  HOSTED_API_REQUIRED: {
    detailBlocks: [
      {
        title: '静态站必须理解的一点',
        items: [
          'GitHub Pages、OSS、CDN 只能托管 HTML/CSS/JS，不能运行 Express 后端。',
          'Paper2Gal、转画风、聊天代理、下载 zip 都需要真实 Node 后端。',
          'API Base URL 应填写后端根地址，例如 https://your-service.example.com，不要填写 /v1/chat/completions 或模型服务商 endpoint。',
          '配置后先访问 https://your-service.example.com/api/health 验证。',
        ],
      },
    ],
  },
};

const enSharedPatches: ErrorPatchMap = {
  API_KEY_MISSING: {
    solution: 'Check both the frontend settings and the backend environment. Custom API keys are sent from the browser only for custom channels. Built-in Plato mode depends on PLATO_API_KEY in the backend .env file or deployment environment.',
    steps: [
      'Confirm whether the app is using Built-in mode or Custom API mode.',
      'Open /api/health and make sure the frontend is talking to the real backend, not a Vite or static-site fallback page.',
      'Restart the backend after editing .env because environment variables are read at process startup.',
      'On cloud platforms, make sure the variable is attached to the web service, not only to a build job or another service.',
    ],
    detailBlocks: [
      {
        title: 'Information to collect',
        items: [
          'The current page: Style Transfer, Paper2Gal, LLM Hub, or TTS.',
          'The current interface mode: built-in, custom API, GitHub Pages, OSS, or another static host.',
          'The full error JSON, especially details.code, details.status_code, provider, route, and workflow_id.',
          'Backend startup logs mentioning PLATO_API_KEY, provider configuration, CORS origin, or port binding.',
        ],
      },
    ],
  },
  BACKEND_UNAVAILABLE: {
    solution: 'First separate a wrong frontend API address from a real backend outage. Many 502 or 404 reports are caused by API Base URL pointing to /v1/chat/completions, a static site, a Vite frontend port, or a container that failed its health check.',
    steps: [
      'Open API Base URL + /api/health directly in the browser. The correct response is JSON: {"status":"ok"}.',
      'If you see HTML, the home page, a static 404, or a GitHub Pages page, the API Base URL is wrong.',
      'For local development, verify the backend port. This project currently defaults the backend to 8080; older notes may mention 3001.',
      'For Zeabur 502 errors, inspect Runtime Logs before changing frontend code.',
    ],
    detailBlocks: [
      {
        title: 'Fast diagnosis',
        items: [
          '/api/health returns JSON: backend is online; inspect the specific endpoint, key, or model next.',
          '/api/health returns HTML: the request reached the frontend or SPA fallback.',
          '/api/health connection refused: backend process is not running, port is wrong, or firewall blocked it.',
          '/api/health returns 502/503: the platform gateway reached the service but the service is unhealthy.',
        ],
      },
    ],
  },
  STYLE_TRANSFER_REQUEST_FAILED: {
    solution: 'Treat the failure by HTTP status code instead of retrying blindly: 401 means key, 404 means model/path, 413 means payload too large, 429 means rate limit, 500/502/503 means backend or upstream service, AbortError/TimeoutError means timeout or network.',
    detailBlocks: [
      {
        title: 'Status code guide',
        items: [
          '400: request body or parameter problem. Check prompt, model, image, and required fields.',
          '401/403: authentication or permission problem. Check API key, model permission, and account status.',
          '404: model not found, wrong route, or API Base URL points to a direct model endpoint.',
          '413: image or request body is too large. Compress the image and retry.',
          '429: provider rate limit, quota policy, or concurrency limit. Reduce parallelism or wait.',
          '500/502/503: backend or upstream error. Inspect upstream status, trace IDs, and fallback_code in server logs.',
        ],
      },
      {
        title: 'Send this to support',
        items: [
          'The full error JSON from the error panel.',
          'The failing Network request URL, status, and response body.',
          'Uploaded image format, byte size, width, and height.',
          'Model name, first 300 characters of Prompt, and first 300 characters of Negative Prompt.',
        ],
      },
    ],
  },
  P2G_WORKFLOW_ERROR: {
    solution: 'Paper2Gal is a multi-step workflow. Do not stop at the top-level error. Identify whether the failed step is validate_input, analyze_character, expression_thinking, expression_surprise, expression_angry, cutout_expression_*, cg_01, or cg_02.',
    steps: [
      'Expand details in the error panel and find latest_step_error, workflow_error, current_step, and failed_steps.',
      'Open /api/workflows/{workflow_id} and inspect every steps.*.status value.',
      'If only cutout_expression_* failed, generation may have succeeded and only background removal failed.',
      'If all expression_* steps failed, inspect the image-edit model, key, content policy, or upstream API.',
      'If cg_01/cg_02 failed while expressions succeeded, focus on CG prompts or the generation model.',
    ],
    detailBlocks: [
      {
        title: 'Workflow step map',
        items: [
          'validate_input: uploaded file, format, size, and dimensions.',
          'analyze_character: basic character profile derived from image dimensions and file name.',
          'expression_thinking / surprise / angry: image-edit model generates three expression images.',
          'cutout_expression_*: browser IMG.LY or server edge-color fallback creates transparent PNGs.',
          'cg_01 / cg_02: scene CG generation.',
        ],
      },
    ],
  },
  WORKFLOW_NOT_FOUND: {
    solution: 'This usually means backend workflow state is gone. When tmp/workflows/wf_*.json is missing, rerun, download, and polling cannot continue even if the browser still remembers the workflow ID.',
    detailBlocks: [
      {
        title: 'Deployment checks',
        items: [
          'On Zeabur, Render, Railway, and similar platforms, temporary directories may be cleared on restart. Mount persistent storage for WORKFLOW_STATE_DIR, OUTPUT_DIR, and UPLOAD_DIR.',
          'If only OUTPUT_DIR is persisted, image files may remain but workflow state cannot be restored.',
          'If only WORKFLOW_STATE_DIR is persisted, workflow state may load but image preview and download can still 404.',
          'After storage is fixed, old missing workflows usually cannot be recovered automatically.',
        ],
      },
    ],
  },
  WORKFLOW_STEP_FAILED: {
    detailBlocks: [
      {
        title: 'Provider-based diagnosis',
        items: [
          'provider=system: input, file, workflow state, or internal logic issue.',
          'provider=plato: inspect PLATO_API_KEY, PLATO_BASE_URL, PLATO_MODEL, and upstream response body.',
          'provider=mock: the real provider probably failed and mock fallback produced a placeholder result.',
          'provider=frontend: inspect browser console, IMG.LY runtime assets, COOP/COEP headers, WebAssembly, and WebGPU support.',
          'provider=server-edge-cutout: inspect sharp installation, source image readability, and output directory write permission.',
        ],
      },
    ],
  },
  HOSTED_API_REQUIRED: {
    detailBlocks: [
      {
        title: 'Static host rule',
        items: [
          'GitHub Pages, OSS, and CDNs can host HTML/CSS/JS, but they cannot run the Express backend.',
          'Paper2Gal, Style Transfer, chat proxying, and zip downloads require a real Node backend.',
          'API Base URL must be the backend root, such as https://your-service.example.com, not /v1/chat/completions or a provider endpoint.',
          'After configuring it, verify https://your-service.example.com/api/health first.',
        ],
      },
    ],
  },
};

const zhDetailedCategories: DocsErrorCategory[] = [
  {
    id: 'deep-api-network',
    name: '深度排查：API、网络、鉴权与上游服务',
    description: '比普通错误字典更细的 API 排查手册，覆盖 Key、Base URL、CORS、超时、限流、状态码和上游模型服务。',
    errors: [
      {
        code: 'API_BASE_URL_POINTS_TO_MODEL_ENDPOINT',
        message: 'API Base URL 填成了 /v1/chat/completions、/v1/images、/responses 等具体模型端点',
        severity: 'critical',
        category: 'A. API 与网络',
        location: '设置 → API → API Base URL；Paper2Gal / 转画风 / LLM Hub 发起请求前',
        cause: '本应用前端会自动拼接 /api/workflows、/api/style-transfer、/api/chat 等路径。如果 Base URL 已经是模型服务商的直接端点，最终 URL 会变成错误的嵌套路径。',
        solution: '把 API Base URL 改成 OC Maker 后端根地址，而不是模型服务商接口地址。',
        steps: [
          '错误示例：https://api.example.com/v1/chat/completions。',
          '正确示例：https://your-oc-maker-backend.example.com。',
          '保存后直接访问 https://your-oc-maker-backend.example.com/api/health，必须返回 {"status":"ok"}。',
          '如果你只想测试模型服务商接口，请在 LLM Hub 的自定义通道里配置，而不是把 Paper2Gal 后端地址改成模型端点。',
        ],
        relatedCodes: ['BACKEND_UNAVAILABLE', 'HOSTED_API_REQUIRED', 'STYLE_TRANSFER_REQUEST_FAILED'],
        prevention: '把“OC Maker 后端根地址”和“模型服务商 API 地址”分开记录；部署文档中只把前者填到 API Base URL。',
        detailBlocks: [
          {
            title: '常见错误 URL',
            items: [
              'https://api.openai.com/v1/chat/completions：这是模型聊天端点，不是 OC Maker 后端。',
              'https://api.openai.com/v1/images：这是图像端点，不是 OC Maker 后端。',
              'https://your-site.github.io/repo：这是静态前端，不是 Node 后端。',
              'http://localhost:5173：这是 Vite 前端端口，通常不是 Express 后端。',
            ],
          },
        ],
      },
      {
        code: 'CORS_ORIGIN_BLOCKED',
        message: '浏览器控制台显示 CORS policy、No Access-Control-Allow-Origin 或 preflight 失败',
        severity: 'error',
        category: 'A. API 与网络',
        location: '浏览器 DevTools → Console / Network；所有联网工具',
        cause: '前端页面的 origin 没有被后端 CORS_ORIGIN 允许，或者 OPTIONS 预检请求被网关、反向代理、平台配置拦截。',
        solution: '在后端环境变量中设置正确的 CORS_ORIGIN，并确认代理允许 OPTIONS。',
        steps: [
          '复制浏览器地址栏 origin，例如 https://user.github.io 或 https://app.example.com。',
          '后端设置 CORS_ORIGIN 为这个 origin；多个 origin 用英文逗号分隔。',
          '如果临时排查可用 CORS_ORIGIN=*，确认问题后再收紧。',
          '重新部署或重启后端，再刷新前端页面。',
          'Network 面板里检查 OPTIONS 请求是否返回 204/200，并带有 Access-Control-Allow-Origin。',
        ],
        relatedCodes: ['BACKEND_UNAVAILABLE', 'HOSTED_API_REQUIRED'],
        prevention: '前后端分域部署时，每次更换前端域名都同步更新后端 CORS_ORIGIN。',
      },
      {
        code: 'UPSTREAM_NON_JSON_RESPONSE',
        message: '后端或上游返回 HTML / 空文本 / 非 JSON，前端错误里出现 Unexpected token、non-JSON 或 SyntaxError',
        severity: 'error',
        category: 'A. API 与网络',
        location: '转画风、LLM Hub、Paper2Gal；Network 响应体',
        cause: '请求打到了错误地址、网关返回了 HTML 错误页、上游服务返回了非标准错误体，或 content-type 被错误标记为 application/json。',
        solution: '先看响应体开头：如果是 <!doctype html> 或平台错误页，按后端地址/部署问题处理；如果是模型服务商错误文本，按上游接口处理。',
        steps: [
          '打开 Network → 失败请求 → Response。',
          '如果看到 HTML 首页，检查 API Base URL。',
          '如果看到 Cloudflare/Zeabur/Nginx 错误页，检查云平台日志。',
          '如果看到模型服务商的纯文本错误，复制完整文本和状态码排查 Key、模型、额度或内容策略。',
        ],
        relatedCodes: ['502_BAD_GATEWAY', '503_SERVICE_UNAVAILABLE', 'BACKEND_UNAVAILABLE'],
      },
      {
        code: 'API_RATE_LIMIT',
        message: '短时间内多次生成后开始 429、限流、quota 或 too many requests',
        severity: 'warning',
        category: 'A. API 与网络',
        location: '转画风 / Paper2Gal / LLM Hub；错误面板和后端日志',
        cause: '模型服务商对 Key、模型、IP 或组织设置了并发与速率限制。Paper2Gal 并行模式会同时发起多个图像任务，更容易触发。',
        solution: '降低并发、等待冷却、换更高额度 Key，或关闭 Paper2Gal 的 AI 并行。',
        steps: [
          '关闭 Paper2Gal 的 AI 并行选项后重试。',
          '把 IMAGE_GEN_CONCURRENCY 降到 1。',
          '等待 60 秒到 10 分钟再重试，具体取决于服务商限流窗口。',
          '检查账户余额、套餐和模型权限。',
          '如果是团队多人共用同一个 Key，协调使用频率。',
        ],
        relatedCodes: ['429_TOO_MANY_REQUESTS', 'STYLE_TRANSFER_REQUEST_FAILED'],
        prevention: '批量生成前先用小图、小步数、低并发验证；正式生成再提高质量参数。',
      },
      {
        code: 'PROVIDER_MODEL_FALLBACK_EXHAUSTED',
        message: '所有候选模型都失败，后端提示 model fallback exhausted 或最终返回 502',
        severity: 'error',
        category: 'A. API 与网络',
        location: '后端 Plato 图像适配器；Paper2Gal 表情/CG 生成',
        cause: '主模型和 fallback 模型都不可用。常见原因是 Key 无权限、模型名拼写错误、上游临时不可用、内容策略拦截或网络超时。',
        solution: '逐个验证 PLATO_MODEL、PLATO_MODEL_FALLBACKS、PLATO_IMAGE_EDIT_MODELS 是否真实可用。',
        steps: [
          '查看后端日志里每次 attempt 的 model、status、code、message。',
          '如果所有 attempt 都是 401，优先换 Key。',
          '如果都是 model_not_found 或 invalid_request，修正模型名。',
          '如果是 5xx 或 timeout，等待上游恢复或增加 timeout。',
          '如果是 content policy，改 prompt 和输入图片后再试。',
        ],
        relatedCodes: ['MODEL_NOT_FOUND', '401_UNAUTHORIZED', 'PROMPT_BLOCKED', '502_BAD_GATEWAY'],
      },
      {
        code: 'REQUEST_TIMEOUT_CHAIN',
        message: '前端、后端、上游任意一层超时，用户只看到“请求超时”',
        severity: 'error',
        category: 'A. API 与网络',
        location: 'fetchWithTimeout、PLATO_TIMEOUT_MS、BANANA2_TIMEOUT_MS、平台网关超时',
        cause: '一次生成请求会经过浏览器、OC Maker 后端、模型服务商和云平台网关。任何一层的超时小于实际生成耗时都会中断。',
        solution: '确认是哪一层先超时，再调整参数或降低生成规模。',
        steps: [
          '前端错误为 TimeoutError 且后端没有日志：前端超时或请求未发出。',
          '后端日志显示 AbortSignal.timeout：后端到上游超时，调大 PLATO_TIMEOUT_MS 或降低图片复杂度。',
          '云平台日志显示 request timeout / gateway timeout：平台网关限制，需要使用支持更长请求的平台或异步轮询。',
          '模型服务商返回 timeout：上游繁忙，等待或换模型。',
        ],
        relatedCodes: ['API_TIMEOUT', 'NETWORK_TIMEOUT', '502_BAD_GATEWAY'],
      },
    ],
  },
  {
    id: 'deep-p2g-workflow',
    name: '深度排查：Paper2Gal 工作流与产物',
    description: '覆盖工作流状态、重做、下载、透明抠图、输出目录和 Zeabur 持久化。',
    errors: [
      {
        code: 'P2G_STUCK_WAITING_FOR_FRONTEND_CUTOUTS',
        message: 'Paper2Gal 表情和 CG 已生成，但工作流一直停在 cutout_expression_* 或等待浏览器抠图',
        severity: 'warning',
        category: 'S. 系统与工作流',
        location: 'Paper2Gal → 进度条 / 表情透明 PNG 区域',
        cause: '背景移除现在由浏览器侧 IMG.LY 处理。模型资源下载失败、浏览器 WebAssembly 不可用、COOP/COEP 头缺失、标签页后台暂停或图片跨域都可能导致前端抠图没有上传。',
        solution: '等待服务端 edge-color fallback，或让浏览器成功加载 IMG.LY runtime assets 后重新生成/重做抠图。',
        steps: [
          '保持 Paper2Gal 页面打开，不要在生成中途关闭标签页。',
          '打开 Console，查找 @imgly/background-removal、wasm、onnx、SharedArrayBuffer 相关错误。',
          '打开 Network，过滤 /api/cutout-assets，确认 .wasm、.onnx、.mjs 能成功加载。',
          '如果资源 404/504，检查后端 /api/cutout-assets/* 代理和 CUTOUT_ASSET_BASE_URL。',
          '如果服务端 fallback 已成功，workflow.outputs.expression_cutouts 应该有 expression-*-cutout.png。',
        ],
        relatedCodes: ['WORKFLOW_STEP_FAILED', 'P2G_WORKFLOW_ERROR'],
        detailBlocks: [
          {
            title: '浏览器要求',
            items: [
              '现代 Chromium / Edge / Chrome 最稳。',
              'COOP: same-origin 与 COEP: require-corp 已在后端设置；如果前端单独静态托管，可能缺少这些头。',
              '企业网络可能拦截 wasm/onnx 文件下载，需要换网络或走后端缓存。',
            ],
          },
        ],
      },
      {
        code: 'P2G_RERUN_CONFLICT',
        message: '点击重做时提示当前结果正在重做，或并发重做被拒绝',
        severity: 'info',
        category: 'S. 系统与工作流',
        location: 'Paper2Gal → 单张表情/CG 的重做按钮',
        cause: '后端按冲突组限制重做：同一个表情和它对应的抠图属于同一组；同一张 CG 也属于单独组。避免旧结果覆盖新结果。',
        solution: '等待当前冲突组完成，再重做同一结果；不同冲突组可以并行。',
        steps: [
          '查看 workflow.active_redos，确认当前正在重做的组。',
          '表情重做会自动清空并重做对应 cutout_expression_*。',
          '不要在同一表情还没完成时反复点击重做。',
          '如果 UI 看起来卡住，刷新页面后重新拉取 workflow 状态。',
        ],
        relatedCodes: ['WORKFLOW_STEP_FAILED', 'P2G_WORKFLOW_ERROR'],
      },
      {
        code: 'P2G_DOWNLOAD_ARCHIVE_EMPTY_OR_404',
        message: '下载工作流 zip 时 404、空包，或提示 outputs 不可用',
        severity: 'error',
        category: 'S. 系统与工作流',
        location: 'Paper2Gal → 下载全部结果',
        cause: '输出目录 tmp/outputs/{workflow_id} 不存在、未持久化、权限不可写，或工作流还没生成任何产物。',
        solution: '确认工作流至少完成一个输出步骤，并检查 OUTPUT_DIR 挂载与写权限。',
        steps: [
          '打开 /api/workflows/{workflow_id}，确认 outputs 中有 expressions、expression_cutouts 或 cg_outputs。',
          '服务器上检查 OUTPUT_DIR/{workflow_id} 是否存在 manifest.json、character-pack.json、图片文件。',
          '云部署检查 OUTPUT_DIR 是否挂载到持久卷。',
          '如果状态存在但文件不存在，旧产物已丢失，需要重新生成。',
        ],
        relatedCodes: ['WORKFLOW_NOT_FOUND', 'EXPORT_FAILED'],
      },
      {
        code: 'P2G_SOURCE_IMAGE_TOO_SMALL',
        message: '上传后提示图片尺寸太小，或 validate_input 失败',
        severity: 'warning',
        category: 'C. 文件与上传',
        location: 'Paper2Gal → 上传角色参考图',
        cause: '后端默认要求图片宽高至少达到 MIN_IMAGE_WIDTH x MIN_IMAGE_HEIGHT，当前默认是 256x256。过小图片会让角色理解和图像编辑质量明显下降。',
        solution: '上传更高分辨率的角色图，或在后端环境变量中谨慎降低最小尺寸。',
        steps: [
          '推荐上传单人、清晰、无遮挡、长边 1024px 以上的图片。',
          '避免截图缩略图、聊天软件压缩图、透明边距过大的小图。',
          '如果必须处理低分辨率图，先用图像工具放大并修复压缩噪声。',
          '管理员可设置 MIN_IMAGE_WIDTH、MIN_IMAGE_HEIGHT，但不建议低于 256。',
        ],
        relatedCodes: ['FILE_FORMAT_UNSUPPORTED', 'FILE_TOO_LARGE'],
      },
      {
        code: 'P2G_OUTPUT_URL_NOT_PUBLIC',
        message: '上游抠图或远程读取图片失败，debug 里 image_url 为空或不可访问',
        severity: 'error',
        category: 'S. 系统与工作流',
        location: 'Paper2Gal → 表情抠图 / 远程图像编辑',
        cause: '某些上游服务需要通过公网 URL 读取已生成图片。如果 PUBLIC_APP_BASE_URL 未配置，后端只能使用本地文件路径；远程服务无法访问本地路径。',
        solution: '为云部署配置 PUBLIC_APP_BASE_URL，并确保 /outputs/* 可公开访问。',
        steps: [
          '设置 PUBLIC_APP_BASE_URL 为你的后端公开根地址。',
          '访问 PUBLIC_APP_BASE_URL + /outputs/{workflow_id}/manifest.json，确认公网可读。',
          '不要把 PUBLIC_APP_BASE_URL 设置成 localhost，除非模型服务也在同一台机器。',
          '如果平台有鉴权或私有网络，确保 outputs 路径不被拦截。',
        ],
        relatedCodes: ['BACKEND_UNAVAILABLE', 'WORKFLOW_STEP_FAILED'],
      },
    ],
  },
  {
    id: 'deep-files-browser',
    name: '深度排查：文件、浏览器、导入导出与本地存储',
    description: '覆盖上传格式、图片解码、localStorage、剪贴板、下载、浏览器内存和编码问题。',
    errors: [
      {
        code: 'IMAGE_DECODE_FAILED',
        message: '图片扩展名正确但后端提示无法读取尺寸，或前端预览为空',
        severity: 'error',
        category: 'C. 文件与上传',
        location: '上传图片、转换图片、Paper2Gal 参考图',
        cause: '文件可能只是改了扩展名，实际内容损坏；也可能是渐进式、CMYK、奇怪色彩空间、超大透明画布或浏览器不支持的编码。',
        solution: '用标准图像工具重新导出为普通 sRGB PNG 或 JPEG。',
        steps: [
          '在浏览器新标签页直接打开图片，确认能显示。',
          '用系统图片查看器或 Photoshop/Krita/GIMP 打开后“另存为” PNG。',
          '移除过大的透明边距，把角色主体裁到合理范围。',
          '如果是 WEBP 动图或特殊编码，先转成静态 PNG。',
          '重新上传另存后的文件。',
        ],
        relatedCodes: ['FILE_FORMAT_UNSUPPORTED', 'FILE_CORRUPTED'],
      },
      {
        code: 'LOCAL_STORAGE_VERSION_MISMATCH',
        message: '更新版本后设置错乱、旧参数消失、某个工具打开即异常',
        severity: 'warning',
        category: 'B. 配置与数据',
        location: '任意工具初始化阶段；浏览器 localStorage',
        cause: '旧版本保存的数据结构与新版本字段不兼容。代码通常会做迁移，但用户手动改过数据、跨版本跨度太大或 JSON 半截损坏时仍会失败。',
        solution: '先导出现有配置，再按工具粒度清理 localStorage。',
        steps: [
          '能打开页面时先使用导出功能备份。',
          '打开 DevTools → Application → Local Storage。',
          '只删除对应工具键，例如 oc-maker.style-transfer、oc-maker.settings、paper2gal 相关键。',
          '刷新页面确认默认配置可用。',
          '从备份 JSON 中手动恢复仍需要的字段。',
        ],
        relatedCodes: ['CONFIG_CORRUPTED', 'IMPORT_INVALID_JSON', 'STORAGE_READ_ONLY'],
      },
      {
        code: 'CLIPBOARD_PERMISSION_DENIED',
        message: '复制图片、复制 JSON、复制错误详情失败或没有反应',
        severity: 'info',
        category: 'B. 配置与数据',
        location: '复制结果、复制 JSON、复制错误按钮',
        cause: 'Clipboard API 通常要求 HTTPS、安全上下文和用户手势；某些浏览器、iframe、企业策略会禁用剪贴板写入。',
        solution: '改用下载按钮，或在 HTTPS / 本地 localhost 环境中重试。',
        steps: [
          '确认页面是 https:// 或 http://localhost。',
          '不要通过 file:// 直接打开构建产物。',
          '点击按钮时保持页面处于前台焦点。',
          '如果复制图片失败，使用“下载结果”保存文件。',
          '如果复制文本失败，展开错误详情手动选择文本。',
        ],
        relatedCodes: ['EXPORT_FAILED'],
      },
      {
        code: 'BROWSER_MEMORY_EXHAUSTED',
        message: '页面突然变慢、崩溃、生成大图后空白，或控制台显示 out of memory',
        severity: 'error',
        category: 'F. 浏览器与性能',
        location: '转画风预览、图片转换器、前端抠图、导出 PNG',
        cause: '大图、透明 PNG、canvas、html-to-image、IMG.LY wasm 模型都会占用较多内存。移动设备或低内存浏览器更容易崩溃。',
        solution: '降低图片尺寸，关闭其他标签页，优先用桌面浏览器处理大图。',
        steps: [
          '把图片长边降到 2048px 以下再上传。',
          '图片转换器批处理时分批处理，不要一次拖入大量图片。',
          '关闭浏览器其他大型网页和设计软件。',
          '使用 Chrome/Edge 桌面版，避免移动端浏览器处理大图。',
          '如果只需要预览，选择较低输出尺寸。',
        ],
        relatedCodes: ['DEVICE_MEMORY_LOW', 'EXPORT_FAILED'],
      },
      {
        code: 'MOJIBAKE_TEXT_ENCODING',
        message: '界面或手册中中文显示为乱码，如 鍚、閿、绋 等字符',
        severity: 'warning',
        category: 'B. 配置与数据',
        location: '用户手册、终端输出、构建日志、源文件文本',
        cause: '文件编码、终端编码或复制链路不一致，常见于 UTF-8 文本被 GBK/Windows-1252 错误解码后再次保存。',
        solution: '确认源文件使用 UTF-8 保存；如果只是 PowerShell 显示乱码，先不要误判源文件损坏。',
        steps: [
          '在编辑器中检查文件编码是否为 UTF-8。',
          'PowerShell 可临时执行 chcp 65001 或设置 OutputEncoding 后再查看。',
          '如果 git diff 中就是乱码，说明源文件可能已经被错误保存，需要从历史版本或备份恢复文本。',
          '不要用不支持 UTF-8 的批处理脚本批量改写多语言文件。',
        ],
        relatedCodes: ['IMPORT_INVALID_JSON', 'CONFIG_CORRUPTED'],
      },
    ],
  },
  {
    id: 'deep-deployment',
    name: '深度排查：部署、环境变量与运行时',
    description: '覆盖 Docker、Zeabur、端口、健康检查、持久卷、构建产物和服务器依赖。',
    errors: [
      {
        code: 'PORT_BINDING_MISMATCH',
        message: '本地能跑，云端 502；或日志显示服务启动但平台访问不到',
        severity: 'critical',
        category: 'Z. 部署与运行时',
        location: 'Zeabur / Docker / 云平台运行日志',
        cause: '平台要求进程监听指定 PORT 和 0.0.0.0，但应用监听了错误端口、只监听 localhost，或健康检查打到了另一个端口。',
        solution: '确认后端读取 process.env.PORT，并监听 0.0.0.0。',
        steps: [
          '检查启动日志：Server listening on 0.0.0.0:{PORT}。',
          'Zeabur 等平台通常注入 PORT，Dockerfile 和代码不要写死只监听 3001。',
          '健康检查路径使用 /health 或 /api/health。',
          '如果容器内同时监听 8080 和 PORT，确认平台转发的是正确端口。',
        ],
        relatedCodes: ['502_BAD_GATEWAY', 'BACKEND_UNAVAILABLE'],
      },
      {
        code: 'STATIC_BUILD_MISSING',
        message: '后端启动后访问页面显示 Static web entry not found 或 index.html 缺失',
        severity: 'error',
        category: 'Z. 部署与运行时',
        location: 'Express SPA fallback；dist/index.html',
        cause: '部署只安装/启动了 server，却没有在项目根目录运行 npm run build 生成 dist，或 Docker 多阶段构建没有复制 dist。',
        solution: '部署流程必须先构建前端，再启动后端。',
        steps: [
          '本地执行 npm run build，确认 dist/index.html 存在。',
          'Docker 中先在根目录 npm ci && npm run build，再复制 dist 和 server。',
          '云平台构建命令不要只写 cd server && npm install。',
          '如果前端单独部署，则后端不一定需要 dist，但访问后端根路径会显示该错误。',
        ],
        relatedCodes: ['BACKEND_UNAVAILABLE', '503_SERVICE_UNAVAILABLE'],
      },
      {
        code: 'PERSISTENT_VOLUME_NOT_MOUNTED',
        message: '部署重启后历史工作流、上传图片或输出结果全部消失',
        severity: 'critical',
        category: 'Z. 部署与运行时',
        location: 'tmp/uploads、tmp/outputs、tmp/workflows',
        cause: '默认路径在项目 tmp 目录，云平台重启、重新部署或容器替换后会丢失。',
        solution: '挂载持久卷并把 UPLOAD_DIR、OUTPUT_DIR、WORKFLOW_STATE_DIR 指向卷路径。',
        steps: [
          '创建持久卷，例如 /data/ocmaker。',
          '设置 UPLOAD_DIR=/data/ocmaker/uploads。',
          '设置 OUTPUT_DIR=/data/ocmaker/outputs。',
          '设置 WORKFLOW_STATE_DIR=/data/ocmaker/workflows。',
          '重新部署后新工作流会保留；已丢失旧数据通常无法恢复。',
        ],
        relatedCodes: ['WORKFLOW_NOT_FOUND', 'P2G_DOWNLOAD_ARCHIVE_EMPTY_OR_404'],
      },
      {
        code: 'SHARP_INSTALL_FAILED',
        message: '服务端图片后处理或 fallback 抠图失败，日志提到 sharp、libvips 或 native module',
        severity: 'error',
        category: 'Z. 部署与运行时',
        location: 'server/src/services/imagePostProcess.js；Docker 构建或运行时日志',
        cause: 'sharp 是原生依赖，需要与 Node 版本、操作系统和 CPU 架构匹配。安装缓存、musl/glibc 差异或缺少二进制包会导致运行时报错。',
        solution: '清理 node_modules 后重新 npm install，云端使用官方 Node 镜像并在目标环境内安装依赖。',
        steps: [
          '删除 server/node_modules 后重新执行 npm install。',
          'Docker 构建时不要从 Windows 直接复制 node_modules 到 Linux 容器。',
          '确认 Node >= 18。',
          '查看 npm install sharp 阶段是否有 warning 或 failed optional dependency。',
          '如果使用 Alpine 镜像，考虑改用 Debian slim Node 镜像。',
        ],
        relatedCodes: ['WORKFLOW_STEP_FAILED', 'P2G_STUCK_WAITING_FOR_FRONTEND_CUTOUTS'],
      },
    ],
  },
];

const enDetailedCategories: DocsErrorCategory[] = [
  {
    id: 'deep-api-network',
    name: 'Deep Troubleshooting: API, Network, Auth, and Upstream Services',
    description: 'Detailed API diagnostics covering keys, base URLs, CORS, timeouts, rate limits, status codes, and model providers.',
    errors: [
      {
        code: 'API_BASE_URL_POINTS_TO_MODEL_ENDPOINT',
        message: 'API Base URL points to /v1/chat/completions, /v1/images, /responses, or another direct model endpoint',
        severity: 'critical',
        category: 'A. API & Network',
        location: 'Settings → API → API Base URL; before Paper2Gal, Style Transfer, or LLM Hub requests',
        cause: 'The frontend app appends OC Maker routes such as /api/workflows, /api/style-transfer, and /api/chat. If the base already points to a provider endpoint, the final URL becomes invalid.',
        solution: 'Set API Base URL to the OC Maker backend root, not to a provider model endpoint.',
        steps: [
          'Wrong example: https://api.example.com/v1/chat/completions.',
          'Correct example: https://your-oc-maker-backend.example.com.',
          'Open https://your-oc-maker-backend.example.com/api/health and confirm it returns {"status":"ok"}.',
          'Use LLM Hub custom channels for provider testing; do not replace the Paper2Gal backend URL with a provider endpoint.',
        ],
        relatedCodes: ['BACKEND_UNAVAILABLE', 'HOSTED_API_REQUIRED', 'STYLE_TRANSFER_REQUEST_FAILED'],
        prevention: 'Document the OC Maker backend root and provider API endpoints separately.',
      },
      {
        code: 'CORS_ORIGIN_BLOCKED',
        message: 'Browser console shows CORS policy, No Access-Control-Allow-Origin, or failed preflight',
        severity: 'error',
        category: 'A. API & Network',
        location: 'Browser DevTools → Console / Network; all online tools',
        cause: 'The frontend origin is not allowed by backend CORS_ORIGIN, or OPTIONS preflight is blocked by a gateway, reverse proxy, or platform setting.',
        solution: 'Set CORS_ORIGIN correctly on the backend and make sure OPTIONS is allowed.',
        steps: [
          'Copy the browser origin, for example https://user.github.io or https://app.example.com.',
          'Set backend CORS_ORIGIN to that origin; use comma-separated values for multiple origins.',
          'Use CORS_ORIGIN=* only as a temporary diagnostic.',
          'Restart or redeploy the backend.',
          'In Network, confirm OPTIONS returns 200/204 with Access-Control-Allow-Origin.',
        ],
        relatedCodes: ['BACKEND_UNAVAILABLE', 'HOSTED_API_REQUIRED'],
      },
      {
        code: 'UPSTREAM_NON_JSON_RESPONSE',
        message: 'Backend or upstream returns HTML, empty text, or non-JSON; frontend shows Unexpected token, non-JSON, or SyntaxError',
        severity: 'error',
        category: 'A. API & Network',
        location: 'Style Transfer, LLM Hub, Paper2Gal; Network response body',
        cause: 'The request reached a wrong URL, a gateway returned an HTML error page, the upstream service returned a non-standard error body, or content-type was mislabeled.',
        solution: 'Inspect the beginning of the response body and classify it before changing prompts or model parameters.',
        steps: [
          'Open Network → failed request → Response.',
          'If it is an HTML home page, fix API Base URL.',
          'If it is a Cloudflare/Zeabur/Nginx error page, inspect platform logs.',
          'If it is provider plain text, copy the full text and status code, then diagnose key, model, quota, or content policy.',
        ],
        relatedCodes: ['502_BAD_GATEWAY', '503_SERVICE_UNAVAILABLE', 'BACKEND_UNAVAILABLE'],
      },
      {
        code: 'API_RATE_LIMIT',
        message: 'After repeated generations, requests start returning 429, quota, limit, or too many requests',
        severity: 'warning',
        category: 'A. API & Network',
        location: 'Style Transfer / Paper2Gal / LLM Hub; error panel and backend logs',
        cause: 'The provider limits rate or concurrency by key, model, IP, or organization. Paper2Gal parallel mode can trigger limits quickly.',
        solution: 'Reduce concurrency, wait for cooldown, use a higher-quota key, or disable Paper2Gal AI parallelism.',
        steps: [
          'Disable Paper2Gal AI parallelism and retry.',
          'Set IMAGE_GEN_CONCURRENCY to 1.',
          'Wait 60 seconds to 10 minutes depending on provider limit window.',
          'Check account balance, plan, and model permission.',
          'Coordinate usage if multiple users share one key.',
        ],
        relatedCodes: ['429_TOO_MANY_REQUESTS', 'STYLE_TRANSFER_REQUEST_FAILED'],
      },
      {
        code: 'PROVIDER_MODEL_FALLBACK_EXHAUSTED',
        message: 'All candidate models fail; backend reports exhausted fallback attempts or returns 502',
        severity: 'error',
        category: 'A. API & Network',
        location: 'Backend Plato image adapter; Paper2Gal expression/CG generation',
        cause: 'The primary model and fallback models are unavailable. Common causes include missing permission, typoed model ID, temporary upstream outage, content policy, or timeout.',
        solution: 'Validate PLATO_MODEL, PLATO_MODEL_FALLBACKS, and PLATO_IMAGE_EDIT_MODELS one by one.',
        steps: [
          'Inspect backend logs for each attempt model, status, code, and message.',
          'If all attempts are 401, replace the key first.',
          'If attempts are model_not_found or invalid_request, correct model IDs.',
          'If attempts are 5xx or timeout, wait or increase timeout.',
          'If attempts are content policy, adjust prompt and input image.',
        ],
        relatedCodes: ['MODEL_NOT_FOUND', '401_UNAUTHORIZED', 'PROMPT_BLOCKED', '502_BAD_GATEWAY'],
      },
      {
        code: 'REQUEST_TIMEOUT_CHAIN',
        message: 'Frontend, backend, upstream, or platform timeout collapses into a generic timeout message',
        severity: 'error',
        category: 'A. API & Network',
        location: 'fetchWithTimeout, PLATO_TIMEOUT_MS, provider timeout, or platform gateway timeout',
        cause: 'A generation request passes through the browser, OC Maker backend, model provider, and hosting gateway. The shortest timeout wins.',
        solution: 'Identify which layer timed out first, then either increase that timeout or reduce generation workload.',
        steps: [
          'Frontend TimeoutError with no backend log: request timed out before or while reaching backend.',
          'Backend log shows AbortSignal.timeout: backend-to-provider timeout; increase PLATO_TIMEOUT_MS or reduce image complexity.',
          'Platform log shows gateway timeout: hosting platform request limit was hit.',
          'Provider returns timeout: upstream is busy; wait or switch model.',
        ],
        relatedCodes: ['API_TIMEOUT', 'NETWORK_TIMEOUT', '502_BAD_GATEWAY'],
      },
    ],
  },
  {
    id: 'deep-p2g-workflow',
    name: 'Deep Troubleshooting: Paper2Gal Workflow and Artifacts',
    description: 'Workflow state, reruns, downloads, transparent cutouts, output directories, and persistent storage.',
    errors: [
      {
        code: 'P2G_STUCK_WAITING_FOR_FRONTEND_CUTOUTS',
        message: 'Paper2Gal generated expressions and CGs, but remains stuck at cutout_expression_* or browser cutout upload',
        severity: 'warning',
        category: 'S. System & Workflow',
        location: 'Paper2Gal → progress bar / transparent expression PNG area',
        cause: 'Background removal is browser-side IMG.LY. Runtime asset download failure, missing WebAssembly support, missing COOP/COEP headers, background-tab throttling, or cross-origin image access can block upload.',
        solution: 'Let server edge-color fallback complete, or make the browser load IMG.LY runtime assets successfully and rerun cutout generation.',
        steps: [
          'Keep the Paper2Gal tab open during generation.',
          'Open Console and search for @imgly/background-removal, wasm, onnx, SharedArrayBuffer, or WebGPU errors.',
          'Open Network and filter /api/cutout-assets; .wasm, .onnx, and .mjs files must load.',
          'If assets return 404/504, inspect /api/cutout-assets proxy and CUTOUT_ASSET_BASE_URL.',
          'If server fallback succeeded, workflow.outputs.expression_cutouts should contain expression-*-cutout.png.',
        ],
        relatedCodes: ['WORKFLOW_STEP_FAILED', 'P2G_WORKFLOW_ERROR'],
      },
      {
        code: 'P2G_RERUN_CONFLICT',
        message: 'Rerun is rejected because the same result is already being regenerated',
        severity: 'info',
        category: 'S. System & Workflow',
        location: 'Paper2Gal → per-expression or per-CG rerun button',
        cause: 'The backend groups reruns by conflict set. An expression and its cutout share one group; each CG has its own group. This prevents old outputs from overwriting newer outputs.',
        solution: 'Wait for the current conflict group to finish before rerunning the same result.',
        steps: [
          'Inspect workflow.active_redos to see the active group.',
          'Expression rerun automatically clears and reruns its cutout.',
          'Do not repeatedly click rerun for the same expression while it is running.',
          'If the UI looks stale, refresh and fetch workflow state again.',
        ],
        relatedCodes: ['WORKFLOW_STEP_FAILED', 'P2G_WORKFLOW_ERROR'],
      },
      {
        code: 'P2G_DOWNLOAD_ARCHIVE_EMPTY_OR_404',
        message: 'Workflow zip download returns 404, empty archive, or outputs unavailable',
        severity: 'error',
        category: 'S. System & Workflow',
        location: 'Paper2Gal → download all outputs',
        cause: 'tmp/outputs/{workflow_id} does not exist, is not persisted, is not writable, or the workflow has not produced artifacts yet.',
        solution: 'Confirm at least one output step completed and verify OUTPUT_DIR persistence and write permission.',
        steps: [
          'Open /api/workflows/{workflow_id} and check expressions, expression_cutouts, or cg_outputs.',
          'On the server, check OUTPUT_DIR/{workflow_id} for manifest.json, character-pack.json, and image files.',
          'On cloud deployments, verify OUTPUT_DIR is mounted to persistent storage.',
          'If state exists but files are missing, regenerate the workflow.',
        ],
        relatedCodes: ['WORKFLOW_NOT_FOUND', 'EXPORT_FAILED'],
      },
      {
        code: 'P2G_SOURCE_IMAGE_TOO_SMALL',
        message: 'Upload fails with image too small or validate_input fails',
        severity: 'warning',
        category: 'C. Files & Upload',
        location: 'Paper2Gal → character reference upload',
        cause: 'The backend requires at least MIN_IMAGE_WIDTH x MIN_IMAGE_HEIGHT; current defaults are 256x256. Smaller images reduce character understanding and edit quality.',
        solution: 'Upload a higher-resolution reference or carefully lower backend minimum-size variables.',
        steps: [
          'Recommended: single-character, clear, unobstructed image with long edge above 1024px.',
          'Avoid thumbnails, compressed chat images, and tiny images with large transparent margins.',
          'If only a low-res image exists, upscale and clean compression artifacts first.',
          'Admins can adjust MIN_IMAGE_WIDTH and MIN_IMAGE_HEIGHT, but values below 256 are not recommended.',
        ],
        relatedCodes: ['FILE_FORMAT_UNSUPPORTED', 'FILE_TOO_LARGE'],
      },
      {
        code: 'P2G_OUTPUT_URL_NOT_PUBLIC',
        message: 'Upstream image read or cutout fails; debug image_url is empty or unreachable',
        severity: 'error',
        category: 'S. System & Workflow',
        location: 'Paper2Gal → expression cutout / remote image edit',
        cause: 'Some upstream services need a public URL to read generated images. If PUBLIC_APP_BASE_URL is missing, the backend can only refer to local files.',
        solution: 'Set PUBLIC_APP_BASE_URL to the public backend root and ensure /outputs/* is publicly readable.',
        steps: [
          'Set PUBLIC_APP_BASE_URL to the backend public root.',
          'Open PUBLIC_APP_BASE_URL + /outputs/{workflow_id}/manifest.json and confirm it is readable.',
          'Do not set PUBLIC_APP_BASE_URL to localhost unless the provider runs on the same machine.',
          'Ensure authentication or private networking does not block /outputs paths.',
        ],
        relatedCodes: ['BACKEND_UNAVAILABLE', 'WORKFLOW_STEP_FAILED'],
      },
    ],
  },
  {
    id: 'deep-files-browser',
    name: 'Deep Troubleshooting: Files, Browser, Import/Export, and Local Storage',
    description: 'Upload formats, image decoding, localStorage, clipboard, downloads, browser memory, and text encoding.',
    errors: [
      {
        code: 'IMAGE_DECODE_FAILED',
        message: 'Image extension is valid, but dimensions cannot be read or preview is blank',
        severity: 'error',
        category: 'C. Files & Upload',
        location: 'Image upload, image converter, Paper2Gal reference upload',
        cause: 'The file may be damaged or only renamed. It may also use progressive encoding, CMYK, unusual color space, huge transparent canvas, animated WebP, or another unsupported variant.',
        solution: 'Re-export as standard sRGB PNG or JPEG from a reliable image editor.',
        steps: [
          'Open the image directly in a browser tab and confirm it displays.',
          'Open it in an image editor and Save As PNG.',
          'Crop excessive transparent margins.',
          'Convert animated or unusual WebP into static PNG.',
          'Upload the re-exported file.',
        ],
        relatedCodes: ['FILE_FORMAT_UNSUPPORTED', 'FILE_CORRUPTED'],
      },
      {
        code: 'LOCAL_STORAGE_VERSION_MISMATCH',
        message: 'After upgrading, settings are scrambled, old parameters disappear, or a tool crashes on open',
        severity: 'warning',
        category: 'B. Config & Data',
        location: 'Any tool initialization; browser localStorage',
        cause: 'Saved data from an older version may not match the current schema. Migrations handle normal cases, but manually edited, very old, or half-written JSON can still fail.',
        solution: 'Export what you can, then clear localStorage by tool key.',
        steps: [
          'If the page opens, export current configuration first.',
          'Open DevTools → Application → Local Storage.',
          'Delete only the affected tool key, such as oc-maker.style-transfer, oc-maker.settings, or Paper2Gal-related keys.',
          'Refresh and confirm default configuration works.',
          'Recover needed fields manually from exported JSON.',
        ],
        relatedCodes: ['CONFIG_CORRUPTED', 'IMPORT_INVALID_JSON', 'STORAGE_READ_ONLY'],
      },
      {
        code: 'CLIPBOARD_PERMISSION_DENIED',
        message: 'Copy image, copy JSON, or copy error details fails silently',
        severity: 'info',
        category: 'B. Config & Data',
        location: 'Copy result, copy JSON, copy error buttons',
        cause: 'Clipboard API generally requires HTTPS, a secure context, and a user gesture. Some browsers, iframes, and enterprise policies disable clipboard writes.',
        solution: 'Use download buttons, or retry in HTTPS / localhost.',
        steps: [
          'Confirm the page is served from https:// or http://localhost.',
          'Do not open the built file through file://.',
          'Keep the page focused when clicking copy.',
          'If copying image fails, use Download Result.',
          'If copying text fails, expand error details and select text manually.',
        ],
        relatedCodes: ['EXPORT_FAILED'],
      },
      {
        code: 'BROWSER_MEMORY_EXHAUSTED',
        message: 'Page slows down, crashes, becomes blank, or console shows out of memory after large images',
        severity: 'error',
        category: 'F. Browser & Performance',
        location: 'Style Transfer preview, Image Converter, frontend cutout, PNG export',
        cause: 'Large images, transparent PNGs, canvas, html-to-image, and IMG.LY wasm models consume significant memory.',
        solution: 'Reduce image size, close other heavy tabs, and use a desktop browser for large assets.',
        steps: [
          'Reduce image long edge below 2048px before upload.',
          'Process image converter batches in smaller groups.',
          'Close other large pages and design applications.',
          'Use desktop Chrome/Edge instead of mobile browsers for large images.',
          'Use lower output size for previews.',
        ],
        relatedCodes: ['DEVICE_MEMORY_LOW', 'EXPORT_FAILED'],
      },
      {
        code: 'MOJIBAKE_TEXT_ENCODING',
        message: 'Text appears garbled, such as 鍚, 閿, or 绋 characters',
        severity: 'warning',
        category: 'B. Config & Data',
        location: 'User manual, terminal output, build logs, source text',
        cause: 'UTF-8 text was decoded or saved with GBK/Windows-1252 or another incompatible encoding.',
        solution: 'Confirm source files are UTF-8. If only PowerShell display is garbled, do not assume the file is damaged.',
        steps: [
          'Check file encoding in the editor.',
          'In PowerShell, try chcp 65001 or set OutputEncoding before viewing text.',
          'If git diff itself contains garbled text, restore from history or backup.',
          'Do not batch-edit multilingual files with scripts that do not preserve UTF-8.',
        ],
        relatedCodes: ['IMPORT_INVALID_JSON', 'CONFIG_CORRUPTED'],
      },
    ],
  },
  {
    id: 'deep-deployment',
    name: 'Deep Troubleshooting: Deployment, Environment Variables, and Runtime',
    description: 'Docker, Zeabur, ports, health checks, persistent volumes, build artifacts, and server dependencies.',
    errors: [
      {
        code: 'PORT_BINDING_MISMATCH',
        message: 'Works locally but cloud deployment returns 502, or logs show server started but platform cannot reach it',
        severity: 'critical',
        category: 'Z. Deployment & Runtime',
        location: 'Zeabur / Docker / platform runtime logs',
        cause: 'The platform expects the process to listen on injected PORT and 0.0.0.0, but the app listens on a wrong port, localhost only, or the health check targets another port.',
        solution: 'Make sure the backend reads process.env.PORT and listens on 0.0.0.0.',
        steps: [
          'Check startup logs for Server listening on 0.0.0.0:{PORT}.',
          'Do not hard-code only port 3001 in cloud deployment.',
          'Use /health or /api/health as the health check path.',
          'If multiple ports are opened, confirm which one the platform routes to.',
        ],
        relatedCodes: ['502_BAD_GATEWAY', 'BACKEND_UNAVAILABLE'],
      },
      {
        code: 'STATIC_BUILD_MISSING',
        message: 'Backend starts, but page says Static web entry not found or index.html is missing',
        severity: 'error',
        category: 'Z. Deployment & Runtime',
        location: 'Express SPA fallback; dist/index.html',
        cause: 'Deployment installed or started server only, without running npm run build at the project root, or Docker did not copy dist.',
        solution: 'Build the frontend before starting the backend.',
        steps: [
          'Run npm run build locally and confirm dist/index.html exists.',
          'In Docker, run root npm ci && npm run build, then copy dist and server files.',
          'Cloud build command should not be only cd server && npm install.',
          'If frontend is hosted separately, backend root may still show this message; API routes can still work.',
        ],
        relatedCodes: ['BACKEND_UNAVAILABLE', '503_SERVICE_UNAVAILABLE'],
      },
      {
        code: 'PERSISTENT_VOLUME_NOT_MOUNTED',
        message: 'After redeploy or restart, historical workflows, uploads, or outputs disappear',
        severity: 'critical',
        category: 'Z. Deployment & Runtime',
        location: 'tmp/uploads, tmp/outputs, tmp/workflows',
        cause: 'Default paths are under project tmp. Cloud restarts, redeploys, or container replacement can erase them.',
        solution: 'Mount persistent storage and point UPLOAD_DIR, OUTPUT_DIR, and WORKFLOW_STATE_DIR to it.',
        steps: [
          'Create a persistent volume, for example /data/ocmaker.',
          'Set UPLOAD_DIR=/data/ocmaker/uploads.',
          'Set OUTPUT_DIR=/data/ocmaker/outputs.',
          'Set WORKFLOW_STATE_DIR=/data/ocmaker/workflows.',
          'Redeploy. New workflows will persist; already lost data usually cannot be recovered.',
        ],
        relatedCodes: ['WORKFLOW_NOT_FOUND', 'P2G_DOWNLOAD_ARCHIVE_EMPTY_OR_404'],
      },
      {
        code: 'SHARP_INSTALL_FAILED',
        message: 'Server image post-processing or fallback cutout fails; logs mention sharp, libvips, or native module',
        severity: 'error',
        category: 'Z. Deployment & Runtime',
        location: 'server/src/services/imagePostProcess.js; Docker build or runtime logs',
        cause: 'sharp is a native dependency and must match Node version, OS, and CPU architecture.',
        solution: 'Reinstall dependencies in the target environment and avoid copying node_modules across OS boundaries.',
        steps: [
          'Delete server/node_modules and run npm install again.',
          'Do not copy Windows node_modules into a Linux container.',
          'Confirm Node >= 18.',
          'Check npm install sharp output for warnings or failed optional dependencies.',
          'If using Alpine, consider Debian slim Node images.',
        ],
        relatedCodes: ['WORKFLOW_STEP_FAILED', 'P2G_STUCK_WAITING_FOR_FRONTEND_CUTOUTS'],
      },
    ],
  },
];

function manualSuffix(language: string): string {
  if (language.toLowerCase().startsWith('zh')) {
    return `增强排查章节：
本版本补充了更长的错误解决手册。除了原有的按钮、参数和基础报错说明，错误字典末尾新增了深度排查章节，覆盖 API 地址、CORS、502/503、Zeabur 部署、持久化目录、Paper2Gal 工作流步骤、前端抠图、浏览器内存、编码乱码、导入导出和上游模型状态码。遇到复杂问题时，优先复制错误面板 JSON，并按“状态码 → 当前步骤 → provider → 后端日志 → 浏览器 Network/Console”的顺序定位。`;
  }

  return `Extended troubleshooting chapters:
This manual now includes longer error-resolution sections. In addition to buttons, parameters, and basic errors, the error dictionary contains deep troubleshooting for API base URLs, CORS, 502/503, Zeabur deployment, persistent directories, Paper2Gal workflow steps, frontend cutouts, browser memory, text encoding, import/export, and upstream model status codes. For complex issues, copy the full error JSON and diagnose in this order: status code → current step → provider → backend logs → browser Network/Console.`;
}

export function enhanceDocsContent(content: DocsContent, language: string): DocsContent {
  const isZh = language.toLowerCase().startsWith('zh');
  const patched = patchToolErrors(content, isZh ? zhSharedPatches : enSharedPatches);
  const extraCategories = isZh ? zhDetailedCategories : enDetailedCategories;

  return {
    ...patched,
    intro: `${patched.intro}\n\n${manualSuffix(language)}`,
    errorDictionary: [
      ...patched.errorDictionary,
      ...extraCategories,
    ],
  };
}
