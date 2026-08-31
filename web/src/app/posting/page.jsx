'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ErrorBanner from '@/components/ErrorBanner';
import FitReport from '@/components/FitReport';
import LoadingIndicator from '@/components/LoadingIndicator';
import PostingInput from '@/components/PostingInput';
import PostingSummary from '@/components/PostingSummary';
import { postJson } from '@/lib/api/client';
import { DEMO_PREFILL, SAMPLE_POSTING_TEXT } from '@/lib/demo/samples';
import { useSession } from '@/lib/session/SessionContext';
import { useStepGuard } from '@/lib/session/useStepGuard';

/**
 * STEP 2 — 채용공고 진단.
 *
 * 입력 카드는 진단 후에도 닫히지 않는다. 공고를 바꿔가며 비교하는 것이 핵심 동선이고,
 * 그때 이력서는 다시 분석하지 않는다 — 세션의 analysis를 재전송한다(§8.5).
 */
export default function PostingPage() {
  const router = useRouter();
  const { analysis, posting, report, setPosting, setDiagnosis } = useSession();
  const { ready } = useStepGuard('analysis');

  const [status, setStatus] = useState('analyzed');
  const [errorMessage, setErrorMessage] = useState(null);

  const samplePosting = DEMO_PREFILL ? SAMPLE_POSTING_TEXT : undefined;
  const isLoading = status === 'parsing' || status === 'diagnosing';

  /**
   * ③ → ④ → ⑤. parse와 diagnose를 순차로 부른다.
   * 진단이 실패해도 요약(④)은 남긴다 — 그래서 두 라우트를 나눴다(§8.6).
   */
  async function handleDiagnose(input) {
    setErrorMessage(null);
    setStatus('parsing');

    let parsed;
    try {
      parsed = await postJson('/api/posting/parse', input);
    } catch (err) {
      setStatus('analyzed');
      setErrorMessage(err.message);
      return;
    }

    setPosting(parsed.posting);
    setStatus('diagnosing');

    try {
      const { report: result } = await postJson('/api/fit/diagnose', {
        analysis,
        posting: parsed.posting,
      });
      setDiagnosis(parsed.posting, result);
      setStatus('diagnosed');
    } catch (err) {
      setStatus('parsed');
      setErrorMessage(err.message);
    }
  }

  // 이력서 분석 없이 이 URL로 직접 들어온 경우. useStepGuard가 /resume으로 돌려보낸다.
  if (!ready) return null;

  return (
    <>
      <ErrorBanner message={errorMessage} onClose={() => setErrorMessage(null)} />

      <section className="pagehead">
        <span className="pagehead__eyebrow">STEP 2</span>
        <h1 className="pagehead__title">채용공고 진단</h1>
        <p className="pagehead__desc">
          본문을 붙여넣거나 URL을 입력하면, 공고 문장을 짚어 적합도 진단서를 만들어드려요.
        </p>
      </section>

      <div className="stack">
        <PostingInput
          status={status}
          onDiagnose={handleDiagnose}
          hasReport={report !== null}
          initialText={samplePosting}
        />

        {isLoading && <LoadingIndicator status={status} />}

        {posting && <PostingSummary posting={posting} />}

        {report && <FitReport report={report} />}

        {report && (
          <button type="button" className="submit" onClick={() => router.push('/roadmap')}>
            다음: 성장 로드맵 보기 →
          </button>
        )}
      </div>
    </>
  );
}
