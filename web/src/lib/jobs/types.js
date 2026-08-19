/**
 * 공통 공고 스키마 (PRD §8.1)
 *
 * 모든 어댑터가 이 모양으로 번역해서 반환한다. 매칭·정렬·화면은
 * 이 타입만 알고, 어느 API에서 왔는지는 sourceLabel 배지 표시 외에는 모른다.
 *
 * @typedef {Object} NormalizedPosting
 * @property {string}   id            "work24:K2026..." 형식의 전역 고유 ID
 * @property {string}   sourceId      'work24' | 'saramin'(Phase 2)
 * @property {string}   sourceLabel   화면 배지용 표기 (§9.1 ④)
 * @property {string}   sourceRef     소스 내부 ID (상세 조회 키)
 * @property {string}   title
 * @property {string}   company
 * @property {string}   region
 * @property {{text: string, isEntryLevel: boolean, minYears: number|null}} experience
 * @property {string|null} education
 * @property {string|null} salary
 * @property {string|null} jobCode
 * @property {string|null} postedAt    YYYY-MM-DD
 * @property {string|null} deadline    YYYY-MM-DD
 * @property {string|null} url         원본 공고 링크 (§9.1 ④)
 * @property {string[]}  requiredSkills  R 집합. 정규형 스킬 (§8.4)
 * @property {boolean}   detailLoaded    상세정보까지 반영했는지
 */

/**
 * 매칭 결과가 덧붙은 공고 (화면 ④가 직접 소비하는 형태)
 *
 * @typedef {NormalizedPosting & {
 *   matchedSkills: string[],
 *   missingSkills: string[],
 *   matchScore: number|null,
 *   hasSkillInfo: boolean
 * }} MatchedPosting
 */
export {};
