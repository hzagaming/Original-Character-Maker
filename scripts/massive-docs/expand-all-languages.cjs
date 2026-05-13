const fs = require('fs');

const languages = [
  { file: 'bg.ts', name: 'bg', cats: { A: 'A. API и мрежа', B: 'B. Конфигурация и данни', C: 'C. Съдържание и вход', D: 'D. Модел и генериране', E: 'E. Работен процес и конвертиране', F: 'F. Система и разрешения', 0: '0~9. HTTP статус кодове' } },
  { file: 'cs.ts', name: 'cs', cats: { A: 'A. API a síť', B: 'B. Konfigurace a data', C: 'C. Obsah a vstup', D: 'D. Model a generování', E: 'E. Pracovní postup a konverze', F: 'F. Systém a oprávnění', 0: '0~9. HTTP stavové kódy' } },
  { file: 'da.ts', name: 'da', cats: { A: 'A. API og netværk', B: 'B. Konfiguration og data', C: 'C. Indhold og input', D: 'D. Model og generering', E: 'E. Arbejdsgang og konvertering', F: 'F. System og tilladelser', 0: '0~9. HTTP-statuskoder' } },
  { file: 'de.ts', name: 'de', cats: { A: 'A. API und Netzwerk', B: 'B. Konfiguration und Daten', C: 'C. Inhalt und Eingabe', D: 'D. Modell und Generierung', E: 'E. Workflow und Konvertierung', F: 'F. System und Berechtigungen', 0: '0~9. HTTP-Statuscodes' } },
  { file: 'el.ts', name: 'el', cats: { A: 'A. API και δίκτυο', B: 'B. Διαμόρφωση και δεδομένα', C: 'C. Περιεχόμενο και είσοδος', D: 'D. Μοντέλο και δημιουργία', E: 'E. Ροή εργασίας και μετατροπή', F: 'F. Σύστημα και δικαιώματα', 0: '0~9. Κωδικοί κατάστασης HTTP' } },
  { file: 'es.ts', name: 'es', cats: { A: 'A. API y red', B: 'B. Configuración y datos', C: 'C. Contenido y entrada', D: 'D. Modelo y generación', E: 'E. Flujo de trabajo y conversión', F: 'F. Sistema y permisos', 0: '0~9. Códigos de estado HTTP' } },
  { file: 'fi.ts', name: 'fi', cats: { A: 'A. API ja verkko', B: 'B. Asetukset ja tiedot', C: 'C. Sisältö ja syöte', D: 'D. Malli ja generointi', E: 'E. Työnkulku ja muunnos', F: 'F. Järjestelmä ja oikeudet', 0: '0~9. HTTP-tilakoodit' } },
  { file: 'fr.ts', name: 'fr', cats: { A: 'A. API et réseau', B: 'B. Configuration et données', C: 'C. Contenu et entrée', D: 'D. Modèle et génération', E: 'E. Flux de travail et conversion', F: 'F. Système et autorisations', 0: '0~9. Codes de statut HTTP' } },
  { file: 'hi.ts', name: 'hi', cats: { A: 'A. API और नेटवर्क', B: 'B. कॉन्फ़िगरेशन और डेटा', C: 'C. सामग्री और इनपुट', D: 'D. मॉडल और जनरेशन', E: 'E. वर्कफ़्लो और कन्वर्ज़न', F: 'F. सिस्टम और अनुमतियाँ', 0: '0~9. HTTP स्थिति कोड' } },
  { file: 'hu.ts', name: 'hu', cats: { A: 'A. API és hálózat', B: 'B. Konfiguráció és adatok', C: 'C. Tartalom és bevitel', D: 'D. Modell és generálás', E: 'E. Munkafolyamat és konverzió', F: 'F. Rendszer és jogosultságok', 0: '0~9. HTTP állapotkódok' } },
  { file: 'id.ts', name: 'id', cats: { A: 'A. API dan jaringan', B: 'B. Konfigurasi dan data', C: 'C. Konten dan input', D: 'D. Model dan generasi', E: 'E. Alur kerja dan konversi', F: 'F. Sistem dan izin', 0: '0~9. Kode status HTTP' } },
  { file: 'it.ts', name: 'it', cats: { A: 'A. API e rete', B: 'B. Configurazione e dati', C: 'C. Contenuto e input', D: 'D. Modello e generazione', E: 'E. Flusso di lavoro e conversione', F: 'F. Sistema e autorizzazioni', 0: '0~9. Codici di stato HTTP' } },
  { file: 'lt.ts', name: 'lt', cats: { A: 'A. API ir tinklas', B: 'B. Konfigūracija ir duomenys', C: 'C. Turinys ir įvestis', D: 'D. Modelis ir generavimas', E: 'E. Darbo eiga ir konversija', F: 'F. Sistema ir leidimai', 0: '0~9. HTTP būsenos kodai' } },
  { file: 'ms.ts', name: 'ms', cats: { A: 'A. API dan rangkaian', B: 'B. Konfigurasi dan data', C: 'C. Kandungan dan input', D: 'D. Model dan penjanaan', E: 'E. Aliran kerja dan penukaran', F: 'F. Sistem dan kebenaran', 0: '0~9. Kod status HTTP' } },
  { file: 'nl.ts', name: 'nl', cats: { A: 'A. API en netwerk', B: 'B. Configuratie en gegevens', C: 'C. Inhoud en invoer', D: 'D. Model en generatie', E: 'E. Werkstroom en conversie', F: 'F. Systeem en machtigingen', 0: '0~9. HTTP-statuscodes' } },
  { file: 'no.ts', name: 'no', cats: { A: 'A. API og nettverk', B: 'B. Konfigurasjon og data', C: 'C. Innhold og inndata', D: 'D. Modell og generering', E: 'E. Arbeidsflyt og konvertering', F: 'F. System og tillatelser', 0: '0~9. HTTP-statuskoder' } },
  { file: 'pl.ts', name: 'pl', cats: { A: 'A. API i sieć', B: 'B. Konfiguracja i dane', C: 'C. Treść i dane wejściowe', D: 'D. Model i generowanie', E: 'E. Przepływ pracy i konwersja', F: 'F. System i uprawnienia', 0: '0~9. Kody statusu HTTP' } },
  { file: 'pt.ts', name: 'pt', cats: { A: 'A. API e rede', B: 'B. Configuração e dados', C: 'C. Conteúdo e entrada', D: 'D. Modelo e geração', E: 'E. Fluxo de trabalho e conversão', F: 'F. Sistema e permissões', 0: '0~9. Códigos de status HTTP' } },
  { file: 'ro.ts', name: 'ro', cats: { A: 'A. API și rețea', B: 'B. Configurare și date', C: 'C. Conținut și intrare', D: 'D. Model și generare', E: 'E. Flux de lucru și conversie', F: 'F. Sistem și permisiuni', 0: '0~9. Coduri de stare HTTP' } },
  { file: 'sk.ts', name: 'sk', cats: { A: 'A. API a sieť', B: 'B. Konfigurácia a dáta', C: 'C. Obsah a vstup', D: 'D. Model a generovanie', E: 'E. Pracovný postup a konverzia', F: 'F. Systém a oprávnenia', 0: '0~9. HTTP stavové kódy' } },
  { file: 'sv.ts', name: 'sv', cats: { A: 'A. API och nätverk', B: 'B. Konfiguration och data', C: 'C. Innehåll och inmatning', D: 'D. Modell och generering', E: 'E. Arbetsflöde och konvertering', F: 'F. System och behörigheter', 0: '0~9. HTTP-statuskoder' } },
  { file: 'th.ts', name: 'th', cats: { A: 'A. API และเครือข่าย', B: 'B. การกำหนดค่าและข้อมูล', C: 'C. เนื้อหาและอินพุต', D: 'D. โมเดลและการสร้าง', E: 'E. เวิร์กโฟลว์และการแปลง', F: 'F. ระบบและสิทธิ์', 0: '0~9. รหัสสถานะ HTTP' } },
  { file: 'tr.ts', name: 'tr', cats: { A: 'A. API ve ağ', B: 'B. Yapılandırma ve veri', C: 'C. İçerik ve giriş', D: 'D. Model ve oluşturma', E: 'E. İş akışı ve dönüştürme', F: 'F. Sistem ve izinler', 0: '0~9. HTTP durum kodları' } },
  { file: 'uk.ts', name: 'uk', cats: { A: 'A. API та мережа', B: 'B. Конфігурація та дані', C: 'C. Вміст та введення', D: 'D. Модель та генерація', E: 'E. Робочий процес та конвертація', F: 'F. Система та дозволи', 0: '0~9. HTTP коди статусу' } },
  { file: 'vi.ts', name: 'vi', cats: { A: 'A. API và mạng', B: 'B. Cấu hình và dữ liệu', C: 'C. Nội dung và đầu vào', D: 'D. Mô hình và tạo sinh', E: 'E. Quy trình làm việc và chuyển đổi', F: 'F. Hệ thống và quyền', 0: '0~9. Mã trạng thái HTTP' } },
];

