import { Stack } from "@mui/system";
import { ImportLoreJson } from "./ImportLoreJson";

export const LorebooksScreen = () => {
  return (
    <Stack alignContent={"center"} spacing={"2em"} padding={"2em"}>
      <ImportLoreJson />
    </Stack>
  );
};
