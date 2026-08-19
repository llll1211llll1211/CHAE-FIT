/**
 * POST /api/resume/analyze — 이력서 업로드 및 경력·역량 분석 (PRD F1 · F2)
 *
 * 요청: multipart/form-data, 필드 `resume` (PDF 또는 .txt, 5MB 이하)
 * 응답: { analysis: ResumeAnalysis, unknownSkills: string[] }
 */
import { fail, RESUME_ANALYSIS_SCHEMA, USE_MOCK } from '@/lib/api/contract';
import { MOCK_RESUME_ANALYSIS } from '@/lib/api/mock';
import { normalizeSkills, unknownTokens } from '@/lib/skills/normalize';

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
      : await analyzeWithClaude(await extractText(file, ext));

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

/** 파일 → 평문 텍스트. PDF 파서는 키 확보 후 연결한다. */
async function extractText(file, ext) {
  if (ext === 'txt') return await file.text();

  // TODO(F1): PDF 텍스트 추출기 연결 (pdf-parse 등).
  // 스캔 PDF처럼 텍스트 레이어가 없으면 EXTRACTION_FAILED로 올려 사용자에게 안내한다.
  const err = new Error('PDF 텍스트 추출 미구현');
  err.code = 'EXTRACTION_FAILED';
  throw err;
}

/** 이력서 텍스트 → 구조화 (PRD §8.2). structured outputs로 스키마를 강제한다. */
async function analyzeWithClaude(_text) {
  // TODO(F2): Anthropic SDK 연결.
  //   - model: claude-opus-5
  //   - output_config.format 에 RESUME_ANALYSIS_SCHEMA 지정
  //   - experiences는 근거 문장의 원재료이므로 구체적으로 뽑도록 프롬프트에 명시
  void RESUME_ANALYSIS_SCHEMA;
  throw new Error('analyzeWithClaude 미구현 — ANTHROPIC_API_KEY를 설정하면 이 경로가 실행됩니다.');
}
