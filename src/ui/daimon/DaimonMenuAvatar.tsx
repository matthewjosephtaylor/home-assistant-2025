import {
  type Daimon,
  DAIMON_OBJECT_STORE,
} from "@mjt-services/daimon-common-2025";
import { Datas, Ids } from "@mjt-services/data-common-2025";
import { getConnection } from "../../connection/Connections";
import { ContextMenu } from "../common/ContextMenu";
import { ContentView } from "../content/ContentView";
import { startChatWith } from "./startChatWith";

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
        contentId={imageContentId}
        imgProps={{ style: { maxHeight: "4em" } }}
      />
    </ContextMenu>
  );
};
