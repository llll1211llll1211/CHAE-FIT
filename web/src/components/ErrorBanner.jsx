'use client';

/**
 * 에러 배너 (PRD §9.1)
 * 노출 조건: errorMessage가 설정된 모든 시점. 닫기 가능, 재시도 시 사라짐.
 */
export default function ErrorBanner({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="error" role="alert" aria-live="assertive">
      <span aria-hidden="true">⚠️</span>
      <span className="error__text">{message}</span>
      <button className="error__close" type="button" onClick={onClose} aria-label="알림 닫기">
        ✕
      </button>
    </div>
  );
}
