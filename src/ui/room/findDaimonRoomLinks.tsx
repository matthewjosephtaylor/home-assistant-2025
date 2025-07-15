import type { RoomDaimonLink } from "@mjt-services/daimon-common-2025";
import { Datas, LINK_OBJECT_STORE } from "@mjt-services/data-common-2025";
import { getConnection } from "../../connection/Connections";


export const findDaimonRoomLinks = async ({
  daimonId, roomId,
}: {
  daimonId: string;
  roomId: string;
}): Promise<RoomDaimonLink[]> => {
  const existingLinks = (await Datas.search(await getConnection())({
    from: LINK_OBJECT_STORE,
    query: `values(@) | [?roomId == '${roomId}' && daimonId == '${daimonId}']`,
  })) as RoomDaimonLink[];
  return existingLinks;
};
