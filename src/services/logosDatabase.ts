export interface ExistentialStruggle {
  id: string;
  category: '불안/Anxiety' | '외로움/Loneliness' | '실패/Failure' | '죄책감/Guilt' | '정체성/Identity';
  title: string;
  description: string;
  primaryScripture: string;
  originalLanguageInsights: string;
  redemptiveLink: string;
  characterStory: string;
  practicalRoutine: string[];
}

/**
 * 📚 LOGOS: 5대 인간 고뇌 (Existential Struggles) RAG DB & Exegesis Corpus
 */
export const LOGOS_EXISTENTIAL_DB: ExistentialStruggle[] = [
  {
    id: 'anxiety',
    category: '불안/Anxiety',
    title: 'AI 시대의 불확실성과 내일에 대한 염려',
    description: '모든 것이 너무 빠르게 변하고 미래를 통제할 수 없어 영혼이 갈라지는 불안',
    primaryScripture: '마태복음 6:25-34',
    originalLanguageInsights: '헬라어 "메림나오(μεριμνάω)"는 마음이 여러 조각으로 산산이 갈라지는 상태를 뜻합니다.',
    redemptiveLink: '아들까지 아끼지 아니하시고 내어주신 하나님 아버지의 십자가 사랑(로마서 8:32)이 만물의 섭리를 다스리십니다.',
    characterStory: '광야에서 매일 한 날 분량의 만나만을 바라보며 걸어야 했던 이스라엘 백성과 다윗의 시편 23편.',
    practicalRoutine: [
      '통제할 수 없는 내일의 염려를 십자가 앞에 기도로 내려놓기',
      '오늘 내게 주신 일용할 양식과 숨 쉴 수 있는 은혜에 감사하기',
      '믿음의 성도들과 매일 한 가지 은혜 나누기'
    ]
  },
  {
    id: 'loneliness',
    category: '외로움/Loneliness',
    title: '연결 속의 고립감과 깊은 군중 속의 외로움',
    description: '디지털로 모든 사람과 연결되어 있지만 정작 내 아픔을 알아주는 이가 없는 소외감',
    primaryScripture: '시편 142:1-5 / 히브리서 4:15-16',
    originalLanguageInsights: '히브리어 "사하흐(שָׂחַח)"는 영혼이 완전히 엎드러져 억눌린 탄식을 의미합니다.',
    redemptiveLink: '겟세마네 동산에서 제자들마저 졸고 있을 때 홀로 고독의 잔을 받으신 예수 그리스도의 대속적 동행.',
    characterStory: '아둘람 굴 속에서 홀로 외로이 부르짖던 다윗과 로뎀나무 아래 엎드린 엘리야.',
    practicalRoutine: [
      '나보다 먼저 고독을 겪으신 대제사장 예수님께 기도하기',
      '주일에 지역 교회 성도의 교제에 솔직한 모습으로 참여하기',
      '나처럼 외로운 이웃 한 명에게 따뜻한 메시지 보내기'
    ]
  },
  {
    id: 'failure',
    category: '실패/Failure',
    title: '사업 실패, 경력 자절 및 상실의 아픔',
    description: '수년 간 쌓아온 노력이 무너지고 세상의 평가 앞에 무력해진 절망',
    primaryScripture: '로마서 8:28-30 / 고린도후서 12:9-10',
    originalLanguageInsights: '헬라어 "순에르게이(συνεργεῖ)"는 모든 정황을 하나님이 선(그리스도의 형상)으로 조율하심을 뜻합니다.',
    redemptiveLink: '십자가의 가장 극심한 수치와 실패처럼 보였던 죽음이 인류를 구원하는 영광의 부활이 됨.',
    characterStory: '모리아 산에서 독자 이삭을 바친 아브라함과 약함 속에서 온전해진 사도 바울.',
    practicalRoutine: [
      '세속의 성공 잣대가 아닌 십자가 피 값으로 사신 하나님의 자녀 신분 기억하기',
      '재정 및 경력의 아픔을 교회 목회자에게 나누고 기도 요청하기',
      '하루에 한 가지 작은 영적 성화의 일과 실천하기'
    ]
  },
  {
    id: 'guilt',
    category: '죄책감/Guilt',
    title: '지속적인 영적 넘어짐과 수치심',
    description: '반복되는 수치심과 수없이 넘어진 죄책감 때문에 하나님 앞에 나아가기 힘든 정죄감',
    primaryScripture: '로마서 8:1-2 / 요한일서 1:9',
    originalLanguageInsights: '헬라어 "카타크리마(κατάκριμα)"는 사형 선고 판결이 완전히 해제되었음을 선포합니다.',
    redemptiveLink: '십자가에서 "다 이루었다(테텔레스타이)" 선언하신 예수님의 완벽한 단번의 대속 제사.',
    characterStory: '예수님을 세 번 부인했으나 "네가 나를 사랑하느냐" 복원받은 베드로.',
    practicalRoutine: [
      '내 공로가 아닌 오직 그리스도의 의(義)의 옷을 입었음을 선포하기',
      '거짓 수치심을 주는 사탄의 정죄를 말씀으로 물리치기',
      '성찬과 은혜의 방도에 담대히 나아가기'
    ]
  },
  {
    id: 'identity',
    category: '정체성/Identity',
    title: '내가 누구인지 잃어버린 영적 방황',
    description: '세상의 자격증, 수입, 평가에 따라 흔들리는 내 존재 가치의 불안',
    primaryScripture: '에베소서 1:3-7 / 베드로전서 2:9',
    originalLanguageInsights: '헬라어 "에클레고마이(ἐκλέγομαι)"는 창세 전에 하나님께서 인격적으로 택하셨음을 뜻합니다.',
    redemptiveLink: '왕 같은 제사장이요 거룩한 나라로서 그리스도 안에서 영원히 보장된 성도의 정체성.',
    characterStory: '왕궁의 왕자에서 광야의 양치기로 낮아진 후 하나님의 대언자로 세워진 모세.',
    practicalRoutine: [
      '매일 아침 "나는 그리스도 안에서 하나님의 사랑받는 자녀다" 선포하기',
      '타인과의 세속적 비교를 멈추고 은사대로 섬기기',
      '말씀 묵상 노트를 쓰며 정체성 단련하기'
    ]
  }
];

