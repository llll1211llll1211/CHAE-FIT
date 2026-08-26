"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FIELD_PRESETS } from "@/lib/jobFields";
import { setTargetField } from "@/lib/targetField";
import styles from "./interview.module.css";

type Question = {
  key: string;
  label: string;
  title: string;
  hint: string;
  type: "chips-single" | "chips-multi-sentence" | "text";
  options?: string[];
  summaryLabel: string;
};

const QUESTIONS: Question[] = [
  {
    key: "major",
    label: "질문 1 / 7",
    title: "전공을 알려주세요",
    hint: "정확한 학과명이 아니어도 괜찮습니다.",
    type: "text",
    summaryLabel: "전공",
  },
  {
    key: "status",
    label: "질문 2 / 7",
    title: "지금 상태에 가까운 것을 골라주세요",
    hint: "가장 가까운 하나만 고르면 됩니다.",
    type: "chips-single",
    options: ["1·2학년", "3학년", "4학년", "졸업 준비", "직무 전환"],
    summaryLabel: "상태",
  },
  {
    key: "experience",
    label: "질문 3 / 7",
    title: "수업이나 동아리에서 끝까지 해본 것을 골라주세요",
    hint: "완성도는 상관없습니다. 고른 항목이 나중에 공고의 요구 항목과 대조됩니다. 해당되는 것이 없으면 넘기세요.",
    type: "chips-multi-sentence",
    options: [
      "공정 실습 · 장비 실습",
      "데이터 분석 과제",
      "캡스톤 · 팀 프로젝트",
      "학회 · 연구실",
      "인턴",
      "교내 공모전",
      "자격증 준비",
      "아르바이트 · 현장 경험",
      "해당 없음",
    ],
    summaryLabel: "경험",
  },
  {
    key: "target",
    label: "질문 4 / 7",
    title: "목표 산업이나 직무를 골라주세요",
    hint: "목록에 없다면 하단의 직무 지도·진단서 화면에서 직접 입력할 수 있습니다.",
    type: "chips-single",
    options: [...FIELD_PRESETS.map((f) => f.label), "아직 미정"],
    summaryLabel: "목표",
  },
  {
    key: "certificate",
    label: "질문 5 / 7",
    title: "준비 중이거나 취득한 자격·어학이 있나요",
    hint: "여러 개를 고를 수 있습니다.",
    type: "chips-multi-sentence",
    options: ["기사·산업기사", "품질경영기사", "토익·토스", "관련 자격 없음"],
    summaryLabel: "자격·어학",
  },
  {
    key: "internship",
    label: "질문 6 / 7",
    title: "인턴이나 현장 실습 경험이 있나요",
    hint: "짧은 기간이어도 괜찮습니다.",
    type: "chips-single",
    options: ["있음", "없음", "현재 지원 중"],
    summaryLabel: "현장 경험",
  },
  {
    key: "worry",
    label: "질문 7 / 7",
    title: "지금 가장 걱정되는 것은 무엇인가요",
    hint: "마지막 질문입니다.",
    type: "chips-single",
    options: ["경험 부족", "방향이 불확실함", "자기소개서 작성", "정보 부족"],
    summaryLabel: "고민",
  },
];

type Answer = { choices: string[]; sentence: string };

