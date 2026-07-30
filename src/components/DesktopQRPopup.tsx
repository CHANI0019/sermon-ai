import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Smartphone, X } from 'lucide-react';

interface DesktopQRPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesktopQRPopup: React.FC<DesktopQRPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const currentUrl = window.location.href;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-md)' }}>
      <div className="glass-panel animate-fade-in" style={{ maxWidth: 400, width: '100%', padding: 'var(--space-xl)', textAlign: 'center', position: 'relative', border: '1px solid var(--color-primary)' }}>
        <button onClick={onClose} className="touch-target" style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        <div style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-md)' }}>
          <Smartphone size={26} />
        </div>

        <h3 className="serif-text gold-gradient-text" style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 'var(--space-xs)' }}>
          스마트폰으로 모바일 PWA 연결
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-lg)' }}>
          카메라 앱으로 아래 QR 코드를 스캔하면 모바일 PWA 환경으로 즉시 연결됩니다.
        </p>

        {/* QR Code Container */}
        <div style={{ background: '#ffffff', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', display: 'inline-block', boxShadow: 'var(--shadow-md)', marginBottom: 'var(--space-lg)' }}>
          <QRCodeSVG value={currentUrl} size={180} level="H" includeMargin={false} />
        </div>

        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-sub)' }}>
          URL: {currentUrl}
        </p>
      </div>
    </div>
  );
};
