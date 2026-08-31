# -*- coding: utf-8 -*-
"""
신입 코퍼스(86건) + 경력 페어(86건) = 172건 코퍼스 생성기.

각 신입(base) 항목에 대해 CAREER_DELTA에 등록된 "경력 버전 차이"만 저자가 입력하면,
이 스크립트가 나머지(회사/전공/지역 등 공통 필드, jd_id, pair_id)를 기계적으로 채워
완전한 경력 JD 레코드를 만든다.

실행: python build_corpus.py
출력: web/src/lib/jobs/fixtures/jd-corpus.json (신입 86 + 경력 86, pair_id로 연결)
      docs/공고데이터/chafit_jd_corpus.jsonl (위 파일에서 1건 1줄로 재생성)
"""
import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENTRY_PATH = os.path.join(BASE_DIR, "web", "src", "lib", "jobs", "fixtures", "_entry_base.json")
OUT_JSON = os.path.join(BASE_DIR, "web", "src", "lib", "jobs", "fixtures", "jd-corpus.json")
OUT_JSONL = os.path.join(BASE_DIR, "docs", "공고데이터", "chafit_jd_corpus.jsonl")

CAREER_COLLECTED_AT = "2026-08-26"

with open(ENTRY_PATH, encoding="utf-8") as f:
    ENTRIES = json.load(f)
ENTRY_BY_ID = {e["jd_id"]: e for e in ENTRIES}

# CAREER_DELTA[base_jd_id] = {
#   "years": "3~7년" 같은 표기,
#   "hiring_type": 생략 시 "수시채용",
#   "responsibilities": [...]   # 경력용 3줄, 전체 교체
#   "must": [...]               # 경력용 2줄, 전체 교체
#   "preferred": [...]          # 경력용 2~3줄, 전체 교체
#   "add_tags": ["SK.XXX", ...] # 신입 태그 집합에 추가할 것만 (핵심 — "향후 필요 역량"의 재료)
#   "notes": "..." (선택)
# }
CAREER_DELTA = {}


def add(base_id, **kwargs):
    CAREER_DELTA[base_id] = kwargs


# ============================================================
# IND01 — 반도체·디스플레이
# ============================================================

add("KR-IND01-JOB01-005",
    years="4~8년",
    responsibilities=[
        "CVD·ALD 신규 공정/장비 레시피 개발 프로젝트 리딩",
        "고객사 양산 이관 시 공정 표준화 및 기술 이전 문서 작성",
        "주니어 엔지니어 실험 설계 코칭 및 결과 리뷰",
    ],
    must=[
        "박막 증착 공정 4년 이상 실무 경험",
        "고객사 대응 및 기술 협상 경험",
    ],
    preferred=[
        "신규 공정 특허 출원 실적",
        "6시그마 그린벨트 이상",
        "해외 고객사 기술지원 경험",
    ],
    add_tags=["SK.EXP.PATENT", "SK.QM.SIXSIGMA", "SK.BIZ.IP"])

add("KR-IND01-JOB01-007",
    years="4~8년",
    responsibilities=[
        "OLED 신규 소자 구조의 로드맵 수립 및 개발 총괄",
        "수명·효율 트레이드오프에 대한 의사결정 및 임원 보고",
        "소재사·장비사와의 공동 개발 프로젝트 리딩",
    ],
    must=[
        "OLED 소자·공정 개발 4년 이상 경력",
        "개발 로드맵 수립 및 우선순위 의사결정 경험",
    ],
    preferred=[
        "특허 출원 실적 다수 보유",
        "해외 소재사 공동 프로젝트 리딩 경험",
        "석·박사 학위 소지자",
    ],
    add_tags=["SK.EXP.PATENT", "SK.BIZ.IP", "SK.SOFT.TEAM"])

add("KR-IND01-JOB01-022",
    years="4~9년",
    responsibilities=[
        "차세대 메모리 소자 구조 로드맵 수립 및 개발 리딩",
        "산포 원인에 대한 근본 대책(설계 변경) 제안 및 실행",
        "공정팀과의 공동 개발 과제 기술 리딩",
    ],
    must=[
        "메모리 소자 설계·특성평가 4년 이상 경력",
        "TCAD 기반 구조 최적화 프로젝트 리딩 경험",
    ],
    preferred=[
        "특허 출원 다수 보유",
        "박사 학위 또는 동등 연구 경력",
        "해외 학회 발표 경험",
    ],
    add_tags=["SK.EXP.PATENT", "SK.BIZ.IP"])

add("KR-IND01-JOB01-025",
    years="4~8년",
    responsibilities=[
        "ALD·Etch 신규 장비 공정 레시피 개발 리딩",
        "고객사 신규 평가 프로젝트 기술 총괄 및 결과 보고",
        "장비 하드웨어 개선 과제 기술 자문",
    ],
    must=[
        "박막 공정 4년 이상 실무 경험",
        "고객사 기술 협상 및 대응 경험",
    ],
    preferred=[
        "해외 고객사 상주 지원 경험",
        "특허 출원 실적",
        "6시그마 벨트 보유",
    ],
    add_tags=["SK.BIZ.IP", "SK.QM.SIXSIGMA"])

add("KR-IND01-JOB02-001",
    years="4~9년",
    responsibilities=[
        "담당 단위공정의 수율·품질 개선 과제 기획 및 리딩",
        "신규 제품 양산 이관 시 공정 조건 확립 총괄 및 유관부서 조율",
        "산포 저감을 위한 근본 원인 분석(FA 연계) 및 설계 변경 제안",
    ],
    must=[
        "반도체 단위공정 실무 4년 이상 경력",
        "수율 개선 과제를 주도적으로 리딩한 경험",
    ],
    preferred=[
        "6시그마 블랙벨트 또는 그린벨트",
        "관련 특허 출원 실적",
        "후배 엔지니어 육성/멘토링 경험",
    ],
    add_tags=["SK.QM.SIXSIGMA", "SK.BIZ.IP", "SK.SOFT.TEAM"])

add("KR-IND01-JOB02-002",
    years="4~9년",
    responsibilities=[
        "양산 라인 수율 저해 요인에 대한 개선 과제 기획 및 리딩",
        "공정 이상 발생 시 원인 분석 총괄 및 재발방지 표준 수립",
        "신규 제품 이관 시 공정 조건 확립 및 유관부서 조율",
    ],
    must=[
        "반도체 양산 공정 실무 4년 이상 경력",
        "수율 개선 과제 리딩 경험",
    ],
    preferred=[
        "Python·통계 기반 대용량 공정 데이터 분석 리딩 경험",
        "6시그마 벨트 보유",
        "해외 라인 기술 이전 경험",
    ],
    add_tags=["SK.QM.SIXSIGMA", "SK.DATA.ML"])

add("KR-IND01-JOB02-003",
    years="4~8년",
    responsibilities=[
        "HBM 등 어드밴스드 패키지 신규 공정 개발 프로젝트 리딩",
        "패키지 신뢰성 이슈 근본 원인 분석 및 설계 대책 수립",
        "고객사·소재사 공동 개발 기술 협의 주관",
    ],
    must=[
        "패키지 공정 개발 4년 이상 실무 경력",
        "신뢰성 이슈 해결을 리딩한 경험",
    ],
    preferred=[
        "특허 출원 실적",
        "해외 고객사 기술 협의 경험",
        "6시그마 벨트 보유",
    ],
    add_tags=["SK.BIZ.IP", "SK.QM.SIXSIGMA"])

add("KR-IND01-JOB02-004",
    years="4~8년",
    responsibilities=[
        "후공정 장비 신규 모델 기구 설계 프로젝트 총괄",
        "고객사 사양 협상 및 설계 변경 의사결정",
        "주니어 설계자 도면·공차 리뷰 및 육성",
    ],
    must=[
        "장비 기구 설계 4년 이상 실무 경력",
        "설계 프로젝트를 처음부터 끝까지 리딩한 경험",
    ],
    preferred=[
        "특허 출원 실적",
        "해외 고객사 기술지원 경험",
        "원가 절감 설계(VE) 경험",
    ],
    add_tags=["SK.BIZ.IP", "SK.CON.COST", "SK.SOFT.TEAM"])

