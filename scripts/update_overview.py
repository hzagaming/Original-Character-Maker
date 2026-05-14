import os

ZH_OVERVIEW = """IndexTTS 语音合成工具使用零样本音色克隆技术，将文本转换为语音。上传 3~10 秒的参考音频即可克隆任意音色，也可以使用默认音色。支持情感控制、语速调节和多种输出格式。

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
A: 主要支持中文和英文，其他语言的效果可能因模型训练数据而异。"""

EN_OVERVIEW = """IndexTTS Voice Synthesis generates speech from text using zero-shot voice cloning. Upload a reference audio clip (3~10 seconds) to clone a voice, or use the default voice. The tool supports emotion control, speed adjustment, and multiple output formats.

【User Guide】

Step 1: Prepare the Text
Enter the text to synthesize in the text input box. Supports Chinese, English, and other languages. Recommendations:
- Keep single-segment text within 500 characters; overly long text may degrade generation quality
- Use standard punctuation (commas, periods, question marks) to control pauses and intonation
- Avoid rare Chinese characters; the model may not accurately pronounce some uncommon hanzi

Step 2: Choose Reference Audio (Optional)
Click the "Upload Reference Audio" button and select a 3~10 second audio file. Recommendations:
- Format: WAV or MP3, sample rate 22050Hz or higher
- Content: Clear single-speaker voice with minimal background noise
- Length: 5~7 seconds is optimal; too short may yield poor cloning, too long increases processing time
- Quality: Better audio quality produces closer voice cloning results
- If no reference audio is uploaded, the default voice will be used

Step 3: Adjust Parameters
Adjust TTS parameters according to your needs:

Basic Parameters:
- Model: Select the TTS model version. index-tts-1.5 is the stable version suitable for most scenarios; index-tts-2 has advanced emotion control for rich emotional expression.
- Temperature (0~1, default 0.8): Controls generation randomness. Lower values (0.5~0.7) suit formal, stable speech; higher values (0.8~1.0) suit more natural, varied speech.
- Top P (0~1, default 0.92): Nucleus sampling threshold. Usually keep the default; lower to 0.85 for more stable output.
- Top K (1~128, default 48): Top-k sampling. Usually no need to adjust.

Voice Parameters:
- Speed (0.5~2.0, default 1.0): Playback speed. 0.8 suits gentle slow speech; 1.2~1.5 suits fast broadcasting; 2.0 is maximum speed.
- CFG (1~14, default 6.8): Classifier-Free Guidance scale. 7~10 is the safe zone; too high may cause voice distortion.

Emotion Parameters:
- Emotion Alpha (0~2.0, default 1.0): Emotion expression intensity. 0.5 suits plain narration; 1.0 is balanced; 1.5~2.0 suits dramatic expression.
- Emotion Text: Use natural language to describe the desired emotional style. Examples: "gentle whisper", "angry shouting", "happy and excited speaking", "sad crying". Supports Chinese and English.

Advanced Parameters:
- Seed (default 240315): Fixed seed enables reproducible results. Record seeds of favorite outputs for later reproduction.
- Device: GPU acceleration is fast but requires NVIDIA GPU support; CPU works on any device but is slower.
- Format: WAV is lossless quality, suitable for post-editing; MP3 is smaller, suitable for direct sharing.
- Sample Rate: 48000Hz is CD quality; 44100Hz is standard; 22050Hz is acceptable for speech.
- Noise Reduction (0~100, default 20): Post-process noise reduction. Increase if reference audio has background noise; decrease if voice sounds unnatural.

Step 4: Generate Speech
Click the "Generate Speech" button. Generation time depends on text length and device performance:
- GPU: ~5~15 seconds for 10 seconds of text
- CPU: ~30~60 seconds for 10 seconds of text
You can click "Abort Task" at any time during generation to cancel.

Step 5: Process Results
After generation completes, the result area displays an audio player. You can:
- Click the play button to preview
- Click "Download Result" to save locally
- Click "Copy Result" to copy to clipboard (browser support varies)
- Click "Open File" to open in a new tab
- Click "Redo" to regenerate with the same parameters
- Click "Copy JSON" to copy current configuration
- Click "Download JSON" to save the config file for later reuse

【TTS Technology】
IndexTTS is a GPT-style text-to-speech model based on XTTS and Tortoise. It supports Chinese pinyin correction and pause control via punctuation marks. The model uses a conformer conditioning encoder and BigVGAN2-based speechcode decoder for high-quality audio output.

【Parameter Quick Reference】
| Parameter | Range | Default | Description |
|---|---|---|---|
| Temperature | 0~1 | 0.8 | Randomness control |
| Top P | 0~1 | 0.92 | Nucleus sampling |
| Top K | 1~128 | 48 | Top-k sampling |
| Speed | 0.5~2.0 | 1.0 | Playback speed |
| CFG | 1~14 | 6.8 | Guidance strength |
| Emotion Alpha | 0~2.0 | 1.0 | Emotion intensity |
| Seed | Integer | 240315 | Random seed |
| Noise Reduction | 0~100 | 20 | Noise reduction strength |

【Output Formats】
- WAV: Uncompressed, highest quality, suitable for post-editing
- MP3: Lossy compression, smaller file, suitable for direct sharing
- Typical file size: 100KB ~ 5MB (depends on duration and format)
- Recommended sample rate: 48000 Hz for best quality

【FAQ】
Q: Why does the cloned voice differ from the original?
A: Reference audio quality directly affects cloning results. Ensure the audio is clear, noise-free, and contains only one speaker. Adjusting Temperature and CFG can optimize similarity.

Q: Generation is very slow. What should I do?
A: Switch to GPU inference mode. If no NVIDIA GPU is available, try shortening the text length or lowering the sample rate.

Q: The generated speech has noise.
A: Increase the "Noise Reduction" parameter (suggested 30~50), or use a cleaner reference audio.

Q: Emotion description doesn't take effect.
A: Ensure you are using the index-tts-2 model and appropriately increase the "Emotion Alpha" parameter. Some emotion descriptions may need more specific phrasing.

Q: How can I reproduce a previous result?
A: Record the Seed value used during generation, then use the same Seed and parameters in subsequent generations.

Q: Which languages are supported for text input?
A: Primarily Chinese and English; other languages may vary in quality depending on model training data."""

