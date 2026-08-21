/**
 * 로딩 상태 (PRD §9.1)
 * 노출 조건: status가 analyzing · parsing · diagnosing일 때.
 */
const MESSAGES = {
  analyzing: '이력서를 분석하고 있어요...',
  parsing: '채용공고를 읽고 있어요...',
  diagnosing: '적합도를 진단하고 있어요...',
};

export default function LoadingIndicator({ status }) {
  const text = MESSAGES[status];
  if (!text) return null;

  return (
    <div className="loading" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <span className="loading__text">{text}</span>
    </div>
  );
}
