/**
 * 스킬 갭 및 매칭 스코어 (PRD §8.5, §8.6)
 *
 * 전부 결정적 집합 연산이다. LLM은 여기 관여하지 않는다 — 근거 없는
 * "부족하다" 판정을 원천 차단하기 위함이다(§8.7 하이브리드).
 */

/**
 * 공고 하나에 대한 갭과 스코어를 계산한다.
 *
 * @param {import('./types.js').NormalizedPosting} posting
 * @param {string[]} userSkills 정규화된 사용자 스킬 U (normalizeSkills 통과분)
 * @returns {import('./types.js').MatchedPosting}
 */
export function matchPosting(posting, userSkills) {
  const U = new Set(userSkills);
  const R = posting.requiredSkills ?? [];

  const matchedSkills = R.filter((s) => U.has(s));
  const missingSkills = R.filter((s) => !U.has(s));

  return {
    ...posting,
    matchedSkills,
    missingSkills,
    matchScore: scoreOf(matchedSkills.length, R.length),
    // R = ∅ 이면 화면은 스킬 갭 영역과 스코어를 통째로 숨긴다 (§9.1 ④).
    // "갭이 0"인 것과 "정보가 없는" 것은 다르다.
    hasSkillInfo: R.length > 0,
  };
}

/**
 * matchScore = |R ∩ U| / |R|, 단 R이 빈약하면 가중치를 낮춘다 (§8.6).
 *
 * 보정이 없으면 요구 스킬이 1개뿐인 공고가 100%로 상위를 독점한다.
 * 실제로는 정보가 부족한 공고일 뿐 잘 맞는 공고가 아니다.
 *
 * @returns {number|null} 0~1, R이 비면 null
 */
export function scoreOf(matchedCount, requiredCount) {
  if (requiredCount === 0) return null;
  const base = matchedCount / requiredCount;
  const penalty = requiredCount >= 3 ? 1 : 0.6 + 0.2 * (requiredCount - 1); // 1→0.6, 2→0.8
  return Math.round(base * penalty * 1000) / 1000;
}

/**
 * 매칭 스코어 내림차순 정렬. 백엔드에서 정렬해 내려보낸다(§9.1 ④).
 * 스코어가 없는 공고(R = ∅)는 항상 뒤로 보낸다.
 */
export function sortByScore(postings) {
  return [...postings].sort((a, b) => {
    if (a.matchScore === null && b.matchScore === null) return 0;
    if (a.matchScore === null) return 1;
    if (b.matchScore === null) return -1;
    return b.matchScore - a.matchScore;
  });
}
