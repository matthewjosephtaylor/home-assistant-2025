import type { ChatAstSpec } from "./ChatAstSpec";
import type { ChatEvaluator } from "./ChatEvaluator";

/* ---------------------------------------
      7) A simple evaluator implementation
      ---------------------------------------
      We'll do two things:
        - replace mentions with something like "@<user>"
        - remove slash commands entirely
        - leave text as-is
   -----------------------------------------*/

export function evaluateProgram(
  program: ChatAstSpec["Program"],
  evaluator: ChatEvaluator
): string {
  // For a simple single-line program, program.lines has exactly one line in our current code.
  // If you want multiple lines, you'd iterate them all.
  const [line] = program.lines;

  // Evaluate each token
  const transformedTokens = line.tokens.map((token) => {
    switch (token.type) {
      case "mention":
        return evaluator.handleMention(token);
      case "command":
        return evaluator.handleCommand(token);
      case "text":
        return evaluator.handleText(token);
    }
  });

  // Join them with spaces or empty string.
  // Possibly you want the original whitespace: you can store whitespace in the AST, etc.
  return transformedTokens.join(" ");
}

