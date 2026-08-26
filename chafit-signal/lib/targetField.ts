"use client";

import { useEffect, useState } from "react";
import { CUSTOM_FIELD_ID, FIELD_PRESETS, FieldPreset, buildCustomField } from "./jobFields";

const ID_KEY = "chafit:targetFieldId";
const LABEL_KEY = "chafit:targetFieldLabel";

export function getTargetFieldId(): string {
  if (typeof window === "undefined") return FIELD_PRESETS[0].id;
  return window.localStorage.getItem(ID_KEY) || FIELD_PRESETS[0].id;
}

export function getTargetFieldLabel(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(LABEL_KEY) || "";
}

export function setTargetField(id: string, customLabel?: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ID_KEY, id);
  if (id === CUSTOM_FIELD_ID && customLabel) {
    window.localStorage.setItem(LABEL_KEY, customLabel);
  }
  window.dispatchEvent(new Event("chafit:targetFieldChange"));
}

export function getCurrentField(): FieldPreset {
  const id = getTargetFieldId();
  if (id === CUSTOM_FIELD_ID) {
    return buildCustomField(getTargetFieldLabel());
  }
  return FIELD_PRESETS.find((f) => f.id === id) ?? FIELD_PRESETS[0];
}

export function useTargetField(): FieldPreset {
  const [field, setField] = useState<FieldPreset>(FIELD_PRESETS[0]);

  useEffect(() => {
    setField(getCurrentField());
    function handle() {
      setField(getCurrentField());
    }
    window.addEventListener("chafit:targetFieldChange", handle);
    window.addEventListener("storage", handle);
    return () => {
      window.removeEventListener("chafit:targetFieldChange", handle);
      window.removeEventListener("storage", handle);
    };
  }, []);

  return field;
}
