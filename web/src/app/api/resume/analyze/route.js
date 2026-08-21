/**
 * POST /api/resume/analyze — 이력서 업로드 및 경력·역량 분석 (PRD F1 · F2)
 *
 * 요청: multipart/form-data, 필드 `resume` (PDF 또는 .txt, 5MB 이하)
 * 응답: { analysis: ResumeAnalysis, unknownSkills: string[] }
 */
import { fail, USE_MOCK } from '@/lib/api/contract';
import { analyzeResume } from '@/lib/api/claude';
import { MOCK_RESUME_ANALYSIS } from '@/lib/api/mock';
import { extractResumeText } from '@/lib/resume/extract-text';
import { normalizeSkills, unknownTokens } from '@/lib/skills/normalize';

// pdf.js는 Node API를 쓴다. Edge 런타임에서는 동작하지 않는다.
export const runtime = 'nodejs';

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_EXT = ['pdf', 'txt'];

export async function POST(request) {
  let file;
  try {
    const form = await request.formData();
    file = form.get('resume');
  } catch {
    return fail('NO_FILE');
  }

  if (!file || typeof file === 'string') return fail('NO_FILE');

  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_EXT.includes(ext)) return fail('UNSUPPORTED_FILE_TYPE');
  if (file.size > MAX_SIZE) return fail('FILE_TOO_LARGE');

  try {
    const raw = USE_MOCK
      ? MOCK_RESUME_ANALYSIS
      : await analyzeResume(await extractResumeText(file, ext));

    // LLM이 낸 원문 표기를 스킬 사전으로 정규화한다.
    // 이력서 쪽 U 와 공고 쪽 R 이 같은 사전을 통과해야 집합 연산이 성립한다(PRD §8.5).
    const skills = normalizeSkills(raw.skills);

    return Response.json({
      analysis: { ...raw, skills },
      // 사전에 없어 버려진 토큰. 화면에는 쓰지 않고 사전 확충 대상 파악에만 쓴다(PRD §11).
      unknownSkills: unknownTokens(raw.skills),
    });
  } catch (err) {
    console.error('[resume/analyze]', err);
    return fail(err?.code === 'EXTRACTION_FAILED' ? 'EXTRACTION_FAILED' : 'LLM_FAILED');
  }
}
