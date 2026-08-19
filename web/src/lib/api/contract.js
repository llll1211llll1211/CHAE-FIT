/**
 * API 계약 (docs/API.md의 실행 가능한 정본)
 *
 * 여기 정의된 스키마는 두 곳에서 동시에 쓰인다:
 *   1. Claude structured outputs — LLM 응답 형태를 강제
 *   2. API 응답 형태 — 프론트가 소비
 * 하나의 객체를 공유하므로 명세서와 실물이 어긋날 수 없다 (PRD §8.2).
 */

// ── 에러 ──────────────────────────────────────────────
//
// message는 ErrorBanner에 그대로 노출되는 사용자 문구다 (PRD §9.1).
// code는 프론트 분기용이며 절대 화면에 표시하지 않는다.

export const ERRORS = {
  UNSUPPORTED_FILE_TYPE: { status: 400, message: '지원하지 않는 파일 형식입니다. PDF 또는 .txt 파일을 올려주세요.' },
  FILE_TOO_LARGE:        { status: 400, message: '파일 크기는 5MB 이하만 업로드할 수 있어요.' },
  NO_FILE:               { status: 400, message: '이력서 파일을 선택해주세요.' },
  EXTRACTION_FAILED:     { status: 422, message: '이력서에서 텍스트를 읽지 못했어요. 텍스트가 포함된 PDF인지 확인해주세요.' },

  EMPTY_INPUT:           { status: 400, message: '채용공고 내용을 입력해주세요.' },
  AMBIGUOUS_INPUT:       { status: 400, message: '공고 URL과 본문 중 하나만 입력해주세요.' },
  URL_FETCH_FAILED:      { status: 422, message: '이 주소에서 공고를 가져오지 못했어요. 본문을 직접 붙여넣어 주세요.' },

  MISSING_ANALYSIS:      { status: 400, message: '이력서 분석 결과가 없습니다. 이력서를 먼저 업로드해주세요.' },
  MISSING_POSTING:       { status: 400, message: '채용공고 정보가 없습니다. 공고를 먼저 입력해주세요.' },

  LLM_FAILED:            { status: 502, message: '분석에 실패했습니다. 잠시 후 다시 시도해주세요.' },
  INTERNAL:              { status: 500, message: '오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
};

/** 규격화된 에러 응답. 모든 라우트가 이 형태로만 실패한다. */
export function fail(code, detail) {
  const e = ERRORS[code] ?? ERRORS.INTERNAL;
  return Response.json(
    { error: { code, message: e.message, ...(detail ? { detail } : {}) } },
    { status: e.status }
  );
}

// ── 스키마 ────────────────────────────────────────────

/** 이력서 분석 결과 (PRD §8.2). Claude structured output 스키마 겸 API 응답 형태. */
export const RESUME_ANALYSIS_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string', description: '경력을 2~3문장으로 요약' },
    totalYears: { type: 'number', description: '총 경력 연차. 신입이면 0' },
    skills: {
      type: 'array',
      items: { type: 'string' },
      description: '이력서에 드러난 기술·역량. 원문 표기 그대로',
    },
    experiences: {
      type: 'array',
      description: '프로젝트·인턴·직무 경험 단위. 적합도 근거 문장의 원재료가 되므로 구체적으로',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string', description: '경험 이름 (예: 졸업작품 캡스톤 프로젝트)' },
          description: { type: 'string', description: '무엇을 했는지 1~2문장' },
          skills: { type: 'array', items: { type: 'string' } },
        },
        required: ['title', 'description', 'skills'],
        additionalProperties: false,
      },
    },
  },
  required: ['summary', 'totalYears', 'skills', 'experiences'],
  additionalProperties: false,
};

/** 채용공고 파싱 결과 (PRD §8.3). 요약(F5)을 함께 담는다. */
export const JOB_POSTING_SCHEMA = {
  type: 'object',
  properties: {
    company: { type: 'string', description: '회사명. 알 수 없으면 빈 문자열' },
    title: { type: 'string', description: '공고 제목' },
    summary: {
      type: 'array',
      items: { type: 'string' },
      description: 'F5: 핵심 자격요건과 우대사항을 3줄 내외로',
    },
    requirements: { type: 'array', items: { type: 'string' }, description: '자격요건 원문 문장' },
    preferred: { type: 'array', items: { type: 'string' }, description: '우대사항 원문 문장' },
    skills: {
      type: 'array',
      items: { type: 'string' },
      description: '공고가 요구하는 기술·역량. 원문 표기 그대로',
    },
  },
  required: ['company', 'title', 'summary', 'requirements', 'preferred', 'skills'],
  additionalProperties: false,
};

/**
 * 근거 문장 (PRD §8.4).
 *
 * LLM은 **이 스키마만** 생성한다. 점수·충족/부족 목록은 집합 연산으로 이미 확정된
 * 상태로 전달되며, LLM은 그것을 설명하는 문장만 쓴다. 환각 방지의 핵심(§12).
 */
export const REASONS_SCHEMA = {
  type: 'object',
  properties: {
    reasons: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          experience: { type: 'string', description: '이력서 경험 항목의 title을 그대로 인용' },
          requirement: { type: 'string', description: '공고 요구사항 문장을 그대로 인용' },
          text: { type: 'string', description: '둘이 어떻게 대응되는지 1문장' },
        },
        required: ['experience', 'requirement', 'text'],
        additionalProperties: false,
      },
    },
  },
  required: ['reasons'],
  additionalProperties: false,
};

// ── 적합도 산출 (PRD §8.4) — 전부 결정적 ────────────────

/**
 * 적합도 진단. LLM은 관여하지 않는다.
 *
 * @param {string[]} userSkills   정규형 사용자 역량 U
 * @param {string[]} requiredSkills 정규형 공고 요구 역량 R
 */
export function computeFit(userSkills, requiredSkills) {
  const U = new Set(userSkills);
  const R = requiredSkills ?? [];

  const matchedSkills = R.filter((s) => U.has(s));
  const missingSkills = R.filter((s) => !U.has(s));

  return {
    matchedSkills,
    missingSkills,
    matchedCount: matchedSkills.length,
    requiredCount: R.length,
    fitScore: scoreOf(matchedSkills.length, R.length),
    // false면 화면은 점수와 역량 영역을 통째로 숨긴다 (PRD §9.1 ⑤).
    // "정보 없음"이 "적합도 0%"로 오독되면 안 된다.
    hasSkillInfo: R.length > 0,
  };
}

/**
 * 충족 개수 ÷ 요구 개수. 단 요구 역량이 빈약한 공고는 가중치를 낮춘다.
 * 요구사항 1개짜리 공고가 100%로 뜨는 것은 잘 맞는 게 아니라 정보가 없는 것이다.
 *
 * @returns {number|null} 0~1, 요구 역량이 없으면 null
 */
export function scoreOf(matchedCount, requiredCount) {
  if (requiredCount === 0) return null;
  const base = matchedCount / requiredCount;
  const penalty = requiredCount >= 3 ? 1 : 0.6 + 0.2 * (requiredCount - 1); // 1→0.6, 2→0.8
  return Math.round(base * penalty * 1000) / 1000;
}

// ── 실행 모드 ─────────────────────────────────────────

/**
 * 키가 없으면 자동으로 목업 응답을 낸다.
 * 팀원이 키 없이 클론해도 화면 작업이 막히지 않게 하기 위함이다.
 */
export const USE_MOCK = !process.env.ANTHROPIC_API_KEY;
