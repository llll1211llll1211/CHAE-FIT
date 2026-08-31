/**
 * 목업 응답 (ANTHROPIC_API_KEY가 없을 때 자동 사용)
 *
 * 목적은 두 가지다.
 *   1. 팀원이 키 없이 클론해도 화면 ②~⑤ 작업이 막히지 않게 한다.
 *   2. 계약(contract.js)이 실제로 지켜지는 형태를 코드로 고정한다.
 *
 * 실제 LLM 응답과 **같은 스키마**를 반환하므로, 키를 넣는 순간 프론트 코드는
 * 한 줄도 바뀌지 않는다.
 */

/** 페르소나 A — 컴퓨터공학 졸업예정자 (PRD §4.1) */
export const MOCK_RESUME_ANALYSIS = {
  summary:
    '컴퓨터공학 전공 졸업예정자로, 캡스톤 프로젝트에서 백엔드 서버 개발을 담당했습니다. ' +
    '데이터분석 동아리 활동과 스타트업 인턴 경험을 통해 데이터 처리와 품질 검증을 함께 경험했습니다.',
  totalYears: 0,
  skills: ['Java', '스프링부트', 'MySQL', '파이썬', 'pandas', 'Git', 'SQL'],
  experiences: [
    {
      title: '졸업작품 캡스톤 프로젝트 (백엔드 담당)',
      description:
        '4인 팀에서 웹 서비스의 서버를 맡아 회원·게시글 기능의 API를 설계하고 구현했으며, MySQL 스키마를 직접 설계했습니다.',
      skills: ['Java', '스프링부트', 'MySQL'],
    },
    {
      title: '교내 데이터분석 동아리 (2년)',
      description:
        '공공데이터를 수집해 파이썬으로 전처리하고 시각화하는 스터디를 진행했으며, 교내 발표회에서 분석 결과를 발표했습니다.',
      skills: ['파이썬', 'pandas'],
    },
    {
      title: '스타트업 인턴 (2개월, QA 보조)',
      description:
        '릴리스 전 테스트 케이스를 작성하고 결함을 기록했으며, SQL로 데이터 정합성을 직접 확인했습니다.',
      skills: ['SQL', '테스트 케이스'],
    },
  ],
};

/** 요구사항이 구체적인 공고 — 진단이 잘 나오는 케이스 */
export const MOCK_JOB_POSTING = {
  company: '㈜누리테크',
  title: 'Java/Spring Boot 백엔드 개발자 (신입 가능)',
  summary: [
    'Java와 Spring Boot 기반 백엔드 서비스 개발을 담당합니다.',
    'RESTful API 설계와 MySQL 쿼리 작성이 주요 업무입니다.',
    'Docker, AWS 환경 경험이 있으면 우대합니다.',
  ],
  requirements: [
    'Java 및 Spring Boot 기반 웹 서비스 개발 경험',
    'RESTful API 설계 및 개발 경험',
    'MySQL 등 관계형 데이터베이스 활용 능력',
    'Git을 활용한 협업 경험',
  ],
  preferred: ['Docker 컨테이너 환경 경험', 'AWS 클라우드 환경 운영 경험', '정보처리기사 자격증'],
  skills: ['Java', 'Spring Boot', 'REST API', 'MySQL', 'Git', 'Docker', 'AWS'],
};

/** 자격요건이 빈약한 공고 — 요구 역량 추출 실패 경로 테스트용 (PRD §12) */
export const MOCK_VAGUE_POSTING = {
  company: '한빛정보시스템',
  title: '전산직 신입사원 채용',
  summary: ['전산 업무 전반을 담당합니다.', '성실한 분을 모십니다.', '학력 무관으로 채용합니다.'],
  requirements: ['성실하고 책임감 있는 분'],
  preferred: [],
  skills: [],
};

/**
 * 근거 문장 목업.
 *
 * 실제 구현에서 LLM이 생성하는 부분이며, **확정된 매칭 결과에 대해서만** 쓴다.
 * 아래 문장들도 모두 matchedSkills에 실제로 들어 있는 항목만 다룬다.
 */
export function mockReasons(matchedSkills) {
  const pool = [
    {
      experience: '졸업작품 캡스톤 프로젝트 (백엔드 담당)',
      requirement: 'RESTful API 설계 및 개발 경험',
      text: '캡스톤에서 회원·게시글 기능의 API를 직접 설계하고 구현한 경험이 요구사항의 API 설계 역량과 대응합니다.',
      needs: 'REST API',
    },
    {
      experience: '졸업작품 캡스톤 프로젝트 (백엔드 담당)',
      requirement: 'Java 및 Spring Boot 기반 웹 서비스 개발 경험',
      text: 'Java와 Spring Boot로 팀 서버를 구현한 경험이 요구 기술 스택과 직접 일치합니다.',
      needs: 'Spring Boot',
    },
    {
      experience: '졸업작품 캡스톤 프로젝트 (백엔드 담당)',
      requirement: 'MySQL 등 관계형 데이터베이스 활용 능력',
      text: 'MySQL 스키마를 직접 설계한 경험이 관계형 데이터베이스 활용 요구사항을 충족합니다.',
      needs: 'MySQL',
    },
    {
      experience: '스타트업 인턴 (2개월, QA 보조)',
      requirement: 'MySQL 등 관계형 데이터베이스 활용 능력',
      text: '인턴 기간 중 SQL로 데이터 정합성을 확인한 경험이 실무 쿼리 작성 능력을 뒷받침합니다.',
      needs: 'SQL',
    },
  ];

  const matched = new Set(matchedSkills);
  const picked = pool.filter((r) => matched.has(r.needs));
  return picked.map(({ needs, ...rest }) => rest);
}

