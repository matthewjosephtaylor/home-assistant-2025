import { Asserts } from "@mjt-engine/assert";
import {
  type Daimon,
  DAIMON_OBJECT_STORE,
  ROOM_OBJECT_STORE,
} from "@mjt-services/daimon-common-2025";
import { Datas, Ids } from "@mjt-services/data-common-2025";
import { getConnection } from "../../connection/Connections";
import { linkDaimonToRoom } from "../room/linkDaimonToRoom";

export const createDaimonRooms = async (daimonId: string) => {
  const con = await getConnection();
  const daimon = Asserts.assertValue(
    await Datas.get(con)<Daimon>({
      key: daimonId,
    })
  );
  const { extensions = {} } = daimon.chara.data;
  const {
    workRoom = Ids.fromObjectStore(ROOM_OBJECT_STORE),
    memoryRoom = Ids.fromObjectStore(ROOM_OBJECT_STORE),
    dmRoom = Ids.fromObjectStore(ROOM_OBJECT_STORE),
  } = extensions;

  await Datas.putEntity(con)(DAIMON_OBJECT_STORE)({
    ...daimon,
    chara: {
      ...daimon.chara,
      data: {
        ...daimon.chara.data,
        extensions: {
          ...extensions,
          workRoom,
          memoryRoom,
          dmRoom,
        },
      },
    },
  });

  await linkDaimonToRoom({ daimonId, roomId: workRoom });
  await linkDaimonToRoom({ daimonId, roomId: dmRoom });
  await linkDaimonToRoom({ daimonId, roomId: memoryRoom });
  return {
    workRoom,
    memoryRoom,
    dmRoom,
  };
};
