import { DAIMON_OBJECT_STORE } from "@mjt-services/daimon-common-2025";
import { Stack } from "@mui/material";
import { sortDaimonsByLastUsed } from "../../daimon/sortDaimonsByLastUsed";
import { useAppState } from "../../state/AppState";
import { useDatas } from "../../state/useDatas";
import { TreeView } from "../common/tree/TreeView";
import { DaimonMenuAvatar } from "../daimon/DaimonMenuAvatar";
import { TextEntry } from "./TextEntry";

export const RoomScreen = () => {
  const daimons = useDatas({ from: DAIMON_OBJECT_STORE }).toSorted(
    sortDaimonsByLastUsed
  );
  const { topRoomId } = useAppState();
  const { activeAssistantId } = useAppState();
  return (
    <Stack
      sx={{
        marginLeft: "2ch",
        marginRight: "2ch",
        height: "calc(99.9vh - 1em)",
      }}
    >
      <Stack direction="row" gap="2ch" sx={{ height: "100%" }}>
        <Stack
          sx={{
            height: "auto",
            overflowY: "auto",
            minWidth: "15ch",
            maxHeight: "90vh",
          }}
        >
          {daimons.map((daimon) => (
            <DaimonMenuAvatar
              name={daimon.chara.data.name}
              tooltip={daimon.chara.data.description}
              selected={daimon.id === activeAssistantId}
              key={daimon.id}
              daimonId={daimon.id}
              imageContentId={daimon.chara.data.extensions?.avatar}
            />
          ))}
        </Stack>
        <Stack direction="column" sx={{ flex: 1 }}>
          <TreeView
            parentId={topRoomId}
            sx={{
              height: "100%",
              maxHeight: "calc(100vh - 12em)",
              maxWidth: "calc(100vw - 10ch)",
              overflowX: "auto",
              overflowY: "hidden",
            }}
          />
          <TextEntry />
        </Stack>
      </Stack>
    </Stack>
  );
};
