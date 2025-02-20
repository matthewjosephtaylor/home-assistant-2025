import type { ChatAstSpec } from "./ChatAstSpec";

/** Union of all node types. */

export type ChatNode = ChatAstSpec[keyof ChatAstSpec];
