import Link from 'next/link';

/**
 * 랜딩 (/) — chafit-signal(이나린) 홈 화면 이식.
 *
 * 이나린 브랜치의 app/page.tsx가 원본이다. 히어로 · 이용자 통계 · 3-path 진입 카드 ·
 * 설계 원칙 3종 구성을 그대로 옮기되, 링크만 이 앱의 실제 라우트로 바꿨다.
 *
 * 서버 컴포넌트다 — 여기에는 상태가 없다. 세션이 필요한 화면은 /resume부터다.
 */
export default function Landing() {
  return (
    <main className="landing">
      <div className="landing__inner">
        <section className="hero">
          <span className="hero__eyebrow">채용 FIT 진단 / 세션 기반, 계정 불필요</span>
          <h1 className="hero__h1">지금 내 위치를 공고 기준으로 확인합니다</h1>
          <p className="hero__sub">
            이력서가 있으면 바로 비교하고, 없으면 몇 가지 질문으로 만듭니다. 어느 쪽이든
            결과는 같은 형식의 진단서입니다. 회원가입 없이 시작합니다.
          </p>
        </section>

        <section className="stats" aria-label="이용자 구성">
          <span className="stats__label">누가 쓰고 있나</span>
          <div className="stats__item">
            <span className="stats__pct">58%</span>
            <span className="stats__text">2·3학년</span>
          </div>
          <div className="stats__item">
            <span className="stats__pct">31%</span>
            <span className="stats__text">4학년·졸업</span>
          </div>
          <div className="stats__item">
            <span className="stats__pct">11%</span>
            <span className="stats__text">직무 전환</span>
          </div>
          <span className="stats__foot">CHAE-FIT 이용자 412명 기준</span>
        </section>

        <section className="paths" aria-label="시작 방법">
          <div className="path path--featured">
            <div className="path__tag">02 / 가장 많이 선택</div>
            <div className="path__title">이력서는 아직 없어요</div>
            <p className="path__body">
              몇 가지 질문에 답하면 경험이 정리됩니다. 문답 결과가 그대로 첫 이력서 초안이
              됩니다.
            </p>
            <div className="path__meta">SESSION ~4MIN · NO SIGNUP</div>
            <Link href="/resume?mode=manual" className="btn btn-primary">
              문답으로 시작
            </Link>
          </div>

          <div className="path">
            <div className="path__tag">01</div>
            <div className="path__title">이력서 파일이 있어요</div>
            <p className="path__body">PDF·TXT 5MB 이하.</p>
            <Link href="/resume?mode=upload" className="btn btn-ghost btn-sm">
              이력서 올리기
            </Link>
          </div>

          <div className="path">
            <div className="path__tag">03</div>
            <div className="path__title">뭘 준비할지 모르겠어요</div>
            <p className="path__body">어떤 방법이 맞는지부터 고릅니다.</p>
            <Link href="/start" className="btn btn-ghost btn-sm">
              시작 방법 보기
            </Link>
          </div>
        </section>

        <section className="section">
          <div className="section__title">이렇게 설계했습니다</div>
          <p className="section__sub">점수보다 근거를 먼저 보여주는 쪽을 선택했습니다.</p>
          <div className="principles">
            <div className="principle">
              <div className="principle__title">퍼센트 점수 대신 커버리지</div>
              <p className="principle__body">
                기업 매치율이나 또래 평균 대신, 공고가 요구하는 항목 중 몇 개를 근거로
                입증했는지 보여줍니다.
              </p>
            </div>
            <div className="principle">
              <div className="principle__title">추정치는 추정치라고 표시</div>
              <p className="principle__body">
                참고용 점수를 보고 싶다면 켤 수 있지만, 항상 추정치 라벨이 함께 붙고 합격
                가능성과는 무관합니다.
              </p>
            </div>
            <div className="principle">
              <div className="principle__title">제휴 없는 추천</div>
              <p className="principle__body">
                보완 활동을 추천할 때 수수료를 받지 않습니다. 제휴가 생기면 항목마다 표시를
                붙입니다.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
