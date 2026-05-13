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

// ===== Category D: Model & Generation =====
const catD = [
  { code: 'MODEL_LOAD_TIMEOUT', msg: '模型加载超时', sev: 'critical', cause: 'AI 模型文件过大或磁盘读取速度慢，导致加载时间超过超时阈值。', sol: '增加模型加载超时时间，或使用 SSD 加速。', steps: ['检查模型文件大小','增加加载超时设置','将模型文件移到 SSD','使用模型量化版本减小体积'] },
  { code: 'MODEL_LOAD_OUT_OF_MEMORY', msg: '模型加载时内存不足', sev: 'critical', cause: '模型需要的内存超过了系统可用内存（包括物理内存和显存）。', sol: '关闭其他应用释放内存，使用更小模型，或增加硬件资源。', steps: ['关闭不必要的应用释放内存','使用模型量化（INT8/INT4）减少内存占用','增加物理内存或显存','使用分片加载或按需加载'] },
  { code: 'MODEL_FILE_CORRUPTED', msg: '模型文件已损坏', sev: 'critical', cause: '模型文件在下载或存储过程中损坏，导致无法加载。', sol: '重新下载模型文件，验证校验和。', steps: ['验证模型文件的哈希值','重新下载模型','检查磁盘健康状态','使用官方渠道下载'] },
  { code: 'MODEL_VERSION_INCOMPATIBLE', msg: '模型版本不兼容', sev: 'error', cause: '模型文件格式版本与推理引擎版本不匹配。', sol: '更新推理引擎，或下载兼容版本的模型。', steps: ['检查模型格式版本','更新推理引擎到兼容版本','下载对应版本的模型','查看版本兼容性矩阵'] },
  { code: 'MODEL_NOT_FOUND', msg: '指定的模型未找到', sev: 'critical', cause: '请求的模型 ID 或路径不存在，或模型尚未下载。', sol: '确认模型 ID 正确，下载缺失的模型。', steps: ['检查模型 ID 拼写','确认模型是否已下载','从模型仓库下载','检查模型路径配置'] },
  { code: 'MODEL_LICENSE_EXPIRED', msg: '模型许可已过期', sev: 'critical', cause: '使用的商业模型许可证已过期，无法继续使用。', sol: '续订许可证，或切换到开源替代模型。', steps: ['检查许可证有效期','联系供应商续订','切换到开源替代模型','检查是否有试用延期选项'] },
  { code: 'MODEL_QUOTA_EXHAUSTED', msg: '模型调用配额已用完', sev: 'critical', cause: '模型服务提供商的月度/年度调用次数或 token 额度已用完。', sol: '升级套餐，或等待配额重置。', steps: ['查看当前配额使用情况','升级到更高配额套餐','优化调用减少浪费','设置配额预警'] },
  { code: 'MODEL_INPUT_TOKEN_EXCEEDED', msg: '输入 token 数量超限', sev: 'error', cause: '输入文本（包括系统提示、上下文、用户输入）的 token 数量超过了模型的最大输入限制。', sol: '缩短输入文本，截断上下文，或使用支持更长上下文的模型。', steps: ['计算输入文本的 token 数量','截断或总结过长的上下文','移除不必要的系统提示','切换到支持更长上下文的模型'] },
  { code: 'MODEL_OUTPUT_TOKEN_EXCEEDED', msg: '输出 token 数量超限', sev: 'warning', cause: '模型生成的输出达到了最大输出长度限制，内容被截断。', sol: '增加 max_tokens 限制，或要求模型分步生成。', steps: ['增加 max_tokens 参数','将任务拆分为多个子任务','要求模型在达到限制前总结','使用流式输出实时查看'] },
  { code: 'MODEL_CONTEXT_WINDOW_EXCEEDED', msg: '上下文窗口超限', sev: 'error', cause: '输入 + 输出的总 token 数超过了模型的上下文窗口限制。', sol: '减少输入长度，或切换到更大窗口的模型。', steps: ['计算总 token 使用量','减少历史消息保留数量','使用摘要代替完整历史','切换到更大上下文窗口的模型'] },
  { code: 'MODEL_TEMPERATURE_INVALID', msg: '温度参数设置无效', sev: 'warning', cause: 'temperature 参数超出了有效范围（通常为 0~2）。', sol: '将 temperature 调整到 0~2 范围内。', steps: ['检查 temperature 值','调整到 0~2 之间','0 表示确定性输出，2 表示最随机','根据任务需求选择合适的值'] },
  { code: 'MODEL_TOP_P_INVALID', msg: 'Top-p 参数设置无效', sev: 'warning', cause: 'top_p 参数超出了有效范围（通常为 0~1）。', sol: '将 top_p 调整到 0~1 范围内。', steps: ['检查 top_p 值','调整到 0~1 之间','通常与 temperature 配合使用','1 表示考虑所有可能 token'] },
  { code: 'MODEL_TOP_K_INVALID', msg: 'Top-k 参数设置无效', sev: 'warning', cause: 'top_k 参数设置不合理（如负数、非整数）。', sol: '将 top_k 设置为正整数（通常 1~100）。', steps: ['检查 top_k 值','设置为正整数','1 表示只取最可能的 token','40~60 是常用范围'] },
  { code: 'MODEL_FREQUENCY_PENALTY_INVALID', msg: '频率惩罚参数无效', sev: 'warning', cause: 'frequency_penalty 超出了有效范围（通常为 -2~2）。', sol: '将 frequency_penalty 调整到有效范围内。', steps: ['检查 frequency_penalty 值','调整到 -2~2 之间','正值减少重复词','负值增加重复词'] },
  { code: 'MODEL_PRESENCE_PENALTY_INVALID', msg: '存在惩罚参数无效', sev: 'warning', cause: 'presence_penalty 超出了有效范围（通常为 -2~2）。', sol: '将 presence_penalty 调整到有效范围内。', steps: ['检查 presence_penalty 值','调整到 -2~2 之间','正值鼓励使用新词','负值鼓励使用已有词'] },
  { code: 'MODEL_STOP_SEQUENCE_INVALID', msg: '停止序列设置无效', sev: 'warning', cause: 'stop 序列包含空字符串或格式不正确。', sol: '确保 stop 序列为非空字符串数组。', steps: ['检查 stop 序列内容','移除空字符串','确保序列不为空白字符','测试停止序列是否生效'] },
  { code: 'MODEL_SEED_INCONSISTENT', msg: '随机种子设置不一致', sev: 'info', cause: '相同的 seed 值但输出不同，可能是因为模型版本或参数变化。', sol: '确保模型版本和所有参数完全一致。', steps: ['确认模型版本一致','检查所有生成参数是否相同','注意某些参数（如 temperature=0）仍可能有微小差异','记录完整配置用于复现'] },
  { code: 'MODEL_REPETITION_DETECTED', msg: '模型输出出现重复', sev: 'warning', cause: '模型陷入了重复循环，不断输出相同或相似的内容。', sol: '增加 frequency_penalty 和 presence_penalty，或降低 temperature。', steps: ['增加 frequency_penalty（如 0.5~1.0）','增加 presence_penalty（如 0.5~1.0）','降低 temperature','缩短 max_tokens 避免循环'] },
  { code: 'MODEL_HALLUCINATION_DETECTED', msg: '模型产生幻觉内容', sev: 'warning', cause: '模型生成了看似合理但实际上不正确或虚构的信息。', sol: '增加事实核查步骤，使用 RAG 提供准确上下文。', steps: ['对关键事实进行人工核查','使用检索增强生成（RAG）','要求模型标注不确定的内容','对输出进行后处理验证'] },
  { code: 'MODEL_HARMFUL_CONTENT_DETECTED', msg: '检测到有害内容', sev: 'critical', cause: '模型输出了违反安全策略的内容（如暴力、仇恨、非法建议）。', sol: '增加内容过滤层，使用更安全模型，或调整提示词。', steps: ['增加输出内容过滤器','使用经过安全对齐的模型','在系统提示中明确禁止有害内容','对生成内容实施人工审核'] },
  { code: 'MODEL_BIAS_DETECTED', msg: '检测到模型偏见', sev: 'warning', cause: '模型输出表现出性别、种族、文化等方面的偏见。', sol: '使用更公平的模型，或在提示词中要求中立。', steps: ['评估输出是否存在偏见','使用经过公平性训练的模型','在提示中要求中立客观','多样化训练数据'] },
  { code: 'MODEL_INFERENCE_ENGINE_ERROR', msg: '推理引擎内部错误', sev: 'critical', cause: '模型推理框架（如 ONNX Runtime、TensorRT、llama.cpp）出现内部错误。', sol: '更新推理引擎版本，或切换到其他推理后端。', steps: ['查看推理引擎的错误日志','更新到最新版本','尝试使用 CPU 推理替代 GPU','切换到其他推理后端'] },
  { code: 'MODEL_CUDA_ERROR', msg: 'CUDA 运行时错误', sev: 'critical', cause: 'GPU 计算过程中出现 CUDA 错误（如内存不足、非法内存访问、驱动不兼容）。', sol: '更新显卡驱动，减少批处理大小，或切换到 CPU 推理。', steps: ['更新 NVIDIA 显卡驱动','减少 batch size 或模型大小','检查 GPU 温度是否过高','切换到 CPU 推理作为降级方案'] },
  { code: 'MODEL_ROCM_ERROR', msg: 'ROCm 运行时错误', sev: 'critical', cause: 'AMD GPU 计算过程中出现 ROCm/HIP 错误。', sol: '更新 ROCm 驱动，或切换到 CPU/OpenCL 推理。', steps: ['更新 ROCm 驱动和运行时','检查 GPU 兼容性','减少模型大小','切换到 CPU 推理'] },
  { code: 'MODEL_METAL_ERROR', msg: 'Metal 运行时错误', sev: 'critical', cause: 'Apple Silicon GPU 计算过程中出现 Metal 错误。', sol: '更新 macOS 和 Xcode，或切换到 CPU 推理。', steps: ['更新 macOS 到最新版本','更新 Xcode Command Line Tools','重启设备','切换到 CPU 推理'] },
  { code: 'MODEL_QUANTIZATION_ERROR', msg: '模型量化错误', sev: 'error', cause: '将模型从 FP32/FP16 量化到 INT8/INT4 时出错。', sol: '使用官方量化脚本，或下载已量化版本。', steps: ['使用官方提供的量化工具','下载已量化的模型版本','检查量化参数设置','验证量化后模型的输出质量'] },
  { code: 'MODEL_PRUNING_ERROR', msg: '模型剪枝错误', sev: 'error', cause: '模型剪枝过程中出错，导致模型结构损坏。', sol: '使用标准剪枝脚本，或从备份恢复。', steps: ['使用成熟的剪枝框架（如 TorchPruning）','先进行小规模测试','从备份恢复原始模型','评估剪枝后的模型性能'] },
  { code: 'MODEL_DISTILLATION_ERROR', msg: '模型蒸馏错误', sev: 'error', cause: '知识蒸馏过程中出错（如教师模型输出异常、损失函数计算错误）。', sol: '检查教师模型状态，调整蒸馏超参数。', steps: ['确认教师模型正常运行','检查损失函数实现','调整温度参数和 alpha 权重','使用更小的数据集验证'] },
  { code: 'MODEL_FINETUNE_DATA_ERROR', msg: '微调数据格式错误', sev: 'error', cause: '用于微调的数据格式不正确（如缺少必要字段、格式不统一）。', sol: '按照微调框架要求格式化数据。', steps: ['查看微调框架的数据格式要求','检查每条数据是否包含必要字段','统一数据格式','使用小数据集验证格式'] },
  { code: 'MODEL_FINETUNE_OVERFITTING', msg: '微调模型过拟合', sev: 'warning', cause: '微调后的模型在训练集上表现很好但在验证集上表现差。', sol: '增加正则化，使用更多数据，或减少训练轮数。', steps: ['增加 dropout 率','使用权重衰减（L2 正则化）','增加训练数据','减少训练轮数（early stopping）'] },
  { code: 'MODEL_FINETUNE_UNDERFITTING', msg: '微调模型欠拟合', sev: 'warning', cause: '微调后的模型在训练集和验证集上表现都差。', sol: '增加模型容量，减少正则化，或增加训练轮数。', steps: ['减少 dropout 和权重衰减','增加训练轮数','增加可训练参数（解冻更多层）','使用更大的学习率'] },
  { code: 'MODEL_LORA_MERGE_ERROR', msg: 'LoRA 权重合并错误', sev: 'error', cause: '将 LoRA 权重合并到基础模型时出错（如维度不匹配、权重格式错误）。', sol: '检查 LoRA 配置与基础模型的兼容性。', steps: ['确认 LoRA 的 rank 和 target_modules 正确','检查基础模型是否与 LoRA 匹配','使用官方合并脚本','验证合并后的模型输出'] },
  { code: 'MODEL_ADAPTERS_CONFLICT', msg: '多适配器冲突', sev: 'error', cause: '同时加载了多个不兼容的适配器（如 LoRA + Adapter + Prompt Tuning）。', sol: '只使用一个适配器，或确保适配器之间兼容。', steps: ['一次只加载一个适配器','检查适配器之间的兼容性','按顺序加载并测试','查看适配器文档的兼容性说明'] },
  { code: 'MODEL_PIPELINE_STAGE_FAILED', msg: '模型流水线某阶段失败', sev: 'error', cause: '多阶段推理流水线中某个阶段（如预处理、推理、后处理）失败。', sol: '检查失败阶段的日志，修复对应问题。', steps: ['定位失败的具体阶段','查看该阶段的错误日志','修复导致失败的问题','重新运行流水线'] },
  { code: 'MODEL_BATCH_INFERENCE_FAILED', msg: '批量推理失败', sev: 'error', cause: '批量推理时某个样本导致整个批次失败。', sol: '使用单条推理定位问题样本，跳过或修复该样本。', steps: ['切换到单条推理模式','定位导致失败的样本','修复或跳过问题样本','重新批量推理'] },
  { code: 'MODEL_STREAMING_INTERRUPTED', msg: '流式生成中断', sev: 'warning', cause: '流式输出过程中连接断开或客户端取消。', sol: '实现断线重连和恢复机制。', steps: ['捕获连接断开事件','实现断线重连','保存已生成的内容用于恢复','通知用户生成已中断'] },
  { code: 'MODEL_FUNCTION_CALL_INVALID', msg: '模型函数调用格式无效', sev: 'error', cause: '模型输出的函数调用 JSON 格式不正确或缺少必要字段。', sol: '在系统提示中明确函数调用格式，增加验证和重试。', steps: ['在系统提示中提供函数调用示例','使用 JSON Schema 验证输出','实现调用失败时的重试逻辑','fallback 到不使用函数调用的模式'] },
  { code: 'MODEL_TOOL_EXECUTION_FAILED', msg: '模型调用的工具执行失败', sev: 'error', cause: '模型决定调用某个工具，但工具执行返回了错误。', sol: '将工具错误信息反馈给模型，让模型决定下一步。', steps: ['捕获工具执行错误','将错误信息格式化为消息','让模型基于错误信息重新决策','如果多次失败，终止并告知用户'] },
  { code: 'MODEL_JSON_MODE_INVALID_OUTPUT', msg: 'JSON 模式输出无效', sev: 'error', cause: '要求模型输出 JSON，但输出不是有效的 JSON 或不符合指定 schema。', sol: '增加 JSON 示例和 schema 约束，使用后处理修复。', steps: ['在提示中提供 JSON 示例','使用 response_format: { type: "json_object" }','对输出进行 JSON 验证','使用 JSON 修复工具处理不完整的 JSON'] },
];

