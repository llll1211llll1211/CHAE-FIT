'use client';

import { useState } from 'react';

/**
 * ③ 채용공고 입력 (PRD §9.1)
 *
 * 노출 조건: analyzed 이후 계속. **진단 후에도 닫히지 않는다** — 공고를 바꿔가며
 * 비교하는 것이 페르소나 B의 핵심 동선이다(§4.2).
 *
 * 기본 탭은 붙여넣기다. URL은 보조 수단이며 실패를 정상 경로로 취급한다(§8.3 · §12).
 */
const MIN_TEXT_LENGTH = 30;

export default function PostingInput({ status, onDiagnose, hasReport, initialText }) {
  const [tab, setTab] = useState('text');
  // 데모 프리필은 초기값으로만 들어온다. 이후에는 사용자 입력이 유일한 출처다.
  const [text, setText] = useState(initialText ?? '');
  const [url, setUrl] = useState('');

  const isBusy = status === 'parsing' || status === 'diagnosing';
  const value = tab === 'text' ? text : url;
  const canSubmit = tab === 'text' ? text.trim().length >= MIN_TEXT_LENGTH : url.trim().length > 0;

  function submit() {
    if (!canSubmit || isBusy) return;
    onDiagnose(tab === 'text' ? { text: text.trim() } : { url: url.trim() });
  }

  return (
    <section className="card" aria-labelledby="postingTitle">
      <h2 className="card__title" id="postingTitle">
        {hasReport ? '다른 공고로 진단하기' : '채용공고 입력'}
      </h2>
      <p className="card__hint">
        {hasReport
          ? '공고를 바꿔 넣으면 이력서는 다시 분석하지 않고 진단만 새로 합니다.'
          : '지원하려는 공고의 본문을 붙여넣어 주세요. 자격요건이 구체적일수록 진단이 정확해요.'}
      </p>

      <div className="tabs" role="tablist" aria-label="공고 입력 방식">
        <button
          className={`tab${tab === 'text' ? ' is-active' : ''}`}
          type="button"
          role="tab"
          aria-selected={tab === 'text'}
          onClick={() => setTab('text')}
        >
          공고 내용 붙여넣기
        </button>
        <button
          className={`tab${tab === 'url' ? ' is-active' : ''}`}
          type="button"
          role="tab"
          aria-selected={tab === 'url'}
          onClick={() => setTab('url')}
        >
          공고 URL
        </button>
      </div>

      {tab === 'text' ? (
        <>
          <textarea
            className="textarea"
            rows={9}
            value={text}
            disabled={isBusy}
            placeholder={'채용공고 본문을 붙여넣어 주세요.\n\n예)\n[모집 부문] 반도체 공정기술\n[자격요건]\n- 신소재공학·화학공학 등 관련 전공\n- 반도체 단위공정 이론에 대한 이해\n[우대사항]\n- 관련 연구실 · 인턴 경험 보유자'}
            onChange={(e) => setText(e.target.value)}
          />
          <p className="counter">
            {/* 샘플이 실제 지원 공고로 오해되지 않게 표시한다. */}
            {text === initialText && text.length > 0 && <span className="counter__tag">데모 샘플</span>}
            {text.trim().length > 0 && text.trim().length < MIN_TEXT_LENGTH
              ? `${MIN_TEXT_LENGTH}자 이상 붙여넣어 주세요.`
              : `${text.trim().length.toLocaleString()}자`}
          </p>
        </>
      ) : (
        <>
          <input
            className="input"
            type="url"
            value={url}
            disabled={isBusy}
            placeholder="https://..."
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
          />
          <p className="counter">
            채용 플랫폼에 따라 본문을 가져오지 못할 수 있어요. 그럴 땐 붙여넣기 탭을 이용해주세요.
          </p>
        </>
      )}

      <button className="submit" type="button" disabled={!canSubmit || isBusy} onClick={submit}>
        {hasReport ? '이 공고로 다시 진단하기' : '적합도 진단하기'}
      </button>

      {/* 입력값이 남아 있어야 실패 후 바로 고쳐 재시도할 수 있다. 여기서 지우지 않는다. */}
      {value.length > 0 && !isBusy && (
        <button
          className="linkbtn"
          type="button"
          onClick={() => (tab === 'text' ? setText('') : setUrl(''))}
        >
          입력 지우기
        </button>
      )}
    </section>
  );
}
