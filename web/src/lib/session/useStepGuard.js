'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSession } from './SessionContext';

/**
 * 앞 단계 데이터 없이 뒤 단계 URL로 직접 들어온 경우 되돌린다.
 *
 * 사이드바는 잠긴 항목을 눌리지 않게 막지만, 주소창 직접 입력·북마크·뒤로가기는
 * 막지 못한다. 그 경우 빈 화면 대신 필요한 단계로 보낸다.
 *
 * hydrated 이전에는 판단하지 않는다 — sessionStorage를 읽기 전에는 데이터가
 * 없는 것처럼 보이기 때문이다. 그때 리다이렉트하면 새로고침마다 첫 화면으로 튕긴다.
 *
 * @param {'analysis'|'report'} requires 이 페이지가 있어야 동작하는 값
 * @returns {{ready: boolean}} 렌더해도 되는지 여부
 */
export function useStepGuard(requires) {
  const session = useSession();
  const router = useRouter();

  const has = requires === 'report' ? !!session.report : !!session.analysis;
  const ready = session.hydrated && has;

  useEffect(() => {
    if (!session.hydrated || has) return;
    router.replace(requires === 'report' ? '/posting' : '/resume');
  }, [session.hydrated, has, requires, router]);

  return { ready };
}
