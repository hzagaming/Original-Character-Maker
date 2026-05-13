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

// ===== Category F: System & Permissions =====
const catF = [
  { code: 'SYSTEM_MEMORY_EXHAUSTED', msg: '系统内存耗尽', sev: 'critical', cause: '应用程序或系统整体可用内存不足，可能触发 OOM Killer。', sol: '关闭不必要的应用，增加物理内存，或优化内存使用。', steps: ['查看内存使用情况（free/top）','关闭不必要的应用','增加交换空间（swap）','优化代码减少内存占用'] },
  { code: 'SYSTEM_SWAP_EXHAUSTED', msg: '系统交换空间耗尽', sev: 'critical', cause: '物理内存和交换空间都已用完，系统即将崩溃。', sol: '紧急释放内存，或增加交换空间。', steps: ['立即关闭非关键进程','增加交换文件或分区','检查是否有内存泄漏','考虑增加物理内存'] },
  { code: 'SYSTEM_CPU_OVERLOAD', msg: '系统 CPU 过载', sev: 'critical', cause: 'CPU 使用率持续 100%，系统响应极慢或无响应。', sol: '找出高 CPU 进程，优化或终止，或增加 CPU 核心。', steps: ['使用 top/htop 找出高 CPU 进程','分析该进程为何占用高 CPU','优化算法或降低负载','必要时终止进程'] },
  { code: 'SYSTEM_DISK_IO_OVERLOAD', msg: '系统磁盘 I/O 过载', sev: 'critical', cause: '磁盘 I/O 队列深度过大，读写操作严重延迟。', sol: '优化 I/O 模式，使用缓存，或升级到 SSD。', steps: ['使用 iostat 查看 I/O 状况','找出高 I/O 进程','优化数据库查询和索引','将频繁访问的数据移到 SSD'] },
  { code: 'SYSTEM_NETWORK_IO_OVERLOAD', msg: '系统网络 I/O 过载', sev: 'critical', cause: '网络带宽被占满，或网络包处理速度跟不上。', sol: '限制带宽使用，优化网络协议，或升级网络设备。', steps: ['使用 iftop/nethogs 查看网络流量','找出高带宽进程','实施流量限制（QoS）','升级网络带宽'] },
  { code: 'SYSTEM_FILE_DESCRIPTOR_EXHAUSTED', msg: '系统文件描述符耗尽', sev: 'critical', cause: '进程打开的文件句柄数超过了系统限制（ulimit）。', sol: '增加文件描述符限制，或关闭不必要的文件句柄。', steps: ['查看当前打开的文件数（lsof）','关闭不必要的文件和网络连接','增加 ulimit -n 限制','检查是否有文件句柄泄漏'] },
  { code: 'SYSTEM_PROCESS_LIMIT_EXCEEDED', msg: '系统进程数超限', sev: 'critical', cause: '系统中运行的进程数超过了最大限制（如 fork bomb）。', sol: '终止不必要的进程，或增加进程数限制。', steps: ['查看当前进程数（ps aux | wc -l）','终止不必要的进程','增加系统进程数限制','检查是否有进程泄漏'] },
  { code: 'SYSTEM_THREAD_LIMIT_EXCEEDED', msg: '系统线程数超限', sev: 'critical', cause: '单个进程创建的线程数超过了限制（如 /proc/sys/kernel/threads-max）。', sol: '减少线程数，使用线程池，或增加限制。', steps: ['查看当前线程数','使用线程池限制并发数','优化代码减少线程创建','增加系统线程限制'] },
  { code: 'SYSTEM_OUT_OF_INODES', msg: '系统 inode 耗尽', sev: 'critical', cause: '文件系统中创建的文件数量达到了 inode 上限。', sol: '删除不必要的文件，或重新格式化文件系统增加 inode。', steps: ['查看 inode 使用情况（df -i）','删除大量小文件','合并文件减少 inode 使用','重新创建文件系统'] },
  { code: 'SYSTEM_OUT_OF_PIDS', msg: '系统 PID 耗尽', sev: 'critical', cause: '系统中运行的进程/线程数达到了 PID 最大值（通常 32768）。', sol: '终止僵尸进程，或增加 PID 最大值。', steps: ['查看僵尸进程（ps aux | grep Z）','终止僵尸进程的父进程','增加 /proc/sys/kernel/pid_max','检查是否有进程泄漏'] },
  { code: 'SYSTEM_CLOCK_DRIFT', msg: '系统时钟漂移', sev: 'warning', cause: '系统时间与 NTP 服务器时间不一致，可能导致证书验证、日志排序等问题。', sol: '同步系统时间，启用 NTP 自动同步。', steps: ['使用 ntpdate 或 chronyc 同步时间','启用 systemd-timesyncd 或 ntpd','检查防火墙是否阻止了 NTP 端口','配置硬件时钟'] },
  { code: 'SYSTEM_TIMEZONE_MISMATCH', msg: '系统时区不匹配', sev: 'warning', cause: '应用程序期望的时区与系统时区不一致，导致时间解析错误。', sol: '统一使用 UTC 存储，在显示时转换时区。', steps: ['检查系统和应用的时区设置','数据库统一使用 UTC 存储','应用层进行时区转换','使用标准时区库（如 moment-timezone）'] },
  { code: 'SYSTEM_LOCALE_MISSING', msg: '系统 locale 缺失', sev: 'error', cause: '应用程序需要的 locale 未在系统中安装，导致字符编码或日期格式错误。', sol: '安装所需的 locale，或设置应用内 locale。', steps: ['查看系统可用 locale（locale -a）','安装缺失的 locale（locale-gen）','设置应用内 locale','使用 UTF-8 编码'] },
  { code: 'SYSTEM_KERNEL_TOO_OLD', msg: '系统内核版本过旧', sev: 'warning', cause: '应用程序需要较新的内核特性（如 cgroup v2、BPF、eBPF）。', sol: '升级内核到支持的版本。', steps: ['查看当前内核版本（uname -r）','查看应用要求的最低内核版本','升级内核','重启系统'] },
  { code: 'SYSTEM_LIBRARY_MISSING', msg: '系统库文件缺失', sev: 'critical', cause: '应用程序依赖的动态链接库（.so/.dll/.dylib）未找到。', sol: '安装缺失的库，或设置正确的库搜索路径。', steps: ['使用 ldd 查看缺失的库','安装对应的开发包','设置 LD_LIBRARY_PATH','静态链接关键库'] },
  { code: 'SYSTEM_LIBRARY_VERSION_MISMATCH', msg: '系统库版本不匹配', sev: 'critical', cause: '找到了库文件但版本不兼容（如需要 libssl 1.1 但系统只有 3.0）。', sol: '安装正确版本的库，或使用兼容层。', steps: ['查看库的版本要求','安装正确版本的库','使用符号链接兼容层','静态链接以避免依赖'] },
  { code: 'SYSTEM_LIBRARY_SYMBOL_NOT_FOUND', msg: '库符号未找到', sev: 'critical', cause: '库文件存在但缺少应用程序需要的符号（函数或变量）。', sol: '更新库到完整版本，或重新编译应用程序。', steps: ['使用 nm 或 objdump 查看符号','更新库到完整版本','重新编译应用程序','检查是否有版本混淆'] },
  { code: 'SYSTEM_SELINUX_DENIED', msg: 'SELinux 策略拒绝', sev: 'critical', cause: 'SELinux 安全策略阻止了应用程序的某些操作（如访问文件、网络连接）。', sol: '调整 SELinux 策略，或临时设置为 permissive 模式排查。', steps: ['查看 audit.log 中的 SELinux 拒绝记录','使用 audit2allow 生成策略','临时设置为 permissive 模式测试','应用新的 SELinux 策略'] },
  { code: 'SYSTEM_APPARMOR_DENIED', msg: 'AppArmor 策略拒绝', sev: 'critical', cause: 'AppArmor 安全策略阻止了应用程序的某些操作。', sol: '调整 AppArmor 配置文件，或临时禁用排查。', steps: ['查看 dmesg 中的 AppArmor 拒绝记录','编辑 AppArmor 配置文件','重新加载 AppArmor 策略','临时禁用测试（aa-disable）'] },
  { code: 'SYSTEM_CAPABILITIES_INSUFFICIENT', msg: 'Linux capabilities 不足', sev: 'critical', cause: '进程缺少执行某些操作所需的 capability（如 CAP_NET_BIND_SERVICE）。', sol: '为进程授予必要的 capabilities，或以 root 运行。', steps: ['查看需要的 capability','使用 setcap 授予 capability','或者在容器中以 privileged 运行','最小权限原则，只授予必要的 capability'] },
  { code: 'SYSTEM_SECCOMP_VIOLATION', msg: 'Seccomp 过滤器违规', sev: 'critical', cause: '进程尝试执行被 seccomp 过滤器禁止的系统调用。', sol: '更新 seccomp 配置文件允许必要的系统调用。', steps: ['查看被禁止的系统调用','更新 seccomp 配置文件','重新加载配置','测试应用功能'] },
  { code: 'SYSTEM_NAMESPACES_UNAVAILABLE', msg: 'Linux 命名空间不可用', sev: 'error', cause: '系统内核不支持某些命名空间（如 user namespace），影响容器运行。', sol: '升级内核，或启用命名空间支持。', steps: ['检查内核是否支持命名空间','启用 user namespace（sysctl kernel.unprivileged_userns_clone）','升级内核','检查容器运行时的配置'] },
  { code: 'SYSTEM_CGROUPS_UNAVAILABLE', msg: 'Linux cgroups 不可用', sev: 'error', cause: '系统未启用 cgroup，或挂载点不正确，影响资源限制。', sol: '启用并正确挂载 cgroup 文件系统。', steps: ['检查 /sys/fs/cgroup 挂载','启用 cgroup 支持','检查 systemd 是否正确初始化 cgroup','修复 cgroup 挂载配置'] },
  { code: 'SYSTEM_OOM_KILLER_TRIGGERED', msg: 'OOM Killer 被触发', sev: 'critical', cause: '系统内存不足，Linux OOM Killer 终止了某个进程。', sol: '增加内存，优化内存使用，或调整 OOM 分数。', steps: ['查看 dmesg 中的 OOM 日志','找出被终止的进程','优化该进程的内存使用','增加物理内存或交换空间'] },
  { code: 'SYSTEM_WATCHDOG_TIMEOUT', msg: '看门狗超时', sev: 'critical', cause: '系统或服务的看门狗定时器超时，触发重启。', sol: '检查服务健康状态，增加看门狗超时时间。', steps: ['查看看门狗日志','检查服务的健康检查端点','增加看门狗超时时间','优化服务启动时间'] },
  { code: 'SYSTEM_HARDWARE_FAILURE', msg: '系统硬件故障', sev: 'critical', cause: '硬件故障（如内存 ECC 错误、CPU 过热、磁盘坏道）。', sol: '检查硬件健康状态，更换故障部件。', steps: ['查看系统日志（dmesg/syslog）','运行硬件诊断工具','检查 CPU 温度','更换故障硬件'] },
  { code: 'SYSTEM_VIRTUALIZATION_ERROR', msg: '虚拟化层错误', sev: 'critical', cause: '虚拟机或容器运行时出错（如 KVM 错误、Docker 守护进程故障）。', sol: '重启虚拟化服务，或检查宿主机资源。', steps: ['重启虚拟化服务（docker/kvm）','检查宿主机资源','查看虚拟化日志','迁移到健康的宿主机'] },
  { code: 'SYSTEM_CONTAINER_EXITED', msg: '容器异常退出', sev: 'critical', cause: 'Docker/Kubernetes 容器因错误退出（非零退出码）。', sol: '查看容器日志，修复导致退出的问题。', steps: ['查看容器日志（docker logs）','检查退出码含义','修复应用程序错误','调整容器的资源限制'] },
  { code: 'SYSTEM_CONTAINER_OOM_KILLED', msg: '容器因 OOM 被终止', sev: 'critical', cause: '容器使用的内存超过了其内存限制，被系统 OOM Killer 终止。', sol: '增加容器内存限制，或优化应用内存使用。', steps: ['查看容器内存限制','增加 memory limit','优化应用减少内存使用','检查是否有内存泄漏'] },
  { code: 'SYSTEM_CONTAINER_IMAGE_PULL_FAILED', msg: '容器镜像拉取失败', sev: 'critical', cause: '无法从镜像仓库拉取容器镜像（如网络问题、认证失败、镜像不存在）。', sol: '检查网络、认证和镜像标签。', steps: ['检查网络连通性','确认镜像名称和标签正确','docker login 重新认证','检查镜像仓库状态'] },
  { code: 'SYSTEM_CONTAINER_VOLUME_MOUNT_FAILED', msg: '容器卷挂载失败', sev: 'critical', cause: '无法将宿主机目录挂载到容器中（如目录不存在、权限不足、SELinux 阻止）。', sol: '确认目录存在且有权限，检查 SELinux/AppArmor。', steps: ['确认宿主机目录存在','检查目录权限','检查 SELinux/AppArmor 策略','使用正确的挂载选项（:Z 或 :z）'] },
  { code: 'SYSTEM_CONTAINER_NETWORK_ERROR', msg: '容器网络错误', sev: 'critical', cause: '容器无法访问网络（如网桥配置错误、IP 冲突、防火墙阻止）。', sol: '检查容器网络配置，重启 Docker 网络。', steps: ['检查 Docker 网络配置','确认容器 IP 不冲突','检查防火墙规则','重启 Docker 守护进程'] },
  { code: 'SYSTEM_CONTAINER_HEALTH_CHECK_FAILED', msg: '容器健康检查失败', sev: 'warning', cause: '容器的健康检查端点返回非健康状态。', sol: '检查应用健康状态，修复健康问题。', steps: ['查看健康检查端点实现','检查应用是否真的不健康','修复应用错误','调整健康检查参数'] },
  { code: 'SYSTEM_KUBERNETES_POD_PENDING', msg: 'Kubernetes Pod 处于 Pending 状态', sev: 'warning', cause: 'Pod 无法调度到节点（如资源不足、节点亲和性不匹配、污点和容忍度冲突）。', sol: '检查调度原因，增加资源或调整调度策略。', steps: ['使用 kubectl describe pod 查看事件','检查资源请求是否超过节点容量','检查节点亲和性和污点容忍度','增加节点或减小资源请求'] },
  { code: 'SYSTEM_KUBERNETES_POD_CRASH_LOOP', msg: 'Kubernetes Pod 崩溃循环', sev: 'critical', cause: 'Pod 不断启动后崩溃，可能是应用启动错误或依赖缺失。', sol: '查看 Pod 日志，修复启动错误。', steps: ['使用 kubectl logs 查看日志','检查容器启动命令','确认所有依赖已安装','修复应用程序'] },
  { code: 'SYSTEM_KUBERNETES_POD_IMAGE_PULL_BACKOFF', msg: 'Kubernetes 镜像拉取回退', sev: 'critical', cause: '无法拉取容器镜像，Kubelet 在重试间隔后再次尝试。', sol: '检查镜像名称、标签和仓库认证。', steps: ['确认镜像名称和标签正确','检查 imagePullSecrets','确认仓库可访问','手动测试镜像拉取'] },
  { code: 'SYSTEM_KUBERNETES_POD_EVICTION', msg: 'Kubernetes Pod 被驱逐', sev: 'warning', cause: '节点资源不足（如磁盘压力、内存压力），Kubelet 驱逐了 Pod。', sol: '增加节点资源，或降低 Pod 资源请求。', steps: ['查看节点状态（kubectl describe node）','检查磁盘和内存压力','增加节点资源','设置合理的资源请求和限制'] },
  { code: 'SYSTEM_KUBERNETES_SERVICE_UNAVAILABLE', msg: 'Kubernetes 服务不可用', sev: 'critical', cause: 'Service 没有可用的后端 Pod（如所有 Pod 未就绪、selector 不匹配）。', sol: '检查 Service 配置和 Pod 状态。', steps: ['检查 Service 的 selector','确认有 Pod 匹配 selector','检查 Pod 是否处于 Ready 状态','检查 Endpoints 对象'] },
  { code: 'SYSTEM_KUBERNETES_INGRESS_ERROR', msg: 'Kubernetes Ingress 错误', sev: 'critical', cause: 'Ingress 配置错误导致流量无法路由（如路径冲突、TLS 证书问题、后端服务不可用）。', sol: '检查 Ingress 规则和证书配置。', steps: ['检查 Ingress 规则语法','确认 TLS 证书正确','检查后端 Service 是否可用','查看 Ingress Controller 日志'] },
  { code: 'SYSTEM_KUBERNETES_CONFIGMAP_MISSING', msg: 'Kubernetes ConfigMap 缺失', sev: 'critical', cause: 'Pod 引用的 ConfigMap 不存在，导致环境变量或卷挂载失败。', sol: '创建缺失的 ConfigMap，或修正引用名称。', steps: ['确认 ConfigMap 名称正确','创建缺失的 ConfigMap','检查命名空间是否正确','验证 ConfigMap 数据'] },
  { code: 'SYSTEM_KUBERNETES_SECRET_MISSING', msg: 'Kubernetes Secret 缺失', sev: 'critical', cause: 'Pod 引用的 Secret 不存在，导致认证信息或 TLS 证书无法挂载。', sol: '创建缺失的 Secret，或修正引用名称。', steps: ['确认 Secret 名称正确','创建缺失的 Secret','检查 Secret 类型是否正确','验证 Secret 数据编码（base64）'] },
  { code: 'SYSTEM_KUBERNETES_RESOURCE_QUOTA_EXCEEDED', msg: 'Kubernetes 资源配额超限', sev: 'critical', cause: 'Namespace 中的资源使用超过了 ResourceQuota 限制。', sol: '增加配额限制，或降低资源使用。', steps: ['查看当前配额使用情况','增加 ResourceQuota','减少 Pod 的资源请求','删除不必要的资源'] },
  { code: 'SYSTEM_KUBERNETES_LIMIT_RANGE_VIOLATION', msg: 'Kubernetes LimitRange 违规', sev: 'error', cause: 'Pod 的资源配置违反了 LimitRange 的约束（如内存请求小于最小值）。', sol: '调整 Pod 资源配置以满足 LimitRange 要求。', steps: ['查看 LimitRange 配置','调整 Pod 的 resources 字段','确保请求和限制在允许范围内','重新创建 Pod'] },
  { code: 'SYSTEM_KUBERNETES_NETWORK_POLICY_DENIED', msg: 'Kubernetes 网络策略拒绝', sev: 'critical', cause: 'NetworkPolicy 阻止了 Pod 之间的网络通信。', sol: '调整 NetworkPolicy 规则允许必要的通信。', steps: ['查看当前的 NetworkPolicy','确认被阻止的源和目标 Pod','添加允许规则','测试网络连通性'] },
  { code: 'SYSTEM_KUBERNETES_PDB_VIOLATION', msg: 'Kubernetes PDB 违规', sev: 'warning', cause: '驱逐或缩容操作违反了 PodDisruptionBudget 的最小可用要求。', sol: '增加 PDB 的 minAvailable，或等待维护窗口。', steps: ['查看 PDB 配置','确认当前可用 Pod 数量','增加 minAvailable 或调整 maxUnavailable','在维护窗口执行操作'] },
  { code: 'SYSTEM_KUBERNETES_HPA_ERROR', msg: 'Kubernetes HPA 错误', sev: 'warning', cause: 'HorizontalPodAutoscaler 无法正常工作（如指标不可用、扩缩容计算错误）。', sol: '检查指标服务器状态，确认 HPA 配置正确。', steps: ['查看 HPA 状态（kubectl describe hpa）','确认 metrics-server 运行正常','检查目标指标是否存在','调整 HPA 的阈值和限制'] },
  { code: 'SYSTEM_KUBERNETES_VPA_ERROR', msg: 'Kubernetes VPA 错误', sev: 'warning', cause: 'VerticalPodAutoscaler 无法正常工作或建议不合理。', sol: '检查 VPA 配置，手动调整资源配置。', steps: ['查看 VPA 建议','确认 VPA 模式（Off/Initial/Auto/Recreate）','手动调整资源配置','监控调整后的效果'] },
  { code: 'SYSTEM_KUBERNETES_CRONJOB_MISFIRE', msg: 'Kubernetes CronJob 错过执行', sev: 'error', cause: 'CronJob 因前一次执行未完成或资源不足而错过了执行时间。', sol: '调整 CronJob 调度，增加并发策略，或优化执行时间。', steps: ['查看 CronJob 的执行历史','调整 startingDeadlineSeconds','设置 concurrencyPolicy','优化任务执行时间'] },
  { code: 'SYSTEM_KUBERNETES_JOB_FAILED', msg: 'Kubernetes Job 执行失败', sev: 'error', cause: 'Job 的 Pod 执行失败，未能完成任务。', sol: '查看 Job 日志，修复导致失败的问题。', steps: ['使用 kubectl logs 查看 Job Pod 日志','检查 Job 的 backoffLimit','修复应用错误','重新创建 Job'] },
  { code: 'SYSTEM_KUBERNETES_StatefulSet_STUCK', msg: 'Kubernetes StatefulSet 卡滞', sev: 'critical', cause: 'StatefulSet 的某个 Pod 无法正常启动或更新（如存储卷问题、启动脚本错误）。', sol: '检查 StatefulSet 事件和 Pod 日志，修复存储或应用问题。', steps: ['使用 kubectl describe 查看事件','检查 PVC 和 PV 状态','查看 Pod 日志','手动删除卡滞的 Pod 让控制器重建'] },
  { code: 'SYSTEM_KUBERNETES_DAEMONSET_UNAVAILABLE', msg: 'Kubernetes DaemonSet 不可用', sev: 'critical', cause: 'DaemonSet 未能在所有节点上运行 Pod（如节点污点、资源不足、镜像拉取失败）。', sol: '检查节点状态，确保所有节点满足 DaemonSet 的运行条件。', steps: ['查看 DaemonSet 状态','检查节点污点和容忍度','确认节点资源充足','查看镜像拉取状态'] },
];

