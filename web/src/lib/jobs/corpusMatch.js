/**
 * 경력공고 비교 — 회사·직무 매칭 (규칙 기반, LLM 미개입) (계획 §3)
 *
 * 사용자가 방금 진단한 공고(자유 텍스트에서 LLM이 뽑은 회사명·제목)를 코퍼스의
 * 신입 항목과 매칭해 그 페어(pair_id)로 경력 항목을 찾는다. 매칭 실패 시 절대
 * 아무 페어나 골라 보여주지 않는다 — "정보 없음"과 "부정확한 매칭"은 다르다
 * (FitReport의 hasSkillInfo와 같은 원칙).
 */
import CORPUS from './fixtures/jd-corpus.json' with { type: 'json' };

const SUFFIX_RE = /(주식회사|㈜|\(주\)|co\.,?\s*ltd\.?|corp\.?|inc\.?)/gi;
const WS_RE = /\s+/g;

function normalizeCompany(name) {
  return String(name ?? '')
    .toLowerCase()
    .replace(SUFFIX_RE, '')
    .replace(WS_RE, '')
    .trim();
}

const ENTRIES = CORPUS.filter((r) => !r.jd_id.endsWith('X'));
const CAREER_BY_PAIR_ID = new Map(
  CORPUS.filter((r) => r.jd_id.endsWith('X')).map((r) => [r.pair_id, r])
);

const ENTRIES_NORM = ENTRIES.map((e) => ({
  entry: e,
  companyNorm: normalizeCompany(e.company.name),
}));

/** 회사명이 같은 후보 코퍼스 항목들. 정확일치 우선, 없으면 포함 관계로 넓힌다. */
function candidatesForCompany(companyName) {
  const norm = normalizeCompany(companyName);
  if (!norm) return [];

  const exact = ENTRIES_NORM.filter((e) => e.companyNorm === norm);
  if (exact.length > 0) return exact.map((e) => e.entry);

  const partial = ENTRIES_NORM.filter(
    (e) => e.companyNorm.includes(norm) || norm.includes(e.companyNorm)
  );
  return partial.map((e) => e.entry);
}

/** 후보가 여럿이면 공고 제목과 job_l2/title 키워드 겹침이 가장 큰 것을 고른다. */
function pickBestByTitle(candidates, title) {
  if (candidates.length <= 1) return candidates[0] ?? null;

  const t = String(title ?? '').toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const c of candidates) {
    const keywords = [c.posting.job_l2, ...c.posting.title.split(/[\s()·]+/)]
      .filter(Boolean)
      .map((k) => k.toLowerCase());
    const score = keywords.filter((k) => k.length >= 2 && t.includes(k)).length;
    if (score > bestScore) {
      best = c;
      bestScore = score;
    }
  }
  // 제목에서 아무 키워드도 겹치지 않으면 어느 직무인지 알 수 없다 — 억지 매칭 금지.
  return bestScore > 0 ? best : null;
}

/**
 * @param {{company?: string, title?: string}} posting 사용자가 진단한 공고
 * @returns {{entry: object, career: object}|null} 매칭 실패 시 null
 */
export function matchCorpusPair(posting) {
  const candidates = candidatesForCompany(posting?.company);
  if (candidates.length === 0) return null;

  const entry = pickBestByTitle(candidates, posting?.title);
  if (!entry) return null;

  const career = CAREER_BY_PAIR_ID.get(entry.pair_id);
  if (!career) return null;

  return { entry, career };
}
