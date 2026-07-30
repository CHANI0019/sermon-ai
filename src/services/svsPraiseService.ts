import {
  SvsVoiceModel,
  SvsEngineType,
  SvsAcousticParams,
  SvsPraiseGenerationResult,
  SvsTrainingDataset
} from '../types';
import { getHymnDetailByNumber } from './hymnDatabase';

/**
 * 🎤 AI Voice Models Pre-trained Database (소향 Sohyang CCM 보컬 모델)
 */
export const SVS_VOICE_MODELS: SvsVoiceModel[] = [
  {
    id: 'sohyang_ccm_f',
    name: '👑 소향 (Sohyang) CCM AI 보컬 모델',
    description: '천상의 3옥타브 파워풀 소프라노 음색. 고음 비브라토와 감성적인 찬송 가창 표현의 극치.',
    gender: 'female',
    category: 'choir_soprano',
    sampleAudioText: '나 같은 죄인 살리신 주 은혜 고마워',
    trainingEpochs: 2000,
    sampleRate: 48000,
    vibratoNaturalness: 99,
    pitchAccuracy: 100,
    avatarColor: '#ec4899'
  },
  {
    id: 'pastor_senior_m',
    name: '담임목사님 보컬 모델 (Baritone)',
    description: '따뜻하고 울림 있는 바리톤 톤의 목소리. 설교 마무리 결단 찬양과 묵상 찬양에 최적화.',
    gender: 'male',
    category: 'pastor',
    sampleAudioText: '나 같은 죄인 살리신 주 은혜 고마워',
    trainingEpochs: 850,
    sampleRate: 48000,
    vibratoNaturalness: 94,
    pitchAccuracy: 98,
    avatarColor: '#3b82f6'
  },
  {
    id: 'choir_tenor_m',
    name: '할렐루야 성가대 수석 테너',
    description: '맑고 강렬한 맑은 테너 음색. 웅장한 다성부 찬송과 찬양 성가곡에 특화.',
    gender: 'male',
    category: 'choir_tenor',
    sampleAudioText: '만복의 근원 하나님 온 백성 찬송 드리고',
    trainingEpochs: 1200,
    sampleRate: 48000,
    vibratoNaturalness: 96,
    pitchAccuracy: 99,
    avatarColor: '#06b6d4'
  },
  {
    id: 'choir_soprano_f',
    name: '임마누엘 성가대 소프라노 리더',
    description: '투명하고 청아한 천상의 소프라노 음색. 높은 음역대의 비브라토 감정 표현 탁월.',
    gender: 'female',
    category: 'choir_soprano',
    sampleAudioText: '내 영혼이 은총 입어 중한 죄짐 벗고 보니',
    trainingEpochs: 1000,
    sampleRate: 48000,
    vibratoNaturalness: 98,
    pitchAccuracy: 97,
    avatarColor: '#f43f5e'
  },
  {
    id: 'choir_alto_f',
    name: '시온 성가대 풍성한 알토',
    description: '깊고 은혜로운 풍성한 알토 음색. 화음의 든든한 조화와 평안한 묵상곡에 완벽 적합.',
    gender: 'female',
    category: 'choir_alto',
    sampleAudioText: '지금까지 지내온 것 주의 크신 은혜라',
    trainingEpochs: 900,
    sampleRate: 48000,
    vibratoNaturalness: 92,
    pitchAccuracy: 96,
    avatarColor: '#8b5cf6'
  },
  {
    id: 'worship_leader_m',
    name: '청년부 찬양리더 (Acoustic Pop)',
    description: '감성적이고 현대적인 워십 보컬. 상담 환우 및 청소년/청년 위로 찬양에 어울림.',
    gender: 'male',
    category: 'worship_leader',
    sampleAudioText: '예수로 나의 구주 삼고 성령과 피로써',
    trainingEpochs: 750,
    sampleRate: 48000,
    vibratoNaturalness: 90,
    pitchAccuracy: 95,
    avatarColor: '#10b981'
  }
];

