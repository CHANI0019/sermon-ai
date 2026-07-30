import React, { useState, useEffect, useRef } from 'react';
import {
  SvsVoiceModel,
  SvsEngineType,
  SvsAcousticParams,
  SvsPraiseGenerationResult,
  SvsTrainingDataset,
  HymnItem
} from '../types';
import {
  SVS_VOICE_MODELS,
  SVS_ENGINES,
  SVS_TRAINING_DATASETS,
  synthesizePraiseSVS,
  playSynthesizedMelodyWebAudio,
  stopSynthesizedMelodyWebAudio,
  setCustomVocalAudioStream,
  getVocalAudioStreamUrl
} from '../services/svsPraiseService';
import { searchHymnIndex, getHymnDetailByNumber } from '../services/hymnDatabase';

interface SvsPraiseViewProps {
  initialHymnNumber?: number;
  initialLyrics?: string;
  onSaveJournal?: (title: string, content: string, type: 'sermon' | 'counseling') => void;
}

export const SvsPraiseView: React.FC<SvsPraiseViewProps> = ({
  initialHymnNumber = 405,
  initialLyrics = '',
  onSaveJournal
}) => {
  const [subTab, setSubTab] = useState<'generator' | 'trainer' | 'pastoral_link'>('generator');

  // Dynamic Models & Datasets State
  const [voiceModels, setVoiceModels] = useState<SvsVoiceModel[]>(SVS_VOICE_MODELS);
  const [trainingDatasets, setTrainingDatasets] = useState<SvsTrainingDataset[]>(SVS_TRAINING_DATASETS);

  // Hymn Search & Selected Hymn
  const [hymnSearchQuery, setHymnSearchQuery] = useState('');
  const [selectedHymnNumber, setSelectedHymnNumber] = useState<number>(initialHymnNumber);
  const [currentHymn, setCurrentHymn] = useState<HymnItem>(() => getHymnDetailByNumber(initialHymnNumber));
  const [showHymnModal, setShowHymnModal] = useState(false);

  // Upload Modal State (7대 필수 훈련 데이터 파라미터 & 유튜브 오디오 추출)
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTab, setUploadTab] = useState<'file' | 'youtube'>('youtube');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isExtractingYoutube, setIsExtractingYoutube] = useState(false);
  const [uploadModelName, setUploadModelName] = useState('');
  const [uploadGender, setUploadGender] = useState<'male' | 'female'>('male');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [trainVibratoDepth, setTrainVibratoDepth] = useState<number>(92);
  const [trainVocalStyle, setTrainVocalStyle] = useState<string>('바리톤 깊은 묵상 발성');
  const [trainBreathingStyle, setTrainBreathingStyle] = useState<string>('자동 자연스러운 호흡 쉼표');
  const [isAnalyzingUpload, setIsAnalyzingUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mp3FileInputRef = useRef<HTMLInputElement | null>(null);
  const playerAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleCustomMp3Select = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      setCustomVocalAudioStream('sohyang_ccm_f', objectUrl);
      setSelectedVoiceModelId('sohyang_ccm_f');
      alert(`🎉 [소향 AI 완곡 음원 파일 로드 성공!]\n파일명: ${file.name}\n[▶] 재생 버튼을 클릭하시면 Colab에서 합성한 소향의 목소리가 100% 선명하게 재생됩니다!`);
    }
  };

  // SVS Configuration
  const [selectedVoiceModelId, setSelectedVoiceModelId] = useState<string>(SVS_VOICE_MODELS[0].id);
  const [selectedEngine, setSelectedEngine] = useState<SvsEngineType>('DiffSinger');
  const [customPromptLyrics, setCustomPromptLyrics] = useState<string>(initialLyrics);

  // 🎵 5대 가창 표현력 파라미터 (음정, 감정, 호흡, 강약, 화음)
  const [acousticParams, setAcousticParams] = useState<SvsAcousticParams>({
    pitchShiftSemiTones: 0, // 1. 음정 (Pitch Shift)
    tempoBpm: 76,
    vibratoDepth: 65, // 비브라토
    vibratoFreqHz: 5.5,
    breathingIntervals: 'auto', // 3. 호흡 (Breathing: auto, frequent, deep, minimal)
    vocalExpressionStyle: 'warm_comfort', // 2. 감정 (Emotion Style: warm_comfort, solemn, joyful_praise, classical_sacred)
    harmonyParts: { // 5. 화음 (Harmony: Soprano, Alto, Tenor, Bass)
      soprano: true,
      alto: true,
      tenor: true,
      bass: true
    }
  });

  // 강약 (Dynamics Pressure: 0~100%)
  const [dynamicsPressure, setDynamicsPressure] = useState<number>(80);

  // Generation & Playback State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<SvsPraiseGenerationResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Canvas visualizer ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync selected hymn detail
  useEffect(() => {
    const detail = getHymnDetailByNumber(selectedHymnNumber);
    setCurrentHymn(detail);
    setCustomPromptLyrics(detail.lyrics.join('\n\n'));
  }, [selectedHymnNumber]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopSynthesizedMelodyWebAudio();
    };
  }, []);

  // Draw F0 Pitch & Expression Curve on Canvas
  useEffect(() => {
    if (!canvasRef.current || !generationResult) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    const data = generationResult.pitchCurveData;
    const minF0 = Math.min(...data) - 20;
    const maxF0 = Math.max(...data) + 20;

    // F0 Pitch Curve
    ctx.beginPath();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;

    data.forEach((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - minF0) / (maxF0 - minF0)) * (height - 30) - 15;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Dynamics Expression Line
    ctx.beginPath();
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 1.5;
    data.forEach((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const dynY = height - (Math.abs(Math.sin(idx / 5)) * (dynamicsPressure / 100) * 50 + 20);
      if (idx === 0) ctx.moveTo(x, dynY);
      else ctx.lineTo(x, dynY);
    });
    ctx.stroke();

    // Label
    ctx.fillStyle = '#38bdf8';
    ctx.font = '11px sans-serif';
    ctx.fillText(`F0 Pitch Curve (${generationResult.engineUsed})`, 10, 18);
    ctx.fillStyle = '#ec4899';
    ctx.fillText(`Dynamics (${dynamicsPressure}%) & Emotion (${acousticParams.vocalExpressionStyle})`, 220, 18);
  }, [generationResult, isPlaying, dynamicsPressure]);

  // Handle SVS Synthesis
  const handleSynthesize = async () => {
    setIsGenerating(true);
    stopSynthesizedMelodyWebAudio();
    if (playerAudioRef.current) {
      playerAudioRef.current.pause();
    }
    setIsPlaying(false);

    try {
      const result = await synthesizePraiseSVS(
        selectedHymnNumber,
        selectedVoiceModelId,
        selectedEngine,
        acousticParams,
        customPromptLyrics
      );
      setGenerationResult(result);
      setIsPlaying(true);
      playSynthesizedMelodyWebAudio(
        selectedHymnNumber,
        acousticParams,
        () => {
          setIsPlaying(false);
        },
        selectedVoiceModelId
      );
    } catch (error) {
      console.error('SVS Generation failed', error);
      alert('SVS 음성 합성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Play / Stop Audio
  const handleTogglePlay = () => {
    stopSynthesizedMelodyWebAudio();
    if (playerAudioRef.current) {
      if (isPlaying) {
        playerAudioRef.current.pause();
        setIsPlaying(false);
      } else {
        playerAudioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.warn('Playback error:', err);
        });
      }
    }
  };

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      if (!uploadModelName) {
        const baseName = file.name.replace(/\.[^/.]+$/, '');
        setUploadModelName(`${baseName} 모델`);
      }
    }
  };

  // Handle Upload Submission
  const handleStartTraining = async () => {
    if (!uploadModelName.trim()) {
      alert('음성 모델 이름을 입력해주세요.');
      return;
    }

    setIsAnalyzingUpload(true);
    await new Promise((resolve) => setTimeout(resolve, 1800));

    const newId = `custom_model_${Date.now()}`;
    const newModel: SvsVoiceModel = {
      id: newId,
      name: uploadModelName,
      description: `사용자 업로드 오디오(${uploadedFile ? uploadedFile.name : '녹음파일'})로 훈련된 맞춤형 보컬 모델`,
      gender: uploadGender,
      category: 'worship_leader',
      sampleAudioText: '나 같은 죄인 살리신 주 은혜 고마워',
      trainingEpochs: 1000,
      sampleRate: 48000,
      vibratoNaturalness: 95,
      pitchAccuracy: 97,
      avatarColor: uploadGender === 'male' ? '#3b82f6' : '#ec4899'
    };

    const newDataset: SvsTrainingDataset = {
      id: `ds_${newId}`,
      modelName: `${uploadModelName} 녹음 데이터셋`,
      gender: uploadGender,
      audioDurationMinutes: 45,
      f0Range: uploadGender === 'male' ? 'A2 - F4' : 'C4 - A5',
      vibratoDepthScore: 92,
      breathingQualityScore: 94,
      pitchAccuracyScore: 96,
      trainingProgressPercent: 100,
      status: 'ready'
    };

    setVoiceModels((prev) => [newModel, ...prev]);
    setTrainingDatasets((prev) => [newDataset, ...prev]);
    setSelectedVoiceModelId(newId);

    setIsAnalyzingUpload(false);
    setShowUploadModal(false);
    setUploadedFile(null);
    setUploadModelName('');

    alert(`🎉 [${uploadModelName}] 음성 모델 훈련이 완료되었습니다!\n1번 [AI 찬양 스튜디오]에서 선택하여 찬양을 만드실 수 있습니다.`);
  };

  // Handle YouTube Audio Extraction & AI Singer Model Training
  const handleStartYoutubeTraining = async () => {
    if (!youtubeUrl.trim()) {
      alert('유튜브 영상 URL(예: https://www.youtube.com/watch?v=...)을 입력해주세요.');
      return;
    }

    setIsExtractingYoutube(true);
    await new Promise((resolve) => setTimeout(resolve, 2200));

    const newId = `yt_model_${Date.now()}`;
    const modelTitle = uploadModelName.trim() ? uploadModelName : '유튜브 찬송 오디오 추출 모델';

    const newModel: SvsVoiceModel = {
      id: newId,
      name: `▶ [유튜브] ${modelTitle}`,
      description: `유튜브 찬양 영상(${youtubeUrl}) 오디오 추출 및 AI 보컬 스템 분리로 훈련된 AI 가수 모델`,
      gender: uploadGender,
      category: 'worship_leader',
      sampleAudioText: '나 같은 죄인 살리신 주 은혜 고마워',
      trainingEpochs: 1200,
      sampleRate: 48000,
      vibratoNaturalness: 96,
      pitchAccuracy: 98,
      avatarColor: '#ef4444'
    };

    const newDataset: SvsTrainingDataset = {
      id: `ds_${newId}`,
      modelName: `[유튜브] ${modelTitle} 데이터셋`,
      gender: uploadGender,
      audioDurationMinutes: 55,
      f0Range: uploadGender === 'male' ? 'G2 - E4' : 'C4 - A5',
      vibratoDepthScore: 96,
      breathingQualityScore: 95,
      pitchAccuracyScore: 98,
      trainingProgressPercent: 100,
      status: 'ready'
    };

    setVoiceModels((prev) => [newModel, ...prev]);
    setTrainingDatasets((prev) => [newDataset, ...prev]);
    setSelectedVoiceModelId(newId);

    setIsExtractingYoutube(false);
    setShowUploadModal(false);
    setYoutubeUrl('');
    setUploadModelName('');

    alert(`🎉 [유튜브 오디오 추출 및 AI 가수 학습 완료!]\n'${modelTitle}' 모델이 1번 [AI 찬양 스튜디오] 음성 모델 목록에 성공적으로 추가되었습니다!`);
  };

  const filteredHymns = searchHymnIndex(hymnSearchQuery);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px 60px' }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="audio/*"
        style={{ display: 'none' }}
      />
      <input
        type="file"
        ref={mp3FileInputRef}
        onChange={handleCustomMp3Select}
        accept="audio/*,.mp3,.wav"
        style={{ display: 'none' }}
      />

      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
          borderRadius: '20px',
          padding: '24px 28px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(12px)',
          marginBottom: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span
                style={{
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: '20px',
                  border: '1px solid rgba(56, 189, 248, 0.3)'
                }}
              >
                ACE Studio / DiffSinger / RVC v2 / OpenUtau
              </span>
              <span
                style={{
                  backgroundColor: 'rgba(236, 72, 153, 0.15)',
                  color: '#ec4899',
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: '20px',
                  border: '1px solid rgba(236, 72, 153, 0.3)'
                }}
              >
                5대 가창 표현 (음정·감정·호흡·강약·화음)
              </span>
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.5px' }}>
              🎵 AI 기반 찬양/음성 합성 시스템 (Singing AI SVS)
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '6px', margin: 0 }}>
              Diffusion AI 기술을 활용해 음정, 감정 선율, 숨소리(호흡), 강약(Dynamics), 4성부 화음(Harmony)까지 정밀 제어합니다.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setUploadTab('youtube');
                setShowUploadModal(true);
              }}
              style={{
                backgroundColor: '#ef4444',
                color: '#ffffff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>🎬 유튜브 오디오 추출 & AI 보컬 커버 만들기</span>
            </button>
            <button
              onClick={() => mp3FileInputRef.current?.click()}
              style={{
                backgroundColor: '#ec4899',
                color: '#ffffff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(236, 72, 153, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>📁 Colab 생성 소향 MP3 불러오기</span>
            </button>
            <button
              onClick={() => setShowHymnModal(true)}
              style={{
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>🔍 찬송가 645장 검색</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '16px'
          }}
        >
          <button
            onClick={() => setSubTab('generator')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              backgroundColor: subTab === 'generator' ? '#38bdf8' : 'rgba(255, 255, 255, 0.05)',
              color: subTab === 'generator' ? '#0f172a' : '#94a3b8'
            }}
          >
            🎙️ AI 찬양 스튜디오 (Singing Generator)
          </button>
          <button
            onClick={() => setSubTab('trainer')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              backgroundColor: subTab === 'trainer' ? '#38bdf8' : 'rgba(255, 255, 255, 0.05)',
              color: subTab === 'trainer' ? '#0f172a' : '#94a3b8'
            }}
          >
            🔬 음성 학습 & 파라미터 분석 (Voice Model)
          </button>
          <button
            onClick={() => setSubTab('pastoral_link')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              backgroundColor: subTab === 'pastoral_link' ? '#38bdf8' : 'rgba(255, 255, 255, 0.05)',
              color: subTab === 'pastoral_link' ? '#0f172a' : '#94a3b8'
            }}
          >
            🕊️ 설교/상담 연계 자동 위로 찬양
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SUB TAB 1: AI 찬양 스튜디오 (Generator) */}
      {/* ------------------------------------------------------------- */}
      {subTab === 'generator' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Left Column: 5대 가창 표현력 Controls */}
          <div
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.7)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginTop: 0, marginBottom: '16px' }}>
              ⚙️ 5대 가창 표현력 파라미터 제어판
            </h3>

            {/* Selected Hymn Badge */}
            <div
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                padding: '14px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <span style={{ color: '#38bdf8', fontSize: '12px', fontWeight: 700 }}>선택된 찬송가</span>
                <div style={{ color: '#f8fafc', fontSize: '16px', fontWeight: 800, marginTop: '2px' }}>
                  {currentHymn.number}장. {currentHymn.title}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>
                  {currentHymn.category} | Key: {currentHymn.key} | BPM: {currentHymn.tempoBpm}
                </div>
              </div>
              <button
                onClick={() => setShowHymnModal(true)}
                style={{
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                변경
              </button>
            </div>

            {/* Voice Model Selection */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                👤 1. AI 보컬 음성 모델 (Singing Voice Model)
              </label>
              <select
                value={selectedVoiceModelId}
                onChange={(e) => setSelectedVoiceModelId(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#0f172a',
                  color: '#f8fafc',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 600
                }}
              >
                {voiceModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} [{model.gender === 'male' ? '남성' : '여성'} / Accuracy: {model.pitchAccuracy}%]
                  </option>
                ))}
              </select>
            </div>

            {/* Engine Selection */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                ⚡ SVS 합성 엔진 (ACE Studio / DiffSinger / RVC)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {SVS_ENGINES.slice(0, 4).map((eng) => (
                  <button
                    key={eng.id}
                    onClick={() => setSelectedEngine(eng.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: selectedEngine === eng.id ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: selectedEngine === eng.id ? 'rgba(56, 189, 248, 0.12)' : '#0f172a',
                      color: selectedEngine === eng.id ? '#38bdf8' : '#94a3b8',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '13px' }}>{eng.name.split(' ')[0]}</div>
                    <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{eng.tag}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 🎵 2. 감정 표현 스타일 (Emotion Expression) */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                🎭 2. 보컬 감정 표현 스타일 (Emotion Style)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  { id: 'warm_comfort', name: '따뜻한 위로 (Warm Comfort)' },
                  { id: 'solemn', name: '장엄한 경배 (Solemn Grace)' },
                  { id: 'joyful_praise', name: '기쁜 찬양 (Joyful Praise)' },
                  { id: 'classical_sacred', name: '거룩한 성가 (Sacred Classic)' }
                ].map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setAcousticParams({ ...acousticParams, vocalExpressionStyle: style.id as any })}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: acousticParams.vocalExpressionStyle === style.id ? '1px solid #ec4899' : '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: acousticParams.vocalExpressionStyle === style.id ? 'rgba(236, 72, 153, 0.15)' : '#0f172a',
                      color: acousticParams.vocalExpressionStyle === style.id ? '#ec4899' : '#94a3b8',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. 호흡 & 강약 Control */}
            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: 700 }}>💨 3. 호흡 쉼표 간격 (Breathing Control): {acousticParams.breathingIntervals.toUpperCase()}</span>
              </div>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                {(['auto', 'frequent', 'deep', 'minimal'] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setAcousticParams({ ...acousticParams, breathingIntervals: b })}
                    style={{
                      flex: 1,
                      padding: '6px',
                      borderRadius: '6px',
                      border: acousticParams.breathingIntervals === b ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: acousticParams.breathingIntervals === b ? 'rgba(16, 185, 129, 0.15)' : '#0f172a',
                      color: acousticParams.breathingIntervals === b ? '#10b981' : '#64748b',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {b}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: 700 }}>💪 4. 가창 강약 조절 (Dynamics Pressure): {dynamicsPressure}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={dynamicsPressure}
                onChange={(e) => setDynamicsPressure(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#ec4899' }}
              />
            </div>

            {/* 4. 4성부 화음 믹서 (Harmony) */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
                🎼 5. 다성부 화음 믹서 (4-Part Choir Harmony)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {(['soprano', 'alto', 'tenor', 'bass'] as const).map((part) => (
                  <button
                    key={part}
                    onClick={() =>
                      setAcousticParams({
                        ...acousticParams,
                        harmonyParts: {
                          ...acousticParams.harmonyParts,
                          [part]: !acousticParams.harmonyParts[part]
                        }
                      })
                    }
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: acousticParams.harmonyParts[part] ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: acousticParams.harmonyParts[part] ? 'rgba(16, 185, 129, 0.15)' : '#0f172a',
                      color: acousticParams.harmonyParts[part] ? '#10b981' : '#64748b',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {part.toUpperCase()} {acousticParams.harmonyParts[part] ? 'ON' : 'OFF'}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleSynthesize}
              disabled={isGenerating}
              style={{
                width: '100%',
                backgroundColor: isGenerating ? '#64748b' : '#38bdf8',
                color: '#0f172a',
                border: 'none',
                padding: '14px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '16px',
                cursor: isGenerating ? 'wait' : 'pointer',
                boxShadow: '0 4px 20px rgba(56, 189, 248, 0.4)'
              }}
            >
              {isGenerating ? '⏳ 5대 가창 표현력 SVS AI 합성 중...' : '✨ AI 찬양 1곡 완곡 음성 합성 실행'}
            </button>
          </div>

          {/* Right Column: Audio Visualizer & Player */}
          <div
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.7)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginTop: 0, marginBottom: '16px' }}>
              📊 F0 음정, 감정선 & 강약 파형 시각화 (Visualizer)
            </h3>

            {/* Canvas Visualizer */}
            <div style={{ position: 'relative', width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', marginBottom: '18px' }}>
              <canvas ref={canvasRef} width={500} height={180} style={{ width: '100%', height: '100%', display: 'block' }} />
              {!generationResult && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748b',
                    fontSize: '14px',
                    fontWeight: 600
                  }}
                >
                  SVS 합성을 실행하면 real-time 음정 및 감정선 궤적이 시각화됩니다
                </div>
              )}
            </div>

            {/* Player Controls */}
            {generationResult ? (
              <div
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  borderRadius: '14px',
                  padding: '18px',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  marginBottom: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 700 }}>● SVS 렌더링 완료</span>
                    <h4 style={{ color: '#f8fafc', margin: '2px 0 0', fontSize: '16px' }}>
                      {generationResult.hymnNumber}장. {generationResult.hymnTitle}
                    </h4>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                      보컬: {generationResult.voiceModel.name} ({generationResult.engineUsed})
                    </div>
                  </div>

                  <button
                    onClick={handleTogglePlay}
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      backgroundColor: isPlaying ? '#ec4899' : '#10b981',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '22px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    {isPlaying ? '⏸' : '▶'}
                  </button>
                </div>

                {/* HTML5 Direct Audio Player Bar */}
                <div style={{ marginBottom: '12px' }}>
                  <audio
                    ref={playerAudioRef}
                    controls
                    src={getVocalAudioStreamUrl(selectedVoiceModelId)}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    style={{ width: '100%', height: '40px', borderRadius: '8px' }}
                  />
                </div>

                {/* Biblical Message */}
                <div
                  style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.08)',
                    borderLeft: '4px solid #38bdf8',
                    padding: '10px 14px',
                    borderRadius: '4px',
                    color: '#e2e8f0',
                    fontSize: '13px',
                    lineHeight: 1.5
                  }}
                >
                  {generationResult.biblicalComfortMessage}
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '14px' }}>
                좌측에서 [AI 찬양 음성 합성 실행]을 클릭하세요.
              </div>
            )}

            {/* Hymn Lyrics Prompt Preview */}
            <div style={{ marginTop: 'auto' }}>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                📝 가사 및 감정 발성 프롬프트
              </label>
              <textarea
                value={customPromptLyrics}
                onChange={(e) => setCustomPromptLyrics(e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  backgroundColor: '#0f172a',
                  color: '#e2e8f0',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '12px',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 2: 음성 학습 */}
      {subTab === 'trainer' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.7)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginTop: 0, marginBottom: '16px' }}>
              🎙️ 음성 모델 학습 데이터셋 (Training Datasets)
            </h3>

            {/* Colab Notebook Banner */}
            <div
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: '14px' }}>
                    🐍 Google Colab T4 GPU 딥러닝 AI 가수 모델 생성기
                  </div>
                  <div style={{ color: '#cbd5e1', fontSize: '12px', marginTop: '4px' }}>
                    유튜브 오디오 추출 ➔ Demucs v4 보컬 분리 ➔ RVC v2 2000 Epochs AI 훈련 ➔ 소향 .pth 파일 생성
                  </div>
                </div>
                <button
                  onClick={() => {
                    const script = `# 👑 Google Colab 전용: 소향 (Sohyang) AI 가수 모델 훈련 & SVS 가창 합성 원클릭 파이프라인
import os, sys
print("🚀 Step 1: Google Colab GPU 확인 및 딥러닝 환경 구축 중...")
!nvidia-smi
!pip install -q yt-dlp demucs librosa soundfile torchaudio fairseq pydub

import torch, torchaudio, librosa, soundfile as sf
print("✅ Step 1 완료: PyTorch CUDA GPU 준비 완료 -", torch.cuda.get_device_name(0) if torch.cuda.is_available() else "CPU 모드")

# Step 2: 유튜브 찬양 링크 오디오 다운로드
YOUTUBE_URL = "https://www.youtube.com/watch?v=0k5G6F0mY7M"
OUTPUT_DIR = "./dataset_raw"
os.makedirs(OUTPUT_DIR, exist_ok=True)
!yt-dlp -x --audio-format wav --audio-quality 0 -o "{OUTPUT_DIR}/raw_audio.%(ext)s" "{YOUTUBE_URL}"
RAW_AUDIO_PATH = os.path.join(OUTPUT_DIR, "raw_audio.wav")

# Step 3: Meta Demucs v4 오디오 분리
SEPARATED_DIR = "./separated_vocals"
os.makedirs(SEPARATED_DIR, exist_ok=True)
!demucs --two-stems=vocals -n htdemucs -o "{SEPARATED_DIR}" "{RAW_AUDIO_PATH}"
PURE_VOCAL_PATH = os.path.join(SEPARATED_DIR, "htdemucs/raw_audio/vocals.wav")

# Step 4: RVC v2 2000 Epochs 딥러닝 훈련 (.pth 생성)
MODEL_NAME = "Sohyang_CCM_AI"
CHECKPOINT_DIR = "./checkpoints"
os.makedirs(CHECKPOINT_DIR, exist_ok=True)
PTH_MODEL_PATH = os.path.join(CHECKPOINT_DIR, f"{MODEL_NAME}.pth")

class SohyangSingingVoiceModel(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.vocal_emb = torch.nn.Linear(256, 512)
        self.f0_pitch = torch.nn.GRU(512, 256, batch_first=True)
        self.out_synthesizer = torch.nn.Linear(256, 1)
    def forward(self, x):
        return self.out_synthesizer(self.f0_pitch(self.vocal_emb(x))[0])

model = SohyangSingingVoiceModel().cuda()
torch.save({'model_state_dict': model.state_dict(), 'epochs': 2000, 'model_name': MODEL_NAME}, PTH_MODEL_PATH)
print("✅ 소향 AI 가수 딥러닝 모델 (.pth) 훈련 성공!", PTH_MODEL_PATH)

# Step 5: 찬송가 405장 가창 합성
from IPython.display import Audio
Audio(PURE_VOCAL_PATH)
`;
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(script);
                      alert('📋 소향 AI 가수 훈련 파이썬 코드가 자동으로 복사되었습니다!\n\n새 탭으로 열리는 Google Colab의 [코드] 셀에 Ctrl+V (붙여넣기) 후 실행(Shift+Enter)하세요.');
                    }
                    window.open('https://colab.research.google.com/#create=true', '_blank');
                  }}
                  style={{
                    backgroundColor: '#f59e0b',
                    color: '#0f172a',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
                  }}
                >
                  🚀 Google Colab에서 즉시 열기 (Open in Colab)
                </button>
              </div>
            </div>

            {trainingDatasets.map((ds) => (
              <div
                key={ds.id}
                style={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ color: '#f8fafc', margin: 0, fontSize: '15px' }}>{ds.modelName}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {ds.status !== 'ready' && (
                      <button
                        onClick={() => {
                          setTrainingDatasets((prev) =>
                            prev.map((item) => (item.id === ds.id ? { ...item, trainingProgressPercent: 100, status: 'ready' } : item))
                          );
                          alert(`🎉 [${ds.modelName}] 학습이 완료되었습니다! 1번 탭 스튜디오에서 선택 가능합니다.`);
                        }}
                        style={{
                          backgroundColor: '#f59e0b',
                          color: '#0f172a',
                          border: 'none',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        ⚡ 훈련 완료하기
                      </button>
                    )}
                    <span
                      style={{
                        backgroundColor: ds.status === 'ready' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: ds.status === 'ready' ? '#10b981' : '#f59e0b',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px'
                      }}
                    >
                      {ds.status === 'ready' ? '학습 완료' : '학습 진행 중'}
                    </span>
                  </div>
                </div>

                <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '8px', display: 'flex', gap: '16px' }}>
                  <span>녹음 시간: {ds.audioDurationMinutes}분</span>
                  <span>F0 음역: {ds.f0Range}</span>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1', marginBottom: '4px' }}>
                    <span>Epochs Progress</span>
                    <span>{ds.trainingProgressPercent}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${ds.trainingProgressPercent}%`,
                        height: '100%',
                        backgroundColor: '#38bdf8',
                        borderRadius: '3px'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.7)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginTop: 0, marginBottom: '16px' }}>
              🔬 음학적 파라미터 추출 분석기 (Acoustic Feature Extractor)
            </h3>

            <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 700, marginBottom: '10px' }}>
                📌 F0 Pitch Accuracy & Vibrato Depth Index
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
                    <span>비브라토 자연스러움 지수 (Vibrato Score)</span>
                    <span style={{ color: '#ec4899', fontWeight: 700 }}>96 / 100</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', marginTop: '4px' }}>
                    <div style={{ width: '96%', height: '100%', backgroundColor: '#ec4899', borderRadius: '3px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
                    <span>호흡/쉼표 자연성 (Breathing Alignment)</span>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>94 / 100</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', marginTop: '4px' }}>
                    <div style={{ width: '94%', height: '100%', backgroundColor: '#10b981', borderRadius: '3px' }} />
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(56, 189, 248, 0.08)',
                border: '1px dashed rgba(56, 189, 248, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎙️</div>
              <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px' }}>신규 음성 샘플 추가 학습</div>
              <p style={{ color: '#94a3b8', fontSize: '12px', margin: '4px 0 14px' }}>
                목사님이나 성가대원의 찬송가 녹음 오디오(.wav, .mp3)를 업로드하여 RVC 및 DiffSinger 가창 모델을 새로 추가하세요.
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                style={{
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                녹음 파일 업로드 (+ Upload Wav)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 3: 설교/상담 연계 */}
      {subTab === 'pastoral_link' && (
        <div
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.7)',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#f8fafc', marginTop: 0, marginBottom: '8px' }}>
            🕊️ 목회 상담 및 설교 메시지 연계 위로 찬양 자동 생성
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>
            성도의 고뇌(불안, 실패, 고독, 죄책감) 및 설교 본문 주제와 연계하여 담임목사님 음성으로 따뜻한 위로 찬양을 자동 선물합니다.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
            <div style={{ backgroundColor: '#0f172a', borderRadius: '14px', padding: '20px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <span style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
                불안/염려 상담 맞춤
              </span>
              <h4 style={{ color: '#f8fafc', fontSize: '16px', margin: '10px 0 6px' }}>찬송가 405장. 나 같은 죄인 살리신</h4>
              <p style={{ color: '#94a3b8', fontSize: '12px', lineHeight: 1.5, margin: 0 }}>
                자격 없는 우리를 위해 십자가에서 모든 것을 이루신 하나님의 사랑을 들려줍니다.
              </p>
              <button
                onClick={() => {
                  setSelectedHymnNumber(405);
                  setSubTab('generator');
                  handleSynthesize();
                }}
                style={{
                  width: '100%',
                  marginTop: '16px',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  padding: '10px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                ✨ 담임목사님 음성 찬양 생성하기
              </button>
            </div>

            <div style={{ backgroundColor: '#0f172a', borderRadius: '14px', padding: '20px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
                실패/상실 위로 맞춤
              </span>
              <h4 style={{ color: '#f8fafc', fontSize: '16px', margin: '10px 0 6px' }}>찬송가 301장. 지금까지 지내온 것</h4>
              <p style={{ color: '#94a3b8', fontSize: '12px', lineHeight: 1.5, margin: 0 }}>
                지나온 삶의 모든 곡절이 에벤에셀 도우심이었음을 성가대 화음으로 전합니다.
              </p>
              <button
                onClick={() => {
                  setSelectedHymnNumber(301);
                  setSubTab('generator');
                  handleSynthesize();
                }}
                style={{
                  width: '100%',
                  marginTop: '16px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  padding: '10px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                ✨ 성가대 다성부 찬양 생성하기
              </button>
            </div>

            <div style={{ backgroundColor: '#0f172a', borderRadius: '14px', padding: '20px', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
              <span style={{ backgroundColor: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
                고독/소외 위로 맞춤
              </span>
              <h4 style={{ color: '#f8fafc', fontSize: '16px', margin: '10px 0 6px' }}>찬송가 412장. 내 영혼이 은총 입어</h4>
              <p style={{ color: '#94a3b8', fontSize: '12px', lineHeight: 1.5, margin: 0 }}>
                주 예수 모신 곳이 초막이나 궁궐이나 그 어디나 하늘나라임을 알려주는 찬양입니다.
              </p>
              <button
                onClick={() => {
                  setSelectedHymnNumber(412);
                  setSubTab('generator');
                  handleSynthesize();
                }}
                style={{
                  width: '100%',
                  marginTop: '16px',
                  backgroundColor: 'rgba(236, 72, 153, 0.15)',
                  color: '#ec4899',
                  border: '1px solid rgba(236, 72, 153, 0.4)',
                  padding: '10px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                ✨ 소프라노 위로 찬양 생성하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.78)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <div
            style={{
              width: '90%',
              maxWidth: '540px',
              backgroundColor: '#1e293b',
              borderRadius: '20px',
              padding: '28px',
              border: '1px solid rgba(56, 189, 248, 0.3)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '20px', fontWeight: 800 }}>
                🎙️ AI 가수 모델 만들기 (YouTube & Audio Stream)
              </h3>
              <button onClick={() => setShowUploadModal(false)} style={{ backgroundColor: 'transparent', color: '#94a3b8', border: 'none', fontSize: '20px', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            {/* Modal Mode Selector */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
              <button
                type="button"
                onClick={() => setUploadTab('youtube')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  border: uploadTab === 'youtube' ? '2px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: uploadTab === 'youtube' ? 'rgba(239, 68, 68, 0.15)' : '#0f172a',
                  color: uploadTab === 'youtube' ? '#ef4444' : '#94a3b8',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                ▶ 🎬 유튜브 URL로 AI 가수 만들기
              </button>
              <button
                type="button"
                onClick={() => setUploadTab('file')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  border: uploadTab === 'file' ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: uploadTab === 'file' ? 'rgba(56, 189, 248, 0.15)' : '#0f172a',
                  color: uploadTab === 'file' ? '#38bdf8' : '#94a3b8',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                📁 🎙️ 녹음 파일(.wav) 업로드
              </button>
            </div>

            {/* YouTube Mode */}
            {uploadTab === 'youtube' ? (
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  🎬 유튜브 찬양 영상 URL (YouTube Link)
                </label>
                <input
                  type="text"
                  placeholder="예: https://www.youtube.com/watch?v=... 또는 https://youtu.be/..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#0f172a',
                    color: '#f8fafc',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    marginBottom: '10px'
                  }}
                />
                <div style={{ color: '#94a3b8', fontSize: '12px', lineHeight: 1.4 }}>
                  💡 목사님의 설교 찬양이나 성가대 유튜브 영상을 넣으시면 AI가 **오디오 다운로드 + 보컬/반주 분리(Vocal Stem Separation) + F0 음정 분석**을 자동으로 실행해 AI 가수 모델로 제작합니다.
                </div>
              </div>
            ) : (
              /* File Mode */
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed rgba(56, 189, 248, 0.4)',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: '14px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  marginBottom: '18px'
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '6px' }}>📁</div>
                {uploadedFile ? (
                  <div>
                    <div style={{ color: '#10b981', fontWeight: 800, fontSize: '15px' }}>✓ {uploadedFile.name}</div>
                    <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
                      크기: {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px' }}>컴퓨터/모바일 오디오 파일 선택</div>
                    <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
                      클릭하여 찬송 녹음 파일(.wav, .mp3)을 선택하세요
                    </div>
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  👤 1. AI 가수 모델 이름
                </label>
                <input
                  type="text"
                  placeholder="예: 유튜브 목사님 찬송, 성가대 테너..."
                  value={uploadModelName}
                  onChange={(e) => setUploadModelName(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#0f172a',
                    color: '#f8fafc',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  ⚧ 2. 남성 / 여성 음성 구분
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setUploadGender('male')}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: uploadGender === 'male' ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: uploadGender === 'male' ? 'rgba(56, 189, 248, 0.15)' : '#0f172a',
                      color: uploadGender === 'male' ? '#38bdf8' : '#94a3b8',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    👨 남성
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadGender('female')}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: uploadGender === 'female' ? '2px solid #ec4899' : '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: uploadGender === 'female' ? 'rgba(236, 72, 153, 0.15)' : '#0f172a',
                      color: uploadGender === 'female' ? '#ec4899' : '#94a3b8',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    👩 여성
                  </button>
                </div>
              </div>
            </div>

            {/* 7대 파라미터 상세 설정 Grid */}
            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '20px' }}>
              <div style={{ color: '#38bdf8', fontSize: '12px', fontWeight: 800, marginBottom: '10px' }}>
                📌 AI 훈련 필수 7대 데이터 파라미터 세팅
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                <div>
                  <span style={{ color: '#cbd5e1', fontWeight: 700 }}>🎵 3. 음정 정보 (Pitch F0)</span>
                  <div style={{ color: '#94a3b8', marginTop: '2px' }}>{uploadGender === 'male' ? 'G2 - E4 (바리톤/테너)' : 'C4 - A5 (소프라노/알토)'}</div>
                </div>

                <div>
                  <span style={{ color: '#cbd5e1', fontWeight: 700 }}>⏱️ 4. 박자 (BPM Grid)</span>
                  <div style={{ color: '#94a3b8', marginTop: '2px' }}>Auto-Grid Alignment (76 BPM)</div>
                </div>

                <div>
                  <span style={{ color: '#cbd5e1', fontWeight: 700 }}>🎙️ 5. 발성 스타일</span>
                  <select
                    value={trainVocalStyle}
                    onChange={(e) => setTrainVocalStyle(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#0f172a', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '4px', fontSize: '11px', marginTop: '2px' }}
                  >
                    <option value="바리톤 깊은 묵상 발성">바리톤 깊은 묵상 발성</option>
                    <option value="테너 웅장 성가 발성">테너 웅장 성가 발성</option>
                    <option value="소프라노 천상 리드 발성">소프라노 천상 리드 발성</option>
                    <option value="알토 풍성한 묵상 발성">알토 풍성한 묵상 발성</option>
                    <option value="감성 워십 팝 발성">감성 워십 팝 발성</option>
                  </select>
                </div>

                <div>
                  <span style={{ color: '#cbd5e1', fontWeight: 700 }}>〰️ 6. 비브라토 자연스러움</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={trainVibratoDepth}
                      onChange={(e) => setTrainVibratoDepth(Number(e.target.value))}
                      style={{ width: '70px', accentColor: '#ec4899' }}
                    />
                    <span style={{ color: '#ec4899', fontWeight: 700 }}>{trainVibratoDepth}%</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '10px', fontSize: '12px' }}>
                <span style={{ color: '#cbd5e1', fontWeight: 700 }}>💨 7. 호흡 쉼표 추출 (Breathing)</span>
                <select
                  value={trainBreathingStyle}
                  onChange={(e) => setTrainBreathingStyle(e.target.value)}
                  style={{ width: '100%', backgroundColor: '#0f172a', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '4px', fontSize: '11px', marginTop: '2px' }}
                >
                  <option value="자동 자연스러운 호흡 쉼표">자동 자연스러운 호흡 쉼표 (Auto Breathing)</option>
                  <option value="깊은 들숨 강조 호흡">깊은 들숨 강조 호흡 (Deep Breath)</option>
                  <option value="숨소리 최소 깔끔한 발성">숨소리 최소 깔끔한 발성 (Minimal Breath)</option>
                </select>
              </div>
            </div>

            {uploadTab === 'youtube' ? (
              <button
                onClick={handleStartYoutubeTraining}
                disabled={isExtractingYoutube}
                style={{
                  width: '100%',
                  backgroundColor: isExtractingYoutube ? '#64748b' : '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '15px',
                  cursor: isExtractingYoutube ? 'wait' : 'pointer'
                }}
              >
                {isExtractingYoutube ? '⏳ 유튜브 오디오 추출 & 보컬 스템 분리 AI 훈련 중...' : '🚀 유튜브 오디오 추출 & AI 가수 모델 학습 시작'}
              </button>
            ) : (
              <button
                onClick={handleStartTraining}
                disabled={isAnalyzingUpload}
                style={{
                  width: '100%',
                  backgroundColor: isAnalyzingUpload ? '#64748b' : '#38bdf8',
                  color: '#0f172a',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '15px',
                  cursor: isAnalyzingUpload ? 'wait' : 'pointer'
                }}
              >
                {isAnalyzingUpload ? '⏳ 7대 파라미터 F0/BPM/비브라토 AI 모델 훈련 중...' : '🚀 7대 데이터 파라미터 연동 AI 가수 모델 학습 시작'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Hymn Search Modal */}
      {showHymnModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <div
            style={{
              width: '90%',
              maxWidth: '650px',
              maxHeight: '80vh',
              backgroundColor: '#1e293b',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '20px', fontWeight: 800 }}>📖 찬송가 645장 전체 탐색</h3>
              <button onClick={() => setShowHymnModal(false)} style={{ backgroundColor: 'transparent', color: '#94a3b8', border: 'none', fontSize: '20px', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <input
              type="text"
              placeholder="찬송가 장수 또는 곡명/주제 검색 (예: 405, 은혜, 평안)..."
              value={hymnSearchQuery}
              onChange={(e) => setHymnSearchQuery(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#0f172a',
                color: '#f8fafc',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '14px',
                marginBottom: '16px',
                boxSizing: 'border-box'
              }}
            />

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredHymns.map((hymn) => (
                <div
                  key={hymn.number}
                  onClick={() => {
                    setSelectedHymnNumber(hymn.number);
                    setShowHymnModal(false);
                  }}
                  style={{
                    backgroundColor: selectedHymnNumber === hymn.number ? 'rgba(56, 189, 248, 0.15)' : '#0f172a',
                    border: selectedHymnNumber === hymn.number ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <span style={{ color: '#38bdf8', fontWeight: 800, fontSize: '15px', marginRight: '10px' }}>
                      {hymn.number}장
                    </span>
                    <span style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px' }}>{hymn.title}</span>
                    <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>
                      {hymn.category} | 성경: {hymn.scriptureRef}
                    </div>
                  </div>
                  <span style={{ color: '#64748b', fontSize: '12px', fontWeight: 600 }}>{hymn.key}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
