import type { ChatAstSpec } from "../../chatlang/ChatAstSpec";
import type { ChatEvaluator } from "../../chatlang/ChatEvaluator";
import type { TreeApi } from "../common/tree/TreeApi";
import { linkDaimonToRoom } from "./linkDaimonToRoom";
import { nameToDaimons } from "./nameToDaimons";


export const TEXT_ENTRY_EVALUATOR = (treeApi: TreeApi) => ({
  handleMention: async function (
    node: ChatAstSpec["Mention"]
  ): Promise<string> {
    const daimons = await nameToDaimons(node.value);
    console.log("daimons", daimons);
    const roomId = treeApi.getActiveNoteParentId();
    console.log("room", roomId);
    if (daimons.length === 1 && roomId) {
      const link = await linkDaimonToRoom({
        daimonId: daimons[0].id,
        roomId: roomId,
      });
      console.log("link", link);
      // return daimons[0].data.name;
    }
    return node.value;
  },
  handleCommand: function (node: ChatAstSpec["Command"]): string {
    return "";
  },
  handleText: function (node: ChatAstSpec["Text"]): string {
    return node.value;
  },
}) as ChatEvaluator;
