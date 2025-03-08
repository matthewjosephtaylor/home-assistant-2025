import {
  ROOM_OBJECT_STORE,
  type Content,
  CONTENT_OBJECT_STORE,
  type Room,
} from "@mjt-services/daimon-common-2025";
import {
  Ids,
  Datas,
} from "@mjt-services/data-common-2025";
import { getConnection } from "../../connection/Connections";
import { useAppState } from "../../state/AppState";

export const addUserRoomTextContent = async ({
  text,
  parentId,
}: {
  parentId?: string;
  text: string;
}) => {
  const { userDaimonId } = useAppState.getState();
  const content: Content = {
    id: Ids.fromObjectStore(CONTENT_OBJECT_STORE),
    contentType: "plain/text",
    value: text,
    createdAt: Date.now(),
    creatorId: userDaimonId,
    finalized: true,
  };
  await Datas.put(await getConnection())({
    value: content,
  });
  const roomId = await Datas.put(await getConnection())({
    value: {
      id: Ids.fromObjectStore(ROOM_OBJECT_STORE),
      parentId,
      contentId: content.id,
    } as Partial<Room>,
  });
  return roomId;
};


