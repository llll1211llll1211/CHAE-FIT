"use client";

import { useEffect, useState } from "react";
import { CheckSquare, Trash, ListChecks } from "@phosphor-icons/react";
import { getChecklist, removeChecklistItem, type ChecklistItem } from "@/lib/checklist";
import styles from "./checklist.module.css";

export default function ChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[] | null>(null);

  useEffect(() => {
    setItems(getChecklist());
  }, []);

  function handleRemove(id: string) {
    removeChecklistItem(id);
    setItems(getChecklist());
  }

  return (
    <div className="wrap">
      <div className="pageHead">
        <div className="pageCrumb">체크리스트</div>
        <h1 className="pageTitle">담아둔 보완 활동</h1>
        <p className="pageSub">
          갭 리포트에서 담은 활동이 여기에 모입니다. 계정 없이 이 브라우저에만
          저장됩니다.
        </p>
      </div>

      {items === null ? null : items.length === 0 ? (
        <div className={styles.empty}>
          <ListChecks size={30} className={styles.emptyIcon} />
          <div className={styles.emptyTitle}>아직 담은 항목이 없습니다</div>
          <p className={styles.emptyBody}>갭 리포트에서 보완 활동을 담아보세요.</p>
          <a href="/gap-report" className="btn btn-primary btn-sm">
            갭 리포트로 가기
          </a>
        </div>
      ) : (
        <div className={styles.list}>
          {items.map((item) => (
            <div className={styles.item} key={item.id}>
              <CheckSquare size={20} weight="fill" style={{ color: "var(--accent)", flexShrink: 0 }} />
              <div className={styles.itemBody}>
                <div className={styles.itemTitle}>{item.title}</div>
                <div className={styles.itemMeta}>
                  {item.meta} · {item.addedFrom}
                </div>
              </div>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => handleRemove(item.id)}
                aria-label="삭제"
              >
                <Trash size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
