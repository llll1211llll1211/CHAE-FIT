/**
 * 사전 기반 정규화·추출 알고리즘 (PRD §8.4)
 *
 * `normalize.js`(이력서/공고 스킬, IT·직무 일반 사전)와 `jobs/tags.js`(코퍼스 SK.* 96태그
 * 사전, 경력 갭 계산용)가 이 팩토리를 공유한다. 두 도메인은 어휘가 다를 뿐 매칭 규칙은
 * 같다 — 규칙을 한 곳에서만 고치면 된다.
 */

// 매칭된 구간을 지우는 표식. 실제 텍스트에 나타나지 않도록 charCode로 생성한다.
const MASK = String.fromCharCode(0);

/** ASCII 영숫자 또는 한글 음절 — 짧은 별칭의 오매칭을 막는 경계 판정에 쓴다. */
const WORD_CHAR = /[a-z0-9ㄱ-ㆎ가-힣]/;

const LATIN_ONLY = /^[a-z0-9]+$/;

/**
 * @param {Record<string, string[]>} dict key = 정규형(또는 태그ID), value = 별칭 배열
 * @param {{latinBoundaryMaxLen?: number}} [opts] 영문 전용 별칭에 경계 판정을 적용할 최대 길이.
 *   기본값(3)은 기존 `normalize.js`(IT 사전)의 동작을 그대로 보존한다 — 데모 회귀 방지.
 *   `jobs/tags.js`(신규, 지켜야 할 기존 동작 없음)는 더 큰 값을 넘겨 "etch"가 "SketchUp"
 *   안에서 잘못 걸리는 것 같은 영문 부분일치를 추가로 막는다.
 */
export function createSkillMatcher(dict, opts = {}) {
  const latinBoundaryMaxLen = opts.latinBoundaryMaxLen ?? 3;
  const CANONICAL = Object.keys(dict).filter((k) => !k.startsWith('_'));

  const ALIAS_ENTRIES = CANONICAL.flatMap((canonical) =>
    [canonical, ...dict[canonical]].map((alias) => ({ canonical, alias: alias.toLowerCase() }))
  ).sort((a, b) => b.alias.length - a.alias.length);

  /**
   * 길이 3 이하 별칭, 또는 영문 전용 별칭이 latinBoundaryMaxLen 이하이면 앞뒤가
   * 단어 경계일 때만 인정한다. "RA"가 "Vray" 안에서, "포토"가 "포토샵" 안에서,
   * "etch"가 "SketchUp" 안에서 잘못 걸리는 것을 막는다.
   */
  function isBoundaryOk(text, at, len, alias) {
    const threshold = LATIN_ONLY.test(alias) ? latinBoundaryMaxLen : 3;
    if (len > threshold) return true;
    const before = at > 0 ? text[at - 1] : '';
    const after = at + len < text.length ? text[at + len] : '';
    return !WORD_CHAR.test(before) && !WORD_CHAR.test(after);
  }

  function scan(...texts) {
    const joined = texts.filter(Boolean).join('\n').toLowerCase();
    if (!joined) return [];

    const buf = joined.split('');
    const found = new Set();

    for (const { canonical, alias } of ALIAS_ENTRIES) {
      let from = 0;
      for (;;) {
        const at = joined.indexOf(alias, from);
        if (at === -1) break;
        const consumed = buf.slice(at, at + alias.length).includes(MASK);
        if (!consumed && isBoundaryOk(joined, at, alias.length, alias)) {
          found.add(canonical);
          for (let i = at; i < at + alias.length; i++) buf[i] = MASK;
        }
        from = at + 1;
      }
    }
    return CANONICAL.filter((s) => found.has(s));
  }

  function normalize(raw) {
    const tokens = Array.isArray(raw) ? raw : String(raw ?? '').split(',');
    const found = new Set();

    for (const token of tokens) {
      const t = String(token).trim().toLowerCase();
      if (!t) continue;
      const exact = ALIAS_ENTRIES.find((e) => e.alias === t);
      if (exact) found.add(exact.canonical);
      else scan(t).forEach((s) => found.add(s));
    }
    return CANONICAL.filter((s) => found.has(s));
  }

  function unknown(raw) {
    const tokens = Array.isArray(raw) ? raw : String(raw ?? '').split(',');
    return tokens
      .map((t) => String(t).trim())
      .filter((t) => t && scan(t).length === 0 && !ALIAS_ENTRIES.some((e) => e.alias === t.toLowerCase()));
  }

  return { CANONICAL, scan, normalize, unknown };
}
