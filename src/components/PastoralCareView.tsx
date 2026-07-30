import React, { useState } from 'react';
import { PastoralCareResult } from '../types';
import { TheologyEngineService } from '../services/theologyEngine';
import { HeartHandshake, Send, Sparkles, Church, Scroll, HelpCircle } from 'lucide-react';

export const PastoralCareView: React.FC = () => {
  const [queryInput, setQueryInput] = useState('요즘 극심한 재정적 고난과 미래에 대한 불안함 때문에 기도조차 힘겹습니다.');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PastoralCareResult | null>(null);

  const handleCounsel = async () => {
    if (!queryInput.trim()) return;
    setLoading(true);
    try {
      const data = await TheologyEngineService.counselPastoral(queryInput);
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* Banner */}
      <div className="glass-panel" style={{ padding: 'var(--space-lg)', borderLeft: '4px solid var(--color-accent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-xs)' }}>
          <HeartHandshake size={24} color="var(--color-accent)" />
          <h2 className="serif-text" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
            개혁주의 목회 상담 & 영적 묵상 돌봄
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
          성도가 삶에서 겪는 시험과 아픔을 성경적 공감과 그리스도의 대속적 은혜로 조명하고 기도제목을 나눕니다.
        </p>
      </div>

      {/* Input */}
      <div className="glass-panel" style={{ padding: 'var(--space-lg)' }}>
        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 'var(--space-xs)' }}>
          나누고 싶으신 고난, 영적 고민 또는 기도제목을 적어주세요
        </label>
        <textarea
          rows={4}
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          placeholder="예: 질병으로 인한 고통 중 하나님의 주권을 신뢰하기 힘듭니다. 어떻게 기도해야 할까요?"
          style={{
            width: '100%',
            padding: '12px 16px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-main)',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            outline: 'none',
            resize: 'vertical',
            marginBottom: 'var(--space-md)'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={handleCounsel} disabled={loading} className="btn-primary" style={{ minWidth: 140 }}>
            {loading ? <Sparkles className="animate-spin" size={18} /> : <Send size={18} />}
            {loading ? '묵상 작성 중...' : '상담 묵상 요청'}
          </button>
        </div>
      </div>

      {/* Result Output */}
      {result && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {/* Empathetic Advice Card */}
          <div className="glass-panel" style={{ padding: 'var(--space-xl)', borderTop: '3px solid var(--color-accent)' }}>
            <h3 className="serif-text" style={{ fontSize: '1.25rem', color: 'var(--color-accent)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
              🤝 목회적 공감과 성경적 위로
            </h3>
            
            <p className="serif-text" style={{ fontSize: '1.05rem', color: 'var(--color-text-main)', lineHeight: 1.8, marginBottom: 'var(--space-lg)', whiteSpace: 'pre-line' }}>
              {result.empatheticCounsel}
            </p>

            {/* Scripture References */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Scroll size={18} /> 권면 성경 말씀
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-sm)' }}>
                {result.scriptureReferences.map((item: { reference: string; text: string }, idx: number) => (
                  <div key={idx} style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--color-primary)' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 4 }}>
                      {item.reference}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-sub)', fontStyle: 'italic', lineHeight: 1.5 }}>
                      "{item.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Prayer Points */}
            <div style={{ marginBottom: 'var(--space-lg)', background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <HelpCircle size={18} color="var(--color-primary)" /> 함께 드릴 기도제목
              </h4>
              <ul style={{ paddingLeft: '1.2rem', color: 'var(--color-text-sub)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                {result.prayerPoints.map((point: string, idx: number) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>

            {/* Critical AI Limitation Notice */}
            <div style={{ background: 'rgba(13, 148, 136, 0.12)', border: '1px dashed var(--color-accent)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start' }}>
              <Church size={24} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <h5 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-accent)', marginBottom: 4 }}>
                  성도님께 드리는 필수 안내 (Distinction of Nature)
                </h5>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-sub)', lineHeight: 1.6 }}>
                  {result.aiLimitationNotice}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