export interface ScriptureRecommendation {
  passage: string;
  bookTitle: string;
  theme: string;
  reasoning: string;
}

/**
 * 🔍 시대적 주제 키워드 기반 AI 성경 본문 구절 자동 탐색 & 추천 엔진
 */
export const recommendScriptures = (topicKeyword: string): ScriptureRecommendation[] => {
  const kw = topicKeyword.trim().toLowerCase();

  // 1. Keyword-based precision matching rules
  if (kw.includes('불안') || kw.includes('인공지능') || kw.includes('ai') || kw.includes('통제') || kw.includes('내일') || kw.includes('미래') || kw.includes('불확실')) {
    return [
      {
        passage: '마태복음 6:25-34',
        bookTitle: '마태복음',
        theme: '하나님의 주권적 섭리와 하나님 나라',
        reasoning: '모든 것을 통제하려는 현대인의 염려를 공중의 새와 들의 백합화를 기르시는 주권적 은혜로 해소하는 대표 본문'
      },
      {
        passage: '에베소서 5:15-17',
        bookTitle: '에베소서',
        theme: '세월을 아끼는 영적 지혜',
        reasoning: '급변하는 기술과 문명 시대 속에서 하나님의 뜻이 무엇인지 분별하는 지혜'
      },
      {
        passage: '시편 46:1-3',
        bookTitle: '시편',
        theme: '환난 중에 만날 큰 피난처',
        reasoning: '세상의 혼돈과 불확실성 속에서도 흔들리지 않는 하나님의 거룩한 처소'
      }
    ];
  }

  if (kw.includes('외로움') || kw.includes('고립') || kw.includes('소외') || kw.includes('관계') || kw.includes('우울') || kw.includes('혼자')) {
    return [
      {
        passage: '시편 142:1-5',
        bookTitle: '시편',
        theme: '굴 속에서 드리는 탄식과 피난처',
        reasoning: '아둘람 굴의 다윗처럼 홀로 고립된 성도에게 삼위일체 하나님이 유일한 피난처임을 선포'
      },
      {
        passage: '히브리서 4:15-16',
        bookTitle: '히브리서',
        theme: '우리의 연약함을 동정하시는 대제사장',
        reasoning: '우리의 모든 외로움과 고통을 친히 담당하신 예수 그리스도의 대속적 동행'
      },
      {
        passage: '이사야 41:10',
        bookTitle: '이사야',
        theme: '임마누엘의 약속',
        reasoning: '두려워하지 말라 내가 너와 함께 함이라 고백하는 영원한 동행의 말씀'
      }
    ];
  }

  if (kw.includes('실패') || kw.includes('경력') || kw.includes('사업') || kw.includes('재정') || kw.includes('고난') || kw.includes('시련') || kw.includes('좌절')) {
    return [
      {
        passage: '로마서 8:28-30',
        bookTitle: '로마서',
        theme: '모든 것을 합력하여 선을 이루시는 은혜',
        reasoning: '성도의 삶에서 일어나는 모든 실패와 시련조차 십자가 영광으로 재조율하시는 하나님 섭리'
      },
      {
        passage: '고린도후서 12:9-10',
        bookTitle: '고린도후서',
        theme: '약할 때 강함 되시는 그리스도의 능력',
        reasoning: '내 능력이 아닌 그리스도의 십자가 은혜가 내 약함 속에서 온전해짐을 고백'
      },
      {
        passage: '시편 34:17-19',
        bookTitle: '시편',
        theme: '마음이 상한 자를 부원하시는 여호와',
        reasoning: '부서진 마음을 결코 멸시치 아니하시고 고난에서 건지시는 목자 하나님'
      }
    ];
  }

  if (kw.includes('죄') || kw.includes('죄책감') || kw.includes('용서') || kw.includes('회개') || kw.includes('수치') || kw.includes('정죄')) {
    return [
      {
        passage: '로마서 8:1-2',
        bookTitle: '로마서',
        theme: '그리스도 예수 안에 있는 자에게 결코 없음',
        reasoning: '생명의 성령의 법이 죄와 사망의 법에서 완벽히 해방하였음을 선포'
      },
      {
        passage: '시편 51:1-12',
        bookTitle: '시편',
        theme: '정한 마음의 창조와 보혈의 정결',
        reasoning: '다윗의 참회시로 십자가 보혈로만 깨끗함을 입는 구속사적 은혜'
      },
      {
        passage: '요한일서 1:9',
        bookTitle: '요한일서',
        theme: '미쁘시고 의로우신 용서의 하나님',
        reasoning: '우리가 우리 죄를 자복할 때 모든 불의에서 정결하게 하시는 은혜'
      }
    ];
  }

  if (kw.includes('정체성') || kw.includes('가치') || kw.includes('방황') || kw.includes('비교') || kw.includes('자격') || kw.includes('소명')) {
    return [
      {
        passage: '에베소서 1:3-7',
        bookTitle: '에베소서',
        theme: '창세 전 예정과 그리스도 안에서의 기업',
        reasoning: '세속적 기준이 아닌 창세 전 삼위일체 하나님의 신령한 복과 자녀의 신분'
      },
      {
        passage: '베드로전서 2:9',
        bookTitle: '베드로전서',
        theme: '택하신 족속이요 왕 같은 제사장',
        reasoning: '거룩한 나라와 주님의 소유 된 백성으로서의 성도의 영광스러운 정체성'
      },
      {
        passage: '시편 139:13-16',
        bookTitle: '시편',
        theme: '신묘막측한 창조와 주권',
        reasoning: '모태에서부터 나를 지으신 하나님의 세밀하고 거룩한 뜻'
      }
    ];
  }

  if (kw.includes('가정') || kw.includes('부부') || kw.includes('자녀') || kw.includes('사랑') || kw.includes('용서')) {
    return [
      {
        passage: '에베소서 5:22-33',
        bookTitle: '에베소서',
        theme: '교회와 그리스도의 신비와 가정의 비밀',
        reasoning: '그리스도가 교회를 사랑하듯 부부가 서로 섬기며 일치를 이루는 성경적 가정'
      },
      {
        passage: '고린도전서 13:1-7',
        bookTitle: '고린도전서',
        theme: '십자가 사랑의 참된 성품',
        reasoning: '모든 것을 참으며 온유하고 성내지 않는 그리스도의 대속적 사랑'
      }
    ];
  }

  // Default fallback recommendations for general topic keywords
  return [
    {
      passage: '마태복음 6:25-34',
      bookTitle: '마태복음',
      theme: '하나님의 주권적 섭리와 안식',
      reasoning: '현대인의 영적 갈증과 염려를 공중의 새와 들의 백합화를 통해 해소하는 핵심 구절'
    },
    {
      passage: '이사야 40:28-31',
      bookTitle: '이사야',
      theme: '여호와를 바라는 자의 새 힘',
      reasoning: '피곤하고 곤비한 세속의 삶에서 독수리 날개치며 올라감 같은 은혜'
    },
    {
      passage: '시편 23:1-6',
      bookTitle: '시편',
      theme: '여호와는 나의 목자시니',
      reasoning: '선한 목자 되신 주님 안에서 평안과 잔의 넘침을 선포하는 대표 찬송시'
    }
  ];
};

