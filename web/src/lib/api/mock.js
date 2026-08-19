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
