/**
 * POST /api/fit/diagnose — 기업별 적합도 진단서 (PRD F4, 핵심 기능)
 *
 * 요청: { analysis: ResumeAnalysis, posting: JobPosting }
 * 응답: { report: FitReport }
 *
 * 점수와 충족/필요 역량은 집합 연산으로 확정하고, LLM은 근거 문장만 쓴다(PRD §8.4).
 * 이 분리가 "근거 없는 70% 적합" 과 근거 문장 환각을 동시에 막는다(§12).
 */
import { computeFit, fail, USE_MOCK } from '@/lib/api/contract';
import { explainFit } from '@/lib/api/claude';
import { mockReasons } from '@/lib/api/mock';

export const runtime = 'nodejs';

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
      : await explainFit({ analysis, posting, fit });
  } catch (err) {
    // 근거 문장 생성 실패는 치명적이지 않다.
    // 점수와 역량 목록은 이미 확정됐으므로 그것만이라도 보여준다.
    console.error('[fit/diagnose] 근거 문장 생성 실패', err);
  }

  return Response.json({ report: { ...fit, reasons } });
}
