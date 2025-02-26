import { Errors } from "@mjt-engine/message";
import {
  CONTENT_OBJECT_STORE,
  DAIMON_OBJECT_STORE,
  ROOM_OBJECT_STORE,
  type Content,
  type Daimon,
  type Room,
} from "@mjt-services/daimon-common-2025";
import { Datas } from "@mjt-services/data-common-2025";
import { getConnection } from "../../connection/Connections";
import type { TreeApi } from "../common/tree/TreeApi";
import type { TreeNode } from "../common/tree/TreeNode";
import { isEmpty, isUndefined } from "@mjt-engine/object";
import { ContentView } from "../ContentView";
import { Box, Stack, type BoxProps, type StackProps } from "@mui/system";
import { useEffect, useState, type ReactNode } from "react";
import { ContentImage } from "../ContentImage";

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
          // content: <ContentView contentId={roomNode.contentId} />,
          content: <RoomContentView room={room} />,
        } as TreeNode;
      })
    );
    return treeNodes;
  } catch (error) {
    // console.log("error", error);
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
      console.log("daimon", daimon);
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
