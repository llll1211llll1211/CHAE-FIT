import './globals.css';

export const metadata = {
  title: '채피티 — 내 이력서에 맞는 직무와 채용공고 찾기',
  description:
    '이력서를 업로드하면 AI가 경력과 스킬을 분석해 적합한 직무와 채용공고를 추천합니다.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <header className="header">
          <div className="header__inner">
            <div className="logo">
              <span className="logo__mark">C</span>
              채피티
              <span className="logo__sub">chafit</span>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