JA_OVERVIEW = """IndexTTS 音声合成ツールは、ゼロショット音声クローニング技術を使用してテキストを音声に変換します。3〜10秒の参照音声をアップロードすると任意の音色をクローンでき、デフォルトの音色を使用することも可能です。感情制御、話速調整、複数の出力形式に対応しています。

【使用チュートリアル】

ステップ 1：テキストの準備
テキスト入力欄に合成する内容を入力します。中国語、英語など多言語に対応しています。推奨事項：
- 1セグメントのテキストは500文字以内に収める。長すぎると生成品質が低下する可能性があります
- 標準的な句読点（コンマ、ピリオド、疑問符）を使用して休止やイントネーションを制御
- 中国語テキストでは生僻字を避ける。モデルは一部の希少漢字のピンイン処理が不正確な場合があります

ステップ 2：参照音声の選択（オプション）
「参照音声をアップロード」ボタンをクリックし、3〜10秒の音声ファイルを選択します。推奨事項：
- 形式：WAV または MP3、サンプリングレート 22050Hz 以上
- 内容：背景ノイズが少ない、クリアな単一話者の声
- 長さ：5〜7秒が最適。短すぎるとクローニング効果が悪く、長すぎると処理時間が増加
- 音質：音質が良いほど、クローニング結果が原音に近づきます
- 参照音声をアップロードしない場合はデフォルトの音色が使用されます

ステップ 3：パラメータの調整
必要に応じて TTS パラメータを調整します：

基本パラメータ：
- モデル：TTS モデルバージョンを選択。index-tts-1.5 は安定版でほとんどのシーンに適しています；index-tts-2 は高度な感情制御機能を持ち、豊かな感情表現が必要なシーンに適しています。
- Temperature（0〜1、デフォルト 0.8）：生成のランダム性を制御。低い値（0.5〜0.7）は公式で安定した音声に適しています；高い値（0.8〜1.0）は変化があり自然な音声に適しています。
- Top P（0〜1、デフォルト 0.92）：核サンプリング閾値。通常はデフォルト値のまま；より安定した出力が必要な場合は 0.85 に下げます。
- Top K（1〜128、デフォルト 48）：Top-k サンプリング。通常は調整不要です。

音声パラメータ：
- 話速（0.5〜2.0、デフォルト 1.0）：再生速度。0.8 は優しいゆっくりの話し方に適しています；1.2〜1.5 は速い放送に適しています；2.0 は最大速度です。
- CFG（1〜14、デフォルト 6.8）：分類器自由ガイダンス尺度。7〜10 が安全範囲；高すぎると音声が歪む可能性があります。

感情パラメータ：
- 感情強度（0〜2.0、デフォルト 1.0）：感情表現の強度。0.5 は平坦なナレーションに適しています；1.0 はバランス；1.5〜2.0 はドラマティックな表現に適しています。
- 感情説明：自然言語で望ましい感情スタイルを記述します。例：「優しいささやき」、「怒った叫び」、「嬉しくて興奮した話し方」、「悲しくて泣く」。中国語と英語に対応しています。

高度なパラメータ：
- Seed（デフォルト 240315）：固定シードで同じ結果を再現できます。お気に入りのシード値を記録しておきます。
- 推論デバイス：GPU アクセラレーションは高速ですが NVIDIA GPU のサポートが必要；CPU はどのデバイスでも動作しますが速度は遅いです。
- 出力形式：WAV は無損失音質で後処理編集に適しています；MP3 はファイルが小さく直接共有に適しています。
- サンプリングレート：48000Hz は CD 音質；44100Hz は標準；22050Hz は音声には十分です。
- 降噪強度（0〜100、デフォルト 20）：後処理ノイズ除去。参照音声に背景ノイズがある場合は上げます；音声が不自然になった場合は下げます。

ステップ 4：音声の生成
「音声を生成」ボタンをクリックします。生成時間はテキストの長さとデバイスの性能によって異なります：
- GPU：10秒のテキストで約5〜15秒
- CPU：10秒のテキストで約30〜60秒
生成中はいつでも「タスクを中止」をクリックしてキャンセルできます。

ステップ 5：結果の処理
生成が完了すると、結果領域に音声プレーヤーが表示されます。次の操作ができます：
- 再生ボタンをクリックして試聴
- 「結果をダウンロード」をクリックしてローカルに保存
- 「結果をコピー」をクリックしてクリップボードにコピー（ブラウザのサポート状況による）
- 「ファイルを開く」をクリックして新しいタブで開く
- 「やり直し」をクリックして同じパラメータで再生成
- 「JSONをコピー」をクリックして現在の設定をコピー
- 「JSONをダウンロード」をクリックして設定ファイルを保存

【TTS 技術原理】
IndexTTS は XTTS と Tortoise をベースにした GPT スタイルのテキスト読み上げモデルです。中国語のピンインによる発音修正や、句読点による休止制御に対応しています。モデルは conformer 条件付きエンコーダーと BigVGAN2 ベースの speechcode デコーダーを採用し、高品質な音声を出力します。

【パラメータ早見表】
| パラメータ | 範囲 | デフォルト | 説明 |
|---|---|---|---|
| Temperature | 0〜1 | 0.8 | ランダム性制御 |
| Top P | 0〜1 | 0.92 | 核サンプリング |
| Top K | 1〜128 | 48 | Top-k サンプリング |
| 話速 | 0.5〜2.0 | 1.0 | 再生速度 |
| CFG | 1〜14 | 6.8 | ガイダンス強度 |
| 感情強度 | 0〜2.0 | 1.0 | 感情強度 |
| Seed | 整数 | 240315 | ランダムシード |
| 降噪強度 | 0〜100 | 20 | ノイズ除去強度 |

【出力形式】
- WAV：非圧縮、最高音質、後処理編集に適しています
- MP3：圧縮、ファイルが小さく、直接共有に適しています
- 典型的なファイルサイズ：100KB 〜 5MB（長さと形式による）
- 推奨サンプリングレート：48000 Hz で最高音質を獲得

【よくある質問】
Q: クローンした声が原音と違うのはなぜ？
A: 参照音声の品質がクローニング結果に直接影響します。音声がクリアでノイズがなく、単一話者のみであることを確認してください。Temperature と CFG を調整して類似度を最適化できます。

Q: 生成速度が遅いです。どうすればいいですか？
A: GPU 推論モードに切り替えてください。NVIDIA GPU がない場合は、テキストを短くするかサンプリングレートを下げてみてください。

Q: 生成された音声にノイズがあります。
A: 「降噪強度」パラメータを上げます（推奨 30〜50）、またはよりクリーンな参照音声を使用してください。

Q: 感情説明が効果を発揮しません。
A: index-tts-2 モデルを使用していることを確認し、「感情強度」パラメータを適切に上げてください。一部の感情説明はより具体的な表現が必要な場合があります。

Q: 以前の結果を再現するには？
A: 生成時に使用した Seed 値を記録し、後続の生成で同じ Seed とパラメータを使用すれば再現できます。

Q: どの言語のテキストがサポートされていますか？
A: 主に中国語と英語に対応しています。他の言語はモデルの学習データによって品質が異なる場合があります。"""

