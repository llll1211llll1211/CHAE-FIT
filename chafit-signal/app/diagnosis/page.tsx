"use client";

import { useState } from "react";
import { CheckCircle, WarningCircle, DownloadSimple, ArrowsClockwise } from "@phosphor-icons/react";
import FieldSwitcher from "@/components/FieldSwitcher";
import { useTargetField } from "@/lib/targetField";
import styles from "./diagnosis.module.css";

export default function DiagnosisPage() {
  const field = useTargetField();
  const [showRef, setShowRef] = useState(false);

  return (
    <div className="wrap">
      <FieldSwitcher />

      <div className={styles.header}>
        <div>
          <div className="pageCrumb">적합도 진단서 · 2026.08.21</div>
          <h1 className="pageTitle">
            {field.diagnosis.company} · {field.label}
          </h1>
        </div>
        <div className={styles.headActions}>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => window.print()}>
            <DownloadSimple size={16} />
            PDF로 저장
          </button>
          <a href="/posting" className="btn btn-ghost btn-sm">
            <ArrowsClockwise size={16} />
            다른 공고로 진단
          </a>
        </div>
      </div>

      <div className="notice notice-warn" style={{ marginBottom: 24 }}>
        <WarningCircle size={18} weight="fill" style={{ flexShrink: 0, marginTop: 1 }} />
        <span>
          이 결과는 공개된 공고 텍스트를 기준으로 한 chafit의 추정이며, 해당
          기업의 실제 평가 기준·배점·합격 가능성과 무관합니다. chafit은
          해당 기업과 제휴 관계가 없습니다.
        </span>
      </div>

      <div className={`card ${styles.statsPanel}`}>
        <div className={styles.coverageBlock}>
          <div className={styles.coverageNum}>
            {field.diagnosis.coverage.split("/")[0]}
            <span>/{field.diagnosis.coverage.split("/")[1]}</span>
          </div>
          <div className="badge badge-good" style={{ alignSelf: "flex-start" }}>
            필수 요건 대부분 충족
          </div>
          <div className={styles.coverageLabel}>요구 항목 커버리지</div>
        </div>
        <div className={styles.breakdown}>
          <div className={styles.breakdownRow}>
            <span>필수 요건</span>
            <strong>{field.diagnosis.requiredBreakdown}</strong>
          </div>
          <div className={styles.breakdownRow}>
            <span>우대 항목</span>
            <strong>{field.diagnosis.preferredBreakdown}</strong>
          </div>
        </div>
      </div>

      <div
        className={styles.refScoreToggle}
        onClick={() => setShowRef((v) => !v)}
        role="button"
        tabIndex={0}
      >
        <span className={`${styles.switch}${showRef ? ` ${styles.switchOn}` : ""}`}>
          <span className={styles.switchKnob} />
        </span>
        참고 점수 보기
      </div>

      {showRef && (
        <div className={`card ${styles.refScoreCard}`}>
          <div>
            <div className={styles.refScoreNum}>{field.diagnosis.refScore}점</div>
          </div>
          <div className={styles.refScoreText}>
            <span className="badge badge-warn" style={{ marginBottom: 6, display: "inline-flex" }}>
              추정치 · chafit 내부 계산
            </span>
            <div>기업 간 비교나 합격 가능성 예측에 쓸 수 없습니다.</div>
          </div>
        </div>
      )}

      <div className={styles.sectionTitle}>근거가 확인된 항목</div>
      <div className={styles.sectionSub}>이력서 문장에서 추출</div>
      <div className={styles.evidenceList}>
        {field.diagnosis.evidence.map((item) => (
          <div className={styles.evidenceRow} key={item.title}>
            <CheckCircle size={20} weight="fill" style={{ color: "var(--good)", flexShrink: 0, marginTop: 2 }} />
            <div>
              <div className={styles.evidenceTitle}>
                {item.title} <span style={{ fontWeight: 500, color: "var(--ink-faint)" }}>· {item.tag}</span>
              </div>
              <div className={styles.evidenceQuote}>{item.quote}</div>
              <div className={styles.evidenceSource}>{item.source}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.sectionTitle}>확인이 필요한 항목</div>
      <div className={styles.sectionSub}>
        &ldquo;근거 없음&rdquo;은 역량이 없다는 뜻이 아니라, 이력서 문장에서 확인할 수 없었다는 뜻입니다.
      </div>
      <div className={styles.reviewList}>
        {field.diagnosis.needsReview.map((item) => (
          <div className={styles.reviewRow} key={item.title}>
            <div className={styles.reviewHead}>
              <WarningCircle size={18} weight="fill" style={{ color: "var(--warn)" }} />
              <span className={styles.reviewTitle}>{item.title}</span>
              <span className={`badge ${item.kind === "필수" ? "badge-bad" : "badge-neutral"}`}>
                {item.kind}
              </span>
            </div>
            <p className={styles.reviewBody}>{item.body}</p>
            <a href={item.href} className="btn btn-ghost btn-sm">
              {item.action}
            </a>
          </div>
        ))}
      </div>

      <div className={styles.footCta}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
            부족한 항목을 어떻게 채울지 볼까요
          </div>
          <div className={styles.footCtaSub}>오늘 할 수 있는 것과 학기 단위로 할 것을 나눠 보여줍니다.</div>
        </div>
        <a href="/gap-report" className="btn" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}>
          갭 리포트 보기
        </a>
      </div>
    </div>
  );
}
