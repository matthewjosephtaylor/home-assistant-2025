import type { Room } from "@mjt-services/daimon-common-2025";
import { ChatLangs } from "../../chatlang/ChatLangs";
import type { TreeApi } from "../common/tree/TreeApi";
import { TEXT_ENTRY_EVALUATOR } from "./TEXT_ENTRY_EVALUATOR";
import { isUndefined } from "@mjt-engine/object";
import { addRoomTextContent } from "./addRoomTextContent";

export const handleTextEntry = async ({
  text,
  treeApi,
}: {
  text: string;
  treeApi: TreeApi;
}) => {
  const out = await ChatLangs.interpretText(
    text,
    TEXT_ENTRY_EVALUATOR(treeApi)
  );
  console.log("out", out);
  const parentId = treeApi.getActiveNoteParentId();
  if (isUndefined(parentId)) {
    return;
  }
  const roomId = await addRoomTextContent({ text: out, parentId });
  console.log("roomId", roomId);
};
