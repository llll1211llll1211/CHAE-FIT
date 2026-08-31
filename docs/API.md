# 채피티 API 명세서

| 항목 | 내용 |
|---|---|
| 버전 | v1 (MVP) |
| 기준 문서 | `docs/PRD_SCREEN_통합.md` v0.3 |
| Base URL | `https://chafit.vercel.app` / 로컬 `http://localhost:3000` |
| 형식 | 요청·응답 모두 JSON (이력서 업로드만 `multipart/form-data`) |

> **이 문서는 사본이고, 정본은 코드다.**
> 스키마 실체는 `web/src/lib/api/contract.js`에 있으며, 그 객체가 **Claude structured output 스키마와 API 응답 형태로 동시에 쓰인다.** 둘이 같은 객체이므로 명세와 실물이 어긋날 수 없다. 이 문서와 코드가 다르면 코드가 맞다.

---

## 실행 모드 — 키 없이도 동작한다

`ANTHROPIC_API_KEY`가 **없으면 자동으로 목업 응답**을 반환한다 (`contract.js`의 `USE_MOCK`).

- 팀원은 키 없이 클론해도 화면 작업을 바로 시작할 수 있다.
- 목업은 실제 LLM 응답과 **같은 스키마**를 반환하므로, 키를 넣는 순간 프론트 코드는 한 줄도 바뀌지 않는다.
- 목업도 실패 경로를 흉내낸다 — URL 입력은 `URL_FETCH_FAILED`, 본문에 "전산직/성실/무관"이 포함되면 요구 역량이 빈 공고를 반환한다.

---

## 공통 에러 형식

모든 라우트는 실패 시 아래 형태로만 응답한다.

```json
{
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "파일 크기는 5MB 이하만 업로드할 수 있어요."
  }
}
```

- **`message`는 사용자에게 그대로 노출**되는 한국어 문구다 (ErrorBanner, PRD §9.1). 프론트가 따로 문구를 만들지 않는다.
- **`code`는 분기용**이며 화면에 표시하지 않는다.

| code | HTTP | 발생 시점 |
|---|---|---|
| `NO_FILE` | 400 | 이력서 파일 누락 |
| `UNSUPPORTED_FILE_TYPE` | 400 | PDF·txt 외 확장자 |
| `FILE_TOO_LARGE` | 400 | 5MB 초과 |
| `EXTRACTION_FAILED` | 422 | PDF에서 텍스트를 못 읽음 (스캔본 등) |
| `EMPTY_INPUT` | 400 | 공고 본문·URL 둘 다 없음 |
| `AMBIGUOUS_INPUT` | 400 | 공고 본문·URL 둘 다 있음 |
| `URL_FETCH_FAILED` | 422 | URL에서 본문 확보 실패 → 붙여넣기 유도 |
| `MISSING_ANALYSIS` | 400 | 진단 요청에 이력서 분석 결과 없음 |
| `MISSING_POSTING` | 400 | 진단 요청에 공고 정보 없음 |
| `LLM_FAILED` | 502 | Claude 호출 실패 |
| `INTERNAL` | 500 | 그 외 |

---

## 1. `POST /api/resume/analyze`

이력서를 업로드해 경력·역량을 구조화한다. (PRD F1 · F2)

**요청** — `multipart/form-data`

| 필드 | 타입 | 제약 |
|---|---|---|
| `resume` | File | PDF 또는 `.txt`, 5MB 이하 |

**응답 200**

```json
{
  "analysis": {
    "summary": "컴퓨터공학 전공 졸업예정자로, 캡스톤 프로젝트에서 백엔드 서버 개발을 담당했습니다.",
    "totalYears": 0,
    "skills": ["Java", "Spring Boot", "MySQL", "Python", "pandas", "Git", "SQL"],
    "experiences": [
      {
        "title": "졸업작품 캡스톤 프로젝트 (백엔드 담당)",
        "description": "4인 팀에서 웹 서비스의 서버를 맡아 회원·게시글 기능의 API를 설계하고 구현했습니다.",
        "skills": ["Java", "스프링부트", "MySQL"]
      }
    ]
  },
  "unknownSkills": []
}
```

