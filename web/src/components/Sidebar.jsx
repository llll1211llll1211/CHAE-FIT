'use client';

import {
  Briefcase,
  ChartLineUp,
  ChatsCircle,
  CheckSquare,
  ClockCounterClockwise,
  Compass,
  FileText,
  House,
  ListChecks,
  Newspaper,
  NotePencil,
  Star,
  Target,
} from '@phosphor-icons/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Mark from './Mark';
import Mascot from './Mascot';
import styles from './Sidebar.module.css';
import { useSession } from '@/lib/session/SessionContext';

/**
 * 좌측 사이드바 — chafit-signal(이나린) components/Sidebar.tsx 구조 그대로.
 *
 * 그룹·라벨·아이콘·순서를 목업과 동일하게 유지한다. 다만 목업은 정적 화면이라
 * 13개 항목이 전부 열려 있는 반면 이 앱은 그중 일부만 구현돼 있다. 그 차이를
 * 두 가지로 표시한다.
 *   - `requires`가 있는 항목: 앞 단계 데이터가 없으면 잠긴다 (실제 게이트)
 *   - `soon: true` 항목: 아직 만들지 않은 화면. 눌리지 않고 "준비 중"을 붙인다
 *
 * 없는 링크를 살아있는 것처럼 두면 404로 신뢰를 깎는다. 목업의 밀도는 유지하되
 * 무엇이 실제로 동작하는지는 숨기지 않는다.
 */
const GROUPS = [
  {
    label: '시작',
    items: [{ href: '/', label: '시작', icon: House, activeOn: '/' }],
  },
  {
    label: '내 경험 정리',
    items: [
      { href: '/resume', label: '이력서', icon: FileText, activeOn: '/resume' },
      { href: '/resume?mode=manual', label: '문답 정리', icon: ChatsCircle },
      { href: '/job-map', label: '직무 지도', icon: Compass, soon: true },
    ],
  },
  {
    label: '적합도 진단',
    items: [
      { href: '/posting', label: '공고 요약', icon: Newspaper, requires: 'analysis', activeOn: '/posting' },
      { href: '/posting#reportTitle', label: '적합도 진단', icon: Target, requires: 'report' },
      { href: '/gap-report', label: '갭 리포트', icon: ListChecks, soon: true },
    ],
  },
  {
    label: '다음 단계',
    items: [
      { href: '/roadmap', label: '성장 로드맵', icon: ChartLineUp, requires: 'report', activeOn: '/roadmap' },
      { href: '/companies', label: '관심 기업', icon: Star, soon: true },
      { href: '/cover-letter', label: '자소서', icon: NotePencil, soon: true },
      { href: '/portfolio', label: '포트폴리오', icon: Briefcase, soon: true },
    ],
  },
  {
    label: '내 기록',
    items: [
      { href: '/history', label: '진단 이력', icon: ClockCounterClockwise, soon: true },
      { href: '/checklist', label: '체크리스트', icon: CheckSquare, soon: true },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { analysis, report, roadmapSeen, reset } = useSession();

  const met = { analysis: !!analysis, report: !!report };

  function handleReset() {
    reset();
    router.push('/resume');
  }

  return (
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.brand}>
        <Mark size={20} />
        <span>chafit</span>
      </Link>

      <nav className={styles.nav} aria-label="주요 기능">
        {GROUPS.map((group) => (
          <div key={group.label}>
            <div className={styles.groupLabel}>{group.label}</div>
            {group.items.map((item) => {
              const locked = item.soon || (item.requires && !met[item.requires]);
              const active = !locked && item.activeOn === pathname;
              const Icon = item.icon;
              const showDot = item.href === '/roadmap' && !locked && !roadmapSeen;

              if (locked) {
                return (
                  <button
                    key={item.href}
                    type="button"
                    className={`${styles.link} ${styles.linkDisabled}`}
                    disabled
                  >
                    <Icon size={17} weight="regular" />
                    <span>{item.label}</span>
                    <span className={styles.linkNote}>{item.soon ? '준비 중' : '잠김'}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.link} ${active ? styles.linkActive : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon size={17} weight={active ? 'fill' : 'regular'} />
                  <span>{item.label}</span>
                  {showDot && <span className={styles.dot} aria-hidden="true" />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <ScoreCard report={report} />

      {analysis && (
        <button type="button" className={styles.resetBtn} onClick={handleReset}>
          ↺ 새 이력서로 다시 분석
        </button>
      )}

      <div className={styles.foot}>회원가입 없이 세션 동안 이용합니다.</div>
    </aside>
  );
}

/**
 * 커버리지 카드 — 목업의 scoreCard와 같은 자리, 같은 구성(마스코트 + 게이지 + 부제).
 *
 * 다만 숫자의 출처가 다르다. 목업은 고정값이지만 여기서는 실제 진단서의
 * "요구 N개 중 M개 충족"을 쓴다. 요구 역량을 못 뽑은 공고(hasSkillInfo=false)에서는
 * 퍼센트를 만들지 않고 카드를 통째로 숨긴다 — "정보 없음"을 "0%"로 보이게 하지 않는다(§12).
 */
function ScoreCard({ report }) {
  if (!report || !report.hasSkillInfo) return null;

  const { matchedCount = 0, requiredCount = 0 } = report;
  if (!requiredCount) return null;

  const pct = Math.min(100, Math.round((matchedCount / requiredCount) * 100));

  return (
    <Link href="/posting" className={styles.scoreCard}>
      <div className={styles.scoreHead}>
        <Mascot pct={pct} />
        <div className={styles.scoreHeadText}>
          <div className={styles.scoreTop}>
            <span className={styles.scoreLabel}>요구 역량 커버리지</span>
            <span className={styles.scorePct}>{pct}%</span>
          </div>
          <div className={styles.scoreTrack}>
            <div className={styles.scoreFill} style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
      <div className={styles.scoreSub}>
        {requiredCount}개 중 {matchedCount}개 충족
      </div>
    </Link>
  );
}
