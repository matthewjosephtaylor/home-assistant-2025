import type { ChatAstSpec } from "./ChatAstSpec";

/* ---------------------------------------
      6) Define an evaluator type
      ---------------------------------------
      We'll keep it flexible: for each node type,
      you can define how to handle it.
      
      E.g. maybe you want side effects or a
      transformation for each node.
   -----------------------------------------*/

export type ChatEvaluator = {
  /** Called when we see a mention node. Return the transformed text, or "" to remove it. */
  handleMention(node: ChatAstSpec["Mention"]): string | Promise<string>;

  /** Called when we see a command node. Return replacement text, or "" to remove. */
  handleCommand(node: ChatAstSpec["Command"]): string | Promise<string>;

  /** Called when we see a text node. Typically returns the same text, or transforms it. */
  handleText(node: ChatAstSpec["Text"]): string | Promise<string>;
};
