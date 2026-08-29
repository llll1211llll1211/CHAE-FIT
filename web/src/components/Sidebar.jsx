'use client';

/**
 * 좌측 사이드바 내비게이션.
 *
 * 세 기능을 각각의 "페이지"로 분리해 보여준다 — 스크롤이 아니라 클릭으로 이동.
 * 뒤 단계는 앞 단계 데이터가 없으면 잠긴다(이력서 분석 → 채용공고 진단 → 성장 로드맵).
 * 잠긴 항목도 왜 잠겼는지 이유를 함께 보여준다.
 */
const NAV_ITEMS = [
  { key: 'resume', icon: '📄', title: '이력서 분석', lockedHint: null },
  { key: 'posting', icon: '🧭', title: '채용공고 진단', lockedHint: '이력서 분석 후 이용 가능' },
  { key: 'roadmap', icon: '🗺️', title: '성장 로드맵', lockedHint: '적합도 진단 후 이용 가능' },
];

export default function Sidebar({ activePage, onNavigate, unlocked, done, showRoadmapBadge, showReset, onReset }) {
  return (
    <nav className="sidebar" aria-label="주요 기능">
      <div className="sidebar__brand">
        <span className="logo__mark">C</span>
        <div>
          <div className="logo__title">채피티</div>
          <div className="logo__sub">chafit</div>
        </div>
      </div>

      <ul className="navlist">
        {NAV_ITEMS.map((item, i) => {
          const isUnlocked = unlocked[item.key];
          const isActive = activePage === item.key;
          const isDone = done[item.key];

          return (
            <li key={item.key}>
              <button
                type="button"
                className={`navitem${isActive ? ' is-active' : ''}`}
                disabled={!isUnlocked}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onNavigate(item.key)}
              >
                <span className="navitem__no" aria-hidden="true">{i + 1}</span>
                <span className="navitem__icon" aria-hidden="true">{item.icon}</span>
                <span className="navitem__body">
                  <span className="navitem__title">{item.title}</span>
                  <span className="navitem__meta">
                    {isUnlocked ? (isDone ? '완료' : '진행 중') : item.lockedHint}
                  </span>
                </span>
                {isDone && <span className="navitem__check" aria-hidden="true">✓</span>}
                {item.key === 'roadmap' && showRoadmapBadge && (
                  <span className="navitem__dot" aria-hidden="true" />
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {showReset && (
        <button type="button" className="sidebar__reset" onClick={onReset}>
          ↺ 새 이력서로 다시 분석
        </button>
      )}

      <p className="sidebar__footer">
        chafit = 채용(job) + fit
        <br />
        이 공고와 나, 근거로 답해요.
      </p>
    </nav>
  );
}
