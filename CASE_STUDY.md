<div align="center">

# CHAE-FIT 구현 케이스 스터디

**이력서 × 채용공고 적합도 진단 서비스를 만든 순서 그대로**

<br>

[![결과물 보기](https://img.shields.io/badge/%EA%B2%B0%EA%B3%BC%EB%AC%BC%20%EB%B3%B4%EA%B8%B0-chae-fit.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://chae-fit.vercel.app)
[![README로](https://img.shields.io/badge/README%EB%A1%9C-%EB%8F%8C%EC%95%84%EA%B0%80%EA%B8%B0-4F46E5?style=for-the-badge)](./README.md)
[![소스 코드](https://img.shields.io/badge/%EC%86%8C%EC%8A%A4%20%EC%BD%94%EB%93%9C-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/llll1211llll1211/CHAE-FIT)

[![PRD](https://img.shields.io/badge/PRD-v0.3-1F2937?style=flat-square)](./docs/PRD_SCREEN_통합.md)
[![API 명세](https://img.shields.io/badge/API%20%EB%AA%85%EC%84%B8-v1-1F2937?style=flat-square)](./docs/API.md)

</div>

---

## 이 문서의 목적

무엇을 만들었는지가 아니라 **어떤 순서로, 각 단계에서 무엇을 결정했는지**를 남긴다. 순서 자체가 설계였기 때문이다.

전체는 5개 커밋 · 9단계로 진행됐다.

| Step | 한 일 | 커밋 |
|:-:|---|---|
| [0](#step-0--문서가-서로-다른-서비스를-정의하고-있었다) | 기획서 ↔ PRD 충돌 해소, PRD 전면 개정 | `28d7bda` |
| [1](#step-1--코드를-쓰기-전에-계약부터-고정한다) | `contract.js` — 스키마·에러 한곳에 고정 | `b66b7fb` |
| [2](#step-2--llm-없이-먼저-끝까지-동작시킨다) | 목업 라우트 3종, 키 없이 E2E 완주 | `b66b7fb` |
| [3](#step-3--스킬-사전--집합-연산이-성립할-조건-만들기) | 스킬 사전 + 정규화 (긴 별칭 우선 · 마스킹) | `b66b7fb` |
| [4](#step-4--점수를-llm에서-빼앗아온다) | `computeFit` · `scoreOf` — 결정적 스코어링 | `b66b7fb` |
| [5](#step-5--입력-계층--실패를-정상-경로로-취급한다) | PDF 텍스트 추출, URL 폴백 | `89e98b9` |
| [6](#step-6--claude-실제-연동--세-호출을-한-파일에-모은다) | `claude.js` — structured outputs · effort · 캐싱 | `89e98b9` |
| [7](#step-7--화면-다섯-섹션과-상태-기계-하나) | `page.jsx` 상태 기계 + 컴포넌트 7종 | `89e98b9` |
| [8](#step-8--오독을-막는-것이-마지막-기능이다) | 점수 오독 방지 3종 장치 | `89e98b9` |
| [9](#step-9--스모크-테스트와-배포) | `npm run smoke`, Vercel 배포 | `3f2c2cf` |

---

## Step 0 — 문서가 서로 다른 서비스를 정의하고 있었다

코드를 한 줄도 안 쓴 상태에서 먼저 걸린 문제.

- `docs/PRD_v0.2`는 **"직무를 모르는 사용자에게 직무를 추천한다"** 는 서비스였다.
- `docs/기획서.md`가 정의한 타겟은 정반대였다 — **"산업·직무는 이미 정했으나 자기 경험이 그 분야 요구 역량과 맞는지 확신이 없는 사용자."** 핵심 기능도 직무 추천이 아니라 **기업별 적합도 진단서**.

v0.2는 "지원 직무가 이미 확정된 사용자"를 **명시적 제외 대상**으로 두고 있었다. 기획서에서는 **바로 그 사용자가 핵심 타겟**이다. 두 문서가 서로 반대를 가리키고 있었다.

**결정** — 기획서를 정본으로 삼고 PRD를 전면 개정(v0.3)했다.

| 폐기 | 계승 |
|---|---|
| 직무 추천 기능 | 스킬 사전 |
| 직종코드 사전 | 갭 산출 |
| | 결정적 스코어링 원칙 |

> v0.2 원본은 `docs/PRD_v0.2_직무추천방향.md.bak`에 보존했다. 되돌릴 일이 생겼을 때 근거가 남아 있어야 하기 때문이다.

**여기서 배운 것** — 가치 제안이 *"직무를 찾아준다"* 에서 *"정한 직무에 대한 적합도를 판정해 준다"* 로 이동하면, 화면도 API도 데이터도 전부 다른 것이 된다. 이 충돌을 코드를 쓴 뒤에 발견했다면 대부분을 버려야 했다.

---

## Step 1 — 코드를 쓰기 전에 계약부터 고정한다

`web/src/lib/api/contract.js` 하나를 먼저 썼다. 여기 정의된 스키마 객체는 **두 곳에서 동시에** 쓰인다.

1. **Claude structured output 스키마** — LLM 응답 형태를 강제
2. **API 응답 형태** — 프론트가 소비

```js
export const RESUME_ANALYSIS_SCHEMA = {
  type: 'object',
  properties: {
    summary:    { type: 'string', description: '경력을 2~3문장으로 요약' },
    totalYears: { type: 'number', description: '총 경력 연차. 신입이면 0' },
    skills:     { type: 'array', items: { type: 'string' },
                  description: '이력서에 드러난 기술·역량. 원문 표기 그대로' },
    experiences: { /* 근거 문장의 원재료 */ },
  },
  required: ['summary', 'totalYears', 'skills', 'experiences'],
  additionalProperties: false,
};
```

**하나의 객체를 공유하므로 명세서와 실물이 어긋날 수 없다.** `docs/API.md`는 사본이고, 코드가 정본이다. 문서와 코드가 다르면 코드가 맞다.

에러도 같은 파일에 몰아넣었다.

```js
export const ERRORS = {
  FILE_TOO_LARGE:   { status: 400, message: '파일 크기는 5MB 이하만 업로드할 수 있어요.' },
  URL_FETCH_FAILED: { status: 422, message: '이 주소에서 공고를 가져오지 못했어요. 본문을 직접 붙여넣어 주세요.' },
  // ...
};

export function fail(code, detail) { /* 모든 라우트가 이 형태로만 실패한다 */ }
```

**규칙 두 개를 여기서 못 박았다.**
- `message`는 **사용자에게 그대로 노출되는 한국어 문구**다. 프론트가 따로 문구를 만들지 않는다.
- `code`는 **분기용**이며 절대 화면에 표시하지 않는다.

에러 문구를 서버가 소유하면, 새 실패 케이스가 생겨도 프론트를 고칠 일이 없다.

---

## Step 2 — LLM 없이 먼저 끝까지 동작시킨다

라우트 3종을 목업으로만 구현해 **키 없이 업로드 → 진단서까지 완주**시켰다.

```js
export const USE_MOCK = !process.env.ANTHROPIC_API_KEY;
```

키가 없으면 자동으로 목업 응답을 낸다. 노린 것은 세 가지다.

| 목적 | 효과 |
|---|---|
| **팀 병렬화** | 키 없이 클론해도 화면 작업을 바로 시작할 수 있다 |
| **교체 비용 0** | 목업이 실제와 **같은 스키마**라 키를 넣는 순간 프론트 코드는 한 줄도 안 바뀐다 |
| **데모 안정성** | 무대에서 API가 죽어도 흐름은 끝까지 돈다 |

**목업이 성공 경로만 흉내내면 의미가 없다.** 실패 경로도 재현하도록 만들었다.

- URL 입력 → `URL_FETCH_FAILED`
- 본문에 `전산직/성실/무관`이 포함 → **요구 역량이 빈 공고**를 반환

두 번째가 특히 중요했다. Step 8의 "정보 없음" 화면을 실제 데이터로 확인할 수 있는 유일한 방법이었다.

---

## Step 3 — 스킬 사전 · 집합 연산이 성립할 조건 만들기

적합도를 `R ∩ U`로 계산하려면 **양쪽이 같은 언어를 써야 한다.** 공고는 `파이썬`, 이력서는 `Python3`이라고 쓴다. 그냥 비교하면 교집합이 빈다.

`web/src/lib/skills/skill-dictionary.json`이 표기 흔들림을 정규형에 매핑한다 (정규형 64개).

```
파이썬 · python · Python3   →  Python
스프링부트 · springboot     →  Spring Boot
```

**이력서 쪽 U와 공고 쪽 R이 반드시 같은 사전을 통과해야 한다.** 한쪽만 정규화하면 집합 연산 자체가 성립하지 않는다.

### 여기서 실제로 터진 버그

단순 부분 문자열 매칭을 하면 **`JavaScript` 공고가 `Java`로 잡힌다.** `MySQL`은 `SQL`로도 걸린다.

해결은 두 단계였다.

```js
// 1. 긴 별칭이 먼저 오도록 정렬 — "javascript"가 "java"보다 먼저 매칭돼야 한다
const ALIAS_ENTRIES = CANONICAL_SKILLS
  .flatMap((canonical) => [canonical, ...DICT[canonical]].map(/* ... */))
  .sort((a, b) => b.alias.length - a.alias.length);

// 2. 매칭된 구간을 마스킹 — 짧은 별칭이 같은 자리를 다시 먹지 못하게
const consumed = buf.slice(at, at + alias.length).includes(MASK);
if (!consumed) {
  found.add(canonical);
  for (let i = at; i < at + alias.length; i++) buf[i] = MASK;
}
```

`"Java, JavaScript"` → 둘 다 잡힌다. `"MySQL"` → MySQL만 잡힌다.

**사전에 없는 단어는 스킬로 인정하지 않는다.** 대신 버려진 토큰을 `unknownSkills`로 응답에 실어 보낸다 — 화면에는 쓰지 않고, **사전 확충 대상을 파악하는 용도**다.

---

## Step 4 — 점수를 LLM에서 빼앗아온다

이 프로젝트의 중심 결정.

```js
export function computeFit(userSkills, requiredSkills) {
  const U = new Set(userSkills);
  const R = requiredSkills ?? [];

  const matchedSkills = R.filter((s) => U.has(s));
  const missingSkills = R.filter((s) => !U.has(s));

  return {
    matchedSkills, missingSkills,
    matchedCount: matchedSkills.length,
    requiredCount: R.length,
    fitScore: scoreOf(matchedSkills.length, R.length),
    hasSkillInfo: R.length > 0,
  };
}
```

**LLM은 여기 관여하지 않는다.** 이유는 세 가지다.

1. **환각 차단** — 근거 없는 *"당신은 70% 적합합니다"* 가 나올 여지 자체를 없앤다.
2. **결정성** — 같은 이력서 · 같은 공고면 점수가 항상 같다. 시연 중에 숫자가 흔들리지 않는다.
3. **비용** — 점수 산출에 토큰을 쓰지 않는다.

### 가중치 — 요구사항이 빈약한 공고를 벌한다

```js
export function scoreOf(matchedCount, requiredCount) {
  if (requiredCount === 0) return null;
  const base = matchedCount / requiredCount;
  const penalty = requiredCount >= 3 ? 1 : 0.6 + 0.2 * (requiredCount - 1); // 1→0.6, 2→0.8
  return Math.round(base * penalty * 1000) / 1000;
}
```

요구 역량이 1개인 공고에서 그 1개를 충족하면 순진하게는 100%다. 그런데 **그건 잘 맞는 게 아니라 정보가 없는 것이다.** 가중치로 눌러서 "정보가 적은 공고의 높은 점수"를 신뢰하지 않게 만들었다.

`requiredCount === 0`이면 점수는 `null`이고 `hasSkillInfo`가 `false`가 된다. → Step 8로 이어진다.

---

## Step 5 — 입력 계층 · 실패를 정상 경로로 취급한다

### 이력서 (`lib/resume/extract-text.js`)

```js
const MIN_USEFUL_LENGTH = 50;          // 이보다 짧으면 이력서로 볼 수 없다
const INVISIBLE = /\p{Cf}/gu;          // ZWSP·ZWNJ·ZWJ·BOM
const HORIZONTAL_SPACE = /[^\S\n]+/g;  // 줄바꿈만 남기고 공백류 통합 (nbsp 포함)
```

- **스캔본 PDF**는 텍스트 레이어가 없어 추출 결과가 거의 빈다. `MIN_USEFUL_LENGTH`로 걸러 `EXTRACTION_FAILED` → *"텍스트가 포함된 PDF인지 확인해주세요."*
- **보이지 않는 서식 제어 문자**가 PDF 추출물에 섞여 들어와 스킬 토큰을 깨뜨린다. `Py<ZWSP>thon`은 사전에 안 걸린다. 그래서 정규화가 Step 3보다 앞에 있어야 한다.
- `unpdf`는 **동적 import**한다. 무겁고, txt 업로드 경로에서는 필요 없다.

### 공고 URL (`lib/posting/fetch-url.js`)

채용 플랫폼 대부분이 스크래핑을 약관으로 제한하거나 JS 렌더링을 요구한다. **URL 입력은 자주 실패한다.**

이걸 버그가 아니라 **정상 경로**로 설계했다.

- 기본 탭은 **본문 붙여넣기**, URL은 보조 수단
- 실패 시 `URL_FETCH_FAILED` → *"본문을 직접 붙여넣어 주세요"* 로 즉시 폴백
- **데모는 붙여넣기로 시연** — 무대에서 남의 네트워크에 의존하지 않는다

---

## Step 6 — Claude 실제 연동 · 세 호출을 한 파일에 모은다

`web/src/lib/api/claude.js` 한 곳에 모았다. 라우트는 여기 있는 세 함수만 부른다. 세 호출이 지켜야 하는 규칙이 사실상 하나이기 때문이다 — **LLM은 주어진 원문 안에서만 쓰고, 새로운 사실을 만들지 않는다.**

```js
const MODEL = 'claude-opus-5';

async function structured({ system, user, schema, effort }) {
  const res = await getClient().messages.create({
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    output_config: {
      effort,
      format: { type: 'json_schema', schema },   // ← contract.js의 스키마 그대로
    },
    system,
    messages: [{ role: 'user', content: user }],
  });

  if (res.stop_reason === 'refusal') { /* ... */ }
  return JSON.parse(text);   // 스키마를 강제했으므로 정상 경로에선 항상 유효한 JSON
}
```

### effort를 호출마다 다르게 줬다

| 호출 | effort | 이유 |
|---|:-:|---|
| 이력서 분석 | `high` | **세션당 1회**. 이후 모든 진단의 입력이라 품질 우선 |
| 공고 파싱 | `medium` | 원문 추출이 주된 일이고 공고마다 반복 호출 |
| 근거 문장 | `medium` | 진단 1건 **10초 내외** 목표를 지키려면 여기서 아껴야 한다 |

### 프롬프트 설계 — 원문을 옮기게 하고, 쓰게 하지 않는다

공고 파서 프롬프트의 핵심 규칙:

> - `requirements`와 `preferred`는 **공고 원문 문장을 그대로 옮긴다.** 요약·의역·병합 금지. 이후 근거 문장이 이 문장을 인용하기 때문이다.
> - *"성실한 분"*, *"책임감"* 같은 인성 표현은 역량이 아니므로 넣지 않는다.
> - **뽑을 것이 없으면 빈 배열로 둔다. 억지로 채우면 적합도 점수가 오염된다.**
> - `company`를 확정할 수 없으면 빈 문자열. 추측하지 않는다.

마지막 두 줄이 Step 4의 결정성을 지킨다. LLM이 요구 역량을 지어내면 분모가 오염되고 점수가 무의미해진다.

### 근거 문장 — LLM의 권한을 최소로 줄인다

```js
const REASONS_SYSTEM = `당신은 이미 확정된 적합도 매칭 결과를 **설명하는** 역할만 한다.

절대 규칙:
- 점수를 매기지 않는다. 충족·부족 판정을 바꾸지 않는다. 이미 코드가 확정했다.
- experience 필드에는 주어진 이력서 경험의 title을 **글자 그대로** 복사한다.
- requirement 필드에는 주어진 공고 요구사항 문장을 **글자 그대로** 복사한다.
- 대응 관계가 분명한 것만 쓴다. 억지로 연결하지 말고, 없으면 빈 배열로 둔다.
- 경험의 증빙 강도를 문장에 반영한다. 인턴·연구실 경험과 수업 과제는 같은 무게가 아니다.`;
```

`experience`와 `requirement`가 **글자 그대로 복사**이므로, 환각이 발생하면 사용자가 화면 ②·④와 대조해 바로 잡아낼 수 있다. LLM이 자유롭게 쓰는 것은 `text` 한 문장뿐이다.

### 캐시 지점을 어디에 둘지

이력서 분석 결과는 **공고를 바꿔도 매 진단 요청에 그대로 반복**된다. 그래서 프리픽스를 안정화했다.

```js
const system = [
  { type: 'text', text: REASONS_SYSTEM },
  { type: 'text',
    text: `<이력서_경험>…</이력서_경험>`,
    cache_control: { type: 'ephemeral' } },   // ← 여기까지가 공고와 무관한 고정 구간
];

const user = [ /* 공고 요구사항 · 확정된 충족 역량 — 매번 바뀌는 것만 */ ];
```

공고 N건을 연속 진단할 때 비용과 지연이 함께 줄어든다.

---

## Step 7 — 화면: 다섯 섹션과 상태 기계 하나

로그인도 라우팅도 없다. `page.jsx` 한 파일의 상태 하나로 ①~⑤가 순차적으로 열린다.

```
idle → analyzing → analyzed → parsing → parsed → diagnosing → diagnosed
                       ↑                                          │
                       └──────────── 다른 공고 재입력 ─────────────┘
```

| 컴포넌트 | 노출 조건 |
|---|---|
| `UploadSection` | idle, analyzing |
| `AnalysisSummary` | analyzed 이후 **계속** |
| `PostingInput` | analyzed 이후 **계속** |
| `PostingSummary` | parsed 이후 |
| `FitReport` | diagnosed |
| `LoadingIndicator` | analyzing / parsing / diagnosing |
| `ErrorBanner` | errorMessage 존재 시 |

### 결정 1 — 이력서 분석 결과는 클라이언트가 보관한다

```js
const [analysis, setAnalysis] = useState(null);
```

공고를 바꿔 진단할 때 **재분석하지 않고 이 값을 재전송한다.**

> 공고 N건 진단 = 이력서 분석 1회 + 공고 분석 N회

`analysis`가 화면 상태에만 있으므로 서버는 상태를 갖지 않는다. 이력서를 저장하지 않는다는 개인정보 원칙과도 맞아떨어진다.

### 결정 2 — parse와 diagnose를 순차로 부르되 실패를 분리한다

```js
setStatus('parsing');
parsed = await postJson('/api/posting/parse', input);   // ④ 확보
setStatus('diagnosing');
report = await postJson('/api/fit/diagnose', { ... });  // ⑤
```

**진단이 실패해도 요약(④)은 남긴다.** 라우트를 처음부터 두 개로 나눈 이유가 여기서 값을 한다.

같은 원칙이 서버에도 있다.

```js
try {
  reasons = await explainFit({ analysis, posting, fit });
} catch (err) {
  // 근거 문장 생성 실패는 치명적이지 않다.
  // 점수와 역량 목록은 이미 확정됐으므로 그것만이라도 보여준다.
  console.error('[fit/diagnose] 근거 문장 생성 실패', err);
}
return Response.json({ report: { ...fit, reasons } });   // 200
```

LLM이 죽어도 **진단서는 200으로 나간다.** Step 4에서 점수를 코드로 옮겨둔 덕분에 가능한 폴백이다.

### 결정 3 — 화면 ②가 왜 계속 떠 있는가

②(경험 항목 목록)를 접지 않고 계속 노출한다. ⑤의 근거 문장이 **②의 `title`을 그대로 인용**하기 때문이다. 사용자가 *"AI가 내 이력서를 이렇게 읽었구나"* 를 먼저 확인해야 진단서를 신뢰한다.

③(공고 입력)도 진단 후에 닫지 않는다. 여러 공고를 비교하는 것이 페르소나 B의 핵심 동선이다.

---

## Step 8 — 오독을 막는 것이 마지막 기능이다

기능이 다 돌아간 뒤에도 남은 문제가 있었다. **점수는 잘못 읽히면 사용자에게 해를 끼친다.**

| 위험 | 무슨 일이 벌어지나 | 장치 |
|---|---|---|
| 점수를 **합격률**로 읽는다 | 잘못된 지원/포기 결정 | 점수 옆에 *"요구 역량 7개 중 4개 충족"* 상시 병기 · 하단 1줄 고지 · 홍보 문구에서도 "합격률" 표현 금지 |
| 부족 역량이 **자격 미달 통보**로 읽힌다 | 지원 의욕이 꺾인다 | 레이블을 "부족"이 아니라 **"필요 역량"** · 칩은 외곽선만 · **경고색(빨강) 금지** |
| **정보 없음**이 "적합도 0%"로 읽힌다 | 멀쩡한 사용자가 자격 없다고 판단 | `hasSkillInfo === false`면 **점수와 역량 영역을 통째로 숨기고** 안내 문구 |

세 번째가 Step 2에서 목업에 심어둔 `전산직/성실/무관` 케이스, Step 4의 `hasSkillInfo` 플래그, Step 6의 *"뽑을 것이 없으면 빈 배열"* 프롬프트 규칙이 만나는 지점이다. **한 화면을 위해 세 계층에 미리 심어둬야 했다.**

```js
if (!fit.hasSkillInfo) {
  return Response.json({ report: { ...fit, reasons: [] } });   // 근거 문장 호출 자체를 건너뛴다
}
```

화면에는 이렇게 나간다.

> *"이 공고에서 요구 역량을 추출하지 못했어요. 자격요건이 포함된 본문을 붙여넣어 주세요."*

---

## Step 9 — 스모크 테스트와 배포

E2E 테스트 대신 **PRD의 핵심 시나리오가 실제로 성립하는지**만 확인하는 스모크 테스트를 뒀다.

```bash
cd web && npm run smoke
```

```js
console.log('\n[1] 스킬 사전 정규화 (§8.4)');
const norm = normalizeSkills(['파이썬', 'Python3', '스프링부트']);
check('표기 흔들림이 하나로 모인다',
  norm.length === 2 && ['Python', 'Spring Boot'].every((s) => norm.includes(s)));
check('JavaScript가 Java로 오인되지 않는다',
  !scanSkills('JavaScript 개발자').includes('Java'));
```

Step 3에서 실제로 터졌던 버그가 그대로 테스트 케이스가 됐다. 사전은 앞으로 계속 커질 것이고, **긴 별칭 우선 정렬은 항목이 추가될 때마다 깨질 수 있는 종류의 불변식**이라 회귀를 잡아둘 곳이 필요했다.

배포는 Vercel. `web/`이 루트인 단일 리포이고, API 라우트도 같이 올라간다. 키가 없는 환경에서도 목업으로 동작하므로 **프리뷰 배포가 항상 살아 있다.**

---

## Step 10 — 진단에서 처방으로, 그리고 화면을 다시 짰다

Step 9까지가 "이 공고와 내가 맞는가"였다. 여기서부터가 "그래서 뭘 하면 되는가"다.
원래 F11(갭 → 보완 활동 추천)은 장기 과제였는데, **경력 공고 코퍼스가 생기면서 앞당길 근거가 생겼다.**

### 처방의 근거를 어디서 가져올 것인가

"뭘 더 하면 좋을지"를 LLM에게 물으면 그럴듯한 말이 무한히 나온다. 그건 처방이 아니라 작문이다.
근거가 필요했고, 코퍼스를 **신입·경력 페어**로 모은 것이 답이 됐다.

같은 회사·같은 직무의 공고 두 개를 나란히 놓으면, 차집합이 곧 "4~9년 뒤에 추가로 요구되는 것"이다.

```
futureSkills = 경력공고 태그 − 신입공고 태그 − 내 보유 태그
```

Step 4에서 점수를 LLM에게서 빼앗아온 것과 **똑같은 구조**다. 목록은 집합 연산이 확정하고,
LLM은 확정된 각 항목에 *"이게 왜 필요해지는지"* 한 문장만 붙인다.
그래서 근거 문장 생성이 실패해도 역량 목록과 강의 추천은 그대로 나간다.

거기에 HRD-Net 국비지원 훈련과정 152건을 같은 태그 사전으로 스캔해 붙였다.
"필요하다"에서 끝내지 않고 "여기서 배울 수 있다"까지 가는 것이 F11의 값어치다.

### 매칭이 안 되면 그냥 안 된다고 한다

여기서 가장 조심한 것은 **억지 매칭**이다.

사용자가 진단한 공고의 회사명이 코퍼스에 없으면, 비슷한 회사를 골라 채우고 싶은 유혹이 있다.
화면이 비는 것보다 뭐라도 뜨는 게 나아 보이기 때문이다. 그렇게 하지 않았다.

```js
// 후보가 여럿이면 제목 키워드 겹침이 가장 큰 것을 고른다.
// 아무 키워드도 겹치지 않으면 어느 직무인지 알 수 없다 — 억지 매칭 금지.
return bestScore > 0 ? best : null;
```

Step 8에서 *"정보 없음"과 "적합도 0%"는 다르다*고 했던 것과 같은 판단이다.
**틀린 로드맵은 없는 로드맵보다 나쁘다.**

### 기능은 다 만들었는데 화면에 한 번도 안 떴다

이 단계에서 가장 배운 게 이거였다.

로드맵 기능을 붙이고 배포까지 했는데, 화면에서는 항상 "정보 없음"만 떴다. 코드는 멀쩡했다.
원인은 **데이터 도메인 불일치**였다.

| | 도메인 |
|---|---|
| 경력 공고 코퍼스 | 반도체 · 디스플레이 · 이차전지 (원익IPS, SK하이닉스, 삼성전자 DS) |
| 데모·목업 픽스처 | IT 백엔드 (`㈜누리테크`) |

목업 공고의 회사는 코퍼스에 없는 가상 회사였다. 그러니 `matchCorpusPair`가 매번 `null`을 반환했고,
그건 **설계대로 동작한 것**이었다. 버그가 아니어서 더 안 보였다.

키 없이 도는 목업 모드는 Step 2에서 얻은 큰 자산이었는데,
**목업이 항상 같은 값만 돌려주면 새로 붙인 기능은 목업 뒤에 숨는다.**
그래서 목업이 입력에 반응하도록 바꿨다.

```js
// 목업도 입력에 반응한다 — 키 없이 세 갈래를 모두 밟아볼 수 있게.
if (/전산직|성실|무관/.test(text))            raw = MOCK_VAGUE_POSTING;   // 추출 실패 경로
else if (/설비기술|반도체 생산설비/.test(text)) raw = MOCK_SEMI_POSTING;    // 로드맵이 뜨는 경로
else                                          raw = MOCK_JOB_POSTING;     // 기본 IT
```

그리고 코퍼스에 **실제로 있는** 페어(삼성전자 DS부문 / 설비기술)로 데모 트랙을 하나 더 만들었다.
86쌍 중 강의까지 붙는 17쌍 중 하나다.

### 커버리지를 숨기지 않는다

붙여놓고 보니 강의 추천의 실제 커버리지가 낮았다.

- 96개 태그 중 강의가 붙는 건 **37개**
- 경력 공고가 실제로 추가 요구하는 12종 중 강의가 있는 건 **4종(33%)**
- 빈도 1·2위인 `협업·팀 프로젝트 리딩`(43쌍), `특허·지식재산`(33쌍)은 **국비지원 과정 자체가 없다**

데이터를 더 받아도 안 풀리는 종류다. 소프트스킬은 훈련과정으로 존재하지 않는다.
숫자를 채우려고 관련 없는 강의를 붙이는 대신 **"관련 강의 없음"을 그대로 표시**했다.
Step 8의 원칙이 여기서도 그대로 적용된다.

### 단일 페이지를 라우트로 쪼갰다

Step 7에서 다섯 섹션을 `page.jsx` 하나의 상태 기계로 만들었다. 그때는 그게 맞았다.
로드맵이 세 번째 축으로 붙으면서 한 파일이 감당할 범위를 넘었다.

```
/          랜딩          (사이드바 없음)
/start     시작 방법
/resume    STEP 1 이력서 분석
/posting   STEP 2 채용공고 진단
/roadmap   STEP 3 성장 로드맵
```

`useState` 뭉치는 `SessionProvider`로 올렸다. 여기서 새 문제가 하나 생겼다 —
**상태를 라우트 밖으로 올리면 새로고침에서 죽는다.** 단일 페이지일 때는 없던 문제다.

`sessionStorage`에 남겨서 해결했는데, 수명을 고른 근거가 있다.
`localStorage`가 아니라 `sessionStorage`인 이유는 화면 하단의 약속과 같은 수명이어야 하기 때문이다 —
*"회원가입 없이 세션 동안 이용합니다."* 탭을 닫으면 사라진다.

그리고 하이드레이션 전에는 아무 판단도 하지 않는다.

```js
// hydrated 이전에는 판단하지 않는다 — sessionStorage를 읽기 전에는 데이터가
// 없는 것처럼 보이기 때문이다. 그때 리다이렉트하면 새로고침마다 첫 화면으로 튕긴다.
if (!session.hydrated || has) return;
```

사이드바가 잠긴 단계를 막지만 주소창 직접 입력은 못 막는다. 그건 `useStepGuard`가 받는다.
잠긴 항목을 `<Link>`가 아니라 `disabled <button>`으로 그린 것도 같은 이유다 —
눌리지 않는 링크도 스크린리더에서는 여전히 링크로 읽힌다.

### 디자인은 프로토타입 쪽이 이겼다

별도 브랜치에서 돌던 디자인 프로토타입(`chafit-signal`)이 있었다. 본 앱과 언어가 완전히 달랐다.

| | 본 앱 | 프로토타입 |
|---|---|---|
| 브랜드 | 파랑 `#2f6bff` | sprout 초록 `#1f8350` |
| 라운드 | 14px | **4px** |
| 그림자 | 카드마다 | **없음** — 선으로만 구분 |
| 폰트 | Pretendard | IBM Plex Sans KR + **Plex Mono** |

프로토타입 쪽을 채택했다. 옮길 때 **클래스명을 그대로 두고 값만 바꾸는** 방식을 썼다.
그래서 `FitReport`·`ManualEntrySection` 등 컴포넌트 10종의 마크업은 한 줄도 건드리지 않았다.
CSS 모듈(`Sidebar.module.css`, `Mascot.module.css`)은 원본을 한 글자도 바꾸지 않고 복사했다.

다만 **완전히 같게는 못 했다.** 프로토타입 사이드바는 13개 항목이 전부 열려 있는데
실제로 만들어진 화면은 5개다. 레이아웃과 밀도는 그대로 두되, 미구현 8개는 *"준비 중"* 으로 잠갔다.
살아 있는 링크로 두면 전부 404가 된다. 앞 단계 데이터가 없어 잠긴 것(*"잠김"*)과는 표시를 구분했다.

---

## 돌아보면

### 순서를 이렇게 잡은 값어치

**계약(Step 1) → 목업(Step 2) → 룰(Step 3–4) → LLM(Step 6)** 순서가 세 가지를 벌어줬다.

- LLM을 붙이기 전에 화면이 끝까지 돌았다. 키 없이 클론한 팀원도 막히지 않았다.
- 점수가 이미 코드에 있었으므로, **LLM이 실패해도 진단서가 나간다.** 나중에 끼워 넣기 어려운 폴백이다.
- 스키마 객체 하나가 LLM 출력 강제와 API 응답을 겸해서, 명세와 실물이 어긋날 자리가 없었다.

### 목업의 대가

Step 2의 목업은 이 프로젝트에서 가장 값어치 있는 결정이었지만, Step 10에서 청구서가 왔다.

**목업이 항상 같은 값만 돌려주면, 새로 붙인 기능은 목업 뒤에 숨는다.**
로드맵을 다 만들고 배포까지 했는데 화면에서는 한 번도 뜬 적이 없었다. 코드는 멀쩡했고
설계대로 동작했기 때문에 오히려 안 보였다.

교훈은 목업을 없애는 게 아니라 **목업도 입력에 반응하게 만드는 것**이었다.
지금은 붙여넣는 공고에 따라 세 갈래(추출 실패 / 로드맵 매칭 / 기본)를 모두 밟을 수 있다.
새 기능을 붙일 때마다 "이 경로를 키 없이 밟아볼 수 있는가"를 같이 물어야 한다.

### 이 프로젝트의 한 줄

> **숫자는 코드가, 문장은 LLM이.**

`fitScore` · `matchedSkills` · `missingSkills`는 전부 집합 연산이다. LLM은 **이미 확정된 매칭을 설명하는 문장**만 쓴다. 이 경계선 하나가 환각·결정성·비용·폴백을 한꺼번에 해결했다.

### 아직 안 한 것

`docs/공고데이터/`의 코퍼스 스키마(86건)를 채택하기로 결정했지만 `contract.js`에는 아직 반영하지 않았다.

| 항목 | 현재 | 코퍼스 스키마 |
|---|---|---|
| 요구사항 | `skills[]` 단일 집합 | **`must` / `preferred` 분리** (가중치 0.45 / 0.25) |
| 정량 자격 | 없음 | 학력·전공 미달 시 **점수 이전에 하드 필터 경고** |
| 경험 깊이 | 없음 | 인턴 1.0 / 캡스톤 0.8 / 수업 0.5 / 자격증만 0.3 |
| 신뢰도 | 없음 | `verification` A · B · C 배지 |

**경험 깊이 계수**가 특히 아쉬운 지점이다. 페르소나 A의 Pain이 정확히 *"수업 과제로 해본 DOE가 '통계 기반 실험계획법 활용 가능자'를 충족하는지"* 인데, 현재 구현은 그걸 **프롬프트 규칙**(*"인턴·연구실 경험과 수업 과제는 같은 무게가 아니다"*)으로만 다루고 점수에는 반영하지 않는다. 다음 단계는 이걸 Step 4의 결정적 계층으로 끌어내리는 일이다.

---

<div align="center">

[![직접 해보기](https://img.shields.io/badge/%EC%A7%81%EC%A0%91%20%ED%95%B4%EB%B3%B4%EA%B8%B0-chae-fit.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://chae-fit.vercel.app)
[![README로](https://img.shields.io/badge/README%EB%A1%9C-%EB%8F%8C%EC%95%84%EA%B0%80%EA%B8%B0-4F46E5?style=for-the-badge)](./README.md)
[![PRD 전문](https://img.shields.io/badge/PRD%20%EC%A0%84%EB%AC%B8-v0.3-1F2937?style=for-the-badge)](./docs/PRD_SCREEN_통합.md)

</div>
