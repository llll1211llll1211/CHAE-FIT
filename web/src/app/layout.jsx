import { IBM_Plex_Mono, IBM_Plex_Sans_KR } from 'next/font/google';
import AppShell from '@/components/AppShell';
import { SessionProvider } from '@/lib/session/SessionContext';
import './globals.css';

/* chafit-signal(이나린)과 같은 조합. 본문은 Plex Sans KR,
   라벨·수치는 Plex Mono — 이 대비가 "문서·계기판" 인상을 만든다.
   한글 글리프는 latin 서브셋에 없어서 시스템 폰트로 떨어진다. 원본과 동일한 절충. */
const plexSansKr = IBM_Plex_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: '채피티 — 이 공고, 내 경험으로 지원해도 될까?',
  description:
    '이력서와 채용공고를 대조해 충족 역량 · 필요 역량 · 판단 근거를 담은 적합도 진단서를 만들어 드립니다.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={`${plexSansKr.variable} ${plexMono.variable}`}>
      <body>
        <SessionProvider>
          <AppShell>{children}</AppShell>
        </SessionProvider>
      </body>
    </html>
  );
}
