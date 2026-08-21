/**
 * Claude 호출 계층 (PRD §8.1 · §8.2 · §8.3 · §8.4)
 *
 * 라우트는 여기 있는 세 함수만 부른다. 프롬프트와 스키마 강제를 한곳에 모아 둔 이유는
 * 세 호출이 지켜야 하는 규칙이 사실상 하나이기 때문이다 —
 * **LLM은 주어진 원문 안에서만 쓰고, 새로운 사실을 만들지 않는다** (§12).
 *
 * 스키마는 contract.js의 것을 그대로 쓴다. structured outputs(`output_config.format`)로
 * 응답 형태를 강제하므로 파싱 실패가 원천적으로 발생하지 않는다.
 */
import Anthropic from '@anthropic-ai/sdk';
import { JOB_POSTING_SCHEMA, REASONS_SCHEMA, RESUME_ANALYSIS_SCHEMA } from './contract.js';

/** PRD §8.1 — 이력서와 공고의 자연어 대조는 판단 난이도가 높아 최상위 모델을 쓴다. */
const MODEL = 'claude-opus-5';

let client;
/** ANTHROPIC_API_KEY(또는 ant 프로필)에서 자격증명을 자동으로 읽는다. */
function getClient() {
  client ??= new Anthropic();
  return client;
}

/**
 * structured output 호출 공통부.
 *
 * @param {object}   p
 * @param {string|Array} p.system  시스템 프롬프트 (캐시 지점을 두려면 블록 배열)
 * @param {string}   p.user        사용자 메시지
 * @param {object}   p.schema      contract.js의 JSON Schema
 * @param {string}   p.effort      low | medium | high — 지연과 품질의 균형(§7)
 */
async function structured({ system, user, schema, effort }) {
  const res = await getClient().messages.create({
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    output_config: {
      effort,
      format: { type: 'json_schema', schema },
    },
    system,
    messages: [{ role: 'user', content: user }],
  });

  if (res.stop_reason === 'refusal') {
    throw new Error(`Claude가 응답을 거부했습니다 (${res.stop_details?.category ?? 'unknown'})`);
  }

  const text = res.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');

  // 스키마를 강제했으므로 정상 경로에서는 항상 유효한 JSON이다.
  // 그래도 파싱을 감싸는 이유는, 실패했을 때 라우트가 LLM_FAILED로 내려야 하기 때문이다.
  return JSON.parse(text);
}

// ── 1. 이력서 분석 (F1 · F2) ──────────────────────────

const RESUME_SYSTEM = `당신은 채용 이력서를 구조화하는 분석기다.

규칙:
- 이력서에 **적혀 있는 사실만** 쓴다. 추측·과장·보강을 하지 않는다.
- experiences가 가장 중요하다. 이후 단계에서 "이 경험이 공고의 이 요구사항과 대응한다"는
  근거 문장을 만드는 원재료이므로, 각 항목의 title은 사람이 이력서에서 바로 찾을 수 있는
  이름으로, description은 무엇을 했는지 구체적으로 쓴다.
- 학부연구생·수업 과제·동아리처럼 정규 경력이 아닌 활동도 experiences에 포함한다.
  이 서비스의 사용자는 "그게 경험으로 쳐주는지"를 알고 싶어 하는 사람이다.
- skills는 이력서의 **원문 표기 그대로** 남긴다. 표기 통일은 코드가 사전으로 처리한다.
- totalYears는 정규 경력 연차다. 신입이면 0. 인턴·학부연구생은 연차로 세지 않는다.
- 서술은 한국어로 쓴다.`;

export async function analyzeResume(text) {
  return structured({
    system: RESUME_SYSTEM,
    user: `다음 이력서를 구조화해라.\n\n<이력서>\n${text}\n</이력서>`,
    schema: RESUME_ANALYSIS_SCHEMA,
    // 세션당 1회만 도는 호출이고(§8.5) 이후 모든 진단의 입력이 되므로 품질을 우선한다.
    effort: 'high',
  });
}

// ── 2. 공고 파싱 + 요약 (F3 · F5) ─────────────────────

