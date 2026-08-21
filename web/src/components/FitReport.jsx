/**
 * ⑤ 적합도 진단서 (PRD §9.1) — **핵심 화면**
 *
 * 이 화면의 설계 제약이 곧 서비스의 신뢰다.
 *   - 점수 옆에 "요구 역량 N개 중 M개 충족"을 **항상 병기**한다. 숫자의 의미를 고정해
 *     합격률로 오독되는 것을 막는다(§12).
 *   - 필요 역량에 **경고색을 쓰지 않는다.** 탈락 사유가 아니라 참고 정보다(§12).
 *   - hasSkillInfo가 false면 점수와 역량 영역을 통째로 숨긴다.
 *     "정보 없음"이 "적합도 0%"로 오독되면 안 된다(§9.1 ⑤).
 */
export default function FitReport({ report }) {
  const {
    fitScore, matchedCount, requiredCount,
    matchedSkills, missingSkills, hasSkillInfo, reasons,
  } = report;

  return (
    <section className="card card--report" aria-labelledby="reportTitle">
      <h2 className="card__title" id="reportTitle">적합도 진단서</h2>

      {hasSkillInfo ? (
        <>
          <p className="card__hint">공고가 명시한 요구 역량을 기준으로 대조한 결과예요.</p>
          <Score fitScore={fitScore} matchedCount={matchedCount} requiredCount={requiredCount} />

          <div className="cols">
            <SkillGroup
              title="충족 역량"
              hint="공고 요구 역량 중 이력서에서 확인된 것"
              skills={matchedSkills}
              variant="fill"
              empty="공고가 요구한 역량 중 이력서에서 확인된 것이 없어요."
            />
            <SkillGroup
              title="필요 역량"
              hint="공고가 요구했지만 이력서에서 확인되지 않은 것"
              skills={missingSkills}
              variant="outline"
              empty="공고가 요구한 역량을 모두 충족했어요."
            />
          </div>

          <Reasons reasons={reasons} />
        </>
      ) : (
        <p className="notice">
          이 공고에서 요구 역량을 추출하지 못했어요. 자격요건이 포함된 본문을 붙여넣어 주세요.
        </p>
      )}

      <p className="disclaimer">
        이 진단은 공고에 명시된 요구사항과의 비교이며, 합격 가능성 판정이 아닙니다.
      </p>
    </section>
  );
}

/** 점수 + 게이지. 숫자 단독으로는 절대 보여주지 않는다. */
function Score({ fitScore, matchedCount, requiredCount }) {
  const percent = Math.round((fitScore ?? 0) * 100);

  return (
    <div className="score">
      <div className="score__value">
        <span className="score__num">{percent}</span>
        <span className="score__unit">%</span>
      </div>
      <div className="score__body">
        <div
          className="gauge"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="적합도"
        >
          <div className="gauge__fill" style={{ width: `${percent}%` }} />
        </div>
        {/* 점수의 의미를 고정하는 문장. 점수와 떼어놓지 말 것(§12). */}
        <p className="score__caption">
          공고가 명시한 요구 역량 <b>{requiredCount}개</b> 중 <b>{matchedCount}개</b> 충족
        </p>
      </div>
    </div>
  );
}

function SkillGroup({ title, hint, skills, variant, empty }) {
  return (
    <div className="block">
      <h3 className="block__title">
        {title} <span className="block__count">{skills.length}</span>
      </h3>
      <p className="block__hint">{hint}</p>
      {skills.length > 0 ? (
        <ul className="chips">
          {skills.map((skill) => (
            <li className={`chip chip--${variant}`} key={skill}>{skill}</li>
          ))}
        </ul>
      ) : (
        <p className="block__empty">{empty}</p>
      )}
    </div>
  );
}

/**
 * 근거 문장. 빈 배열일 수 있다 — 생성이 실패해도 점수는 이미 확정이므로
 * 진단서 자체는 성립한다(API.md).
 */
function Reasons({ reasons }) {
  return (
    <div className="block">
      <h3 className="block__title">판단 근거</h3>
      {reasons.length > 0 ? (
        <ul className="reasons">
          {reasons.map((reason, i) => (
            <li className="reason" key={`${i}-${reason.requirement}`}>
              <div className="reason__link">
                <span className="reason__from">{reason.experience}</span>
                <span className="reason__arrow" aria-hidden="true">→</span>
                <span className="reason__to">{reason.requirement}</span>
              </div>
              <p className="reason__text">{reason.text}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="block__empty">
          근거 문장을 만들지 못했어요. 위 충족 · 필요 역량은 그대로 유효합니다.
        </p>
      )}
    </div>
  );
}
