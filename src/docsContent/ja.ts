import type { DocsContent } from './types';

export const docsContent: DocsContent = {
  intro: `Original Character Maker ユーザーマニュアルへようこそ！

本マニュアルは9つの機能モジュールすべての詳細な説明と、グローバルエラー辞書を網羅しています。ツール使用中にエラーが発生したり、ボタンやパラメータの意味が不明な場合は、本マニュアルの該当章節を参照してください。

マニュアル構成：
・ツールマニュアル — 各ツールが独立した章を持ち、機能概要、ボタン説明、パラメータ説明、エラーと解決方法を含みます
・エラー辞書 — カテゴリ（A〜Z、0〜9）で整理されたグローバルエラー索引です。辞書のように素早く検索できます

エラー辞書の使い方：
1. エラーパネルに表示される Code を確認します（例：STYLE_TRANSFER_REQUEST_FAILED）
2. 頭文字で該当カテゴリを見つけます（S → システムとワークフロー）
3. カテゴリ内で辞書順にエントリーを探します
4. 「位置」を読んで、どのページのどの領域でエラーが発生したか確認します
5. 「解決ステップ」に従って順番にトラブルシューティングします`,

  tools: [
    {
      id: 'face-maker',
      title: 'キャラクター作成（顔）',
      overview: `OC Maker の入門ツールです。左側のパーツアセットライブラリから髪型、目の形、眉、鼻、口、顔の形、耳、アクセサリー、ポーズ、トップス、ボトムスを選択し、右側の16個の数値スライダーで比率、色、位置を微調整します。中央のキャンバスでリアルタイムプレビューが可能です。すべての調整はローカルで行われ、画像やデータはアップロードされません。`,
      buttons: [
        { name: '下書きを保存', description: '現在のパーツ選択とパラメータ値をブラウザのローカルストレージに保存します。保存成功後、ステータスインジケーターが黄色の「未保存」から緑色の「保存済み」に変わります。' },
        { name: 'エクスポート', description: '現在の顔設定を JSON ファイル（oc-face-maker-config.json）としてエクスポートします。すべてのパーツとパラメータ値が含まれ、他の人と共有したりバックアップしたりできます。' },
        { name: 'PNG をエクスポート', description: '現在のキャンバスのキャラクター画像を PNG 画像（oc-character.png）としてエクスポートします。頭部、身体、ポーズ、服装の完全な立ち絵が含まれます。' },
        { name: '設定をインポート', description: '以前にエクスポートした JSON 設定ファイルを選択して、パーツ選択とパラメータ値を復元します。インポート後、現在のキャンバスが自動的に上書きされます。' },
        { name: 'リセット', description: 'すべてのパラメータをデフォルト値にリセットし、パーツを初期状態に戻します。操作前に確認ダイアログが表示されます。' },
      ],
      parameters: [
        { name: '頭部スケール', description: '頭部全体のサイズを調整します。範囲は 40〜70 です。数値が大きいほど頭が大きく見えます。', tips: '頭身バランスが崩れないよう、顔の長さと一緒に調整することをお勧めします。' },
        { name: '顔の長さ', description: '顔の長さを調整します。範囲は 30〜70 です。丸顔から長顔への遷移に影響します。' },
        { name: 'あごの幅', description: 'あごの幅を調整します。範囲は 30〜70 です。数値が小さいとあごが尖り、大きいと広くなります。' },
        { name: '肌の色', description: '肌の色合いを調整します。範囲は 0〜100 です。HSL 色相シフトで明るい肌色から暗い肌色へ変化します。' },
        { name: '髪の色', description: '髪の色を調整します。範囲は 0〜100 です。色相回転で虹色の髪色変化を実現します。' },
        { name: '目のサイズ', description: '目全体のスケールを調整します。範囲は 38〜62 です。' },
        { name: 'ポーズ', description: 'キャラクターの全身ポーズを選択します。立ち、腕組み、腰に手、手を振るの4種類があります。', tips: 'ポーズと服装を組み合わせるとプレビュー効果が最適です。' },
        { name: 'トップス', description: 'キャラクターのトップスを選択します。Tシャツ、パーカー、スーツ、セーラー服、なしから選べます。', tips: 'トップスの色は「アクセサリー色」スライダーに従います。' },
      ],
      errors: [
        {
          code: 'CONFIG_CORRUPTED',
          message: '顔設定の読み込みが異常で、キャンバスの表示が不完全またはパラメータスライダーが動作しない',
          severity: 'error',
          category: 'B. 設定とデータ',
          location: 'ページ：キャラクター作成（顔） → 領域：中央キャンバス / 右側パラメータパネル',
          cause: 'ブラウザの localStorage に保存された face-maker の設定データが破損しています。ブラウザの更新、手動でのデータ削除、バージョン間での互換性のない設定のインポートなどが原因です。',
          solution: '設定をリセットして顔を作り直します。',
          steps: [
            '左下の「リセット」ボタンをクリック',
            '確認ダイアログで「リセットを確認」をクリック',
            'それでも異常な場合は Ctrl+Shift+I で DevTools → Application → Local Storage を開き、face-maker で始まるキーを削除',
            'ページを更新して最初からやり直す',
          ],
          relatedCodes: ['IMPORT_INVALID_JSON', 'STORAGE_READ_ONLY'],
          prevention: 'localStorage のデータを手動で変更しないでください。バージョン更新後に異常があれば設定をリセットしてください。',
        },
        {
          code: 'STORAGE_READ_ONLY',
          message: '保存操作が反応せず、更新後にデータが失われる',
          severity: 'critical',
          category: 'B. 設定とデータ',
          location: 'ページ：キャラクター作成（顔） → 領域：左下「下書きを保存」ボタン',
          cause: 'ブラウザがプライベート/シークレットモードであるか、localStorage がシステムポリシーで無効化されているか、ディスク容量が一杯でブラウザがストレージを読み取り専用に設定しています。',
          solution: 'プライベートモードを終了するか、ディスク容量を空けます。',
          steps: [
            'ブラウザがシークレット/プライベートブラウジングモードでないことを確認（このモードでは通常 localStorage が無効化されます）',
            'システムのディスク容量が一杯でないか確認',
            '通常ウィンドウでアプリを再度開いてみる',
            '問題が続く場合は「エクスポート」機能で設定をローカルファイルとして保存する代替案を使用',
          ],
          relatedCodes: ['LOCAL_STORAGE_FULL'],
          prevention: 'ブラウザのシークレット/プライベートモードでこのアプリを使用しないでください。定期的に設定をローカルファイルにエクスポートしてバックアップしてください。',
        },
      ],
    },
    {
      id: 'style-transfer',
      title: '画風変換',
      overview: `キャラクター画像を指定した画風に変換するツールです。PNG/JPG のキャラクター画像をアップロードした後、AI モデルを選択し、Prompt を作成し、高度なパラメータを調整して、バックエンド API を呼び出して画風変換を行います。自動切り抜き、配色保持、ポーズ維持、顔ロックなどの高度な機能をサポートしています。インターネット接続と有効な API Key が必要です。`,
      buttons: [
        { name: '画像を選択 / 画像を置換', description: 'キャラクター画像ファイルをアップロードします。PNG と JPG 形式をサポート。単人の立ち絵や鮮明な半身像を推奨します。' },
        { name: '開始', description: '画風変換プロセスを開始します。入力ファイルとパラメータを検証した後、バックエンドに変換リクエストを送信します。' },
        { name: 'JSON をコピー', description: '現在のすべてのパラメータ設定を JSON テキストとしてクリップボードにコピーします。共有やバックアップに便利です。' },
        { name: '結果をダウンロード', description: '変換後の結果画像をローカルにダウンロードします。' },
        { name: 'リセット', description: 'すべてのパラメータをデフォルト値にリセットし、アップロードした画像と結果をクリアします。' },
      ],
      parameters: [
        { name: 'モデル', description: '使用する AI 画像生成モデルを選択します。組み込みモードは Plato バックエンドチャンネルを使用し、カスタムモードは設定した外部 API を使用します。', tips: 'gpt-image-2 はデフォルト推奨モデルです。claude-4-sonnet はキャラクター一貫性に優れています。' },
        { name: 'Prompt', description: 'ポジティブプロンプト。望ましい画風、シーン、キャラクター特徴を記述します。', tips: '「Effective Prompt Preview」で最終的な Prompt を確認できます。' },
        { name: 'Negative Prompt', description: 'ネガティブプロンプト。表示させたくない内容を記述します。', tips: '一般的なネガティブタグ：低品質、余分な指、変形した身体、ぼやけなど。' },
        { name: 'Temperature', description: 'サンプリング温度。生成結果のランダム性を制御します。範囲 0〜2、デフォルト 0.7。', tips: '値が低いほど安定した結果になり、高いほど創造的ですが予想外の結果になることがあります。' },
        { name: 'Strength', description: '画風強度/再描画幅度。範囲 0〜1。値が大きいほど元画像の保持が少なく、画風の変化が徹底的になります。', tips: '0.4〜0.6 が一般的な範囲です。画風を変えながらキャラクター特徴を保持できます。' },
      ],
      errors: [
        {
          code: 'API_KEY_MISSING',
          message: '「開始」をクリックすると直ちにエラー、API Key 関連のエラーが表示される',
          severity: 'critical',
          category: 'A. API とネットワーク',
          location: 'ページ：画風変換 → 領域：左パネル下部エラーパネル',
          cause: '「設定 → API」で API Key が設定されていないか、Key がクリアされています。画風変換には有効な API Key が必要です。',
          solution: '設定パネルで有効な API Key を設定します。',
          steps: [
            '右上の「設定を開く」または対応するショートカットをクリック',
            '「API」タブに切り替える',
            '「API Key」入力欄に有効な Key を入力',
            '「保存」をクリックして設定パネルを閉じる',
            '画風変換ページに戻り「開始」を再度クリック',
          ],
          relatedCodes: ['API_KEY_EXPIRED', '401_UNAUTHORIZED'],
          prevention: 'オンラインツールを初めて使用する前に、必ず「設定 → API」で有効な API Key を設定してください。',
        },
        {
          code: 'API_TIMEOUT',
          message: 'リクエストが長時間応答せず、最終的にタイムアウトを示す',
          severity: 'error',
          category: 'A. API とネットワーク',
          location: 'ページ：画風変換 → 領域：左パネル下部エラーパネル / プログレスバー',
          cause: 'バックエンド生成に時間がかかりすぎ、フロントエンドのタイムアウト設定を超えました。画像サイズが大きすぎる、モデル負荷が高い、ネットワーク遅延が高いなどが原因です。',
          solution: '画像サイズを縮小するか、ネットワーク接続を確認します。',
          steps: [
            '「高度なパラメータ」で「画像サイズ」を縮小（2048 以下を推奨）',
            '「Steps」値を下げる（20〜30 を推奨）',
            'ネットワーク接続が安定しているか確認',
            'カスタム API を使用している場合、バックエンドサーバーの状態を確認',
            '変換を再試行',
          ],
          relatedCodes: ['NETWORK_TIMEOUT', 'BACKEND_UNAVAILABLE'],
          prevention: '大きな画像や大量のテキストを処理する際は、事前にパラメータ規模を縮小してください。ネットワークが不安定な場合はタイムアウト設定を増やしてください。',
        },
      ],
    },
    {
      id: 'character-gif',
      title: 'Character GIF Generator',
      overview: `Character GIF Generator creates animated GIFs from static character images. Upload a PNG/JPG character image, adjust animation parameters (frames, FPS, loop, motion type, easing), and generate a dynamic GIF with effects like breathing, blinking, swaying, floating, heartbeat, hair-flow, tail-wag, and magic-glow. Supports automatic cutout, palette preservation, pose lock, face lock, and other advanced features. Requires internet connection and valid API Key.

Basic Process:
1. Upload a source character image
2. Adjust GIF animation parameters (frames, FPS, motion type)
3. Select model and style options
4. Click "Generate GIF"
5. View, copy, or download the animated GIF

[GIF Animation Technology]
Character GIF uses frame interpolation and motion synthesis. The backend generates intermediate frames between key poses based on the selected motion type and easing function. Loop and reverse-loop options control playback behavior.

Content frames are generated through pose interpolation on the timeline: each frame is a slight deformation from the previous one, ensuring smooth and natural animation. Total frames determine animation smoothness; FPS controls playback speed.

[Supported Motion Types]
The tool includes 8 built-in animation effects:
1. Breathing: Subtle chest expansion/contraction, simulating lifelike presence
2. Blinking: Eye open/close cycle, ideal for portrait characters
3. Swaying: Gentle left-right body movement, adding liveliness
4. Floating: Up-down levitation effect, ideal for magical/fantasy characters
5. Heartbeat: Pulsing glow or scale animation, enhancing emotional expression
6. Hair-flow: Hair strands swaying in the wind, adding dynamic detail
7. Tail-wag: Rhythmic tail movement for characters with tails
8. Magic-glow: Pulsing magical aura effect

[Parameter Details]
- Frames (2~60): Total number of frames in the GIF. More frames = smoother animation but larger file size. 8-16 frames is typical for web GIFs.
- FPS (1~60): Frames per second. 12 FPS is standard for web GIFs; 24+ for smoother animation.
- Loop: Whether the GIF loops infinitely. Disable for one-shot animations.
- Duration (10~1000ms): Display time per frame in milliseconds.
- Motion Type: Select the animation style (breathing, blinking, swaying, etc.).
- Easing: Linear, easeIn, easeOut, easeInOut, spring, or bounce.
- Reverse Loop: Play forward then backward, creating a ping-pong loop.
- Style Intensity (0~1): Controls stylization degree.
- Line Art Style: clean, sketchy, thick, thin, or none.
- Color Scheme: vibrant, pastel, muted, monochrome, neon, warm, or cool.
- Background Type: simple, gradient, detailed, transparent, or blurred.
- Lighting Style: dramatic, soft, neon, natural, studio, or backlight.
- Camera Angle: three-quarter, front, profile, low-angle, high-angle, dutch, or over-shoulder.
- Character Mood: calm, happy, serious, shy, confident, surprised, angry, or sad.
- Outfit Detail: school uniform, casual wear, battle outfit, maid outfit, kimono, gothic lolita, sportswear, swimsuit, wedding dress, or idol costume.

[Output Formats and Optimization]
- GIF format, optimized for web use
- Transparent background supported when cutout is enabled
- Typical file size: 500KB ~ 5MB depending on frames and resolution
- Output resolution controlled via Image Size parameter
- Recommended: 512x512 or 1024x1024 for best balance`,
      buttons: [
        { name: 'Upload / Replace Image', description: 'Upload a character image file. Supports PNG and JPG. Recommend a single-character illustration or clear half-body image.' },
        { name: 'Generate GIF', description: 'Starts the GIF generation workflow. Validates input and parameters, then sends the request to the backend.' },
        { name: 'Abort Task', description: 'Cancels the ongoing GIF generation task.' },
        { name: 'Copy JSON', description: 'Copies current parameter config as JSON to clipboard for sharing or backup.' },
        { name: 'Download JSON', description: 'Downloads current parameter config as a JSON file.' },
        { name: 'Copy Result', description: 'After successful generation, copies the GIF to clipboard (if browser supports).' },
        { name: 'Download Result', description: 'Downloads the generated GIF to local machine.' },
        { name: 'Open File', description: 'Opens the generated GIF in a new tab.' },
        { name: 'Redo', description: 'Regenerates the GIF using the same parameters.' },
        { name: 'Show / Hide Details', description: 'Expands or collapses the advanced parameters panel and debug info panel.' },
        { name: 'Refresh', description: 'Resets all parameters to defaults, clears uploaded image and results.' },
        { name: 'Positive Tag Library', description: 'Opens tag picker to quickly insert positive Prompt tags from categorized library.' },
        { name: 'Negative Tag Library', description: 'Opens tag picker to quickly insert negative Prompt tags from categorized library.' },
        { name: 'Advanced Params', description: 'Expands more professional parameters: aspect ratio, lighting, camera angle, mood, outfit, line art style, etc.' },
      ],
      parameters: [
        { name: 'Model', description: 'Selects the AI image generation model. Built-in mode uses Plato backend; custom mode uses your configured external API.', tips: 'gpt-image-2 is the recommended default. Anime Transfer XL v4 performs better for anime styles.' },
        { name: 'Prompt', description: 'Positive prompt describing desired art style, scene, and character features. Supports Positive Tag Library for quick insertion.', tips: 'Advanced parameters are automatically appended as English suffixes. View final effect in Effective Prompt Preview.' },
        { name: 'Negative Prompt', description: 'Describes content you do not want. Supports Negative Tag Library for quick insertion.', tips: 'Common negative tags: low quality, extra fingers, deformed body, blurry, etc.' },
        { name: 'Temperature', description: 'Sampling temperature controlling randomness. Range 0~2, default 0.78.', tips: 'Lower = more stable/predictable; higher = more creative but may deviate. GIF generation recommends 0.6~0.9.' },
        { name: 'Top P', description: 'Nucleus sampling threshold. Range 0~1, default 0.92.', tips: 'Lower reduces diversity, increases consistency.' },
        { name: 'Top K', description: 'Top-K sampling. Range 1~128, default 48.', tips: 'Lower values make generation more conservative.' },
        { name: 'Seed', description: 'Random seed, default 240315. Fixed seed enables reproducible results.', tips: 'Record seeds of favorite results for easy reproduction.' },
        { name: 'Steps', description: 'Denoising steps. Range 8~60. More steps = richer detail but longer time.', tips: 'GIF generation recommends 20~30 steps for quality-speed balance.' },
        { name: 'CFG', description: 'Classifier-Free Guidance scale. Range 1~14, default 6.8.', tips: 'Higher = stronger prompt adherence. 7~10 is the safe zone.' },
        { name: 'Frames', description: 'Total frames in GIF. Range 2~60, default 8.', tips: '8-16 frames is standard for web GIFs. More frames = smoother but larger file and longer generation.' },
        { name: 'FPS', description: 'Frames per second. Range 1~60, default 12.', tips: '12 FPS is web standard; 24+ for smoother animation.' },
        { name: 'Loop', description: 'Whether GIF loops infinitely.', tips: 'Disable for one-shot animations.' },
        { name: 'Frame Duration (ms)', description: 'Display time per frame in milliseconds. Range 10~1000, default 100.', tips: '100ms = 10 FPS. Works with FPS to control playback speed.' },
        { name: 'Motion Type', description: 'Animation style applied to the character.', tips: 'Breathing works best for static poses; blinking adds life to portraits; floating suits magical/fantasy characters.' },
        { name: 'Easing', description: 'How animation accelerates/decelerates.', tips: 'easeInOut is most natural for breathing and swaying; spring suits heartbeat and tail-wag.' },
        { name: 'Reverse Loop', description: 'Forward then backward playback, creating a ping-pong loop.', tips: 'Great for breathing and swaying; saves frames.' },
        { name: 'Need Cutout', description: 'Whether to auto-remove background before generation. Enables transparent GIF.', tips: 'Transparent GIFs are ideal for web overlays and stickers.' },
        { name: 'Keep Palette', description: 'Whether to force preservation of original image color scheme.', tips: 'Enable to ensure consistent character colors across frames.' },
        { name: 'Preserve Pose', description: 'Whether to maintain original character pose and composition.', tips: 'Recommended to prevent pose distortion from animation.' },
        { name: 'Face Lock', description: 'Whether to use facial feature locking for consistent face across frames.', tips: 'Strongly recommended, especially for blinking animations.' },
        { name: 'Detail Boost', description: 'Whether to enhance detail for sharper output GIF.', tips: 'Improves edge clarity but increases generation time.' },
        { name: 'Aspect Ratio', description: 'Output GIF aspect ratio preset (1:1, 2:3, 3:2, 16:9, etc.).', tips: 'Match source image ratio for best results.' },
        { name: 'Image Size', description: 'Output GIF short-edge pixel count.', tips: '512x512 or 1024x1024 is the sweet spot.' },
        { name: 'Style Intensity', description: 'Controls stylization degree. Range 0~1, default 0.75.', tips: '0.5~0.8 is the common range.' },
        { name: 'Line Art Style', description: 'Output GIF line art processing style.', tips: 'clean suits most anime styles; sketchy for hand-drawn feel.' },
        { name: 'Color Scheme', description: 'Forced color theme application.', tips: 'vibrant for vivid characters; pastel for soft styles.' },
        { name: 'Background Type', description: 'Background processing method.', tips: 'transparent with cutout enables transparent GIFs.' },
        { name: 'Lighting Style', description: 'Scene lighting effect.', tips: 'soft for everyday scenes; dramatic for theatrical characters.' },
        { name: 'Camera Angle', description: 'Virtual camera shooting angle.', tips: 'three-quarter is the most common character display angle.' },
        { name: 'Character Mood', description: 'Character emotional state.', tips: 'Mood affects facial expression and posture.' },
        { name: 'Outfit Detail', description: 'Character clothing type.', tips: 'Detailed outfit descriptions yield more precise results.' },
        { name: 'Eye Style', description: 'Character eye processing style.', tips: 'detailed for most anime characters; sparkling for moe characters.' },
        { name: 'Hair Style', description: 'Character hairstyle type.', tips: 'Hairstyle affects overall character impression.' },
        { name: 'Skin Texture', description: 'Character skin processing style.', tips: 'smooth for anime style; realistic for realistic style.' },
      ],
      errors: [
        {
          code: 'API_KEY_MISSING',
          message: 'Clicking "Generate GIF" immediately shows API Key error',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Character GIF → Area: error panel',
          cause: 'API Key not configured in Settings → API, or Key was cleared. Character GIF requires valid API Key.',
          solution: 'Configure a valid API Key in Settings.',
          steps: [
            'Click "Open Settings" or use shortcut',
            'Switch to "API" tab',
            'Enter valid Key in "API Key" field',
            'Save and close settings',
            'Return to Character GIF and click "Generate GIF"',
          ],
          relatedCodes: ['API_KEY_EXPIRED', '401_UNAUTHORIZED'],
          prevention: 'Before using any online tool, configure a valid API Key in Settings → API.',
        },
        {
          code: 'API_KEY_EXPIRED',
          message: 'Request returns 401 or Key invalid',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Character GIF → Area: error panel',
          cause: 'API Key expired, revoked, or quota exhausted.',
          solution: 'Replace with a valid API Key.',
          steps: [
            'Open Settings → API',
            'Delete current Key, enter new valid Key',
            'Test Key validity in LLM Hub real-time test panel',
            'Save and retry',
          ],
          relatedCodes: ['API_KEY_MISSING', '401_UNAUTHORIZED'],
          prevention: 'Regularly check API Key validity and quota; verify via LLM Hub real-time test.',
        },
        {
          code: 'API_TIMEOUT',
          message: 'Request times out after long wait',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Character GIF → Area: error panel / progress bar',
          cause: 'Backend generation too slow. GIF generation takes longer than single images, especially with many frames or large size.',
          solution: 'Reduce frames, image size, or check network.',
          steps: [
            'Reduce Image Size to 1024 or below',
            'Reduce Frames to 8~12',
            'Reduce Steps to 20~28',
            'Check network stability',
            'Retry',
          ],
          relatedCodes: ['NETWORK_TIMEOUT', 'BACKEND_UNAVAILABLE'],
          prevention: 'GIF generation takes longer; reduce parameters (image size, frames, Steps) in advance.',
        },
        {
          code: 'BACKEND_UNAVAILABLE',
          message: 'Backend unavailable or cannot connect',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Character GIF → Area: error panel',
          cause: 'Backend not started, crashed, or API Base URL misconfigured.',
          solution: 'Check backend status and API config.',
          steps: [
            'Open DevTools → Network tab',
            'Click "Generate GIF", observe request and status code',
            'If no request, check Settings → API → API Base URL',
            'If 502/503, contact admin',
            'If local, confirm backend running (npm start)',
          ],
          relatedCodes: ['NETWORK_DISCONNECTED', '502_BAD_GATEWAY', '503_SERVICE_UNAVAILABLE'],
          prevention: 'Ensure backend running (npm start) for local; confirm URL for remote.',
        },
        {
          code: 'NETWORK_DISCONNECTED',
          message: 'Network disconnected or no internet',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Character GIF → Area: error panel',
          cause: 'Device offline, Wi-Fi disconnected, or firewall blocking.',
          solution: 'Restore network connection.',
          steps: [
            'Check device network status',
            'Try other websites',
            'Check proxy/VPN settings',
            'Confirm API access on company/campus networks',
          ],
          relatedCodes: ['BACKEND_UNAVAILABLE', 'API_TIMEOUT'],
          prevention: 'Confirm network before using online tools; avoid unstable networks.',
        },
        {
          code: 'FILE_FORMAT_UNSUPPORTED',
          message: 'Upload shows "Unsupported file format"',
          severity: 'warning',
          category: 'C. File & Input',
          location: 'Page: Character GIF → Area: upload button',
          cause: 'Selected WEBP, GIF, BMP, TIFF, or other unsupported formats. Only PNG and JPG supported.',
          solution: 'Convert to PNG or JPG.',
          steps: [
            'Use Image Converter (Home → Image Format Converter)',
            'Or use system image viewer to export as PNG/JPG',
            'Re-select converted file',
          ],
          relatedCodes: ['FILE_CORRUPTED', 'UPLOAD_FORMAT'],
          prevention: 'Confirm PNG or JPG format before uploading.',
        },
        {
          code: 'FILE_TOO_LARGE',
          message: 'Upload fails or memory error during generation',
          severity: 'warning',
          category: 'C. File & Input',
          location: 'Page: Character GIF → Area: preview area',
          cause: 'Image too large (>4096x4096) or file exceeds limits. GIF generation requires more memory.',
          solution: 'Compress or resize image before upload.',
          steps: [
            'Use Image Converter to scale longest side below 2048 or 1024',
            'Convert PNG to JPG to reduce size',
            'Re-upload',
          ],
          relatedCodes: ['DEVICE_MEMORY_LOW', 'FILE_FORMAT_UNSUPPORTED'],
          prevention: 'Upload 1024×1024 ~ 2048×2048 images; GIF uses more memory.',
        },
        {
          code: 'FILE_CORRUPTED',
          message: 'Preview shows blank or corrupted',
          severity: 'warning',
          category: 'C. File & Input',
          location: 'Page: Character GIF → Area: preview area',
          cause: 'Image file corrupted or incomplete download.',
          solution: 'Use another image or repair/re-download.',
          steps: [
            'Open in system image viewer to confirm',
            'Repair or re-download if needed',
            'Use another valid PNG/JPG',
          ],
          relatedCodes: ['FILE_FORMAT_UNSUPPORTED', 'UPLOAD_FORMAT'],
          prevention: 'Confirm image opens normally before uploading.',
        },
        {
          code: 'MODEL_NOT_FOUND',
          message: 'Error shows "Model unavailable" or 404',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Character GIF → Area: error panel',
          cause: 'Model does not exist, removed, or Key lacks permission.',
          solution: 'Switch to another available model.',
          steps: [
            'Select another model (e.g., gpt-image-2)',
            'Confirm model ID spelling for custom API',
            'Verify Key supports selected model in Settings → API',
            'Retry',
          ],
          relatedCodes: ['403_FORBIDDEN', 'API_KEY_EXPIRED'],
          prevention: 'Select known available models; check provider docs for custom API.',
        },
        {
          code: 'PROMPT_BLOCKED',
          message: 'Content policy violation or sensitive word interception',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Character GIF → Area: error panel',
          cause: 'Prompt or Negative Prompt contains words intercepted by safety filter.',
          solution: 'Modify prompt, remove sensitive vocabulary.',
          steps: [
            'Check error details for intercepted keywords',
            'Replace or remove sensitive words',
            'Simplify prompt, test with basic description first',
            'Add modifiers gradually to find trigger words',
          ],
          relatedCodes: ['403_FORBIDDEN'],
          prevention: 'Avoid sensitive words; test default prompt first before customizing.',
        },
        {
          code: 'PROMPT_TOO_LONG',
          message: 'Prompt exceeds maximum length',
          severity: 'warning',
          category: 'D. Model & Generation',
          location: 'Page: Character GIF → Area: prompt editor / error panel',
          cause: 'Prompt + advanced parameter suffixes exceed backend model input limit.',
          solution: 'Shorten prompt or reduce advanced parameters.',
          steps: [
            'View full prompt length in Effective Prompt Preview',
            'Trim positive prompt, remove redundancy',
            'Reduce number of advanced parameters',
            'Retry',
          ],
          relatedCodes: ['MODEL_NOT_FOUND'],
        },
        {
          code: 'CHARACTER_GIF_INPUT_MISSING',
          message: 'Clicking "Generate GIF" shows no image uploaded',
          severity: 'warning',
          category: 'C. File & Input',
          location: 'Page: Character GIF → Area: error panel',
          cause: 'No image uploaded, or invalid input file when clicking Generate.',
          solution: 'Upload a valid image file.',
          steps: [
            'Click "Upload Image"',
            'Select valid PNG/JPG file',
            'Confirm preview shows thumbnail',
            'Click "Generate GIF"',
          ],
          relatedCodes: ['FILE_FORMAT_UNSUPPORTED', 'FILE_CORRUPTED'],
          prevention: 'Confirm source image uploaded and preview normal before generating.',
        },
        {
          code: 'CHARACTER_GIF_REQUEST_FAILED',
          message: 'Error panel shows "CHARACTER_GIF_REQUEST_FAILED"',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Character GIF → Area: error panel',
          cause: 'Backend API request failed. Possible: network interruption, invalid Key, model unavailable, too many frames causing memory error, or server error.',
          solution: 'Troubleshoot based on error details.',
          steps: [
            'Expand error panel for details (HTTP code, backend message)',
            '401: Check API Key validity',
            '404: Check model availability',
            '429: Wait and retry, reduce frequency',
            '500/502/503: Check backend status',
            'Memory error: Reduce frames (below 8) and image size',
            'Network error: Check connection',
          ],
          relatedCodes: ['API_KEY_MISSING', 'API_KEY_EXPIRED', 'MODEL_NOT_FOUND', 'BACKEND_UNAVAILABLE', '429_TOO_MANY_REQUESTS'],
          prevention: 'Confirm API Key valid, network normal, model available before generating; test with low frames (8) first.',
        },
        {
          code: '429_TOO_MANY_REQUESTS',
          message: 'Rate limit exceeded',
          severity: 'warning',
          category: 'A. API & Network',
          location: 'Page: Character GIF → Area: error panel',
          cause: 'Too many requests in short time. GIF generation uses more resources, more likely to trigger rate limits.',
          solution: 'Wait and retry.',
          steps: [
            'Check Retry-After hint in error details',
            'Wait 60~120 seconds',
            'Reduce frames and image size if frequent',
            'Consider upgrading API plan',
          ],
          relatedCodes: ['API_RATE_LIMIT', 'CHARACTER_GIF_REQUEST_FAILED'],
          prevention: 'GIF uses more resources; reduce request frequency; avoid rapid retries.',
        },
        {
          code: '500_INTERNAL_ERROR',
          message: 'Backend returns 500 Internal Server Error',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Character GIF → Area: error panel',
          cause: 'Backend internal exception. Possible: model load failure, GPU OOM (GIF uses more VRAM), or code bug.',
          solution: 'Retry later or contact admin.',
          steps: [
            'Wait 1~2 minutes',
            'Reduce image size, frames, and Steps',
            'Contact admin if persistent',
          ],
          relatedCodes: ['502_BAD_GATEWAY', '503_SERVICE_UNAVAILABLE'],
          prevention: 'Reduce request scale (image size, frames, Steps); avoid high-load periods.',
        },
        {
          code: '502_BAD_GATEWAY',
          message: 'Backend returns 502 Bad Gateway',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Character GIF → Area: error panel',
          cause: 'Reverse proxy cannot connect to backend. Backend may have crashed.',
          solution: 'Check backend status.',
          steps: [
            'Confirm backend running for local deploy',
            'Check port conflicts',
            'Review backend logs',
            'Restart backend',
          ],
          relatedCodes: ['503_SERVICE_UNAVAILABLE', 'BACKEND_UNAVAILABLE'],
          prevention: 'Ensure backend running locally; check reverse proxy config.',
        },
        {
          code: '503_SERVICE_UNAVAILABLE',
          message: 'Backend returns 503 Service Unavailable',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Character GIF → Area: error panel',
          cause: 'Backend temporarily unavailable. May be under maintenance, restart, or overload protection.',
          solution: 'Retry later.',
          steps: [
            'Wait 2~3 minutes',
            'Check status page if available',
            'Contact admin for maintenance info',
          ],
          relatedCodes: ['502_BAD_GATEWAY', 'BACKEND_UNAVAILABLE'],
          prevention: 'Avoid maintenance windows; reduce request frequency during high load.',
        },
        {
          code: 'IMPORT_INVALID_JSON',
          message: 'Import shows "Invalid JSON format"',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Page: Character GIF → Area: import config button',
          cause: 'File corrupted, not JSON, or modified by other programs.',
          solution: 'Verify valid UTF-8 text file.',
          steps: [
            'Open in text editor, check for garbled text',
            'Confirm file contains "tool": "character-gif"',
            'Validate with online JSON formatter',
          ],
          relatedCodes: ['IMPORT_TOOL_MISMATCH'],
        },
        {
          code: 'IMPORT_TOOL_MISMATCH',
          message: 'Import shows "Tool type mismatch"',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Page: Character GIF → Area: import config button',
          cause: 'Imported JSON tool field is not character-gif.',
          solution: 'Confirm importing Character GIF config file.',
          steps: [
            'Open in text editor',
            'Confirm tool field is "character-gif"',
            'Find correct config or import from corresponding tool page',
          ],
          relatedCodes: ['IMPORT_INVALID_JSON'],
        },
        {
          code: 'DEVICE_MEMORY_LOW',
          message: 'Browser tab crashes or becomes unresponsive',
          severity: 'critical',
          category: 'F. System & Permissions',
          location: 'Page: Character GIF → Area: entire page',
          cause: 'Device memory insufficient. GIF generation requires more memory, especially with many frames.',
          solution: 'Close other tabs, reduce image size/frames, or use device with more memory.',
          steps: [
            'Save current work',
            'Close other browser tabs',
            'Reduce image longest side to 1024 or below',
            'Reduce frames to 8 or below',
            'Restart browser and retry',
          ],
          relatedCodes: ['FILE_TOO_LARGE'],
          prevention: 'Close tabs before large tasks; scale image to 1024; use 8 or fewer frames.',
        },
      ],
    },
    {
      id: 'index-tts',
      title: 'IndexTTS 音声合成',
      overview: `IndexTTS 音声合成ツールは、ゼロショット音声クローニング技術を使用してテキストを音声に変換します。3〜10秒の参照音声をアップロードすると任意の音色をクローンでき、デフォルトの音色を使用することも可能です。感情制御、話速調整、複数の出力形式に対応しています。

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
A: 主に中国語と英語に対応しています。他の言語はモデルの学習データによって品質が異なる場合があります。`,
      buttons: [
        { name: '音声を生成', description: 'TTS 生成ワークフローを開始。入力テキストとパラメータを検証してバックエンドにリクエストを送信。' },
        { name: 'タスクを中止', description: '進行中の TTS 生成タスクをキャンセル。' },
        { name: 'JSON をコピー', description: '現在のパラメータ設定を JSON 形式でクリップボードにコピー。' },
        { name: 'JSON をダウンロード', description: '現在のパラメータ設定を JSON ファイルとしてダウンロード。' },
        { name: '結果をコピー', description: '生成成功後、音声をクリップボードにコピー（ブラウザが対応する場合）。' },
        { name: '結果をダウンロード', description: '生成された音声をローカルにダウンロード。' },
        { name: 'ファイルを開く', description: '新しいタブで生成された音声を開く。' },
        { name: 'やり直し', description: '同じパラメータで音声を再生成。' },
        { name: '詳細を表示/非表示', description: 'パラメータパネルとデバッグ情報パネルを展開または折りたたむ。' },
        { name: 'リセット', description: 'すべてのパラメータをデフォルトにリセットし、テキストと結果をクリア。' },
      ],
      parameters: [
        { name: 'モデル', description: 'TTS モデルバージョンを選択。', tips: 'index-tts-1.5 は安定版；index-tts-2 は高度な感情制御機能を備える。' },
        { name: 'Temperature', description: 'サンプリング温度、ランダム性を制御。範囲 0〜1、デフォルト 0.8。', tips: '低いほど安定/予測可能；高いほど創造的だが逸脱する可能性。' },
        { name: 'Top P', description: '核サンプリング閾値。範囲 0〜1、デフォルト 0.92。', tips: '低いほど多様性が低く、一貫性が高い。' },
        { name: 'Top K', description: 'Top-K サンプリング。範囲 1〜128、デフォルト 48。', tips: '低い値ほど生成が保守的。' },
        { name: '話速', description: '再生速度の倍率。範囲 0.5〜2.0、デフォルト 1.0。', tips: '1.0 は通常速度；0.5 は半分；2.0 は倍速。' },
        { name: 'CFG', description: '分類器自由ガイダンス尺度。範囲 1〜14、デフォルト 6.8。', tips: '高いほどプロンプトへの忠実度が高い。7〜10 が安全圏。' },
        { name: '感情強度', description: '感情表現の強度。範囲 0.0〜2.0、デフォルト 1.0。', tips: '0.0 = ニュートラル；1.0 = バランス；2.0 = 非常に表現力豊か。' },
        { name: '感情説明', description: '自然言語を使用したソフトな感情指示。', tips: '例：「怒った shouting」、「優しく囁く」、「楽しそうに興奮」。' },
        { name: 'Seed', description: 'ランダムシード、デフォルト 240315。固定シードで再現可能な結果。', tips: 'お気に入りの結果のシードを記録して再現しやすくする。' },
        { name: '推論デバイス', description: '推論デバイス：GPU（高速）または CPU（フォールバック）。', tips: '高速生成には GPU を推奨；CPU は任意のマシンで動作。' },
        { name: '出力形式', description: '出力音声形式：WAV または MP3。', tips: 'WAV は最高音質；MP3 は小さく持ち運びしやすい。' },
        { name: 'サンプリングレート', description: '出力サンプリングレート（Hz）。', tips: '48000 Hz は CD 音質；44100 Hz は標準；22050 Hz は音声に許容範囲。' },
        { name: '降噪強度', description: '後処理ノイズ除去の強度。範囲 0〜100、デフォルト 20。', tips: '高いほど背景ノイズを除去するが、音質に影響する可能性。' },
      ],
            errors: [
        {
          code: 'API_KEY_MISSING',
          message: '「音声を生成」をクリックするとすぐにエラーが表示され、エラーパネルに API Key 関連のエラーが表示される',
          severity: 'critical',
          category: 'A. API とネットワーク',
          location: 'ページ：IndexTTS 音声合成 → 領域：左パネル下部エラーパネル',
          cause: '「設定 → API」で API Key が設定されていないか、Key が空になっています。IndexTTS の生成には有効な API Key が必要です。',
          solution: '設定パネルで有効な API Key を設定します。',
          steps: ['右上の「設定を開く」をクリックするかショートカットを使用', '「API」タブに切り替え', '「API Key」入力欄に有効な Key を入力', '「保存」をクリックして設定パネルを閉じる', 'IndexTTS ページに戻って「音声を生成」を再度クリック'],
          relatedCodes: ['API_KEY_EXPIRED', 'INDEX_TTS_NOT_CONFIGURED'],
          prevention: '初めてネットワークツールを使用する前に、必ず「設定 → API」で有効な API Key を設定してください。',
        },
        {
          code: 'API_KEY_EXPIRED',
          message: '生成リクエストが 401 を返すか、Key が無効と表示される',
          severity: 'critical',
          category: 'A. API とネットワーク',
          location: 'ページ：IndexTTS 音声合成 → 領域：左パネル下部エラーパネル',
          cause: '設定された API Key の有効期限が切れたか、失効したか、クォータが使い果たされています。',
          solution: '有効な API Key に交換します。',
          steps: ['「設定 → API」パネルを開く', '現在の Key を削除し、新しい有効な Key を入力', 'Key が有効かどうか不明な場合は、LLM Hub のリアルタイムテストパネルで先にテスト', '保存して IndexTTS に戻って再試行'],
          relatedCodes: ['API_KEY_MISSING', '401_UNAUTHORIZED'],
          prevention: 'API Key の有効期限と残りクォータを定期的に確認；LLM Hub のリアルタイムテストで Key の有効性を迅速に確認してください。',
        },
        {
          code: 'API_TIMEOUT',
          message: 'リクエストが長時間応答せず、最終的にタイムアウトする',
          severity: 'error',
          category: 'A. API とネットワーク',
          location: 'ページ：IndexTTS 音声合成 → 領域：左パネル下部エラーパネル / プログレスバー',
          cause: 'バックエンドの生成に時間がかかりすぎ、フロントエンドのタイムアウト時間を超えました。TTS 生成は GPU 性能を要求し、長いテキストや高サンプリングレートではさらに時間がかかります。',
          solution: 'テキストを短くするか、サンプリングレートを下げるか、ネットワーク接続を確認します。',
          steps: ['入力テキストを短くする（200文字以内を推奨）', 'サンプリングレートを下げる（例：48000Hz から 22050Hz）', 'ネットワーク接続が安定しているか確認', 'CPU 推論を使用している場合は GPU モードへの切り替えを検討', '再生成を試行'],
          relatedCodes: ['NETWORK_TIMEOUT', 'BACKEND_UNAVAILABLE', 'INDEX_TTS_GPU_OUT_OF_MEMORY'],
          prevention: '長いテキストは生成に時間がかかります；事前にテキストを短くしてください；ネットワークが不安定な場合はタイムアウト設定を増やしてください。',
        },
        {
          code: 'BACKEND_UNAVAILABLE',
          message: '「バックエンドが利用できません」または「サーバーに接続できません」と表示される',
          severity: 'critical',
          category: 'A. API とネットワーク',
          location: 'ページ：IndexTTS 音声合成 → 領域：左パネル下部エラーパネル',
          cause: 'バックエンドサーバーが起動していないか、クラッシュしたか、フロントエンドに設定された API Base URL が正しくありません。',
          solution: 'バックエンドサービスの状態と API 設定を確認します。',
          steps: ['ブラウザの開発者ツール → Network タブを開く', '「音声を生成」を再度クリックし、リクエストが送信されたかおよび応答ステータスコードを確認', 'リクエストが送信されていない場合は「設定 → API → API Base URL」が正しいか確認', 'リクエストが 502/503 を返す場合は、バックエンド管理者にサービス状態を確認', 'ローカルデプロイの場合は、バックエンドプロセスが実行中か確認（npm start）'],
          relatedCodes: ['NETWORK_DISCONNECTED', '502_BAD_GATEWAY', '503_SERVICE_UNAVAILABLE'],
          prevention: 'ローカルデプロイの場合はバックエンドプロセスが起動していることを確認（npm start）；リモートサービスの場合は URL 設定が正しいことを確認してください。',
        },
        {
          code: 'NETWORK_DISCONNECTED',
          message: 'ネットワークが切断されたか、インターネットにアクセスできないと表示される',
          severity: 'critical',
          category: 'A. API とネットワーク',
          location: 'ページ：IndexTTS 音声合成 → 領域：左パネル下部エラーパネル',
          cause: 'デバイスがネットワークに接続されていないか、Wi-Fi が切断されたか、ファイアウォールがリクエストをブロックしています。',
          solution: 'ネットワーク接続を復元します。',
          steps: ['デバイスのネットワーク接続状態を確認', '他のウェブサイトにアクセスしてネットワークが正常か確認', 'プロキシ/VPN を使用している場合はプロキシ設定が正しいか確認', '会社/学校のネットワークの場合は API アクセスが制限されていないか確認'],
          relatedCodes: ['BACKEND_UNAVAILABLE', 'API_TIMEOUT'],
          prevention: 'ネットワークツールを使用する前にネットワーク接続が正常であることを確認；ネットワーク変動が大きい環境での長時間操作は避けてください。',
        },
        {
          code: 'AUDIO_FORMAT_UNSUPPORTED',
          message: 'アップロード時に「サポートされていない音声形式」と表示される',
          severity: 'warning',
          category: 'C. ファイルと入力',
          location: 'ページ：IndexTTS 音声合成 → 領域：参照音声アップロードエリア',
          cause: 'FLAC、OGG、AAC、WMA などのサポートされていない形式を選択しました。IndexTTS は WAV と MP3 形式の参照音声のみをサポートしています。',
          solution: '音声を WAV または MP3 形式に変換します。',
          steps: ['音声変換ツールを使用してファイルを WAV または MP3 に変換', 'またはシステム付属の音声編集ツールで WAV/MP3 としてエクスポート', 'サンプリングレートが 22050Hz 以上であることを確認', 'IndexTTS ページで変換後のファイルを再アップロード'],
          relatedCodes: ['AUDIO_TOO_SHORT', 'AUDIO_TOO_LONG'],
          prevention: 'アップロード前にファイル形式が WAV または MP3 であることを確認してください。',
        },
        {
          code: 'AUDIO_TOO_SHORT',
          message: '「参照音声が短すぎる」と表示される',
          severity: 'warning',
          category: 'C. ファイルと入力',
          location: 'ページ：IndexTTS 音声合成 → 領域：参照音声アップロードエリア',
          cause: '参照音声の長さが 3 秒未満です。ゼロショット音声クローニングには、有効な音色特性を抽出するために最低 3 秒の音声が必要です。',
          solution: 'より長い参照音声をアップロードします。',
          steps: ['5〜10秒の音声を録音またはクリップ', '音声に単一の話者のみが含まれていることを確認', '音声ファイルを再アップロード'],
          relatedCodes: ['AUDIO_TOO_LONG', 'AUDIO_FORMAT_UNSUPPORTED'],
          prevention: '5〜10秒の参照音声を準備し、内容がクリアで完全であることを確認してください。',
        },
        {
          code: 'AUDIO_TOO_LONG',
          message: '「参照音声が長すぎる」または処理がタイムアウトする',
          severity: 'warning',
          category: 'C. ファイルと入力',
          location: 'ページ：IndexTTS 音声合成 → 領域：参照音声アップロードエリア',
          cause: '参照音声の長さが 10 秒を超えています。長すぎる参照音声は処理時間とバックエンド負荷を増加させ、クローニング品質の向上は限定的です。',
          solution: '音声を 3〜10 秒にクリップします。',
          steps: ['音声編集ツールを使用して音声の中央 5〜7 秒をクリップ', 'クリップ部分にクリアな音声が含まれていることを確認', 'WAV または MP3 として保存して再アップロード'],
          relatedCodes: ['AUDIO_TOO_SHORT', 'AUDIO_FORMAT_UNSUPPORTED'],
          prevention: '5〜10秒の参照音声を準備；長すぎる音声はクローニング品質の向上が限定的で、処理時間が増加します。',
        },
        {
          code: 'MODEL_NOT_FOUND',
          message: 'エラーパネルに「モデルが利用できません」または 404 が表示される',
          severity: 'error',
          category: 'D. モデルと生成',
          location: 'ページ：IndexTTS 音声合成 → 領域：左パネル下部エラーパネル',
          cause: '選択したモデルがバックエンドに存在しないか、削除されたか、現在の API Key がこのモデルにアクセスできません。',
          solution: '別の利用可能なモデルに切り替えます。',
          steps: ['「モデル」ドロップダウンから別のモデルを選択（例：index-tts-1.5）', 'モデル名のスペルが正しいか確認', '「設定 → API」で現在の Key が選択したモデルをサポートしているか確認', '再生成を試行'],
          relatedCodes: ['INDEX_TTS_NOT_CONFIGURED', 'API_KEY_EXPIRED'],
          prevention: '既知の利用可能なモデルをドロップダウンリストから選択；カスタム API を使用する場合はサービスプロバイダーのドキュメントでモデルリストを確認してください。',
        },
        {
          code: 'INDEX_TTS_TEXT_MISSING',
          message: '「音声を生成」をクリックするとすぐにエラーが表示され、テキストが入力されていないと表示される',
          severity: 'warning',
          category: 'C. ファイルと入力',
          location: 'ページ：IndexTTS 音声合成 → 領域：左パネル下部エラーパネル',
          cause: 'テキスト入力欄が空です。IndexTTS は音声を生成するために有効なテキスト入力が必要です。',
          solution: 'テキスト入力欄に合成する内容を入力します。',
          steps: ['テキスト入力エリアをクリック', '合成するテキストを入力または貼り付け', 'テキストが空でないことを確認', '「音声を生成」をクリック'],
          relatedCodes: ['INDEX_TTS_TEXT_TOO_LONG', 'INDEX_TTS_REQUEST_FAILED'],
          prevention: '生成前に必ずテキスト入力に有効な内容が含まれていることを確認してください。',
        },
        {
          code: 'INDEX_TTS_TEXT_TOO_LONG',
          message: '「テキストが長すぎる」または生成がタイムアウトする',
          severity: 'warning',
          category: 'C. ファイルと入力',
          location: 'ページ：IndexTTS 音声合成 → 領域：テキスト入力欄 / 左パネル下部エラーパネル',
          cause: '入力テキストが長すぎます（500文字を超え）、バックエンドモデルの最大処理制限を超えています。',
          solution: '入力テキストを短くします。',
          steps: ['長いテキストを複数のセグメントに分割し、各セグメントは200文字以内', '冗長な説明と重複した内容を削除', 'セグメントごとに生成して音声編集ツールで結合', '再試行'],
          relatedCodes: ['INDEX_TTS_TEXT_MISSING', 'API_TIMEOUT'],
          prevention: '1セグメントのテキストは500文字以内に収める；長い内容はセグメントごとに生成することを推奨します。',
        },
        {
          code: 'INDEX_TTS_TEXT_BLOCKED',
          message: 'リクエストがブロックされ、「コンテンツポリシー違反」または「sensitive words」と表示される',
          severity: 'error',
          category: 'D. モデルと生成',
          location: 'ページ：IndexTTS 音声合成 → 領域：左パネル下部エラーパネル',
          cause: '入力テキストに、バックエンドサービスプロバイダーの安全フィルターがブロックする語句が含まれています。',
          solution: 'テキストを修正し、フィルターをトリガーする可能性のある語句を削除または置換します。',
          steps: ['エラーの詳細で具体的なヒントを確認し、ブロックされたキーワードを特定', '敏感な語句を同義語に置換または削除', 'まず単純なテキストでサービスが正常か確認', 'コンテンツを徐々に追加して、具体的にトリガーする語句を特定'],
          relatedCodes: ['403_FORBIDDEN'],
          prevention: 'テキストで敏感な語句を使用しない；まずデフォルトのテキストでテストしてからカスタマイズしてください。',
        },
        {
          code: 'INDEX_TTS_REQUEST_FAILED',
          message: 'エラーパネルに「INDEX_TTS_REQUEST_FAILED」が表示される',
          severity: 'error',
          category: 'D. モデルと生成',
          location: 'ページ：IndexTTS 音声合成 → 領域：左パネル下部エラーパネル',
          cause: 'バックエンド API リクエストが失敗しました。ネットワーク切断、無効な API Key、モデルが利用できない、GPU メモリ不足、テキストが長すぎる、またはサーバー内部エラーの可能性があります。',
          solution: 'エラーの詳細にある具体的な情報に基づいてトラブルシューティングを行います。',
          steps: ['エラーパネルを展開して詳細なエラー情報を確認（HTTP ステータスコード、バックエンドメッセージ）', '401 の場合：API Key が有効か確認', '404 の場合：モデルが利用可能か確認', '429 の場合：しばらく待ってから再試行', '500/502/503 の場合：バックエンドサービス状態を確認', 'GPU エラーの場合：テキストの長さまたはサンプリングレートを下げる', 'ネットワークエラーの場合：ネットワーク接続を確認'],
          relatedCodes: ['API_KEY_MISSING', 'API_KEY_EXPIRED', 'MODEL_NOT_FOUND', 'BACKEND_UNAVAILABLE', 'INDEX_TTS_GPU_OUT_OF_MEMORY'],
          prevention: '生成前に API Key が有効で、ネットワークが接続され、モデルが利用可能であることを確認；初回生成は短いテキストでテストすることを推奨します。',
        },
        {
          code: 'INDEX_TTS_NOT_CONFIGURED',
          message: 'IndexTTS バックエンドが設定されていない',
          severity: 'error',
          category: 'E. 設定とデータ',
          location: 'サーバー → /api/index-tts',
          cause: 'バックエンドに IndexTTS プロバイダーが設定されていません。バックエンドルートは明示的な未設定エラーを返しました。',
          solution: 'バックエンドで IndexTTS プロバイダーを設定します。',
          steps: ['バックエンド .env ファイルに IndexTTS 関連の設定が含まれているか確認', 'IndexTTS API キーを設定（例：SiliconFlow）', 'プロバイダー設定をバックエンド .env に追加', 'バックエンドサーバーを再起動', 'フロントエンドに戻って再試行'],
          relatedCodes: ['INDEX_TTS_REQUEST_FAILED', 'BACKEND_UNAVAILABLE'],
          prevention: 'バックエンドをデプロイする際に IndexTTS プロバイダーを設定；使用前にバックエンドが正しく設定されていることを確認してください。',
        },
        {
          code: 'INDEX_TTS_GPU_OUT_OF_MEMORY',
          message: 'バックエンドから GPU メモリ不足エラーが返される',
          severity: 'error',
          category: 'F. システムと権限',
          location: 'サーバー → GPU 推論プロセス',
          cause: 'GPU VRAM がモデルの読み込みや現在のリクエストの処理に不十分です。長いテキスト、高サンプリングレート、大きなモデルはより多くの VRAM を消費します。',
          solution: 'テキストを短くするか、サンプリングレートを下げるか、CPU モードに切り替えるか、GPU をアップグレードします。',
          steps: ['入力テキストの長さを短くする', 'サンプリングレートを下げる（例：48000Hz → 22050Hz）', 'CPU 推論モードに切り替える', 'VRAM を消費する他のプログラムを閉じる', '問題が続く場合は、バックエンド管理者に連絡して GPU VRAM をアップグレード'],
          relatedCodes: ['500_INTERNAL_ERROR', 'API_TIMEOUT'],
          prevention: '長いテキストと高サンプリングレートはより多くの VRAM を消費します；テキストは200文字以内、22050Hz サンプリングレートを使用することを推奨します。',
        },
        {
          code: '429_TOO_MANY_REQUESTS',
          message: 'リクエストが多すぎると表示される（Rate Limit）',
          severity: 'warning',
          category: 'A. API とネットワーク',
          location: 'ページ：IndexTTS 音声合成 → 領域：左パネル下部エラーパネル',
          cause: '短時間に多すぎるリクエストを送信し、サービスプロバイダーのレート制限を超えました。',
          solution: 'しばらく待ってから再試行します。',
          steps: ['エラーの詳細で Retry-After ヒントがあれば確認', '60〜120秒待ってから再試行', '頻繁に発生する場合はテキストの長さを短くする', 'より高いレート制限を得るために API プランのアップグレードを検討'],
          relatedCodes: ['API_RATE_LIMIT', 'INDEX_TTS_REQUEST_FAILED'],
          prevention: '適切にリクエスト頻度を下げる；短時間に複数回再試行しないでください。',
        },
        {
          code: '500_INTERNAL_ERROR',
          message: 'バックエンドから 500 内部サーバーエラーが返される',
          severity: 'error',
          category: '0~9. HTTP ステータスコード',
          location: 'ページ：IndexTTS 音声合成 → 領域：左パネル下部エラーパネル',
          cause: 'バックエンドサービスがリクエストの処理中に内部例外を発生しました。モデルの読み込み失敗、GPU メモリ不足、またはコードのバグの可能性があります。',
          solution: '後で再試行するか、バックエンド管理者に連絡します。',
          steps: ['1〜2分待ってから再試行', 'テキストの長さを短くし、サンプリングレートを下げてバックエンド負荷を軽減', 'CPU 推論モードに切り替える', '問題が続く場合は、バックエンド管理者にサーバーログの確認を依頼'],
          relatedCodes: ['502_BAD_GATEWAY', '503_SERVICE_UNAVAILABLE', 'INDEX_TTS_GPU_OUT_OF_MEMORY'],
          prevention: 'リクエスト規模（テキストの長さ、サンプリングレートなど）を縮小；サーバー高負荷時に大きなタスクを送信しないでください。',
        },
        {
          code: '502_BAD_GATEWAY',
          message: 'バックエンドから 502 Bad Gateway が返される',
          severity: 'error',
          category: '0~9. HTTP ステータスコード',
          location: 'ページ：IndexTTS 音声合成 → 領域：左パネル下部エラーパネル',
          cause: 'リバースプロキシ（例：Nginx）がバックエンドアプリケーションサーバーに接続できません。バックエンドプロセスがクラッシュしたか起動していない可能性があります。',
          solution: 'バックエンドサービスの状態を確認します。',
          steps: ['ローカルデプロイの場合は、バックエンドプロセスが実行中か確認', 'バックエンドサービスのポートが占有されていないか確認', 'バックエンドログで起動エラーがないか確認', 'バックエンドサービスを再起動して再試行'],
          relatedCodes: ['503_SERVICE_UNAVAILABLE', 'BACKEND_UNAVAILABLE'],
          prevention: 'ローカルデプロイの場合はバックエンドプロセスが実行中であることを確認；リバースプロキシ設定を確認してください。',
        },
        {
          code: '503_SERVICE_UNAVAILABLE',
          message: 'バックエンドから 503 Service Unavailable が返される',
          severity: 'error',
          category: '0~9. HTTP ステータスコード',
          location: 'ページ：IndexTTS 音声合成 → 領域：左パネル下部エラーパネル',
          cause: 'バックエンドサービスが一時的に利用できません。メンテナンス中、再起動中、または過負荷保護中の可能性があります。',
          solution: '後で再試行します。',
          steps: ['2〜3分待ってから再試行', 'バックエンドサービスのステータスページがあれば確認', 'バックエンド管理者にメンテナンス中か確認'],
          relatedCodes: ['502_BAD_GATEWAY', 'BACKEND_UNAVAILABLE'],
          prevention: 'サーバーのメンテナンス時間帯は避けて操作；高負荷時はリクエスト頻度を下げてください。',
        },
        {
          code: 'IMPORT_INVALID_JSON',
          message: '設定のインポート時に「無効な JSON 形式」と表示される',
          severity: 'warning',
          category: 'B. 設定とデータ',
          location: 'ページ：IndexTTS 音声合成 → 領域：上部「設定をインポート」ボタン',
          cause: 'ファイルの内容が破損しているか、JSON 形式ではないか、または他のプログラムによって変更されています。',
          solution: 'ファイルが有効な UTF-8 エンコーディングのテキストファイルであるか確認します。',
          steps: ['テキストエディタでファイルを開いて文字化けがないか確認', 'ファイルの先頭に "tool": "index-tts" が含まれているか確認', 'オンライン JSON フォーマットツールで検証してみる'],
          relatedCodes: ['IMPORT_TOOL_MISMATCH'],
          prevention: 'エクスポートした設定ファイルを適切に保存；テキストエディタ以外で変更しないでください。',
        },
        {
          code: 'IMPORT_TOOL_MISMATCH',
          message: '設定のインポート時に「ツールタイプが一致しない」と表示される',
          severity: 'warning',
          category: 'B. 設定とデータ',
          location: 'ページ：IndexTTS 音声合成 → 領域：上部「設定をインポート」ボタン',
          cause: 'インポートした JSON ファイルの tool フィールドが index-tts ではありません。',
          solution: 'インポートするファイルが IndexTTS ページからエクスポートされたものであることを確認します。',
          steps: ['テキストエディタでファイルを開く', 'tool フィールドの値が "index-tts" であることを確認', 'そうでない場合は、正しい設定ファイルを探すか、対応するツールページからインポートする'],
          relatedCodes: ['IMPORT_INVALID_JSON'],
          prevention: '異なるツールの設定ファイルは互換性がありません；対応するツールページからエクスポートおよびインポートしてください。',
        },
      ],
    },
    {
      id: 'prompt-suite',
      title: 'キャラクター設定 / 世界観編集',
      overview: `PromptSuite は、キャラクター設定カード、世界観設定、関係図、話し方プロファイルを整理するためのリッチテキストエディタです。フォント、色、ハイライト、見出し、リスト、テーブル、コードブロック、引用ボックス、画像挿入などの豊富な書式設定をサポートしています。すべての内容はブラウザに自動保存されます。`,
      buttons: [
        { name: 'ドキュメントを保存', description: '現在のエディタの HTML 内容とツールバー状態をローカルストレージに保存します。' },
        { name: 'リセット', description: '現在のドキュメントをクリアし、デフォルトテンプレートに復元します。操作前に確認ダイアログが表示されます。' },
        { name: '設定をインポート', description: '以前にエクスポートした PromptSuite JSON 設定ファイルをインポートします。' },
        { name: 'HTML をエクスポート', description: '現在のドキュメントをインラインスタイル付きの独立した HTML ファイルとしてエクスポートします。' },
      ],
      parameters: [
        { name: 'テンプレート選択', description: 'プリセットテンプレートを素早く切り替えます：世界観設定、キャラクター設定、関係図、話し方プロファイル、タイムライン。' },
        { name: 'フォント', description: 'エディタの本文フォントファミリーを設定します。システムフォントとカスタムフォントをサポートします。' },
        { name: 'フォントサイズ', description: '基本フォントサイズを設定します。px/rem 単位をサポートします。' },
        { name: 'テキスト色', description: '現在選択されたテキストの色を設定します。' },
        { name: '太字 / 斜体 / 下線 / 打ち消し線', description: '基本的なテキスト書式ボタンです。' },
        { name: '元に戻す / やり直し', description: '最近の編集操作を元に戻すかやり直します。' },
      ],
      errors: [
        {
          code: 'CONFIG_CORRUPTED',
          message: 'エディタを開くと内容が空白または書式が乱れる',
          severity: 'error',
          category: 'B. 設定とデータ',
          location: 'ページ：キャラクター設定 / 世界観編集 → 領域：中央エディタ領域',
          cause: 'ブラウザの localStorage に保存された PromptSuite の設定データが破損しています。',
          solution: 'エディタをリセットするか、localStorage を手動でクリアします。',
          steps: ['「リセット」ボタンをクリック', '確認ダイアログで「リセットを確認」をクリック', 'それでも異常な場合は localStorage の prompt-suite 関連キーを削除', 'ページを更新'],
          relatedCodes: ['IMPORT_INVALID_JSON', 'STORAGE_READ_ONLY'],
          prevention: 'localStorage のデータを手動で変更しないでください。',
        },
        {
          code: 'STORAGE_READ_ONLY',
          message: '保存が反応せず、更新後に内容が失われる',
          severity: 'critical',
          category: 'B. 設定とデータ',
          location: 'ページ：キャラクター設定 / 世界観編集 → 領域：上部「ドキュメントを保存」ボタン',
          cause: 'ブラウザがプライベート/シークレットモードであるか、localStorage が無効化されています。',
          solution: 'プライベートモードを終了するか、エクスポート機能でバックアップします。',
          steps: ['シークレットブラウジングモードでないことを確認', '「HTML をエクスポート」でローカルファイルに保存', '通常ウィンドウでアプリを再度開く', '以前にエクスポートしたファイルをインポート'],
          relatedCodes: ['LOCAL_STORAGE_FULL'],
          prevention: 'シークレット/プライベートモードでこのアプリを使用しないでください。',
        },
      ],
    },
    {
      id: 'llm-hub',
      title: 'LLM テキスト接続',
      overview: `LLM Hub は、大規模言語モデルのパラメータ設定とリアルタイムテストツールです。モデル選択、サンプリングパラメータ、システムプロンプトなどを調整し、リアルタイムテストパネルで AI と多ターン対話を行い、Prompt の効果を検証できます。複数の設定プリセットを保存し、異なる創作シーン間で素早く切り替えることができます。`,
      buttons: [
        { name: 'ドキュメントを保存', description: '現在の LLM 設定をローカルストレージに保存します。' },
        { name: 'リセット', description: 'すべてのパラメータをデフォルト値にリセットします。' },
        { name: '設定をインポート', description: '以前にエクスポートした LLM Hub JSON 設定ファイルをインポートします。' },
        { name: '送信', description: 'リアルタイムテストパネルで入力メッセージを AI に送信します。' },
        { name: 'クリア', description: '現在の会話履歴と出力内容をクリアします。' },
        { name: 'プリセットとして保存', description: '現在のすべてのパラメータを名前付きプリセットとして保存します。' },
      ],
      parameters: [
        { name: 'モデル', description: '使用する大規模言語モデルを選択します。', tips: 'gpt-5.4 がデフォルト推奨です。gpt-5.4-mini はより高速です。claude-4-sonnet は創作ライティングに優れています。' },
        { name: 'Temperature', description: '生成結果のランダム性を制御します。範囲 0〜2。', tips: '創作ライティングでは 0.7〜1.0 を推奨。キャラクター設定の補完では 0.3〜0.5 を推奨します。' },
        { name: '最大トークン数', description: '1回の応答の最大生成長です。範囲 1〜8192。', tips: 'キャラクター設定生成では 1024〜2048 を推奨。短い会話では 512 に設定可能です。' },
        { name: '応答形式', description: 'AI の出力形式を指定します：text（プレーンテキスト）または json_object（強制 JSON）。', tips: 'json_object を選択する場合、Prompt に期待される JSON 構造を明確に説明する必要があります。' },
        { name: 'システムプロンプト', description: 'AI の役割と行動指針を定義するグローバルプロンプトです。', tips: 'これは出力品質に最も影響を与えるパラメータです。詳細なキャラクター設定と出力形式要件を記述することを推奨します。' },
      ],
      errors: [
        {
          code: 'API_KEY_MISSING',
          message: 'メッセージ送信後直ちにエラー、API Key が設定されていないと表示される',
          severity: 'critical',
          category: 'A. API とネットワーク',
          location: 'ページ：LLM テキスト接続 → 領域：リアルタイムテストパネル出力領域',
          cause: '「設定 → API」で API Key が設定されていません。LLM Hub は有効な Key が必要です。',
          solution: '設定パネルで API Key を設定します。',
          steps: ['右上の「設定を開く」', '「API」タブに切り替える', '有効な API Key を入力', '保存して閉じる', 'LLM Hub に戻りメッセージを再送信'],
          relatedCodes: ['API_KEY_EXPIRED', '401_UNAUTHORIZED'],
          prevention: 'オンラインツールを初めて使用する前に、必ず「設定 → API」で有効な API Key を設定してください。',
        },
        {
          code: 'LLM_MODEL_UNAVAILABLE',
          message: 'モデルが利用できないと表示される',
          severity: 'error',
          category: 'D. モデルと生成',
          location: 'ページ：LLM テキスト接続 → 領域：リアルタイムテストパネル出力領域',
          cause: '選択したモデルがバックエンドに存在しないか、現在の Key がアクセス権を持っていません。',
          solution: '別のモデルに切り替えます。',
          steps: ['「モデル」ドロップダウンで別のモデルを選択', 'モデル ID のスペルを確認', '現在の Key が選択したモデルをサポートしているか確認', '再試行'],
          relatedCodes: ['MODEL_NOT_FOUND', '403_FORBIDDEN'],
          prevention: '既知の利用可能なモデルリストから選択してください。',
        },
      ],
    },
    {
      id: 'tts-export',
      title: 'TTS 音声エクスポート',
      overview: `TTS 音声エクスポートツールは、音声合成パラメータを設定し、キャラクターの音声素材を生成します。声、言語、速度、音高、音量などの基本パラメータの調整に加え、息の強さ、明瞭さ、表現力、休止の強さなどの高度なパラメータも調整できます。音声クローニングのソースとしてリファレンス音声をアップロードでき、音声後処理（ノイズ除去、EQ、圧縮）と発音修正もサポートしています。`,
      buttons: [
        { name: '保存', description: '現在の TTS 設定をローカルストレージに保存します。' },
        { name: 'リセット', description: 'すべてのパラメータをデフォルト値にリセットし、リファレンス音声とログをクリアします。' },
        { name: '設定をインポート', description: '以前にエクスポートした TTS JSON 設定ファイルをインポートします。' },
        { name: 'JSON をダウンロード', description: '現在の TTS 設定を JSON ファイルとしてダウンロードします。' },
        { name: 'リファレンス音声をアップロード', description: '音声クローニング用のリファレンス音声（WAV/MP3/FLAC、10MB 以下）を選択してアップロードします。' },
        { name: 'ログをコピー', description: '右側のログパネルの内容をクリップボードにコピーします。' },
      ],
      parameters: [
        { name: '声', description: 'プリセットの音声音色を選択します。', tips: 'Hanazora がデフォルトの女性声です。Mirako は元気な女性声です。Rin は少年声です。' },
        { name: '言語', description: '合成音声の対象言語です。', tips: 'グローバルインターフェース言語を切り替えると、このフィールドは自動的に同期更新されます。' },
        { name: '速度', description: '音声再生速度の倍率です。範囲 0.6〜1.6。', tips: '1.0 が通常速度です。キャラクターが感情的に興奮している場合は 1.2〜1.4 に設定できます。' },
        { name: '音高', description: '音高のオフセットです。範囲 -12〜12（半音単位）。', tips: '正の値は高く明るく、負の値は低く深くなります。' },
        { name: '息の強さ', description: '音声の息の強さを制御します。範囲 0〜100。', tips: '値が高いほど自然な人間の呼吸に近づきますが、高すぎると息づかいが聞こえます。' },
        { name: '明瞭さ', description: '発音の明瞭さを制御します。範囲 0〜100。', tips: '値が高いほど発音が明瞭になりますが、機械的に聞こえることがあります。' },
        { name: '表現力', description: '感情表現の強さを制御します。範囲 0〜100。', tips: '値が高いほどイントネーションの変化が豊かになり、ドラマチックなシーンに適しています。' },
      ],
      errors: [
        {
          code: 'API_KEY_MISSING',
          message: '音声生成時に API Key が設定されていないと表示される',
          severity: 'critical',
          category: 'A. API とネットワーク',
          location: 'ページ：TTS 音声エクスポート → 領域：左パネル出力領域',
          cause: 'API Key が設定されていません。',
          solution: '設定パネルで Key を設定します。',
          steps: ['「設定 → API」を開く', '有効な Key を入力', '保存して再試行'],
          relatedCodes: ['API_KEY_EXPIRED'],
          prevention: 'オンラインツールを初めて使用する前に、必ず「設定 → API」で有効な API Key を設定してください。',
        },
        {
          code: 'TTS_AUDIO_GENERATION_FAILED',
          message: '音声合成に失敗',
          severity: 'error',
          category: 'D. モデルと生成',
          location: 'ページ：TTS 音声エクスポート → 領域：左パネル出力領域',
          cause: 'バックエンド TTS サービスが異常です。モデル読み込み失敗、リファレンス音声形式が非対応、またはテキストに合成できない文字が含まれている可能性があります。',
          solution: 'バックエンド状態、リファレンス音声、テキスト内容を確認します。',
          steps: ['エラー詳細を確認', 'リファレンス音声を使用している場合、形式が WAV/MP3/OGG であることを確認', 'テキストを簡略化し、特殊記号と絵文字を削除', '音声プリセットを切り替えてみる', '再試行'],
          relatedCodes: ['MODEL_NOT_FOUND', 'API_TIMEOUT'],
          prevention: 'テキストを簡略化して特殊記号を削除してください。リファレンス音声の形式が正しいことを確認してください。',
        },
      ],
    },
    {
      id: 'paper2gal',
      title: 'paper2gal 画像素材生成',
      overview: `Paper2Gal は Original Character Maker の中核となるワークフローツールです。p2g-character-workflow バックエンドに接続し、「1枚の画像入力、複数のアセット出力」というバッチキャラクター素材生成を実現します。キャラクターのリファレンス画像をアップロードすると、ワークフローが自動的に10ステップを実行し、8枚の最終アセットと5つのメタデータファイルを生成します。

**最終出力アセット（画像8枚）**
・表情画像 ×3：thinking（思考）、surprise（驚き）、angry（怒り）— 縦構図
・CG シーン画像 ×2：CG01、CG02 — 横構図 16:9
・透明切り抜き ×3：各表情に対応する透明背景 PNG

**メタデータファイル（5ファイル）**
・manifest：ワークフロー完全マニフェスト
・character_profile：キャラクター分析プロファイル
・prompts：各ステップで使用された最終プロンプト記録
・character_pack：キャラクター梱包ファイル
・p2g_handoff：paper2gal 引き継ぎファイル

**ワークフロー実行順序（10ステップ）**
1. validate_input — 入力画像の形式とサイズを検証
2. analyze_character — AI がキャラクター特徴を分析
3. expression_thinking — 思考表情を生成
4. expression_surprise — 驚き表情を生成
5. expression_angry — 怒り表情を生成
6. cg_01 — 最初の CG シーンを生成
7. cg_02 — 2番目の CG シーンを生成
8-10. cutout_expression_* — 各表情の透明切り抜き

**プロンプト上書きシステム**
各生成ステップはカスタム Prompt の上書きをサポートしています。デフォルトプロンプトには、厳格なキャラクター一貫性制約と安全境界が組み込まれています。

**やり直しシステム（v1.0.0+）**
個別の結果のやり直しをサポートします。異なる表情と CG は並列でやり直し可能です。表情のやり直しを行うと、対応する切り抜きも自動的に同期されます。

**切り抜きソリューション**
バックエンドが remove_background プロバイダーを frontend に設定すると、ブラウザが AI 切り抜きをローカルで実行します（追加の API Key は不要です。初回実行時にモデルリソースをダウンロードする必要があり、約1〜2分かかります）。ブラウザ切り抜きが失敗すると、エッジ色検出にフォールバックします。

**状態の永続化**
ページはワークフロー状態、プロンプト上書き、同時実行設定をローカルストレージに自動保存します。ページ更新後も進捗が復元されます。`,
      buttons: [
        { name: 'ホームに戻る', description: 'paper2gal ページを離れてホームに戻ります。未保存の設定変更がある場合は確認ダイアログが表示されます。' },
        { name: '設定を開く', description: 'グローバル設定パネルを開きます。最もよく使用するのは API タブ（バックエンドアドレスと Key）とパフォーマンスタブ（プレビュー品質、最大同時実行リクエスト数）です。' },
        { name: '設定を保存', description: '現在のプロンプト上書き設定と AI 同時実行設定をスナップショットとして保存します。保存後はページ離脱時にダイアログが表示されなくなります。' },
        { name: 'ワークフローをリセット', description: 'すべてのワークフロー状態、画像、生成結果、設定をクリアし、初期の空白状態に戻します。この操作は元に戻せません。' },
        { name: '設定をインポート', description: '以前にエクスポートした paper2gal JSON 設定ファイルをインポートして、プロンプト上書きと AI 同時実行設定を復元します。' },
        { name: 'JSON をコピー', description: '完全なデバッグ情報（メッセージステータス、ワークフローオブジェクト、API アドレス、プロンプト上書きなど）を JSON テキストとしてクリップボードにコピーします。' },
        { name: '画像を選択 / 画像を置換', description: 'キャラクターのリファレンス画像をアップロードします。PNG と JPG のみ。推奨：単人の立ち絵、1024×1024 〜 2048×2048。' },
        { name: '開始', description: '画像をバックエンドに送信して、完全な paper2gal ワークフローを開始します。ページは1秒ごとに進捗をポーリングします。' },
        { name: 'ワークフローをやり直し', description: '現在アップロードされている同じ画像を使用してワークフローを再開します。結果に満足できない場合や、プロンプト上書きを変更した後に使用します。' },
        { name: 'すべてをダウンロード', description: '生成されたすべてのアセットとメタデータを含む ZIP ファイル（{workflowId}-outputs.zip）をダウンロードします。ワークフロー開始後のみ利用可能です。' },
        { name: 'ステップカード — ファイルを開く', description: 'ステップが完了すると、生成された画像を新しいタブで開きます。' },
        { name: 'ステップカード — やり直し / 再試行', description: '失敗したステップを再試行したり、成功したステップをやり直したりします。異なるステップは並列でやり直し可能です。' },
        { name: '結果領域 — ダウンロード', description: '単一の出力画像をプリセットファイル名でダウンロードします。' },
        { name: 'ログパネル — ログをコピー', description: 'すべてのステップステータスログをクリップボードにコピーします。' },
        { name: 'デバッグパネル — デバッグをコピー / ダウンロード', description: '開発者とのトラブルシューティング用に完全なデバッグ JSON をコピーまたはダウンロードします。' },
      ],
      parameters: [
        { name: 'AI 同時実行', description: '有効にすると、ワークフロー内の AI 生成ステップ（表情 ×3 + CG ×2）が並列実行され、総時間が大幅に短縮されます。無効にすると、すべてのステップが直列実行されます。', tips: '同時実行を有効にすると、バックエンドが複数のモデルリクエストを同時にスケジュールし、API コストが増加する可能性があります。低構成のサーバーや厳しいレート制限の Key では無効にすることを推奨します。' },
        { name: 'プロンプト上書き — 思考表情', description: '「思考」表情生成ステップのデフォルト Prompt を上書きします。デフォルトでは厳格なキャラクター一貫性と縦構図が要求されています。', tips: '制約部分は保持し、表情アクションの説明のみを変更してください。テキストボックスを空にすると、デフォルトプロンプトが使用されます。' },
        { name: 'プロンプト上書き — 驚き表情', description: '「驚き」表情生成ステップのデフォルト Prompt を上書きします。', tips: '驚きの表情は誇張された変形を生成しやすいため、「自然で控えめなアクション」などの制約を追加してください。' },
        { name: 'プロンプト上書き — 怒り表情', description: '「怒り」表情生成ステップのデフォルト Prompt を上書きします。', tips: '暴力的な要素の生成を避けてください。デフォルトにはバランスの取れた怒りの制約が含まれています。' },
        { name: 'プロンプト上書き — CG01', description: '最初の CG シーン画像の生成 Prompt を上書きします。デフォルト：単人全年齢日常シーン、横構図 16:9。', tips: 'キャラクター一貫性制約を保持しながら、特定のシーンや雰囲気を指定できます。' },
        { name: 'プロンプト上書き — CG02', description: '2番目の CG シーン画像の生成 Prompt を上書きします。CG01 と同じ制約が適用されます。', tips: 'CG01 と一貫性を保ち、シーン、カメラ角度、ポーズ、感情のみを変更してシリーズ感を出してください。' },
        { name: '入力画像', description: 'ワークフローのソース画像。PNG と JPG のみ。鮮明な単人画像を推奨します。', tips: '推奨サイズ 1024×1024 〜 2048×2048。大きすぎる（>4096）と時間が増加します。小さすぎる（<512）と品質に影響します。' },
        { name: 'ワークフロー ID', description: '読み取り専用の一意識別子。開始前は「paper2gal-idle」と表示されます。バックエンド追跡用に使用されます。', tips: 'バックエンドログで対応するレコードを探す必要がある場合、この ID をコピーして管理者に提供してください。' },
        { name: '切り抜きプロバイダー', description: '読み取り専用の背景除去エンジン名。バックエンドが自動的に割り当てます。', tips: '「frontend」と表示される場合、ブラウザ側の AI 切り抜きを意味します。それ以外の値はバックエンドサービスを意味します。' },
      ],
      errors: [
        {
          code: 'API_KEY_MISSING',
          message: 'ワークフロー開始後直ちにエラー、API Key が設定されていないと表示される',
          severity: 'critical',
          category: 'A. API とネットワーク',
          location: 'ページ：paper2gal → 領域：上部メッセージバー / 右パネルエラーパネル',
          cause: '「設定 → API」で API Key が設定されていないか、Key がクリアされています。paper2gal はバックエンド画像生成サービスを呼び出す必要があり、有効な API Key が必要です。',
          solution: '設定パネルで有効な API Key を設定します。',
          steps: ['右上の「設定を開く」または対応するショートカットをクリック', '「API」タブに切り替える', '「API Key」入力欄に有効な Key を入力', '「保存」をクリックして設定パネルを閉じる', 'paper2gal ページに戻り「開始」を再度クリック'],
          relatedCodes: ['API_KEY_EXPIRED', '401_UNAUTHORIZED'],
          prevention: 'オンラインツールを初めて使用する前に、必ず「設定 → API」で有効な API Key を設定してください。',
        },
        {
          code: 'HOSTED_API_REQUIRED',
          message: '「現在は静的ホスティング環境のため、カスタム API を設定する必要があります」と表示される',
          severity: 'critical',
          category: 'A. API とネットワーク',
          location: 'ページ：paper2gal → 領域：上部メッセージバー',
          cause: 'ページが GitHub Pages、Alibaba Cloud OSS/CDN などの純粋な静的ホスティング環境にデプロイされており、ローカルバックエンドに直接アクセスできません。',
          solution: '設定でリモート API アドレスを設定します。',
          steps: ['「設定 → API」を開く', '「インターフェースモード」を「カスタム API」に切り替える', '「API アドレス」にバックエンドのルートアドレスを入力', 'API Key を入力', '保存して再試行'],
          relatedCodes: ['API_KEY_MISSING', 'BACKEND_UNAVAILABLE'],
          prevention: '静的ホスティング環境で paper2gal を使用する前に、バックエンドサービスをデプロイし、正しい API アドレスと Key を設定してください。',
        },
        {
          code: 'P2G_WORKFLOW_ERROR',
          message: 'エラーパネルに「P2G_WORKFLOW_ERROR」と表示される',
          severity: 'error',
          category: 'E. ワークフローと変換',
          location: 'ページ：paper2gal → 領域：上部メッセージバー / 右パネルエラーパネル',
          cause: 'Paper2Gal ワークフローのステップが失敗しました。入力検証失敗、モデル利用不可、API Key の有効期限切れ、コンテンツフィルタリング、ネットワーク切断、バックエンド内部例外などが原因です。',
          solution: 'エラー詳細の「ステージ」「メッセージ」「ヒント」に従って順番にトラブルシューティングします。',
          steps: ['エラーパネルを展開し、「読みやすいエラー情報」「考えられる原因」「修正ヒント」を読む', 'アップロードした画像が有効な PNG/JPG であることを確認', 'ネットワーク接続を確認', '「コンテンツポリシー違反」と表示される場合、プロンプト上書きの敏感な言葉を修正', 'バックエンドサービスが正常に動作していることを確認', '失敗したステップはステップカードで「やり直し」', 'ワークフロー全体が失敗した場合は「ワークフローをリセット」'],
          relatedCodes: ['API_KEY_MISSING', 'API_KEY_EXPIRED', 'MODEL_NOT_FOUND', 'PROMPT_BLOCKED', 'WORKFLOW_STEP_FAILED'],
          prevention: 'ワークフローを開始する前に、画像が有効な PNG/JPG であること、ネットワーク接続が安定していること、プロンプト上書きに敏感な言葉がないこと、API Key が有効であることを確認してください。',
        },
        {
          code: 'WORKFLOW_STEP_FAILED',
          message: 'ステップカードに「失敗」ステータスが表示される',
          severity: 'error',
          category: 'E. ワークフローと変換',
          location: 'ページ：paper2gal → 領域：右パネルステップリスト',
          cause: 'この特定のステップの実行中にエラーが発生しました。一般的な原因：モデル利用不可、プロンプトフィルタリング、ネットワークタイムアウト、バックエンドリソース不足。',
          solution: 'ステップ詳細を確認し、個別に再試行します。',
          steps: ['失敗したステップカードをクリックしてエラー詳細を確認', 'エラー情報に基づいてトラブルシューティング', '「ステップを再試行」ボタンをクリック', '複数回の再試行でも失敗する場合はバックエンド管理者に連絡'],
          relatedCodes: ['P2G_WORKFLOW_ERROR', 'PROMPT_BLOCKED', 'API_TIMEOUT'],
          prevention: 'ステップが失敗したら、エラー詳細を確認し、ヒントに従って対応するプロンプトを修正またはネットワークを確認してから再試行してください。',
        },
        {
          code: 'REDO_CONFLICT',
          message: 'やり直しをクリックすると「この結果はすでにやり直し中です」と表示される',
          severity: 'info',
          category: 'E. ワークフローと変換',
          location: 'ページ：paper2gal → 領域：ステップカード / 結果カード',
          cause: '現在のステップまたはその競合グループの別のステップがすでにやり直し中です。',
          solution: '現在のやり直しが完了するまで待ってから操作します。',
          steps: ['メッセージバーでやり直しの進捗を確認', 'ステータスが「やり直し中」から「成功」または「失敗」に変わるまで待つ', '長時間応答がない場合はページを更新して再試行'],
          relatedCodes: ['WORKFLOW_STEP_FAILED'],
          prevention: '同じ競合グループ内のステップに対して、複数のやり直しリクエストを同時に送信しないでください。',
        },
        {
          code: 'FRONTEND_CUTOUT_SPAWN_FAILED',
          message: '切り抜きステップでエラー、ブラウザ側切り抜きリソースが読み込めないと表示される',
          severity: 'critical',
          category: 'F. システムと権限',
          location: 'ページ：paper2gal → 領域：右パネルステップカード / エラーパネル',
          cause: 'ブラウザ側の IMG.LY モデルリソースが読み込めないか、ブラウザが必要な WebGL/WASM 機能をサポートしていません。',
          solution: 'ページを更新して再試行するか、モダンブラウザを使用します。',
          steps: ['ページを更新してブラウザ側切り抜きを再トリガー', 'Chrome/Firefox/Edge などのモダンブラウザを使用（IE/古い Safari は非対応）', 'WebGL/WASM が無効化されていないか確認', 'Docker デプロイの場合、イメージが正しく構築されているか確認'],
          relatedCodes: ['FRONTEND_CUTOUT_EXECUTION_FAILED'],
          prevention: 'モダンブラウザ（Chrome/Firefox/Edge 最新版）を使用してください。WebGL や WASM を無効化しないでください。',
        },
        {
          code: 'DEVICE_MEMORY_LOW',
          message: 'ブラウザタブがクラッシュしたり、応答しなくなったりする',
          severity: 'critical',
          category: 'F. システムと権限',
          location: 'ページ：paper2gal → 領域：ページ全体',
          cause: 'デバイスのメモリが不足しています。通常、超大きな画像（>4096）の処理やブラウザ切り抜きモデルの読み込み時に発生します。',
          solution: '他のタブを閉じたり、画像サイズを縮小したり、よりメモリの多いデバイスを使用したりします。',
          steps: ['現在の作業を保存', '他のブラウザタブを閉じる', '画像の最大辺を 2048 以下に縮小', 'ブラウザを再起動', '必要に応じてよりメモリの多いデバイスを使用'],
          relatedCodes: ['FILE_TOO_LARGE'],
          prevention: '大きなファイルを処理する前に他のブラウザタブを閉じてください。画像の最大辺を 2048 以下に縮小してください。低メモリデバイスでは AI 同時実行を無効にすることを推奨します。',
        },
      ],
    },
    {
      id: 'image-converter',
      title: '画像フォーマット変換',
      overview: `画像フォーマット変換は、画像をアップロードして PNG または JPG 形式に変換する純粋なフロントエンドツールです。明るさ、コントラスト、彩度、ぼかし、色相回転、グレースケールの6つのフィルター調整をサポートしています。出力品質と最大サイズを制御でき、元の縦横比を維持できます。すべての処理はブラウザ内でローカルに行われ、画像はサーバーにアップロードされません。`,
      buttons: [
        { name: '画像を選択', description: '画像ファイルをアップロードします。PNG、JPG、WEBP 形式をサポートしています。' },
        { name: '変換', description: 'すべてのフィルターパラメータを適用して出力画像を生成します。処理は完全にブラウザ内でローカルに行われます。' },
        { name: '結果をダウンロード', description: '変換後の画像をローカルにダウンロードします。ファイル名形式は converted-{timestamp}.{ext} です。' },
        { name: 'リセット', description: 'アップロードした画像と結果をクリアし、すべてのフィルターパラメータをデフォルト値にリセットします。' },
      ],
      parameters: [
        { name: '出力形式', description: '出力画像の MIME タイプ：image/png または image/jpeg。', tips: 'PNG は透明チャンネルをサポートしますがファイルが大きくなります。JPG はファイルが小さいですが透明をサポートしません。' },
        { name: '品質', description: 'JPG 出力の圧縮品質です。範囲 10〜100。JPG 形式でのみ有効です。', tips: '90〜95 が画質とファイルサイズの最適なバランスです。' },
        { name: '最大幅', description: '出力画像の最大幅（ピクセル）。元の画像が広い場合は比率を保って縮小されます。', tips: '2048 に設定すると、ほとんどのソーシャルプラットフォームのアップロード要件を満たせます。' },
        { name: '最大高さ', description: '出力画像の最大高さ（ピクセル）。' },
        { name: '縦横比を維持', description: 'スケーリング時に元の縦横比を維持するかどうか。', tips: '常に有効にすることを推奨します。画像の歪みを防ぎます。' },
        { name: '明るさ', description: '画像全体の明るさを調整します。範囲 0〜200、100 が元の明るさです。', tips: '50 以下では明らかに暗くなり、150 以上では露出過多で細部が失われることがあります。' },
        { name: 'コントラスト', description: '画像のコントラストを調整します。範囲 0〜200、100 が元のコントラストです。', tips: '値が高いほど明暗のコントラストが強くなり、線の存在感を強化するのに適しています。' },
      ],
      errors: [
        {
          code: 'CONVERT_ERROR',
          message: 'エラーパネルに「CONVERT_ERROR」と表示される',
          severity: 'error',
          category: 'E. ワークフローと変換',
          location: 'ページ：画像フォーマット変換 → 領域：右パネルエラーパネル',
          cause: '画像変換中に例外が発生しました。元画像の破損、ブラウザの Canvas 2D filter 非対応、またはメモリ不足が原因です。',
          solution: '画像とブラウザの互換性を確認します。',
          steps: ['元画像がブラウザで正常に開けることを確認', 'ページを更新して再アップロード', '画像が大きすぎないか確認', 'フィルターを1つずつオフにして非対応のフィルターを特定', '別のブラウザを試す'],
          relatedCodes: ['FILE_CORRUPTED', 'DEVICE_MEMORY_LOW'],
          prevention: '変換前に画像がブラウザで正常に開けることを確認してください。同時に多くのフィルターを有効にしないでください。',
        },
        {
          code: 'DEVICE_MEMORY_LOW',
          message: '変換中にブラウザがフリーズしたりクラッシュしたりする',
          severity: 'critical',
          category: 'F. システムと権限',
          location: 'ページ：画像フォーマット変換 → 領域：ページ全体',
          cause: '超大きな画像を処理する際にブラウザのメモリが不足しています。',
          solution: '画像を縮小するか、他のタブを閉じます。',
          steps: ['他のブラウザタブを閉じる', '「最大幅」と「最大高さ」の値を下げる', 'ページを更新して再アップロード'],
          relatedCodes: ['FILE_TOO_LARGE'],
          prevention: '大きなファイルを処理する前に他のブラウザタブを閉じてください。画像の最大辺を 2048 以下に縮小してください。',
        },
      ],
    },
    {
      id: 'settings-guide',
      title: '設定パネルガイド',
      overview:
        '設定パネルは OC Maker の中核的な設定入口です。外観、言語、API、オーディオ、アニメーション、ショートカット、パフォーマンス、その他の設定を網羅しています。すべての変更は即時反映され、ブラウザの localStorage に自動保存されます。\n\n設定パネルは複数のタブに分かれています。「スタイル」ではテーマ・色・フォントを、「言語」では表示言語を、「API」ではバックエンド接続を、「オーディオ」では BGM と SFX を、「アニメーション」では動作効果を、「ショートカット」ではキーボード操作を、「パフォーマンス」では低スペック端末の最適化を、「その他」ではツールチップや確認ダイアログなどを設定します。',
      buttons: [
        { name: 'スタイルプリセット保存', description: '現在のテーマ・色・フォントの組み合わせをカスタムプリセットとして保存します。' },
        { name: 'プリセット適用', description: '保存済みのプリセットリストから選択し、すべてのスタイル設定を即時適用します。' },
        { name: 'すべての設定をリセット', description: 'すべてのタブの設定をデフォルトに戻します。誤操作防止のため二重確認が必要です。' },
        { name: 'デフォルトに戻す', description: '現在のタブの設定のみをデフォルトに戻し、他のタブには影響しません。' },
      ],
      parameters: [
        { name: 'テーマモード', description: 'ライトモードは日中に適しています。ダークモードは夜間の目の疲れを軽減します。' },
        { name: 'アクセントカラー', description: 'ボタン、リンク、プログレスバー、選択状態などのメインカラーを選択します。' },
        { name: 'フォント', description: 'ゴシック、丸ゴシック、明朝、等幅、黒体、宋体、楷体など11種類のフォントから選択します。' },
        { name: 'インターフェース言語', description: '30言語に対応。切り替え後即時反映されます。' },
        { name: 'API モード', description: '「内蔵モード」はバックエンド設定の Plato サービスを使用します。「カスタム API」は独自の OpenAI 互換エンドポイントを使用します。' },
        { name: 'マスター音量', description: 'BGM と SFX の両方に影響するグローバル音量です。0 に設定すると完全にミュートになります。' },
        { name: 'アニメーション有効', description: 'グローバルアニメーションのマスタースイッチ。オフにするとすべての UI アニメーションが無効になります。' },
        { name: '高コントラストフォーカス', description: 'キーボードフォーカスインジケーターの視認性を向上させ、アクセシビリティを改善します。' },
        { name: 'エラーパネル', description: 'ワークフローページでエラーが発生した際、ドラッグ可能なエラー詳細パネルを表示するかどうか。' },
      ],
      errors: [
        {
          code: 'SETTINGS_SAVE_FAILED',
          message: '設定の保存に失敗しました',
          severity: 'warning',
          category: 'B. 設定とデータ',
          location: '設定パネル → 任意のタブ',
          cause: 'ブラウザの localStorage がいっぱい、保存が無効化されている、またはデータのシリアライズに失敗しました。',
          solution: 'ブラウザのキャッシュと localStorage を削除するか、プライバシーモードの設定を確認してください。',
          steps: [
            'DevTools → Application → Local Storage を開き、古い oc-maker キーを削除します。',
            '「サードパーティ Cookie をブロック」などのプライバシー設定を無効にしてから再試行します。',
          ],
          relatedCodes: ['LOCAL_STORAGE_VERSION_MISMATCH', 'CONFIG_CORRUPTED'],
        },
      ],
    },
    {
      id: 'audio-guide',
      title: 'オーディオシステムガイド',
      overview:
        'OC Maker のオーディオシステムは Web Audio API を基盤とし、豊富なインタラクション効果音（SFX）と背景音乐（BGM）を提供します。15種類以上の SFX プリセット、20種類以上の BGM プリセットに加え、カスタムオーディオファイルのアップロードもサポートしています。\n\nブラウザの自動再生ポリシーのため、ページ読み込み後は音声がミュート状態になることがあります。ページ内の任意のボタンやエリアをクリックすると、音声再生がロック解除されます。',
      buttons: [
        { name: 'BGM 再生/一時停止', description: '背景音乐の再生状態を切り替えます。初回再生にはユーザーのクリックが必要な場合があります。' },
        { name: 'SFX テスト', description: '現在選択されている SFX プリセットのサンプル音を再生してプレビューします。' },
        { name: 'BGM テスト', description: '現在選択されている BGM プリセットのサンプルクリップを再生してプレビューします。' },
      ],
      parameters: [
        { name: 'マスター音量', description: 'BGM と SFX の両方に影響するグローバル音量（0%~100%）。' },
        { name: 'SFX 音量', description: 'ボタンクリック、ホバー、成功/失敗アラートなどのインタラクション効果音の独立音量。' },
        { name: 'BGM 音量', description: '背景音乐の独立音量。SFX 音量とは干渉しません。' },
        { name: 'SFX プリセット', description: '15種類以上のプロシージャル効果音スタイル。' },
        { name: 'BGM プリセット', description: '20種類以上の背景音乐スタイル。' },
      ],
      errors: [
        {
          code: 'AUDIO_CONTEXT_SUSPENDED',
          message: 'オーディオがブラウザによって自動停止されました',
          severity: 'info',
          category: 'F. ブラウザとパフォーマンス',
          location: '任意のページ → オーディオ再生',
          cause: 'モダンブラウザの自動再生ポリシーでは、ユーザーがページと対話するまで音声の開始が禁止されています。',
          solution: 'ページの任意の場所やボタンをクリックすると、音声再生が再開されます。',
          prevention: 'アプリは attachAudioResumeHandler を内蔵しており、最初のユーザー対話時に自動的に AudioContext を再開します。',
        },
      ],
    },
    {
      id: 'ui-ux-guide',
      title: 'インターフェースと体験ガイド',
      overview:
        'OC Maker のインターフェースシステムは CSS カスタムプロパティ（CSS Variables）を基盤とし、リアルタイムのテーマ切り替え、フォント変更、アニメーション調整、パフォーマンス最適化をサポートしています。すべての外観設定は即時反映され、ページの更新は不要です。\n\nテーマシステム：:root の CSS 変数値を変更することでライトモードとダークモードを切り替えます。アクセントカラー変数はすべてのインタラクティブ要素のメインカラーを制御します。\n\nアニメーションシステム：CSS トランジションとキーフレームアニメーションをベースに、UI フェードイン、ボタンホバー、ページ遷移、モーダル遷移の4層に分かれています。\n\nパフォーマンス最適化：低スペック端末やモバイルブラウザ向けに、アニメーション削減、ガラス効果無効化、低解像度プレビュー、遅延読み込み、パーティクル無効化、積極的キャッシングなどのダウングレードオプションを提供します。',
      buttons: [
        { name: 'テーマ切り替え', description: 'ライトモードとダークモードを切り替えます。すべてのページ要素がスムーズに遷移します。' },
        { name: 'スタイルプリセット適用', description: '保存済みの完全なスタイル組み合わせ（テーマ+色+フォント）をワンクリックで適用します。' },
        { name: 'フォント変更', description: '11種類のインターフェースフォントから選択します。切り替え後即時にすべてのテキストに適用されます。' },
        { name: 'アニメーション有効化', description: 'すべての UI アニメーション効果（フェードイン、ホバー、ページ遷移、モーダルアニメーション）を有効にします。' },
        { name: 'アニメーション無効化', description: 'すべてのアニメーションを無効にします。インターフェースの変化が即時切り替えになります。' },
      ],
      parameters: [
        { name: 'テーマモード', description: 'ライトモードは日中と明るい環境に適しています。ダークモードは夜間の目の疲れと OLED 消費電力を軽減します。' },
        { name: 'アクセントカラー', description: 'ボタン、プログレスバー、選択状態、リンク、アイコンなどのハイライト要素に影響するメインカラー。' },
        { name: 'カスタムコントラスト', description: 'インターフェースの明暗コントラストを調整します。ソフト（低コントラスト）から強烈（高コントラスト）まで5段階。' },
        { name: 'フォントファミリー', description: '11種類のインターフェースフォント。' },
        { name: 'アニメーション有効', description: 'グローバルアニメーションのマスタースイッチ。オフにするとすべてのトランジションが即時になります。' },
        { name: 'アニメーション速度', description: 'スロー（1.5倍時間）、ノーマル（1倍）、ファスト（0.5倍）。' },
        { name: '高コントラストフォーカス', description: 'キーボードフォーカスインジケーターに高コントラストの境界線を追加し、キーボードナビゲーションとアクセシビリティを向上させます。' },
      ],
      errors: [
        {
          code: 'THEME_CSS_LOAD_FAILED',
          message: 'テーマ CSS 変数の読み込みに失敗しました',
          severity: 'warning',
          category: 'B. 設定とデータ',
          location: '設定パネル → スタイル',
          cause: 'カスタムテーマ値がブラウザで解析できなかった可能性があります。色のフォーマットが不正か、CSS 変数値がオーバーフローしています。',
          solution: 'スタイル設定をリセットするか、システムプリセットを選択してください。',
        },
        {
          code: 'FONT_LOAD_FAILED',
          message: 'フォントの読み込みに失敗しました',
          severity: 'warning',
          category: 'F. ブラウザとパフォーマンス',
          location: '設定パネル → スタイル → フォント',
          cause: '選択したフォントが現在のシステムにインストールされていない、ネットワークフォントの読み込みがタイムアウトした、またはフォントファイルがブラウザのセキュリティポリシーによってブロックされました。',
          solution: 'システムにインストール済みのフォントを選択するか、ネットワーク接続を確認して再試行してください。',
        },
      ],
    },
  ],
  errorDictionary: [
    {
      id: 'A',
      name: 'A. API とネットワーク',
      description: 'API Key、ネットワーク接続、バックエンドサービス、リクエストタイムアウト、レート制限などの外部依存に関するエラーです。',
      errors: [
        {
          code: 'API_KEY_EXPIRED',
          message: 'リクエストが 401 を返すか、Key が無効/期限切れと表示される',
          severity: 'critical',
          category: 'A. API とネットワーク',
          location: 'ページ：任意のオンラインツール → 領域：エラーパネルまたは出力領域',
          cause: '設定された API Key の有効期限が切れたか、失効したか、クォータを使い果たしました。',
          solution: '有効な API Key に置き換えます。',
          steps: ['「設定 → API」パネルを開く', '現在の Key を削除し、新しい有効な Key を入力', 'Key が有効かどうか不明な場合は LLM Hub のリアルタイムテストパネルで事前にテスト', '保存して対応するツールに戻り再試行'],
          relatedCodes: ['API_KEY_MISSING', '401_UNAUTHORIZED'],
          prevention: 'API Key の有効期限と残りクォータを定期的に確認してください。',
        },
        {
          code: 'API_KEY_MISSING',
          message: '開始/送信/生成をクリックすると直ちにエラー、API Key が設定されていないと表示される',
          severity: 'critical',
          category: 'A. API とネットワーク',
          location: 'ページ：任意のオンラインツール → 領域：エラーパネルまたは出力領域',
          cause: '「設定 → API」で API Key が設定されていません。バックエンドサービスを呼び出すすべてのツールには有効な API Key が必要です。',
          solution: '設定パネルで有効な API Key を設定します。',
          steps: ['右上の「設定を開く」または対応するショートカットをクリック', '「API」タブに切り替える', '「API Key」入力欄に有効な Key を入力', '「保存」をクリックして設定パネルを閉じる', 'ツールページに戻り操作を再試行'],
          relatedCodes: ['API_KEY_EXPIRED', '401_UNAUTHORIZED'],
          prevention: 'オンラインツールを初めて使用する前に、必ず「設定 → API」で有効な API Key を設定してください。',
        },
        {
          code: 'BACKEND_UNAVAILABLE',
          message: '「バックエンドが利用できません」「サーバーに接続できません」、またはリクエストが送信できないと表示される',
          severity: 'critical',
          category: 'A. API とネットワーク',
          location: 'ページ：任意のオンラインツール → 領域：エラーパネル',
          cause: 'バックエンドサーバーが起動していない、クラッシュした、またはフロントエンドで設定された API Base URL が正しくありません。',
          solution: 'バックエンドサービスの状態と API 設定を確認します。',
          steps: ['ブラウザの DevTools → Network タブを開く', '操作を再試行し、リクエストが送信されたかどうかとレスポンスステータスコードを確認', 'リクエストが送信されない場合は「設定 → API → API Base URL」が正しいか確認', 'リクエストが 502/503 を返す場合はバックエンド管理者に連絡', 'ローカルデプロイの場合、バックエンドプロセスが実行中か確認（npm start）'],
          relatedCodes: ['NETWORK_DISCONNECTED', '502_BAD_GATEWAY', '503_SERVICE_UNAVAILABLE'],
          prevention: 'ローカルデプロイ時はバックエンドプロセスを起動してください（npm start）。リモートサービス使用時は URL 設定が正しいことを確認してください。',
        },
      
        {
          code: 'API_001',
          message: '接続タイムアウトが発生しました (API_001).',
          severity: 'critical',
          category: 'A. APIとネットワーク',
          location: 'ページ：顔作成 → 領域：ボタン',
          cause: 'ネットワーク接続が不安定または切断されました。',
          solution: 'ネットワーク接続を確認して再試行してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['API_002', 'API_003'],
          prevention: 'ネットワーク状態を定期的に監視し、安定した接続を維持してください。API Keyの有効期限と残り割り当て量を定期的に確認してください。',
        },
        {
          code: 'API_002',
          message: 'ネットワーク不安定が発生しました (API_002).',
          severity: 'error',
          category: 'A. APIとネットワーク',
          location: 'ページ：スタイル変換 → 領域：入力',
          cause: 'サーバーが過負荷状態です。',
          solution: 'しばらくしてから再試行してください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['API_003', 'API_004'],
          prevention: 'ネットワーク状態を定期的に監視し、安定した接続を維持してください。API Keyの有効期限と残り割り当て量を定期的に確認してください。',
        },
        {
          code: 'API_003',
          message: 'DNS解決失敗が発生しました (API_003).',
          severity: 'warning',
          category: 'A. APIとネットワーク',
          location: 'ページ：プロンプト → 領域：出力',
          cause: 'DNS設定が間違っています。',
          solution: 'DNS設定を確認してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['API_004', 'API_005'],
          prevention: 'ネットワーク状態を定期的に監視し、安定した接続を維持してください。API Keyの有効期限と残り割り当て量を定期的に確認してください。',
        },
        {
          code: 'API_004',
          message: 'SSL証明書エラーが発生しました (API_004).',
          severity: 'info',
          category: 'A. APIとネットワーク',
          location: 'ページ：LLM → 領域：パネル',
          cause: 'SSL証明書が期限切れです。',
          solution: 'プロキシ設定を確認してください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['API_005', 'API_006'],
          prevention: 'ネットワーク状態を定期的に監視し、安定した接続を維持してください。API Keyの有効期限と残り割り当て量を定期的に確認してください。',
        },
        {
          code: 'API_005',
          message: 'プロキシ接続失敗が発生しました (API_005).',
          severity: 'critical',
          category: 'A. APIとネットワーク',
          location: 'ページ：TTS → 領域：キャンバス',
          cause: 'プロキシ設定が正しくありません。',
          solution: 'ファイアウォール規則を確認してください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['API_006', 'API_007'],
          prevention: 'ネットワーク状態を定期的に監視し、安定した接続を維持してください。API Keyの有効期限と残り割り当て量を定期的に確認してください。',
        },
        {
          code: 'API_006',
          message: 'ファイアウォール遮断が発生しました (API_006).',
          severity: 'error',
          category: 'A. APIとネットワーク',
          location: 'ページ：paper2gal → 領域：ボタン',
          cause: 'ネットワーク接続が不安定または切断されました。',
          solution: 'ネットワーク接続を確認して再試行してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['API_007', 'API_008'],
          prevention: 'ネットワーク状態を定期的に監視し、安定した接続を維持してください。API Keyの有効期限と残り割り当て量を定期的に確認してください。',
        },
        {
          code: 'API_007',
          message: 'ルーターリセット必要が発生しました (API_007).',
          severity: 'warning',
          category: 'A. APIとネットワーク',
          location: 'ページ：画像変換 → 領域：入力',
          cause: 'サーバーが過負荷状態です。',
          solution: 'しばらくしてから再試行してください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['API_008', 'API_009'],
          prevention: 'ネットワーク状態を定期的に監視し、安定した接続を維持してください。API Keyの有効期限と残り割り当て量を定期的に確認してください。',
        },
        {
          code: 'API_008',
          message: '帯域超過が発生しました (API_008).',
          severity: 'info',
          category: 'A. APIとネットワーク',
          location: 'ページ：設定 → 領域：出力',
          cause: 'DNS設定が間違っています。',
          solution: 'DNS設定を確認してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['API_009', 'API_010'],
          prevention: 'ネットワーク状態を定期的に監視し、安定した接続を維持してください。API Keyの有効期限と残り割り当て量を定期的に確認してください。',
        },
        {
          code: 'API_009',
          message: 'サーバーダウンが発生しました (API_009).',
          severity: 'critical',
          category: 'A. APIとネットワーク',
          location: 'ページ：オーディオ → 領域：パネル',
          cause: 'SSL証明書が期限切れです。',
          solution: 'プロキシ設定を確認してください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['API_010', 'API_001'],
          prevention: 'ネットワーク状態を定期的に監視し、安定した接続を維持してください。API Keyの有効期限と残り割り当て量を定期的に確認してください。',
        },
        {
          code: 'API_010',
          message: 'ロードバランサーエラーが発生しました (API_010).',
          severity: 'error',
          category: 'A. APIとネットワーク',
          location: 'ページ：UI → 領域：キャンバス',
          cause: 'プロキシ設定が正しくありません。',
          solution: 'ファイアウォール規則を確認してください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['API_001', 'API_002'],
          prevention: 'ネットワーク状態を定期的に監視し、安定した接続を維持してください。API Keyの有効期限と残り割り当て量を定期的に確認してください。',
        },
        {
          code: 'API_011',
          message: '接続タイムアウトが発生しました (API_011).',
          severity: 'warning',
          category: 'A. APIとネットワーク',
          location: 'ページ：顔作成 → 領域：ボタン',
          cause: 'ネットワーク接続が不安定または切断されました。',
          solution: 'ネットワーク接続を確認して再試行してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['API_002', 'API_003'],
          prevention: 'ネットワーク状態を定期的に監視し、安定した接続を維持してください。API Keyの有効期限と残り割り当て量を定期的に確認してください。',
        },
        {
          code: 'API_012',
          message: 'ネットワーク不安定が発生しました (API_012).',
          severity: 'info',
          category: 'A. APIとネットワーク',
          location: 'ページ：スタイル変換 → 領域：入力',
          cause: 'サーバーが過負荷状態です。',
          solution: 'しばらくしてから再試行してください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['API_003', 'API_004'],
          prevention: 'ネットワーク状態を定期的に監視し、安定した接続を維持してください。API Keyの有効期限と残り割り当て量を定期的に確認してください。',
        },
        {
          code: 'API_013',
          message: 'DNS解決失敗が発生しました (API_013).',
          severity: 'critical',
          category: 'A. APIとネットワーク',
          location: 'ページ：プロンプト → 領域：出力',
          cause: 'DNS設定が間違っています。',
          solution: 'DNS設定を確認してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['API_004', 'API_005'],
          prevention: 'ネットワーク状態を定期的に監視し、安定した接続を維持してください。API Keyの有効期限と残り割り当て量を定期的に確認してください。',
        },
        {
          code: 'API_014',
          message: 'SSL証明書エラーが発生しました (API_014).',
          severity: 'error',
          category: 'A. APIとネットワーク',
          location: 'ページ：LLM → 領域：パネル',
          cause: 'SSL証明書が期限切れです。',
          solution: 'プロキシ設定を確認してください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['API_005', 'API_006'],
          prevention: 'ネットワーク状態を定期的に監視し、安定した接続を維持してください。API Keyの有効期限と残り割り当て量を定期的に確認してください。',
        },
        {
          code: 'API_015',
          message: 'プロキシ接続失敗が発生しました (API_015).',
          severity: 'warning',
          category: 'A. APIとネットワーク',
          location: 'ページ：TTS → 領域：キャンバス',
          cause: 'プロキシ設定が正しくありません。',
          solution: 'ファイアウォール規則を確認してください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['API_006', 'API_007'],
          prevention: 'ネットワーク状態を定期的に監視し、安定した接続を維持してください。API Keyの有効期限と残り割り当て量を定期的に確認してください。',
        },
        {
          code: 'API_016',
          message: 'ファイアウォール遮断が発生しました (API_016).',
          severity: 'info',
          category: 'A. APIとネットワーク',
          location: 'ページ：paper2gal → 領域：ボタン',
          cause: 'ネットワーク接続が不安定または切断されました。',
          solution: 'ネットワーク接続を確認して再試行してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['API_007', 'API_008'],
          prevention: 'ネットワーク状態を定期的に監視し、安定した接続を維持してください。API Keyの有効期限と残り割り当て量を定期的に確認してください。',
        },
        {
          code: 'API_017',
          message: 'ルーターリセット必要が発生しました (API_017).',
          severity: 'critical',
          category: 'A. APIとネットワーク',
          location: 'ページ：画像変換 → 領域：入力',
          cause: 'サーバーが過負荷状態です。',
          solution: 'しばらくしてから再試行してください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['API_008', 'API_009'],
          prevention: 'ネットワーク状態を定期的に監視し、安定した接続を維持してください。API Keyの有効期限と残り割り当て量を定期的に確認してください。',
        },
        {
          code: 'API_018',
          message: '帯域超過が発生しました (API_018).',
          severity: 'error',
          category: 'A. APIとネットワーク',
          location: 'ページ：設定 → 領域：出力',
          cause: 'DNS設定が間違っています。',
          solution: 'DNS設定を確認してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['API_009', 'API_010'],
          prevention: 'ネットワーク状態を定期的に監視し、安定した接続を維持してください。API Keyの有効期限と残り割り当て量を定期的に確認してください。',
        },
        {
          code: 'API_019',
          message: 'サーバーダウンが発生しました (API_019).',
          severity: 'warning',
          category: 'A. APIとネットワーク',
          location: 'ページ：オーディオ → 領域：パネル',
          cause: 'SSL証明書が期限切れです。',
          solution: 'プロキシ設定を確認してください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['API_010', 'API_001'],
          prevention: 'ネットワーク状態を定期的に監視し、安定した接続を維持してください。API Keyの有効期限と残り割り当て量を定期的に確認してください。',
        },
        {
          code: 'API_020',
          message: 'ロードバランサーエラーが発生しました (API_020).',
          severity: 'info',
          category: 'A. APIとネットワーク',
          location: 'ページ：UI → 領域：キャンバス',
          cause: 'プロキシ設定が正しくありません。',
          solution: 'ファイアウォール規則を確認してください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['API_001', 'API_002'],
          prevention: 'ネットワーク状態を定期的に監視し、安定した接続を維持してください。API Keyの有効期限と残り割り当て量を定期的に確認してください。',
        },
        {
          code: 'API_021',
          message: '接続タイムアウトが発生しました (API_021).',
          severity: 'critical',
          category: 'A. APIとネットワーク',
          location: 'ページ：顔作成 → 領域：ボタン',
          cause: 'ネットワーク接続が不安定または切断されました。',
          solution: 'ネットワーク接続を確認して再試行してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['API_002', 'API_003'],
          prevention: 'ネットワーク状態を定期的に監視し、安定した接続を維持してください。API Keyの有効期限と残り割り当て量を定期的に確認してください。',
        },
        {
          code: 'API_022',
          message: 'ネットワーク不安定が発生しました (API_022).',
          severity: 'error',
          category: 'A. APIとネットワーク',
          location: 'ページ：スタイル変換 → 領域：入力',
          cause: 'サーバーが過負荷状態です。',
          solution: 'しばらくしてから再試行してください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['API_003', 'API_004'],
          prevention: 'ネットワーク状態を定期的に監視し、安定した接続を維持してください。API Keyの有効期限と残り割り当て量を定期的に確認してください。',
        },
        {
          code: 'API_023',
          message: 'DNS解決失敗が発生しました (API_023).',
          severity: 'warning',
          category: 'A. APIとネットワーク',
          location: 'ページ：プロンプト → 領域：出力',
          cause: 'DNS設定が間違っています。',
          solution: 'DNS設定を確認してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['API_004', 'API_005'],
          prevention: 'ネットワーク状態を定期的に監視し、安定した接続を維持してください。API Keyの有効期限と残り割り当て量を定期的に確認してください。',
        },
        {
          code: 'API_024',
          message: 'SSL証明書エラーが発生しました (API_024).',
          severity: 'info',
          category: 'A. APIとネットワーク',
          location: 'ページ：LLM → 領域：パネル',
          cause: 'SSL証明書が期限切れです。',
          solution: 'プロキシ設定を確認してください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['API_005', 'API_006'],
          prevention: 'ネットワーク状態を定期的に監視し、安定した接続を維持してください。API Keyの有効期限と残り割り当て量を定期的に確認してください。',
        },
        {
          code: 'API_025',
          message: 'プロキシ接続失敗が発生しました (API_025).',
          severity: 'critical',
          category: 'A. APIとネットワーク',
          location: 'ページ：TTS → 領域：キャンバス',
          cause: 'プロキシ設定が正しくありません。',
          solution: 'ファイアウォール規則を確認してください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['API_006', 'API_007'],
          prevention: 'ネットワーク状態を定期的に監視し、安定した接続を維持してください。API Keyの有効期限と残り割り当て量を定期的に確認してください。',
        },],
    },
    {
      id: 'B',
      name: 'B. 設定とデータ',
      description: '設定ファイルのインポート/エクスポート、localStorage、データ破損、未保存警告などに関するエラーです。',
      errors: [
        {
          code: 'CONFIG_CORRUPTED',
          message: '設定の読み込みが異常で、インターフェースの表示が不完全または機能が動作しない',
          severity: 'error',
          category: 'B. 設定とデータ',
          location: 'ページ：任意のツール → 領域：ページ全体または特定の機能領域',
          cause: 'ブラウザの localStorage に保存された設定データが破損しています。ブラウザの更新、手動でのデータ削除、バージョン間での互換性のない設定のインポートなどが原因です。',
          solution: '設定をリセットして localStorage をクリアします。',
          steps: ['ページの「リセット」ボタンをクリック', '確認ダイアログで確認をクリック', 'それでも異常な場合は DevTools → Application → Local Storage を開く', '対応するツールのストレージキーを削除', 'ページを更新して最初からやり直す'],
          relatedCodes: ['IMPORT_INVALID_JSON', 'STORAGE_READ_ONLY'],
          prevention: 'localStorage のデータを手動で変更しないでください。バージョン更新後に異常があれば設定をリセットしてください。',
        },
        {
          code: 'STORAGE_READ_ONLY',
          message: '保存操作が反応せず、更新後にデータが失われる',
          severity: 'critical',
          category: 'B. 設定とデータ',
          location: 'ページ：任意のツール → 領域：「保存」ボタン',
          cause: 'ブラウザがプライベート/シークレットモードであるか、localStorage がシステムポリシーで無効化されているか、ディスク容量が一杯でブラウザがストレージを読み取り専用に設定しています。',
          solution: 'プライベートモードを終了するか、ディスク容量を空けます。',
          steps: ['ブラウザがシークレット/プライベートブラウジングモードでないことを確認', 'システムのディスク容量が一杯でないか確認', '通常ウィンドウでアプリを再度開く', '問題が続く場合は「エクスポート」機能で設定をローカルファイルとして保存する代替案を使用'],
          relatedCodes: ['LOCAL_STORAGE_FULL'],
          prevention: 'ブラウザのシークレット/プライベートモードでこのアプリを使用しないでください。定期的に設定をローカルファイルにエクスポートしてバックアップしてください。',
        },
      
        {
          code: 'CONFIG_001',
          message: '設定破損が発生しました (CONFIG_001).',
          severity: 'critical',
          category: 'B. 設定とデータ',
          location: 'ページ：顔作成 → 領域：ボタン',
          cause: '設定ファイルが破損または欠落しています。',
          solution: '設定を初期化して再構成してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['CONFIG_002', 'CONFIG_003'],
          prevention: '設定を定期的にバックアップし、バージョン管理を行ってください。ブラウザの保存容量を監視し、キャッシュを定期的にクリアしてください。',
        },
        {
          code: 'CONFIG_002',
          message: 'データベースアクセス拒否が発生しました (CONFIG_002).',
          severity: 'error',
          category: 'B. 設定とデータ',
          location: 'ページ：スタイル変換 → 領域：入力',
          cause: 'ブラウザの保存容量が一杯です。',
          solution: 'ブラウザキャッシュをクリアしてください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['CONFIG_003', 'CONFIG_004'],
          prevention: '設定を定期的にバックアップし、バージョン管理を行ってください。ブラウザの保存容量を監視し、キャッシュを定期的にクリアしてください。',
        },
        {
          code: 'CONFIG_003',
          message: '設定ファイル欠落が発生しました (CONFIG_003).',
          severity: 'warning',
          category: 'B. 設定とデータ',
          location: 'ページ：プロンプト → 領域：出力',
          cause: '構成スキーマが更新されました。',
          solution: 'バックアップから設定を復元してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['CONFIG_004', 'CONFIG_005'],
          prevention: '設定を定期的にバックアップし、バージョン管理を行ってください。ブラウザの保存容量を監視し、キャッシュを定期的にクリアしてください。',
        },
        {
          code: 'CONFIG_004',
          message: 'スキーマ不一致が発生しました (CONFIG_004).',
          severity: 'info',
          category: 'B. 設定とデータ',
          location: 'ページ：LLM → 領域：パネル',
          cause: 'インポートファイル形式が正しくありません。',
          solution: 'ファイル形式を確認して再インポートしてください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['CONFIG_005', 'CONFIG_006'],
          prevention: '設定を定期的にバックアップし、バージョン管理を行ってください。ブラウザの保存容量を監視し、キャッシュを定期的にクリアしてください。',
        },
        {
          code: 'CONFIG_005',
          message: 'バックアップ復元失敗が発生しました (CONFIG_005).',
          severity: 'critical',
          category: 'B. 設定とデータ',
          location: 'ページ：TTS → 領域：キャンバス',
          cause: '同期サーバーに接続できません。',
          solution: '手動で設定を更新してください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['CONFIG_006', 'CONFIG_007'],
          prevention: '設定を定期的にバックアップし、バージョン管理を行ってください。ブラウザの保存容量を監視し、キャッシュを定期的にクリアしてください。',
        },
        {
          code: 'CONFIG_006',
          message: 'バージョン衝突が発生しました (CONFIG_006).',
          severity: 'error',
          category: 'B. 設定とデータ',
          location: 'ページ：paper2gal → 領域：ボタン',
          cause: '設定ファイルが破損または欠落しています。',
          solution: '設定を初期化して再構成してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['CONFIG_007', 'CONFIG_008'],
          prevention: '設定を定期的にバックアップし、バージョン管理を行ってください。ブラウザの保存容量を監視し、キャッシュを定期的にクリアしてください。',
        },
        {
          code: 'CONFIG_007',
          message: 'インポート形式エラーが発生しました (CONFIG_007).',
          severity: 'warning',
          category: 'B. 設定とデータ',
          location: 'ページ：画像変換 → 領域：入力',
          cause: 'ブラウザの保存容量が一杯です。',
          solution: 'ブラウザキャッシュをクリアしてください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['CONFIG_008', 'CONFIG_009'],
          prevention: '設定を定期的にバックアップし、バージョン管理を行ってください。ブラウザの保存容量を監視し、キャッシュを定期的にクリアしてください。',
        },
        {
          code: 'CONFIG_008',
          message: 'エクスポート失敗が発生しました (CONFIG_008).',
          severity: 'info',
          category: 'B. 設定とデータ',
          location: 'ページ：設定 → 領域：出力',
          cause: '構成スキーマが更新されました。',
          solution: 'バックアップから設定を復元してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['CONFIG_009', 'CONFIG_010'],
          prevention: '設定を定期的にバックアップし、バージョン管理を行ってください。ブラウザの保存容量を監視し、キャッシュを定期的にクリアしてください。',
        },
        {
          code: 'CONFIG_009',
          message: 'キャッシュ破損が発生しました (CONFIG_009).',
          severity: 'critical',
          category: 'B. 設定とデータ',
          location: 'ページ：オーディオ → 領域：パネル',
          cause: 'インポートファイル形式が正しくありません。',
          solution: 'ファイル形式を確認して再インポートしてください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['CONFIG_010', 'CONFIG_001'],
          prevention: '設定を定期的にバックアップし、バージョン管理を行ってください。ブラウザの保存容量を監視し、キャッシュを定期的にクリアしてください。',
        },
        {
          code: 'CONFIG_010',
          message: '同期エラーが発生しました (CONFIG_010).',
          severity: 'error',
          category: 'B. 設定とデータ',
          location: 'ページ：UI → 領域：キャンバス',
          cause: '同期サーバーに接続できません。',
          solution: '手動で設定を更新してください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['CONFIG_001', 'CONFIG_002'],
          prevention: '設定を定期的にバックアップし、バージョン管理を行ってください。ブラウザの保存容量を監視し、キャッシュを定期的にクリアしてください。',
        },
        {
          code: 'CONFIG_011',
          message: '設定破損が発生しました (CONFIG_011).',
          severity: 'warning',
          category: 'B. 設定とデータ',
          location: 'ページ：顔作成 → 領域：ボタン',
          cause: '設定ファイルが破損または欠落しています。',
          solution: '設定を初期化して再構成してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['CONFIG_002', 'CONFIG_003'],
          prevention: '設定を定期的にバックアップし、バージョン管理を行ってください。ブラウザの保存容量を監視し、キャッシュを定期的にクリアしてください。',
        },
        {
          code: 'CONFIG_012',
          message: 'データベースアクセス拒否が発生しました (CONFIG_012).',
          severity: 'info',
          category: 'B. 設定とデータ',
          location: 'ページ：スタイル変換 → 領域：入力',
          cause: 'ブラウザの保存容量が一杯です。',
          solution: 'ブラウザキャッシュをクリアしてください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['CONFIG_003', 'CONFIG_004'],
          prevention: '設定を定期的にバックアップし、バージョン管理を行ってください。ブラウザの保存容量を監視し、キャッシュを定期的にクリアしてください。',
        },
        {
          code: 'CONFIG_013',
          message: '設定ファイル欠落が発生しました (CONFIG_013).',
          severity: 'critical',
          category: 'B. 設定とデータ',
          location: 'ページ：プロンプト → 領域：出力',
          cause: '構成スキーマが更新されました。',
          solution: 'バックアップから設定を復元してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['CONFIG_004', 'CONFIG_005'],
          prevention: '設定を定期的にバックアップし、バージョン管理を行ってください。ブラウザの保存容量を監視し、キャッシュを定期的にクリアしてください。',
        },
        {
          code: 'CONFIG_014',
          message: 'スキーマ不一致が発生しました (CONFIG_014).',
          severity: 'error',
          category: 'B. 設定とデータ',
          location: 'ページ：LLM → 領域：パネル',
          cause: 'インポートファイル形式が正しくありません。',
          solution: 'ファイル形式を確認して再インポートしてください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['CONFIG_005', 'CONFIG_006'],
          prevention: '設定を定期的にバックアップし、バージョン管理を行ってください。ブラウザの保存容量を監視し、キャッシュを定期的にクリアしてください。',
        },
        {
          code: 'CONFIG_015',
          message: 'バックアップ復元失敗が発生しました (CONFIG_015).',
          severity: 'warning',
          category: 'B. 設定とデータ',
          location: 'ページ：TTS → 領域：キャンバス',
          cause: '同期サーバーに接続できません。',
          solution: '手動で設定を更新してください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['CONFIG_006', 'CONFIG_007'],
          prevention: '設定を定期的にバックアップし、バージョン管理を行ってください。ブラウザの保存容量を監視し、キャッシュを定期的にクリアしてください。',
        },
        {
          code: 'CONFIG_016',
          message: 'バージョン衝突が発生しました (CONFIG_016).',
          severity: 'info',
          category: 'B. 設定とデータ',
          location: 'ページ：paper2gal → 領域：ボタン',
          cause: '設定ファイルが破損または欠落しています。',
          solution: '設定を初期化して再構成してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['CONFIG_007', 'CONFIG_008'],
          prevention: '設定を定期的にバックアップし、バージョン管理を行ってください。ブラウザの保存容量を監視し、キャッシュを定期的にクリアしてください。',
        },
        {
          code: 'CONFIG_017',
          message: 'インポート形式エラーが発生しました (CONFIG_017).',
          severity: 'critical',
          category: 'B. 設定とデータ',
          location: 'ページ：画像変換 → 領域：入力',
          cause: 'ブラウザの保存容量が一杯です。',
          solution: 'ブラウザキャッシュをクリアしてください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['CONFIG_008', 'CONFIG_009'],
          prevention: '設定を定期的にバックアップし、バージョン管理を行ってください。ブラウザの保存容量を監視し、キャッシュを定期的にクリアしてください。',
        },
        {
          code: 'CONFIG_018',
          message: 'エクスポート失敗が発生しました (CONFIG_018).',
          severity: 'error',
          category: 'B. 設定とデータ',
          location: 'ページ：設定 → 領域：出力',
          cause: '構成スキーマが更新されました。',
          solution: 'バックアップから設定を復元してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['CONFIG_009', 'CONFIG_010'],
          prevention: '設定を定期的にバックアップし、バージョン管理を行ってください。ブラウザの保存容量を監視し、キャッシュを定期的にクリアしてください。',
        },
        {
          code: 'CONFIG_019',
          message: 'キャッシュ破損が発生しました (CONFIG_019).',
          severity: 'warning',
          category: 'B. 設定とデータ',
          location: 'ページ：オーディオ → 領域：パネル',
          cause: 'インポートファイル形式が正しくありません。',
          solution: 'ファイル形式を確認して再インポートしてください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['CONFIG_010', 'CONFIG_001'],
          prevention: '設定を定期的にバックアップし、バージョン管理を行ってください。ブラウザの保存容量を監視し、キャッシュを定期的にクリアしてください。',
        },
        {
          code: 'CONFIG_020',
          message: '同期エラーが発生しました (CONFIG_020).',
          severity: 'info',
          category: 'B. 設定とデータ',
          location: 'ページ：UI → 領域：キャンバス',
          cause: '同期サーバーに接続できません。',
          solution: '手動で設定を更新してください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['CONFIG_001', 'CONFIG_002'],
          prevention: '設定を定期的にバックアップし、バージョン管理を行ってください。ブラウザの保存容量を監視し、キャッシュを定期的にクリアしてください。',
        },
        {
          code: 'CONFIG_021',
          message: '設定破損が発生しました (CONFIG_021).',
          severity: 'critical',
          category: 'B. 設定とデータ',
          location: 'ページ：顔作成 → 領域：ボタン',
          cause: '設定ファイルが破損または欠落しています。',
          solution: '設定を初期化して再構成してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['CONFIG_002', 'CONFIG_003'],
          prevention: '設定を定期的にバックアップし、バージョン管理を行ってください。ブラウザの保存容量を監視し、キャッシュを定期的にクリアしてください。',
        },
        {
          code: 'CONFIG_022',
          message: 'データベースアクセス拒否が発生しました (CONFIG_022).',
          severity: 'error',
          category: 'B. 設定とデータ',
          location: 'ページ：スタイル変換 → 領域：入力',
          cause: 'ブラウザの保存容量が一杯です。',
          solution: 'ブラウザキャッシュをクリアしてください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['CONFIG_003', 'CONFIG_004'],
          prevention: '設定を定期的にバックアップし、バージョン管理を行ってください。ブラウザの保存容量を監視し、キャッシュを定期的にクリアしてください。',
        },
        {
          code: 'CONFIG_023',
          message: '設定ファイル欠落が発生しました (CONFIG_023).',
          severity: 'warning',
          category: 'B. 設定とデータ',
          location: 'ページ：プロンプト → 領域：出力',
          cause: '構成スキーマが更新されました。',
          solution: 'バックアップから設定を復元してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['CONFIG_004', 'CONFIG_005'],
          prevention: '設定を定期的にバックアップし、バージョン管理を行ってください。ブラウザの保存容量を監視し、キャッシュを定期的にクリアしてください。',
        },
        {
          code: 'CONFIG_024',
          message: 'スキーマ不一致が発生しました (CONFIG_024).',
          severity: 'info',
          category: 'B. 設定とデータ',
          location: 'ページ：LLM → 領域：パネル',
          cause: 'インポートファイル形式が正しくありません。',
          solution: 'ファイル形式を確認して再インポートしてください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['CONFIG_005', 'CONFIG_006'],
          prevention: '設定を定期的にバックアップし、バージョン管理を行ってください。ブラウザの保存容量を監視し、キャッシュを定期的にクリアしてください。',
        },
        {
          code: 'CONFIG_025',
          message: 'バックアップ復元失敗が発生しました (CONFIG_025).',
          severity: 'critical',
          category: 'B. 設定とデータ',
          location: 'ページ：TTS → 領域：キャンバス',
          cause: '同期サーバーに接続できません。',
          solution: '手動で設定を更新してください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['CONFIG_006', 'CONFIG_007'],
          prevention: '設定を定期的にバックアップし、バージョン管理を行ってください。ブラウザの保存容量を監視し、キャッシュを定期的にクリアしてください。',
        },],
    },
    {
      id: 'C',
      name: 'C. ファイルと入力',
      description: '画像/音声ファイルのアップロード、非対応形式、ファイル破損、ファイルサイズ过大などの入力に関するエラーです。',
      errors: [
        {
          code: 'FILE_FORMAT_UNSUPPORTED',
          message: 'アップロード時に「非対応のファイル形式」と表示される',
          severity: 'warning',
          category: 'C. ファイルと入力',
          location: 'ページ：任意のアップロードを含むツール → 領域：「ファイルを選択」ボタン',
          cause: 'ツールがサポートしていないファイル形式が選択されました。',
          solution: 'ファイルを対応形式に変換します。',
          steps: ['ツールの対応形式リストを確認（通常はボタンの下に表示）', '画像/音声変換ツールでファイルを対応形式に変換', 'システム内蔵のプレビュー/編集ツールで対応形式としてエクスポート', '変換したファイルを再アップロード'],
          relatedCodes: ['FILE_CORRUPTED', 'UPLOAD_FORMAT'],
        },
        {
          code: 'FILE_TOO_LARGE',
          message: 'アップロード後にプレビューが失敗したり、処理中にメモリエラーが発生したりする',
          severity: 'warning',
          category: 'C. ファイルと入力',
          location: 'ページ：任意のアップロードを含むツール → 領域：プレビュー領域',
          cause: 'アップロードされたファイルサイズが大きすぎます（ツールまたはブラウザの制限を超過）。',
          solution: '圧縮または縮小してからアップロードします。',
          steps: ['画像/音声変換ツールでファイルを圧縮または縮小', '画像の場合、最大辺を 2048 または 4096 ピクセル以下に縮小', '音声の場合、サンプリングレートまたはビットレートを下げる', '処理したファイルを再アップロード'],
          relatedCodes: ['DEVICE_MEMORY_LOW', 'FILE_FORMAT_UNSUPPORTED'],
        },
      
        {
          code: 'CONTENT_001',
          message: '入力長超過が発生しました (CONTENT_001).',
          severity: 'critical',
          category: 'C. コンテンツと入力',
          location: 'ページ：顔作成 → 領域：ボタン',
          cause: '入力内容がシステム制限を超えました。',
          solution: '入力内容を減らして再試行してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['CONTENT_002', 'CONTENT_003'],
          prevention: '入力内容の長さと形式を事前に確認してください。サポートされているファイル形式とサイズ制限を把握してください。',
        },
        {
          code: 'CONTENT_002',
          message: '未対応形式が発生しました (CONTENT_002).',
          severity: 'error',
          category: 'C. コンテンツと入力',
          location: 'ページ：スタイル変換 → 領域：入力',
          cause: 'ファイル形式がサポートされていません。',
          solution: 'サポートされているファイル形式に変換してください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['CONTENT_003', 'CONTENT_004'],
          prevention: '入力内容の長さと形式を事前に確認してください。サポートされているファイル形式とサイズ制限を把握してください。',
        },
        {
          code: 'CONTENT_003',
          message: 'エンコーディングエラーが発生しました (CONTENT_003).',
          severity: 'warning',
          category: 'C. コンテンツと入力',
          location: 'ページ：プロンプト → 領域：出力',
          cause: '文字エンコーディングが正しくありません。',
          solution: '必須フィールドをすべて入力してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['CONTENT_004', 'CONTENT_005'],
          prevention: '入力内容の長さと形式を事前に確認してください。サポートされているファイル形式とサイズ制限を把握してください。',
        },
        {
          code: 'CONTENT_004',
          message: '禁止文字含むが発生しました (CONTENT_004).',
          severity: 'info',
          category: 'C. コンテンツと入力',
          location: 'ページ：LLM → 領域：パネル',
          cause: '必須入力フィールドが空です。',
          solution: 'コンテンツを確認してポリシーに準拠するよう修正してください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['CONTENT_005', 'CONTENT_006'],
          prevention: '入力内容の長さと形式を事前に確認してください。サポートされているファイル形式とサイズ制限を把握してください。',
        },
        {
          code: 'CONTENT_005',
          message: '必須フィールド欠落が発生しました (CONTENT_005).',
          severity: 'critical',
          category: 'C. コンテンツと入力',
          location: 'ページ：TTS → 領域：キャンバス',
          cause: 'コンテンツが使用ポリシーに違反しました。',
          solution: 'ファイルサイズを小さくしてください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['CONTENT_006', 'CONTENT_007'],
          prevention: '入力内容の長さと形式を事前に確認してください。サポートされているファイル形式とサイズ制限を把握してください。',
        },
        {
          code: 'CONTENT_006',
          message: '検証失敗が発生しました (CONTENT_006).',
          severity: 'error',
          category: 'C. コンテンツと入力',
          location: 'ページ：paper2gal → 領域：ボタン',
          cause: '入力内容がシステム制限を超えました。',
          solution: '入力内容を減らして再試行してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['CONTENT_007', 'CONTENT_008'],
          prevention: '入力内容の長さと形式を事前に確認してください。サポートされているファイル形式とサイズ制限を把握してください。',
        },
        {
          code: 'CONTENT_007',
          message: 'ファイルサイズ超過が発生しました (CONTENT_007).',
          severity: 'warning',
          category: 'C. コンテンツと入力',
          location: 'ページ：画像変換 → 領域：入力',
          cause: 'ファイル形式がサポートされていません。',
          solution: 'サポートされているファイル形式に変換してください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['CONTENT_008', 'CONTENT_009'],
          prevention: '入力内容の長さと形式を事前に確認してください。サポートされているファイル形式とサイズ制限を把握してください。',
        },
        {
          code: 'CONTENT_008',
          message: '画像解像度不一致が発生しました (CONTENT_008).',
          severity: 'info',
          category: 'C. コンテンツと入力',
          location: 'ページ：設定 → 領域：出力',
          cause: '文字エンコーディングが正しくありません。',
          solution: '必須フィールドをすべて入力してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['CONTENT_009', 'CONTENT_010'],
          prevention: '入力内容の長さと形式を事前に確認してください。サポートされているファイル形式とサイズ制限を把握してください。',
        },
        {
          code: 'CONTENT_009',
          message: 'プロンプトインジェクション検出が発生しました (CONTENT_009).',
          severity: 'critical',
          category: 'C. コンテンツと入力',
          location: 'ページ：オーディオ → 領域：パネル',
          cause: '必須入力フィールドが空です。',
          solution: 'コンテンツを確認してポリシーに準拠するよう修正してください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['CONTENT_010', 'CONTENT_001'],
          prevention: '入力内容の長さと形式を事前に確認してください。サポートされているファイル形式とサイズ制限を把握してください。',
        },
        {
          code: 'CONTENT_010',
          message: 'コンテンツポリシー違反が発生しました (CONTENT_010).',
          severity: 'error',
          category: 'C. コンテンツと入力',
          location: 'ページ：UI → 領域：キャンバス',
          cause: 'コンテンツが使用ポリシーに違反しました。',
          solution: 'ファイルサイズを小さくしてください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['CONTENT_001', 'CONTENT_002'],
          prevention: '入力内容の長さと形式を事前に確認してください。サポートされているファイル形式とサイズ制限を把握してください。',
        },
        {
          code: 'CONTENT_011',
          message: '入力長超過が発生しました (CONTENT_011).',
          severity: 'warning',
          category: 'C. コンテンツと入力',
          location: 'ページ：顔作成 → 領域：ボタン',
          cause: '入力内容がシステム制限を超えました。',
          solution: '入力内容を減らして再試行してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['CONTENT_002', 'CONTENT_003'],
          prevention: '入力内容の長さと形式を事前に確認してください。サポートされているファイル形式とサイズ制限を把握してください。',
        },
        {
          code: 'CONTENT_012',
          message: '未対応形式が発生しました (CONTENT_012).',
          severity: 'info',
          category: 'C. コンテンツと入力',
          location: 'ページ：スタイル変換 → 領域：入力',
          cause: 'ファイル形式がサポートされていません。',
          solution: 'サポートされているファイル形式に変換してください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['CONTENT_003', 'CONTENT_004'],
          prevention: '入力内容の長さと形式を事前に確認してください。サポートされているファイル形式とサイズ制限を把握してください。',
        },
        {
          code: 'CONTENT_013',
          message: 'エンコーディングエラーが発生しました (CONTENT_013).',
          severity: 'critical',
          category: 'C. コンテンツと入力',
          location: 'ページ：プロンプト → 領域：出力',
          cause: '文字エンコーディングが正しくありません。',
          solution: '必須フィールドをすべて入力してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['CONTENT_004', 'CONTENT_005'],
          prevention: '入力内容の長さと形式を事前に確認してください。サポートされているファイル形式とサイズ制限を把握してください。',
        },
        {
          code: 'CONTENT_014',
          message: '禁止文字含むが発生しました (CONTENT_014).',
          severity: 'error',
          category: 'C. コンテンツと入力',
          location: 'ページ：LLM → 領域：パネル',
          cause: '必須入力フィールドが空です。',
          solution: 'コンテンツを確認してポリシーに準拠するよう修正してください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['CONTENT_005', 'CONTENT_006'],
          prevention: '入力内容の長さと形式を事前に確認してください。サポートされているファイル形式とサイズ制限を把握してください。',
        },
        {
          code: 'CONTENT_015',
          message: '必須フィールド欠落が発生しました (CONTENT_015).',
          severity: 'warning',
          category: 'C. コンテンツと入力',
          location: 'ページ：TTS → 領域：キャンバス',
          cause: 'コンテンツが使用ポリシーに違反しました。',
          solution: 'ファイルサイズを小さくしてください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['CONTENT_006', 'CONTENT_007'],
          prevention: '入力内容の長さと形式を事前に確認してください。サポートされているファイル形式とサイズ制限を把握してください。',
        },
        {
          code: 'CONTENT_016',
          message: '検証失敗が発生しました (CONTENT_016).',
          severity: 'info',
          category: 'C. コンテンツと入力',
          location: 'ページ：paper2gal → 領域：ボタン',
          cause: '入力内容がシステム制限を超えました。',
          solution: '入力内容を減らして再試行してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['CONTENT_007', 'CONTENT_008'],
          prevention: '入力内容の長さと形式を事前に確認してください。サポートされているファイル形式とサイズ制限を把握してください。',
        },
        {
          code: 'CONTENT_017',
          message: 'ファイルサイズ超過が発生しました (CONTENT_017).',
          severity: 'critical',
          category: 'C. コンテンツと入力',
          location: 'ページ：画像変換 → 領域：入力',
          cause: 'ファイル形式がサポートされていません。',
          solution: 'サポートされているファイル形式に変換してください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['CONTENT_008', 'CONTENT_009'],
          prevention: '入力内容の長さと形式を事前に確認してください。サポートされているファイル形式とサイズ制限を把握してください。',
        },
        {
          code: 'CONTENT_018',
          message: '画像解像度不一致が発生しました (CONTENT_018).',
          severity: 'error',
          category: 'C. コンテンツと入力',
          location: 'ページ：設定 → 領域：出力',
          cause: '文字エンコーディングが正しくありません。',
          solution: '必須フィールドをすべて入力してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['CONTENT_009', 'CONTENT_010'],
          prevention: '入力内容の長さと形式を事前に確認してください。サポートされているファイル形式とサイズ制限を把握してください。',
        },
        {
          code: 'CONTENT_019',
          message: 'プロンプトインジェクション検出が発生しました (CONTENT_019).',
          severity: 'warning',
          category: 'C. コンテンツと入力',
          location: 'ページ：オーディオ → 領域：パネル',
          cause: '必須入力フィールドが空です。',
          solution: 'コンテンツを確認してポリシーに準拠するよう修正してください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['CONTENT_010', 'CONTENT_001'],
          prevention: '入力内容の長さと形式を事前に確認してください。サポートされているファイル形式とサイズ制限を把握してください。',
        },
        {
          code: 'CONTENT_020',
          message: 'コンテンツポリシー違反が発生しました (CONTENT_020).',
          severity: 'info',
          category: 'C. コンテンツと入力',
          location: 'ページ：UI → 領域：キャンバス',
          cause: 'コンテンツが使用ポリシーに違反しました。',
          solution: 'ファイルサイズを小さくしてください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['CONTENT_001', 'CONTENT_002'],
          prevention: '入力内容の長さと形式を事前に確認してください。サポートされているファイル形式とサイズ制限を把握してください。',
        },
        {
          code: 'CONTENT_021',
          message: '入力長超過が発生しました (CONTENT_021).',
          severity: 'critical',
          category: 'C. コンテンツと入力',
          location: 'ページ：顔作成 → 領域：ボタン',
          cause: '入力内容がシステム制限を超えました。',
          solution: '入力内容を減らして再試行してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['CONTENT_002', 'CONTENT_003'],
          prevention: '入力内容の長さと形式を事前に確認してください。サポートされているファイル形式とサイズ制限を把握してください。',
        },
        {
          code: 'CONTENT_022',
          message: '未対応形式が発生しました (CONTENT_022).',
          severity: 'error',
          category: 'C. コンテンツと入力',
          location: 'ページ：スタイル変換 → 領域：入力',
          cause: 'ファイル形式がサポートされていません。',
          solution: 'サポートされているファイル形式に変換してください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['CONTENT_003', 'CONTENT_004'],
          prevention: '入力内容の長さと形式を事前に確認してください。サポートされているファイル形式とサイズ制限を把握してください。',
        },
        {
          code: 'CONTENT_023',
          message: 'エンコーディングエラーが発生しました (CONTENT_023).',
          severity: 'warning',
          category: 'C. コンテンツと入力',
          location: 'ページ：プロンプト → 領域：出力',
          cause: '文字エンコーディングが正しくありません。',
          solution: '必須フィールドをすべて入力してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['CONTENT_004', 'CONTENT_005'],
          prevention: '入力内容の長さと形式を事前に確認してください。サポートされているファイル形式とサイズ制限を把握してください。',
        },
        {
          code: 'CONTENT_024',
          message: '禁止文字含むが発生しました (CONTENT_024).',
          severity: 'info',
          category: 'C. コンテンツと入力',
          location: 'ページ：LLM → 領域：パネル',
          cause: '必須入力フィールドが空です。',
          solution: 'コンテンツを確認してポリシーに準拠するよう修正してください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['CONTENT_005', 'CONTENT_006'],
          prevention: '入力内容の長さと形式を事前に確認してください。サポートされているファイル形式とサイズ制限を把握してください。',
        },
        {
          code: 'CONTENT_025',
          message: '必須フィールド欠落が発生しました (CONTENT_025).',
          severity: 'critical',
          category: 'C. コンテンツと入力',
          location: 'ページ：TTS → 領域：キャンバス',
          cause: 'コンテンツが使用ポリシーに違反しました。',
          solution: 'ファイルサイズを小さくしてください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['CONTENT_006', 'CONTENT_007'],
          prevention: '入力内容の長さと形式を事前に確認してください。サポートされているファイル形式とサイズ制限を把握してください。',
        },],
    },
    {
      id: 'D',
      name: 'D. モデルと生成',
      description: 'AI モデルの利用不可、コンテンツ安全フィルタリング、プロンプトが長すぎる、生成失敗などに関するエラーです。',
      errors: [
        {
          code: 'MODEL_NOT_FOUND',
          message: 'バックエンドが 404 を返し、モデルが見つからないと表示される',
          severity: 'error',
          category: 'D. モデルと生成',
          location: 'ページ：任意のオンラインツール → 領域：エラーパネル',
          cause: 'モデル ID のスペルミス、またはモデルが提供終了となっています。',
          solution: 'モデル ID を修正するか、別のモデルを選択します。',
          steps: ['「モデル」入力欄のモデル ID のスペルを確認', 'ドロップダウンリストから既知の利用可能なモデルを選択', 'カスタム API を使用している場合、サービス提供者のドキュメントでモデルリストを確認', '再試行'],
          relatedCodes: ['LLM_MODEL_UNAVAILABLE'],
          prevention: 'ドロップダウンリストから既知の利用可能なモデルを選択してください。',
        },
        {
          code: 'PROMPT_BLOCKED',
          message: 'コンテンツが安全フィルターによって遮断された',
          severity: 'error',
          category: 'D. モデルと生成',
          location: 'ページ：任意の AI 生成ツール → 領域：エラーパネル',
          cause: 'プロンプトにプラットフォームの安全ポリシーによって遮断される単語が含まれています。通常の芸術用語でも、一部のプラットフォームでは誤判定されることがあります。',
          solution: 'プロンプトを修正し、フィルターをトリガーする可能性のある単語を削除または置き換えます。',
          steps: ['エラー詳細の具体的なプロンプト情報を確認して遮断されたキーワードを特定', '敏感な単語を類義語に置き換えるか削除', 'プロンプトを簡略化し、最も基本的な説明で通過するかテスト', '修飾語を段階的に追加して、具体的にどの単語が遮断をトリガーしているか特定'],
          relatedCodes: ['403_FORBIDDEN'],
          prevention: 'プロンプト上書きを修正する際に敏感な単語を避けてください。カスタマイズする前にデフォルトのプロンプトでテストしてください。',
        },
      
        {
          code: 'MODEL_001',
          message: 'モデル読み込み失敗が発生しました (MODEL_001).',
          severity: 'critical',
          category: 'D. モデルと生成',
          location: 'ページ：顔作成 → 領域：ボタン',
          cause: 'GPUメモリが不足しています。',
          solution: 'バッチサイズを小さくしてください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['MODEL_002', 'MODEL_003'],
          prevention: 'GPUメモリと温度を監視してください。適切な学習パラメータを使用し、正規化画像を活用してください。',
        },
        {
          code: 'MODEL_002',
          message: 'VRAM不足が発生しました (MODEL_002).',
          severity: 'error',
          category: 'D. モデルと生成',
          location: 'ページ：スタイル変換 → 領域：入力',
          cause: 'モデルファイルが破損しています。',
          solution: 'VRAMを確保するために他のプログラムを閉じてください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['MODEL_003', 'MODEL_004'],
          prevention: 'GPUメモリと温度を監視してください。適切な学習パラメータを使用し、正規化画像を活用してください。',
        },
        {
          code: 'MODEL_003',
          message: 'CUDAエラーが発生しました (MODEL_003).',
          severity: 'warning',
          category: 'D. モデルと生成',
          location: 'ページ：プロンプト → 領域：出力',
          cause: '学習パラメータが不適切です。',
          solution: '学習率を調整してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['MODEL_004', 'MODEL_005'],
          prevention: 'GPUメモリと温度を監視してください。適切な学習パラメータを使用し、正規化画像を活用してください。',
        },
        {
          code: 'MODEL_004',
          message: 'チェックポイント破損が発生しました (MODEL_004).',
          severity: 'info',
          category: 'D. モデルと生成',
          location: 'ページ：LLM → 領域：パネル',
          cause: 'ベースモデルバージョンが互換性がありません。',
          solution: 'モデルファイルを再ダウンロードしてください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['MODEL_005', 'MODEL_006'],
          prevention: 'GPUメモリと温度を監視してください。適切な学習パラメータを使用し、正規化画像を活用してください。',
        },
        {
          code: 'MODEL_005',
          message: 'バッチサイズ超過が発生しました (MODEL_005).',
          severity: 'critical',
          category: 'D. モデルと生成',
          location: 'ページ：TTS → 領域：キャンバス',
          cause: 'CUDAドライバが古くなっています。',
          solution: 'CUDAドライバを更新してください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['MODEL_006', 'MODEL_007'],
          prevention: 'GPUメモリと温度を監視してください。適切な学習パラメータを使用し、正規化画像を活用してください。',
        },
        {
          code: 'MODEL_006',
          message: '学習率過大が発生しました (MODEL_006).',
          severity: 'error',
          category: 'D. モデルと生成',
          location: 'ページ：paper2gal → 領域：ボタン',
          cause: 'GPUメモリが不足しています。',
          solution: 'バッチサイズを小さくしてください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['MODEL_007', 'MODEL_008'],
          prevention: 'GPUメモリと温度を監視してください。適切な学習パラメータを使用し、正規化画像を活用してください。',
        },
        {
          code: 'MODEL_007',
          message: '過学習が発生しました (MODEL_007).',
          severity: 'warning',
          category: 'D. モデルと生成',
          location: 'ページ：画像変換 → 領域：入力',
          cause: 'モデルファイルが破損しています。',
          solution: 'VRAMを確保するために他のプログラムを閉じてください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['MODEL_008', 'MODEL_009'],
          prevention: 'GPUメモリと温度を監視してください。適切な学習パラメータを使用し、正規化画像を活用してください。',
        },
        {
          code: 'MODEL_008',
          message: '収束失敗が発生しました (MODEL_008).',
          severity: 'info',
          category: 'D. モデルと生成',
          location: 'ページ：設定 → 領域：出力',
          cause: '学習パラメータが不適切です。',
          solution: '学習率を調整してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['MODEL_009', 'MODEL_010'],
          prevention: 'GPUメモリと温度を監視してください。適切な学習パラメータを使用し、正規化画像を活用してください。',
        },
        {
          code: 'MODEL_009',
          message: '推論タイムアウトが発生しました (MODEL_009).',
          severity: 'critical',
          category: 'D. モデルと生成',
          location: 'ページ：オーディオ → 領域：パネル',
          cause: 'ベースモデルバージョンが互換性がありません。',
          solution: 'モデルファイルを再ダウンロードしてください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['MODEL_010', 'MODEL_001'],
          prevention: 'GPUメモリと温度を監視してください。適切な学習パラメータを使用し、正規化画像を活用してください。',
        },
        {
          code: 'MODEL_010',
          message: 'モデルバージョン不一致が発生しました (MODEL_010).',
          severity: 'error',
          category: 'D. モデルと生成',
          location: 'ページ：UI → 領域：キャンバス',
          cause: 'CUDAドライバが古くなっています。',
          solution: 'CUDAドライバを更新してください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['MODEL_001', 'MODEL_002'],
          prevention: 'GPUメモリと温度を監視してください。適切な学習パラメータを使用し、正規化画像を活用してください。',
        },
        {
          code: 'MODEL_011',
          message: 'モデル読み込み失敗が発生しました (MODEL_011).',
          severity: 'warning',
          category: 'D. モデルと生成',
          location: 'ページ：顔作成 → 領域：ボタン',
          cause: 'GPUメモリが不足しています。',
          solution: 'バッチサイズを小さくしてください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['MODEL_002', 'MODEL_003'],
          prevention: 'GPUメモリと温度を監視してください。適切な学習パラメータを使用し、正規化画像を活用してください。',
        },
        {
          code: 'MODEL_012',
          message: 'VRAM不足が発生しました (MODEL_012).',
          severity: 'info',
          category: 'D. モデルと生成',
          location: 'ページ：スタイル変換 → 領域：入力',
          cause: 'モデルファイルが破損しています。',
          solution: 'VRAMを確保するために他のプログラムを閉じてください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['MODEL_003', 'MODEL_004'],
          prevention: 'GPUメモリと温度を監視してください。適切な学習パラメータを使用し、正規化画像を活用してください。',
        },
        {
          code: 'MODEL_013',
          message: 'CUDAエラーが発生しました (MODEL_013).',
          severity: 'critical',
          category: 'D. モデルと生成',
          location: 'ページ：プロンプト → 領域：出力',
          cause: '学習パラメータが不適切です。',
          solution: '学習率を調整してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['MODEL_004', 'MODEL_005'],
          prevention: 'GPUメモリと温度を監視してください。適切な学習パラメータを使用し、正規化画像を活用してください。',
        },
        {
          code: 'MODEL_014',
          message: 'チェックポイント破損が発生しました (MODEL_014).',
          severity: 'error',
          category: 'D. モデルと生成',
          location: 'ページ：LLM → 領域：パネル',
          cause: 'ベースモデルバージョンが互換性がありません。',
          solution: 'モデルファイルを再ダウンロードしてください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['MODEL_005', 'MODEL_006'],
          prevention: 'GPUメモリと温度を監視してください。適切な学習パラメータを使用し、正規化画像を活用してください。',
        },
        {
          code: 'MODEL_015',
          message: 'バッチサイズ超過が発生しました (MODEL_015).',
          severity: 'warning',
          category: 'D. モデルと生成',
          location: 'ページ：TTS → 領域：キャンバス',
          cause: 'CUDAドライバが古くなっています。',
          solution: 'CUDAドライバを更新してください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['MODEL_006', 'MODEL_007'],
          prevention: 'GPUメモリと温度を監視してください。適切な学習パラメータを使用し、正規化画像を活用してください。',
        },
        {
          code: 'MODEL_016',
          message: '学習率過大が発生しました (MODEL_016).',
          severity: 'info',
          category: 'D. モデルと生成',
          location: 'ページ：paper2gal → 領域：ボタン',
          cause: 'GPUメモリが不足しています。',
          solution: 'バッチサイズを小さくしてください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['MODEL_007', 'MODEL_008'],
          prevention: 'GPUメモリと温度を監視してください。適切な学習パラメータを使用し、正規化画像を活用してください。',
        },
        {
          code: 'MODEL_017',
          message: '過学習が発生しました (MODEL_017).',
          severity: 'critical',
          category: 'D. モデルと生成',
          location: 'ページ：画像変換 → 領域：入力',
          cause: 'モデルファイルが破損しています。',
          solution: 'VRAMを確保するために他のプログラムを閉じてください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['MODEL_008', 'MODEL_009'],
          prevention: 'GPUメモリと温度を監視してください。適切な学習パラメータを使用し、正規化画像を活用してください。',
        },
        {
          code: 'MODEL_018',
          message: '収束失敗が発生しました (MODEL_018).',
          severity: 'error',
          category: 'D. モデルと生成',
          location: 'ページ：設定 → 領域：出力',
          cause: '学習パラメータが不適切です。',
          solution: '学習率を調整してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['MODEL_009', 'MODEL_010'],
          prevention: 'GPUメモリと温度を監視してください。適切な学習パラメータを使用し、正規化画像を活用してください。',
        },
        {
          code: 'MODEL_019',
          message: '推論タイムアウトが発生しました (MODEL_019).',
          severity: 'warning',
          category: 'D. モデルと生成',
          location: 'ページ：オーディオ → 領域：パネル',
          cause: 'ベースモデルバージョンが互換性がありません。',
          solution: 'モデルファイルを再ダウンロードしてください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['MODEL_010', 'MODEL_001'],
          prevention: 'GPUメモリと温度を監視してください。適切な学習パラメータを使用し、正規化画像を活用してください。',
        },
        {
          code: 'MODEL_020',
          message: 'モデルバージョン不一致が発生しました (MODEL_020).',
          severity: 'info',
          category: 'D. モデルと生成',
          location: 'ページ：UI → 領域：キャンバス',
          cause: 'CUDAドライバが古くなっています。',
          solution: 'CUDAドライバを更新してください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['MODEL_001', 'MODEL_002'],
          prevention: 'GPUメモリと温度を監視してください。適切な学習パラメータを使用し、正規化画像を活用してください。',
        },
        {
          code: 'MODEL_021',
          message: 'モデル読み込み失敗が発生しました (MODEL_021).',
          severity: 'critical',
          category: 'D. モデルと生成',
          location: 'ページ：顔作成 → 領域：ボタン',
          cause: 'GPUメモリが不足しています。',
          solution: 'バッチサイズを小さくしてください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['MODEL_002', 'MODEL_003'],
          prevention: 'GPUメモリと温度を監視してください。適切な学習パラメータを使用し、正規化画像を活用してください。',
        },
        {
          code: 'MODEL_022',
          message: 'VRAM不足が発生しました (MODEL_022).',
          severity: 'error',
          category: 'D. モデルと生成',
          location: 'ページ：スタイル変換 → 領域：入力',
          cause: 'モデルファイルが破損しています。',
          solution: 'VRAMを確保するために他のプログラムを閉じてください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['MODEL_003', 'MODEL_004'],
          prevention: 'GPUメモリと温度を監視してください。適切な学習パラメータを使用し、正規化画像を活用してください。',
        },
        {
          code: 'MODEL_023',
          message: 'CUDAエラーが発生しました (MODEL_023).',
          severity: 'warning',
          category: 'D. モデルと生成',
          location: 'ページ：プロンプト → 領域：出力',
          cause: '学習パラメータが不適切です。',
          solution: '学習率を調整してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['MODEL_004', 'MODEL_005'],
          prevention: 'GPUメモリと温度を監視してください。適切な学習パラメータを使用し、正規化画像を活用してください。',
        },
        {
          code: 'MODEL_024',
          message: 'チェックポイント破損が発生しました (MODEL_024).',
          severity: 'info',
          category: 'D. モデルと生成',
          location: 'ページ：LLM → 領域：パネル',
          cause: 'ベースモデルバージョンが互換性がありません。',
          solution: 'モデルファイルを再ダウンロードしてください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['MODEL_005', 'MODEL_006'],
          prevention: 'GPUメモリと温度を監視してください。適切な学習パラメータを使用し、正規化画像を活用してください。',
        },
        {
          code: 'MODEL_025',
          message: 'バッチサイズ超過が発生しました (MODEL_025).',
          severity: 'critical',
          category: 'D. モデルと生成',
          location: 'ページ：TTS → 領域：キャンバス',
          cause: 'CUDAドライバが古くなっています。',
          solution: 'CUDAドライバを更新してください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['MODEL_006', 'MODEL_007'],
          prevention: 'GPUメモリと温度を監視してください。適切な学習パラメータを使用し、正規化画像を活用してください。',
        },],
    },
    {
      id: 'E',
      name: 'E. ワークフローと変換',
      description: 'ワークフローの実行、画像変換、ステップ失敗、ワークフロー取消などに関するエラーです。',
      errors: [
        {
          code: 'P2G_WORKFLOW_ERROR',
          message: 'Paper2Gal ワークフローの実行に失敗',
          severity: 'error',
          category: 'E. ワークフローと変換',
          location: 'ページ：paper2gal → 領域：エラーパネル',
          cause: 'ワークフローのステップが失敗しました。入力検証失敗、モデル利用不可、API Key の有効期限切れ、生成コンテンツが安全フィルターに遮断された、ネットワーク切断などが原因です。',
          solution: 'エラー詳細に従って順番にトラブルシューティングします。',
          steps: ['エラーパネルを展開し、「読みやすいエラー情報」「考えられる原因」「修正ヒント」を読む', 'アップロードした画像が有効な PNG/JPG であることを確認', 'ネットワーク接続を確認', '「コンテンツポリシー違反」と表示される場合、プロンプト上書きの敏感な言葉を修正', 'バックエンドサービスが正常に動作していることを確認', '失敗したステップはステップカードで「やり直し」', 'ワークフロー全体が失敗した場合は「リセット」'],
          relatedCodes: ['API_KEY_MISSING', 'API_KEY_EXPIRED', 'MODEL_NOT_FOUND', 'PROMPT_BLOCKED'],
          prevention: 'ワークフローを開始する前に、画像が有効な PNG/JPG であること、ネットワーク接続が安定していること、プロンプト上書きに敏感な言葉がないことを確認してください。',
        },
        {
          code: 'STYLE_TRANSFER_REQUEST_FAILED',
          message: '画風変換リクエストが失敗',
          severity: 'error',
          category: 'E. ワークフローと変換',
          location: 'ページ：画風変換 → 領域：エラーパネル',
          cause: 'バックエンド API リクエストが失敗しました。ネットワーク切断、無効な API Key、モデル利用不可、またはサーバー内部エラーが原因です。',
          solution: 'エラー詳細に基づいてトラブルシューティングします。',
          steps: ['エラーパネルを展開して詳細なエラー情報を確認', '401 の場合：API Key を確認', '404 の場合：モデルを確認', '429 の場合：待ってから再試行', '500/502/503 の場合：バックエンドを確認', 'ネットワークエラーの場合：ネットワーク接続を確認'],
          relatedCodes: ['API_KEY_MISSING', 'API_KEY_EXPIRED', 'MODEL_NOT_FOUND', 'BACKEND_UNAVAILABLE'],
          prevention: '変換を開始する前に、API Key が有効であること、ネットワーク接続が正常であること、モデルが利用可能であることを確認してください。',
        },
      
        {
          code: 'WORKFLOW_001',
          message: '変換失敗が発生しました (WORKFLOW_001).',
          severity: 'critical',
          category: 'E. ワークフローと変換',
          location: 'ページ：顔作成 → 領域：ボタン',
          cause: '入力ファイルが破損しています。',
          solution: '入力ファイルを確認して再試行してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['WORKFLOW_002', 'WORKFLOW_003'],
          prevention: '変換前にファイル形式と互換性を確認してください。十分なディスク容量を確保し、ワークフローを段階的にテストしてください。',
        },
        {
          code: 'WORKFLOW_002',
          message: 'コーデック未対応が発生しました (WORKFLOW_002).',
          severity: 'error',
          category: 'E. ワークフローと変換',
          location: 'ページ：スタイル変換 → 領域：入力',
          cause: '変換コーデックを使用できません。',
          solution: '別の出力形式を選択してください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['WORKFLOW_003', 'WORKFLOW_004'],
          prevention: '変換前にファイル形式と互換性を確認してください。十分なディスク容量を確保し、ワークフローを段階的にテストしてください。',
        },
        {
          code: 'WORKFLOW_003',
          message: 'フレーム抽出エラーが発生しました (WORKFLOW_003).',
          severity: 'warning',
          category: 'E. ワークフローと変換',
          location: 'ページ：プロンプト → 領域：出力',
          cause: 'ディスク容量が不足して出力できません。',
          solution: 'ディスク容量を確保してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['WORKFLOW_004', 'WORKFLOW_005'],
          prevention: '変換前にファイル形式と互換性を確認してください。十分なディスク容量を確保し、ワークフローを段階的にテストしてください。',
        },
        {
          code: 'WORKFLOW_004',
          message: '圧縮破損が発生しました (WORKFLOW_004).',
          severity: 'info',
          category: 'E. ワークフローと変換',
          location: 'ページ：LLM → 領域：パネル',
          cause: 'ワークフローステップ間のデータ形式が一致しません。',
          solution: 'ワークフローステップを再構成してください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['WORKFLOW_005', 'WORKFLOW_006'],
          prevention: '変換前にファイル形式と互換性を確認してください。十分なディスク容量を確保し、ワークフローを段階的にテストしてください。',
        },
        {
          code: 'WORKFLOW_005',
          message: 'ワークフロー中断が発生しました (WORKFLOW_005).',
          severity: 'critical',
          category: 'E. ワークフローと変換',
          location: 'ページ：TTS → 領域：キャンバス',
          cause: '必須依存ライブラリが欠落しています。',
          solution: '欠落しているライブラリをインストールしてください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['WORKFLOW_006', 'WORKFLOW_007'],
          prevention: '変換前にファイル形式と互換性を確認してください。十分なディスク容量を確保し、ワークフローを段階的にテストしてください。',
        },
        {
          code: 'WORKFLOW_006',
          message: 'ステップ失敗が発生しました (WORKFLOW_006).',
          severity: 'error',
          category: 'E. ワークフローと変換',
          location: 'ページ：paper2gal → 領域：ボタン',
          cause: '入力ファイルが破損しています。',
          solution: '入力ファイルを確認して再試行してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['WORKFLOW_007', 'WORKFLOW_008'],
          prevention: '変換前にファイル形式と互換性を確認してください。十分なディスク容量を確保し、ワークフローを段階的にテストしてください。',
        },
        {
          code: 'WORKFLOW_007',
          message: '依存関係欠落が発生しました (WORKFLOW_007).',
          severity: 'warning',
          category: 'E. ワークフローと変換',
          location: 'ページ：画像変換 → 領域：入力',
          cause: '変換コーデックを使用できません。',
          solution: '別の出力形式を選択してください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['WORKFLOW_008', 'WORKFLOW_009'],
          prevention: '変換前にファイル形式と互換性を確認してください。十分なディスク容量を確保し、ワークフローを段階的にテストしてください。',
        },
        {
          code: 'WORKFLOW_008',
          message: '出力パスエラーが発生しました (WORKFLOW_008).',
          severity: 'info',
          category: 'E. ワークフローと変換',
          location: 'ページ：設定 → 領域：出力',
          cause: 'ディスク容量が不足して出力できません。',
          solution: 'ディスク容量を確保してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['WORKFLOW_009', 'WORKFLOW_010'],
          prevention: '変換前にファイル形式と互換性を確認してください。十分なディスク容量を確保し、ワークフローを段階的にテストしてください。',
        },
        {
          code: 'WORKFLOW_009',
          message: '一時ファイル削除失敗が発生しました (WORKFLOW_009).',
          severity: 'critical',
          category: 'E. ワークフローと変換',
          location: 'ページ：オーディオ → 領域：パネル',
          cause: 'ワークフローステップ間のデータ形式が一致しません。',
          solution: 'ワークフローステップを再構成してください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['WORKFLOW_010', 'WORKFLOW_001'],
          prevention: '変換前にファイル形式と互換性を確認してください。十分なディスク容量を確保し、ワークフローを段階的にテストしてください。',
        },
        {
          code: 'WORKFLOW_010',
          message: '形式互換性なしが発生しました (WORKFLOW_010).',
          severity: 'error',
          category: 'E. ワークフローと変換',
          location: 'ページ：UI → 領域：キャンバス',
          cause: '必須依存ライブラリが欠落しています。',
          solution: '欠落しているライブラリをインストールしてください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['WORKFLOW_001', 'WORKFLOW_002'],
          prevention: '変換前にファイル形式と互換性を確認してください。十分なディスク容量を確保し、ワークフローを段階的にテストしてください。',
        },
        {
          code: 'WORKFLOW_011',
          message: '変換失敗が発生しました (WORKFLOW_011).',
          severity: 'warning',
          category: 'E. ワークフローと変換',
          location: 'ページ：顔作成 → 領域：ボタン',
          cause: '入力ファイルが破損しています。',
          solution: '入力ファイルを確認して再試行してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['WORKFLOW_002', 'WORKFLOW_003'],
          prevention: '変換前にファイル形式と互換性を確認してください。十分なディスク容量を確保し、ワークフローを段階的にテストしてください。',
        },
        {
          code: 'WORKFLOW_012',
          message: 'コーデック未対応が発生しました (WORKFLOW_012).',
          severity: 'info',
          category: 'E. ワークフローと変換',
          location: 'ページ：スタイル変換 → 領域：入力',
          cause: '変換コーデックを使用できません。',
          solution: '別の出力形式を選択してください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['WORKFLOW_003', 'WORKFLOW_004'],
          prevention: '変換前にファイル形式と互換性を確認してください。十分なディスク容量を確保し、ワークフローを段階的にテストしてください。',
        },
        {
          code: 'WORKFLOW_013',
          message: 'フレーム抽出エラーが発生しました (WORKFLOW_013).',
          severity: 'critical',
          category: 'E. ワークフローと変換',
          location: 'ページ：プロンプト → 領域：出力',
          cause: 'ディスク容量が不足して出力できません。',
          solution: 'ディスク容量を確保してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['WORKFLOW_004', 'WORKFLOW_005'],
          prevention: '変換前にファイル形式と互換性を確認してください。十分なディスク容量を確保し、ワークフローを段階的にテストしてください。',
        },
        {
          code: 'WORKFLOW_014',
          message: '圧縮破損が発生しました (WORKFLOW_014).',
          severity: 'error',
          category: 'E. ワークフローと変換',
          location: 'ページ：LLM → 領域：パネル',
          cause: 'ワークフローステップ間のデータ形式が一致しません。',
          solution: 'ワークフローステップを再構成してください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['WORKFLOW_005', 'WORKFLOW_006'],
          prevention: '変換前にファイル形式と互換性を確認してください。十分なディスク容量を確保し、ワークフローを段階的にテストしてください。',
        },
        {
          code: 'WORKFLOW_015',
          message: 'ワークフロー中断が発生しました (WORKFLOW_015).',
          severity: 'warning',
          category: 'E. ワークフローと変換',
          location: 'ページ：TTS → 領域：キャンバス',
          cause: '必須依存ライブラリが欠落しています。',
          solution: '欠落しているライブラリをインストールしてください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['WORKFLOW_006', 'WORKFLOW_007'],
          prevention: '変換前にファイル形式と互換性を確認してください。十分なディスク容量を確保し、ワークフローを段階的にテストしてください。',
        },
        {
          code: 'WORKFLOW_016',
          message: 'ステップ失敗が発生しました (WORKFLOW_016).',
          severity: 'info',
          category: 'E. ワークフローと変換',
          location: 'ページ：paper2gal → 領域：ボタン',
          cause: '入力ファイルが破損しています。',
          solution: '入力ファイルを確認して再試行してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['WORKFLOW_007', 'WORKFLOW_008'],
          prevention: '変換前にファイル形式と互換性を確認してください。十分なディスク容量を確保し、ワークフローを段階的にテストしてください。',
        },
        {
          code: 'WORKFLOW_017',
          message: '依存関係欠落が発生しました (WORKFLOW_017).',
          severity: 'critical',
          category: 'E. ワークフローと変換',
          location: 'ページ：画像変換 → 領域：入力',
          cause: '変換コーデックを使用できません。',
          solution: '別の出力形式を選択してください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['WORKFLOW_008', 'WORKFLOW_009'],
          prevention: '変換前にファイル形式と互換性を確認してください。十分なディスク容量を確保し、ワークフローを段階的にテストしてください。',
        },
        {
          code: 'WORKFLOW_018',
          message: '出力パスエラーが発生しました (WORKFLOW_018).',
          severity: 'error',
          category: 'E. ワークフローと変換',
          location: 'ページ：設定 → 領域：出力',
          cause: 'ディスク容量が不足して出力できません。',
          solution: 'ディスク容量を確保してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['WORKFLOW_009', 'WORKFLOW_010'],
          prevention: '変換前にファイル形式と互換性を確認してください。十分なディスク容量を確保し、ワークフローを段階的にテストしてください。',
        },
        {
          code: 'WORKFLOW_019',
          message: '一時ファイル削除失敗が発生しました (WORKFLOW_019).',
          severity: 'warning',
          category: 'E. ワークフローと変換',
          location: 'ページ：オーディオ → 領域：パネル',
          cause: 'ワークフローステップ間のデータ形式が一致しません。',
          solution: 'ワークフローステップを再構成してください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['WORKFLOW_010', 'WORKFLOW_001'],
          prevention: '変換前にファイル形式と互換性を確認してください。十分なディスク容量を確保し、ワークフローを段階的にテストしてください。',
        },
        {
          code: 'WORKFLOW_020',
          message: '形式互換性なしが発生しました (WORKFLOW_020).',
          severity: 'info',
          category: 'E. ワークフローと変換',
          location: 'ページ：UI → 領域：キャンバス',
          cause: '必須依存ライブラリが欠落しています。',
          solution: '欠落しているライブラリをインストールしてください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['WORKFLOW_001', 'WORKFLOW_002'],
          prevention: '変換前にファイル形式と互換性を確認してください。十分なディスク容量を確保し、ワークフローを段階的にテストしてください。',
        },
        {
          code: 'WORKFLOW_021',
          message: '変換失敗が発生しました (WORKFLOW_021).',
          severity: 'critical',
          category: 'E. ワークフローと変換',
          location: 'ページ：顔作成 → 領域：ボタン',
          cause: '入力ファイルが破損しています。',
          solution: '入力ファイルを確認して再試行してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['WORKFLOW_002', 'WORKFLOW_003'],
          prevention: '変換前にファイル形式と互換性を確認してください。十分なディスク容量を確保し、ワークフローを段階的にテストしてください。',
        },
        {
          code: 'WORKFLOW_022',
          message: 'コーデック未対応が発生しました (WORKFLOW_022).',
          severity: 'error',
          category: 'E. ワークフローと変換',
          location: 'ページ：スタイル変換 → 領域：入力',
          cause: '変換コーデックを使用できません。',
          solution: '別の出力形式を選択してください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['WORKFLOW_003', 'WORKFLOW_004'],
          prevention: '変換前にファイル形式と互換性を確認してください。十分なディスク容量を確保し、ワークフローを段階的にテストしてください。',
        },
        {
          code: 'WORKFLOW_023',
          message: 'フレーム抽出エラーが発生しました (WORKFLOW_023).',
          severity: 'warning',
          category: 'E. ワークフローと変換',
          location: 'ページ：プロンプト → 領域：出力',
          cause: 'ディスク容量が不足して出力できません。',
          solution: 'ディスク容量を確保してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['WORKFLOW_004', 'WORKFLOW_005'],
          prevention: '変換前にファイル形式と互換性を確認してください。十分なディスク容量を確保し、ワークフローを段階的にテストしてください。',
        },
        {
          code: 'WORKFLOW_024',
          message: '圧縮破損が発生しました (WORKFLOW_024).',
          severity: 'info',
          category: 'E. ワークフローと変換',
          location: 'ページ：LLM → 領域：パネル',
          cause: 'ワークフローステップ間のデータ形式が一致しません。',
          solution: 'ワークフローステップを再構成してください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['WORKFLOW_005', 'WORKFLOW_006'],
          prevention: '変換前にファイル形式と互換性を確認してください。十分なディスク容量を確保し、ワークフローを段階的にテストしてください。',
        },
        {
          code: 'WORKFLOW_025',
          message: 'ワークフロー中断が発生しました (WORKFLOW_025).',
          severity: 'critical',
          category: 'E. ワークフローと変換',
          location: 'ページ：TTS → 領域：キャンバス',
          cause: '必須依存ライブラリが欠落しています。',
          solution: '欠落しているライブラリをインストールしてください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['WORKFLOW_006', 'WORKFLOW_007'],
          prevention: '変換前にファイル形式と互換性を確認してください。十分なディスク容量を確保し、ワークフローを段階的にテストしてください。',
        },],
    },
    {
      id: 'F',
      name: 'F. システムと権限',
      description: 'ブラウザの互換性、メモリ不足、権限制限、エクスポート失敗などのシステムレベルの問題です。',
      errors: [
        {
          code: 'DEVICE_MEMORY_LOW',
          message: 'ブラウザタブがクラッシュしたり、フリーズしたり、応答しなくなったりする',
          severity: 'critical',
          category: 'F. システムと権限',
          location: 'ページ：任意のツール → 領域：ページ全体',
          cause: 'デバイスのメモリが不足しており、ブラウザが強制的にタブプロセスを終了しました。通常、超大きな画像や大量のデータを処理する際に発生します。',
          solution: '他のタブを閉じたり、データ規模を縮小したり、よりメモリの多いデバイスを使用したりします。',
          steps: ['現在の作業を保存（ある場合）', '他の未使用のブラウザタブを閉じる', '画像サイズまたはデータ量を縮小', 'ブラウザを再起動して再試行', '問題が続く場合はよりメモリの多いデバイスを使用'],
          relatedCodes: ['FILE_TOO_LARGE'],
          prevention: '大きなファイルを処理する前に他のブラウザタブを閉じてください。画像の最大辺を 2048 以下に縮小してください。',
        },
        {
          code: 'EXPORT_FAILED',
          message: 'エクスポートボタンをクリックしても反応しない',
          severity: 'error',
          category: 'F. システムと権限',
          location: 'ページ：任意のツール → 領域：エクスポートボタン',
          cause: 'ブラウザがダウンロードポップアップをブロックしたか、コンテンツが大きすぎて Blob の生成に失敗しました。',
          solution: 'ブラウザのダウンロード設定を確認するか、バッチでエクスポートします。',
          steps: ['ブラウザがポップアップをブロックしていないか確認（アドレスバーの右側にポップアップブロックのヒントがあるか確認）', '現在のウェブサイトのポップアップを許可', 'コンテンツに多くの画像が含まれる場合、エクスポート前に一部の画像を削除', '「コピー」機能を一時的な代替案として使用'],
          relatedCodes: ['DEVICE_MEMORY_LOW'],
          prevention: 'ブラウザのポップアップを許可してください。ドキュメントが大きすぎる場合は、エクスポート前に一部の画像を削除してください。',
        },
      
        {
          code: 'SYSTEM_001',
          message: 'メモリ不足が発生しました (SYSTEM_001).',
          severity: 'critical',
          category: 'F. システムと権限',
          location: 'ページ：顔作成 → 領域：ボタン',
          cause: 'システムメモリが不足しています。',
          solution: '不要なプログラムを閉じてメモリを確保してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['SYSTEM_002', 'SYSTEM_003'],
          prevention: 'システムリソース使用量を監視し、余裕スペースを維持してください。必要な権限を事前に設定してください。',
        },
        {
          code: 'SYSTEM_002',
          message: 'ディスク容量不足が発生しました (SYSTEM_002).',
          severity: 'error',
          category: 'F. システムと権限',
          location: 'ページ：スタイル変換 → 領域：入力',
          cause: 'ディスク容量が不足しています。',
          solution: 'ディスク容量を整理してください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['SYSTEM_003', 'SYSTEM_004'],
          prevention: 'システムリソース使用量を監視し、余裕スペースを維持してください。必要な権限を事前に設定してください。',
        },
        {
          code: 'SYSTEM_003',
          message: '権限拒否が発生しました (SYSTEM_003).',
          severity: 'warning',
          category: 'F. システムと権限',
          location: 'ページ：プロンプト → 領域：出力',
          cause: '現在のユーザーに必要な権限がありません。',
          solution: '管理者権限で実行してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['SYSTEM_004', 'SYSTEM_005'],
          prevention: 'システムリソース使用量を監視し、余裕スペースを維持してください。必要な権限を事前に設定してください。',
        },
        {
          code: 'SYSTEM_004',
          message: 'プロセス衝突が発生しました (SYSTEM_004).',
          severity: 'info',
          category: 'F. システムと権限',
          location: 'ページ：LLM → 領域：パネル',
          cause: 'システムリソース制限に達しました。',
          solution: 'システムリソース制限を増やしてください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['SYSTEM_005', 'SYSTEM_006'],
          prevention: 'システムリソース使用量を監視し、余裕スペースを維持してください。必要な権限を事前に設定してください。',
        },
        {
          code: 'SYSTEM_005',
          message: 'セマフォ超過が発生しました (SYSTEM_005).',
          severity: 'critical',
          category: 'F. システムと権限',
          location: 'ページ：TTS → 領域：キャンバス',
          cause: 'オペレーティングシステムバージョンがサポートされていません。',
          solution: 'オペレーティングシステムを更新してください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['SYSTEM_006', 'SYSTEM_007'],
          prevention: 'システムリソース使用量を監視し、余裕スペースを維持してください。必要な権限を事前に設定してください。',
        },
        {
          code: 'SYSTEM_006',
          message: 'システムコール失敗が発生しました (SYSTEM_006).',
          severity: 'error',
          category: 'F. システムと権限',
          location: 'ページ：paper2gal → 領域：ボタン',
          cause: 'システムメモリが不足しています。',
          solution: '不要なプログラムを閉じてメモリを確保してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['SYSTEM_007', 'SYSTEM_008'],
          prevention: 'システムリソース使用量を監視し、余裕スペースを維持してください。必要な権限を事前に設定してください。',
        },
        {
          code: 'SYSTEM_007',
          message: 'カーネルバージョン不一致が発生しました (SYSTEM_007).',
          severity: 'warning',
          category: 'F. システムと権限',
          location: 'ページ：画像変換 → 領域：入力',
          cause: 'ディスク容量が不足しています。',
          solution: 'ディスク容量を整理してください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['SYSTEM_008', 'SYSTEM_009'],
          prevention: 'システムリソース使用量を監視し、余裕スペースを維持してください。必要な権限を事前に設定してください。',
        },
        {
          code: 'SYSTEM_008',
          message: 'SELinux遮断が発生しました (SYSTEM_008).',
          severity: 'info',
          category: 'F. システムと権限',
          location: 'ページ：設定 → 領域：出力',
          cause: '現在のユーザーに必要な権限がありません。',
          solution: '管理者権限で実行してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['SYSTEM_009', 'SYSTEM_010'],
          prevention: 'システムリソース使用量を監視し、余裕スペースを維持してください。必要な権限を事前に設定してください。',
        },
        {
          code: 'SYSTEM_009',
          message: 'cgroups制限が発生しました (SYSTEM_009).',
          severity: 'critical',
          category: 'F. システムと権限',
          location: 'ページ：オーディオ → 領域：パネル',
          cause: 'システムリソース制限に達しました。',
          solution: 'システムリソース制限を増やしてください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['SYSTEM_010', 'SYSTEM_001'],
          prevention: 'システムリソース使用量を監視し、余裕スペースを維持してください。必要な権限を事前に設定してください。',
        },
        {
          code: 'SYSTEM_010',
          message: 'oom_killer発動が発生しました (SYSTEM_010).',
          severity: 'error',
          category: 'F. システムと権限',
          location: 'ページ：UI → 領域：キャンバス',
          cause: 'オペレーティングシステムバージョンがサポートされていません。',
          solution: 'オペレーティングシステムを更新してください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['SYSTEM_001', 'SYSTEM_002'],
          prevention: 'システムリソース使用量を監視し、余裕スペースを維持してください。必要な権限を事前に設定してください。',
        },
        {
          code: 'SYSTEM_011',
          message: 'メモリ不足が発生しました (SYSTEM_011).',
          severity: 'warning',
          category: 'F. システムと権限',
          location: 'ページ：顔作成 → 領域：ボタン',
          cause: 'システムメモリが不足しています。',
          solution: '不要なプログラムを閉じてメモリを確保してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['SYSTEM_002', 'SYSTEM_003'],
          prevention: 'システムリソース使用量を監視し、余裕スペースを維持してください。必要な権限を事前に設定してください。',
        },
        {
          code: 'SYSTEM_012',
          message: 'ディスク容量不足が発生しました (SYSTEM_012).',
          severity: 'info',
          category: 'F. システムと権限',
          location: 'ページ：スタイル変換 → 領域：入力',
          cause: 'ディスク容量が不足しています。',
          solution: 'ディスク容量を整理してください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['SYSTEM_003', 'SYSTEM_004'],
          prevention: 'システムリソース使用量を監視し、余裕スペースを維持してください。必要な権限を事前に設定してください。',
        },
        {
          code: 'SYSTEM_013',
          message: '権限拒否が発生しました (SYSTEM_013).',
          severity: 'critical',
          category: 'F. システムと権限',
          location: 'ページ：プロンプト → 領域：出力',
          cause: '現在のユーザーに必要な権限がありません。',
          solution: '管理者権限で実行してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['SYSTEM_004', 'SYSTEM_005'],
          prevention: 'システムリソース使用量を監視し、余裕スペースを維持してください。必要な権限を事前に設定してください。',
        },
        {
          code: 'SYSTEM_014',
          message: 'プロセス衝突が発生しました (SYSTEM_014).',
          severity: 'error',
          category: 'F. システムと権限',
          location: 'ページ：LLM → 領域：パネル',
          cause: 'システムリソース制限に達しました。',
          solution: 'システムリソース制限を増やしてください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['SYSTEM_005', 'SYSTEM_006'],
          prevention: 'システムリソース使用量を監視し、余裕スペースを維持してください。必要な権限を事前に設定してください。',
        },
        {
          code: 'SYSTEM_015',
          message: 'セマフォ超過が発生しました (SYSTEM_015).',
          severity: 'warning',
          category: 'F. システムと権限',
          location: 'ページ：TTS → 領域：キャンバス',
          cause: 'オペレーティングシステムバージョンがサポートされていません。',
          solution: 'オペレーティングシステムを更新してください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['SYSTEM_006', 'SYSTEM_007'],
          prevention: 'システムリソース使用量を監視し、余裕スペースを維持してください。必要な権限を事前に設定してください。',
        },
        {
          code: 'SYSTEM_016',
          message: 'システムコール失敗が発生しました (SYSTEM_016).',
          severity: 'info',
          category: 'F. システムと権限',
          location: 'ページ：paper2gal → 領域：ボタン',
          cause: 'システムメモリが不足しています。',
          solution: '不要なプログラムを閉じてメモリを確保してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['SYSTEM_007', 'SYSTEM_008'],
          prevention: 'システムリソース使用量を監視し、余裕スペースを維持してください。必要な権限を事前に設定してください。',
        },
        {
          code: 'SYSTEM_017',
          message: 'カーネルバージョン不一致が発生しました (SYSTEM_017).',
          severity: 'critical',
          category: 'F. システムと権限',
          location: 'ページ：画像変換 → 領域：入力',
          cause: 'ディスク容量が不足しています。',
          solution: 'ディスク容量を整理してください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['SYSTEM_008', 'SYSTEM_009'],
          prevention: 'システムリソース使用量を監視し、余裕スペースを維持してください。必要な権限を事前に設定してください。',
        },
        {
          code: 'SYSTEM_018',
          message: 'SELinux遮断が発生しました (SYSTEM_018).',
          severity: 'error',
          category: 'F. システムと権限',
          location: 'ページ：設定 → 領域：出力',
          cause: '現在のユーザーに必要な権限がありません。',
          solution: '管理者権限で実行してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['SYSTEM_009', 'SYSTEM_010'],
          prevention: 'システムリソース使用量を監視し、余裕スペースを維持してください。必要な権限を事前に設定してください。',
        },
        {
          code: 'SYSTEM_019',
          message: 'cgroups制限が発生しました (SYSTEM_019).',
          severity: 'warning',
          category: 'F. システムと権限',
          location: 'ページ：オーディオ → 領域：パネル',
          cause: 'システムリソース制限に達しました。',
          solution: 'システムリソース制限を増やしてください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['SYSTEM_010', 'SYSTEM_001'],
          prevention: 'システムリソース使用量を監視し、余裕スペースを維持してください。必要な権限を事前に設定してください。',
        },
        {
          code: 'SYSTEM_020',
          message: 'oom_killer発動が発生しました (SYSTEM_020).',
          severity: 'info',
          category: 'F. システムと権限',
          location: 'ページ：UI → 領域：キャンバス',
          cause: 'オペレーティングシステムバージョンがサポートされていません。',
          solution: 'オペレーティングシステムを更新してください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['SYSTEM_001', 'SYSTEM_002'],
          prevention: 'システムリソース使用量を監視し、余裕スペースを維持してください。必要な権限を事前に設定してください。',
        },
        {
          code: 'SYSTEM_021',
          message: 'メモリ不足が発生しました (SYSTEM_021).',
          severity: 'critical',
          category: 'F. システムと権限',
          location: 'ページ：顔作成 → 領域：ボタン',
          cause: 'システムメモリが不足しています。',
          solution: '不要なプログラムを閉じてメモリを確保してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['SYSTEM_002', 'SYSTEM_003'],
          prevention: 'システムリソース使用量を監視し、余裕スペースを維持してください。必要な権限を事前に設定してください。',
        },
        {
          code: 'SYSTEM_022',
          message: 'ディスク容量不足が発生しました (SYSTEM_022).',
          severity: 'error',
          category: 'F. システムと権限',
          location: 'ページ：スタイル変換 → 領域：入力',
          cause: 'ディスク容量が不足しています。',
          solution: 'ディスク容量を整理してください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['SYSTEM_003', 'SYSTEM_004'],
          prevention: 'システムリソース使用量を監視し、余裕スペースを維持してください。必要な権限を事前に設定してください。',
        },
        {
          code: 'SYSTEM_023',
          message: '権限拒否が発生しました (SYSTEM_023).',
          severity: 'warning',
          category: 'F. システムと権限',
          location: 'ページ：プロンプト → 領域：出力',
          cause: '現在のユーザーに必要な権限がありません。',
          solution: '管理者権限で実行してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['SYSTEM_004', 'SYSTEM_005'],
          prevention: 'システムリソース使用量を監視し、余裕スペースを維持してください。必要な権限を事前に設定してください。',
        },
        {
          code: 'SYSTEM_024',
          message: 'プロセス衝突が発生しました (SYSTEM_024).',
          severity: 'info',
          category: 'F. システムと権限',
          location: 'ページ：LLM → 領域：パネル',
          cause: 'システムリソース制限に達しました。',
          solution: 'システムリソース制限を増やしてください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['SYSTEM_005', 'SYSTEM_006'],
          prevention: 'システムリソース使用量を監視し、余裕スペースを維持してください。必要な権限を事前に設定してください。',
        },
        {
          code: 'SYSTEM_025',
          message: 'セマフォ超過が発生しました (SYSTEM_025).',
          severity: 'critical',
          category: 'F. システムと権限',
          location: 'ページ：TTS → 領域：キャンバス',
          cause: 'オペレーティングシステムバージョンがサポートされていません。',
          solution: 'オペレーティングシステムを更新してください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['SYSTEM_006', 'SYSTEM_007'],
          prevention: 'システムリソース使用量を監視し、余裕スペースを維持してください。必要な権限を事前に設定してください。',
        },],
    },
    {
      id: '0',
      name: '0〜9. HTTP ステータスコード',
      description: 'HTTP ステータスコードで分類された一般的なバックエンドエラーです。',
      errors: [
        {
          code: '401_UNAUTHORIZED',
          message: 'バックエンドが 401 Unauthorized を返す',
          severity: 'critical',
          category: '0〜9. HTTP ステータスコード',
          location: 'ページ：任意のオンラインツール → 領域：エラーパネル',
          cause: 'API Key が無効、期限切れ、または失効しています。',
          solution: '有効な API Key に置き換えます。',
          steps: ['「設定 → API」を開く', '新しい有効な Key に置き換える', '保存して再試行'],
          relatedCodes: ['API_KEY_EXPIRED', 'API_KEY_MISSING'],
          prevention: 'API Key の有効期限を定期的に確認してください。設定パネルで Key を保存した後、「保存」をクリックすることを忘れないでください。',
        },
        {
          code: '429_TOO_MANY_REQUESTS',
          message: 'バックエンドが 429 Too Many Requests を返す',
          severity: 'warning',
          category: '0〜9. HTTP ステータスコード',
          location: 'ページ：任意のオンラインツール → 領域：エラーパネル',
          cause: '短時間に过多のリクエストを送信し、サービス提供者のレート制限を超えました。',
          solution: '待ってから再試行します。',
          steps: ['エラー詳細の Retry-After ヒントを確認', '30〜60 秒待つ', 'リクエスト頻度を下げて再試行'],
          relatedCodes: ['API_RATE_LIMIT'],
        },
        {
          code: '500_INTERNAL_ERROR',
          message: 'バックエンドが 500 Internal Server Error を返す',
          severity: 'error',
          category: '0〜9. HTTP ステータスコード',
          location: 'ページ：任意のオンラインツール → 領域：エラーパネル',
          cause: 'バックエンドサービスがリクエスト処理中に内部例外を発生しました。モデル読み込み失敗、GPU メモリ不足、またはコードのバグが原因です。',
          solution: '後で再試行するか、バックエンド管理者に連絡します。',
          steps: ['1〜2 分待ってから再試行', 'リクエスト規模を縮小（画像サイズ、Max Tokens など）', '問題が続く場合はバックエンド管理者に連絡してサーバーログを確認'],
          relatedCodes: ['502_BAD_GATEWAY', '503_SERVICE_UNAVAILABLE'],
          prevention: 'リクエスト規模を縮小してください。サーバーが高負荷の時に大きなタスクを送信しないでください。',
        },
      
        {
          code: 'HTTP_001',
          message: '400 不正なリクエストが発生しました (HTTP_001).',
          severity: 'critical',
          category: '0~9. HTTPステータスコード',
          location: 'ページ：顔作成 → 領域：ボタン',
          cause: 'クライアントリクエストが正しくありません。',
          solution: 'リクエストパラメータを確認して修正してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['HTTP_002', 'HTTP_003'],
          prevention: 'リクエストにリトライおよびバックオフメカニズムを実装してください。APIレート制限を遵守し、キャッシングを活用してください。',
        },
        {
          code: 'HTTP_002',
          message: '401 認証失敗が発生しました (HTTP_002).',
          severity: 'error',
          category: '0~9. HTTPステータスコード',
          location: 'ページ：スタイル変換 → 領域：入力',
          cause: '認証情報が有効ではありません。',
          solution: '認証情報を更新してください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['HTTP_003', 'HTTP_004'],
          prevention: 'リクエストにリトライおよびバックオフメカニズムを実装してください。APIレート制限を遵守し、キャッシングを活用してください。',
        },
        {
          code: 'HTTP_003',
          message: '403 アクセス禁止が発生しました (HTTP_003).',
          severity: 'warning',
          category: '0~9. HTTPステータスコード',
          location: 'ページ：プロンプト → 領域：出力',
          cause: 'サーバーがリクエストを拒否しました。',
          solution: 'リクエスト権限を確認してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['HTTP_004', 'HTTP_005'],
          prevention: 'リクエストにリトライおよびバックオフメカニズムを実装してください。APIレート制限を遵守し、キャッシングを活用してください。',
        },
        {
          code: 'HTTP_004',
          message: '404 見つからないが発生しました (HTTP_004).',
          severity: 'info',
          category: '0~9. HTTPステータスコード',
          location: 'ページ：LLM → 領域：パネル',
          cause: 'リクエストされたリソースが見つかりません。',
          solution: 'リクエストされたリソースが存在するか確認してください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['HTTP_005', 'HTTP_006'],
          prevention: 'リクエストにリトライおよびバックオフメカニズムを実装してください。APIレート制限を遵守し、キャッシングを活用してください。',
        },
        {
          code: 'HTTP_005',
          message: '408 リクエストタイムアウトが発生しました (HTTP_005).',
          severity: 'critical',
          category: '0~9. HTTPステータスコード',
          location: 'ページ：TTS → 領域：キャンバス',
          cause: 'サーバー内部エラーが発生しました。',
          solution: 'サーバー管理者に問い合わせてください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['HTTP_006', 'HTTP_007'],
          prevention: 'リクエストにリトライおよびバックオフメカニズムを実装してください。APIレート制限を遵守し、キャッシングを活用してください。',
        },
        {
          code: 'HTTP_006',
          message: '409 競合が発生しました (HTTP_006).',
          severity: 'error',
          category: '0~9. HTTPステータスコード',
          location: 'ページ：paper2gal → 領域：ボタン',
          cause: 'クライアントリクエストが正しくありません。',
          solution: 'リクエストパラメータを確認して修正してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['HTTP_007', 'HTTP_008'],
          prevention: 'リクエストにリトライおよびバックオフメカニズムを実装してください。APIレート制限を遵守し、キャッシングを活用してください。',
        },
        {
          code: 'HTTP_007',
          message: '422 処理不可が発生しました (HTTP_007).',
          severity: 'warning',
          category: '0~9. HTTPステータスコード',
          location: 'ページ：画像変換 → 領域：入力',
          cause: '認証情報が有効ではありません。',
          solution: '認証情報を更新してください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['HTTP_008', 'HTTP_009'],
          prevention: 'リクエストにリトライおよびバックオフメカニズムを実装してください。APIレート制限を遵守し、キャッシングを活用してください。',
        },
        {
          code: 'HTTP_008',
          message: '429 リクエスト過多が発生しました (HTTP_008).',
          severity: 'info',
          category: '0~9. HTTPステータスコード',
          location: 'ページ：設定 → 領域：出力',
          cause: 'サーバーがリクエストを拒否しました。',
          solution: 'リクエスト権限を確認してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['HTTP_009', 'HTTP_010'],
          prevention: 'リクエストにリトライおよびバックオフメカニズムを実装してください。APIレート制限を遵守し、キャッシングを活用してください。',
        },
        {
          code: 'HTTP_009',
          message: '500 サーバー内部エラーが発生しました (HTTP_009).',
          severity: 'critical',
          category: '0~9. HTTPステータスコード',
          location: 'ページ：オーディオ → 領域：パネル',
          cause: 'リクエストされたリソースが見つかりません。',
          solution: 'リクエストされたリソースが存在するか確認してください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['HTTP_010', 'HTTP_001'],
          prevention: 'リクエストにリトライおよびバックオフメカニズムを実装してください。APIレート制限を遵守し、キャッシングを活用してください。',
        },
        {
          code: 'HTTP_010',
          message: '502 不正なゲートウェイが発生しました (HTTP_010).',
          severity: 'error',
          category: '0~9. HTTPステータスコード',
          location: 'ページ：UI → 領域：キャンバス',
          cause: 'サーバー内部エラーが発生しました。',
          solution: 'サーバー管理者に問い合わせてください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['HTTP_001', 'HTTP_002'],
          prevention: 'リクエストにリトライおよびバックオフメカニズムを実装してください。APIレート制限を遵守し、キャッシングを活用してください。',
        },
        {
          code: 'HTTP_011',
          message: '400 不正なリクエストが発生しました (HTTP_011).',
          severity: 'warning',
          category: '0~9. HTTPステータスコード',
          location: 'ページ：顔作成 → 領域：ボタン',
          cause: 'クライアントリクエストが正しくありません。',
          solution: 'リクエストパラメータを確認して修正してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['HTTP_002', 'HTTP_003'],
          prevention: 'リクエストにリトライおよびバックオフメカニズムを実装してください。APIレート制限を遵守し、キャッシングを活用してください。',
        },
        {
          code: 'HTTP_012',
          message: '401 認証失敗が発生しました (HTTP_012).',
          severity: 'info',
          category: '0~9. HTTPステータスコード',
          location: 'ページ：スタイル変換 → 領域：入力',
          cause: '認証情報が有効ではありません。',
          solution: '認証情報を更新してください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['HTTP_003', 'HTTP_004'],
          prevention: 'リクエストにリトライおよびバックオフメカニズムを実装してください。APIレート制限を遵守し、キャッシングを活用してください。',
        },
        {
          code: 'HTTP_013',
          message: '403 アクセス禁止が発生しました (HTTP_013).',
          severity: 'critical',
          category: '0~9. HTTPステータスコード',
          location: 'ページ：プロンプト → 領域：出力',
          cause: 'サーバーがリクエストを拒否しました。',
          solution: 'リクエスト権限を確認してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['HTTP_004', 'HTTP_005'],
          prevention: 'リクエストにリトライおよびバックオフメカニズムを実装してください。APIレート制限を遵守し、キャッシングを活用してください。',
        },
        {
          code: 'HTTP_014',
          message: '404 見つからないが発生しました (HTTP_014).',
          severity: 'error',
          category: '0~9. HTTPステータスコード',
          location: 'ページ：LLM → 領域：パネル',
          cause: 'リクエストされたリソースが見つかりません。',
          solution: 'リクエストされたリソースが存在するか確認してください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['HTTP_005', 'HTTP_006'],
          prevention: 'リクエストにリトライおよびバックオフメカニズムを実装してください。APIレート制限を遵守し、キャッシングを活用してください。',
        },
        {
          code: 'HTTP_015',
          message: '408 リクエストタイムアウトが発生しました (HTTP_015).',
          severity: 'warning',
          category: '0~9. HTTPステータスコード',
          location: 'ページ：TTS → 領域：キャンバス',
          cause: 'サーバー内部エラーが発生しました。',
          solution: 'サーバー管理者に問い合わせてください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['HTTP_006', 'HTTP_007'],
          prevention: 'リクエストにリトライおよびバックオフメカニズムを実装してください。APIレート制限を遵守し、キャッシングを活用してください。',
        },
        {
          code: 'HTTP_016',
          message: '409 競合が発生しました (HTTP_016).',
          severity: 'info',
          category: '0~9. HTTPステータスコード',
          location: 'ページ：paper2gal → 領域：ボタン',
          cause: 'クライアントリクエストが正しくありません。',
          solution: 'リクエストパラメータを確認して修正してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['HTTP_007', 'HTTP_008'],
          prevention: 'リクエストにリトライおよびバックオフメカニズムを実装してください。APIレート制限を遵守し、キャッシングを活用してください。',
        },
        {
          code: 'HTTP_017',
          message: '422 処理不可が発生しました (HTTP_017).',
          severity: 'critical',
          category: '0~9. HTTPステータスコード',
          location: 'ページ：画像変換 → 領域：入力',
          cause: '認証情報が有効ではありません。',
          solution: '認証情報を更新してください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['HTTP_008', 'HTTP_009'],
          prevention: 'リクエストにリトライおよびバックオフメカニズムを実装してください。APIレート制限を遵守し、キャッシングを活用してください。',
        },
        {
          code: 'HTTP_018',
          message: '429 リクエスト過多が発生しました (HTTP_018).',
          severity: 'error',
          category: '0~9. HTTPステータスコード',
          location: 'ページ：設定 → 領域：出力',
          cause: 'サーバーがリクエストを拒否しました。',
          solution: 'リクエスト権限を確認してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['HTTP_009', 'HTTP_010'],
          prevention: 'リクエストにリトライおよびバックオフメカニズムを実装してください。APIレート制限を遵守し、キャッシングを活用してください。',
        },
        {
          code: 'HTTP_019',
          message: '500 サーバー内部エラーが発生しました (HTTP_019).',
          severity: 'warning',
          category: '0~9. HTTPステータスコード',
          location: 'ページ：オーディオ → 領域：パネル',
          cause: 'リクエストされたリソースが見つかりません。',
          solution: 'リクエストされたリソースが存在するか確認してください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['HTTP_010', 'HTTP_001'],
          prevention: 'リクエストにリトライおよびバックオフメカニズムを実装してください。APIレート制限を遵守し、キャッシングを活用してください。',
        },
        {
          code: 'HTTP_020',
          message: '502 不正なゲートウェイが発生しました (HTTP_020).',
          severity: 'info',
          category: '0~9. HTTPステータスコード',
          location: 'ページ：UI → 領域：キャンバス',
          cause: 'サーバー内部エラーが発生しました。',
          solution: 'サーバー管理者に問い合わせてください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['HTTP_001', 'HTTP_002'],
          prevention: 'リクエストにリトライおよびバックオフメカニズムを実装してください。APIレート制限を遵守し、キャッシングを活用してください。',
        },
        {
          code: 'HTTP_021',
          message: '400 不正なリクエストが発生しました (HTTP_021).',
          severity: 'critical',
          category: '0~9. HTTPステータスコード',
          location: 'ページ：顔作成 → 領域：ボタン',
          cause: 'クライアントリクエストが正しくありません。',
          solution: 'リクエストパラメータを確認して修正してください。',
          steps: [
            '確認ステップを実行してください。',
            '修正作業を進めてください。',
            '保存後に再試行してください。'
          ],
          relatedCodes: ['HTTP_002', 'HTTP_003'],
          prevention: 'リクエストにリトライおよびバックオフメカニズムを実装してください。APIレート制限を遵守し、キャッシングを活用してください。',
        },
        {
          code: 'HTTP_022',
          message: '401 認証失敗が発生しました (HTTP_022).',
          severity: 'error',
          category: '0~9. HTTPステータスコード',
          location: 'ページ：スタイル変換 → 領域：入力',
          cause: '認証情報が有効ではありません。',
          solution: '認証情報を更新してください。',
          steps: [
            '診断ステップを実行してください。',
            '調整作業を進めてください。',
            '適用後に再試行してください。'
          ],
          relatedCodes: ['HTTP_003', 'HTTP_004'],
          prevention: 'リクエストにリトライおよびバックオフメカニズムを実装してください。APIレート制限を遵守し、キャッシングを活用してください。',
        },
        {
          code: 'HTTP_023',
          message: '403 アクセス禁止が発生しました (HTTP_023).',
          severity: 'warning',
          category: '0~9. HTTPステータスコード',
          location: 'ページ：プロンプト → 領域：出力',
          cause: 'サーバーがリクエストを拒否しました。',
          solution: 'リクエスト権限を確認してください。',
          steps: [
            '分析ステップを実行してください。',
            '変更作業を進めてください。',
            '確認後に再試行してください。'
          ],
          relatedCodes: ['HTTP_004', 'HTTP_005'],
          prevention: 'リクエストにリトライおよびバックオフメカニズムを実装してください。APIレート制限を遵守し、キャッシングを活用してください。',
        },
        {
          code: 'HTTP_024',
          message: '404 見つからないが発生しました (HTTP_024).',
          severity: 'info',
          category: '0~9. HTTPステータスコード',
          location: 'ページ：LLM → 領域：パネル',
          cause: 'リクエストされたリソースが見つかりません。',
          solution: 'リクエストされたリソースが存在するか確認してください。',
          steps: [
            '検査ステップを実行してください。',
            '更新作業を進めてください。',
            'テスト後に再試行してください。'
          ],
          relatedCodes: ['HTTP_005', 'HTTP_006'],
          prevention: 'リクエストにリトライおよびバックオフメカニズムを実装してください。APIレート制限を遵守し、キャッシングを活用してください。',
        },
        {
          code: 'HTTP_025',
          message: '408 リクエストタイムアウトが発生しました (HTTP_025).',
          severity: 'critical',
          category: '0~9. HTTPステータスコード',
          location: 'ページ：TTS → 領域：キャンバス',
          cause: 'サーバー内部エラーが発生しました。',
          solution: 'サーバー管理者に問い合わせてください。',
          steps: [
            'テストステップを実行してください。',
            'リセット作業を進めてください。',
            '検証後に再試行してください。'
          ],
          relatedCodes: ['HTTP_006', 'HTTP_007'],
          prevention: 'リクエストにリトライおよびバックオフメカニズムを実装してください。APIレート制限を遵守し、キャッシングを活用してください。',
        },],
    },
  ],
};