| 필드 | 설명 |
|---|---|
| `analysis.skills` | **스킬 사전으로 정규화된 정규형.** 화면 ②의 역량 칩이 이걸 그린다. (`스프링부트` → `Spring Boot`) |
| `analysis.experiences` | 화면 ②에 목록으로 노출한다. **⑤의 근거 문장이 이 `title`을 인용**하므로, 사용자가 먼저 확인해야 진단서를 신뢰한다 (PRD §9.1 ②) |
| `unknownSkills` | 사전에 없어 버려진 토큰. **화면에 쓰지 않는다.** 사전 확충 대상 파악용 (PRD §11) |

> `experiences[].skills`는 원문 표기 그대로다. 정규화된 것은 최상위 `skills`뿐이다.

---

## 2. `POST /api/posting/parse`

채용공고에서 요구사항을 추출하고 요약한다. (PRD F3 · F5)

**요청** — `application/json`. `text`와 `url` 중 **정확히 하나**.

```json
{ "text": "Java 백엔드 개발자를 모집합니다. RESTful API 설계 경험 필수..." }
```

```json
{ "url": "https://example.com/job/12345" }
```

> **기본 입력은 `text`다.** URL은 보조 수단이며, 채용 플랫폼 대부분이 스크래핑을 약관으로 제한하거나 JS 렌더링을 요구해 실패할 수 있다. 실패는 정상 경로로 취급하고 붙여넣기를 유도한다 (PRD §12).

**응답 200**

```json
{
  "posting": {
    "company": "㈜누리테크",
    "title": "Java/Spring Boot 백엔드 개발자 (신입 가능)",
    "summary": [
      "Java와 Spring Boot 기반 백엔드 서비스 개발을 담당합니다.",
      "RESTful API 설계와 MySQL 쿼리 작성이 주요 업무입니다.",
      "Docker, AWS 환경 경험이 있으면 우대합니다."
    ],
    "requirements": ["Java 및 Spring Boot 기반 웹 서비스 개발 경험", "..."],
    "preferred": ["Docker 컨테이너 환경 경험", "..."],
    "skills": ["Java", "Spring Boot", "REST API", "MySQL", "Git", "Docker", "AWS"],
    "source": "text"
  },
  "unknownSkills": []
}
```

| 필드 | 설명 |
|---|---|
| `posting.summary` | F5의 3줄 요약. 화면 ④ |
| `posting.requirements` / `preferred` | **공고 원문 문장 그대로.** ⑤의 근거 문장이 이걸 인용하므로 가공하지 않는다 |
| `posting.skills` | 정규화된 요구 역량 **R**. **빈 배열일 수 있다** — 자격요건이 "성실한 분" 수준인 공고 |
| `posting.source` | `"text"` 또는 `"url"` |

---

## 3. `POST /api/fit/diagnose`

이력서와 공고를 대조해 적합도 진단서를 만든다. **핵심 기능** (PRD F4)

**요청** — `application/json`. 앞선 두 응답을 그대로 넣는다.

```json
{
  "analysis": { "...": "/api/resume/analyze의 analysis" },
  "posting":  { "...": "/api/posting/parse의 posting" }
}
```

> **이력서는 세션당 1회만 분석한다.** 공고를 바꿔가며 진단할 때 `analysis`를 클라이언트가 보관했다가 재전송한다. 재분석하지 않는다 (PRD §8.5).

**응답 200**

```json
{
  "report": {
    "fitScore": 0.571,
    "matchedCount": 4,
    "requiredCount": 7,
    "matchedSkills": ["Java", "Spring Boot", "MySQL", "Git"],
    "missingSkills": ["AWS", "Docker", "REST API"],
    "hasSkillInfo": true,
    "reasons": [
      {
        "experience": "졸업작품 캡스톤 프로젝트 (백엔드 담당)",
        "requirement": "Java 및 Spring Boot 기반 웹 서비스 개발 경험",
        "text": "Java와 Spring Boot로 팀 서버를 구현한 경험이 요구 기술 스택과 직접 일치합니다."
      }
    ]
  }
}
```

