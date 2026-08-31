/**
 * 태그 교집합 기반 강의 매칭 — 결정적 집합 연산, LLM 미개입 (PRD §8.4 원칙 재사용).
 */
import COURSES from './fixtures/courses.json' with { type: 'json' };

/**
 * @param {string[]} tagIds 추천 대상 SK.* 태그 (경력공고 비교의 "향후 필요 역량")
 * @param {number} [limit] 태그 하나당 최대 추천 강의 수
 * @returns {Record<string, import('./types.js').Course[]>} tagId → 매칭 강의 목록
 */
export function matchCoursesByTag(tagIds, limit = 3) {
  const result = {};
  for (const tagId of tagIds) {
    result[tagId] = COURSES.filter((c) => c.tagIds.includes(tagId)).slice(0, limit);
  }
  return result;
}
