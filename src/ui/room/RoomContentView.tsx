import { isUndefined } from "@mjt-engine/object";
import {
  CONTENT_OBJECT_STORE,
  DAIMON_OBJECT_STORE,
  type Content,
  type Daimon,
  type Room,
} from "@mjt-services/daimon-common-2025";
import { Datas } from "@mjt-services/data-common-2025";
import { Stack, type StackProps } from "@mui/system";
import { useEffect, useState } from "react";
import { getConnection } from "../../connection/Connections";
import { ContentImage } from "../content/ContentImage";
import { ContentView } from "../content/ContentView";

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