const catDEntries = catD.map(s => makeEntry({
  code: s.code, message: s.msg, severity: s.sev, category: 'D. 模型与生成',
  location: '页面：LLM Hub / 转画风 / TTS / Paper2Gal → 区域：AI 生成区域',
  cause: s.cause, solution: s.sol, steps: s.steps,
  prevention: '合理设置模型参数，监控资源使用，使用模型版本控制。'
})).join('\n');

console.log('Inserting', catD.length, 'entries for category D...');
if (!insertBeforeCategoryEnd('D', catDEntries)) {
  console.error('Failed to insert category D');
  process.exit(1);
}

// ===== Category E: Workflow & Conversion =====
const catE = [
  { code: 'WORKFLOW_STEP_TIMEOUT', msg: '工作流某步骤执行超时', sev: 'error', cause: '工作流中某个步骤执行时间超过了设定的超时阈值。', sol: '优化该步骤的性能，或增加超时时间。', steps: ['定位超时的具体步骤','分析该步骤的性能瓶颈','优化算法或增加资源','增加该步骤的超时设置'] },
  { code: 'WORKFLOW_STEP_DEPENDENCY_MISSING', msg: '工作流步骤依赖缺失', sev: 'critical', cause: '某个步骤依赖的上一步输出不存在或为空。', sol: '检查前置步骤是否正确执行，确保输出已生成。', steps: ['检查前置步骤的执行状态','确认前置步骤的输出文件存在','如果前置步骤失败，先修复前置步骤','重新运行工作流'] },
  { code: 'WORKFLOW_STEP_OUTPUT_MISSING', msg: '工作流步骤输出缺失', sev: 'critical', cause: '步骤执行完成但没有产生预期的输出文件或数据。', sol: '检查步骤逻辑，确认输出路径和格式正确。', steps: ['检查步骤的日志输出','确认输出路径是否正确','检查磁盘空间是否充足','验证步骤逻辑是否正确处理了所有分支'] },
  { code: 'WORKFLOW_STEP_OUTPUT_INVALID', msg: '工作流步骤输出格式无效', sev: 'error', cause: '步骤产生的输出格式不符合下一阶段的输入要求。', sol: '修正输出格式，或在中间添加格式转换步骤。', steps: ['检查输出的实际格式','与下一阶段期望的格式对比','添加格式转换逻辑','更新文档说明格式要求'] },
  { code: 'WORKFLOW_CIRCULAR_DEPENDENCY', msg: '工作流存在循环依赖', sev: 'critical', cause: '工作流步骤之间的依赖关系形成了循环（A 依赖 B，B 依赖 A）。', sol: '重构工作流，消除循环依赖，使用DAG结构。', steps: ['绘制工作流依赖图','识别循环依赖环','打破循环（引入中间步骤或合并步骤）','确保工作流是有向无环图（DAG）'] },
  { code: 'WORKFLOW_PARALLEL_EXECUTION_FAILED', msg: '工作流并行执行失败', sev: 'error', cause: '并行执行的多个步骤中至少一个失败，导致整体失败或部分结果不一致。', sol: '使用 allSettled 模式处理并行结果，失败步骤单独重试。', steps: ['使用 Promise.allSettled 替代 Promise.all','收集所有成功和失败的结果','对失败的步骤单独重试','记录失败原因用于分析'] },
  { code: 'WORKFLOW_STATE_CORRUPTION', msg: '工作流状态损坏', sev: 'critical', cause: '工作流执行过程中的状态数据损坏或丢失（如内存错误、存储故障）。', sol: '从上一个检查点恢复，或重新执行整个工作流。', steps: ['检查状态存储的完整性','从上一个成功的检查点恢复','如果无法恢复，重新执行工作流','增加状态持久化和校验机制'] },
  { code: 'WORKFLOW_STATE_INCONSISTENT', msg: '工作流状态不一致', sev: 'critical', cause: '工作流状态在不同组件间不一致（如数据库已更新但缓存未更新）。', sol: '实现分布式事务或最终一致性补偿机制。', steps: ['检查各组件状态是否一致','实现 Saga 模式补偿事务','使用事件驱动架构保证最终一致性','增加状态同步的定时检查'] },
  { code: 'WORKFLOW_RETRY_EXHAUSTED', msg: '工作流重试次数已耗尽', sev: 'critical', cause: '工作流或其某个步骤多次重试后仍然失败。', sol: '检查失败的根本原因，修复后手动触发重试。', steps: ['查看所有重试的失败原因','定位根本原因','修复根本问题','手动触发工作流重试'] },
  { code: 'WORKFLOW_CANCELLED_BY_USER', msg: '工作流被用户取消', sev: 'info', cause: '用户主动取消了正在进行的工作流。', sol: '正常处理取消请求，清理已分配的资源。', steps: ['立即停止工作流执行','清理临时文件和分配的资源','释放锁和连接','记录取消事件'] },
  { code: 'WORKFLOW_CANCELLED_BY_SYSTEM', msg: '工作流被系统取消', sev: 'warning', cause: '系统因资源不足、优先级调整或维护而取消了工作流。', sol: '检查系统状态，稍后重新提交工作流。', steps: ['查看系统取消原因','检查系统资源状态','等待系统恢复正常','重新提交工作流'] },
  { code: 'WORKFLOW_TRIGGER_DUPLICATE', msg: '工作流重复触发', sev: 'warning', cause: '同一工作流被多次触发（如用户快速点击、消息重复投递）。', sol: '实现幂等性检查，使用去重键防止重复执行。', steps: ['为每次触发生成唯一 ID','在数据库中检查该 ID 是否已处理','如果已处理则直接返回之前的结果','实现请求去重机制'] },
  { code: 'WORKFLOW_SCHEDULER_MISFIRE', msg: '工作流调度失败', sev: 'error', cause: '定时触发的工作流因系统宕机或资源不足而错过了执行时间。', sol: '配置调度器的错过触发策略（立即执行或跳过）。', steps: ['检查调度器日志','配置 misfire 策略（withMisfireHandlingInstruction）','对于关键任务使用立即执行','监控调度器健康状态'] },
  { code: 'WORKFLOW_DEAD_LETTER_QUEUE', msg: '工作流进入死信队列', sev: 'critical', cause: '工作流消息多次处理失败后进入了死信队列，不再自动重试。', sol: '检查死信队列中的消息，手动处理或修复后重新投递。', steps: ['查看死信队列中的消息','分析消息处理失败的原因','修复导致失败的问题','将消息重新投递到正常队列'] },
  { code: 'IMAGE_FORMAT_CONVERSION_FAILED', msg: '图片格式转换失败', sev: 'error', cause: '将图片从一种格式转换为另一种格式时出错（如不支持的色彩空间、编码错误）。', sol: '使用支持该格式的转换工具，或先转换为中间格式。', steps: ['确认源格式和目标格式','使用 ImageMagick 或 FFmpeg 转换','先转为通用格式（如 PNG）再转目标格式','检查色彩空间兼容性'] },
  { code: 'IMAGE_RESIZE_FAILED', msg: '图片缩放失败', sev: 'error', cause: '图片缩放过程中出错（如内存不足、算法不支持、尺寸参数非法）。', sol: '检查尺寸参数，使用合适的缩放算法，确保内存充足。', steps: ['检查目标尺寸是否为正数','使用合适的插值算法','确保内存充足','分批处理大批量图片'] },
  { code: 'IMAGE_CROP_FAILED', msg: '图片裁剪失败', sev: 'error', cause: '裁剪区域超出了图片边界，或裁剪参数非法。', sol: '确保裁剪区域在图片范围内，使用安全的裁剪函数。', steps: ['检查裁剪坐标和尺寸','确保裁剪区域不超过图片边界','使用安全的裁剪库函数','对坐标进行边界检查'] },
  { code: 'IMAGE_COMPOSITE_FAILED', msg: '图片合成失败', sev: 'error', cause: '将多张图片合成为一张时出错（如尺寸不匹配、透明度处理错误）。', sol: '统一图片尺寸，正确处理透明度，使用合成库的安全模式。', steps: ['统一所有图片的尺寸','正确处理 alpha 通道','使用合成库的安全模式','检查图片模式（RGB/RGBA）'] },
  { code: 'IMAGE_FILTER_APPLICATION_FAILED', msg: '图片滤镜应用失败', sev: 'error', cause: '应用滤镜（模糊、锐化、色彩调整）时出错。', sol: '检查滤镜参数，确保图片格式支持该滤镜。', steps: ['检查滤镜参数是否在有效范围','确认图片模式支持该滤镜','使用库提供的安全滤镜函数','分步应用滤镜定位问题'] },
  { code: 'IMAGE_COLOR_SPACE_CONVERSION_ERROR', msg: '图片色彩空间转换错误', sev: 'error', cause: '在不同色彩空间（sRGB、Adobe RGB、CMYK）之间转换时出错。', sol: '使用色彩管理引擎进行转换，或保持原色彩空间。', steps: ['确认源和目标色彩空间','使用 ICC 配置文件进行转换','保持原色彩空间避免转换','检查色彩深度是否匹配'] },
  { code: 'IMAGE_METADATA_CORRUPTION', msg: '图片元数据损坏', sev: 'warning', cause: '图片的 EXIF/ICC/XMP 元数据损坏或格式不正确。', sol: '移除损坏的元数据，或使用元数据修复工具。', steps: ['使用 exiftool 查看元数据','移除损坏的元数据','使用修复工具','重新嵌入正确的元数据'] },
  { code: 'AUDIO_FORMAT_CONVERSION_FAILED', msg: '音频格式转换失败', sev: 'error', cause: '将音频从一种格式转换为另一种时出错（如不支持采样率、声道数不匹配）。', sol: '使用 FFmpeg 进行转换，指定正确的编码参数。', steps: ['确认源和目标格式','使用 FFmpeg 指定编码器','检查采样率和声道数','分步转换：先解编码再编码'] },
  { code: 'AUDIO_RESAMPLING_FAILED', msg: '音频重采样失败', sev: 'error', cause: '改变音频采样率时出错（如算法不支持、质量参数非法）。', sol: '使用高质量的 resampler（如 SoX、libsamplerate），检查参数。', steps: ['使用 SoX 或 libsamplerate','检查目标采样率是否支持','选择合适质量的算法','避免多次重采样'] },
  { code: 'AUDIO_MIXING_FAILED', msg: '音频混音失败', sev: 'error', cause: '将多个音轨混合时出错（如长度不匹配、格式不一致、增益计算错误）。', sol: '统一音轨长度和格式，使用正确的增益算法。', steps: ['统一所有音轨的长度和格式','对齐音轨起点','使用正确的增益算法','分步混合定位问题'] },
  { code: 'VIDEO_TRANSCODING_FAILED', msg: '视频转码失败', sev: 'error', cause: '视频转码过程中出错（如编码器不支持、分辨率不合法、比特率设置错误）。', sol: '使用 FFmpeg 检查源视频，调整转码参数。', steps: ['使用 ffprobe 检查源视频信息','确认编码器支持目标格式','调整分辨率和比特率','分步转码定位问题'] },
  { code: 'VIDEO_DEMUXING_FAILED', msg: '视频解封装失败', sev: 'error', cause: '从容器格式（MP4/MKV/AVI）中分离音视频流时出错。', sol: '使用 FFmpeg 修复容器，或重新封装。', steps: ['使用 ffprobe 检查容器完整性','使用 FFmpeg 重新封装','尝试其他容器格式','修复损坏的索引'] },
  { code: 'VIDEO_MUXING_FAILED', msg: '视频封装失败', sev: 'error', cause: '将音视频流封装到容器格式时出错（如时间戳不连续、流参数不兼容）。', sol: '修正时间戳，确保流参数兼容，使用标准容器。', steps: ['检查音视频流的时间戳','确保编码参数兼容','使用标准容器格式（MP4/MKV）','使用 FFmpeg 的 faststart 选项'] },
  { code: 'DOCUMENT_CONVERSION_FAILED', msg: '文档转换失败', sev: 'error', cause: '将文档从一种格式转换为另一种时出错（如字体缺失、嵌入对象不支持）。', sol: '安装缺失字体，使用支持该格式的转换工具。', steps: ['确认源和目标格式','安装缺失的字体','使用 LibreOffice 或 pandoc 转换','检查嵌入对象是否受支持'] },
  { code: 'DOCUMENT_MERGE_FAILED', msg: '文档合并失败', sev: 'error', cause: '将多个文档合并为一个时出错（如页码冲突、样式不兼容、书签重复）。', sol: '统一文档样式，处理冲突元素，使用专业合并工具。', steps: ['统一所有文档的样式','处理页码和书签冲突','使用专业工具（如 PDFtk、PyPDF2）','分步合并定位问题'] },
  { code: 'DOCUMENT_SPLIT_FAILED', msg: '文档拆分失败', sev: 'error', cause: '将文档拆分为多个部分时出错（如页码范围无效、拆分点不正确）。', sol: '检查页码范围，使用正确的拆分工具。', steps: ['确认页码范围有效','使用正确的拆分工具','检查文档结构','处理特殊页面（封面、目录）'] },
  { code: 'DOCUMENT_WATERMARK_FAILED', msg: '文档水印添加失败', sev: 'error', cause: '为文档添加水印时出错（如字体缺失、位置计算错误、透明度问题）。', sol: '使用支持水印的库，确保字体可用。', steps: ['确认水印字体已安装','检查水印位置和大小','调整透明度','使用专业库（如 iText、PyMuPDF）'] },
  { code: 'DOCUMENT_ENCRYPTION_FAILED', msg: '文档加密失败', sev: 'error', cause: '为文档设置密码保护时出错（如算法不支持、密码复杂度不足）。', sol: '使用标准加密算法，设置符合要求的密码。', steps: ['使用 AES-256 等标准算法','设置足够复杂的密码','确认目标格式支持加密','测试加密后的文档可解密'] },
  { code: 'DOCUMENT_DECRYPTION_FAILED', msg: '文档解密失败', sev: 'error', cause: '解密文档时出错（如密码错误、加密算法不匹配、文件损坏）。', sol: '确认密码正确，使用与加密时相同的算法。', steps: ['确认密码正确','使用相同的算法和参数','检查文件是否完整','尝试使用其他解密工具'] },
  { code: 'ARCHIVE_CREATE_FAILED', msg: '创建压缩文件失败', sev: 'error', cause: '创建 zip/tar/7z 归档时出错（如文件不存在、权限不足、磁盘空间不足）。', sol: '检查源文件，确认权限和磁盘空间充足。', steps: ['确认所有源文件存在','检查目标目录的写权限','确认磁盘空间充足','分批归档避免单文件过大'] },
  { code: 'ARCHIVE_EXTRACT_FAILED', msg: '解压文件失败', sev: 'error', cause: '解压归档时出错（如文件损坏、密码错误、格式不支持、路径遍历）。', sol: '检查归档完整性，确认密码正确，使用安全解压。', steps: ['验证归档完整性','确认密码正确','使用安全的解压路径','检查是否有路径遍历风险'] },
  { code: 'ARCHIVE_INFINITE_LOOP', msg: '压缩炸弹检测（zip bomb）', sev: 'critical', cause: '解压后的文件大小远超压缩包大小，可能是恶意压缩炸弹。', sol: '限制解压后的最大大小，拒绝可疑压缩包。', steps: ['限制解压后的总大小','限制压缩比','使用流式解压','拒绝压缩比异常的文件'] },
  { code: 'TEXT_ENCODING_CONVERSION_FAILED', msg: '文本编码转换失败', sev: 'error', cause: '在不同字符编码之间转换时出错（如源编码识别错误、目标编码不支持某些字符）。', sol: '正确识别源编码，使用支持所有字符的目标编码（如 UTF-8）。', steps: ['使用 chardet 识别源编码','指定正确的源编码','使用 UTF-8 作为目标编码','处理无法转换的字符（替换或忽略）'] },
  { code: 'TEXT_NORMALIZATION_FAILED', msg: '文本规范化失败', sev: 'error', cause: 'Unicode 规范化（NFC/NFD/NFKC/NFKD）过程中出错。', sol: '使用标准 Unicode 规范化库，处理边缘字符。', steps: ['使用标准库（如 Python unicodedata）','选择合适的规范化形式','测试边缘字符','处理规范化后的结果'] },
  { code: 'TEXT_TOKENIZATION_FAILED', msg: '文本分词失败', sev: 'error', cause: '使用分词器（tokenizer）处理文本时出错（如文本过长、包含特殊字符、编码问题）。', sol: '预处理文本，截断过长内容，处理特殊字符。', steps: ['截断过长的文本','移除或替换特殊字符','检查编码','使用适合语言的分词器'] },
  { code: 'TEXT_TRANSLATION_FAILED', msg: '文本翻译失败', sev: 'error', cause: '机器翻译服务返回错误或无法翻译某些内容。', sol: '检查源语言识别，简化文本，或使用其他翻译服务。', steps: ['确认源语言识别正确','简化复杂句式','分段翻译','使用备用翻译服务'] },
];

const catEEntries = catE.map(s => makeEntry({
  code: s.code, message: s.msg, severity: s.sev, category: 'E. 工作流与转换',
  location: '页面：任意工作流工具 → 区域：处理流水线',
  cause: s.cause, solution: s.sol, steps: s.steps,
  prevention: '设计工作流时避免循环依赖，添加超时和重试机制，监控资源使用。'
})).join('\n');

console.log('Inserting', catE.length, 'entries for category E...');
if (!insertBeforeCategoryEnd('E', catEEntries)) {
  console.error('Failed to insert category E');
  process.exit(1);
}

fs.writeFileSync(file, content);
console.log('Done! Categories D and E inserted.');
