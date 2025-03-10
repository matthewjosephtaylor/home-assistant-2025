import { isDefined, isUndefined } from "@mjt-engine/object";
import { useAppState } from "../../state/AppState";
import { putContent } from "../common/putContent";
import { putRoom } from "../common/putRoom";
import { linkDaimonToRoom } from "../room/linkDaimonToRoom";
import { Datas } from "@mjt-services/data-common-2025";
import { getConnection } from "../../connection/Connections";
import type { Daimon } from "@mjt-services/daimon-common-2025";

export const startChatWith = async (daimonId: string) => {
  console.log("Start chat with", daimonId);

  const daimon = await Datas.get(await getConnection())<Daimon>({
    key: daimonId,
  });
  if (isUndefined(daimon)) {
    console.error("Daimon not found", daimonId);
    return;
  }
  const roomLabelContentId = await putContent({
    value: `${daimon.chara.data.name ?? ""} ${new Date().toLocaleString()}`,
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
