export interface BibleBookInfo {
  id: string;
  name: string; // 성경책 이름 (예: 창세기, 로마서)
  englishName: string;
  testament: 'OT' | 'NT'; // 구약 / 신약
  category: '율법서' | '역사서' | '시가서' | '대선지서' | '소선지서' | '복음서' | '바울서신' | '공동서신' | '예언서';
  summary: string; // 한 줄 핵심 주제
  redemptiveLink: string; // 구속사적 그리스도 중심 조명 (Christ-Centered Link)
  keyVerse: { reference: string; text: string }; // 대표 요절
  exegeticalKeywords: string[]; // 주해 키워드
}

/**
 * 📖 성경 66권 전권 (구약 39권 + 신약 27권) 구속사적 데이터베이스 코퍼스
 */
export const BIBLE_66_BOOKS: BibleBookInfo[] = [
  // ==========================================
  // 📜 구약 39권 (Old Testament)
  // ==========================================
  // [율법서 - 모세오경 5권]
  {
    id: 'genesis',
    name: '창세기',
    englishName: 'Genesis',
    testament: 'OT',
    category: '율법서',
    summary: '창조, 아담의 타락, 여자의 후손 언약 및 아브라함 언약 가문의 시작',
    redemptiveLink: '여자의 후손(창 3:15)으로 오셔서 뱀의 머리를 깨뜨리실 예수 그리스도와 이삭 대신 준비된 속죄의 양(여호와 이레).',
    keyVerse: { reference: '창세기 3:15', text: '내가 너로 여자와 원수가 되게 하고 네 후손도 여자의 후손과 원수가 되게 하리니 여자의 후손은 네 머리를 상하게 할 것이요...' },
    exegeticalKeywords: ['창조', '타락', '원시복음', '아브라함 언약', '여호와 이레']
  },
  {
    id: 'exodus',
    name: '출애굽기',
    englishName: 'Exodus',
    testament: 'OT',
    category: '율법서',
    summary: '애굽의 종 됨에서 구원, 유월절 어린 양의 피, 시내산 언약과 성막',
    redemptiveLink: '유월절 어린 양의 피로 인류를 죄와 사망에서 속량하시고 하나님 임재(성막)가 되신 그리스도.',
    keyVerse: { reference: '출애굽기 12:13', text: '내가 피를 볼 때에 너희를 넘어가리니 재앙이 너희에게 내려 멸하지 아니하리라' },
    exegeticalKeywords: ['출애굽', '유월절 어린양', '시내산 언약', '성막', '속량']
  },
  {
    id: 'leviticus',
    name: '레위기',
    englishName: 'Leviticus',
    testament: 'OT',
    category: '율법서',
    summary: '5대 제사, 아사셀 염소, 대속죄일 및 하나님의 거룩함과 성화의 법',
    redemptiveLink: '단 번에 영원한 완전한 속죄 제물이 되신 단 한 분의 대제사장이자 어린 양이신 예수 그리스도(히브리서 연관).',
    keyVerse: { reference: '레위기 19:2', text: '너는 이스라엘 회중에게 말하여 이르라 너희는 거룩하라 이는 나 여호와 너희 하나님이 거룩함이니라' },
    exegeticalKeywords: ['5대 제사', '대속죄일', '아사셀', '거룩', '속죄 피']
  },
  {
    id: 'numbers',
    name: '민수기',
    englishName: 'Numbers',
    testament: 'OT',
    category: '율법서',
    summary: '광야 40년의 시련, 불평과 방황, 놋뱀의 구원 및 약속의 땅 준비',
    redemptiveLink: '광야에서 놋뱀이 달린 것처럼 십자가에 달려 바라보는 자마다 영생을 얻게 하신 예수 그리스도(요 3:14-15).',
    keyVerse: { reference: '민수기 21:9', text: '모세가 놋뱀을 만들어 봉 위에 달리 뱀에게 물린 자가 놋뱀을 쳐다본즉 모두 살더라' },
    exegeticalKeywords: ['광야 방황', '놋뱀', '바람과 구름기둥', '만나', '불신앙과 신실함']
  },
  {
    id: 'deuteronomy',
    name: '신명기',
    englishName: 'Deuteronomy',
    testament: 'OT',
    category: '율법서',
    summary: '쉐마 이스라엘, 가나안 입성을 앞둔 율법의 재강론과 순종의 축복',
    redemptiveLink: '모세와 같은 참 선지자로 오셔서 하나님의 모든 율법을 완전하게 이루시고 순종의 모범이 되신 그리스도.',
    keyVerse: { reference: '신명기 6:4-5', text: '이스라엘아 들으라 우리 하나님 여호오는 오직 유일한 여호와이시니 너는 마음을 다하고 뜻을 다하고 힘을 다하여 네 하나님 여호와를 사랑하라' },
    exegeticalKeywords: ['쉐마', '율법 재강론', '순종과 불순종', '언약 갱신', '참 선지자']
  },

  // [역사서 12권]
  {
    id: 'joshua',
    name: '여호수아',
    englishName: 'Joshua',
    testament: 'OT',
    category: '역사서',
    summary: '요단강 건너기, 가나안 정복 전쟁과 12지파 기업 분배',
    redemptiveLink: '여호수아(예수와 동일 이름)처럼 자기 백성을 이끌고 죄의 권세를 파하사 영원한 안식의 기업으로 인도하시는 그리스도.',
    keyVerse: { reference: '여호수아 1:9', text: '강하고 담대하라 두려워하지 말며 놀라지 말라 네가 어디로 가든지 네 하나님 여호와가 너와 함께 하느니라' },
    exegeticalKeywords: ['가나안 정복', '요단강', '기업 분배', '믿음의 정복', '여호와 샬롬']
  },
  {
    id: 'judges',
    name: '사사기',
    englishName: 'Judges',
    testament: 'OT',
    category: '역사서',
    summary: '범죄-압제-부르짖음-구원의 순환 주기 및 참된 왕의 부재',
    redemptiveLink: '불완전한 사사들과 달리 자기 백성을 죄의 사슬에서 영원히 구원하시는 완전하시고 신실하신 왕 예수 그리스도.',
    keyVerse: { reference: '사사기 21:25', text: '그 때에 이스라엘에 왕이 없으므로 사람이 각기 자기의 소견에 옳은 대로 행하였더라' },
    exegeticalKeywords: ['영적 악순환', '사사', '자기 소견대로', '구원자', '참 왕의 필요성']
  },
  {
    id: 'ruth',
    name: '룻기',
    englishName: 'Ruth',
    testament: 'OT',
    category: '역사서',
    summary: '이방 여인 룻의 순종, 보아스의 기업 무를 자(고엘) 구속과 다윗 가문',
    redemptiveLink: '이방인인 우리를 위해 신랑 되시어 모든 영적 부채를 탕감하시고 기업을 무르신 구속자 예수 그리스도(고엘 족장).',
    keyVerse: { reference: '룻기 4:14', text: '여인들이 나오미에게 이르되 찬송할지로다 여호와께서 오늘 네게 기업 무를 자가 없게 하지 아니하셨도다...' },
    exegeticalKeywords: ['고엘(기업 무를 자)', '이방 여인 룻', '보아스', '다윗의 혈통', '은혜의 소망']
  },
  {
    id: '1samuel',
    name: '사무엘상',
    englishName: '1 Samuel',
    testament: 'OT',
    category: '역사서',
    summary: '사무엘 선지자, 사울 왕의 몰락, 다윗의 기름 부음과 고난의 훈련',
    redemptiveLink: '사울의 세속적 왕권과 대비되어, 고난받는 종으로 기름 부음 받아 이스라엘의 영원한 왕이 되시는 다윗의 자손 그리스도.',
    keyVerse: { reference: '사무엘상 16:7', text: '여호와께서 사무엘에게 이르시되 그의 용모와 키를 보지 말라... 사람은 외모를 보거니와 나 여호오는 중심을 보느니라' },
    exegeticalKeywords: ['기름 부음', '사울과 다윗', '중심을 보심', '왕권의 시작', '아둘람 굴']
  },
  {
    id: '2samuel',
    name: '사무엘하',
    englishName: '2 Samuel',
    testament: 'OT',
    category: '역사서',
    summary: '다윗 왕국의 통일, 다윗 언약(영원한 왕위)과 밧세바 범죄 후 회개',
    redemptiveLink: '다윗 언약(삼하 7장)의 영원한 왕위를 완성하시고 세세토록 다스리시는 하나님 나라의 보좌 예수 그리스도.',
    keyVerse: { reference: '사무엘하 7:16', text: '네 집과 네 나라가 내 앞에서 영원히 보전되고 네 왕위가 영원히 견고하리라' },
    exegeticalKeywords: ['다윗 언약', '헤브론과 예루살렘', '범죄와 회개', '영원한 왕위', '은혜의 보좌']
  },
  {
    id: '1kings',
    name: '열왕기상',
    englishName: '1 Kings',
    testament: 'OT',
    category: '역사서',
    summary: '솔로몬의 지혜와 성전 건축, 분열 왕국(남유다-북이스라엘)과 엘리야 선지자',
    redemptiveLink: '솔로몬 성전의 영광을 넘어서는 참 성전(요 2:21)이 되시고 솔로몬보다 더 큰 지혜이신 예수 그리스도.',
    keyVerse: { reference: '열왕기상 8:27', text: '하나님이 참으로 땅에 거하시리이까 하늘과 하늘들의 하늘이라도 주를 수용하지 못하겠거든 하물며 내가 건축한 이 성전이오리이까' },
    exegeticalKeywords: ['솔로몬 성전', '분열 왕국', '우상숭배', '갈멜산 엘리야', '참 성전']
  },
  {
    id: '2kings',
    name: '열왕기하',
    englishName: '2 Kings',
    testament: 'OT',
    category: '역사서',
    summary: '엘리사의 기적, 북이스라엘의 멸망(바벨론/아수르), 남유다 멸망과 포로 됨',
    redemptiveLink: '왕들의 타락과 바벨론 포로기 속에서도 남은 자를 보존하사 언약의 줄기를 이어가시는 하나님의 구원 섭리.',
    keyVerse: { reference: '열왕기하 17:13', text: '여호와께서 각 선지자와 각 선견자를 통하여 이스라엘과 유다에 경계하여 이르시기를 너희는 돌이켜 너희 악한 길에서 떠나...' },
    exegeticalKeywords: ['엘리사 기적', '북이스라엘 멸망', '남유다 포로', '남은 자 사상', '선지자의 경고']
  },
  {
    id: '1chronicles',
    name: '역대상',
    englishName: '1 Chronicles',
    testament: 'OT',
    category: '역사서',
    summary: '아담부터 다윗까지의 족보, 다윗 왕국의 성전 예배 준비와 언약 궤',
    redemptiveLink: '구속사의 족보(아담-아브라함-다윗)를 통하여 이 땅에 인간의 몸으로 오신 메시아 예수 그리스도의 성육신 예표.',
    keyVerse: { reference: '역대상 29:11', text: '여호와여 위대하심과 권능과 영광과 승리와 위엄이 다 주께 속하였사오니 천지에 있는 것이 다 주의 것이로소이다' },
    exegeticalKeywords: ['구속사 족보', '다윗의 찬양', '성전 예배 준비', '하나님의 주권', '언약 궤']
  },
  {
    id: '2chronicles',
    name: '역대하',
    englishName: '2 Chronicles',
    testament: 'OT',
    category: '역사서',
    summary: '남유다 왕들의 성전 회복 역동과 히스기야, 요시야 개혁, 고레스 칙령',
    redemptiveLink: '포로 귀환(고레스 칙령)을 통해 언약 백성을 회복시키듯, 죄에서 우리를 귀환시키시는 자유케 하시는 그리스도.',
    keyVerse: { reference: '역대하 7:14', text: '내 이름으로 일컫는 내 백성이 그들의 악한 길에서 떠나 스스로 낮추고 기도하여 내 얼굴을 찾으면 내가 하늘에서 듣고 그들의 죄를 사하고 그들의 땅을 고칠지라' },
    exegeticalKeywords: ['성전 중심 개혁', '히스기야 요시야', '기도와 회복', '고레스 칙령', '포로 귀환']
  },
  {
    id: 'ezra',
    name: '에스라',
    englishName: 'Ezra',
    testament: 'OT',
    category: '역사서',
    summary: '바벨론 포로 1, 2차 귀환, 제2성전(스룹바벨 성전) 재건과 학사 에스라의 말씀 개혁',
    redemptiveLink: '하나님의 말씀(율법)을 연구하고 가르쳐 백성의 영혼을 소생시킨 에스라처럼 은혜의 말씀 자체이신 예수 그리스도.',
    keyVerse: { reference: '에스라 7:10', text: '에스라가 여호와의 율법을 연구하여 준행하며 율례와 규례를 이스라엘에게 가르치기로 결심하였었더라' },
    exegeticalKeywords: ['포로 귀환', '스룹바벨 성전', '에스라 말씀 연구', '영적 회복', '언약 신실성']
  },
  {
    id: 'nehemiah',
    name: '느헤미야',
    englishName: 'Nehemiah',
    testament: 'OT',
    category: '역사서',
    summary: '예루살렘 성벽 중수, 느헤미야의 기도의 지도력과 공동체 영적 대각성',
    redemptiveLink: '무너진 예루살렘 성벽을 재건하듯, 성도의 부서진 삶을 다시 세우시고 방어하시는 보혜사 예수 그리스도.',
    keyVerse: { reference: '느헤미야 8:10', text: '여호와로 인하여 기뻐하는 것이 너희의 힘이니라' },
    exegeticalKeywords: ['성벽 재건', '기도의 지도자', '여호와의 기쁨', '수문 앞 광장 개혁', '영적 방어선']
  },
  {
    id: 'esther',
    name: '에스더',
    englishName: 'Esther',
    testament: 'OT',
    category: '역사서',
    summary: '페르시아 포로지의 위기, "죽으면 죽으리이다" 결단과 부림절 구원',
    redemptiveLink: '하나님의 이름이 겉으로 보이지 않아도 섭리로 자기 백성을 음모에서 구원해 내시는 반전의 십자가 승리.',
    keyVerse: { reference: '에스더 4:14', text: '이 때에 네가 만일 잠잠하여 말이 없으면 유다인은 다른 데로 말미암아 놓임과 구원을 얻으려니와... 네가 왕후의 자리를 얻은 것이 이 때를 위함이 아닌지 누가 알겠느냐' },
    exegeticalKeywords: ['죽으면 죽으리이다', '부림절', '하나님의 숨겨진 섭리', '반전의 구원', '포로지 보호']
  },

  // [시가서 5권]
  {
    id: 'job',
    name: '욥기',
    englishName: 'Job',
    testament: 'OT',
    category: '시가서',
    summary: '의인의 까닭 없는 고난, 친구들과의 논쟁 및 폭풍 속 하나님의 창조 주권 계시',
    redemptiveLink: '아무 죄 없이 십자가에서 극심한 고통을 겪으시고 마침내 승리하신 참 의인이신 예수 그리스도의 고난.',
    keyVerse: { reference: '욥기 23:10', text: '그러나 내가 가는 길을 그가 아시나니 그가 나를 단련하신 후에는 내가 순금 같이 되어 나오리라' },
    exegeticalKeywords: ['의인의 고난', '창조 주권', '단련과 순금', '욥의 중보', '하나님의 임재']
  },
  {
    id: 'psalms',
    name: '시편',
    englishName: 'Psalms',
    testament: 'OT',
    category: '시가서',
    summary: '찬양, 감사, 탄식, 제왕시, 메시야 시편 150편의 다채로운 기도와 예배',
    redemptiveLink: '메시아 시편(시 22편, 110편 등)을 통해 십자가 고통과 부활, 승귀와 영원한 제사장직을 예언하신 그리스도.',
    keyVerse: { reference: '시편 23:1', text: '여호오는 나의 목자시니 내게 부족함이 없으리로다' },
    exegeticalKeywords: ['선한 목자', '메시아 시편', '탄식과 찬양', '복 있는 사람', '여호와 샬롬']
  },
  {
    id: 'proverbs',
    name: '잠언',
    englishName: 'Proverbs',
    testament: 'OT',
    category: '시가서',
    summary: '여호와를 경외하는 것이 지혜의 근본, 일상생활의 도덕과 경건의 지침',
    redemptiveLink: '하나님의 인격화된 지혜 그 자체이시며 성도에게 지혜와 의로움과 거룩함이 되신 예수 그리스도(고전 1:30).',
    keyVerse: { reference: '잠언 1:7', text: '여호와를 경외하는 것이 지식의 근본이거늘 미련한 자는 지혜와 훈계를 멸시하느니라' },
    exegeticalKeywords: ['여호와 경외', '참 지혜', '마음을 지킴', '현숙한 여인', '언어의 절제']
  },
  {
    id: 'ecclesiastes',
    name: '전도서',
    englishName: 'Ecclesiastes',
    testament: 'OT',
    category: '시가서',
    summary: '해 아래서의 헛되고 헛됨, 세속적 소유의 무상함과 창조주를 기억함',
    redemptiveLink: '해 아래에서의 세속적 삶의 허무함을 오직 영원한 생명이신 십자가 그리스도 안에서만 의미로 채우심.',
    keyVerse: { reference: '전도서 12:1', text: '너는 청년의 때에 너의 창조주를 기억하라 곧 곤란한 날이 이르기 전에...' },
    exegeticalKeywords: ['헛되고 헛되다', '해 아래의 삶', '창조주 기억', '인생의 본분', '영원한 안식']
  },
  {
    id: 'songofsolomon',
    name: '아가',
    englishName: 'Song of Solomon',
    testament: 'OT',
    category: '시가서',
    summary: '솔로몬 왕과 술람미 여인의 아름다운 남녀 사랑과 친밀함의 노래',
    redemptiveLink: '신랑 되신 예수 그리스도와 신부 된 거룩한 교회 공동체 간의 영원하고 변함없는 대속적 사랑의 예표.',
    keyVerse: { reference: '아가 2:16', text: '내 사랑하는 자는 내게 속하였고 나는 그에게 속하였도다 그가 백합화 가운데에서 양 떼를 치는구나' },
    exegeticalKeywords: ['신랑과 신부', '술람미 여인', '그리스도의 사랑', '연합', '영원한 친밀함']
  },

  // [대선지서 5권]
  {
    id: 'isaiah',
    name: '이사야',
    englishName: 'Isaiah',
    testament: 'OT',
    category: '대선지서',
    summary: '심판과 구원 메시아의 예언, 임마누엘과 고난받는 여호와의 종(53장)',
    redemptiveLink: '우리의 허물과 죄악을 담당하시고 십자가 도수장에 끌려가는 어린 양으로 죽으신 고난의 종 예수 그리스도.',
    keyVerse: { reference: '이사야 53:5', text: '그가 상함은 우리의 허물 때문이요 그가 감은 우리의 죄악 때문이라 그가 징계를 받음으로 우리는 평화를 누리고...' },
    exegeticalKeywords: ['임마누엘', '고난받는 종', '새 하늘과 새 땅', '구원의 복음', '거룩하신 이']
  },
  {
    id: 'jeremiah',
    name: '예레미야',
    englishName: 'Jeremiah',
    testament: 'OT',
    category: '대선지서',
    summary: '눈물의 선지자 예레미야의 경고, 70년 포로 예언과 마음에 새길 새 언약(31장)',
    redemptiveLink: '돌판이 아닌 성도의 마음에 성령으로 새기시는 십자가 피로 세우신 새 언약(New Covenant)의 완성자.',
    keyVerse: { reference: '예레미야 31:33', text: '내가 나의 법을 그들의 속에 두며 그들의 마음에 기록하여 나는 그들의 하나님이 되고 그들은 내 백성이 될 것이라' },
    exegeticalKeywords: ['눈물의 선지자', '새 언약', '70년 포로', '마음의 율법', '토기장이']
  },
  {
    id: 'lamentations',
    name: '예레미야애가',
    englishName: 'Lamentations',
    testament: 'OT',
    category: '대선지서',
    summary: '예루살렘 함락과 성전 파괴에 대한 5편의 애가 및 아침마다 새로운 주의 인자하심',
    redemptiveLink: '심각한 멸망의 밤 속에서도 아침마다 새로우신 여호와의 성실하심(헤세드)을 소망케 하시는 십자가 인내.',
    keyVerse: { reference: '예레미야애가 3:22-23', text: '여호와의 인자와 긍휼이 무궁하시므로 우리가 진멸되지 아니함이니이다 이것들이 아침마다 새로우니 주의 성실하심이 크시도다' },
    exegeticalKeywords: ['예루살렘 애가', '아침마다 새로운 은혜', '주의 성실하심', '슬픔 속 소망', '긍휼']
  },
  {
    id: 'ezekiel',
    name: '에스겔',
    englishName: 'Ezekiel',
    testament: 'OT',
    category: '대선지서',
    summary: '바벨론 포로지에서의 환상, 에스겔의 파수꾼 소명, 골짜기의 마른 뼈 환상과 새 성전',
    redemptiveLink: '죽은 마른 뼈들에 생기(성령)를 불어넣어 살아나게 하듯, 허물과 죄로 죽은 영혼을 살리시는 예수 그리스도의 부활.',
    keyVerse: { reference: '에스겔 36:26', text: '또 새 영을 너희 속에 두고 새 마음을 너희에게 주되 너희 육신에서 부드러운 마음을 줄 것이며' },
    exegeticalKeywords: ['마른 뼈 환상', '새 영과 새 마음', '여호와 샴마', '에스겔 성전 환상', '파수꾼']
  },
  {
    id: 'daniel',
    name: '다니엘',
    englishName: 'Daniel',
    testament: 'OT',
    category: '대선지서',
    summary: '바벨론 왕궁에서의 뜻을 정한 결단, 사자 굴과 용광로의 구원, 인자 환상과 영원한 하나님 나라',
    redemptiveLink: '손대지 아니한 돌이 신상을 치고 태산을 이루듯, 모든 세속 제국을 파하고 승리하시는 인자(Son of Man) 예수 그리스도.',
    keyVerse: { reference: '다니엘 7:13-14', text: '보라 인자 같은 이가 하늘 구름을 타고 와서... 그에게 권세와 영광과 나라를 주고 모든 백성이 그를 섬기게 하였으니' },
    exegeticalKeywords: ['뜻을 정함', '인자 환상', '사자 굴 구원', '영원한 하나님 나라', '70이레']
  },

  // [소선지서 12권]
  {
    id: 'hosea',
    name: '호세아',
    englishName: 'Hosea',
    testament: 'OT',
    category: '소선지서',
    summary: '음란한 여인 고멜을 다시 사오는 호세아의 사랑을 통한 하나님의 포기 없는 사랑',
    redemptiveLink: '영적으로 음란하여 배교한 우리를 십자가 보혈의 값으로 다시 구속하여 아내 삼으신 그리스도의 끊을 수 없는 사랑.',
    keyVerse: { reference: '호세아 6:3', text: '그러므로 우리가 여호와를 알자 힘써 여호와를 알자 그의 나타나심은 새벽 빛 같이 어김없나니...' },
    exegeticalKeywords: ['고멜과 호세아', '포기 없는 사랑', '여호와를 알자', '음란한 백성 구속', '헤세드']
  },
  {
    id: 'joel',
    name: '요엘',
    englishName: 'Joel',
    testament: 'OT',
    category: '소선지서',
    summary: '메뚜기 재앙과 여호와의 날, 옷을 찢지 말고 마음을 찢는 회개와 남종과 여종에게 부어줄 성령 예언',
    redemptiveLink: '오순절 성령 강림(사도행전 2장)으로 성취된 남종과 여종에게 성령을 부어주시는 그리스도의 은혜.',
    keyVerse: { reference: '요엘 2:28', text: '그 후에 내가 내 영을 만민에게 부어 주리니 너희 자녀들이 장래 일을 말할 것이며...' },
    exegeticalKeywords: ['여호와의 날', '성령 부어주심', '마음을 찢는 회개', '메뚜기 재앙', '오순절 예표']
  },
  {
    id: 'amos',
    name: '아모스',
    englishName: 'Amos',
    testament: 'OT',
    category: '소선지서',
    summary: '북이스라엘의 세속적 번영 속 사회적 불의 경고, "정의를 물 같이", 다윗의 무너진 장막 회복',
    redemptiveLink: '기복주의와 불의를 배격하시고 참된 하나님 나라의 공의와 다윗의 무너진 장막(이방인 구원)을 회복하시는 그리스도.',
    keyVerse: { reference: '아모스 5:24', text: '오직 정의를 물 같이, 공의를 마르지 않는 강 같이 흘릴지어다' },
    exegeticalKeywords: ['공의와 정의', '다윗의 무너진 장막', '드고아 목자', '형식적 예배 배격', '사회 정의']
  },
  {
    id: 'obadiah',
    name: '오바디야',
    englishName: 'Obadiah',
    testament: 'OT',
    category: '소선지서',
    summary: '형제국 유다의 고난을 방관하고 교만했던 에돔에 대한 심판 선언과 시온산의 승리',
    redemptiveLink: '교만한 세상 권세(에돔)를 심판하시고 시온산(하나님 나라)에서 자기 백성을 영원히 왕 노릇 하게 하시는 그리스도.',
    keyVerse: { reference: '오바디야 1:21', text: '구원 받은 자들이 시온 산에 올라와서 에돔의 산을 심판하리니 나라가 여호와께 속하리라' },
    exegeticalKeywords: ['에돔의 교만 심판', '시온산 승리', '형제 우애', '하나님 나라 소유', '단권 선지서']
  },
  {
    id: 'jonah',
    name: '요나',
    englishName: 'Jonah',
    testament: 'OT',
    category: '소선지서',
    summary: '니느웨로 가라는 소명 거부, 물고기 배 속의 기도와 이방 니느웨 백성의 회개',
    redemptiveLink: '밤낮 사흘 동안 땅 속에 있다가 부활하실 "요나의 표적"(마 12:40)이 되셔서 온 이방 열방을 구원하시는 예수님.',
    keyVerse: { reference: '요나 2:9', text: '나는 감사하는 목소리로 주께 제사를 드리며 나의 서원을 주께 갚겠나이다 구원은 여호와께 속하였나이다' },
    exegeticalKeywords: ['요나의 표적', '이방 니느웨 회개', '구원은 여호와께', '물고기 배 속 기도', '하나님의 긍휼']
  },
  {
    id: 'micah',
    name: '미가',
    englishName: 'Micah',
    testament: 'OT',
    category: '소선지서',
    summary: '지도자들의 탐욕 심판, 베들레헴 에브라다에서 탄생할 통치자 예언과 하나님이 원하시는 겸손한 동행',
    redemptiveLink: '가장 작은 고을 베들레헴에서 탄생하실 영원한 왕 예수 그리스도의 겸손한 통치(미 5:2).',
    keyVerse: { reference: '미가 6:8', text: '사람아 주께서 선한 것이 무엇임을 네게 보이셨나니 여호와께서 네게 구하시는 것은 오직 정의를 행하며 인자를 사랑하며 겸손하게 네 하나님과 함께 행하는 것이 아니냐' },
    exegeticalKeywords: ['베들레헴 탄생 예언', '겸손히 하나님과 동행', '공의와 인자', '남은 자의 복', '메시아 나심']
  },
  {
    id: 'nahum',
    name: '나훔',
    englishName: 'Nahum',
    testament: 'OT',
    category: '소선지서',
    summary: '잔혹한 아수르 제국(니느웨)의 철저한 파멸 선언과 여호와의 산성 되심',
    redemptiveLink: '하나님의 백성을 압제하는 잔혹한 죄의 권세를 심판하시고 성도에게 영원한 요새와 산성이 되시는 그리스도.',
    keyVerse: { reference: '나훔 1:7', text: '여호오는 선하시며 환난 날에 산성이시라 그는 자기에게 의뢰하는 자들을 아시느니라' },
    exegeticalKeywords: ['아수르 심판', '환난 날의 산성', '아름다운 소식', '하나님의 질투와 긍휼', '의인의 보호']
  },
  {
    id: 'habakkuk',
    name: '하박국',
    englishName: 'Habakkuk',
    testament: 'OT',
    category: '소선지서',
    summary: '악인의 번성과 바벨론 침략에 대한 의문, "의인은 그의 믿음으로 말미암아 살리라" 및 무화과나무의 찬양',
    redemptiveLink: '상황이 정반대로 꼬일지라도 오직 십자가 구속의 믿음(Sola Fide)으로 말미암아 의롭다 함을 얻는 복음의 대선언.',
    keyVerse: { reference: '하박국 2:4', text: '보라 그의 마음은 교만하며 그 속에서 정직하지 못하나 의인은 그의 믿음으로 말미암아 살리라' },
    exegeticalKeywords: ['의인은 믿음으로 살리라', '성루 위의 파수', '무화과나무 찬양', '여호와로 인한 기쁨', '이신칭의 예표']
  },
  {
    id: 'zephaniah',
    name: '스바냐',
    englishName: 'Zephaniah',
    testament: 'OT',
    category: '소선지서',
    summary: '열방과 예루살렘을 향한 여호와의 엄중한 날, 겸손한 남은 자와 "너로 말미암아 기쁨을 누리시는 하나님"',
    redemptiveLink: '구원받은 백성을 바라보시며 기쁨을 이기지 못하여 즐거이 부르며 기뻐하시는 삼위일체 하나님의 끝없는 구속의 사랑.',
    keyVerse: { reference: '스바냐 3:17', text: '너의 하나님 여호와가 너의 가운데에 계시니 그는 구원을 베푸실 전능적이시라 그가 너로 말미암아 기쁨을 이기지 못하시며...' },
    exegeticalKeywords: ['너로 인하여 기뻐하심', '여호와의 날', '겸손한 남은 자', '묵묵히 사랑하심', '기쁨의 찬가']
  },
  {
    id: 'haggai',
    name: '학개',
    englishName: 'Haggai',
    testament: 'OT',
    category: '소선지서',
    summary: '포로 귀환 후 자기 집 짓기에 바쁜 백성 독려, 스룹바벨 성전 재건과 "나중 영광이 이전 영광보다 크리라"',
    redemptiveLink: '외형은 초라할지라도 십자가 부활로 온 우주에 임할 하나님 나라 참 성전의 더 큰 영광이 되신 예수 그리스도.',
    keyVerse: { reference: '학개 2:9', text: '이 성전의 나중 영광이 이전 영광보다 크리라 만군의 여호와의 말이니라 내가 이 곳에 평강을 주리라' },
    exegeticalKeywords: ['성전 재건', '우선순위 회복', '나중 영광이 크리라', '학개의 독려', '스룹바벨']
  },
  {
    id: 'zechariah',
    name: '스가랴',
    englishName: 'Zechariah',
    testament: 'OT',
    category: '소선지서',
    summary: '8가지 환상, 메시아의 겸손한 나귀 입성(스가랴 9장)과 은 삼십 십자가 대속 예언',
    redemptiveLink: '겸손하여 나귀 턱뼈 어린 나귀를 타고 예루살렘에 입성하시고 은 30에 팔리사 찔리신 메시아 예수 그리스도.',
    keyVerse: { reference: '스가랴 9:9', text: '시온의 딸아 크게 기뻐할지어다... 보라 네 왕이 네게 임하시나니 그는 공의로우시며 구원을 베푸시며 겸손하여서 나귀를 타시나니...' },
    exegeticalKeywords: ['나귀 탄 왕', '은 30 예언', '찔림을 받은 자', '8가지 환상', '샘물이 터짐']
  },
  {
    id: 'malachi',
    name: '말라기',
    englishName: 'Malachi',
    testament: 'OT',
    category: '소선지서',
    summary: '포로 후 십일조와 제사의 매너리즘 경계, 의로운 해가 떠올라 치료하는 광선을 발함 및 엘리야(세례요한) 예언',
    redemptiveLink: '400년 암흑기 후 치료하는 광선을 발하며 이 땅에 오신 의로운 해(Sun of Righteousness) 예수 그리스도.',
    keyVerse: { reference: '말라기 4:2', text: '내 이름을 경외하는 너희에게는 공의로운 해가 떠올라서 치료하는 광선을 발하리니 너희가 나가서 외양간에서 나온 송아지 같이 뛰리라' },
    exegeticalKeywords: ['치료하는 광선', '의로운 해', '엘리야(세례요한) 예언', '매너리즘 회개', '구약의 결론']
  },

  // ==========================================
  // ✝️ 신약 27권 (New Testament)
  // ==========================================
  // [복음서 4권]
  {
    id: 'matthew',
    name: '마태복음',
    englishName: 'Matthew',
    testament: 'NT',
    category: '복음서',
    summary: '유대인의 왕으로 오신 예수 그리스도, 산상수훈(5-7장), 하나님 나라의 비유와 대사명',
    redemptiveLink: '구약 언약의 완성이시며 왕으로 오셔서 산상수훈으로 하나님 나라의 율법을 완성하시고 십자가로 승리하신 왕.',
    keyVerse: { reference: '마태복음 28:18-20', text: '예수께서 나와 말씀하여 이르시되 하늘과 땅의 모든 권세를 내게 주셨으니 그러므로 너희는 가서 모든 민족을 제자로 삼아...' },
    exegeticalKeywords: ['유대인의 왕', '산상수훈', '대사명', '임마누엘', '하나님 나라 비유']
  },
  {
    id: 'mark',
    name: '마가복음',
    englishName: 'Mark',
    testament: 'OT',
    category: '복음서',
    summary: '섬기는 종으로 오신 예수님의 다급하고 역동적인 사역과 십자가 대속의 몸값',
    redemptiveLink: '자기 목숨을 많은 사람의 대속물(Ransom)로 주려 하신 겸손한 여호와의 종 예수 그리스도(막 10:45).',
    keyVerse: { reference: '마가복음 10:45', text: '인자가 온 것은 섬김을 받으려 함이 아니라 도리어 섬기려 하고 자기 목숨을 많은 사람의 대속물로 주려 함이니라' },
    exegeticalKeywords: ['섬기는 종', '대속물', '즉시 사역', '십자가 수난', '비밀의 메시아']
  },
  {
    id: 'luke',
    name: '누가복음',
    englishName: 'Luke',
    testament: 'NT',
    category: '복음서',
    summary: '인자(Son of Man)로 오신 예수님의 잃어버린 자를 향한 긍휼, 탕자의 비유, 엠마오 도상 식사',
    redemptiveLink: '가난한 자, 이방인, 탕자처럼 잃어버린 자를 찾아 구원하러 오신 완전한 인자 예수 그리스도.',
    keyVerse: { reference: '누가복음 19:10', text: '인자가 온 것은 잃어버린 자를 찾아 구원하려 함이니라' },
    exegeticalKeywords: ['잃어버린 자 구원', '탕자의 비유', '선한 사마리아인', '엠마오 도상', '성령과 기도']
  },
  {
    id: 'john',
    name: '요한복음',
    englishName: 'John',
    testament: 'NT',
    category: '복음서',
    summary: '말씀(Logos)이 육신이 되신 하나님의 아들, 7가지 "나는 ~이다(I AM)" 선언과 영생',
    redemptiveLink: '태초부터 계신 말씀(Logos)이시며 세상 죄를 지고 가는 하나님의 어린 양이자 영생을 주시는 생명의 떡.',
    keyVerse: { reference: '요한복음 3:16', text: '하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라' },
    exegeticalKeywords: ['Logos(말씀)', '독생자 영생', 'I AM 선언', '다 이루었다', '보혜사 성령']
  },

  // [역사서 1권]
  {
    id: 'acts',
    name: '사도행전',
    englishName: 'Acts',
    testament: 'NT',
    category: '역사서',
    summary: '오순절 성령 강림, 예루살렘에서 안디옥, 로마까지 복음이 증거되는 성령의 행전',
    redemptiveLink: '부활하신 예수께서 보좌에서 성령을 부으사 이방 열방 끝까지 교회를 세우시고 승리하시는 하나님 나라 확장.',
    keyVerse: { reference: '사도행전 1:8', text: '오직 성령이 너희에게 임하시면 너희가 권능을 받고 예루살렘과 온 유대와 사마리아와 땅 끝까지 이르러 내 증인이 되리라' },
    exegeticalKeywords: ['오순절 성령 강림', '땅 끝까지 증인', '안디옥 교회', '바울의 1~3차 전도', '교회의 탄생']
  },

  // [바울서신 13권]
  {
    id: 'romans',
    name: '로마서',
    englishName: 'Romans',
    testament: 'NT',
    category: '바울서신',
    summary: '모든 인간의 타락, 이신칭의(복음으로 의롭게 됨), 성령 안에서의 성화와 견인 교리의 대선언',
    redemptiveLink: '율법의 행위가 아닌 십자가 피를 믿음으로 의롭다 함을 얻게 하시는 복음의 전적인 은혜(로마서 8장).',
    keyVerse: { reference: '로마서 1:16-17', text: '내가 복음을 부끄러워하지 아니하노니 이 복음은 모든 믿는 자에게 구원을 주시는 하나님의 능력이 됨이라... 의인은 믿음으로 말미암아 살리라' },
    exegeticalKeywords: ['이신칭의', '모든 사람이 죄를 범함', '로마서 8장 영광', '성화와 영화', '삼위일체 견인']
  },
  {
    id: '1corinthians',
    name: '고린도전서',
    englishName: '1 Corinthians',
    testament: 'NT',
    category: '바울서신',
    summary: '고린도 교회의 분열, 은성, 성찬, 십자가의 도(1장), 사랑장(13장)과 부활장(15장)',
    redemptiveLink: '세상의 지혜를 부끄럽게 하시는 십자가의 능력과 지혜이시며 성도의 부활의 첫 열매가 되신 그리스도.',
    keyVerse: { reference: '고린도전서 1:18', text: '십자가의 도가 멸망하는 자들에게는 미련한 것이요 구원을 받는 우리에게는 하나님의 능력이라' },
    exegeticalKeywords: ['십자가의 도', '사랑장 13장', '부활장 15장', '은사와 질서', '몸 된 교회']
  },
  {
    id: '2corinthians',
    name: '고린도후서',
    englishName: '2 Corinthians',
    testament: 'NT',
    category: '바울서신',
    summary: '사도직의 권위 변호, 질그릇 안의 보배, "내 은혜가 네게 족하도다"와 약함 속의 능력',
    redemptiveLink: '우리의 연약함과 약함 속에 내주하사 십자가의 족한 은혜와 부활의 능력을 보배처럼 드러내시는 주님.',
    keyVerse: { reference: '고린도후서 12:9', text: '나에게 이르시기를 내 은혜가 네게 족하도다 이는 내 능력이 약한 데서 온전하여짐이라 하신지라...' },
    exegeticalKeywords: ['질그릇 안의 보배', '내 은혜가 족하도다', '화목하게 하는 직책', '약함 속 능력', '새로운 피조물']
  },
  {
    id: 'galatians',
    name: '갈라디아서',
    englishName: 'Galatians',
    testament: 'NT',
    category: '바울서신',
    summary: '다른 복음(율법주의) 배격, 은혜의 대헌장, 십자가 외에는 자랑할 것이 없음과 성령의 열매',
    redemptiveLink: '율법의 저주에서 우리를 속량하사 그리스도 안에서 참 자유인이 되게 하신 오직 십자가 은혜.',
    keyVerse: { reference: '갈라디아서 2:20', text: '내가 그리스도와 함께 십자가에 못 박혔나니 그런즉 이제는 내가 사는 것이 아니요 오직 내 안에 그리스도께서 사시는 것이라...' },
    exegeticalKeywords: ['십자가 외에 자랑 없음', '율법의 저주 속량', '성령의 열매', '자유의 대헌장', '다른 복음 배격']
  },
  {
    id: 'ephesians',
    name: '에베소서',
    englishName: 'Ephesians',
    testament: 'NT',
    category: '바울서신',
    summary: '창세 전 하나님의 택하심, 은혜로 구원 받음, 유대인과 이방인의 하나 됨과 전신갑주',
    redemptiveLink: '하늘에 속한 모든 신령한 복의 근원이시며 막힌 담을 허무시고 교회의 머리가 되신 예수 그리스도.',
    keyVerse: { reference: '에베소서 2:8-9', text: '너희는 그 은혜에 의하여 믿음으로 말미암아 구원을 받았으니 이것은 너희에게서 난 것이 아니요 하나님의 선물이라...' },
    exegeticalKeywords: ['창세 전 택하심', '은혜의 선물', '교회의 머리', '막힌 담을 허묾', '하나님의 전신갑주']
  },
  {
    id: 'philippians',
    name: '빌립보서',
    englishName: 'Philippians',
    testament: 'NT',
    category: '바울서신',
    summary: '옥중서신, 자기를 비워 종의 형체를 가지신 그리스도의 겸손(2장), 주 안에서 기뻐함',
    redemptiveLink: '하나님과 동등됨을 취하지 아니하시고 십자가에 죽기까지 복종하신 그리스도의 비하(Kenosis)와 승귀.',
    keyVerse: { reference: '빌립보서 2:5-8', text: '너희 안에 이 마음을 품으라 곧 그리스도 예수의 마음이니 그는 근본 하나님의 본체시나...' },
    exegeticalKeywords: ['그리스도의 겸손(케노시스)', '주 안에서 기쁨', '내게 능력 주시는 자', '푯대를 향하여', '옥중 기쁨']
  },
  {
    id: 'colossians',
    name: '골로새서',
    englishName: 'Colossians',
    testament: 'NT',
    category: '바울서신',
    summary: '만물보다 으뜸이신 그리스도의 최고성, 세속 철학과 신비주의 경계, 위엣 것을 찾으라',
    redemptiveLink: '보이지 아니하는 하나님의 형상이시며 만물이 그로 말미암아 창조되고 그 안에서 완전하게 된 그리스도의 충만.',
    keyVerse: { reference: '골로새서 1:15-17', text: '그는 보이지 아니하는 하나님의 형상이시요 모든 피조물보다 먼저 나신 이시니 만물이 그에게서 창조되되...' },
    exegeticalKeywords: ['그리스도의 최고성', '위엣 것을 찾으라', '신성의 충만', '세속 철학 배격', '교회의 머리']
  },
  {
    id: '1thessalonians',
    name: '데살로니가전서',
    englishName: '1 Thessalonians',
    testament: 'NT',
    category: '바울서신',
    summary: '믿음의 역사, 사랑의 수고, 소망의 인내 및 주님의 재림과 데살로니가 성도의 거룩',
    redemptiveLink: '하늘로부터 다시 오실 주 예수 그리스도의 재림을 소망하며 거룩하고 온전하게 보존되는 성도의 안식.',
    keyVerse: { reference: '데살로니가전서 5:16-18', text: '항상 기뻐하라 쉬지 말고 기도하라 범사에 감사하라 이것이 그리스도 예수 안에서 너희를 향하신 하나님의 뜻이니라' },
    exegeticalKeywords: ['재림 소망', '항상 기뻐하라', '믿음 사랑 소망', '거룩한 거함', '공중 강림']
  },
  {
    id: '2thessalonians',
    name: '데살로니가후서',
    englishName: '2 Thessalonians',
    testament: 'NT',
    category: '바울서신',
    summary: '재림에 관한 잘못된 오해 교정, 불법의 사람(적그리스도) 경계와 게으름 경고',
    redemptiveLink: '주의 재림 날까지 일하기 싫어하거든 먹지도 말게 하며 굳건하게 진리 위에 서게 하시는 그리스도의 지혜.',
    keyVerse: { reference: '데살로니가후서 3:3', text: '주는 미쁘사 너희를 견고하게 하시고 악한 자에게서 지키시리라' },
    exegeticalKeywords: ['재림의 오해 교정', '불법의 사람', '게으름 경고', '미쁘신 주님', '진리 수호']
  },
  {
    id: '1timothy',
    name: '디모데전서',
    englishName: '1 Timothy',
    testament: 'NT',
    category: '바울서신',
    summary: '목회서신, 영적 아들 디모데에게 전하는 교회의 질서, 직분자(장로/집사) 자격 및 돈을 탐함 경계',
    redemptiveLink: '하나님과 사람 사이의 유일하신 한 분 중보자이신 인간 예수 그리스도의 디모데 목회 지침(딤전 2:5).',
    keyVerse: { reference: '디모데전서 2:5', text: '하나님은 한 분이시요 또 하나님과 사람 사이에 중보자도 한 분이시니 곧 사람이신 그리스도 예수라' },
    exegeticalKeywords: ['유일한 중보자', '직분자 자격', '돈을 사랑함이 악의 뿌리', '선한 싸움', '교회의 질서']
  },
  {
    id: '2timothy',
    name: '디모데후서',
    englishName: '2 Timothy',
    testament: 'NT',
    category: '바울서신',
    summary: '바울의 순교 전 마지막 유언 서신, "너는 말씀을 파수하라", 성경의 감동과 딤후 3:16',
    redemptiveLink: '모든 성경이 하나님의 감동으로 된 구원케 하는 지혜(그리스도)를 담고 있음을 파수하는 영적 전투.',
    keyVerse: { reference: '디모데후서 3:16-17', text: '모든 성경은 하나님의 감동으로 된 것으로 교훈과 책망과 바르게 함과 의로 교육하기에 유익하니...' },
    exegeticalKeywords: ['모든 성경은 하나님의 감동', '달려갈 길을 마치고', '의의 면류관', '말씀 전파', '마지막 유언']
  },
  {
    id: 'titus',
    name: '디도서',
    englishName: 'Titus',
    testament: 'NT',
    category: '바울서신',
    summary: '그레데 섬의 디도에게 전하는 바른 교리와 선한 행실, 중생의 씻음과 성령의 새롭게 하심',
    redemptiveLink: '우리가 행한 바 의로운 행위가 아니라 오직 그 긍휼하심으로 중생의 씻음과 성령으로 새롭게 하신 은혜.',
    keyVerse: { reference: '디도서 3:5', text: '우리를 구원하시되 우리가 행한 바 의로운 행위로 말미암지 아니하고 오직 그의 긍휼하심을 따라 중생의 씻음과 성령의 새롭게 하심으로 하셨나니' },
    exegeticalKeywords: ['중생의 씻음', '성령의 새롭게 하심', '바른 교리', '선한 사업', '그레데 개혁']
  },
  {
    id: 'philemon',
    name: '빌레몬서',
    englishName: 'Philemon',
    testament: 'NT',
    category: '바울서신',
    summary: '도망친 노예 오네시모를 용서하고 형제로 받아들일 것을 빌레몬에게 청원하는 짧은 서신',
    redemptiveLink: '바울이 오네시모의 빚을 대신 갚듯, 우리의 온갖 죄와 영적 부채를 십자가에서 대신 탕감하신 예수님의 중보.',
    keyVerse: { reference: '빌레몬서 1:18', text: '그가 만일 네게 불의를 하였거나 네게 빚진 것이 있으면 그것을 내 앞으로 계산하라' },
    exegeticalKeywords: ['오네시모 구속', '대신 빚을 갚음', '형제 됨', '십자가 중보 예표', '용서와 화해']
  },

  // [공동서신 8권]
  {
    id: 'hebrews',
    name: '히브리서',
    englishName: 'Hebrews',
    testament: 'NT',
    category: '공동서신',
    summary: '유대교로 돌아가려는 유혹 배격, 멜기세덱의 반차를 좇은 영원한 대제사장 그리스도와 믿음장(11장)',
    redemptiveLink: '구약의 모든 제사와 성막을 단 번에 완성하시고 은혜의 보좌로 담대히 나아가게 하신 영원한 대제사장.',
    keyVerse: { reference: '히브리서 12:2', text: '믿음의 주요 또 온전하게 하시는 이인 예수를 바라보자 그는 그 앞에 있는 기쁨을 위하여 십자가를 참으사...' },
    exegeticalKeywords: ['영원한 대제사장', '멜기세덱의 반차', '믿음장 11장', '예수를 바라보자', '은혜의 보좌']
  },
  {
    id: 'james',
    name: '야고보서',
    englishName: 'James',
    testament: 'NT',
    category: '공동서신',
    summary: '행함이 없는 믿음은 죽은 것, 시련을 참는 자의 복, 혀의 절제와 긍휼의 삶',
    redemptiveLink: '칭의를 받은 참된 성도의 삶 속에서 성령으로 나타나는 구체적인 순종과 행함의 거룩한 열매.',
    keyVerse: { reference: '야고보서 2:26', text: '영혼 없는 몸이 죽은 것 같이 행함이 없는 믿음은 죽은 것이니라' },
    exegeticalKeywords: ['행함이 있는 믿음', '혀의 절제', '시련을 참음', '위로부터 난 지혜', '행함의 성화']
  },
  {
    id: '1peter',
    name: '베드로전서',
    englishName: '1 Peter',
    testament: 'NT',
    category: '공동서신',
    summary: '고난 중에 있는 흩어진 나그네(성도)에게 전하는 산 소망, 왕 같은 제사장 신분과 고난의 순결',
    redemptiveLink: '썩지 않고 더럽지 않고 쇠하지 아니하는 하늘의 산 소망(Living Hope)이 되신 예수 그리스도의 부활.',
    keyVerse: { reference: '베드로전서 2:9', text: '그러나 너희는 택하신 족속이요 왕 같은 제사장들이요 거룩한 나라요 그의 소유가 된 백성이니...' },
    exegeticalKeywords: ['산 소망', '왕 같은 제사장', '흩어진 나그네', '불 시험 견딤', '보배로운 피']
  },
  {
    id: '2peter',
    name: '2 Peter',
    englishName: '2 Peter',
    testament: 'NT',
    category: '공동서신',
    summary: '거짓 교사 조심, 신성한 성품에 참여함 및 주의 재림의 지체하심은 아무도 멸망치 않게 하시는 용서',
    redemptiveLink: '한 사람도 멸망하지 않고 다 회개하기에 이르기를 기다리시는 하나님의 신실하신 재림 지체 은혜.',
    keyVerse: { reference: '2베드로 3:9', text: '주의 약속은 어떤 이들이 더디다고 생각하는 것 같이 더딘 것이 아니라 오직 주께서는 너희를 대하여 오래 참으사 아무도 멸망하지 아니하고...' },
    exegeticalKeywords: ['신성한 성품', '거짓 교사 경계', '주의 오래 참으심', '새 하늘과 새 땅', '재림의 신실성']
  },
  {
    id: '1john',
    name: '요한일서',
    englishName: '1 John',
    testament: 'NT',
    category: '공동서신',
    summary: '하나님은 빛이시요 사랑이심, 영분별, 죄 고백과 서로 사랑하라는 사도의 권면',
    redemptiveLink: '우리가 먼저 하나님을 사랑한 것이 아니요 하나님이 우리를 사랑하사 우리 죄를 위한 화목제물로 아들을 보내심.',
    keyVerse: { reference: '요한일서 4:10', text: '사랑은 여기 있으니 우리가 하나님을 사랑한 것이 아니요 하나님이 우리를 사랑하사 우리 죄를 속하기 위하여 화목물로 그 아들을 보내셨음이라' },
    exegeticalKeywords: ['하나님은 사랑이심', '화목제물', '서로 사랑하라', '영분별', '죄 고백과 용서']
  },
  {
    id: '2john',
    name: '요한이서',
    englishName: '2 John',
    testament: 'NT',
    category: '공동서신',
    summary: '진리와 사랑 안에서의 교제, 육체로 오신 예수 그리스도를 부정하는 적그리스도 경계',
    redemptiveLink: '예수 그리스도께서 육체로 임하심을 부인하는 영지주의 이단을 배격하고 진리 안에서 성육신을 수호함.',
    keyVerse: { reference: '요한이서 1:7', text: '미혹하는 자가 세상에 많이 나왔나니 이는 예수 그리스도께서 육체로 임하심을 부인하는 자라 이런 자가 미혹하는 자요 적그리스도니' },
    exegeticalKeywords: ['성육신 수호', '진리와 사랑', '적그리스도 경계', '영지주의 배격', '단권 서신']
  },
  {
    id: '3john',
    name: '요한삼서',
    englishName: '3 John',
    testament: 'NT',
    category: '공동서신',
    summary: '가이오에 대한 칭찬과 접대, 교만한 디오드레베 경계 및 진리를 위하여 함께 수고하는 자',
    redemptiveLink: '나그네 된 순회 사역자들을 헌신적으로 돕는 사랑을 통해 하나님 나라 진리를 확장케 하시는 은혜.',
    keyVerse: { reference: '요한삼서 1:2', text: '사랑하는 자여 네 영혼이 잘됨 같이 네가 범사에 잘되고 강건하기를 내가 간구하노라' },
    exegeticalKeywords: ['영혼의 잘됨', '가이오 칭찬', '디오드레베 경계', '진리 동역자', '접대의 은혜']
  },
  {
    id: 'jude',
    name: '유다서',
    englishName: 'Jude',
    testament: 'NT',
    category: '공동서신',
    summary: '단번에 주신 믿음의 도를 위하여 힘써 싸우라, 훔쳐 들어온 아첨꾼과 거짓 교사 경계',
    redemptiveLink: '성도에게 단번에 주신 신실한 복음의 도(Faith once delivered)를 영원토록 보존하시고 승리케 하시는 주님.',
    keyVerse: { reference: '유다서 1:3', text: '성도에게 단번에 주신 믿음의 도를 위하여 힘써 싸우라는 편지로 너희를 권해야 할 필요를 느꼈노니' },
    exegeticalKeywords: ['단번에 주신 믿음의 도', '거짓 교사 심판', '지극히 거룩한 믿음 위에 자신을 세움', '능히 보호하심', '단권 서신']
  },

  // [예언서 1권]
  {
    id: 'revelation',
    name: '요한계시록',
    englishName: 'Revelation',
    testament: 'NT',
    category: '예언서',
    summary: '소아시아 7교해 편지, 보좌에 계신 어린 양, 대환난과 바벨론의 심판, 새 하늘과 새 땅의 완성',
    redemptiveLink: '마침내 악의 권세와 사망을 영원히 호수에 던지시고 "내가 진실로 속히 오리라" 하사 승리하시는 어린 양 왕 예수 그리스도.',
    keyVerse: { reference: '요한계시록 22:20', text: '이것들을 증언하신 이가 이르시되 내가 진실로 속히 오리라 하시거늘 아멘 주 예수여 오시옵소서' },
    exegeticalKeywords: ['마라나타(주 예수여 오시옵소서)', '보좌의 어린 양', '새 하늘과 새 땅', '바벨론 심판', '영원한 하나님 나라']
  }
];
