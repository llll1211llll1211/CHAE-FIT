'use client';

import { useEffect, useState } from 'react';
import { postJson } from '@/lib/api/client';

/**
 * 성장 로드맵 — 경력공고 비교 (신규 기능)
 *
 * 코퍼스에 이 회사·직무의 경력직 페어가 있을 때만 실제 로드맵을 보여준다.
 * **점수·퍼센트를 절대 표시하지 않는다** — "부족하다"가 아니라 "다음 단계에
 * 필요해진다"는 프레이밍만 쓴다(사용자 요구사항의 핵심 제약).
 *
 * 사이드바에서 독립된 페이지로 들어오므로, 매칭 실패도 빈 화면이 아니라
 * 안내 카드로 보여준다(§9.1과 달리 여기서는 "조용한 침묵"을 쓰지 않는다).
 */
export default function CareerOutlook({ analysis, posting }) {
  const [state, setState] = useState({ status: 'loading', data: null });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading', data: null });

    postJson('/api/career/outlook', { analysis, posting })
      .then((data) => {
        if (!cancelled) setState({ status: 'done', data });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'done', data: { matched: false } });
      });

    return () => {
      cancelled = true;
    };
  }, [analysis, posting]);

  if (state.status === 'loading') {
    return (
      <section className="card card--outlook" aria-labelledby="careerOutlookTitle">
        <div className="card__head">
          <h2 className="card__title" id="careerOutlookTitle">성장 로드맵</h2>
        </div>
        <p className="block__empty">경력직 공고를 비교하고 있어요...</p>
      </section>
    );
  }

  if (!state.data?.matched) {
    return (
      <section className="card card--outlook" aria-labelledby="careerOutlookTitle">
        <div className="card__head">
          <h2 className="card__title" id="careerOutlookTitle">성장 로드맵</h2>
        </div>
        <p className="block__empty">
          이 공고는 아직 비교할 경력직 데이터가 없어요. 데이터가 쌓이는 대로 여기서 보여드릴게요.
        </p>
      </section>
    );
  }

  const { company, careerTitle, experienceYears, collectedAt, futureSkills } = state.data;

  return (
    <section className="card card--outlook" aria-labelledby="careerOutlookTitle">
      <div className="card__head">
        <h2 className="card__title" id="careerOutlookTitle">성장 로드맵</h2>
        <span className="pill pill--mute">표준 템플릿 추정 · {collectedAt} 수집</span>
      </div>
      <p className="card__hint">
        입사 후 이 팀에 자연스럽게 적응하려면 다음에 뭐가 필요할까요.
        {company}의 경력직({careerTitle}, {experienceYears}) 공고를 기준으로 짚어드려요.
        지금 없다고 감점되는 게 아니라, 다음 단계를 준비할 방향이에요.
      </p>

      {futureSkills.length > 0 ? (
        <ul className="outlook-list">
          {futureSkills.map((skill) => (
            <FutureSkill key={skill.tagId} skill={skill} />
          ))}
        </ul>
      ) : (
        <p className="block__empty">
          이 회사의 경력직 공고가 추가로 요구하는 역량이, 지금 이력서에서 이미 대부분 확인돼요.
        </p>
      )}

      <p className="disclaimer">
        경력 공고는 공개된 공고 패턴을 기반으로 한 표준 템플릿 추정이며, 해당 기업의
        실제 채용 기준과 다를 수 있습니다.
      </p>
    </section>
  );
}

function FutureSkill({ skill }) {
  const { label, category, reason, courses } = skill;

  return (
    <li className="outlook-item">
      <div className="outlook-item__head">
        <span className="chip chip--outline">{label}</span>
        <span className="outlook-item__category">{category}</span>
      </div>
      {reason && <p className="outlook-item__reason">{reason}</p>}

      {courses.length > 0 ? (
        <ul className="course-list">
          {courses.map((c) => (
            <li className="course" key={c.id}>
              <div className="course__title">{c.title}</div>
              <div className="course__meta">
                {c.provider} · {c.region}
                {c.subsidyRate != null && (
                  <> · 국비지원 {Math.round(c.subsidyRate * 100)}%(자비 {c.selfPay?.toLocaleString()}원)</>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="course-list__empty">이 역량에 맞는 국비지원 강의를 준비 중이에요.</p>
      )}
    </li>
  );
}
