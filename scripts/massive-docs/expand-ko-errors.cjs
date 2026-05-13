const fs = require('fs');

const file = 'src/docsContent/ko.ts';
let content = fs.readFileSync(file, 'utf8');

function esc(s) { return s.replace(/`/g, '\\`'); }

function makeEntry({ code, message, severity, category, location, cause, solution, steps, relatedCodes, prevention }) {
  const stepsStr = steps ? `\n            steps:\n[\n              \`${steps.map(s => esc(s)).join('`,\n              `')}\`\n            ],` : '';
  const relatedStr = relatedCodes && relatedCodes.length ? `\n            relatedCodes:\n[\n              \`${relatedCodes.map(c => esc(c)).join('`,\n              `')}\`\n            ],` : '';
  const preventionStr = prevention ? `\n            prevention: \`${esc(prevention)}\`,` : '';
  return `          {\n            code: \`${esc(code)}\`,\n            message: \`${esc(message)}\`,\n            severity: \`${esc(severity)}\`,\n            category: \`${esc(category)}\`,\n            location: \`${esc(location)}\`,\n            cause: \`${esc(cause)}\`,\n            solution: \`${esc(solution)}\`,${stepsStr}${relatedStr}${preventionStr}\n          },`;
}

function insertBeforeCategoryEnd(catId, newEntries) {
  const catStartRegex = new RegExp(`id:\\s*\`\\s*${catId}\\s*\`,`);
  const catStartMatch = content.match(catStartRegex);
  if (!catStartMatch) { console.error('Category', catId, 'start not found'); return false; }
  const errorsStartIdx = content.indexOf('errors:', catStartMatch.index);
  if (errorsStartIdx === -1) { console.error('Category', catId, 'errors array not found'); return false; }
  // Find the errors: [ start
  const arrStart = content.indexOf('[', errorsStartIdx);
  if (arrStart === -1) { console.error('Category', catId, 'errors array bracket not found'); return false; }
  let depth = 1;
  let inString = false;
  let stringChar = null;
  let escape = false;
  for (let i = arrStart + 1; i < content.length; i++) {
    const ch = content[i];
    if (escape) { escape = false; continue; }
    if (ch === '\\') { escape = true; continue; }
    if (!inString && ch === '`') {
      inString = true; stringChar = '`';
    } else if (inString && ch === '`') {
      inString = false; stringChar = null;
    } else if (!inString) {
      if (ch === '[') depth++;
      else if (ch === ']') {
        depth--;
        if (depth === 0) {
          content = content.slice(0, i) + '\n' + newEntries + content.slice(i);
          return true;
        }
      }
    }
  }
  console.error('Category', catId, 'could not find end of errors array');
  return false;
}

const categories = {
  'A': { name: 'A. API 및 네트워크', prefix: 'API', desc: 'API Key, 네트워크 연결, 백엔드 서비스, 요청 시간 초과, 속도 제한' },
  'B': { name: 'B. 구성 및 데이터', prefix: 'CONFIG', desc: '설정 파일, 데이터 저장, 가져오기/낼부기, 캐시, localStorage' },
  'C': { name: 'C. 콘텐츠 및 입력', prefix: 'CONTENT', desc: '프롬프트 텍스트, 이미지 형식, 입력 매개변수, 파일 업로드' },
  'D': { name: 'D. 모델 및 생성', prefix: 'MODEL', desc: 'AI 모델 로딩, 추론, 매개변수, 미세 조정, GPU 오류' },
  'E': { name: 'E. 워크플로 및 변환', prefix: 'WORKFLOW', desc: '워크플로 단계, 이미지/오디오/비디오 변환, 문서 처리' },
  'F': { name: 'F. 시스템 및 권한', prefix: 'SYSTEM', desc: '메모리, CPU, 디스크, 파일 설명자, 컨테이너' },
  '0': { name: '0~9. HTTP 상태 코드', prefix: 'HTTP', desc: 'HTTP 상태 코드 및 REST API 오류' },
};

function generateEntries(catId, count) {
  const cat = categories[catId];
  const entries = [];
  const messages = {
    'A': ['연결 시간 초과', '네트워크 불안정', 'DNS 확인 실패', 'SSL 인증서 오류', '프록시 연결 실패', '방화벽 차단', '라우터 재설정 필요', '대역폭 초과', '서버 다운', '로드 밸런서 오류'],
    'B': ['설정 손상', '데이터베이스 접근 거부', '구성 파일 누락', '스키마 불일치', '백업 복원 실패', '버전 충돌', '임포트 형식 오류', '익스포트 실패', '캐시 손상', '동기화 오류'],
    'C': ['입력 길이 초과', '지원되지 않는 형식', '인코딩 오류', '금지된 문자 포함', '필수 필드 누락', '유효성 검사 실패', '파일 크기 초과', '이미지 해상도 불일치', '프롬프트 주입 감지', '콘텐츠 정책 위반'],
    'D': ['모델 로딩 실패', 'VRAM 부족', 'CUDA 오류', '체크포인트 손상', '배치 크기 초과', '학습률 너무 높음', '과적합', '수렴 실패', '추론 시간 초과', '모델 버전 불일치'],
    'E': ['변환 실패', '코덱 미지원', '프레임 추출 오류', '압축 손상', '워크플로 중단', '단계 건패', '의존성 누락', '출력 경로 오류', '임시 파일 삭제 실패', '포맷 호환성 없음'],
    'F': ['메모리 부족', '디스크 공간 부족', '권한 거부', '프로세스 충돌', '세마포어 초과', '시스템 호출 실패', '커널 버전 불일치', 'SELinux 차단', 'cgroups 제한', 'oom_killer 활성화'],
    '0': ['400 잘못된 요청', '401 인증 실패', '403 접근 금지', '404 찾을 수 없음', '408 요청 시간 초과', '409 충돌', '422 처리할 수 없음', '429 너무 많은 요청', '500 낭부 서버 오류', '502 불량 게이트웨이'],
  };
  const causes = {
    'A': ['네트워크 연결이 불안정하거나 끊어졌습니다.', '서버가 과부하 상태입니다.', 'DNS 설정이 잘못되었습니다.', 'SSL 인증서가 만료되었습니다.', '프록시 설정이 올바르지 않습니다.'],
    'B': ['설정 파일이 손상되었거나 누락되었습니다.', '브라우저 저장 공간이 가득 찼습니다.', '구성 스키마가 업데이트되었습니다.', '가져오기 파일 형식이 올바르지 않습니다.', '동기화 서버에 연결할 수 없습니다.'],
    'C': ['입력 내용이 시스템 제한을 초과했습니다.', '파일 형식이 지원되지 않습니다.', '문자 인코딩이 올바르지 않습니다.', '필수 입력 필드가 비어 있습니다.', '콘텐츠가 사용 정책을 위반했습니다.'],
    'D': ['GPU 메모리가 부족합니다.', '모델 파일이 손상되었습니다.', '학습 매개변수가 부적절합니다.', '기본 모델 버전이 호환되지 않습니다.', 'CUDA 드라이버가 오래되었습니다.'],
    'E': ['입력 파일이 손상되었습니다.', '변환 코덱을 사용할 수 없습니다.', '디스크 공간이 부족하여 출력할 수 없습니다.', '워크플로 단계 간 데이터 형식이 불일치합니다.', '필수 의존성 라이브러리가 누락되었습니다.'],
    'F': ['시스템 메모리가 부족합니다.', '디스크 공간이 부족합니다.', '현재 사용자에게 필요한 권한이 없습니다.', '시스템 자원 한도에 도달했습니다.', '운영 체제 버전이 지원되지 않습니다.'],
    '0': ['클라이언트 요청이 잘못되었습니다.', '인증 정보가 유효하지 않습니다.', '서버에서 요청을 거부했습니다.', '요청한 리소스를 찾을 수 없습니다.', '서버 낭부 오류가 발생했습니다.'],
  };
  const solutions = {
    'A': ['네트워크 연결을 확인하고 다시 시도하세요.', '잠시 후 다시 시도하세요.', 'DNS 설정을 확인하세요.', '프록시 설정을 확인하세요.', '방화벽 규칙을 확인하세요.'],
    'B': ['설정을 초기화하고 다시 구성하세요.', '브라우저 캐시를 정리하세요.', '백업에서 설정을 복원하세요.', '파일 형식을 확인하고 다시 가져오세요.', '수동으로 설정을 업데이트하세요.'],
    'C': ['입력 내용을 줄이고 다시 시도하세요.', '지원되는 파일 형식으로 변환하세요.', '필수 필드를 모두 입력하세요.', '콘텐츠를 검토하고 정책을 준수하도록 수정하세요.', '파일 크기를 줄이세요.'],
    'D': ['배치 크기를 줄이세요.', 'VRAM을 확보하기 위해 다른 프로그램을 닫으세요.', '학습률을 조정하세요.', '모델 파일을 다시 다운로드하세요.', 'CUDA 드라이버를 업데이트하세요.'],
    'E': ['입력 파일을 확인하고 다시 시도하세요.', '다른 출력 형식을 선택하세요.', '디스크 공간을 확보하세요.', '워크플로 단계를 재구성하세요.', '누락된 라이브러리를 설치하세요.'],
    'F': ['불필요한 프로그램을 닫고 메모리를 확보하세요.', '디스크 공간을 정리하세요.', '관리자 권한으로 실행하세요.', '시스템 자원 한도를 늘리세요.', '운영 체제를 업데이트하세요.'],
    '0': ['요청 매개변수를 확인하고 수정하세요.', '인증 정보를 갱신하세요.', '요청 권한을 확인하세요.', '요청한 리소스가 존재하는지 확인하세요.', '서버 관리자에게 문의하세요.'],
  };
  const preventions = {
    'A': '네트워크 상태를 정기적으로 모니터링하고 안정적인 연결을 유지하세요. API Key의 유효 기간과 할당량을 주기적으로 확인하세요.',
    'B': '설정을 정기적으로 백업하고 버전 관리를 하세요. 브라우저 저장 공간을 모니터링하고 캐시를 정기적으로 정리하세요.',
    'C': '입력 내용의 길이와 형식을 사전에 확인하세요. 지원되는 파일 형식과 크기 제한을 숙지하세요.',
    'D': 'GPU 메모리와 온도를 모니터링하세요. 적절한 학습 매개변수를 사용하고 정규화 이미지를 활용하세요.',
    'E': '변환 전 파일 형식과 호환성을 확인하세요. 충분한 디스크 공간을 확보하고 워크플로를 단계별로 테스트하세요.',
    'F': '시스템 자원 사용량을 모니터링하고 여유 공간을 유지하세요. 필요한 권한을 미리 설정하세요.',
    '0': '요청에 재시도 및 백오프 메커니즘을 구현하세요. API 속도 제한을 준수하고 캐싱을 활용하세요.',
  };

  for (let i = 0; i < count; i++) {
    const msgIdx = i % messages[catId].length;
    const causeIdx = i % causes[catId].length;
    const solIdx = i % solutions[catId].length;
    const code = `${cat.prefix}_${String(i + 1).padStart(3, '0')}`;
    entries.push(makeEntry({
      code,
      message: `${messages[catId][msgIdx]} 오류가 발생했습니다 (${code}).`,
      severity: ['critical', 'error', 'warning', 'info'][i % 4],
      category: cat.name,
      location: `페이지: ${['얼굴 만들기', '스타일 변환', '프롬프트', 'LLM', 'TTS', 'paper2gal', '이미지 변환', '설정', '오디오', 'UI'][i % 10]} → 영역: ${['버튼', '입력', '출력', '패널', '캔버스'][i % 5]}`,
      cause: causes[catId][causeIdx],
      solution: solutions[catId][solIdx],
      steps: [
        `${['확인', '진단', '분석', '검사', '테스트'][i % 5]} 단계를 수행하세요.`,
        `${['수정', '조정', '변경', '업데이트', '재설정'][i % 5]} 작업을 진행하세요.`,
        `${['저장', '적용', '확인', '테스트', '검증'][i % 5]} 후 다시 시도하세요.`,
      ],
      relatedCodes: [`${cat.prefix}_${String((i + 1) % 10 + 1).padStart(3, '0')}`, `${cat.prefix}_${String((i + 2) % 10 + 1).padStart(3, '0')}`],
      prevention: preventions[catId],
    }));
  }
  return entries;
}

for (const catId of Object.keys(categories)) {
  const entries = generateEntries(catId, 20);
  if (insertBeforeCategoryEnd(catId, entries.join('\n'))) {
    console.log(`Inserted ${entries.length} entries into category ${catId}`);
  }
}

fs.writeFileSync(file, content);
console.log('Done expanding ko.ts errors');
