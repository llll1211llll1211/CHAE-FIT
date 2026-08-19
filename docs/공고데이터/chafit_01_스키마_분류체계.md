# 채피티(chafit) — 채용공고 표준 스키마 & 분류체계 v1.1

> 작성일: 2026-08-19 · 최종 수정: 2026-08-19
> 대상 기능: 기획서 4-1 = PRD **F4**(적합도 진단서) · 4-2 = **F5**(공고 요약) · 4-4 = **F9**(경쟁력 비교)
>
> 기능 ID는 `docs/PRD_SCREEN_통합.md` v0.3 기준이 정본입니다.

---

## 0. 이 문서가 푸는 문제

채용공고를 그냥 텍스트로 저장하면 LLM 프롬프트에 통째로 밀어 넣는 것 외에 할 수 있는 게 없습니다. 
그러면 (a) 토큰 비용이 공고 길이에 비례해서 튀고, (b) 점수가 매번 흔들려서 '적합도 78점'의 재현성이 없고, 
(c) 4-5 북마크 트래킹처럼 **같은 기준으로 재계산**해야 하는 기능을 붙일 수 없습니다.

그래서 공고를 `필수요건 / 우대사항 / 역량태그` 3층으로 분해해 저장하고, 
**태그 매칭은 코드가, 문장 생성은 LLM이** 담당하도록 역할을 나눕니다.

---
## 1. JD 표준 스키마 (YAML Front-matter)

```yaml
jd_id: KR-IND01-JOB02-001        # 국가-산업-직무-일련번호
verification: A                  # A: 공식 JD 확인 / B: 공개 직무소개 기반 / C: 표준 템플릿
collected_at: 2026-08-19
source_url: https://...

company:
  name: 삼성전자 DS부문
  size: 대기업                   # 대기업 | 중견기업 | 중소기업 | 공기업·공공기관 | 외국계기업
  industry_l1: 반도체·디스플레이
  industry_l2: 종합반도체(IDM)

posting:
  title: 반도체 공정기술 (메모리사업부)
  job_l1: 생산기술·엔지니어링
  job_l2: 공정기술
  employment_type: 정규직
  career_level: 신입             # 신입 | 신입/경력 | 경력
  hiring_type: 정기공채
  education_min: 학사
  majors: [전자공학, 재료공학, 화학공학]
  locations: [경기 화성, 경기 평택]

requirements:
  responsibilities: []           # 주요 업무
  must: []                       # 필수 자격 — 적합도 가중치 최상
  preferred: []                  # 우대사항 — 갭 리포트의 주 재료

competency_tags: []              # 정규화 태그 ID 배열 ← 매칭 엔진의 실제 입력
screening: []                    # 전형 절차
essay_types: []                  # 자소서 문항 유형 (기능 4-3 입력)
notes: 비고
```

### 필드 설계 근거

| 필드 | 왜 필요한가 | 어느 기능이 쓰나 |
|---|---|---|
| `verification` | 데모에서 "이 데이터 진짜냐"는 질문이 반드시 나옴. 신뢰도를 데이터 자체에 박아둠 | 전 기능 (UI에 배지 노출) |
| `must` / `preferred` 분리 | 점수 가중치가 다름. 합쳐 두면 "필수 미달"과 "우대 미보유"를 구분 못 함 | 4-1, 4-6 |
| `competency_tags` | 자연어 비교가 아닌 **집합 연산**으로 만들어 점수 재현성 확보 | 4-1, 4-4, 4-5 |
| `essay_types` | 4-3 문항별 근거 매핑의 입력값 | 4-3 |
| `education_min`, `majors` | 하드 필터. 미충족 시 점수 이전에 경고를 띄워야 함 | 4-1 |
| `hiring_type` | 정기공채/수시 여부에 따라 알림 전략이 달라짐 | 4-5 |

---
## 2. 산업 분류 (2단계)

