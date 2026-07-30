import React, { useState, useEffect } from 'react';
import { SermonResult, SavedJournalItem } from '../types';
import { DeepSeekService } from '../services/deepseekService';
import { SpeechService } from '../services/speechService';
import { BookOpen, Sparkles, Bookmark, Check, Compass, Layers, Mic, FileText, Volume2, VolumeX } from 'lucide-react';

interface SermonGeneratorViewProps {
  onSaveItem: (item: Omit<SavedJournalItem, 'id' | 'createdAt'>) => void;
}

export const SermonGeneratorView: React.FC<SermonGeneratorViewProps> = ({ onSaveItem }) => {
  const [topicKeyword, setTopicKeyword] = useState('불확실성과 인공지능 시대');
  const [passageInput, setPassageInput] = useState('마태복음 6:25-34');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SermonResult | null>(null);
  const [fullScript, setFullScript] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loadingScript, setLoadingScript] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Stop speech synthesis when unmounting component
  useEffect(() => {
    return () => {
      SpeechService.stop();
    };
  }, []);

  const handleGenerateSermon = async () => {
    SpeechService.stop();
    setIsSpeaking(false);
    setLoading(true);
    setSaved(false);
    setFullScript(null);

    try {
      await new Promise((res) => setTimeout(res, 600));

      setResult({
        title: `불안과 통제의 시대, 지혜로운 성도로 사는 법`,
        passage: passageInput || '마태복음 6:25-34',
        hook: `우리는 인공지능과 첨단 기술이 발전하는 문명의 정점에 살고 있지만, 역설적이게도 그 어느 때보다 '불확실성과 내일에 대한 불안' 속에서 살아갑니다. 모든 상황을 데이터와 예측으로 통제하려 하지만, 영혼의 갈증과 소진(Burnout)만을 경험합니다.`,
        exegesis: `마태복음 6:25의 '염려하다(μεριμνάω)'는 마음이 여러 조각으로 산산이 갈라지는 상태를 뜻합니다. 주님께서는 공중의 새와 들의 백합화를 기르시는 하나님 아버지의 주권적 섭리를 바라보며, 세속적 통제의 욕망을 내려놓고 '하나님의 나라와 의'를 구하도록 가르치십니다.`,
        point1: {
          title: '대지 1. 관점의 전환: 세속적 통제에서 주권적 섭리로',
          body: '내가 모든 것을 제어하려는 통제 우상을 내려놓을 때, 만물을 지혜롭게 다스리시는 삼위일체 하나님이 나의 아버지가 되심을 깨닫게 됩니다. 고난조차 성화의 선으로 인도하십니다.'
        },
        point2: {
          title: '대지 2. 정체성과 덕목: 세속의 조급함에 맞서는 거룩한 절제',
          body: '세상 사람들은 미래를 알 수 없어 재물과 권력을 모으지만, 성도는 이미 얻은 하나님 자녀의 신분 안에서 담대함을 누립니다. 내일의 염려 대신 오늘 분량의 은혜를 경배합니다.'
        },
        point3: {
          title: '대지 3. 청지기 삶과 실천: 일상에서의 하나님 중심 라이프스타일',
          body: '나의 소유와 경력, 시간은 내 것이 아닌 하나님이 맡기신 선물입니다. 한 날의 괴로움에 매이지 않고, 오늘 지체들과 함께 은혜를 나누는 구체적 사랑을 실천합니다.'
        },
        conclusion: `예수 그리스도께서는 십자가에서 인류의 가장 극심한 수치와 죽음이라는 불확실성을 친히 짊어지시고 부활하심으로 승리하셨습니다. 통제하려는 조급함을 내려놓고 참된 안식(Sabbath Rest)이 되시는 그리스도 안에서 담대히 걸어가십시오.`
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
    try {
      const script = await DeepSeekService.generateFullPastorSermonScript({
        topic: topicKeyword,
        passage: passageInput
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
          목사님이 강단에서 그대로 선포하고 낭독하실 수 있는 정통 개혁주의 풀 텍스트 설교 대본과 음성 낭독 기능을 제공합니다.
        </p>
      </div>

      {/* Input Form */}
      <div className="glass-panel" style={{ padding: 'var(--space-lg)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 6 }}>
              시대적 주제 키워드 (Topic Keyword)
            </label>
            <input
              type="text"
              value={topicKeyword}
              onChange={(e) => setTopicKeyword(e.target.value)}
              placeholder="예: 불확실성과 인공지능 시대, 경력 실패 극복"
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

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 6 }}>
              성경 본문 (Scripture Passage)
            </label>
            <input
              type="text"
              value={passageInput}
              onChange={(e) => setPassageInput(e.target.value)}
              placeholder="예: 마태복음 6:25-34, 에베소서 5:15-17"
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

        <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button onClick={handleGenerateSermon} disabled={loading} className="btn-secondary" style={{ minWidth: 150 }}>
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
