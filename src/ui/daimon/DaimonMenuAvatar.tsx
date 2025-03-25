import {
  type Daimon,
  DAIMON_OBJECT_STORE,
} from "@mjt-services/daimon-common-2025";
import { Datas, Ids } from "@mjt-services/data-common-2025";
import { getConnection } from "../../connection/Connections";
import { useAppState } from "../../state/AppState";
import { ContextMenu } from "../common/ContextMenu";
import { ContentView } from "../content/ContentView";
import { startChatWith } from "./startChatWith";
import { createDaimonRooms } from "./createDaimonRooms";
export const DaimonMenuAvatar = ({
  imageContentId,
  daimonId,
  onUpdate,
}: {
  imageContentId?: string;
  daimonId: string;
  onUpdate?: (id?: string) => void;
}) => {
  return (
    <ContextMenu
      actions={{
        Edit: () => {
          useAppState.getState().setUrlHash("daimon");
        },
        "Create Rooms": async () => {
          const result = await createDaimonRooms(daimonId);
          console.log("createDaimonRooms", result);
        },
        Chat: async () => {
          const roomId = await startChatWith(daimonId);

          onUpdate?.(roomId);
        },
        Clone: async () => {
          const con = await getConnection();
          const current = (await Datas.get(con)({
            key: daimonId,
          })) as Daimon;
          if (!current) {
            return;
          }
          const clone: Daimon = {
            ...current,
            id: Ids.fromObjectStore(DAIMON_OBJECT_STORE),
          };
          await Datas.put(con)({
            value: clone,
          });
        },
      }}
    >
      <ContentView
        onClick={async () => {
          const daimon = (await Datas.get(await getConnection())({
            key: daimonId,
          })) as Daimon;
          useAppState
            .getState()
            .setTopRoomId(daimon.chara.data.extensions?.dmRoom);
        }}
        contentId={imageContentId}
        imgProps={{ style: { maxHeight: "4em" } }}
      />
    </ContextMenu>
  );
};
