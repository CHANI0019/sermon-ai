import { NewsItem } from './newsRssService';
import { SermonResult } from '../types';

/**
 * 📖 성경 66권 캐논 데이터베이스 정보
 */
export interface BibleBookInfo {
  name: string;
  category: string;
  testament: 'OT' | 'NT';
  keyTheme: string;
}

export const BIBLE_66_BOOKS: BibleBookInfo[] = [
  { name: '창세기', category: '율법서', testament: 'OT', keyTheme: '창조, 구속사의 시작, 문화대명령' },
  { name: '출애굽기', category: '율법서', testament: 'OT', keyTheme: '구원, 십계명, 율법과 은혜' },
  { name: '레위기', category: '율법서', testament: 'OT', keyTheme: '거룩, 제사, 정결한 삶' },
  { name: '민수기', category: '율법서', testament: 'OT', keyTheme: '광야 연단, 주권적 인도' },
  { name: '신명기', category: '율법서', testament: 'OT', keyTheme: '말씀 순종, 다음 세대 전수' },
  { name: '여호수아', category: '역사서', testament: 'OT', keyTheme: '약속의 땅, 정복과 믿음' },
  { name: '사사기', category: '역사서', testament: 'OT', keyTheme: '회개와 구원, 왕이 없던 시대' },
  { name: '룻기', category: '역사서', testament: 'OT', keyTheme: '기업 무를 자, 은혜의 구속' },
  { name: '사무엘상', category: '역사서', testament: 'OT', keyTheme: '기름 부음 받은 왕, 기도' },
  { name: '사무엘하', category: '역사서', testament: 'OT', keyTheme: '다윗 언약, 회개와 복원' },
  { name: '열왕기상', category: '역사서', testament: 'OT', keyTheme: '성전 건축, 분열과 선지자' },
  { name: '열왕기하', category: '역사서', testament: 'OT', keyTheme: '왕국의 흥망성쇠, 엘리샤' },
  { name: '역대상', category: '역사서', testament: 'OT', keyTheme: '다윗의 다락방 찬양, 주권' },
  { name: '역대하', category: '역사서', testament: 'OT', keyTheme: '성전 중심 회복, 겸손' },
  { name: '에스라', category: '역사서', testament: 'OT', keyTheme: '포로 귀환, 말씀 재건' },
  { name: '느헤미야', category: '역사서', testament: 'OT', keyTheme: '성벽 재건, 기도의 사명' },
  { name: '에스더', category: '역사서', testament: 'OT', keyTheme: '보이지 않는 하나님의 섭리' },
  { name: '욥기', category: '시가서', testament: 'OT', keyTheme: '고난의 신비, 하나님의 주권' },
  { name: '시편', category: '시가서', testament: 'OT', keyTheme: '찬양, 기도, 피난처 되신 하나님' },
  { name: '잠언', category: '시가서', testament: 'OT', keyTheme: '여호와 경외, 정직한 지혜' },
  { name: '전도서', category: '시가서', testament: 'OT', keyTheme: '해 아래의 헛됨, 하나님 중심 삶' },
  { name: '아가', category: '시가서', testament: 'OT', keyTheme: '그리스도와 교회의 거룩한 사랑' },
  { name: '이사야', category: '대선지서', testament: 'OT', keyTheme: '메시아 예언, 고난 받는 종' },
  { name: '예레미야', category: '대선지서', testament: 'OT', keyTheme: '눈물의 경고, 새 언약' },
  { name: '예레미야애가', category: '대선지서', testament: 'OT', keyTheme: '아픔의 탄식, 주의 아침마다 새로운 인자' },
  { name: '에스겔', category: '대선지서', testament: 'OT', keyTheme: '마른 뼈의 환상, 성전 환상' },
  { name: '다니엘', category: '대선지서', testament: 'OT', keyTheme: '세속 제국 속 신앙 절개, 영원한 나라' },
  { name: '호세아', category: '소선지서', testament: 'OT', keyTheme: '변함없는 하나님의 구속적 사랑' },
  { name: '요엘', category: '소선지서', testament: 'OT', keyTheme: '성령을 모든 육체에 부어주시리라' },
  { name: '아모스', category: '소선지서', testament: 'OT', keyTheme: '정의를 물 같이, 공의를 강 같이' },
  { name: '오바댜', category: '소선지서', testament: 'OT', keyTheme: '교만한 에돔 심판, 여호와의 나라' },
  { name: '요나', category: '소선지서', testament: 'OT', keyTheme: '이방인을 향한 하나님의 긍휼' },
  { name: '미가', category: '소선지서', testament: 'OT', keyTheme: '베들레헴 탄생 예언, 공의와 인자' },
  { name: '나훔', category: '소선지서', testament: 'OT', keyTheme: '니느웨 심판, 피난처 되신 주님' },
  { name: '하박국', category: '소선지서', testament: 'OT', keyTheme: '의인은 그의 믿음으로 말미암아 살리라' },
  { name: '스바냐', category: '소선지서', testament: 'OT', keyTheme: '너로 말미암아 기쁨을 이기지 못하시며' },
  { name: '학개', category: '소선지서', testament: 'OT', keyTheme: '성전 재건, 나중 영광이 크리라' },
  { name: '스가랴', category: '소선지서', testament: 'OT', keyTheme: '겸손히 나귀 탄 왕 메시아' },
  { name: '말라기', category: '소선지서', testament: 'OT', keyTheme: '의로운 해가 떠올라 치료하는 광선' },
  { name: '마태복음', category: '복음서', testament: 'NT', keyTheme: '유대인의 왕 예수, 산상수훈, 먼저 그 나라' },
  { name: '마가복음', category: '복음서', testament: 'NT', keyTheme: '섬기는 종 예수, 대속물' },
  { name: '누가복음', category: '복음서', testament: 'NT', keyTheme: '인자 예수, 잃어버린 자를 찾아 구원' },
  { name: '요한복음', category: '복음서', testament: 'NT', keyTheme: '하나님의 아들, 길이요 진리요 생명' },
  { name: '사도행전', category: '역사서', testament: 'NT', keyTheme: '성령 임재, 복음의 증인, 열방 전파' },
  { name: '로마서', category: '바울서신', testament: 'NT', keyTheme: '이신득의, 십자가 복음, 끊을 수 없는 사랑' },
  { name: '고린도전서', category: '바울서신', testament: 'NT', keyTheme: '십자가의 도, 사랑장, 부활 소망' },
  { name: '고린도후서', category: '바울서신', testament: 'NT', keyTheme: '질그릇 안의 보배, 화목하게 하는 직분' },
  { name: '갈라디아서', category: '바울서신', testament: 'NT', keyTheme: '복음의 자유, 성령의 열매' },
  { name: '에베소서', category: '바울서신', testament: 'NT', keyTheme: '교회의 영광, 전신갑주, 문화 분별' },
  { name: '빌립보서', category: '바울서신', testament: 'NT', keyTheme: '주 안에서 기뻐하라, 평강의 하나님' },
  { name: '골로새서', category: '바울서신', testament: 'NT', keyTheme: '만물의 으뜸이신 그리스도' },
  { name: '데살로니가전서', category: '바울서신', testament: 'NT', keyTheme: '주님의 재림 소망, 항상 기뻐하라' },
  { name: '데살로니가후서', category: '바울서신', testament: 'NT', keyTheme: '배도에 미혹되지 않는 굳건함' },
  { name: '디모데전서', category: '바울서신', testament: 'NT', keyTheme: '경건과 자족, 재물의 바른 사용' },
  { name: '디모데후서', category: '바울서신', testament: 'NT', keyTheme: '선한 싸움을 싸우고 완주하는 삶' },
  { name: '디도서', category: '바울서신', testament: 'NT', keyTheme: '바른 신학 교리, 선한 행실' },
  { name: '빌레몬서', category: '바울서신', testament: 'NT', keyTheme: '용서와 형제 됨의 사랑' },
  { name: '히브리서', category: '일반서신', testament: 'NT', keyTheme: '대제사장 예수, 믿음장의 선진들, 영원한 안식' },
  { name: '야고보서', category: '일반서신', testament: 'NT', keyTheme: '행함이 있는 산 믿음, 언어의 절제' },
  { name: '베드로전서', category: '일반서신', testament: 'NT', keyTheme: '산 소망, 고난 속 거룩한 행실' },
  { name: '베드로후서', category: '일반서신', testament: 'NT', keyTheme: '거짓 교사 미혹 주의, 주의 날' },
  { name: '요한1서', category: '일반서신', testament: 'NT', keyTheme: '하나님은 사랑이심, 정결함' },
  { name: '요한2서', category: '일반서신', testament: 'NT', keyTheme: '진리와 사랑 안에서 행함' },
  { name: '요한3서', category: '일반서신', testament: 'NT', keyTheme: '영혼이 잘됨 같이 범사에 강건함' },
  { name: '유다서', category: '일반서신', testament: 'NT', keyTheme: '단번에 주신 믿음의 도를 위해 힘써 싸우라' },
  { name: '요한계시록', category: '예언서', testament: 'NT', keyTheme: '어린 양의 승리, 새 하늘과 새 땅, 알파와 오메가' }
];

