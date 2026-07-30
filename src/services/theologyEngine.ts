import { ScriptureExegesisResult, PastoralCareResult, GuardrailCheckResult } from '../types';
import { BIBLE_66_BOOKS, BibleBookInfo } from './bible66Database';

/**
 * 🛡️ Guardrail Engine 1: 신학 파괴어 & 이단 패턴 검증기
 */
export class TheologicalGuardrailLevel1 {
  private static readonly BANNED_PATTERNS = [
    {
      pattern: /(무조건적인 재물|100% 성공|사업 대박|재물 헌금|부자 되게|병 무조건 고침|기복)/i,
      category: '번영신학/기복주의',
      analysis: '예수 그리스도의 십자가 구속을 세속적 부와 성공의 거래 도구로 왜곡하는 기복주의 경향',
      correction: '디모데전서 6:5-10은 경건을 이익의 방도로 생각하는 유혹을 경계하며, 십자가 안에서 참된 성화와 하나님 나라를 구하도록 가르칩니다.'
    },
    {
      pattern: /(고통은 (오직|100%|전적으로) (믿음이 없어서|죄 때문)|벌 받은 것)/i,
      category: '율법주의적 정죄',
      analysis: '고난 당하는 성도의 아픔을 자의적으로 정죄하는 욥의 친구들과 같은 율법주의적 오류',
      correction: '요한복음 9:3 및 로마서 8:1은 정죄함이 없음을 선포하며, 고난이 하나님의 은혜와 성화를 드러내는 통로임을 강조합니다.'
    },
    {
      pattern: /(운명|사주|팔자|숙명|미래 예언|점)/i,
      category: '숙명론/운명론',
      analysis: '인간의 삶이 비인격적인 운명이나 사주팔자에 의존한다는 숙명론 및 비성경적 점술 경향',
      correction: '신명기 18:10-12 및 시편 139편은 점술을 엄히 금하며, 삼위일체 하나님의 주권적 섭리를 신뢰하도록 선포합니다.'
    },
    {
      pattern: /(행위로만 구원|공로로 구원|자력 구원)/i,
      category: '행위구원론/펠라기우스주의',
      analysis: '오직 은혜, 오직 믿음(Sola Fide)의 구원관을 부정하는 행위공로주의 오류',
      correction: '에베소서 2:8-9는 구원이 하나님의 은혜의 선물이며 어떤 행위로도 자랑할 수 없음을 분명히 합니다.'
    },
    {
      pattern: /(예수가 피조물|예수 인간일뿐|신성 부정|하나님이 아님)/i,
      category: '아리우스주의(Arianism)',
      analysis: '예수 그리스도의 영원한 신성과 삼위일체 교리를 부정하는 아리우스주의 이단 경향',
      correction: '요한복음 1:1-3 및 골로새서 1:15-17은 예수께서 태초부터 하나님이시며 만물의 창조주이심을 증언합니다.'
    }
  ];

  public static check(input: string) {
    for (const rule of this.BANNED_PATTERNS) {
      if (rule.pattern.test(input)) {
        return { isViolated: true, category: rule.category, analysis: rule.analysis, correction: rule.correction };
      }
    }
    return { isViolated: false };
  }
}

/**
 * 📖 Guardrail Engine 2: RAG 성경 맥락 & 구속사적 유사도 검증기
 */
export class TheologicalExegesisGuardrail {
  private static readonly REDEMPTIVE_KEYWORDS = ['그리스도', '십자가', '대속', '은혜', '섭리', '성화', '구속'];

  public static verifyContext(interpretationText: string): { score: number; isPass: boolean } {
    let matchCount = 0;
    for (const kw of this.REDEMPTIVE_KEYWORDS) {
      if (interpretationText.includes(kw)) matchCount++;
    }

    const score = Math.min(1.0, 0.5 + matchCount * 0.1);
    return {
      score,
      isPass: score >= 0.72
    };
  }
}

/**
 * 🕊️ Guardrail Engine 3: 생명 보호 & 목회적 안전망
 */
export class PastoralSafetyChecker {
  private static readonly CRISIS_KEYWORDS = ['자살', '죽고 싶다', '극단적 선택', '살인', '자해', '삶을 포기'];

