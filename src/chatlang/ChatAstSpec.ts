import type { ChatLoc } from "./ChatLoc";

/* ---------------------------------------
      2) AST Spec: each key is a parser name
         plus the shape of what it returns.
      --------------------------------------- */

export type ChatAstSpec = {
  /** 1+ whitespace -> string */
  Whitespace: string;

  /** '@username' mention node */
  Mention: {
    type: "mention";
    value: string;
    loc: ChatLoc;
  };

  /** '/help' command node */
  Command: {
    type: "command";
    value: string;
    loc: ChatLoc;
  };

  /** Plain text node */
  Text: {
    type: "text";
    value: string;
    loc: ChatLoc;
  };

  /**
   * Single Token => can be mention | command | text
   */
  Token: ChatAstSpec["Mention"] | ChatAstSpec["Command"] | ChatAstSpec["Text"];

  /**
   * A line of tokens
   */
  ChatLine: {
    type: "chatLine";
    tokens: ChatAstSpec["Token"][];
    loc: ChatLoc;
  };

  /**
   * Top-level Program => could be multiple lines, or for now just 1 line.
   * We'll keep it simple: parse a single line as the "program."
   */
  Program: {
    type: "program";
    lines: ChatAstSpec["ChatLine"][]; // an array of chatLine nodes
    loc: ChatLoc;
  };
};
