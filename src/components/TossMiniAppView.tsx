import React, { useState, useEffect } from 'react';
import { NewsRssService, NewsItem } from '../services/newsRssService';
import { SavedJournalItem, SermonResult } from '../types';
import { DeepSeekService } from '../services/deepseekService';
import { SpeechService } from '../services/speechService';
import { generateSmartNewsQT } from '../services/qtGeneratorService';
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
  Share2,
  HeartHandshake,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  Flame
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
  const [prayerPoints, setPrayerPoints] = useState<{ p1: string; p2: string; p3: string } | null>(null);
  const [fullScript, setFullScript] = useState<string | null>(null);
  const [loadingScript, setLoadingScript] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState<'qt' | 'prayer'>('qt');
  const [showMigrationModal, setShowMigrationModal] = useState(true);

  useEffect(() => {
    return () => {
      SpeechService.stop();
    };
  }, []);

  const loadNews = async () => {
    SpeechService.stop();
    setIsSpeaking(false);
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
    setGenerating(true);
    setSaved(false);
    setFullScript(null);

    try {
      await new Promise((res) => setTimeout(res, 350));
      const smartQt = generateSmartNewsQT(news);
      setSermonResult(smartQt);
      setPrayerPoints({
        p1: smartQt.prayer1,
        p2: smartQt.prayer2,
        p3: smartQt.prayer3
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleSpeech = () => {
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

  const handleCopyShare = () => {
    if (!sermonResult || !selectedNews) return;
    const p1 = prayerPoints?.p1 || '이 뉴스 속 아파하는 사회와 이웃을 위해';
    const p2 = prayerPoints?.p2 || '세속 불안 속 굳건한 내 신앙을 위해';
    const p3 = prayerPoints?.p3 || '빛과 소금의 삶을 사는 청지기가 되게 하소서';

    const shareText = `🕊️ [토스 - 오늘의 시사 묵상(QT)]\n\n📰 오늘 이슈: ${selectedNews.title}\n📖 성경 본문: ${sermonResult.passage}\n\n💡 묵상: ${sermonResult.exegesis}\n\n🙏 오늘의 중보기도:\n1. ${p1}\n2. ${p2}\n3. ${p3}\n\n✨ 토스 앱에서 매일 아침 시사 묵상 읽기`;
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
      {/* 📢 Toss In-App Migration Notice Modal */}
      {showMigrationModal && (
        <div style={{
          display: 'flex',
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 9999999,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          boxSizing: 'border-box',
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Pretendard', 'Noto Sans KR', sans-serif"
        }}>
          <div style={{
            background: '#ffffff',
            color: '#191f28',
            borderRadius: 28,
            width: '100%',
            maxWidth: 390,
            padding: '32px 22px 26px',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
            textAlign: 'center',
            position: 'relative',
            boxSizing: 'border-box'
          }}>
            <button
              type="button"
              onClick={() => setShowMigrationModal(false)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: 'none',
                background: '#f2f4f6',
                color: '#8b95a1',
                fontSize: 16,
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: 20,
              marginBottom: 14
            }}>
              <span style={{ fontSize: 14 }}>✨</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1d4ed8' }}>서비스 통합 이전 & 업그레이드</span>
            </div>

            <h2 style={{ fontSize: 21, fontWeight: 800, color: '#191f28', lineHeight: 1.35, margin: '0 0 10px 0', letterSpacing: -0.6 }}>
              새로운 차세대 AI 시스템으로<br /><span style={{ color: '#3182f6' }}>공식 통합 이전</span>하였습니다!
            </h2>

            <p style={{ fontSize: 13.5, color: '#4e5968', lineHeight: 1.55, margin: '0 0 18px 0', wordBreak: 'keep-all' }}>
              고객님께 더 빠르고 고도화된 정밀 AI 서비스를 제공해 드리기 위해, 기존 서비스를 전면 개편하여 <strong>공식 통합 웹 플랫폼(fortuneai.co.kr)</strong>으로 정식 이전 오픈하였습니다.
            </p>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 16,
              padding: '13px 15px',
              textAlign: 'left',
              marginBottom: 20,
              fontSize: 13
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
                <span style={{ fontSize: 15 }}>🔮</span>
                <span style={{ color: '#1e293b', fontWeight: 600 }}>10만 명리학 빅데이터 AI 사주 · 만세력</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
                <span style={{ fontSize: 15 }}>💼</span>
                <span style={{ color: '#1e293b', fontWeight: 600 }}>AI 커리어 직업 적성 & 찰떡 진로 분석</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ fontSize: 15 }}>🎁</span>
                <span style={{ color: '#2563eb', fontWeight: 700 }}>공식 사이트 방문 즉시 전 기능 무료 체험</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                type="button"
                onClick={() => {
                  window.location.href = 'https://fortuneai.co.kr/?utm_source=toss_inapp&utm_medium=sermon_modal';
                }}
                style={{
                  width: '100%',
                  padding: '15px 16px',
                  background: 'linear-gradient(135deg, #3182f6 0%, #1b64da 100%)',
                  color: '#ffffff',
                  fontSize: 15.5,
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: 16,
                  cursor: 'pointer',
                  boxShadow: '0 6px 18px rgba(49, 130, 246, 0.35)'
                }}
              >
                🚀 공식 천명 AI 플랫폼으로 무료 이동하기
              </button>

              <button
                type="button"
                onClick={() => {
                  const url = 'https://fortuneai.co.kr';
                  if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(url).then(() => {
                      alert('공식 사이트 주소(fortuneai.co.kr)가 복사되었습니다!');
                    }).catch(() => {
                      prompt('아래 주소를 복사하세요:', url);
                    });
                  } else {
                    prompt('아래 주소를 복사하세요:', url);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  background: '#f2f4f6',
                  color: '#4e5968',
                  fontSize: 13,
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: 12,
                  cursor: 'pointer'
                }}
              >
                🔗 공식 주소 복사하기 (fortuneai.co.kr)
              </button>
            </div>

            <div style={{ marginTop: 12 }}>
              <button
                type="button"
                onClick={() => setShowMigrationModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8b95a1',
                  fontSize: 12,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: 4
                }}
              >
                현재 화면 잠시 둘러보기
              </button>
            </div>
          </div>
        </div>
      )}

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
                toss 미니앱
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

        {/* QT Content View Tabs (QT / 기도) */}
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
            {/* Passage Header & Speech TTS Button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(49, 130, 246, 0.08)', padding: 12, borderRadius: 12 }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3182F6', marginBottom: 2 }}>
                  📖 오늘의 성경 본문
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#191F28' }}>
                  {sermonResult.passage}
                </div>
              </div>

              <button
                onClick={handleToggleSpeech}
                style={{
                  backgroundColor: isSpeaking ? '#191F28' : '#3182F6',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 12,
                  padding: '8px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                {isSpeaking ? '중지' : '음성 낭독'}
              </button>
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
        {sermonResult && activeTab === 'prayer' && prayerPoints && (
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
                  {prayerPoints.p1}
                </div>
              </div>

              <div style={{ backgroundColor: '#F2F4F6', padding: 14, borderRadius: 14, borderLeft: '4px solid #3182F6' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#191F28', marginBottom: 4 }}>
                  2. 굳건한 영적 분별력을 위한 기도
                </div>
                <div style={{ fontSize: '0.825rem', color: '#4E5968', lineHeight: 1.6 }}>
                  {prayerPoints.p2}
                </div>
              </div>

              <div style={{ backgroundColor: '#F2F4F6', padding: 14, borderRadius: 14, borderLeft: '4px solid #3182F6' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#191F28', marginBottom: 4 }}>
                  3. 빛과 소금의 삶을 살기 위한 기도
                </div>
                <div style={{ fontSize: '0.825rem', color: '#4E5968', lineHeight: 1.6 }}>
                  {prayerPoints.p3}
                </div>
              </div>
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
