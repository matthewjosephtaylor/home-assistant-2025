/* ================================
   chatLanguageWithEvaluator.ts
   ================================ */
/* ---------------------------------------
      1) Define location (start/end) structures
      --------------------------------------- */
/** Matches Parsimmon.Index structure. */
export type ChatIndex = {
  offset: number;
  line: number;
  column: number;
};
