/**
 * 96-태그(SK.*) 사전 기반 스캔 — 경력공고 비교 기능 전용 (docs/공고데이터/chafit_01_스키마_분류체계.md §4)
 *
 * 라이브 진단 플로우(①~⑤)가 쓰는 `skills/normalize.js`와는 **완전히 분리된 사전**이다.
 * 두 어휘 체계가 다르기 때문(§ 계획 — 반도체·이차전지·건설·제약 중심 vs IT 일반 중심)에
 * 섞으면 안 되고, 매칭 알고리즘만 `skills/matcher.js`로 공유한다.
 */
import { createSkillMatcher } from '../skills/matcher.js';
import TAG_DICT from './fixtures/tag-dictionary.json' with { type: 'json' };

const ALIAS_DICT = Object.fromEntries(
  Object.entries(TAG_DICT).map(([tagId, t]) => [tagId, t.aliases])
);

// latinBoundaryMaxLen: 4 — "etch"가 "SketchUp" 안에서, "ray"가 "Vray" 안에서 잘못
// 걸리는 것을 막는다. normalize.js(IT 사전)는 기존 동작 보존을 위해 기본값(3)을 쓴다.
const matcher = createSkillMatcher(ALIAS_DICT, { latinBoundaryMaxLen: 4 });

/** tag_id → { label, category } 조회. 화면 표시용 (태그 ID는 절대 노출하지 않는다). */
export function tagInfo(tagId) {
  const t = TAG_DICT[tagId];
  return t ? { label: t.label, category: t.category } : null;
}

/** 자연어 텍스트에서 SK.* 태그를 추출한다. 공고 JD 본문, 이력서 서술 문장 등에 쓴다. */
export function scanTags(...texts) {
  return matcher.scan(...texts);
}

/**
 * 이력서 분석 결과(요약·경험 서술)를 이어붙여 사용자의 태그 집합을 만든다.
 * 원문 이력서 텍스트를 다시 보관하지 않고, 이미 구조화된 문장(analysis)만으로 충분하다.
 *
 * @param {{summary?: string, experiences?: {title?: string, description?: string}[]}} analysis
 * @returns {string[]} 정규형 SK.* 태그 배열
 */
export function tagsFromAnalysis(analysis) {
  const texts = [
    analysis?.summary,
    ...(analysis?.experiences ?? []).flatMap((e) => [e.title, e.description]),
  ];
  return scanTags(...texts);
}
