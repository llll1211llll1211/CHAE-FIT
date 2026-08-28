"use client";

import { useState } from "react";
import styles from "./cover-letter.module.css";

const QUESTIONS = [
  {
    id: "q1",
    label: "문항 1 · 700자",
    title: "지원 동기와 입사 후 목표를 기술해 주세요",
    match: "근거 2건 매칭",
    weak: false,
    evidence: [
      {
        title: "PECVD 박막 증착 실습",
        tag: "공고 요구와 직접 대응",
        quote: "“박막 증착 조건을 바꿔가며 두께 편차를 측정하고 조건별로 정리했습니다”",
        angle: "활용 각도 · 직무를 고른 계기로 1문단에 배치",
      },
      {
        title: "데이터 분석 과제",
        tag: "간접 연결",
        quote: "“측정값 산포를 엑셀로 정리했습니다”",
        angle: "활용 각도 · 준비 과정의 구체적 근거로 2문단",
      },
    ],
    structure:
      "① 조건을 바꿀 때 결과가 달라지는 것을 본 경험 → ② 편차를 어떻게 좁혔는지(공고의 “산포 개선”과 연결) → ③ 아직 비어 있는 SPC를 어떻게 채울지 계획",
  },
  {
    id: "q2",
    label: "문항 2 · 600자",
    title: "팀으로 성과를 만든 경험을 기술해 주세요",
    match: "근거 1건 매칭",
    weak: false,
    evidence: [
      {
        title: "캡스톤 팀 프로젝트",
        tag: "협업 경험 대응",
        quote: "“3인 팀에서 역할을 나눠 공정 조건 실험을 설계했습니다”",
        angle: "활용 각도 · 역할 분담과 갈등 조율 과정을 중심으로 서술",
      },
    ],
    structure:
      "① 팀에서 맡은 역할 → ② 의견이 갈렸던 지점과 조율 방식 → ③ 결과물과 그 과정에서 배운 것",
  },
  {
    id: "q3",
    label: "문항 3 · 500자",
    title: "가장 어려웠던 문제와 해결 방식을 기술해 주세요",
    match: "근거 1건 매칭 · 보강 권장",
    weak: true,
    evidence: [
      {
        title: "교내 공모전",
        tag: "팀 프로젝트 연결 약함",
        quote: "“공모전에 참가해 아이디어를 제안했습니다”",
        angle: "활용 각도 · 구체적인 문제 해결 과정이 아직 드러나지 않음",
      },
    ],
    structure:
      "자격·어학은 아직 없음. 교내 공모전 경험은 문제 해결 과정이 구체적이지 않아 이 문항보다 문항 2에 쓰는 것이 낫습니다.",
  },
];

export default function CoverLetterPage() {
  const [selected, setSelected] = useState(QUESTIONS[0].id);
  const [drafting, setDrafting] = useState(false);
  const [draft, setDraft] = useState("");

  const question = QUESTIONS.find((q) => q.id === selected)!;

  return (
    <div className="wrap">
      <div className="pageHead">
        <div className="pageCrumb">자소서 매핑 · 삼성전자 DS</div>
        <h1 className="pageTitle">문항마다 어떤 경험을 쓸지 정합니다</h1>
        <span className="badge badge-neutral">초안 · 제출용 아님</span>
      </div>

      <div className={styles.grid}>
        <div className={styles.qList}>
          {QUESTIONS.map((q) => (
            <button
              key={q.id}
              type="button"
              className={`${styles.qItem}${selected === q.id ? ` ${styles.qItemActive}` : ""}`}
              onClick={() => {
                setSelected(q.id);
                setDrafting(false);
              }}
            >
              <div className={styles.qMeta}>{q.label}</div>
              <div className={styles.qTitle}>{q.title}</div>
              <span className={`badge ${q.weak ? "badge-warn" : "badge-accent"}`}>{q.match}</span>
            </button>
          ))}
        </div>

        <div className="card">
          <div className={styles.evidenceTitle} style={{ marginBottom: 4 }}>
            {question.label.split(" ")[0]} 근거 매핑
          </div>
          <p className="helper" style={{ marginBottom: 16 }}>이력서·문답에서 가져온 문장</p>

          {question.weak && (
            <div className={styles.weakNotice}>
              보강이 필요한 문항입니다. 아래 근거는 연결이 약하니, 다른
              경험을 추가하거나 문항 2의 내용을 참고하세요.
            </div>
          )}

          {question.evidence.map((ev) => (
            <div className={styles.evidenceRow} key={ev.title}>
              <div>
                <div className={styles.evidenceTitle}>
                  {ev.title} <span className={styles.evidenceTag}>· {ev.tag}</span>
                </div>
                <div className={styles.evidenceQuote}>{ev.quote}</div>
                <div className={styles.evidenceAngle}>{ev.angle}</div>
              </div>
            </div>
          ))}

          <div className={styles.structureBox}>
            <div className={styles.structureLabel}>문단 구조 제안</div>
            {question.structure}
          </div>

          <p className="disclaimer" style={{ marginBottom: 16 }}>
            chafit은 완성된 자기소개서를 대신 쓰지 않습니다. 위 내용은
            문단 구성과 인용할 근거를 제안하는 뼈대이며, 문장은 본인이
            작성해야 합니다.
          </p>

          {!drafting ? (
            <button type="button" className="btn btn-primary" onClick={() => setDrafting(true)}>
              내 문장으로 쓰기
            </button>
          ) : (
            <div className={styles.draftArea}>
              <label className="label" style={{ display: "block", marginBottom: 8 }}>
                {question.title}
              </label>
              <textarea
                className="textarea"
                style={{ minHeight: 160 }}
                placeholder="제안된 구조를 참고해 직접 작성해보세요."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
