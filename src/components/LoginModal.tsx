import React, { useState } from 'react';
import { User } from '../types';
import { authenticateUser, quickAutoLogin } from '../services/authService';
import { Lock, ShieldCheck, Key, UserCheck, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

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

  // ⚡ 원클릭 자동 접속 처리
  const handleQuickLogin = (userId: 'danari' | 'test') => {
    setErrorMsg(null);
    setIsLoading(true);
    setTimeout(() => {
      const user = quickAutoLogin(userId);
      setIsLoading(false);
      onLoginSuccess(user);
    }, 250);
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
        maxWidth: 480,
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
            <Sparkles size={14} /> 인가된 사용자 전용 안내
          </p>
          본 플랫폼은 보안 인가된 목회자 및 허가 회원만 이용할 수 있습니다. 등록된 아이디로 로그인하거나 아래의 빠른 자동 접속 버튼을 눌러 들어오세요.
        </div>

        {/* ⚡ Quick Auto Login Section (원클릭 자동 접속) */}
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24', marginBottom: 10 }}>
            ⚡ 허가된 계정 원클릭 자동 접속
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('danari')}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 14,
                border: '1px solid rgba(245, 158, 11, 0.4)',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2))',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)'
              }}
              className="quick-auth-btn"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: '#f59e0b', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserCheck size={16} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div>danari 계정으로 접속</div>
                  <div style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 400 }}>ID: danari | PW: mylove*0019</div>
                </div>
              </div>
              <ArrowRight size={18} style={{ color: '#f59e0b' }} />
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('test')}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 14,
                border: '1px solid rgba(59, 130, 246, 0.4)',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(29, 78, 216, 0.2))',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
              }}
              className="quick-auth-btn"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: '#3b82f6', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Key size={16} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div>test 계정으로 접속</div>
                  <div style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 400 }}>ID: test | PW: test</div>
                </div>
              </div>
              <ArrowRight size={18} style={{ color: '#60a5fa' }} />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: 'var(--space-md) 0', color: '#64748b', fontSize: '0.75rem' }}>
          <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
          <span style={{ padding: '0 12px' }}>또는 직접 입력하여 로그인</span>
          <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
        </div>

        {/* Form Login */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: 6, fontWeight: 600 }}>
              아이디 (ID)
            </label>
            <input
              type="text"
              value={idInput}
              onChange={(e) => setIdInput(e.target.value)}
              placeholder="예: danari 또는 test"
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

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: 6, fontWeight: 600 }}>
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
              padding: '12px',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: '0.95rem',
              marginTop: 6,
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