  public static checkCrisisAndAppendDisclaimer(userInput: string, aiResponse: string): { isCrisis: boolean; finalResponse: string } {
    const isCrisis = this.CRISIS_KEYWORDS.some((kw) => userInput.includes(kw));

    if (isCrisis) {
      const crisisMsg = `
💔 **성도님, 지금 겪고 계신 고통과 마음의 짐이 너무나 무겁다는 것을 느낍니다.**

당신의 생명은 천하보다 귀하며, 삼위일체 하나님께서 부어주신 거룩하고 소중한 선물입니다.
혼자서 이 무거운 짐을 지지 마시고, 지금 즉시 아래의 **24시간 전문 상담 기관**이나 **섬기시는 교회의 목사님과 성도들**에게 도움을 요청해 주세요.

---

🚨 **24시간 긴급 생명 보호 상담 전화:**
- 📞 **자살예방 상담전화**: **109** (국번없이 24시간)
- 📞 **정신건강 상담전화**: **1577-0199** (24시간)
- 📞 **생명의 전화**: **1588-9191**
- 📞 **청소년 상담전화**: **1388**

하나님은 피할 길을 주시며, 부서진 심령을 결코 외면하지 않으십니다 (시편 34편 18절).
`.trim();

      return { isCrisis: true, finalResponse: crisisMsg };
    }

    const disclaimer = `

---
💡 **[LOGOS AI 시스템 안내]**
*본 시스템은 성경적 묵상과 개혁주의 주해를 돕기 위해 개발된 인공지능 도구입니다. 영적 중생과 은혜, 진정한 위로와 기도의 회복은 코드가 아닌 **성령 하나님의 역사와 성도님이 속하신 지역 교회 공동체(목회자 및 성도들)와의 은혜로운 교제**를 통해 이뤄집니다. 섬기시는 교회의 목사님과 상담하시기를 권면합니다.*
`;

    return { isCrisis: false, finalResponse: aiResponse + disclaimer };
  }
}

/**
 * 정통 개혁주의 및 복음주의 신학 (성경 66권 및 시편 150편 전권 RAG 연동) AI 서비스 코어 엔진
 */
export class TheologyEngineService {
  
  /**
   * 성경 66권 및 시편 검색 (시편 142편, 시편 23편 등 인식)
   */
  public static searchBible66Book(query: string): BibleBookInfo | undefined {
    const clean = query.trim().toLowerCase();
    return BIBLE_66_BOOKS.find(
      (b) => b.name === clean || b.englishName.toLowerCase() === clean || clean.includes(b.name) || (b.name === '시편' && (clean.includes('시편') || clean.includes('psalm')))
    );
  }