const commonMessages = {
  'A': ['Connection timeout', 'Network unstable', 'DNS resolution failed', 'SSL certificate error', 'Proxy connection failed'],
  'B': ['Config corrupted', 'Database access denied', 'Config file missing', 'Schema mismatch', 'Backup restore failed'],
  'C': ['Input length exceeded', 'Unsupported format', 'Encoding error', 'Forbidden characters', 'Required field missing'],
  'D': ['Model loading failed', 'VRAM insufficient', 'CUDA error', 'Checkpoint corrupted', 'Batch size exceeded'],
  'E': ['Conversion failed', 'Codec unsupported', 'Frame extraction error', 'Compression corrupted', 'Workflow interrupted'],
  'F': ['Memory insufficient', 'Disk space full', 'Permission denied', 'Process crash', 'Semaphore exceeded'],
  '0': ['400 Bad Request', '401 Unauthorized', '403 Forbidden', '404 Not Found', '408 Request Timeout'],
};

function makeEntry(code, message, severity, category, location, cause, solution, steps, relatedCodes, prevention) {
  const stepsStr = steps.length ? `\n          steps: [\n            ${steps.map(s => `'${s}'`).join(',\n            ')}\n          ],` : '';
  const relatedStr = relatedCodes.length ? `\n          relatedCodes: [${relatedCodes.map(c => `'${c}'`).join(', ')}],` : '';
  return `        {\n          code: '${code}',\n          message: '${message}',\n          severity: '${severity}',\n          category: '${category}',\n          location: '${location}',\n          cause: '${cause}',\n          solution: '${solution}',${stepsStr}${relatedStr}\n          prevention: '${prevention}',\n        },`;
}