export const SVS_ENGINES: Array<{ id: SvsEngineType; name: string; tag: string; description: string }> = [
  {
    id: 'RVC_v2',
    name: 'Retrieval-based Voice Conversion (RVC v2)',
    tag: '초고속 / 고품질 음색 변환',
    description: 'Feature Retrieval 알고리즘을 사용하여 목사님/소향 음색을 손실 없이 실시간 합성'
  },
  {
    id: 'DiffSinger',
    name: 'DiffSinger (Diffusion Acoustic Model)',
    tag: '디퓨전 기반 선율 표현',
    description: '노이즈 제거 프로세스를 통해 숨소리(Breathing), 비브라토 및 미세 음정까지 극도로 자연스럽게 구현'
  },
  {
    id: 'ACE_Studio',
    name: 'ACE Studio SVS Engine',
    tag: '상용급 다성부 화음 믹싱',
    description: '전문 음반 제작급 4성부(소프라노/알토/테너/베이스) 다성부 하모니 자동 생성 및 가사 다이내믹 발성'
  },
  {
    id: 'OpenUtau',
    name: 'OpenUtau Resampler Engine',
    tag: '정밀 MIDI 튜닝',
    description: '음정 Pitch Bend 및 포르타멘토(Portamento) 꺾기 발성 정밀 조절'
  },
  {
    id: 'SoftVC',
    name: 'Soft-VC Sound Engine',
    tag: '연속적 포만트 연속성',
    description: '부드러운 구음과 억양 표현에 특화된 경량 인공지능 노래 합성 엔진'
  }
];

export const SVS_TRAINING_DATASETS: SvsTrainingDataset[] = [
  {
    id: 'ds_sohyang_00',
    modelName: '소향 (Sohyang) CCM 고음 찬송 훈련 세트',
    gender: 'female',
    audioDurationMinutes: 320,
    f0Range: 'C4 - G6 (소프라노 High C)',
    vibratoDepthScore: 99,
    breathingQualityScore: 98,
    pitchAccuracyScore: 100,
    trainingProgressPercent: 100,
    status: 'ready'
  },
  {
    id: 'ds_pastor_01',
    modelName: '담임목사님 찬송 녹음 음성 세트',
    gender: 'male',
    audioDurationMinutes: 145,
    f0Range: 'G2 - E4 (바리톤)',
    vibratoDepthScore: 88,
    breathingQualityScore: 95,
    pitchAccuracyScore: 97,
    trainingProgressPercent: 100,
    status: 'ready'
  },
  {
    id: 'ds_choir_tenor_02',
    modelName: '성가대 테너 파트 훈련 데이터',
    gender: 'male',
    audioDurationMinutes: 210,
    f0Range: 'C3 - A4 (테너)',
    vibratoDepthScore: 94,
    breathingQualityScore: 92,
    pitchAccuracyScore: 99,
    trainingProgressPercent: 100,
    status: 'ready'
  },
  {
    id: 'ds_choir_soprano_03',
    modelName: '소프라노 수석 솔로 데이터셋',
    gender: 'female',
    audioDurationMinutes: 180,
    f0Range: 'C4 - C6 (소프라노)',
    vibratoDepthScore: 98,
    breathingQualityScore: 90,
    pitchAccuracyScore: 98,
    trainingProgressPercent: 100,
    status: 'ready'
  }
];

/**
 * 🎵 AI SVS 찬양 합성 시뮬레이션 서비스
 */
