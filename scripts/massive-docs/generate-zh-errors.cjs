const fs = require('fs');

const file = 'src/docsContent/zh.ts';
let content = fs.readFileSync(file, 'utf8');

function esc(s) { return s.replace(/'/g, "\\'"); }

function makeEntry({ code, message, severity, category, location, cause, solution, steps, relatedCodes, prevention }) {
  const stepsStr = steps ? `\n          steps: [\n            ${steps.map(s => `'${esc(s)}'`).join(',\n            ')}\n          ],` : '';
  const relatedStr = relatedCodes && relatedCodes.length ? `\n          relatedCodes: [${relatedCodes.map(c => `'${c}'`).join(', ')}],` : '';
  const preventionStr = prevention ? `\n          prevention: '${esc(prevention)}',` : '';
  return `        {\n          code: '${code}',\n          message: '${esc(message)}',\n          severity: '${severity}',\n          category: '${esc(category)}',\n          location: '${esc(location)}',\n          cause: '${esc(cause)}',\n          solution: '${esc(solution)}',${stepsStr}${relatedStr}${preventionStr}\n        },`;
}

function insertBeforeCategoryEnd(catId, newEntries) {
  const catPattern = new RegExp(`(id: '${catId}',[\\s\\S]*?errors: \\[)([\\s\\S]*?)(\\],\\s*\\n\\s*\\},)`);
  const match = content.match(catPattern);
  if (!match) {
    console.error('Category', catId, 'not found');
    return false;
  }
  const insertPos = match.index + match[1].length + match[2].length;
  content = content.slice(0, insertPos) + '\n' + newEntries + content.slice(insertPos);
  return true;
}

// ===== Category A: API & Network (85 new entries) =====
const catA = [
  { code: 'DNS_RESOLUTION_FAILED', msg: 'DNS 解析失败，无法连接到服务器', sev: 'critical', cause: '域名解析失败，可能是 DNS 服务器故障、域名不存在或本地 DNS 缓存损坏。', sol: '检查域名拼写，刷新 DNS 缓存，更换 DNS 服务器。', steps: ['检查域名拼写是否正确','运行 ipconfig /flushdns 或 sudo dscacheutil -flushcache','更换为 8.8.8.8 或 1.1.1.1 等公共 DNS','检查 hosts 文件是否被篡改','重启网络设备'] },
  { code: 'TLS_CERT_EXPIRED', msg: 'TLS 证书已过期，连接被拒绝', sev: 'critical', cause: '服务器 SSL/TLS 证书已过期，或本地系统时间不正确导致证书验证失败。', sol: '联系管理员更新证书，或检查本地系统时间。', steps: ['检查本地系统时间是否正确','尝试用浏览器直接访问 API 地址查看证书信息','联系服务提供商更新证书','临时绕过：在开发环境关闭证书验证（不推荐用于生产）'] },
  { code: 'TLS_CERT_UNTRUSTED', msg: 'TLS 证书不受信任', sev: 'critical', cause: '服务器使用了自签名证书、中间证书缺失或证书链不完整。', sol: '安装根证书，或联系管理员修复证书链。', steps: ['下载并安装服务器的根证书','检查证书链是否完整','确认系统 CA 存储是最新的','如果使用自签名证书，将其添加到信任存储'] },
  { code: 'TLS_HANDSHAKE_FAILED', msg: 'TLS 握手失败', sev: 'critical', cause: '客户端与服务器支持的 TLS 版本或密码套件不兼容。', sol: '升级客户端 TLS 版本，或联系服务器管理员启用兼容的密码套件。', steps: ['检查客户端支持的 TLS 版本（至少 1.2）','使用 openssl s_client 测试握手','联系管理员启用 TLS 1.2/1.3','更新操作系统和浏览器'] },
  { code: 'PROXY_AUTHENTICATION_REQUIRED', msg: '代理服务器需要认证', sev: 'error', cause: '通过代理服务器访问互联网时，代理要求提供用户名和密码。', sol: '在系统或应用设置中配置代理认证信息。', steps: ['检查系统代理设置','在应用设置中配置代理用户名和密码','确认代理服务器地址和端口正确','联系网络管理员获取代理凭据'] },
  { code: 'PROXY_CONNECTION_REFUSED', msg: '代理服务器连接被拒绝', sev: 'error', cause: '配置的代理服务器地址错误或代理服务未运行。', sol: '检查代理设置，确认代理服务器可用。', steps: ['确认代理服务器地址和端口正确','测试直接连接（绕过代理）','检查代理服务是否运行','联系网络管理员'] },
  { code: 'WEBSOCKET_CONNECTION_FAILED', msg: 'WebSocket 连接失败', sev: 'error', cause: 'WebSocket 服务器未启动、防火墙阻止了 WebSocket 端口或 URL 路径错误。', sol: '检查 WebSocket 服务器状态，确认防火墙规则。', steps: ['检查 WebSocket URL 是否正确','确认服务器端 WebSocket 服务已启动','检查防火墙是否阻止了 ws/wss 端口','查看浏览器控制台的网络日志'] },
  { code: 'WEBSOCKET_CLOSED_UNEXPECTEDLY', msg: 'WebSocket 意外断开', sev: 'warning', cause: '网络不稳定、服务器重启或心跳超时导致连接断开。', sol: '实现自动重连机制，增加心跳间隔。', steps: ['检查网络稳定性','实现指数退避重连逻辑','增加心跳包发送频率','查看服务器日志确认断开原因'] },
  { code: 'CDN_RESOURCE_UNAVAILABLE', msg: 'CDN 资源不可用', sev: 'warning', cause: 'CDN 节点故障、资源被删除或缓存过期。', sol: '刷新 CDN 缓存，切换到备用 CDN 源。', steps: ['尝试直接访问源站确认资源存在','刷新 CDN 缓存','检查 CDN 配置是否正确','切换到备用 CDN 域名'] },
  { code: 'CDN_CACHE_STALE', msg: 'CDN 返回过期缓存内容', sev: 'info', cause: 'CDN 缓存未及时刷新，导致客户端获取到旧版本资源。', sol: '强制刷新 CDN 缓存或添加版本号参数。', steps: ['在 URL 后添加 ?v=timestamp 强制刷新','联系 CDN 提供商刷新缓存','检查缓存 TTL 配置','使用文件名哈希实现长期缓存'] },
  { code: 'LOAD_BALANCER_UNAVAILABLE', msg: '负载均衡器无可用后端', sev: 'critical', cause: '所有后端服务器均不可用或健康检查失败。', sol: '检查后端服务器状态，修复或扩容。', steps: ['检查所有后端服务器的健康状态','查看负载均衡器日志','重启故障的后端实例','临时减少负载或启用降级策略'] },
  { code: 'IPv6_CONNECTIVITY_ISSUE', msg: 'IPv6 连接问题', sev: 'warning', cause: '客户端优先使用 IPv6 但网络不支持，导致连接超时后 fallback 到 IPv4。', sol: '禁用 IPv6 或修复 IPv6 网络配置。', steps: ['测试 IPv6 连通性（test-ipv6.com）','在系统设置中临时禁用 IPv6','检查路由器 IPv6 配置','联系 ISP 确认 IPv6 支持'] },
  { code: 'FIREWALL_BLOCKED_REQUEST', msg: '防火墙拦截了请求', sev: 'error', cause: '企业防火墙、ISP 拦截或国家/地区网络限制阻止了出站请求。', sol: '使用 VPN、更换网络或联系网络管理员。', steps: ['测试同一网络下其他设备是否可以访问','尝试使用 VPN 或代理','联系网络管理员添加白名单','检查请求是否触发了 WAF 规则'] },
  { code: 'MAN_IN_THE_MIDDLE_DETECTED', msg: '检测到中间人攻击', sev: 'critical', cause: 'HTTPS 连接被中间设备（如企业代理、恶意软件）拦截和篡改。', sol: '立即停止操作，检查网络环境安全性。', steps: ['不要继续操作，避免敏感数据泄露','检查系统是否安装了未知证书','运行杀毒软件扫描','更换安全的网络环境（如手机热点）','联系安全团队'] },
  { code: 'COOKIE_BLOCKED_THIRD_PARTY', msg: '第三方 Cookie 被阻止', sev: 'warning', cause: '浏览器隐私设置或扩展程序阻止了第三方 Cookie，影响跨域认证。', sol: '调整浏览器隐私设置或使用 SameSite=None; Secure。', steps: ['检查浏览器是否启用了「阻止第三方 Cookie」','在浏览器设置中添加网站例外','后端设置 Cookie 的 SameSite 属性为 None 并启用 Secure','考虑使用 Token 替代 Cookie 方案'] },
  { code: 'CORS_PREFLIGHT_FAILED', msg: 'CORS 预检请求失败', sev: 'error', cause: 'OPTIONS 预检请求未返回正确的 Access-Control-Allow 头。', sol: '后端添加 OPTIONS 路由并返回正确的 CORS 头。', steps: ['检查后端是否正确处理 OPTIONS 请求','确认 Access-Control-Allow-Methods 包含实际使用的方法','确认 Access-Control-Allow-Headers 包含自定义头','检查 Access-Control-Max-Age 配置'] },
  { code: 'CORS_CREDENTIALS_NOT_ALLOWED', msg: 'CORS 不允许携带凭证', sev: 'error', cause: '前端设置了 withCredentials=true 但后端未返回 Access-Control-Allow-Credentials: true。', sol: '后端添加 Access-Control-Allow-Credentials: true 头。', steps: ['后端设置 Access-Control-Allow-Credentials: true','确认 Access-Control-Allow-Origin 不是通配符 *','检查前端是否正确设置了 credentials 选项','测试不带凭证的请求是否正常'] },
  { code: 'API_VERSION_DEPRECATED', msg: 'API 版本已弃用', sev: 'warning', cause: '使用的 API 版本已被标记为弃用，将在未来移除。', sol: '迁移到最新的 API 版本。', steps: ['查看 API 文档中的版本迁移指南','更新请求 URL 到新版本','测试新版本 API 的响应格式差异','更新相关解析代码'] },
  { code: 'API_VERSION_REMOVED', msg: 'API 版本已移除', sev: 'critical', cause: '使用的 API 版本已被完全移除，不再可用。', sol: '紧急迁移到受支持的 API 版本。', steps: ['查看 API 提供商的版本支持时间表','升级到最新的稳定版本','全面测试所有受影响的功能','更新客户端代码和文档'] },
  { code: 'API_ENDPOINT_CHANGED', msg: 'API 端点地址已变更', sev: 'critical', cause: '服务提供商更换了 API 端点域名或路径结构。', sol: '更新 API Base URL 和端点路径。', steps: ['查看 API 提供商的官方公告','更新配置中的 API Base URL','检查所有端点路径是否需要调整','测试所有 API 调用'] },
  { code: 'API_SCHEMA_CHANGED', msg: 'API 响应结构变更', sev: 'error', cause: 'API 返回的数据结构与预期不符，可能是后端升级导致字段变化。', sol: '更新前端解析逻辑以适配新的响应结构。', steps: ['查看 API 变更日志','更新 TypeScript 类型定义','添加字段存在性检查避免 undefined 访问','使用可选链操作符 ?. 安全访问字段'] },
  { code: 'API_RESPONSE_MALFORMED_JSON', msg: 'API 返回了损坏的 JSON', sev: 'error', cause: '服务器返回了非 JSON 内容（如 HTML 错误页、BOM 头、截断响应）。', sol: '检查后端日志，确认返回格式正确。', steps: ['查看浏览器网络面板的原始响应内容','检查后端是否抛出了未捕获异常','确认响应头 Content-Type 为 application/json','检查是否有代理修改了响应内容'] },
  { code: 'API_RESPONSE_TOO_LARGE', msg: 'API 响应体过大', sev: 'warning', cause: 'API 返回了超大响应体，超过前端或代理的接收限制。', sol: '请求分页数据或使用流式传输。', steps: ['检查响应体大小','实现分页请求逻辑','使用 Range 请求分块获取','压缩传输启用 gzip/brotli'] },
  { code: 'API_REQUEST_TOO_LARGE', msg: 'API 请求体过大', sev: 'error', cause: '上传的数据（如图片 Base64、长文本）超过了服务器接收限制。', sol: '压缩数据、分片上传或增加服务器限制。', steps: ['压缩图片后重新上传','将大请求拆分为多个小请求','联系管理员增加服务器 body-parser 限制','使用流式上传替代一次性上传'] },
  { code: 'API_QUERY_PARAM_TOO_LONG', msg: '查询参数过长', sev: 'warning', cause: 'URL 查询字符串超过浏览器或服务器的限制（通常 2048 字符）。', sol: '使用 POST 请求体代替查询参数。', steps: ['将数据从 URL 参数移到 POST body','使用表单数据或 JSON body','缩短参数名或值','检查是否有重复参数'] },
  { code: 'API_HEADER_TOO_LARGE', msg: '请求头过大', sev: 'error', cause: '自定义头（如 Authorization Bearer token）过长，超过服务器限制。', sol: '缩短 token 长度，或减少自定义头数量。', steps: ['检查 Authorization 头的长度','移除不必要的自定义头','联系管理员增加 large_client_header_buffers','使用 cookie 替代超长的 header'] },
  { code: 'OAUTH_TOKEN_EXPIRED', msg: 'OAuth 访问令牌已过期', sev: 'error', cause: 'OAuth 2.0 的 access_token 已过期，需要使用 refresh_token 刷新。', sol: '使用 refresh_token 获取新的 access_token。', steps: ['检查 token 的过期时间','使用 refresh_token 调用 token 端点','更新存储的 access_token','实现自动刷新逻辑'] },
  { code: 'OAUTH_REFRESH_TOKEN_EXPIRED', msg: 'OAuth 刷新令牌已过期', sev: 'critical', cause: 'refresh_token 也已过期，需要重新授权。', sol: '引导用户重新进行 OAuth 授权流程。', steps: ['清除本地存储的 token 信息','重定向用户到 OAuth 授权页面','用户完成授权后存储新的 token 对','设置提醒在 token 过期前刷新'] },
  { code: 'OAUTH_SCOPE_INSUFFICIENT', msg: 'OAuth 权限范围不足', sev: 'error', cause: '当前 access_token 的 scope 不包含执行该操作所需的权限。', sol: '请求更大 scope 的授权，或联系管理员分配权限。', steps: ['检查当前 token 的 scope 列表','在授权请求中添加缺失的 scope','引导用户重新授权','联系管理员确认权限配置'] },
  { code: 'OAUTH_STATE_MISMATCH', msg: 'OAuth state 参数不匹配', sev: 'critical', cause: 'CSRF 防护的 state 参数在授权回调时不匹配，可能是 CSRF 攻击。', sol: '重新发起授权请求，确保 state 参数正确传递。', steps: ['清除当前授权流程的状态','重新生成随机 state 参数','确保 state 在请求和回调间一致','检查是否有中间页篡改了 state'] },
  { code: 'JWT_SIGNATURE_INVALID', msg: 'JWT 签名无效', sev: 'critical', cause: 'JWT token 的签名与密钥不匹配，token 可能被篡改。', sol: '重新获取有效的 JWT token。', steps: ['检查 token 是否完整（三部分 base64）','确认使用的密钥与签发时一致','重新登录获取新 token','检查 token 是否在传输中被截断'] },
  { code: 'JWT_TOKEN_EXPIRED', msg: 'JWT token 已过期', sev: 'error', cause: 'JWT 的 exp 声明已过期。', sol: '使用刷新机制或重新登录获取新 token。', steps: ['检查 token 的 exp 时间戳','如果支持 refresh，调用刷新接口','否则引导用户重新登录','实现 token 过期前的自动刷新'] },
  { code: 'JWT_ISSUER_MISMATCH', msg: 'JWT 签发者不匹配', sev: 'error', cause: 'JWT 的 iss 声明与预期的签发者不符。', sol: '检查 token 来源，确保使用正确的认证服务。', steps: ['验证 JWT 的 iss 字段','确认使用了正确的认证服务器','检查是否有多个认证服务共存','联系管理员确认签发者配置'] },
  { code: 'JWT_AUDIENCE_MISMATCH', msg: 'JWT 受众不匹配', sev: 'error', cause: 'JWT 的 aud 声明与当前应用不匹配。', sol: '确认 token 是为当前应用签发的。', steps: ['检查 JWT 的 aud 字段','确认应用的 client_id 与 aud 匹配','如果是多租户应用，检查租户配置','重新获取正确的 token'] },
  { code: 'API_KEY_FORMAT_INVALID', msg: 'API Key 格式无效', sev: 'error', cause: '输入的 API Key 不符合预期格式（如长度、前缀、字符集）。', sol: '检查 API Key 是否正确复制，去除多余空格。', steps: ['检查 Key 是否包含前导或尾随空格','确认 Key 的长度与服务商要求一致','检查是否有非法字符（如换行符）','重新从服务商后台复制 Key'] },
  { code: 'API_KEY_REVOKED', msg: 'API Key 已被吊销', sev: 'critical', cause: 'API Key 已被用户或管理员主动吊销。', sol: '生成新的 API Key 并更新配置。', steps: ['登录服务商后台检查 Key 状态','确认 Key 是否被意外吊销','生成新的 API Key','更新所有使用该 Key 的配置'] },
  { code: 'API_KEY_QUOTA_EXHAUSTED', msg: 'API Key 额度已用完', sev: 'critical', cause: 'API Key 的月度/年度调用额度已全部消耗。', sol: '升级套餐或等待额度重置。', steps: ['登录服务商后台查看额度使用情况','考虑升级到更高额度套餐','优化调用频率减少浪费','设置额度使用预警'] },
  { code: 'API_KEY_IP_RESTRICTED', msg: 'API Key 存在 IP 白名单限制', sev: 'error', cause: 'API Key 绑定了特定 IP，当前请求的源 IP 不在白名单中。', sol: '在服务商后台添加当前 IP 到白名单，或更换不受限制的 Key。', steps: ['查看当前公网 IP（whatismyipaddress.com）','登录服务商后台添加 IP 白名单','或生成新的无 IP 限制 Key','如果使用代理，确认代理出口 IP'] },
  { code: 'API_KEY_REGION_BLOCKED', msg: 'API Key 在当前地区被限制', sev: 'error', cause: '服务商基于地理限制阻止了该地区的 API 调用。', sol: '使用 VPN 切换到允许的地区，或联系服务商解除限制。', steps: ['确认当前所在地区是否在限制列表','使用 VPN 切换到允许的地区','联系服务商申请解除地区限制','考虑使用其他地区的服务商'] },
  { code: 'API_RETRY_EXHAUSTED', msg: 'API 重试次数已耗尽', sev: 'error', cause: '所有重试策略均已执行但仍未成功，可能是持续性故障。', sol: '检查网络和服务状态，稍后重试或联系支持。', steps: ['检查服务商状态页面','查看网络连接是否正常','等待几分钟后手动重试','联系服务商技术支持'] },
  { code: 'API_CIRCUIT_BREAKER_OPEN', msg: '熔断器已打开', sev: 'critical', cause: '连续失败次数超过阈值，熔断器进入打开状态，拒绝后续请求。', sol: '等待熔断器超时后自动恢复，或手动重置。', steps: ['等待熔断器冷却期结束（通常 30-60 秒）','检查并修复导致连续失败的根本原因','手动重置熔断器状态（如果有管理接口）','监控失败率避免再次触发熔断'] },
  { code: 'API_THROTTLING_BURST_LIMIT', msg: 'API 突发流量限制', sev: 'warning', cause: '短时间内请求量超过了突发限制（burst limit），即使平均速率未超。', sol: '平滑请求发送频率，使用令牌桶或漏桶算法限流。', steps: ['实现客户端请求队列和速率限制','使用令牌桶算法平滑请求','增加请求间隔时间','联系服务商提高突发限制'] },
  { code: 'API_THROTTLING_STEADY_LIMIT', msg: 'API 稳定速率限制', sev: 'warning', cause: '持续请求速率超过了稳定限制（steady limit）。', sol: '降低持续请求频率，或升级套餐。', steps: ['计算当前的平均请求速率','降低到限制以下的频率','实现自适应速率控制','考虑升级套餐或申请提高限制'] },
  { code: 'API_CONCURRENT_LIMIT_EXCEEDED', msg: 'API 并发请求数超限', sev: 'warning', cause: '同时发起的请求数量超过了服务商的并发限制。', sol: '使用连接池或请求队列限制并发数。', steps: ['检查当前并发请求数','实现请求队列和最大并发限制','使用 Promise.allSettled 替代 Promise.all','减少同时进行的操作数量'] },
  { code: 'API_CONTENT_MODERATION_BLOCKED', msg: 'API 内容审核拦截', sev: 'error', cause: '请求内容触发了服务商的内容安全策略（如敏感词、违规图片）。', sol: '修改请求内容以符合内容政策，或联系服务商申诉。', steps: ['检查请求内容是否包含敏感信息','修改或删除触发审核的内容','如果误判，联系服务商申诉','阅读服务商的内容政策文档'] },
  { code: 'API_CONTENT_MODERATION_ERROR', msg: 'API 内容审核服务出错', sev: 'error', cause: '内容审核服务本身出现故障，无法完成审核。', sol: '稍后重试，或临时绕过审核（如业务允许）。', steps: ['等待几分钟后重试','检查服务商状态页面','如果业务允许，临时禁用内容审核','联系服务商报告问题'] },
  { code: 'API_RESPONSE_ENCODING_ERROR', msg: 'API 响应编码错误', sev: 'error', cause: '服务器返回了非 UTF-8 编码的内容，或 Content-Type 头与内容编码不匹配。', sol: '检查后端编码配置，确保返回 UTF-8。', steps: ['检查响应头的 charset 声明','使用 TextDecoder 指定编码','联系后端团队确认编码设置','统一使用 UTF-8 编码'] },
  { code: 'API_RESPONSE_COMPRESSION_ERROR', msg: 'API 响应解压失败', sev: 'error', cause: '服务器返回了 gzip/brotli 压缩内容但解压失败（如数据损坏）。', sol: '禁用压缩传输，或检查压缩数据完整性。', steps: ['在请求头中移除 Accept-Encoding','检查代理是否修改了压缩数据','使用原始未压缩数据测试','联系服务商检查压缩实现'] },
  { code: 'API_CHUNKED_TRANSFER_ERROR', msg: '分块传输错误', sev: 'error', cause: 'Chunked Transfer-Encoding 过程中连接中断或数据块格式错误。', sol: '检查网络稳定性，或禁用分块传输。', steps: ['检查网络连接是否稳定','在服务器端禁用 chunked 传输','增加连接保持时间','使用 Content-Length 替代 chunked'] },
  { code: 'API_KEEPALIVE_TIMEOUT', msg: 'Keep-Alive 连接超时', sev: 'warning', cause: 'HTTP Keep-Alive 连接空闲时间过长被服务器或中间件关闭。', sol: '减少 Keep-Alive 空闲时间，或发送心跳请求。', steps: ['降低客户端 Keep-Alive 空闲超时','定期发送心跳请求保持连接','使用连接池自动管理连接生命周期','在请求前检查连接状态'] },
  { code: 'API_HTTP2_STREAM_ERROR', msg: 'HTTP/2 流错误', sev: 'error', cause: 'HTTP/2 连接中的某个流出现错误（如流重置、窗口溢出）。', sol: '降级到 HTTP/1.1，或修复 HTTP/2 配置。', steps: ['在客户端禁用 HTTP/2','检查服务器的 HTTP/2 设置','增加流控制窗口大小','查看 HTTP/2 错误代码（RST_STREAM）'] },
  { code: 'API_HTTP2_GOAWAY', msg: 'HTTP/2 GOAWAY 帧接收', sev: 'warning', cause: '服务器发送了 GOAWAY 帧，表示即将关闭连接。', sol: '在新连接上重试请求，实现连接优雅迁移。', steps: ['捕获 GOAWAY 事件','在新连接上重试未完成的请求','检查服务器的最大流限制','实现连接预热避免冷启动'] },
  { code: 'API_HTTP3_CONNECTION_ERROR', msg: 'HTTP/3 连接错误', sev: 'error', cause: '基于 QUIC 的 HTTP/3 连接建立失败（如 UDP 被阻止）。', sol: '降级到 HTTP/2 或 HTTP/1.1，或开放 UDP 端口。', steps: ['检查防火墙是否阻止了 UDP','在客户端禁用 HTTP/3','确认服务器支持 HTTP/3','使用支持 HTTP/3 的库版本'] },
  { code: 'API_GRAPHQL_VALIDATION_ERROR', msg: 'GraphQL 查询验证失败', sev: 'error', cause: 'GraphQL 查询语法错误、字段不存在或类型不匹配。', sol: '检查查询语法，使用 GraphQL 文档验证工具。', steps: ['使用 GraphQL Playground 验证查询','检查字段名和类型是否与 schema 匹配','确认查询变量类型正确','查看 GraphQL 错误详情中的路径信息'] },
  { code: 'API_GRAPHQL_EXECUTION_ERROR', msg: 'GraphQL 执行错误', sev: 'error', cause: 'GraphQL 查询在执行期间出错（如 resolver 抛异常）。', sol: '查看 GraphQL 错误详情中的路径和扩展信息，修复对应 resolver。', steps: ['查看 errors 数组中的 path 定位问题字段','检查 resolver 日志','确认数据源（数据库、API）是否正常','添加 resolver 的错误处理'] },
  { code: 'API_GRAPHQL_RATE_LIMITED', msg: 'GraphQL 查询复杂度超限', sev: 'warning', cause: 'GraphQL 查询的复杂度评分超过了服务端限制（如嵌套太深、返回字段太多）。', sol: '简化查询，减少嵌套层级和返回字段数量。', steps: ['使用查询复杂度分析工具','减少查询嵌套层级','使用分页代替全量查询','将大查询拆分为多个小查询'] },
  { code: 'API_WEBHOOK_DELIVERY_FAILED', msg: 'Webhook 投递失败', sev: 'error', cause: '服务端尝试向配置的 Webhook URL 发送事件但失败（如 URL 不可达、返回非 2xx）。', sol: '检查 Webhook URL 可用性，确保端点返回 2xx。', steps: ['测试 Webhook URL 是否可达','确保端点能快速响应（< 30 秒）','返回 2xx 状态码确认接收','查看 Webhook 投递日志和重试记录'] },
  { code: 'API_WEBHOOK_SIGNATURE_INVALID', msg: 'Webhook 签名验证失败', sev: 'critical', cause: 'Webhook 请求的签名与本地计算结果不匹配，可能是伪造请求。', sol: '检查签名算法和密钥，确保使用正确的 secret。', steps: ['确认使用的 secret 与配置一致','检查签名算法（HMAC-SHA256 等）','验证时间戳是否在允许窗口内','不要依赖 webhook 请求体做关键操作'] },
  { code: 'API_IDEMPOTENCY_KEY_REUSE', msg: '幂等键已被使用', sev: 'error', cause: '使用了相同的幂等键（Idempotency-Key）但请求内容不同。', sol: '为每次新请求生成唯一的幂等键。', steps: ['使用 UUID 生成唯一幂等键','确保同一业务操作的幂等键一致','检查幂等键的存储和复用逻辑','阅读服务商的幂等性文档'] },
  { code: 'API_IDEMPOTENCY_KEY_EXPIRED', msg: '幂等键已过期', sev: 'warning', cause: '幂等键的有效期已过，服务端不再识别该键。', sol: '重新生成幂等键并发起请求。', steps: ['了解服务商的幂等键有效期','在有效期内完成操作','重新生成新的幂等键','实现幂等键的自动刷新机制'] },
  { code: 'API_BATCH_PARTIAL_FAILURE', msg: '批量请求部分失败', sev: 'warning', cause: '批量 API 请求中的部分子请求失败，其他成功。', sol: '处理成功的结果，对失败的子请求单独重试。', steps: ['解析批量响应中的每个子结果','提取失败的子请求','对失败的子请求单独重试','记录失败原因用于后续分析'] },
  { code: 'API_BATCH_SIZE_EXCEEDED', msg: '批量请求大小超限', sev: 'error', cause: '批量请求包含的子请求数量超过了服务端限制。', sol: '将大批量拆分为多个小批次发送。', steps: ['检查服务商的批量大小限制','将请求拆分为多个批次','实现批次队列和顺序处理','监控各批次的处理结果'] },
  { code: 'API_PAGINATION_CURSOR_INVALID', msg: '分页游标无效', sev: 'error', cause: '使用的分页游标已过期或格式不正确。', sol: '重新获取第一页数据，使用新的游标。', steps: ['重新请求第一页获取新的游标','检查游标是否被截断或篡改','确认游标编码格式正确','实现游标失效后的自动回退'] },
  { code: 'API_PAGINATION_OFFSET_TOO_LARGE', msg: '分页偏移量过大', sev: 'error', cause: '使用 offset 分页时偏移量超过了服务端支持的最大值。', sol: '使用游标分页（cursor-based）替代偏移分页。', steps: ['了解 offset 的最大限制','迁移到游标分页方案','如果必须使用 offset，缩小每页大小','考虑使用搜索过滤减少总数据量'] },
  { code: 'API_SORT_PARAMETER_INVALID', msg: '排序参数无效', sev: 'error', cause: '请求中指定的排序字段不存在或不支持排序。', sol: '检查可用的排序字段列表，使用正确的字段名。', steps: ['查看 API 文档中的排序字段列表','确认字段名拼写正确','检查是否使用了不支持的排序方向（asc/desc）','移除非法的排序参数'] },
  { code: 'API_FILTER_PARAMETER_INVALID', msg: '过滤参数无效', sev: 'error', cause: '请求中指定的过滤条件格式错误或字段不存在。', sol: '检查过滤参数格式，参考 API 文档中的过滤语法。', steps: ['查看 API 文档的过滤语法说明','确认过滤字段名和运算符正确','检查过滤值的类型是否匹配','简化过滤条件逐步测试'] },
  { code: 'API_FIELD_SELECTION_INVALID', msg: '字段选择参数无效', sev: 'error', cause: '请求中指定的返回字段不存在或无权访问。', sol: '检查可用的字段列表，移除非法字段。', steps: ['查看 API 文档的字段列表','确认字段名拼写正确','检查是否需要特定权限才能访问某些字段','使用通配符或默认字段集'] },
  { code: 'API_EXPAND_PARAMETER_INVALID', msg: '关联展开参数无效', sev: 'error', cause: '请求中尝试展开的关联资源不存在或不支持展开。', sol: '检查可展开的关联资源列表。', steps: ['查看 API 文档的 expand 支持列表','确认关联资源名正确','检查是否有权限访问关联资源','减少展开层级避免性能问题'] },
  { code: 'API_INCLUDE_PARAMETER_INVALID', msg: '包含参数无效', sev: 'error', cause: '请求中指定的包含（include）资源不存在。', sol: '检查可用的 include 选项列表。', steps: ['查看 API 文档的 include 支持列表','确认资源名拼写正确','检查 include 和 expand 的区别','移除非法的 include 参数'] },
  { code: 'API_EMBED_PARAMETER_INVALID', msg: '嵌入参数无效', sev: 'error', cause: '请求中尝试嵌入的资源类型不支持嵌入。', sol: '检查可嵌入的资源类型列表。', steps: ['查看 API 文档的 embed 支持列表','确认嵌入的资源类型正确','考虑使用 expand 或 include 替代','检查嵌入深度限制'] },
  { code: 'API_AGGREGATION_NOT_SUPPORTED', msg: '聚合查询不支持', sev: 'error', cause: '请求中使用了聚合操作（如 count、sum、avg）但该端点不支持。', sol: '使用客户端聚合，或调用专门的聚合端点。', steps: ['查看 API 文档确认是否支持聚合','在客户端对返回数据进行聚合','使用专门的统计/报表端点','联系服务商申请聚合功能'] },
  { code: 'API_SEARCH_QUERY_SYNTAX_ERROR', msg: '搜索查询语法错误', sev: 'error', cause: '搜索查询字符串包含语法错误（如未闭合引号、非法运算符）。', sol: '检查搜索语法，参考搜索引擎的查询语法文档。', steps: ['检查引号是否成对闭合','确认运算符（AND/OR/NOT）使用正确','转义特殊字符','使用简单的关键词搜索测试'] },
  { code: 'API_SEARCH_INDEX_NOT_READY', msg: '搜索索引未就绪', sev: 'warning', cause: '搜索服务正在重建索引，暂时无法提供准确结果。', sol: '等待索引重建完成，或返回部分结果。', steps: ['检查搜索服务状态','等待索引重建完成','使用数据库直接查询作为降级方案','实现搜索结果的缓存'] },
  { code: 'API_REALTIME_CONNECTION_LIMIT', msg: '实时连接数超限', sev: 'warning', cause: '同时建立的实时连接（WebSocket/SSE）数量超过了限制。', sol: '关闭不必要的连接，或使用连接复用/多路复用。', steps: ['检查当前活跃的实时连接数','关闭不需要的连接','使用单一连接订阅多个主题','实现连接池管理'] },
  { code: 'API_SSE_CONNECTION_FAILED', msg: 'SSE 连接失败', sev: 'error', cause: 'Server-Sent Events 连接无法建立，可能是服务器不支持或中间件阻止。', sol: '检查服务器 SSE 支持，确认代理允许 text/event-stream。', steps: ['确认服务器端实现了 SSE 端点','检查响应头 Content-Type: text/event-stream','确认代理和防火墙允许长连接','测试简单的 SSE 端点'] },
  { code: 'API_SSE_RECONNECT_FAILED', msg: 'SSE 重连失败', sev: 'error', cause: 'SSE 连接断开后自动重连多次仍然失败。', sol: '检查网络和服务状态，实现指数退避重连。', steps: ['实现指数退避重连逻辑','检查服务器是否仍在运行','确认 last-event-id 正确传递','如果多次失败，提示用户手动刷新'] },
  { code: 'API_LONG_POLLING_TIMEOUT', msg: '长轮询超时', sev: 'warning', cause: '长轮询请求在超时前没有收到新数据。', sol: '这是正常行为，客户端应自动发起新的长轮询请求。', steps: ['捕获超时错误','立即发起新的长轮询请求','保持 last-seen 状态','不要将此错误展示给用户'] },
  { code: 'API_PUSH_NOTIFICATION_FAILED', msg: '推送通知发送失败', sev: 'warning', cause: '向客户端发送推送通知失败（如设备离线、token 失效）。', sol: '更新设备 token，或等待设备上线后重试。', steps: ['检查设备 token 是否有效','确认推送服务（FCM/APNs）配置正确','移除失效的设备 token','实现推送重试队列'] },
  { code: 'API_PUSH_NOTIFICATION_TOKEN_INVALID', msg: '推送通知 token 无效', sev: 'error', cause: '设备的推送 token 已失效或格式错误。', sol: '请求客户端重新注册推送 token。', steps: ['从数据库中移除失效 token','通知客户端重新获取 token','更新存储的 token','检查 token 格式是否符合 FCM/APNs 要求'] },
  { code: 'API_FILE_UPLOAD_URL_EXPIRED', msg: '文件上传预签名 URL 已过期', sev: 'error', cause: '获取的预签名上传 URL（如 S3 presigned URL）已过期。', sol: '重新请求新的预签名 URL。', steps: ['重新调用获取上传 URL 的接口','检查 URL 的有效期配置','在过期前完成上传','实现 URL 刷新机制'] },
  { code: 'API_FILE_UPLOAD_URL_INVALID', msg: '文件上传预签名 URL 无效', sev: 'error', cause: '预签名 URL 格式错误或已被使用。', sol: '重新获取新的预签名 URL。', steps: ['检查 URL 是否完整','确认 URL 未被重复使用','重新请求新的上传 URL','检查 URL 生成逻辑'] },
  { code: 'API_MULTIPART_UPLOAD_INIT_FAILED', msg: '分片上传初始化失败', sev: 'error', cause: '服务端无法创建分片上传任务（如存储桶权限不足）。', sol: '检查存储服务配置和权限。', steps: ['检查存储桶写入权限','确认分片上传接口可用','查看服务端日志','联系管理员检查存储配置'] },
  { code: 'API_MULTIPART_UPLOAD_PART_FAILED', msg: '分片上传某一片失败', sev: 'error', cause: '某个分片的上传失败（如网络中断、签名过期）。', sol: '单独重试失败的分片，不需要重新上传所有分片。', steps: ['记录失败的 part number','单独重新上传该分片','确认该分片的 ETag 匹配','继续完成分片合并'] },
  { code: 'API_MULTIPART_UPLOAD_COMPLETE_FAILED', msg: '分片上传合并失败', sev: 'error', cause: '所有分片上传完成后，服务端合并失败（如分片缺失、顺序错误）。', sol: '检查所有分片是否上传成功，重新发起合并请求。', steps: ['列出已上传的分片清单','确认没有缺失的分片','检查分片顺序是否正确','重新调用完成接口'] },
  { code: 'API_MULTIPART_UPLOAD_ABORT_FAILED', msg: '分片上传取消失败', sev: 'warning', cause: '尝试取消分片上传任务失败，可能导致存储空间浪费。', sol: '手动清理未完成的 upload，或配置自动清理策略。', steps: ['手动调用取消接口','检查服务端是否有自动清理策略','定期清理未完成的 multipart upload','监控存储桶中的未完成上传'] },
];

const catAEntries = catA.map(s => makeEntry({
  code: s.code, message: s.msg, severity: s.sev, category: 'A. API 与网络',
  location: '页面：任意需联网工具 → 区域：网络请求层',
  cause: s.cause, solution: s.sol, steps: s.steps,
  prevention: '定期检查 API 配置、网络环境和证书有效期。'
})).join('\n');

console.log('Inserting', catA.length, 'entries for category A...');
if (insertBeforeCategoryEnd('A', catAEntries)) {
  console.log('Category A inserted successfully');
} else {
  console.error('Failed to insert category A');
  process.exit(1);
}

fs.writeFileSync(file, content);
console.log('Done! File saved.');
