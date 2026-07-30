import React from 'react';
import { DeviceInfo } from '../types';
import { ExternalLink, Copy, Check } from 'lucide-react';

interface InAppEscapeModalProps {
  device: DeviceInfo;
  isOpen: boolean;
  onClose: () => void;
}

export const InAppEscapeModal: React.FC<InAppEscapeModalProps> = ({ device, isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !device.isInAppBrowser) return null;

  const currentUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAndroidChromeEscape = () => {
    if (device.isAndroid) {
      const intentUrl = `intent://${window.location.host}${window.location.pathname}${window.location.search}#Intent;scheme=https;package=com.android.chrome;end`;
      window.location.href = intentUrl;
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-md)' }}>
      <div className="glass-panel animate-fade-in" style={{ maxWidth: 440, width: '100%', padding: 'var(--space-xl)', textAlign: 'center', border: '1px solid var(--color-primary)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-sm)' }}>🧭</div>
        
        <h3 className="serif-text" style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: 'var(--space-sm)' }}>
          {device.inAppType === 'kakaotalk' ? '카카오톡' : '네이버'} 인앱 브라우저 감지
        </h3>

        <p style={{ fontSize: '0.95rem', color: 'var(--color-text-sub)', marginBottom: 'var(--space-lg)', lineHeight: 1.6 }}>
          현재 환경에서는 PWA 앱 설치 및 원활한 신학 연구 기능이 제한됩니다.{' '}
          <strong style={{ color: 'var(--color-text-main)' }}>기본 브라우저(Safari / Chrome)</strong>에서 접속해 주세요.
        </p>

        {device.isAndroid ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            <button onClick={handleAndroidChromeEscape} className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '1rem' }}>
              <ExternalLink size={18} /> Chrome 전용 브라우저로 열기
            </button>
            <button onClick={onClose} className="btn-secondary" style={{ width: '100%' }}>
              현재 화면 계속 이용
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', textAlign: 'left', fontSize: '0.85rem' }}>
              <p style={{ fontWeight: 600, color: 'var(--color-primary)', marginBottom: 4 }}>📌 iOS 사파리(Safari) 열기 방법:</p>
              <ol style={{ paddingLeft: '1.2rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                <li>아래 [주소 복사] 버튼을 터치합니다.</li>
                <li>아이폰 <strong>Safari</strong> 앱을 켭니다.</li>
                <li>상단 주소창에 붙여넣어 접속합니다.</li>
              </ol>
            </div>

            <button onClick={handleCopyLink} className="btn-primary" style={{ width: '100%', padding: '12px' }}>
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? '주소가 복사되었습니다!' : '웹사이트 주소 복사하기'}
            </button>
            
            <button onClick={onClose} className="btn-secondary" style={{ width: '100%' }}>
              창 닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