| 코드 | 대분류 | 중분류 |
|---|---|---|
| `IND01` | 반도체·디스플레이 | 종합반도체(IDM) · 파운드리 · OSAT·패키징 · 반도체 장비 · 반도체 소재·부품 · 디스플레이 |
| `IND02` | 이차전지·에너지 | 셀 제조 · 양극재·음극재 · 전해질·분리막 · 장비 · ESS·태양광 |
| `IND03` | 자동차·모빌리티 | 완성차 · 전장부품 · 구동·섀시 · 자율주행·SW |
| `IND04` | 화학·정유·소재 | 기초화학 · 정밀화학 · 고분자·필름 · 정유 |
| `IND05` | IT·플랫폼·SW | 플랫폼 서비스 · SI·SM · 게임 · 핀테크 · AI·데이터 |
| `IND06` | 전자·전기부품 | 세트 가전 · 수동부품(MLCC 등) · 기판(PCB·패키지기판) · 전력·산업전기 |
| `IND07` | 바이오·제약 | CDMO · 바이오시밀러 · 합성의약품 · 의료기기 |
| `IND08` | 건설·중공업·플랜트 | 건축·토목 · EPC·엔지니어링 · 조선·해양 · 기계·중장비 |

## 3. 직무 분류 (2단계)

| 코드 | 직군 | 세부 직무 |
|---|---|---|
| `JOB01` | 연구개발(R&D) | 소자·회로설계 · 공정개발 · 소재개발 · 제품개발 · 선행연구 |
| `JOB02` | 생산기술·엔지니어링 | 공정기술 · 설비기술 · 생산기술 · 패키지개발 · 평가·분석 |
| `JOB03` | 품질 | 품질보증(QA) · 품질관리(QC) · 신뢰성 · 고객품질 |
| `JOB04` | 생산·제조 | 생산관리 · 양산관리 · 공무·유틸리티 · 안전보건환경(SHE) |
| `JOB05` | IT·데이터 | 백엔드 · 프론트엔드 · 데이터 엔지니어링 · ML·AI · 제조DX |
| `JOB06` | 영업·마케팅 | B2B 기술영업 · 상품기획 · 마케팅 · 해외영업 |
| `JOB07` | 경영지원 | 인사 · 재무·회계 · 구매·SCM · 전략기획 · 법무·특허 |

**기업 규모 코드**: 대기업 | 중견기업 | 중소기업 | 공기업·공공기관 | 외국계기업  
→ 워크넷 공채속보 API의 기업구분코드(대기업·공기업·공공기관·중견기업·외국계기업)와 1:1 정렬되도록 설계했습니다. 
나중에 API를 붙일 때 매핑 테이블을 새로 짤 필요가 없습니다.

---
## 4. 역량 태그 사전

이 사전은 **코퍼스 구동형**입니다. 즉 시드 공고에서 실제로 한 번 이상 쓰인 태그만 남깁니다. 
쓰이지 않는 태그를 사전에 남겨 두면 매칭 엔진이 영원히 만나지 못할 항목을 유지보수하게 되고, 
동의어가 겹치는 유사 태그가 쌓여 점수가 왜곡됩니다.

적합도 매칭의 **실제 키**입니다. `aliases`는 이력서에서 같은 역량이 다른 말로 적혀 있어도 잡아내기 위한 표기 변형 목록입니다. 
예를 들어 이력서에 "TGV 구리 필 도금"이라고 적혀 있어도 `SK.SEMI.PLATING`으로 정규화됩니다.

총 96개 태그 / 7개 카테고리

### 전공지식 (32개)

