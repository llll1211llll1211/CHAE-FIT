/**
 * POST /api/fit/diagnose — 기업별 적합도 진단서 (PRD F4, 핵심 기능)
 *
 * 요청: { analysis: ResumeAnalysis, posting: JobPosting }
 * 응답: { report: FitReport }
 *
 * 점수와 충족/필요 역량은 집합 연산으로 확정하고, LLM은 근거 문장만 쓴다(PRD §8.4).
 * 이 분리가 "근거 없는 70% 적합" 과 근거 문장 환각을 동시에 막는다(§12).
 */
import { computeFit, fail, REASONS_SCHEMA, USE_MOCK } from '@/lib/api/contract';
import { mockReasons } from '@/lib/api/mock';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return fail('MISSING_ANALYSIS');
  }

  const { analysis, posting } = body ?? {};
  if (!analysis?.skills) return fail('MISSING_ANALYSIS');
  if (!posting?.skills) return fail('MISSING_POSTING');

  // 1단계 — 결정적. 같은 입력이면 항상 같은 값이 나온다(PRD §7).
  const fit = computeFit(analysis.skills, posting.skills);

  // 요구 역량을 하나도 추출하지 못한 공고는 근거 문장을 만들 대상 자체가 없다.
  // 화면은 점수와 역량 영역을 통째로 숨긴다(PRD §9.1 ⑤).
  if (!fit.hasSkillInfo) {
    return Response.json({ report: { ...fit, reasons: [] } });
  }

  // 2단계 — 생성형. 이미 확정된 매칭에 대한 설명만 쓴다.
  let reasons = [];
  try {
    reasons = USE_MOCK
      ? mockReasons(fit.matchedSkills)
      : await explainWithClaude({ analysis, posting, fit });
  } catch (err) {
    // 근거 문장 생성 실패는 치명적이지 않다.
    // 점수와 역량 목록은 이미 확정됐으므로 그것만이라도 보여준다.
    console.error('[fit/diagnose] 근거 문장 생성 실패', err);
  }

  return Response.json({ report: { ...fit, reasons } });
}

/**
 * 근거 문장 생성.
 *
 * LLM에 넘기는 것은 **확정된 매칭 결과 + 이력서 경험 항목 + 공고 요구사항 문장** 셋뿐이다.
 * 새로운 사실을 만들지 않도록, 인용할 원문을 함께 주고 그 범위 안에서만 쓰게 한다(PRD §12).
 */
async function explainWithClaude({ analysis: _a, posting: _p, fit: _f }) {
  // TODO(F4): Anthropic SDK 연결.
  //   - model: claude-opus-5
  //   - output_config.format 에 REASONS_SCHEMA 지정
  //   - experience/requirement 필드는 전달한 원문을 그대로 인용하게 강제
  //   - 프롬프트 캐싱: 시스템 프롬프트 + analysis 가 매 공고마다 반복되므로
  //     그 뒤에 캐시 지점을 둔다(PRD §8.5)
  void REASONS_SCHEMA;
  throw new Error('explainWithClaude 미구현 — ANTHROPIC_API_KEY를 설정하면 이 경로가 실행됩니다.');
}