RU_OVERVIEW = """IndexTTS Синтез речи использует технологию клонирования голоса zero-shot для преобразования текста в речь. Загрузите образец голоса длительностью 3~10 секунд, чтобы клонировать любой тембр, или используйте голос по умолчанию. Поддерживает управление эмоциями, регулировку скорости и несколько форматов вывода.

【Руководство пользователя】

Шаг 1: Подготовка текста
Введите текст для синтеза в текстовое поле. Поддерживает китайский, английский и другие языки. Рекомендации:
- Длина одного сегмента текста — не более 500 символов; слишком длинный текст может ухудшить качество генерации
- Используйте стандартную пунктуацию (запятые, точки, вопросительные знаки) для управления паузами и интонацией
- В китайском тексте избегайте редких иероглифов; модель может неточно обрабатывать пиньинь некоторых необычных ханзи

Шаг 2: Выбор образца голоса (опционально)
Нажмите кнопку «Загрузить образец голоса» и выберите аудиофайл длительностью 3~10 секунд. Рекомендации:
- Формат: WAV или MP3, частота дискретизации 22050 Гц и выше
- Содержание: Чистый голос одного диктора с минимальным фоновым шумом
- Длительность: 5~7 секунд — оптимально; слишком короткий образец даёт плохое клонирование, слишком длинный увеличивает время обработки
- Качество: Чем лучше качество аудио, тем ближе результат клонирования к оригиналу
- Если образец не загружен, будет использован голос по умолчанию

Шаг 3: Настройка параметров
Настройте параметры TTS в соответствии с вашими потребностями:

Базовые параметры:
- Модель: Выберите версию модели TTS. index-tts-1.5 — стабильная версия для большинства сценариев; index-tts-2 — с продвинутым управлением эмоциями для богатого эмоционального выражения.
- Temperature (0~1, по умолчанию 0.8): Контролирует случайность генерации. Низкие значения (0.5~0.7) подходят для официальной, стабильной речи; высокие (0.8~1.0) — для более естественной, разнообразной речи.
- Top P (0~1, по умолчанию 0.92): Порог ядерной выборки. Обычно оставляют по умолчанию; снижайте до 0.85 для более стабильного вывода.
- Top K (1~128, по умолчанию 48): Top-k выборка. Обычно не требует настройки.

Параметры голоса:
- Скорость (0.5~2.0, по умолчанию 1.0): Скорость воспроизведения. 0.8 — для нежного медленного голоса; 1.2~1.5 — для быстрого вещания; 2.0 — максимальная скорость.
- CFG (1~14, по умолчанию 6.8): Масштаб классификатора без руководства. 7~10 — безопасная зона; слишком высокое значение может исказить голос.

Параметры эмоций:
- Интенсивность эмоций (0~2.0, по умолчанию 1.0): Интенсивность эмоционального выражения. 0.5 — для плоского повествования; 1.0 — сбалансировано; 1.5~2.0 — для драматичного выражения.
- Описание эмоций: Используйте естественный язык для описания желаемого эмоционального стиля. Примеры: «нежный шёпот», «злой крик», «счастливый и возбуждённый голос», «печальный плач». Поддерживает китайский и английский.

Расширенные параметры:
- Seed (по умолчанию 240315): Фиксированное начальное значение позволяет воспроизводить одинаковые результаты. Записывайте начальные значения понравившихся результатов.
- Устройство: GPU-ускорение быстрое, но требует поддержки NVIDIA GPU; CPU работает на любом устройстве, но медленнее.
- Формат вывода: WAV — без потерь, подходит для пост-обработки; MP3 — меньше файла, подходит для прямого обмена.
- Частота дискретизации: 48000 Гц — CD-качество; 44100 Гц — стандарт; 22050 Гц — приемлемо для речи.
- Шумоподавление (0~100, по умолчанию 20): Пост-обработка шумоподавления. Увеличивайте, если в образце есть фоновый шум; уменьшайте, если голос звучит неестественно.

Шаг 4: Генерация речи
Нажмите кнопку «Синтезировать речь». Время генерации зависит от длины текста и производительности устройства:
- GPU: ~5~15 секунд для 10 секунд текста
- CPU: ~30~60 секунд для 10 секунд текста
Во время генерации можно нажать «Прервать задачу» для отмены.

Шаг 5: Обработка результатов
После завершения генерации в области результатов отображается аудиоплеер. Вы можете:
- Нажать кнопку воспроизведения для предпрослушивания
- Нажать «Скачать результат» для сохранения на локальный диск
- Нажать «Копировать результат» для копирования в буфер обмена (поддержка зависит от браузера)
- Нажать «Открыть файл» для открытия в новой вкладке
- Нажать «Повторить» для повторной генерации с теми же параметрами
- Нажать «Копировать JSON» для копирования текущей конфигурации
- Нажать «Скачать JSON» для сохранения файла конфигурации

【Технология TTS】
IndexTTS — это модель преобразования текста в речь в стиле GPT на основе XTTS и Tortoise. Поддерживает коррекцию произношения китайских иероглифов с помощью пиньинь и управление паузами с помощью знаков препинания. Модель использует conformer условный энкодер и декодер speechcode на основе BigVGAN2 для вывода аудио высокого качества.

【Таблица быстрого поиска параметров】
| Параметр | Диапазон | По умолчанию | Описание |
|---|---|---|---|
| Temperature | 0~1 | 0.8 | Контроль случайности |
| Top P | 0~1 | 0.92 | Ядерная выборка |
| Top K | 1~128 | 48 | Top-k выборка |
| Скорость | 0.5~2.0 | 1.0 | Скорость воспроизведения |
| CFG | 1~14 | 6.8 | Сила направления |
| Интенсивность эмоций | 0~2.0 | 1.0 | Интенсивность эмоций |
| Seed | Целое | 240315 | Случайное начальное значение |
| Шумоподавление | 0~100 | 20 | Сила шумоподавления |

【Форматы вывода】
- WAV: Без сжатия, наивысшее качество, подходит для пост-обработки
- MP3: Сжатие с потерями, меньший файл, подходит для прямого обмена
- Типичный размер файла: 100KB ~ 5MB (зависит от длительности и формата)
- Рекомендуемая частота дискретизации: 48000 Гц для наилучшего качества

【Часто задаваемые вопросы】
В: Почему клонированный голос отличается от оригинала?
О: Качество образца голоса напрямую влияет на результат клонирования. Убедитесь, что аудио чистое, без шума, с одним диктором. Настройка Temperature и CFG может оптимизировать сходство.

В: Генерация очень медленная. Что делать?
О: Переключитесь на режим GPU-вывода. Если нет NVIDIA GPU, попробуйте сократить длину текста или понизить частоту дискретизации.

В: В сгенерированной речи есть шум.
О: Увеличьте параметр «Шумоподавление» (рекомендуется 30~50) или используйте более чистый образец голоса.

В: Описание эмоций не работает.
О: Убедитесь, что используется модель index-tts-2, и соответствующим образом увеличьте параметр «Интенсивность эмоций». Некоторым описаниям эмоций может потребоваться более конкретная формулировка.

В: Как воспроизвести предыдущий результат?
О: Запишите значение Seed, использованное при генерации, затем используйте то же значение Seed и параметры в последующих генерациях.

В: Какие языки текста поддерживаются?
О: В основном китайский и английский; другие языки могут отличаться по качеству в зависимости от данных обучения модели."""