| 필드 | 설명 |
|---|---|
| `fitScore` | 0~1. **`hasSkillInfo`가 false면 `null`** |
| `matchedCount` / `requiredCount` | 화면에 *"요구 역량 7개 중 4개 충족"* 으로 병기한다. **점수의 의미를 고정해 합격률로 오독되는 것을 막는다** (PRD §12) |
| `missingSkills` | **"필요 역량"** 으로 표시한다. 레이블도 색도 중립. **경고색 금지** |
| `hasSkillInfo` | `false`면 **점수와 역량 영역을 통째로 숨기고** 안내 문구를 띄운다. "정보 없음"이 "적합도 0%"로 오독되면 안 된다 (PRD §9.1 ⑤) |
| `reasons` | 근거 문장. **빈 배열일 수 있다** — 생성 실패해도 점수는 확정이므로 200으로 응답한다 |

### 점수는 LLM이 만들지 않는다

`fitScore` · `matchedSkills` · `missingSkills`는 **전부 집합 연산**으로 확정된다. LLM은 이미 확정된 매칭을 설명하는 `reasons`만 쓴다 (PRD §8.4).

```
matchedSkills = R ∩ U
missingSkills = R − U
fitScore      = 충족 수 ÷ 요구 수 × 가중치
```

가중치: 요구 역량이 3개 이상이면 1.0, 2개면 0.8, 1개면 0.6. 요구사항 1개짜리 공고가 100%로 뜨는 것은 잘 맞는 게 아니라 정보가 없는 것이기 때문이다.

**같은 입력이면 항상 같은 점수가 나온다** (PRD §7 결정성). 근거 문장만 매번 달라질 수 있다.

---

## 4. `POST /api/career/outlook`

이 회사·직무의 **경력직 공고**를 코퍼스에서 찾아, 신입 입사 후 단계적으로 필요해지는
역량과 관련 국비지원 강의를 안내한다. (신규 — 경력공고 비교)

**요청** — `application/json`. `/api/fit/diagnose`와 **같은 두 값**을 그대로 재사용한다.

```json
{
  "analysis": { "...": "/api/resume/analyze의 analysis" },
  "posting":  { "...": "/api/posting/parse의 posting" }
}
```

**응답 200 — 매칭 실패** (코퍼스에 이 회사·직무 페어가 없음)

```json
{ "matched": false }
```

> 매칭 실패는 에러가 아니라 **조용한 침묵**이다. 화면은 이 섹션을 통째로 숨긴다 —
> 아무 페어나 억지로 보여주지 않는다 (FitReport의 `hasSkillInfo` 원칙과 동일).

**응답 200 — 매칭 성공**

```json
{
  "matched": true,
  "company": "삼성전자 DS부문",
  "careerTitle": "반도체 공정기술 (메모리사업부) (경력)",
  "experienceYears": "4~9년",
  "sourceUrl": "https://www.samsung-dsrecruit.com/...",
  "collectedAt": "2026-08-26",
  "verification": "C",
  "futureSkills": [
    {
      "tagId": "SK.QM.SIXSIGMA",
      "label": "6시그마·DMAIC",
      "category": "품질·방법론",
      "reason": "경력직 공고에서는 6시그마·DMAIC 관련 과제를 직접 리딩하는 역할을 맡게 돼요.",
      "courses": [
        {
          "id": "hrd-108",
          "title": "ERP정보관리(물류,생산,회계,인사)+전산회계1급&전산세무2급_A",
          "provider": "(주)KD아카데미",
          "region": "서울 노원구",
          "fee": 4501600,
          "selfPay": 300000,
          "subsidyRate": 0.93,
          "isNationalFunded": true
        }
      ]
    }
  ]
}
```

| 필드 | 설명 |
|---|---|
| `verification` | 코퍼스 항목의 신뢰도 배지(`A`/`B`/`C`). 경력 페어는 전부 `C`(표준 템플릿 추정) — 실제 크롤링이 아니라 직무 관행 지식으로 구성했다는 뜻. 화면에 반드시 노출한다 |
| `futureSkills` | **점수가 아니다.** "경력 공고가 신입 공고 대비 추가로 요구하는 역량 중 사용자가 아직 갖추지 못한 것"만 집합 연산으로 뽑는다. 화면은 "부족하다"가 아니라 "다음 단계에 필요해진다"로만 표현한다 |
| `futureSkills[].courses` | 국비지원(내일배움카드) 강의 매칭. **빈 배열일 수 있다** — 이 경우 "강의 준비 중" 안내만 표시하고, 없는 강의를 지어내지 않는다 |