add("KR-IND01-JOB02-006",
    years="4~8년",
    responsibilities=[
        "패키지기판 신규 공정 도입 프로젝트 리딩",
        "수율 저해 요인 근본 분석 및 설비 개선 과제 총괄",
        "협력사(약품·설비) 벤더 관리 및 원가 절감 과제 수행",
    ],
    must=[
        "패키지기판 공정 실무 4년 이상 경력",
        "수율 개선 과제 리딩 경험",
    ],
    preferred=[
        "전해도금 공정 심화 지식(첨가제 거동 이해)",
        "벤더·원가 관리 경험",
        "6시그마 벨트 보유",
    ],
    add_tags=["SK.BIZ.SCM", "SK.QM.SIXSIGMA"])

add("KR-IND01-JOB02-021",
    years="4~9년",
    responsibilities=[
        "설비 고장 예지보전 체계 구축 및 가동률 개선 과제 리딩",
        "신규 설비 셋업 프로젝트 기술 총괄",
        "설비 벤더 기술 협상 및 유지보수 계약 관리",
    ],
    must=[
        "설비기술 실무 4년 이상 경력",
        "설비 개선 프로젝트 리딩 경험",
    ],
    preferred=[
        "예지보전 데이터 모델링 경험",
        "설비 벤더 협상 경험",
        "6시그마 벨트 보유",
    ],
    add_tags=["SK.DATA.ML", "SK.BIZ.SCM"])

add("KR-IND01-JOB02-023",
    years="4~8년",
    responsibilities=[
        "고객 제품별 공정 튜닝 프로젝트 리딩 및 수율 개선 총괄",
        "공정 불량 근본 원인 분석 및 재발방지 표준 수립",
        "다품종 소량 생산 특성에 맞는 공정 유연화 과제 주도",
    ],
    must=[
        "파운드리 공정 실무 4년 이상 경력",
        "고객 대응 및 수율 개선 리딩 경험",
    ],
    preferred=[
        "6시그마 벨트 보유",
        "해외 고객사 기술 대응 경험",
        "공정 특허 출원 실적",
    ],
    add_tags=["SK.QM.SIXSIGMA", "SK.BIZ.IP"])

add("KR-IND01-JOB02-024",
    years="4~8년",
    responsibilities=[
        "신규 고객사 제품 양산 이관 프로젝트 총괄",
        "글로벌 고객사 대상 공정 이슈 기술 협의 리딩",
        "후공정 수율 개선 과제 기획 및 실행",
    ],
    must=[
        "OSAT 후공정 실무 4년 이상 경력",
        "글로벌 고객사 대응 리딩 경험",
    ],
    preferred=[
        "6시그마 벨트 보유",
        "해외 출장·상주 지원 가능자",
        "신뢰성 이슈 해결 리딩 경험",
    ],
    add_tags=["SK.QM.SIXSIGMA", "SK.BIZ.STRAT"])

add("KR-IND01-JOB02-027",
    years="4~8년",
    responsibilities=[
        "OLED 신모델 양산 이관 프로젝트 총괄",
        "수율 개선 과제 기획 및 유관부서 조율",
        "차세대 공정 기술 도입 검토 및 로드맵 수립",
    ],
    must=[
        "디스플레이 양산 공정 실무 4년 이상 경력",
        "양산 이관 프로젝트 리딩 경험",
    ],
    preferred=[
        "6시그마 벨트 보유",
        "해외 생산법인 기술 이전 경험",
        "특허 출원 실적",
    ],
    add_tags=["SK.QM.SIXSIGMA", "SK.BIZ.IP"])

add("KR-IND01-JOB04-028",
    years="3~7년",
    responsibilities=[
        "생산 계획 수립 프로세스 개선 및 시스템 고도화 리딩",
        "라인 병목 분석 기반 시뮬레이션 과제 기획",
        "타 부서와의 수요-공급 조율 및 의사결정 지원",
    ],
    must=[
        "생산관리 실무 3년 이상 경력",
        "계획 프로세스 개선을 주도한 경험",
    ],
    preferred=[
        "시뮬레이션(라인밸런싱) 기반 개선 경험",
        "SCM 벤더 관리 경험",
        "PMP 등 프로젝트 관리 자격",
    ],
    add_tags=["SK.PROD.IE", "SK.BIZ.SCM"])

add("KR-IND01-JOB05-026",
    years="3~7년",
    responsibilities=[
        "장비 제어 SW 아키텍처 설계 및 신규 모델 개발 총괄",
        "현장 이슈에 대한 근본 원인 분석 및 SW 안정화",
        "주니어 개발자 코드 리뷰 및 기술 멘토링",
    ],
    must=[
        "장비/임베디드 제어 SW 개발 3년 이상 경력",
        "SW 아키텍처 설계 경험",
    ],
    preferred=[
        "SECS/GEM 등 반도체 장비 통신 표준 심화 경험",
        "CI/CD 등 개발 프로세스 구축 경험",
        "해외 고객사 기술지원 경험",
    ],
    add_tags=["SK.DEV.DEVOPS", "SK.SOFT.TEAM"])

# ============================================================
# IND02 — 이차전지·에너지
# ============================================================

add("KR-IND02-JOB01-033",
    years="4~8년",
    responsibilities=[
        "이차전지 신규 장비 기구 설계 프로젝트 총괄",
        "고객 사양 협상 및 설계 변경 의사결정",
        "시운전 이슈 근본 원인 분석 및 설계 개선",
    ],
    must=[
        "전지 장비 설계 실무 4년 이상 경력",
        "설계 프로젝트 리딩 경험",
    ],
    preferred=[
        "특허 출원 실적",
        "해외 고객사 기술지원 경험",
        "원가 절감 설계(VE) 경험",
    ],
    add_tags=["SK.BIZ.IP", "SK.CON.COST"])

add("KR-IND02-JOB02-008",
    years="4~9년",
    responsibilities=[
        "전극 공정 신기술 도입 프로젝트 리딩 및 양산 적용 총괄",
        "생산성·품질 지표 개선 과제 기획 및 유관부서 조율",
        "해외 법인 기술 이전 및 현지 엔지니어 교육",
    ],
    must=[
        "전지 전극 공정 실무 4년 이상 경력",
        "공정 개선 과제를 주도적으로 리딩한 경험",
    ],
    preferred=[
        "6시그마 벨트 보유",
        "해외 법인 기술 이전 경험",
        "특허 출원 실적",
    ],
    add_tags=["SK.QM.SIXSIGMA", "SK.BIZ.IP"])

add("KR-IND02-JOB02-010",
    years="4~8년",
    responsibilities=[
        "양극 활물질 신제품 스케일업 프로젝트 총괄",
        "공정 산포 근본 원인 분석 및 개선 표준 수립",
        "소재 분석 데이터 기반 품질 예측 모델 검토",
    ],
    must=[
        "양극재 공정 실무 4년 이상 경력",
        "스케일업 프로젝트 리딩 경험",
    ],
    preferred=[
        "6시그마 벨트 보유",
        "특허 출원 실적",
        "고객사(셀메이커) 기술 대응 경험",
    ],
    add_tags=["SK.QM.SIXSIGMA", "SK.BIZ.IP"])

add("KR-IND02-JOB02-029",
    years="4~8년",
    responsibilities=[
        "조립공정 신기술 도입 프로젝트 리딩",
        "해외 공장 양산 이관 기술 총괄 및 현지 엔지니어 교육",
        "공정 불량 근본 원인 분석 및 재발방지 표준 수립",
    ],
    must=[
        "전지 조립공정 실무 4년 이상 경력",
        "해외 공장 기술 이전 리딩 경험",
    ],
    preferred=[
        "6시그마 벨트 보유",
        "해외 상주 근무 가능자",
        "설비 벤더 협상 경험",
    ],
    add_tags=["SK.QM.SIXSIGMA", "SK.BIZ.SCM"])

add("KR-IND02-JOB02-030",
    years="4~8년",
    responsibilities=[
        "전지 생산설비 신규 도입 프로젝트 총괄",
        "예지보전 체계 구축 및 가동률 개선 리딩",
        "설비 벤더 기술 협상 및 유지보수 계약 관리",
    ],
    must=[
        "설비기술 실무 4년 이상 경력",
        "설비 도입 프로젝트 리딩 경험",
    ],
    preferred=[
        "예지보전 데이터 분석 경험",
        "설비 벤더 협상 경험",
        "6시그마 벨트 보유",
    ],
    add_tags=["SK.DATA.ML", "SK.BIZ.SCM"])