| tag_id | 라벨 | 인식 표현(aliases) |
|---|---|---|
| `SK.SEMI.PHOTO` | 포토리소그래피 | 포토, 노광, 리소그래피, photolithography, EUV, ArF, PR, 포토공정 |
| `SK.SEMI.ETCH` | 식각(Etch) | 식각, 에칭, etch, 건식식각, 습식식각, RIE, ICP |
| `SK.SEMI.CVD` | 박막증착(CVD/ALD) | CVD, PECVD, LPCVD, ALD, 증착, 박막, deposition |
| `SK.SEMI.PVD` | PVD·스퍼터링 | 스퍼터, sputter, PVD, e-beam, 열증착, thermal evaporation |
| `SK.SEMI.CMP` | CMP | CMP, 화학적기계연마, 평탄화, 슬러리 |
| `SK.SEMI.DIFF` | 확산·열처리 | 확산, diffusion, 이온주입, implantation, RTA, 어닐링, 산화 |
| `SK.SEMI.METAL` | 금속배선·Metallization | 메탈, 배선, 다마신, damascene, barrier, seed layer |
| `SK.SEMI.DEVICE` | 반도체 소자물리 | 소자, MOSFET, FinFET, GAA, 밴드갭, 캐리어, 문턱전압 |
| `SK.SEMI.PKG` | 패키징·후공정 | 패키징, package, wire bond, flip chip, TSV, bump, 몰딩, FCBGA, SiP |
| `SK.SEMI.MEMORY` | 메모리 디바이스(DRAM/NAND/HBM) | DRAM, NAND, HBM, 3D NAND, 낸드, 메모리 |
| `SK.SEMI.VACPLASMA` | 진공·플라즈마 공학 | 진공, 플라즈마, plasma, RF, 매칭박스, Paschen |
| `SK.BAT.ELECTRODE` | 전극공정(믹싱·코팅·압연) | 전극, 슬러리, 코팅, 압연, calendering, 믹싱 |
| `SK.BAT.ASSEMBLY` | 조립공정(와인딩·스태킹) | 와인딩, 스태킹, 노칭, 조립공정, 탭웰딩 |
| `SK.BAT.ECHEM` | 전기화학 | 전기화학, electrochemistry, CV, EIS, 임피던스, 충방전 |
| `SK.BAT.MATERIAL` | 전지소재(양극·음극·전해질) | 양극재, 음극재, 전해질, 분리막, NCM, LFP |
| `SK.DISP.OLED` | OLED 소자·공정 | OLED, 유기발광, 발광층, IVL, 수명평가, 증착 마스크 |
| `SK.DISP.TFT` | TFT·백플레인 | TFT, LTPS, IGZO, 백플레인 |
| `SK.ELEC.PCB` | PCB·패키지기판 | PCB, 기판, 빌드업, FCBGA, 레이업, 유리기판 |
| `SK.ELEC.OPTIC` | 광학 설계·카메라모듈 | 광학, 렌즈, 카메라모듈, Zemax, 이미지센서, 액추에이터 |
| `SK.CHEM.UNIT` | 화공 단위조작·반응공학 | 단위조작, 반응공학, 열전달, 물질전달, 증류, 유체역학 |
| `SK.BIO.CLINIC` | 임상개발·인허가(RA) | 임상시험, IND, NDA, 인허가, RA, 식약처, GCP |
| `SK.CON.STRUCT` | 구조·토목 설계 | 구조설계, 토목, 철근콘크리트, 지반, 내진, MIDAS |
| `SK.CON.PLANT` | 플랜트 공정설계 | 플랜트, P&ID, PFD, 배관, EPC, 기본설계, 상세설계 |
| `SK.SHIP.DESIGN` | 선박·해양 설계 | 선박설계, 선체, 의장, 조선, 해양플랜트, 선급 |
| `SK.BIZ.SCM` | 구매·SCM | 구매, SCM, 소싱, 협력사, 원가절감, 수급 계획, 물류 |
| `SK.BIZ.FIN` | 재무·회계 | 재무, 회계, 원가, 결산, IFRS, 세무, 관리회계 |
| `SK.BIZ.HR` | 인사·조직 | 인사, 채용, HRD, 노무, 평가보상, 조직문화 |
| `SK.MECH.DYN` | 기계 4대 역학 | 정역학, 동역학, 열역학, 유체역학, 재료역학, 4대역학 |
| `SK.ELEC.CIRCUIT` | 회로설계 | 회로설계, 아날로그 회로, 디지털 회로, PCB 설계, OrCAD, Altium |
| `SK.ELEC.PWR` | 전력전자·파워 | 전력전자, 인버터, 컨버터, SMPS, 모터제어 |
| `SK.MAT.POLY` | 고분자 합성·가공 | 고분자, 중합, 컴파운딩, 압출, 레진 |
| `SK.CON.CIVIL` | 토목·시공관리 | 시공관리, 토목, 공정관리, 현장관리, 품질시험 |

### 실험·장비 (16개)

