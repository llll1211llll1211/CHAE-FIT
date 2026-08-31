'use client';

import { useEffect } from 'react';
import CareerOutlook from '@/components/CareerOutlook';
import { useSession } from '@/lib/session/SessionContext';
import { useStepGuard } from '@/lib/session/useStepGuard';

/**
 * STEP 3 — 성장 로드맵 (경력공고 비교).
 *
 * 진단서(report)가 있어야 의미가 있는 화면이다. 없이 들어오면 useStepGuard가
 * /posting으로 되돌린다.
 */
export default function RoadmapPage() {
  const { analysis, posting, markRoadmapSeen } = useSession();
  const { ready } = useStepGuard('report');

  // 열어본 순간 사이드바의 알림 점을 끈다.
  useEffect(() => {
    if (ready) markRoadmapSeen();
  }, [ready, markRoadmapSeen]);

  if (!ready) return null;

  return (
    <>
      <section className="pagehead">
        <span className="pagehead__eyebrow">STEP 3</span>
        <h1 className="pagehead__title">성장 로드맵</h1>
        <p className="pagehead__desc">
          입사 후 이 팀에 자연스럽게 적응하려면 다음에 뭐가 필요할지, 경력직 공고를 기준으로
          보여드려요.
        </p>
      </section>

      <div className="stack">
        <CareerOutlook analysis={analysis} posting={posting} />
      </div>
    </>
  );
}
