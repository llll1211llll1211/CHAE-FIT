/**
 * POST /api/posting/parse — 채용공고 요구사항 추출 및 요약 (PRD F3 · F5)
 *
 * 요청: { text } 또는 { url } — 둘 중 정확히 하나
 * 응답: { posting: JobPosting, unknownSkills: string[] }
 *
 * 기본 입력은 본문 붙여넣기다. URL은 보조 수단이며, 실패하면 붙여넣기로 유도한다(PRD §8.3).
 */
import { fail, JOB_POSTING_SCHEMA, USE_MOCK } from '@/lib/api/contract';
import { MOCK_JOB_POSTING, MOCK_VAGUE_POSTING } from '@/lib/api/mock';
import { normalizeSkills, unknownTokens } from '@/lib/skills/normalize';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return fail('EMPTY_INPUT');
  }

  const text = body?.text?.trim();
  const url = body?.url?.trim();

  if (!text && !url) return fail('EMPTY_INPUT');
  if (text && url) return fail('AMBIGUOUS_INPUT');

  try {
    let raw;
    if (USE_MOCK) {
      // 목업도 실제 동작을 흉내낸다. URL은 아직 본문을 못 가져오므로 실패로 응답해,
      // 프론트가 "붙여넣기로 유도" UX를 지금 만들 수 있게 한다(PRD §12).
      if (url) {
        const e = new Error('mock: URL 미지원');
        e.code = 'URL_FETCH_FAILED';
        throw e;
      }
      // "요구 역량 추출 실패" 경로도 밟아볼 수 있게 한다(PRD §9.1 ⑤).
      raw = /전산직|성실|무관/.test(text) ? MOCK_VAGUE_POSTING : MOCK_JOB_POSTING;
    } else {
      const source = url ? await fetchPostingText(url) : text;
      raw = await parseWithClaude(source);
    }

    const skills = normalizeSkills(raw.skills);

    return Response.json({
      posting: { ...raw, skills, source: url ? 'url' : 'text' },
      unknownSkills: unknownTokens(raw.skills),
    });
  } catch (err) {
    console.error('[posting/parse]', err);
    return fail(err?.code === 'URL_FETCH_FAILED' ? 'URL_FETCH_FAILED' : 'LLM_FAILED');
  }
}

/**
 * URL → 공고 본문.
 *
 * 채용 플랫폼 대부분이 스크래핑을 약관으로 제한하거나 JS 렌더링을 요구한다.
 * 실패는 정상 경로로 취급하고 붙여넣기를 안내한다(PRD §12).
 */
async function fetchPostingText(_url) {
  // TODO(F3): 본문 추출 연결. 실패 시 아래 에러로 통일한다.
  const err = new Error('URL 본문 추출 미구현');
  err.code = 'URL_FETCH_FAILED';
  throw err;
}

/** 공고 원문 → 요구사항 구조화 + 요약. 한 번의 호출로 처리한다(PRD §8.3). */
async function parseWithClaude(_text) {
  // TODO(F3·F5): Anthropic SDK 연결.
  //   - model: claude-opus-5
  //   - output_config.format 에 JOB_POSTING_SCHEMA 지정
  //   - requirements/preferred는 공고 원문 문장을 그대로 옮기게 한다(근거 문장이 인용하므로)
  void JOB_POSTING_SCHEMA;
  throw new Error('parseWithClaude 미구현 — ANTHROPIC_API_KEY를 설정하면 이 경로가 실행됩니다.');
}