| tag_id | 라벨 | 인식 표현(aliases) |
|---|---|---|
| `SK.SEMI.PLATING` | 전해도금·Cu Plating | 도금, plating, 전해도금, electroplating, 구리도금, Cu fill, bottom-up fill, TGV |
| `SK.ANAL.SEM` | SEM·TEM 분석 | SEM, TEM, FIB, EDS, 전자현미경 |
| `SK.ANAL.XRD` | XRD·XRF 분석 | XRD, XRF, 회절, Bragg |
| `SK.ANAL.CHEM` | 습식·전기화학 분석 | CVS, 적정, titration, ICP, HPLC, CMI |
| `SK.ANAL.RELI` | 신뢰성 평가 | 신뢰성, reliability, TCT, HTS, MSL, 가속수명, HAST |
| `SK.ANAL.FA` | 불량분석(FA) | 불량분석, FA, failure analysis, 원인분석, 8D |
| `SK.EQ.MAINT` | 설비 유지보수·PM | 설비, PM, 예방보전, 정비, trouble shooting, 예지보전 |
| `SK.EQ.AUTO` | 자동화·제어(PLC) | PLC, 자동화, 제어, SCADA, HMI, 로봇 |
| `SK.EQ.CAD` | 기구설계·CAD | CATIA, SolidWorks, AutoCAD, 3D 모델링, 기구설계 |
| `SK.EQ.CFD` | 해석·시뮬레이션 | ANSYS, CFD, 구조해석, 열해석, COMSOL, TCAD |
| `SK.SEMI.EDA` | 회로설계·EDA 툴 | Verilog, VHDL, Cadence, Synopsys, RTL, 레이아웃 |
| `SK.BIO.CULTURE` | 세포배양·업스트림 | 세포배양, 바이오리액터, 업스트림, 배지, cell culture |
| `SK.BIO.PURIF` | 정제·다운스트림 | 정제, 크로마토그래피, 다운스트림, 여과, purification |
| `SK.BIO.SYNTH` | 유기합성·제제연구 | 유기합성, 제제, 원료의약품, API, 스케일업 |
| `SK.BIO.MOL` | 분자생물학 실험 | PCR, western blot, ELISA, 클로닝, 유전자 |
| `SK.SHIP.WELD` | 용접·접합 기술 | 용접, welding, 접합, 비파괴검사, NDT |

### 데이터·SW (17개)

| tag_id | 라벨 | 인식 표현(aliases) |
|---|---|---|
| `SK.DATA.PY` | Python | Python, 파이썬, pandas, numpy |
| `SK.DATA.ML` | 머신러닝 모델링 | 머신러닝, machine learning, XGBoost, RandomForest, CNN, ViT, 딥러닝 |
| `SK.DATA.STAT` | 통계분석·회귀 | 회귀, regression, 통계, 가설검정, ANOVA, 상관분석 |
| `SK.DATA.SQL` | SQL·DB | SQL, MySQL, PostgreSQL, 쿼리, 데이터베이스 |
| `SK.DATA.VIZ` | 데이터 시각화 | 시각화, Tableau, matplotlib, 대시보드, PowerBI |
| `SK.DEV.BE` | 백엔드 개발 | Java, Spring, Node.js, 백엔드, API 서버, Django |
| `SK.DEV.FE` | 프론트엔드 개발 | React, Vue, 프론트엔드, JavaScript, TypeScript |
| `SK.DEV.CLOUD` | 클라우드·인프라 | AWS, Azure, GCP, Docker, Kubernetes, 쿠버네티스 |
| `SK.CHEM.SIM` | 공정 시뮬레이션 | Aspen, HYSYS, PRO/II, 공정모사, flowsheet |
| `SK.CON.BIM` | BIM·설계 협업 | BIM, Revit, Navisworks, 3D 설계 |
| `SK.DEV.GAME` | 게임 클라이언트·엔진 | Unity, Unreal, C++, 게임 개발, 그래픽스, 쉐이더 |
| `SK.DEV.MOBILE` | 모바일 앱 개발 | Android, iOS, Kotlin, Swift, React Native, Flutter |
| `SK.DEV.SEC` | 정보보안 | 보안, 모의해킹, 침해대응, 관제, 취약점, 포렌식, 정보보안기사 |
| `SK.DEV.EMBED` | 임베디드·펌웨어 | 임베디드, 펌웨어, C언어, MCU, RTOS, 베어메탈 |
| `SK.DEV.AUTOSAR` | 차량 SW·AUTOSAR | AUTOSAR, CAN, 차량제어, ECU, ISO 26262 |
| `SK.DEV.DEVOPS` | DevOps·CI/CD | CI/CD, Jenkins, GitHub Actions, IaC, Terraform, 모니터링 |
| `SK.DEV.LLM` | LLM·생성형 AI 활용 | LLM, 생성형 AI, 프롬프트, RAG, LangChain, 파인튜닝 |

### 품질·방법론 (14개)

