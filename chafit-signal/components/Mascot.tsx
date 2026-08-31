"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Mascot.module.css";

const STAGE_SCALE = [0.55, 0.72, 0.88, 1.0, 1.16];
const STAGE_COUNT = STAGE_SCALE.length;

function getStage(pct: number) {
  if (pct >= 100) return 4;
  if (pct >= 75) return 3;
  if (pct >= 50) return 2;
  if (pct >= 25) return 1;
  return 0;
}

export default function Mascot({ pct }: { pct: number }) {
  const stage = getStage(pct);
  const grown = stage >= 1;
  const prevStage = useRef(stage);
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    if (stage > prevStage.current) {
      setCelebrating(true);
      const timer = setTimeout(() => setCelebrating(false), 700);
      prevStage.current = stage;
      return () => clearTimeout(timer);
    }
    prevStage.current = stage;
  }, [stage]);

  return (
    <span
      className={`${styles.mascotBox} ${celebrating ? styles.celebrating : ""}`}
      role="img"
      aria-label={`성장 캐릭터 (적합도 ${pct}%, ${stage + 1}/${STAGE_COUNT}단계)`}
    >
      <span
        className={styles.grow}
        style={{ ["--mascot-scale" as string]: STAGE_SCALE[stage] }}
      >
        <span className={styles.stem} />
        <span className={styles.leafLeft} />
        <span className={styles.leafRight} />
        {stage === 3 && <span className={styles.bud} />}
        {stage >= 4 && (
          <span className={styles.bloom} aria-hidden="true">
            <span className={styles.petal} />
            <span className={styles.petal} />
            <span className={styles.petal} />
            <span className={styles.petal} />
            <span className={styles.petalCenter} />
          </span>
        )}
        <span className={`${styles.body} ${stage >= 4 ? styles.bodyBloom : ""}`} />
        {grown ? (
          <>
            <span className={`${styles.eye} ${styles.eyeLeft}`} />
            <span className={`${styles.eye} ${styles.eyeRight}`} />
            <span className={`${styles.mouth} ${stage >= 4 ? styles.mouthBig : ""}`} />
          </>
        ) : (
          <>
            <span className={`${styles.eyeClosed} ${styles.eyeLeft}`} />
            <span className={`${styles.eyeClosed} ${styles.eyeRight}`} />
          </>
        )}
        {stage >= 2 && (
          <>
            <span className={`${styles.cheek} ${styles.cheekLeft}`} />
            <span className={`${styles.cheek} ${styles.cheekRight}`} />
          </>
        )}
      </span>
      {celebrating && (
        <span className={styles.sparkles} aria-hidden="true">
          <span className={styles.sparkle} />
          <span className={styles.sparkle} />
          <span className={styles.sparkle} />
          <span className={styles.sparkle} />
        </span>
      )}
    </span>
  );
}
