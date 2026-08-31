'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import styles from './Sidebar.module.css';

/**
 * 랜딩(/)에서는 사이드바를 숨긴다.
 *
 * 아직 아무 데이터도 없는 사람에게 잠긴 단계를 먼저 보여줄 이유가 없다.
 * chafit-signal의 AppShell과 같은 판단이다.
 *
 * 사이드바는 position:fixed라 콘텐츠가 margin-left로 자리를 비운다(원본 .content).
 * 그래서 flex 셸이 필요 없다.
 */
export default function AppShell({ children }) {
  const pathname = usePathname();

  if (pathname === '/') return children;

  return (
    <>
      <Sidebar />
      <div className={styles.content}>
        <div className="content__inner">{children}</div>
      </div>
    </>
  );
}
