import Link from "next/link";
import styles from "./start.module.css";

export default function StartPage() {
  return (
    <div className="wrap">
      <div className="pageHead">
        <div className="pageCrumb">시작 방법 고르기</div>
        <h1 className="pageTitle">어떤 방법으로 시작할까요?</h1>
        <p className="pageSub">
          이력서가 있으면 바로 대조하고, 없으면 몇 가지 질문으로 만듭니다.
          어느 쪽이든 결과는 같은 형식의 진단서입니다.
        </p>
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
    </div>
  );
}
