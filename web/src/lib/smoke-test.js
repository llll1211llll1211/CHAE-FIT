/**
 * 스모크 테스트 — fixture 경로가 PRD의 핵심 시나리오를 실제로 만족하는지 확인.
 * 실행: cd web && npm run smoke
 */
import { scanSkills, normalizeSkills } from './skills/normalize.js';
import { searchJobs, knownRoles } from './jobs/search.js';

let failed = 0;
const check = (label, cond, detail = '') => {
  console.log(`${cond ? '  PASS' : '  FAIL'}  ${label}${detail ? '  → ' + detail : ''}`);
  if (!cond) failed++;
};

console.log('\n[1] 스킬 사전 정규화 (§8.4)');
const norm = normalizeSkills(['파이썬', 'Python3', '스프링부트']);
check('표기 흔들림이 하나로 모인다',
  norm.length === 2 && ['Python', 'Spring Boot'].every((s) => norm.includes(s)),
  JSON.stringify(norm));
check('JavaScript가 Java로 오인되지 않는다',
  !scanSkills('JavaScript 개발자').includes('Java'), JSON.stringify(scanSkills('JavaScript 개발자')));
check('Java와 JavaScript가 함께 있으면 둘 다 잡힌다',
  ['Java', 'JavaScript'].every((s) => scanSkills('Java, JavaScript 경험').includes(s)),
  JSON.stringify(scanSkills('Java, JavaScript 경험')));
check('MySQL이 SQL로 중복 계상되지 않는다',
  !scanSkills('MySQL 운영 경험').includes('SQL'), JSON.stringify(scanSkills('MySQL 운영 경험')));
check('사전에 없는 단어는 스킬로 잡히지 않는다',
  scanSkills('성실하고 책임감 있는 분').length === 0);

console.log('\n[2] 페르소나 A — 데모 하이라이트 (§4.1)');
const A = normalizeSkills(['Java', 'Spring Boot', 'MySQL', '파이썬', 'pandas', 'Git', 'SQL']);
console.log('  A의 스킬 U =', JSON.stringify(A));
const de = await searchJobs('데이터 엔지니어', A, { entryLevelOnly: true });
console.log(`  '데이터 엔지니어' 신입 지원가능 공고 ${de.postings.length}건`);
for (const p of de.postings) {
  console.log(`    [${p.matchScore ?? '—'}] ${p.company} · ${p.title}`);
  console.log(`           보유: ${p.matchedSkills.join(', ') || '—'} / 필요: ${p.missingSkills.join(', ') || '—'}`);
}
check('신입 지원 가능 공고가 존재한다', de.postings.length > 0);
check('매칭 스코어 내림차순으로 정렬되어 있다',
  de.postings.filter((p) => p.matchScore !== null)
    .every((p, i, a) => i === 0 || a[i - 1].matchScore >= p.matchScore));
check('상세 보강으로 제목에 없던 스킬이 R에 들어왔다',
  de.postings.some((p) => p.detailLoaded && p.requiredSkills.length > scanSkills(p.title).length));

console.log('\n[3] 페르소나 B — 직무 전환 비교 (§4.2)');
const B = normalizeSkills(['SQL', 'Excel', 'VBA', 'SPC', '6시그마', '품질관리', '파이썬', 'pandas']);
for (const role of ['품질관리', '데이터 분석가', '생산기술']) {
  const r = await searchJobs(role, B);
  const top = r.postings.find((p) => p.hasSkillInfo);
  console.log(`  ${role}: ${r.postings.length}건 / 최고 매칭 ${top ? top.matchScore : '—'} (${top ? top.company : '—'})`);
  if (top) console.log(`           필요 스킬: ${top.missingSkills.join(', ') || '없음'}`);
}
check('직무를 바꿔가며 비교할 수 있다 (§9.1 ④ 재선택)', knownRoles().length >= 7);

console.log('\n[4] 엣지 케이스 (§9.1 ④, §12)');
const all = (await searchJobs('백엔드 개발자', A)).postings
  .concat((await searchJobs('서비스 기획', A)).postings)
  .concat((await searchJobs('생산기술', B)).postings);
const noInfo = all.filter((p) => !p.hasSkillInfo);
console.log(`  R = ∅ 공고 ${noInfo.length}건:`, noInfo.map((p) => p.title).join(' / ') || '없음');
check('스킬 정보 없는 공고는 스코어가 null이다', noInfo.every((p) => p.matchScore === null));
const oneRole = (await searchJobs('백엔드 개발자', A)).postings;
check('R = ∅ 공고는 스킬 정보 있는 공고보다 뒤에 온다',
  oneRole.findIndex((p) => !p.hasSkillInfo) === -1 ||
  oneRole.findIndex((p) => !p.hasSkillInfo) > oneRole.findLastIndex((p) => p.hasSkillInfo),
  oneRole.map((p) => (p.hasSkillInfo ? 'O' : 'X')).join(''));
check('빈약한 R(1~2개)에 가중치 페널티가 적용된다',
  all.filter((p) => p.hasSkillInfo && p.requiredSkills.length < 3 && p.matchedSkills.length === p.requiredSkills.length)
     .every((p) => p.matchScore < 1));

console.log('\n[5] 사전에 없는 직무명 방어 (§8.7)');
try {
  await searchJobs('프롬프트 엔지니어', A);
  check('사전에 없는 직무명은 거부된다', false);
} catch (e) {
  check('사전에 없는 직무명은 거부된다', e.message.includes('직종코드 사전에 없는'));
}

console.log(failed === 0 ? '\n✅ 전부 통과\n' : `\n❌ ${failed}건 실패\n`);
process.exit(failed === 0 ? 0 : 1);
