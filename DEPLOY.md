# 部署指南

## Zeabur 部署

本项目推荐使用 Dockerfile 部署到 Zeabur。当前版本的背景移除已统一改为浏览器端 `@imgly/background-removal`，服务端不再安装本地 AI 抠图运行时，因此镜像更小、启动更快，也更适合 Zeabur。

### 1. 部署方式

**方式 A：Git 仓库部署（推荐）**

1. 将代码推送到 GitHub。
2. 在 Zeabur 控制台创建服务，选择从 GitHub 导入。
3. Zeabur 会检测根目录 `Dockerfile` 并使用 Docker 部署。

**方式 B：本地文件上传部署**

1. 在 Zeabur 控制台创建服务。
2. 选择 Docker 运行时。
3. 上传整个项目目录，确保 `Dockerfile` 在根目录。

`.env` 不会随代码上传，密钥和部署配置必须在 Zeabur 环境变量中设置。

### 2. 环境变量

在 Zeabur 控制台的 Environment Variables 中设置：

```env
PORT=8080

PLATO_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
PLATO_BASE_URL=https://api.bltcy.ai/v1

EXPRESSION_PROVIDER=plato
CG_PROVIDER=plato
BG_REMOVAL_PROVIDER=frontend
PIPELINE_MODE=live

CORS_ORIGIN=*
MAX_UPLOAD_SIZE_BYTES=10485760
IMAGE_GEN_CONCURRENCY=2
```

说明：

- `BG_REMOVAL_PROVIDER=frontend` 是当前推荐和默认方案。
- 抠图在用户浏览器中执行，服务端只保存前端上传回来的透明 PNG。
- 旧的服务端背景移除方案已经移除；当前部署只需要 frontend。

### 3. 端口

- Dockerfile 默认 `PORT=8080`，并 `EXPOSE 8080`。
- Zeabur 的 Public Networking 端口设置为 `8080`。
- 端口类型选择 `HTTP`。
- 应用监听 `0.0.0.0:$PORT`。

部署后 Runtime Logs 应看到类似：

```text
[Backend] Starting server on port 8080...
[Backend] Server listening on 0.0.0.0:8080
```

### 4. 持久化存储（可选）

Zeabur 容器文件系统是临时的。如果需要保留 workflow 快照和输出文件，添加 Volume 并挂载到：

```text
/app/tmp
```

或使用环境变量指定：

```env
UPLOAD_DIR=/mnt/volume/uploads
OUTPUT_DIR=/mnt/volume/outputs
WORKFLOW_STATE_DIR=/mnt/volume/workflows
```

### 5. 常见问题

| 问题 | 原因 | 处理 |
|---|---|---|
| 502 Bad Gateway | Zeabur 公网端口没有指向应用监听端口 | 确认 `PORT=8080`，Network 端口为 `8080`，类型为 `HTTP` |
| 页面能打开但生成失败 | `PLATO_API_KEY` 未设置或无效 | 在 Zeabur 环境变量中设置正确 key |
| 抠图没有出现 | 浏览器端模型加载失败、网络无法访问模型资源、或前端未能上传结果 | 刷新页面重试，确认 `/api/cutout-assets/v1/` 可访问 |
| 上传失败 | 文件超过限制 | 调大 `MAX_UPLOAD_SIZE_BYTES` |

## 本地运行

```bash
npm install
cd server
npm install
cd ..
npm run dev
```

本地默认后端端口来自 `.env`，通常是：

```env
PORT=3001
BG_REMOVAL_PROVIDER=frontend
```

## 静态前端 + 独立后端

如果前端部署到 OSS、CDN 或其他静态站点，后端仍需部署为 Node 服务。前端设置中的 API 地址填写后端根地址，例如：

```text
https://your-backend-domain.com
```

不要填写 `/v1/chat/completions`、`/api/workflows` 或模型供应商接口路径。前端会自动拼接本项目需要的 `/api/*` 路由。
