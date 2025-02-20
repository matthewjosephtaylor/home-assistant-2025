import * as P from "parsimmon";
import { type ChatAstSpec } from "./ChatAstSpec";
import { mark } from "./mark";

/* ---------------------------------------
      4) Create Language with createLanguage
      --------------------------------------- */

export const ChatLang = P.createLanguage<ChatAstSpec>({
  Whitespace() {
    return P.regexp(/\s+/);
  },

  Mention() {
    return mark(
      P.seqMap(P.string("@"), P.regexp(/[a-zA-Z0-9_]+/), (_at, user) => user)
    ).map(({ loc, value }) => ({
      type: "mention" as const,
      value,
      loc,
    }));
  },

  Command() {
    return mark(
      P.seqMap(P.string("/"), P.regexp(/[a-zA-Z0-9_]+/), (_slash, cmd) => cmd)
    ).map(({ loc, value }) => ({
      type: "command" as const,
      value,
      loc,
    }));
  },

  Text() {
    return mark(P.regexp(/[^@\s/]+/)).map(({ loc, value }) => ({
      type: "text" as const,
      value,
      loc,
    }));
  },

  Token(r) {
    // One token => command OR mention OR text
    return P.alt(r.Command, r.Mention, r.Text);
  },

  ChatLine(r) {
    // One line => zero or more tokens separated by whitespace
    return mark(
      r.Token.sepBy(r.Whitespace).skip(P.optWhitespace).skip(P.end)
    ).map(({ loc, value: tokens }) => ({
      type: "chatLine" as const,
      tokens,
      loc,
    }));
  },

  Program(r) {
    // For simplicity, let's parse exactly ONE line as our entire program.
    // If you want multiple lines, you might do something like:
    // r.ChatLine.many().skip(P.end).
    return mark(r.ChatLine.map((line) => [line])).map(
      ({ loc, value: lines }) => ({
        type: "program" as const,
        lines,
        loc,
      })
    );
  },
});
