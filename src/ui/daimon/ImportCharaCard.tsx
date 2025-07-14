import {
  type DaimonCharaCard,
  type Daimon,
  DAIMON_OBJECT_STORE,
} from "@mjt-services/daimon-common-2025";
import { Ids, Datas } from "@mjt-services/data-common-2025";
import { UploadFile } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { getConnection } from "../../connection/Connections";
import { TextDialog } from "../crud/TextDialog";

export const ImportCharaJson = ({ onImport }: { onImport?: () => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <UploadFile fontSize="large" /> JSON
      </IconButton>
      <TextDialog
        open={open}
        onClose={() => setOpen(false)}
        value={""}
        onSave={async (value: string) => {
          const data = JSON.parse(value) as DaimonCharaCard["data"];
          const daimon: Daimon = {
            id: Ids.fromObjectStore(DAIMON_OBJECT_STORE),
            chara: {
              spec: "chara_card_v2",
              spec_version: "2",
              data: data,
            },
          };

          await Datas.put(await getConnection())({
            value: daimon,
          });

          setOpen(false);
          onImport?.();
        }}
      />
    </>
  );
};
