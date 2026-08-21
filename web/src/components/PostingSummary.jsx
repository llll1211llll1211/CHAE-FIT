/**
 * ④ 공고 요약 (PRD §9.1, F5)
 *
 * 노출 조건: parsed 이후. **진단이 실패해도 이 카드는 남는다** — 요약만으로도
 * 독립적으로 유용하기 때문에 parse와 diagnose를 나눴다(§8.6).
 *
 * requirements · preferred는 공고 원문 문장이다. ⑤의 근거가 이 문장을 인용하므로
 * 화면에서도 가공하지 않고 그대로 보여준다.
 */
export default function PostingSummary({ posting }) {
  const { company, title, summary, requirements, preferred, source } = posting;

  return (
    <section className="card" aria-labelledby="postingSummaryTitle">
      <div className="card__head">
        <h2 className="card__title" id="postingSummaryTitle">공고 요약</h2>
        {source === 'url' && <span className="pill pill--mute">URL에서 가져옴</span>}
      </div>

      <div className="jd">
        {company && <div className="jd__company">{company}</div>}
        <div className="jd__title">{title}</div>
      </div>

      {summary.length > 0 && (
        <ul className="lines">
          {summary.map((line, i) => (
            <li className="line" key={`${i}-${line}`}>{line}</li>
          ))}
        </ul>
      )}

      <div className="cols">
        <Requirements title="자격요건" items={requirements} empty="공고에 자격요건이 항목으로 적혀 있지 않아요." />
        <Requirements title="우대사항" items={preferred} empty="우대사항이 명시되지 않았어요." />
      </div>
    </section>
  );
}

function Requirements({ title, items, empty }) {
  return (
    <div className="block">
      <h3 className="block__title">{title}</h3>
      {items.length > 0 ? (
        <ul className="reqs">
          {items.map((item, i) => (
            <li className="req" key={`${i}-${item}`}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="block__empty">{empty}</p>
      )}
    </div>
  );
}