add("KR-IND02-JOB02-034",
    years="4~8년",
    responsibilities=[
        "음극재 신규 라인 셋업 프로젝트 총괄",
        "원가 절감 과제 기획 및 실행 리딩",
        "품질 이슈 근본 원인 분석 및 협력사 개선 지도",
    ],
    must=[
        "음극재 생산기술 실무 4년 이상 경력",
        "라인 셋업 프로젝트 리딩 경험",
    ],
    preferred=[
        "원가관리 경험",
        "6시그마 벨트 보유",
        "해외 원료 협력사 대응 경험",
    ],
    add_tags=["SK.BIZ.FIN", "SK.QM.SIXSIGMA"])

add("KR-IND02-JOB02-035",
    years="4~8년",
    responsibilities=[
        "태양광 셀 신기술(고효율 구조) 라인 적용 프로젝트 리딩",
        "셀 효율 개선 과제 기획 및 결과 임원 보고",
        "해외 사업장 기술 이전 및 현지 엔지니어 교육",
    ],
    must=[
        "태양광 셀 공정 실무 4년 이상 경력",
        "신기술 라인 적용 프로젝트 리딩 경험",
    ],
    preferred=[
        "6시그마 벨트 보유",
        "해외 사업장 근무 경험",
        "특허 출원 실적",
    ],
    add_tags=["SK.QM.SIXSIGMA", "SK.BIZ.IP"])

add("KR-IND02-JOB03-009",
    years="4~8년",
    responsibilities=[
        "고객사 품질 감사 대응 총괄 및 협력사 품질 관리 체계 구축",
        "품질 이슈 근본 원인 분석 및 재발방지 대책 수립 리딩",
        "품질경영시스템 고도화 과제 기획",
    ],
    must=[
        "자동차전지 품질보증 실무 4년 이상 경력",
        "고객사 품질 감사 대응 리딩 경험",
    ],
    preferred=[
        "6시그마 블랙벨트",
        "IATF 16949 내부심사원 자격",
        "해외 고객사 품질 협의 경험",
    ],
    add_tags=["SK.QM.SIXSIGMA", "SK.SOFT.TEAM"])

add("KR-IND02-JOB03-032",
    years="4~8년",
    responsibilities=[
        "고객사 품질 이슈 대응 총괄 및 시정조치 리딩",
        "품질경영시스템 인증 유지·고도화",
        "협력사 품질 감사 및 개선 지도",
    ],
    must=[
        "양극재 품질보증 실무 4년 이상 경력",
        "고객 품질 이슈 대응 리딩 경험",
    ],
    preferred=[
        "IATF 16949 심사원 자격",
        "6시그마 벨트 보유",
        "해외 고객사 대응 경험",
    ],
    add_tags=["SK.QM.SIXSIGMA", "SK.SOFT.TEAM"])

add("KR-IND02-JOB04-036",
    years="3~7년",
    responsibilities=[
        "셀 생산 계획 프로세스 고도화 및 해외 법인 연계 총괄",
        "라인 가동 이슈 근본 원인 분석 및 개선 리딩",
        "ERP·MES 데이터 기반 의사결정 체계 구축",
    ],
    must=[
        "생산관리 실무 3년 이상 경력",
        "해외 법인 연계 계획 수립 경험",
    ],
    preferred=[
        "ERP·MES 고도화 프로젝트 경험",
        "SCM 벤더 관리 경험",
        "영어 비즈니스 회화 가능자",
    ],
    add_tags=["SK.DEV.CLOUD", "SK.BIZ.STRAT"])

add("KR-IND02-JOB05-031",
    years="3~7년",
    responsibilities=[
        "예지보전 모델 고도화 및 다중 라인 확산 프로젝트 리딩",
        "제조 데이터 플랫폼 아키텍처 설계",
        "현업 요구사항 기반 우선순위 결정 및 로드맵 수립",
    ],
    must=[
        "제조 데이터 분석/ML 실무 3년 이상 경력",
        "모델을 실제 라인에 적용·운영한 경험",
    ],
    preferred=[
        "MLOps 파이프라인 구축 경험",
        "클라우드 아키텍처 설계 경험",
        "타 사업장 확산 프로젝트 리딩 경험",
    ],
    add_tags=["SK.DEV.DEVOPS", "SK.SOFT.TEAM"])

# ============================================================
# IND03 — 자동차·모빌리티
# ============================================================

add("KR-IND03-JOB01-012",
    years="4~8년",
    responsibilities=[
        "전동식 제동시스템 신모델 설계 프로젝트 총괄",
        "고객사(완성차) 사양 협상 및 설계 변경 의사결정",
        "설계 이슈 근본 원인 분석 및 대책 수립 리딩",
    ],
    must=[
        "자동차 부품 설계 실무 4년 이상 경력",
        "고객사 대응 설계 프로젝트 리딩 경험",
    ],
    preferred=[
        "APQP·PPAP 프로세스 리딩 경험",
        "특허 출원 실적",
        "해외 고객사 기술 협의 경험",
    ],
    add_tags=["SK.BIZ.IP", "SK.SOFT.TEAM"])

add("KR-IND03-JOB01-039",
    years="4~8년",
    responsibilities=[
        "전장 제어기 신모델 회로 설계 프로젝트 총괄",
        "EMC·신뢰성 이슈 근본 원인 분석 및 설계 대책 수립",
        "협력사 부품 벤더 기술 검토 및 원가 절감 과제 리딩",
    ],
    must=[
        "전장 회로 설계 실무 4년 이상 경력",
        "설계 프로젝트를 처음부터 끝까지 리딩한 경험",
    ],
    preferred=[
        "ISO 26262 기능안전 프로젝트 경험",
        "벤더 원가 협상 경험",
        "특허 출원 실적",
    ],
    add_tags=["SK.BIZ.SCM", "SK.BIZ.IP"])

add("KR-IND03-JOB01-040",
    years="4~8년",
    responsibilities=[
        "전기차 열관리 시스템 신모델 개발 프로젝트 총괄",
        "성능 이슈 근본 원인 분석 및 CFD 기반 설계 개선 리딩",
        "고객사 사양 협상 및 벤더 부품 기술 검토",
    ],
    must=[
        "열관리 시스템 설계 실무 4년 이상 경력",
        "개발 프로젝트 리딩 경험",
    ],
    preferred=[
        "특허 출원 실적",
        "해외 고객사 기술 대응 경험",
        "벤더 원가 협상 경험",
    ],
    add_tags=["SK.BIZ.IP", "SK.BIZ.SCM"])

add("KR-IND03-JOB01-042",
    years="4~8년",
    responsibilities=[
        "구동시스템 신모델 시험 계획 총괄 및 결과 기반 설계 개선 리딩",
        "내구·NVH 이슈 근본 원인 규명 프로젝트 주도",
        "시험 표준·방법론 고도화",
    ],
    must=[
        "구동계 시험평가 실무 4년 이상 경력",
        "시험 프로젝트 리딩 및 설계 피드백 경험",
    ],
    preferred=[
        "시험 표준화 프로젝트 경험",
        "특허 출원 실적",
        "해외 고객사 기술 대응 경험",
    ],
    add_tags=["SK.BIZ.IP", "SK.SOFT.TEAM"])

add("KR-IND03-JOB02-038",
    years="4~8년",
    responsibilities=[
        "신차 양산 라인 셋업 프로젝트 총괄",
        "생산성 향상 과제 기획 및 유관부서 조율",
        "자동화 설비 벤더 기술 협상 및 도입 리딩",
    ],
    must=[
        "생산기술 실무 4년 이상 경력",
        "신차 라인 셋업 프로젝트 리딩 경험",
    ],
    preferred=[
        "자동화 투자 사업성 검토 경험",
        "IE 기법 기반 라인 재설계 경험",
        "설비 벤더 협상 경험",
    ],
    add_tags=["SK.BIZ.SCM", "SK.BIZ.FIN"])

