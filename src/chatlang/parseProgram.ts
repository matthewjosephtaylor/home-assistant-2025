import { type ChatAstSpec } from "./ChatAstSpec";
import { ChatLang } from "./ChatLang";

/* ---------------------------------------
      5) Helper to parse a string into Program
      --------------------------------------- */

export function parseProgram(input: string): ChatAstSpec["Program"] {
  // we parse the "Program" rule from ChatLang
  const result = ChatLang.Program.parse(input);
  if (result.status) {
    return result.value;
  }
  throw new Error(`Parse Error: ${result.expected.join(" or ")}`);
}
