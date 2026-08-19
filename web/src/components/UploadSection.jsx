'use client';

import { useRef, useState } from 'react';
import LoadingIndicator from './LoadingIndicator';

/**
 * ① 이력서 업로드 (PRD §9.1)
 *
 * 노출 조건: status가 idle 또는 analyzing일 때 항상 표시.
 * 제약: PDF 또는 .txt만 허용, 5MB 이하.
 */
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_EXT = ['pdf', 'txt'];

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function extensionOf(name) {
  const i = name.lastIndexOf('.');
  return i === -1 ? '' : name.slice(i + 1).toLowerCase();
}

export default function UploadSection({ status, onAnalyze, onError, onClearError }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isDragover, setDragover] = useState(false);

  const isAnalyzing = status === 'analyzing';

  function selectFile(candidate) {
    if (!candidate) return;

    const ext = extensionOf(candidate.name);
    if (!ALLOWED_EXT.includes(ext)) {
      onError('지원하지 않는 파일 형식입니다. PDF 또는 .txt 파일을 올려주세요.');
      return;
    }
    if (candidate.size > MAX_SIZE) {
      onError(`파일 크기는 5MB 이하만 업로드할 수 있어요. (선택한 파일 ${formatSize(candidate.size)})`);
      return;
    }

    onClearError();
    setFile(candidate);
  }

  function resetFile() {
    setFile(null);
    if (inputRef.current) inputRef.current.value = '';
    onClearError();
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragover(false);
    if (e.dataTransfer.files.length > 1) {
      onError('이력서는 한 번에 한 개만 올릴 수 있어요.');
      return;
    }
    selectFile(e.dataTransfer.files[0]);
  }

  return (
    <section className="card" aria-labelledby="uploadTitle">
      <h2 className="card__title" id="uploadTitle">이력서 업로드</h2>
      <p className="card__hint">PDF 또는 .txt 파일, 5MB 이하만 업로드할 수 있어요.</p>

      {!isAnalyzing && (
        <>
          <div
            className={`dropzone${isDragover ? ' is-dragover' : ''}`}
            role="button"
            tabIndex={0}
            aria-label="이력서 파일 선택. 클릭하거나 파일을 끌어다 놓으세요."
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                inputRef.current?.click();
              }
            }}
            onDragEnter={(e) => { e.preventDefault(); setDragover(true); }}
            onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
            onDragLeave={(e) => { e.preventDefault(); setDragover(false); }}
            onDrop={handleDrop}
          >
            <div className="dropzone__icon" aria-hidden="true">📄</div>
            <p className="dropzone__main">파일을 끌어다 놓거나 <u>직접 선택</u>하세요</p>
            <p className="dropzone__sub">PDF, TXT · 최대 5MB</p>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.txt,application/pdf,text/plain"
            onChange={(e) => selectFile(e.target.files[0])}
          />

          {file && (
            <div className="file">
              <span className="file__icon">{extensionOf(file.name).toUpperCase()}</span>
              <div className="file__body">
                <div className="file__name">{file.name}</div>
                <div className="file__size">{formatSize(file.size)}</div>
              </div>
              <button className="file__remove" type="button" onClick={resetFile}>삭제</button>
            </div>
          )}

          <button
            className="submit"
            type="button"
            disabled={!file}
            onClick={() => onAnalyze(file)}
          >
            분석하기
          </button>
        </>
      )}

      <LoadingIndicator status={status} />

      <p className="privacy">
        업로드한 이력서는 분석 목적으로만 사용하며, 세션 종료 시 삭제됩니다.
      </p>
    </section>
  );
}
