import {
  ROOM_OBJECT_STORE,
  type Content,
  CONTENT_OBJECT_STORE,
  type Room,
} from "@mjt-services/daimon-common-2025";
import { Ids, Datas } from "@mjt-services/data-common-2025";
import { getConnection } from "../../connection/Connections";

export const addRoomTextContent = async ({
  text,
  parentId,
}: {
  parentId?: string;
  text: string;
}) => {
  const id = Ids.fromObjectStore(ROOM_OBJECT_STORE);
  const content: Content = {
    id: Ids.fromObjectStore(CONTENT_OBJECT_STORE),
    contentType: "plain/text",
    value: text,
    createdAt: Date.now(),
    finalized: true,
  };
  await Datas.put(await getConnection())({
    value: content,
  });
  await Datas.put(await getConnection())({
    objectStore: ROOM_OBJECT_STORE,
    value: {
      id,
      parentId,
      contentId: content.id,
    } as Partial<Room>,
  });
  return id;
};