add("KR-IND03-JOB03-011",
    years="4~8년",
    responsibilities=[
        "차량용 반도체 품질 이슈 근본 원인 분석 프로젝트 총괄",
        "협력사 품질 감사 체계 구축 및 개선 지도 리딩",
        "고객사(완성차) 품질 보고 및 대응 총괄",
    ],
    must=[
        "전장·반도체 품질관리 실무 4년 이상 경력",
        "품질 이슈 대응을 리딩한 경험",
    ],
    preferred=[
        "IATF 16949 심사원 자격",
        "FMEA 워크숍 리딩 경험",
        "해외 협력사 대응 경험",
    ],
    add_tags=["SK.SOFT.TEAM", "SK.BIZ.STRAT"])

add("KR-IND03-JOB03-041",
    years="4~8년",
    responsibilities=[
        "램프 신모델 품질 기준 수립 프로젝트 총괄",
        "품질 이슈 근본 원인 분석 및 재발방지 체계 구축",
        "협력사 품질 감사 및 개선 지도",
    ],
    must=[
        "램프 품질관리 실무 4년 이상 경력",
        "품질 기준 수립 프로젝트 리딩 경험",
    ],
    preferred=[
        "IATF 16949 심사원 자격",
        "광학 측정 심화 경험",
        "6시그마 벨트 보유",
    ],
    add_tags=["SK.QM.SIXSIGMA", "SK.SOFT.TEAM"])

add("KR-IND03-JOB05-037",
    years="4~8년",
    responsibilities=[
        "차량 제어 SW 아키텍처 설계 및 신규 플랫폼 개발 총괄",
        "기능안전(ISO 26262) 프로세스 리딩",
        "주니어 개발자 코드 리뷰 및 기술 멘토링",
    ],
    must=[
        "차량 제어 SW 개발 실무 4년 이상 경력",
        "SW 아키텍처 설계 및 리딩 경험",
    ],
    preferred=[
        "ISO 26262 기능안전 인증 프로젝트 경험",
        "AUTOSAR 플랫폼 심화 경험",
        "특허 출원 실적",
    ],
    add_tags=["SK.BIZ.IP", "SK.SOFT.TEAM"])

add("KR-IND03-JOB05-044",
    years="4~8년",
    responsibilities=[
        "엔진·모터 제어기 펌웨어 아키텍처 설계 총괄",
        "양산 이슈 근본 원인 분석 및 재발방지 대책 수립",
        "협력사(반도체·툴체인) 기술 협상",
    ],
    must=[
        "임베디드 SW 개발 실무 4년 이상 경력",
        "펌웨어 아키텍처 설계 경험",
    ],
    preferred=[
        "AUTOSAR 플랫폼 심화 경험",
        "기능안전 프로젝트 경험",
        "특허 출원 실적",
    ],
    add_tags=["SK.BIZ.IP", "SK.SOFT.TEAM"])

add("KR-IND03-JOB07-043",
    years="4~8년",
    responsibilities=[
        "핵심 부품 협력사 소싱 전략 수립 및 협상 총괄",
        "원가 절감 과제 기획 및 유관부서 조율",
        "공급망 리스크 진단 및 대응 체계 구축",
    ],
    must=[
        "부품 구매·소싱 실무 4년 이상 경력",
        "고액 계약 협상을 리딩한 경험",
    ],
    preferred=[
        "글로벌 소싱 프로젝트 리딩 경험",
        "원가 분석 모델링 경험",
        "제2외국어 비즈니스 회화 가능자",
    ],
    add_tags=["SK.BIZ.STRAT", "SK.SOFT.TEAM"])

# ============================================================
# IND04 — 화학·정유·소재
# ============================================================

add("KR-IND04-JOB01-014",
    years="4~8년",
    responsibilities=[
        "신규 고분자 소재 개발 프로젝트 총괄 및 로드맵 수립",
        "고객사 요구 스펙 대응 기술 협상 리딩",
        "양산 이관을 위한 공정 조건 확립 및 스케일업 총괄",
    ],
    must=[
        "고분자 소재 연구개발 실무 4년 이상 경력",
        "개발 프로젝트를 처음부터 끝까지 리딩한 경험",
    ],
    preferred=[
        "특허 출원 다수 보유",
        "해외 고객사 기술 협의 경험",
        "석·박사 학위 소지자",
    ],
    add_tags=["SK.EXP.PATENT", "SK.BIZ.IP"])

add("KR-IND04-JOB01-047",
    years="4~8년",
    responsibilities=[
        "전자·디스플레이용 신소재 개발 로드맵 수립 및 리딩",
        "고객 스펙 대응 소재 설계 의사결정",
        "양산 스케일업 프로젝트 총괄",
    ],
    must=[
        "소재 연구개발 실무 4년 이상 경력",
        "개발 로드맵 수립 경험",
    ],
    preferred=[
        "특허 출원 다수 보유",
        "해외 고객사 공동 개발 경험",
        "박사 학위 소지자",
    ],
    add_tags=["SK.EXP.PATENT", "SK.BIZ.IP"])

add("KR-IND04-JOB01-049",
    years="4~8년",
    responsibilities=[
        "감광액(PR) 신제품 개발 프로젝트 총괄",
        "고객사 공정 평가 대응 기술 협상 리딩",
        "양산 품질 안정화 및 배합 표준 수립",
    ],
    must=[
        "반도체 소재 개발 실무 4년 이상 경력",
        "고객사 대응 개발 프로젝트 리딩 경험",
    ],
    preferred=[
        "특허 출원 실적",
        "해외 고객사 기술지원 경험",
        "포토리소그래피 공정 심화 이해",
    ],
    add_tags=["SK.BIZ.IP", "SK.SOFT.TEAM"])

add("KR-IND04-JOB01-051",
    years="4~8년",
    responsibilities=[
        "유리기판 신제품 개발 프로젝트 총괄",
        "고객사 요구 스펙 대응 기술 협상",
        "신뢰성 이슈 근본 원인 분석 및 설계 대책 수립",
    ],
    must=[
        "소재 개발 실무 4년 이상 경력",
        "개발 프로젝트 리딩 경험",
    ],
    preferred=[
        "전해도금·금속화 공정 심화 경험",
        "특허 출원 실적",
        "해외 고객사 대응 경험",
    ],
    add_tags=["SK.EXP.PATENT", "SK.BIZ.IP"])

add("KR-IND04-JOB02-013",
    years="4~8년",
    responsibilities=[
        "석유화학 공정 개선 과제 기획 및 리딩",
        "설비 트러블 근본 원인 분석 및 재발방지 표준 수립",
        "에너지 효율 개선 프로젝트 총괄",
    ],
    must=[
        "석유화학 공정 실무 4년 이상 경력",
        "공정 개선 과제 리딩 경험",
    ],
    preferred=[
        "6시그마 벨트 보유",
        "공정 시뮬레이션 고도화 경험",
        "안전관리 책임자 자격",
    ],
    add_tags=["SK.QM.SIXSIGMA", "SK.SOFT.TEAM"])

add("KR-IND04-JOB02-045",
    years="4~8년",
    responsibilities=[
        "석유화학 공정 수율 향상 프로젝트 총괄",
        "설비 트러블 근본 원인 분석 리딩",
        "에너지 절감 과제 기획 및 실행",
    ],
    must=[
        "석유화학 공정 실무 4년 이상 경력",
        "수율 개선 과제 리딩 경험",
    ],
    preferred=[
        "6시그마 벨트 보유",
        "Aspen 등 공정 모사 고도화 경험",
        "안전관리 책임자 자격",
    ],
    add_tags=["SK.QM.SIXSIGMA", "SK.SOFT.TEAM"])

add("KR-IND04-JOB02-050",
    years="4~8년",
    responsibilities=[
        "탄소섬유 신규 설비 도입 프로젝트 총괄",
        "생산성 향상 과제 기획 및 유관부서 조율",
        "불량 근본 원인 분석 및 재발방지 표준 수립",
    ],
    must=[
        "탄소섬유 생산기술 실무 4년 이상 경력",
        "설비 도입 프로젝트 리딩 경험",
    ],
    preferred=[
        "6시그마 벨트 보유",
        "해외 설비 벤더 협상 경험",
        "열처리 공정 심화 경험",
    ],
    add_tags=["SK.QM.SIXSIGMA", "SK.BIZ.SCM"])