/**
 * ✂️ 뉴스 RSS 찌꺼기 텍스트 제거 및 완벽한 한국어 문장 종결 처리 함수
 * - 무단 잘림(slice) 방지 및 완성된 종결 문장만 정제하여 반환
 */
function cleanAndExtractSummary(text: string): string {
  if (!text) return '이 소식은 우리 사회의 중요한 현실과 성도의 영적 분별력을 조명합니다.';

  // 1. 기자 이름, 경찰서, 날짜 등 뉴스 찌꺼기 패턴 정제
  let cleaned = text
    .replace(/\[.*?\]|\(.*?\)/g, '') // 개괄 괄호 제거
    .replace(/경찰에 따르면|...밝혔다|...신청했다고|...전했다|기자|뉴스|연합뉴스|경북|포항|포항북부경찰서|\d+일|\d+시쯤/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // 2. 완성된 종결 문장만 추출 (. ! ? 기준)
  const sentenceMatches = cleaned.match(/[^.!?]+[.!?]/g);
  if (sentenceMatches && sentenceMatches.length > 0) {
    // 첫 1~2개 완전한 문장 조합
    const completeSentences = sentenceMatches.slice(0, 2).join(' ').trim();
    if (completeSentences.length > 15) {
      return completeSentences;
    }
  }

  // 3. 종결 부호가 없을 경우, 자르지 않고 완성된 문장 형태로 자연스럽게 다듬기
  if (cleaned.length > 80) {
    const spacePos = cleaned.indexOf(' ', 70);
    if (spacePos !== -1) {
      cleaned = cleaned.slice(0, spacePos);
    }
  }

  return cleaned ? `${cleaned}에 관한 소식은 우리에게 깊은 영적 생각을 안겨줍니다.` : '이 소식은 오늘을 살아가는 성도의 삶을 조명합니다.';
}

/**
 * 💡 뉴스 제목(Headline)과 뉴스 본문을 직접 반영하는 100% 동적 QT 묵상 엔진
 */
export function generateSmartNewsQT(news: NewsItem): SermonResult & { prayer1: string; prayer2: string; prayer3: string } {
  // 뉴스 제목 자름 방지: 완전한 어절 단위로 정제
  let title = news.title.trim().replace(/\[.*?\]|\(.*?\)/g, '').trim();
  let displayTitle = title;
  if (title.length > 25) {
    const spaceIdx = title.indexOf(' ', 20);
    displayTitle = spaceIdx !== -1 ? title.slice(0, spaceIdx) : title.slice(0, 25);
  }

  const category = news.category || '시사/사회';
  const cleanSummary = cleanAndExtractSummary(news.description);

  // Pick unique Scripture passage based on headline hash
  const hash = Array.from(title).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const book1 = BIBLE_66_BOOKS[hash % BIBLE_66_BOOKS.length];
  const book2 = BIBLE_66_BOOKS[(hash + 13) % BIBLE_66_BOOKS.length];

  const passage = `${book1.name} / ${book2.name}`;

  // 100% 정갈하게 작성된 3대지 묵상 본문 (문장 잘림 100% 없음)
  const point1Title = `1. "${displayTitle}" 소식 속에 나타난 현 시대의 고뇌`;
  const point1Body = `오늘 우리가 만난 뉴스("${title}")는 현대 사회가 안고 있는 실제적 불안과 아픔을 그대로 보여줍니다. ${cleanSummary}`;

  const point2Title = `2. ${book1.name} 말씀을 통해 바라보는 성경적 통찰과 영적 분별`;
  const point2Body = `${book1.name} 말씀에 계시된 바와 같이(${book1.keyTheme}), 성도는 세속의 불안이나 충격적인 소식에 흔들리지 않고 하나님 주권적 섭리 안에서 진리의 말씀으로 세상을 분별해야 합니다.`;

  const point3Title = `3. ${category} 현장을 향한 성도의 구체적 중보와 사랑 실천`;
  const point3Body = `뉴스를 단순히 소비하는 데 머물지 않고, 이 소식으로 인하여 아파하고 상처 입은 이웃들과 사회 현장을 향해 기도와 그리스도의 따뜻한 복음의 사랑을 실천하는 청지기로 살아갑니다.`;

  const prayer1 = `"${displayTitle}" 소식으로 인하여 아파하고 고통받는 이웃들과 우리 사회에 주님의 위로와 공의가 임하게 하소서.`;
  const prayer2 = `세속적 이슈와 불확실한 세상 소문에 마음에 평안을 잃지 않고, ${book1.name} 말씀의 가치관 안에서 굳건한 신앙을 지키게 하소서.`;
  const prayer3 = `${category} 현장에서 주님의 사랑과 복음의 빛을 실천하며 세상을 치유하는 성숙한 크리스천 청지기가 되게 하소서.`;

  const exegesis = `이 뉴스("${displayTitle}")는 우리 사회의 부조리와 인간의 영적 갈증을 조명합니다. ${book1.name} 및 ${book2.name}의 핵심 메시지인 '${book1.keyTheme}'의 시선으로 바라볼 때, 성도는 세상의 조급함 대신 하나님 나라의 영원한 소망을 발견하게 됩니다.`;

  const conclusion = `세상의 시사 기사는 매일 변하고 지나가지만, ${book1.name}과 ${book2.name}을 관통하는 하나님의 영원한 구속적 말씀은 오늘 성도님의 삶을 세세토록 안전하게 지키실 것입니다.`;

  return {
    title: `[오늘의 시사 묵상] "${displayTitle}"`,
    passage,
    hook: `오늘 우리가 접한 뉴스("${title}")는 급변하는 이 시대 속에서 성도가 겪는 현실적 질문을 던집니다. 세상 소식 뒤에서 하나님은 오늘 우리에게 어떤 말씀의 지혜와 평안을 주십니까?`,
    exegesis,
    point1: {
      title: point1Title,
      body: point1Body
    },
    point2: {
      title: point2Title,
      body: point2Body
    },
    point3: {
      title: point3Title,
      body: point3Body
    },
    prayer1,
    prayer2,
    prayer3,
    conclusion
  };
}
