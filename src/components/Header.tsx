import React from 'react';
import { DeviceInfo, TabType } from '../types';
import { BookOpen, HeartHandshake, ShieldCheck, Cpu, Smartphone, Monitor, Download, Sun, Moon, Bookmark, Newspaper, Music } from 'lucide-react';

interface HeaderProps {
  device: DeviceInfo;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  onOpenQR: () => void;
  onTriggerInstall: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  device,
  activeTab,
  setActiveTab,
  theme,
  toggleTheme,
  onOpenQR,
  onTriggerInstall,
  savedCount
}) => {
  return (
    <header style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 40 }}>
      <div className="container" style={{ padding: 'var(--space-md)' }}>
        {/* Top Branding & Status Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0f172a',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
            }}>
              <BookOpen size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="gold-gradient-text" style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.2 }}>
                LOGOS
              </h1>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                정통 개혁주의 신학 & 목회 AI 어시스턴트
              </p>
            </div>
          </div>

          {/* Controls & Device Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            {/* Device Badge */}
            <div className="glass-panel" style={{ padding: '4px 10px', borderRadius: 'var(--radius-pill)', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--color-primary)' }}>
              {device.isMobile ? <Smartphone size={14} /> : <Monitor size={14} />}
              <span>{device.deviceType}</span>
              {device.isPWA && <span style={{ background: 'var(--color-accent)', color: '#fff', fontSize: '0.65rem', padding: '1px 6px', borderRadius: 10 }}>PWA</span>}
            </div>

            {/* PC QR Button */}
            {device.isDesktop && (
              <button onClick={onOpenQR} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', minHeight: 36 }} title="모바일 접속 QR코드">
                📱 모바일 연결
              </button>
            )}

            {/* Install PWA Button if available */}
            {device.canInstallPWA && (
              <button onClick={onTriggerInstall} className="btn-primary animate-pulse-gold" style={{ padding: '6px 12px', fontSize: '0.8rem', minHeight: 36 }}>
                <Download size={14} /> 앱 설치
              </button>
            )}

            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="touch-target" style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-main)', cursor: 'pointer', width: 36, height: 36 }} title="테마 변경">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="header-nav" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', width: '100%', paddingBottom: 2 }}>
          <button
            onClick={() => setActiveTab('sermon')}
            className={activeTab === 'sermon' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '6px 12px', fontSize: '0.8rem', minHeight: 36, whiteSpace: 'nowrap' }}
          >
            <BookOpen size={15} /> 📖 3대지 설교
          </button>
          <button
            onClick={() => setActiveTab('news_sermon')}
            className={activeTab === 'news_sermon' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '6px 12px', fontSize: '0.8rem', minHeight: 36, whiteSpace: 'nowrap' }}
          >
            <Newspaper size={15} /> 🕊️ 오늘의 시사 묵상(QT)
          </button>
          <button
            onClick={() => setActiveTab('counseling')}
            className={activeTab === 'counseling' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '6px 12px', fontSize: '0.8rem', minHeight: 36, whiteSpace: 'nowrap' }}
          >
            <HeartHandshake size={15} /> 🕊️ 목회 상담
          </button>
          <button
            onClick={() => setActiveTab('svs_praise')}
            className={activeTab === 'svs_praise' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '6px 12px', fontSize: '0.8rem', minHeight: 36, whiteSpace: 'nowrap' }}
          >
            <Music size={15} /> 🎵 AI 찬양 (SVS)
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={activeTab === 'journal' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '6px 12px', fontSize: '0.8rem', minHeight: 36, whiteSpace: 'nowrap', position: 'relative' }}
          >
            <Bookmark size={15} /> 📚 묵상 저널
            {savedCount > 0 && (
              <span style={{ marginLeft: 4, background: 'var(--color-accent)', color: '#fff', fontSize: '0.65rem', borderRadius: 'var(--radius-pill)', padding: '1px 6px', fontWeight: 700 }}>
                {savedCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('guardrails')}
            className={activeTab === 'guardrails' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '6px 12px', fontSize: '0.8rem', minHeight: 36, whiteSpace: 'nowrap' }}
          >
            <ShieldCheck size={15} /> 🛡️ 신학 검증
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={activeTab === 'stats' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '6px 12px', fontSize: '0.8rem', minHeight: 36, whiteSpace: 'nowrap' }}
          >
            <Cpu size={15} /> PWA/기기
          </button>
        </nav>
      </div>
    </header>
  );
};