add("KR-IND04-JOB03-048",
    years="4~8년",
    responsibilities=[
        "합성고무·수지 품질 이슈 근본 원인 분석 프로젝트 총괄",
        "고객 클레임 대응 및 재발방지 대책 수립 리딩",
        "품질시스템 고도화 과제 기획",
    ],
    must=[
        "화학 품질관리 실무 4년 이상 경력",
        "품질 이슈 대응 리딩 경험",
    ],
    preferred=[
        "ISO 9001 심사원 자격",
        "6시그마 벨트 보유",
        "해외 고객 대응 경험",
    ],
    add_tags=["SK.QM.SIXSIGMA", "SK.SOFT.TEAM"])

add("KR-IND04-JOB04-046",
    years="4~8년",
    responsibilities=[
        "정유 공정 안정화 프로젝트 총괄 및 정기보수 계획 수립",
        "설비 신뢰성 개선 과제 기획 및 유관부서 조율",
        "안전 관리 체계 고도화 리딩",
    ],
    must=[
        "정유 공정 운영 실무 4년 이상 경력",
        "정기보수·안정화 프로젝트 리딩 경험",
    ],
    preferred=[
        "공정안전관리(PSM) 심사 대응 경험",
        "6시그마 벨트 보유",
        "위험물 관련 상위 자격 보유",
    ],
    add_tags=["SK.QM.SIXSIGMA", "SK.SOFT.TEAM"])

add("KR-IND04-JOB06-052",
    years="4~8년",
    responsibilities=[
        "핵심 해외 거래선 발굴 및 대형 계약 협상 총괄",
        "시장 진입 전략 수립 및 실행 리딩",
        "주니어 영업 담당자 육성",
    ],
    must=[
        "화학제품 해외영업 실무 4년 이상 경력",
        "대형 계약 협상을 리딩한 경험",
    ],
    preferred=[
        "신시장 개척 프로젝트 리딩 경험",
        "제3외국어 가능자",
        "장기 계약(오프테이크) 협상 경험",
    ],
    add_tags=["SK.BIZ.STRAT", "SK.SOFT.TEAM"])

# ============================================================
# IND05 — IT·플랫폼·SW
# ============================================================

add("KR-IND05-JOB05-015",
    years="4~8년",
    responsibilities=[
        "대규모 트래픽 서비스의 백엔드 아키텍처 설계 및 개선 총괄",
        "장애 대응 프로세스 구축 및 재발방지 대책 수립 리딩",
        "주니어 개발자 코드 리뷰 및 기술 멘토링",
    ],
    must=[
        "백엔드 개발 실무 4년 이상 경력",
        "서비스 아키텍처 설계를 리딩한 경험",
    ],
    preferred=[
        "대규모 트래픽 처리 경험",
        "오픈소스 메인테이너 또는 기술 블로그 등 대외 활동",
        "MSA 전환 프로젝트 경험",
    ],
    add_tags=["SK.DEV.DEVOPS", "SK.SOFT.TEAM"])

add("KR-IND05-JOB05-016",
    years="4~8년",
    responsibilities=[
        "제조 데이터 플랫폼 아키텍처 설계 및 고도화 총괄",
        "예지보전 모델 다중 사업장 확산 프로젝트 리딩",
        "현업 요구사항 우선순위화 및 로드맵 수립",
    ],
    must=[
        "데이터 엔지니어링 실무 4년 이상 경력",
        "플랫폼을 처음부터 끝까지 구축·운영한 경험",
    ],
    preferred=[
        "MLOps 파이프라인 구축 경험",
        "타 사업장 확산 리딩 경험",
        "클라우드 아키텍처 자격증(AWS/Azure) 보유",
    ],
    add_tags=["SK.DEV.DEVOPS", "SK.SOFT.TEAM"])

add("KR-IND05-JOB05-017",
    years="4~8년",
    responsibilities=[
        "ERP·회계 솔루션 아키텍처 설계 및 대형 고객사 커스터마이징 총괄",
        "성능 이슈 근본 원인 분석 및 DB 튜닝 리딩",
        "주니어 개발자 기술 멘토링",
    ],
    must=[
        "백엔드/솔루션 개발 실무 4년 이상 경력",
        "대형 고객 프로젝트를 리딩한 경험",
    ],
    preferred=[
        "대규모 DB 튜닝 경험",
        "클라우드 전환 프로젝트 경험",
        "PMP 등 프로젝트 관리 자격",
    ],
    add_tags=["SK.DEV.DEVOPS", "SK.SOFT.TEAM"])

add("KR-IND05-JOB05-053",
    years="4~8년",
    responsibilities=[
        "서비스 프론트엔드 아키텍처 설계 및 성능 최적화 총괄",
        "디자인 시스템 구축 및 전사 확산 리딩",
        "주니어 개발자 코드 리뷰 및 기술 멘토링",
    ],
    must=[
        "프론트엔드 개발 실무 4년 이상 경력",
        "아키텍처 설계를 리딩한 경험",
    ],
    preferred=[
        "디자인 시스템 구축 경험",
        "대규모 트래픽 서비스 성능 최적화 경험",
        "오픈소스 기여 이력",
    ],
    add_tags=["SK.DEV.DEVOPS", "SK.SOFT.TEAM"])

add("KR-IND05-JOB05-054",
    years="4~8년",
    responsibilities=[
        "커머스 데이터 플랫폼 아키텍처 설계 및 고도화 총괄",
        "데이터 품질 관리 체계 구축 리딩",
        "분석·ML 팀 대상 데이터 마트 로드맵 수립",
    ],
    must=[
        "데이터 엔지니어링 실무 4년 이상 경력",
        "플랫폼 아키텍처 설계 경험",
    ],
    preferred=[
        "대규모 분산처리 시스템 운영 경험",
        "클라우드 데이터 플랫폼 자격증 보유",
        "타 팀 대상 데이터 마트 로드맵 수립 경험",
    ],
    add_tags=["SK.DEV.DEVOPS", "SK.SOFT.TEAM"])

add("KR-IND05-JOB05-055",
    years="4~8년",
    responsibilities=[
        "고객사 클라우드 전환 아키텍처 설계 총괄",
        "인프라 자동화 체계 구축 및 비용 최적화 리딩",
        "주니어 엔지니어 기술 멘토링",
    ],
    must=[
        "클라우드 인프라 실무 4년 이상 경력",
        "전환 프로젝트를 리딩한 경험",
    ],
    preferred=[
        "AWS/Azure 상위 자격증 보유",
        "대형 고객사 컨설팅 리딩 경험",
        "IaC 기반 대규모 인프라 운영 경험",
    ],
    add_tags=["SK.SOFT.TEAM", "SK.BIZ.STRAT"])

add("KR-IND05-JOB05-056",
    years="4~8년",
    responsibilities=[
        "금융 서비스 백엔드 아키텍처 설계 및 트랜잭션 정합성 체계 고도화",
        "대규모 장애 대응 프로세스 구축 리딩",
        "주니어 개발자 코드 리뷰 및 기술 멘토링",
    ],
    must=[
        "서버 개발 실무 4년 이상 경력",
        "금융 서비스 아키텍처 설계 경험",
    ],
    preferred=[
        "대규모 트래픽 처리 경험",
        "장애 대응 프로세스 구축 리딩 경험",
        "오픈소스 기여 또는 기술 발표 이력",
    ],
    add_tags=["SK.DEV.DEVOPS", "SK.SOFT.TEAM"])

add("KR-IND05-JOB05-057",
    years="4~8년",
    responsibilities=[
        "게임 클라이언트 아키텍처 설계 및 성능 최적화 총괄",
        "신규 프로젝트 기술 스택 결정 및 팀 세팅 리딩",
        "주니어 개발자 코드 리뷰 및 기술 멘토링",
    ],
    must=[
        "게임 클라이언트 개발 실무 4년 이상 경력",
        "출시 프로젝트를 리딩한 경험",
    ],
    preferred=[
        "라이브 서비스 게임 운영 경험",
        "엔진 커스터마이징 경험",
        "출시작 포트폴리오 보유",
    ],
    add_tags=["SK.SOFT.TEAM", "SK.DEV.DEVOPS"])

