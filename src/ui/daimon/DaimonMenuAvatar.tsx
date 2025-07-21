import {
  type Daimon,
  DAIMON_OBJECT_STORE,
} from "@mjt-services/daimon-common-2025";
import { Datas, Ids } from "@mjt-services/data-common-2025";
import { Tooltip, Typography } from "@mui/material";
import { getConnection } from "../../connection/Connections";
import { useAppState } from "../../state/AppState";
import { ContextMenu } from "../common/ContextMenu";
import { ContentView } from "../content/ContentView";
import { createDaimonRooms } from "./createDaimonRooms";
import { startChatWith } from "./startChatWith";

export const DaimonMenuAvatar = ({
  imageContentId,
  daimonId,
  onUpdate,
  name,
  selected = false,
  tooltip,
}: {
  selected?: boolean;
  name?: string;
  tooltip?: string;
  imageContentId?: string;
  daimonId: string;
  onUpdate?: (id?: string) => void;
}) => {
  return (
    <ContextMenu
      sx={{
        width: "10ch",
        textAlign: "center",
        padding: "0.5em",
        margin: "0.5em",
        borderRadius: "1em",
        border: `1px solid ${selected ? "#1976d2" : "transparent"}`, // MUI default selected color (primary.main)
        backgroundColor: selected ? "action.selected" : undefined,
      }}
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
          current.chara.data.extensions = {};
          const clone: Daimon = {
            id: Ids.fromObjectStore(DAIMON_OBJECT_STORE),

            chara: {
              ...current.chara,
              data: {
                ...current.chara.data,
                name: current.chara.data.name + " (Clone)",
                extensions: {
                  lastUsed: Date.now(),
                },
              },
            },
          };
          await Datas.put(con)({
            value: clone,
          });

          onUpdate?.();
        },
      }}
    >
      <Tooltip title={tooltip} enterDelay={1000} enterNextDelay={1000}>
        <ContentView
          onClick={async () => {
            const daimon = (await Datas.get(await getConnection())({
              key: daimonId,
            })) as Daimon;
            useAppState
              .getState()
              .setTopRoomId(daimon.chara.data.extensions?.dmRoom);
            useAppState.getState().setActiveAssistantId(daimonId);
          }}
          contentId={imageContentId}
          imgProps={{ style: { maxHeight: "4em" } }}
        />
      </Tooltip>
      {name && (
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "0.8em",
            marginTop: "0.5em",
            maxWidth: "10ch",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </Typography>
      )}
    </ContextMenu>
  );
};
