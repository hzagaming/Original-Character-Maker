# 阿里云部署指南

## 前端（阿里云 OSS 静态网站托管）

### 1. 构建

```bash
npm install
npm run build
```

构建完成后，`dist/` 目录内会自动生成 `404.html`（复制自 `index.html`），用于 OSS 静态网站托管的回退。

### 2. 上传到 OSS

```bash
# 使用 ossutil 或阿里云控制台上传
dist/ 目录下的所有文件 → OSS Bucket 根目录
```

### 3. OSS 静态网站托管配置

在 Bucket 的「基础设置」→「静态页面」中：

- **默认首页**: `index.html`
- **默认 404 页**: `404.html`

> 本项目前端是单页应用（SPA）态切换，没有浏览器路由，因此 404 回退主要用于直接刷新子路径时的兜底。

### 4. 自定义域名（可选）

绑定自定义域名并开启 HTTPS，可以获得更好的访问体验。

### 5. 跨域配置（CORS）

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
PIPELINE_MODE=plato
PLATO_API_KEY=your_api_key
PLATO_BASE_URL=https://api.bltcy.ai/v1
PLATO_MODEL=gemini-3.1-flash-image-preview
UPLOAD_DIR=./tmp/uploads
OUTPUT_DIR=./tmp/outputs
WORKFLOW_STATE_DIR=./tmp/workflows
```

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
