import React, { useState, useEffect } from 'react';
import { DeviceInfo } from '../types';
import { DeepSeekService, DeepSeekConfigState } from '../services/deepseekService';
import { Cpu, Smartphone, Monitor, ShieldCheck, Download, RefreshCw, Check, Server } from 'lucide-react';

interface DeviceStatsViewProps {
  device: DeviceInfo;
  onTriggerInstall: () => void;
  onOpenQR: () => void;
}

export const DeviceStatsView: React.FC<DeviceStatsViewProps> = ({ device, onTriggerInstall, onOpenQR }) => {
  const [llmConfigState, setLlmConfigState] = useState<DeepSeekConfigState>(DeepSeekService.getConfigState());
  const [syncing, setSyncing] = useState(false);
  const [syncedMsg, setSyncedMsg] = useState(false);

  const handleSyncModelConfig = async () => {
    setSyncing(true);
    setSyncedMsg(false);
    try {
      const updated = await DeepSeekService.syncAndAutoUpdateConfig();
      setLlmConfigState(updated);
      setSyncedMsg(true);
      setTimeout(() => setSyncedMsg(false), 3000);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* Banner */}
      <div className="glass-panel" style={{ padding: 'var(--space-lg)', borderLeft: '4px solid var(--color-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-xs)' }}>
          <Cpu size={24} color="var(--color-primary)" />
          <h2 className="serif-text gold-gradient-text" style={{ fontSize: '1.4rem', fontWeight: 700 }}>
            LOGOS AI 모델 자동 갱신 & PWA 진단 대시보드
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
          AI API 서버와 연결하여 최신 모델명(defaultModel) 및 백업 모델(fallbackModels)을 자동으로 동기화하고 시스템 상태를 모니터링합니다.
        </p>
      </div>

      {/* Grid Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
        {/* Card 1: Dynamic Model Auto-Sync */}
        <div className="glass-panel" style={{ padding: 'var(--space-lg)', borderTop: '3px solid var(--color-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Server size={18} /> LOGOS AI 모델 자동 갱신
            </h3>
            <span style={{ fontSize: '0.7rem', background: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
              Auto-Sync Ready
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.875rem', marginBottom: 'var(--space-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: 6 }}>
              <span style={{ color: 'var(--color-text-muted)' }}>현재 기본 모델 (defaultModel)</span>
              <strong style={{ color: 'var(--color-primary)' }}>{llmConfigState.defaultModel}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: 6 }}>
              <span style={{ color: 'var(--color-text-muted)' }}>자동 동기화 (autoDetect)</span>
              <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>✓ 활성화됨 (True)</span>
            </div>
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 6 }}>
              <div style={{ color: 'var(--color-text-muted)', marginBottom: 4 }}>백업 모델 스위칭 (fallbackModels):</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {llmConfigState.fallbackModels.map((m, idx) => (
                  <span key={idx} style={{ fontSize: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--color-border)', padding: '2px 6px', borderRadius: 4, color: 'var(--color-text-sub)' }}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 2 }}>
              <span style={{ color: 'var(--color-text-muted)' }}>최종 갱신 일자</span>
              <span style={{ color: 'var(--color-text-sub)' }}>{llmConfigState.lastUpdated}</span>
            </div>
          </div>

          <button onClick={handleSyncModelConfig} disabled={syncing} className="btn-primary" style={{ width: '100%' }}>
            {syncing ? <RefreshCw className="animate-spin" size={16} /> : syncedMsg ? <Check size={16} color="#0f172a" /> : <RefreshCw size={16} />}
            {syncing ? 'AI 모델 동기화 중...' : syncedMsg ? '최신 모델로 갱신 완료!' : '🔄 최신 AI 모델명 자동 갱신'}
          </button>
        </div>

        {/* Card 2: Device Spec */}
        <div className="glass-panel" style={{ padding: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-accent)', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 6 }}>
            {device.isMobile ? <Smartphone size={18} /> : <Monitor size={18} />} 접속 기기 상세
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: 6 }}>
              <span style={{ color: 'var(--color-text-muted)' }}>기기 유형 (Device)</span>
              <strong style={{ color: 'var(--color-text-main)' }}>{device.deviceType}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: 6 }}>
              <span style={{ color: 'var(--color-text-muted)' }}>운영체제 (OS)</span>
              <span style={{ color: 'var(--color-text-main)' }}>{device.os}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: 6 }}>
              <span style={{ color: 'var(--color-text-muted)' }}>브라우저 (Browser)</span>
              <span style={{ color: 'var(--color-text-main)' }}>{device.browser} ({device.browserVersion || 'v1.0'})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>인앱 브라우저 (In-App)</span>
              <span style={{ color: device.isInAppBrowser ? 'var(--color-warning)' : 'var(--color-success)', fontWeight: 600 }}>
                {device.isInAppBrowser ? `⚠️ 감지됨 (${device.inAppType})` : '✓ 일반 브라우저'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: PWA Status */}
        <div className="glass-panel" style={{ padding: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Download size={18} /> PWA (Progressive Web App) 상태
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: 6 }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Standalone 모드 실행</span>
              <span style={{ color: device.isPWA ? 'var(--color-success)' : 'var(--color-text-muted)', fontWeight: 600 }}>
                {device.isPWA ? '✓ PWA 설치 실행 중' : '웹 브라우저 모드'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: 6 }}>
              <span style={{ color: 'var(--color-text-muted)' }}>PWA 설치 가능 여부</span>
              <span style={{ color: device.canInstallPWA ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                {device.canInstallPWA ? '✓ 가능 (Install Ready)' : '미지원 또는 이미 설치됨'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Service Worker 캐싱</span>
              <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>✓ 활성화됨</span>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-md)' }}>
            {device.canInstallPWA ? (
              <button onClick={onTriggerInstall} className="btn-primary" style={{ width: '100%' }}>
                <Download size={16} /> 원클릭 PWA 앱 설치하기
              </button>
            ) : device.isDesktop ? (
              <button onClick={onOpenQR} className="btn-secondary" style={{ width: '100%' }}>
                📱 모바일 QR 연결창 열기
              </button>
            ) : (
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                {device.isPWA ? '🎉 이미 홈 화면 앱으로 실행 중입니다.' : '사파리/크롬 메뉴에서 [홈 화면에 추가]를 눌러보세요.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
