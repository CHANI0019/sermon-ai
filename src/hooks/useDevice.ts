import { useState, useEffect } from 'react';
import { DeviceInfo } from '../types';

export function useDevice(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => getInitialDeviceInfo());

  useEffect(() => {
    // Listen for PWA beforeinstallprompt
    let deferredPrompt: any = null;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      setDeviceInfo((prev) => ({
        ...prev,
        canInstallPWA: true,
      }));
      (window as any).deferredPwaPrompt = deferredPrompt;
    };

    const handleAppInstalled = () => {
      setDeviceInfo((prev) => ({
        ...prev,
        isPWA: true,
        canInstallPWA: false,
      }));
      console.log('PWA app installed successfully');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return deviceInfo;
}

function getInitialDeviceInfo(): DeviceInfo {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  
  // 1. In-App Browser Detection (KakaoTalk, Naver)
  const isKakaoTalk = /kakaotalk/i.test(ua);
  const isNaver = /naver/i.test(ua);
  const isInAppBrowser = isKakaoTalk || isNaver || /inapp|line|snapchat|instagram/i.test(ua);
  const inAppType = isKakaoTalk ? 'kakaotalk' : isNaver ? 'naver' : isInAppBrowser ? 'other' : undefined;

  // 2. OS & Device Type Detection
  const isAndroid = /android/i.test(ua);
  const isIOS = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isIPhone = /iphone/i.test(ua);
  const isIPad = /ipad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  const isWindows = /windows/i.test(ua);
  const isMacOS = /macintosh|mac os x/i.test(ua) && !isIOS;
  const isLinux = /linux/i.test(ua) && !isAndroid;

  let deviceType: DeviceInfo['deviceType'] = 'Unknown';
  if (isAndroid) deviceType = 'Android';
  else if (isIPhone) deviceType = 'iPhone';
  else if (isIPad) deviceType = 'iPad';
  else if (isWindows) deviceType = 'Windows';
  else if (isMacOS) deviceType = 'macOS';
  else if (isLinux) deviceType = 'Linux';

  const isMobile = isAndroid || isIPhone;
  const isTablet = isIPad || (isAndroid && !/mobile/i.test(ua));
  const isDesktop = !isMobile && !isTablet;

  // 3. Browser & Version Detection
  let browser = 'Unknown';
  let browserVersion = '';

  if (/chrome/i.test(ua) && !/edg|opr/i.test(ua)) {
    browser = 'Chrome';
    browserVersion = ua.match(/chrome\/([\d.]+)/i)?.[1] || '';
  } else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
    browser = 'Safari';
    browserVersion = ua.match(/version\/([\d.]+)/i)?.[1] || '';
  } else if (/firefox/i.test(ua)) {
    browser = 'Firefox';
    browserVersion = ua.match(/firefox\/([\d.]+)/i)?.[1] || '';
  } else if (/edg/i.test(ua)) {
    browser = 'Edge';
    browserVersion = ua.match(/edg\/([\d.]+)/i)?.[1] || '';
  }

  // 4. PWA Standalone Mode Detection
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;

  return {
    deviceType,
    os: navigator.platform || 'Unknown OS',
    browser,
    browserVersion,
    isMobile,
    isTablet,
    isDesktop,
    isPWA,
    isIOS,
    isAndroid,
    isInAppBrowser,
    inAppType,
    canInstallPWA: false, // Updated by event listener if supported
  };
}
