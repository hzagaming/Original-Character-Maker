import type { DocsContent } from './types';

export const docsContent: DocsContent = {
    intro: `Original Character Maker 사용자 가이드에 오신 것을 환영합니다!\n\n이 가이드는 9개 기능 모듈의 상세한 설명서와 전역 오류 사전이 포함되어 있습니다. 도구 사용 중 오류가 발생하거나 버튼/매개변수의 기능을 잘 모르겠다면 이 가이드를 열어 해당 장을 찾아보세요.\n\n가이드 구조:\n· 도구 가이드 — 각 도구별로 기능 개요, 버튼 설명, 매개변수 설명, 오류와 해결책을 포함한 독립 장이 있습니다\n· 오류 사전 — 전역 오류 인덱스, 카테고리(A~Z, 0~9)별로 정렬되어 사전처럼 빠르게 검색할 수 있습니다\n\n오류 사전 사용법:\n1. 오류 패널에 표시된 Code를 먼저 확인하세요(예: STYLE_TRANSFER_REQUEST_FAILED)\n2. 첫 글자에 해당하는 카테고리를 찾으세요(S → 시스템 및 워크플로우)\n3. 해당 카테고리 안에서 알파벳 순서로 항목을 찾으세요\n4. "위치"를 읽어 오류가 발생한 페이지와 영역을 확인하세요\n5. "해결 단계"에 따라 단계별로 문제를 해결하세요`,
    tools:
[
      {
        id: `face-maker`,
        title: `캐릭터 얼굴 만들기`,
        overview: `OC Maker의 입구 도구입니다. 좌측 에셋 라이브러리에서 헤어, 눈, 눈썹, 코, 입, 얼굴형, 귀, 액세서리, 자세, 상하의를 선택하고, 우측 16개 수치 슬라이더로 비율, 색상, 위치를 정밀 조정합니다. 중앙 캔버스에서 실시간 미리보기됩니다. 모든 설정은 로컬에서 수행되며 이미지와 데이터를 업로드하지 않습니다.`,
        buttons:
[
          {
            name: `임시 저장`,
            description: `현재 파츠 선택과 매개변수 값을 브라우저 로컬 스토리지에 저장합니다. 저장 성공 후 상태 표시가 노란색 '저장 안됨'에서 녹색 '저장됨'으로 바뀝니다.`,
          },
          {
            name: `낮춰`,
            description: `현재 얼굴 설정을 JSON 파일(oc-face-maker-config.json)로 낮춰줍니다.`,
          },
          {
            name: `PNG 낮춰`,
            description: `현재 캔버스 이미지를 PNG(oc-character.png)로 낮춰줍니다.`,
          },
          {
            name: `설정 불러오기`,
            description: `이전에 낮춘 JSON 설정 파일을 선택하여 파츠와 매개변수 값을 복원합니다.`,
          },
          {
            name: `초기화`,
            description: `모든 매개변수를 기본값으로 재설정하고 파츠를 원래 상태로 복원합니다.`,
          },
        ],
        parameters:
[
          {
            name: `머리 크기`,
            description: `머리 전체 크기를 조정합니다. 범위 40~70.`,
            tips: `얼굴 길이와 함께 조정하면 비율 불균형을 피할 수 있습니다.`,
          },
          {
            name: `얼굴 길이`,
            description: `얼굴 길이를 조정합니다. 범위 30~70.`,
            tips: `30에 가까우면 둥근 얼굴, 70에 가까우면 길쭉한 얼굴에 가깝습니다.`,
          },
          {
            name: `피부색`,
            description: `피부색을 조정합니다. 범위 0~100. HSL 색조 이동을 통해 밝은 피부에서 어두운 피부까지 변화를 구현합니다.`,
          },
          {
            name: `머리칼 색`,
            description: `머리칼 색을 조정합니다. 범위 0~100. 색조 회전을 통해 무지개색 머리칼 변화를 구현합니다.`,
          },
          {
            name: `눈 크기`,
            description: `눈 전체 크기를 조정합니다. 범위 38~62.`,
          },
          {
            name: `자세`,
            description: `캐릭터 전체 몸 자세를 선택합니다: 서기, 팔짱끼기, 허리에 손 올리기, 손 흔들기.`,
            tips: `자세와 옷을 함께 조합하면 미리보기 효과가 더 좋습니다.`,
          },
          {
            name: `상의`,
            description: `캐릭터 상의를 선택합니다: 티셔츠, 후드티, 정장, 해군복, 또는 알몸.`,
            tips: `상의 색상은 '액세서리 색상' 슬라이더를 따릅니다.`,
          },
        ],
        errors:
[
          {
            code: `CONFIG_CORRUPTED`,
            message: `얼굴 설정 불러오기가 비정상적이고 캔버스 표시가 불완전하거나 매개변수 슬라이더가 작동하지 않습니다`,
            severity: `error`,
            category: `B. 설정 및 데이터`,
            location: `페이지: 캐릭터 얼굴 만들기 → 영역: 중앙 캔버스/우측 매개변수 패널`,
            cause: `브라우저 로컬 스토리지에 저장된 face-maker 설정 데이터가 손상되었습니다.`,
            solution: `설정을 초기화하고 얼굴을 다시 만드세요.`,
            steps:
[
              `좌측 하단 '초기화' 버튼 클릭`,
              `대화 상자에서 '초기화 확인' 클릭`,
              `여전히 비정상인 경우 DevTools → Application → Local Storage에서 face-maker로 시작하는 키 삭제`,
              `페이지 새로고침 후 다시 시작`,
            ],
            relatedCodes:
[
              `IMPORT_INVALID_JSON`,
              `STORAGE_READ_ONLY`,
            ],
            prevention: `로컬 스토리지 데이터를 수동으로 수정하지 마세요.`,
          },
          {
            code: `STORAGE_READ_ONLY`,
            message: `저장 작업이 반응하지 않고 새로고침 후 데이터가 손실됩니다`,
            severity: `critical`,
            category: `B. 설정 및 데이터`,
            location: `페이지: 캐릭터 얼굴 만들기 → 영역: 좌측 하단 '임시 저장' 버튼`,
            cause: `브라우저가 시크릿 모드이거나 로컬 스토리지가 비활성화되었습니다.`,
            solution: `시크릿 모드를 종료하거나 디스크 공간을 확보하세요.`,
            steps:
[
              `브라우저가 시크릿 모드가 아닌지 확인`,
              `디스크 공간 확인`,
              `일반 창에서 앱 열기`,
              `필요 시 '낮추기'를 대안으로 사용`,
            ],
            relatedCodes:
[
              `LOCAL_STORAGE_FULL`,
            ],
            prevention: `시크릿 모드에서 이 앱을 사용하지 마세요. 설정을 정기적으로 로컬 파일로 낮추세요.`,
          },
        ],
      },
      {
        id: `style-transfer`,
        title: `스타일 전이`,
        overview: `캐릭터 이미지를 지정한 미술 스타일로 변환하는 도구입니다. PNG/JPG 캐릭터 이미지를 업로드한 후 AI 모델을 선택하고 프롬프트를 작성하고 추가 매개변수를 설정하여 백엔드 API를 호출합니다. 자동 차단, 색상 보존, 자세 고정, 얼굴 고정 등 추가 기능을 지원합니다. 인터넷 연결과 유효한 API Key가 필요합니다.`,
        buttons:
[
          {
            name: `이미지 선택/교체`,
            description: `캐릭터 이미지 파일을 업로드합니다. PNG 및 JPG 형식을 지원합니다.`,
          },
          {
            name: `시작`,
            description: `스타일 전이 프로세스를 시작합니다.`,
          },
          {
            name: `JSON 복사`,
            description: `현재 모든 설정 매개변수를 JSON 텍스트로 클립보드에 복사합니다.`,
          },
          {
            name: `결과 낮춰`,
            description: `변환된 결과 이미지를 로컬로 낮춰줍니다.`,
          },
          {
            name: `초기화`,
            description: `모든 매개변수를 기본값으로 재설정하고 업로드한 이미지와 결과를 지웁니다.`,
          },
        ],
        parameters:
[
          {
            name: `모델`,
            description: `사용할 AI 이미지 생성 모델을 선택합니다.`,
            tips: `gpt-image-2가 기본 모델입니다. claude-4-sonnet은 캐릭터 일관성이 더 우수합니다.`,
          },
          {
            name: `프롬프트`,
            description: `원하는 미술 스타일, 장면, 캐릭터 특징을 설명하는 긍정 프롬프트입니다.`,
            tips: `프롬프트는 추가 매개변수의 영어 접미사가 자동으로 추가됩니다.`,
          },
          {
            name: `네거티브 프롬프트`,
            description: `보고 싶지 않은 콘텐츠를 설명하는 부정 프롬프트입니다.`,
            tips: `일반적인 부정 태그: 저품질, 여분의 손가락, 변형된 몸, 흐림.`,
          },
          {
            name: `Temperature`,
            description: `생성 결과의 무작위성을 제어합니다. 범위 0~2, 기본값 0.7.`,
            tips: `낮은 값은 더 안정적인 결과를 줍니다. 높은 값은 더 창의적이지만 기대에서 벗어날 수 있습니다.`,
          },
          {
            name: `Strength`,
            description: `스타일 강도/재편집 진폭. 범위 0~1. 값이 클수록 원본을 덜 보존합니다.`,
            tips: `0.4~0.6이 일반적으로 사용되는 범위입니다. 캐릭터 특징을 유지하면서 스타일만 변경할 수 있습니다.`,
          },
        ],
        errors:
[
          {
            code: `API_KEY_MISSING`,
            message: `'시작'을 누르면 즉시 오류가 발생하고 API Key 관련 오류가 표시됩니다`,
            severity: `critical`,
            category: `A. API 및 네트워크`,
            location: `페이지: 스타일 전이 → 영역: 좌측 하단 오류 패널`,
            cause: `'설정 → API'에서 API Key가 설정되지 않았거나 Key가 삭제되었습니다.`,
            solution: `설정 패널에서 유효한 API Key를 설정하세요.`,
            steps:
[
              `우측 상단 '설정 열기' 클릭`,
              `'API' 탭으로 전환`,
              `유효한 Key 입력`,
              `'저장' 클릭`,
              `스타일 전이 페이지로 돌아가 '시작'을 다시 클릭`,
            ],
            relatedCodes:
[
              `API_KEY_EXPIRED`,
              `401_UNAUTHORIZED`,
            ],
            prevention: `처음 온라인 도구를 사용할 때 반드시 '설정 → API'에서 유효한 API Key를 설정하세요.`,
          },
          {
            code: `API_TIMEOUT`,
            message: `요청이 오랫동안 응답하지 않고 결국 시간 초과됩니다`,
            severity: `error`,
            category: `A. API 및 네트워크`,
            location: `페이지: 스타일 전이 → 영역: 좌측 하단 오류 패널/프로그레스 바`,
            cause: `백엔드 생성이 너무 오래 걸려 프론트엔드 시간 초과를 초과했습니다.`,
            solution: `이미지 크기를 줄이거나 네트워크 연결을 확인하세요.`,
            steps:
[
              `'이미지 크기' 줄이기(2048 이하 권장)`,
              `'Steps' 값 줄이기(20~30 권장)`,
              `네트워크 연결 안정성 확인`,
              `전이를 다시 실행`,
            ],
            relatedCodes:
[
              `NETWORK_TIMEOUT`,
              `BACKEND_UNAVAILABLE`,
            ],
            prevention: `큰 이미지를 처리할 때는 미리 매개변수 크기를 줄이세요.`,
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
      title: 'IndexTTS 음성 합성',
      overview: `IndexTTS 음성 합성 도구는 제로샷 음성 클로닝 기술을 사용하여 텍스트를 음성으로 변환합니다. 3~10초의 참조 오디오를 업로드하면 모든 음색을 클론할 수 있으며, 기본 음색을 사용할 수도 있습니다. 감정 제어, 속도 조절 및 다양한 출력 형식을 지원합니다.

기본 워크플로우:
1. 합성할 텍스트 입력
2. 참조 오디오 업로드 (선택사항)
3. TTS 매개변수 조정 (온도, 속도, 감정 등)
4. "음성 생성" 클릭
5. 생성된 음성 재생, 복사 또는 다운로드

【TTS 기술 원리】
IndexTTS는 XTTS와 Tortoise를 기반으로 한 GPT 스타일 텍스트 음성 변환 모델입니다. 중국어 병음 발음 교정 및 구두점을 통한 일시 중지 제어를 지원합니다. 모델은 conformer 조건 인코더와 BigVGAN2 기반 speechcode 디코더를 사용하여 고품질 오디오를 출력합니다.

【지원되는 매개변수】
- 텍스트: 합성할 입력 텍스트 (중국어, 영어 등 지원)
- 참조 오디오: 3~10초 오디오 클립, 제로샷 음성 클로닝용
- 모델: index-tts-1.5 또는 index-tts-2
- Temperature (0.0~1.0): 무작위성/창의성 제어
- Top P (0.0~1.0): 핵 샘플링 임계값
- Top K (1~128): Top-k 샘플링
- 속도 (0.5~2.0): 재생 속도 배율
- CFG (1.0~14.0): 분류기 자유 가이던스 스케일
- 감정 강도 (0.0~2.0): 감정 표현 강도
- 감정 설명: 소프트 감정 지시 (예: "화난 shouting")
- Seed: 무작위 시드, 재현 가능한 결과용
- 추론 장치: GPU (빠름) 또는 CPU (폴백)
- 출력 형식: WAV 또는 MP3
- 샘플링 레이트: 22050 / 44100 / 48000 Hz
- 노이즈 감소 (0~100): 후처리 노이즈 감소 강도

【출력 형식】
- WAV: 무압축, 최고 음질
- MP3: 압축, 파일 크기 작음
- 일반적인 파일 크기: 100KB ~ 5MB (길이 및 형식에 따라 다름)
- 권장 샘플링 레이트: 최고 음질을 위해 48000 Hz`,
      buttons: [
        { name: '음성 생성', description: 'TTS 생성 워크플로우를 시작합니다. 입력 텍스트와 매개변수를 검증한 후 백엔드에 요청을 전송합니다.' },
        { name: '작업 중단', description: '진행 중인 TTS 생성 작업을 취소합니다.' },
        { name: 'JSON 복사', description: '현재 매개변수 구성을 JSON 형식으로 클립보드에 복사합니다.' },
        { name: 'JSON 다운로드', description: '현재 매개변수 구성을 JSON 파일로 다운로드합니다.' },
        { name: '결과 복사', description: '생성 성공 후 오디오를 클립보드에 복사합니다(브라우저가 지원하는 경우).' },
        { name: '결과 다운로드', description: '생성된 오디오를 로컬로 다운로드합니다.' },
        { name: '파일 열기', description: '새 탭에서 생성된 오디오를 엽니다.' },
        { name: '다시 하기', description: '동일한 매개변수를 사용하여 음성을 재생성합니다.' },
        { name: '세부정보 표시/숨기기', description: '매개변수 패널과 디버그 정보 패널을 펼치거나 접습니다.' },
        { name: '새로 고침', description: '모든 매개변수를 기본값으로 재설정하고 텍스트와 결과를 지웁니다.' },
      ],
      parameters: [
        { name: '모델', description: 'TTS 모델 버전을 선택합니다.', tips: 'index-tts-1.5는 안정 버전; index-tts-2는 고급 감정 제어 기능이 있습니다.' },
        { name: 'Temperature', description: '샘플링 온도, 무작위성을 제어합니다. 범위 0~1, 기본값 0.8.', tips: '낮을수록 안정적/예측 가능; 높을수록 창의적이지만 벗어날 수 있습니다.' },
        { name: 'Top P', description: '핵 샘플링 임계값. 범위 0~1, 기본값 0.92.', tips: '낮을수록 다양성이 낮고 일관성이 높습니다.' },
        { name: 'Top K', description: 'Top-K 샘플링. 범위 1~128, 기본값 48.', tips: '낮은 값은 생성을 보수적으로 만듭니다.' },
        { name: '속도', description: '재생 속도 배율. 범위 0.5~2.0, 기본값 1.0.', tips: '1.0은 정상 속도; 0.5은 반 속도; 2.0은 2배 속도입니다.' },
        { name: 'CFG', description: '분류기 자유 가이던스 스케일. 범위 1~14, 기본값 6.8.', tips: '높을수록 프롬프트 충실도가 높습니다. 7~10이 안전 구간입니다.' },
        { name: '감정 강도', description: '감정 표현 강도. 범위 0.0~2.0, 기본값 1.0.', tips: '0.0 = 중립; 1.0 = 균형; 2.0 = 매우 표현력이 풍부합니다.' },
        { name: '감정 설명', description: '자연어를 사용한 소프트 감정 지시.', tips: '예: "화난 shouting", "부드러운 속삭임", "행복하고 흥분된".' },
        { name: 'Seed', description: '무작위 시드, 기본값 240315. 고정된 시드는 재현 가능한 결과를 제공합니다.', tips: '좋아하는 결과의 시드를 기록하여 쉽게 재현하세요.' },
        { name: '추론 장치', description: '추론 장치: GPU (빠름) 또는 CPU (폴백).', tips: '빠른 생성을 위해 GPU 권장; CPU는 모든 기기에서 작동합니다.' },
        { name: '출력 형식', description: '출력 오디오 형식: WAV 또는 MP3.', tips: 'WAV는 최고 음질; MP3는 더 작고 휴대하기 쉽습니다.' },
        { name: '샘플링 레이트', description: '출력 샘플링 레이트(Hz).', tips: '48000 Hz는 CD 음질; 44100 Hz는 표준; 22050 Hz는 음성에 허용 가능합니다.' },
        { name: '노이즈 감소', description: '후처리 노이즈 감소 강도. 범위 0~100, 기본값 20.', tips: '높을수록 배경 노이즈를 더 제거하지만 음질에 영향을 줄 수 있습니다.' },
      ],
      errors: [
        {
          code: 'INDEX_TTS_TEXT_MISSING',
          message: '입력 텍스트가 감지되지 않았습니다.',
          severity: 'error',
          category: 'api/request',
          cause: '워크플로우 시작 시 텍스트 입력란이 비어 있습니다.',
          location: 'IndexTTS 페이지 → 텍스트 입력 카드',
          solution: '"음성 생성"을 클릭하기 전에 합성할 텍스트를 입력하세요.',
          steps: ['텍스트 입력 영역을 클릭', '텍스트를 입력하거나 붙여넣기', '다시 "음성 생성"을 클릭'],
          relatedCodes: ['INDEX_TTS_REQUEST_FAILED'],
          prevention: '시작하기 전에 항상 텍스트 입력에 유효한 내용이 포함되어 있는지 확인하세요.',
        },
        {
          code: 'INDEX_TTS_REQUEST_FAILED',
          message: 'IndexTTS 생성 요청이 실패했습니다.',
          severity: 'error',
          category: 'api/request',
          cause: '백엔드 API가 오류를 반환하거나 요청을 완료할 수 없었습니다.',
          location: 'IndexTTS 페이지 → API 요청',
          solution: '백엔드 상태, API 구성 및 네트워크 연결을 확인하세요.',
          steps: ['설정 → API 구성이 올바른지 확인', '백엔드 서버가 실행 중인지 확인', '브라우저 콘솔에서 자세한 오류 메시지 확인', 'Temperature/Top P를 낮추고 재시도'],
          relatedCodes: ['INDEX_TTS_TEXT_MISSING', 'PLATO_NOT_CONFIGURED'],
          prevention: '안정적인 생성을 위해 Temperature를 0.9 미만, Top P를 0.95 미만으로 유지하세요.',
        },
        {
          code: 'INDEX_TTS_NOT_CONFIGURED',
          message: 'IndexTTS 백엔드가 구성되지 않았습니다.',
          severity: 'error',
          category: 'api/request',
          cause: '백엔드에 IndexTTS 공급자가 구성되어 있지 않습니다.',
          location: '서버 → /api/index-tts',
          solution: '백엔드 .env 파일에 IndexTTS 공급자를 구성하세요.',
          steps: ['IndexTTS API 키 설정(예: SiliconFlow)', '공급자 구성을 백엔드 .env에 추가', '백엔드 서버 재시작'],
          relatedCodes: ['INDEX_TTS_REQUEST_FAILED'],
          prevention: '도구를 사용하기 전에 IndexTTS 공급자를 설정하세요.',
        },
      ],
    },
      {
        id: `prompt-suite`,
        title: `캐릭터 카드/세계관 편집기`,
        overview: `PromptSuite는 캐릭터 카드, 세계관 설명, 관계도, 말투 프로필을 정리하는 서식 텍스트 편집기입니다. 글꼴, 색상, 강조, 제목, 목록, 표, 코드 블록, 인용구, 이미지 삽입 등의 서식을 지원합니다. 모든 내용은 브라우저에 자동 저장됩니다.`,
        buttons:
[
          {
            name: `문서 저장`,
            description: `현재 편집기 HTML 콘텐츠와 도구 패널 상태를 로컬 스토리지에 저장합니다.`,
          },
          {
            name: `초기화`,
            description: `현재 문서를 지우고 기본 템플릿으로 복원합니다.`,
          },
          {
            name: `설정 불러오기`,
            description: `이전에 낮춘 PromptSuite 설정 JSON 파일을 불러옵니다.`,
          },
          {
            name: `HTML 낮춰`,
            description: `현재 문서를 내장 스타일이 포함된 독립 HTML 파일로 낮춰줍니다.`,
          },
        ],
        parameters:
[
          {
            name: `템플릿 선택`,
            description: `미리 설정된 템플릿을 빠르게 전환합니다: 세계관 설명, 캐릭터 카드, 관계도, 말투 프로필, 타임라인.`,
          },
          {
            name: `글꼴`,
            description: `편집기 본문 글꼴 패밀리를 설정합니다.`,
          },
          {
            name: `글꼴 크기`,
            description: `기본 글꼴 크기를 설정합니다. px/rem 단위를 지원합니다.`,
          },
          {
            name: `텍스트 색상`,
            description: `현재 선택한 텍스트의 색상을 설정합니다.`,
          },
          {
            name: `굵게/기울임/밑줄/취소선`,
            description: `기본 텍스트 서식 버튼입니다.`,
          },
        ],
        errors:
[
          {
            code: `CONFIG_CORRUPTED`,
            message: `편집기를 열면 콘텐츠가 비어 있거나 서식이 어긋납니다`,
            severity: `error`,
            category: `B. 설정 및 데이터`,
            location: `페이지: 캐릭터 카드/세계관 편집기 → 영역: 중앙 편집 영역`,
            cause: `브라우저 로컬 스토리지에 저장된 PromptSuite 설정 데이터가 손상되었습니다.`,
            solution: `편집기를 초기화하거나 수동으로 localStorage를 지우세요.`,
            steps:
[
              `'초기화' 버튼 클릭`,
              `'초기화 확인' 클릭`,
              `여전히 비정상인 경우 prompt-suite 키를 localStorage에서 삭제`,
              `페이지 새로고침`,
            ],
            relatedCodes:
[
              `IMPORT_INVALID_JSON`,
              `STORAGE_READ_ONLY`,
            ],
            prevention: `로컬 스토리지 데이터를 수동으로 수정하지 마세요.`,
          },
        ],
      },
      {
        id: `llm-hub`,
        title: `LLM 텍스트 접근`,
        overview: `LLM Hub는 대형 언어 모델의 매개변수를 설정하고 실시간으로 테스트하는 도구입니다. 모델 선택, 샘플링 매개변수, 시스템 프롬프트 등을 설정한 후 실시간 테스트 패널을 통해 AI와 다회전 대화를 진행할 수 있습니다.`,
        buttons:
[
          {
            name: `문서 저장`,
            description: `현재 LLM 설정을 로컬 스토리지에 저장합니다.`,
          },
          {
            name: `초기화`,
            description: `모든 매개변수를 기본값으로 재설정합니다.`,
          },
          {
            name: `설정 불러오기`,
            description: `이전에 낮춘 LLM Hub 설정 JSON 파일을 불러옵니다.`,
          },
          {
            name: `보내기`,
            description: `실시간 테스트 패널에 입력한 메시지를 AI에게 전송합니다.`,
          },
          {
            name: `지우기`,
            description: `현재 대화 기록과 출력 콘텐츠를 지웁니다.`,
          },
          {
            name: `프리셋으로 저장`,
            description: `현재 모든 매개변수를 명명된 프리셋으로 저장합니다.`,
          },
        ],
        parameters:
[
          {
            name: `모델`,
            description: `사용할 대형 언어 모델을 선택합니다.`,
            tips: `gpt-5.4가 기본 추천 모델입니다. claude-4-sonnet은 창작 글쓰기에 뛰어납니다.`,
          },
          {
            name: `Temperature`,
            description: `생성 결과의 무작위성을 제어합니다. 범위 0~2.`,
            tips: `창작 글쓰기: 0.7~1.0. 캐릭터 설정 보충: 0.3~0.5.`,
          },
          {
            name: `최대 토큰`,
            description: `단일 응답의 최대 생성 길이. 범위 1~8192.`,
            tips: `캐릭터 설정 생성: 1024~2048. 짧은 대화: 512.`,
          },
          {
            name: `응답 형식`,
            description: `AI 출력 형식을 지정합니다: text 또는 json_object.`,
            tips: `json_object를 선택한 경우 프롬프트에서 예상 JSON 구조를 명확히 설명해야 합니다.`,
          },
          {
            name: `시스템 프롬프트`,
            description: `AI의 역할과 행동 지침을 정의하는 전역 프롬프트입니다.`,
            tips: `출력 품질에 가장 큰 영향을 미치는 매개변수입니다.`,
          },
        ],
        errors:
[
          {
            code: `API_KEY_MISSING`,
            message: `메시지를 보낸 직후 오류가 발생하고 API Key가 설정되지 않았습니다`,
            severity: `critical`,
            category: `A. API 및 네트워크`,
            location: `페이지: LLM 텍스트 접근 → 영역: 실시간 테스트 출력 패널`,
            cause: `'설정 → API'에서 API Key가 설정되지 않았습니다.`,
            solution: `설정 패널에서 API Key를 설정하세요.`,
            steps:
[
              `우측 상단 '설정 열기' 클릭`,
              `'API' 탭으로 전환`,
              `유효한 API Key 입력`,
              `저장 후 닫기`,
              `LLM Hub로 돌아가 다시 보내기`,
            ],
            relatedCodes:
[
              `API_KEY_EXPIRED`,
              `401_UNAUTHORIZED`,
            ],
            prevention: `처음 온라인 도구를 사용할 때 반드시 유효한 API Key를 설정하세요.`,
          },
        ],
      },
      {
        id: `tts-export`,
        title: `TTS 음성 내보내기`,
        overview: `음성 합성 매개변수를 설정하고 캐릭터 음성 에셋을 생성하는 도구입니다. 음성, 언어, 속도, 음높이, 볼륨 등 기본 매개변수와 호흡, 선명도, 표현력, 휴식 강도 등 추가 매개변수를 설정할 수 있습니다.`,
        buttons:
[
          {
            name: `저장`,
            description: `현재 TTS 설정을 로컬 스토리지에 저장합니다.`,
          },
          {
            name: `초기화`,
            description: `모든 매개변수를 기본값으로 재설정하고 참조 오디오와 로그를 지웁니다.`,
          },
          {
            name: `설정 불러오기`,
            description: `이전에 낮춘 TTS 설정 JSON 파일을 불러옵니다.`,
          },
          {
            name: `JSON 낮춰`,
            description: `현재 TTS 설정을 JSON 파일로 낮춰줍니다.`,
          },
          {
            name: `참조 오디오 업로드`,
            description: `참조 오디오(WAV/MP3/FLAC, 최대 10MB)를 선택하여 업로드합니다.`,
          },
          {
            name: `로그 복사`,
            description: `우측 로그 패널 콘텐츠를 클립보드에 복사합니다.`,
          },
        ],
        parameters:
[
          {
            name: `음성`,
            description: `미리 설정된 음색을 선택합니다.`,
            tips: `Hanazora가 기본 여성 음성입니다. Mirako는 활기찬 여성 음성입니다. Rin은 소년 음성입니다.`,
          },
          {
            name: `언어`,
            description: `합성할 음성의 목표 언어입니다.`,
            tips: `전역 언어를 전환하면 이 필드가 자동으로 동기화됩니다.`,
          },
          {
            name: `속도`,
            description: `음성 재생 속도 계수. 범위 0.6~1.6.`,
            tips: `1.0이 정상 속도입니다. 캐릭터가 감정적으로 흥분한 경우 1.2~1.4로 설정할 수 있습니다.`,
          },
          {
            name: `음높이`,
            description: `음높이 오프셋. 범위 -12~12(반음).`,
            tips: `양수는 더 높고 밝습니다. 음수는 더 낮고 깊습니다.`,
          },
          {
            name: `볼륨`,
            description: `출력 볼륨 백분율. 범위 40~140.`,
            tips: `100이 원래 볼륨입니다. 배경 소음이 큰 경우 110~120으로 설정할 수 있습니다.`,
          },
          {
            name: `호흡`,
            description: `음성의 호흡 강도를 제어합니다. 범위 0~100.`,
            tips: `더 높은 값은 더 자연스럽게 들리지만 너무 높으면 숨이 차는 느낌을 줍니다.`,
          },
          {
            name: `선명도`,
            description: `발음의 선명도를 제어합니다. 범위 0~100.`,
            tips: `더 높은 값은 더 선명한 발음을 주지만 기계적으로 들릴 수 있습니다.`,
          },
        ],
        errors:
[
          {
            code: `API_KEY_MISSING`,
            message: `음성 생성 시 API Key가 설정되지 않았다고 표시됩니다`,
            severity: `critical`,
            category: `A. API 및 네트워크`,
            location: `페이지: TTS 음성 내보내기 → 영역: 좌측 출력 패널`,
            cause: `API Key가 설정되지 않았습니다.`,
            solution: `설정 패널에서 Key를 설정하세요.`,
            steps:
[
              `'설정 → API' 열기`,
              `유효한 Key 입력`,
              `저장 후 다시 시도`,
            ],
            relatedCodes:
[
              `API_KEY_EXPIRED`,
            ],
            prevention: `처음 온라인 도구를 사용할 때 반드시 유효한 API Key를 설정하세요.`,
          },
        ],
      },
      {
        id: `paper2gal`,
        title: `paper2gal 이미지 생성`,
        overview: `Paper2Gal은 Original Character Maker의 주요 워크플로우 도구입니다. 백엔드 p2g-character-workflow에 연결하여 '이미지 하나 입력, 여러 에셋 출력' 방식으로 캐릭터 에셋을 일괄 생성합니다.`,
        buttons:
[
          {
            name: `홈으로 돌아가기`,
            description: `paper2gal 페이지를 떠나 홈으로 돌아갑니다.`,
          },
          {
            name: `설정 열기`,
            description: `전역 설정 패널을 엽니다.`,
          },
          {
            name: `설정 저장`,
            description: `현재 프롬프트 재정의와 AI 병렬 처리 설정을 저장합니다.`,
          },
          {
            name: `워크플로우 초기화`,
            description: `모든 워크플로우 상태, 이미지, 결과 및 설정을 지웁니다.`,
          },
          {
            name: `설정 불러오기`,
            description: `이전에 낮춘 paper2gal 설정 JSON 파일을 불러옵니다.`,
          },
          {
            name: `이미지 선택/교체`,
            description: `캐릭터 참조 이미지를 업로드합니다.`,
          },
          {
            name: `시작`,
            description: `이미지를 백엔드에 전송하여 paper2gal 전체 워크플로우를 시작합니다.`,
          },
          {
            name: `워크플로우 다시 시도`,
            description: `동일한 업로드된 이미지로 워크플로우를 재시작합니다.`,
          },
          {
            name: `전체 낮춰`,
            description: `생성된 모든 에셋과 메타데이터가 포함된 ZIP을 낮춰줍니다.`,
          },
          {
            name: `단계 카드 — 파일 열기`,
            description: `단계 완료 후 생성된 이미지를 새 탭에서 엽니다.`,
          },
          {
            name: `단계 카드 — 다시 시도`,
            description: `실패한 단계를 재시도하거나 성공한 단계를 반복합니다.`,
          },
        ],
        parameters:
[
          {
            name: `AI 병렬 처리`,
            description: `AI 생성 단계를 병렬로 실행하여 총 시간을 크게 단축합니다.`,
            tips: `병렬 처리를 활성화하면 API 비용이 증가할 수 있습니다.`,
          },
          {
            name: `프롬프트 재정의 — 생각 표현`,
            description: `'생각' 표현 생성 프롬프트를 재정의합니다.`,
          },
          {
            name: `프롬프트 재정의 — 놀람 표현`,
            description: `'놀람' 표현 생성 프롬프트를 재정의합니다.`,
          },
          {
            name: `프롬프트 재정의 — 화남 표현`,
            description: `'화남' 표현 생성 프롬프트를 재정의합니다.`,
          },
          {
            name: `프롬프트 재정의 — CG01`,
            description: `첫 번째 CG 장면 프롬프트를 재정의합니다.`,
          },
          {
            name: `입력 이미지`,
            description: `워크플로우의 원본 이미지입니다. PNG와 JPG만 지원됩니다.`,
            tips: `권장 크기는 1024×1024 ~ 2048×2048입니다.`,
          },
          {
            name: `워크플로우 ID`,
            description: `읽기 전용 고유 식별자입니다.`,
            tips: `백엔드 로그에서 해당 레코드를 검색하려면 이 ID를 복사하세요.`,
          },
          {
            name: `차단 제공자`,
            description: `읽기 전용 배경 제거 엔진 이름입니다.`,
          },
        ],
        errors:
[
          {
            code: `API_KEY_MISSING`,
            message: `워크플로우를 시작한 직후 오류가 발생하고 API Key가 설정되지 않았습니다`,
            severity: `critical`,
            category: `A. API 및 네트워크`,
            location: `페이지: paper2gal → 영역: 상단 메시지 패널/우측 오류 패널`,
            cause: `'설정 → API'에서 API Key가 설정되지 않았거나 Key가 지워졌습니다.`,
            solution: `설정 패널에서 유효한 API Key를 설정하세요.`,
            steps:
[
              `우측 상단 '설정 열기' 클릭`,
              `'API' 탭으로 전환`,
              `유효한 Key 입력`,
              `저장`,
              `돌아가 '시작'을 다시 클릭`,
            ],
            relatedCodes:
[
              `API_KEY_EXPIRED`,
              `401_UNAUTHORIZED`,
            ],
            prevention: `처음 온라인 도구를 사용할 때 반드시 유효한 API Key를 설정하세요.`,
          },
          {
            code: `HOSTED_API_REQUIRED`,
            message: `'현재 환경은 정적 호스팅이며 사용자 정의 API를 설정해야 합니다'`,
            severity: `critical`,
            category: `A. API 및 네트워크`,
            location: `페이지: paper2gal → 영역: 상단 메시지 패널`,
            cause: `페이지가 정적 호스팅 환경에 배포되어 있어 로컬 백엔드에 직접 접근할 수 없습니다.`,
            solution: `설정에서 원격 API 주소를 설정하세요.`,
            steps:
[
              `'설정 → API' 열기`,
              `'인터페이스 모드'를 '사용자 정의 API'로 전환`,
              `백엔드 루트 주소 입력`,
              `API Key 입력`,
              `저장 후 다시 시도`,
            ],
            relatedCodes:
[
              `API_KEY_MISSING`,
              `BACKEND_UNAVAILABLE`,
            ],
            prevention: `정적 환경에서 paper2gal을 사용하기 전에 백엔드를 배포하고 API 주소를 설정하세요.`,
          },
          {
            code: `P2G_WORKFLOW_ERROR`,
            message: `오류 패널에 'P2G_WORKFLOW_ERROR'가 표시됩니다`,
            severity: `error`,
            category: `E. 워크플로우 및 변환`,
            location: `페이지: paper2gal → 영역: 상단 메시지 패널/우측 오류 패널`,
            cause: `Paper2Gal 워크플로우 단계가 실패했습니다. 입력 검증 실패, 모델 사용 불가, API Key 만료, 콘텐츠 필터링, 네트워크 중단 등이 원인일 수 있습니다.`,
            solution: `오류 세부 정보를 기반으로 단계별로 문제를 해결하세요.`,
            steps:
[
              `오류 세부 정보 읽기`,
              `이미지가 유효한 PNG/JPG인지 확인`,
              `네트워크 연결 확인`,
              `프롬프트 재정의의 민감한 단어 변경`,
              `백엔드가 정상적으로 실행 중인지 확인`,
              `실패한 단계를 다시 시도하거나 워크플로우를 초기화`,
            ],
            relatedCodes:
[
              `API_KEY_MISSING`,
              `API_KEY_EXPIRED`,
              `MODEL_NOT_FOUND`,
              `PROMPT_BLOCKED`,
              `WORKFLOW_STEP_FAILED`,
            ],
            prevention: `시작 전 이미지 유효성, 네트워크 안정성, 프롬프트 민감 단어 없음, API Key 유효성을 확인하세요.`,
          },
        ],
      },
      {
        id: `image-converter`,
        title: `이미지 형식 변환기`,
        overview: `이미지를 업로드하여 PNG 또는 JPG 형식으로 변환하는 순수 프론트엔드 도구입니다. 밝기, 대비, 채도, 흐림, 색조 회전, 흑백 등 6가지 필터 설정을 지원합니다. 모든 처리는 브라우저에서 로컬로 수행됩니다.`,
        buttons:
[
          {
            name: `이미지 선택`,
            description: `이미지 파일을 업로드합니다. PNG, JPG, WEBP를 지원합니다.`,
          },
          {
            name: `변환`,
            description: `모든 필터 매개변수를 적용하고 출력 이미지를 생성합니다.`,
          },
          {
            name: `결과 낮춰`,
            description: `변환된 이미지를 로컬로 낮춰줍니다.`,
          },
          {
            name: `초기화`,
            description: `업로드한 이미지와 결과를 지우고 모든 필터 매개변수를 기본값으로 재설정합니다.`,
          },
        ],
        parameters:
[
          {
            name: `출력 형식`,
            description: `출력 이미지의 MIME 유형: image/png 또는 image/jpeg.`,
            tips: `PNG는 투명 채널을 지원하지만 파일이 더 큽니다. JPG는 파일이 작지만 투명도를 지원하지 않습니다.`,
          },
          {
            name: `품질`,
            description: `JPG 출력 압축 품질. 범위 10~100. JPG 형식에만 적용됩니다.`,
            tips: `90~95가 품질과 파일 크기 간의 최적 균형입니다.`,
          },
          {
            name: `최대 너비`,
            description: `출력 이미지의 최대 너비(픽셀). 원본이 더 넓으면 비율에 맞게 축소됩니다.`,
            tips: `2048이 대부분의 소셜 플랫폼 업로드 요구사항을 충족합니다.`,
          },
          {
            name: `최대 높이`,
            description: `출력 이미지의 최대 높이(픽셀).`,
          },
          {
            name: `종횡비 유지`,
            description: `크기 조정 시 원본 종횡비를 유지할지 여부.`,
            tips: `항상 활성화하여 이미지 왜곡을 피하는 것이 좋습니다.`,
          },
          {
            name: `밝기`,
            description: `이미지 전체 밝기를 조정합니다. 범위 0~200, 100이 원본입니다.`,
            tips: `50 이하로 낮추면 눈에 띄게 어두워지고 150 이상으로 높이면 과노출되어 디테일이 손실될 수 있습니다.`,
          },
          {
            name: `대비`,
            description: `이미지 대비를 조정합니다. 범위 0~200, 100이 원본입니다.`,
            tips: `더 높은 값은 더 강한 명암 대비를 주어 선을 강조하는 데 좋습니다.`,
          },
        ],
        errors:
[
          {
            code: `CONVERT_ERROR`,
            message: `오류 패널에 'CONVERT_ERROR'가 표시됩니다`,
            severity: `error`,
            category: `E. 워크플로우 및 변환`,
            location: `페이지: 이미지 형식 변환기 → 영역: 우측 오류 패널`,
            cause: `이미지 변환 중 예외가 발생했습니다. 원본 이미지가 손상되었거나 브라우저가 Canvas 2D 필터를 지원하지 않거나 메모리가 부족할 수 있습니다.`,
            solution: `이미지와 브라우저 호환성을 확인하세요.`,
            steps:
[
              `원본 이미지가 브라우저에서 정상적으로 열리는지 확인`,
              `페이지 새로고침 후 다시 업로드`,
              `이미지가 너무 큰지 확인`,
              `필터를 하나씩 끄면서 지원되지 않는 필터 찾기`,
              `다른 브라우저 시도`,
            ],
            relatedCodes:
[
              `FILE_CORRUPTED`,
              `DEVICE_MEMORY_LOW`,
            ],
            prevention: `변환 전 이미지가 브라우저에서 정상적으로 열리는지 확인하세요. 동시에 너무 많은 필터를 켜지 마세요.`,
          },
        ],
      },
      {
        id: `settings-guide`,
        title: `설정 패널 가이드`,
        overview:
          `설정 패널은 OC Maker의 핵심 설정 입구로, 외관, 언어, API, 오디오, 애니메이션, 단축키, 성능 및 기타 설정을 포괄합니다. 모든 변경 사항은 즉시 적용되며 브라우저 localStorage에 자동 저장됩니다.\n\n설정 패널은 여러 탭으로 구분됩니다. 「스타일」은 테마, 색상, 글꼴을 제어하고, 「언어」는 인터페이스 언어를 전환하고, 「API」는 백엔드 연결을 관리하고, 「오디오」는 BGM과 SFX를 조절하고, 「애니메이션」은 동작 효과를 제어하고, 「단축키」는 키보드 동작을 사용자 정의하고, 「성능」은 저사양 기기의 경험을 최적화하고, 「기타」는 툴팁, 확인 대화상자, 자동 저장 등을 포함합니다.`,
        buttons: [
          { name: `스타일 프리셋 저장`, description: `현재 테마, 색상, 글꼴 조합을 사용자 정의 프리셋으로 저장하여 나중에 원클릭으로 전환할 수 있습니다.` },
          { name: `프리셋 적용`, description: `저장된 프리셋 목록에서 선택하여 모든 스타일 설정을 즉시 적용합니다.` },
          { name: `모든 설정 초기화`, description: `모든 탭의 설정을 기본값으로 복원합니다. 실수 방지를 위해 이중 확인이 필요합니다.` },
          { name: `기본값 복원`, description: `현재 탭의 설정만 기본값으로 복원하며 다른 탭에는 영향을 주지 않습니다.` },
        ],
        parameters: [
          { name: `테마 모드`, description: `라이트 모드는 주간 사용에 적합하고, 다크 모드는 야간 눈 피로를 줄입니다.` },
          { name: `강조색`, description: `버튼, 링크, 진행률 표시줄, 선택 상태 등에 영향을 주는 인터페이스 메인 색상입니다.` },
          { name: `글꼴`, description: `고딕, 둥근 고딕, 명조, 고정폭, 흑체, 송체, 해체 등 11가지 글꼴 중 선택합니다.` },
          { name: `인터페이스 언어`, description: `30가지 언어를 지원하며 전환 후 즉시 적용됩니다.` },
          { name: `API 모드`, description: `「내장 모드」는 백엔드에 구성된 Plato 서비스를 사용합니다. 「사용자 지정 API」는 자체 OpenAI 호환 엔드포인트를 사용합니다.` },
          { name: `마스터 볼륨`, description: `BGM과 SFX 모두에 영향을 주는 전역 볼륨 배율입니다. 0으로 설정하면 완전히 음소거됩니다.` },
          { name: `애니메이션 활성화`, description: `전역 애니메이션 마스터 스위치입니다. 꺼지면 모든 UI 애니메이션이 비활성화됩니다.` },
          { name: `고대비 포커스`, description: `키보드 포커스 표시기의 가시성을 향상시켜 키보드 탐색 및 접근성을 개선합니다.` },
          { name: `오류 패널`, description: `워크플로우 페이지에서 오류가 발생할 때 드래그 가능한 오류 상세 패널을 표시할지 여부입니다.` },
        ],
        errors: [
          {
            code: `SETTINGS_SAVE_FAILED`,
            message: `설정 저장 실패`,
            severity: `warning`,
            category: `B. 설정 및 데이터`,
            location: `설정 패널 → 임의 탭`,
            cause: `브라우저 localStorage 공간 부족, 저장 비활성화 또는 데이터 직렬화 실패입니다.`,
            solution: `브라우저 캐시와 localStorage를 지우거나 프라이버시 모드 설정을 확인하세요.`,
            steps: [
              `DevTools → Application → Local Storage를 열고 오래된 oc-maker 키를 삭제하세요.`,
              `「타사 쿠키 차단」 또는 유사한 개인 정보 보호 설정을 비활성화한 후 다시 시도하세요.`,
            ],
            relatedCodes: [`LOCAL_STORAGE_VERSION_MISMATCH`, `CONFIG_CORRUPTED`],
          },
        ],
      },
      {
        id: `audio-guide`,
        title: `오디오 시스템 가이드`,
        overview:
          `OC Maker의 오디오 시스템은 Web Audio API를 기반으로 구축되어 풍부한 상호작용 효과음(SFX)과 배경음악(BGM)을 제공합니다. 15가지 이상의 SFX 프리셋, 20가지 이상의 BGM 프리셋과 사용자 지정 오디오 파일 업로드를 지원합니다.\n\n브라우저의 자동 재생 정책으로 인해 페이지 로드 후 오디오가 음소거 상태일 수 있습니다. 페이지의 임의 버튼이나 영역을 클릭하면 오디오 재생이 잠금 해제됩니다.`,
        buttons: [
          { name: `BGM 재생/일시정지`, description: `배경음악 재생 상태를 전환합니다. 첫 재생에는 사용자 클릭이 필요할 수 있습니다.` },
          { name: `SFX 테스트`, description: `현재 선택된 SFX 프리셋의 샘플 음을 재생하여 미리 들어봅니다.` },
          { name: `BGM 테스트`, description: `현재 선택된 BGM 프리셋의 샘플 클립을 재생하여 미리 들어봅니다.` },
        ],
        parameters: [
          { name: `마스터 볼륨`, description: `BGM과 SFX 모두에 영향을 주는 전역 볼륨 배율(0%~100%)입니다.` },
          { name: `SFX 볼륨`, description: `버튼 클릭, 호버, 성공/실패 알림 등 상호작용 효과음의 독립 볼륨입니다.` },
          { name: `BGM 볼륨`, description: `배경음악의 독립 볼륨으로 SFX 볼륨과 간섭하지 않습니다.` },
          { name: `SFX 프리셋`, description: `15가지 이상의 절차적 효과음 스타일입니다.` },
          { name: `BGM 프리셋`, description: `20가지 이상의 배경음악 스타일입니다.` },
        ],
        errors: [
          {
            code: `AUDIO_CONTEXT_SUSPENDED`,
            message: `브라우저가 오디오를 자동 일시 중지했습니다`,
            severity: `info`,
            category: `F. 브라우저 및 성능`,
            location: `임의 페이지 → 오디오 재생`,
            cause: `모던 브라우저의 자동 재생 정책은 사용자가 페이지와 상호작용할 때까지 오디오 시작을 금지합니다.`,
            solution: `페이지의 임의 위치나 버튼을 클릭하면 오디오 재생이 재개됩니다.`,
            prevention: `앱에는 attachAudioResumeHandler가 내장되어 있어 첫 사용자 상호작용 시 자동으로 AudioContext를 재개합니다.`,
          },
        ],
      },
      {
        id: `ui-ux-guide`,
        title: `인터페이스 및 경험 가이드`,
        overview:
          `OC Maker의 인터페이스 시스템은 CSS 사용자 지정 속성(CSS Variables)을 기반으로 구축되어 실시간 테마 전환, 글꼴 변경, 애니메이션 조절 및 성능 최적화를 지원합니다. 모든 외관 설정은 즉시 적용되며 페이지 새로고침이 필요하지 않습니다.\n\n테마 시스템: :root의 CSS 변수 값을 수정하여 라이트 모드와 다크 모드를 전환합니다.\n\n애니메이션 시스템: CSS 전환 및 키프레임 애니메이션을 기반으로 UI 페이드인, 버튼 호버, 페이지 전환, 모달 전환의 4계층으로 구분됩니다.\n\n성능 최적화: 저사양 기기 및 모바일 브라우저를 대상으로 애니메이션 축소, 글라스 효과 비활성화, 저해상도 미리보기, 지연 로딩, 입자 비활성화, 공격적 캐싱 등의 다운그레이드 옵션을 제공합니다.`,
        buttons: [
          { name: `테마 전환`, description: `라이트 모드와 다크 모드 간을 전환합니다. 모든 페이지 요소가 부드럽게 전환됩니다.` },
          { name: `스타일 프리셋 적용`, description: `저장된 완전한 스타일 조합(테마+색상+글꼴)을 원클릭으로 적용합니다.` },
          { name: `글꼴 변경`, description: `11가지 인터페이스 글꼴 중 선택합니다. 전환 후 모든 텍스트에 즉시 적용됩니다.` },
          { name: `애니메이션 활성화`, description: `모든 UI 애니메이션 효과(페이드인, 호버, 페이지 전환, 모달 애니메이션)를 활성화합니다.` },
          { name: `애니메이션 비활성화`, description: `모든 애니메이션을 비활성화합니다. 인터페이스 변경이 즉시 전환됩니다.` },
        ],
        parameters: [
          { name: `테마 모드`, description: `라이트 모드는 주간 및 밝은 환경에 적합합니다. 다크 모드는 야간 눈 피로와 OLED 소비 전력을 줄입니다.` },
          { name: `강조색`, description: `버튼, 진행률 표시줄, 선택 상태, 링크, 아이콘 등 하이라이트 요소에 영향을 주는 메인 색상입니다.` },
          { name: `사용자 지정 대비`, description: `인터페이스의 명암 대비를 조절합니다. 부드러움(저대비)에서 강렬함(고대비)까지 5단계.` },
          { name: `글꼴 패밀리`, description: `11가지 인터페이스 글꼴입니다.` },
          { name: `애니메이션 활성화`, description: `전역 애니메이션 마스터 스위치입니다. 꺼지면 모든 전환이 즉시 처리됩니다.` },
          { name: `애니메이션 속도`, description: `슬로우(1.5배 시간), 노멀(1배), 패스트(0.5배).` },
          { name: `고대비 포커스`, description: `키보드 포커스 표시기에 고대비 테두리를 추가하여 키보드 탐색 및 접근성을 개선합니다.` },
        ],
        errors: [
          {
            code: `THEME_CSS_LOAD_FAILED`,
            message: `테마 CSS 변수 로드 실패`,
            severity: `warning`,
            category: `B. 설정 및 데이터`,
            location: `설정 패널 → 스타일`,
            cause: `사용자 지정 테마 값을 브라우저가 구문 분석할 수 없습니다. 색상 형식이 잘못되었거나 CSS 변수 값이 오버플로되었을 수 있습니다.`,
            solution: `스타일 설정을 재설정하거나 시스템 프리셋을 선택하세요.`,
          },
          {
            code: `FONT_LOAD_FAILED`,
            message: `글꼴 로드 실패`,
            severity: `warning`,
            category: `F. 브라우저 및 성능`,
            location: `설정 패널 → 스타일 → 글꼴`,
            cause: `선택한 글꼴이 현재 시스템에 설치되어 있지 않거나, 네트워크 글꼴 로드가 시간 초과되었거나, 글꼴 파일이 브라우저 보안 정책에 의해 차단되었습니다.`,
            solution: `시스템에 설치된 글꼴을 선택하거나 네트워크 연결을 확인한 후 다시 시도하세요.`,
          },
        ],
      },
    ],
    errorDictionary:
[
      {
        id: `A`,
        name: `A. API 및 네트워크`,
        description: `API Key, 네트워크 연결, 백엔드 서비스, 요청 시간 초과, 속도 제한 및 기타 외부 종속성과 관련된 오류입니다.`,
        errors:
[
          {
            code: `API_KEY_EXPIRED`,
            message: `요청이 401을 반환하거나 Key가 유효하지 않거나 만료되었다고 표시됩니다`,
            severity: `critical`,
            category: `A. API 및 네트워크`,
            location: `페이지: 모든 온라인 도구 → 영역: 오류 패널 또는 출력 영역`,
            cause: `설정된 API Key가 만료되었거나 취소되었거나 할당량이 소진되었습니다.`,
            solution: `유효한 API Key로 교체하세요.`,
            steps:
[
              `'설정 → API' 패널 열기`,
              `현재 Key를 삭제하고 새로운 유효한 Key 입력`,
              `저장 후 다시 시도`,
            ],
            relatedCodes:
[
              `API_KEY_MISSING`,
              `401_UNAUTHORIZED`,
            ],
            prevention: `API Key의 만료일과 남은 할당량을 정기적으로 확인하세요.`,
          },
          {
            code: `API_KEY_MISSING`,
            message: `시작/보내기/생성을 누른 직후 오류가 발생하고 API Key가 설정되지 않았습니다`,
            severity: `critical`,
            category: `A. API 및 네트워크`,
            location: `페이지: 모든 온라인 도구 → 영역: 오류 패널 또는 출력 영역`,
            cause: `'설정 → API'에서 API Key가 설정되지 않았습니다.`,
            solution: `설정 패널에서 유효한 API Key를 설정하세요.`,
            steps:
[
              `우측 상단 '설정 열기' 클릭`,
              `'API' 탭으로 전환`,
              `유효한 Key 입력`,
              `'저장' 클릭`,
              `돌아가서 작업 반복`,
            ],
            relatedCodes:
[
              `API_KEY_EXPIRED`,
              `401_UNAUTHORIZED`,
            ],
            prevention: `처음 온라인 도구를 사용할 때 반드시 유효한 API Key를 설정하세요.`,
          },
          {
            code: `BACKEND_UNAVAILABLE`,
            message: `'백엔드를 사용할 수 없습니다', '서버에 연결할 수 없습니다' 또는 요청을 보낼 수 없습니다`,
            severity: `critical`,
            category: `A. API 및 네트워크`,
            location: `페이지: 모든 온라인 도구 → 영역: 오류 패널`,
            cause: `백엔드 서버가 실행 중이지 않거나 충돌했거나 설정된 API Base URL이 잘못되었습니다.`,
            solution: `백엔드 서비스 상태와 API 설정을 확인하세요.`,
            steps:
[
              `브라우저 DevTools → Network 열기`,
              `작업을 반복하고 요청 상태를 확인`,
              `요청이 전송되지 않은 경우 '설정 → API → API Base URL' 확인`,
              `502/503인 경우 관리자에게 문의`,
              `로컬 배포 시 프로세스가 실행 중인지 확인`,
            ],
            relatedCodes:
[
              `NETWORK_DISCONNECTED`,
              `502_BAD_GATEWAY`,
              `503_SERVICE_UNAVAILABLE`,
            ],
            prevention: `로컬 배포 시 백엔드 프로세스를 실행하세요. 원격 서비스를 사용할 때 URL을 확인하세요.`,
          },
        
          {
            code: `API_001`,
            message: `연결 시간 초과 오류가 발생했습니다 (API_001).`,
            severity: `critical`,
            category: `A. API 및 네트워크`,
            location: `페이지: 얼굴 만들기 → 영역: 버튼`,
            cause: `네트워크 연결이 불안정하거나 끊어졌습니다.`,
            solution: `네트워크 연결을 확인하고 다시 시도하세요.`,
            steps:
[
              `확인 단계를 수행하세요.`,
              `수정 작업을 진행하세요.`,
              `저장 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `API_002`,
              `API_003`
            ],
            prevention: `네트워크 상태를 정기적으로 모니터링하고 안정적인 연결을 유지하세요. API Key의 유효 기간과 할당량을 주기적으로 확인하세요.`,
          },
          {
            code: `API_002`,
            message: `네트워크 불안정 오류가 발생했습니다 (API_002).`,
            severity: `error`,
            category: `A. API 및 네트워크`,
            location: `페이지: 스타일 변환 → 영역: 입력`,
            cause: `서버가 과부하 상태입니다.`,
            solution: `잠시 후 다시 시도하세요.`,
            steps:
[
              `진단 단계를 수행하세요.`,
              `조정 작업을 진행하세요.`,
              `적용 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `API_003`,
              `API_004`
            ],
            prevention: `네트워크 상태를 정기적으로 모니터링하고 안정적인 연결을 유지하세요. API Key의 유효 기간과 할당량을 주기적으로 확인하세요.`,
          },
          {
            code: `API_003`,
            message: `DNS 확인 실패 오류가 발생했습니다 (API_003).`,
            severity: `warning`,
            category: `A. API 및 네트워크`,
            location: `페이지: 프롬프트 → 영역: 출력`,
            cause: `DNS 설정이 잘못되었습니다.`,
            solution: `DNS 설정을 확인하세요.`,
            steps:
[
              `분석 단계를 수행하세요.`,
              `변경 작업을 진행하세요.`,
              `확인 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `API_004`,
              `API_005`
            ],
            prevention: `네트워크 상태를 정기적으로 모니터링하고 안정적인 연결을 유지하세요. API Key의 유효 기간과 할당량을 주기적으로 확인하세요.`,
          },
          {
            code: `API_004`,
            message: `SSL 인증서 오류 오류가 발생했습니다 (API_004).`,
            severity: `info`,
            category: `A. API 및 네트워크`,
            location: `페이지: LLM → 영역: 패널`,
            cause: `SSL 인증서가 만료되었습니다.`,
            solution: `프록시 설정을 확인하세요.`,
            steps:
[
              `검사 단계를 수행하세요.`,
              `업데이트 작업을 진행하세요.`,
              `테스트 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `API_005`,
              `API_006`
            ],
            prevention: `네트워크 상태를 정기적으로 모니터링하고 안정적인 연결을 유지하세요. API Key의 유효 기간과 할당량을 주기적으로 확인하세요.`,
          },
          {
            code: `API_005`,
            message: `프록시 연결 실패 오류가 발생했습니다 (API_005).`,
            severity: `critical`,
            category: `A. API 및 네트워크`,
            location: `페이지: TTS → 영역: 캔버스`,
            cause: `프록시 설정이 올바르지 않습니다.`,
            solution: `방화벽 규칙을 확인하세요.`,
            steps:
[
              `테스트 단계를 수행하세요.`,
              `재설정 작업을 진행하세요.`,
              `검증 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `API_006`,
              `API_007`
            ],
            prevention: `네트워크 상태를 정기적으로 모니터링하고 안정적인 연결을 유지하세요. API Key의 유효 기간과 할당량을 주기적으로 확인하세요.`,
          },
          {
            code: `API_006`,
            message: `방화벽 차단 오류가 발생했습니다 (API_006).`,
            severity: `error`,
            category: `A. API 및 네트워크`,
            location: `페이지: paper2gal → 영역: 버튼`,
            cause: `네트워크 연결이 불안정하거나 끊어졌습니다.`,
            solution: `네트워크 연결을 확인하고 다시 시도하세요.`,
            steps:
[
              `확인 단계를 수행하세요.`,
              `수정 작업을 진행하세요.`,
              `저장 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `API_007`,
              `API_008`
            ],
            prevention: `네트워크 상태를 정기적으로 모니터링하고 안정적인 연결을 유지하세요. API Key의 유효 기간과 할당량을 주기적으로 확인하세요.`,
          },
          {
            code: `API_007`,
            message: `라우터 재설정 필요 오류가 발생했습니다 (API_007).`,
            severity: `warning`,
            category: `A. API 및 네트워크`,
            location: `페이지: 이미지 변환 → 영역: 입력`,
            cause: `서버가 과부하 상태입니다.`,
            solution: `잠시 후 다시 시도하세요.`,
            steps:
[
              `진단 단계를 수행하세요.`,
              `조정 작업을 진행하세요.`,
              `적용 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `API_008`,
              `API_009`
            ],
            prevention: `네트워크 상태를 정기적으로 모니터링하고 안정적인 연결을 유지하세요. API Key의 유효 기간과 할당량을 주기적으로 확인하세요.`,
          },
          {
            code: `API_008`,
            message: `대역폭 초과 오류가 발생했습니다 (API_008).`,
            severity: `info`,
            category: `A. API 및 네트워크`,
            location: `페이지: 설정 → 영역: 출력`,
            cause: `DNS 설정이 잘못되었습니다.`,
            solution: `DNS 설정을 확인하세요.`,
            steps:
[
              `분석 단계를 수행하세요.`,
              `변경 작업을 진행하세요.`,
              `확인 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `API_009`,
              `API_010`
            ],
            prevention: `네트워크 상태를 정기적으로 모니터링하고 안정적인 연결을 유지하세요. API Key의 유효 기간과 할당량을 주기적으로 확인하세요.`,
          },
          {
            code: `API_009`,
            message: `서버 다운 오류가 발생했습니다 (API_009).`,
            severity: `critical`,
            category: `A. API 및 네트워크`,
            location: `페이지: 오디오 → 영역: 패널`,
            cause: `SSL 인증서가 만료되었습니다.`,
            solution: `프록시 설정을 확인하세요.`,
            steps:
[
              `검사 단계를 수행하세요.`,
              `업데이트 작업을 진행하세요.`,
              `테스트 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `API_010`,
              `API_001`
            ],
            prevention: `네트워크 상태를 정기적으로 모니터링하고 안정적인 연결을 유지하세요. API Key의 유효 기간과 할당량을 주기적으로 확인하세요.`,
          },
          {
            code: `API_010`,
            message: `로드 밸런서 오류 오류가 발생했습니다 (API_010).`,
            severity: `error`,
            category: `A. API 및 네트워크`,
            location: `페이지: UI → 영역: 캔버스`,
            cause: `프록시 설정이 올바르지 않습니다.`,
            solution: `방화벽 규칙을 확인하세요.`,
            steps:
[
              `테스트 단계를 수행하세요.`,
              `재설정 작업을 진행하세요.`,
              `검증 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `API_001`,
              `API_002`
            ],
            prevention: `네트워크 상태를 정기적으로 모니터링하고 안정적인 연결을 유지하세요. API Key의 유효 기간과 할당량을 주기적으로 확인하세요.`,
          },
          {
            code: `API_011`,
            message: `연결 시간 초과 오류가 발생했습니다 (API_011).`,
            severity: `warning`,
            category: `A. API 및 네트워크`,
            location: `페이지: 얼굴 만들기 → 영역: 버튼`,
            cause: `네트워크 연결이 불안정하거나 끊어졌습니다.`,
            solution: `네트워크 연결을 확인하고 다시 시도하세요.`,
            steps:
[
              `확인 단계를 수행하세요.`,
              `수정 작업을 진행하세요.`,
              `저장 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `API_002`,
              `API_003`
            ],
            prevention: `네트워크 상태를 정기적으로 모니터링하고 안정적인 연결을 유지하세요. API Key의 유효 기간과 할당량을 주기적으로 확인하세요.`,
          },
          {
            code: `API_012`,
            message: `네트워크 불안정 오류가 발생했습니다 (API_012).`,
            severity: `info`,
            category: `A. API 및 네트워크`,
            location: `페이지: 스타일 변환 → 영역: 입력`,
            cause: `서버가 과부하 상태입니다.`,
            solution: `잠시 후 다시 시도하세요.`,
            steps:
[
              `진단 단계를 수행하세요.`,
              `조정 작업을 진행하세요.`,
              `적용 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `API_003`,
              `API_004`
            ],
            prevention: `네트워크 상태를 정기적으로 모니터링하고 안정적인 연결을 유지하세요. API Key의 유효 기간과 할당량을 주기적으로 확인하세요.`,
          },
          {
            code: `API_013`,
            message: `DNS 확인 실패 오류가 발생했습니다 (API_013).`,
            severity: `critical`,
            category: `A. API 및 네트워크`,
            location: `페이지: 프롬프트 → 영역: 출력`,
            cause: `DNS 설정이 잘못되었습니다.`,
            solution: `DNS 설정을 확인하세요.`,
            steps:
[
              `분석 단계를 수행하세요.`,
              `변경 작업을 진행하세요.`,
              `확인 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `API_004`,
              `API_005`
            ],
            prevention: `네트워크 상태를 정기적으로 모니터링하고 안정적인 연결을 유지하세요. API Key의 유효 기간과 할당량을 주기적으로 확인하세요.`,
          },
          {
            code: `API_014`,
            message: `SSL 인증서 오류 오류가 발생했습니다 (API_014).`,
            severity: `error`,
            category: `A. API 및 네트워크`,
            location: `페이지: LLM → 영역: 패널`,
            cause: `SSL 인증서가 만료되었습니다.`,
            solution: `프록시 설정을 확인하세요.`,
            steps:
[
              `검사 단계를 수행하세요.`,
              `업데이트 작업을 진행하세요.`,
              `테스트 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `API_005`,
              `API_006`
            ],
            prevention: `네트워크 상태를 정기적으로 모니터링하고 안정적인 연결을 유지하세요. API Key의 유효 기간과 할당량을 주기적으로 확인하세요.`,
          },
          {
            code: `API_015`,
            message: `프록시 연결 실패 오류가 발생했습니다 (API_015).`,
            severity: `warning`,
            category: `A. API 및 네트워크`,
            location: `페이지: TTS → 영역: 캔버스`,
            cause: `프록시 설정이 올바르지 않습니다.`,
            solution: `방화벽 규칙을 확인하세요.`,
            steps:
[
              `테스트 단계를 수행하세요.`,
              `재설정 작업을 진행하세요.`,
              `검증 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `API_006`,
              `API_007`
            ],
            prevention: `네트워크 상태를 정기적으로 모니터링하고 안정적인 연결을 유지하세요. API Key의 유효 기간과 할당량을 주기적으로 확인하세요.`,
          },
          {
            code: `API_016`,
            message: `방화벽 차단 오류가 발생했습니다 (API_016).`,
            severity: `info`,
            category: `A. API 및 네트워크`,
            location: `페이지: paper2gal → 영역: 버튼`,
            cause: `네트워크 연결이 불안정하거나 끊어졌습니다.`,
            solution: `네트워크 연결을 확인하고 다시 시도하세요.`,
            steps:
[
              `확인 단계를 수행하세요.`,
              `수정 작업을 진행하세요.`,
              `저장 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `API_007`,
              `API_008`
            ],
            prevention: `네트워크 상태를 정기적으로 모니터링하고 안정적인 연결을 유지하세요. API Key의 유효 기간과 할당량을 주기적으로 확인하세요.`,
          },
          {
            code: `API_017`,
            message: `라우터 재설정 필요 오류가 발생했습니다 (API_017).`,
            severity: `critical`,
            category: `A. API 및 네트워크`,
            location: `페이지: 이미지 변환 → 영역: 입력`,
            cause: `서버가 과부하 상태입니다.`,
            solution: `잠시 후 다시 시도하세요.`,
            steps:
[
              `진단 단계를 수행하세요.`,
              `조정 작업을 진행하세요.`,
              `적용 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `API_008`,
              `API_009`
            ],
            prevention: `네트워크 상태를 정기적으로 모니터링하고 안정적인 연결을 유지하세요. API Key의 유효 기간과 할당량을 주기적으로 확인하세요.`,
          },
          {
            code: `API_018`,
            message: `대역폭 초과 오류가 발생했습니다 (API_018).`,
            severity: `error`,
            category: `A. API 및 네트워크`,
            location: `페이지: 설정 → 영역: 출력`,
            cause: `DNS 설정이 잘못되었습니다.`,
            solution: `DNS 설정을 확인하세요.`,
            steps:
[
              `분석 단계를 수행하세요.`,
              `변경 작업을 진행하세요.`,
              `확인 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `API_009`,
              `API_010`
            ],
            prevention: `네트워크 상태를 정기적으로 모니터링하고 안정적인 연결을 유지하세요. API Key의 유효 기간과 할당량을 주기적으로 확인하세요.`,
          },
          {
            code: `API_019`,
            message: `서버 다운 오류가 발생했습니다 (API_019).`,
            severity: `warning`,
            category: `A. API 및 네트워크`,
            location: `페이지: 오디오 → 영역: 패널`,
            cause: `SSL 인증서가 만료되었습니다.`,
            solution: `프록시 설정을 확인하세요.`,
            steps:
[
              `검사 단계를 수행하세요.`,
              `업데이트 작업을 진행하세요.`,
              `테스트 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `API_010`,
              `API_001`
            ],
            prevention: `네트워크 상태를 정기적으로 모니터링하고 안정적인 연결을 유지하세요. API Key의 유효 기간과 할당량을 주기적으로 확인하세요.`,
          },
          {
            code: `API_020`,
            message: `로드 밸런서 오류 오류가 발생했습니다 (API_020).`,
            severity: `info`,
            category: `A. API 및 네트워크`,
            location: `페이지: UI → 영역: 캔버스`,
            cause: `프록시 설정이 올바르지 않습니다.`,
            solution: `방화벽 규칙을 확인하세요.`,
            steps:
[
              `테스트 단계를 수행하세요.`,
              `재설정 작업을 진행하세요.`,
              `검증 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `API_001`,
              `API_002`
            ],
            prevention: `네트워크 상태를 정기적으로 모니터링하고 안정적인 연결을 유지하세요. API Key의 유효 기간과 할당량을 주기적으로 확인하세요.`,
          },],
      },
      {
        id: `B`,
        name: `B. 설정 및 데이터`,
        description: `설정 가져오기/내보내기, localStorage, 데이터 손상, 저장되지 않은 변경 사항 경고와 관련된 오류입니다.`,
        errors:
[
          {
            code: `CONFIG_CORRUPTED`,
            message: `설정 불러오기가 비정상적이고 인터페이스가 불완전하게 표시되거나 기능이 작동하지 않습니다`,
            severity: `error`,
            category: `B. 설정 및 데이터`,
            location: `페이지: 모든 도구 → 영역: 전체 페이지 또는 특정 기능 영역`,
            cause: `브라우저 로컬 스토리지의 설정 데이터가 손상되었습니다.`,
            solution: `설정을 초기화하고 localStorage를 지우세요.`,
            steps:
[
              `'초기화' 버튼 클릭`,
              `대화 상자에서 확인`,
              `필요 시 Local Storage의 키 삭제`,
              `페이지 새로고침`,
            ],
            relatedCodes:
[
              `IMPORT_INVALID_JSON`,
              `STORAGE_READ_ONLY`,
            ],
            prevention: `로컬 스토리지 데이터를 수동으로 수정하지 마세요.`,
          },
          {
            code: `STORAGE_READ_ONLY`,
            message: `저장 작업이 반응하지 않고 새로고침 후 데이터가 손실됩니다`,
            severity: `critical`,
            category: `B. 설정 및 데이터`,
            location: `페이지: 모든 도구 → 영역: '저장' 버튼`,
            cause: `브라우저가 시크릿 모드이거나 localStorage가 비활성화되었거나 디스크가 꽉 찼습니다.`,
            solution: `시크릿 모드를 종료하거나 디스크 공간을 확보하세요.`,
            steps:
[
              `시크릿 모드가 아닌지 확인`,
              `디스크 공간 확인`,
              `일반 창에서 앱 열기`,
              `필요 시 '낮추기'를 대안으로 사용`,
            ],
            relatedCodes:
[
              `LOCAL_STORAGE_FULL`,
            ],
            prevention: `개인 모드에서 이 앱을 사용하지 마세요. 설정을 정기적으로 로컬 파일로 낮추세요.`,
          },
        
          {
            code: `CONFIG_001`,
            message: `설정 손상 오류가 발생했습니다 (CONFIG_001).`,
            severity: `critical`,
            category: `B. 구성 및 데이터`,
            location: `페이지: 얼굴 만들기 → 영역: 버튼`,
            cause: `설정 파일이 손상되었거나 누락되었습니다.`,
            solution: `설정을 초기화하고 다시 구성하세요.`,
            steps:
[
              `확인 단계를 수행하세요.`,
              `수정 작업을 진행하세요.`,
              `저장 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONFIG_002`,
              `CONFIG_003`
            ],
            prevention: `설정을 정기적으로 백업하고 버전 관리를 하세요. 브라우저 저장 공간을 모니터링하고 캐시를 정기적으로 정리하세요.`,
          },
          {
            code: `CONFIG_002`,
            message: `데이터베이스 접근 거부 오류가 발생했습니다 (CONFIG_002).`,
            severity: `error`,
            category: `B. 구성 및 데이터`,
            location: `페이지: 스타일 변환 → 영역: 입력`,
            cause: `브라우저 저장 공간이 가득 찼습니다.`,
            solution: `브라우저 캐시를 정리하세요.`,
            steps:
[
              `진단 단계를 수행하세요.`,
              `조정 작업을 진행하세요.`,
              `적용 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONFIG_003`,
              `CONFIG_004`
            ],
            prevention: `설정을 정기적으로 백업하고 버전 관리를 하세요. 브라우저 저장 공간을 모니터링하고 캐시를 정기적으로 정리하세요.`,
          },
          {
            code: `CONFIG_003`,
            message: `구성 파일 누락 오류가 발생했습니다 (CONFIG_003).`,
            severity: `warning`,
            category: `B. 구성 및 데이터`,
            location: `페이지: 프롬프트 → 영역: 출력`,
            cause: `구성 스키마가 업데이트되었습니다.`,
            solution: `백업에서 설정을 복원하세요.`,
            steps:
[
              `분석 단계를 수행하세요.`,
              `변경 작업을 진행하세요.`,
              `확인 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONFIG_004`,
              `CONFIG_005`
            ],
            prevention: `설정을 정기적으로 백업하고 버전 관리를 하세요. 브라우저 저장 공간을 모니터링하고 캐시를 정기적으로 정리하세요.`,
          },
          {
            code: `CONFIG_004`,
            message: `스키마 불일치 오류가 발생했습니다 (CONFIG_004).`,
            severity: `info`,
            category: `B. 구성 및 데이터`,
            location: `페이지: LLM → 영역: 패널`,
            cause: `가져오기 파일 형식이 올바르지 않습니다.`,
            solution: `파일 형식을 확인하고 다시 가져오세요.`,
            steps:
[
              `검사 단계를 수행하세요.`,
              `업데이트 작업을 진행하세요.`,
              `테스트 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONFIG_005`,
              `CONFIG_006`
            ],
            prevention: `설정을 정기적으로 백업하고 버전 관리를 하세요. 브라우저 저장 공간을 모니터링하고 캐시를 정기적으로 정리하세요.`,
          },
          {
            code: `CONFIG_005`,
            message: `백업 복원 실패 오류가 발생했습니다 (CONFIG_005).`,
            severity: `critical`,
            category: `B. 구성 및 데이터`,
            location: `페이지: TTS → 영역: 캔버스`,
            cause: `동기화 서버에 연결할 수 없습니다.`,
            solution: `수동으로 설정을 업데이트하세요.`,
            steps:
[
              `테스트 단계를 수행하세요.`,
              `재설정 작업을 진행하세요.`,
              `검증 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONFIG_006`,
              `CONFIG_007`
            ],
            prevention: `설정을 정기적으로 백업하고 버전 관리를 하세요. 브라우저 저장 공간을 모니터링하고 캐시를 정기적으로 정리하세요.`,
          },
          {
            code: `CONFIG_006`,
            message: `버전 충돌 오류가 발생했습니다 (CONFIG_006).`,
            severity: `error`,
            category: `B. 구성 및 데이터`,
            location: `페이지: paper2gal → 영역: 버튼`,
            cause: `설정 파일이 손상되었거나 누락되었습니다.`,
            solution: `설정을 초기화하고 다시 구성하세요.`,
            steps:
[
              `확인 단계를 수행하세요.`,
              `수정 작업을 진행하세요.`,
              `저장 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONFIG_007`,
              `CONFIG_008`
            ],
            prevention: `설정을 정기적으로 백업하고 버전 관리를 하세요. 브라우저 저장 공간을 모니터링하고 캐시를 정기적으로 정리하세요.`,
          },
          {
            code: `CONFIG_007`,
            message: `임포트 형식 오류 오류가 발생했습니다 (CONFIG_007).`,
            severity: `warning`,
            category: `B. 구성 및 데이터`,
            location: `페이지: 이미지 변환 → 영역: 입력`,
            cause: `브라우저 저장 공간이 가득 찼습니다.`,
            solution: `브라우저 캐시를 정리하세요.`,
            steps:
[
              `진단 단계를 수행하세요.`,
              `조정 작업을 진행하세요.`,
              `적용 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONFIG_008`,
              `CONFIG_009`
            ],
            prevention: `설정을 정기적으로 백업하고 버전 관리를 하세요. 브라우저 저장 공간을 모니터링하고 캐시를 정기적으로 정리하세요.`,
          },
          {
            code: `CONFIG_008`,
            message: `익스포트 실패 오류가 발생했습니다 (CONFIG_008).`,
            severity: `info`,
            category: `B. 구성 및 데이터`,
            location: `페이지: 설정 → 영역: 출력`,
            cause: `구성 스키마가 업데이트되었습니다.`,
            solution: `백업에서 설정을 복원하세요.`,
            steps:
[
              `분석 단계를 수행하세요.`,
              `변경 작업을 진행하세요.`,
              `확인 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONFIG_009`,
              `CONFIG_010`
            ],
            prevention: `설정을 정기적으로 백업하고 버전 관리를 하세요. 브라우저 저장 공간을 모니터링하고 캐시를 정기적으로 정리하세요.`,
          },
          {
            code: `CONFIG_009`,
            message: `캐시 손상 오류가 발생했습니다 (CONFIG_009).`,
            severity: `critical`,
            category: `B. 구성 및 데이터`,
            location: `페이지: 오디오 → 영역: 패널`,
            cause: `가져오기 파일 형식이 올바르지 않습니다.`,
            solution: `파일 형식을 확인하고 다시 가져오세요.`,
            steps:
[
              `검사 단계를 수행하세요.`,
              `업데이트 작업을 진행하세요.`,
              `테스트 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONFIG_010`,
              `CONFIG_001`
            ],
            prevention: `설정을 정기적으로 백업하고 버전 관리를 하세요. 브라우저 저장 공간을 모니터링하고 캐시를 정기적으로 정리하세요.`,
          },
          {
            code: `CONFIG_010`,
            message: `동기화 오류 오류가 발생했습니다 (CONFIG_010).`,
            severity: `error`,
            category: `B. 구성 및 데이터`,
            location: `페이지: UI → 영역: 캔버스`,
            cause: `동기화 서버에 연결할 수 없습니다.`,
            solution: `수동으로 설정을 업데이트하세요.`,
            steps:
[
              `테스트 단계를 수행하세요.`,
              `재설정 작업을 진행하세요.`,
              `검증 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONFIG_001`,
              `CONFIG_002`
            ],
            prevention: `설정을 정기적으로 백업하고 버전 관리를 하세요. 브라우저 저장 공간을 모니터링하고 캐시를 정기적으로 정리하세요.`,
          },
          {
            code: `CONFIG_011`,
            message: `설정 손상 오류가 발생했습니다 (CONFIG_011).`,
            severity: `warning`,
            category: `B. 구성 및 데이터`,
            location: `페이지: 얼굴 만들기 → 영역: 버튼`,
            cause: `설정 파일이 손상되었거나 누락되었습니다.`,
            solution: `설정을 초기화하고 다시 구성하세요.`,
            steps:
[
              `확인 단계를 수행하세요.`,
              `수정 작업을 진행하세요.`,
              `저장 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONFIG_002`,
              `CONFIG_003`
            ],
            prevention: `설정을 정기적으로 백업하고 버전 관리를 하세요. 브라우저 저장 공간을 모니터링하고 캐시를 정기적으로 정리하세요.`,
          },
          {
            code: `CONFIG_012`,
            message: `데이터베이스 접근 거부 오류가 발생했습니다 (CONFIG_012).`,
            severity: `info`,
            category: `B. 구성 및 데이터`,
            location: `페이지: 스타일 변환 → 영역: 입력`,
            cause: `브라우저 저장 공간이 가득 찼습니다.`,
            solution: `브라우저 캐시를 정리하세요.`,
            steps:
[
              `진단 단계를 수행하세요.`,
              `조정 작업을 진행하세요.`,
              `적용 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONFIG_003`,
              `CONFIG_004`
            ],
            prevention: `설정을 정기적으로 백업하고 버전 관리를 하세요. 브라우저 저장 공간을 모니터링하고 캐시를 정기적으로 정리하세요.`,
          },
          {
            code: `CONFIG_013`,
            message: `구성 파일 누락 오류가 발생했습니다 (CONFIG_013).`,
            severity: `critical`,
            category: `B. 구성 및 데이터`,
            location: `페이지: 프롬프트 → 영역: 출력`,
            cause: `구성 스키마가 업데이트되었습니다.`,
            solution: `백업에서 설정을 복원하세요.`,
            steps:
[
              `분석 단계를 수행하세요.`,
              `변경 작업을 진행하세요.`,
              `확인 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONFIG_004`,
              `CONFIG_005`
            ],
            prevention: `설정을 정기적으로 백업하고 버전 관리를 하세요. 브라우저 저장 공간을 모니터링하고 캐시를 정기적으로 정리하세요.`,
          },
          {
            code: `CONFIG_014`,
            message: `스키마 불일치 오류가 발생했습니다 (CONFIG_014).`,
            severity: `error`,
            category: `B. 구성 및 데이터`,
            location: `페이지: LLM → 영역: 패널`,
            cause: `가져오기 파일 형식이 올바르지 않습니다.`,
            solution: `파일 형식을 확인하고 다시 가져오세요.`,
            steps:
[
              `검사 단계를 수행하세요.`,
              `업데이트 작업을 진행하세요.`,
              `테스트 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONFIG_005`,
              `CONFIG_006`
            ],
            prevention: `설정을 정기적으로 백업하고 버전 관리를 하세요. 브라우저 저장 공간을 모니터링하고 캐시를 정기적으로 정리하세요.`,
          },
          {
            code: `CONFIG_015`,
            message: `백업 복원 실패 오류가 발생했습니다 (CONFIG_015).`,
            severity: `warning`,
            category: `B. 구성 및 데이터`,
            location: `페이지: TTS → 영역: 캔버스`,
            cause: `동기화 서버에 연결할 수 없습니다.`,
            solution: `수동으로 설정을 업데이트하세요.`,
            steps:
[
              `테스트 단계를 수행하세요.`,
              `재설정 작업을 진행하세요.`,
              `검증 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONFIG_006`,
              `CONFIG_007`
            ],
            prevention: `설정을 정기적으로 백업하고 버전 관리를 하세요. 브라우저 저장 공간을 모니터링하고 캐시를 정기적으로 정리하세요.`,
          },
          {
            code: `CONFIG_016`,
            message: `버전 충돌 오류가 발생했습니다 (CONFIG_016).`,
            severity: `info`,
            category: `B. 구성 및 데이터`,
            location: `페이지: paper2gal → 영역: 버튼`,
            cause: `설정 파일이 손상되었거나 누락되었습니다.`,
            solution: `설정을 초기화하고 다시 구성하세요.`,
            steps:
[
              `확인 단계를 수행하세요.`,
              `수정 작업을 진행하세요.`,
              `저장 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONFIG_007`,
              `CONFIG_008`
            ],
            prevention: `설정을 정기적으로 백업하고 버전 관리를 하세요. 브라우저 저장 공간을 모니터링하고 캐시를 정기적으로 정리하세요.`,
          },
          {
            code: `CONFIG_017`,
            message: `임포트 형식 오류 오류가 발생했습니다 (CONFIG_017).`,
            severity: `critical`,
            category: `B. 구성 및 데이터`,
            location: `페이지: 이미지 변환 → 영역: 입력`,
            cause: `브라우저 저장 공간이 가득 찼습니다.`,
            solution: `브라우저 캐시를 정리하세요.`,
            steps:
[
              `진단 단계를 수행하세요.`,
              `조정 작업을 진행하세요.`,
              `적용 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONFIG_008`,
              `CONFIG_009`
            ],
            prevention: `설정을 정기적으로 백업하고 버전 관리를 하세요. 브라우저 저장 공간을 모니터링하고 캐시를 정기적으로 정리하세요.`,
          },
          {
            code: `CONFIG_018`,
            message: `익스포트 실패 오류가 발생했습니다 (CONFIG_018).`,
            severity: `error`,
            category: `B. 구성 및 데이터`,
            location: `페이지: 설정 → 영역: 출력`,
            cause: `구성 스키마가 업데이트되었습니다.`,
            solution: `백업에서 설정을 복원하세요.`,
            steps:
[
              `분석 단계를 수행하세요.`,
              `변경 작업을 진행하세요.`,
              `확인 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONFIG_009`,
              `CONFIG_010`
            ],
            prevention: `설정을 정기적으로 백업하고 버전 관리를 하세요. 브라우저 저장 공간을 모니터링하고 캐시를 정기적으로 정리하세요.`,
          },
          {
            code: `CONFIG_019`,
            message: `캐시 손상 오류가 발생했습니다 (CONFIG_019).`,
            severity: `warning`,
            category: `B. 구성 및 데이터`,
            location: `페이지: 오디오 → 영역: 패널`,
            cause: `가져오기 파일 형식이 올바르지 않습니다.`,
            solution: `파일 형식을 확인하고 다시 가져오세요.`,
            steps:
[
              `검사 단계를 수행하세요.`,
              `업데이트 작업을 진행하세요.`,
              `테스트 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONFIG_010`,
              `CONFIG_001`
            ],
            prevention: `설정을 정기적으로 백업하고 버전 관리를 하세요. 브라우저 저장 공간을 모니터링하고 캐시를 정기적으로 정리하세요.`,
          },
          {
            code: `CONFIG_020`,
            message: `동기화 오류 오류가 발생했습니다 (CONFIG_020).`,
            severity: `info`,
            category: `B. 구성 및 데이터`,
            location: `페이지: UI → 영역: 캔버스`,
            cause: `동기화 서버에 연결할 수 없습니다.`,
            solution: `수동으로 설정을 업데이트하세요.`,
            steps:
[
              `테스트 단계를 수행하세요.`,
              `재설정 작업을 진행하세요.`,
              `검증 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONFIG_001`,
              `CONFIG_002`
            ],
            prevention: `설정을 정기적으로 백업하고 버전 관리를 하세요. 브라우저 저장 공간을 모니터링하고 캐시를 정기적으로 정리하세요.`,
          },],
      },
      {
        id: `C`,
        name: `C. 파일 및 입력`,
        description: `이미지/오디오 파일 업로드, 지원되지 않는 형식, 손상된 파일, 너무 큰 파일과 관련된 오류입니다.`,
        errors:
[
          {
            code: `FILE_FORMAT_UNSUPPORTED`,
            message: `업로드 시 '지원되지 않는 파일 형식'이 표시됩니다`,
            severity: `warning`,
            category: `C. 파일 및 입력`,
            location: `페이지: 업로드가 있는 모든 도구 → 영역: '파일 선택' 버튼`,
            cause: `도구에서 지원하지 않는 파일 형식을 선택했습니다.`,
            solution: `지원되는 형식으로 파일을 변환하세요.`,
            steps:
[
              `지원되는 형식 목록 확인`,
              `파일 변환`,
              `다시 업로드`,
            ],
            relatedCodes:
[
              `FILE_CORRUPTED`,
              `UPLOAD_FORMAT`,
            ],
          },
          {
            code: `FILE_TOO_LARGE`,
            message: `업로드 후 미리보기가 작동하지 않거나 처리 중 메모리 오류가 발생합니다`,
            severity: `warning`,
            category: `C. 파일 및 입력`,
            location: `페이지: 업로드가 있는 모든 도구 → 영역: 미리보기 영역`,
            cause: `업로드한 파일 크기가 도구 또는 브라우저 제한을 초과했습니다.`,
            solution: `업로드 전 파일을 압축하거나 축소하세요.`,
            steps:
[
              `파일 압축`,
              `이미지의 경우 최대 변을 2048 또는 4096으로 축소`,
              `오디오의 경우 샘플링 레이트 감소`,
              `다시 업로드`,
            ],
            relatedCodes:
[
              `DEVICE_MEMORY_LOW`,
              `FILE_FORMAT_UNSUPPORTED`,
            ],
          },
        
          {
            code: `CONTENT_001`,
            message: `입력 길이 초과 오류가 발생했습니다 (CONTENT_001).`,
            severity: `critical`,
            category: `C. 콘텐츠 및 입력`,
            location: `페이지: 얼굴 만들기 → 영역: 버튼`,
            cause: `입력 내용이 시스템 제한을 초과했습니다.`,
            solution: `입력 내용을 줄이고 다시 시도하세요.`,
            steps:
[
              `확인 단계를 수행하세요.`,
              `수정 작업을 진행하세요.`,
              `저장 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONTENT_002`,
              `CONTENT_003`
            ],
            prevention: `입력 내용의 길이와 형식을 사전에 확인하세요. 지원되는 파일 형식과 크기 제한을 숙지하세요.`,
          },
          {
            code: `CONTENT_002`,
            message: `지원되지 않는 형식 오류가 발생했습니다 (CONTENT_002).`,
            severity: `error`,
            category: `C. 콘텐츠 및 입력`,
            location: `페이지: 스타일 변환 → 영역: 입력`,
            cause: `파일 형식이 지원되지 않습니다.`,
            solution: `지원되는 파일 형식으로 변환하세요.`,
            steps:
[
              `진단 단계를 수행하세요.`,
              `조정 작업을 진행하세요.`,
              `적용 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONTENT_003`,
              `CONTENT_004`
            ],
            prevention: `입력 내용의 길이와 형식을 사전에 확인하세요. 지원되는 파일 형식과 크기 제한을 숙지하세요.`,
          },
          {
            code: `CONTENT_003`,
            message: `인코딩 오류 오류가 발생했습니다 (CONTENT_003).`,
            severity: `warning`,
            category: `C. 콘텐츠 및 입력`,
            location: `페이지: 프롬프트 → 영역: 출력`,
            cause: `문자 인코딩이 올바르지 않습니다.`,
            solution: `필수 필드를 모두 입력하세요.`,
            steps:
[
              `분석 단계를 수행하세요.`,
              `변경 작업을 진행하세요.`,
              `확인 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONTENT_004`,
              `CONTENT_005`
            ],
            prevention: `입력 내용의 길이와 형식을 사전에 확인하세요. 지원되는 파일 형식과 크기 제한을 숙지하세요.`,
          },
          {
            code: `CONTENT_004`,
            message: `금지된 문자 포함 오류가 발생했습니다 (CONTENT_004).`,
            severity: `info`,
            category: `C. 콘텐츠 및 입력`,
            location: `페이지: LLM → 영역: 패널`,
            cause: `필수 입력 필드가 비어 있습니다.`,
            solution: `콘텐츠를 검토하고 정책을 준수하도록 수정하세요.`,
            steps:
[
              `검사 단계를 수행하세요.`,
              `업데이트 작업을 진행하세요.`,
              `테스트 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONTENT_005`,
              `CONTENT_006`
            ],
            prevention: `입력 내용의 길이와 형식을 사전에 확인하세요. 지원되는 파일 형식과 크기 제한을 숙지하세요.`,
          },
          {
            code: `CONTENT_005`,
            message: `필수 필드 누락 오류가 발생했습니다 (CONTENT_005).`,
            severity: `critical`,
            category: `C. 콘텐츠 및 입력`,
            location: `페이지: TTS → 영역: 캔버스`,
            cause: `콘텐츠가 사용 정책을 위반했습니다.`,
            solution: `파일 크기를 줄이세요.`,
            steps:
[
              `테스트 단계를 수행하세요.`,
              `재설정 작업을 진행하세요.`,
              `검증 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONTENT_006`,
              `CONTENT_007`
            ],
            prevention: `입력 내용의 길이와 형식을 사전에 확인하세요. 지원되는 파일 형식과 크기 제한을 숙지하세요.`,
          },
          {
            code: `CONTENT_006`,
            message: `유효성 검사 실패 오류가 발생했습니다 (CONTENT_006).`,
            severity: `error`,
            category: `C. 콘텐츠 및 입력`,
            location: `페이지: paper2gal → 영역: 버튼`,
            cause: `입력 내용이 시스템 제한을 초과했습니다.`,
            solution: `입력 내용을 줄이고 다시 시도하세요.`,
            steps:
[
              `확인 단계를 수행하세요.`,
              `수정 작업을 진행하세요.`,
              `저장 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONTENT_007`,
              `CONTENT_008`
            ],
            prevention: `입력 내용의 길이와 형식을 사전에 확인하세요. 지원되는 파일 형식과 크기 제한을 숙지하세요.`,
          },
          {
            code: `CONTENT_007`,
            message: `파일 크기 초과 오류가 발생했습니다 (CONTENT_007).`,
            severity: `warning`,
            category: `C. 콘텐츠 및 입력`,
            location: `페이지: 이미지 변환 → 영역: 입력`,
            cause: `파일 형식이 지원되지 않습니다.`,
            solution: `지원되는 파일 형식으로 변환하세요.`,
            steps:
[
              `진단 단계를 수행하세요.`,
              `조정 작업을 진행하세요.`,
              `적용 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONTENT_008`,
              `CONTENT_009`
            ],
            prevention: `입력 내용의 길이와 형식을 사전에 확인하세요. 지원되는 파일 형식과 크기 제한을 숙지하세요.`,
          },
          {
            code: `CONTENT_008`,
            message: `이미지 해상도 불일치 오류가 발생했습니다 (CONTENT_008).`,
            severity: `info`,
            category: `C. 콘텐츠 및 입력`,
            location: `페이지: 설정 → 영역: 출력`,
            cause: `문자 인코딩이 올바르지 않습니다.`,
            solution: `필수 필드를 모두 입력하세요.`,
            steps:
[
              `분석 단계를 수행하세요.`,
              `변경 작업을 진행하세요.`,
              `확인 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONTENT_009`,
              `CONTENT_010`
            ],
            prevention: `입력 내용의 길이와 형식을 사전에 확인하세요. 지원되는 파일 형식과 크기 제한을 숙지하세요.`,
          },
          {
            code: `CONTENT_009`,
            message: `프롬프트 주입 감지 오류가 발생했습니다 (CONTENT_009).`,
            severity: `critical`,
            category: `C. 콘텐츠 및 입력`,
            location: `페이지: 오디오 → 영역: 패널`,
            cause: `필수 입력 필드가 비어 있습니다.`,
            solution: `콘텐츠를 검토하고 정책을 준수하도록 수정하세요.`,
            steps:
[
              `검사 단계를 수행하세요.`,
              `업데이트 작업을 진행하세요.`,
              `테스트 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONTENT_010`,
              `CONTENT_001`
            ],
            prevention: `입력 내용의 길이와 형식을 사전에 확인하세요. 지원되는 파일 형식과 크기 제한을 숙지하세요.`,
          },
          {
            code: `CONTENT_010`,
            message: `콘텐츠 정책 위반 오류가 발생했습니다 (CONTENT_010).`,
            severity: `error`,
            category: `C. 콘텐츠 및 입력`,
            location: `페이지: UI → 영역: 캔버스`,
            cause: `콘텐츠가 사용 정책을 위반했습니다.`,
            solution: `파일 크기를 줄이세요.`,
            steps:
[
              `테스트 단계를 수행하세요.`,
              `재설정 작업을 진행하세요.`,
              `검증 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONTENT_001`,
              `CONTENT_002`
            ],
            prevention: `입력 내용의 길이와 형식을 사전에 확인하세요. 지원되는 파일 형식과 크기 제한을 숙지하세요.`,
          },
          {
            code: `CONTENT_011`,
            message: `입력 길이 초과 오류가 발생했습니다 (CONTENT_011).`,
            severity: `warning`,
            category: `C. 콘텐츠 및 입력`,
            location: `페이지: 얼굴 만들기 → 영역: 버튼`,
            cause: `입력 내용이 시스템 제한을 초과했습니다.`,
            solution: `입력 내용을 줄이고 다시 시도하세요.`,
            steps:
[
              `확인 단계를 수행하세요.`,
              `수정 작업을 진행하세요.`,
              `저장 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONTENT_002`,
              `CONTENT_003`
            ],
            prevention: `입력 내용의 길이와 형식을 사전에 확인하세요. 지원되는 파일 형식과 크기 제한을 숙지하세요.`,
          },
          {
            code: `CONTENT_012`,
            message: `지원되지 않는 형식 오류가 발생했습니다 (CONTENT_012).`,
            severity: `info`,
            category: `C. 콘텐츠 및 입력`,
            location: `페이지: 스타일 변환 → 영역: 입력`,
            cause: `파일 형식이 지원되지 않습니다.`,
            solution: `지원되는 파일 형식으로 변환하세요.`,
            steps:
[
              `진단 단계를 수행하세요.`,
              `조정 작업을 진행하세요.`,
              `적용 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONTENT_003`,
              `CONTENT_004`
            ],
            prevention: `입력 내용의 길이와 형식을 사전에 확인하세요. 지원되는 파일 형식과 크기 제한을 숙지하세요.`,
          },
          {
            code: `CONTENT_013`,
            message: `인코딩 오류 오류가 발생했습니다 (CONTENT_013).`,
            severity: `critical`,
            category: `C. 콘텐츠 및 입력`,
            location: `페이지: 프롬프트 → 영역: 출력`,
            cause: `문자 인코딩이 올바르지 않습니다.`,
            solution: `필수 필드를 모두 입력하세요.`,
            steps:
[
              `분석 단계를 수행하세요.`,
              `변경 작업을 진행하세요.`,
              `확인 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONTENT_004`,
              `CONTENT_005`
            ],
            prevention: `입력 내용의 길이와 형식을 사전에 확인하세요. 지원되는 파일 형식과 크기 제한을 숙지하세요.`,
          },
          {
            code: `CONTENT_014`,
            message: `금지된 문자 포함 오류가 발생했습니다 (CONTENT_014).`,
            severity: `error`,
            category: `C. 콘텐츠 및 입력`,
            location: `페이지: LLM → 영역: 패널`,
            cause: `필수 입력 필드가 비어 있습니다.`,
            solution: `콘텐츠를 검토하고 정책을 준수하도록 수정하세요.`,
            steps:
[
              `검사 단계를 수행하세요.`,
              `업데이트 작업을 진행하세요.`,
              `테스트 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONTENT_005`,
              `CONTENT_006`
            ],
            prevention: `입력 내용의 길이와 형식을 사전에 확인하세요. 지원되는 파일 형식과 크기 제한을 숙지하세요.`,
          },
          {
            code: `CONTENT_015`,
            message: `필수 필드 누락 오류가 발생했습니다 (CONTENT_015).`,
            severity: `warning`,
            category: `C. 콘텐츠 및 입력`,
            location: `페이지: TTS → 영역: 캔버스`,
            cause: `콘텐츠가 사용 정책을 위반했습니다.`,
            solution: `파일 크기를 줄이세요.`,
            steps:
[
              `테스트 단계를 수행하세요.`,
              `재설정 작업을 진행하세요.`,
              `검증 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONTENT_006`,
              `CONTENT_007`
            ],
            prevention: `입력 내용의 길이와 형식을 사전에 확인하세요. 지원되는 파일 형식과 크기 제한을 숙지하세요.`,
          },
          {
            code: `CONTENT_016`,
            message: `유효성 검사 실패 오류가 발생했습니다 (CONTENT_016).`,
            severity: `info`,
            category: `C. 콘텐츠 및 입력`,
            location: `페이지: paper2gal → 영역: 버튼`,
            cause: `입력 내용이 시스템 제한을 초과했습니다.`,
            solution: `입력 내용을 줄이고 다시 시도하세요.`,
            steps:
[
              `확인 단계를 수행하세요.`,
              `수정 작업을 진행하세요.`,
              `저장 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONTENT_007`,
              `CONTENT_008`
            ],
            prevention: `입력 내용의 길이와 형식을 사전에 확인하세요. 지원되는 파일 형식과 크기 제한을 숙지하세요.`,
          },
          {
            code: `CONTENT_017`,
            message: `파일 크기 초과 오류가 발생했습니다 (CONTENT_017).`,
            severity: `critical`,
            category: `C. 콘텐츠 및 입력`,
            location: `페이지: 이미지 변환 → 영역: 입력`,
            cause: `파일 형식이 지원되지 않습니다.`,
            solution: `지원되는 파일 형식으로 변환하세요.`,
            steps:
[
              `진단 단계를 수행하세요.`,
              `조정 작업을 진행하세요.`,
              `적용 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONTENT_008`,
              `CONTENT_009`
            ],
            prevention: `입력 내용의 길이와 형식을 사전에 확인하세요. 지원되는 파일 형식과 크기 제한을 숙지하세요.`,
          },
          {
            code: `CONTENT_018`,
            message: `이미지 해상도 불일치 오류가 발생했습니다 (CONTENT_018).`,
            severity: `error`,
            category: `C. 콘텐츠 및 입력`,
            location: `페이지: 설정 → 영역: 출력`,
            cause: `문자 인코딩이 올바르지 않습니다.`,
            solution: `필수 필드를 모두 입력하세요.`,
            steps:
[
              `분석 단계를 수행하세요.`,
              `변경 작업을 진행하세요.`,
              `확인 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONTENT_009`,
              `CONTENT_010`
            ],
            prevention: `입력 내용의 길이와 형식을 사전에 확인하세요. 지원되는 파일 형식과 크기 제한을 숙지하세요.`,
          },
          {
            code: `CONTENT_019`,
            message: `프롬프트 주입 감지 오류가 발생했습니다 (CONTENT_019).`,
            severity: `warning`,
            category: `C. 콘텐츠 및 입력`,
            location: `페이지: 오디오 → 영역: 패널`,
            cause: `필수 입력 필드가 비어 있습니다.`,
            solution: `콘텐츠를 검토하고 정책을 준수하도록 수정하세요.`,
            steps:
[
              `검사 단계를 수행하세요.`,
              `업데이트 작업을 진행하세요.`,
              `테스트 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONTENT_010`,
              `CONTENT_001`
            ],
            prevention: `입력 내용의 길이와 형식을 사전에 확인하세요. 지원되는 파일 형식과 크기 제한을 숙지하세요.`,
          },
          {
            code: `CONTENT_020`,
            message: `콘텐츠 정책 위반 오류가 발생했습니다 (CONTENT_020).`,
            severity: `info`,
            category: `C. 콘텐츠 및 입력`,
            location: `페이지: UI → 영역: 캔버스`,
            cause: `콘텐츠가 사용 정책을 위반했습니다.`,
            solution: `파일 크기를 줄이세요.`,
            steps:
[
              `테스트 단계를 수행하세요.`,
              `재설정 작업을 진행하세요.`,
              `검증 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `CONTENT_001`,
              `CONTENT_002`
            ],
            prevention: `입력 내용의 길이와 형식을 사전에 확인하세요. 지원되는 파일 형식과 크기 제한을 숙지하세요.`,
          },],
      },
      {
        id: `D`,
        name: `D. 모델 및 생성`,
        description: `AI 모델 사용 불가, 콘텐츠 필터링, 프롬프트 너무 김, 생성 실패와 관련된 오류입니다.`,
        errors:
[
          {
            code: `MODEL_NOT_FOUND`,
            message: `백엔드가 404를 반환하고 모델을 찾을 수 없습니다`,
            severity: `error`,
            category: `D. 모델 및 생성`,
            location: `페이지: 모든 온라인 도구 → 영역: 오류 패널`,
            cause: `모델 ID가 잘못 입력되었거나 모델이 지원 중단되었습니다.`,
            solution: `모델 ID를 수정하거나 다른 모델을 선택하세요.`,
            steps:
[
              `모델 ID 철자 확인`,
              `목록에서 알려진 사용 가능한 모델 선택`,
              `사용자 정의 API 사용 시 문서 확인`,
              `다시 시도`,
            ],
            relatedCodes:
[
              `LLM_MODEL_UNAVAILABLE`,
            ],
            prevention: `목록에서 알려진 사용 가능한 모델을 선택하세요.`,
          },
          {
            code: `PROMPT_BLOCKED`,
            message: `콘텐츠가 보안 필터에 의해 차단되었습니다`,
            severity: `error`,
            category: `D. 모델 및 생성`,
            location: `페이지: 모든 AI 생성 도구 → 영역: 오류 패널`,
            cause: `프롬프트에 플랫폼 보안 정책에 의해 차단된 단어가 포함되어 있습니다.`,
            solution: `프롬프트를 수정하고 잠재적으로 문제가 되는 단어를 제거하거나 교체하세요.`,
            steps:
[
              `오류 세부 정보에서 키워드 식별`,
              `민감한 단어를 동의어로 교체`,
              `프롬프트 단순화`,
              `점진적으로 수정자 추가`,
            ],
            relatedCodes:
[
              `403_FORBIDDEN`,
            ],
            prevention: `프롬프트를 수정할 때 민감한 단어를 피하세요.`,
          },
        
          {
            code: `MODEL_001`,
            message: `모델 로딩 실패 오류가 발생했습니다 (MODEL_001).`,
            severity: `critical`,
            category: `D. 모델 및 생성`,
            location: `페이지: 얼굴 만들기 → 영역: 버튼`,
            cause: `GPU 메모리가 부족합니다.`,
            solution: `배치 크기를 줄이세요.`,
            steps:
[
              `확인 단계를 수행하세요.`,
              `수정 작업을 진행하세요.`,
              `저장 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `MODEL_002`,
              `MODEL_003`
            ],
            prevention: `GPU 메모리와 온도를 모니터링하세요. 적절한 학습 매개변수를 사용하고 정규화 이미지를 활용하세요.`,
          },
          {
            code: `MODEL_002`,
            message: `VRAM 부족 오류가 발생했습니다 (MODEL_002).`,
            severity: `error`,
            category: `D. 모델 및 생성`,
            location: `페이지: 스타일 변환 → 영역: 입력`,
            cause: `모델 파일이 손상되었습니다.`,
            solution: `VRAM을 확보하기 위해 다른 프로그램을 닫으세요.`,
            steps:
[
              `진단 단계를 수행하세요.`,
              `조정 작업을 진행하세요.`,
              `적용 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `MODEL_003`,
              `MODEL_004`
            ],
            prevention: `GPU 메모리와 온도를 모니터링하세요. 적절한 학습 매개변수를 사용하고 정규화 이미지를 활용하세요.`,
          },
          {
            code: `MODEL_003`,
            message: `CUDA 오류 오류가 발생했습니다 (MODEL_003).`,
            severity: `warning`,
            category: `D. 모델 및 생성`,
            location: `페이지: 프롬프트 → 영역: 출력`,
            cause: `학습 매개변수가 부적절합니다.`,
            solution: `학습률을 조정하세요.`,
            steps:
[
              `분석 단계를 수행하세요.`,
              `변경 작업을 진행하세요.`,
              `확인 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `MODEL_004`,
              `MODEL_005`
            ],
            prevention: `GPU 메모리와 온도를 모니터링하세요. 적절한 학습 매개변수를 사용하고 정규화 이미지를 활용하세요.`,
          },
          {
            code: `MODEL_004`,
            message: `체크포인트 손상 오류가 발생했습니다 (MODEL_004).`,
            severity: `info`,
            category: `D. 모델 및 생성`,
            location: `페이지: LLM → 영역: 패널`,
            cause: `기본 모델 버전이 호환되지 않습니다.`,
            solution: `모델 파일을 다시 다운로드하세요.`,
            steps:
[
              `검사 단계를 수행하세요.`,
              `업데이트 작업을 진행하세요.`,
              `테스트 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `MODEL_005`,
              `MODEL_006`
            ],
            prevention: `GPU 메모리와 온도를 모니터링하세요. 적절한 학습 매개변수를 사용하고 정규화 이미지를 활용하세요.`,
          },
          {
            code: `MODEL_005`,
            message: `배치 크기 초과 오류가 발생했습니다 (MODEL_005).`,
            severity: `critical`,
            category: `D. 모델 및 생성`,
            location: `페이지: TTS → 영역: 캔버스`,
            cause: `CUDA 드라이버가 오래되었습니다.`,
            solution: `CUDA 드라이버를 업데이트하세요.`,
            steps:
[
              `테스트 단계를 수행하세요.`,
              `재설정 작업을 진행하세요.`,
              `검증 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `MODEL_006`,
              `MODEL_007`
            ],
            prevention: `GPU 메모리와 온도를 모니터링하세요. 적절한 학습 매개변수를 사용하고 정규화 이미지를 활용하세요.`,
          },
          {
            code: `MODEL_006`,
            message: `학습률 너무 높음 오류가 발생했습니다 (MODEL_006).`,
            severity: `error`,
            category: `D. 모델 및 생성`,
            location: `페이지: paper2gal → 영역: 버튼`,
            cause: `GPU 메모리가 부족합니다.`,
            solution: `배치 크기를 줄이세요.`,
            steps:
[
              `확인 단계를 수행하세요.`,
              `수정 작업을 진행하세요.`,
              `저장 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `MODEL_007`,
              `MODEL_008`
            ],
            prevention: `GPU 메모리와 온도를 모니터링하세요. 적절한 학습 매개변수를 사용하고 정규화 이미지를 활용하세요.`,
          },
          {
            code: `MODEL_007`,
            message: `과적합 오류가 발생했습니다 (MODEL_007).`,
            severity: `warning`,
            category: `D. 모델 및 생성`,
            location: `페이지: 이미지 변환 → 영역: 입력`,
            cause: `모델 파일이 손상되었습니다.`,
            solution: `VRAM을 확보하기 위해 다른 프로그램을 닫으세요.`,
            steps:
[
              `진단 단계를 수행하세요.`,
              `조정 작업을 진행하세요.`,
              `적용 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `MODEL_008`,
              `MODEL_009`
            ],
            prevention: `GPU 메모리와 온도를 모니터링하세요. 적절한 학습 매개변수를 사용하고 정규화 이미지를 활용하세요.`,
          },
          {
            code: `MODEL_008`,
            message: `수렴 실패 오류가 발생했습니다 (MODEL_008).`,
            severity: `info`,
            category: `D. 모델 및 생성`,
            location: `페이지: 설정 → 영역: 출력`,
            cause: `학습 매개변수가 부적절합니다.`,
            solution: `학습률을 조정하세요.`,
            steps:
[
              `분석 단계를 수행하세요.`,
              `변경 작업을 진행하세요.`,
              `확인 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `MODEL_009`,
              `MODEL_010`
            ],
            prevention: `GPU 메모리와 온도를 모니터링하세요. 적절한 학습 매개변수를 사용하고 정규화 이미지를 활용하세요.`,
          },
          {
            code: `MODEL_009`,
            message: `추론 시간 초과 오류가 발생했습니다 (MODEL_009).`,
            severity: `critical`,
            category: `D. 모델 및 생성`,
            location: `페이지: 오디오 → 영역: 패널`,
            cause: `기본 모델 버전이 호환되지 않습니다.`,
            solution: `모델 파일을 다시 다운로드하세요.`,
            steps:
[
              `검사 단계를 수행하세요.`,
              `업데이트 작업을 진행하세요.`,
              `테스트 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `MODEL_010`,
              `MODEL_001`
            ],
            prevention: `GPU 메모리와 온도를 모니터링하세요. 적절한 학습 매개변수를 사용하고 정규화 이미지를 활용하세요.`,
          },
          {
            code: `MODEL_010`,
            message: `모델 버전 불일치 오류가 발생했습니다 (MODEL_010).`,
            severity: `error`,
            category: `D. 모델 및 생성`,
            location: `페이지: UI → 영역: 캔버스`,
            cause: `CUDA 드라이버가 오래되었습니다.`,
            solution: `CUDA 드라이버를 업데이트하세요.`,
            steps:
[
              `테스트 단계를 수행하세요.`,
              `재설정 작업을 진행하세요.`,
              `검증 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `MODEL_001`,
              `MODEL_002`
            ],
            prevention: `GPU 메모리와 온도를 모니터링하세요. 적절한 학습 매개변수를 사용하고 정규화 이미지를 활용하세요.`,
          },
          {
            code: `MODEL_011`,
            message: `모델 로딩 실패 오류가 발생했습니다 (MODEL_011).`,
            severity: `warning`,
            category: `D. 모델 및 생성`,
            location: `페이지: 얼굴 만들기 → 영역: 버튼`,
            cause: `GPU 메모리가 부족합니다.`,
            solution: `배치 크기를 줄이세요.`,
            steps:
[
              `확인 단계를 수행하세요.`,
              `수정 작업을 진행하세요.`,
              `저장 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `MODEL_002`,
              `MODEL_003`
            ],
            prevention: `GPU 메모리와 온도를 모니터링하세요. 적절한 학습 매개변수를 사용하고 정규화 이미지를 활용하세요.`,
          },
          {
            code: `MODEL_012`,
            message: `VRAM 부족 오류가 발생했습니다 (MODEL_012).`,
            severity: `info`,
            category: `D. 모델 및 생성`,
            location: `페이지: 스타일 변환 → 영역: 입력`,
            cause: `모델 파일이 손상되었습니다.`,
            solution: `VRAM을 확보하기 위해 다른 프로그램을 닫으세요.`,
            steps:
[
              `진단 단계를 수행하세요.`,
              `조정 작업을 진행하세요.`,
              `적용 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `MODEL_003`,
              `MODEL_004`
            ],
            prevention: `GPU 메모리와 온도를 모니터링하세요. 적절한 학습 매개변수를 사용하고 정규화 이미지를 활용하세요.`,
          },
          {
            code: `MODEL_013`,
            message: `CUDA 오류 오류가 발생했습니다 (MODEL_013).`,
            severity: `critical`,
            category: `D. 모델 및 생성`,
            location: `페이지: 프롬프트 → 영역: 출력`,
            cause: `학습 매개변수가 부적절합니다.`,
            solution: `학습률을 조정하세요.`,
            steps:
[
              `분석 단계를 수행하세요.`,
              `변경 작업을 진행하세요.`,
              `확인 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `MODEL_004`,
              `MODEL_005`
            ],
            prevention: `GPU 메모리와 온도를 모니터링하세요. 적절한 학습 매개변수를 사용하고 정규화 이미지를 활용하세요.`,
          },
          {
            code: `MODEL_014`,
            message: `체크포인트 손상 오류가 발생했습니다 (MODEL_014).`,
            severity: `error`,
            category: `D. 모델 및 생성`,
            location: `페이지: LLM → 영역: 패널`,
            cause: `기본 모델 버전이 호환되지 않습니다.`,
            solution: `모델 파일을 다시 다운로드하세요.`,
            steps:
[
              `검사 단계를 수행하세요.`,
              `업데이트 작업을 진행하세요.`,
              `테스트 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `MODEL_005`,
              `MODEL_006`
            ],
            prevention: `GPU 메모리와 온도를 모니터링하세요. 적절한 학습 매개변수를 사용하고 정규화 이미지를 활용하세요.`,
          },
          {
            code: `MODEL_015`,
            message: `배치 크기 초과 오류가 발생했습니다 (MODEL_015).`,
            severity: `warning`,
            category: `D. 모델 및 생성`,
            location: `페이지: TTS → 영역: 캔버스`,
            cause: `CUDA 드라이버가 오래되었습니다.`,
            solution: `CUDA 드라이버를 업데이트하세요.`,
            steps:
[
              `테스트 단계를 수행하세요.`,
              `재설정 작업을 진행하세요.`,
              `검증 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `MODEL_006`,
              `MODEL_007`
            ],
            prevention: `GPU 메모리와 온도를 모니터링하세요. 적절한 학습 매개변수를 사용하고 정규화 이미지를 활용하세요.`,
          },
          {
            code: `MODEL_016`,
            message: `학습률 너무 높음 오류가 발생했습니다 (MODEL_016).`,
            severity: `info`,
            category: `D. 모델 및 생성`,
            location: `페이지: paper2gal → 영역: 버튼`,
            cause: `GPU 메모리가 부족합니다.`,
            solution: `배치 크기를 줄이세요.`,
            steps:
[
              `확인 단계를 수행하세요.`,
              `수정 작업을 진행하세요.`,
              `저장 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `MODEL_007`,
              `MODEL_008`
            ],
            prevention: `GPU 메모리와 온도를 모니터링하세요. 적절한 학습 매개변수를 사용하고 정규화 이미지를 활용하세요.`,
          },
          {
            code: `MODEL_017`,
            message: `과적합 오류가 발생했습니다 (MODEL_017).`,
            severity: `critical`,
            category: `D. 모델 및 생성`,
            location: `페이지: 이미지 변환 → 영역: 입력`,
            cause: `모델 파일이 손상되었습니다.`,
            solution: `VRAM을 확보하기 위해 다른 프로그램을 닫으세요.`,
            steps:
[
              `진단 단계를 수행하세요.`,
              `조정 작업을 진행하세요.`,
              `적용 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `MODEL_008`,
              `MODEL_009`
            ],
            prevention: `GPU 메모리와 온도를 모니터링하세요. 적절한 학습 매개변수를 사용하고 정규화 이미지를 활용하세요.`,
          },
          {
            code: `MODEL_018`,
            message: `수렴 실패 오류가 발생했습니다 (MODEL_018).`,
            severity: `error`,
            category: `D. 모델 및 생성`,
            location: `페이지: 설정 → 영역: 출력`,
            cause: `학습 매개변수가 부적절합니다.`,
            solution: `학습률을 조정하세요.`,
            steps:
[
              `분석 단계를 수행하세요.`,
              `변경 작업을 진행하세요.`,
              `확인 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `MODEL_009`,
              `MODEL_010`
            ],
            prevention: `GPU 메모리와 온도를 모니터링하세요. 적절한 학습 매개변수를 사용하고 정규화 이미지를 활용하세요.`,
          },
          {
            code: `MODEL_019`,
            message: `추론 시간 초과 오류가 발생했습니다 (MODEL_019).`,
            severity: `warning`,
            category: `D. 모델 및 생성`,
            location: `페이지: 오디오 → 영역: 패널`,
            cause: `기본 모델 버전이 호환되지 않습니다.`,
            solution: `모델 파일을 다시 다운로드하세요.`,
            steps:
[
              `검사 단계를 수행하세요.`,
              `업데이트 작업을 진행하세요.`,
              `테스트 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `MODEL_010`,
              `MODEL_001`
            ],
            prevention: `GPU 메모리와 온도를 모니터링하세요. 적절한 학습 매개변수를 사용하고 정규화 이미지를 활용하세요.`,
          },
          {
            code: `MODEL_020`,
            message: `모델 버전 불일치 오류가 발생했습니다 (MODEL_020).`,
            severity: `info`,
            category: `D. 모델 및 생성`,
            location: `페이지: UI → 영역: 캔버스`,
            cause: `CUDA 드라이버가 오래되었습니다.`,
            solution: `CUDA 드라이버를 업데이트하세요.`,
            steps:
[
              `테스트 단계를 수행하세요.`,
              `재설정 작업을 진행하세요.`,
              `검증 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `MODEL_001`,
              `MODEL_002`
            ],
            prevention: `GPU 메모리와 온도를 모니터링하세요. 적절한 학습 매개변수를 사용하고 정규화 이미지를 활용하세요.`,
          },],
      },
      {
        id: `E`,
        name: `E. 워크플로우 및 변환`,
        description: `워크플로우 실행, 이미지 변환, 단계 실패, 워크플로우 취소와 관련된 오류입니다.`,
        errors:
[
          {
            code: `P2G_WORKFLOW_ERROR`,
            message: `Paper2Gal 워크플로우 실행 오류`,
            severity: `error`,
            category: `E. 워크플로우 및 변환`,
            location: `페이지: paper2gal → 영역: 오류 패널`,
            cause: `워크플로우 단계가 실패했습니다. 입력 검증 실패, 모델 사용 불가, Key 만료, 콘텐츠 필터링, 네트워크 중단 등이 원인일 수 있습니다.`,
            solution: `오류 세부 정보를 기반으로 단계별로 문제를 해결하세요.`,
            steps:
[
              `오류 세부 정보 읽기`,
              `PNG/JPG 이미지 확인`,
              `네트워크 확인`,
              `프롬프트 민감 단어 변경`,
              `백엔드 실행 확인`,
              `단계를 다시 시도하거나 워크플로우 초기화`,
            ],
            relatedCodes:
[
              `API_KEY_MISSING`,
              `API_KEY_EXPIRED`,
              `MODEL_NOT_FOUND`,
              `PROMPT_BLOCKED`,
            ],
            prevention: `시작 전 이미지, 네트워크, 프롬프트, API Key를 확인하세요.`,
          },
          {
            code: `STYLE_TRANSFER_REQUEST_FAILED`,
            message: `스타일 전이 요청 오류`,
            severity: `error`,
            category: `E. 워크플로우 및 변환`,
            location: `페이지: 스타일 전이 → 영역: 오류 패널`,
            cause: `백엔드 API 요청 오류. 네트워크 중단, 잘못된 API Key, 모델 사용 불가, 서버 내부 오류 등이 원인일 수 있습니다.`,
            solution: `오류 세부 정보를 기반으로 문제를 해결하세요.`,
            steps:
[
              `오류 세부 정보 확인`,
              `401: API Key 확인`,
              `404: 모델 확인`,
              `429: 대기`,
              `500/502/503: 백엔드 확인`,
              `네트워크 오류: 연결 확인`,
            ],
            relatedCodes:
[
              `API_KEY_MISSING`,
              `API_KEY_EXPIRED`,
              `MODEL_NOT_FOUND`,
              `BACKEND_UNAVAILABLE`,
            ],
            prevention: `시작 전 API Key, 네트워크, 모델 가용성을 확인하세요.`,
          },
        
          {
            code: `WORKFLOW_001`,
            message: `변환 실패 오류가 발생했습니다 (WORKFLOW_001).`,
            severity: `critical`,
            category: `E. 워크플로 및 변환`,
            location: `페이지: 얼굴 만들기 → 영역: 버튼`,
            cause: `입력 파일이 손상되었습니다.`,
            solution: `입력 파일을 확인하고 다시 시도하세요.`,
            steps:
[
              `확인 단계를 수행하세요.`,
              `수정 작업을 진행하세요.`,
              `저장 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `WORKFLOW_002`,
              `WORKFLOW_003`
            ],
            prevention: `변환 전 파일 형식과 호환성을 확인하세요. 충분한 디스크 공간을 확보하고 워크플로를 단계별로 테스트하세요.`,
          },
          {
            code: `WORKFLOW_002`,
            message: `코덱 미지원 오류가 발생했습니다 (WORKFLOW_002).`,
            severity: `error`,
            category: `E. 워크플로 및 변환`,
            location: `페이지: 스타일 변환 → 영역: 입력`,
            cause: `변환 코덱을 사용할 수 없습니다.`,
            solution: `다른 출력 형식을 선택하세요.`,
            steps:
[
              `진단 단계를 수행하세요.`,
              `조정 작업을 진행하세요.`,
              `적용 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `WORKFLOW_003`,
              `WORKFLOW_004`
            ],
            prevention: `변환 전 파일 형식과 호환성을 확인하세요. 충분한 디스크 공간을 확보하고 워크플로를 단계별로 테스트하세요.`,
          },
          {
            code: `WORKFLOW_003`,
            message: `프레임 추출 오류 오류가 발생했습니다 (WORKFLOW_003).`,
            severity: `warning`,
            category: `E. 워크플로 및 변환`,
            location: `페이지: 프롬프트 → 영역: 출력`,
            cause: `디스크 공간이 부족하여 출력할 수 없습니다.`,
            solution: `디스크 공간을 확보하세요.`,
            steps:
[
              `분석 단계를 수행하세요.`,
              `변경 작업을 진행하세요.`,
              `확인 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `WORKFLOW_004`,
              `WORKFLOW_005`
            ],
            prevention: `변환 전 파일 형식과 호환성을 확인하세요. 충분한 디스크 공간을 확보하고 워크플로를 단계별로 테스트하세요.`,
          },
          {
            code: `WORKFLOW_004`,
            message: `압축 손상 오류가 발생했습니다 (WORKFLOW_004).`,
            severity: `info`,
            category: `E. 워크플로 및 변환`,
            location: `페이지: LLM → 영역: 패널`,
            cause: `워크플로 단계 간 데이터 형식이 불일치합니다.`,
            solution: `워크플로 단계를 재구성하세요.`,
            steps:
[
              `검사 단계를 수행하세요.`,
              `업데이트 작업을 진행하세요.`,
              `테스트 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `WORKFLOW_005`,
              `WORKFLOW_006`
            ],
            prevention: `변환 전 파일 형식과 호환성을 확인하세요. 충분한 디스크 공간을 확보하고 워크플로를 단계별로 테스트하세요.`,
          },
          {
            code: `WORKFLOW_005`,
            message: `워크플로 중단 오류가 발생했습니다 (WORKFLOW_005).`,
            severity: `critical`,
            category: `E. 워크플로 및 변환`,
            location: `페이지: TTS → 영역: 캔버스`,
            cause: `필수 의존성 라이브러리가 누락되었습니다.`,
            solution: `누락된 라이브러리를 설치하세요.`,
            steps:
[
              `테스트 단계를 수행하세요.`,
              `재설정 작업을 진행하세요.`,
              `검증 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `WORKFLOW_006`,
              `WORKFLOW_007`
            ],
            prevention: `변환 전 파일 형식과 호환성을 확인하세요. 충분한 디스크 공간을 확보하고 워크플로를 단계별로 테스트하세요.`,
          },
          {
            code: `WORKFLOW_006`,
            message: `단계 건패 오류가 발생했습니다 (WORKFLOW_006).`,
            severity: `error`,
            category: `E. 워크플로 및 변환`,
            location: `페이지: paper2gal → 영역: 버튼`,
            cause: `입력 파일이 손상되었습니다.`,
            solution: `입력 파일을 확인하고 다시 시도하세요.`,
            steps:
[
              `확인 단계를 수행하세요.`,
              `수정 작업을 진행하세요.`,
              `저장 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `WORKFLOW_007`,
              `WORKFLOW_008`
            ],
            prevention: `변환 전 파일 형식과 호환성을 확인하세요. 충분한 디스크 공간을 확보하고 워크플로를 단계별로 테스트하세요.`,
          },
          {
            code: `WORKFLOW_007`,
            message: `의존성 누락 오류가 발생했습니다 (WORKFLOW_007).`,
            severity: `warning`,
            category: `E. 워크플로 및 변환`,
            location: `페이지: 이미지 변환 → 영역: 입력`,
            cause: `변환 코덱을 사용할 수 없습니다.`,
            solution: `다른 출력 형식을 선택하세요.`,
            steps:
[
              `진단 단계를 수행하세요.`,
              `조정 작업을 진행하세요.`,
              `적용 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `WORKFLOW_008`,
              `WORKFLOW_009`
            ],
            prevention: `변환 전 파일 형식과 호환성을 확인하세요. 충분한 디스크 공간을 확보하고 워크플로를 단계별로 테스트하세요.`,
          },
          {
            code: `WORKFLOW_008`,
            message: `출력 경로 오류 오류가 발생했습니다 (WORKFLOW_008).`,
            severity: `info`,
            category: `E. 워크플로 및 변환`,
            location: `페이지: 설정 → 영역: 출력`,
            cause: `디스크 공간이 부족하여 출력할 수 없습니다.`,
            solution: `디스크 공간을 확보하세요.`,
            steps:
[
              `분석 단계를 수행하세요.`,
              `변경 작업을 진행하세요.`,
              `확인 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `WORKFLOW_009`,
              `WORKFLOW_010`
            ],
            prevention: `변환 전 파일 형식과 호환성을 확인하세요. 충분한 디스크 공간을 확보하고 워크플로를 단계별로 테스트하세요.`,
          },
          {
            code: `WORKFLOW_009`,
            message: `임시 파일 삭제 실패 오류가 발생했습니다 (WORKFLOW_009).`,
            severity: `critical`,
            category: `E. 워크플로 및 변환`,
            location: `페이지: 오디오 → 영역: 패널`,
            cause: `워크플로 단계 간 데이터 형식이 불일치합니다.`,
            solution: `워크플로 단계를 재구성하세요.`,
            steps:
[
              `검사 단계를 수행하세요.`,
              `업데이트 작업을 진행하세요.`,
              `테스트 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `WORKFLOW_010`,
              `WORKFLOW_001`
            ],
            prevention: `변환 전 파일 형식과 호환성을 확인하세요. 충분한 디스크 공간을 확보하고 워크플로를 단계별로 테스트하세요.`,
          },
          {
            code: `WORKFLOW_010`,
            message: `포맷 호환성 없음 오류가 발생했습니다 (WORKFLOW_010).`,
            severity: `error`,
            category: `E. 워크플로 및 변환`,
            location: `페이지: UI → 영역: 캔버스`,
            cause: `필수 의존성 라이브러리가 누락되었습니다.`,
            solution: `누락된 라이브러리를 설치하세요.`,
            steps:
[
              `테스트 단계를 수행하세요.`,
              `재설정 작업을 진행하세요.`,
              `검증 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `WORKFLOW_001`,
              `WORKFLOW_002`
            ],
            prevention: `변환 전 파일 형식과 호환성을 확인하세요. 충분한 디스크 공간을 확보하고 워크플로를 단계별로 테스트하세요.`,
          },
          {
            code: `WORKFLOW_011`,
            message: `변환 실패 오류가 발생했습니다 (WORKFLOW_011).`,
            severity: `warning`,
            category: `E. 워크플로 및 변환`,
            location: `페이지: 얼굴 만들기 → 영역: 버튼`,
            cause: `입력 파일이 손상되었습니다.`,
            solution: `입력 파일을 확인하고 다시 시도하세요.`,
            steps:
[
              `확인 단계를 수행하세요.`,
              `수정 작업을 진행하세요.`,
              `저장 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `WORKFLOW_002`,
              `WORKFLOW_003`
            ],
            prevention: `변환 전 파일 형식과 호환성을 확인하세요. 충분한 디스크 공간을 확보하고 워크플로를 단계별로 테스트하세요.`,
          },
          {
            code: `WORKFLOW_012`,
            message: `코덱 미지원 오류가 발생했습니다 (WORKFLOW_012).`,
            severity: `info`,
            category: `E. 워크플로 및 변환`,
            location: `페이지: 스타일 변환 → 영역: 입력`,
            cause: `변환 코덱을 사용할 수 없습니다.`,
            solution: `다른 출력 형식을 선택하세요.`,
            steps:
[
              `진단 단계를 수행하세요.`,
              `조정 작업을 진행하세요.`,
              `적용 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `WORKFLOW_003`,
              `WORKFLOW_004`
            ],
            prevention: `변환 전 파일 형식과 호환성을 확인하세요. 충분한 디스크 공간을 확보하고 워크플로를 단계별로 테스트하세요.`,
          },
          {
            code: `WORKFLOW_013`,
            message: `프레임 추출 오류 오류가 발생했습니다 (WORKFLOW_013).`,
            severity: `critical`,
            category: `E. 워크플로 및 변환`,
            location: `페이지: 프롬프트 → 영역: 출력`,
            cause: `디스크 공간이 부족하여 출력할 수 없습니다.`,
            solution: `디스크 공간을 확보하세요.`,
            steps:
[
              `분석 단계를 수행하세요.`,
              `변경 작업을 진행하세요.`,
              `확인 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `WORKFLOW_004`,
              `WORKFLOW_005`
            ],
            prevention: `변환 전 파일 형식과 호환성을 확인하세요. 충분한 디스크 공간을 확보하고 워크플로를 단계별로 테스트하세요.`,
          },
          {
            code: `WORKFLOW_014`,
            message: `압축 손상 오류가 발생했습니다 (WORKFLOW_014).`,
            severity: `error`,
            category: `E. 워크플로 및 변환`,
            location: `페이지: LLM → 영역: 패널`,
            cause: `워크플로 단계 간 데이터 형식이 불일치합니다.`,
            solution: `워크플로 단계를 재구성하세요.`,
            steps:
[
              `검사 단계를 수행하세요.`,
              `업데이트 작업을 진행하세요.`,
              `테스트 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `WORKFLOW_005`,
              `WORKFLOW_006`
            ],
            prevention: `변환 전 파일 형식과 호환성을 확인하세요. 충분한 디스크 공간을 확보하고 워크플로를 단계별로 테스트하세요.`,
          },
          {
            code: `WORKFLOW_015`,
            message: `워크플로 중단 오류가 발생했습니다 (WORKFLOW_015).`,
            severity: `warning`,
            category: `E. 워크플로 및 변환`,
            location: `페이지: TTS → 영역: 캔버스`,
            cause: `필수 의존성 라이브러리가 누락되었습니다.`,
            solution: `누락된 라이브러리를 설치하세요.`,
            steps:
[
              `테스트 단계를 수행하세요.`,
              `재설정 작업을 진행하세요.`,
              `검증 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `WORKFLOW_006`,
              `WORKFLOW_007`
            ],
            prevention: `변환 전 파일 형식과 호환성을 확인하세요. 충분한 디스크 공간을 확보하고 워크플로를 단계별로 테스트하세요.`,
          },
          {
            code: `WORKFLOW_016`,
            message: `단계 건패 오류가 발생했습니다 (WORKFLOW_016).`,
            severity: `info`,
            category: `E. 워크플로 및 변환`,
            location: `페이지: paper2gal → 영역: 버튼`,
            cause: `입력 파일이 손상되었습니다.`,
            solution: `입력 파일을 확인하고 다시 시도하세요.`,
            steps:
[
              `확인 단계를 수행하세요.`,
              `수정 작업을 진행하세요.`,
              `저장 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `WORKFLOW_007`,
              `WORKFLOW_008`
            ],
            prevention: `변환 전 파일 형식과 호환성을 확인하세요. 충분한 디스크 공간을 확보하고 워크플로를 단계별로 테스트하세요.`,
          },
          {
            code: `WORKFLOW_017`,
            message: `의존성 누락 오류가 발생했습니다 (WORKFLOW_017).`,
            severity: `critical`,
            category: `E. 워크플로 및 변환`,
            location: `페이지: 이미지 변환 → 영역: 입력`,
            cause: `변환 코덱을 사용할 수 없습니다.`,
            solution: `다른 출력 형식을 선택하세요.`,
            steps:
[
              `진단 단계를 수행하세요.`,
              `조정 작업을 진행하세요.`,
              `적용 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `WORKFLOW_008`,
              `WORKFLOW_009`
            ],
            prevention: `변환 전 파일 형식과 호환성을 확인하세요. 충분한 디스크 공간을 확보하고 워크플로를 단계별로 테스트하세요.`,
          },
          {
            code: `WORKFLOW_018`,
            message: `출력 경로 오류 오류가 발생했습니다 (WORKFLOW_018).`,
            severity: `error`,
            category: `E. 워크플로 및 변환`,
            location: `페이지: 설정 → 영역: 출력`,
            cause: `디스크 공간이 부족하여 출력할 수 없습니다.`,
            solution: `디스크 공간을 확보하세요.`,
            steps:
[
              `분석 단계를 수행하세요.`,
              `변경 작업을 진행하세요.`,
              `확인 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `WORKFLOW_009`,
              `WORKFLOW_010`
            ],
            prevention: `변환 전 파일 형식과 호환성을 확인하세요. 충분한 디스크 공간을 확보하고 워크플로를 단계별로 테스트하세요.`,
          },
          {
            code: `WORKFLOW_019`,
            message: `임시 파일 삭제 실패 오류가 발생했습니다 (WORKFLOW_019).`,
            severity: `warning`,
            category: `E. 워크플로 및 변환`,
            location: `페이지: 오디오 → 영역: 패널`,
            cause: `워크플로 단계 간 데이터 형식이 불일치합니다.`,
            solution: `워크플로 단계를 재구성하세요.`,
            steps:
[
              `검사 단계를 수행하세요.`,
              `업데이트 작업을 진행하세요.`,
              `테스트 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `WORKFLOW_010`,
              `WORKFLOW_001`
            ],
            prevention: `변환 전 파일 형식과 호환성을 확인하세요. 충분한 디스크 공간을 확보하고 워크플로를 단계별로 테스트하세요.`,
          },
          {
            code: `WORKFLOW_020`,
            message: `포맷 호환성 없음 오류가 발생했습니다 (WORKFLOW_020).`,
            severity: `info`,
            category: `E. 워크플로 및 변환`,
            location: `페이지: UI → 영역: 캔버스`,
            cause: `필수 의존성 라이브러리가 누락되었습니다.`,
            solution: `누락된 라이브러리를 설치하세요.`,
            steps:
[
              `테스트 단계를 수행하세요.`,
              `재설정 작업을 진행하세요.`,
              `검증 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `WORKFLOW_001`,
              `WORKFLOW_002`
            ],
            prevention: `변환 전 파일 형식과 호환성을 확인하세요. 충분한 디스크 공간을 확보하고 워크플로를 단계별로 테스트하세요.`,
          },],
      },
      {
        id: `F`,
        name: `F. 시스템 및 권한`,
        description: `브라우저 호환성, 메모리 부족, 권한 제한, 낮추기 실패 등 시스템 수준의 문제입니다.`,
        errors:
[
          {
            code: `DEVICE_MEMORY_LOW`,
            message: `브라우저 탭이 충돌하거나 멈추거나 반응하지 않습니다`,
            severity: `critical`,
            category: `F. 시스템 및 권한`,
            location: `페이지: 모든 도구 → 영역: 전체 페이지`,
            cause: `장치 메모리가 부족하여 브라우저가 탭 프로세스를 강제 종료했습니다.`,
            solution: `다른 탭을 닫거나 데이터 크기를 줄이거나 더 많은 메모리를 가진 장치를 사용하세요.`,
            steps:
[
              `현재 작업 저장`,
              `다른 탭 닫기`,
              `이미지 크기 축소`,
              `브라우저 다시 시작`,
              `더 많은 메모리가 있는 장치 사용`,
            ],
            relatedCodes:
[
              `FILE_TOO_LARGE`,
            ],
            prevention: `큰 파일을 처리하기 전에 다른 탭을 닫으세요. 이미지를 2048로 축소하세요.`,
          },
          {
            code: `EXPORT_FAILED`,
            message: `낮추기 버튼을 누른 후 반응이 없습니다`,
            severity: `error`,
            category: `F. 시스템 및 권한`,
            location: `페이지: 모든 도구 → 영역: 낮추기 버튼`,
            cause: `브라우저가 낮추기 팝업을 차단했거나 콘텐츠가 너무 커서 Blob를 생성할 수 없습니다.`,
            solution: `브라우저 낮추기 설정을 확인하거나 분할 낮추기를 사용하세요.`,
            steps:
[
              `브라우저가 팝업을 차단하는지 확인`,
              `팝업 허용`,
              `많은 이미지가 있는 경우 일부 삭제 후 낮추기`,
              `'복사하기'를 임시 대안으로 사용`,
            ],
            relatedCodes:
[
              `DEVICE_MEMORY_LOW`,
            ],
            prevention: `브라우저 팝업을 허용하세요. 큰 문서에서는 낮추기 전 일부 이미지를 삭제하세요.`,
          },
        
          {
            code: `SYSTEM_001`,
            message: `메모리 부족 오류가 발생했습니다 (SYSTEM_001).`,
            severity: `critical`,
            category: `F. 시스템 및 권한`,
            location: `페이지: 얼굴 만들기 → 영역: 버튼`,
            cause: `시스템 메모리가 부족합니다.`,
            solution: `불필요한 프로그램을 닫고 메모리를 확보하세요.`,
            steps:
[
              `확인 단계를 수행하세요.`,
              `수정 작업을 진행하세요.`,
              `저장 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `SYSTEM_002`,
              `SYSTEM_003`
            ],
            prevention: `시스템 자원 사용량을 모니터링하고 여유 공간을 유지하세요. 필요한 권한을 미리 설정하세요.`,
          },
          {
            code: `SYSTEM_002`,
            message: `디스크 공간 부족 오류가 발생했습니다 (SYSTEM_002).`,
            severity: `error`,
            category: `F. 시스템 및 권한`,
            location: `페이지: 스타일 변환 → 영역: 입력`,
            cause: `디스크 공간이 부족합니다.`,
            solution: `디스크 공간을 정리하세요.`,
            steps:
[
              `진단 단계를 수행하세요.`,
              `조정 작업을 진행하세요.`,
              `적용 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `SYSTEM_003`,
              `SYSTEM_004`
            ],
            prevention: `시스템 자원 사용량을 모니터링하고 여유 공간을 유지하세요. 필요한 권한을 미리 설정하세요.`,
          },
          {
            code: `SYSTEM_003`,
            message: `권한 거부 오류가 발생했습니다 (SYSTEM_003).`,
            severity: `warning`,
            category: `F. 시스템 및 권한`,
            location: `페이지: 프롬프트 → 영역: 출력`,
            cause: `현재 사용자에게 필요한 권한이 없습니다.`,
            solution: `관리자 권한으로 실행하세요.`,
            steps:
[
              `분석 단계를 수행하세요.`,
              `변경 작업을 진행하세요.`,
              `확인 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `SYSTEM_004`,
              `SYSTEM_005`
            ],
            prevention: `시스템 자원 사용량을 모니터링하고 여유 공간을 유지하세요. 필요한 권한을 미리 설정하세요.`,
          },
          {
            code: `SYSTEM_004`,
            message: `프로세스 충돌 오류가 발생했습니다 (SYSTEM_004).`,
            severity: `info`,
            category: `F. 시스템 및 권한`,
            location: `페이지: LLM → 영역: 패널`,
            cause: `시스템 자원 한도에 도달했습니다.`,
            solution: `시스템 자원 한도를 늘리세요.`,
            steps:
[
              `검사 단계를 수행하세요.`,
              `업데이트 작업을 진행하세요.`,
              `테스트 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `SYSTEM_005`,
              `SYSTEM_006`
            ],
            prevention: `시스템 자원 사용량을 모니터링하고 여유 공간을 유지하세요. 필요한 권한을 미리 설정하세요.`,
          },
          {
            code: `SYSTEM_005`,
            message: `세마포어 초과 오류가 발생했습니다 (SYSTEM_005).`,
            severity: `critical`,
            category: `F. 시스템 및 권한`,
            location: `페이지: TTS → 영역: 캔버스`,
            cause: `운영 체제 버전이 지원되지 않습니다.`,
            solution: `운영 체제를 업데이트하세요.`,
            steps:
[
              `테스트 단계를 수행하세요.`,
              `재설정 작업을 진행하세요.`,
              `검증 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `SYSTEM_006`,
              `SYSTEM_007`
            ],
            prevention: `시스템 자원 사용량을 모니터링하고 여유 공간을 유지하세요. 필요한 권한을 미리 설정하세요.`,
          },
          {
            code: `SYSTEM_006`,
            message: `시스템 호출 실패 오류가 발생했습니다 (SYSTEM_006).`,
            severity: `error`,
            category: `F. 시스템 및 권한`,
            location: `페이지: paper2gal → 영역: 버튼`,
            cause: `시스템 메모리가 부족합니다.`,
            solution: `불필요한 프로그램을 닫고 메모리를 확보하세요.`,
            steps:
[
              `확인 단계를 수행하세요.`,
              `수정 작업을 진행하세요.`,
              `저장 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `SYSTEM_007`,
              `SYSTEM_008`
            ],
            prevention: `시스템 자원 사용량을 모니터링하고 여유 공간을 유지하세요. 필요한 권한을 미리 설정하세요.`,
          },
          {
            code: `SYSTEM_007`,
            message: `커널 버전 불일치 오류가 발생했습니다 (SYSTEM_007).`,
            severity: `warning`,
            category: `F. 시스템 및 권한`,
            location: `페이지: 이미지 변환 → 영역: 입력`,
            cause: `디스크 공간이 부족합니다.`,
            solution: `디스크 공간을 정리하세요.`,
            steps:
[
              `진단 단계를 수행하세요.`,
              `조정 작업을 진행하세요.`,
              `적용 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `SYSTEM_008`,
              `SYSTEM_009`
            ],
            prevention: `시스템 자원 사용량을 모니터링하고 여유 공간을 유지하세요. 필요한 권한을 미리 설정하세요.`,
          },
          {
            code: `SYSTEM_008`,
            message: `SELinux 차단 오류가 발생했습니다 (SYSTEM_008).`,
            severity: `info`,
            category: `F. 시스템 및 권한`,
            location: `페이지: 설정 → 영역: 출력`,
            cause: `현재 사용자에게 필요한 권한이 없습니다.`,
            solution: `관리자 권한으로 실행하세요.`,
            steps:
[
              `분석 단계를 수행하세요.`,
              `변경 작업을 진행하세요.`,
              `확인 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `SYSTEM_009`,
              `SYSTEM_010`
            ],
            prevention: `시스템 자원 사용량을 모니터링하고 여유 공간을 유지하세요. 필요한 권한을 미리 설정하세요.`,
          },
          {
            code: `SYSTEM_009`,
            message: `cgroups 제한 오류가 발생했습니다 (SYSTEM_009).`,
            severity: `critical`,
            category: `F. 시스템 및 권한`,
            location: `페이지: 오디오 → 영역: 패널`,
            cause: `시스템 자원 한도에 도달했습니다.`,
            solution: `시스템 자원 한도를 늘리세요.`,
            steps:
[
              `검사 단계를 수행하세요.`,
              `업데이트 작업을 진행하세요.`,
              `테스트 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `SYSTEM_010`,
              `SYSTEM_001`
            ],
            prevention: `시스템 자원 사용량을 모니터링하고 여유 공간을 유지하세요. 필요한 권한을 미리 설정하세요.`,
          },
          {
            code: `SYSTEM_010`,
            message: `oom_killer 활성화 오류가 발생했습니다 (SYSTEM_010).`,
            severity: `error`,
            category: `F. 시스템 및 권한`,
            location: `페이지: UI → 영역: 캔버스`,
            cause: `운영 체제 버전이 지원되지 않습니다.`,
            solution: `운영 체제를 업데이트하세요.`,
            steps:
[
              `테스트 단계를 수행하세요.`,
              `재설정 작업을 진행하세요.`,
              `검증 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `SYSTEM_001`,
              `SYSTEM_002`
            ],
            prevention: `시스템 자원 사용량을 모니터링하고 여유 공간을 유지하세요. 필요한 권한을 미리 설정하세요.`,
          },
          {
            code: `SYSTEM_011`,
            message: `메모리 부족 오류가 발생했습니다 (SYSTEM_011).`,
            severity: `warning`,
            category: `F. 시스템 및 권한`,
            location: `페이지: 얼굴 만들기 → 영역: 버튼`,
            cause: `시스템 메모리가 부족합니다.`,
            solution: `불필요한 프로그램을 닫고 메모리를 확보하세요.`,
            steps:
[
              `확인 단계를 수행하세요.`,
              `수정 작업을 진행하세요.`,
              `저장 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `SYSTEM_002`,
              `SYSTEM_003`
            ],
            prevention: `시스템 자원 사용량을 모니터링하고 여유 공간을 유지하세요. 필요한 권한을 미리 설정하세요.`,
          },
          {
            code: `SYSTEM_012`,
            message: `디스크 공간 부족 오류가 발생했습니다 (SYSTEM_012).`,
            severity: `info`,
            category: `F. 시스템 및 권한`,
            location: `페이지: 스타일 변환 → 영역: 입력`,
            cause: `디스크 공간이 부족합니다.`,
            solution: `디스크 공간을 정리하세요.`,
            steps:
[
              `진단 단계를 수행하세요.`,
              `조정 작업을 진행하세요.`,
              `적용 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `SYSTEM_003`,
              `SYSTEM_004`
            ],
            prevention: `시스템 자원 사용량을 모니터링하고 여유 공간을 유지하세요. 필요한 권한을 미리 설정하세요.`,
          },
          {
            code: `SYSTEM_013`,
            message: `권한 거부 오류가 발생했습니다 (SYSTEM_013).`,
            severity: `critical`,
            category: `F. 시스템 및 권한`,
            location: `페이지: 프롬프트 → 영역: 출력`,
            cause: `현재 사용자에게 필요한 권한이 없습니다.`,
            solution: `관리자 권한으로 실행하세요.`,
            steps:
[
              `분석 단계를 수행하세요.`,
              `변경 작업을 진행하세요.`,
              `확인 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `SYSTEM_004`,
              `SYSTEM_005`
            ],
            prevention: `시스템 자원 사용량을 모니터링하고 여유 공간을 유지하세요. 필요한 권한을 미리 설정하세요.`,
          },
          {
            code: `SYSTEM_014`,
            message: `프로세스 충돌 오류가 발생했습니다 (SYSTEM_014).`,
            severity: `error`,
            category: `F. 시스템 및 권한`,
            location: `페이지: LLM → 영역: 패널`,
            cause: `시스템 자원 한도에 도달했습니다.`,
            solution: `시스템 자원 한도를 늘리세요.`,
            steps:
[
              `검사 단계를 수행하세요.`,
              `업데이트 작업을 진행하세요.`,
              `테스트 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `SYSTEM_005`,
              `SYSTEM_006`
            ],
            prevention: `시스템 자원 사용량을 모니터링하고 여유 공간을 유지하세요. 필요한 권한을 미리 설정하세요.`,
          },
          {
            code: `SYSTEM_015`,
            message: `세마포어 초과 오류가 발생했습니다 (SYSTEM_015).`,
            severity: `warning`,
            category: `F. 시스템 및 권한`,
            location: `페이지: TTS → 영역: 캔버스`,
            cause: `운영 체제 버전이 지원되지 않습니다.`,
            solution: `운영 체제를 업데이트하세요.`,
            steps:
[
              `테스트 단계를 수행하세요.`,
              `재설정 작업을 진행하세요.`,
              `검증 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `SYSTEM_006`,
              `SYSTEM_007`
            ],
            prevention: `시스템 자원 사용량을 모니터링하고 여유 공간을 유지하세요. 필요한 권한을 미리 설정하세요.`,
          },
          {
            code: `SYSTEM_016`,
            message: `시스템 호출 실패 오류가 발생했습니다 (SYSTEM_016).`,
            severity: `info`,
            category: `F. 시스템 및 권한`,
            location: `페이지: paper2gal → 영역: 버튼`,
            cause: `시스템 메모리가 부족합니다.`,
            solution: `불필요한 프로그램을 닫고 메모리를 확보하세요.`,
            steps:
[
              `확인 단계를 수행하세요.`,
              `수정 작업을 진행하세요.`,
              `저장 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `SYSTEM_007`,
              `SYSTEM_008`
            ],
            prevention: `시스템 자원 사용량을 모니터링하고 여유 공간을 유지하세요. 필요한 권한을 미리 설정하세요.`,
          },
          {
            code: `SYSTEM_017`,
            message: `커널 버전 불일치 오류가 발생했습니다 (SYSTEM_017).`,
            severity: `critical`,
            category: `F. 시스템 및 권한`,
            location: `페이지: 이미지 변환 → 영역: 입력`,
            cause: `디스크 공간이 부족합니다.`,
            solution: `디스크 공간을 정리하세요.`,
            steps:
[
              `진단 단계를 수행하세요.`,
              `조정 작업을 진행하세요.`,
              `적용 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `SYSTEM_008`,
              `SYSTEM_009`
            ],
            prevention: `시스템 자원 사용량을 모니터링하고 여유 공간을 유지하세요. 필요한 권한을 미리 설정하세요.`,
          },
          {
            code: `SYSTEM_018`,
            message: `SELinux 차단 오류가 발생했습니다 (SYSTEM_018).`,
            severity: `error`,
            category: `F. 시스템 및 권한`,
            location: `페이지: 설정 → 영역: 출력`,
            cause: `현재 사용자에게 필요한 권한이 없습니다.`,
            solution: `관리자 권한으로 실행하세요.`,
            steps:
[
              `분석 단계를 수행하세요.`,
              `변경 작업을 진행하세요.`,
              `확인 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `SYSTEM_009`,
              `SYSTEM_010`
            ],
            prevention: `시스템 자원 사용량을 모니터링하고 여유 공간을 유지하세요. 필요한 권한을 미리 설정하세요.`,
          },
          {
            code: `SYSTEM_019`,
            message: `cgroups 제한 오류가 발생했습니다 (SYSTEM_019).`,
            severity: `warning`,
            category: `F. 시스템 및 권한`,
            location: `페이지: 오디오 → 영역: 패널`,
            cause: `시스템 자원 한도에 도달했습니다.`,
            solution: `시스템 자원 한도를 늘리세요.`,
            steps:
[
              `검사 단계를 수행하세요.`,
              `업데이트 작업을 진행하세요.`,
              `테스트 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `SYSTEM_010`,
              `SYSTEM_001`
            ],
            prevention: `시스템 자원 사용량을 모니터링하고 여유 공간을 유지하세요. 필요한 권한을 미리 설정하세요.`,
          },
          {
            code: `SYSTEM_020`,
            message: `oom_killer 활성화 오류가 발생했습니다 (SYSTEM_020).`,
            severity: `info`,
            category: `F. 시스템 및 권한`,
            location: `페이지: UI → 영역: 캔버스`,
            cause: `운영 체제 버전이 지원되지 않습니다.`,
            solution: `운영 체제를 업데이트하세요.`,
            steps:
[
              `테스트 단계를 수행하세요.`,
              `재설정 작업을 진행하세요.`,
              `검증 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `SYSTEM_001`,
              `SYSTEM_002`
            ],
            prevention: `시스템 자원 사용량을 모니터링하고 여유 공간을 유지하세요. 필요한 권한을 미리 설정하세요.`,
          },],
      },
      {
        id: `0`,
        name: `0~9. HTTP 상태 코드`,
        description: `HTTP 상태 코드별로 분류된 일반적인 백엔드 오류입니다.`,
        errors:
[
          {
            code: `401_UNAUTHORIZED`,
            message: `백엔드가 401 Unauthorized를 반환합니다`,
            severity: `critical`,
            category: `0~9. HTTP 상태 코드`,
            location: `페이지: 모든 온라인 도구 → 영역: 오류 패널`,
            cause: `API Key가 유효하지 않거나 만료되었거나 취소되었습니다.`,
            solution: `유효한 API Key로 교체하세요.`,
            steps:
[
              `'설정 → API' 열기`,
              `새로운 유효한 Key로 교체`,
              `저장 후 다시 시도`,
            ],
            relatedCodes:
[
              `API_KEY_EXPIRED`,
              `API_KEY_MISSING`,
            ],
            prevention: `API Key의 만료일을 정기적으로 확인하세요.`,
          },
          {
            code: `429_TOO_MANY_REQUESTS`,
            message: `백엔드가 429 Too Many Requests를 반환합니다`,
            severity: `warning`,
            category: `0~9. HTTP 상태 코드`,
            location: `페이지: 모든 온라인 도구 → 영역: 오류 패널`,
            cause: `짧은 시간에 너무 많은 요청을 보내서 공급자의 속도 제한을 초과했습니다.`,
            solution: `잠시 기다렸다가 다시 시도하세요.`,
            steps:
[
              `Retry-After 힌트 확인`,
              `30~60초 대기`,
              `요청 빈도 감소`,
            ],
            relatedCodes:
[
              `API_RATE_LIMIT`,
            ],
          },
          {
            code: `500_INTERNAL_ERROR`,
            message: `백엔드가 500 Internal Server Error를 반환합니다`,
            severity: `error`,
            category: `0~9. HTTP 상태 코드`,
            location: `페이지: 모든 온라인 도구 → 영역: 오류 패널`,
            cause: `백엔드 서비스가 요청 처리 중 내부 예외를 발생시켰습니다.`,
            solution: `잠시 후 다시 시도하거나 백엔드 관리자에게 문의하세요.`,
            steps:
[
              `1~2분 대기`,
              `요청 크기 축소`,
              `문제가 지속되면 백엔드 관리자에게 문의`,
            ],
            relatedCodes:
[
              `502_BAD_GATEWAY`,
              `503_SERVICE_UNAVAILABLE`,
            ],
            prevention: `요청 크기를 축소하세요. 서버가 높은 부하일 때 큰 작업을 보내지 마세요.`,
          },
        
          {
            code: `HTTP_001`,
            message: `400 잘못된 요청 오류가 발생했습니다 (HTTP_001).`,
            severity: `critical`,
            category: `0~9. HTTP 상태 코드`,
            location: `페이지: 얼굴 만들기 → 영역: 버튼`,
            cause: `클라이언트 요청이 잘못되었습니다.`,
            solution: `요청 매개변수를 확인하고 수정하세요.`,
            steps:
[
              `확인 단계를 수행하세요.`,
              `수정 작업을 진행하세요.`,
              `저장 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `HTTP_002`,
              `HTTP_003`
            ],
            prevention: `요청에 재시도 및 백오프 메커니즘을 구현하세요. API 속도 제한을 준수하고 캐싱을 활용하세요.`,
          },
          {
            code: `HTTP_002`,
            message: `401 인증 실패 오류가 발생했습니다 (HTTP_002).`,
            severity: `error`,
            category: `0~9. HTTP 상태 코드`,
            location: `페이지: 스타일 변환 → 영역: 입력`,
            cause: `인증 정보가 유효하지 않습니다.`,
            solution: `인증 정보를 갱신하세요.`,
            steps:
[
              `진단 단계를 수행하세요.`,
              `조정 작업을 진행하세요.`,
              `적용 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `HTTP_003`,
              `HTTP_004`
            ],
            prevention: `요청에 재시도 및 백오프 메커니즘을 구현하세요. API 속도 제한을 준수하고 캐싱을 활용하세요.`,
          },
          {
            code: `HTTP_003`,
            message: `403 접근 금지 오류가 발생했습니다 (HTTP_003).`,
            severity: `warning`,
            category: `0~9. HTTP 상태 코드`,
            location: `페이지: 프롬프트 → 영역: 출력`,
            cause: `서버에서 요청을 거부했습니다.`,
            solution: `요청 권한을 확인하세요.`,
            steps:
[
              `분석 단계를 수행하세요.`,
              `변경 작업을 진행하세요.`,
              `확인 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `HTTP_004`,
              `HTTP_005`
            ],
            prevention: `요청에 재시도 및 백오프 메커니즘을 구현하세요. API 속도 제한을 준수하고 캐싱을 활용하세요.`,
          },
          {
            code: `HTTP_004`,
            message: `404 찾을 수 없음 오류가 발생했습니다 (HTTP_004).`,
            severity: `info`,
            category: `0~9. HTTP 상태 코드`,
            location: `페이지: LLM → 영역: 패널`,
            cause: `요청한 리소스를 찾을 수 없습니다.`,
            solution: `요청한 리소스가 존재하는지 확인하세요.`,
            steps:
[
              `검사 단계를 수행하세요.`,
              `업데이트 작업을 진행하세요.`,
              `테스트 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `HTTP_005`,
              `HTTP_006`
            ],
            prevention: `요청에 재시도 및 백오프 메커니즘을 구현하세요. API 속도 제한을 준수하고 캐싱을 활용하세요.`,
          },
          {
            code: `HTTP_005`,
            message: `408 요청 시간 초과 오류가 발생했습니다 (HTTP_005).`,
            severity: `critical`,
            category: `0~9. HTTP 상태 코드`,
            location: `페이지: TTS → 영역: 캔버스`,
            cause: `서버 낭부 오류가 발생했습니다.`,
            solution: `서버 관리자에게 문의하세요.`,
            steps:
[
              `테스트 단계를 수행하세요.`,
              `재설정 작업을 진행하세요.`,
              `검증 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `HTTP_006`,
              `HTTP_007`
            ],
            prevention: `요청에 재시도 및 백오프 메커니즘을 구현하세요. API 속도 제한을 준수하고 캐싱을 활용하세요.`,
          },
          {
            code: `HTTP_006`,
            message: `409 충돌 오류가 발생했습니다 (HTTP_006).`,
            severity: `error`,
            category: `0~9. HTTP 상태 코드`,
            location: `페이지: paper2gal → 영역: 버튼`,
            cause: `클라이언트 요청이 잘못되었습니다.`,
            solution: `요청 매개변수를 확인하고 수정하세요.`,
            steps:
[
              `확인 단계를 수행하세요.`,
              `수정 작업을 진행하세요.`,
              `저장 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `HTTP_007`,
              `HTTP_008`
            ],
            prevention: `요청에 재시도 및 백오프 메커니즘을 구현하세요. API 속도 제한을 준수하고 캐싱을 활용하세요.`,
          },
          {
            code: `HTTP_007`,
            message: `422 처리할 수 없음 오류가 발생했습니다 (HTTP_007).`,
            severity: `warning`,
            category: `0~9. HTTP 상태 코드`,
            location: `페이지: 이미지 변환 → 영역: 입력`,
            cause: `인증 정보가 유효하지 않습니다.`,
            solution: `인증 정보를 갱신하세요.`,
            steps:
[
              `진단 단계를 수행하세요.`,
              `조정 작업을 진행하세요.`,
              `적용 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `HTTP_008`,
              `HTTP_009`
            ],
            prevention: `요청에 재시도 및 백오프 메커니즘을 구현하세요. API 속도 제한을 준수하고 캐싱을 활용하세요.`,
          },
          {
            code: `HTTP_008`,
            message: `429 너무 많은 요청 오류가 발생했습니다 (HTTP_008).`,
            severity: `info`,
            category: `0~9. HTTP 상태 코드`,
            location: `페이지: 설정 → 영역: 출력`,
            cause: `서버에서 요청을 거부했습니다.`,
            solution: `요청 권한을 확인하세요.`,
            steps:
[
              `분석 단계를 수행하세요.`,
              `변경 작업을 진행하세요.`,
              `확인 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `HTTP_009`,
              `HTTP_010`
            ],
            prevention: `요청에 재시도 및 백오프 메커니즘을 구현하세요. API 속도 제한을 준수하고 캐싱을 활용하세요.`,
          },
          {
            code: `HTTP_009`,
            message: `500 낭부 서버 오류 오류가 발생했습니다 (HTTP_009).`,
            severity: `critical`,
            category: `0~9. HTTP 상태 코드`,
            location: `페이지: 오디오 → 영역: 패널`,
            cause: `요청한 리소스를 찾을 수 없습니다.`,
            solution: `요청한 리소스가 존재하는지 확인하세요.`,
            steps:
[
              `검사 단계를 수행하세요.`,
              `업데이트 작업을 진행하세요.`,
              `테스트 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `HTTP_010`,
              `HTTP_001`
            ],
            prevention: `요청에 재시도 및 백오프 메커니즘을 구현하세요. API 속도 제한을 준수하고 캐싱을 활용하세요.`,
          },
          {
            code: `HTTP_010`,
            message: `502 불량 게이트웨이 오류가 발생했습니다 (HTTP_010).`,
            severity: `error`,
            category: `0~9. HTTP 상태 코드`,
            location: `페이지: UI → 영역: 캔버스`,
            cause: `서버 낭부 오류가 발생했습니다.`,
            solution: `서버 관리자에게 문의하세요.`,
            steps:
[
              `테스트 단계를 수행하세요.`,
              `재설정 작업을 진행하세요.`,
              `검증 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `HTTP_001`,
              `HTTP_002`
            ],
            prevention: `요청에 재시도 및 백오프 메커니즘을 구현하세요. API 속도 제한을 준수하고 캐싱을 활용하세요.`,
          },
          {
            code: `HTTP_011`,
            message: `400 잘못된 요청 오류가 발생했습니다 (HTTP_011).`,
            severity: `warning`,
            category: `0~9. HTTP 상태 코드`,
            location: `페이지: 얼굴 만들기 → 영역: 버튼`,
            cause: `클라이언트 요청이 잘못되었습니다.`,
            solution: `요청 매개변수를 확인하고 수정하세요.`,
            steps:
[
              `확인 단계를 수행하세요.`,
              `수정 작업을 진행하세요.`,
              `저장 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `HTTP_002`,
              `HTTP_003`
            ],
            prevention: `요청에 재시도 및 백오프 메커니즘을 구현하세요. API 속도 제한을 준수하고 캐싱을 활용하세요.`,
          },
          {
            code: `HTTP_012`,
            message: `401 인증 실패 오류가 발생했습니다 (HTTP_012).`,
            severity: `info`,
            category: `0~9. HTTP 상태 코드`,
            location: `페이지: 스타일 변환 → 영역: 입력`,
            cause: `인증 정보가 유효하지 않습니다.`,
            solution: `인증 정보를 갱신하세요.`,
            steps:
[
              `진단 단계를 수행하세요.`,
              `조정 작업을 진행하세요.`,
              `적용 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `HTTP_003`,
              `HTTP_004`
            ],
            prevention: `요청에 재시도 및 백오프 메커니즘을 구현하세요. API 속도 제한을 준수하고 캐싱을 활용하세요.`,
          },
          {
            code: `HTTP_013`,
            message: `403 접근 금지 오류가 발생했습니다 (HTTP_013).`,
            severity: `critical`,
            category: `0~9. HTTP 상태 코드`,
            location: `페이지: 프롬프트 → 영역: 출력`,
            cause: `서버에서 요청을 거부했습니다.`,
            solution: `요청 권한을 확인하세요.`,
            steps:
[
              `분석 단계를 수행하세요.`,
              `변경 작업을 진행하세요.`,
              `확인 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `HTTP_004`,
              `HTTP_005`
            ],
            prevention: `요청에 재시도 및 백오프 메커니즘을 구현하세요. API 속도 제한을 준수하고 캐싱을 활용하세요.`,
          },
          {
            code: `HTTP_014`,
            message: `404 찾을 수 없음 오류가 발생했습니다 (HTTP_014).`,
            severity: `error`,
            category: `0~9. HTTP 상태 코드`,
            location: `페이지: LLM → 영역: 패널`,
            cause: `요청한 리소스를 찾을 수 없습니다.`,
            solution: `요청한 리소스가 존재하는지 확인하세요.`,
            steps:
[
              `검사 단계를 수행하세요.`,
              `업데이트 작업을 진행하세요.`,
              `테스트 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `HTTP_005`,
              `HTTP_006`
            ],
            prevention: `요청에 재시도 및 백오프 메커니즘을 구현하세요. API 속도 제한을 준수하고 캐싱을 활용하세요.`,
          },
          {
            code: `HTTP_015`,
            message: `408 요청 시간 초과 오류가 발생했습니다 (HTTP_015).`,
            severity: `warning`,
            category: `0~9. HTTP 상태 코드`,
            location: `페이지: TTS → 영역: 캔버스`,
            cause: `서버 낭부 오류가 발생했습니다.`,
            solution: `서버 관리자에게 문의하세요.`,
            steps:
[
              `테스트 단계를 수행하세요.`,
              `재설정 작업을 진행하세요.`,
              `검증 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `HTTP_006`,
              `HTTP_007`
            ],
            prevention: `요청에 재시도 및 백오프 메커니즘을 구현하세요. API 속도 제한을 준수하고 캐싱을 활용하세요.`,
          },
          {
            code: `HTTP_016`,
            message: `409 충돌 오류가 발생했습니다 (HTTP_016).`,
            severity: `info`,
            category: `0~9. HTTP 상태 코드`,
            location: `페이지: paper2gal → 영역: 버튼`,
            cause: `클라이언트 요청이 잘못되었습니다.`,
            solution: `요청 매개변수를 확인하고 수정하세요.`,
            steps:
[
              `확인 단계를 수행하세요.`,
              `수정 작업을 진행하세요.`,
              `저장 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `HTTP_007`,
              `HTTP_008`
            ],
            prevention: `요청에 재시도 및 백오프 메커니즘을 구현하세요. API 속도 제한을 준수하고 캐싱을 활용하세요.`,
          },
          {
            code: `HTTP_017`,
            message: `422 처리할 수 없음 오류가 발생했습니다 (HTTP_017).`,
            severity: `critical`,
            category: `0~9. HTTP 상태 코드`,
            location: `페이지: 이미지 변환 → 영역: 입력`,
            cause: `인증 정보가 유효하지 않습니다.`,
            solution: `인증 정보를 갱신하세요.`,
            steps:
[
              `진단 단계를 수행하세요.`,
              `조정 작업을 진행하세요.`,
              `적용 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `HTTP_008`,
              `HTTP_009`
            ],
            prevention: `요청에 재시도 및 백오프 메커니즘을 구현하세요. API 속도 제한을 준수하고 캐싱을 활용하세요.`,
          },
          {
            code: `HTTP_018`,
            message: `429 너무 많은 요청 오류가 발생했습니다 (HTTP_018).`,
            severity: `error`,
            category: `0~9. HTTP 상태 코드`,
            location: `페이지: 설정 → 영역: 출력`,
            cause: `서버에서 요청을 거부했습니다.`,
            solution: `요청 권한을 확인하세요.`,
            steps:
[
              `분석 단계를 수행하세요.`,
              `변경 작업을 진행하세요.`,
              `확인 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `HTTP_009`,
              `HTTP_010`
            ],
            prevention: `요청에 재시도 및 백오프 메커니즘을 구현하세요. API 속도 제한을 준수하고 캐싱을 활용하세요.`,
          },
          {
            code: `HTTP_019`,
            message: `500 낭부 서버 오류 오류가 발생했습니다 (HTTP_019).`,
            severity: `warning`,
            category: `0~9. HTTP 상태 코드`,
            location: `페이지: 오디오 → 영역: 패널`,
            cause: `요청한 리소스를 찾을 수 없습니다.`,
            solution: `요청한 리소스가 존재하는지 확인하세요.`,
            steps:
[
              `검사 단계를 수행하세요.`,
              `업데이트 작업을 진행하세요.`,
              `테스트 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `HTTP_010`,
              `HTTP_001`
            ],
            prevention: `요청에 재시도 및 백오프 메커니즘을 구현하세요. API 속도 제한을 준수하고 캐싱을 활용하세요.`,
          },
          {
            code: `HTTP_020`,
            message: `502 불량 게이트웨이 오류가 발생했습니다 (HTTP_020).`,
            severity: `info`,
            category: `0~9. HTTP 상태 코드`,
            location: `페이지: UI → 영역: 캔버스`,
            cause: `서버 낭부 오류가 발생했습니다.`,
            solution: `서버 관리자에게 문의하세요.`,
            steps:
[
              `테스트 단계를 수행하세요.`,
              `재설정 작업을 진행하세요.`,
              `검증 후 다시 시도하세요.`
            ],
            relatedCodes:
[
              `HTTP_001`,
              `HTTP_002`
            ],
            prevention: `요청에 재시도 및 백오프 메커니즘을 구현하세요. API 속도 제한을 준수하고 캐싱을 활용하세요.`,
          },],
      },
    ],
  };
