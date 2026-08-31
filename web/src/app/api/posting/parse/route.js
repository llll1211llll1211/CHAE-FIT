/**
 * POST /api/posting/parse — 채용공고 요구사항 추출 및 요약 (PRD F3 · F5)
 *
 * 요청: { text } 또는 { url } — 둘 중 정확히 하나
 * 응답: { posting: JobPosting, unknownSkills: string[] }
 *
 * 기본 입력은 본문 붙여넣기다. URL은 보조 수단이며, 실패하면 붙여넣기로 유도한다(PRD §8.3).
 */
import { fail, USE_MOCK } from '@/lib/api/contract';
import { parsePosting } from '@/lib/api/claude';
import { MOCK_JOB_POSTING, MOCK_SEMI_POSTING, MOCK_VAGUE_POSTING } from '@/lib/api/mock';
import { fetchPostingText } from '@/lib/posting/fetch-url';
import { normalizeSkills, unknownTokens } from '@/lib/skills/normalize';

export const runtime = 'nodejs';

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
      // 목업도 실제 동작을 흉내낸다. URL은 본문 확보가 불확실한 경로이므로 실패로 응답해,
      // 프론트의 "붙여넣기로 유도" UX를 키 없이도 확인할 수 있게 한다(PRD §12).
      if (url) {
        const e = new Error('mock: URL 미지원');
        e.code = 'URL_FETCH_FAILED';
        throw e;
      }
      // 목업도 입력에 반응한다 — 키 없이 세 갈래를 모두 밟아볼 수 있게.
      //   ① 빈약한 공고 → 요구 역량 추출 실패 경로(PRD §9.1 ⑤)
      //   ② 반도체 설비기술 → 경력공고 코퍼스에 실제로 있는 페어. 성장 로드맵이 뜬다.
      //   ③ 그 외 → 기본 IT 백엔드 공고
      if (/전산직|성실|무관/.test(text)) {
        raw = MOCK_VAGUE_POSTING;
      } else if (/설비기술|반도체 생산설비|삼성전자 DS/.test(text)) {
        raw = MOCK_SEMI_POSTING;
      } else {
        raw = MOCK_JOB_POSTING;
      }
    } else {
      const source = url ? await fetchPostingText(url) : text;
      raw = await parsePosting(source);
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
