import { Datas, LINK_OBJECT_STORE, Ids } from "@mjt-services/data-common-2025";
import { getConnection } from "../../connection/Connections";
import type { RoomDaimonLink } from "./RoomDaimonLink";


export const linkDaimonToRoom = async ({
  daimonId, roomId,
}: {
  daimonId: string;
  roomId: string;
}) => {
  const existingLinks = (await Datas.search(await getConnection())({
    from: LINK_OBJECT_STORE,
    query: `values(@) | [?roomId == '${roomId}' && daimonId == '${daimonId}']`,
  })) as RoomDaimonLink[];
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