KO_OVERVIEW = """IndexTTS 음성 합성 도구는 제로샷 음성 클로닝 기술을 사용하여 텍스트를 음성으로 변환합니다. 3~10초의 참조 오디오를 업로드하면 모든 음색을 클론할 수 있으며, 기본 음색을 사용할 수도 있습니다. 감정 제어, 속도 조절 및 다양한 출력 형식을 지원합니다.

【사용 튜토리얼】

1단계: 텍스트 준비
텍스트 입력란에 합성할 내용을 입력합니다. 중국어, 영어 등 여러 언어를 지원합니다. 권장사항:
- 한 세그먼트의 텍스트는 500자 이내로 제한하세요. 너무 긴 텍스트는 생성 품질을 저하시킬 수 있습니다
- 표준 구두점(쉼표, 마침표, 물음표)을 사용하여 일시 중지와 억양을 제어하세요
- 중국어 텍스트에서는 희귀한 한자를 피하세요. 모델은 일부 드문 한자의 병음 처리가 부정확할 수 있습니다

2단계: 참조 오디오 선택 (선택사항)
「참조 오디오 업로드」버튼을 클릭하고 3~10초의 오디오 파일을 선택합니다. 권장사항:
- 형식: WAV 또는 MP3, 샘플링 레이트 22050Hz 이상
- 내용: 배경 노이즈가 최소화된 명확한 단일 화자의 목소리
- 길이: 5~7초가 최적입니다. 너무 짧으면 클로닝 효과가 좋지 않고, 너무 길면 처리 시간이 증가합니다
- 음질: 음질이 좋을수록 클로닝 결과가 원음에 가까워집니다
- 참조 오디오를 업로드하지 않으면 기본 음색이 사용됩니다

3단계: 매개변수 조정
필요에 따라 TTS 매개변수를 조정합니다:

기본 매개변수:
- 모델: TTS 모델 버전을 선택합니다. index-tts-1.5는 대부분의 시나리오에 적합한 안정적인 버전입니다. index-tts-2는 고급 감정 제어 기능을 갖추고 있어 풍부한 감정 표현이 필요한 시나리오에 적합합니다.
- Temperature (0~1, 기본값 0.8): 생성 무작위성을 제어합니다. 낮은 값(0.5~0.7)은 공식적이고 안정적인 음성에 적합합니다. 높은 값(0.8~1.0)은 변화가 있고 더 자연스러운 음성에 적합합니다.
- Top P (0~1, 기본값 0.92): 핵 샘플링 임계값. 일반적으로 기본값을 유지합니다. 더 안정적인 출력이 필요하면 0.85로 낮춥니다.
- Top K (1~128, 기본값 48): Top-k 샘플링. 일반적으로 조정이 필요하지 않습니다.

음성 매개변수:
- 속도 (0.5~2.0, 기본값 1.0): 재생 속도. 0.8은 부드럽고 느린 말투에 적합합니다. 1.2~1.5는 빠른 방송에 적합합니다. 2.0은 최대 속도입니다.
- CFG (1~14, 기본값 6.8): 분류기 자유 가이던스 스케일. 7~10이 안전 구간입니다. 너무 높으면 음성이 왜곡될 수 있습니다.

감정 매개변수:
- 감정 강도 (0~2.0, 기본값 1.0): 감정 표현 강도. 0.5는 평탄한 내레이션에 적합합니다. 1.0은 균형입니다. 1.5~2.0은 극적인 표현에 적합합니다.
- 감정 설명: 원하는 감정 스타일을 자연어로 설명합니다. 예: 「부드러운 속삭임」, 「화난 소리치기」, 「기쁘고 흥분된 말투」, 「슬픈 울음」. 중국어와 영어를 지원합니다.

고급 매개변수:
- Seed (기본값 240315): 고정된 시드로 동일한 결과를 재현할 수 있습니다. 마음에 드는 결과의 시드 값을 기록해 두세요.
- 추론 장치: GPU 가속은 빠르지만 NVIDIA GPU 지원이 필요합니다. CPU는 모든 장치에서 작동하지만 속도가 느립니다.
- 출력 형식: WAV는 무손실 음질로 후처리 편집에 적합합니다. MP3는 파일이 작아 직접 공유에 적합합니다.
- 샘플링 레이트: 48000Hz는 CD 음질입니다. 44100Hz는 표준입니다. 22050Hz는 음성에 충분합니다.
- 노이즈 감소 (0~100, 기본값 20): 후처리 노이즈 감소. 참조 오디오에 배경 노이즈가 있으면 높입니다. 음성이 부자연스러워지면 낮춥니다.

4단계: 음성 생성
「음성 생성」버튼을 클릭합니다. 생성 시간은 텍스트 길이와 장치 성능에 따라 다릅니다:
- GPU: 10초 텍스트에 약 5~15초
- CPU: 10초 텍스트에 약 30~60초
생성 중 언제든지 「작업 중단」을 클릭하여 취소할 수 있습니다.

5단계: 결과 처리
생성이 완료되면 결과 영역에 오디오 플레이어가 표시됩니다. 다음 작업을 할 수 있습니다:
- 재생 버튼을 클릭하여 미리 듣기
- 「결과 다운로드」를 클릭하여 로컬에 저장
- 「결과 복사」를 클릭하여 클립보드에 복사(브라우저 지원에 따라 다름)
- 「파일 열기」를 클릭하여 새 탭에서 열기
- 「다시 하기」를 클릭하여 동일한 매개변수로 재생성
- 「JSON 복사」를 클릭하여 현재 구성 복사
- 「JSON 다운로드」를 클릭하여 구성 파일 저장

【TTS 기술 원리】
IndexTTS는 XTTS와 Tortoise를 기반으로 한 GPT 스타일 텍스트 음성 변환 모델입니다. 중국어 병음 발음 교정 및 구두점을 통한 일시 중지 제어를 지원합니다. 모델은 conformer 조건 인코더와 BigVGAN2 기반 speechcode 디코더를 사용하여 고품질 오디오를 출력합니다.

【매개변수 빠른 참조 표】
| 매개변수 | 범위 | 기본값 | 설명 |
|---|---|---|---|
| Temperature | 0~1 | 0.8 | 무작위성 제어 |
| Top P | 0~1 | 0.92 | 핵 샘플링 |
| Top K | 1~128 | 48 | Top-k 샘플링 |
| 속도 | 0.5~2.0 | 1.0 | 재생 속도 |
| CFG | 1~14 | 6.8 | 가이던스 강도 |
| 감정 강도 | 0~2.0 | 1.0 | 감정 강도 |
| Seed | 정수 | 240315 | 무작위 시드 |
| 노이즈 감소 | 0~100 | 20 | 노이즈 감소 강도 |

【출력 형식】
- WAV: 무압축, 최고 음질, 후처리 편집에 적합
- MP3: 손실 압축, 파일이 작음, 직접 공유에 적합
- 일반적인 파일 크기: 100KB ~ 5MB (길이와 형식에 따라 다름)
- 권장 샘플링 레이트: 48000 Hz로 최고 음질 획득

【자주 묻는 질문】
Q: 클론한 목소리가 원음과 다른 이유는?
A: 참조 오디오의 품질이 클로닝 결과에 직접적인 영향을 미칩니다. 오디오가 선명하고 노이즈가 없으며 단일 화자만 있는지 확인하세요. Temperature와 CFG를 조정하여 유사도를 최적화할 수 있습니다.

Q: 생성 속도가 매우 느립니다. 어떻게 해야 하나요?
A: GPU 추론 모드로 전환하세요. NVIDIA GPU가 없는 경우 텍스트 길이를 줄이거나 샘플링 레이트를 낮춰보세요.

Q: 생성된 음성에 잡음이 있습니다.
A: 「노이즈 감소」매개변수를 높입니다(권장 30~50), 또는 더 깨끗한 참조 오디오를 사용하세요.

Q: 감정 설명이 효과가 없습니다.
A: index-tts-2 모델을 사용하고 있는지 확인하고, 「감정 강도」매개변수를 적절히 높이세요. 일부 감정 설명은 더 구체적인 표현이 필요할 수 있습니다.

Q: 이전 결과를 재현하려면?
A: 생성 시 사용한 Seed 값을 기록한 후, 후속 생성에서 동일한 Seed와 매개변수를 사용하면 재현할 수 있습니다.

Q: 어떤 언어 텍스트가 지원됩니까?
A: 주로 중국어와 영어를 지원합니다. 다른 언어는 모델 학습 데이터에 따라 품질이 다를 수 있습니다."""


def replace_overview(content, section_id, new_overview):
    pattern = f"id: '{section_id}'"
    start = content.find(pattern)
    if start == -1:
        return content
    ov_start = content.find('overview: `', start)
    if ov_start == -1:
        return content
    ov_start += len('overview: `')
    ov_end = content.find('`,', ov_start)
    if ov_end == -1:
        return content
    return content[:ov_start] + new_overview + content[ov_end:]


LANG_OVERVIEWS = {
    'zh': ZH_OVERVIEW,
    'en': EN_OVERVIEW,
    'ja': JA_OVERVIEW,
    'ru': RU_OVERVIEW,
    'ko': KO_OVERVIEW,
}


def main():
    base = 'src/docsContent'
    for lang, overview in LANG_OVERVIEWS.items():
        filepath = f'{base}/{lang}.ts'
        if not os.path.exists(filepath):
            print(f"SKIP: {filepath} not found")
            continue
        content = open(filepath).read()
        new_content = replace_overview(content, 'index-tts', overview)
        if new_content is content:
            print(f"SKIP: {lang} - no replacement made")
            continue
        open(filepath, 'w').write(new_content)
        print(f"UPDATED: {lang}.ts")

    print("\nDone updating 5 main languages.")


if __name__ == '__main__':
    main()
