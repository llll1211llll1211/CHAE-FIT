"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FieldSwitcher from "@/components/FieldSwitcher";
import { useTargetField } from "@/lib/targetField";
import styles from "./posting.module.css";

export default function PostingPage() {
  const router = useRouter();
  const field = useTargetField();
  const [inputTab, setInputTab] = useState<"text" | "link">("text");
  const [postingText, setPostingText] = useState("");
  const [linkText, setLinkText] = useState("");
  const [ready, setReady] = useState(false);
  const [tags, setTags] = useState(field.posting.tags);

  useEffect(() => {
    setTags(field.posting.tags);
    setReady(false);
  }, [field.id, field.label]);

  function handleSummarize() {
    setReady(true);
  }

  function toggleTag(index: number) {
    setTags((prev) =>
      prev.map((t, i) => (i === index ? { ...t, required: !t.required } : t))
    );
  }

  function handleUseForDiagnosis() {
    sessionStorage.setItem(
      "chafit:posting",
      JSON.stringify({ text: postingText || field.jobMap.examplePosting, tags })
    );
    router.push("/diagnosis");
  }

  return (
    <div className="wrap">
      <FieldSwitcher />

      <div className="pageHead">
        <div className="pageCrumb">공고 전처리</div>
        <h1 className="pageTitle">긴 채용공고를 세 줄로 정리합니다</h1>
        <p className="pageSub">
          본문을 붙여넣거나 기업 채용 페이지 링크를 입력하면 핵심 요건을
          간추리고 적합도 진단에 쓸 요구 항목을 뽑아냅니다.
        </p>
      </div>

      <div className={styles.tabs}>
        <div
          className={`${styles.tab}${inputTab === "text" ? ` ${styles.tabActive}` : ""}`}
          onClick={() => setInputTab("text")}
        >
          본문 붙여넣기
        </div>
        <div
          className={`${styles.tab}${inputTab === "link" ? ` ${styles.tabActive}` : ""}`}
          onClick={() => setInputTab("link")}
        >
          기업 채용페이지 링크
        </div>
      </div>

      <div className="card">
        {inputTab === "text" ? (
          <textarea
            className="textarea"
            style={{ minHeight: 220, fontFamily: "monospace", fontSize: 13.5 }}
            placeholder={field.jobMap.examplePosting}
            value={postingText}
            onChange={(e) => setPostingText(e.target.value)}
          />
        ) : (
          <input
            className="textInput"
            placeholder="https://careers.example.com/postings/12345"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
          />
        )}

        <div className={styles.actionsRow}>
          <button type="button" className="btn btn-primary" onClick={handleSummarize}>
            요약하고 대조하기
          </button>
          <button type="button" className="btn btn-ghost" onClick={handleSummarize}>
            요약만 보기
          </button>
        </div>

        <p className={styles.legalNote}>
          채용 플랫폼(사람인·잡코리아·원티드 등) 공고는 이용약관상 자동
          수집하지 않습니다. 본문 붙여넣기 또는 기업 공식 채용 페이지
          링크만 지원합니다.
        </p>
      </div>

      {ready && (
        <div className={styles.summarySection}>
          <div className={styles.summaryTitle}>핵심 요약 3줄 · 공고 원문 기준</div>
          <p className={styles.summarySub}>
            {postingText ? "입력하신 공고 기준입니다." : "예시 공고 기준입니다. 실제 요약 엔진은 준비 중입니다."}
          </p>

          <div className={styles.summaryGrid}>
            <div className={styles.summaryRow}>
              <div className={styles.summaryLabel}>담당업무</div>
              <div className={styles.summaryText}>{field.posting.summary.duty}</div>
            </div>
            <div className={styles.summaryRow}>
              <div className={styles.summaryLabel}>자격요건</div>
              <div className={styles.summaryText}>{field.posting.summary.requirement}</div>
            </div>
            <div className={styles.summaryRow}>
              <div className={styles.summaryLabel}>우대사항</div>
              <div className={styles.summaryText}>{field.posting.summary.preferred}</div>
            </div>
          </div>

          <div className={styles.tagsHead}>
            <span className={styles.tagsCount}>추출된 요구 항목 · {tags.length}개</span>
            <span className={styles.tagsHint}>
              진한 것은 필수 요건, 연한 것은 우대 사항입니다. 클릭하면 분류를 바꿀 수 있습니다.
            </span>
          </div>
          <div className={styles.tags}>
            {tags.map((tag, i) => (
              <button
                key={tag.label}
                type="button"
                className={`${styles.tag} ${tag.required ? styles.tagRequired : styles.tagPreferred}`}
                onClick={() => toggleTag(i)}
              >
                {tag.label}
              </button>
            ))}
          </div>

          <div className={styles.useCta}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              이 요구 항목으로 적합도 진단서를 만들까요
            </span>
            <button type="button" className="btn btn-primary" onClick={handleUseForDiagnosis}>
              적합도 진단서 입력에 사용
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
