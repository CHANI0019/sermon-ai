/**
 * 🔊 목회자 강단 설교 전용 감정·구어체 자연스러운 음성 낭독 (Pastoral Preaching TTS) 서비스
 */
export class SpeechService {
  private static isCancelling: boolean = false;

  private static getSynth(): SpeechSynthesis | null {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        return window.speechSynthesis;
      }
    } catch (e) {
      // Mobile Safari SecurityError catch
    }
    return null;
  }

  public static isSupported(): boolean {
    return this.getSynth() !== null;
  }

  /**
   * 숫자를 자연스러운 한글 한자어 수사(일, 이, 삼... 십, 백, 천)로 변환
   * 예: 142 -> 백사십이, 23 -> 이십삼, 119 -> 백십구, 15 -> 십오, 16 -> 십육
   */
  private static numberToKoreanHanja(numStr: string): string {
    const num = parseInt(numStr, 10);
    if (isNaN(num)) return numStr;

    const digits = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
    const units = ['', '십', '백', '천'];

    if (num === 0) return '영';

    let result = '';
    const str = num.toString();
    const len = str.length;

    for (let i = 0; i < len; i++) {
      const digit = parseInt(str[i], 10);
      const unitIndex = len - 1 - i;

      if (digit !== 0) {
        if (digit === 1 && unitIndex > 0) {
          result += units[unitIndex];
        } else {
          result += digits[digit] + units[unitIndex];
        }
      }
    }

    return result;
  }

  /**
   * 🌐 주요 국제기구, 금융·경제(FOMC, Fed) 및 IT 주요 영문 약어 발음 정규화
   */
  private static normalizeInternationalOrganizations(text: string): string {
    let result = text;
    
    const orgMap: [RegExp, string][] = [
      // 국제기구 & 기관
      [/\bUN\b/g, '유엔'],
      [/\bWHO\b/g, '떠불유에이치오'],
      [/\b[Ww]ho\b/g, '후'],
      [/\bUNESCO\b/g, '유네스코'],
      [/\bUNICEF\b/g, '유니세프'],
      [/\bIMF\b/g, '아이엠에프'],
      [/\bWTO\b/g, '더블유티오'],
      [/\bOECD\b/g, '오이씨디'],
      [/\bEU\b/g, '이유'],
      [/\bNATO\b/g, '나토'],
      [/\bIAEA\b/g, '아이에이이에이'],
      [/\bILO\b/g, '아이엘오'],
      [/\bUNHCR\b/g, '유엔난민기구'],
      [/\bFAO\b/g, '에프에이오'],
      [/\bWFP\b/g, '세계식량계획'],
      [/\bWMO\b/g, '세계기상기구'],
      [/\bAPEC\b/g, '아펙'],
      [/\bASEAN\b/g, '아세안'],
      [/\bG7\b/g, '지세븐'],
      [/\bG20\b/g, '지이십'],
      [/\bFDA\b/g, '에프디에이'],
      [/\bCDC\b/g, '씨디씨'],
      [/\bNGO\b/g, '엔지오'],
      [/\bNPO\b/g, '엔피오'],

      // 금융 · 경제 · 중앙은행 약어
      [/\bFOMC\b/g, '에프오엠씨'],
      [/\b[Ff]ed\b/g, '연준'],
      [/\bFED\b/g, '연준'],
      [/\bECB\b/g, '이씨비'],
      [/\bSEC\b/g, '에스이씨'],
      [/\bCPI\b/g, '씨피아이'],
      [/\bPPI\b/g, '피피아이'],
      [/\bPCE\b/g, '피씨이'],
      [/\bGDP\b/g, '지디피'],
      [/\bGNP\b/g, '지엔피'],
      [/\bKOSPI\b/g, '코스피'],
      [/\bKOSDAQ\b/g, '코스닥'],
      [/\bNASDAQ\b/g, '나스닥'],

      // 기술 · IT · 경영 직함 약어
      [/\bAI\b/g, '에이아이'],
      [/\bIT\b/g, '아이티'],
      [/\bIP\b/g, '아이피'],
      [/\bCEO\b/g, '씨이오'],
      [/\bCFO\b/g, '씨에프오'],
      [/\bCTO\b/g, '씨티오'],

      // 산업 · 국제 표준 규격 · 인증 약어
      [/\bKS\b/g, '케이에스'],
      [/\bISO\b/g, '아이소'],
      [/\bIEEE\b/g, '아이트리플이'],
      [/\bIEC\b/g, '아이이씨'],
      [/\bANSI\b/g, '안시'],
      [/\bHACCP\b/g, '해썹'],
      [/\bGMP\b/g, '지엠피'],
      [/\bKC\b/g, '케이씨'],
      [/\bCE\b/g, '씨이'],

      // 디지털 · 웹 · 포맷 규격 약어
      [/\bURL\b/g, '유알엘'],
      [/\bHTTP\b/g, '에이치티티피'],
      [/\bHTTPS\b/g, '에이치티티피에스'],
      [/\bAPI\b/g, '에이피아이'],
      [/\bSDK\b/g, '에스디케이'],
      [/\bDB\b/g, '디비'],
      [/\bSQL\b/g, '에스큐엘'],
      [/\bPDF\b/g, '피디에프'],
      [/\bQR\b/g, '큐알'],
    ];

    for (const [regex, replacement] of orgMap) {
      result = result.replace(regex, replacement);
    }

    return result;
  }

  /**
   * 복수 성경 구절 및 슬래시(/) 표기 한글 발음 정규화
   * 예: "매칭 성경 본문: 시편 142:1-5 / 히브리서 4:15-16"
   *  -> "매칭 성경 본문. 시편 백사십이편 일절부터 오절까지 와 히브리서 사장 십오절부터 십육절까지."
   */
  public static normalizeScriptureForVoice(text: string): string {
    let normalized = text;

    // 국제기구 영문 약어 한글 발음 정규화
    normalized = this.normalizeInternationalOrganizations(normalized);

    // Header label & Slash converter
    normalized = normalized
      .replace(/매칭 성경 본문\s*[:;]/g, '매칭 성경 본문.')
      .replace(/\s*\/\s*/g, ' 와 ');

    // Pattern 0-1: 시편 장:시작절-끝절 (예: 시편 142:1-5 -> 시편 백사십이편 일절부터 오절까지)
    normalized = normalized.replace(
      /시편\s*(\d+)[:편]\s*(\d+)\s*[-~]\s*(\d+)절?/g,
      (_, psalmNum, start, end) => {
        const psalmKr = this.numberToKoreanHanja(psalmNum);
        const startKr = this.numberToKoreanHanja(start);
        const endKr = this.numberToKoreanHanja(end);
        return `시편 ${psalmKr}편 ${startKr}절부터 ${endKr}절까지.`;
      }
    );

    // Pattern 0-2: 시편 장:단일절 (예: 시편 23:1 -> 시편 이십삼편 일절)
    normalized = normalized.replace(
      /시편\s*(\d+)[:편]\s*(\d+)절?/g,
      (_, psalmNum, verse) => {
        const psalmKr = this.numberToKoreanHanja(psalmNum);
        const verseKr = this.numberToKoreanHanja(verse);
        return `시편 ${psalmKr}편 ${verseKr}절.`;
      }
    );

    // Pattern 0-3: 시편 단독 편 표기 (예: 시편 142편 -> 시편 백사십이편)
    normalized = normalized.replace(
      /시편\s*(\d+)편/g,
      (_, psalmNum) => {
        const psalmKr = this.numberToKoreanHanja(psalmNum);
        return `시편 ${psalmKr}편.`;
      }
    );

    // Pattern 1: 일반 성경책 장:시작절-끝절 (예: 히브리서 4:15-16 -> 히브리서 사장 십오절부터 십육절까지)
    normalized = normalized.replace(
      /([가-힣]+)\s*(\d+)[:장]\s*(\d+)\s*[-~]\s*(\d+)절?/g,
      (_, book, chap, start, end) => {
        const chapKr = this.numberToKoreanHanja(chap);
        const startKr = this.numberToKoreanHanja(start);
        const endKr = this.numberToKoreanHanja(end);
        return `${book} ${chapKr}장 ${startKr}절부터 ${endKr}절까지.`;
      }
    );

    // Pattern 2: 일반 성경책 장:단일절 (예: 로마서 8:28 -> 로마서 팔장 이십팔절)
    normalized = normalized.replace(
      /([가-힣]+)\s*(\d+)[:장]\s*(\d+)절?/g,
      (_, book, chap, verse) => {
        const chapKr = this.numberToKoreanHanja(chap);
        const verseKr = this.numberToKoreanHanja(verse);
        return `${book} ${chapKr}장 ${verseKr}절.`;
      }
    );

    // Pattern 3: 단독 장 표기 (예: 이사야 53장)
    normalized = normalized.replace(
      /([가-힣]+)\s*(\d+)장/g,
      (_, book, chap) => {
        const chapKr = this.numberToKoreanHanja(chap);
        return `${book} ${chapKr}장.`;
      }
    );

    // 구어체 자연스러운 연결어 변환
    normalized = normalized
      .replace(/대지 1/g, '첫째 대지.')
      .replace(/대지 2/g, '둘째 대지.')
      .replace(/대지 3/g, '셋째 대지.')
      .replace(/Hook/g, '서론 도입.')
      .replace(/Exegesis/g, '성경 본문 주해.');

    return normalized;
  }

  /**
   * 🌬️ 성경 본문 및 설교문 호흡 구두점 정규화 엔진 (Scripture Pacing & Punctuation Normalizer)
   */
  public static normalizePacingAndPunctuation(text: string): string {
    let paced = text;

    // 말줄임표(…), 연속 점(.., ...), 가운뎃점(·) 등 호흡 쉼표(, ) 변환 (한 템포 쉬고 다음 단어 낭독)
    paced = paced
      .replace(/…/g, ', ')
      .replace(/\.{2,}/g, ', ')
      .replace(/·/g, ', ');

    // 성경 구절 연속 문장 의문문/구두점 파싱
    paced = paced
      .replace(/무엇을 먹을까/g, '무엇을 먹을까?')
      .replace(/무엇을 마실까/g, '무엇을 마실까?')
      .replace(/무엇을 입을까/g, '무엇을 입을까?')
      .replace(/의복보다 중하냐/g, '의복보다 중하지 아니하냐?')
      .replace(/음식보다 중하냐/g, '음식보다 중하지 아니하냐?')
      .replace(/귀하지 아니하냐/g, '귀하지 아니하냐?')
      .replace(/염려하지 말라/g, '염려하지 말라!')
      .replace(/보라/g, '보라.')
      .replace(/기르시나니/g, '기르시나니,')
      .replace(/아시느니라/g, '아시느니라.')
      .replace(/구하라/g, '구하라!')
      .replace(/더하시리라/g, '더하시리라!');

    // 길게 이어지는 접속어 뒤 쉼표 및 호흡 띄어쓰기 추가
    paced = paced
      .replace(/그러므로\s*/g, '그러므로, ')
      .replace(/내가 너희에게 이르노니\s*/g, '내가 너희에게 이르노니, ')
      .replace(/심지도 않고\s*/g, '심지도 않고, ')
      .replace(/거두지도 않고\s*/g, '거두지도 않고, ')
      .replace(/모아들이지도 아니하되\s*/g, '모아들이지도 아니하되, ')
      .replace(/이는 다 이방인들이 구하는 것이라\s*/g, '이는 다 이방인들이 구하는 것이라. ')
      .replace(/그리하면\s*/g, '그리하면, ');

    return paced;
  }

  /**
   * 🎙️ 설교문 텍스트를 문장 및 호흡 단위로 감정적 파싱하고 
   * 피치(Pitch)와 속도(Rate)를 다이내믹하게 조절하여 생동감 있게 낭독
   */
  public static async speak(text: string, onEnd?: () => void, onError?: () => void): Promise<boolean> {
    const synth = this.getSynth();
    if (!synth) return false;

    this.stop();
    this.isCancelling = false;

    // 1. Clean & normalize scripture names, slash '/' connectors, & pacing punctuation
    let normalized = this.normalizeScriptureForVoice(text);
    normalized = this.normalizePacingAndPunctuation(normalized);

    // 괄호 ( ) 및 대괄호 [ ] 내부 내용 100% 완전 제거 (음성 낭독 시 괄호 속 내용은 읽지 않음)
    normalized = normalized
      .replace(/\(.*?\)/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/[#*`_~]/g, '')
      .replace(/--+/g, ' ')
      .trim();

    // 2. Split text into emotional sentence chunks by sentence endings (. ! ? \n ,)
    const rawChunks = normalized.split(/([.!?\n,]+)/);
    const sentences: string[] = [];

    for (let i = 0; i < rawChunks.length; i += 2) {
      const sentence = (rawChunks[i] || '').trim();
      const ending = (rawChunks[i + 1] || '').trim();
      if (sentence) {
        sentences.push(sentence + ending);
      }
    }

    if (sentences.length === 0) {
      if (onEnd) onEnd();
      return false;
    }

    // Get best Korean voice
    const voices = synth.getVoices() || [];
    const koreanVoice = voices.find((v) => v.lang.includes('ko') || v.lang.includes('KO'));

    // Speak sentence by sentence with pastoral emotional pitch/speed modulation
    for (let i = 0; i < sentences.length; i++) {
      if (this.isCancelling) break;

      const sentence = sentences[i];
      if (!sentence) continue;

      await new Promise<void>((resolve) => {
        const utterance = new SpeechSynthesisUtterance(sentence);
        utterance.lang = 'ko-KR';
        if (koreanVoice) utterance.voice = koreanVoice;

        // Dynamic emotional pitch & rate control according to sentence intent
        if (sentence.includes('?')) {
          utterance.pitch = 1.15;
          utterance.rate = 0.88;
        } else if (sentence.includes('!') || sentence.includes('축원합니다') || sentence.includes('아멘') || sentence.includes('하십시오')) {
          utterance.pitch = 1.05;
          utterance.rate = 0.87;
        } else if (sentence.endsWith(',')) {
          utterance.pitch = 1.0;
          utterance.rate = 0.90;
        } else if (sentence.includes('사랑하는 성도') || sentence.includes('마음') || sentence.includes('은혜')) {
          utterance.pitch = 1.0;
          utterance.rate = 0.89;
        } else {
          utterance.pitch = 0.98;
          utterance.rate = 0.91;
        }

        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();

        synth.speak(utterance);
      });

      // Natural pause between sentences (pastoral breath interval: longer for ! . and shorter for ,)
      if (!this.isCancelling && i < sentences.length - 1) {
        const pauseTime = sentence.endsWith(',') ? 180 : 300;
        await new Promise((res) => setTimeout(res, pauseTime));
      }
    }

    if (!this.isCancelling && onEnd) {
      onEnd();
    }

    return true;
  }

  public static stop() {
    this.isCancelling = true;
    const synth = this.getSynth();
    if (synth) {
      try {
        synth.cancel();
      } catch (e) {
        // ignore
      }
    }
  }

  public static pause() {
    const synth = this.getSynth();
    if (synth && synth.speaking) {
      try {
        synth.pause();
      } catch (e) {}
    }
  }

  public static resume() {
    const synth = this.getSynth();
    if (synth && synth.paused) {
      try {
        synth.resume();
      } catch (e) {}
    }
  }

  public static isSpeaking(): boolean {
    const synth = this.getSynth();
    return synth ? synth.speaking : false;
  }
}
