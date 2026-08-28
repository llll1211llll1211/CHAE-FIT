"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  FileText,
  ChatsCircle,
  Compass,
  Newspaper,
  Target,
  ListChecks,
  Star,
  NotePencil,
  Briefcase,
  ClockCounterClockwise,
  CheckSquare,
  ChartLineUp,
  Signpost,
} from "@phosphor-icons/react";
import Mark from "./Mark";
import Mascot from "./Mascot";
import styles from "./Sidebar.module.css";
import { useTargetField } from "@/lib/targetField";

const GROUPS: {
  label: string;
  items: { href: string; label: string; icon: React.ComponentType<{ size?: number; weight?: "regular" | "bold" | "fill" }> }[];
}[] = [
  {
    label: "시작",
    items: [
      { href: "/", label: "시작", icon: House },
      { href: "/start", label: "시작 방법 고르기", icon: Signpost },
    ],
  },
  {
    label: "내 경험 정리",
    items: [
      { href: "/resume", label: "이력서", icon: FileText },
      { href: "/interview", label: "문답 정리", icon: ChatsCircle },
      { href: "/job-map", label: "직무 지도", icon: Compass },
    ],
  },
  {
    label: "적합도 진단",
    items: [
      { href: "/posting", label: "공고 요약", icon: Newspaper },
      { href: "/diagnosis", label: "적합도 진단", icon: Target },
      { href: "/gap-report", label: "갭 리포트", icon: ListChecks },
    ],
  },
  {
    label: "활용",
    items: [
      { href: "/companies", label: "관심 기업", icon: Star },
      { href: "/cover-letter", label: "자소서", icon: NotePencil },
      { href: "/portfolio", label: "포트폴리오", icon: Briefcase },
    ],
  },
  {
    label: "내 기록",
    items: [
      { href: "/history", label: "진단 이력", icon: ClockCounterClockwise },
      { href: "/checklist", label: "체크리스트", icon: CheckSquare },
      { href: "/competitiveness", label: "내 역량", icon: ChartLineUp },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const field = useTargetField();
  const [done, total] = field.diagnosis.coverage.split("/").map(Number);
  const [debugPct, setDebugPct] = useState<number | null>(null);
  const pct = debugPct ?? Math.min(100, Math.round((done / total) * 100));

  return (
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.brand}>
        <Mark size={20} />
        <span>chafit</span>
      </Link>
      <nav className={styles.nav}>
        {GROUPS.map((group) => (
          <div key={group.label}>
            <div className={styles.groupLabel}>{group.label}</div>
            {group.items.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.link} ${active ? styles.linkActive : ""}`}
                >
                  <Icon size={17} weight={active ? "fill" : "regular"} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <Link href="/diagnosis" className={styles.scoreCard}>
        <div className={styles.scoreHead}>
          <Mascot pct={pct} />
          <div className={styles.scoreHeadText}>
            <div className={styles.scoreTop}>
              <span className={styles.scoreLabel}>내 적합도</span>
              <span className={styles.scorePct}>{pct}%</span>
            </div>
            <div className={styles.scoreTrack}>
              <div className={styles.scoreFill} style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
        <div className={styles.scoreSub}>
          {field.diagnosis.company} · {field.diagnosis.coverage}
        </div>
      </Link>
      {process.env.NODE_ENV === "development" && (
        <button
          type="button"
          onClick={() =>
            setDebugPct((p) => {
              const steps = [10, 40, 65, 85, 100];
              const i = p === null ? -1 : steps.indexOf(p);
              return steps[(i + 1) % steps.length];
            })
          }
          style={{
            margin: "2px 16px 8px",
            padding: "4px 8px",
            fontSize: 11,
            opacity: 0.5,
            border: "1px dashed var(--line)",
            borderRadius: 4,
            background: "transparent",
            cursor: "pointer",
          }}
        >
          마스코트 성장 테스트 (dev)
        </button>
      )}
      <div className={styles.foot}>회원가입 없이 세션 동안 이용합니다.</div>
    </aside>
  );
}
