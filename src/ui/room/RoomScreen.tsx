import { isUndefined } from "@mjt-engine/object";
import { DAIMON_OBJECT_STORE } from "@mjt-services/daimon-common-2025";
import { Stack } from "@mui/material";
import { useState } from "react";
import { useDatas } from "../../state/useDatas";
import { TreeView } from "../common/tree/TreeView";
import { DaimonMenuAvatar } from "../daimon/DaimonMenuAvatar";
import { TextEntry } from "./TextEntry";

export const RoomScreen = () => {
  const [key, setKey] = useState(crypto.randomUUID());
  const daimons = useDatas({ from: DAIMON_OBJECT_STORE });
  console.log("daimons", daimons);
  return (
    <Stack
      sx={{
        marginLeft: "5ch",
        marginRight: "5ch",
        height: "99.9vh",
      }}
    >
      <Stack direction="row" gap="2ch" sx={{ height: "100%" }}>
        <Stack
          sx={{
            height: "auto",
            overflowY: "auto",
            marginTop: "5em",
            minWidth: "10ch",
          }}
        >
          {daimons.map((daimon) => (
            <DaimonMenuAvatar
              onUpdate={(roomId) => {
                if (isUndefined(roomId)) {
                  return;
                }
                setKey(crypto.randomUUID());
              }}
              key={daimon.id}
              daimonId={daimon.id}
              imageContentId={daimon.chara.data.extensions?.avatar}
            />
          ))}
        </Stack>
        <TreeView
          key={key}
          sx={{
            height: "100%",
            maxHeight: "calc(100vh - 7em)",
            maxWidth: "calc(100vw - 10ch)",
            overflowX: "auto",
            overflowY: "hidden",
          }}
        />
      </Stack>
      <TextEntry />
    </Stack>
  );
};
