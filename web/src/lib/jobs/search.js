/**
 * 공고 조회 오케스트레이션 (PRD §8.4, §8.9)
 *
 * 흐름: 직무명 → 직종코드(룰) → 어댑터 병렬 조회 → 제목 기반 1차 스코어
 *      → 상위 N건만 상세 보강 → 재계산 → 정렬
 *
 * 상세를 목록 전체에 부르지 않는 것이 핵심이다(§8.4). N+1 호출은
 * 응답 시간(§7)과 트래픽 한도를 동시에 무너뜨린다.
 */
import work24 from './adapters/work24.js';
import JOB_CODE_MAP from './job-code-map.json' with { type: 'json' };
import { matchPosting, sortByScore } from './match.js';

/** Phase 1은 고용24 단독. Phase 2에서 saramin 어댑터를 이 배열에 추가한다(§8.1). */
const SOURCES = [work24];

/** 직종코드별 최근 성공 응답. API 장애 시 유일한 안전망이다(§8.9). */
const cache = new Map();

/** 직무명 → 직종코드. LLM 반환값은 반드시 이 표에 있어야 한다(§8.7). */
export function resolveJobCode(roleName) {
  return JOB_CODE_MAP[roleName] ?? null;
}

export function knownRoles() {
  return Object.keys(JOB_CODE_MAP).filter((k) => !k.startsWith('_'));
}

/** 회사명 + 공고명으로 중복 제거. Phase 2에서 소스가 겹칠 때 쓴다(§8.1). */
function dedupe(postings) {
  const seen = new Set();
  return postings.filter((p) => {
    const key = `${p.company}|${p.title}`.replace(/\s+/g, '').toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * 선택한 직무의 공고를 조회하고 매칭한다.
 *
 * @param {string} roleName ③에서 사용자가 클릭한 직무명
 * @param {string[]} userSkills 정규화된 사용자 스킬 U
 * @param {{topN?: number, entryLevelOnly?: boolean}} [opts]
 * @returns {Promise<{postings: import('./types.js').MatchedPosting[], servedFromCache: boolean, fetchedAt: string, jobCode: string}>}
 */
export async function searchJobs(roleName, userSkills, opts = {}) {
  const topN = opts.topN ?? 10;
  const jobCode = resolveJobCode(roleName);
  if (!jobCode) {
    throw new Error(`[search] 직종코드 사전에 없는 직무명: "${roleName}". 사전 등재 직무: ${knownRoles().join(', ')}`);
  }

  // 부분 실패 허용 — 한 소스만 성공해도 렌더링한다(§8.9)
  const settled = await Promise.allSettled(SOURCES.map((s) => s.search(jobCode)));
  const ok = settled.filter((r) => r.status === 'fulfilled');
  settled.filter((r) => r.status === 'rejected')
         .forEach((r) => console.warn('[search] 소스 조회 실패:', r.reason?.message));

  if (ok.length === 0) {
    const cached = cache.get(jobCode);
    if (cached) return { ...cached, servedFromCache: true };
    throw new Error('[search] 모든 소스 조회에 실패했고 캐시도 없습니다.');
  }

  let postings = dedupe(ok.flatMap((r) => r.value));
  if (opts.entryLevelOnly) postings = postings.filter((p) => p.experience.isEntryLevel);

  // 1차: 제목 기반 R로만 정렬 (추가 호출 0)
  const ranked = sortByScore(postings.map((p) => matchPosting(p, userSkills)));
  const head = ranked.slice(0, topN);
  const tail = ranked.slice(topN);

  // 2차: 표시 대상에만 상세 보강 후 재계산
  const bySource = new Map(SOURCES.map((s) => [s.id, s]));
  const enriched = await Promise.all(
    Object.entries(Object.groupBy(head, (p) => p.sourceId))
      .map(([sid, group]) => bySource.get(sid).enrich(group))
  );

  const final = sortByScore(enriched.flat().map((p) => matchPosting(p, userSkills)));
  const result = {
    postings: [...final, ...tail],
    jobCode,
    fetchedAt: new Date().toISOString(),
    servedFromCache: false,
  };

  cache.set(jobCode, result);
  return result;
}
