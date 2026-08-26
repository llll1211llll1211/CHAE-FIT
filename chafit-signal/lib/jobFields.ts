export type TierItem = { title: string; count?: number; note?: string };
export type Tier = { key: string; label: string; items: TierItem[] };
export type OrderStep = { title: string; body: string };
export type PostingTag = { label: string; required: boolean };
export type EvidenceItem = { title: string; tag: string; quote: string; source: string };
export type ReviewItem = {
  title: string;
  kind: "필수" | "우대";
  body: string;
  action: string;
  href: string;
};
export type CompetitivenessItem = {
  title: string;
  evidence: boolean;
  freq: number;
  thickness: number;
};

export type FieldPreset = {
  id: string;
  label: string;
  category: string;
  jobMap: {
    tiers: Tier[];
    orderSteps: OrderStep[];
    examplePosting: string;
    totalPostings: number;
    headerNote: string;
  };
  posting: {
    placeholder: string;
    tags: PostingTag[];
    summary: { duty: string; requirement: string; preferred: string };
  };
  diagnosis: {
    company: string;
    coverage: string;
    requiredBreakdown: string;
    preferredBreakdown: string;
    evidence: EvidenceItem[];
    needsReview: ReviewItem[];
    refScore: number;
  };
  competitiveness: {
    items: CompetitivenessItem[];
    refScore: number;
  };
};

export const CUSTOM_FIELD_ID = "custom";

