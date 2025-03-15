import { Colors } from "@mjt-engine/color";
import { GlobalStyles } from "@mui/material";

export const globalStyles = (
  <GlobalStyles
    styles={{
      "::-webkit-scrollbar": {
        width: "12px",
      },
      "::-webkit-scrollbar-track": {
        background: "#2c2c2c",
      },
      "::-webkit-scrollbar-thumb": {
        background: "#888",
        borderRadius: "10px",
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: "#555",
      },
      "::-webkit-scrollbar-corner": {
        background: "#2c2c2c",
      },
      "html, body, #root": {
        // height: "100%",
      },
      "*": {
        // scrollbarColor: "#888 #2c2c2c",
        // bar / gutter
        margin: "0",
        scrollbarColor: `${Colors.from("black").toString()} ${Colors.from("grey").darken(0.6).toString()}`,
        scrollbarWidth: "thick",
      },
    }}
  />
);