add("KR-IND05-JOB05-058",
    years="4~8년",
    responsibilities=[
        "검색·추천 ML 모델 아키텍처 설계 및 서빙 체계 고도화",
        "대규모 학습 파이프라인 최적화 리딩",
        "논문/특허 등 연구 성과화 리딩",
    ],
    must=[
        "ML 엔지니어링 실무 4년 이상 경력",
        "모델을 실서비스에 적용·운영한 경험",
    ],
    preferred=[
        "논문 게재 또는 특허 출원 실적",
        "LLM 기반 서비스 적용 프로젝트 경험",
        "박사 학위 소지자",
    ],
    add_tags=["SK.EXP.PATENT", "SK.SOFT.TEAM"])

add("KR-IND05-JOB05-059",
    years="4~8년",
    responsibilities=[
        "침해사고 대응 프로세스 고도화 및 위협 인텔리전스 체계 구축",
        "주니어 분석가 육성 및 관제 품질 관리",
        "대외 보안 사고 대응 총괄",
    ],
    must=[
        "보안 관제·침해대응 실무 4년 이상 경력",
        "침해사고 대응을 리딩한 경험",
    ],
    preferred=[
        "CISSP 등 상위 보안 자격증 보유",
        "위협 인텔리전스 체계 구축 경험",
        "모의해킹·레드팀 경험",
    ],
    add_tags=["SK.DEV.DEVOPS", "SK.SOFT.TEAM"])

# ============================================================
# IND06 — 전자·전기부품
# ============================================================

add("KR-IND06-JOB01-060",
    years="4~8년",
    responsibilities=[
        "가전 제어 회로 신모델 설계 프로젝트 총괄",
        "EMC·안전규격 이슈 근본 원인 분석 및 설계 대책 수립",
        "협력사 부품 벤더 기술 검토 및 원가 절감 리딩",
    ],
    must=[
        "회로 설계 실무 4년 이상 경력",
        "설계 프로젝트 리딩 경험",
    ],
    preferred=[
        "특허 출원 실적",
        "벤더 원가 협상 경험",
        "해외 인증(UL 등) 대응 경험",
    ],
    add_tags=["SK.BIZ.IP", "SK.BIZ.SCM"])

add("KR-IND06-JOB01-063",
    years="4~8년",
    responsibilities=[
        "메모리 모듈용 패키지기판 신모델 설계 프로젝트 총괄",
        "고객 사양 협상 및 스택업 설계 의사결정",
        "양산 이관 시 공정 조건 확립 리딩",
    ],
    must=[
        "패키지기판 제품개발 실무 4년 이상 경력",
        "설계 프로젝트 리딩 경험",
    ],
    preferred=[
        "특허 출원 실적",
        "해외 고객사 기술 대응 경험",
        "도금·빌드업 공정 심화 이해",
    ],
    add_tags=["SK.BIZ.IP", "SK.SOFT.TEAM"])

add("KR-IND06-JOB02-018",
    years="4~9년",
    responsibilities=[
        "패키지기판 신공정 도입 프로젝트 리딩",
        "수율 개선 과제 기획 및 유관부서 조율",
        "차세대 기판(유리기판 등) 기술 검토 및 로드맵 수립",
    ],
    must=[
        "패키지기판 공정기술 실무 4년 이상 경력",
        "수율 개선 과제를 주도적으로 리딩한 경험",
    ],
    preferred=[
        "전해도금 심화 지식(첨가제 거동)",
        "6시그마 벨트 보유",
        "특허 출원 실적",
    ],
    add_tags=["SK.QM.SIXSIGMA", "SK.BIZ.IP"])

add("KR-IND06-JOB02-019",
    years="4~8년",
    responsibilities=[
        "전력기기 신제품 라인 셋업 프로젝트 총괄",
        "생산성 향상 과제 기획 및 유관부서 조율",
        "자동화 설비 벤더 기술 협상",
    ],
    must=[
        "생산기술 실무 4년 이상 경력",
        "라인 셋업 프로젝트 리딩 경험",
    ],
    preferred=[
        "IE 기법 기반 라인 재설계 경험",
        "설비 벤더 협상 경험",
        "전기기사 이상 자격 보유",
    ],
    add_tags=["SK.PROD.IE", "SK.BIZ.SCM"])

add("KR-IND06-JOB02-061",
    years="4~8년",
    responsibilities=[
        "MLCC 미세화 신공정 개발 프로젝트 리딩",
        "공정 산포 근본 원인 분석 및 개선 표준 수립",
        "신제품 양산 이관 기술 총괄",
    ],
    must=[
        "MLCC 공정기술 실무 4년 이상 경력",
        "신공정 개발 프로젝트 리딩 경험",
    ],
    preferred=[
        "6시그마 벨트 보유",
        "특허 출원 실적",
        "해외 생산법인 기술 이전 경험",
    ],
    add_tags=["SK.QM.SIXSIGMA", "SK.BIZ.IP"])

add("KR-IND06-JOB02-062",
    years="4~8년",
    responsibilities=[
        "카메라모듈 신모델 양산 이관 프로젝트 총괄",
        "광학 특성 산포 근본 원인 분석 및 개선 리딩",
        "협력사 부품 벤더 기술 검토",
    ],
    must=[
        "광학 공정기술 실무 4년 이상 경력",
        "양산 이관 프로젝트 리딩 경험",
    ],
    preferred=[
        "6시그마 벨트 보유",
        "특허 출원 실적",
        "해외 고객사 대응 경험",
    ],
    add_tags=["SK.QM.SIXSIGMA", "SK.BIZ.IP"])

add("KR-IND06-JOB02-064",
    years="4~8년",
    responsibilities=[
        "FPCB 신공정 도입 프로젝트 리딩",
        "수율 개선 과제 기획 및 실행",
        "고객사(모바일 세트업체) 기술 대응",
    ],
    must=[
        "FPCB 공정기술 실무 4년 이상 경력",
        "수율 개선 과제 리딩 경험",
    ],
    preferred=[
        "전해도금 공정 심화 경험",
        "6시그마 벨트 보유",
        "해외 고객사 대응 경험",
    ],
    add_tags=["SK.QM.SIXSIGMA", "SK.SOFT.TEAM"])

add("KR-IND06-JOB03-065",
    years="4~8년",
    responsibilities=[
        "시장 품질 이슈 근본 원인 분석 프로젝트 총괄",
        "품질경영시스템 고도화 및 협력사 감사 체계 구축",
        "6시그마 과제 발굴 및 팀 리딩",
    ],
    must=[
        "품질보증 실무 4년 이상 경력",
        "품질 이슈 대응을 리딩한 경험",
    ],
    preferred=[
        "6시그마 블랙벨트",
        "ISO 심사원 자격",
        "해외 협력사 대응 경험",
    ],
    add_tags=["SK.QM.SIXSIGMA", "SK.SOFT.TEAM"])

add("KR-IND06-JOB06-066",
    years="4~8년",
    responsibilities=[
        "핵심 고객사 대형 프로젝트 수주 협상 총괄",
        "시장 진입 전략 수립 및 실행 리딩",
        "주니어 영업 담당자 육성",
    ],
    must=[
        "기술영업 실무 4년 이상 경력",
        "대형 프로젝트 수주 협상 경험",
    ],
    preferred=[
        "신시장 개척 프로젝트 리딩 경험",
        "PM 자격 또는 프로젝트 관리 경험",
        "해외 영업 경험",
    ],
    add_tags=["SK.BIZ.STRAT", "SK.SOFT.TEAM"])

add("KR-IND06-JOB07-067",
    years="4~8년",
    responsibilities=[
        "채용·평가·보상 제도 설계 및 고도화 프로젝트 총괄",
        "조직문화 진단 결과 기반 개선 프로그램 기획 및 실행",
        "HR 데이터 분석 기반 의사결정 지원",
    ],
    must=[
        "인사 실무 4년 이상 경력",
        "제도 설계 프로젝트를 리딩한 경험",
    ],
    preferred=[
        "HR 데이터 분석 고도화 경험",
        "노무사 자격 또는 노동법 심화 지식",
        "조직개발(OD) 프로젝트 경험",
    ],
    add_tags=["SK.BIZ.STRAT", "SK.SOFT.TEAM"])

