"use client";

import { useState } from "react";
import { Bell, BellRinging, Plus } from "@phosphor-icons/react";
import styles from "./companies.module.css";

const ROWS = [
  {
    role: "반도체 공정기술",
    company: "삼성전자 DS",
    coverage: "9 / 12",
    delta: "+1 항목",
    verdict: "대부분 충족",
    verdictTone: "good",
    next: "파이썬, SPC · 영어 문서",
    alertOn: true,
  },
  {
    role: "소재 개발",
    company: "SK하이닉스",
    coverage: "7 / 11",
    delta: "+1 항목",
    verdict: "대부분 충족",
    verdictTone: "good",
    next: "파이썬, 소재 분석 장비 · 논문 독해",
    alertOn: false,
  },
  {
    role: "공정 엔지니어",
    company: "LG이노텍",
    coverage: "5 / 12",
    delta: "+1 항목",
    verdict: "부분 충족",
    verdictTone: "warn",
    next: "데이터 분석, 양산 공정 이해 · 설비 실습",
    alertOn: false,
  },
  {
    role: "품질 관리",
    company: "DB하이텍",
    coverage: "4 / 10",
    delta: "변화 없음",
    verdict: "확인 필요",
    verdictTone: "bad",
    next: "SPC · 품질 자격",
    alertOn: false,
  },
  {
    role: "백엔드 개발",
    company: "네이버",
    coverage: "7 / 11",
    delta: "+1 항목",
    verdict: "대부분 충족",
    verdictTone: "good",
    next: "클라우드 배포, 오픈소스 · 코딩테스트",
    alertOn: false,
  },
];

export default function CompaniesPage() {
  const [alerts, setAlerts] = useState(ROWS.map((r) => r.alertOn));

  return (
    <div className="wrap">
      <div className={styles.headRow}>
        <div>
          <div className="pageCrumb">관심 기업</div>
          <h1 className="pageTitle">관심 기업 5곳의 커버리지를 추적합니다</h1>
        </div>
        <button type="button" className="btn btn-primary btn-sm">
          <Plus size={16} weight="bold" />
          공고 추가
        </button>
      </div>

      <div className={styles.statsStrip}>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>경험 1개 추가 후</div>
          <div className={styles.statBody}>3곳 항목 증가</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>마감 임박</div>
          <div className={styles.statBody}>2건 · 7일 내</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>여러 곳에서 공통으로 비어 있음</div>
          <div className={styles.statBody}>데이터 분석 · 협업/문서 역량</div>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>기업 · 직무</th>
              <th>커버리지</th>
              <th>판정</th>
              <th>다음에 채울 항목</th>
              <th>알림</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr key={row.company}>
                <td>
                  <div className={styles.companyName}>{row.company}</div>
                  <div className={styles.roleName}>{row.role}</div>
                </td>
                <td>
                  <span className={styles.coverage}>{row.coverage}</span>
                  <span className={row.delta === "변화 없음" ? styles.coverageFlat : styles.coverageDelta}>
                    {row.delta}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      row.verdictTone === "good"
                        ? "badge-good"
                        : row.verdictTone === "warn"
                        ? "badge-warn"
                        : "badge-bad"
                    }`}
                  >
                    {row.verdict}
                  </span>
                </td>
                <td className={styles.nextItems}>{row.next}</td>
                <td>
                  <button
                    type="button"
                    className={`${styles.alertBtn}${alerts[i] ? ` ${styles.alertBtnOn}` : ""}`}
                    onClick={() =>
                      setAlerts((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
                    }
                  >
                    {alerts[i] ? <BellRinging size={14} weight="fill" /> : <Bell size={14} />}
                    {alerts[i] ? "알림 켜짐" : "알림 받기"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className={styles.footNote}>
        커버리지는 각 공고의 요구 항목 수를 분모로 한 chafit 내부 계산입니다.
        기업마다 항목 수가 달라 비율의 뜻이 같지 않으며, 기업 간 비교나
        합격 가능성 예측에 쓸 수 없습니다. 공고 원문 변경은 자동 반영되지
        않습니다.
      </p>
    </div>
  );
}
