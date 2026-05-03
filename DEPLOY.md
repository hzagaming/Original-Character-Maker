# 部署指南

## Zeabur 部署（推荐）

Zeabur 是本项目的主要部署平台，支持 Dockerfile 部署，可完整运行前后端及 Python rembg 抠图。

### 1. 部署方式选择

**方式 A：Git 仓库部署（推荐）**

1. 将代码推送到 GitHub
2. 在 Zeabur 控制台点击「创建服务」→「从 GitHub 导入」
3. Zeabur 会自动检测到 `Dockerfile` 并使用 Docker 部署

**方式 B：文件上传部署**

1. 在 Zeabur 控制台创建服务
2. 选择「Docker」运行时
3. 上传整个项目文件夹（确保 `Dockerfile` 在根目录）

> ⚠️ **重要**：`.env` 文件被 `.gitignore` 和 `.dockerignore` 忽略，**不会**随代码上传。敏感配置必须在 Zeabur 控制台的环境变量中设置。

### 2. 环境变量设置

在 Zeabur 控制台 → 你的服务 → **Environment Variables** 中添加以下变量：

```env
# 必配：Plato API Key（表情生成 + CG 生成）
PLATO_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
PLATO_BASE_URL=https://api.bltcy.ai/v1

# 可选：Provider 配置（保持默认即可）
EXPRESSION_PROVIDER=plato
CG_PROVIDER=plato
BG_REMOVAL_PROVIDER=rembg
PIPELINE_MODE=live

# 可选：CORS（如果前后端同域名可保持默认）
CORS_ORIGIN=*

# 可选：资源限制
MAX_UPLOAD_SIZE_BYTES=10485760
IMAGE_GEN_CONCURRENCY=2
```

> **关于 rembg**：Dockerfile 已预装 `python3` 和 `rembg[cli]`，首次运行会自动下载约 176MB 的 u2net 模型。如果使用 Node.js 模板（不走 Dockerfile），容器中没有 Python，rembg 会自动降级为 **frontend** 抠图（由浏览器 Canvas 处理）。

### 3. 持久化存储（可选）

Zeabur 容器是无状态的，`tmp/` 目录在实例回收后会清空。如果需要持久化 workflow 快照和输出文件：

1. 在 Zeabur 控制台添加 **Volume**
2. 挂载路径设置为 `/app/tmp`
3. 或在环境变量中修改路径：
   ```env
   UPLOAD_DIR=/mnt/volume/uploads
   OUTPUT_DIR=/mnt/volume/outputs
   WORKFLOW_STATE_DIR=/mnt/volume/workflows
   ```

### 4. 端口与访问

- 后端监听端口：`3001`（Dockerfile 中 `EXPOSE 3001`）
- Zeabur 会自动分配域名，如 `https://your-service.zeabur.app`
- 前端 SPA 由后端 `/` 路由提供，`/api/*` 为 API 路由

### 5. 常见问题排查

| 问题 | 原因 | 解决 |
|---|---|---|
| 全是 mock | `PLATO_API_KEY` 未设置，或 `EXPRESSION_PROVIDER` / `CG_PROVIDER` 被设成了 `mock` | 检查环境变量，确保 key 已填入 |
| rembg 失败 | 容器中没有 Python（Node.js 模板部署）或模型未下载 | 改用 Dockerfile 部署；或接受 frontend 自动降级 |
| API 404 | 前后端不同域名，前端未正确探测后端 | 确认 CORS_ORIGIN 包含前端域名；或在前端设置中填写后端地址 |
| 文件上传失败 | `MAX_UPLOAD_SIZE_BYTES` 太小 | 调大至 10485760（10MB）或更大 |

---

## 阿里云部署指南

### 前端（阿里云 OSS 静态网站托管）

#### 1. 构建

```bash
npm install
npm run build
```

构建完成后，`dist/` 目录内会自动生成 `404.html`（复制自 `index.html`），用于 OSS 静态网站托管的回退。

#### 2. 上传到 OSS

```bash
# 使用 ossutil 或阿里云控制台上传
dist/ 目录下的所有文件 → OSS Bucket 根目录
```

#### 3. OSS 静态网站托管配置

在 Bucket 的「基础设置」→「静态页面」中：

- **默认首页**: `index.html`
- **默认 404 页**: `404.html`

> 本项目前端是单页应用（SPA）态切换，没有浏览器路由，因此 404 回退主要用于直接刷新子路径时的兜底。

#### 4. 自定义域名（可选）

绑定自定义域名并开启 HTTPS，可以获得更好的访问体验。

#### 5. 跨域配置（CORS）

如果前端域名与后端 API 域名不同，需要在 OSS 的「权限管理」→「跨域设置」中添加规则：

- **来源**: 你的前端域名（如 `https://your-domain.com`）
- **允许 Methods**: `GET`, `POST`, `PUT`, `DELETE`, `HEAD`, `OPTIONS`
- **允许 Headers**: `*`
- **暴露 Headers**: `ETag`, `x-oss-request-id`

---

## 后端（阿里云 ECS / 函数计算 FC）

### 环境要求

- Node.js >= 18
- Python 3.9+（如需本地 rembg 抠图）

### 部署到 ECS

```bash
cd server
npm install --production
```

创建 `.env` 文件：

```env
PORT=3001
CORS_ORIGIN=https://your-frontend-domain.com

# AI 图像生成（表情 + CG）
EXPRESSION_PROVIDER=plato
CG_PROVIDER=plato
PLATO_API_KEY=your_api_key
PLATO_BASE_URL=https://api.bltcy.ai/v1
PLATO_MODEL=gpt-image-2

# 背景移除（默认 rembg 本地推理，无需 API Key）
BG_REMOVAL_PROVIDER=rembg

UPLOAD_DIR=./tmp/uploads
OUTPUT_DIR=./tmp/outputs
WORKFLOW_STATE_DIR=./tmp/workflows
```

> **rembg 环境要求**：如果使用 rembg（默认），服务器需要安装 Python 3.9+ 和 rembg CLI。Docker 镜像已预装；裸机部署请执行 `pip3 install rembg[cli]`，首次运行会自动下载约 176MB 的 u2net 模型。

启动服务：

```bash
node src/index.js
```

建议配合 `pm2` 或 `systemd` 守护进程运行。

### 部署到函数计算 FC

1. 将 `server/` 目录打包为 ZIP
2. 在阿里云 FC 控制台创建「自定义运行时」HTTP 函数
3. 启动命令: `node src/index.js`
4. 监听端口: `3001`
5. 上传 ZIP 包并部署

> 注意：函数计算为无状态环境，本地文件系统（`tmp/`）在实例回收后会清空。如需持久化，建议将上传目录和输出目录改为阿里云 OSS 路径，或接入 NAS。

---

## 前端 API 地址配置

部署到阿里云 OSS 后，前端会检测到当前是静态托管环境（`aliyuncs.com` / `alicdn.com` / `oss-` 域名），并提示用户在「设置 → 接口」中填写后端 API 地址。

填写格式：

```
https://your-backend-domain.com
```

**不要**填写 `/v1/chat/completions` 这类模型直连接口地址。前端会自动拼接 `/api/workflows`。
