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
  Flame
} from 'lucide-react';

interface NewsSermonViewProps {
  onSaveItem: (item: Omit<SavedJournalItem, 'id' | 'createdAt'>) => void;
}

export const NewsSermonView: React.FC<NewsSermonViewProps> = ({ onSaveItem }) => {
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
  const [refreshToast, setRefreshToast] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      SpeechService.stop();
    };
  }, []);

  const loadNews = async (isManualClick = false) => {
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
      if (isManualClick) {
        setRefreshToast(true);
        setTimeout(() => setRefreshToast(false), 3000);
      }
    } finally {
      setLoadingNews(false);
    }
  };

  useEffect(() => {
    loadNews(false);
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

  // Generate DeepSeek AI Full Pastor QT Script
  const handleGenerateFullNewsScript = async () => {
    if (!selectedNews || !sermonResult) return;
    SpeechService.stop();
    setIsSpeaking(false);
    setLoadingScript(true);

    try {
      const script = await DeepSeekService.generateFullPastorSermonScript({
        topic: selectedNews.category,
        passage: sermonResult.passage,
        newsTitle: selectedNews.title,
        newsDescription: selectedNews.description
      });
      setFullScript(script);
    } finally {
      setLoadingScript(false);
    }
  };

  // TTS Speech Control
  const handleToggleSpeech = () => {
    if (isSpeaking) {
      SpeechService.stop();
      setIsSpeaking(false);
    } else {
      let textToRead = fullScript;
      if (!textToRead && sermonResult) {
        textToRead = `${sermonResult.title}. 본문 ${sermonResult.passage}. 오늘 뉴스 핵심. ${sermonResult.hook}. 말씀 묵상. ${sermonResult.exegesis}. ${sermonResult.point1.title}. ${sermonResult.point1.body}. ${sermonResult.point2.title}. ${sermonResult.point2.body}. ${sermonResult.point3.title}. ${sermonResult.point3.body}. 결론. ${sermonResult.conclusion}`;
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

  const handleSave = () => {
    if (!sermonResult || !selectedNews) return;
    onSaveItem({
      title: sermonResult.title,
      type: 'sermon',
      passage: sermonResult.passage,
      content: fullScript
        ? fullScript
        : `[연관 시사 뉴스]: ${selectedNews.title} (${selectedNews.source})\n\n[서론]: ${sermonResult.hook}\n\n[말씀 묵상]: ${sermonResult.exegesis}\n\n[묵상 1]: ${sermonResult.point1.title}\n${sermonResult.point1.body}\n\n[묵상 2]: ${sermonResult.point2.title}\n${sermonResult.point2.body}\n\n[묵상 3]: ${sermonResult.point3.title}\n${sermonResult.point3.body}\n\n[결론]: ${sermonResult.conclusion}`
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCopyForShare = () => {
    if (!sermonResult || !selectedNews) return;
    const p1 = prayerPoints?.p1 || '이 뉴스 속 아파하는 세상을 위해';
    const p2 = prayerPoints?.p2 || '세상 불안 속 굳건한 내 신앙을 위해';
    const p3 = prayerPoints?.p3 || '사랑을 실천하는 크리스천 청지기가 되게 하소서';

    const shareText = `🕊️ [오늘의 시사 묵상(QT)]\n\n📰 뉴스: ${selectedNews.title}\n📖 성경 본문: ${sermonResult.passage}\n\n💡 묵상 한 줄: ${sermonResult.exegesis}\n\n🙏 오늘의 중보기도:\n1. ${p1}\n2. ${p2}\n3. ${p3}\n\n✨ 토스 인앱 '오늘의 시사 묵상(QT)'에서 읽기`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* Refresh Notification Toast */}
      {refreshToast && (
        <div className="animate-fade-in" style={{ background: 'var(--color-primary)', color: '#0f172a', padding: '10px 16px', borderRadius: 'var(--radius-md)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)' }}>
          <Sparkles size={18} /> 최신 시사 이슈 5건이 갱신되었습니다!
        </div>
      )}

      {/* App Header Banner for 오늘의 시사 묵상(QT) */}
      <div className="glass-panel" style={{ padding: 'var(--space-lg)', borderLeft: '4px solid var(--color-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)'
            }}>
              <BookOpen size={24} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.75rem', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>
                  🕊️ 토스 크리스천 미니앱
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>매일 아침 3분 QT</span>
              </div>
              <h2 className="serif-text gold-gradient-text" style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: 2 }}>
                오늘의 시사 묵상(QT)
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                "세상 소식은 뉴스에서, 신앙의 통찰은 말씀에서" — 시사 뉴스를 성경적 지혜와 기도문으로 풀어냅니다.
              </p>
            </div>
          </div>

          <button onClick={() => loadNews(true)} disabled={loadingNews} className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.85rem', minHeight: 38 }}>
            <RefreshCw size={16} className={loadingNews ? 'animate-spin' : ''} />
            {loadingNews ? '뉴스 가져오는 중...' : '🔄 시사 뉴스 새로고침'}
          </button>
        </div>
      </div>

      {/* RSS News Cards List */}
      <div className="glass-panel" style={{ padding: 'var(--space-lg)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Newspaper size={18} color="var(--color-primary)" /> 오늘의 주요 시사 이슈 (뉴스 선택 시 묵상 메세지 자동 생성)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
          {newsList.map((news) => {
            const isSelected = selectedNews?.id === news.id;
            return (
              <div
                key={news.id}
                onClick={() => {
                  setSelectedNews(news);
                  handleGenerateNewsQT(news);
                }}
                className="glass-panel animate-fade-in"
                style={{
                  padding: 'var(--space-md)',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  background: isSelected ? 'rgba(245, 158, 11, 0.08)' : 'var(--bg-secondary)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.7rem', background: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>
                    {news.category}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{news.source} • {news.pubDate}</span>
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 6, lineHeight: 1.4 }}>
                  {news.title}
                </h4>

                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-sub)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {news.description}
                </p>

                <div style={{ marginTop: 'var(--space-sm)', textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    이 뉴스로 말씀 묵상하기 <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QT Message & Speech Controls */}
      {sermonResult && selectedNews && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div className="glass-panel" style={{ padding: 'var(--space-xl)', borderTop: '4px solid var(--color-primary)' }}>
            
            {/* Action Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
              <div>
                <span style={{ fontSize: '0.75rem', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', padding: '3px 8px', borderRadius: 4, fontWeight: 600 }}>
                  📖 성경 본문: {sermonResult.passage}
                </span>
                <h3 className="serif-text gold-gradient-text" style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: 6 }}>
                  {sermonResult.title}
                </h3>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
                {/* TTS Speech Reading Button */}
                <button
                  onClick={handleToggleSpeech}
                  className={isSpeaking ? 'btn-primary animate-pulse-gold' : 'btn-secondary'}
                  style={{ padding: '6px 12px', fontSize: '0.85rem', background: isSpeaking ? 'var(--color-primary)' : undefined, color: isSpeaking ? '#0f172a' : undefined }}
                >
                  {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  {isSpeaking ? '⏹️ 낭독 중지' : '🔊 묵상 글 낭독(TTS)'}
                </button>

                <button onClick={handleGenerateFullNewsScript} disabled={loadingScript} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                  {loadingScript ? <Sparkles className="animate-spin" size={14} /> : <Mic size={14} />}
                  {loadingScript ? '묵상본 작성 중...' : '🎙️ 목회자 풀 묵상본 생성 (AI)'}
                </button>

                <button onClick={handleCopyForShare} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                  {copied ? <CheckCircle2 size={16} color="var(--color-success)" /> : <Share2 size={16} />}
                  {copied ? '복사 완료!' : '성도 공유하기'}
                </button>

                <button onClick={handleSave} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                  {saved ? <Check size={16} color="var(--color-success)" /> : <Bookmark size={16} />}
                  {saved ? '저장됨' : '저널 저장'}
                </button>
              </div>
            </div>

            {/* Selected News Context Card */}
            <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#3b82f6', marginBottom: 2 }}>
                📰 연관 시사 이슈: {selectedNews.title} ({selectedNews.source})
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-sub)' }}>
                {selectedNews.description}
              </p>
            </div>

            {/* Full QT Script Output */}
            {fullScript ? (
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--color-primary)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Flame size={18} /> LOGOS AI가 작성한 [오늘의 시사 묵상] 풀 텍스트
                  </div>
                  {isSpeaking && (
                    <span style={{ fontSize: '0.75rem', background: 'var(--color-primary)', color: '#0f172a', padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>
                      🔊 음성 낭독 중...
                    </span>
                  )}
                </div>
                <div style={{ whiteSpace: 'pre-line', fontSize: '0.95rem', color: 'var(--color-text-main)', lineHeight: 1.8, maxHeight: 550, overflowY: 'auto', paddingRight: 6 }} className="serif-text">
                  {fullScript}
                </div>
              </div>
            ) : (
              /* Sermon Outline / QT Overview */
              <>
                <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 4 }}>
                    💡 서론 (시사 이슈 속 영적 고뇌)
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-sub)', lineHeight: 1.6 }}>
                    {sermonResult.hook}
                  </p>
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)', borderLeft: '3px solid #3b82f6' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#3b82f6', marginBottom: 4 }}>
                    📖 매칭 성경 본문 묵상
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-sub)', lineHeight: 1.6 }}>
                    {sermonResult.exegesis}
                  </p>
                </div>

                {/* 3 Main QT Points */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                    ✨ 오늘의 3대 묵상 포인트
                  </h4>

                  <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 4 }}>
                      {sermonResult.point1.title}
                    </h5>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-sub)', lineHeight: 1.6 }}>
                      {sermonResult.point1.body}
                    </p>
                  </div>

                  <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 4 }}>
                      {sermonResult.point2.title}
                    </h5>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-sub)', lineHeight: 1.6 }}>
                      {sermonResult.point2.body}
                    </p>
                  </div>

                  <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 4 }}>
                      {sermonResult.point3.title}
                    </h5>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-sub)', lineHeight: 1.6 }}>
                      {sermonResult.point3.body}
                    </p>
                  </div>
                </div>

                {/* 3 Intercession Prayer Points Section */}
                {prayerPoints && (
                  <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#3b82f6', marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <HeartHandshake size={20} /> 🙏 오늘 세상을 위한 3가지 중보기도
                    </h4>
                    <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.875rem', color: 'var(--color-text-main)', lineHeight: 1.8 }}>
                      <li style={{ marginBottom: 4 }}>
                        <strong>시사 현장의 아픔을 보살피는 기도:</strong> {prayerPoints.p1}
                      </li>
                      <li style={{ marginBottom: 4 }}>
                        <strong>굳건한 영적 분별력을 위한 기도:</strong> {prayerPoints.p2}
                      </li>
                      <li>
                        <strong>빛과 소금의 삶을 살기 위한 기도:</strong> {prayerPoints.p3}
                      </li>
                    </ul>
                  </div>
                )}

                {/* Conclusion Card */}
                <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
                  <h4 className="serif-text" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 4 }}>
                    🕊️ 결론 및 오늘의 은혜 소망
                  </h4>
                  <p className="serif-text" style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', lineHeight: 1.7 }}>
                    {sermonResult.conclusion}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
