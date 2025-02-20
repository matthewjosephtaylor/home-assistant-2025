import type { ChatEvaluator } from "./ChatEvaluator";

/* ---------------------------------------
      8) Example "SimpleEvaluator" instance
      ---------------------------------------*/
export const SimpleEvaluator: ChatEvaluator = {
  handleMention(mentionNode) {
    // Maybe transform "@Joe" => "[MENTION:Joe]"
    // Or do side effects, e.g. "notify user Joe is mentioned"
    return `[MENTION:${mentionNode.value}]`;
  },

  handleCommand(commandNode) {
    // We might remove commands entirely or replace them.
    // For example, if command is /help, we do a side effect or log it:
    console.log("Command encountered:", commandNode.value);
    // Return empty to remove it from final text
    return "";
  },

  handleText(textNode) {
    // By default, we leave text as-is
    return textNode.value;
  },
};