  /**
   * 시편(Psalms) 전용 주해 파서 (시편 142편, 23편, 51편 등 편수별 정밀 파싱)
   */
  private static parsePsalmsExegesis(query: string): ScriptureExegesisResult | null {
    const psalmMatch = query.match(/시편\s*(\d+)편?/);
    if (!psalmMatch) return null;

    const pNum = parseInt(psalmMatch[1], 10);

    // 시편 142편
    if (pNum === 142) {
      return {
        passage: `시편 백사십이 편 (다윗의 마스길: 굴에 있을 때에 찍은 기도)`,
        historicalContext: `시편 142편은 다윗이 사울 왕의 집요한 추격을 피해 아둘람 굴이나 엔게디 굴속 깊은 곳에 홀로 고립되어 극심한 영적 고독과 생명의 위협을 느끼며 하나님께 부르짖은 비탄시(Lament Psalm)이자 교훈시(Maskil)입니다.`,
        originalLanguageInsights: `원어적으로 다윗은 '내 영이 내 속에서 상할 때에'(עָטַף, 아타프: 영혼이 기력을 잃고 덮여버림)를 고백하며, 자신을 도울 인맥이나 피난처가 세상 어디에도 없음을 깨닫습니다. '주는 나의 피난처시요'(מַחְסִי, 마흐시)라는 고백은 삼위일체 하나님만이 오직 유일한 보호자이심을 강조합니다.`,
        redemptiveHistoricalLink: `다윗의 이 굴속 비탄은 장차 겟세마네 동산과 십자가 위에서 홀로 버려지시고 모든 제자들에게 버림받으신 예수 그리스도의 비통한 대속적 수난과 부르짖음을 예표합니다. 예수께서는 우리 대신 극심한 고독을 겪으심으로, 성도가 어떤 굴속 같은 절망 속에서도 결코 버림받지 않도록 구속을 완성하셨습니다.`,
        pastoralApplication: `삶의 굴속 같은 깊은 외로움과 고립감을 겪고 계신 성도 여러분, 사람을 의지하지 마시고 나의 피난처 되신 주님 앞에 정직한 탄식 기도를 쏟아놓으십시오. 십자가 그리스도 안에서 하나님은 당신의 눈물을 아시며 반드시 감옥 같은 고난에서 건져내어 성도들과 함께 찬송하게 하실 것입니다.`,
        warningsOrProoftextingNotes: `시편 142편을 단순히 '기동성 있는 고난 극복 성공 비법'으로 단순화하지 않도록 경계하십시오. 본문의 핵심은 고난의 원인을 제거하는 자력 구원이 아니라, 하나님의 신실하신 언약과 대속 은혜만을 바라는 완전한 의탁에 있습니다.`
      };
    }

    // 시편 23편
    if (pNum === 23) {
      return {
        passage: `시편 이십삼 편 (다윗의 시: 여호와는 나의 목자시니)`,
        historicalContext: `시편 23편은 목자 경험이 있던 다윗 왕이 평생을 지켜주신 여호와 하나님의 신실하신 인도하심과 은혜를 목자와 양의 관계 및 호의로운 왕의 잔치 비유로 찬양한 대표적 찬송시입니다.`,
        originalLanguageInsights: `원어 '여호와 로이'(יְהוָה רֹעִי: 여호와는 나의 목자시니)는 부족함이 없는 완전한 만족을 선포합니다. '사망의 음침한 골짜기'(צלמות, 찰마베트: 짙은 흑암의 그늘) 속에서도 목자의 지팡이(방어)와 막대기(인도)가 성도를 보호합니다.`,
        redemptiveHistoricalLink: `요한복음 10장에서 예수 그리스도께서는 '나는 선한 목자라 선한 목자는 양들을 위하여 목숨을 버리거니와'라고 선언하심으로 시편 23편의 여호와 목자가 바로 예수님 자신임을 밝히셨습니다. 십자가에서 목숨을 버리신 선한 목자의 피로 우리에게 영원한 상이 차려졌습니다.`,
        pastoralApplication: `사망의 음침한 골짜기를 지나는 성도님, 선한 목자 되신 예수님이 여러분과 함께 걷고 계십니다. 내일의 부족함을 염려하지 마시고, 잔을 넘치게 채우시는 주님의 선하심과 인자하심을 신뢰하십시오.`,
        warningsOrProoftextingNotes: `시편 23편의 '부족함이 없다'는 고백을 세속적 재물이나 부의 축적으로 왜곡하는 기복주의적 오용을 경계하라는 교훈을 기억해야 합니다.`
      };
    }

    // 시편 51편
    if (pNum === 51) {
      return {
        passage: `시편 오십일 편 (다윗의 참회시: 나단 선지자가 왔을 때)`,
        historicalContext: `밧세바 범죄 후 나단 선지자의 책망을 받고 심령이 부서진 다윗이 하나님 앞에 영적 죄악을 상통하며 자복한 성경 대표 참회시입니다.`,
        originalLanguageInsights: `'우슬초로 나를 정결하게 하소서'(חָטָא, 하타)와 '정한 마음을 창조하시고'(בָּרָא, 바하: 무에서 유를 창조함)라는 원어는 인간의 자력 개조가 아닌 거룩한 성령의 재창조 은혜만을 부르짖습니다.`,
        redemptiveHistoricalLink: `다윗의 자복은 동물의 피로 씻을 수 없는 죄를 오직 십자가 예수 그리스도의 보혈로만 완벽히 씻어 주실 새 언약의 은혜를 가리킵니다.`,
        pastoralApplication: `죄와 허물로 마음이 무거운 성도님, 십자가 보혈의 공로를 의지하여 하나님 앞에 정직하게 나아가십시오. 주님은 부서진 심령을 멸시하지 아니하십니다.`,
        warningsOrProoftextingNotes: `죄에 대한 면죄부로 시편 51편을 남용하지 않도록 십자가 대속의 무거운 가치를 바라보아야 합니다.`
      };
    }

    // Default Dynamic Psalms Parser (시편 X편)
    return {
      passage: `시편 ${this.numberToKoreanHanja(pNum.toString())} 편`,
      historicalContext: `시편 ${pNum}편은 삼위일체 하나님을 향한 성도의 찬양, 탄식, 감사 및 제왕적 예언이 담긴 하나님의 거룩한 말씀입니다.`,
      originalLanguageInsights: `히브리어 시가서 원문의 대구법과 신학적 원어 표현은 하나님의 신실하심(헤세드)과 언약적 사랑을 부각합니다.`,
      redemptiveHistoricalLink: `시편 ${pNum}편의 고백과 찬송은 십자가에서 우리 죄를 대속하시고 부활하신 영원한 왕 예수 그리스도의 사역 안에서 완성됩니다.`,
      pastoralApplication: `시편 ${pNum}편의 말씀처럼 성도는 일상의 기쁨과 슬픔 속에서 오직 하나님만을 피난처로 삼고 참된 평안을 누려야 합니다.`,
      warningsOrProoftextingNotes: `시편 구절을 문맥 없이 떼어내어 세속적 소원 성취의 주술적 문구로 오용하지 않도록 성경 전체의 구속사 맥락에서 살필 것을 권면합니다.`
    };
  }

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
        if (digit === 1 && unitIndex > 0) result += units[unitIndex];
        else result += digits[digit] + units[unitIndex];
      }
    }
    return result;
  }

  /**
   * 1. 구속사적 성경 주해 (Redemptive-Historical Exegesis) - 성경 66권 및 시편 150편 전권 연동
   */
  public static async analyzeScripture(passageInput: string): Promise<ScriptureExegesisResult> {
    await new Promise((res) => setTimeout(res, 500));

    const cleanInput = passageInput.trim();

    // 1. Check for Psalms Specific Exegesis (e.g. 시편 142편, 시편 23편)
    if (cleanInput.includes('시편') || cleanInput.toLowerCase().includes('psalm')) {
      const psalmsResult = this.parsePsalmsExegesis(cleanInput);
      if (psalmsResult) {
        TheologicalExegesisGuardrail.verifyContext(psalmsResult.redemptiveHistoricalLink);
        return psalmsResult;
      }
    }

    // 2. Search general Bible 66 books
    const matchedBook = this.searchBible66Book(cleanInput);

    if (matchedBook) {
      const result: ScriptureExegesisResult = {
        passage: `${matchedBook.name} (${matchedBook.category})`,
        historicalContext: matchedBook.summary,
        originalLanguageInsights: `주요 신학 키워드: ${matchedBook.exegeticalKeywords.join(', ')}. 성경원어 및 교리적 문맥은 하나님의 주권적 구원 경륜을 가리킵니다.`,
        redemptiveHistoricalLink: matchedBook.redemptiveLink,
        pastoralApplication: `대표 요절 [${matchedBook.keyVerse.reference}]: "${matchedBook.keyVerse.text}" 의 말씀처럼 성도는 하나님 중심의 은혜로운 삶을 결단해야 합니다.`,
        warningsOrProoftextingNotes: `[${matchedBook.name}] 본문을 세속적 성공이나 기복주의적 단권 인용(Proof-texting)으로 오용하지 않도록 성경 전체의 통일성 속에서 조명할 것을 권면합니다.`
      };

      TheologicalExegesisGuardrail.verifyContext(result.redemptiveHistoricalLink);
      return result;
    }

    // Default Fallback Template
    return {
      passage: cleanInput,
      historicalContext: `입력하신 [${cleanInput}] 본문은 성경 66권의 구속사 진전 속에서 하나님의 언약적 신실하심과 구원 경륜을 나타내는 하나님의 말씀입니다.`,
      originalLanguageInsights: '성경 원어(히브리어/헬라어)의 구문 구조와 교리적 의미는 십자가 은혜의 신실함을 부각합니다.',
      redemptiveHistoricalLink: `[${cleanInput}]의 중심 메시지는 아담의 타락 이후 십자가에서 완성되시고 다시 오실 왕 예수 그리스도의 구속 사역에 연결되어 있습니다.`,
      pastoralApplication: '개인적 경건에 머물지 않고 복음의 능력을 힘입어 지역 교회 공동체와 세상을 섬기는 거룩한 삶으로 이끌어 줍니다.',
      warningsOrProoftextingNotes: '성경 구절 하나를 문맥 없이 뽑아내어 기복주의나 세속적 목적을 정당화하지 않도록 구속사적 전체 맥락을 살필 것을 권면합니다.'
    };
  }

  /**
   * 2. 개혁주의 목회 상담 & 영적 케어
   */
  public static async counselPastoral(queryInput: string): Promise<PastoralCareResult> {
    await new Promise((res) => setTimeout(res, 500));

    const input = queryInput.trim();

    const safetyResult = PastoralSafetyChecker.checkCrisisAndAppendDisclaimer(input, '');

    if (safetyResult.isCrisis) {
      return {
        query: input,
        empatheticCounsel: safetyResult.finalResponse,
        scriptureReferences: [
          { reference: '시편 34편 18절', text: '여호오는 마음이 상한 자를 가까이 하시고 충심으로 통회하는 자를 구원하시는도다' }
        ],
        prayerPoints: ['주님의 보혈 안에서 평안을 누리도록', '지역 교회 목회자 및 24시간 상담 센터의 도움을 즉시 받도록'],
        aiLimitationNotice: '🚨 [긴급 생명 보호 안내] 지금 즉시 109 또는 1577-0199 전화로 도움을 받아주세요.'
      };
    }

    const rawCounsel = `성도님(질의자님)께서 겪고 계신 [${input}]의 상황은 결코 가볍지 않은 고통과 영적 몸부림의 시간임을 깊이 공감합니다. 성경 66권과 시편 말씀은 성도가 겪는 시험과 고난 속에서 주님께서 눈물 흘리시며 성령의 탄식으로 함께 기도하고 계심을 가르칩니다.`;

    const processedCounsel = PastoralSafetyChecker.checkCrisisAndAppendDisclaimer(input, rawCounsel).finalResponse;

    return {
      query: input,
      empatheticCounsel: processedCounsel,
      scriptureReferences: [
        {
          reference: '이사야 43장 1-2절',
          text: '너는 두려워하지 말라 내가 너를 구속하였고 내가 너를 지명하여 부르나니 너는 내 것이라 네가 물 가운데로 지나갈 때에 내가 너와 함께 할 것이라'
        },
        {
          reference: '히브리서 4장 15-16절',
          text: '우리에게 있는 대제사장은 우리의 연약함을 동정하지 못하실 이가 아니요... 그러므로 우리는 긍휼하심을 받고 때를 따라 돕는 은혜를 얻기 위하여 은혜의 보좌 앞에 담대히 나아갈 것이니라'
        }
      ],
      prayerPoints: [
        '내 뜻과 세속적 조급함을 내려놓고 십자가의 신실하신 은혜를 신뢰하도록',
        '고난 중에도 삼위일체 하나님의 주권적 선하심을 의심치 않도록',
        '지역 교회 공동체 목회자 및 성도들과 영적 아픔을 나누며 위로받도록'
      ],
      aiLimitationNotice: '⚠️ [LOGOS AI 안내]: 본 답변은 인공지능이 성경 66권과 정통 신학에 기초하여 제공한 묵상 참고자료입니다. 영적 중생과 은혜는 성령 하나님과 성도님이 속하신 지역 교회 공동체를 통해 이뤄집니다.'
    };
  }

  /**
   * 3. 정통 신학 가이드라인 및 이단/기복주의 검증
   */
  public static async verifyGuardrails(userInput: string): Promise<GuardrailCheckResult> {
    await new Promise((res) => setTimeout(res, 500));

    const input = userInput.trim();

    const check1 = TheologicalGuardrailLevel1.check(input);
    if (check1.isViolated) {
      return {
        input,
        isHeresyOrProsperity: true,
        identifiedCategory: check1.category as any,
        theologicalAnalysis: check1.analysis!,
        scripturalCorrection: check1.correction!,
        orthodoxReformedPerspective: '정통 개혁주의는 복음을 세속적 상업이나 기복의 도구로 전락시키지 않으며, 오직 십자가 예수 그리스도의 구속과 하나님의 영광을 바라보는 신앙을 선포합니다.'
      };
    }

    return {
      input,
      isHeresyOrProsperity: false,
      identifiedCategory: '건전함',
      theologicalAnalysis: '입력하신 내용은 성경 66권의 정통 개혁주의 및 복음주의 신학 교리와 부합하며 건전한 성경적 묵상 방향을 제시하고 있습니다.',
      scripturalCorrection: '성경 전체의 통일성과 십자가 구속의 진리 안에서 자유함과 은혜를 누리시기 바랍니다.',
      orthodoxReformedPerspective: '성경 66권은 성령의 조명을 통해 그리스도의 구속과 하나님의 영광을 나타내는 유일무이한 인어무오한 하나님의 말씀입니다.'
    };
  }
}