| tag_id | 라벨 | 인식 표현(aliases) |
|---|---|---|
| `SK.DATA.DOE` | 실험계획법(DOE) | DOE, 실험계획, 직교배열, 반응표면, Minitab, JMP |
| `SK.DATA.SPC` | SPC·공정관리 | SPC, 관리도, Cpk, 공정능력, FDC |
| `SK.QM.SIXSIGMA` | 6시그마·DMAIC | 6시그마, 식스시그마, DMAIC, GB, BB |
| `SK.QM.ISO` | 품질시스템(ISO/IATF) | ISO 9001, IATF 16949, ISO 14001, 품질경영시스템 |
| `SK.QM.APQP` | APQP·PPAP·FMEA | APQP, PPAP, FMEA, 관리계획서, control plan |
| `SK.QM.YIELD` | 수율관리 | 수율, yield, yield 개선, 불량률 |
| `SK.BIO.GMP` | GMP·밸리데이션 | GMP, cGMP, 밸리데이션, validation, 일탈, CAPA, SOP |
| `SK.BIO.RA` | 인허가(RA) | 인허가, RA, regulatory, 식약처, FDA, 허가서류 |
| `SK.CON.COST` | 적산·원가관리 | 적산, 견적, 원가관리, 물량산출, VE |
| `SK.SHE.ENV` | 환경·안전보건(SHE) | 안전보건, SHE, ESH, 환경관리, 위험성평가, 중대재해 |
| `SK.PROD.PLAN` | 생산계획·MRP | 생산계획, MRP, APS, 수요예측, 납기관리 |
| `SK.PROD.IE` | 산업공학(IE)·라인밸런싱 | IE, 라인밸런싱, 표준시간, 레이아웃, TPM, 린 |
| `SK.BIZ.IP` | 특허·지식재산 | 특허, 지식재산, IP, 선행기술조사, 명세서 |
| `SK.BIZ.TRADE` | 무역·수출입 | 무역, 수출입, 통관, 인코텀즈, L/C |

### 소프트스킬 (6개)

| tag_id | 라벨 | 인식 표현(aliases) |
|---|---|---|
| `SK.SOFT.TEAM` | 협업·팀 프로젝트 리딩 | 조장, 팀장, 리더, 협업, 팀 프로젝트, PM |
| `SK.SOFT.DOC` | 기술문서 작성·보고 | 보고서, 기술문서, 논문, 발표, PT |
| `SK.SOFT.CS` | 고객 대응 | 고객사, CS, 대외 협의, 커뮤니케이션 |
| `SK.BIZ.SALES` | B2B 기술영업 | 기술영업, B2B, 고객사 대응, 수주, 영업, 제안 |
| `SK.BIZ.MKT` | 마케팅·상품기획 | 마케팅, 상품기획, 시장조사, 브랜드, 프로모션 |
| `SK.BIZ.STRAT` | 전략기획·사업분석 | 전략기획, 사업분석, 시장 분석, 타당성 검토, KPI |

### 언어·자격 (6개)

| tag_id | 라벨 | 인식 표현(aliases) |
|---|---|---|
| `SK.LANG.EN` | 영어(비즈니스) | TOEIC, 토익, OPIc, TOEIC Speaking, 영어회화, IELTS |
| `SK.LANG.CN` | 중국어 | HSK, 중국어 |
| `SK.CERT.SEMI` | 반도체 관련 자격 | 반도체장비기사, 산업기사, 품질경영기사, 화공기사, 위험물 |
| `SK.CERT.DATA` | 데이터 분석 자격 | ADsP, ADP, 빅데이터분석기사, SQLD |
| `SK.CERT.CON` | 건설 관련 자격 | 건축기사, 토목기사, 건설안전기사, 산업안전기사, 기계기사 |
| `SK.CERT.BIO` | 바이오·화학 관련 자격 | 생물공학기사, 화학분석기사, 위험물산업기사, GMP 교육 |

### 경험 (5개)

| tag_id | 라벨 | 인식 표현(aliases) |
|---|---|---|
| `SK.EXP.INTERN` | 관련 산업 인턴 경험 | 인턴, 인턴십, 현장실습, internship |
| `SK.EXP.LAB` | 연구실 경험 | 학부연구생, 연구실, 랩, 연구원, 학연 |
| `SK.EXP.CAPSTONE` | 캡스톤·산학 프로젝트 | 캡스톤, 산학, 졸업작품, 졸업연구 |
| `SK.EXP.PATENT` | 특허·논문 실적 | 특허, 출원, 등록, 논문, SCI, 학회 발표 |
| `SK.EXP.CONTEST` | 공모전 수상 | 공모전, 경진대회, 수상, 입상 |

---
## 5. 적합도 산출 로직 (제안)

