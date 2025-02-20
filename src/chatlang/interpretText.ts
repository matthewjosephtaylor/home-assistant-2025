import type { ChatEvaluator } from "./ChatEvaluator";
import { evaluateProgram } from "./evaluateProgram";
import { SimpleEvaluator } from "./SimpleEvaluator";
import { parseProgram } from "./parseProgram";

export const interpretText = (
  text: string,
  evaluator: ChatEvaluator = SimpleEvaluator
) => {
  const ast = parseProgram(text);
  return evaluateProgram(ast, evaluator);
};