export default function InterviewPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [done, setDone] = useState(false);

  const question = QUESTIONS[step];
  const current = answers[question?.key] ?? { choices: [], sentence: "" };

  const canProceed =
    question?.type === "text"
      ? current.sentence.trim().length > 0
      : current.choices.length > 0;

  function setChoice(key: string, value: string, multi: boolean) {
    setAnswers((prev) => {
      const prevAnswer = prev[key] ?? { choices: [], sentence: "" };
      let choices: string[];
      if (multi) {
        choices = prevAnswer.choices.includes(value)
          ? prevAnswer.choices.filter((c) => c !== value)
          : [...prevAnswer.choices, value];
      } else {
        choices = [value];
      }
      return { ...prev, [key]: { ...prevAnswer, choices } };
    });

    if (key === "target") {
      const preset = FIELD_PRESETS.find((f) => f.label === value);
      if (preset) setTargetField(preset.id);
    }
  }

  function setSentence(key: string, value: string) {
    setAnswers((prev) => ({
      ...prev,
      [key]: { choices: prev[key]?.choices ?? [], sentence: value },
    }));
  }

  function handleNext() {
    if (step === QUESTIONS.length - 1) {
      sessionStorage.setItem("chafit:interview", JSON.stringify(answers));
      setDone(true);
      return;
    }
    setStep((s) => Math.min(s + 1, QUESTIONS.length - 1));
  }

  function handlePrev() {
    setStep((s) => Math.max(s - 1, 0));
  }

  const summaryItems = useMemo(() => {
    return QUESTIONS.slice(0, step + (done ? 0 : 1)).map((q) => {
      const a = answers[q.key];
      if (!a) return null;
      const text = a.sentence || a.choices.join(", ");
      if (!text) return null;
      return { label: q.summaryLabel, value: text };
    }).filter(Boolean) as { label: string; value: string }[];
  }, [answers, step, done]);

  if (done) {
    return (
      <div className="wrap">
        <div className="card" style={{ maxWidth: 560, margin: "40px auto" }}>
          <div className={styles.doneWrap}>
            <div className={styles.doneTitle}>정리가 끝났습니다</div>
            <p className={styles.doneBody}>
              답변이 이력서 초안과 역량 커버리지로 정리되었습니다. 이제
              채용공고를 입력하면 적합도를 확인할 수 있습니다.
            </p>
            <a href="/posting" className="btn btn-primary">
              채용공고 입력하러 가기
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <div className={styles.topRow}>
        <span className={styles.progressText}>
          경험 정리 {step + 1} / {QUESTIONS.length} · 중간 저장됨
        </span>
        <a href="/job-map" className={styles.skipLink}>
          건너뛰고 직무 지도 보기
        </a>
      </div>
      <div className={styles.track}>
        <div
          className={styles.trackFill}
          style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      <div className={styles.grid}>
        <div className="card">
          <div className={styles.qLabel}>{question.label}</div>
          <div className={styles.qTitle}>{question.title}</div>
          <p className={styles.qHint}>{question.hint}</p>

          {question.type === "text" && (
            <input
              className="textInput"
              placeholder="예: 신소재공학"
              value={current.sentence}
              onChange={(e) => setSentence(question.key, e.target.value)}
              style={{ marginBottom: 22 }}
            />
          )}

          {question.type === "chips-single" && (
            <div className={styles.chips}>
              {question.options?.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`${styles.chip}${current.choices.includes(opt) ? ` ${styles.chipActive}` : ""}`}
                  onClick={() => setChoice(question.key, opt, false)}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {question.type === "chips-multi-sentence" && (
            <>
              <div className={styles.chips}>
                {question.options?.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`${styles.chip}${current.choices.includes(opt) ? ` ${styles.chipActive}` : ""}`}
                    onClick={() => setChoice(question.key, opt, true)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <label className="label" style={{ display: "block", marginBottom: 8 }}>
                고른 것 중 하나만 한 문장으로 · 무엇을, 어떤 도구로, 결과는
              </label>
              <textarea
                className="textarea"
                placeholder="예: 학과 실습/프로젝트에서 특정 도구나 방법으로 문제를 다루고, 결과를 어떤 방식으로 정리했는지 적어보세요."
                value={current.sentence}
                onChange={(e) => setSentence(question.key, e.target.value)}
              />
              <p className={styles.sentenceHint}>
                이 문장이 진단서의 근거로 그대로 인용됩니다. 다듬는 건 나중에 해도 됩니다.
              </p>
            </>
          )}

          <div className={styles.navRow}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={handlePrev} disabled={step === 0}>
              이전
            </button>
            <div className={styles.navSpacer} />
            <button type="button" className="btn btn-ghost btn-sm" onClick={handleNext}>
              건너뛰기
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={handleNext} disabled={!canProceed}>
              {step === QUESTIONS.length - 1 ? "정리 끝내기" : "다음"}
            </button>
          </div>
        </div>

        <div className={`card ${styles.summaryCard}`}>
          <div className={styles.summaryTitle}>지금까지 모인 것</div>
          {summaryItems.length === 0 && (
            <p className={styles.summaryEmpty}>답변을 시작하면 여기에 정리됩니다.</p>
          )}
          {summaryItems.map((item) => (
            <div className={styles.summaryRow} key={item.label}>
              <span className={styles.summaryKey}>{item.label}</span>
              <span className={styles.summaryVal}>{item.value}</span>
            </div>
          ))}
          <p className={styles.summaryFoot}>
            7문항을 마치면 이 목록이 이력서 초안과 역량 커버리지로
            정리됩니다. 문답 내용은 분석을 위해 외부 AI 수탁사로
            전달되며(국외 이전 포함), 세션 종료 시 삭제됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
