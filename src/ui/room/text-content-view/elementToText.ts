import { isUndefined } from "@mjt-engine/object";

type HastElement = {
  type: string;
  value?: string;
  children: unknown[];
};

export const elementToText = (element?: HastElement): string => {
  if (isUndefined(element)) {
    return "";
  }
  if (element.children) {
    return element.children
      .map((child) => elementToText(child as HastElement))
      .join("");
  }
  if (element.type === "text") {
    return element.value ?? "";
  }
  return "";
};
