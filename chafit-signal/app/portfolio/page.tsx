"use client";

import { useRef, useState } from "react";
import { Briefcase, Image as ImageIcon, LinkSimple, Plus, Trash, X } from "@phosphor-icons/react";
import styles from "./portfolio.module.css";

type PortfolioItem = {
  id: string;
  title: string;
  role: string;
  period: string;
  summary: string;
  tags: string[];
  link: string;
  image: string;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const SEED: PortfolioItem[] = [
  {
    id: "p1",
    title: "PECVD 박막 증착 조건 최적화",
    role: "캡스톤 팀 프로젝트 · 팀장",
    period: "2025.03 – 2025.06",
    summary:
      "박막 증착 조건을 바꿔가며 두께 편차를 측정하고, 조건별 데이터를 정리해 최적 조건을 도출했습니다.",
    tags: ["반도체 공정", "데이터 분석", "Python"],
    link: "",
    image: "",
  },
  {
    id: "p2",
    title: "공정 데이터 모니터링 대시보드",
    role: "개인 프로젝트",
    period: "2025.07 – 2025.08",
    summary: "측정값 산포를 실시간으로 확인할 수 있는 대시보드를 만들었습니다.",
    tags: ["Python", "Streamlit", "SPC"],
    link: "https://github.com/",
    image: "",
  },
];

const EMPTY_DRAFT = { title: "", role: "", period: "", summary: "", tags: "", link: "", image: "" };

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>(SEED);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [imageError, setImageError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const canSave = draft.title.trim().length > 0 && draft.summary.trim().length > 0;

  function resetDraft() {
    setDraft(EMPTY_DRAFT);
    setImageError(null);
    setAdding(false);
  }

  function handleImageFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setImageError("이미지 파일만 첨부할 수 있습니다.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("이미지 용량은 5MB 이하여야 합니다.");
      return;
    }
    setImageError(null);
    const reader = new FileReader();
    reader.onload = () => setDraft((d) => ({ ...d, image: reader.result as string }));
    reader.readAsDataURL(file);
  }

  function handleSave() {
    if (!canSave) return;
    setItems((prev) => [
      {
        id: `p${Date.now()}`,
        title: draft.title.trim(),
        role: draft.role.trim(),
        period: draft.period.trim(),
        summary: draft.summary.trim(),
        tags: draft.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        link: draft.link.trim(),
        image: draft.image,
      },
      ...prev,
    ]);
    resetDraft();
  }

  function handleRemove(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className="wrap">
      <div className={styles.headRow}>
        <div>
          <div className="pageCrumb">포트폴리오</div>
          <h1 className="pageTitle">프로젝트와 결과물을 모아둡니다</h1>
          <p className="pageSub">
            이력서·자소서에 인용할 프로젝트를 정리해두면 근거로 바로 가져다 쓸 수 있습니다.
          </p>
        </div>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setAdding(true)}>
          <Plus size={16} weight="bold" />
          항목 추가
        </button>
      </div>

      {adding && (
        <div className={`card ${styles.formCard}`}>
          <div className={styles.formHead}>
            <span className={styles.formTitle}>새 프로젝트</span>
            <button type="button" className={styles.closeBtn} onClick={resetDraft} aria-label="닫기">
              <X size={16} />
            </button>
          </div>

          <div className={styles.formGrid}>
            <div className="field">
              <label className="label">프로젝트명</label>
              <input
                className="textInput"
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                placeholder="예: PECVD 박막 증착 조건 최적화"
              />
            </div>
            <div className="field">
              <label className="label">역할</label>
              <input
                className="textInput"
                value={draft.role}
                onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))}
                placeholder="예: 캡스톤 팀 프로젝트 · 팀장"
              />
            </div>
            <div className="field">
              <label className="label">기간</label>
              <input
                className="textInput"
                value={draft.period}
                onChange={(e) => setDraft((d) => ({ ...d, period: e.target.value }))}
                placeholder="예: 2025.03 – 2025.06"
              />
            </div>
            <div className="field">
              <label className="label">링크 (선택)</label>
              <input
                className="textInput"
                value={draft.link}
                onChange={(e) => setDraft((d) => ({ ...d, link: e.target.value }))}
                placeholder="https://"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">이미지 (선택)</label>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const selected = e.target.files?.[0];
                if (selected) handleImageFile(selected);
              }}
            />
            {draft.image ? (
              <div className={styles.imagePreviewWrap}>
                <img src={draft.image} alt="" className={styles.imagePreview} />
                <button
                  type="button"
                  className={styles.imageRemoveBtn}
                  onClick={() => setDraft((d) => ({ ...d, image: "" }))}
                  aria-label="이미지 제거"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className={styles.imageAddBtn}
                onClick={() => imageInputRef.current?.click()}
              >
                <ImageIcon size={17} />
                이미지 선택
              </button>
            )}
            {imageError && <p className="errorText" style={{ marginTop: 6 }}>{imageError}</p>}
          </div>

          <div className="field">
            <label className="label">태그 (쉼표로 구분)</label>
            <input
              className="textInput"
              value={draft.tags}
              onChange={(e) => setDraft((d) => ({ ...d, tags: e.target.value }))}
              placeholder="예: 반도체 공정, Python, 데이터 분석"
            />
          </div>

          <div className="field">
            <label className="label">한 줄 요약</label>
            <textarea
              className="textarea"
              value={draft.summary}
              onChange={(e) => setDraft((d) => ({ ...d, summary: e.target.value }))}
              placeholder="무엇을 했고, 어떤 결과를 얻었는지 적어보세요."
            />
          </div>

          <div className={styles.formActions}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={resetDraft}>
              취소
            </button>
            <button type="button" className="btn btn-primary btn-sm" disabled={!canSave} onClick={handleSave}>
              저장
            </button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className={`card ${styles.empty}`}>
          <Briefcase size={22} className={styles.emptyIcon} />
          <p>아직 등록한 프로젝트가 없습니다. 항목을 추가해보세요.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {items.map((item) => (
            <div className={`card ${styles.itemCard}`} key={item.id}>
              {item.image && <img src={item.image} alt="" className={styles.itemImage} />}
              <div className={styles.itemHead}>
                <div>
                  <div className={styles.itemTitle}>{item.title}</div>
                  <div className={styles.itemMeta}>
                    {[item.role, item.period].filter(Boolean).join(" · ")}
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => handleRemove(item.id)}
                  aria-label="삭제"
                >
                  <Trash size={15} />
                </button>
              </div>

              <p className={styles.itemSummary}>{item.summary}</p>

              {item.tags.length > 0 && (
                <div className={styles.tagRow}>
                  {item.tags.map((tag) => (
                    <span key={tag} className="badge badge-neutral">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {item.link && (
                <a href={item.link} target="_blank" rel="noreferrer" className={styles.itemLink}>
                  <LinkSimple size={14} />
                  {item.link}
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="disclaimer" style={{ marginTop: 24 }}>
        포트폴리오는 세션 동안만 유지되며, 새로고침하거나 세션이 끝나면 초기화됩니다.
      </p>
    </div>
  );
}