# ============================================================
# IND07 — 바이오·제약
# ============================================================

add("KR-IND07-JOB01-070",
    years="4~8년",
    responsibilities=[
        "신약 후보물질 발굴 프로젝트 리딩 및 합성 전략 수립",
        "특허 출원 전략 수립 및 대외 협력(공동연구) 리딩",
        "주니어 연구원 실험 설계 코칭",
    ],
    must=[
        "합성신약 연구 실무 4년 이상 경력",
        "후보물질 발굴 프로젝트 리딩 경험",
    ],
    preferred=[
        "특허 출원 다수 보유",
        "박사 학위 소지자",
        "해외 학회 발표 또는 논문 게재 실적",
    ],
    add_tags=["SK.EXP.PATENT", "SK.BIZ.IP"])

add("KR-IND07-JOB01-072",
    years="4~8년",
    responsibilities=[
        "신규 제형 개발 프로젝트 총괄 및 처방 전략 수립",
        "기술이전(라이선스아웃) 대응 및 계약 협의 지원",
        "규제기관 대응 문서 작성 총괄",
    ],
    must=[
        "제제연구 실무 4년 이상 경력",
        "제형 개발 프로젝트 리딩 경험",
    ],
    preferred=[
        "특허 출원 실적",
        "기술이전 프로젝트 참여 경험",
        "GMP 밸리데이션 리딩 경험",
    ],
    add_tags=["SK.EXP.PATENT", "SK.BIZ.IP"])

add("KR-IND07-JOB01-073",
    years="4~8년",
    responsibilities=[
        "임상시험 전체 단계 모니터링 총괄 및 CRO 관리",
        "규제기관(식약처) 대응 및 제출 문서 총괄",
        "주니어 CRA 육성 및 품질 관리",
    ],
    must=[
        "임상개발 실무 4년 이상 경력",
        "임상시험 전 단계 리딩 경험",
    ],
    preferred=[
        "글로벌 다국가 임상 참여 경험",
        "규제기관 대응 리딩 경험",
        "임상약리 관련 자격 보유",
    ],
    add_tags=["SK.SOFT.TEAM", "SK.BIZ.STRAT"])

add("KR-IND07-JOB01-074",
    years="4~8년",
    responsibilities=[
        "신규 진단시약 개발 프로젝트 총괄",
        "인허가(RA) 전략 수립 및 규제기관 대응 리딩",
        "특허 출원 전략 수립",
    ],
    must=[
        "진단시약 개발 실무 4년 이상 경력",
        "개발 프로젝트를 리딩한 경험",
    ],
    preferred=[
        "특허 출원 다수 보유",
        "해외 인허가(FDA/CE) 대응 경험",
        "박사 학위 소지자",
    ],
    add_tags=["SK.EXP.PATENT", "SK.BIZ.IP"])

add("KR-IND07-JOB03-020",
    years="4~8년",
    responsibilities=[
        "시험법 밸리데이션 프로젝트 총괄",
        "일탈 조사 리딩 및 CAPA 수립",
        "규제기관 실사 대응 및 문서 총괄",
    ],
    must=[
        "이화학분석 QC 실무 4년 이상 경력",
        "밸리데이션 프로젝트 리딩 경험",
    ],
    preferred=[
        "규제기관 실사 대응 경험",
        "GMP 심화 지식",
        "해외 고객사 품질 협의 경험",
    ],
    add_tags=["SK.SOFT.TEAM", "SK.BIZ.STRAT"])

add("KR-IND07-JOB03-069",
    years="4~8년",
    responsibilities=[
        "GMP 문서 체계 고도화 및 배치 기록 승인 총괄",
        "규제기관 실사 대응 리딩",
        "일탈·변경관리 프로세스 개선",
    ],
    must=[
        "품질보증(QA) 실무 4년 이상 경력",
        "규제기관 실사 대응 리딩 경험",
    ],
    preferred=[
        "해외 규제기관(FDA/EMA) 실사 대응 경험",
        "품질시스템 고도화 프로젝트 경험",
        "QA 관련 상위 자격 보유",
    ],
    add_tags=["SK.SOFT.TEAM", "SK.BIZ.STRAT"])

add("KR-IND07-JOB03-075",
    years="4~8년",
    responsibilities=[
        "해외 인허가 전략 수립 및 다국가 등록 프로젝트 총괄",
        "규제 변경사항 모니터링 체계 구축",
        "인증 유지·갱신 프로세스 고도화",
    ],
    must=[
        "의료기기 인허가(RA) 실무 4년 이상 경력",
        "해외 인허가 프로젝트 리딩 경험",
    ],
    preferred=[
        "ISO 13485 심사원 자격",
        "미국·유럽 인허가 등록 경험",
        "RAC 등 RA 전문 자격 보유",
    ],
    add_tags=["SK.SOFT.TEAM", "SK.BIZ.STRAT"])

add("KR-IND07-JOB04-068",
    years="4~8년",
    responsibilities=[
        "배양·정제 공정 스케일업 프로젝트 총괄",
        "일탈 근본 원인 분석 및 재발방지 대책 수립 리딩",
        "신규 라인 셋업 기술 지원",
    ],
    must=[
        "바이오 생산 실무 4년 이상 경력",
        "스케일업 프로젝트 리딩 경험",
    ],
    preferred=[
        "MSAT 연계 기술이전 경험",
        "GMP 심화 지식",
        "해외 규제기관 실사 대응 경험",
    ],
    add_tags=["SK.SOFT.TEAM", "SK.BIZ.STRAT"])

add("KR-IND07-JOB04-071",
    years="4~8년",
    responsibilities=[
        "신제품 생산 공정 이관·스케일업 프로젝트 총괄",
        "고객사 기술 협의 리딩 및 공정 파라미터 최적화",
        "주니어 엔지니어 기술 문서화 코칭",
    ],
    must=[
        "제조기술지원(MSAT) 실무 4년 이상 경력",
        "이관 프로젝트를 처음부터 끝까지 리딩한 경험",
    ],
    preferred=[
        "해외 고객사 기술 협의 리딩 경험",
        "통계 기반 공정 검증(PPQ) 경험",
        "특허 출원 실적",
    ],
    add_tags=["SK.EXP.PATENT", "SK.SOFT.TEAM"])

add("KR-IND07-JOB04-076",
    years="4~8년",
    responsibilities=[
        "의약품 생산 계획 프로세스 고도화 프로젝트 총괄",
        "생산성 개선 과제 기획 및 유관부서 조율",
        "ERP 시스템 고도화 리딩",
    ],
    must=[
        "생산관리 실무 4년 이상 경력",
        "프로세스 개선 프로젝트 리딩 경험",
    ],
    preferred=[
        "ERP 고도화 프로젝트 경험",
        "GMP 심화 지식",
        "SCM 벤더 관리 경험",
    ],
    add_tags=["SK.DEV.CLOUD", "SK.BIZ.SCM"])

# ============================================================
# IND08 — 건설·중공업·플랜트
# ============================================================

add("KR-IND08-JOB01-078",
    years="4~9년",
    responsibilities=[
        "화공 플랜트 상세설계 프로젝트 총괄 및 벤더 기술 검토 리딩",
        "해외 발주처 사양 협상 및 설계 변경 의사결정",
        "주니어 설계자 기술 검토 및 육성",
    ],
    must=[
        "플랜트 공정설계 실무 4년 이상 경력",
        "설계 프로젝트를 처음부터 끝까지 리딩한 경험",
    ],
    preferred=[
        "해외 현장 파견 경험",
        "기술사 자격 보유",
        "대형 EPC 프로젝트 PM 보조 경험",
    ],
    add_tags=["SK.SOFT.TEAM", "SK.BIZ.STRAT"])

add("KR-IND08-JOB01-079",
    years="4~9년",
    responsibilities=[
        "선박 신모델 기본설계 프로젝트 총괄",
        "선주 요구사항 협상 및 설계 변경 의사결정",
        "성능 해석 결과 기반 설계 개선 리딩",
    ],
    must=[
        "선박 기본설계 실무 4년 이상 경력",
        "설계 프로젝트 리딩 경험",
    ],
    preferred=[
        "선급(선박검사) 대응 경험",
        "특허 출원 실적",
        "해외 선주 기술 협상 경험",
    ],
    add_tags=["SK.BIZ.IP", "SK.SOFT.TEAM"])

