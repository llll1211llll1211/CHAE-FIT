/**
 * 고용24(워크넷) 채용정보 API 어댑터 (PRD §8.1, §8.2)
 *
 * 이 파일의 역할은 하나뿐이다: 고용24 응답을 NormalizedPosting으로 번역한다.
 * 매칭 로직·화면은 고용24 필드명을 절대 알지 못한다. Phase 2에서 사람인을
 * 붙일 때 이 파일과 같은 인터페이스의 파일 하나만 추가하면 된다(§8.1).
 *
 * ┌─ 실 API 전환 시 고칠 곳 ─────────────────────────────┐
 * │ 1. LIST_FIELDS / DETAIL_FIELDS  (아래, 미검증 필드명) │
 * │ 2. parseListXml()               (XML 파싱 미구현)     │
 * │ 3. .env: WORK24_USE_FIXTURE=false, WORK24_API_KEY=... │
 * └──────────────────────────────────────────────────────┘
 */
import { scanSkills } from '../../skills/normalize.js';
import LIST_FIXTURE from '../fixtures/work24-job-search.json' with { type: 'json' };
import DETAIL_FIXTURE from '../fixtures/work24-job-detail.json' with { type: 'json' };

export const SOURCE_ID = 'work24';
export const SOURCE_LABEL = '고용24';

const BASE_URL = 'https://openapi.work.go.kr/opi/opi/opia/wantedApi.do';

/**
 * ⚠️ 미검증 필드명 (PRD §8.2). 공공데이터포털 문서의 한글 항목명을 근거로
 * 추정한 것이며, 인증키 발급 후 실제 응답 1건을 덤프해 확정해야 한다.
 * 추정의 불확실성을 이 상수 하나에 가둬둔다 — 틀려도 여기만 고치면 된다.
 */
const LIST_FIELDS = {
  id:       'wantedAuthNo',      // 구인인증번호
  company:  'company',           // 회사명
  title:    'title',             // 채용제목
  career:   'career',            // 경력
  education:'minEdubg',          // 최소학력
  region:   'region',            // 근무지역
  salaryType:'salTpNm',          // 임금형태
  salary:   'sal',               // 급여
  jobCode:  'jobsCd',            // 직종코드
  postedAt: 'regDt',             // 등록일자
  deadline: 'closeDt',           // 마감일자
  url:      'wantedInfoUrl',     // 채용정보 URL
};

const DETAIL_FIELDS = {
  content: 'jobCont',            // 직무내용 (자연어 본문)
  cert:    'reqCert',            // 요구 자격증
};

const USE_FIXTURE = process.env.WORK24_USE_FIXTURE !== 'false';

/** 고용24 경력 표기 → 구조화. 페르소나 A의 "신입 지원 가능" 필터용(§8.2). */
function parseCareer(raw) {
  const t = String(raw ?? '').trim();
  if (!t || t === '무관' || t === '학력무관') return { text: t || '무관', isEntryLevel: true, minYears: 0 };
  if (t.includes('신입')) return { text: t, isEntryLevel: true, minYears: 0 };
  const m = t.match(/(\d+)/);
  const minYears = m ? Number(m[1]) : null;
  if (t.includes('이하')) return { text: t, isEntryLevel: true, minYears: 0 };
  return { text: t, isEntryLevel: false, minYears };
}

/** YYYYMMDD → YYYY-MM-DD */
function parseDate(raw) {
  const t = String(raw ?? '').trim();
  return /^\d{8}$/.test(t) ? `${t.slice(0, 4)}-${t.slice(4, 6)}-${t.slice(6)}` : (t || null);
}

/** 고용24 레코드 1건 → NormalizedPosting (jobs/types.js 참조) */
function toNormalized(raw) {
  const f = LIST_FIELDS;
  const title = raw[f.title] ?? '';
  return {
    id: `${SOURCE_ID}:${raw[f.id]}`,
    sourceId: SOURCE_ID,
    sourceLabel: SOURCE_LABEL,
    sourceRef: raw[f.id],
    title,
    company: raw[f.company] ?? '',
    region: raw[f.region] ?? '',
    experience: parseCareer(raw[f.career]),
    education: raw[f.education] ?? null,
    salary: raw[f.salary] ? `${raw[f.salaryType] ?? ''} ${raw[f.salary]}만원`.trim() : null,
    jobCode: raw[f.jobCode] ?? null,
    postedAt: parseDate(raw[f.postedAt]),
    deadline: parseDate(raw[f.deadline]),
    url: raw[f.url] ?? null,
    // 1단계: 제목 스캔만. 추가 호출 비용 0 (§8.4)
    requiredSkills: scanSkills(title),
    detailLoaded: false,
  };
}

/** 실 API 응답(XML) 파싱. 인증키 확보 후 구현한다. */
function parseListXml(_xml) {
  throw new Error(
    '[work24] XML 파싱 미구현. 인증키 발급 후 실제 응답을 덤프해 LIST_FIELDS를 확정하고 ' +
    'XML 파서(fast-xml-parser 등)를 연결할 것. 그전까지는 WORK24_USE_FIXTURE=true 로 사용한다.'
  );
}

/**
 * 직종코드로 공고 목록을 조회한다.
 * @param {string} jobCode 워크넷 직종코드 (job-code-map.json)
 * @param {{count?: number}} [opts]
 * @returns {Promise<import('../types.js').NormalizedPosting[]>}
 */
export async function search(jobCode, opts = {}) {
  const count = opts.count ?? 20;

  if (USE_FIXTURE) {
    const rows = LIST_FIXTURE[jobCode] ?? [];
    return rows.slice(0, count).map(toNormalized);
  }

  const params = new URLSearchParams({
    authKey: process.env.WORK24_API_KEY ?? '',
    callTp: 'L',
    returnType: 'XML',
    startPage: '1',
    display: String(count),
    occupation: jobCode,
  });
  const res = await fetch(`${BASE_URL}?${params}`, { signal: AbortSignal.timeout(3000) });
  if (!res.ok) throw new Error(`[work24] 목록 조회 실패: HTTP ${res.status}`);
  return parseListXml(await res.text()).map(toNormalized);
}

/**
 * 상세정보를 조회해 requiredSkills를 보강한다 (§8.4 2단계).
 *
 * 공고당 1회 추가 호출이므로 **화면에 표시할 상위 N건에만** 부른다.
 * 목록 전체에 부르면 N+1 문제로 응답 시간(§7)과 트래픽 한도가 함께 무너진다.
 *
 * @param {import('../types.js').NormalizedPosting[]} postings
 * @returns {Promise<import('../types.js').NormalizedPosting[]>}
 */
export async function enrich(postings) {
  return Promise.all(postings.map(async (p) => {
    let detail;
    if (USE_FIXTURE) {
      detail = DETAIL_FIXTURE[p.sourceRef];
    } else {
      const params = new URLSearchParams({
        authKey: process.env.WORK24_API_KEY ?? '',
        callTp: 'D',
        returnType: 'XML',
        wantedAuthNo: p.sourceRef,
      });
      const res = await fetch(`${BASE_URL}?${params}`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) return p; // 상세 실패는 치명적이지 않다 — 제목 기반 R로 진행
      detail = parseListXml(await res.text());
    }
    if (!detail) return { ...p, detailLoaded: true };

    const fromDetail = scanSkills(detail[DETAIL_FIELDS.content], detail[DETAIL_FIELDS.cert]);
    return {
      ...p,
      requiredSkills: [...new Set([...p.requiredSkills, ...fromDetail])],
      detailLoaded: true,
    };
  }));
}

export default { id: SOURCE_ID, label: SOURCE_LABEL, search, enrich };
