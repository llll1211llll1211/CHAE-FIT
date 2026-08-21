import './globals.css';

export const metadata = {
  title: '채피티 — 이 공고, 내 경험으로 지원해도 될까?',
  description:
    '이력서와 채용공고를 대조해 충족 역량 · 필요 역량 · 판단 근거를 담은 적합도 진단서를 만들어 드립니다.',
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