```
fit_score = 100 × ( 0.45·M + 0.25·P + 0.15·Q + 0.15·D )

M = 필수요건 커버리지   = |resume_tags ∩ must_tags|   / |must_tags|
P = 우대사항 커버리지   = |resume_tags ∩ pref_tags|   / |pref_tags|
Q = 정량 자격 적합도    = 학력·전공·어학 충족 여부 (0/0.5/1)
D = 경험 깊이 계수      = 태그별 증빙 강도의 가중 평균

증빙 강도(D의 재료)
  1.0  인턴/실무 — 해당 역량을 실제 업무에서 수행
  0.8  연구실/캡스톤 — 프로젝트 단위로 직접 수행
  0.5  수업/교육과정 — 이론 학습 또는 실습 수준
  0.3  자격증만 보유 — 수행 경험 없음
```

**하드 필터** (점수 계산 이전 단계): 학력 미달, 전공 제한 위반, 경력 요건 불일치 → 점수 대신 경고 표시.

**근거 문장 생성**: 점수는 코드가 계산하고, LLM에는 매칭된 태그 쌍만 넘겨 문장만 쓰게 합니다.

```
입력 → {matched: [{tag: SK.SEMI.PLATING, jd_context: "전해도금 첨가제 거동 이해",
                    resume_evidence: "삼성전기 TGV Cu Fill 도금 인턴", strength: 1.0}],
        missing: [{tag: SK.DATA.DOE, jd_context: 통계 툴 활용 경험, tier: preferred}]}
출력 -> 매칭 근거 문장 + 갭 코멘트 (점수는 절대 LLM이 만들지 않음)
```

이 구조의 이점은 같은 이력서에 같은 공고를 넣으면 **항상 같은 점수**가 나온다는 것입니다. 
해커톤 심사에서 두 번 시연했을 때 점수가 달라지면 그 자체로 감점 요인이 됩니다.

---
## 6. 데이터 수집 파이프라인 (API 없이 시작하는 현실적 경로)

### 6-1. 3계층 전략

| 계층 | 대상 | 방법 | 커버리지 |
|---|---|---|---|
| L1 시드 | 대기업·중견기업 주요 직무 | 본 코퍼스 **86건** 수기 정형화 | 데모 시연에 충분 |
| L2 자동 | 중견기업 | 워크넷 오픈API (기업구분=중견기업 필터) | 확장 가능 |
| L3 수동 | 사용자 입력 | 공고 URL/텍스트 붙여넣기 → LLM이 스키마로 파싱 | 무한 |

**L3이 사실 가장 중요합니다.** 기획서 4-1의 원래 설계가 '사용자가 공고를 입력하면 진단'이므로, 
DB에 없는 공고도 처리 가능해야 합니다. 이 경우 LLM에게 위 YAML 스키마를 주고 파싱만 시키면 됩니다 
— 시드 코퍼스는 그 파서의 few-shot 예시로도 그대로 재활용됩니다.

### 6-2. 워크넷 오픈API 참고

- 공채속보 기업목록: 기업구분코드로 대기업/중견기업 필터 가능. 회사명·업종·주요사업·홈페이지 반환

- 채용정보 목록/상세: 업종, 채용제목, 근무지역, 최소학력, 경력, 전공, 자격면허, 우대조건, 채용정보URL 반환

- 공통코드 API: 지역/직종/전공/학과계열 코드 제공 → 위 분류체계와 매핑 테이블 작성 필요

- 인증키는 공공데이터포털 또는 워크넷 OpenAPI 사이트 회원가입 후 신청

> 주의: 워크넷에는 삼성전자·SK하이닉스급 대기업 공채가 거의 올라오지 않습니다. L1 시드가 필요한 이유입니다.

---
## 7. 법적·운영 주의사항

- 채용공고 원문은 기업 저작물입니다. **원문 전체 저장·재배포는 피하고**, 요건을 구조화한 파생 데이터 형태로 보관하세요.

- 잡코리아·사람인 등 민간 사이트는 이용약관에서 크롤링을 명시적으로 금지합니다. 스크래핑 대신 공식 API 또는 사용자 입력 경로를 쓰세요.

- 화면에는 원문 URL과 `collected_at`을 항상 노출해, 마감된 공고로 인한 오안내 리스크를 줄이세요.

- 기능 4-3의 '초안' 라벨링은 결과 카드 상단 배지 + 복사 시 워터마크 문구 삽입 2중으로 두는 것을 권장합니다.
