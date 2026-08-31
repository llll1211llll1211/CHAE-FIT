'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import AnalysisSummary from '@/components/AnalysisSummary';
import EntryChoice from '@/components/EntryChoice';
import ErrorBanner from '@/components/ErrorBanner';
import ManualEntrySection from '@/components/ManualEntrySection';
import UploadSection from '@/components/UploadSection';
import { postFile } from '@/lib/api/client';
import { DEMO_PREFILL, DEMO_TRACKS } from '@/lib/demo/samples';
import { useSession } from '@/lib/session/SessionContext';

/**
 * STEP 1 — 이력서 분석.
 *
 * 랜딩·/start에서 `?mode=upload|manual`로 들어오면 선택 화면을 건너뛴다.
 * 링크가 이미 답을 담고 있는데 같은 질문을 또 하지 않기 위해서다.
 *
 * useSearchParams는 Suspense 경계를 요구한다(정적 렌더 중 값을 알 수 없기 때문).
 */
export default function ResumePage() {
  return (
    <Suspense fallback={null}>
      <ResumeStep />
    </Suspense>
  );
}

function ResumeStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { analysis, demoTrack, setDemoTrack, setAnalysis } = useSession();

  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState(null);

  // URL이 지정한 진입 방식. 사용자가 화면에서 바꾸면 그 선택이 우선한다.
  const modeFromUrl = searchParams.get('mode');
  const [entryMode, setEntryMode] = useState(
    modeFromUrl === 'upload' || modeFromUrl === 'manual' ? modeFromUrl : null
  );

  // 데모 프리필. File은 트랙당 한 번만 만든다 — 매 렌더마다 새로 만들면
  // UploadSection의 "데모 샘플" 표시(file === initialFile 비교)가 깨진다.
  const sampleFile = useMemo(
    () => (DEMO_PREFILL ? DEMO_TRACKS[demoTrack].resumeFile() : null),
    [demoTrack]
  );

  async function handleAnalyze(file) {
    setErrorMessage(null);
    setStatus('analyzing');

    try {
      const { analysis: result } = await postFile('/api/resume/analyze', 'resume', file);
      setAnalysis(result);
      setStatus('analyzed');
      router.push('/posting');
    } catch (err) {
      setStatus('idle');
      setErrorMessage(err.message);
    }
  }

  function handleManualComplete(result, manualProfile) {
    setAnalysis(result, manualProfile);
    setStatus('analyzed');
    router.push('/posting');
  }

  return (
    <>
      <ErrorBanner message={errorMessage} onClose={() => setErrorMessage(null)} />

      <section className="pagehead">
        <span className="pagehead__eyebrow">STEP 1</span>
        <h1 className="pagehead__title">이력서 분석</h1>
        <p className="pagehead__desc">
          {analysis
            ? 'AI가 이력서를 이렇게 읽었어요. 아래 진단서의 근거는 이 항목들을 짚어요.'
            : '이력서와 지원하려는 채용공고를 넣으면, 무엇이 충족되고 무엇이 필요한지 공고의 문장을 짚어 알려드려요. 회원가입 없이 바로 시작할 수 있어요.'}
        </p>
        {!analysis && (
          <p className="pagehead__note">
            취업을 대신 책임지는 무제한 컨설팅이 아니에요. 지원 직전, 근거 있는 판단 하나를
            빠르게 더해드릴 뿐이에요.
          </p>
        )}
      </section>

      <div className="stack">
        {DEMO_PREFILL && !analysis && (
          <TrackSwitcher current={demoTrack} onChange={setDemoTrack} />
        )}

        {!analysis && !entryMode && <EntryChoice onChoose={setEntryMode} />}

        {!analysis && entryMode === 'upload' && (
          <UploadSection
            status={status}
            onAnalyze={handleAnalyze}
            onError={setErrorMessage}
            onClearError={() => setErrorMessage(null)}
            initialFile={sampleFile}
            onBack={() => setEntryMode(null)}
          />
        )}

        {!analysis && entryMode === 'manual' && (
          <ManualEntrySection onComplete={handleManualComplete} onBack={() => setEntryMode(null)} />
        )}

        {analysis && (
          <>
            <AnalysisSummary analysis={analysis} />
            <button type="button" className="submit" onClick={() => router.push('/posting')}>
              다음: 채용공고 진단하기 →
            </button>
          </>
        )}
      </div>
    </>
  );
}

/**
 * 데모 트랙 전환 — 프리필이 켜져 있을 때만 보인다.
 *
 * 트랙마다 이력서와 공고가 짝을 이룬다. 반도체 트랙만이 경력공고 코퍼스와 매칭되어
 * 성장 로드맵·국비지원 강의까지 이어진다. 시연 중에 그 경로를 바로 보여주기 위한 것이다.
 */
function TrackSwitcher({ current, onChange }) {
  return (
    <section className="demotrack" aria-label="데모 샘플 트랙">
      <span className="demotrack__tag">데모 샘플</span>
      <div className="demotrack__opts">
        {Object.values(DEMO_TRACKS).map((track) => (
          <button
            key={track.id}
            type="button"
            className={`demotrack__opt${current === track.id ? ' is-active' : ''}`}
            onClick={() => onChange(track.id)}
            aria-pressed={current === track.id}
          >
            <span className="demotrack__label">{track.label}</span>
            <span className="demotrack__note">{track.note}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
