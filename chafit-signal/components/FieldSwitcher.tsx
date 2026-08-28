"use client";

import { useState } from "react";
import { CUSTOM_FIELD_ID, FIELD_PRESETS } from "@/lib/jobFields";
import { getTargetFieldId, getTargetFieldLabel, setTargetField, useTargetField } from "@/lib/targetField";
import styles from "./FieldSwitcher.module.css";

export default function FieldSwitcher() {
  const current = useTargetField();
  const [customDraft, setCustomDraft] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  function choosePreset(id: string) {
    setShowCustomInput(false);
    setTargetField(id);
  }

  function openCustom() {
    setCustomDraft(getTargetFieldId() === CUSTOM_FIELD_ID ? getTargetFieldLabel() : "");
    setShowCustomInput(true);
  }

  function submitCustom() {
    const label = customDraft.trim();
    if (!label) return;
    setTargetField(CUSTOM_FIELD_ID, label);
    setShowCustomInput(false);
  }

  const isCustomActive = current.id === CUSTOM_FIELD_ID;

  return (
    <div className={styles.wrap}>
      <span className={styles.label}>목표 직무</span>
      <div className={styles.chips}>
        {FIELD_PRESETS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`${styles.chip}${current.id === f.id ? ` ${styles.chipActive}` : ""}`}
            onClick={() => choosePreset(f.id)}
          >
            {f.label}
          </button>
        ))}
        <button
          type="button"
          className={`${styles.chip}${isCustomActive ? ` ${styles.chipActive}` : ""}`}
          onClick={openCustom}
        >
          {isCustomActive ? current.label : "직접 입력"}
        </button>
      </div>

      {showCustomInput && (
        <div className={styles.customRow}>
          <input
            className="textInput"
            style={{ maxWidth: 260 }}
            placeholder="예: 인사(HR), 재무, 영상 PD..."
            value={customDraft}
            autoFocus
            onChange={(e) => setCustomDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitCustom()}
          />
          <button type="button" className="btn btn-primary btn-sm" onClick={submitCustom}>
            적용
          </button>
        </div>
      )}
    </div>
  );
}
