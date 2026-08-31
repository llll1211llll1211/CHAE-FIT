'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * 진단 세션 상태 — 라우트로 쪼개진 화면들이 공유하는 단 하나의 출처.
 *
 * 단일 페이지 시절에는 page.jsx의 useState가 이 역할을 했다. 화면을 라우트로
 * 나누면서 그 상태를 여기로 올렸다. **이력서 분석 결과(analysis)는 여전히 한 곳에만
 * 보관한다** — 공고를 바꿔 진단할 때 재분석하지 않고 이 값을 재전송한다
 * (공고 N건 진단 = 이력서 분석 1회 + 공고 분석 N회, §8.5).
 *
 * sessionStorage에 넣는 이유: 라우트 이동은 클라이언트 내비게이션이라 상태가 살아있지만,
 * 새로고침·URL 직접 진입·뒤로가기 복원에서는 죽는다. 그때 첫 화면으로 튕기지 않게 한다.
 * 탭을 닫으면 사라진다 — "회원가입 없이 세션 동안 이용합니다"라는 약속과 같은 수명이다.
 */

const STORAGE_KEY = 'chafit.session.v1';

const EMPTY = {
  analysis: null,
  posting: null,
  report: null,
  profile: null,
  // 새 진단서가 나온 뒤 로드맵을 아직 열어보지 않았는지. 사이드바 알림 점의 근거다.
  roadmapSeen: false,
};

const SessionContext = createContext(null);

function readStored() {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    // 시크릿 모드·저장소 차단 등. 세션 유지를 못 할 뿐 앱은 정상 동작해야 한다.
    return EMPTY;
  }
}

export function SessionProvider({ children }) {
  const [state, setState] = useState(EMPTY);

  // 서버 렌더 결과와 어긋나지 않게, 저장값은 마운트 후에만 읽는다.
  // hydrated 전에는 어떤 페이지도 "데이터 없음"으로 판단해 리다이렉트하면 안 된다.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(readStored());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // 저장 실패는 무시한다 — 화면 상태는 메모리에 이미 있다.
    }
  }, [state, hydrated]);

  const setAnalysis = useCallback((analysis, profile = null) => {
    // 이력서가 바뀌면 그 이력서로 만든 진단서는 더 이상 유효하지 않다.
    setState((s) => ({ ...s, analysis, profile, posting: null, report: null }));
  }, []);

  const setDiagnosis = useCallback((posting, report) => {
    // 진단서가 새로 나왔으니 로드맵은 다시 "안 본 것"이 된다.
    setState((s) => ({ ...s, posting, report, roadmapSeen: false }));
  }, []);

  const markRoadmapSeen = useCallback(() => {
    setState((s) => (s.roadmapSeen ? s : { ...s, roadmapSeen: true }));
  }, []);

  const setPosting = useCallback((posting) => {
    // 파싱은 됐지만 진단이 실패한 경우. 요약(④)은 남기고 진단서만 비운다(§8.6).
    setState((s) => ({ ...s, posting, report: null }));
  }, []);

  const reset = useCallback(() => {
    setState(EMPTY);
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* 위와 같다 */
    }
  }, []);

  const value = useMemo(
    () => ({ ...state, hydrated, setAnalysis, setDiagnosis, setPosting, markRoadmapSeen, reset }),
    [state, hydrated, setAnalysis, setDiagnosis, setPosting, markRoadmapSeen, reset]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession은 SessionProvider 안에서만 쓸 수 있습니다.');
  return ctx;
}
