import React, { useState } from 'react';
import { ScriptureExegesisResult } from '../types';
import { TheologyEngineService } from '../services/theologyEngine';
import { BIBLE_66_BOOKS } from '../services/bible66Database';
import { BookOpen, Search, AlertTriangle, Cross, Sparkles, CheckCircle2, BookMarked } from 'lucide-react';

export const ExegesisView: React.FC = () => {
  const [passageInput, setPassageInput] = useState('창세기');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScriptureExegesisResult | null>(null);

  const handleExegesis = async (passage: string) => {
    setLoading(true);
    try {
      const data = await TheologyEngineService.analyzeScripture(passage);
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (p: string) => {
    setPassageInput(p);
    handleExegesis(p);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* Exegesis Header Banner */}
      <div className="glass-panel" style={{ padding: 'var(--space-lg)', borderLeft: '4px solid var(--color-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-xs)' }}>
          <Cross size={24} color="var(--color-primary)" />
          <h2 className="serif-text gold-gradient-text" style={{ fontSize: '1.4rem', fontWeight: 700 }}>
            📖 성경 66권 구속사적 주해 & 그리스도 중심 연구
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
          성경 66권(구약 39권, 신약 27권) 전권의 역사적 맥락과 히브리어/헬라어 원어적 의미를 예수 그리스도의 십자가 대속 은혜로 주해합니다.
        </p>
      </div>

      {/* Input Section */}
      <div className="glass-panel" style={{ padding: 'var(--space-lg)' }}>
        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 'var(--space-xs)' }}>
          성경 66권 중 연구할 책 이름 또는 구절 입력
        </label>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', marginBottom: 'var(--space-md)' }}>
          <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
            <input
              type="text"
              value={passageInput}
              onChange={(e) => setPassageInput(e.target.value)}
              placeholder="예: 창세기, 이사야, 로마서, 요한계시록 또는 창세기 22:1-14"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-main)',
                fontSize: '1rem',
                outline: 'none'
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleExegesis(passageInput)}
            />
          </div>
          <button
            onClick={() => handleExegesis(passageInput)}
            disabled={loading}
            className="btn-primary"
            style={{ minWidth: 130 }}
          >
            {loading ? <Sparkles className="animate-spin" size={18} /> : <Search size={18} />}
            {loading ? '66권 주해 중...' : '66권 주해 요청'}
          </button>
        </div>

        {/* Bible 66 Books Category Quick Selector */}
        <div style={{ marginTop: 'var(--space-md)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
            <BookMarked size={14} color="var(--color-primary)" /> 성경 66권 바로 선택 탐색:
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap', maxHeight: 120, overflowY: 'auto', paddingRight: 4 }}>
            {BIBLE_66_BOOKS.map((book) => (
              <button
                key={book.id}
                onClick={() => handleQuickSelect(book.name)}
                className="btn-secondary"
                style={{ padding: '3px 8px', fontSize: '0.75rem', minHeight: 28, borderRadius: 'var(--radius-pill)', border: passageInput === book.name ? '1px solid var(--color-primary)' : undefined }}
              >
                {book.name} ({book.testament === 'OT' ? '구' : '신'})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Display */}
      {result && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {/* Main Card */}
          <div className="glass-panel" style={{ padding: 'var(--space-xl)', borderTop: '4px solid var(--color-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
              <h3 className="serif-text" style={{ fontSize: '1.3rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                📖 [{result.passage}] 구속사적 주해 및 그리스도 중심 조명
              </h3>
              <span style={{ fontSize: '0.75rem', background: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '3px 10px', borderRadius: 'var(--radius-pill)', fontWeight: 600 }}>
                성경 66권 RAG 주해
              </span>
            </div>

            {/* Grid Insights */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
              <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 6 }}>
                  🏛️ 성경책 개요 및 역사적 맥락 (Historical Context)
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-sub)', lineHeight: 1.6 }}>
                  {result.historicalContext}
                </p>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-accent)', marginBottom: 6 }}>
                  🔤 성경 원어 및 핵심 교리 키워드 (Language & Doctrine)
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-sub)', lineHeight: 1.6 }}>
                  {result.originalLanguageInsights}
                </p>
              </div>
            </div>

            {/* Redemptive Historical Link (Christ-Centered) */}
            <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)' }}>
              <h4 className="serif-text" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={20} /> 구속사적 그리스도 중심 조명 (Christ-Centered Focus)
              </h4>
              <p className="serif-text" style={{ fontSize: '1rem', color: 'var(--color-text-main)', lineHeight: 1.7 }}>
                {result.redemptiveHistoricalLink}
              </p>
            </div>

            {/* Pastoral Application */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={18} color="var(--color-success)" /> 대표 요절 및 목회적 적용 (Pastoral Application)
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-sub)', lineHeight: 1.6 }}>
                {result.pastoralApplication}
              </p>
            </div>

            {/* Warning Proof-texting Note */}
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--space-md)' }}>
              <AlertTriangle size={22} color="var(--color-danger)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <h5 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-danger)', marginBottom: 4 }}>
                  ⚠️ 자의적 단권 인용(Proof-texting) 및 세속주의 주의점
                </h5>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  {result.warningsOrProoftextingNotes}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
