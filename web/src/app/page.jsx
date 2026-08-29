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
import Sidebar from '@/components/Sidebar';
import UploadSection from '@/components/UploadSection';
import { postFile, postJson } from '@/lib/api/client';
import { DEMO_PREFILL, SAMPLE_POSTING_TEXT, sampleResumeFile } from '@/lib/demo/samples';

/**
 * 채피티 메인 화면 (PRD §9)
 *
 * 사이드바로 세 기능을 분리한다 — 이력서 분석 / 채용공고 진단 / 성장 로드맵.
 * 뒤 페이지는 앞 페이지 데이터가 없으면 사이드바에서 잠긴다(goToPage가 막는다).
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

  // 사이드바로 분리된 세 페이지. 뒤 페이지는 데이터가 없으면 goToPage가 이동을 막는다.
  const [activePage, setActivePage] = useState('resume');
  const [visitedRoadmap, setVisitedRoadmap] = useState(false);

  // 데모 프리필. File은 한 번만 만든다 — 매 렌더마다 새로 만들면 "데모 샘플" 표시가 깨진다.
  const [sampleFile] = useState(() => (DEMO_PREFILL ? sampleResumeFile() : null));
  const samplePosting = DEMO_PREFILL ? SAMPLE_POSTING_TEXT : undefined;

  function goToPage(page) {
    if (page === 'posting' && !analysis) return;
    if (page === 'roadmap' && !report) return;
    setActivePage(page);
    if (page === 'roadmap') setVisitedRoadmap(true);
  }

  async function handleAnalyze(file) {
    setErrorMessage(null);
    setStatus('analyzing');

    try {
      const { analysis: result } = await postFile('/api/resume/analyze', 'resume', file);
      setAnalysis(result);
      setStatus('analyzed');
      setActivePage('posting');
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
      setVisitedRoadmap(false);
    } catch (err) {
      setStatus('parsed');
      setErrorMessage(err.message);
    }
  }

  function handleManualComplete(result, manualProfile) {
    setProfile(manualProfile);
    setAnalysis(result);
    setStatus('analyzed');
    setActivePage('posting');
  }

  function handleReset() {
    setStatus('idle');
    setErrorMessage(null);
    setAnalysis(null);
    setPosting(null);
    setReport(null);
    setEntryMode(null);
    setProfile(null);
    setActivePage('resume');
    setVisitedRoadmap(false);
  }

  const isLoading = status === 'parsing' || status === 'diagnosing';

  return (
    <div className="shell">
      <Sidebar
        activePage={activePage}
        onNavigate={goToPage}
        unlocked={{ resume: true, posting: !!analysis, roadmap: !!report }}
        done={{ resume: !!analysis, posting: !!report }}
        showRoadmapBadge={!!report && !visitedRoadmap}
        showReset={!!analysis}
        onReset={handleReset}
      />

      <div className="content">
        <div className="content__inner">
          <ErrorBanner message={errorMessage} onClose={() => setErrorMessage(null)} />

          {activePage === 'resume' && (
            <>
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
                    취업을 대신 책임지는 무제한 컨설팅이 아니에요. 지원 직전, 근거 있는 판단
                    하나를 빠르게 더해드릴 뿐이에요.
                  </p>
                )}
              </section>

              <div className="stack">
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
                    <button type="button" className="submit" onClick={() => goToPage('posting')}>
                      다음: 채용공고 진단하기 →
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          {activePage === 'posting' && analysis && (
            <>
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
                  <button type="button" className="submit" onClick={() => goToPage('roadmap')}>
                    다음: 성장 로드맵 보기 →
                  </button>
                )}
              </div>
            </>
          )}

          {activePage === 'roadmap' && report && (
            <>
              <section className="pagehead">
                <span className="pagehead__eyebrow">STEP 3</span>
                <h1 className="pagehead__title">성장 로드맵</h1>
                <p className="pagehead__desc">
                  입사 후 이 팀에 자연스럽게 적응하려면 다음에 뭐가 필요할지, 경력직 공고를
                  기준으로 보여드려요.
                </p>
              </section>

              <div className="stack">
                <CareerOutlook analysis={analysis} posting={posting} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
