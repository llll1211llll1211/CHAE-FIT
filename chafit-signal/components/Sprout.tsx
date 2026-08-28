"use client";

import Link from "next/link";
import Mascot from "./Mascot";
import styles from "./Sprout.module.css";

export default function Sprout() {
  return (
    <Link href="/start" className={styles.wrap} aria-label="시작 방법 고르기로 이동">
      <div className={styles.row}>
        <div className={styles.big}>
          <Mascot pct={60} />
        </div>

        <div className={styles.bubble}>
          안녕하세요! 공고 기준으로 내 위치, 같이 확인해볼까요?
          <span className={styles.tail} aria-hidden="true" />
        </div>
      </div>

      <span className={styles.hint}>눌러서 시작하기</span>
    </Link>
  );
}