for (const lang of languages) {
  const file = `src/docsContent/${lang.file}`;
  let content = fs.readFileSync(file, 'utf8');

  function insertBeforeCategoryEnd(catId, newEntries) {
    const catStartRegex = new RegExp(`id:\\s*'${catId}',`);
    const catStartMatch = content.match(catStartRegex);
    if (!catStartMatch) { return false; }
    const errorsStartIdx = content.indexOf('errors: [', catStartMatch.index);
    if (errorsStartIdx === -1) { return false; }
    let depth = 1;
    let inString = false;
    let stringChar = null;
    let escape = false;
    for (let i = errorsStartIdx + 'errors: ['.length; i < content.length; i++) {
      const ch = content[i];
      if (escape) { escape = false; continue; }
      if (ch === '\\') { escape = true; continue; }
      if (!inString && (ch === "'" || ch === '"' || ch === '`')) {
        inString = true; stringChar = ch;
      } else if (inString && ch === stringChar) {
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
    return false;
  }

  let totalInserted = 0;
  for (const catId of Object.keys(lang.cats)) {
    const entries = [];
    for (let i = 0; i < 15; i++) {
      const msgIdx = i % commonMessages[catId].length;
      const code = `${catId === '0' ? 'HTTP' : catId}_${String(i + 1).padStart(3, '0')}`;
      const msg = `${commonMessages[catId][msgIdx]} (${code})`;
      entries.push(makeEntry(
        code,
        msg,
        ['critical', 'error', 'warning', 'info'][i % 4],
        lang.cats[catId],
        `Tool: ${['Face Maker', 'Style Transfer', 'Prompt', 'LLM', 'TTS'][i % 5]} → Area: ${['Button', 'Input', 'Output', 'Panel'][i % 4]}`,
        `The root cause of this error needs investigation.`,
        `Please check the configuration and try again.`,
        ['Check the relevant settings.', 'Retry the operation.', 'Contact support if the issue persists.'],
        [`${catId === '0' ? 'HTTP' : catId}_${String((i + 1) % 5 + 1).padStart(3, '0')}`],
        `Regular monitoring and maintenance can prevent this issue.`
      ));
    }
    if (insertBeforeCategoryEnd(catId, entries.join('\n'))) {
      totalInserted += entries.length;
    }
  }

  fs.writeFileSync(file, content);
  console.log(`${lang.file}: inserted ${totalInserted} entries`);
}