/** 경력공고 비교 — "향후 필요 역량" 설명 목업. 주어진 라벨 각각에 그럴듯한 문장을 붙인다. */
export function mockFutureSkillReasons(labels) {
  return labels.map((label) => ({
    label,
    text: `경력직 공고에서는 ${label} 관련 과제를 직접 리딩하는 역할을 맡게 돼요.`,
  }));
}

/* ══════════════════════════════════════════════════════
   반도체 트랙 목업 (성장 로드맵 데모용)

   위쪽 IT 백엔드 목업으로는 성장 로드맵이 절대 뜨지 않는다. 경력공고 코퍼스가
   반도체·디스플레이·이차전지 기업으로 구성돼 있어서, ㈜누리테크 같은 가상 회사는
   matchCorpusPair에서 항상 null이 되기 때문이다(억지 매칭을 막는 설계된 동작).

   그래서 코퍼스에 **실제로 존재하는 페어**를 하나 골라 트랙을 하나 더 뒀다.
   대상: 삼성전자 DS부문 / 설비기술 (KR-IND01-JOB02-021)
   이 페어의 경력 공고는 신입 대비 '머신러닝 모델링'과 '구매·SCM'을 추가로 요구하고,
   두 태그 모두 국비지원 강의가 붙어 있다 — 86개 페어 중 강의까지 뜨는 17개 중 하나다.
   ══════════════════════════════════════════════════════ */

/** 반도체 설비기술 지망 신입 — 아래 MOCK_SEMI_POSTING과 짝이다. */
export const MOCK_SEMI_RESUME_ANALYSIS = {
  summary:
    '기계공학 전공 졸업예정자로, 학부 연구실에서 진공 챔버 장비를 다루며 설비 유지보수와 데이터 기반 이상 탐지를 경험했습니다. 반도체 장비사 현장실습으로 PLC 제어와 셋업 절차를 익혔습니다.',
  totalYears: 0,
  skills: ['설비 유지보수', 'PLC', '진공', 'CAD', 'Python'],
  experiences: [
    {
      title: '학부 연구실 진공 증착 장비 운용 (1년)',
      description:
        '진공 챔버의 배기·압력 계통을 점검하고 소모품 교체 주기를 기록했습니다. 챔버 압력 로그를 Python으로 정리해 이상 구간을 표시하는 스크립트를 만들었습니다.',
      skills: ['진공', '설비 유지보수', 'Python'],
    },
    {
      title: '반도체 장비사 현장실습 (3개월)',
      description:
        '신규 설비 셋업 절차를 따라가며 PLC 시퀀스 동작을 확인했고, 기구 도면을 CAD로 수정하는 작업을 보조했습니다.',
      skills: ['PLC', 'CAD'],
    },
    {
      title: '캡스톤 — 설비 예지보전 미니 프로젝트',
      description:
        '공개 설비 센서 데이터로 고장 전 구간의 패턴을 살펴보고 관리도를 그려 이상 신호를 판별했습니다.',
      skills: ['Python', 'SPC'],
    },
  ],
};

/**
 * 코퍼스의 신입 공고(삼성전자 DS부문 / 설비기술) 원문을 옮긴 것.
 *
 * company·title을 코퍼스와 **글자 그대로** 맞춰야 한다. matchCorpusPair가 회사명을
 * 정규화해 대조하고, 제목 키워드가 하나도 겹치지 않으면 매칭을 포기하기 때문이다.
 */
export const MOCK_SEMI_POSTING = {
  company: '삼성전자 DS부문',
  title: '설비기술',
  summary: [
    '반도체 생산설비의 성능을 유지하고 가동률을 높이는 일을 맡습니다.',
    '설비 이상이 생기면 원인을 분석하고 조치합니다.',
    '신규 설비 셋업과 자동화·지능화 개선을 함께 진행합니다.',
  ],
  requirements: [
    '기계·전자 기초 지식',
    '설비 구조와 동작 원리를 파악하는 이해력',
    '학사 이상 (기계공학·전자공학·메카트로닉스·화학공학)',
  ],
  preferred: [
    '장비 실습 또는 설비 운용 경험',
    'PLC·제어 관련 지식',
    '설비 데이터 기반 예지보전 관심자',
  ],
  skills: ['설비 유지보수', '자동화', 'PLC', '진공', 'CAD', 'SPC', 'Python'],
};
