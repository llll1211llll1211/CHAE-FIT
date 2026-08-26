'use client';

import { useState } from 'react';
import AnalysisSummary from '@/components/AnalysisSummary';
import CareerOutlook from '@/components/CareerOutlook';
import EntryChoice from '@/components/EntryChoice';
import ErrorBanner from '@/components/ErrorBanner';
import FitReport from '@/components/FitReport';
import LoadingIndicator from '@/components/LoadingIndicator';
import ManualEntrySection from '@/components/ManualEntrySection';
import PostingInput from '@/components/PostingInput';
import PostingSummary from '@/components/PostingSummary';
import UploadSection from '@/components/UploadSection';
import { postFile, postJson } from '@/lib/api/client';
import { DEMO_PREFILL, SAMPLE_POSTING_TEXT, sampleResumeFile } from '@/lib/demo/samples';

/**
 * 채피티 단일 페이지 (PRD §9)
 *
 * 상태 흐름: idle → analyzing → analyzed → parsing → parsed → diagnosing → diagnosed
 * 로그인·라우팅 없이 ①~⑤ 섹션이 한 화면에서 순차적으로 열린다.
 *
 * **이력서 분석 결과(analysis)는 여기 한 곳에만 보관한다.** 공고를 바꿔 진단할 때
 * 재분석하지 않고 이 값을 재전송한다 — 공고 N건 진단 = 이력서 분석 1회 + 공고 분석 N회(§8.5).
 */
export default function Home() {
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [posting, setPosting] = useState(null);
  const [report, setReport] = useState(null);

  // 이력서 있음(upload) / 없음(manual) 분기. analysis가 생기기 전까지만 의미가 있다.
  const [entryMode, setEntryMode] = useState(null);
  // 직접 입력 시 나온 PDF 전용 필드(기본정보·학력 등). 진단에는 쓰이지 않는다 — PDF 추출 기능이 생기면 그때 쓴다.
  const [profile, setProfile] = useState(null);

  // 데모 프리필. File은 한 번만 만든다 — 매 렌더마다 새로 만들면 "데모 샘플" 표시가 깨진다.
  const [sampleFile] = useState(() => (DEMO_PREFILL ? sampleResumeFile() : null));
  const samplePosting = DEMO_PREFILL ? SAMPLE_POSTING_TEXT : undefined;

  async function handleAnalyze(file) {
    setErrorMessage(null);
    setStatus('analyzing');

    try {
      const { analysis: result } = await postFile('/api/resume/analyze', 'resume', file);
      setAnalysis(result);
      setStatus('analyzed');
    } catch (err) {
      setStatus('idle');
      setErrorMessage(err.message);
    }
  }

  /**
   * ③ → ④ → ⑤. parse와 diagnose를 순차로 부른다.
   * 진단이 실패해도 요약(④)은 남긴다 — 그래서 두 라우트를 나눴다(§8.6).
   */
  async function handleDiagnose(input) {
    setErrorMessage(null);
    setPosting(null);
    setReport(null);
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
      setReport(result);
      setStatus('diagnosed');
    } catch (err) {
      setStatus('parsed');
      setErrorMessage(err.message);
    }
  }

  function handleManualComplete(result, manualProfile) {
    setProfile(manualProfile);
    setAnalysis(result);
    setStatus('analyzed');
  }

  function handleReset() {
    setStatus('idle');
    setErrorMessage(null);
    setAnalysis(null);
    setPosting(null);
    setReport(null);
    setEntryMode(null);
    setProfile(null);
  }

  const isLoading = status === 'parsing' || status === 'diagnosing';

  return (
    <main>
      {analysis ? (
        <div className="topbar">
          <span className="pill pill--done">분석 완료</span>
          <button className="linkbtn" type="button" onClick={handleReset}>
            ↺ 새 이력서로 다시 분석
          </button>
        </div>
      ) : (
        <>
          <section className="hero">
            <span className="hero__badge">이력서 기반 기업별 직무 적합도 진단</span>
            <h1 className="hero__title">
              이 공고, 내 경험으로 지원해도 될까?<br />
              <em>근거와 함께</em> 답해드려요
            </h1>
            <p className="hero__desc">
              이력서와 지원하려는 채용공고를 넣으면, 무엇이 충족되고 무엇이 필요한지
              공고의 문장을 짚어 알려드려요. 회원가입 없이 바로 시작할 수 있어요.
            </p>
          </section>

          <ol className="steps">
            <li className="step">
              <span className="step__no">1</span>
              <div className="step__title">이력서 업로드 또는 직접 입력</div>
              <p className="step__desc">이력서가 없어도 경력·활동을 입력해 시작할 수 있어요</p>
            </li>
            <li className="step">
              <span className="step__no">2</span>
              <div className="step__title">채용공고 입력</div>
              <p className="step__desc">본문 붙여넣기 또는 URL</p>
            </li>
            <li className="step">
              <span className="step__no">3</span>
              <div className="step__title">적합도 진단서</div>
              <p className="step__desc">점수 · 필요 역량 · 판단 근거</p>
            </li>
          </ol>
        </>
      )}

      <ErrorBanner message={errorMessage} onClose={() => setErrorMessage(null)} />

      <div className="stack">
        {/* ① — analysis가 생기면 자리를 비운다 (§9.3). 그 전에는 이력서 유무로 먼저 분기한다. */}
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

        {/* ② */}
        {analysis && <AnalysisSummary analysis={analysis} />}

        {/* ③ — 진단 후에도 닫지 않는다. 여러 공고 비교가 페르소나 B의 동선이다(§4.2) */}
        {analysis && (
          <PostingInput
            status={status}
            onDiagnose={handleDiagnose}
            hasReport={report !== null}
            initialText={samplePosting}
          />
        )}

        {isLoading && <LoadingIndicator status={status} />}

        {/* ④ */}
        {posting && <PostingSummary posting={posting} />}

        {/* ⑤ */}
        {report && <FitReport report={report} />}

        {/* 성장 로드맵 — 경력공고 비교(신규). 코퍼스에 페어가 없으면 조용히 숨는다 */}
        {report && <CareerOutlook analysis={analysis} posting={posting} />}
      </div>
    </main>
  );
}
