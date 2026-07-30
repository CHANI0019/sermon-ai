import React from 'react';
import { Download, Sparkles, X } from 'lucide-react';

interface PWAInstallBannerProps {
  onInstall: () => void;
  onDismiss: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ onInstall, onDismiss }) => {
  return (
    <div className="glass-panel animate-fade-in" style={{
      margin: 'var(--space-md) 0',
      padding: 'var(--space-md) var(--space-lg)',
      borderLeft: '4px solid var(--color-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-md)',
      flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <div style={{ background: 'var(--color-primary-light)', padding: 10, borderRadius: 'var(--radius-md)', color: 'var(--color-primary)' }}>
          <Sparkles size={24} />
        </div>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
            GracePastoral 앱을 홈 화면에 설치하세요
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            로딩 속도 향상, 오프라인 주해 지원 및 네이티브 앱 경험을 제공합니다.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <button onClick={onInstall} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
          <Download size={16} /> 3초 설치하기
        </button>
        <button onClick={onDismiss} className="touch-target" style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