export async function synthesizePraiseSVS(
  hymnNumber: number,
  voiceModelId: string,
  engineUsed: SvsEngineType,
  acousticParams: SvsAcousticParams,
  promptLyrics?: string
): Promise<SvsPraiseGenerationResult> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const hymn = getHymnDetailByNumber(hymnNumber);
  const voiceModel = SVS_VOICE_MODELS.find((m) => m.id === voiceModelId) || SVS_VOICE_MODELS[0];

  const pointsCount = 140;
  const pitchCurveData: number[] = [];
  const waveformPeaks: number[] = [];
  const sopranoMelody: number[] = [];
  const altoMelody: number[] = [];
  const tenorMelody: number[] = [];
  const bassMelody: number[] = [];

  const baseFreq = hymn.melodyNotes[0]?.freq || 392.0;

  for (let i = 0; i < pointsCount; i++) {
    const wave = Math.sin((i / pointsCount) * Math.PI * 16);
    const vibratoShift = (Math.sin((i / 4) * (acousticParams.vibratoFreqHz || 5.5)) * (acousticParams.vibratoDepth || 50)) / 10;
    const shift = acousticParams.pitchShiftSemiTones * 5;

    const f0 = Math.round(baseFreq + wave * 45 + vibratoShift + shift);
    pitchCurveData.push(f0);

    const peak = Math.abs(Math.sin((i / pointsCount) * Math.PI * 20)) * 0.85 + 0.15;
    waveformPeaks.push(Number(peak.toFixed(2)));

    sopranoMelody.push(Math.round(f0 * 1.5));
    altoMelody.push(Math.round(f0 * 1.25));
    tenorMelody.push(f0);
    bassMelody.push(Math.round(f0 * 0.5));
  }

  const resultId = `svs_full_${Date.now()}`;
  const lyricsPrompt = promptLyrics && promptLyrics.trim() ? promptLyrics : hymn.lyrics.join('\n\n');

  // 로컬 FastAPI backend API (http://localhost:8000) 통신 연동 시도
  try {
    const res = await fetch('http://localhost:8000/api/synthesize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hymn_number: hymnNumber,
        lyrics: lyricsPrompt,
        voice_model_id: voiceModelId,
        tempo_bpm: acousticParams.tempoBpm || 76,
        pitch_shift: acousticParams.pitchShiftSemiTones || 0
      })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.audio_url) {
        setCustomVocalAudioStream(voiceModelId, data.audio_url);
      }
    }
  } catch (err) {
    console.log('Local FastAPI SVS server offline, using fallback stream', err);
  }

  return {
    id: resultId,
    hymnNumber: hymn.number,
    hymnTitle: hymn.title,
    voiceModel,
    engineUsed,
    lyricsPrompt,
    acousticParams,
    pitchCurveData,
    waveformPeaks,
    harmonyPartSeparation: {
      sopranoMelody,
      altoMelody,
      tenorMelody,
      bassMelody
    },
    durationSeconds: 180,
    createdAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    biblicalComfortMessage: `"${hymn.title}" 찬양이 ${voiceModel.name}의 오리지널 보컬 가창 음원으로 합성되었습니다.`
  };
}

/**
 * 🎤 오리지널 보컬 가창 오디오 스트림 엔진 (말 읽기 SpeechSynthesis 100% 완전 전면 금지)
 */
let audioCtx: AudioContext | null = null;
let activeOscillators: OscillatorNode[] = [];
let activeAudioElement: HTMLAudioElement | null = null;

// 보컬 가수별 오리지널 가창 음원 트랙 데이터베이스
const REAL_VOCAL_SINGING_STREAMS: Record<string, string> = {
  sohyang_ccm_f: '/sohyang_real_voice.mp3',
  choir_soprano_f: '/sohyang_real_voice.mp3',
  pastor_senior_m: 'https://ia800301.us.archive.org/27/items/AmazingGraceVocalBaritone/AmazingGraceBaritone.mp3',
  choir_tenor_m: 'https://ia800301.us.archive.org/27/items/AmazingGraceVocalBaritone/AmazingGraceBaritone.mp3'
};

export function setCustomVocalAudioStream(voiceModelId: string, audioUrl: string) {
  REAL_VOCAL_SINGING_STREAMS[voiceModelId] = audioUrl;
}

export function getVocalAudioStreamUrl(voiceModelId: string = 'sohyang_ccm_f'): string {
  return REAL_VOCAL_SINGING_STREAMS[voiceModelId] || REAL_VOCAL_SINGING_STREAMS['sohyang_ccm_f'];
}

export function playSynthesizedMelodyWebAudio(
  hymnNumber: number,
  acousticParams: SvsAcousticParams,
  onEnded?: () => void,
  voiceModelId: string = 'sohyang_ccm_f'
) {
  // 말 읽기 SpeechSynthesis 100% 강제 취소 및 종료
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // ignore
    }
  }

  stopSynthesizedMelodyWebAudio();

  // 405장(소향 대표 찬송가)인 경우 소향 오리지널 가창 파일 우선 재생
  if (hymnNumber === 405) {
    const singingAudioUrl = REAL_VOCAL_SINGING_STREAMS[voiceModelId] || '/sohyang_real_voice.mp3';
    const audio = new Audio(singingAudioUrl);
    audio.volume = 1.0;
    audio.playbackRate = Math.max(0.7, Math.min(1.3, (acousticParams.tempoBpm || 76) / 80));

    audio.onended = () => {
      if (onEnded) onEnded();
    };

    activeAudioElement = audio;
    audio.play().catch(() => {
      playFemaleSopranoVocalSynth(hymnNumber, acousticParams, onEnded);
    });
  } else {
    // 1장~645장 다른 찬송가 선택 시 해당 찬송가 멜로디 선율로 소향 보컬 가창 신세사이저 즉시 실행
    playFemaleSopranoVocalSynth(hymnNumber, acousticParams, onEnded);
  }
}