export const FIELD_PRESETS: FieldPreset[] = [
  {
    id: "semiconductor",
    label: "반도체 공정기술",
    category: "반도체·소재",
    jobMap: {
      totalPostings: 240,
      headerNote:
        "최근 6개월 공개 채용공고 240건에서 반복 등장한 문구를 묶은 빈도 정리입니다. 개별 기업의 실제 채용 기준·평가 항목과는 무관합니다.",
      tiers: [
        {
          key: "tier1",
          label: "01 거의 모든 공고에",
          items: [
            { title: "공정 기초 이해 (박막·식각·포토)", count: 221 },
            { title: "데이터 정리·분석 도구", count: 194 },
            { title: "전공 실험·실습 경험", count: 182 },
          ],
        },
        {
          key: "tier2",
          label: "02 절반 정도에",
          items: [
            { title: "통계적 공정관리 (SPC·DOE)", count: 130 },
            { title: "장비·설비 실습 이력", count: 113 },
            { title: "영어 문서 독해", count: 98 },
          ],
        },
        {
          key: "tier3",
          label: "03 있으면 눈에 띔",
          items: [
            { title: "반도체 관련 자격", count: 57 },
            { title: "산학 과제·연구실 참여", count: 45 },
            { title: "현장 인턴 경험", count: 36 },
          ],
        },
      ],
      orderSteps: [
        {
          title: "공정 기초 이해 · 데이터 정리 도구부터",
          body: "240건 중 200건 넘게 요구하는 항목입니다. 전공 수업이나 실습에서 이미 다룬 내용을 문장으로 정리해두면 대부분의 공고에 대응됩니다.",
        },
        {
          title: "SPC·DOE, 장비 실습으로 차별화",
          body: "절반 정도의 공고에만 나오지만, 있으면 눈에 띕니다. 학기 단위 스터디나 실습 기회로 채울 수 있습니다.",
        },
        {
          title: "자격증·인턴은 여유가 있을 때",
          body: "공고의 5분의 1 정도만 요구합니다. 위 두 단계를 먼저 채운 뒤, 시간이 남으면 준비해도 늦지 않습니다.",
        },
      ],
      examplePosting: `[모집 부문] 반도체 공정기술

[담당 업무]
· 박막/식각 공정 조건 최적화 및 산포 개선
· 공정 데이터 분석을 통한 수율 개선

[자격 요건]
· 신소재/화공/전자 관련 전공 학사 이상
· 공정 데이터 분석 경험 (Excel, Python 등)

[우대 사항]
· SPC/DOE 활용 경험
· 반도체 장비 실습 이력`,
    },
    posting: {
      placeholder: "",
      tags: [
        { label: "전공 적합", required: true },
        { label: "공정 기초", required: true },
        { label: "데이터 분석", required: true },
        { label: "엑셀", required: true },
        { label: "파이썬", required: true },
        { label: "산포 개선", required: true },
        { label: "SPC", required: false },
        { label: "DOE", required: false },
        { label: "장비 실습", required: false },
        { label: "수율 개선", required: false },
        { label: "영어 문서", required: false },
        { label: "협업 경험", required: false },
      ],
      summary: {
        duty: "박막·식각 공정의 조건을 잡고 산포를 줄이는 일이며, 판단 근거는 공정 데이터입니다.",
        requirement: "관련 전공과 데이터 분석 경험, 도구는 엑셀·파이썬 수준으로 명시됩니다.",
        preferred: "SPC·DOE와 장비 실습 이력이며, 없어도 지원 가능한 항목입니다.",
      },
    },
    diagnosis: {
      company: "삼성전자 DS",
      coverage: "8/12",
      requiredBreakdown: "6개 중 4개 입증 · 2개 확인 필요",
      preferredBreakdown: "6개 중 4개 입증",
      refScore: 67,
      evidence: [
        {
          title: "공정 기초 이해",
          tag: "필수 요건 직접 대응",
          quote: "“PECVD 장비로 박막 증착 조건을 바꿔가며 두께 편차를 측정”",
          source: "이력서 2p",
        },
        {
          title: "데이터 분석",
          tag: "“공정 데이터 분석” 요구와 대응",
          quote: "“엑셀로 조건별 두께 편차를 정리”",
          source: "이력서 2p",
        },
        {
          title: "장비 실습 이력",
          tag: "우대 항목에 해당",
          quote: "“PECVD 장비 운용 실습 2회”",
          source: "이력서 2p",
        },
      ],
      needsReview: [
        {
          title: "산포 개선",
          kind: "필수",
          body: "편차를 “측정”했다고만 적혀 있습니다. 줄이려 한 시도가 있었다면 한 문장 추가하세요.",
          action: "문장 다듬기",
          href: "/interview",
        },
        {
          title: "파이썬",
          kind: "필수",
          body: "수업 과제 수준의 언급만 있고 산출물이 없습니다.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
        {
          title: "SPC · DOE",
          kind: "우대",
          body: "관련 표현을 찾지 못했습니다. 없으면 비워두고 다른 항목의 근거를 두껍게 하세요.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
      ],
    },
    competitiveness: {
      refScore: 71,
      items: [
        { title: "공정 기초 이해", evidence: true, freq: 92, thickness: 88 },
        { title: "데이터 정리·분석", evidence: true, freq: 81, thickness: 74 },
        { title: "전공 실험·실습", evidence: true, freq: 76, thickness: 70 },
        { title: "통계적 공정관리", evidence: false, freq: 54, thickness: 12 },
        { title: "장비·설비 실습", evidence: true, freq: 47, thickness: 58 },
        { title: "영어 문서 독해", evidence: false, freq: 41, thickness: 8 },
      ],
    },
  },
  {
    id: "software",
    label: "SW 개발",
    category: "IT·개발",
    jobMap: {
      totalPostings: 240,
      headerNote:
        "최근 6개월 공개 채용공고 240건에서 반복 등장한 문구를 묶은 빈도 정리입니다. 개별 기업의 실제 채용 기준·평가 항목과는 무관합니다.",
      tiers: [
        {
          key: "tier1",
          label: "01 거의 모든 공고에",
          items: [
            { title: "자료구조·알고리즘 기초", count: 205 },
            { title: "Git 등 협업 도구 사용", count: 188 },
            { title: "언어 1개 이상 실전 사용 경험", count: 176 },
          ],
        },
        {
          key: "tier2",
          label: "02 절반 정도에",
          items: [
            { title: "웹/서버 프레임워크 경험", count: 121 },
            { title: "DB 설계·쿼리 작성", count: 108 },
            { title: "간단한 배포·운영 경험", count: 95 },
          ],
        },
        {
          key: "tier3",
          label: "03 있으면 눈에 띔",
          items: [
            { title: "오픈소스 기여", count: 52 },
            { title: "개인·팀 프로젝트 배포 이력", count: 47 },
            { title: "코딩 테스트 상위권 성적", count: 33 },
          ],
        },
      ],
      orderSteps: [
        {
          title: "자료구조·Git부터 다져요",
          body: "240건 중 170건 넘게 요구하는 항목입니다. 수업 과제나 개인 프로젝트에서 다룬 내용을 코드와 함께 정리해두면 대부분의 공고에 대응됩니다.",
        },
        {
          title: "프레임워크·DB로 완성된 프로젝트 만들기",
          body: "절반 정도의 공고에서 요구합니다. 학교 프로젝트를 실제 배포까지 이어가면 채울 수 있습니다.",
        },
        {
          title: "오픈소스·코딩테스트는 여유 있을 때",
          body: "공고의 5분의 1 정도만 요구합니다. 위 두 단계를 먼저 채운 뒤 준비해도 늦지 않습니다.",
        },
      ],
      examplePosting: `[모집 부문] 백엔드 개발자

[담당 업무]
· API 서버 설계 및 개발
· 트래픽 증가에 대응하는 성능 개선

[자격 요건]
· 컴퓨터공학 또는 관련 전공 학사 이상
· Java/Kotlin 또는 Python 기반 서버 개발 경험

[우대 사항]
· 클라우드(AWS/GCP) 배포 경험
· 오픈소스 기여 경험`,
    },
    posting: {
      placeholder: "",
      tags: [
        { label: "전공 적합", required: true },
        { label: "자료구조", required: true },
        { label: "API 설계", required: true },
        { label: "Git", required: true },
        { label: "DB 설계", required: true },
        { label: "언어 실전 경험", required: true },
        { label: "클라우드 배포", required: false },
        { label: "오픈소스", required: false },
        { label: "코딩테스트", required: false },
        { label: "테스트 코드", required: false },
        { label: "성능 개선", required: false },
        { label: "협업 경험", required: false },
      ],
      summary: {
        duty: "API 서버를 설계하고 트래픽 증가에 대응해 성능을 개선하는 일이며, 판단 근거는 응답 시간·에러율입니다.",
        requirement: "관련 전공과 서버 개발 경험, 언어는 Java/Kotlin 또는 Python 수준으로 명시됩니다.",
        preferred: "클라우드 배포와 오픈소스 기여 경험이며, 없어도 지원 가능한 항목입니다.",
      },
    },
    diagnosis: {
      company: "네이버",
      coverage: "7/11",
      requiredBreakdown: "6개 중 4개 입증 · 2개 확인 필요",
      preferredBreakdown: "5개 중 3개 입증",
      refScore: 61,
      evidence: [
        {
          title: "자료구조 이해",
          tag: "필수 요건 직접 대응",
          quote: "“정렬·탐색 알고리즘을 과제에서 구현하고 시간복잡도를 비교”",
          source: "이력서 1p",
        },
        {
          title: "API 설계 경험",
          tag: "“API 서버 설계” 요구와 대응",
          quote: "“Spring Boot로 게시판 API를 설계하고 배포”",
          source: "이력서 1p",
        },
        {
          title: "협업 툴 사용",
          tag: "우대 항목에 해당",
          quote: "“Git·GitHub으로 팀 프로젝트 형상 관리”",
          source: "이력서 2p",
        },
      ],
      needsReview: [
        {
          title: "클라우드 배포",
          kind: "필수",
          body: "로컬 실행 경험만 있고 배포 이력이 없습니다. 무료 티어로 배포해본 경험이 있다면 한 문장 추가하세요.",
          action: "문장 다듬기",
          href: "/interview",
        },
        {
          title: "성능 개선",
          kind: "필수",
          body: "기능 구현 위주로만 적혀 있고 개선 시도가 없습니다.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
        {
          title: "오픈소스 기여",
          kind: "우대",
          body: "관련 표현을 찾지 못했습니다. 없으면 비워두고 다른 항목의 근거를 두껍게 하세요.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
      ],
    },
    competitiveness: {
      refScore: 65,
      items: [
        { title: "자료구조 이해", evidence: true, freq: 88, thickness: 80 },
        { title: "API 설계·구현", evidence: true, freq: 79, thickness: 72 },
        { title: "협업 툴 사용", evidence: true, freq: 70, thickness: 66 },
        { title: "DB 설계", evidence: false, freq: 58, thickness: 14 },
        { title: "배포·운영", evidence: false, freq: 50, thickness: 10 },
        { title: "오픈소스 기여", evidence: false, freq: 33, thickness: 6 },
      ],
    },
  },
  {
    id: "marketing",
    label: "마케팅",
    category: "마케팅·콘텐츠",
    jobMap: {
      totalPostings: 240,
      headerNote:
        "최근 6개월 공개 채용공고 240건에서 반복 등장한 문구를 묶은 빈도 정리입니다. 개별 기업의 실제 채용 기준·평가 항목과는 무관합니다.",
      tiers: [
        {
          key: "tier1",
          label: "01 거의 모든 공고에",
          items: [
            { title: "데이터 기반 캠페인 분석", count: 198 },
            { title: "콘텐츠 기획·작성", count: 176 },
            { title: "광고 플랫폼 운영 경험", count: 165 },
          ],
        },
        {
          key: "tier2",
          label: "02 절반 정도에",
          items: [
            { title: "GA4 등 분석 툴 활용", count: 112 },
            { title: "A/B 테스트 이해", count: 97 },
            { title: "브랜드·타깃 전략 이해", count: 88 },
          ],
        },
        {
          key: "tier3",
          label: "03 있으면 눈에 띔",
          items: [
            { title: "공모전·서포터즈 활동", count: 61 },
            { title: "직접 운영한 채널 성과", count: 44 },
            { title: "그로스 마케팅 관련 자격", count: 29 },
          ],
        },
      ],
      orderSteps: [
        {
          title: "데이터 분석·콘텐츠 기획부터",
          body: "240건 중 160건 넘게 요구하는 항목입니다. 학교 과제나 개인 SNS 운영 경험을 숫자로 정리해두면 대부분의 공고에 대응됩니다.",
        },
        {
          title: "GA4·A/B 테스트로 차별화",
          body: "절반 정도의 공고에서 요구합니다. 무료 계정으로 직접 분석해본 경험이면 충분합니다.",
        },
        {
          title: "공모전·채널 운영은 여유 있을 때",
          body: "공고의 4분의 1 정도만 요구합니다. 위 두 단계를 먼저 채운 뒤 준비해도 늦지 않습니다.",
        },
      ],
      examplePosting: `[모집 부문] 퍼포먼스 마케터

[담당 업무]
· 광고 캠페인 기획 및 운영
· 데이터 분석을 통한 캠페인 최적화

[자격 요건]
· 마케팅/경영/통계 등 관련 전공 또는 동등 경험
· GA4, 광고 플랫폼(메타·구글) 운영 경험

[우대 사항]
· SQL 기초 활용 가능
· 콘텐츠 제작 경험`,
    },
    posting: {
      placeholder: "",
      tags: [
        { label: "전공 적합", required: true },
        { label: "데이터 분석", required: true },
        { label: "캠페인 기획", required: true },
        { label: "GA4", required: true },
        { label: "광고 플랫폼 운영", required: true },
        { label: "카피라이팅", required: true },
        { label: "SQL", required: false },
        { label: "A/B 테스트", required: false },
        { label: "브랜드 이해", required: false },
        { label: "콘텐츠 제작", required: false },
        { label: "예산 관리", required: false },
        { label: "협업 경험", required: false },
      ],
      summary: {
        duty: "광고 캠페인을 기획·운영하고 데이터로 성과를 최적화하는 일이며, 판단 근거는 캠페인 지표입니다.",
        requirement: "관련 전공 또는 동등 경험과 GA4·광고 플랫폼 운영 경험이 명시됩니다.",
        preferred: "SQL 활용과 콘텐츠 제작 경험이며, 없어도 지원 가능한 항목입니다.",
      },
    },
    diagnosis: {
      company: "오늘의집",
      coverage: "6/10",
      requiredBreakdown: "5개 중 3개 입증 · 2개 확인 필요",
      preferredBreakdown: "5개 중 3개 입증",
      refScore: 58,
      evidence: [
        {
          title: "데이터 분석 경험",
          tag: "필수 요건 직접 대응",
          quote: "“인스타그램 광고 3개월 운영 데이터를 엑셀로 정리해 CTR을 비교”",
          source: "이력서 1p",
        },
        {
          title: "콘텐츠 기획",
          tag: "“콘텐츠 기획” 요구와 대응",
          quote: "“학교 축제 홍보 콘텐츠를 기획하고 카드뉴스 8건 제작”",
          source: "이력서 2p",
        },
        {
          title: "광고 플랫폼 운영",
          tag: "우대 항목에 해당",
          quote: "“메타 광고 관리자로 소액 캠페인을 직접 운영”",
          source: "이력서 2p",
        },
      ],
      needsReview: [
        {
          title: "GA4 활용",
          kind: "필수",
          body: "분석 툴 이름만 언급되어 있고 실제 활용 사례가 없습니다.",
          action: "문장 다듬기",
          href: "/interview",
        },
        {
          title: "SQL",
          kind: "필수",
          body: "관련 경험을 찾지 못했습니다.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
        {
          title: "A/B 테스트",
          kind: "우대",
          body: "관련 표현을 찾지 못했습니다. 없으면 비워두고 다른 항목의 근거를 두껍게 하세요.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
      ],
    },
    competitiveness: {
      refScore: 60,
      items: [
        { title: "콘텐츠 기획", evidence: true, freq: 85, thickness: 76 },
        { title: "데이터 분석", evidence: true, freq: 80, thickness: 70 },
        { title: "광고 플랫폼 운영", evidence: true, freq: 66, thickness: 60 },
        { title: "GA4 활용", evidence: false, freq: 55, thickness: 12 },
        { title: "SQL", evidence: false, freq: 40, thickness: 8 },
        { title: "A/B 테스트", evidence: false, freq: 35, thickness: 6 },
      ],
    },
  },
  {
    id: "design",
    label: "UX/제품 디자인",
    category: "디자인",
    jobMap: {
      totalPostings: 240,
      headerNote:
        "최근 6개월 공개 채용공고 240건에서 반복 등장한 문구를 묶은 빈도 정리입니다. 개별 기업의 실제 채용 기준·평가 항목과는 무관합니다.",
      tiers: [
        {
          key: "tier1",
          label: "01 거의 모든 공고에",
          items: [
            { title: "사용자 리서치·문제 정의", count: 189 },
            { title: "와이어프레임·프로토타입 제작", count: 171 },
            { title: "Figma 등 디자인 툴 활용", count: 168 },
          ],
        },
        {
          key: "tier2",
          label: "02 절반 정도에",
          items: [
            { title: "디자인 시스템 이해", count: 104 },
            { title: "사용성 테스트 경험", count: 92 },
            { title: "기획·개발과의 협업 프로세스 이해", count: 85 },
          ],
        },
        {
          key: "tier3",
          label: "03 있으면 눈에 띔",
          items: [
            { title: "포트폴리오 프로젝트 다수", count: 58 },
            { title: "공모전 수상", count: 39 },
            { title: "모션·인터랙션 디자인", count: 27 },
          ],
        },
      ],
      orderSteps: [
        {
          title: "리서치·툴 활용부터 다져요",
          body: "240건 중 160건 넘게 요구하는 항목입니다. 학교 과제나 사이드 프로젝트에서 다룬 리서치·프로토타입을 정리해두면 대부분의 공고에 대응됩니다.",
        },
        {
          title: "디자인 시스템·사용성 테스트로 차별화",
          body: "절반 정도의 공고에서 요구합니다. 개인 프로젝트에 작은 디자인 시스템을 만들어보는 것으로 채울 수 있습니다.",
        },
        {
          title: "공모전·모션 디자인은 여유 있을 때",
          body: "공고의 4분의 1 정도만 요구합니다. 위 두 단계를 먼저 채운 뒤 준비해도 늦지 않습니다.",
        },
      ],
      examplePosting: `[모집 부문] 제품 디자이너(UX/UI)

[담당 업무]
· 사용자 리서치 기반 화면 설계
· 프로토타입 제작 및 사용성 테스트

[자격 요건]
· 디자인/HCI 등 관련 전공 또는 동등 경험
· Figma 등 디자인 툴 활용 가능

[우대 사항]
· 디자인 시스템 구축 경험
· 모션/인터랙션 디자인 경험`,
    },
    posting: {
      placeholder: "",
      tags: [
        { label: "전공 적합", required: true },
        { label: "사용자 리서치", required: true },
        { label: "와이어프레임", required: true },
        { label: "Figma", required: true },
        { label: "프로토타입 제작", required: true },
        { label: "사용성 테스트", required: true },
        { label: "디자인 시스템", required: false },
        { label: "협업 프로세스", required: false },
        { label: "포트폴리오", required: false },
        { label: "모션 디자인", required: false },
        { label: "데이터 기반 의사결정", required: false },
        { label: "카피라이팅", required: false },
      ],
      summary: {
        duty: "사용자 리서치를 기반으로 화면을 설계하고 프로토타입으로 사용성을 검증하는 일입니다.",
        requirement: "관련 전공 또는 동등 경험과 Figma 등 디자인 툴 활용 능력이 명시됩니다.",
        preferred: "디자인 시스템 구축과 모션/인터랙션 디자인 경험이며, 없어도 지원 가능한 항목입니다.",
      },
    },
    diagnosis: {
      company: "당근마켓",
      coverage: "5/9",
      requiredBreakdown: "5개 중 3개 입증 · 2개 확인 필요",
      preferredBreakdown: "4개 중 2개 입증",
      refScore: 55,
      evidence: [
        {
          title: "사용자 리서치",
          tag: "필수 요건 직접 대응",
          quote: "“인터뷰 6명을 진행하고 페인포인트를 3가지로 정리”",
          source: "포트폴리오 1p",
        },
        {
          title: "프로토타입 제작",
          tag: "“프로토타입 제작” 요구와 대응",
          quote: "“Figma로 고피델리티 프로토타입을 제작해 사용성 테스트에 활용”",
          source: "포트폴리오 2p",
        },
        {
          title: "협업 경험",
          tag: "우대 항목에 해당",
          quote: "“개발자·기획자와 주간 스프린트로 화면 설계를 조율”",
          source: "포트폴리오 3p",
        },
      ],
      needsReview: [
        {
          title: "디자인 시스템",
          kind: "필수",
          body: "컴포넌트 목록만 있고 구축 과정이 드러나지 않습니다.",
          action: "문장 다듬기",
          href: "/interview",
        },
        {
          title: "사용성 테스트",
          kind: "필수",
          body: "진행했다는 언급만 있고 결과 반영 사례가 없습니다.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
        {
          title: "모션 디자인",
          kind: "우대",
          body: "관련 표현을 찾지 못했습니다. 없으면 비워두고 다른 항목의 근거를 두껍게 하세요.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
      ],
    },
    competitiveness: {
      refScore: 57,
      items: [
        { title: "사용자 리서치", evidence: true, freq: 82, thickness: 74 },
        { title: "프로토타입 제작", evidence: true, freq: 78, thickness: 70 },
        { title: "협업 프로세스", evidence: true, freq: 60, thickness: 56 },
        { title: "디자인 시스템", evidence: false, freq: 52, thickness: 14 },
        { title: "사용성 테스트", evidence: false, freq: 48, thickness: 12 },
        { title: "모션 디자인", evidence: false, freq: 30, thickness: 6 },
      ],
    },
  },
  {
    id: "finance",
    label: "금융·재무",
    category: "금융",
    jobMap: {
      totalPostings: 200,
      headerNote:
        "최근 6개월 공개 채용공고 200건에서 반복 등장한 문구를 묶은 빈도 정리입니다. 개별 기업의 실제 채용 기준·평가 항목과는 무관합니다.",
      tiers: [
        {
          key: "tier1",
          label: "01 거의 모든 공고에",
          items: [
            { title: "재무제표 분석 능력", count: 178 },
            { title: "엑셀·재무모델링", count: 162 },
            { title: "숫자 기반 커뮤니케이션", count: 140 },
          ],
        },
        {
          key: "tier2",
          label: "02 절반 정도에",
          items: [
            { title: "회계·세무 기초 지식", count: 96 },
            { title: "금융자격증 (AFPK, 투자자산운용사 등)", count: 84 },
            { title: "산업 리서치 경험", count: 71 },
          ],
        },
        {
          key: "tier3",
          label: "03 있으면 눈에 띔",
          items: [
            { title: "인턴 경험 (은행·증권·회계법인)", count: 44 },
            { title: "공모전·스터디 수상", count: 28 },
            { title: "제2외국어", count: 19 },
          ],
        },
      ],
      orderSteps: [
        {
          title: "재무제표 분석·엑셀부터",
          body: "200건 중 170건 넘게 요구하는 항목입니다. 학교 수업이나 스터디에서 재무제표를 직접 뜯어본 경험을 정리해두면 대부분의 공고에 대응됩니다.",
        },
        {
          title: "자격증·산업 리서치로 차별화",
          body: "절반 정도의 공고에서 요구합니다. AFPK 등 자격증이나 특정 산업을 깊게 분석한 리포트가 있으면 도움이 됩니다.",
        },
        {
          title: "인턴·공모전은 여유가 있을 때",
          body: "공고의 5분의 1 정도만 요구합니다. 위 두 단계를 먼저 채운 뒤, 시간이 남으면 준비해도 늦지 않습니다.",
        },
      ],
      examplePosting: `[모집 부문] 재무기획 담당자

[담당 업무]
· 월/분기 재무제표 작성 및 분석
· 사업부별 예산 수립 및 실적 관리

[자격 요건]
· 경영/경제/회계 관련 전공 학사 이상
· 재무제표 분석 및 엑셀 활용 능력

[우대 사항]
· AFPK, 투자자산운용사 등 금융자격증
· 은행/증권/회계법인 인턴 경험`,
    },
    posting: {
      placeholder: "",
      tags: [
        { label: "전공 적합", required: true },
        { label: "재무제표 분석", required: true },
        { label: "엑셀 활용", required: true },
        { label: "예산 관리", required: true },
        { label: "숫자 커뮤니케이션", required: true },
        { label: "회계 기초", required: true },
        { label: "금융자격증", required: false },
        { label: "산업 리서치", required: false },
        { label: "인턴 경험", required: false },
        { label: "제2외국어", required: false },
        { label: "공모전 수상", required: false },
        { label: "협업 경험", required: false },
      ],
      summary: {
        duty: "월별·분기별 재무제표를 작성하고 사업부 예산·실적을 관리하는 일이며, 판단 근거는 재무 지표입니다.",
        requirement: "관련 전공과 재무제표 분석·엑셀 활용 능력이 명시됩니다.",
        preferred: "금융자격증과 인턴 경험이며, 없어도 지원 가능한 항목입니다.",
      },
    },
    diagnosis: {
      company: "신한은행",
      coverage: "7/11",
      requiredBreakdown: "6개 중 4개 입증 · 2개 확인 필요",
      preferredBreakdown: "5개 중 3개 입증",
      refScore: 63,
      evidence: [
        {
          title: "재무제표 분석",
          tag: "필수 요건 직접 대응",
          quote: "“3개년 재무제표를 비교해 매출총이익률 변화 원인을 분석”",
          source: "이력서 1p",
        },
        {
          title: "엑셀 활용",
          tag: "“엑셀 활용” 요구와 대응",
          quote: "“피벗테이블로 부서별 예산 집행 현황을 정리”",
          source: "이력서 2p",
        },
        {
          title: "산업 리서치",
          tag: "우대 항목에 해당",
          quote: "“반도체 산업 리포트를 작성해 스터디에서 발표”",
          source: "이력서 2p",
        },
      ],
      needsReview: [
        {
          title: "회계 기초",
          kind: "필수",
          body: "재무제표를 “읽었다”는 언급만 있고 회계 처리 기준에 대한 이해가 드러나지 않습니다.",
          action: "문장 다듬기",
          href: "/interview",
        },
        {
          title: "금융자격증",
          kind: "우대",
          body: "관련 자격증 취득 이력을 찾지 못했습니다.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
        {
          title: "인턴 경험",
          kind: "우대",
          body: "관련 표현을 찾지 못했습니다. 없으면 비워두고 다른 항목의 근거를 두껍게 하세요.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
      ],
    },
    competitiveness: {
      refScore: 66,
      items: [
        { title: "재무제표 분석", evidence: true, freq: 85, thickness: 78 },
        { title: "엑셀 활용", evidence: true, freq: 80, thickness: 72 },
        { title: "산업 리서치", evidence: true, freq: 58, thickness: 52 },
        { title: "회계 기초", evidence: false, freq: 62, thickness: 14 },
        { title: "금융자격증", evidence: false, freq: 50, thickness: 10 },
      ],
    },
  },
  {
    id: "hr",
    label: "인사(HR)",
    category: "인사·조직",
    jobMap: {
      totalPostings: 180,
      headerNote:
        "최근 6개월 공개 채용공고 180건에서 반복 등장한 문구를 묶은 빈도 정리입니다. 개별 기업의 실제 채용 기준·평가 항목과는 무관합니다.",
      tiers: [
        {
          key: "tier1",
          label: "01 거의 모든 공고에",
          items: [
            { title: "채용/HR 프로세스 이해", count: 150 },
            { title: "엑셀·데이터 정리", count: 128 },
            { title: "커뮤니케이션·문서 작성", count: 121 },
          ],
        },
        {
          key: "tier2",
          label: "02 절반 정도에",
          items: [
            { title: "노동법 기초 지식", count: 88 },
            { title: "HR 데이터 분석 (인건비, 이직률 등)", count: 74 },
            { title: "채용 플랫폼·ATS 활용 경험", count: 61 },
          ],
        },
        {
          key: "tier3",
          label: "03 있으면 눈에 띔",
          items: [
            { title: "조직문화·교육기획 프로젝트", count: 39 },
            { title: "인사 관련 자격 (공인노무사 등)", count: 22 },
            { title: "HR테크 툴 활용", count: 17 },
          ],
        },
      ],
      orderSteps: [
        {
          title: "채용 프로세스·문서 작성부터",
          body: "180건 중 140건 넘게 요구하는 항목입니다. 동아리나 학생회에서 채용·운영 업무를 맡아본 경험을 문장으로 정리해두면 대부분의 공고에 대응됩니다.",
        },
        {
          title: "노동법·데이터 분석으로 차별화",
          body: "절반 정도의 공고에서 요구합니다. 인사 관련 수업이나 자격증 공부로 채울 수 있습니다.",
        },
        {
          title: "자격증·HR테크는 여유가 있을 때",
          body: "공고의 5분의 1 정도만 요구합니다. 위 두 단계를 먼저 채운 뒤, 시간이 남으면 준비해도 늦지 않습니다.",
        },
      ],
      examplePosting: `[모집 부문] 인사(HR) 담당자

[담당 업무]
· 채용 전형 운영 및 지원자 커뮤니케이션
· 인사 데이터 관리 및 리포트 작성

[자격 요건]
· 경영/심리/사회 등 관련 전공 또는 동등 경험
· 엑셀 활용 및 문서 작성 능력

[우대 사항]
· 노동법 기초 지식
· 채용 플랫폼(ATS) 활용 경험`,
    },
    posting: {
      placeholder: "",
      tags: [
        { label: "전공 적합", required: true },
        { label: "채용 프로세스 이해", required: true },
        { label: "엑셀 활용", required: true },
        { label: "문서 작성", required: true },
        { label: "커뮤니케이션", required: true },
        { label: "데이터 정리", required: true },
        { label: "노동법 기초", required: false },
        { label: "ATS 활용", required: false },
        { label: "조직문화 기획", required: false },
        { label: "인사 자격증", required: false },
        { label: "HR테크 툴", required: false },
        { label: "협업 경험", required: false },
      ],
      summary: {
        duty: "채용 전형을 운영하고 인사 데이터를 관리·리포트하는 일이며, 판단 근거는 채용 지표와 문서입니다.",
        requirement: "관련 전공 또는 동등 경험과 엑셀·문서 작성 능력이 명시됩니다.",
        preferred: "노동법 기초 지식과 ATS 활용 경험이며, 없어도 지원 가능한 항목입니다.",
      },
    },
    diagnosis: {
      company: "카카오",
      coverage: "6/10",
      requiredBreakdown: "5개 중 3개 입증 · 2개 확인 필요",
      preferredBreakdown: "5개 중 3개 입증",
      refScore: 59,
      evidence: [
        {
          title: "채용 프로세스 이해",
          tag: "필수 요건 직접 대응",
          quote: "“동아리 신입 부원 채용 공고 작성부터 면접 일정 조율까지 진행”",
          source: "이력서 1p",
        },
        {
          title: "문서 작성",
          tag: "“문서 작성” 요구와 대응",
          quote: "“채용 결과를 정리한 보고서를 매 기수 작성”",
          source: "이력서 1p",
        },
        {
          title: "커뮤니케이션",
          tag: "우대 항목에 해당",
          quote: "“지원자 100명과 이메일·문자로 일정을 조율”",
          source: "이력서 2p",
        },
      ],
      needsReview: [
        {
          title: "노동법 기초",
          kind: "필수",
          body: "관련 학습 경험이 이력서에 드러나지 않습니다.",
          action: "문장 다듬기",
          href: "/interview",
        },
        {
          title: "데이터 정리",
          kind: "필수",
          body: "엑셀로 정리했다는 언급만 있고 구체적 산출물이 없습니다.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
        {
          title: "ATS 활용",
          kind: "우대",
          body: "관련 표현을 찾지 못했습니다. 없으면 비워두고 다른 항목의 근거를 두껍게 하세요.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
      ],
    },
    competitiveness: {
      refScore: 60,
      items: [
        { title: "채용 프로세스 이해", evidence: true, freq: 76, thickness: 68 },
        { title: "문서 작성", evidence: true, freq: 70, thickness: 62 },
        { title: "커뮤니케이션", evidence: true, freq: 68, thickness: 60 },
        { title: "노동법 기초", evidence: false, freq: 55, thickness: 12 },
        { title: "HR 데이터 분석", evidence: false, freq: 48, thickness: 10 },
      ],
    },
  },
  {
    id: "manufacturing",
    label: "생산·품질관리",
    category: "제조·생산",
    jobMap: {
      totalPostings: 220,
      headerNote:
        "최근 6개월 공개 채용공고 220건에서 반복 등장한 문구를 묶은 빈도 정리입니다. 개별 기업의 실제 채용 기준·평가 항목과는 무관합니다.",
      tiers: [
        {
          key: "tier1",
          label: "01 거의 모든 공고에",
          items: [
            { title: "공정 이해 및 현장 실습 경험", count: 198 },
            { title: "품질관리 기초 (SPC, 불량 분석)", count: 175 },
            { title: "데이터 정리·엑셀", count: 150 },
          ],
        },
        {
          key: "tier2",
          label: "02 절반 정도에",
          items: [
            { title: "6시그마·품질 자격증", count: 102 },
            { title: "설비·장비 운용 이해", count: 89 },
            { title: "ISO 등 품질 시스템 이해", count: 70 },
          ],
        },
        {
          key: "tier3",
          label: "03 있으면 눈에 띔",
          items: [
            { title: "현장 인턴 경험", count: 48 },
            { title: "개선 프로젝트 수행 경험", count: 33 },
            { title: "영어 문서 독해", count: 21 },
          ],
        },
      ],
      orderSteps: [
        {
          title: "공정 이해·품질관리 기초부터",
          body: "220건 중 170건 넘게 요구하는 항목입니다. 전공 실습이나 현장 실습에서 다룬 공정·품질 이슈를 문장으로 정리해두면 대부분의 공고에 대응됩니다.",
        },
        {
          title: "6시그마·설비 이해로 차별화",
          body: "절반 정도의 공고에서 요구합니다. 관련 자격증이나 설비 실습 이력으로 채울 수 있습니다.",
        },
        {
          title: "인턴·개선 프로젝트는 여유가 있을 때",
          body: "공고의 5분의 1 정도만 요구합니다. 위 두 단계를 먼저 채운 뒤, 시간이 남으면 준비해도 늦지 않습니다.",
        },
      ],
      examplePosting: `[모집 부문] 생산기술/품질관리

[담당 업무]
· 생산 공정 모니터링 및 불량 원인 분석
· 품질 데이터 수집·정리 및 개선안 제안

[자격 요건]
· 기계/화공/산업공학 등 관련 전공 학사 이상
· 공정 데이터 분석 및 엑셀 활용 능력

[우대 사항]
· 6시그마(GB/BB) 등 품질 자격증
· 생산 현장 실습 이력`,
    },
    posting: {
      placeholder: "",
      tags: [
        { label: "전공 적합", required: true },
        { label: "공정 이해", required: true },
        { label: "품질관리 기초", required: true },
        { label: "데이터 분석", required: true },
        { label: "엑셀 활용", required: true },
        { label: "불량 분석", required: true },
        { label: "6시그마", required: false },
        { label: "설비 운용", required: false },
        { label: "ISO 이해", required: false },
        { label: "현장 인턴", required: false },
        { label: "영어 문서", required: false },
        { label: "협업 경험", required: false },
      ],
      summary: {
        duty: "생산 공정을 모니터링하고 불량 원인을 분석해 품질을 개선하는 일이며, 판단 근거는 공정·품질 데이터입니다.",
        requirement: "관련 전공과 공정 데이터 분석·엑셀 활용 능력이 명시됩니다.",
        preferred: "6시그마 자격증과 현장 실습 이력이며, 없어도 지원 가능한 항목입니다.",
      },
    },
    diagnosis: {
      company: "현대자동차",
      coverage: "8/13",
      requiredBreakdown: "7개 중 5개 입증 · 2개 확인 필요",
      preferredBreakdown: "6개 중 3개 입증",
      refScore: 64,
      evidence: [
        {
          title: "공정 이해",
          tag: "필수 요건 직접 대응",
          quote: "“사출 성형 공정에서 온도·압력 조건별 불량률 변화를 측정”",
          source: "이력서 2p",
        },
        {
          title: "데이터 분석",
          tag: "“품질 데이터 수집” 요구와 대응",
          quote: "“엑셀로 불량 유형별 발생 빈도를 정리해 파레토 차트로 시각화”",
          source: "이력서 2p",
        },
        {
          title: "설비 운용",
          tag: "우대 항목에 해당",
          quote: "“사출 성형기 운용 실습 3회”",
          source: "이력서 3p",
        },
      ],
      needsReview: [
        {
          title: "6시그마",
          kind: "필수",
          body: "관련 자격증 취득 이력을 찾지 못했습니다.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
        {
          title: "불량 분석",
          kind: "필수",
          body: "불량을 “확인”했다는 언급만 있고 원인 분석 과정이 드러나지 않습니다.",
          action: "문장 다듬기",
          href: "/interview",
        },
        {
          title: "ISO 이해",
          kind: "우대",
          body: "관련 표현을 찾지 못했습니다. 없으면 비워두고 다른 항목의 근거를 두껍게 하세요.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
      ],
    },
    competitiveness: {
      refScore: 68,
      items: [
        { title: "공정 이해", evidence: true, freq: 90, thickness: 82 },
        { title: "데이터 분석", evidence: true, freq: 82, thickness: 74 },
        { title: "설비 운용", evidence: true, freq: 60, thickness: 54 },
        { title: "6시그마", evidence: false, freq: 58, thickness: 14 },
        { title: "ISO 이해", evidence: false, freq: 42, thickness: 8 },
      ],
    },
  },
  {
    id: "sales-md",
    label: "영업·MD",
    category: "영업·유통",
    jobMap: {
      totalPostings: 190,
      headerNote:
        "최근 6개월 공개 채용공고 190건에서 반복 등장한 문구를 묶은 빈도 정리입니다. 개별 기업의 실제 채용 기준·평가 항목과는 무관합니다.",
      tiers: [
        {
          key: "tier1",
          label: "01 거의 모든 공고에",
          items: [
            { title: "매출·판매 데이터 분석", count: 165 },
            { title: "거래처·바이어 커뮤니케이션", count: 148 },
            { title: "엑셀·PPT 보고서 작성", count: 132 },
          ],
        },
        {
          key: "tier2",
          label: "02 절반 정도에",
          items: [
            { title: "카테고리·트렌드 리서치", count: 94 },
            { title: "협상·계약 기초 이해", count: 80 },
            { title: "재고·발주 관리 이해", count: 66 },
          ],
        },
        {
          key: "tier3",
          label: "03 있으면 눈에 띔",
          items: [
            { title: "해외 소싱·영어 커뮤니케이션", count: 42 },
            { title: "MD 관련 인턴 경험", count: 31 },
            { title: "SQL 등 데이터 툴 활용", count: 20 },
          ],
        },
      ],
      orderSteps: [
        {
          title: "매출 데이터 분석·보고서부터",
          body: "190건 중 150건 넘게 요구하는 항목입니다. 아르바이트나 프로젝트에서 판매 데이터를 정리해본 경험을 문장으로 만들어두면 대부분의 공고에 대응됩니다.",
        },
        {
          title: "트렌드 리서치·협상 이해로 차별화",
          body: "절반 정도의 공고에서 요구합니다. 카테고리를 정해 직접 리서치해본 경험이면 충분합니다.",
        },
        {
          title: "해외 소싱·인턴은 여유가 있을 때",
          body: "공고의 5분의 1 정도만 요구합니다. 위 두 단계를 먼저 채운 뒤, 시간이 남으면 준비해도 늦지 않습니다.",
        },
      ],
      examplePosting: `[모집 부문] MD(상품기획) 주니어

[담당 업무]
· 카테고리별 매출 분석 및 상품 기획
· 거래처 발굴 및 발주·재고 관리

[자격 요건]
· 경영/경제 등 관련 전공 또는 동등 경험
· 엑셀 및 PPT 활용 능력

[우대 사항]
· 트렌드 리서치 및 SNS 활용 경험
· 해외 소싱 또는 영어 커뮤니케이션 경험`,
    },
    posting: {
      placeholder: "",
      tags: [
        { label: "전공 적합", required: true },
        { label: "매출 데이터 분석", required: true },
        { label: "거래처 커뮤니케이션", required: true },
        { label: "엑셀 활용", required: true },
        { label: "PPT 작성", required: true },
        { label: "트렌드 리서치", required: true },
        { label: "협상 이해", required: false },
        { label: "재고 관리", required: false },
        { label: "해외 소싱", required: false },
        { label: "SQL 활용", required: false },
        { label: "MD 인턴 경험", required: false },
        { label: "협업 경험", required: false },
      ],
      summary: {
        duty: "카테고리별 매출을 분석해 상품을 기획하고 거래처 발주·재고를 관리하는 일이며, 판단 근거는 매출·재고 지표입니다.",
        requirement: "관련 전공 또는 동등 경험과 엑셀·PPT 활용 능력이 명시됩니다.",
        preferred: "트렌드 리서치와 해외 소싱 경험이며, 없어도 지원 가능한 항목입니다.",
      },
    },
    diagnosis: {
      company: "쿠팡",
      coverage: "6/11",
      requiredBreakdown: "6개 중 3개 입증 · 3개 확인 필요",
      preferredBreakdown: "5개 중 3개 입증",
      refScore: 56,
      evidence: [
        {
          title: "매출 데이터 분석",
          tag: "필수 요건 직접 대응",
          quote: "“편의점 아르바이트 중 시간대별 판매 데이터를 정리해 발주량을 제안”",
          source: "이력서 1p",
        },
        {
          title: "트렌드 리서치",
          tag: "“트렌드 리서치” 요구와 대응",
          quote: "“인스타그램 트렌드를 분석해 팝업스토어 상품 구성을 제안”",
          source: "이력서 2p",
        },
        {
          title: "PPT 작성",
          tag: "우대 항목에 해당",
          quote: "“분석 결과를 PPT 10장으로 정리해 발표”",
          source: "이력서 2p",
        },
      ],
      needsReview: [
        {
          title: "거래처 커뮤니케이션",
          kind: "필수",
          body: "내부 팀원과의 협업 경험만 있고 외부 거래처 응대 경험이 없습니다.",
          action: "문장 다듬기",
          href: "/interview",
        },
        {
          title: "협상 이해",
          kind: "필수",
          body: "관련 표현을 찾지 못했습니다.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
        {
          title: "해외 소싱",
          kind: "우대",
          body: "관련 표현을 찾지 못했습니다. 없으면 비워두고 다른 항목의 근거를 두껍게 하세요.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
      ],
    },
    competitiveness: {
      refScore: 58,
      items: [
        { title: "매출 데이터 분석", evidence: true, freq: 82, thickness: 74 },
        { title: "트렌드 리서치", evidence: true, freq: 74, thickness: 66 },
        { title: "PPT 작성", evidence: true, freq: 65, thickness: 58 },
        { title: "거래처 커뮤니케이션", evidence: false, freq: 60, thickness: 15 },
        { title: "해외 소싱", evidence: false, freq: 35, thickness: 6 },
      ],
    },
  },
  {
    id: "media",
    label: "미디어·콘텐츠",
    category: "미디어·콘텐츠",
    jobMap: {
      totalPostings: 160,
      headerNote:
        "최근 6개월 공개 채용공고 160건에서 반복 등장한 문구를 묶은 빈도 정리입니다. 개별 기업의 실제 채용 기준·평가 항목과는 무관합니다.",
      tiers: [
        {
          key: "tier1",
          label: "01 거의 모든 공고에",
          items: [
            { title: "기획안·시놉시스 작성", count: 138 },
            { title: "영상·콘텐츠 제작 툴 활용", count: 121 },
            { title: "트렌드 파악 및 아이디어 기획", count: 110 },
          ],
        },
        {
          key: "tier2",
          label: "02 절반 정도에",
          items: [
            { title: "촬영·편집 실무 경험", count: 78 },
            { title: "SNS·플랫폼별 콘텐츠 이해", count: 66 },
            { title: "협업 스케줄 관리", count: 55 },
          ],
        },
        {
          key: "tier3",
          label: "03 있으면 눈에 띔",
          items: [
            { title: "공모전·개인 채널 운영 성과", count: 37 },
            { title: "저작권·심의 기초 지식", count: 24 },
            { title: "외주·프리랜서 협업 경험", count: 16 },
          ],
        },
      ],
      orderSteps: [
        {
          title: "기획안 작성·제작 툴부터",
          body: "160건 중 120건 넘게 요구하는 항목입니다. 학교 과제나 개인 채널에서 만든 기획안·영상을 정리해두면 대부분의 공고에 대응됩니다.",
        },
        {
          title: "편집 실무·플랫폼 이해로 차별화",
          body: "절반 정도의 공고에서 요구합니다. 직접 편집하고 업로드까지 해본 경험이면 도움이 됩니다.",
        },
        {
          title: "공모전·외주 협업은 여유가 있을 때",
          body: "공고의 4분의 1 정도만 요구합니다. 위 두 단계를 먼저 채운 뒤, 시간이 남으면 준비해도 늦지 않습니다.",
        },
      ],
      examplePosting: `[모집 부문] 콘텐츠 PD

[담당 업무]
· 콘텐츠 기획안 작성 및 촬영 진행
· 편집본 검수 및 플랫폼별 업로드

[자격 요건]
· 관련 전공 또는 동등 경험
· 영상 편집 툴(프리미어 등) 활용 가능

[우대 사항]
· 개인 채널 운영 또는 조회수 성과
· SNS 플랫폼별 콘텐츠 특성 이해`,
    },
    posting: {
      placeholder: "",
      tags: [
        { label: "전공 적합", required: true },
        { label: "기획안 작성", required: true },
        { label: "편집 툴 활용", required: true },
        { label: "트렌드 파악", required: true },
        { label: "촬영 실무", required: true },
        { label: "아이디어 기획", required: true },
        { label: "SNS 이해", required: false },
        { label: "채널 운영 성과", required: false },
        { label: "저작권 지식", required: false },
        { label: "외주 협업", required: false },
        { label: "스케줄 관리", required: false },
        { label: "협업 경험", required: false },
      ],
      summary: {
        duty: "콘텐츠 기획안을 작성하고 촬영·편집을 거쳐 플랫폼에 업로드하는 일이며, 판단 근거는 조회수·완성도입니다.",
        requirement: "관련 전공 또는 동등 경험과 영상 편집 툴 활용 능력이 명시됩니다.",
        preferred: "개인 채널 운영 성과와 SNS 플랫폼 이해이며, 없어도 지원 가능한 항목입니다.",
      },
    },
    diagnosis: {
      company: "CJ ENM",
      coverage: "5/9",
      requiredBreakdown: "5개 중 3개 입증 · 2개 확인 필요",
      preferredBreakdown: "4개 중 2개 입증",
      refScore: 54,
      evidence: [
        {
          title: "기획안 작성",
          tag: "필수 요건 직접 대응",
          quote: "“대학 유튜브 채널 기획안을 매주 작성하고 촬영까지 진행”",
          source: "포트폴리오 1p",
        },
        {
          title: "편집 툴 활용",
          tag: "“편집 툴 활용” 요구와 대응",
          quote: "“프리미어 프로로 30편 이상 영상 편집”",
          source: "포트폴리오 1p",
        },
        {
          title: "트렌드 파악",
          tag: "우대 항목에 해당",
          quote: "“숏폼 트렌드를 분석해 채널 콘텐츠 방향을 조정”",
          source: "포트폴리오 2p",
        },
      ],
      needsReview: [
        {
          title: "채널 운영 성과",
          kind: "필수",
          body: "영상 제작 이력만 있고 조회수·구독자 등 구체적 성과가 없습니다.",
          action: "문장 다듬기",
          href: "/interview",
        },
        {
          title: "촬영 실무",
          kind: "필수",
          body: "편집 경험만 있고 직접 촬영한 경험이 드러나지 않습니다.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
        {
          title: "저작권 지식",
          kind: "우대",
          body: "관련 표현을 찾지 못했습니다. 없으면 비워두고 다른 항목의 근거를 두껍게 하세요.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
      ],
    },
    competitiveness: {
      refScore: 55,
      items: [
        { title: "기획안 작성", evidence: true, freq: 80, thickness: 72 },
        { title: "편집 툴 활용", evidence: true, freq: 75, thickness: 68 },
        { title: "트렌드 파악", evidence: true, freq: 62, thickness: 55 },
        { title: "채널 운영 성과", evidence: false, freq: 50, thickness: 12 },
        { title: "촬영 실무", evidence: false, freq: 45, thickness: 10 },
      ],
    },
  },
  {
    id: "education",
    label: "교육·에듀테크",
    category: "교육",
    jobMap: {
      totalPostings: 150,
      headerNote:
        "최근 6개월 공개 채용공고 150건에서 반복 등장한 문구를 묶은 빈도 정리입니다. 개별 기업의 실제 채용 기준·평가 항목과는 무관합니다.",
      tiers: [
        {
          key: "tier1",
          label: "01 거의 모든 공고에",
          items: [
            { title: "커리큘럼·교육 콘텐츠 기획", count: 128 },
            { title: "학습자 데이터 분석", count: 105 },
            { title: "문서 작성·커뮤니케이션", count: 98 },
          ],
        },
        {
          key: "tier2",
          label: "02 절반 정도에",
          items: [
            { title: "교육 플랫폼·LMS 활용 경험", count: 70 },
            { title: "강의·튜터링 경험", count: 62 },
            { title: "교육학 기초 이해", count: 51 },
          ],
        },
        {
          key: "tier3",
          label: "03 있으면 눈에 띔",
          items: [
            { title: "교육 관련 자격증 (교원자격 등)", count: 34 },
            { title: "에듀테크 프로덕트 기획 경험", count: 22 },
            { title: "외국어 교육 콘텐츠 경험", count: 15 },
          ],
        },
      ],
      orderSteps: [
        {
          title: "커리큘럼 기획·문서 작성부터",
          body: "150건 중 110건 넘게 요구하는 항목입니다. 과외나 튜터링에서 만든 학습 자료를 정리해두면 대부분의 공고에 대응됩니다.",
        },
        {
          title: "학습자 데이터·플랫폼 활용으로 차별화",
          body: "절반 정도의 공고에서 요구합니다. 학습 결과를 숫자로 정리해본 경험이면 도움이 됩니다.",
        },
        {
          title: "자격증·프로덕트 기획은 여유가 있을 때",
          body: "공고의 4분의 1 정도만 요구합니다. 위 두 단계를 먼저 채운 뒤, 시간이 남으면 준비해도 늦지 않습니다.",
        },
      ],
      examplePosting: `[모집 부문] 교육콘텐츠 기획자

[담당 업무]
· 커리큘럼 및 학습 콘텐츠 기획
· 학습자 데이터 분석을 통한 콘텐츠 개선

[자격 요건]
· 교육/사범 등 관련 전공 또는 동등 경험
· 문서 작성 및 커뮤니케이션 능력

[우대 사항]
· 강의 또는 튜터링 경험
· LMS 등 교육 플랫폼 활용 경험`,
    },
    posting: {
      placeholder: "",
      tags: [
        { label: "전공 적합", required: true },
        { label: "커리큘럼 기획", required: true },
        { label: "학습자 데이터 분석", required: true },
        { label: "문서 작성", required: true },
        { label: "커뮤니케이션", required: true },
        { label: "콘텐츠 기획", required: true },
        { label: "LMS 활용", required: false },
        { label: "강의 경험", required: false },
        { label: "교육학 이해", required: false },
        { label: "자격증", required: false },
        { label: "프로덕트 기획", required: false },
        { label: "외국어 콘텐츠", required: false },
      ],
      summary: {
        duty: "커리큘럼과 학습 콘텐츠를 기획하고 학습자 데이터로 개선하는 일이며, 판단 근거는 학습 성과 지표입니다.",
        requirement: "관련 전공 또는 동등 경험과 문서 작성·커뮤니케이션 능력이 명시됩니다.",
        preferred: "강의·튜터링 경험과 LMS 활용 경험이며, 없어도 지원 가능한 항목입니다.",
      },
    },
    diagnosis: {
      company: "메가스터디",
      coverage: "6/10",
      requiredBreakdown: "5개 중 3개 입증 · 2개 확인 필요",
      preferredBreakdown: "5개 중 3개 입증",
      refScore: 57,
      evidence: [
        {
          title: "커리큘럼 기획",
          tag: "필수 요건 직접 대응",
          quote: "“고등학생 대상 8주 수학 커리큘럼을 직접 설계”",
          source: "이력서 1p",
        },
        {
          title: "강의 경험",
          tag: "“강의 경험” 요구와 대응",
          quote: "“과외 학생 5명을 대상으로 주 2회 수업 진행”",
          source: "이력서 1p",
        },
        {
          title: "학습자 데이터 분석",
          tag: "우대 항목에 해당",
          quote: "“학생별 오답률을 정리해 취약 단원을 재구성”",
          source: "이력서 2p",
        },
      ],
      needsReview: [
        {
          title: "LMS 활용",
          kind: "필수",
          body: "관련 표현을 찾지 못했습니다.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
        {
          title: "문서 작성",
          kind: "필수",
          body: "수업 자료 제작 언급만 있고 문서화 사례가 구체적이지 않습니다.",
          action: "문장 다듬기",
          href: "/interview",
        },
        {
          title: "자격증",
          kind: "우대",
          body: "관련 표현을 찾지 못했습니다. 없으면 비워두고 다른 항목의 근거를 두껍게 하세요.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
      ],
    },
    competitiveness: {
      refScore: 59,
      items: [
        { title: "커리큘럼 기획", evidence: true, freq: 78, thickness: 70 },
        { title: "강의 경험", evidence: true, freq: 72, thickness: 64 },
        { title: "학습자 데이터 분석", evidence: true, freq: 58, thickness: 52 },
        { title: "LMS 활용", evidence: false, freq: 48, thickness: 10 },
        { title: "자격증", evidence: false, freq: 30, thickness: 6 },
      ],
    },
  },
  {
    id: "construction",
    label: "건설·엔지니어링",
    category: "건설·엔지니어링",
    jobMap: {
      totalPostings: 210,
      headerNote:
        "최근 6개월 공개 채용공고 210건에서 반복 등장한 문구를 묶은 빈도 정리입니다. 개별 기업의 실제 채용 기준·평가 항목과는 무관합니다.",
      tiers: [
        {
          key: "tier1",
          label: "01 거의 모든 공고에",
          items: [
            { title: "설계 도면 이해 (CAD 등)", count: 185 },
            { title: "현장 실습·시공 이해", count: 160 },
            { title: "공정 관리 기초", count: 140 },
          ],
        },
        {
          key: "tier2",
          label: "02 절반 정도에",
          items: [
            { title: "구조·안전 기준 이해", count: 98 },
            { title: "적산·견적 이해", count: 82 },
            { title: "관련 자격증 (기사 등)", count: 70 },
          ],
        },
        {
          key: "tier3",
          label: "03 있으면 눈에 띔",
          items: [
            { title: "BIM 등 3D 설계 툴 활용", count: 45 },
            { title: "현장 인턴 경험", count: 33 },
            { title: "해외 프로젝트 경험", count: 18 },
          ],
        },
      ],
      orderSteps: [
        {
          title: "도면 이해·CAD부터",
          body: "210건 중 160건 넘게 요구하는 항목입니다. 전공 수업이나 실습에서 다룬 설계 도면을 정리해두면 대부분의 공고에 대응됩니다.",
        },
        {
          title: "구조·적산 이해로 차별화",
          body: "절반 정도의 공고에서 요구합니다. 관련 자격증이나 적산 실습 경험으로 채울 수 있습니다.",
        },
        {
          title: "BIM·해외 경험은 여유가 있을 때",
          body: "공고의 5분의 1 정도만 요구합니다. 위 두 단계를 먼저 채운 뒤, 시간이 남으면 준비해도 늦지 않습니다.",
        },
      ],
      examplePosting: `[모집 부문] 건축시공 엔지니어

[담당 업무]
· 시공 도면 검토 및 현장 공정 관리
· 협력업체와의 시공 일정 조율

[자격 요건]
· 건축/토목 관련 전공 학사 이상
· CAD 등 설계 도면 활용 능력

[우대 사항]
· 건축기사 등 관련 자격증
· 현장 실습 또는 인턴 경험`,
    },
    posting: {
      placeholder: "",
      tags: [
        { label: "전공 적합", required: true },
        { label: "도면 이해", required: true },
        { label: "CAD 활용", required: true },
        { label: "현장 이해", required: true },
        { label: "공정 관리", required: true },
        { label: "구조 이해", required: true },
        { label: "적산 이해", required: false },
        { label: "관련 자격증", required: false },
        { label: "BIM 활용", required: false },
        { label: "현장 인턴", required: false },
        { label: "해외 경험", required: false },
        { label: "협업 경험", required: false },
      ],
      summary: {
        duty: "시공 도면을 검토하고 현장 공정과 협력업체 일정을 관리하는 일이며, 판단 근거는 공정표와 도면입니다.",
        requirement: "관련 전공과 CAD 등 설계 도면 활용 능력이 명시됩니다.",
        preferred: "건축기사 등 자격증과 현장 실습 경험이며, 없어도 지원 가능한 항목입니다.",
      },
    },
    diagnosis: {
      company: "현대건설",
      coverage: "7/12",
      requiredBreakdown: "6개 중 4개 입증 · 2개 확인 필요",
      preferredBreakdown: "6개 중 3개 입증",
      refScore: 60,
      evidence: [
        {
          title: "도면 이해",
          tag: "필수 요건 직접 대응",
          quote: "“졸업 설계에서 구조 도면을 직접 작성하고 검토”",
          source: "포트폴리오 1p",
        },
        {
          title: "CAD 활용",
          tag: "“CAD 활용” 요구와 대응",
          quote: "“AutoCAD로 평면도·입면도 10건 이상 작성”",
          source: "포트폴리오 1p",
        },
        {
          title: "현장 이해",
          tag: "우대 항목에 해당",
          quote: "“현장 실습 4주간 시공 순서와 안전 기준을 관찰·기록”",
          source: "이력서 2p",
        },
      ],
      needsReview: [
        {
          title: "관련 자격증",
          kind: "필수",
          body: "취득 예정이라고만 적혀 있고 확정 일정이 없습니다.",
          action: "문장 다듬기",
          href: "/interview",
        },
        {
          title: "적산 이해",
          kind: "필수",
          body: "관련 표현을 찾지 못했습니다.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
        {
          title: "BIM 활용",
          kind: "우대",
          body: "관련 표현을 찾지 못했습니다. 없으면 비워두고 다른 항목의 근거를 두껍게 하세요.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
      ],
    },
    competitiveness: {
      refScore: 62,
      items: [
        { title: "도면 이해", evidence: true, freq: 88, thickness: 80 },
        { title: "CAD 활용", evidence: true, freq: 82, thickness: 74 },
        { title: "현장 이해", evidence: true, freq: 64, thickness: 58 },
        { title: "적산 이해", evidence: false, freq: 50, thickness: 12 },
        { title: "BIM 활용", evidence: false, freq: 38, thickness: 8 },
      ],
    },
  },
  {
    id: "logistics",
    label: "물류·SCM",
    category: "물류·운영",
    jobMap: {
      totalPostings: 170,
      headerNote:
        "최근 6개월 공개 채용공고 170건에서 반복 등장한 문구를 묶은 빈도 정리입니다. 개별 기업의 실제 채용 기준·평가 항목과는 무관합니다.",
      tiers: [
        {
          key: "tier1",
          label: "01 거의 모든 공고에",
          items: [
            { title: "재고·입출고 데이터 관리", count: 148 },
            { title: "엑셀·데이터 분석", count: 132 },
            { title: "프로세스 개선 이해", count: 110 },
          ],
        },
        {
          key: "tier2",
          label: "02 절반 정도에",
          items: [
            { title: "SCM·물류 시스템(WMS 등) 이해", count: 80 },
            { title: "수요 예측 기초", count: 65 },
            { title: "협력업체 커뮤니케이션", count: 58 },
          ],
        },
        {
          key: "tier3",
          label: "03 있으면 눈에 띔",
          items: [
            { title: "물류 관련 자격증", count: 30 },
            { title: "해외 물류·무역 실무 지식", count: 22 },
            { title: "SQL 등 데이터 툴 활용", count: 16 },
          ],
        },
      ],
      orderSteps: [
        {
          title: "재고 데이터 관리·엑셀부터",
          body: "170건 중 130건 넘게 요구하는 항목입니다. 아르바이트나 프로젝트에서 재고·입출고를 정리해본 경험을 문장으로 만들어두면 대부분의 공고에 대응됩니다.",
        },
        {
          title: "WMS·수요 예측으로 차별화",
          body: "절반 정도의 공고에서 요구합니다. 관련 수업이나 시뮬레이션 경험으로 채울 수 있습니다.",
        },
        {
          title: "자격증·무역 실무는 여유가 있을 때",
          body: "공고의 5분의 1 정도만 요구합니다. 위 두 단계를 먼저 채운 뒤, 시간이 남으면 준비해도 늦지 않습니다.",
        },
      ],
      examplePosting: `[모집 부문] 물류운영(SCM) 담당자

[담당 업무]
· 입출고 데이터 관리 및 재고 최적화
· 협력업체와의 배송 일정 조율

[자격 요건]
· 경영/산업공학 등 관련 전공 또는 동등 경험
· 엑셀 및 데이터 분석 능력

[우대 사항]
· WMS 등 물류 시스템 활용 경험
· 수요 예측 관련 프로젝트 경험`,
    },
    posting: {
      placeholder: "",
      tags: [
        { label: "전공 적합", required: true },
        { label: "재고 데이터 관리", required: true },
        { label: "엑셀 활용", required: true },
        { label: "데이터 분석", required: true },
        { label: "프로세스 개선", required: true },
        { label: "협력업체 커뮤니케이션", required: true },
        { label: "WMS 활용", required: false },
        { label: "수요 예측", required: false },
        { label: "물류 자격증", required: false },
        { label: "무역 실무", required: false },
        { label: "SQL 활용", required: false },
        { label: "협업 경험", required: false },
      ],
      summary: {
        duty: "입출고 데이터를 관리해 재고를 최적화하고 협력업체 배송 일정을 조율하는 일이며, 판단 근거는 재고·배송 지표입니다.",
        requirement: "관련 전공 또는 동등 경험과 엑셀·데이터 분석 능력이 명시됩니다.",
        preferred: "WMS 활용 경험과 수요 예측 프로젝트 경험이며, 없어도 지원 가능한 항목입니다.",
      },
    },
    diagnosis: {
      company: "CJ대한통운",
      coverage: "6/10",
      requiredBreakdown: "5개 중 3개 입증 · 2개 확인 필요",
      preferredBreakdown: "5개 중 3개 입증",
      refScore: 58,
      evidence: [
        {
          title: "재고 데이터 관리",
          tag: "필수 요건 직접 대응",
          quote: "“물류창고 아르바이트에서 일 평균 입출고 데이터를 엑셀로 기록”",
          source: "이력서 1p",
        },
        {
          title: "데이터 분석",
          tag: "“데이터 분석” 요구와 대응",
          quote: "“재고 회전율을 계산해 발주 주기를 제안”",
          source: "이력서 1p",
        },
        {
          title: "프로세스 개선",
          tag: "우대 항목에 해당",
          quote: "“입고 검수 절차를 단순화해 처리 시간을 15% 단축”",
          source: "이력서 2p",
        },
      ],
      needsReview: [
        {
          title: "WMS 활용",
          kind: "필수",
          body: "관련 표현을 찾지 못했습니다.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
        {
          title: "협력업체 커뮤니케이션",
          kind: "필수",
          body: "내부 업무 언급만 있고 외부 협력업체 응대 경험이 없습니다.",
          action: "문장 다듬기",
          href: "/interview",
        },
        {
          title: "수요 예측",
          kind: "우대",
          body: "관련 표현을 찾지 못했습니다. 없으면 비워두고 다른 항목의 근거를 두껍게 하세요.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
      ],
    },
    competitiveness: {
      refScore: 60,
      items: [
        { title: "재고 데이터 관리", evidence: true, freq: 80, thickness: 72 },
        { title: "데이터 분석", evidence: true, freq: 74, thickness: 66 },
        { title: "프로세스 개선", evidence: true, freq: 60, thickness: 54 },
        { title: "WMS 활용", evidence: false, freq: 52, thickness: 12 },
        { title: "수요 예측", evidence: false, freq: 40, thickness: 8 },
      ],
    },
  },
  {
    id: "pharma",
    label: "제약·바이오",
    category: "의료·제약",
    jobMap: {
      totalPostings: 140,
      headerNote:
        "최근 6개월 공개 채용공고 140건에서 반복 등장한 문구를 묶은 빈도 정리입니다. 개별 기업의 실제 채용 기준·평가 항목과는 무관합니다.",
      tiers: [
        {
          key: "tier1",
          label: "01 거의 모든 공고에",
          items: [
            { title: "생명과학·화학 전공 지식", count: 118 },
            { title: "실험 설계 및 데이터 분석", count: 102 },
            { title: "문서 작성 (보고서, 논문 등)", count: 90 },
          ],
        },
        {
          key: "tier2",
          label: "02 절반 정도에",
          items: [
            { title: "영어 문헌 독해", count: 60 },
            { title: "GMP·규제 기초 이해", count: 68 },
            { title: "임상/RA 관련 지식", count: 55 },
          ],
        },
        {
          key: "tier3",
          label: "03 있으면 눈에 띔",
          items: [
            { title: "관련 자격증 (RA, 품질관리기사 등)", count: 28 },
            { title: "연구실 인턴·논문 경험", count: 24 },
            { title: "해외 학회 참여 경험", count: 12 },
          ],
        },
      ],
      orderSteps: [
        {
          title: "전공 지식·실험 설계부터",
          body: "140건 중 100건 넘게 요구하는 항목입니다. 졸업논문이나 연구실 실험에서 다룬 설계·분석 경험을 정리해두면 대부분의 공고에 대응됩니다.",
        },
        {
          title: "GMP·임상 지식으로 차별화",
          body: "절반 정도의 공고에서 요구합니다. 관련 수업이나 세미나 참여 경험으로 채울 수 있습니다.",
        },
        {
          title: "자격증·해외 학회는 여유가 있을 때",
          body: "공고의 4분의 1 정도만 요구합니다. 위 두 단계를 먼저 채운 뒤, 시간이 남으면 준비해도 늦지 않습니다.",
        },
      ],
      examplePosting: `[모집 부문] 임상연구/RA 주니어

[담당 업무]
· 임상시험 데이터 관리 및 문서 작성
· 규제 자료(RA) 검토 지원

[자격 요건]
· 생명과학/약학/화학 등 관련 전공 학사 이상
· 실험 설계 및 데이터 분석 능력

[우대 사항]
· GMP 등 규제 기초 지식
· 영어 문헌 독해 능력`,
    },
    posting: {
      placeholder: "",
      tags: [
        { label: "전공 적합", required: true },
        { label: "실험 설계", required: true },
        { label: "데이터 분석", required: true },
        { label: "문서 작성", required: true },
        { label: "생명과학 지식", required: true },
        { label: "화학 지식", required: true },
        { label: "GMP 이해", required: false },
        { label: "임상 지식", required: false },
        { label: "영어 문헌", required: false },
        { label: "관련 자격증", required: false },
        { label: "연구실 경험", required: false },
        { label: "협업 경험", required: false },
      ],
      summary: {
        duty: "임상시험 데이터를 관리하고 규제 자료를 검토 지원하는 일이며, 판단 근거는 실험·문헌 데이터입니다.",
        requirement: "관련 전공과 실험 설계·데이터 분석 능력이 명시됩니다.",
        preferred: "GMP 기초 지식과 영어 문헌 독해 능력이며, 없어도 지원 가능한 항목입니다.",
      },
    },
    diagnosis: {
      company: "유한양행",
      coverage: "5/9",
      requiredBreakdown: "5개 중 3개 입증 · 2개 확인 필요",
      preferredBreakdown: "4개 중 2개 입증",
      refScore: 53,
      evidence: [
        {
          title: "실험 설계",
          tag: "필수 요건 직접 대응",
          quote: "“졸업논문에서 대조군·실험군을 나눠 3회 반복 실험을 설계”",
          source: "이력서 1p",
        },
        {
          title: "데이터 분석",
          tag: "“데이터 분석” 요구와 대응",
          quote: "“통계 프로그램으로 실험 결과의 유의성을 검정”",
          source: "이력서 2p",
        },
        {
          title: "영어 문헌",
          tag: "우대 항목에 해당",
          quote: "“관련 해외 논문 20편을 정리해 문헌 리뷰 작성”",
          source: "이력서 2p",
        },
      ],
      needsReview: [
        {
          title: "GMP 이해",
          kind: "필수",
          body: "관련 학습 경험이 이력서에 드러나지 않습니다.",
          action: "문장 다듬기",
          href: "/interview",
        },
        {
          title: "임상 지식",
          kind: "필수",
          body: "관련 표현을 찾지 못했습니다.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
        {
          title: "관련 자격증",
          kind: "우대",
          body: "관련 표현을 찾지 못했습니다. 없으면 비워두고 다른 항목의 근거를 두껍게 하세요.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
      ],
    },
    competitiveness: {
      refScore: 55,
      items: [
        { title: "실험 설계", evidence: true, freq: 74, thickness: 66 },
        { title: "데이터 분석", evidence: true, freq: 70, thickness: 62 },
        { title: "영어 문헌", evidence: true, freq: 55, thickness: 48 },
        { title: "GMP 이해", evidence: false, freq: 45, thickness: 10 },
        { title: "임상 지식", evidence: false, freq: 38, thickness: 8 },
      ],
    },
  },
  {
    id: "public",
    label: "공공기관·행정",
    category: "공공·행정",
    jobMap: {
      totalPostings: 230,
      headerNote:
        "최근 6개월 공개 채용공고 230건에서 반복 등장한 문구를 묶은 빈도 정리입니다. 개별 기업의 실제 채용 기준·평가 항목과는 무관합니다.",
      tiers: [
        {
          key: "tier1",
          label: "01 거의 모든 공고에",
          items: [
            { title: "NCS 직업기초능력 (의사소통, 수리 등)", count: 210 },
            { title: "전공·직무 관련 지식", count: 175 },
            { title: "공문서 작성 능력", count: 130 },
          ],
        },
        {
          key: "tier2",
          label: "02 절반 정도에",
          items: [
            { title: "관련 자격증 (컴활, 한국사 등)", count: 120 },
            { title: "정책·제도 이해", count: 85 },
            { title: "지역사회·공익 이해", count: 70 },
          ],
        },
        {
          key: "tier3",
          label: "03 있으면 눈에 띔",
          items: [
            { title: "봉사·공공기관 인턴 경험", count: 55 },
            { title: "가산 자격증 (전공 관련)", count: 38 },
            { title: "어학 성적", count: 30 },
          ],
        },
      ],
      orderSteps: [
        {
          title: "NCS·공문서 작성부터",
          body: "230건 중 190건 넘게 요구하는 항목입니다. NCS 기출을 풀어보고 공문서 형식으로 글을 써본 경험을 정리해두면 대부분의 공고에 대응됩니다.",
        },
        {
          title: "자격증·정책 이해로 차별화",
          body: "절반 정도의 공고에서 요구합니다. 컴활, 한국사 등 자격증이나 관련 정책 스터디로 채울 수 있습니다.",
        },
        {
          title: "인턴·가산 자격증은 여유가 있을 때",
          body: "공고의 4분의 1 정도만 요구합니다. 위 두 단계를 먼저 채운 뒤, 시간이 남으면 준비해도 늦지 않습니다.",
        },
      ],
      examplePosting: `[모집 부문] 행정직(일반)

[담당 업무]
· 부서 행정 업무 및 공문서 작성
· 민원 응대 및 관련 자료 정리

[자격 요건]
· 학력 무관 (전공 관련 가산 있음)
· NCS 직업기초능력 (의사소통, 수리, 문제해결)

[우대 사항]
· 컴퓨터활용능력, 한국사능력검정 등 자격증
· 공공기관 인턴 또는 봉사 활동 경험`,
    },
    posting: {
      placeholder: "",
      tags: [
        { label: "NCS 직업기초능력", required: true },
        { label: "공문서 작성", required: true },
        { label: "전공 지식", required: true },
        { label: "의사소통 능력", required: true },
        { label: "수리 능력", required: true },
        { label: "문제해결 능력", required: true },
        { label: "컴활 자격증", required: false },
        { label: "한국사 자격증", required: false },
        { label: "정책 이해", required: false },
        { label: "공공기관 인턴", required: false },
        { label: "어학 성적", required: false },
        { label: "봉사 활동", required: false },
      ],
      summary: {
        duty: "부서 행정 업무를 처리하고 공문서를 작성하며 민원을 응대하는 일이며, 판단 근거는 NCS 직업기초능력입니다.",
        requirement: "학력 무관하며 NCS 직업기초능력(의사소통·수리·문제해결)이 명시됩니다.",
        preferred: "컴활·한국사 등 자격증과 공공기관 인턴·봉사 경험이며, 없어도 지원 가능한 항목입니다.",
      },
    },
    diagnosis: {
      company: "한국전력공사",
      coverage: "9/14",
      requiredBreakdown: "7개 중 5개 입증 · 2개 확인 필요",
      preferredBreakdown: "7개 중 4개 입증",
      refScore: 62,
      evidence: [
        {
          title: "NCS 직업기초능력",
          tag: "필수 요건 직접 대응",
          quote: "“NCS 모의고사를 매주 풀며 의사소통·수리 영역 오답을 정리”",
          source: "이력서 1p",
        },
        {
          title: "공문서 작성",
          tag: "“공문서 작성” 요구와 대응",
          quote: "“동아리 공문 형식의 협조 요청서를 작성해 발송”",
          source: "이력서 1p",
        },
        {
          title: "컴활 자격증",
          tag: "우대 항목에 해당",
          quote: "“컴퓨터활용능력 1급 취득”",
          source: "자격증 사본",
        },
      ],
      needsReview: [
        {
          title: "정책 이해",
          kind: "필수",
          body: "관련 표현을 찾지 못했습니다.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
        {
          title: "문제해결 능력",
          kind: "필수",
          body: "문제를 “인지”했다는 언급만 있고 해결 과정이 드러나지 않습니다.",
          action: "문장 다듬기",
          href: "/interview",
        },
        {
          title: "공공기관 인턴",
          kind: "우대",
          body: "관련 표현을 찾지 못했습니다. 없으면 비워두고 다른 항목의 근거를 두껍게 하세요.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
      ],
    },
    competitiveness: {
      refScore: 65,
      items: [
        { title: "NCS 직업기초능력", evidence: true, freq: 92, thickness: 84 },
        { title: "공문서 작성", evidence: true, freq: 78, thickness: 70 },
        { title: "컴활 자격증", evidence: true, freq: 65, thickness: 58 },
        { title: "정책 이해", evidence: false, freq: 50, thickness: 12 },
        { title: "공공기관 인턴", evidence: false, freq: 42, thickness: 9 },
      ],
    },
  },
];

export function buildCustomField(label: string): FieldPreset {
  const safeLabel = label.trim() || "직접 입력한 직무";
  return {
    id: CUSTOM_FIELD_ID,
    label: safeLabel,
    category: "직접 입력",
    jobMap: {
      totalPostings: 0,
      headerNote:
        "직접 입력한 직무는 채용공고 표본이 없어 일반적으로 요구되는 항목을 모아 정리한 예시입니다. 실제 공고 데이터를 기반으로 하지 않습니다.",
      tiers: [
        {
          key: "tier1",
          label: "01 대부분 직무에 공통",
          items: [
            { title: `${safeLabel} 관련 기초 지식`, note: "대부분 요구" },
            { title: "관련 툴·소프트웨어 활용", note: "대부분 요구" },
            { title: "과제·실습에서 끝까지 해본 경험", note: "대부분 요구" },
          ],
        },
        {
          key: "tier2",
          label: "02 있으면 도움",
          items: [
            { title: "데이터 정리·분석 능력", note: "자주 요구" },
            { title: "협업·커뮤니케이션 경험", note: "자주 요구" },
            { title: "관련 자격증·어학", note: "자주 요구" },
          ],
        },
        {
          key: "tier3",
          label: "03 있으면 눈에 띔",
          items: [
            { title: "관련 대외활동·공모전", note: "가끔 요구" },
            { title: "인턴·현장 경험", note: "가끔 요구" },
            { title: "포트폴리오·산출물", note: "가끔 요구" },
          ],
        },
      ],
      orderSteps: [
        {
          title: "기초 지식·툴 활용부터",
          body: `${safeLabel}로 검색되는 공고 대부분이 요구하는 항목입니다. 수업이나 과제에서 다룬 내용을 문장으로 정리해두면 됩니다.`,
        },
        {
          title: "데이터 분석·협업 경험으로 차별화",
          body: "있으면 도움이 되는 항목입니다. 팀 과제나 동아리 활동에서 있었던 경험을 정리하세요.",
        },
        {
          title: "대외활동·포트폴리오는 여유 있을 때",
          body: "있으면 눈에 띄는 항목입니다. 위 두 단계를 먼저 채운 뒤 준비해도 늦지 않습니다.",
        },
      ],
      examplePosting: `[모집 부문] ${safeLabel}

[담당 업무]
· ${safeLabel} 관련 핵심 업무 수행
· 유관 부서와 협업해 목표 달성

[자격 요건]
· 관련 전공 또는 동등한 경험
· 관련 툴·데이터 활용 능력

[우대 사항]
· 관련 프로젝트·포트폴리오 보유
· 관련 자격증 또는 어학 성적`,
    },
    posting: {
      placeholder: "",
      tags: [
        { label: "전공 적합", required: true },
        { label: "기초 지식", required: true },
        { label: "툴 활용", required: true },
        { label: "실무 경험", required: true },
        { label: "데이터 분석", required: false },
        { label: "협업 경험", required: false },
        { label: "자격증", required: false },
        { label: "포트폴리오", required: false },
      ],
      summary: {
        duty: `${safeLabel} 관련 핵심 업무를 수행하고 유관 부서와 협업해 목표를 달성하는 일입니다.`,
        requirement: "관련 전공 또는 동등한 경험과 관련 툴·데이터 활용 능력이 명시됩니다.",
        preferred: "관련 프로젝트·포트폴리오와 자격증·어학 성적이며, 없어도 지원 가능한 항목입니다.",
      },
    },
    diagnosis: {
      company: "관심 기업",
      coverage: "5/8",
      requiredBreakdown: "4개 중 2개 입증 · 2개 확인 필요",
      preferredBreakdown: "4개 중 2개 입증",
      refScore: 50,
      evidence: [
        {
          title: "기초 지식",
          tag: "필수 요건 직접 대응",
          quote: `“${safeLabel} 관련 과제에서 배운 내용을 실제로 적용”`,
          source: "이력서 1p",
        },
        {
          title: "툴 활용 경험",
          tag: "관련 툴 요구와 대응",
          quote: "“관련 툴을 사용해 결과물을 완성”",
          source: "이력서 2p",
        },
        {
          title: "협업 경험",
          tag: "우대 항목에 해당",
          quote: "“팀 프로젝트에서 역할을 나눠 진행”",
          source: "이력서 2p",
        },
      ],
      needsReview: [
        {
          title: "데이터 분석",
          kind: "필수",
          body: "구체적인 도구나 결과가 적혀 있지 않습니다. 사용한 도구와 결과를 한 문장 추가하세요.",
          action: "문장 다듬기",
          href: "/interview",
        },
        {
          title: "자격증·어학",
          kind: "우대",
          body: "관련 표현을 찾지 못했습니다. 없으면 비워두고 다른 항목의 근거를 두껍게 하세요.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
        {
          title: "포트폴리오",
          kind: "우대",
          body: "결과물 링크나 요약이 없습니다.",
          action: "보완 경로 보기",
          href: "/gap-report",
        },
      ],
    },
    competitiveness: {
      refScore: 50,
      items: [
        { title: "기초 지식", evidence: true, freq: 70, thickness: 60 },
        { title: "툴 활용", evidence: true, freq: 65, thickness: 55 },
        { title: "데이터 분석", evidence: false, freq: 50, thickness: 15 },
        { title: "협업 경험", evidence: true, freq: 45, thickness: 40 },
      ],
    },
  };
}
