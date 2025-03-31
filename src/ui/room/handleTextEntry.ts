import { isDefined, isUndefined } from "@mjt-engine/object";
import { type Content, type Room } from "@mjt-services/daimon-common-2025";
import { Datas } from "@mjt-services/data-common-2025";
import { ChatLangs } from "../../chatlang/ChatLangs";
import { getConnection } from "../../connection/Connections";
import { useAppState } from "../../state/AppState";
import { addUserRoomTextContent } from "./addUserRoomTextContent";
import { linkDaimonToRoom } from "./linkDaimonToRoom";
import { TEXT_ENTRY_EVALUATOR } from "./TEXT_ENTRY_EVALUATOR";
import { Daimons } from "../../daimon/Daimons";

export const handleTextEntry = async ({ text }: { text: string }) => {
  console.log("handleTextEntry", text);
  const out = await ChatLangs.interpretText(text, TEXT_ENTRY_EVALUATOR());
  console.log("out", out);
  // const activeRoomParentId = treeApi.getActiveNoteParentId();
  const activeRoomParentId = useAppState.getState().activeRoomId;
  if (isUndefined(activeRoomParentId)) {
    return;
  }
  const { userDaimonId } = useAppState.getState();
  if (isDefined(userDaimonId)) {
    await linkDaimonToRoom({
      daimonId: userDaimonId,
      roomId: activeRoomParentId,
    });
  }

  // get all the parent non-user daimons from above to link here

  

  // if there is a parent room make sure to link the creator to the room
  // const activeRoomParent = (await Datas.get(await getConnection())({
  //   key: activeRoomParentId,
  // })) as Room;
  // const activeRoomContent = (await Datas.get(await getConnection())({
  //   key: activeRoomParent?.contentId,
  // })) as Content;

  // TODO perhaps the search on the daimon side wants to just assume this link instead of creating?
  // if (isDefined(activeRoomContent?.creatorId)) {
  //   await linkDaimonToRoom({
  //     daimonId: activeRoomContent.creatorId,
  //     roomId: activeRoomParentId,
  //   });
  // }

  const roomId = await addUserRoomTextContent({
    text: out,
    parentId: activeRoomParentId,
  });
};