const POSTING_SYSTEM = `당신은 채용공고에서 요구사항을 추출하는 파서다.

규칙:
- requirements(자격요건)와 preferred(우대사항)는 **공고 원문 문장을 그대로 옮긴다.**
  요약·의역·병합을 하지 않는다. 이후 단계의 근거 문장이 이 문장을 인용하기 때문이다.
- 공고가 자격요건과 우대사항을 구분하지 않았다면, 필수로 읽히는 것만 requirements에 넣고
  preferred는 빈 배열로 둔다. 임의로 나누지 않는다.
- summary는 직무·주요 업무·우대 조건을 3줄 내외로 정리한다. 여기서만 문장을 새로 쓴다.
- skills는 공고가 요구하는 기술·도구·역량을 **원문 표기 그대로** 뽑는다.
  "성실한 분", "책임감" 같은 인성 표현은 역량이 아니므로 넣지 않는다.
  뽑을 것이 없으면 **빈 배열로 둔다.** 억지로 채우면 적합도 점수가 오염된다.
- company를 확정할 수 없으면 빈 문자열로 둔다. 추측하지 않는다.
- 서술은 한국어로 쓴다.`;

export async function parsePosting(text) {
  return structured({
    system: POSTING_SYSTEM,
    user: `다음 채용공고를 구조화해라.\n\n<공고>\n${text}\n</공고>`,
    schema: JOB_POSTING_SCHEMA,
    // 원문 추출이 주된 일이고, 공고를 바꿔가며 반복 호출되므로 지연을 우선한다(§7).
    effort: 'medium',
  });
}

// ── 3. 근거 문장 (F4) ─────────────────────────────────

const REASONS_SYSTEM = `당신은 이미 확정된 적합도 매칭 결과를 **설명하는** 역할만 한다.

절대 규칙:
- 점수를 매기지 않는다. 충족·부족 판정을 바꾸지 않는다. 이미 코드가 확정했다.
- experience 필드에는 주어진 이력서 경험의 title을 **글자 그대로** 복사한다.
- requirement 필드에는 주어진 공고 요구사항 문장을 **글자 그대로** 복사한다.
- text에는 그 둘이 어떻게 대응되는지 한 문장으로 쓴다. 이력서에 없는 경험,
  공고에 없는 요구사항을 만들어 쓰면 서비스가 무너진다.
- 대응 관계가 분명한 것만 쓴다. 억지로 연결하지 말고, 없으면 빈 배열로 둔다.
- 충족 역량(matchedSkills)에 해당하는 대응만 다룬다. 부족 역량은 설명하지 않는다.
- 경험의 증빙 강도를 문장에 반영한다. 인턴·연구실 경험과 수업 과제는 같은 무게가 아니다.
- 한 요구사항에 대해 문장은 하나만 쓴다. 최대 5개.
- 서술은 한국어로, "~합니다" 체로 쓴다.`;

export async function explainFit({ analysis, posting, fit }) {
  // 캐시 지점: 시스템 프롬프트 + 이력서 분석 결과는 공고를 바꿔도 그대로 반복된다(§8.5).
  // 공고와 매칭 결과만 뒤쪽 user 메시지에 두어 프리픽스를 안정화한다.
  const system = [
    { type: 'text', text: REASONS_SYSTEM },
    {
      type: 'text',
      text: `<이력서_경험>\n${JSON.stringify(analysis.experiences, null, 2)}\n</이력서_경험>\n<이력서_요약>\n${analysis.summary}\n</이력서_요약>`,
      cache_control: { type: 'ephemeral' },
    },
  ];

  const user = [
    `<공고_요구사항>\n${posting.requirements.join('\n')}\n</공고_요구사항>`,
    posting.preferred.length ? `<공고_우대사항>\n${posting.preferred.join('\n')}\n</공고_우대사항>` : '',
    `<확정된_충족_역량>\n${fit.matchedSkills.join(', ')}\n</확정된_충족_역량>`,
    '위 충족 역량이 왜 충족으로 판정됐는지, 이력서 경험과 공고 요구사항을 짚어 설명해라.',
  ]
    .filter(Boolean)
    .join('\n\n');

  const { reasons } = await structured({
    system,
    user,
    schema: REASONS_SCHEMA,
    // 공고마다 도는 호출이다. 진단 1건 10초 내외 목표(§7)를 지키려면 여기서 아끼지 않으면 안 된다.
    effort: 'medium',
  });

  return reasons;
}
