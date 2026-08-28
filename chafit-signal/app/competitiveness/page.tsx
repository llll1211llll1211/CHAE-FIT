"use client";

import FieldSwitcher from "@/components/FieldSwitcher";
import { useTargetField } from "@/lib/targetField";
import type { CompetitivenessItem } from "@/lib/jobFields";
import styles from "./competitiveness.module.css";

const AXIS_COLORS = ["#1f8350", "#be123c", "#7c3aed", "#b45309", "#2563eb", "#0891b2"];

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function RadarChart({ items }: { items: CompetitivenessItem[] }) {
  const n = items.length;
  const cx = 140;
  const cy = 122;
  const maxR = 78;
  const rings = [0.25, 0.5, 0.75, 1];

  const dataPoints = items.map((it, i) =>
    polar(cx, cy, maxR * (Math.max(0, Math.min(100, it.thickness)) / 100), (360 / n) * i)
  );

  return (
    <svg viewBox="0 0 280 250" className={styles.radarSvg} role="img" aria-label="역량 레이더 차트">
      {rings.map((ring) => {
        const pts = items
          .map((_, i) => polar(cx, cy, maxR * ring, (360 / n) * i))
          .map((p) => `${p.x},${p.y}`)
          .join(" ");
        return <polygon key={ring} points={pts} className={styles.radarRing} />;
      })}

      {items.map((_, i) => {
        const p = polar(cx, cy, maxR, (360 / n) * i);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} className={styles.radarAxis} />;
      })}

      <polygon
        points={dataPoints.map((p) => `${p.x},${p.y}`).join(" ")}
        className={styles.radarShape}
      />

      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3.5} fill={AXIS_COLORS[i % AXIS_COLORS.length]} />
      ))}

      {items.map((it, i) => {
        const p = polar(cx, cy, maxR + 30, (360 / n) * i);
        const anchor = p.x < cx - 4 ? "end" : p.x > cx + 4 ? "start" : "middle";
        return (
          <text key={it.title} x={p.x} y={p.y} textAnchor={anchor} className={styles.radarLabel}>
            {it.title}
          </text>
        );
      })}
    </svg>
  );
}

export default function CompetitivenessPage() {
  const field = useTargetField();
  const items = field.competitiveness.items;

  return (
    <div className="wrap">
      <FieldSwitcher />

      <div className="pageHead">
        <div className="pageCrumb">경쟁력 비교</div>
        <h1 className="pageTitle">{field.label} 요구사항 대비 내 위치</h1>
        <p className="pageSub">
          다른 지원자나 또래와 비교하지 않습니다. 비교 대상은 공고에 적힌
          요구사항뿐입니다. 막대는 이력서에서 확인된 근거의 두께이며 실력
          점수가 아닙니다.
        </p>
      </div>

      <div className={styles.panels}>
        <div className={`card ${styles.radarCard}`}>
          <div className={styles.panelTitle}>{field.label} 역량 지도</div>
          <RadarChart items={items} />
          <div className={styles.chipRow}>
            {items.map((it, i) => {
              const color = AXIS_COLORS[i % AXIS_COLORS.length];
              return (
                <span
                  key={it.title}
                  className={styles.chip}
                  style={{
                    background: `color-mix(in srgb, ${color} 14%, var(--bg-raised))`,
                    color: `color-mix(in srgb, ${color} 70%, black)`,
                  }}
                >
                  {it.title} {it.thickness}
                </span>
              );
            })}
          </div>
        </div>

        <div className={`card ${styles.evidenceCard}`}>
          <div className={styles.panelTitle}>근거 두께로 다시 보면</div>
          <div className={styles.legend}>
            <span className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.legendFreq}`} />
              공고 등장 빈도
            </span>
            <span className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.legendThick}`} />
              내 근거 두께
            </span>
          </div>

          <div className={styles.evidenceList}>
            {items.map((it) => (
              <div className={styles.evidenceRow} key={it.title}>
                <div className={styles.evidenceHead}>
                  <span className={styles.evidenceTitle}>{it.title}</span>
                  <span className={it.evidence ? styles.evidenceGood : styles.evidenceBad}>
                    {it.evidence ? "근거 있음" : "근거 없음"}
                  </span>
                </div>
                <div className={styles.track}>
                  <div className={styles.fillFreq} style={{ width: `${it.freq}%` }} />
                </div>
                <div className={styles.track}>
                  <div
                    className={it.evidence ? styles.fillGood : styles.fillBad}
                    style={{ width: `${it.thickness}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className={styles.evidenceNote}>
            빈 항목은 실력이 없어서가 아니라 아직 문장으로 적지 않은 것일 수
            있습니다.
          </p>
        </div>
      </div>

      <div className={styles.bottomGrid}>
        <div className="card">
          <div className={styles.bottomTitle}>지금 상태</div>
          <p className={styles.bottomBody}>
            자주 나오는 항목은 대부분 근거 있음. 비어 있는 항목은 절반
            정도의 공고에만 나옵니다.
          </p>
        </div>
        <div className="card">
          <div className={styles.bottomTitle}>3학년 2학기에 할 것</div>
          <div className={styles.bottomBody}>
            <ol>
              <li>실습·프로젝트 산출물 정리 (2주)</li>
              <li>비어 있는 항목을 스터디로 채우기 (1학기)</li>
              <li>4학년 1학기에 재진단</li>
            </ol>
          </div>
        </div>
        <div className="card">
          <div className={styles.bottomTitle}>2~3년 뒤</div>
          <p className={styles.bottomBody}>
            지금 3학년이면 이 지도를 여섯 학기 동안 씁니다. 항목이 채워지는
            순서가 그대로 준비 기록이 됩니다.
          </p>
        </div>
      </div>

      <p className={styles.refNote}>참고 지표 · 가중 커버리지 {field.competitiveness.refScore} · 추정치</p>
    </div>
  );
}