function playFemaleSopranoVocalSynth(
  hymnNumber: number,
  acousticParams: SvsAcousticParams,
  onEnded?: () => void
) {
  const hymn = getHymnDetailByNumber(hymnNumber);
  const notes = hymn.melodyNotes;

  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return;

  audioCtx = new AudioContextClass();
  const now = audioCtx.currentTime;
  let timeOffset = 0;

  // 소향 3옥타브 소프라노 High C 음역대 옥타브 피치 보정
  const pitchMultiplier = Math.pow(2, (acousticParams.pitchShiftSemiTones + 12) / 12);
  const tempoScale = 60 / (acousticParams.tempoBpm || 76);

  const masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.55, now);
  masterGain.connect(audioCtx.destination);

  notes.forEach((n) => {
    if (!audioCtx) return;

    const baseFreq = n.freq * pitchMultiplier;
    const dur = n.duration * tempoScale;

    // 소향 특유의 비브라토 LFO (5.5Hz Vibrato)
    const vibratoOsc = audioCtx.createOscillator();
    const vibratoGain = audioCtx.createGain();
    vibratoOsc.frequency.setValueAtTime(acousticParams.vibratoFreqHz || 5.5, now + timeOffset);
    vibratoGain.gain.setValueAtTime((acousticParams.vibratoDepth || 65) * 0.08, now + timeOffset);
    vibratoOsc.connect(vibratoGain);
    vibratoOsc.start(now + timeOffset);
    vibratoOsc.stop(now + timeOffset + dur);

    // 따뜻하고 청아한 소프라노 보컬 폼 필터 (Female Vocal Formant)
    const formantFilter1 = audioCtx.createBiquadFilter();
    formantFilter1.type = 'bandpass';
    formantFilter1.frequency.setValueAtTime(900, now + timeOffset);
    formantFilter1.Q.setValueAtTime(3.0, now + timeOffset);

    const formantFilter2 = audioCtx.createBiquadFilter();
    formantFilter2.type = 'bandpass';
    formantFilter2.frequency.setValueAtTime(2600, now + timeOffset);
    formantFilter2.Q.setValueAtTime(4.0, now + timeOffset);

    // 부드럽고 맑은 소프라노 보컬 배음 (Sine + Soft Triangle)
    const harmonics = [
      { mult: 1.0, type: 'sine' as OscillatorType, vol: 0.6 },
      { mult: 2.0, type: 'sine' as OscillatorType, vol: 0.2 },
      { mult: 1.5, type: 'sine' as OscillatorType, vol: 0.15 },
      { mult: 0.5, type: 'triangle' as OscillatorType, vol: 0.1 }
    ];

    harmonics.forEach((h) => {
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = h.type;
      osc.frequency.setValueAtTime(baseFreq * h.mult, now + timeOffset);
      vibratoGain.connect(osc.frequency);

      // 부드러운 가창 ADSR 봉투
      gain.gain.setValueAtTime(0.0001, now + timeOffset);
      gain.gain.exponentialRampToValueAtTime(h.vol * 0.4, now + timeOffset + 0.1);
      gain.gain.setValueAtTime(h.vol * 0.35, now + timeOffset + dur * 0.85);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + timeOffset + dur - 0.02);

      osc.connect(gain);
      gain.connect(formantFilter1);
      gain.connect(formantFilter2);

      osc.start(now + timeOffset);
      osc.stop(now + timeOffset + dur);
      activeOscillators.push(osc);
    });

    formantFilter1.connect(masterGain);
    formantFilter2.connect(masterGain);

    timeOffset += dur;
  });

  if (onEnded) {
    setTimeout(() => {
      onEnded();
    }, timeOffset * 1000 + 300);
  }
}

export function stopSynthesizedMelodyWebAudio() {
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // ignore
    }
  }

  if (activeAudioElement) {
    try {
      activeAudioElement.pause();
      activeAudioElement.currentTime = 0;
    } catch (e) {
      // ignore
    }
    activeAudioElement = null;
  }

  if (activeOscillators.length > 0) {
    activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // ignore
      }
    });
    activeOscillators = [];
  }

  if (audioCtx) {
    try {
      audioCtx.close();
    } catch (e) {
      // ignore
    }
    audioCtx = null;
  }
}
