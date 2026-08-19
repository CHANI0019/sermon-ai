import React, { useState } from 'react';
import { User } from '../types';
import { authenticateUser } from '../services/authService';
import { Lock, ShieldCheck, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLoginSuccess }) => {
  const [idInput, setIdInput] = useState('');
  const [pwInput, setPwInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 일반 ID/PW 로그인 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = authenticateUser(idInput, pwInput);
      setIsLoading(false);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setErrorMsg(result.error || '로그인에 실패하였습니다.');
      }
    }, 300);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-md)',
      overflowY: 'auto'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: 440,
        borderRadius: 24,
        padding: 'var(--space-xl)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 40px rgba(245, 158, 11, 0.15)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        color: '#f8fafc'
      }}>
        {/* Header Icon & Title */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-md)',
            color: '#0f172a',
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)'
          }}>
            <Lock size={32} strokeWidth={2.5} />
          </div>

          <h2 className="gold-gradient-text" style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 4 }}>
            LOGOS 시스템 보안 인증
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <ShieldCheck size={16} style={{ color: '#f59e0b' }} />
            허가된 사용자 전용 보안 접근 시스템
          </p>
        </div>

        {/* Security Notice Box */}
        <div style={{
          backgroundColor: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: 14,
          padding: '12px 16px',
          marginBottom: 'var(--space-lg)',
          fontSize: '0.8rem',
          lineHeight: 1.5,
          color: '#e2e8f0'
        }}>
          <p style={{ fontWeight: 600, color: '#fbbf24', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={14} /> 보안 인가 안내
          </p>
          본 플랫폼은 사전 승인된 사용자만 접근할 수 있습니다. 수여받으신 계정 아이디와 비밀번호를 입력하여 입장해 주세요.
        </div>

        {/* Form Login */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {errorMsg && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: 10,
              padding: '10px 14px',
              fontSize: '0.8rem',
              color: '#fca5a5',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: 6, fontWeight: 600 }}>
              아이디 (ID)
            </label>
            <input
              type="text"
              value={idInput}
              onChange={(e) => setIdInput(e.target.value)}
              placeholder="아이디를 입력하세요"
              required
              autoFocus
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: 6, fontWeight: 600 }}>
              비밀번호 (Password)
            </label>
            <input
              type="password"
              value={pwInput}
              onChange={(e) => setPwInput(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: '0.95rem',
              marginTop: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
          >
            {isLoading ? (
              <span>인증 확인 중...</span>
            ) : (
              <>
                <CheckCircle2 size={18} />
                보안 접속 확인 및 입장
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
