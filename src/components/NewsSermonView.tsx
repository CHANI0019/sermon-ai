import React, { useState, useEffect } from 'react';
import { NewsRssService, NewsItem } from '../services/newsRssService';
import { SavedJournalItem, SermonResult } from '../types';
import { DeepSeekService } from '../services/deepseekService';
import { SpeechService } from '../services/speechService';
import { Newspaper, Sparkles, Bookmark, Check, RefreshCw, Layers, ArrowRight, Mic, FileText, Bell, Volume2, VolumeX } from 'lucide-react';

interface NewsSermonViewProps {
  onSaveItem: (item: Omit<SavedJournalItem, 'id' | 'createdAt'>) => void;
}

export const NewsSermonView: React.FC<NewsSermonViewProps> = ({ onSaveItem }) => {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [loadingNews, setLoadingNews] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [sermonResult, setSermonResult] = useState<SermonResult | null>(null);
  const [fullScript, setFullScript] = useState<string | null>(null);
  const [loadingScript, setLoadingScript] = useState(false);
  const [saved, setSaved] = useState(false);
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
        handleGenerateNewsSermon(data[0]);
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

  const handleGenerateNewsSermon = async (news: NewsItem) => {
    SpeechService.stop();
    setIsSpeaking(false);
    setGenerating(true);
    setSaved(false);
    setFullScript(null);

    try {
      await new Promise((res) => setTimeout(res, 400));

      let matchedPassage = '마태복음 6:25-34';
      let exegesisText = '세속적 염려와 불안을 넘어 공중의 새를 기르시는 하나님의 주권적 섭리를 가리킵니다.';

      if (news.category === 'IT/AI') {
        matchedPassage = '창세기 1:28 / 에베소서 5:15-17';
        exegesisText = '기술이 인간의 고유성을 위협하는 시대 속에서, 참된 지혜는 하나님이 주신 문화 대명령과 세월을 아끼는 영적 분별력에 있습니다.';
      } else if (news.category === '경제/금융') {
        matchedPassage = '디모데전서 6:6-10 / 로마서 8:32';
        exegesisText = '재정적 흔들림 속에서 성도의 가치는 재물의 많고 적음이 아닌, 아들을 내어주신 하나님의 사랑에 매여 있음을 밝힙니다.';
      } else if (news.category === '사회/문화') {
        matchedPassage = '시편 142:1-5 / 히브리서 4:15-16';
        exegesisText = '디지털 연계 속 소외감 속에서, 우리 고통을 친히 담당하신 대제사장 예수님의 대속적 동행을 가리킵니다.';
      } else if (news.category === '세계/국제') {
        matchedPassage = '시편 24:1 / 로마서 8:19-22';
        exegesisText = '지구 환경 재난과 기후 위기 앞에서, 피조세계 전체를 다스리시는 하나님 주권과 성도의 청지기적 책임이 요구됩니다.';
      }

      setSermonResult({
        title: `[시사 설교] "${news.title.slice(0, 30)}..." 시대를 조명하는 성경적 지혜`,
        passage: matchedPassage,
        hook: `오늘 우리가 접한 주요 뉴스("${news.title}")는 현 시대를 살아가는 수많은 현대인들이 겪는 실제적 고뇌와 영적 불안을 그대로 보여줍니다. 기술의 격변과 사회적 변동 속에서 우리는 어디에 참된 소망을 두어야 합니까?`,
        exegesis: exegesisText,
        point1: {
          title: '대지 1. 관점의 전환: 세속 뉴스 뒤에 계신 하나님의 주권적 섭리 바라보기',
          body: '세상 뉴스는 조급함과 두려움을 유발하지만, 성경은 이 모든 역사 정황조차 삼위일체 하나님의 거룩한 구속사 안에서 주권적으로 통제되고 있음을 선포합니다.'
        },
        point2: {
          title: '대지 2. 정체성과 덕목: 세속 사조에 휩쓸리지 않는 거룩한 분별력',
          body: '세상이 불안과 타협할 때, 성도는 십자가 그리스도 안에서 얻은 영원한 정체성을 기억하며 거짓 우상(물질, 성공, 기술 맹신)을 배격하고 거룩한 절제를 지킵니다.'
        },
        point3: {
          title: '대지 3. 청지기 삶과 실천: 고통 받는 시사 현장을 향한 복음적 빛과 소금의 삶',
          body: '뉴스를 단순히 소비하는 데 머물지 않고, 불평등과 소외, 불안으로 고통받는 이웃들을 향해 구체적인 사랑과 기도, 공의를 실천하는 청지기로 살아갑니다.'
        },
        conclusion: `세상의 뉴스 기사는 변하고 무너지지만, 하나님의 영원한 말씀은 세세토록 서 있습니다. 십자가에서 모든 사망과 세속의 권세를 이기신 예수 그리스도의 소망 안에서 주님의 평안을 누리십시오.`
      });
    } finally {
      setGenerating(false);
    }
  };

  // Generate Project LOGOS AI Full Pastor Script for News
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
        textToRead = `${sermonResult.title}. 본문 ${sermonResult.passage}. 서론. ${sermonResult.hook}. 본문주해. ${sermonResult.exegesis}. ${sermonResult.point1.title}. ${sermonResult.point1.body}. ${sermonResult.point2.title}. ${sermonResult.point2.body}. ${sermonResult.point3.title}. ${sermonResult.point3.body}. 결론. ${sermonResult.conclusion}`;
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
      content: fullScript ? fullScript : `[연관 시사 뉴스]: ${selectedNews.title} (${selectedNews.source})\n\n[서론]: ${sermonResult.hook}\n\n[주해]: ${sermonResult.exegesis}\n\n[1대지]: ${sermonResult.point1.title}\n${sermonResult.point1.body}\n\n[2대지]: ${sermonResult.point2.title}\n${sermonResult.point2.body}\n\n[3대지]: ${sermonResult.point3.title}\n${sermonResult.point3.body}\n\n[결론]: ${sermonResult.conclusion}`
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* Toast notification on refresh */}
      {refreshToast && (
        <div className="animate-fade-in" style={{ background: 'var(--color-primary)', color: '#0f172a', padding: '10px 16px', borderRadius: 'var(--radius-md)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)' }}>
          <Bell size={18} /> 실시간 최신 시사 뉴스 5건이 새롭게 갱신되었습니다!
        </div>
      )}

      {/* Banner */}
      <div className="glass-panel" style={{ padding: 'var(--space-lg)', borderLeft: '4px solid var(--color-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <Newspaper size={24} color="var(--color-primary)" />
            <div>
              <h2 className="serif-text gold-gradient-text" style={{ fontSize: '1.4rem', fontWeight: 700 }}>
                📰 Project LOGOS AI 시사 뉴스 연계 강단 설교 대본 생성기
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                최신 시사 뉴스를 선택하면 Project LOGOS AI가 목사님이 강단에서 선포할 수 있는 실제 설교 대본 풀 텍스트와 음성 낭독을 제공합니다.
              </p>
            </div>
          </div>

          <button onClick={() => loadNews(true)} disabled={loadingNews} className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.85rem', minHeight: 38 }}>
            <RefreshCw size={16} className={loadingNews ? 'animate-spin' : ''} />
            {loadingNews ? '실시간 뉴스 가져오는 중...' : '🔄 실시간 뉴스 새로고침'}
          </button>
        </div>
      </div>

      {/* RSS News Cards List */}
      <div className="glass-panel" style={{ padding: 'var(--space-lg)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Newspaper size={18} color="var(--color-primary)" /> 실시간 시사 뉴스 브리핑 (클릭하여 설교 대본 생성)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
          {newsList.map((news) => {
            const isSelected = selectedNews?.id === news.id;
            return (
              <div
                key={news.id}
                onClick={() => {
                  setSelectedNews(news);
                  handleGenerateNewsSermon(news);
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
                    이 뉴스로 대본 작성하기 <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sermon Generation Output */}
      {sermonResult && selectedNews && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div className="glass-panel" style={{ padding: 'var(--space-xl)', borderTop: '4px solid var(--color-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
              <div>
                <span style={{ fontSize: '0.75rem', background: 'var(--color-accent-light)', color: 'var(--color-accent)', padding: '3px 8px', borderRadius: 4, fontWeight: 600 }}>
                  매칭 성경 본문: {sermonResult.passage}
                </span>
                <h3 className="serif-text gold-gradient-text" style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: 4 }}>
                  {sermonResult.title}
                </h3>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
                {/* 🔊 TTS Speech Reading Button */}
                <button
                  onClick={handleToggleSpeech}
                  className={isSpeaking ? 'btn-primary animate-pulse-gold' : 'btn-secondary'}
                  style={{ padding: '6px 12px', fontSize: '0.85rem', background: isSpeaking ? 'var(--color-primary)' : undefined, color: isSpeaking ? '#0f172a' : undefined }}
                >
                  {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  {isSpeaking ? '⏹️ 낭독 중지' : '🔊 설교 음성 낭독'}
                </button>

                <button onClick={handleGenerateFullNewsScript} disabled={loadingScript} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                  {loadingScript ? <Sparkles className="animate-spin" size={14} /> : <Mic size={14} />}
                  {loadingScript ? '대본 작성 중...' : '🎙️ 강단 선포용 풀 대본 생성 (AI 엔진)'}
                </button>

                <button onClick={handleSave} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                  {saved ? <Check size={16} color="var(--color-success)" /> : <Bookmark size={16} />}
                  {saved ? '저장됨' : '저널에 저장'}
                </button>
              </div>
            </div>

            {/* Selected News Context Box */}
            <div style={{ background: 'rgba(13, 148, 136, 0.1)', border: '1px solid var(--color-accent)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-accent)', marginBottom: 2 }}>
                📰 연관 시사 뉴스: {selectedNews.title} ({selectedNews.source})
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-sub)' }}>
                {selectedNews.description}
              </p>
            </div>

            {/* Full Script Output */}
            {fullScript ? (
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--color-primary)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Mic size={18} /> Project LOGOS AI가 생성한 목사님 시사 연계 강단 선포용 풀 텍스트 설교 대본
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
              /* Sermon Outline Preview */
              <>
                <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 4 }}>
                    🎙️ 서론 (Hook: 시사 이슈와 현대인의 영적 갈증)
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-sub)', lineHeight: 1.6 }}>
                    {sermonResult.hook}
                  </p>
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)', borderLeft: '3px solid var(--color-accent)' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-accent)', marginBottom: 4 }}>
                    🏛️ 매칭 성경 주해 (Exegetical Exposition)
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-sub)', lineHeight: 1.6 }}>
                    {sermonResult.exegesis}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Layers size={18} color="var(--color-primary)" /> 시사 조명 본론 3대지 (Three Practical Points)
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

                <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
                  <h4 className="serif-text" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 4 }}>
                    ✝️ 결론 및 안식의 소망 (Sabbath Rest & Hope)
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
