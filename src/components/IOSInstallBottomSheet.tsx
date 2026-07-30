import React from 'react';
import { DeviceInfo } from '../types';
import { Share, PlusSquare, X } from 'lucide-react';

interface IOSInstallBottomSheetProps {
  device: DeviceInfo;
  isOpen: boolean;
  onClose: () => void;
}

export const IOSInstallBottomSheet: React.FC<IOSInstallBottomSheetProps> = ({ device, isOpen, onClose }) => {
  if (!isOpen || !device.isIOS || device.isPWA) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 90, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div className="glass-panel animate-slide-up" style={{
        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
        padding: 'var(--space-xl) var(--space-lg)',
        borderTop: '2px solid var(--color-primary)',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button onClick={onClose} className="touch-target" style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
          <h3 className="serif-text gold-gradient-text" style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 4 }}>
            📲 iOS 사파리 전용 앱(PWA) 설치 안내
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            별도 앱스토어 다운로드 없이 3초 만에 홈 화면에 추가하여 이용하세요.
          </p>
        </div>

        {/* 3 Step Guide Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <div style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              1
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                사파리 하단 <Share size={16} color="var(--color-primary)" /> 클릭
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>브라우저 중앙 하단 공유 버튼</p>
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <div style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              2
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <PlusSquare size={16} color="var(--color-primary)" /> 홈 화면에 추가
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>메뉴를 올려 '홈 화면에 추가' 선택</p>
            </div>
          </div>
        </div>

        {/* Bouncing Pointer Animation */}
        <div style={{ textAlign: 'center', paddingTop: 'var(--space-sm)' }}>
          <div className="animate-bounce-finger" style={{ fontSize: '1.8rem', color: 'var(--color-primary)' }}>
            👇
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 500 }}>
            사파리 하단 툴바의 공유 버튼을 터치하세요
          </p>
        </div>
      </div>
    </div>
  );
};
