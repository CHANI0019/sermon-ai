import { User } from '../types';

// 🔒 시스템 인가된 허가 사용자 목록
export interface PresetAccount {
  user: User;
  passwordHash: string;
}

export const PRESET_ACCOUNTS: Record<string, PresetAccount> = {
  danari: {
    user: {
      id: 'danari',
      name: '다나리 목사님',
      role: '담임목사 / 정회원',
      avatarColor: 'linear-gradient(135deg, #f59e0b, #d97706)'
    },
    passwordHash: 'mylove*0019'
  },
  test: {
    user: {
      id: 'test',
      name: '테스트 계정',
      role: '테스트 회원',
      avatarColor: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
    },
    passwordHash: 'test'
  }
};

const STORAGE_KEY = 'project_logos_auth_user';

/**
 * ID 및 비밀번호 검증 함수
 */
export const authenticateUser = (id: string, pw: string): { success: boolean; user?: User; error?: string } => {
  const trimmedId = id.trim();
  const account = PRESET_ACCOUNTS[trimmedId];

  if (!account) {
    return { success: false, error: '등록되지 않았거나 허가되지 않은 아이디입니다.' };
  }

  if (account.passwordHash !== pw) {
    return { success: false, error: '비밀번호가 일치하지 않습니다.' };
  }

  saveUserSession(account.user);
  return { success: true, user: account.user };
};

/**
 * ⚡ 원클릭 자동 로그인 (Quick Auto-Login)
 */
export const quickAutoLogin = (userId: 'danari' | 'test'): User => {
  const account = PRESET_ACCOUNTS[userId];
  saveUserSession(account.user);
  return account.user;
};

/**
 * localStorage 세션 저장
 */
export const saveUserSession = (user: User): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
  } catch (e) {
    console.error('Session save error:', e);
  }
};

/**
 * localStorage 세션 조회 (자동 로그인 검증)
 */
export const getStoredUserSession = (): User | null => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as User;
      }
    }
  } catch (e) {
    console.error('Session retrieval error:', e);
  }
  return null;
};

/**
 * 세션 삭제 (로그아웃)
 */
export const clearUserSession = (): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (e) {
    console.error('Session clear error:', e);
  }
};
