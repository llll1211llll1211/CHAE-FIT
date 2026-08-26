import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className="wrap">
      <div className={styles.hero}>
        <span className={styles.eyebrow}>채용 FIT 진단 / 세션 기반, 계정 불필요</span>
        <h1 className={styles.h1}>지금 내 위치를 공고 기준으로 확인합니다</h1>
        <p className={styles.sub}>
          이력서가 있으면 바로 비교하고, 없으면 몇 가지 질문으로 만듭니다.
          어느 쪽이든 결과는 같은 형식의 진단서입니다. 회원가입 없이
          시작합니다.
        </p>
      </div>

      <div className={styles.stats}>
        <span className={styles.statsLabel}>누가 쓰고 있나</span>
        <div className={styles.statItem}>
          <span className={styles.statPct}>58%</span>
          <span className={styles.statText}>2·3학년</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statPct}>31%</span>
          <span className={styles.statText}>4학년·졸업</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statPct}>11%</span>
          <span className={styles.statText}>직무 전환</span>
        </div>
        <span className={styles.statsFoot}>chafit 이용자 412명 기준</span>
      </div>

      <div className={styles.paths}>
        <div className={`${styles.path} ${styles.pathFeatured}`}>
          <div className={styles.pathTag}>02 / 가장 많이 선택</div>
          <div className={styles.pathTitle}>이력서는 아직 없어요</div>
          <p className={styles.pathBody}>
            7개 질문에 답하면 경험이 정리됩니다. 문답 결과가 그대로 첫
            이력서 초안이 됩니다.
          </p>
          <div className={styles.pathMeta}>SESSION ~4MIN · AUTOSAVE</div>
          <Link href="/interview" className="btn btn-primary">
            문답으로 시작
          </Link>
        </div>

        <div className={styles.path}>
          <div className={styles.pathTag}>01</div>
          <div className={styles.pathTitle}>이력서 파일이 있어요</div>
          <p className={styles.pathBody}>PDF·TXT 5MB 이하.</p>
          <Link href="/resume" className="btn btn-ghost btn-sm">
            이력서 올리기
          </Link>
        </div>

        <div className={styles.path}>
          <div className={styles.pathTag}>03</div>
          <div className={styles.pathTitle}>뭘 준비할지 모르겠어요</div>
          <p className={styles.pathBody}>직무 요구 역량 지도부터 봅니다.</p>
          <Link href="/job-map" className="btn btn-ghost btn-sm">
            직무 지도 보기
          </Link>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>이렇게 설계했습니다</div>
        <p className={styles.sectionSub}>
          점수보다 근거를 먼저 보여주는 쪽을 선택했습니다.
        </p>
        <div className={styles.principles}>
          <div className={styles.principle}>
            <div className={styles.principleTitle}>퍼센트 점수 대신 커버리지</div>
            <p className={styles.principleBody}>
              기업 매치율이나 또래 평균 대신, 공고가 요구하는 항목 중 몇
              개를 근거로 입증했는지 보여줍니다.
            </p>
          </div>
          <div className={styles.principle}>
            <div className={styles.principleTitle}>추정치는 추정치라고 표시</div>
            <p className={styles.principleBody}>
              참고용 점수를 보고 싶다면 켤 수 있지만, 항상 추정치 라벨이
              함께 붙고 합격 가능성과는 무관합니다.
            </p>
          </div>
          <div className={styles.principle}>
            <div className={styles.principleTitle}>제휴 없는 추천</div>
            <p className={styles.principleBody}>
              보완 활동을 추천할 때 수수료를 받지 않습니다. 제휴가 생기면
              항목마다 표시를 붙입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
