import * as P from "parsimmon";
import type { ChatLoc } from "./ChatLoc";

/* ---------------------------------------
      3) "mark" function to capture start/end
      --------------------------------------- */

export function mark<T>(
  parser: P.Parser<T>
): P.Parser<{ value: T; loc: ChatLoc }> {
  return P.index.chain((start) =>
    parser.chain((value) =>
      P.index.map((end) => ({
        value,
        loc: { start, end },
      }))
    )
  );
}