add("KR-IND08-JOB01-081",
    years="4~9년",
    responsibilities=[
        "발전기자재 신모델 구조 설계 프로젝트 총괄",
        "성능·내구 검증 결과 기반 설계 의사결정",
        "제작 협력사 벤더 기술 검토 및 원가 관리",
    ],
    must=[
        "발전기자재 설계 실무 4년 이상 경력",
        "설계 프로젝트 리딩 경험",
    ],
    preferred=[
        "기술사 자격 보유",
        "해외 발주처 기술 협상 경험",
        "원가 절감 설계(VE) 경험",
    ],
    add_tags=["SK.CON.COST", "SK.SOFT.TEAM"])

add("KR-IND08-JOB01-083",
    years="4~9년",
    responsibilities=[
        "플랜트 전기 계통 상세설계 프로젝트 총괄",
        "해외 발주처 사양 협상 및 벤더 기술 검토 리딩",
        "현장 시운전 기술 총괄",
    ],
    must=[
        "플랜트 전기설계 실무 4년 이상 경력",
        "설계 프로젝트 리딩 경험",
    ],
    preferred=[
        "전기기술사 자격 보유",
        "해외 현장 파견 경험",
        "대형 EPC 프로젝트 참여 경험",
    ],
    add_tags=["SK.SOFT.TEAM", "SK.BIZ.STRAT"])

add("KR-IND08-JOB01-084",
    years="4~8년",
    responsibilities=[
        "건설기계 신모델 시스템 설계 프로젝트 총괄",
        "유압 시스템 성능 이슈 근본 원인 분석 및 설계 개선 리딩",
        "고객 요구 사양 협상 및 벤더 기술 검토",
    ],
    must=[
        "건설기계 개발 실무 4년 이상 경력",
        "설계 프로젝트 리딩 경험",
    ],
    preferred=[
        "특허 출원 실적",
        "해외 고객사 기술 대응 경험",
        "기술사 자격 보유",
    ],
    add_tags=["SK.BIZ.IP", "SK.SOFT.TEAM"])

add("KR-IND08-JOB02-077",
    years="4~9년",
    responsibilities=[
        "건축 현장 공정·품질·안전 관리 총괄(현장 대리인급)",
        "협력업체 계약 관리 및 원가 절감 과제 리딩",
        "주니어 현장 담당자 육성",
    ],
    must=[
        "건축 시공관리 실무 4년 이상 경력",
        "현장 단위 총괄 관리 경험",
    ],
    preferred=[
        "건축시공기술사 또는 건설안전기술사",
        "대형 현장 소장 보좌 경험",
        "BIM 기반 공정 관리 심화 경험",
    ],
    add_tags=["SK.BIZ.SCM", "SK.SOFT.TEAM"])

add("KR-IND08-JOB02-082",
    years="4~9년",
    responsibilities=[
        "토목 현장 공정·품질 관리 총괄(현장 대리인급)",
        "지반·구조물 시공 리스크 진단 및 대책 수립 리딩",
        "협력사 계약·원가 관리",
    ],
    must=[
        "토목 시공관리 실무 4년 이상 경력",
        "현장 단위 총괄 관리 경험",
    ],
    preferred=[
        "토목시공기술사 보유",
        "대형 현장 소장 보좌 경험",
        "해외 현장 근무 경험",
    ],
    add_tags=["SK.BIZ.SCM", "SK.SOFT.TEAM"])

add("KR-IND08-JOB04-080",
    years="4~8년",
    responsibilities=[
        "선박 건조 공정 계획 고도화 및 다중 프로젝트 진도 관리 총괄",
        "공정 지연 근본 원인 분석 및 재발방지 대책 수립",
        "블록 물량·인력 배분 최적화 모델 고도화",
    ],
    must=[
        "생산관리(조선) 실무 4년 이상 경력",
        "다중 프로젝트 진도 관리 경험",
    ],
    preferred=[
        "IE 기법 기반 공정 시뮬레이션 고도화 경험",
        "PMP 등 프로젝트 관리 자격",
        "해외 발주처 대응 경험",
    ],
    add_tags=["SK.SOFT.TEAM", "SK.BIZ.STRAT"])

add("KR-IND08-JOB04-085",
    years="4~8년",
    responsibilities=[
        "현장 위험성 평가 체계 고도화 및 안전보건 관리 총괄",
        "사고 발생 시 원인 조사 리딩 및 재발방지 대책 수립",
        "중대재해처벌법 대응 체계 구축",
    ],
    must=[
        "안전보건관리(SHE) 실무 4년 이상 경력",
        "안전 관리 체계를 리딩한 경험",
    ],
    preferred=[
        "건설안전기술사 보유",
        "중대재해처벌법 대응 실무 경험",
        "전국 현장 순회 관리 경험",
    ],
    add_tags=["SK.SOFT.TEAM", "SK.BIZ.STRAT"])

add("KR-IND08-JOB07-086",
    years="4~8년",
    responsibilities=[
        "대형 프로젝트 입찰 견적 총괄 및 실행예산 관리",
        "협력사 견적 검토 및 원가 절감 과제 리딩",
        "수주 리스크 분석 및 임원 보고",
    ],
    must=[
        "견적·원가관리 실무 4년 이상 경력",
        "대형 프로젝트 견적을 총괄한 경험",
    ],
    preferred=[
        "적산 관련 기술사 자격 보유",
        "해외 프로젝트 견적 경험",
        "영어 비즈니스 문서 대응 가능자",
    ],
    add_tags=["SK.BIZ.STRAT", "SK.SOFT.TEAM"])

print(f"전체 delta 등록 완료: {len(CAREER_DELTA)}건 (기대값 86)")
missing = [e["jd_id"] for e in ENTRIES if e["jd_id"] not in CAREER_DELTA]
if missing:
    print("!! 누락된 jd_id:", missing)
    raise SystemExit(1)


def build_career_entry(base, delta):
    """base(신입 항목) + delta(경력 델타) → 완전한 경력 JD 레코드."""
    career_id = base["jd_id"] + "X"
    posting = base["posting"]
    return {
        "jd_id": career_id,
        "pair_id": base["jd_id"],
        "verification": "C",
        "collected_at": CAREER_COLLECTED_AT,
        "source_url": base["source_url"],
        "company": base["company"],
        "posting": {
            "title": posting["title"] + " (경력)",
            "job_l1": posting["job_l1"],
            "job_l2": posting["job_l2"],
            "employment_type": posting["employment_type"],
            "career_level": "경력",
            "experience_years": delta["years"],
            "hiring_type": delta.get("hiring_type", "수시채용"),
            "education_min": posting["education_min"],
            "majors": posting["majors"],
            "locations": posting["locations"],
        },
        "requirements": {
            "responsibilities": delta["responsibilities"],
            "must": delta["must"],
            "preferred": delta["preferred"],
        },
        "competency_tags": base["competency_tags"] + [
            t for t in delta["add_tags"] if t not in base["competency_tags"]
        ],
        "screening": base["screening"],
        "essay_types": base["essay_types"],
        "notes": delta.get("notes", ""),
    }


# 신입 항목에도 pair_id를 채워 페어링을 명시적으로 만든다.
entry_records = []
for e in ENTRIES:
    e2 = dict(e)
    e2["pair_id"] = e["jd_id"]
    entry_records.append(e2)

career_records = [build_career_entry(e, CAREER_DELTA[e["jd_id"]]) for e in ENTRIES]

# 화면/코퍼스에서 신입-경력이 짝을 이뤄 보이도록 신입 바로 뒤에 경력을 둔다.
combined = []
for e, c in zip(entry_records, career_records):
    combined.append(e)
    combined.append(c)

with open(OUT_JSON, "w", encoding="utf-8") as f:
    json.dump(combined, f, ensure_ascii=False, indent=2)
print(f"작성: {OUT_JSON} ({len(combined)}건)")

with open(OUT_JSONL, "w", encoding="utf-8") as f:
    for rec in combined:
        f.write(json.dumps(rec, ensure_ascii=False) + "\n")
print(f"작성: {OUT_JSONL} ({len(combined)}건)")
