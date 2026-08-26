'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { normalizeSkills, scanSkills } from '@/lib/skills/normalize';

/**
 * 이력서가 없는 사용자를 위한 직접 입력 폼.
 *
 * ①~⑩ 섹션은 대부분 나중에 만들 PDF 이력서 추출 기능을 위한 것이고,
 * 진단(analysis)에는 경력 연차·보유 역량 태그·경력/활동 설명만 쓰인다
 * (완전히 클라이언트에서 결정적으로 조립 — 여기서는 LLM을 호출하지 않는다).
 * PDF 전용 필드는 `profile`로 따로 모아 상위로 넘긴다.
 */

function useEntryList() {
  const [items, setItems] = useState([]);
  const idRef = useRef(0);

  function add(defaults) {
    idRef.current += 1;
    setItems((prev) => [...prev, { id: idRef.current, ...defaults }]);
  }
  function remove(id) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }
  function update(id, patch) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  return { items, add, remove, update };
}

function Accordion({ title, meta, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`accordion${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="accordion__head"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="accordion__title">{title}</span>
        <span className="accordion__headRight">
          {meta != null && <span className="accordion__meta">{meta}</span>}
          <span className="accordion__chevron" aria-hidden="true">▾</span>
        </span>
      </button>
      {open && <div className="accordion__body">{children}</div>}
    </div>
  );
}

function RepeatableList({ list, renderFields, addLabel, emptyHint }) {
  return (
    <div>
      {list.items.length === 0 && emptyHint && <p className="block__empty">{emptyHint}</p>}
      {list.items.map((item) => (
        <div className="entrycard" key={item.id}>
          {renderFields(item, (patch) => list.update(item.id, patch))}
          <button
            type="button"
            className="linkbtn entrycard__remove"
            onClick={() => list.remove(item.id)}
          >
            이 항목 삭제
          </button>
        </div>
      ))}
      <button type="button" className="addbtn" onClick={() => list.add({})}>
        {addLabel}
      </button>
    </div>
  );
}

function Field({ label, optional, children }) {
  return (
    <div className="field">
      <label className="field__label">
        {label}
        {optional && <span className="field__label--optional"> (선택)</span>}
      </label>
      {children}
    </div>
  );
}

function TagInput({ tags, onAdd, onRemove, placeholder }) {
  const [draft, setDraft] = useState('');

  function commit() {
    const value = draft.trim();
    if (value && !tags.includes(value)) onAdd(value);
    setDraft('');
  }

  return (
    <div className="tagInput">
      {tags.map((tag) => (
        <span className="chip chip--fill chip--removable" key={tag}>
          {tag}
          <button
            type="button"
            className="chip__x"
            onClick={() => onRemove(tag)}
            aria-label={`${tag} 삭제`}
          >
            ✕
          </button>
        </span>
      ))}
      <input
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            commit();
          }
        }}
        onBlur={commit}
      />
    </div>
  );
}

function buildAutoSummary({ isNewGrad, years, skillTags, expCount }) {
  const parts = [isNewGrad ? '신입' : `경력 ${years || 0}년차`];

  if (skillTags.length > 0) {
    const shown = skillTags.slice(0, 5).join(', ');
    parts.push(`${shown}${skillTags.length > 5 ? ' 등' : ''} ${skillTags.length}개 역량 보유`);
  }
  if (expCount > 0) parts.push(`주요 경력·활동 ${expCount}건`);

  return `${parts.join(', ')}.`;
}

function experienceFrom(kind, item) {
  const titleParts = kind === 'career' ? [item.company, item.role] : [item.org, item.role];
  const title = titleParts.filter(Boolean).join(' · ') || (kind === 'career' ? '경력' : '학내외활동');
  const description = [item.description, item.episode].filter(Boolean).join('\n');
  return { title, description };
}

export default function ManualEntrySection({ onComplete, onBack }) {
  const [basic, setBasic] = useState({ name: '', birthDate: '', email: '', phone: '', address: '' });
  const [targetRole, setTargetRole] = useState('');

  const educationList = useEntryList();
  const careerList = useEntryList();
  const certificationList = useEntryList();
  const languageList = useEntryList();
  const computerSkillList = useEntryList();
  const activityList = useEntryList();
  const awardList = useEntryList();
  const trainingList = useEntryList();
  const overseasList = useEntryList();
  const volunteerList = useEntryList();

  const [isNewGrad, setIsNewGrad] = useState(true);
  const [years, setYears] = useState('');
  const [skillTags, setSkillTags] = useState([]);

  const [summaryText, setSummaryText] = useState('');
  const [summaryTouched, setSummaryTouched] = useState(false);

  const [consented, setConsented] = useState(false);

  const scanText = useMemo(
    () =>
      [...careerList.items, ...activityList.items]
        .map((it) => `${it.description ?? ''} ${it.episode ?? ''}`)
        .join(' '),
    [careerList.items, activityList.items]
  );
  const suggestedTags = useMemo(
    () => scanSkills(scanText).filter((s) => !skillTags.includes(s)),
    [scanText, skillTags]
  );

  const expCount = careerList.items.length + activityList.items.length;

  useEffect(() => {
    if (summaryTouched) return;
    setSummaryText(buildAutoSummary({ isNewGrad, years, skillTags, expCount }));
  }, [summaryTouched, isNewGrad, years, skillTags, expCount]);

  const hasMinimumInput =
    skillTags.length > 0 ||
    careerList.items.some((c) => c.company?.trim()) ||
    activityList.items.some((a) => a.org?.trim());
  const canSubmit = hasMinimumInput && consented;

  function submit() {
    if (!canSubmit) return;

    const normalizedTags = normalizeSkills(skillTags);

    const rawExperiences = [
      ...careerList.items.filter((c) => c.company?.trim()).map((c) => experienceFrom('career', c)),
      ...activityList.items.filter((a) => a.org?.trim()).map((a) => experienceFrom('activity', a)),
    ];
    const experiences = rawExperiences.map(({ title, description }) => ({
      title,
      description,
      skills: scanSkills(description).filter((s) => normalizedTags.includes(s)),
    }));

    const analysis = {
      summary: summaryText,
      totalYears: isNewGrad ? 0 : Math.max(0, Number(years) || 0),
      skills: normalizedTags,
      experiences,
    };

    const profile = {
      basic,
      targetRole,
      educations: educationList.items,
      certifications: certificationList.items,
      languages: languageList.items,
      computerSkills: computerSkillList.items,
      activities: activityList.items,
      awards: awardList.items,
      trainings: trainingList.items,
      overseasExperiences: overseasList.items,
      volunteers: volunteerList.items,
    };

    onComplete(analysis, profile);
  }

  return (
    <section className="card" aria-labelledby="manualTitle">
      {onBack && (
        <button className="linkbtn linkbtn--back" type="button" onClick={onBack}>
          ← 다른 방법으로 시작
        </button>
      )}
      <h2 className="card__title" id="manualTitle">직접 입력으로 진단 시작하기</h2>
      <p className="card__hint">
        이력서가 없어도 괜찮아요. 경력·활동 내용을 채운 만큼 진단에 쓰이고, 나중에 이 내용으로
        이력서 PDF도 만들 수 있게 준비해둘게요.
      </p>

      <div className="block">
        <h3 className="block__title">경력 연차</h3>
        <div className="radiogroup">
          <label>
            <input
              type="radio"
              name="careerLevel"
              checked={isNewGrad}
              onChange={() => setIsNewGrad(true)}
            />
            신입
          </label>
          <label>
            <input
              type="radio"
              name="careerLevel"
              checked={!isNewGrad}
              onChange={() => setIsNewGrad(false)}
            />
            경력
          </label>
          {!isNewGrad && (
            <input
              className="input"
              type="number"
              min="0"
              value={years}
              placeholder="연차"
              onChange={(e) => setYears(e.target.value)}
            />
          )}
        </div>
      </div>

      <div className="block">
        <h3 className="block__title">보유 역량 태그</h3>
        <p className="block__hint">자유롭게 입력하고 Enter로 추가하세요. 아래 진단에서 공고 요구 역량과 비교돼요.</p>
        <TagInput
          tags={skillTags}
          onAdd={(tag) => setSkillTags((prev) => [...prev, tag])}
          onRemove={(tag) => setSkillTags((prev) => prev.filter((t) => t !== tag))}
          placeholder="예: Python, 데이터 분석, Git"
        />
        {suggestedTags.length > 0 && (
          <p className="block__hint">
            입력한 내용에서 찾은 태그:{' '}
            {suggestedTags.map((tag) => (
              <button
                type="button"
                key={tag}
                className="chip chip--outline"
                onClick={() => setSkillTags((prev) => [...prev, tag])}
              >
                + {tag}
              </button>
            ))}
          </p>
        )}
      </div>

      <div className="block">
        <h3 className="block__title">기본정보 <span className="block__count">선택</span></h3>
        <Accordion title="기본정보" meta={basic.name || '비어있음'} defaultOpen>
          <p className="block__hint">
            나중에 이 내용으로 이력서 PDF를 만들 수 있게 준비해둘게요. 지금 채워두면 그때 다시 입력하지 않아도 돼요.
          </p>
          <div className="formgrid">
            <Field label="이름" optional>
              <input className="input" value={basic.name} onChange={(e) => setBasic({ ...basic, name: e.target.value })} />
            </Field>
            <Field label="생년월일" optional>
              <input className="input" type="date" value={basic.birthDate} onChange={(e) => setBasic({ ...basic, birthDate: e.target.value })} />
            </Field>
            <Field label="이메일" optional>
              <input className="input" type="email" value={basic.email} onChange={(e) => setBasic({ ...basic, email: e.target.value })} />
            </Field>
            <Field label="휴대폰" optional>
              <input className="input" value={basic.phone} onChange={(e) => setBasic({ ...basic, phone: e.target.value })} placeholder="010-0000-0000" />
            </Field>
            <Field label="주소" optional>
              <input className="input" value={basic.address} onChange={(e) => setBasic({ ...basic, address: e.target.value })} />
            </Field>
          </div>
        </Accordion>

        <Accordion title="지원 정보" meta={targetRole || '비어있음'}>
          <Field label="희망 직무 / 지원분야" optional>
            <input className="input" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="예: 반도체 공정기술 PE" />
          </Field>
        </Accordion>

        <Accordion title="학력사항" meta={`${educationList.items.length}건`}>
          <RepeatableList
            list={educationList}
            addLabel="+ 학력 추가"
            emptyHint="학교를 추가해보세요."
            renderFields={(item, patch) => (
              <div className="formgrid">
                <Field label="구분">
                  <select className="input" value={item.level ?? '대학교'} onChange={(e) => patch({ level: e.target.value })}>
                    <option>고등학교</option>
                    <option>대학교</option>
                    <option>대학원</option>
                  </select>
                </Field>
                <Field label="학교명">
                  <input className="input" value={item.schoolName ?? ''} onChange={(e) => patch({ schoolName: e.target.value })} />
                </Field>
                <Field label="재학기간">
                  <input className="input" value={item.period ?? ''} onChange={(e) => patch({ period: e.target.value })} placeholder="2020.03 ~ 2026.02" />
                </Field>
                <Field label="상태">
                  <select className="input" value={item.status ?? '졸업예정'} onChange={(e) => patch({ status: e.target.value })}>
                    <option>졸업</option>
                    <option>졸업예정</option>
                    <option>재학</option>
                    <option>중퇴</option>
                  </select>
                </Field>
                <Field label="전공" optional>
                  <input className="input" value={item.major ?? ''} onChange={(e) => patch({ major: e.target.value })} />
                </Field>
                <Field label="학점" optional>
                  <input className="input" value={item.gpa ?? ''} onChange={(e) => patch({ gpa: e.target.value })} placeholder="4.15 / 4.5" />
                </Field>
              </div>
            )}
          />
        </Accordion>
      </div>

      <div className="block">
        <h3 className="block__title">경력사항 <span className="block__count">{careerList.items.length}</span></h3>
        <p className="block__hint">진단에 직접 쓰이는 항목이에요. 무엇을 했는지 구체적으로 적을수록 근거가 좋아져요.</p>
        <RepeatableList
          list={careerList}
          addLabel="+ 경력 추가"
          emptyHint="아르바이트, 인턴, 프로젝트 등 어떤 경험도 좋아요."
          renderFields={(item, patch) => (
            <>
              <div className="formgrid">
                <Field label="회사·기관명">
                  <input className="input" value={item.company ?? ''} onChange={(e) => patch({ company: e.target.value })} />
                </Field>
                <Field label="재직기간">
                  <input className="input" value={item.period ?? ''} onChange={(e) => patch({ period: e.target.value })} placeholder="2025.06 ~ 2025.12" />
                </Field>
                <Field label="직무·부서" optional>
                  <input className="input" value={item.role ?? ''} onChange={(e) => patch({ role: e.target.value })} />
                </Field>
                <Field label="고용형태" optional>
                  <select className="input" value={item.employmentType ?? '인턴'} onChange={(e) => patch({ employmentType: e.target.value })}>
                    <option>인턴</option>
                    <option>정규직</option>
                    <option>계약직</option>
                    <option>파견</option>
                    <option>기타</option>
                  </select>
                </Field>
              </div>
              <Field label="무엇을 했는지">
                <textarea className="textarea" rows={3} value={item.description ?? ''} onChange={(e) => patch({ description: e.target.value })} placeholder="맡았던 업무를 구체적으로 적어주세요." />
              </Field>
              <Field label="대표 사례" optional>
                <textarea className="textarea" rows={3} value={item.episode ?? ''} onChange={(e) => patch({ episode: e.target.value })} placeholder="어떤 상황에서 무엇을 했고 결과가 어땠는지 — 나중에 자소서 초안에도 그대로 쓸 수 있어요." />
              </Field>
            </>
          )}
        />
      </div>

      <div className="block">
        <h3 className="block__title">학내외활동 <span className="block__count">{activityList.items.length}</span></h3>
        <p className="block__hint">동아리·학생회·재능기부 등도 진단에 쓰이는 경험으로 인정돼요.</p>
        <RepeatableList
          list={activityList}
          addLabel="+ 활동 추가"
          emptyHint="아직 추가된 활동이 없어요."
          renderFields={(item, patch) => (
            <>
              <div className="formgrid">
                <Field label="활동구분" optional>
                  <input className="input" value={item.category ?? ''} onChange={(e) => patch({ category: e.target.value })} placeholder="동아리, 학생회, 재능기부 등" />
                </Field>
                <Field label="기관·조직명">
                  <input className="input" value={item.org ?? ''} onChange={(e) => patch({ org: e.target.value })} />
                </Field>
                <Field label="활동기간">
                  <input className="input" value={item.period ?? ''} onChange={(e) => patch({ period: e.target.value })} placeholder="2024.12 ~ 2025.06" />
                </Field>
                <Field label="역할" optional>
                  <input className="input" value={item.role ?? ''} onChange={(e) => patch({ role: e.target.value })} />
                </Field>
              </div>
              <Field label="무엇을 했는지">
                <textarea className="textarea" rows={3} value={item.description ?? ''} onChange={(e) => patch({ description: e.target.value })} />
              </Field>
              <Field label="대표 사례" optional>
                <textarea className="textarea" rows={3} value={item.episode ?? ''} onChange={(e) => patch({ episode: e.target.value })} placeholder="구체적인 사례를 적어두면 자소서 초안에도 재사용할 수 있어요." />
              </Field>
            </>
          )}
        />
      </div>

      <div className="block">
        <h3 className="block__title">자격증 · 어학 · 컴퓨터활용능력 <span className="block__count">선택</span></h3>

        <Accordion title="자격증" meta={`${certificationList.items.length}건`}>
          <RepeatableList
            list={certificationList}
            addLabel="+ 자격증 추가"
            renderFields={(item, patch) => (
              <div className="formgrid">
                <Field label="자격증명">
                  <input className="input" value={item.name ?? ''} onChange={(e) => patch({ name: e.target.value })} />
                </Field>
                <Field label="발급기관" optional>
                  <input className="input" value={item.issuer ?? ''} onChange={(e) => patch({ issuer: e.target.value })} />
                </Field>
                <Field label="취득일" optional>
                  <input className="input" type="month" value={item.date ?? ''} onChange={(e) => patch({ date: e.target.value })} />
                </Field>
              </div>
            )}
          />
        </Accordion>

        <Accordion title="어학" meta={`${languageList.items.length}건`}>
          <RepeatableList
            list={languageList}
            addLabel="+ 어학 시험 추가"
            renderFields={(item, patch) => (
              <div className="formgrid">
                <Field label="시험명">
                  <input className="input" value={item.testName ?? ''} onChange={(e) => patch({ testName: e.target.value })} placeholder="TOEIC, TOEIC Speaking 등" />
                </Field>
                <Field label="점수·등급" optional>
                  <input className="input" value={item.score ?? ''} onChange={(e) => patch({ score: e.target.value })} />
                </Field>
                <Field label="응시일" optional>
                  <input className="input" type="month" value={item.date ?? ''} onChange={(e) => patch({ date: e.target.value })} />
                </Field>
              </div>
            )}
          />
        </Accordion>

        <Accordion title="컴퓨터활용능력" meta={`${computerSkillList.items.length}건`}>
          <RepeatableList
            list={computerSkillList}
            addLabel="+ 활용능력 추가"
            renderFields={(item, patch) => (
              <div className="formgrid">
                <Field label="프로그램명">
                  <input className="input" value={item.programName ?? ''} onChange={(e) => patch({ programName: e.target.value })} placeholder="엑셀, JMP 등" />
                </Field>
                <Field label="활용수준" optional>
                  <select className="input" value={item.level ?? '중급'} onChange={(e) => patch({ level: e.target.value })}>
                    <option>초급</option>
                    <option>중급</option>
                    <option>고급</option>
                  </select>
                </Field>
                <Field label="사용기간" optional>
                  <input className="input" value={item.period ?? ''} onChange={(e) => patch({ period: e.target.value })} />
                </Field>
              </div>
            )}
          />
        </Accordion>
      </div>

      <div className="block">
        <h3 className="block__title">수상경력 <span className="block__count">선택</span></h3>
        <Accordion title="수상경력" meta={`${awardList.items.length}건`}>
          <RepeatableList
            list={awardList}
            addLabel="+ 수상경력 추가"
            renderFields={(item, patch) => (
              <>
                <div className="formgrid">
                  <Field label="수상명">
                    <input className="input" value={item.name ?? ''} onChange={(e) => patch({ name: e.target.value })} />
                  </Field>
                  <Field label="수여기관" optional>
                    <input className="input" value={item.org ?? ''} onChange={(e) => patch({ org: e.target.value })} />
                  </Field>
                  <Field label="수상일" optional>
                    <input className="input" type="month" value={item.date ?? ''} onChange={(e) => patch({ date: e.target.value })} />
                  </Field>
                </div>
                <Field label="주제·역할·취득 역량" optional>
                  <textarea className="textarea" rows={2} value={item.description ?? ''} onChange={(e) => patch({ description: e.target.value })} />
                </Field>
              </>
            )}
          />
        </Accordion>
      </div>

      <div className="block">
        <h3 className="block__title">교육이수사항 <span className="block__count">선택</span></h3>
        <Accordion title="교육이수사항" meta={`${trainingList.items.length}건`}>
          <RepeatableList
            list={trainingList}
            addLabel="+ 교육이수사항 추가"
            renderFields={(item, patch) => (
              <>
                <div className="formgrid">
                  <Field label="교육명">
                    <input className="input" value={item.name ?? ''} onChange={(e) => patch({ name: e.target.value })} />
                  </Field>
                  <Field label="교육기관" optional>
                    <input className="input" value={item.org ?? ''} onChange={(e) => patch({ org: e.target.value })} />
                  </Field>
                  <Field label="이수기간" optional>
                    <input className="input" value={item.period ?? ''} onChange={(e) => patch({ period: e.target.value })} />
                  </Field>
                  <Field label="교육시간" optional>
                    <input className="input" value={item.hours ?? ''} onChange={(e) => patch({ hours: e.target.value })} placeholder="40시간" />
                  </Field>
                </div>
                <Field label="학습내용" optional>
                  <textarea className="textarea" rows={2} value={item.description ?? ''} onChange={(e) => patch({ description: e.target.value })} />
                </Field>
              </>
            )}
          />
        </Accordion>
      </div>

      <div className="block">
        <h3 className="block__title">해외경험 · 봉사활동 <span className="block__count">선택</span></h3>

        <Accordion title="해외경험" meta={`${overseasList.items.length}건`}>
          <RepeatableList
            list={overseasList}
            addLabel="+ 해외경험 추가"
            renderFields={(item, patch) => (
              <>
                <div className="formgrid">
                  <Field label="국가">
                    <input className="input" value={item.country ?? ''} onChange={(e) => patch({ country: e.target.value })} />
                  </Field>
                  <Field label="목적" optional>
                    <select className="input" value={item.purpose ?? '기타'} onChange={(e) => patch({ purpose: e.target.value })}>
                      <option>어학연수</option>
                      <option>교환학생</option>
                      <option>박람회/전시</option>
                      <option>여행</option>
                      <option>기타</option>
                    </select>
                  </Field>
                  <Field label="기간" optional>
                    <input className="input" value={item.period ?? ''} onChange={(e) => patch({ period: e.target.value })} />
                  </Field>
                </div>
                <Field label="내용" optional>
                  <textarea className="textarea" rows={2} value={item.description ?? ''} onChange={(e) => patch({ description: e.target.value })} />
                </Field>
              </>
            )}
          />
        </Accordion>

        <Accordion title="봉사활동" meta={`${volunteerList.items.length}건`}>
          <RepeatableList
            list={volunteerList}
            addLabel="+ 봉사활동 추가"
            renderFields={(item, patch) => (
              <>
                <div className="formgrid">
                  <Field label="봉사구분" optional>
                    <input className="input" value={item.category ?? ''} onChange={(e) => patch({ category: e.target.value })} />
                  </Field>
                  <Field label="주관기관" optional>
                    <input className="input" value={item.org ?? ''} onChange={(e) => patch({ org: e.target.value })} />
                  </Field>
                  <Field label="기간" optional>
                    <input className="input" value={item.period ?? ''} onChange={(e) => patch({ period: e.target.value })} />
                  </Field>
                  <Field label="참여시간" optional>
                    <input className="input" value={item.hours ?? ''} onChange={(e) => patch({ hours: e.target.value })} placeholder="24시간" />
                  </Field>
                </div>
                <Field label="내용" optional>
                  <textarea className="textarea" rows={2} value={item.description ?? ''} onChange={(e) => patch({ description: e.target.value })} />
                </Field>
              </>
            )}
          />
        </Accordion>
      </div>

      <div className="block">
        <h3 className="block__title">한 줄 요약</h3>
        <textarea
          className="textarea"
          rows={2}
          value={summaryText}
          onChange={(e) => {
            setSummaryTouched(true);
            setSummaryText(e.target.value);
          }}
        />
        {summaryTouched && (
          <button type="button" className="linkbtn" onClick={() => setSummaryTouched(false)}>
            자동 생성 문구로 되돌리기
          </button>
        )}
      </div>

      <label className="consent">
        <input type="checkbox" checked={consented} onChange={(e) => setConsented(e.target.checked)} />
        <span>
          입력하신 내용은 적합도 진단 시 외부 AI(Anthropic Claude API, 국외 서버)로 전송·처리위탁되며,
          진단 목적 외에는 사용되지 않고 세션 종료 시 삭제돼요. 위 내용에 동의해야 다음 단계로 진행할 수 있어요.
        </span>
      </label>

      <button className="submit" type="button" disabled={!canSubmit} onClick={submit}>
        입력 완료, 진단 시작하기
      </button>
      {!hasMinimumInput && (
        <p className="counter">보유 역량 태그, 경력, 활동 중 최소 하나는 채워주셔야 진단할 수 있어요.</p>
      )}
    </section>
  );
}
