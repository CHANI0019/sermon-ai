import React, { useState } from 'react';
import { GuardrailCheckResult } from '../types';
import { TheologyEngineService } from '../services/theologyEngine';
import { ShieldCheck, AlertOctagon, CheckCircle, Sparkles, Bookmark } from 'lucide-react';

export const GuardrailsView: React.FC = () => {
  const [testInput, setTestInput] = useState('열심히 헌금하고 기도하면 하나님이 무조건 세상에서 큰 부자가 되게 해주실까요?');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GuardrailCheckResult | null>(null);

  const handleCheck = async (inputVal: string) => {
    setLoading(true);
    try {
      const data = await TheologyEngineService.verifyGuardrails(inputVal);
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* Banner */}
      <div className="glass-panel" style={{ padding: 'var(--space-lg)', borderLeft: '4px solid var(--color-danger)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-xs)' }}>
          <ShieldCheck size={24} color="var(--color-danger)" />
          <h2 className="serif-text" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
            정통 신학 검증기 & 이단/기복주의 가이드라인
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
          번영신학(Prosperity Gospel), 숙명론(Fatalism), 역사적 이단 교리를 성경적 교리로 교정하고 바른 개혁주의 복음 진리를 보호합니다.
        </p>
      </div>

      {/* Input */}
      <div className="glass-panel" style={{ padding: 'var(--space-lg)' }}>
        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 'var(--space-xs)' }}>
          신학적 의문 또는 주장을 검증해 보세요
        </label>
        <textarea
          rows={3}
          value={testInput}
          onChange={(e) => setTestInput(e.target.value)}
          placeholder="예: 사주나 팔자도 하나님의 작정에 포함되나요? / 헌금을 많이 하면 병이 무조건 낫나요?"
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

        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['번영신학 검증', '사주/숙명론 검증', '아리우스주의 검증'].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const val = idx === 0 ? '기도하고 헌금하면 세속적 부자가 무조건 되나요?' : idx === 1 ? '사람의 운명은 사주팔자로 결정되어 있나요?' : '예수님도 창조된 최고 피조물인가요?';
                  setTestInput(val);
                  handleCheck(val);
                }}
                className="btn-secondary"
                style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: 'var(--radius-pill)' }}
              >
                {preset}
              </button>
            ))}
          </div>

          <button onClick={() => handleCheck(testInput)} disabled={loading} className="btn-primary" style={{ minWidth: 130 }}>
            {loading ? <Sparkles className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
            {loading ? '검증 중...' : '신학 검증 실행'}
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div className="glass-panel" style={{ padding: 'var(--space-xl)', borderTop: result.isHeresyOrProsperity ? '3px solid var(--color-danger)' : '3px solid var(--color-success)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                {result.isHeresyOrProsperity ? <AlertOctagon size={24} color="var(--color-danger)" /> : <CheckCircle size={24} color="var(--color-success)" />}
                <h3 className="serif-text" style={{ fontSize: '1.25rem', fontWeight: 700, color: result.isHeresyOrProsperity ? 'var(--color-danger)' : 'var(--color-success)' }}>
                  {result.isHeresyOrProsperity ? `[주의] ${result.identifiedCategory} 경향 탐지` : '건전한 성경적 교리'}
                </h3>
              </div>
            </div>

            {/* Analysis */}
            <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 4 }}>
                🔍 신학적 분석 (Theological Analysis)
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-sub)', lineHeight: 1.6 }}>
                {result.theologicalAnalysis}
              </p>
            </div>

            {/* Scriptural Correction */}
            <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)', borderLeft: '3px solid var(--color-primary)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Bookmark size={16} /> 성경적 교정 및 교리 선언 (Scriptural Correction)
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-sub)', lineHeight: 1.6 }}>
                {result.scripturalCorrection}
              </p>
            </div>

            {/* Orthodox Reformed View */}
            <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
              <h4 className="serif-text" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 4 }}>
                🏛️ 정통 개혁주의 & 복음주의 표준 관점
              </h4>
              <p className="serif-text" style={{ fontSize: '0.875rem', color: 'var(--color-text-main)', lineHeight: 1.6 }}>
                {result.orthodoxReformedPerspective}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
