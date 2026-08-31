/**
 * 스킬 사전 기반 정규화 · 추출 (PRD §8.4)
 *
 * 이 모듈은 두 곳에서 쓰인다. 반드시 같은 사전을 통과해야
 * `matched = R ∩ U` 집합 연산이 성립한다(§8.5).
 *   - 공고 텍스트 → R  : scanSkills()
 *   - 이력서 분석 결과 → U : normalizeSkills()
 *
 * 매칭 알고리즘 자체는 `matcher.js`의 팩토리를 그대로 쓴다(경력공고 비교 기능의
 * 96-태그 사전용 매처와 공유) — 이 파일은 IT·직무 일반 사전을 감싸는 래퍼일 뿐이다.
 */
import { createSkillMatcher } from './matcher.js';
import DICT from './skill-dictionary.json' with { type: 'json' };

const matcher = createSkillMatcher(DICT);

/** 정규형 목록 (사전의 `_`로 시작하는 메타 키 제외) */
export const CANONICAL_SKILLS = matcher.CANONICAL;

/**
 * 자연어 텍스트에서 스킬을 추출한다 (R 집합 구성).
 *
 * 고용24 목록 응답에는 스킬 필드가 없으므로(§8.2) 채용제목과 상세 본문을
 * 이 함수로 스캔해 R을 만든다. 사전에 없는 단어는 스킬로 인정하지 않는다.
 *
 * @param {...(string|null|undefined)} texts 스캔할 텍스트들
 * @returns {string[]} 정규형 스킬 배열 (중복 제거, 사전 등재 순)
 */
export function scanSkills(...texts) {
  return matcher.scan(...texts);
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
  return matcher.normalize(raw);
}

/** 사전에 없어 버려진 토큰. 사전 확충 대상을 찾는 용도(§12 스킬 추출률). */
export function unknownTokens(raw) {
  return matcher.unknown(raw);
}
