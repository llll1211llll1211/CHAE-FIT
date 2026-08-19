'use client';

import { useState } from 'react';
import ErrorBanner from '@/components/ErrorBanner';
import UploadSection from '@/components/UploadSection';

/**
 * 채피티 단일 페이지 (PRD §9)
 *
 * 상태 흐름: idle → analyzing → analyzed → matching → matched (+ error)
 * 현재 구현 범위는 홈화면(① 업로드)까지다. ②③④는 이 아래에 순차적으로 붙는다.
 */
export default function Home() {
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState(null);

  async function handleAnalyze(file) {
    setErrorMessage(null);
    setStatus('analyzing');

    const form = new FormData();
    form.append('resume', file);

    try {
      // TODO(F2·F3): /api/resume/analyze 라우트 구현 후 연결한다.
      const res = await fetch('/api/resume/analyze', { method: 'POST', body: form });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const analysis = await res.json();

      // TODO: ② AnalysisSummary / ③ RoleRecommendations 렌더링
      console.log('analysis', analysis);
      setStatus('analyzed');
    } catch {
      setStatus('idle');
      setErrorMessage('분석에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  }

  return (
    <main>
      <section className="hero">
        <span className="hero__badge">AI 경력분석 기반 직무 · 채용공고 추천</span>
        <h1 className="hero__title">
          내 이력서를 넣으면,<br />
          <em>내게 맞는 직무와 채용공고</em>까지 한 번에
        </h1>
        <p className="hero__desc">
          흩어진 공고를 검색하기 전에, 내 경험이 어떤 직무의 언어인지부터 확인하세요.
          회원가입 없이 바로 시작할 수 있어요.
        </p>
      </section>

      <ol className="steps">
        <li className="step">
          <span className="step__no">1</span>
          <div className="step__title">이력서 업로드</div>
          <p className="step__desc">PDF 또는 텍스트 파일</p>
        </li>
        <li className="step">
          <span className="step__no">2</span>
          <div className="step__title">AI 경력 · 스킬 분석</div>
          <p className="step__desc">경험을 직무 역량으로 번역</p>
        </li>
        <li className="step">
          <span className="step__no">3</span>
          <div className="step__title">직무 · 공고 추천</div>
          <p className="step__desc">추천 근거와 매칭 스킬까지</p>
        </li>
      </ol>

      <ErrorBanner message={errorMessage} onClose={() => setErrorMessage(null)} />

      <UploadSection
        status={status}
        onAnalyze={handleAnalyze}
        onError={setErrorMessage}
        onClearError={() => setErrorMessage(null)}
      />
    </main>
  );
}
