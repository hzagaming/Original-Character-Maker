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

// ===== Category B: Config & Data =====
const catB = [
  { code: 'ENV_FILE_MISSING', msg: '环境变量文件 .env 缺失', sev: 'critical', cause: '项目根目录缺少 .env 文件，导致所有环境变量未加载。', sol: '复制 .env.example 为 .env 并填写必要配置。', steps: ['复制 .env.example 为 .env','填写所有必填的环境变量','重启应用使配置生效','检查日志确认配置已加载'] },
  { code: 'ENV_VARIABLE_EMPTY', msg: '环境变量值为空', sev: 'critical', cause: '.env 文件中存在键但没有值，或值仅包含空白字符。', sol: '为所有必填环境变量提供有效值。', steps: ['检查 .env 文件中是否有空值','为缺失的变量提供有效值','移除不必要的空行','重启应用'] },
  { code: 'ENV_VARIABLE_SYNTAX_ERROR', msg: '环境变量语法错误', sev: 'error', cause: '.env 文件中存在语法错误（如等号两侧有空格、值未加引号包含空格）。', sol: '修正 .env 文件语法，值包含空格时使用引号包裹。', steps: ['检查等号两侧是否有空格','值包含空格时用双引号包裹','移除非法字符','使用 dotenv 解析器验证'] },
  { code: 'ENV_VARIABLE_TYPE_MISMATCH', msg: '环境变量类型不匹配', sev: 'error', cause: '环境变量被解析为错误类型（如数字变量包含非数字字符、布尔变量不为 true/false）。', sol: '检查环境变量格式，确保与代码期望的类型一致。', steps: ['检查变量的实际值','确认代码期望的类型','进行必要的类型转换','添加输入验证'] },
  { code: 'CONFIG_FILE_PARSE_ERROR', msg: '配置文件解析错误', sev: 'critical', cause: 'JSON/YAML/TOML 配置文件格式不正确（如缺少逗号、括号不匹配、缩进错误）。', sol: '使用格式验证工具检查并修复配置文件。', steps: ['使用 JSON/YAML 验证工具检查文件','查找并修复语法错误','恢复到最后一个已知良好的版本','重新加载配置'] },
  { code: 'CONFIG_FILE_NOT_FOUND', msg: '配置文件未找到', sev: 'critical', cause: '指定的配置文件路径不存在或文件名拼写错误。', sol: '确认配置文件路径正确，或创建默认配置文件。', steps: ['检查文件路径是否正确','确认文件名拼写无误','创建缺失的配置文件','更新配置加载路径'] },
  { code: 'CONFIG_SCHEMA_VALIDATION_FAILED', msg: '配置模式验证失败', sev: 'error', cause: '配置文件内容不符合预期的模式（如缺少必填字段、字段类型错误、值超出范围）。', sol: '根据模式定义修正配置值。', steps: ['查看模式验证错误详情','修正缺失或错误的字段','确认字段类型和取值范围','重新验证配置'] },
  { code: 'CONFIG_VERSION_INCOMPATIBLE', msg: '配置版本不兼容', sev: 'error', cause: '当前配置文件版本与应用程序期望的版本不匹配。', sol: '升级或降级配置文件，或运行迁移脚本。', steps: ['查看当前配置版本','查看应用期望的配置版本','运行配置迁移脚本','手动调整不兼容的字段'] },
  { code: 'CONFIG_CIRCULAR_REFERENCE', msg: '配置存在循环引用', sev: 'error', cause: '配置文件中使用了变量引用，但形成了循环依赖（A 引用 B，B 引用 A）。', sol: '重构配置，消除循环引用。', steps: ['识别循环引用链','重构配置结构','使用绝对路径替代相对引用','添加配置解析深度限制'] },
  { code: 'CONFIG_OVERRIDE_CONFLICT', msg: '配置覆盖冲突', sev: 'warning', cause: '多个配置源（文件、环境变量、命令行参数）对同一键提供了不同的值。', sol: '明确配置优先级，确保使用预期的值。', steps: ['了解配置加载优先级顺序','检查各配置源的值','明确指定最终生效的配置值','统一配置管理方式'] },
  { code: 'DATABASE_CONNECTION_STRING_INVALID', msg: '数据库连接字符串无效', sev: 'critical', cause: '数据库 URL 格式不正确（如缺少协议、错误的端口、非法字符）。', sol: '按照数据库文档修正连接字符串格式。', steps: ['检查连接字符串格式','确认协议正确（postgresql://、mongodb:// 等）','验证主机名、端口、数据库名','测试连接字符串'] },
  { code: 'DATABASE_CONNECTION_TIMEOUT', msg: '数据库连接超时', sev: 'critical', cause: '数据库服务器无响应，可能是网络问题、数据库过载或防火墙阻止。', sol: '检查数据库服务状态和网络连通性。', steps: ['测试到数据库服务器的网络连通性','检查数据库服务是否运行','确认防火墙允许数据库端口','增加连接超时设置'] },
  { code: 'DATABASE_AUTH_FAILED', msg: '数据库认证失败', sev: 'critical', cause: '数据库用户名或密码错误，或用户没有访问该数据库的权限。', sol: '检查数据库凭据，确认用户权限。', steps: ['确认用户名和密码正确','检查用户是否有数据库访问权限','重置数据库密码','检查数据库日志'] },
  { code: 'DATABASE_SSL_REQUIRED', msg: '数据库要求 SSL 连接', sev: 'error', cause: '数据库服务器强制要求 SSL/TLS 连接，但客户端未启用。', sol: '在连接配置中启用 SSL。', steps: ['在连接字符串中添加 sslmode=require','配置 SSL 证书路径','检查数据库服务器的 SSL 配置','测试 SSL 连接'] },
  { code: 'DATABASE_POOL_EXHAUSTED', msg: '数据库连接池耗尽', sev: 'critical', cause: '所有数据库连接都被占用且未及时释放，导致新请求无法获取连接。', sol: '增加连接池大小，或检查连接泄漏。', steps: ['增加连接池最大连接数','检查是否有连接未正确释放','优化查询减少连接占用时间','实现连接超时自动回收'] },
  { code: 'DATABASE_QUERY_TIMEOUT', msg: '数据库查询超时', sev: 'error', cause: 'SQL 查询执行时间过长，超过了设置的超时阈值。', sol: '优化查询语句，添加索引，或增加超时时间。', steps: ['分析查询执行计划','添加合适的索引','重写低效的查询','增加查询超时设置'] },
  { code: 'DATABASE_DEADLOCK_DETECTED', msg: '数据库死锁检测', sev: 'critical', cause: '两个或多个事务互相等待对方释放锁，形成死锁。', sol: '数据库会自动回滚其中一个事务，应用层应捕获错误并重试。', steps: ['捕获死锁错误并重试事务','调整事务中访问表的顺序','减少事务持有锁的时间','使用更细粒度的锁'] },
  { code: 'DATABASE_UNIQUE_CONSTRAINT_VIOLATION', msg: '数据库唯一约束冲突', sev: 'error', cause: '插入或更新数据时违反了唯一性约束（如重复的主键、唯一索引）。', sol: '检查数据是否已存在，使用 UPSERT 或先查询再插入。', steps: ['查询确认数据是否已存在','使用 INSERT ... ON CONFLICT (UPSERT)','或者先 DELETE 再 INSERT','检查唯一索引定义'] },
  { code: 'DATABASE_FOREIGN_KEY_VIOLATION', msg: '数据库外键约束冲突', sev: 'error', cause: '插入或更新数据时引用了不存在的外键值。', sol: '确保引用的数据已存在，或禁用外键检查（不推荐）。', steps: ['确认引用的外键值在关联表中存在','先插入关联表数据，再插入主表','检查外键约束定义','仅在必要时临时禁用外键'] },
  { code: 'DATABASE_CHECK_CONSTRAINT_VIOLATION', msg: '数据库检查约束冲突', sev: 'error', cause: '数据值不满足 CHECK 约束条件（如年龄必须大于 0）。', sol: '修正数据值使其满足约束条件。', steps: ['查看 CHECK 约束定义','修正数据值','或者在必要时修改约束条件','添加应用层数据验证'] },
  { code: 'DATABASE_MIGRATION_FAILED', msg: '数据库迁移失败', sev: 'critical', cause: '执行数据库迁移脚本时出错（如 SQL 语法错误、约束冲突、表已存在）。', sol: '查看迁移日志，修复 SQL 错误，或手动回滚。', steps: ['查看迁移错误日志','修复 SQL 语法错误','如果部分迁移已执行，手动清理','重新运行迁移'] },
  { code: 'DATABASE_MIGRATION_LOCK_HELD', msg: '数据库迁移锁被持有', sev: 'warning', cause: '另一个进程正在执行迁移，当前进程无法获取迁移锁。', sol: '等待其他迁移完成，或手动释放迁移锁。', steps: ['检查是否有其他进程在运行迁移','等待迁移完成','如果迁移进程已崩溃，手动清理锁表','重新运行迁移'] },
  { code: 'DATABASE_MIGRATION_DIRTY_STATE', msg: '数据库迁移处于脏状态', sev: 'critical', cause: '上一次迁移失败导致数据库处于不一致状态。', sol: '手动修复数据库状态，或重置迁移记录。', steps: ['查看迁移历史表','确定失败的迁移步骤','手动执行或回滚失败的迁移','更新迁移记录表'] },
  { code: 'CACHE_CONNECTION_FAILED', msg: '缓存服务连接失败', sev: 'error', cause: 'Redis/Memcached 等缓存服务器未启动或网络不可达。', sol: '检查缓存服务状态，确认连接配置正确。', steps: ['检查缓存服务器是否运行','测试网络连通性','确认连接地址和端口正确','检查认证密码'] },
  { code: 'CACHE_KEY_TOO_LARGE', msg: '缓存键过大', sev: 'warning', cause: '缓存键长度超过了缓存服务器的限制（Redis 最大 512MB 键，但建议更小）。', sol: '使用哈希函数缩短键名，或重构缓存策略。', steps: ['计算键的实际长度','使用 MD5/SHA256 哈希缩短键','重构缓存键命名策略','避免将整个查询作为键'] },
  { code: 'CACHE_VALUE_TOO_LARGE', msg: '缓存值过大', sev: 'warning', cause: '缓存值大小超过了建议限制，影响性能和内存使用。', sol: '压缩缓存值，或拆分大数据为多个小缓存。', steps: ['检查缓存值大小','使用压缩算法（如 gzip）','将大数据拆分为多个小键','或者不使用缓存直接查询'] },
  { code: 'CACHE_TTL_INVALID', msg: '缓存过期时间无效', sev: 'error', cause: '设置的 TTL（生存时间）为负数或超过缓存服务器支持的最大值。', sol: '设置合理的 TTL 值（正整数，通常在秒级）。', steps: ['检查 TTL 值是否为正数','确认单位正确（秒 vs 毫秒）','设置合理的过期时间','对于永久缓存使用特殊值或不设置 TTL'] },
  { code: 'CACHE_SERIALIZATION_ERROR', msg: '缓存序列化错误', sev: 'error', cause: '尝试缓存的对象无法被正确序列化（如包含循环引用、函数、Symbol）。', sol: '确保缓存对象可 JSON 序列化，或使用专用序列化库。', steps: ['检查对象是否可 JSON.stringify','移除函数、Symbol、循环引用','使用 msgpack 等二进制序列化','或者只缓存简单数据类型'] },
  { code: 'CACHE_DESERIALIZATION_ERROR', msg: '缓存反序列化错误', sev: 'error', cause: '从缓存读取的数据无法被正确反序列化（如数据损坏、版本不兼容）。', sol: '检查缓存数据的完整性，确认序列化版本一致。', steps: ['检查缓存数据的完整性','确认序列化/反序列化版本一致','添加数据版本号','在反序列化失败时回退到数据源'] },
  { code: 'CACHE_STAMPEDE_DETECTED', msg: '缓存雪崩检测', sev: 'critical', cause: '大量缓存同时过期，导致所有请求同时打到数据库。', sol: '使用锁或互斥机制防止同时重建缓存。', steps: ['为缓存过期时间添加随机偏移','使用互斥锁保证只有一个请求重建缓存','实现提前异步刷新机制','增加数据库连接池应对突发流量'] },
  { code: 'CACHE_PENETRATION_DETECTED', msg: '缓存穿透检测', sev: 'warning', cause: '大量请求查询不存在的数据，绕过缓存直接查询数据库。', sol: '对不存在的数据也缓存空结果（设置较短 TTL）。', steps: ['对查询结果为空的数据也写入缓存','设置较短的空值 TTL','使用布隆过滤器预判数据是否存在','添加请求频率限制'] },
  { code: 'CACHE_BREAKDOWN_DETECTED', msg: '缓存击穿检测', sev: 'warning', cause: '某个热点数据过期瞬间，大量请求同时查询该数据。', sol: '使用互斥锁或逻辑过期防止同时重建。', steps: ['热点数据永不过期或逻辑过期','使用互斥锁重建缓存','提前异步刷新即将过期的热点数据','多级缓存（本地 + 远程）'] },
  { code: 'JSON_PARSE_ERROR', msg: 'JSON 解析错误', sev: 'error', cause: '字符串不是有效的 JSON 格式（如缺少引号、多余的逗号、非法字符）。', sol: '使用 JSON 验证工具检查并修复格式。', steps: ['使用 JSONLint 等工具验证','检查引号是否成对','移除多余的逗号','确保没有注释（JSON 不支持注释）'] },
  { code: 'JSON_STRINGIFY_ERROR', msg: 'JSON 序列化错误', sev: 'error', cause: '对象包含循环引用、BigInt、函数等无法序列化的值。', sol: '清理对象，移除不可序列化的属性。', steps: ['检查对象是否有循环引用','将 BigInt 转为字符串','移除函数和 Symbol','使用自定义 replacer 函数'] },
  { code: 'XML_PARSE_ERROR', msg: 'XML 解析错误', sev: 'error', cause: '字符串不是有效的 XML 格式（如标签未闭合、非法字符、编码错误）。', sol: '使用 XML 验证工具检查并修复格式。', steps: ['检查标签是否正确闭合','确认 XML 声明和编码','转义特殊字符（<、>、&）','使用 XML 解析器的错误定位'] },
  { code: 'YAML_PARSE_ERROR', msg: 'YAML 解析错误', sev: 'error', cause: 'YAML 文件格式不正确（如缩进错误、非法字符、循环引用）。', sol: '使用 YAML 验证工具检查并修复格式。', steps: ['检查缩进是否使用空格（不能用 Tab）','确认键值对格式正确','检查是否有循环引用','使用 YAML 解析器的详细错误信息'] },
  { code: 'CSV_PARSE_ERROR', msg: 'CSV 解析错误', sev: 'error', cause: 'CSV 文件格式不正确（如引号不匹配、分隔符不一致、换行符问题）。', sol: '使用 CSV 验证工具检查，或指定正确的分隔符和引号规则。', steps: ['检查引号是否成对闭合','确认分隔符一致（逗号/分号/制表符）','处理包含换行符的字段','使用 CSV 解析库的配置选项'] },
  { code: 'DATA_VALIDATION_FAILED', msg: '数据验证失败', sev: 'error', cause: '输入数据不符合预期的验证规则（如必填项缺失、格式错误、值超出范围）。', sol: '根据验证错误信息修正数据。', steps: ['查看验证错误详情','修正缺失或错误的字段','确认数据类型和格式','添加客户端预验证'] },
  { code: 'DATA_TYPE_CONVERSION_ERROR', msg: '数据类型转换错误', sev: 'error', cause: '尝试将数据从一种类型转换为另一种类型时失败（如字符串转数字包含字母）。', sol: '确保源数据格式正确，或使用安全的转换方法。', steps: ['检查源数据的实际格式','使用 Number()、parseInt() 等安全转换','对转换结果进行有效性检查','使用类型守卫函数'] },
  { code: 'DATA_TRUNCATION_ERROR', msg: '数据截断错误', sev: 'warning', cause: '数据长度超过了目标字段的最大限制，被截断或拒绝。', sol: '缩短数据长度，或增加字段限制。', steps: ['检查数据实际长度','缩短数据或分段存储','增加数据库字段长度限制','在应用层添加长度验证'] },
  { code: 'DATA_ENCRYPTION_ERROR', msg: '数据加密错误', sev: 'critical', cause: '加密过程中出错（如密钥无效、算法不支持、数据格式错误）。', sol: '检查密钥和算法配置，确保数据格式正确。', steps: ['确认密钥长度符合算法要求','检查加密算法是否受支持','确认数据是 Buffer 或字符串','查看加密库的错误详情'] },
  { code: 'DATA_DECRYPTION_ERROR', msg: '数据解密错误', sev: 'critical', cause: '解密过程中出错（如密钥错误、数据损坏、算法不匹配）。', sol: '确认使用正确的密钥和算法，检查数据完整性。', steps: ['确认解密密钥与加密时一致','检查加密算法是否匹配','确认数据未被截断或篡改','检查 IV/Nonce 是否正确传递'] },
  { code: 'DATA_HASH_MISMATCH', msg: '数据哈希不匹配', sev: 'critical', cause: '数据的校验和/哈希值与预期不符，说明数据在传输或存储过程中被篡改。', sol: '重新传输数据，或从备份恢复。', steps: ['重新计算数据的哈希值','与预期的哈希值对比','如果一致则可能是预期值错误','如果不一致则数据已损坏，需要重新获取'] },
  { code: 'DATA_INTEGRITY_CHECK_FAILED', msg: '数据完整性检查失败', sev: 'critical', cause: '数据的完整性校验失败（如校验和、数字签名、Merkle 树验证不通过）。', sol: '从可信源重新获取数据，或修复损坏的数据。', steps: ['确认校验算法和参数正确','从备份或原始源重新获取数据','检查存储介质是否有坏道','实现冗余校验机制'] },
  { code: 'DATA_MIGRATION_INCOMPLETE', msg: '数据迁移不完整', sev: 'critical', cause: '数据迁移过程中断，部分数据已迁移但部分未迁移，导致数据不一致。', sol: '回滚到迁移前状态，或补全缺失的数据。', steps: ['检查迁移日志确认已执行的步骤','对比源和目标数据量','补全缺失的数据','或者回滚并重新执行完整迁移'] },
  { code: 'DATA_BACKUP_CORRUPTED', msg: '数据备份损坏', sev: 'critical', cause: '备份文件损坏或校验失败，无法用于恢复。', sol: '使用其他备份副本，或重新创建备份。', steps: ['检查备份文件的完整性校验','尝试使用其他备份副本','如果所有备份都损坏，尝试数据恢复工具','建立多副本备份策略'] },
  { code: 'DATA_REPLICATION_LAG', msg: '数据复制延迟过大', sev: 'warning', cause: '主从复制延迟超过可接受范围，读取从库可能获取到旧数据。', sol: '检查复制性能，优化查询，或强制从主库读取。', steps: ['检查复制延迟监控','优化从库上的慢查询','增加从库资源或扩展读副本','对强一致性要求读取强制走主库'] },
  { code: 'DATA_REPLICATION_CONFLICT', msg: '数据复制冲突', sev: 'critical', cause: '多主复制或双向同步时，同一数据在不同节点被同时修改导致冲突。', sol: '实现冲突检测和解决策略（最后写入优先、合并、人工介入）。', steps: ['查看冲突日志和数据','选择冲突解决策略','合并数据或保留某个版本','实现冲突自动检测和通知'] },
  { code: 'DATA_SEEDING_FAILED', msg: '数据种子初始化失败', sev: 'error', cause: '应用启动时的初始数据加载失败（如种子文件缺失、格式错误）。', sol: '检查种子文件，修复格式，或手动插入初始数据。', steps: ['检查种子文件是否存在','验证种子文件格式','手动插入必要的初始数据','禁用种子加载（仅开发环境）'] },
  { code: 'DATA_EXPORT_FORMAT_ERROR', msg: '数据导出格式错误', sev: 'error', cause: '导出数据时指定的格式不受支持或参数错误。', sol: '检查支持的导出格式列表，使用正确的格式参数。', steps: ['查看支持的导出格式（CSV/JSON/XML/Excel）','检查格式参数拼写','确认导出字段列表正确','测试小数据量导出'] },
  { code: 'DATA_IMPORT_FORMAT_ERROR', msg: '数据导入格式错误', sev: 'error', cause: '导入文件格式不正确或包含无法解析的数据。', sol: '检查导入文件格式，确保与预期模板一致。', steps: ['查看导入模板格式','验证导入文件是否符合模板','检查必填字段是否齐全','测试小数据量导入'] },
  { code: 'DATA_IMPORT_DUPLICATE_KEY', msg: '数据导入存在重复键', sev: 'warning', cause: '导入的数据中包含已存在的主键或唯一键值。', sol: '使用 UPSERT 模式导入，或先删除重复数据。', steps: ['检查导入数据中的键值','使用 UPSERT/REPLACE 模式','或者先清空目标表再导入','添加去重逻辑'] },
  { code: 'DATA_IMPORT_CONSTRAINT_VIOLATION', msg: '数据导入违反约束', sev: 'error', cause: '导入的数据违反了数据库约束（如外键、检查约束、非空约束）。', sol: '清洗导入数据，确保满足所有约束条件。', steps: ['查看具体的约束违反详情','清洗或修正违反约束的数据','临时禁用约束（不推荐生产环境）','分批导入并验证'] },
];

