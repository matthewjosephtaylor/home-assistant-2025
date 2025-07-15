import { Datas, LINK_OBJECT_STORE, Ids } from "@mjt-services/data-common-2025";
import { getConnection } from "../../connection/Connections";
import type { RoomDaimonLink } from "@mjt-services/daimon-common-2025";
import { findDaimonRoomLinks } from "./findDaimonRoomLinks";

export const linkDaimonToRoom = async ({
  daimonId,
  roomId,
}: {
  daimonId: string;
  roomId: string;
}) => {
  const existingLinks = await findDaimonRoomLinks({ daimonId, roomId });
  console.log("existingLinks", existingLinks);
  if (existingLinks.length > 0) {
    return existingLinks[0];
  }
  const link: RoomDaimonLink = {
    id: Ids.fromObjectStore(LINK_OBJECT_STORE),
    roomId,
    daimonId,
  };
  await Datas.put(await getConnection())({
    value: link,
  });
  return link;
};


