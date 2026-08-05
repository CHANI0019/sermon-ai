import React, { useState, useEffect, useRef } from 'react';
import { NewsRssService, NewsItem } from '../services/newsRssService';
import { SavedJournalItem, SermonResult } from '../types';
import { DeepSeekService } from '../services/deepseekService';
import { SpeechService } from '../services/speechService';
import {
  Newspaper,
  Sparkles,
  Bookmark,
  Check,
  RefreshCw,
  ArrowRight,
  Mic,
  Volume2,
  VolumeX,
  Pause,
  Music,
  Share2,
  HeartHandshake,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  Flame,
  ChevronRight
} from 'lucide-react';

interface TossMiniAppViewProps {
  onSaveItem?: (item: Omit<SavedJournalItem, 'id' | 'createdAt'>) => void;
  onCloseMiniApp?: () => void;
}

/**
 * 📱 토스(Toss) 인앱 배포 전용 미니앱 뷰 (TDS: Toss Design System 반영)
 * - Toss Blue (#3182F6), Toss Gray (#F2F4F6), White Surface (#FFFFFF), Border-Radius 20px
 */
export const TossMiniAppView: React.FC<TossMiniAppViewProps> = ({ onSaveItem, onCloseMiniApp }) => {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [loadingNews, setLoadingNews] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [sermonResult, setSermonResult] = useState<SermonResult | null>(null);
  const [fullScript, setFullScript] = useState<string | null>(null);
  const [loadingScript, setLoadingScript] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [activeTab, setActiveTab] = useState<'qt' | 'prayer' | 'music'>('qt');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      SpeechService.stop();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const loadNews = async () => {
    SpeechService.stop();
    setIsSpeaking(false);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    }
    setLoadingNews(true);
    try {
      const data = await NewsRssService.fetchLatestNews();
      setNewsList(data);
      if (data.length > 0) {
        setSelectedNews(data[0]);
        handleGenerateNewsQT(data[0]);
      }
    } finally {
      setLoadingNews(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleGenerateNewsQT = async (news: NewsItem) => {
    SpeechService.stop();
    setIsSpeaking(false);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    }
    setGenerating(true);
    setSaved(false);
    setFullScript(null);

    try {
      await new Promise((res) => setTimeout(res, 400));

      let matchedPassage = '마태복음 6:25-34';
      let exegesisText = '세속적 염려를 넘어 공중의 새를 기르시는 하나님의 주권적 섭리와 영원한 소망을 바라봅니다.';

      if (news.category === 'IT/AI') {
        matchedPassage = '창세기 1:28 / 에베소서 5:15-17';
        exegesisText = '기술 혁신의 격변 속에서, 성도는 세월을 아끼고 하나님이 주신 영적 분별력을 지켜야 합니다.';
      } else if (news.category === '경제/금융') {
        matchedPassage = '디모데전서 6:6-10 / 로마서 8:32';
        exegesisText = '재정적 흔들림 속에서 성도의 진짜 안식처는 물질의 많고 적음이 아닌, 아들을 내어주신 하나님의 신실하심입니다.';
      } else if (news.category === '사회/문화') {
        matchedPassage = '시편 142:1-5 / 히브리서 4:15-16';
        exegesisText = '디지털 세상의 소외감 속에서, 우리의 고통을 친히 담당하신 예수 그리스도의 따뜻한 동행에 소망이 있습니다.';
      } else if (news.category === '세계/국제') {
        matchedPassage = '시편 24:1 / 로마서 8:19-22';
        exegesisText = '지구촌의 아픔 앞에서, 모든 피조세계의 주인이신 하나님 주권과 성도의 청지기적 기도가 요구됩니다.';
      }

      setSermonResult({
        title: `[시사 묵상] "${news.title.slice(0, 24)}..."`,
        passage: matchedPassage,
        hook: `오늘 우리가 접한 뉴스("${news.title}")는 급변하는 세상 속에서 크리스천이 겪는 실제적 고뇌를 보여줍니다. 불안한 소식 뒤에서 하나님은 오늘 어떤 영적 평안을 주실까요?`,
        exegesis: exegesisText,
        point1: {
          title: '1. 세속 뉴스 뒤에 계신 하나님의 주권 바라보기',
          body: '세상 소식은 불안을 유발하지만, 성경은 이 모든 정황조차 하나님의 거룩한 구속사 안에서 다스려짐을 선포합니다.'
        },
        point2: {
          title: '2. 세상 사조에 휩쓸리지 않는 굳건한 신앙',
          body: '세상이 성공과 물질에 타협할 때, 성도는 십자가 안에서 얻은 영원한 정체성을 기억하며 믿음을 지킵니다.'
        },
        point3: {
          title: '3. 아파하는 시사 현장을 향한 복음의 빛 실천',
          body: '뉴스를 소비하는 데 머물지 않고, 소외된 이웃을 향해 기도로 복음의 사랑을 전하는 청지기로 살아갑니다.'
        },
        conclusion: `세상의 뉴스는 매일 변하지만, 하나님의 영원한 말씀은 세세토록 서 있습니다. 오늘 주님의 평안이 성도님의 마음을 가득 채우시길 축복합니다.`
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleSpeech = () => {
    if (isPlayingMusic && audioRef.current) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    }

    if (isSpeaking) {
      SpeechService.stop();
      setIsSpeaking(false);
    } else {
      let textToRead = fullScript;
      if (!textToRead && sermonResult) {
        textToRead = `${sermonResult.title}. 본문 ${sermonResult.passage}. ${sermonResult.hook}. ${sermonResult.exegesis}. ${sermonResult.point1.title}. ${sermonResult.point1.body}. ${sermonResult.point2.title}. ${sermonResult.point2.body}. ${sermonResult.point3.title}. ${sermonResult.point3.body}. 결론. ${sermonResult.conclusion}`;
      }

      if (textToRead) {
        setIsSpeaking(true);
        SpeechService.speak(
          textToRead,
          () => setIsSpeaking(false),
          () => setIsSpeaking(false)
        );
      }
    }
  };

  const handleToggleMusic = () => {
    if (isSpeaking) {
      SpeechService.stop();
      setIsSpeaking(false);
    }

    if (audioRef.current) {
      if (isPlayingMusic) {
        audioRef.current.pause();
        setIsPlayingMusic(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlayingMusic(true);
        }).catch(err => {
          console.log('Toss audio playback error:', err);
          setIsPlayingMusic(false);
        });
      }
    }
  };

  const handleCopyShare = () => {
    if (!sermonResult || !selectedNews) return;
    const shareText = `🕊️ [토스 - 오늘의 시사 묵상(QT)]\n\n📰 오늘 이슈: ${selectedNews.title}\n📖 성경 본문: ${sermonResult.passage}\n\n💡 묵상: ${sermonResult.exegesis}\n\n🙏 오늘의 중보기도:\n1. 이 뉴스 속 아파하는 사회와 이웃을 위해\n2. 세속 불안 속 굳건한 내 신앙을 위해\n3. 빛과 소금의 삶을 사는 청지기가 되게 하소서\n\n✨ 토스 앱에서 매일 아침 시사 묵상 읽기`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!sermonResult || !selectedNews) return;
    if (onSaveItem) {
      onSaveItem({
        title: sermonResult.title,
        type: 'sermon',
        passage: sermonResult.passage,
        content: `[토스 시사 묵상]: ${selectedNews.title}\n\n${sermonResult.hook}\n\n[주해]: ${sermonResult.exegesis}\n\n1. ${sermonResult.point1.title}\n2. ${sermonResult.point2.title}\n3. ${sermonResult.point3.title}\n\n[결론]: ${sermonResult.conclusion}`
      });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div
      style={{
        backgroundColor: '#F2F4F6',
        color: '#191F28',
        minHeight: '100vh',
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif",
        paddingBottom: 40
      }}
    >
      {/* Hidden audio element for Sohyang AI Vocal MP3 */}
      <audio
        ref={audioRef}
        src="/sohyang_hymn_405.mp3"
        onEnded={() => setIsPlayingMusic(false)}
        preload="metadata"
      />

      {/* Toss Native Sticky Header Bar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E5E8EB',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 50,
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {onCloseMiniApp && (
            <button
              onClick={onCloseMiniApp}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', color: '#191F28' }}
            >
              <ChevronLeft size={24} />
            </button>
          )}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ backgroundColor: 'rgba(49, 130, 246, 0.1)', color: '#3182F6', fontSize: '0.7rem', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                toss 앱인앱
              </span>
              <span style={{ fontSize: '0.75rem', color: '#8B95A1' }}>매일 아침 3분</span>
            </div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#191F28' }}>
              오늘의 시사 묵상(QT)
            </h1>
          </div>
        </div>

        <button
          onClick={loadNews}
          disabled={loadingNews}
          style={{
            backgroundColor: '#F2F4F6',
            border: 'none',
            borderRadius: 12,
            padding: '8px 12px',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#3182F6',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={14} className={loadingNews ? 'animate-spin' : ''} />
          새로고침
        </button>
      </header>

      {/* Main Container */}
      <main style={{ padding: 16, maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        
        {/* Top Hero Banner */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            padding: 20,
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            border: '1px solid #E5E8EB'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                backgroundColor: '#3182F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}
            >
              <BookOpen size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#3182F6' }}>
                세상 소식은 뉴스에서, 신앙의 통찰은 말씀에서
              </div>
              <div style={{ fontSize: '0.75rem', color: '#8B95A1' }}>
                오늘의 시사 이슈를 성경적 지혜와 중보기도로 풀어냅니다
              </div>
            </div>
          </div>
        </div>

        {/* Toss Selector Chips for Today's News */}
        <div style={{ overflowX: 'auto', display: 'flex', gap: 8, paddingBottom: 4 }}>
          {newsList.map((news) => {
            const isSelected = selectedNews?.id === news.id;
            return (
              <button
                key={news.id}
                onClick={() => {
                  setSelectedNews(news);
                  handleGenerateNewsQT(news);
                }}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '8px 14px',
                  borderRadius: 16,
                  border: isSelected ? '2px solid #3182F6' : '1px solid #E5E8EB',
                  backgroundColor: isSelected ? '#3182F6' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : '#4E5968',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                  transition: 'all 0.15s ease'
                }}
              >
                {isSelected ? '✓ ' : ''}[{news.category}] {news.title.slice(0, 15)}...
              </button>
            );
          })}
        </div>

        {/* Selected News Details Card */}
        {selectedNews && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: 20,
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              border: '1px solid #E5E8EB'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(49, 130, 246, 0.1)', color: '#3182F6', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>
                {selectedNews.category}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#8B95A1' }}>{selectedNews.source}</span>
            </div>

            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#191F28', marginBottom: 8, lineHeight: 1.4 }}>
              {selectedNews.title}
            </h2>

            <p style={{ fontSize: '0.85rem', color: '#4E5968', lineHeight: 1.5, margin: 0 }}>
              {selectedNews.description}
            </p>
          </div>
        )}

        {/* QT Content View Tabs (QT / 기도 / 찬양) */}
        {sermonResult && (
          <div style={{ display: 'flex', gap: 6, backgroundColor: '#E5E8EB', padding: 3, borderRadius: 14 }}>
            <button
              onClick={() => setActiveTab('qt')}
              style={{
                flex: 1,
                padding: '8px 0',
                border: 'none',
                borderRadius: 12,
                backgroundColor: activeTab === 'qt' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'qt' ? '#191F28' : '#8B95A1',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              📖 말씀 묵상
            </button>
            <button
              onClick={() => setActiveTab('prayer')}
              style={{
                flex: 1,
                padding: '8px 0',
                border: 'none',
                borderRadius: 12,
                backgroundColor: activeTab === 'prayer' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'prayer' ? '#191F28' : '#8B95A1',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              🙏 중보 기도
            </button>
            <button
              onClick={() => setActiveTab('music')}
              style={{
                flex: 1,
                padding: '8px 0',
                border: 'none',
                borderRadius: 12,
                backgroundColor: activeTab === 'music' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'music' ? '#191F28' : '#8B95A1',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              🎵 오디오/찬양
            </button>
          </div>
        )}

        {/* Tab 1: QT Scripture & Points */}
        {sermonResult && activeTab === 'qt' && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: 20,
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              border: '1px solid #E5E8EB',
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            }}
          >
            {/* Passage Header */}
            <div style={{ backgroundColor: 'rgba(49, 130, 246, 0.08)', padding: 12, borderRadius: 12 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3182F6', marginBottom: 2 }}>
                📖 오늘의 성경 본문
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#191F28' }}>
                {sermonResult.passage}
              </div>
            </div>

            {/* Hook */}
            <div style={{ fontSize: '0.9rem', color: '#4E5968', lineHeight: 1.6 }}>
              {sermonResult.hook}
            </div>

            {/* Exegesis */}
            <div style={{ borderLeft: '3px solid #3182F6', paddingLeft: 12, fontSize: '0.9rem', fontWeight: 600, color: '#191F28', lineHeight: 1.6 }}>
              {sermonResult.exegesis}
            </div>

            {/* 3 Points */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ backgroundColor: '#F2F4F6', padding: 12, borderRadius: 14 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#3182F6', marginBottom: 4 }}>
                  {sermonResult.point1.title}
                </div>
                <div style={{ fontSize: '0.825rem', color: '#4E5968', lineHeight: 1.5 }}>
                  {sermonResult.point1.body}
                </div>
              </div>

              <div style={{ backgroundColor: '#F2F4F6', padding: 12, borderRadius: 14 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#3182F6', marginBottom: 4 }}>
                  {sermonResult.point2.title}
                </div>
                <div style={{ fontSize: '0.825rem', color: '#4E5968', lineHeight: 1.5 }}>
                  {sermonResult.point2.body}
                </div>
              </div>

              <div style={{ backgroundColor: '#F2F4F6', padding: 12, borderRadius: 14 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#3182F6', marginBottom: 4 }}>
                  {sermonResult.point3.title}
                </div>
                <div style={{ fontSize: '0.825rem', color: '#4E5968', lineHeight: 1.5 }}>
                  {sermonResult.point3.body}
                </div>
              </div>
            </div>

            {/* Conclusion */}
            <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: 12, borderRadius: 12, fontSize: '0.875rem', color: '#191F28', lineHeight: 1.6 }}>
              🕊️ <strong>오늘의 소망:</strong> {sermonResult.conclusion}
            </div>
          </div>
        )}

        {/* Tab 2: Prayer Points */}
        {sermonResult && activeTab === 'prayer' && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: 20,
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              border: '1px solid #E5E8EB',
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            }}
          >
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#191F28', display: 'flex', alignItems: 'center', gap: 6 }}>
              <HeartHandshake size={20} color="#3182F6" /> 🙏 오늘 세상을 위한 3가지 중보기도
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ backgroundColor: '#F2F4F6', padding: 14, borderRadius: 14, borderLeft: '4px solid #3182F6' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#191F28', marginBottom: 4 }}>
                  1. 시사 현장의 아픔을 위한 기도
                </div>
                <div style={{ fontSize: '0.825rem', color: '#4E5968', lineHeight: 1.6 }}>
                  오늘 이슈된 소식으로 인해 고통받고 불안해하는 우리 이웃과 사회에 하나님의 위로와 공의가 임하게 하소서.
                </div>
              </div>

              <div style={{ backgroundColor: '#F2F4F6', padding: 14, borderRadius: 14, borderLeft: '4px solid #3182F6' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#191F28', marginBottom: 4 }}>
                  2. 굳건한 영적 분별력을 위한 기도
                </div>
                <div style={{ fontSize: '0.825rem', color: '#4E5968', lineHeight: 1.6 }}>
                  세속의 성공과 불확실한 소문에 흔들리지 않고, 십자가 예수 그리스도의 영원한 소망 안에 마음을 지키게 하소서.
                </div>
              </div>

              <div style={{ backgroundColor: '#F2F4F6', padding: 14, borderRadius: 14, borderLeft: '4px solid #3182F6' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#191F28', marginBottom: 4 }}>
                  3. 빛과 소금의 삶을 살기 위한 기도
                </div>
                <div style={{ fontSize: '0.825rem', color: '#4E5968', lineHeight: 1.6 }}>
                  이 시대를 살아가는 크리스천 청지기로서 삶의 자리에서 예수님의 사랑과 복음의 빛을 실천하게 하소서.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Dual Audio Player */}
        {sermonResult && activeTab === 'music' && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: 20,
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              border: '1px solid #E5E8EB',
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            }}
          >
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#191F28' }}>
              🎧 묵상 오디오 스트리밍
            </div>

            {/* Track 1: TTS Speech */}
            <div style={{ backgroundColor: '#F2F4F6', padding: 14, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#191F28' }}>
                  🔊 3분 묵상 글 음성 낭독 (TTS)
                </div>
                <div style={{ fontSize: '0.75rem', color: '#8B95A1', marginTop: 2 }}>
                  출퇴근길을 위한 차분한 낭독 서비스
                </div>
              </div>

              <button
                onClick={handleToggleSpeech}
                style={{
                  backgroundColor: isSpeaking ? '#191F28' : '#3182F6',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 12,
                  padding: '8px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                {isSpeaking ? '중지' : '듣기'}
              </button>
            </div>

            {/* Track 2: Sohyang AI Vocal Praise */}
            <div style={{ backgroundColor: 'rgba(236, 72, 153, 0.08)', padding: 14, borderRadius: 16, border: '1px solid rgba(236, 72, 153, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ec4899' }}>
                  🎵 소향 AI 찬송가 (405장 "나 같은 죄인 살리신")
                </div>
                <div style={{ fontSize: '0.75rem', color: '#8B95A1', marginTop: 2 }}>
                  소향 AI 보컬 가창 음원 감상
                </div>
              </div>

              <button
                onClick={handleToggleMusic}
                style={{
                  backgroundColor: isPlayingMusic ? '#191F28' : '#ec4899',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 12,
                  padding: '8px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                {isPlayingMusic ? <Pause size={16} /> : <Music size={16} />}
                {isPlayingMusic ? '정지' : '찬양'}
              </button>
            </div>
          </div>
        )}

        {/* Bottom Big Action Buttons for Toss UI */}
        {sermonResult && (
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button
              onClick={handleCopyShare}
              style={{
                flex: 1,
                backgroundColor: '#3182F6',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 16,
                padding: '14px 0',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                boxShadow: '0 4px 12px rgba(49, 130, 246, 0.3)'
              }}
            >
              {copied ? <CheckCircle2 size={18} /> : <Share2 size={18} />}
              {copied ? '복사 완료!' : '토스/성도 공유하기'}
            </button>

            {onSaveItem && (
              <button
                onClick={handleSave}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#191F28',
                  border: '1px solid #E5E8EB',
                  borderRadius: 16,
                  padding: '14px 20px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                {saved ? <Check size={18} color="#28A745" /> : <Bookmark size={18} />}
                {saved ? '저장됨' : '저장'}
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
