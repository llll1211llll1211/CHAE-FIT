"use client";

import { useState } from "react";
import FieldSwitcher from "@/components/FieldSwitcher";
import { useTargetField } from "@/lib/targetField";
import styles from "./competitiveness.module.css";

export default function CompetitivenessPage() {
  const field = useTargetField();
  const [mode, setMode] = useState<"thickness" | "freq">("thickness");

  return (
    <div className="wrap">
      <FieldSwitcher />

      <div className="pageHead">
        <div className="pageCrumb">경쟁력 비교</div>
        <h1 className="pageTitle">{field.label} 요구사항 대비 내 위치</h1>
        <p className="pageSub">
          다른 지원자나 또래와 비교하지 않습니다. 비교 대상은 공고에 적힌
          요구사항뿐입니다. 막대는 이력서에서 확인된 근거의 두께이며 실력
          점수가 아닙니다.
        </p>
      </div>

      <div className={styles.tabs}>
        <div
          className={`${styles.tab}${mode === "thickness" ? ` ${styles.tabActive}` : ""}`}
          onClick={() => setMode("thickness")}
        >
          내 근거 두께
        </div>
        <div
          className={`${styles.tab}${mode === "freq" ? ` ${styles.tabActive}` : ""}`}
          onClick={() => setMode("freq")}
        >
          공고 등장 빈도
        </div>
      </div>

      <div className={styles.rows}>
        {field.competitiveness.items.map((item) => (
          <div className={styles.row} key={item.title}>
            <span className={styles.rowTitle}>{item.title}</span>
            <div className={styles.barTrack}>
              <div
                className={`${styles.bar} ${item.evidence ? styles.barGood : styles.barBad}`}
                style={{ width: `${mode === "thickness" ? item.thickness : item.freq}%` }}
              />
            </div>
            <span className={styles.rowMeta}>
              {item.evidence ? "근거 있음" : "근거 없음"} · 공고 {item.freq}%
            </span>
          </div>
        ))}
      </div>

      <div className={styles.bottomGrid}>
        <div className="card">
          <div className={styles.bottomTitle}>지금 상태</div>
          <p className={styles.bottomBody}>
            자주 나오는 항목은 대부분 근거 있음. 비어 있는 항목은 절반
            정도의 공고에만 나옵니다.
          </p>
        </div>
        <div className="card">
          <div className={styles.bottomTitle}>3학년 2학기에 할 것</div>
          <div className={styles.bottomBody}>
            <ol>
              <li>실습·프로젝트 산출물 정리 (2주)</li>
              <li>비어 있는 항목을 스터디로 채우기 (1학기)</li>
              <li>4학년 1학기에 재진단</li>
            </ol>
          </div>
        </div>
        <div className="card">
          <div className={styles.bottomTitle}>2~3년 뒤</div>
          <p className={styles.bottomBody}>
            지금 3학년이면 이 지도를 여섯 학기 동안 씁니다. 항목이 채워지는
            순서가 그대로 준비 기록이 됩니다.
          </p>
        </div>
      </div>

      <p className={styles.refNote}>참고 지표 · 가중 커버리지 {field.competitiveness.refScore} · 추정치</p>
    </div>
  );
}
