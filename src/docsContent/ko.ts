import type { DocsContent } from './types';

export const docsContent: DocsContent = {
    intro: `Original Character Maker 사용자 가이드에 오신 것을 환영합니다!\n\n이 가이드는 7개 기능 모듈의 상세한 설명서와 전역 오류 사전이 포함되어 있습니다. 도구 사용 중 오류가 발생하거나 버튼/매개변수의 기능을 잘 모르겠다면 이 가이드를 열어 해당 장을 찾아보세요.\n\n가이드 구조:\n· 도구 가이드 — 각 도구별로 기능 개요, 버튼 설명, 매개변수 설명, 오류와 해결책을 포함한 독립 장이 있습니다\n· 오류 사전 — 전역 오류 인덱스, 카테고리(A~Z, 0~9)별로 정렬되어 사전처럼 빠르게 검색할 수 있습니다\n\n오류 사전 사용법:\n1. 오류 패널에 표시된 Code를 먼저 확인하세요(예: STYLE_TRANSFER_REQUEST_FAILED)\n2. 첫 글자에 해당하는 카테고리를 찾으세요(S → 시스템 및 워크플로우)\n3. 해당 카테고리 안에서 알파벳 순서로 항목을 찾으세요\n4. "위치"를 읽어 오류가 발생한 페이지와 영역을 확인하세요\n5. "해결 단계"에 따라 단계별로 문제를 해결하세요`,
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
        ],
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
        ],
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
        ],
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
        ],
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
        ],
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
        ],
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
        ],
      },
    ],
  };
