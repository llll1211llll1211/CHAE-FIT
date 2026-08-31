"use client";

import { useState } from "react";
import FieldSwitcher from "@/components/FieldSwitcher";
import { useTargetField } from "@/lib/targetField";
import styles from "./job-map.module.css";

const TABS = ["요구 역량 지도", "준비 순서", "공고 예시"] as const;

export default function JobMapPage() {
  const field = useTargetField();
  const [tab, setTab] = useState<(typeof TABS)[number]>("요구 역량 지도");

  return (
    <div className="wrap">
      <div className="pageHead">
        <div className="pageCrumb">직무 지도</div>
        <h1 className="pageTitle">{field.label} 요구 역량 지도</h1>
        <p className="pageSub">{field.jobMap.headerNote}</p>
      </div>

      <FieldSwitcher />

      <div className={styles.topRow}>
        <span className={styles.targetBadge}>
          목표 직무 <span className="faint">·</span> {field.label}
        </span>
      </div>

      <div className={styles.tabs}>
        {TABS.map((t) => (
          <div
            key={t}
            className={`${styles.tab}${tab === t ? ` ${styles.tabActive}` : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </div>
        ))}
      </div>

      {tab === "요구 역량 지도" && (
        <div>
          {field.jobMap.tiers.map((tier) => (
            <div className={`${styles.tierGroup} ${styles[tier.key]}`} key={tier.key}>
              <div className={styles.tierHead}>
                <span className={styles.tierNum}>{tier.label.slice(0, 2)}</span>
                <span className={styles.tierLabel}>{tier.label.slice(3)}</span>
              </div>
              <div className={styles.tierRows}>
                {tier.items.map((item) => (
                  <div className={styles.tierRow} key={item.title}>
                    <span className={styles.tierRowTitle}>{item.title}</span>
                    <span className={styles.tierRowCount}>
                      {field.jobMap.totalPostings > 0
                        ? `${field.jobMap.totalPostings}건 중 ${item.count}건`
                        : item.note}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className={styles.ctaBar}>
            <span className={styles.ctaText}>이 중 내가 이미 한 것을 표시해볼까요</span>
            <a href="/interview" className="btn btn-primary btn-sm">
              내 경험 표시하기
            </a>
          </div>
        </div>
      )}

      {tab === "준비 순서" && (
        <div className="card">
          <div className={styles.orderSteps}>
            {field.jobMap.orderSteps.map((step, i) => (
              <div className={styles.orderStep} key={step.title}>
                <span className={styles.orderIndex}>{i + 1}</span>
                <div>
                  <div className={styles.orderTitle}>{step.title}</div>
                  <p className={styles.orderBody}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "공고 예시" && (
        <div>
          <p className={styles.methodNote}>
            실제 공개 채용공고에서 자주 등장하는 표현을 재구성한 예시입니다.
            특정 기업의 실제 공고가 아닙니다.
          </p>
          <div className={styles.exampleBlock}>{field.jobMap.examplePosting}</div>
        </div>
      )}
    </div>
  );
}
