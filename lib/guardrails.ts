export interface CrisisCheckResult {
  isCrisis: boolean;
  message?: string;
  hotlines?: { name: string; number: string }[];
}

export interface TheologicalValidationResult {
  isValid: boolean;
  category?: string;
  analysis?: string;
  correction?: string;
}

/**
 * 🛡️ Project LOGOS Guardrail System (Level 1 Regex + Level 2 Crisis Hotline Interceptor)
 */
export class LogosGuardrailService {
  // Level 1: Banned Theological Patterns (Prosperity Gospel, Heresies, Fatalism)
  private static readonly BANNED_PATTERNS = [
    {
      pattern: /(무조건적인 재물|100% 성공|사업 대박|재물 헌금|부자 되게|병 무조건 고침|기복)/i,
      category: '번영신학 / 기복주의',
      analysis: '예수 그리스도의 십자가 구속을 물질적 현세의 부와 세속적 성공의 거래 수단으로 전락시키는 사상입니다.',
      correction: '디모데전서 6:5-10은 마음이 부패하여 경건을 이익의 방도로 생각하는 유혹을 경계하며, 십자가를 지고 주를 따르는 참된 경건을 강조합니다.'
    },
    {
      pattern: /(고통은 (오직|100%|전적으로) (믿음이 없어서|죄 때문)|벌 받은 것)/i,
      category: '율법주의적 정죄',
      analysis: '고난 당하는 성도의 아픔을 자의적으로 정죄하는 욥의 친구들과 같은 율법주의적 오류입니다.',
      correction: '요한복음 9:3 및 로마서 8:1은 정죄함이 없음을 선포하며, 고난이 하나님의 은혜와 성화를 드러내는 통로임을 강조합니다.'
    },
    {
      pattern: /(운명|사주|팔자|숙명|미래 예언|점|특정 날짜에 결정)/i,
      category: '숙명론 / 운명론',
      analysis: '인간의 삶이 비인격적인 운명이나 사주팔자에 의존한다는 숙명론 및 비성경적 점술 경향입니다.',
      correction: '신명기 18:10-12 및 시편 139편은 점술을 엄히 금하며, 삼위일체 하나님의 주권적 섭리를 신뢰하도록 선포합니다.'
    },
    {
      pattern: /(행위로만 구원|공로로 구원|자력 구원)/i,
      category: '행위구원론 / 펠라기우스주의',
      analysis: '오직 은혜, 오직 믿음(Sola Fide)의 구원관을 부정하는 행위공로주의 오류입니다.',
      correction: '에베소서 2:8-9는 구원이 하나님의 은혜의 선물이며 어떤 행위로도 자랑할 수 없음을 분명히 합니다.'
    },
    {
      pattern: /(예수가 피조물|예수 인간일뿐|신성 부정|하나님이 아님)/i,
      category: '아리우스주의 (Arianism)',
      analysis: '예수 그리스도의 영원한 신성과 삼위일체 교리를 부정하는 이단 경향입니다.',
      correction: '요한복음 1:1-3 및 골로새서 1:15-17은 예수께서 태초부터 하나님이시며 만물의 창조주이심을 증언합니다.'
    }
  ];

  // Level 2: Crisis Detection Keywords (Self-harm / Suicide)
  private static readonly CRISIS_KEYWORDS = [
    '자살', '죽고 싶다', '극단적 선택', '살인', '자해', '삶을 포기', '더 이상 못 참겠', '죽는 게 낫'
  ];

  /**
   * Run Level 1 Theological Pattern Validation
   */
  public static validateTheology(input: string): TheologicalValidationResult {
    for (const rule of this.BANNED_PATTERNS) {
      if (rule.pattern.test(input)) {
        return {
          isValid: false,
          category: rule.category,
          analysis: rule.analysis,
          correction: rule.correction
        };
      }
    }
    return { isValid: true };
  }

  /**
   * Run Level 2 Real-time Crisis Detection & Hotlines Override
   */
  public static checkCrisis(input: string): CrisisCheckResult {
    const isCrisis = this.CRISIS_KEYWORDS.some((kw) => input.includes(kw));

    if (isCrisis) {
      return {
        isCrisis: true,
        message: '성도님, 지금 겪고 계신 아픔이 너무나 깊다는 것을 느낍니다. 당신의 생명은 하나님께 너무나 귀중합니다. 혼자 짐을 지지 마시고, 즉시 도움을 요청해 주세요.',
        hotlines: [
          { name: '자살예방 상담전화', number: '109 (국번없이 24시간)' },
          { name: '정신건강 상담전화', number: '1577-0199 (24시간)' },
          { name: '생명의 전화', number: '1588-9191' },
          { name: '청소년 상담전화', number: '1388' }
        ]
      };
    }

    return { isCrisis: false };
  }

  /**
   * Standard Theological Disclaimer Footer (Distinction of Nature)
   */
  public static getDisclaimer(): string {
    return '\n\n---\n*💡 [Project LOGOS 안내] 본 AI 상담/설교 시스템은 성경적 묵상과 조언을 돕기 위해 개발된 도구입니다. 진정한 영적 회복과 보살핌은 성령 하나님의 역사와 지역 교회 공동체(목회자 및 성도)와의 관계 속에서 완성됩니다.*';
  }
}
