import { Errors } from "@mjt-engine/message";
import { isEmpty, isUndefined } from "@mjt-engine/object";
import {
  CONTENT_OBJECT_STORE,
  DAIMON_OBJECT_STORE,
  ROOM_OBJECT_STORE,
  type Content,
  type Daimon,
  type Room,
} from "@mjt-services/daimon-common-2025";
import { Datas } from "@mjt-services/data-common-2025";
import { Stack, type StackProps } from "@mui/system";
import { useEffect, useState } from "react";
import { getConnection } from "../../connection/Connections";
import type { TreeApi } from "../common/tree/TreeApi";
import type { TreeNode } from "../common/tree/TreeNode";
import { ContentImage } from "../ContentImage";
import { ContentView } from "../ContentView";

export const loadRooms: TreeApi["loadChildren"] = async (
  parentId,
  query = ""
) => {
  try {
    console.log("loadRoomNodes", { parentId, query });
    const realizedQuery = isEmpty(query)
      ? "values(@)[?!parentId || parentId == `null`]"
      : query;
    const rooms = (await Datas.search(await getConnection())({
      from: ROOM_OBJECT_STORE,
      query: realizedQuery.trim(),
    })) as Room[];
    console.log("rooms", rooms);
    if (isUndefined(rooms)) {
      return [];
    }

    const treeNodes: TreeNode[] = await Promise.all(
      rooms.map(async (room) => {
        const content = await Datas.get(await getConnection())<Content>({
          objectStore: CONTENT_OBJECT_STORE,
          key: room.contentId,
        });

        return {
          id: room.id,
          label: content?.value || "<missing>",
          content: <RoomContentView room={room} />,
        } as TreeNode;
      })
    );
    return treeNodes;
  } catch (error) {
    console.log(Errors.errorToText(error));
    throw error;
  }
};

export const RoomContentView = ({
  room,
  ...rest
}: { room: Room } & StackProps) => {
  const [avatar, setAvatar] = useState<Content | undefined>(undefined);
  useEffect(() => {
    (async () => {
      const roomContent = await Datas.get(await getConnection())<Content>({
        objectStore: CONTENT_OBJECT_STORE,
        key: room.contentId,
      });
      if (isUndefined(roomContent?.creatorId)) {
        return;
      }
      const daimon = await Datas.get(await getConnection())<Daimon>({
        objectStore: DAIMON_OBJECT_STORE,
        key: roomContent.creatorId,
      });
      if (isUndefined(daimon?.chara.data.extensions?.avatar)) {
        return;
      }

      const avatar = await Datas.get(await getConnection())<Content>({
        objectStore: CONTENT_OBJECT_STORE,
        key: daimon.chara.data.extensions?.avatar,
      });
      // const content = await Datas.get(await getConnection())<Content>({
      // const content = roomContent.value;
      setAvatar(avatar);
    })();
  }, [room]);

  return (
    <Stack direction={"row"} gap={"1ch"} {...rest}>
      <ContentImage
        content={avatar}
        style={{ height: "4em", width: "auto" }}
      ></ContentImage>
      <ContentView contentId={room.contentId} />
    </Stack>
  );
};