### 이것도 점수는 LLM이 만들지 않는다

```
future = career.competency_tags − entry.competency_tags − user.tags
```

회사·직무 매칭(코퍼스 조회)과 위 태그 차집합은 전부 규칙 기반이다(`jobs/corpusMatch.js`,
`jobs/tags.js`). LLM은 이미 확정된 태그 각각에 1줄 설명(`reason`)만 붙인다 — 생성에
실패해도 태그 목록·강의 추천은 이미 확정된 값이라 그대로 응답한다.

강의 추천은 HRD-Net(직업훈련포털) 훈련과정목록을 태그 사전으로 자동 스캔해 만든
`web/src/lib/courses/fixtures/courses.json`을 그대로 조회한다(`courses/match.js`).

---

## 화면 상태와의 대응

| 화면 상태 | 호출 |
|---|---|
| `analyzing` | `POST /api/resume/analyze` |
| `parsing` | `POST /api/posting/parse` |
| `diagnosing` | `POST /api/fit/diagnose` |
| ⑤ 진단서 확정 후 (성장 로드맵 섹션, 비동기·낙관적) | `POST /api/career/outlook` |

`parse`와 `diagnose`를 분리한 이유: 공고 요약(④)은 진단 없이도 유용하고, 진단이 실패해도 요약만이라도 보여줄 수 있다.

---

## 로컬에서 찔러보기

```bash
cd web && npm run dev    # 키 없으면 목업으로 동작

# 1) 이력서
printf '캡스톤에서 Java와 스프링부트로 서버를 개발했습니다.' > resume.txt
curl -X POST -F "resume=@resume.txt" localhost:3000/api/resume/analyze

# 2) 공고
curl -X POST -H 'Content-Type: application/json' \
  -d '{"text":"Java 백엔드 개발자 모집. RESTful API 설계 경험 필수."}' \
  localhost:3000/api/posting/parse

# 3) 진단 — 위 두 응답의 analysis와 posting을 합쳐서 전송
curl -X POST -H 'Content-Type: application/json' -d @diagnose.json \
  localhost:3000/api/fit/diagnose
```

---

## 구현 상태

| 라우트 | 목업 | 실제 |
|---|:-:|---|
| `/api/resume/analyze` | ✅ | ✅ PDF·txt 텍스트 추출(`unpdf`) + Claude 호출 |
| `/api/posting/parse` | ✅ | ✅ URL 본문 추출 + Claude 호출 |
| `/api/fit/diagnose` | ✅ | ✅ 근거 문장 Claude 호출 (점수는 처음부터 실제 구현) |
| `/api/career/outlook` | ✅ | ✅ 코퍼스 조회 + 태그 차집합은 처음부터 실제 구현, 근거 문장만 Claude 호출 |

**적합도 계산은 목업이 아니라 실제 구현**이므로, 키가 없어도 점수·충족/필요 역량은 진짜 값이 나온다.

Claude 호출은 `web/src/lib/api/claude.js` 한 곳에 모여 있다. 세 호출 모두
`output_config.format`으로 `contract.js`의 스키마를 강제하며, 모델은 `claude-opus-5`다.
근거 문장 호출은 시스템 프롬프트 + 이력서 분석 결과 뒤에 캐시 지점을 둔다(PRD §8.5).

| 호출 | effort | 이유 |
|---|---|---|
| 이력서 분석 | `high` | 세션당 1회. 이후 모든 진단의 입력이라 품질을 우선 |
| 공고 파싱 | `medium` | 원문 추출이 주된 일이고 공고마다 반복 호출된다 |
| 근거 문장 | `medium` | 진단 1건 10초 내외 목표(§7) |

### 아직 반영되지 않은 것

PRD §8.7의 코퍼스 스키마 확장(`must`/`preferred` 가중치 분리, 학력·전공 하드 필터,
경험 깊이 계수, `verification` 배지)은 미적용이다. 위 계약은 확장 전 형태다.
