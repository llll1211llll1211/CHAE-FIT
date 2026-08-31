"use client";

import { useState } from "react";
import { Check } from "@phosphor-icons/react";
import { addChecklistItem } from "@/lib/checklist";
import styles from "./gap-report.module.css";

const OPTIONS = [
  {
    kind: "교내 · 무료 · 제휴 아님",
    title: "공정데이터 분석 스터디",
    meta: "4주 · 주 1회",
    reason: "고른 이유 · 이미 있는 실습 데이터를 그대로 쓸 수 있음",
  },
  {
    kind: "자격 · 응시료 · 제휴 아님",
    title: "품질경영기사 통계 과목",
    meta: "1학기 · 다음 시험 11월",
    reason: "고른 이유 · 공고 240건 중 57건이 관련 자격을 우대로 명시",
  },
  {
    kind: "추천 · 무료",
    title: "연구실 학부 인턴",
    meta: "1~2학기",
    reason: "고른 이유 · 장비 실습과 산포 개선 두 항목이 동시에 채워지는 유일한 경로",
  },
];

function AddButton({ title, meta, from }: { title: string; meta: string; from: string }) {
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      className="btn btn-ghost btn-sm"
      disabled={added}
      onClick={() => {
        addChecklistItem({ title, meta, addedFrom: from });
        setAdded(true);
      }}
    >
      {added ? (
        <>
          <Check size={15} weight="bold" />
          담았어요
        </>
      ) : (
        "담기"
      )}
    </button>
  );
}

export default function GapReportPage() {
  return (
    <div className="wrap">
      <div className={styles.headRow}>
        <div>
          <div className="pageCrumb">갭 리포트 · 삼성전자 DS 진단서에서 이어짐</div>
          <h1 className="pageTitle">비어 있는 4개 항목</h1>
        </div>
        <span className="badge badge-good">제휴 없음 · 수수료 받지 않습니다</span>
      </div>
      <p className={styles.introText}>
        각 항목에 대해 &ldquo;지금 글로 보완할 것&rdquo;과 &ldquo;실제로 해야 할
        것&rdquo;을 나눴습니다. 앞쪽은 오늘 끝나고, 뒤쪽은 학기 단위입니다.
      </p>

      <div className={styles.itemBlock}>
        <div className={styles.itemHead}>
          <span className={styles.itemNum}>1</span>
          <span className={styles.itemTitle}>산포 개선 경험 · 파이썬 산출물</span>
          <span className="badge badge-bad">우선순위 높음</span>
        </div>
        <p className={styles.itemSub}>둘 다 이미 한 실습에서 나올 수 있는 항목입니다</p>

        <div className={styles.twoCol}>
          <div className={styles.actionCard}>
            <div className={styles.actionLabel}>오늘 가능 · 글로 보완</div>
            <div className={styles.actionTitle}>측정에서 판단으로 문장 늘리기</div>
            <p className={styles.actionBody}>
              조건 3가지를 비교해 편차가 가장 작은 조건을 골랐다면, 그
              판단 과정을 한 문장으로 적으세요.
            </p>
            <a href="/interview" className="btn btn-ghost btn-sm" style={{ alignSelf: "flex-start" }}>
              문장 다듬기
            </a>
          </div>
          <div className={styles.actionCard}>
            <div className={styles.actionLabel}>2~4주 · 실제로 할 것</div>
            <div className={styles.actionTitle}>실습 데이터를 파이썬으로 재정리</div>
            <p className={styles.actionBody}>
              새 활동 없이 기존 데이터로 조건별 편차 그래프와 요약 한 장을
              남기면 항목이 채워집니다.
            </p>
            <AddButton
              title="실습 데이터를 파이썬으로 재정리"
              meta="2~4주"
              from="갭 리포트 · 산포 개선"
            />
          </div>
        </div>
      </div>

      <div className={styles.itemBlock}>
        <div className={styles.itemHead}>
          <span className={styles.itemNum}>2</span>
          <span className={styles.itemTitle}>SPC · DOE 를 채우는 경로</span>
          <span className="badge badge-neutral">우선순위 보통</span>
        </div>
        <p className={styles.itemSub}>우대 항목 · 학기 단위로 봅니다</p>

        <div className={styles.optionsRow}>
          {OPTIONS.map((opt) => (
            <div className={styles.optionCard} key={opt.title}>
              <div className={styles.optionKind}>{opt.kind}</div>
              <div className={styles.optionTitle}>{opt.title}</div>
              <div className={styles.optionMeta}>{opt.meta}</div>
              <p className={styles.optionReason}>{opt.reason}</p>
              <AddButton title={opt.title} meta={opt.meta} from="갭 리포트 · SPC·DOE" />
            </div>
          ))}
        </div>
      </div>

      <p className={styles.footNote}>
        추천은 공고에 나타난 요구 항목과의 연결만 근거로 합니다. chafit은
        위 항목으로 수익을 얻지 않으며, 제휴가 생기면 각 항목에 &ldquo;유료
        제휴&rdquo; 표시가 붙습니다. 특정 교육기관·자격증의 효과나 합격을
        보장하지 않습니다.
      </p>
    </div>
  );
}
