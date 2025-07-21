import { isUndefined } from "@mjt-engine/object";
import { Stack } from "@mui/material";
import { useState } from "react";
import { Lorebook } from "../../lore/Lorebook";
import { FileUpload } from "../common/FileUpload";
import { JsonEditor } from "../common/JsonEditor";

export const ImportLoreJson = ({ onImport }: { onImport?: () => void }) => {
  const [open, setOpen] = useState(false);
  const [lorebook, setLorebook] = useState<Lorebook | undefined>();
  return (
    <Stack justifyContent={"center"} direction={"row"} gap={"5em"}>
      {/* <IconButton onClick={() => setOpen(true)}>
        <UploadFile fontSize="large" /> JSON
      </IconButton> */}
      <FileUpload
        onChange={async (file) => {
          console.log("File uploaded", file);
          if (isUndefined(file)) {
            return;
          }
          console.log("Importing JSON file", file);
          const text = await file.text();
          console.log("JSON content", text);
          const lorebook = JSON.parse(text) as Lorebook;
          console.log("Parsed Lorebook", lorebook);
          setLorebook(lorebook);
          setOpen(true);
          // setLorebook(JSON.parse(text) as Lorebook);
          // const daimon = await bytesToDaimon(file);
          // console.log(daimon);
          // onUpload?.();
        }}
        sx={{ minWidth: "8ch" }}
      />
      {/* {open && (
        <JsonEditor
          initialValue={lorebook}
          onSave={(value) => {
            console.log(value);
          }}
        />
      )} */}
      {/* <TextDialog
        open={open}
        onClose={() => setOpen(false)}
        value={lorebook ?? ""}
        onSave={async (value: string) => {
          const data = JSON.parse(value) as Lorebook;
          // const daimon: Daimon = {
          //   id: Ids.fromObjectStore(DAIMON_OBJECT_STORE),
          //   chara: {
          //     spec: "chara_card_v2",
          //     spec_version: "2",
          //     data: {
          //       ...data,
          //       extensions: { ...data.extensions, lastUsed: Date.now() },
          //     },
          //   },
          // };

          // await Datas.put(await getConnection())({
          //   value: daimon,
          // });

          setOpen(false);
          onImport?.();
        }}
      /> */}
    </Stack>
  );
};
