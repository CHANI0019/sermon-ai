export interface DeviceInfo {
  deviceType: 'Android' | 'iPhone' | 'iPad' | 'Windows' | 'macOS' | 'Linux' | 'Tablet' | 'Unknown';
  os: string;
  browser: string;
  browserVersion: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPWA: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isInAppBrowser: boolean;
  inAppType?: 'kakaotalk' | 'naver' | 'other';
  canInstallPWA: boolean;
}

export type TabType = 'sermon' | 'news_sermon' | 'counseling' | 'journal' | 'guardrails' | 'stats' | 'exegesis' | 'svs_praise';

export interface SermonResult {
  title: string;
  passage: string;
  hook: string;
  exegesis: string;
  point1: { title: string; body: string };
  point2: { title: string; body: string };
  point3: { title: string; body: string };
  conclusion: string;
}

export interface CounselingResult {
  query: string;
  step1Empathy: string;
  step2Parallelism: { character: string; story: string; passage: string };
  step3Theology: string;
  step4Action: { steps: string[]; prayer: string };
  isCrisis: boolean;
  hotlines?: { name: string; number: string }[];
  disclaimer: string;
}

export interface ScriptureExegesisResult {
  passage: string;
  historicalContext: string;
  originalLanguageInsights: string;
  redemptiveHistoricalLink: string;
  pastoralApplication: string;
  warningsOrProoftextingNotes: string;
}

export interface PastoralCareResult {
  query: string;
  empatheticCounsel: string;
  scriptureReferences: { reference: string; text: string }[];
  prayerPoints: string[];
  aiLimitationNotice: string;
}

export interface GuardrailCheckResult {
  input: string;
  isHeresyOrProsperity: boolean;
  identifiedCategory?: '번영신학/기복주의' | '숙명론/운명론' | '아리우스주의' | '펠라기우스주의' | '직통계시/미래예언' | '건전함';
  theologicalAnalysis: string;
  scripturalCorrection: string;
  orthodoxReformedPerspective: string;
}

export interface SavedJournalItem {
  id: string;
  title: string;
  type: 'sermon' | 'counseling';
  content: string;
  passage?: string;
  createdAt: string;
}

// ==========================================
// 🎵 SVS (Singing Voice Synthesis) AI Praise Types
// ==========================================

export type SvsEngineType = 'RVC_v2' | 'DiffSinger' | 'ACE_Studio' | 'OpenUtau' | 'SoftVC';
export type VoiceGender = 'male' | 'female';
export type VoiceCategory = 'pastor' | 'choir_tenor' | 'choir_soprano' | 'choir_alto' | 'choir_bass' | 'worship_leader';

export interface SvsVoiceModel {
  id: string;
  name: string;
  description: string;
  gender: VoiceGender;
  category: VoiceCategory;
  sampleAudioText: string;
  trainingEpochs: number;
  sampleRate: number;
  vibratoNaturalness: number; // 0~100
  pitchAccuracy: number; // 0~100
  avatarColor: string;
}

export interface SvsAcousticParams {
  pitchShiftSemiTones: number; // -12 to +12
  tempoBpm: number; // 60 to 140
  vibratoDepth: number; // 0 to 100
  vibratoFreqHz: number; // 3.0 to 8.0 Hz
  breathingIntervals: 'auto' | 'frequent' | 'deep' | 'minimal';
  vocalExpressionStyle: 'solemn' | 'warm_comfort' | 'joyful_praise' | 'classical_sacred';
  harmonyParts: {
    soprano: boolean;
    alto: boolean;
    tenor: boolean;
    bass: boolean;
  };
}

export interface HymnItem {
  number: number; // 찬송가 장수 (예: 405)
  title: string; // 곡명 (예: "나 같은 죄인 살리신")
  category: string; // 주제 (예: "구원과 은혜")
  scriptureRef: string; // 성경 구절
  key: string; // 조성 (예: "G Major")
  timeSignature: string; // 박자 (예: "3/4")
  tempoBpm: number;
  lyrics: string[];
  melodyNotes: { note: string; freq: number; duration: number }[];
  theologicalTheme: string;
}

export interface SvsPraiseGenerationResult {
  id: string;
  hymnNumber: number;
  hymnTitle: string;
  voiceModel: SvsVoiceModel;
  engineUsed: SvsEngineType;
  lyricsPrompt: string;
  acousticParams: SvsAcousticParams;
  generatedAudioUrl?: string;
  pitchCurveData: number[]; // F0 timeline points
  waveformPeaks: number[];
  harmonyPartSeparation: {
    sopranoMelody: number[];
    altoMelody: number[];
    tenorMelody: number[];
    bassMelody: number[];
  };
  durationSeconds: number;
  createdAt: string;
  biblicalComfortMessage: string;
}

export interface SvsTrainingDataset {
  id: string;
  modelName: string;
  gender: VoiceGender;
  audioDurationMinutes: number;
  f0Range: string;
  vibratoDepthScore: number; // 0-100
  breathingQualityScore: number; // 0-100
  pitchAccuracyScore: number; // 0-100
  trainingProgressPercent: number; // 0-100
  status: 'ready' | 'training' | 'analyzing';
}

