"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadSimple, FilePdf, FileText, X, CheckCircle } from "@phosphor-icons/react";
import styles from "./resume.module.css";

const MAX_SIZE = 5 * 1024 * 1024;
const VALID_EXT = /\.(pdf|txt)$/i;

export default function ResumePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [consentProcessing, setConsentProcessing] = useState(false);
  const [consentTransfer, setConsentTransfer] = useState(false);
  const [consentHistory, setConsentHistory] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function validateFile(candidate: File): string | null {
    if (!VALID_EXT.test(candidate.name)) return "PDF 또는 TXT 파일만 업로드할 수 있습니다.";
    if (candidate.size > MAX_SIZE) return "파일 용량은 5MB 이하여야 합니다.";
    return null;
  }

  function handleFile(candidate: File) {
    const error = validateFile(candidate);
    if (error) {
      setFile(null);
      setFileError(error);
      return;
    }
    setFile(candidate);
    setFileError(null);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragOver(false);
    const dropped = event.dataTransfer.files?.[0];
    if (dropped) handleFile(dropped);
  }

  const canSubmit = Boolean(file) && consentProcessing && consentTransfer;
  const FileIcon = file?.name.toLowerCase().endsWith(".pdf") ? FilePdf : FileText;

  function handleSubmit() {
    if (!canSubmit) return;
    sessionStorage.setItem(
      "chafit:resume",
      JSON.stringify({ name: file?.name, size: file?.size, savedHistory: consentHistory })
    );
    router.push("/posting");
  }

  return (
    <div className="wrap">
      <div className="pageHead">
        <div className="pageCrumb">1단계 · 이력서</div>
        <h1 className="pageTitle">이력서 올리기</h1>
        <p className="pageSub">
          PDF 또는 TXT, 5MB 이하. 분석에만 사용하고 세션이 끝나면 삭제합니다.
        </p>
      </div>

      <div className={styles.grid}>
        <div>
          <div className="card">
            <div
              className={`${styles.dropzone}${dragOver ? ` ${styles.dragOver}` : ""}`}
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
            >
              <UploadSimple size={26} weight="bold" className={styles.dropzoneIcon} />
              <div className={styles.dropzoneText}>파일을 끌어다 놓거나 직접 선택합니다</div>
              <div className={styles.dropzoneHint}>PDF · TXT / 최대 5MB</div>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.txt"
                hidden
                onChange={(e) => {
                  const selected = e.target.files?.[0];
                  if (selected) handleFile(selected);
                }}
              />
            </div>

            {file && (
              <div className={styles.fileRow}>
                <FileIcon size={18} weight="fill" style={{ color: "var(--accent)", flexShrink: 0 }} />
                <span>{file.name}</span>
                <span className={styles.fileMeta}>
                  {(file.size / (1024 * 1024)).toFixed(1)} MB · 검사 통과
                </span>
                <button
                  type="button"
                  className={styles.fileRemove}
                  onClick={() => setFile(null)}
                  aria-label="파일 제거"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {fileError && <p className="errorText" style={{ marginTop: 10 }}>{fileError}</p>}

            <div className={styles.altPath}>
              <div className={styles.altPathTitle}>이력서가 없어도 됩니다</div>
              <p className={styles.altPathBody}>
                7개 질문(4분)에 답하면 같은 진단서가 나옵니다.
              </p>
              <a href="/interview" className="btn btn-ghost btn-sm">
                문답으로 만들기
              </a>
            </div>
          </div>
        </div>

        <div className={`card ${styles.consentPanel}`}>
          <div className={styles.consentTitle}>업로드 전 확인</div>
          <div className={styles.consentIntro}>개인정보 처리 고지 및 동의</div>

          <div className={styles.consentList}>
            <label className="checkRow">
              <input
                type="checkbox"
                checked={consentProcessing}
                onChange={(e) => setConsentProcessing(e.target.checked)}
              />
              <span>
                <strong>(필수) 처리 위탁</strong> · 분석을 위해 이력서 텍스트를 외부
                AI 분석 수탁사에 전달합니다.
              </span>
            </label>
            <div className={styles.consentDivider} />
            <label className="checkRow">
              <input
                type="checkbox"
                checked={consentTransfer}
                onChange={(e) => setConsentTransfer(e.target.checked)}
              />
              <span>
                <strong>(필수) 국외 이전</strong> · 국가: 미국 · 항목: 이력서 텍스트
                · 목적: 적합도 분석 · 보유: 세션 종료 시 삭제
              </span>
            </label>
            <div className={styles.consentDivider} />
            <label className="checkRow">
              <input
                type="checkbox"
                checked={consentHistory}
                onChange={(e) => setConsentHistory(e.target.checked)}
              />
              <span>
                <strong>(선택) 진단 이력 저장</strong> · 관심 기업 트래킹에
                사용합니다. 계정 없이는 저장되지 않습니다.
              </span>
            </label>
          </div>

          <p className={styles.sensitiveNote}>
            이력서에는 민감정보가 포함될 수 있습니다. 주민등록번호·연락처는
            분석에 쓰이지 않으니 업로드 전에 지워도 결과는 같습니다.
          </p>

          <button
            type="button"
            className="btn btn-primary"
            style={{ width: "100%" }}
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            <CheckCircle size={17} weight="fill" />
            동의하고 분석 시작
          </button>
          <p className={styles.submitHint}>필수 두 항목에 동의해야 분석이 시작됩니다</p>
        </div>
      </div>
    </div>
  );
}
