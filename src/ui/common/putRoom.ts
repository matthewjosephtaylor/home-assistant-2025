import { type Room, ROOM_OBJECT_STORE } from "@mjt-services/daimon-common-2025";
import { getConnection } from "../../connection/Connections";
import { putEntity } from "./putEntity";


export const putRoom = async (draft: Partial<Room> = {}) => {
  return putEntity(await getConnection())(ROOM_OBJECT_STORE)(draft);
};
