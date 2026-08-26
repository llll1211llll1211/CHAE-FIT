/**
 * POST /api/career/outlook — 경력공고 비교: 향후 필요 역량 + 관련 강의 (신규)
 *
 * 요청: { analysis: ResumeAnalysis, posting: JobPosting } — /api/fit/diagnose와 동일한 두 값 재사용
 * 응답: { matched: false } | { matched: true, company, careerTitle, ..., futureSkills: [...] }
 *
 * 점수를 매기지 않는다. "경력 공고가 신입 공고 대비 추가로 요구하는 태그 중
 * 사용자가 아직 갖추지 못한 것"을 태그 집합 연산으로만 뽑고(§계획 4), LLM은
 * 이미 확정된 태그 각각에 1줄 설명만 붙인다.
 */
import { fail, USE_MOCK } from '@/lib/api/contract';
import { explainFutureSkills } from '@/lib/api/claude';
import { mockFutureSkillReasons } from '@/lib/api/mock';
import { matchCoursesByTag } from '@/lib/courses/match';
import { matchCorpusPair } from '@/lib/jobs/corpusMatch';
import { tagInfo, tagsFromAnalysis } from '@/lib/jobs/tags';

export const runtime = 'nodejs';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return fail('MISSING_ANALYSIS');
  }

  const { analysis, posting } = body ?? {};
  if (!analysis) return fail('MISSING_ANALYSIS');
  if (!posting) return fail('MISSING_POSTING');

  const pair = matchCorpusPair(posting);
  if (!pair) {
    return Response.json({ matched: false });
  }

  const { entry, career } = pair;

  // 결정적 집합 연산 — 경력 공고가 "추가로" 요구하는 태그 중 사용자가 아직 없는 것만.
  const userTags = new Set(tagsFromAnalysis(analysis));
  const entryTags = new Set(entry.competency_tags);
  const futureTagIds = career.competency_tags.filter(
    (t) => !entryTags.has(t) && !userTags.has(t)
  );

  if (futureTagIds.length === 0) {
    return Response.json({
      matched: true,
      company: career.company.name,
      careerTitle: career.posting.title,
      experienceYears: career.posting.experience_years,
      sourceUrl: career.source_url,
      collectedAt: career.collected_at,
      verification: career.verification,
      futureSkills: [],
    });
  }

  const infos = futureTagIds.map((tagId) => ({ tagId, ...tagInfo(tagId) }));
  const labels = infos.map((i) => i.label);
  const courseByTag = matchCoursesByTag(futureTagIds);

  let reasons = [];
  try {
    reasons = USE_MOCK
      ? mockFutureSkillReasons(labels)
      : await explainFutureSkills({ careerPosting: career, labels });
  } catch (err) {
    // 근거 문장 생성 실패는 치명적이지 않다 — 태그 목록·강의 추천은 이미 확정됐다.
    console.error('[career/outlook] 향후 역량 설명 생성 실패', err);
  }
  const reasonByLabel = new Map(reasons.map((r) => [r.label, r.text]));

  const futureSkills = infos.map((info) => ({
    tagId: info.tagId,
    label: info.label,
    category: info.category,
    reason: reasonByLabel.get(info.label) ?? null,
    courses: courseByTag[info.tagId] ?? [],
  }));

  return Response.json({
    matched: true,
    company: career.company.name,
    careerTitle: career.posting.title,
    experienceYears: career.posting.experience_years,
    sourceUrl: career.source_url,
    collectedAt: career.collected_at,
    verification: career.verification,
    futureSkills,
  });
}
