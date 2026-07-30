import React, { useState, useEffect } from 'react';
import { useDevice } from './hooks/useDevice';
import { TabType, SavedJournalItem } from './types';
import { Header } from './components/Header';
import { InAppEscapeModal } from './components/InAppEscapeModal';
import { IOSInstallBottomSheet } from './components/IOSInstallBottomSheet';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { DesktopQRPopup } from './components/DesktopQRPopup';
import { SermonGeneratorView } from './components/SermonGeneratorView';
import { NewsSermonView } from './components/NewsSermonView';
import { PastoralCounselingView } from './components/PastoralCounselingView';
import { SavedJournalView } from './components/SavedJournalView';
import { GuardrailsView } from './components/GuardrailsView';
import { DeviceStatsView } from './components/DeviceStatsView';
import { SvsPraiseView } from './components/SvsPraiseView';

export const App: React.FC = () => {
  const device = useDevice();
  const [activeTab, setActiveTab] = useState<TabType>('sermon');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Modals visibility
  const [showInAppModal, setShowInAppModal] = useState(false);
  const [showIOSSheet, setShowIOSSheet] = useState(false);
  const [showDesktopQR, setShowDesktopQR] = useState(false);
  const [showPWABanner, setShowPWABanner] = useState(true);

  // Saved Journal Items State (Persisted in localStorage)
  const [savedItems, setSavedItems] = useState<SavedJournalItem[]>(() => {
    const saved = localStorage.getItem('project_logos_saved_journal');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync saved items to localStorage
  useEffect(() => {
    localStorage.setItem('project_logos_saved_journal', JSON.stringify(savedItems));
  }, [savedItems]);

  // Trigger modal visibility on device detection
  useEffect(() => {
    if (device.isInAppBrowser) {
      setShowInAppModal(true);
    } else if (device.isIOS && !device.isPWA) {
      const timer = setTimeout(() => setShowIOSSheet(true), 2500);
      return () => clearTimeout(timer);
    }
  }, [device.isInAppBrowser, device.isIOS, device.isPWA]);

  // Save new item handler
  const handleSaveItem = (item: Omit<SavedJournalItem, 'id' | 'createdAt'>) => {
    const newItem: SavedJournalItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
    };
    setSavedItems((prev) => [newItem, ...prev]);
  };

  // Delete saved item handler
  const handleDeleteItem = (id: string) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Handle Theme Toggle
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Handle PWA Install Trigger
  const handleTriggerInstall = () => {
    const promptEvent = (window as any).deferredPwaPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      promptEvent.userChoice.then((choice: any) => {
        if (choice.outcome === 'accepted') {
          console.log('User accepted PWA install');
        }
        (window as any).deferredPwaPrompt = null;
      });
    } else if (device.isIOS) {
      setShowIOSSheet(true);
    } else if (device.isDesktop) {
      setShowDesktopQR(true);
    } else {
      alert('브라우저 메뉴에서 [홈 화면에 추가]를 클릭하시면 앱으로 설치됩니다.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      {/* Top Header */}
      <Header
        device={device}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenQR={() => setShowDesktopQR(true)}
        onTriggerInstall={handleTriggerInstall}
        savedCount={savedItems.length}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: 'var(--space-lg) 0' }}>
        <div className="container">
          {/* PWA Install Banner */}
          {device.canInstallPWA && showPWABanner && (
            <PWAInstallBanner
              onInstall={handleTriggerInstall}
              onDismiss={() => setShowPWABanner(false)}
            />
          )}

          {/* Active Tab View */}
          {activeTab === 'sermon' && <SermonGeneratorView onSaveItem={handleSaveItem} />}
          {activeTab === 'news_sermon' && <NewsSermonView onSaveItem={handleSaveItem} />}
          {activeTab === 'counseling' && <PastoralCounselingView onSaveItem={handleSaveItem} />}
          {activeTab === 'svs_praise' && <SvsPraiseView onSaveJournal={(title, content, type) => handleSaveItem({ title, content, type })} />}
          {activeTab === 'journal' && <SavedJournalView savedItems={savedItems} onDeleteItem={handleDeleteItem} />}
          {activeTab === 'guardrails' && <GuardrailsView />}
          {activeTab === 'stats' && (
            <DeviceStatsView
              device={device}
              onTriggerInstall={handleTriggerInstall}
              onOpenQR={() => setShowDesktopQR(true)}
            />
          )}
        </div>
      </main>

      {/* Modals & Overlays */}
      <InAppEscapeModal
        device={device}
        isOpen={showInAppModal}
        onClose={() => setShowInAppModal(false)}
      />

      <IOSInstallBottomSheet
        device={device}
        isOpen={showIOSSheet}
        onClose={() => setShowIOSSheet(false)}
      />

      <DesktopQRPopup
        isOpen={showDesktopQR}
        onClose={() => setShowDesktopQR(false)}
      />

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--bg-secondary)', padding: 'var(--space-xl) 0', marginTop: 'var(--space-2xl)' }}>
        <div className="container" style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          <p className="serif-text" style={{ color: 'var(--color-text-main)', fontWeight: 600, marginBottom: 'var(--space-xs)' }}>
            LOGOS — 정통 개혁주의 신학 & 실시간 시사 뉴스 연계 목회 AI
          </p>
          <p style={{ maxWidth: 720, margin: '0 auto var(--space-md)', fontSize: '0.8rem' }}>
            본 시스템은 성경의 구속사적 전체 맥락(Christ-centered)과 정통 복음주의 신학 고백에 기반합니다. 영적 은혜와 진정한 위로는 성령 하나님의 역사와 성도님이 속하신 지역 교회 공동체를 통해 이루어집니다.
          </p>
          <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>
            © {new Date().getFullYear()} LOGOS System. Real-time RSS News Sermon Generator Ready.
          </p>
        </div>
      </footer>
    </div>
  );
};
