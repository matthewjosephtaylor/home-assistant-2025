
import { isUndefined } from "@mjt-engine/object";
import { Stack } from "@mui/system";
import { bytesToDaimon } from "../../png/bytesToDaimon";
import { FileUpload } from "../common/FileUpload";
import { ImportCharaJson } from "./ImportCharaJson";

export const DaimonUpload = ({ onUpload }: { onUpload?: () => void }) => {
  return (
    <Stack justifyContent={"center"} direction={"row"} gap={"5em"}>
      <FileUpload
        onChange={async (file) => {
          console.log("File uploaded", file);
          if (isUndefined(file)) {
            return;
          }
          const daimon = await bytesToDaimon(file);
          console.log(daimon);
          onUpload?.();
        }}
        sx={{ minWidth: "8ch" }}
      />
      <ImportCharaJson onImport={() => onUpload?.()} />
    </Stack>
  );
};
