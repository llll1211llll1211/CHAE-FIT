import Link from 'next/link';

/**
 * /start — 시작 방법 고르기.
 *
 * chafit-signal(이나린)의 3-path 블록을 독립 라우트로 옮긴 화면이다. 랜딩에서
 * "뭘 준비할지 모르겠어요"를 고른 사람이 도착한다. 세 갈래 모두 /resume으로 모이고,
 * 어느 쪽이든 결과는 같은 형식의 진단서라는 점을 여기서 한 번 더 말한다.
 */
export default function StartPage() {
  return (
    <>
      <section className="pagehead">
        <span className="pagehead__eyebrow">시작 방법 고르기</span>
        <h1 className="pagehead__title">어떤 방법으로 시작할까요?</h1>
        <p className="pagehead__desc">
          이력서가 있으면 바로 대조하고, 없으면 몇 가지 질문으로 만듭니다. 어느 쪽이든
          결과는 같은 형식의 진단서입니다.
        </p>
      </section>

      <section className="paths" aria-label="시작 방법">
        <div className="path path--featured">
          <div className="path__tag">02 / 가장 많이 선택</div>
          <div className="path__title">이력서는 아직 없어요</div>
          <p className="path__body">
            경력·활동을 직접 입력하면 그대로 첫 이력서 초안이 됩니다. 파일이 없어도 진단을
            시작할 수 있습니다.
          </p>
          <div className="path__meta">SESSION ~4MIN · NO SIGNUP</div>
          <Link href="/resume?mode=manual" className="btn btn-primary">
            직접 입력으로 시작
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
          <div className="path__title">일단 둘러볼래요</div>
          <p className="path__body">두 방법을 나란히 놓고 고릅니다.</p>
          <Link href="/resume" className="btn btn-ghost btn-sm">
            선택 화면으로
          </Link>
        </div>
      </section>
    </>
  );
}
