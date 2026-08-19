/**
 * 스킬 사전 기반 정규화 · 추출 (PRD §8.4)
 *
 * 이 모듈은 두 곳에서 쓰인다. 반드시 같은 사전을 통과해야
 * `matched = R ∩ U` 집합 연산이 성립한다(§8.5).
 *   - 공고 텍스트 → R  : scanSkills()
 *   - 이력서 분석 결과 → U : normalizeSkills()
 */
import DICT from './skill-dictionary.json' with { type: 'json' };

/** 정규형 목록 (사전의 `_`로 시작하는 메타 키 제외) */
export const CANONICAL_SKILLS = Object.keys(DICT).filter((k) => !k.startsWith('_'));

/**
 * 별칭 → 정규형 조회 테이블. 긴 별칭이 먼저 오도록 정렬한다.
 * 정렬이 중요한 이유: "javascript"가 "java"보다, "mysql"이 "sql"보다 먼저
 * 매칭되어야 한다. 짧은 쪽이 먼저 걸리면 JavaScript 공고가 Java로 잡힌다.
 */
const ALIAS_ENTRIES = CANONICAL_SKILLS.flatMap((canonical) =>
  [canonical, ...DICT[canonical]].map((alias) => ({ canonical, alias: alias.toLowerCase() }))
).sort((a, b) => b.alias.length - a.alias.length);

const MASK = '\u0000';

/**
 * 자연어 텍스트에서 스킬을 추출한다 (R 집합 구성).
 *
 * 고용24 목록 응답에는 스킬 필드가 없으므로(§8.2) 채용제목과 상세 본문을
 * 이 함수로 스캔해 R을 만든다. 사전에 없는 단어는 스킬로 인정하지 않는다.
 *
 * 매칭된 구간은 마스킹해서 짧은 별칭이 겹쳐 잡히는 것을 막는다.
 * 예: "MySQL" → MySQL만. "Java, JavaScript" → 둘 다.
 *
 * @param {...(string|null|undefined)} texts 스캔할 텍스트들
 * @returns {string[]} 정규형 스킬 배열 (중복 제거, 사전 등재 순)
 */
export function scanSkills(...texts) {
  const joined = texts.filter(Boolean).join('\n').toLowerCase();
  if (!joined) return [];

  const buf = joined.split('');
  const found = new Set();

  for (const { canonical, alias } of ALIAS_ENTRIES) {
    let from = 0;
    for (;;) {
      const at = joined.indexOf(alias, from);
      if (at === -1) break;
      // 이미 더 긴 별칭에 소비된 구간이면 건너뛴다
      const consumed = buf.slice(at, at + alias.length).includes(MASK);
      if (!consumed) {
        found.add(canonical);
        for (let i = at; i < at + alias.length; i++) buf[i] = MASK;
      }
      from = at + 1;
    }
  }
  return CANONICAL_SKILLS.filter((s) => found.has(s));
}

/**
 * 이미 토큰화된 스킬 목록을 정규형으로 변환한다 (U 집합 구성).
 *
 * LLM이 이력서에서 뽑은 스킬 태그, 또는 사람인 `keyword` 필드(콤마 구분,
 * Phase 2)처럼 이미 낱개로 끊긴 입력에 쓴다.
 * 사전에 없는 토큰은 버린다 — 공고 쪽 R도 사전 기반이라, 사전 밖 토큰은
 * 어차피 교집합에 기여하지 못하고 missing 계산만 오염시킨다.
 *
 * @param {string[]|string} raw 스킬 토큰 배열 또는 콤마 구분 문자열
 * @returns {string[]} 정규형 스킬 배열 (중복 제거)
 */
export function normalizeSkills(raw) {
  const tokens = Array.isArray(raw) ? raw : String(raw ?? '').split(',');
  const found = new Set();

  for (const token of tokens) {
    const t = String(token).trim().toLowerCase();
    if (!t) continue;
    // 완전 일치 우선, 없으면 토큰 안에서 스캔 ("Spring Boot 경험" 같은 입력 대비)
    const exact = ALIAS_ENTRIES.find((e) => e.alias === t);
    if (exact) found.add(exact.canonical);
    else scanSkills(t).forEach((s) => found.add(s));
  }
  return CANONICAL_SKILLS.filter((s) => found.has(s));
}

/** 사전에 없어 버려진 토큰. 사전 확충 대상을 찾는 용도(§12 스킬 추출률). */
export function unknownTokens(raw) {
  const tokens = Array.isArray(raw) ? raw : String(raw ?? '').split(',');
  return tokens
    .map((t) => String(t).trim())
    .filter((t) => t && scanSkills(t).length === 0 && !ALIAS_ENTRIES.some((e) => e.alias === t.toLowerCase()));
}
