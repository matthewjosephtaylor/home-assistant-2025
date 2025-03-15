import { useAppState } from "./AppState";

export const focusTextEntry = () => {
  const textEntryElement = useAppState.getState().textEntryElement;
  setTimeout(() => {
    textEntryElement?.focus();
    console.log("Focused text entry");
  }, 0);
};