const catFEntries = catF.map(s => makeEntry({
  code: s.code, message: s.msg, severity: s.sev, category: 'F. 系统与权限',
  location: '页面：任意工具 → 区域：系统底层',
  cause: s.cause, solution: s.sol, steps: s.steps,
  prevention: '监控系统资源，设置合理限制，定期更新系统和库。'
})).join('\n');

console.log('Inserting', catF.length, 'entries for category F...');
if (!insertBeforeCategoryEnd('F', catFEntries)) {
  console.error('Failed to insert category F');
  process.exit(1);
}

// ===== Category 0: HTTP Status Codes =====
const cat0 = [
  { code: '100_CONTINUE_EXPECTED', msg: '100 Continue — 客户端应继续发送请求体', sev: 'info', cause: '服务器已收到请求头，要求客户端继续发送请求体。', sol: '客户端应继续发送请求体，这是正常的 HTTP/1.1 行为。', steps: ['继续发送请求体','确保请求头包含 Expect: 100-continue','如果服务器返回最终状态码则停止发送'] },
  { code: '101_SWITCHING_PROTOCOLS', msg: '101 Switching Protocols — 协议切换中', sev: 'info', cause: '服务器同意客户端切换到 Upgrade 头中指定的新协议（如 WebSocket）。', sol: '这是正常行为，连接将切换到新协议。', steps: ['确认 Upgrade 头已发送','切换到新协议进行通信','WebSocket 连接建立后发送帧数据'] },
  { code: '102_PROCESSING', msg: '102 Processing — 服务器正在处理', sev: 'info', cause: 'WebDAV 扩展状态码，表示服务器已收到请求并正在处理，防止客户端超时。', sol: '等待服务器完成处理，无需额外操作。', steps: ['保持连接等待','不要重复发送请求','如果长时间无响应，检查服务器状态'] },
  { code: '103_EARLY_HINTS', msg: '103 Early Hints — 预加载提示', sev: 'info', cause: '服务器提前发送资源提示（如 Link 头），让浏览器开始预加载。', sol: '浏览器会自动处理预加载，无需应用层处理。', steps: ['浏览器会自动预加载 Link 头中的资源','应用层无需特殊处理','注意 103 响应后还会有最终响应'] },
  { code: '201_CREATED', msg: '201 Created — 资源创建成功', sev: 'info', cause: '请求成功并在服务器上创建了新资源（如 POST 请求创建记录）。', sol: '这是成功状态，处理返回的新资源信息。', steps: ['提取响应中的新资源 ID 或 URI','更新本地状态','如果不需要后续操作则完成'] },
  { code: '202_ACCEPTED', msg: '202 Accepted — 请求已接受但未完成', sev: 'info', cause: '请求已被接受用于处理，但处理尚未完成（如异步任务）。', sol: '轮询状态端点或等待回调通知处理完成。', steps: ['记录返回的任务 ID','轮询状态端点检查进度','或等待 Webhook 回调通知','处理最终结果'] },
  { code: '203_NON_AUTHORITATIVE_INFORMATION', msg: '203 Non-Authoritative Information — 非权威信息', sev: 'info', cause: '返回的元信息来自本地或第三方副本，不是原始服务器的权威响应。', sol: '通常可正常处理，但对缓存内容需谨慎。', steps: ['正常处理响应数据','注意数据可能不是最新','如需最新数据可绕过缓存直接请求'] },
  { code: '204_NO_CONTENT', msg: '204 No Content — 无内容', sev: 'info', cause: '服务器成功处理了请求，但不需要返回任何内容（如 DELETE 成功）。', sol: '这是成功状态，无需特殊处理。', steps: ['确认操作成功','不需要解析响应体','更新本地 UI 状态'] },
  { code: '205_RESET_CONTENT', msg: '205 Reset Content — 重置内容', sev: 'info', cause: '服务器成功处理了请求，要求客户端重置文档视图（如表单提交成功后清空表单）。', sol: '清空表单或重置视图到初始状态。', steps: ['清空表单字段','重置视图到初始状态','显示成功提示'] },
  { code: '206_PARTIAL_CONTENT', msg: '206 Partial Content — 部分内容', sev: 'info', cause: '服务器成功返回了 Range 请求指定的部分内容（如断点续传）。', sol: '将部分内容合并到完整文件中，继续请求剩余部分。', steps: ['保存返回的部分内容','计算下一个 Range 范围','继续请求剩余部分','合并所有部分为完整文件'] },
  { code: '207_MULTI_STATUS', msg: '207 Multi-Status — 多状态', sev: 'info', cause: 'WebDAV 扩展，响应体包含多个资源的状态信息。', sol: '解析响应体中的每个资源状态，分别处理。', steps: ['解析 XML/JSON 响应体','提取每个资源的状态码','分别处理成功和失败的资源','记录所有状态'] },
  { code: '208_ALREADY_REPORTED', msg: '208 Already Reported — 已报告', sev: 'info', cause: 'WebDAV 扩展，集合的成员已在先前的响应中枚举，不再重复包含。', sol: '这是 DAV 协议优化，无需应用层处理。', steps: ['正常处理响应','注意部分成员可能已在之前的响应中提供'] },
  { code: '226_IM_USED', msg: '226 IM Used — 增量处理已应用', sev: 'info', cause: '服务器已成功处理了对资源的增量修改请求（Delta encoding）。', sol: '将增量修改应用到本地副本。', steps: ['解析增量修改内容','应用到本地资源','验证应用后的结果'] },
  { code: '300_MULTIPLE_CHOICES', msg: '300 Multiple Choices — 多个选择', sev: 'info', cause: '请求有多个可能的响应，服务器提供了选项列表。', sol: '根据业务逻辑选择最合适的选项，或默认选择第一个。', steps: ['查看所有可用选项','根据用户偏好或业务规则选择','如果没有明确偏好，选择默认选项'] },
  { code: '301_MOVED_PERMANENTLY', msg: '301 Moved Permanently — 永久重定向', sev: 'warning', cause: '请求的资源已永久移动到新的 URL。', sol: '更新所有引用到新的 URL，后续请求直接使用新地址。', steps: ['提取响应头 Location 中的新 URL','更新书签、配置和代码中的旧 URL','后续请求直接使用新 URL','注意 POST 请求重定向后可能变为 GET'] },
  { code: '302_FOUND', msg: '302 Found — 临时重定向', sev: 'warning', cause: '请求的资源临时位于不同的 URL。', sol: '继续使用原 URL 发起请求，但本次跟随重定向。', steps: ['跟随 Location 头中的临时 URL','不要更新永久书签','继续监视原 URL','注意 POST 可能变为 GET'] },
  { code: '303_SEE_OTHER', msg: '303 See Other — 查看其他位置', sev: 'info', cause: '请求的处理结果位于另一个 URL，客户端应使用 GET 访问该 URL。', sol: '使用 GET 方法访问 Location 头指定的 URL。', steps: ['使用 GET 方法访问 Location URL','不要重复提交 POST 数据','显示处理结果'] },
  { code: '304_NOT_MODIFIED', msg: '304 Not Modified — 未修改', sev: 'info', cause: '条件请求（If-Modified-Since/If-None-Match）表明资源未发生变化。', sol: '使用本地缓存的副本，无需重新下载。', steps: ['使用本地缓存的响应','更新缓存的过期时间','不需要解析响应体'] },
  { code: '305_USE_PROXY', msg: '305 Use Proxy — 使用代理（已弃用）', sev: 'warning', cause: '响应要求通过指定的代理访问资源（此状态码因安全问题已弃用）。', sol: '现代浏览器忽略此状态码，考虑使用 307/308 替代。', steps: ['现代应用应忽略此状态码','如需代理，在应用层配置','使用 HTTPS 避免中间人代理'] },
  { code: '307_TEMPORARY_REDIRECT', msg: '307 Temporary Redirect — 临时重定向（保持方法）', sev: 'warning', cause: '请求的资源临时位于不同的 URL，但请求方法保持不变。', sol: '使用相同的方法重定向到新的 URL。', steps: ['使用相同请求方法访问 Location URL','不要更新永久书签','继续监视原 URL'] },
  { code: '308_PERMANENT_REDIRECT', msg: '308 Permanent Redirect — 永久重定向（保持方法）', sev: 'warning', cause: '请求的资源永久移动到新的 URL，请求方法保持不变。', sol: '更新引用到新的 URL，使用相同的方法访问。', steps: ['提取 Location 头中的新 URL','更新永久引用','使用相同请求方法访问新 URL'] },
  { code: '400_BAD_REQUEST_BODY', msg: '400 Bad Request — 请求体格式错误', sev: 'error', cause: '请求体的 JSON/XML 格式不正确，或缺少必填字段。', sol: '检查请求体格式，确保符合 API 文档要求。', steps: ['验证请求体是否为有效的 JSON/XML','检查所有必填字段是否存在','确认字段类型正确','参考 API 文档的示例请求'] },
  { code: '401_TOKEN_EXPIRED', msg: '401 Unauthorized — Token 已过期', sev: 'error', cause: '认证令牌（Token）已过期，需要刷新或重新获取。', sol: '使用刷新令牌获取新的访问令牌，或重新登录。', steps: ['检查令牌的过期时间','使用 refresh_token 刷新','如果 refresh_token 也过期，重新登录','更新存储的令牌'] },
  { code: '402_PAYMENT_REQUIRED', msg: '402 Payment Required — 需要付款', sev: 'error', cause: '需要付费才能访问该资源（预留状态码，部分 API 使用）。', sol: '完成付款流程，或升级订阅。', steps: ['查看付款页面','完成付款或升级订阅','确认付款状态已同步','重试请求'] },
  { code: '403_RESOURCE_FORBIDDEN', msg: '403 Forbidden — 资源访问被禁止', sev: 'error', cause: '服务器理解请求但拒绝执行，通常因为权限不足（不同于 401）。', sol: '检查用户权限，或联系管理员授予访问权限。', steps: ['确认当前用户身份','检查用户是否有该资源的访问权限','联系管理员授予权限','如果是 IP 限制，检查源 IP'] },
  { code: '404_RESOURCE_NOT_FOUND', msg: '404 Not Found — 资源不存在', sev: 'error', cause: '请求的资源在服务器上不存在，或 URL 路径错误。', sol: '检查 URL 路径，确认资源是否存在。', steps: ['检查 URL 路径拼写','确认资源 ID 是否正确','如果资源已被删除，从数据库移除引用','检查路由配置'] },
  { code: '405_METHOD_NOT_ALLOWED', msg: '405 Method Not Allowed — 方法不允许', sev: 'error', cause: 'URL 存在，但请求的方法（GET/POST/PUT/DELETE）不被支持。', sol: '使用 API 文档中指定的正确方法。', steps: ['查看 API 文档支持的方法','使用正确的方法重试','检查 Allow 响应头中的允许方法'] },
  { code: '406_NOT_ACCEPTABLE', msg: '406 Not Acceptable — 不可接受的内容类型', sev: 'error', cause: '服务器无法生成客户端 Accept 头中指定的内容类型。', sol: '修改 Accept 头，使用服务器支持的内容类型。', steps: ['查看服务器支持的内容类型','修改 Accept 头','或使用通配符 Accept: */*'] },
  { code: '407_PROXY_AUTH_REQUIRED', msg: '407 Proxy Authentication Required — 代理需要认证', sev: 'error', cause: '需要通过代理服务器进行认证。', sol: '在请求头或代理配置中提供认证信息。', steps: ['配置代理认证用户名和密码','在请求头中添加 Proxy-Authorization','检查代理服务器配置'] },
  { code: '408_REQUEST_TIMEOUT', msg: '408 Request Timeout — 请求超时', sev: 'error', cause: '服务器等待客户端发送请求的时间过长。', sol: '检查网络连接，重新发送请求。', steps: ['检查网络连接','增加客户端发送超时','重新发送请求','如果频繁出现，检查网络稳定性'] },
  { code: '409_CONFLICT_STATE', msg: '409 Conflict — 资源状态冲突', sev: 'error', cause: '请求与资源的当前状态冲突（如并发修改、唯一约束冲突）。', sol: '获取最新资源状态，解决冲突后重试。', steps: ['获取资源的最新状态','解决冲突（合并更改或放弃）','使用条件请求（If-Match）避免冲突','重试请求'] },
  { code: '410_GONE', msg: '410 Gone — 资源已永久删除', sev: 'error', cause: '请求的资源已永久删除，且不会再次可用。', sol: '从客户端移除对该资源的引用，不再请求。', steps: ['从客户端移除资源引用','更新 UI 不再显示该资源','如果资源只是迁移，查找新位置'] },
  { code: '411_LENGTH_REQUIRED', msg: '411 Length Required — 需要 Content-Length', sev: 'error', cause: '服务器要求请求必须包含 Content-Length 头。', sol: '添加 Content-Length 头，或使用分块传输。', steps: ['计算请求体大小','添加 Content-Length 头','或使用 Transfer-Encoding: chunked'] },
  { code: '412_PRECONDITION_FAILED', msg: '412 Precondition Failed — 前置条件失败', sev: 'error', cause: '条件请求（If-Match/If-Unmodified-Since）中的条件不满足。', sol: '获取最新资源状态，更新条件后重试。', steps: ['获取资源的最新 ETag 或修改时间','更新条件请求头','重试请求'] },
  { code: '413_PAYLOAD_TOO_LARGE', msg: '413 Payload Too Large — 请求体过大', sev: 'error', cause: '请求体大小超过了服务器的限制。', sol: '减小请求体大小，或使用分片上传。', steps: ['减小请求体大小','压缩数据','使用分片上传','联系管理员增加限制'] },
  { code: '414_URI_TOO_LONG', msg: '414 URI Too Long — URI 过长', sev: 'error', cause: '请求的 URI 超过了服务器能处理的最大长度。', sol: '使用 POST 请求体传递参数，缩短 URI。', steps: ['将参数移到 POST body','使用表单或 JSON 传递数据','缩短 URI 路径'] },
  { code: '415_UNSUPPORTED_MEDIA_TYPE', msg: '415 Unsupported Media Type — 不支持的媒体类型', sev: 'error', cause: '请求体的 Content-Type 不被服务器支持。', sol: '使用服务器支持的 Content-Type。', steps: ['查看 API 文档支持的 Content-Type','将数据转换为支持的格式','常见格式：application/json、multipart/form-data'] },
  { code: '416_RANGE_NOT_SATISFIABLE', msg: '416 Range Not Satisfiable — 范围不可满足', sev: 'error', cause: '请求的 Range 头指定的范围无效或超出资源大小。', sol: '检查资源大小，使用有效的范围。', steps: ['获取资源的完整大小（HEAD 请求）','使用有效的字节范围','或使用完整的资源请求'] },
  { code: '417_EXPECTATION_FAILED', msg: '417 Expectation Failed — 预期失败', sev: 'error', cause: '服务器无法满足 Expect 请求头中的要求。', sol: '移除 Expect 头，或修改预期条件。', steps: ['移除 Expect: 100-continue 头','检查服务器是否支持该预期','直接发送请求体'] },
  { code: '418_IM_A_TEAPOT', msg: '418 I am a teapot — 我是茶壶（彩蛋）', sev: 'info', cause: 'RFC 2324 定义的彩蛋状态码，表示服务器拒绝煮咖啡因为它是个茶壶。', sol: '这是一个玩笑状态码，不需要处理。', steps: ['这是 RFC 2324 的彩蛋','无需处理','在应用中可以显示有趣的提示'] },
  { code: '421_MISDIRECTED_REQUEST', msg: '421 Misdirected Request — 请求定向错误', sev: 'error', cause: '请求被发送到了无法生成响应的服务器（如 TLS 证书不匹配的主机）。', sol: '检查请求的目标主机，确保与 TLS 证书匹配。', steps: ['检查 Host 头是否正确','确认 TLS 证书覆盖该域名','使用正确的域名访问'] },
  { code: '422_UNPROCESSABLE_ENTITY', msg: '422 Unprocessable Entity — 无法处理的实体', sev: 'error', cause: '请求格式正确但语义错误（如验证失败、业务规则冲突）。', sol: '根据错误详情修正请求内容。', steps: ['查看详细的验证错误信息','修正请求中的错误字段','确保数据满足业务规则','重试请求'] },
  { code: '423_LOCKED', msg: '423 Locked — 资源已锁定', sev: 'error', cause: '资源当前被锁定，无法修改（WebDAV）。', sol: '等待资源解锁，或联系锁定者释放锁。', steps: ['等待资源解锁','联系锁定者释放锁','检查锁的超时时间','或者放弃修改'] },
  { code: '424_FAILED_DEPENDENCY', msg: '424 Failed Dependency — 依赖失败', sev: 'error', cause: '当前请求依赖于另一个请求，而那个请求失败了（WebDAV）。', sol: '先修复依赖请求的失败原因，然后重试。', steps: ['识别失败的依赖请求','修复依赖请求的问题','重试当前请求'] },
  { code: '425_TOO_EARLY', msg: '425 Too Early — 过早请求', sev: 'warning', cause: '服务器不愿意冒险处理可能被重放的请求（早期数据）。', sol: '重试请求，不使用早期数据。', steps: ['不使用 0-RTT 早期数据','正常 TLS 握手后重试','更新客户端避免早期数据'] },
  { code: '426_UPGRADE_REQUIRED', msg: '426 Upgrade Required — 需要升级协议', sev: 'error', cause: '服务器拒绝使用当前协议执行请求，要求升级到指定协议（如 TLS 1.3）。', sol: '升级到服务器要求的协议版本。', steps: ['查看 Upgrade 头中的要求','升级客户端协议版本','重新连接'] },
  { code: '428_PRECONDITION_REQUIRED', msg: '428 Precondition Required — 需要前置条件', sev: 'error', cause: '服务器要求条件请求（如 If-Match）以防止丢失更新。', sol: '添加条件请求头，使用资源的最新状态。', steps: ['获取资源的最新 ETag','添加 If-Match 头','重试请求'] },
  { code: '429_RATE_LIMITED', msg: '429 Too Many Requests — 请求过于频繁', sev: 'warning', cause: '客户端在短时间内发送了过多请求，触发了速率限制。', sol: '降低请求频率，查看 Retry-After 头，稍后重试。', steps: ['查看响应头中的 Retry-After','等待指定时间后重试','降低请求频率','实现客户端速率限制'] },
  { code: '431_REQUEST_HEADER_FIELDS_TOO_LARGE', msg: '431 Request Header Fields Too Large — 请求头字段过大', sev: 'error', cause: '请求头整体或单个字段过大，服务器拒绝处理。', sol: '减小请求头大小，移除不必要的头字段。', steps: ['移除不必要的自定义头','减小 Cookie 大小','使用 POST body 传递大数据'] },
  { code: '451_UNAVAILABLE_FOR_LEGAL_REASONS', msg: '451 Unavailable For Legal Reasons — 因法律原因不可用', sev: 'error', cause: '由于法律限制（如版权、政府审查），服务器拒绝提供资源。', sol: '资源因法律原因无法访问，寻找替代资源。', steps: ['了解具体的法律限制','寻找合法的替代资源','联系内容提供者'] },
  { code: '500_INTERNAL_SERVER_ERROR_DETAIL', msg: '500 Internal Server Error — 服务器内部错误详情', sev: 'critical', cause: '服务器遇到意外情况，无法完成请求（如未捕获异常、数据库连接丢失）。', sol: '查看服务器日志定位错误，联系管理员修复。', steps: ['查看服务器错误日志','检查最近的代码部署','确认数据库和依赖服务正常','联系管理员或开发团队'] },
  { code: '501_NOT_IMPLEMENTED_DETAIL', msg: '501 Not Implemented — 功能未实现详情', sev: 'error', cause: '服务器不具备完成请求所需的功能（如不支持该方法或协议版本）。', sol: '使用服务器支持的功能，或升级服务器。', steps: ['查看 API 文档确认功能是否支持','使用替代方法实现','联系服务商确认功能路线图'] },
  { code: '502_BAD_GATEWAY_DETAIL', msg: '502 Bad Gateway — 网关错误详情', sev: 'critical', cause: '网关或代理从上游服务器收到了无效响应（如上游崩溃、返回 HTML 错误页）。', sol: '检查上游服务器状态，确认网关配置正确。', steps: ['检查上游服务器是否运行','查看网关日志','确认网关到上游的网络连通','重启上游服务'] },
  { code: '503_SERVICE_UNAVAILABLE_DETAIL', msg: '503 Service Unavailable — 服务不可用详情', sev: 'critical', cause: '服务器暂时过载或维护中，无法处理请求。', sol: '查看 Retry-After 头，稍后重试，或联系管理员。', steps: ['查看 Retry-After 头','等待指定时间后重试','检查服务状态页面','联系管理员确认维护计划'] },
  { code: '504_GATEWAY_TIMEOUT_DETAIL', msg: '504 Gateway Timeout — 网关超时详情', sev: 'critical', cause: '网关在等待上游服务器响应时超时（上游处理过慢或不可达）。', sol: '检查上游服务器性能，增加超时时间，或优化上游处理。', steps: ['检查上游服务器是否运行','查看上游处理时间','增加网关超时设置','优化上游处理逻辑'] },
  { code: '505_HTTP_VERSION_NOT_SUPPORTED', msg: '505 HTTP Version Not Supported — 不支持的 HTTP 版本', sev: 'error', cause: '服务器不支持请求中使用的 HTTP 协议版本。', sol: '使用服务器支持的 HTTP 版本（通常为 1.1 或 2.0）。', steps: ['使用 HTTP/1.1 重试','检查服务器支持的版本','更新客户端协议版本'] },
  { code: '506_VARIANT_ALSO_NEGOTIATES', msg: '506 Variant Also Negototiates — 变体也参与协商', sev: 'error', cause: '服务器配置错误，导致透明内容协商循环（RFC 2295）。', sol: '修复服务器的内容协商配置。', steps: ['检查内容协商配置','修复循环引用','禁用透明内容协商'] },
  { code: '507_INSUFFICIENT_STORAGE', msg: '507 Insufficient Storage — 存储空间不足', sev: 'critical', cause: '服务器无法存储完成请求所需的表示（WebDAV）。', sol: '清理服务器存储空间，或增加存储容量。', steps: ['检查服务器磁盘空间','清理日志和临时文件','增加存储容量','联系管理员'] },
  { code: '508_LOOP_DETECTED', msg: '508 Loop Detected — 检测到循环', sev: 'error', cause: '服务器在处理请求时检测到无限循环（WebDAV）。', sol: '检查请求中的循环引用，修复配置。', steps: ['检查请求中的递归引用','修复循环配置','限制递归深度'] },
  { code: '510_NOT_EXTENDED', msg: '510 Not Extended — 未扩展', sev: 'error', cause: '请求需要服务器扩展才能满足（RFC 2774，已很少使用）。', sol: '使用标准请求，或寻找支持该扩展的服务器。', steps: ['简化请求为标准格式','不使用扩展头','寻找替代方案'] },
  { code: '511_NETWORK_AUTH_REQUIRED', msg: '511 Network Authentication Required — 需要网络认证', sev: 'error', cause: '客户端需要先通过网络的认证（如 captive portal 登录页面）。', sol: '打开浏览器完成网络认证，然后重试。', steps: ['打开浏览器访问任意网页','完成 captive portal 认证','或者联系网络管理员','重试请求'] },
];

const cat0Entries = cat0.map(s => makeEntry({
  code: s.code, message: s.msg, severity: s.sev, category: '0~9. HTTP 状态码',
  location: '页面：任意需联网工具 → 区域：HTTP 响应处理',
  cause: s.cause, solution: s.sol, steps: s.steps,
  prevention: '正确理解 HTTP 语义，实现合理的重试和降级策略。'
})).join('\n');

console.log('Inserting', cat0.length, 'entries for category 0...');
if (!insertBeforeCategoryEnd('0', cat0Entries)) {
  console.error('Failed to insert category 0');
  process.exit(1);
}

fs.writeFileSync(file, content);
console.log('Done! Categories F and 0 inserted.');
