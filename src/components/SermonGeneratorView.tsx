import React, { useState, useEffect, useMemo } from 'react';
import { SermonResult, SavedJournalItem } from '../types';
import { DeepSeekService } from '../services/deepseekService';
import { SpeechService } from '../services/speechService';
import { recommendScriptures, ScriptureRecommendation } from '../services/logosDatabase';
import { NewsRssService, TrendingTopicItem } from '../services/newsRssService';
import { BookOpen, Sparkles, Bookmark, Check, Compass, Layers, Mic, FileText, Volume2, VolumeX, Search, Wand2, Flame, RefreshCw, ArrowRight } from 'lucide-react';

interface SermonGeneratorViewProps {
  onSaveItem: (item: Omit<SavedJournalItem, 'id' | 'createdAt'>) => void;
}

export const SermonGeneratorView: React.FC<SermonGeneratorViewProps> = ({ onSaveItem }) => {
  const [topicKeyword, setTopicKeyword] = useState('불확실성과 인공지능 시대');
  const [passageInput, setPassageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SermonResult | null>(null);
  const [fullScript, setFullScript] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loadingScript, setLoadingScript] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Live News Trending Topics State
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopicItem[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);

  // Load trending topics from recent news RSS
  const loadTrendingTopics = async () => {
    setLoadingTopics(true);
    try {
      const topics = await NewsRssService.extractTrendingTopicKeywords();
      setTrendingTopics(topics);
      if (topics.length > 0 && (!topicKeyword || topicKeyword === '불확실성과 인공지능 시대')) {
        setTopicKeyword(topics[0].keyword);
      }
    } finally {
      setLoadingTopics(false);
    }
  };

  useEffect(() => {
    loadTrendingTopics();
  }, []);

  // Real-time AI scripture recommendations derived from topic keyword
  const recommendations: ScriptureRecommendation[] = useMemo(() => {
    return recommendScriptures(topicKeyword);
  }, [topicKeyword]);

  // Active target passage (User input or top AI recommendation)
  const activePassage = passageInput.trim() || (recommendations.length > 0 ? recommendations[0].passage : '마태복음 6:25-34');

  // Stop speech synthesis when unmounting component
  useEffect(() => {
    return () => {
      SpeechService.stop();
    };
  }, []);

  // 1-Click AI Auto Match Scripture Passage
  const handleAutoSelectScripture = () => {
    if (recommendations.length > 0) {
      setPassageInput(recommendations[0].passage);
    }
  };

  // Handle clicking a trending news topic chip
  const handleSelectTrendingTopic = (topic: TrendingTopicItem) => {
    setTopicKeyword(topic.keyword);
    // Clear custom passage to trigger fresh AI scripture recommendation
    setPassageInput('');
  };

  const handleGenerateSermon = async (customPassage?: string) => {
    SpeechService.stop();
    setIsSpeaking(false);
    setLoading(true);
    setSaved(false);
    setFullScript(null);

    const targetPassage = customPassage || passageInput.trim() || (recommendations.length > 0 ? recommendations[0].passage : '마태복음 6:25-34');
    
    // Automatically reflect selected passage to input state if it was empty
    if (!passageInput.trim()) {
      setPassageInput(targetPassage);
    }

    try {
      await new Promise((res) => setTimeout(res, 600));

      const matchedRec = recommendations.find((r) => r.passage === targetPassage) || recommendations[0];

      setResult({
        title: `[${topicKeyword}] 시대속의 복음: ${matchedRec?.theme || '주권적 섭리와 영적 지혜'}`,
        passage: targetPassage,
        hook: `우리는 최근 시사 뉴스에서 뜨겁게 회자되는 "${topicKeyword}"라는 급변하는 시대적 요청과 불확실성의 한복판에 살아가고 있습니다. 세속의 문화와 데이터가 답을 제시하는 듯 보이지만, 인간 영혼의 깊은 불안과 영적 갈증은 오직 생명의 하나님 말씀 안에서만 선명한 대답을 찾습니다.`,
        exegesis: `${targetPassage} 본문은 ${matchedRec?.reasoning || '성도의 불안과 삶의 정황을 삼위일체 하나님의 주권적 섭리와 십자가 구속사적 은혜 안에서 조명합니다.'}`,
        point1: {
          title: `대지 1. 관점의 전환: 세속적 염려에서 하나님의 주권적 섭리로`,
          body: `내가 삶을 제어하려는 통제의 욕망을 내려놓고, 만물을 지혜롭게 다스리시는 삼위일체 하나님이 나의 아버지가 되심을 고백합니다.`
        },
        point2: {
          title: `대지 2. 거룩한 정체성: 세속 조급함에 맞서는 그리스도의 소망`,
          body: `세상은 미래를 알 수 없어 불안해하지만, 성도는 십자가 보혈 안에서 이미 얻은 하나님 자녀의 영원한 신분 안에서 담대함과 거룩한 절제를 지킵니다.`
        },
        point3: {
          title: `대지 3. 청지기 삶과 실천: 일상에서의 하나님 중심 라이프스타일`,
          body: `나의 소유와 경력, 시간은 내 것이 아닌 하나님이 맡기신 선물입니다. 한 날의 괴로움에 매이지 않고, 오늘 지체들과 함께 은혜를 나누는 구체적 사랑을 실천합니다.`
        },
        conclusion: `예수 그리스도께서는 십자가에서 인류의 가장 극심한 수치와 죽음이라는 불확실성을 친히 짊어지시고 부활하심으로 승리하셨습니다. 세속의 조급함을 내려놓고 참된 안식(Sabbath Rest)이 되시는 그리스도 안에서 담대히 걸어가십시오.`
      });
    } finally {
      setLoading(false);
    }
  };

  // Project LOGOS AI 풀 텍스트 설교 대본 생성
  const handleGenerateFullScript = async () => {
    SpeechService.stop();
    setIsSpeaking(false);
    setLoadingScript(true);
    
    const targetPassage = passageInput.trim() || (recommendations.length > 0 ? recommendations[0].passage : '마태복음 6:25-34');
    if (!passageInput.trim()) {
      setPassageInput(targetPassage);
    }

    try {
      const script = await DeepSeekService.generateFullPastorSermonScript({
        topic: topicKeyword,
        passage: targetPassage
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
      if (!textToRead && result) {
        textToRead = `${result.title}. 본문 ${result.passage}. 서론. ${result.hook}. 본문주해. ${result.exegesis}. ${result.point1.title}. ${result.point1.body}. ${result.point2.title}. ${result.point2.body}. ${result.point3.title}. ${result.point3.body}. 결론. ${result.conclusion}`;
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
    if (!result) return;
    onSaveItem({
      title: result.title,
      type: 'sermon',
      passage: result.passage,
      content: fullScript ? fullScript : `[주제]: ${topicKeyword}\n\n[서론]: ${result.hook}\n\n[주해]: ${result.exegesis}\n\n[1대지]: ${result.point1.title}\n${result.point1.body}\n\n[2대지]: ${result.point2.title}\n${result.point2.body}\n\n[3대지]: ${result.point3.title}\n${result.point3.body}\n\n[결론]: ${result.conclusion}`
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* Banner */}
      <div className="glass-panel" style={{ padding: 'var(--space-lg)', borderLeft: '4px solid var(--color-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-xs)' }}>
          <BookOpen size={24} color="var(--color-primary)" />
          <h2 className="serif-text gold-gradient-text" style={{ fontSize: '1.4rem', fontWeight: 700 }}>
            📖 LOGOS AI: 목회자 강단 선포용 설교 생성기
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
          최근 시사 뉴스에서 회자되는 **실시간 트렌드 키워드를 자동 추출**하고, 성경 66권 중 가장 부합하는 본문 구절을 **100% 자동 매칭**합니다.
        </p>
      </div>

      {/* Input Form */}
      <div className="glass-panel" style={{ padding: 'var(--space-lg)' }}>
        {/* Hot News Trending Topic Auto Extraction Section */}
        <div style={{ background: 'rgba(225, 29, 72, 0.06)', border: '1px solid rgba(225, 29, 72, 0.25)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 6 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f43f5e', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Flame size={16} /> 🔥 [최근 며칠간 시사 뉴스 회자 이슈] AI 시사 키워드 자동 추출 (클릭 시 1초 매칭):
            </div>
            <button
              onClick={loadTrendingTopics}
              disabled={loadingTopics}
              style={{
                background: 'none',
                border: 'none',
                color: '#f43f5e',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <RefreshCw size={13} className={loadingTopics ? 'animate-spin' : ''} />
              {loadingTopics ? '실시간 뉴스 분석 중...' : '🔄 실시간 이슈 새로고침'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
            {trendingTopics.map((topic) => {
              const isSelected = topicKeyword === topic.keyword;
              return (
                <button
                  key={topic.id}
                  onClick={() => handleSelectTrendingTopic(topic)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 20,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: isSelected ? '2px solid #f43f5e' : '1px solid var(--color-border)',
                    background: isSelected ? '#f43f5e' : 'var(--bg-secondary)',
                    color: isSelected ? '#ffffff' : 'var(--color-text-main)',
                    transition: 'all 0.2s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: isSelected ? '0 0 10px rgba(244, 63, 94, 0.4)' : 'none'
                  }}
                  title={topic.summary}
                >
                  <span style={{ opacity: 0.8, fontSize: '0.7rem', padding: '1px 5px', background: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--color-primary-light)', color: isSelected ? '#ffffff' : 'var(--color-primary)', borderRadius: 3 }}>
                    {topic.category}
                  </span>
                  {topic.keyword.length > 25 ? `${topic.keyword.slice(0, 25)}...` : topic.keyword}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 6 }}>
              시대적 주제 키워드 (Topic Keyword) <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>*뉴스 자동 추출</span>
            </label>
            <input
              type="text"
              value={topicKeyword}
              onChange={(e) => setTopicKeyword(e.target.value)}
              placeholder="위의 실시간 뉴스 키워드를 클릭하거나 직접 입력하세요"
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--color-primary)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-main)',
                fontSize: '0.95rem',
                outline: 'none',
                boxShadow: '0 0 8px rgba(245, 158, 11, 0.15)'
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                성경 본문 (Scripture Passage) <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 500 }}>(미입력 시 AI 자동 탐색)</span>
              </label>
              <button
                type="button"
                onClick={handleAutoSelectScripture}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <Wand2 size={13} /> AI 본문 자동 채우기
              </button>
            </div>
            <input
              type="text"
              value={passageInput}
              onChange={(e) => setPassageInput(e.target.value)}
              placeholder={`미입력 시 AI가 자동 매칭 ("${recommendations[0]?.passage || '마태복음 6:25-34'}")`}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-main)',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* AI Scripture Recommendation Chips */}
        <div style={{ background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Search size={14} /> AI 키워드 분석 성경 본문 추천 (클릭하면 바로 적용됩니다):
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
            {recommendations.map((rec, idx) => {
              const isSelected = passageInput.trim() === rec.passage || (!passageInput.trim() && idx === 0);
              return (
                <button
                  key={rec.passage}
                  onClick={() => setPassageInput(rec.passage)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 20,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    background: isSelected ? 'var(--color-primary)' : 'var(--bg-secondary)',
                    color: isSelected ? '#0f172a' : 'var(--color-text-main)',
                    transition: 'all 0.2s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                  title={rec.reasoning}
                >
                  {isSelected ? '✓ ' : ''}{rec.passage} <span style={{ opacity: 0.8, fontSize: '0.75rem' }}>({rec.theme})</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button onClick={() => handleGenerateSermon()} disabled={loading} className="btn-secondary" style={{ minWidth: 150 }}>
            {loading ? <Sparkles className="animate-spin" size={18} /> : <Compass size={18} />}
            {loading ? '개요 구상 중...' : '3대지 개요 생성'}
          </button>

          <button onClick={async () => { await handleGenerateSermon(); await handleGenerateFullScript(); }} disabled={loadingScript} className="btn-primary" style={{ minWidth: 200 }}>
            {loadingScript ? <Sparkles className="animate-spin" size={18} /> : <Mic size={18} />}
            {loadingScript ? 'AI 대본 작성 중...' : '🎙️ 강단 선포용 풀 대본 생성 (AI 엔진)'}
          </button>
        </div>
      </div>


      {/* Output Results */}
      {result && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div className="glass-panel" style={{ padding: 'var(--space-xl)', borderTop: '4px solid var(--color-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
              <div>
                <span style={{ fontSize: '0.75rem', background: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '3px 8px', borderRadius: 4, fontWeight: 600 }}>
                  {result.passage}
                </span>
                <h3 className="serif-text gold-gradient-text" style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: 4 }}>
                  {result.title}
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

                <button onClick={handleGenerateFullScript} disabled={loadingScript} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                  {loadingScript ? <Sparkles className="animate-spin" size={14} /> : <FileText size={14} />}
                  {loadingScript ? '대본 연동 중...' : '🎙️ 강단 대본 풀 텍스트 생성'}
                </button>

                <button onClick={handleSave} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                  {saved ? <Check size={16} color="var(--color-success)" /> : <Bookmark size={16} />}
                  {saved ? '저장됨' : '저널에 저장'}
                </button>
              </div>
            </div>

            {/* Full Script Generated Display */}
            {fullScript ? (
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--color-primary)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Mic size={18} /> Project LOGOS AI가 생성한 목사님 강단 선포용 풀 텍스트 대본 (Full Sermon Script)
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
              /* Outline Preview */
              <>
                <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 4 }}>
                    🎙️ 서론 (Hook & Context)
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-sub)', lineHeight: 1.6 }}>
                    {result.hook}
                  </p>
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)', borderLeft: '3px solid var(--color-accent)' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-accent)', marginBottom: 4 }}>
                    🏛️ 원어 주해 (Exegetical Exposition)
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-sub)', lineHeight: 1.6 }}>
                    {result.exegesis}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Layers size={18} color="var(--color-primary)" /> 본론 3대지 (Three Practical Points)
                  </h4>

                  <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 4 }}>
                      {result.point1.title}
                    </h5>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-sub)', lineHeight: 1.6 }}>
                      {result.point1.body}
                    </p>
                  </div>

                  <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 4 }}>
                      {result.point2.title}
                    </h5>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-sub)', lineHeight: 1.6 }}>
                      {result.point2.body}
                    </p>
                  </div>

                  <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 4 }}>
                      {result.point3.title}
                    </h5>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-sub)', lineHeight: 1.6 }}>
                      {result.point3.body}
                    </p>
                  </div>
                </div>

                <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
                  <h4 className="serif-text" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 4 }}>
                    ✝️ 결론 및 안식의 소망 (Sabbath Rest & Hope)
                  </h4>
                  <p className="serif-text" style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', lineHeight: 1.7 }}>
                    {result.conclusion}
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
