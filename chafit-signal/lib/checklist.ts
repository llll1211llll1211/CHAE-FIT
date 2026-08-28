export type ChecklistItem = {
  id: string;
  title: string;
  meta: string;
  addedFrom: string;
};

const KEY = "chafit:checklist";

export function getChecklist(): ChecklistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ChecklistItem[]) : [];
  } catch {
    return [];
  }
}

export function addChecklistItem(item: Omit<ChecklistItem, "id">): boolean {
  if (typeof window === "undefined") return false;
  const list = getChecklist();
  if (list.some((i) => i.title === item.title)) return false;
  const next = [...list, { ...item, id: `${Date.now()}-${item.title}` }];
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return true;
}

export function removeChecklistItem(id: string) {
  if (typeof window === "undefined") return;
  const next = getChecklist().filter((i) => i.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(next));
}
