import React, { useState } from 'react';
import { CounselingResult, SavedJournalItem } from '../types';
import { LOGOS_EXISTENTIAL_DB, ExistentialStruggle } from '../services/logosDatabase';
import { LogosGuardrailService } from '../../lib/guardrails';
import { HeartHandshake, Send, Sparkles, Bookmark, Check, AlertTriangle, PhoneCall, Scroll, Church } from 'lucide-react';

interface PastoralCounselingViewProps {
  onSaveItem: (item: Omit<SavedJournalItem, 'id' | 'createdAt'>) => void;
}

export const PastoralCounselingView: React.FC<PastoralCounselingViewProps> = ({ onSaveItem }) => {
  const [queryInput, setQueryInput] = useState('사업 실패와 재정적 압박으로 너무 지치고 삶이 무의미하게 느껴집니다.');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CounselingResult | null>(null);
  const [saved, setSaved] = useState(false);

  const handleCounseling = async (text: string) => {
    if (!text.trim()) return;
    setLoading(true);
    setSaved(false);

    try {
      await new Promise((res) => setTimeout(res, 600));

      // Level 2 Crisis Check
      const crisisCheck = LogosGuardrailService.checkCrisis(text);

      if (crisisCheck.isCrisis) {
        setResult({
          query: text,
          step1Empathy: crisisCheck.message!,
          step2Parallelism: {
            character: '시편 다윗의 탄식',
            story: '하나님, 마음이 상한 자를 가까이 하시고 나를 잊지 마소서',
            passage: '시편 34:18'
          },
          step3Theology: '인간의 모든 생명은 삼위일체 하나님께 지극히 귀중한 선물입니다.',
          step4Action: {
            steps: ['지금 즉시 아래 24시간 긴급 전화를 이용하기', '지역 교회 목회자에게 긴급 연락하기'],
            prayer: '주님의 은혜의 손길로 나를 붙드소서'
          },
          isCrisis: true,
          hotlines: crisisCheck.hotlines,
          disclaimer: LogosGuardrailService.getDisclaimer()
        });
        return;
      }

      // Standard 4-Step Pipeline Counseling
      setResult({
        query: text,
        step1Empathy: `성도님께서 겪고 계신 [${text}]의 아픔과 중압감을 깊은 사목적 경외와 공감으로 경청합니다. 고통과 절망 속에서 느껴지는 슬픔은 결코 믿음의 실패가 아니며 주님께서 눈물로 함께 체휼하시는 영혼의 부르짖음입니다.`,
        step2Parallelism: {
          character: '욥과 사도 바울의 약함',
          story: '수많은 재산과 건강을 잃었던 욥의 고난과, 육체의 가시 속에서 "내 은혜가 네게 족하도다"의 응답을 받은 바울.',
          passage: '로마서 8:28 / 고린도후서 12:9-10'
        },
        step3Theology: '재정적·현실적 실패는 성도님의 영적 자격이나 하나님의 사랑을 나타내는 지표가 결코 아닙니다. 십자가에서 하나뿐인 독생자를 내어주신 하나님은 성도님의 삶을 영원한 성화와 은혜의 섭리로 인도하십니다.',
        step4Action: {
          steps: [
            '세속의 성패 잣대가 아닌 십자가 피 값으로 사신 하나님의 자녀 정체성 선포하기',
            '마음의 아픔을 지역 교회 목회자 및 교도들과 솔직하게 나누고 기도 받기',
            '오늘 나에게 주신 작은 일상의 만나 은혜 하나에 감사하기'
          ],
          prayer: '내 뜻과 조급함을 십자가 앞에 내려놓고 신실하신 하나님의 주권을 온전히 신뢰하게 하소서.'
        },
        isCrisis: false,
        disclaimer: LogosGuardrailService.getDisclaimer()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (item: ExistentialStruggle) => {
    setQueryInput(item.description);
    handleCounseling(item.description);
  };

  const handleSave = () => {
    if (!result) return;
    onSaveItem({
      title: `[목회 상담 묵상] ${result.query.slice(0, 24)}...`,
      type: 'counseling',
      passage: result.step2Parallelism.passage,
      content: `[고뇌 질의]: ${result.query}\n\n[1단계 공감]: ${result.step1Empathy}\n\n[2단계 성경 서사]: ${result.step2Parallelism.character} (${result.step2Parallelism.passage})\n${result.step2Parallelism.story}\n\n[3단계 신학적 재정의]: ${result.step3Theology}\n\n[4단계 실천 가이드]:\n- ${result.step4Action.steps.join('\n- ')}\n\n[기도]: ${result.step4Action.prayer}`
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* Banner */}
      <div className="glass-panel" style={{ padding: 'var(--space-lg)', borderLeft: '4px solid var(--color-accent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-xs)' }}>
          <HeartHandshake size={24} color="var(--color-accent)" />
          <h2 className="serif-text" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
            🕊️ Project LOGOS: 4단계 대화형 목회 상담
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
          인간의 5대 고뇌(불안, 외로움, 실패, 죄책감, 정체성)를 4단계 성경적 파이프라인(공감 → 성경서사 → 신학재정의 → 실천가이드)으로 위로합니다.
        </p>
      </div>

      {/* Preset Chips */}
      <div className="glass-panel" style={{ padding: 'var(--space-md)' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: 8 }}>
          💡 5대 인간 고뇌 핵심 주제 선택:
        </span>
        <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
          {LOGOS_EXISTENTIAL_DB.map((st) => (
            <button
              key={st.id}
              onClick={() => handleSelectPreset(st)}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-pill)' }}
            >
              {st.category}
            </button>
          ))}
        </div>
      </div>

      {/* Input Textarea */}
      <div className="glass-panel" style={{ padding: 'var(--space-lg)' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 6 }}>
          상담하고 싶으신 고민이나 아픔을 말씀해 주세요
        </label>
        <textarea
          rows={4}
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          placeholder="예: 반복되는 영적 무기력함과 죄책감 때문에 하나님 앞에 나아가기 부끄럽습니다."
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
          <button onClick={() => handleCounseling(queryInput)} disabled={loading} className="btn-primary" style={{ minWidth: 150 }}>
            {loading ? <Sparkles className="animate-spin" size={18} /> : <Send size={18} />}
            {loading ? '상담 대화 중...' : '목회 상담 시작'}
          </button>
        </div>
      </div>

      {/* Output Results */}
      {result && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {result.isCrisis ? (
            /* Crisis Alert Card */
            <div className="glass-panel" style={{ padding: 'var(--space-xl)', borderLeft: '5px solid var(--color-danger)', background: 'rgba(239, 68, 68, 0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                <AlertTriangle size={32} color="var(--color-danger)" />
                <h3 className="serif-text" style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-danger)' }}>
                  🚨 24시간 긴급 생명 보호 지원 안내
                </h3>
              </div>
              <p className="serif-text" style={{ fontSize: '1.05rem', color: 'var(--color-text-main)', lineHeight: 1.7, marginBottom: 'var(--space-lg)' }}>
                {result.step1Empathy}
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-sm)' }}>
                {result.hotlines?.map((hl, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-danger)' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{hl.name}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <PhoneCall size={18} /> {hl.number}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* 4-Step Standard Pipeline Output Card */
            <div className="glass-panel" style={{ padding: 'var(--space-xl)', borderTop: '4px solid var(--color-accent)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                <h3 className="serif-text" style={{ fontSize: '1.3rem', color: 'var(--color-accent)', fontWeight: 700 }}>
                  🕊️ 목회적 경청과 은혜의 조명
                </h3>

                <button onClick={handleSave} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                  {saved ? <Check size={16} color="var(--color-success)" /> : <Bookmark size={16} />}
                  {saved ? '저장되었습니다!' : '저널에 저장'}
                </button>
              </div>

              {/* Step 1: Empathy */}
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-accent)', marginBottom: 6 }}>
                  1단계: 사목적 공감과 경청 (Empathic Listening)
                </h4>
                <p className="serif-text" style={{ fontSize: '1rem', color: 'var(--color-text-main)', lineHeight: 1.7 }}>
                  {result.step1Empathy}
                </p>
              </div>

              {/* Step 2: Parallelism */}
              <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)', borderLeft: '3px solid var(--color-primary)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Scroll size={16} /> 2단계: 성경 인물 서사 (Biblical Parallelism - {result.step2Parallelism.passage})
                </h4>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 2 }}>
                  {result.step2Parallelism.character}
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-sub)', lineHeight: 1.6 }}>
                  {result.step2Parallelism.story}
                </p>
              </div>

              {/* Step 3: Theology */}
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 6 }}>
                  3단계: 신학적 재정의 (Theological Reframing)
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-sub)', lineHeight: 1.7 }}>
                  {result.step3Theology}
                </p>
              </div>

              {/* Step 4: Action */}
              <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 6 }}>
                  4단계: 영적 실천 가이드 & 묵상 기도
                </h4>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.875rem', color: 'var(--color-text-sub)', lineHeight: 1.7, marginBottom: 12 }}>
                  {result.step4Action.steps.map((st, idx) => (
                    <li key={idx}>{st}</li>
                  ))}
                </ul>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontStyle: 'italic', marginBottom: 12 }}>
                  🙏 <strong>기도</strong>: "{result.step4Action.prayer}"
                </div>

                {/* SVS Praise Integration Banner */}
                <div style={{ padding: 'var(--space-md)', background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12), rgba(15, 23, 42, 0.4))', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8' }}>🎵 AI SVS 위로 찬양 음성 연계</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-sub)' }}>상담 성도님을 위해 담임목사님 음성의 위로 찬송가(찬송가 405장, 412장 등)를 합성하세요.</div>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8' }}>
                    상단 [🎵 AI 찬양 (SVS)] 탭 연동
                  </span>
                </div>
              </div>

              {/* Disclaimer */}
              <div style={{ background: 'rgba(13, 148, 136, 0.08)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                <Church size={22} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  {result.disclaimer}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
