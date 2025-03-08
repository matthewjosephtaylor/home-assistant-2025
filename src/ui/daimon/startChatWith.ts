import { isDefined } from "@mjt-engine/object";
import { useAppState } from "../../state/AppState";
import { putContent } from "../common/putContent";
import { putRoom } from "../common/putRoom";
import { linkDaimonToRoom } from "../room/linkDaimonToRoom";

export const startChatWith = async (daimonId: string) => {
  console.log("Start chat with", daimonId);
  const roomLabelContentId = await putContent({
    value: `Chat ${new Date().toLocaleString()}`,
    contentType: "text/plain",
  });
  const roomId = await putRoom({ contentId: roomLabelContentId });
  const { userDaimonId, setUrlHash } = useAppState.getState();
  if (isDefined(userDaimonId)) {
    await linkDaimonToRoom({ daimonId: userDaimonId, roomId });
  }
  await linkDaimonToRoom({ daimonId, roomId });
  setUrlHash("room");
};
