/**
 * chafit 로고 마크 — chafit-signal(이나린) components/Mark.tsx 원본 그대로.
 * 네 모서리 괄호 + 중앙 점: "공고와 나를 프레임 안에 놓고 대조한다"는 의미.
 */
export default function Mark({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <path d="M4 12V4H12" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 4H32V12" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 24V32H12" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 24V32H24" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="18" cy="18" r="3.5" fill="var(--accent)" />
    </svg>
  );
}
