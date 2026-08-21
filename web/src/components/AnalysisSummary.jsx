/**
 * ② 경력 · 역량 분석 결과 (PRD §9.1)
 *
 * 노출 조건: analyzed 이후 계속 표시.
 *
 * 경험 항목을 노출하는 이유가 이 화면의 존재 이유다. ⑤의 근거 문장이 여기 있는
 * title을 인용하므로, 사용자가 "AI가 내 이력서를 이렇게 읽었구나"를 먼저 확인해야
 * 진단서를 신뢰한다.
 */
export default function AnalysisSummary({ analysis }) {
  const { summary, totalYears, skills, experiences } = analysis;

  return (
    <section className="card" aria-labelledby="analysisTitle">
      <div className="card__head">
        <h2 className="card__title" id="analysisTitle">경력 · 역량 분석</h2>
        <span className="pill">{totalYears > 0 ? `경력 ${totalYears}년` : '신입'}</span>
      </div>
      <p className="card__hint">AI가 이력서를 이렇게 읽었어요. 아래 진단서의 근거는 이 항목들을 짚습니다.</p>

      <p className="summary">{summary}</p>

      {skills.length > 0 && (
        <div className="block">
          <h3 className="block__title">보유 역량 {skills.length}개</h3>
          <ul className="chips">
            {skills.map((skill) => (
              <li className="chip chip--fill" key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      )}

      {experiences.length > 0 && (
        <div className="block">
          <h3 className="block__title">주요 경험 {experiences.length}건</h3>
          <ul className="exps">
            {experiences.map((exp, i) => (
              // 제목이 겹칠 수 있어 순번을 함께 쓴다. 목록 순서는 바뀌지 않는다.
              <li className="exp" key={`${exp.title}-${i}`}>
                <div className="exp__title">{exp.title}</div>
                <p className="exp__desc">{exp.description}</p>
                {exp.skills.length > 0 && (
                  <ul className="chips chips--sm">
                    {exp.skills.map((skill) => (
                      <li className="chip chip--ghost" key={skill}>{skill}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