const catBEntries = catB.map(s => makeEntry({
  code: s.code, message: s.msg, severity: s.sev, category: 'B. 配置与数据',
  location: '页面：任意工具 → 区域：配置加载或数据处理',
  cause: s.cause, solution: s.sol, steps: s.steps,
  prevention: '使用配置验证工具，定期备份数据，实施 schema 版本控制。'
})).join('\n');

console.log('Inserting', catB.length, 'entries for category B...');
if (!insertBeforeCategoryEnd('B', catBEntries)) {
  console.error('Failed to insert category B');
  process.exit(1);
}

// ===== Category C: Files & Input =====
const catC = [
  { code: 'FILE_CORRUPTED', msg: '文件已损坏', sev: 'critical', cause: '文件在传输或存储过程中损坏（如网络中断、磁盘坏道、内存错误）。', sol: '重新下载或重新生成文件，检查存储介质健康状态。', steps: ['尝试重新下载/上传文件','检查文件哈希值是否与原始一致','使用文件修复工具','检查磁盘健康状态（SMART）'] },
  { code: 'FILE_INCOMPLETE_DOWNLOAD', msg: '文件下载不完整', sev: 'error', cause: '下载过程中连接中断，文件只下载了一部分。', sol: '重新下载文件，或使用断点续传。', steps: ['删除不完整的文件','重新下载','如果支持，使用 Range 请求断点续传','检查网络稳定性'] },
  { code: 'FILE_ENCODING_MISMATCH', msg: '文件编码不匹配', sev: 'error', cause: '文件实际编码与声明的编码不一致（如声明 UTF-8 但实际是 GBK）。', sol: '使用正确的编码重新读取文件，或使用编码检测工具。', steps: ['使用文件编码检测工具（如 chardet）','尝试用不同编码打开','将文件转换为正确的编码','在代码中明确指定编码'] },
  { code: 'FILE_BOM_CONFLICT', msg: '文件 BOM 头冲突', sev: 'warning', cause: 'UTF-8 文件包含 BOM 头，但解析器未正确处理，导致首字符解析错误。', sol: '移除 BOM 头，或配置解析器正确处理 BOM。', steps: ['使用编辑器查看是否有 BOM','移除 BOM 头（如使用 sed）','配置解析器自动处理 BOM','统一团队文件编码规范'] },
  { code: 'FILE_LINE_ENDING_MISMATCH', msg: '文件换行符不匹配', sev: 'warning', cause: 'Windows (CRLF) 和 Unix (LF) 换行符混用，导致脚本或解析器行为异常。', sol: '统一换行符为 LF，或使用支持两种换行符的工具。', steps: ['使用 dos2unix 或 unix2dos 转换','配置编辑器自动处理换行符','在 .gitattributes 中指定换行符','使用支持 CRLF/LF 的解析器'] },
  { code: 'FILE_HIDDEN_ATTRIBUTE', msg: '文件被设置为隐藏', sev: 'info', cause: '文件具有隐藏属性，在默认文件浏览器中不可见。', sol: '显示隐藏文件，或移除隐藏属性。', steps: ['在文件浏览器中显示隐藏文件','使用命令行移除隐藏属性（attrib -h）','检查文件权限','确认文件未被恶意软件隐藏'] },
  { code: 'FILE_SYSTEM_READONLY', msg: '文件系统只读', sev: 'critical', cause: '文件系统被挂载为只读，或磁盘出现错误自动切换为只读模式。', sol: '检查磁盘健康，重新挂载为读写模式，或修复文件系统。', steps: ['检查磁盘挂载选项','运行文件系统检查（fsck/chkdsk）','检查磁盘 SMART 状态','备份数据并更换故障磁盘'] },
  { code: 'FILE_HARD_LINK_LIMIT', msg: '文件硬链接数达到上限', sev: 'error', cause: '文件系统的硬链接数量达到上限（如 ext4 默认 65000）。', sol: '删除不必要的硬链接，或使用软链接替代。', steps: ['检查文件的硬链接数（ls -l）','删除不必要的硬链接','使用符号链接（软链接）替代','考虑使用支持更多硬链接的文件系统'] },
  { code: 'FILE_SYMBOLIC_LINK_BROKEN', msg: '符号链接已损坏', sev: 'error', cause: '符号链接指向的目标文件或目录已不存在。', sol: '删除损坏的符号链接，或重新创建指向正确目标的链接。', steps: ['检查符号链接指向的目标是否存在','删除损坏的链接（rm 链接名）','重新创建符号链接（ln -s）','检查目标路径是否正确'] },
  { code: 'FILE_SYMBOLIC_LINK_LOOP', msg: '符号链接循环', sev: 'error', cause: '符号链接形成了循环引用（A 指向 B，B 指向 A）。', sol: '删除造成循环的符号链接，重新组织目录结构。', steps: ['使用 find -follow 检测循环','删除造成循环的链接','重新规划目录结构','使用绝对路径创建链接'] },
  { code: 'FILE_NAME_TOO_LONG', msg: '文件名过长', sev: 'error', cause: '文件名或路径长度超过了文件系统限制（如 ext4 255 字符，NTFS 260 字符）。', sol: '缩短文件名或路径，或使用支持长路径的文件系统。', steps: ['缩短文件名','将文件移到更浅的目录','在 Windows 启用长路径支持','使用支持长路径的文件系统'] },
  { code: 'FILE_PATH_TOO_DEEP', msg: '目录嵌套太深', sev: 'error', cause: '文件路径的目录层级太深，超过操作系统或文件系统限制。', sol: '减少目录嵌套层级，或将文件移到更浅的位置。', steps: ['减少目录层级','使用扁平化的目录结构','将深层文件移到根目录附近','检查操作系统的路径长度限制'] },
  { code: 'FILE_ILLEGAL_CHARACTERS', msg: '文件名包含非法字符', sev: 'error', cause: '文件名包含文件系统不支持的字符（如 / \ : * ? " < > |）。', sol: '移除非法字符，使用安全的文件名。', steps: ['检查文件名中的非法字符','移除或替换为下划线/连字符','使用文件名清理函数','在保存前验证文件名'] },
  { code: 'FILE_RESERVED_NAME', msg: '使用了系统保留文件名', sev: 'error', cause: '文件名与系统保留名冲突（如 Windows 的 CON、PRN、AUX、NUL、COM1 等）。', sol: '使用不同的文件名，避免系统保留名。', steps: ['检查是否是系统保留名','修改文件名','添加前缀或后缀区分','查阅操作系统的保留名列表'] },
  { code: 'FILE_CASE_SENSITIVITY_CONFLICT', msg: '文件名大小写冲突', sev: 'warning', cause: '在不区分大小写的文件系统（如 macOS 默认 APFS、Windows NTFS）上，File.txt 和 file.txt 被视为同一文件。', sol: '统一文件名大小写规范，或迁移到区分大小写的文件系统。', steps: ['统一使用小写文件名','使用 kebab-case 或 snake_case','避免仅大小写不同的文件名','在区分大小写的文件系统上开发'] },
  { code: 'FILE_PERMISSION_DENIED_READ', msg: '文件读取权限被拒绝', sev: 'error', cause: '当前用户没有读取该文件的权限。', sol: '修改文件权限，或以具有权限的用户身份运行。', steps: ['检查文件权限（ls -l）','使用 chmod 添加读权限','确认文件所有者正确','以管理员/root 身份运行'] },
  { code: 'FILE_PERMISSION_DENIED_WRITE', msg: '文件写入权限被拒绝', sev: 'error', cause: '当前用户没有写入该文件的权限。', sol: '修改文件权限，或将文件移到可写目录。', steps: ['检查文件和目录的写权限','使用 chmod 添加写权限','将文件移到用户可写目录','检查目录是否只读挂载'] },
  { code: 'FILE_PERMISSION_DENIED_EXECUTE', msg: '文件执行权限被拒绝', sev: 'error', cause: '当前用户没有执行该文件的权限（常见于脚本和二进制文件）。', sol: '添加执行权限，或检查文件是否真的是可执行文件。', steps: ['使用 chmod +x 添加执行权限','检查文件头确认是可执行格式','确认文件没有被损坏','检查文件系统挂载选项（noexec）'] },
  { code: 'FILE_LOCKED_BY_ANOTHER_PROCESS', msg: '文件被其他进程锁定', sev: 'error', cause: '另一个进程正在使用该文件并持有锁，当前进程无法访问。', sol: '关闭占用文件的进程，或等待其释放锁。', steps: ['查找占用文件的进程（lsof/fuser）','终止占用进程','等待文件释放','使用文件锁超时机制'] },
  { code: 'FILE_QUOTA_EXCEEDED', msg: '用户磁盘配额超限', sev: 'critical', cause: '当前用户的磁盘使用量超过了管理员设置的配额限制。', sol: '删除不必要的文件，或联系管理员增加配额。', steps: ['查看当前磁盘使用情况（du）','删除大文件或旧文件','压缩文件节省空间','联系管理员增加配额'] },
  { code: 'FILE_INODE_EXHAUSTED', msg: '文件系统 inode 耗尽', sev: 'critical', cause: '文件系统中创建的文件数量达到了 inode 上限（常见于大量小文件）。', sol: '删除不必要的文件，或重新创建具有更多 inode 的文件系统。', steps: ['查看 inode 使用情况（df -i）','删除大量小文件','合并小文件为归档文件','重新创建文件系统并增加 inode 数量'] },
  { code: 'FILE_SYSTEM_FULL', msg: '文件系统已满', sev: 'critical', cause: '磁盘分区使用率达到了 100%，无法写入新数据。', sol: '清理磁盘空间，删除不必要的文件，或扩展磁盘容量。', steps: ['查看磁盘使用情况（df -h）','找出大文件并删除或归档','清理日志和临时文件','扩展磁盘分区'] },
  { code: 'FILE_TEMP_DIRECTORY_UNWRITABLE', msg: '临时目录不可写', sev: 'critical', cause: '系统临时目录（/tmp、C:\\Windows\\Temp）不可写或已满。', sol: '清理临时目录，或指定其他可写的临时目录。', steps: ['检查临时目录的写权限','清理临时文件','设置 TMPDIR/TEMP 环境变量指向可写目录','重启应用'] },
  { code: 'FILE_UPLOAD_INTERRUPTED', msg: '文件上传中断', sev: 'error', cause: '上传过程中网络中断、浏览器关闭或用户取消。', sol: '重新上传文件，或使用断点续传。', steps: ['检查网络连接','重新选择文件上传','如果支持断点续传，继续上传','监控上传进度'] },
  { code: 'FILE_UPLOAD_SIZE_MISMATCH', msg: '上传文件大小不匹配', sev: 'error', cause: '客户端声明的文件大小与实际上传的大小不一致。', sol: '重新上传文件，或检查文件是否在传输中被修改。', steps: ['重新上传文件','检查文件在传输中是否被压缩或修改','验证文件完整性','检查代理是否修改了请求'] },
  { code: 'FILE_UPLOAD_CHECKSUM_MISMATCH', msg: '上传文件校验和不匹配', sev: 'error', cause: '上传完成后服务端计算的校验和与客户端提供的不一致，说明传输过程中数据损坏。', sol: '重新上传文件，或检查网络稳定性。', steps: ['重新上传文件','检查网络稳定性','使用更强的校验算法','如果多次失败，检查网卡或网线'] },
  { code: 'FILE_UPLOAD_VIRUS_DETECTED', msg: '上传文件包含病毒', sev: 'critical', cause: '文件上传后被杀毒软件检测到恶意代码。', sol: '删除文件，使用可信来源的文件，或检查是否为误报。', steps: ['立即删除被感染的文件','使用其他杀毒软件交叉验证','如果是误报，添加到白名单','仅从可信来源下载文件'] },
  { code: 'FILE_UPLOAD_CONTENT_TYPE_SPOOFED', msg: '上传文件内容类型伪造', sev: 'critical', cause: '上传的文件扩展名与其实际内容不匹配（如将 .exe 重命名为 .jpg 上传）。', sol: '服务端验证文件魔数（magic number），不仅检查扩展名。', steps: ['服务端检查文件魔数而非扩展名','拒绝内容类型不匹配的文件','使用文件类型检测库','记录并审计可疑上传'] },
  { code: 'FILE_UPLOAD_PATH_TRAVERSAL', msg: '上传路径遍历攻击', sev: 'critical', cause: '上传文件名包含 ../ 等路径遍历字符，试图将文件写到非预期目录。', sol: '严格过滤文件名，只允许合法字符，将文件写到隔离目录。', steps: ['过滤文件名中的路径分隔符和 ..','使用 UUID 作为存储文件名','将上传文件存储在隔离目录','禁止根据用户输入决定存储路径'] },
  { code: 'FILE_DOWNLOAD_INTERRUPTED', msg: '文件下载中断', sev: 'error', cause: '下载过程中网络中断、浏览器关闭或磁盘空间不足。', sol: '重新下载文件，或使用断点续传。', steps: ['检查网络连接','确认磁盘有足够空间','重新下载','使用支持断点续传的下载工具'] },
  { code: 'FILE_DOWNLOAD_REDIRECT_LOOP', msg: '文件下载重定向循环', sev: 'error', cause: '下载 URL 发生了循环重定向（A → B → A）。', sol: '检查下载链接，手动跟随重定向链。', steps: ['使用 curl -v 查看重定向链','检查服务器重定向配置','使用直接下载链接','限制最大重定向次数'] },
  { code: 'FILE_DOWNLOAD_MIME_TYPE_MISMATCH', msg: '下载文件 MIME 类型不匹配', sev: 'warning', cause: '下载文件的 Content-Type 与文件扩展名不一致。', sol: '验证文件实际内容，不要仅依赖扩展名或 MIME 类型。', steps: ['检查响应头的 Content-Type','验证文件魔数','如果内容正常则忽略警告','如果是恶意文件则删除'] },
  { code: 'FILE_ARCHIVE_CORRUPTED', msg: '压缩文件已损坏', sev: 'error', cause: '压缩文件（zip/rar/7z）在传输中损坏或下载不完整。', sol: '重新下载压缩文件，或尝试修复。', steps: ['重新下载压缩文件','尝试用压缩软件的修复功能','检查文件哈希值','使用更可靠的传输方式'] },
  { code: 'FILE_ARCHIVE_PASSWORD_REQUIRED', msg: '压缩文件需要密码', sev: 'info', cause: '压缩文件被密码保护，无法直接解压。', sol: '输入正确的解压密码。', steps: ['获取压缩文件的密码','在解压工具中输入密码','如果忘记密码，尝试联系文件提供者','不要使用暴力破解他人文件'] },
  { code: 'FILE_ARCHIVE_UNSUPPORTED_FORMAT', msg: '不支持的压缩格式', sev: 'error', cause: '压缩文件使用了不受支持的格式（如 rar5、lzma2）。', sol: '使用支持该格式的解压软件，或要求提供者使用标准格式。', steps: ['确认压缩文件格式','安装支持该格式的软件','要求提供者使用 zip 格式','使用在线转换工具'] },
  { code: 'FILE_IMAGE_DECOMPRESSION_BOMB', msg: '图片解压炸弹检测', sev: 'critical', cause: '上传的图片是压缩炸弹（zip bomb 的图像版本），解压后会消耗极多内存。', sol: '限制图片解压后的最大尺寸，拒绝可疑文件。', steps: ['限制图片最大像素尺寸','检查图片压缩比是否异常','使用流式解码避免一次性加载','拒绝超高压缩比的图片'] },
  { code: 'FILE_AUDIO_UNSUPPORTED_CODEC', msg: '不支持的音频编解码器', sev: 'error', cause: '音频文件使用了浏览器或应用不支持的编解码器（如 FLAC、ALAC）。', sol: '将音频转换为支持的格式（MP3、AAC、OGG、WAV）。', steps: ['确认音频文件的编码格式','使用 FFmpeg 转换为 MP3/AAC','检查浏览器支持的音频格式列表','提供多种格式供用户选择'] },
  { code: 'FILE_VIDEO_UNSUPPORTED_CODEC', msg: '不支持的视频编解码器', sev: 'error', cause: '视频文件使用了浏览器或应用不支持的编解码器（如 H.265/HEVC、AV1）。', sol: '将视频转换为支持的格式（H.264、VP9）。', steps: ['确认视频文件的编码格式','使用 FFmpeg 转换为 H.264','检查浏览器支持的视频格式','提供多种格式或转码服务'] },
  { code: 'FILE_DOCUMENT_MALFORMED', msg: '文档格式损坏', sev: 'error', cause: '文档文件（PDF、DOCX 等）结构损坏，无法正确解析。', sol: '尝试用其他软件打开，或从备份恢复。', steps: ['尝试用不同软件打开','使用文档修复工具','从备份恢复','重新生成文档'] },
  { code: 'FILE_SCAN_OCR_FAILED', msg: '扫描件 OCR 识别失败', sev: 'error', cause: '扫描件图像质量差、文字模糊或语言不支持，导致 OCR 无法识别。', sol: '提高扫描分辨率，确保文字清晰，或使用支持该语言的 OCR 引擎。', steps: ['提高扫描分辨率（至少 300 DPI）','确保文字清晰不模糊','检查 OCR 是否支持该语言','对图像进行预处理（去噪、二值化）'] },
];

const catCEntries = catC.map(s => makeEntry({
  code: s.code, message: s.msg, severity: s.sev, category: 'C. 文件与输入',
  location: '页面：任意涉及文件操作的工具 → 区域：文件上传/下载/处理',
  cause: s.cause, solution: s.sol, steps: s.steps,
  prevention: '验证文件格式和大小，使用安全的文件名处理，定期清理临时文件。'
})).join('\n');

console.log('Inserting', catC.length, 'entries for category C...');
if (!insertBeforeCategoryEnd('C', catCEntries)) {
  console.error('Failed to insert category C');
  process.exit(1);
}

fs.writeFileSync(file, content);
console.log('Done! Categories B and C inserted.');
