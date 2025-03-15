import { TextField, type TextFieldProps } from "@mui/material";
import {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useLayoutEffect,
} from "react";
import type { TreeApi } from "../common/tree/TreeApi";
import { handleTextEntry } from "./handleTextEntry";
import { useAppState } from "../../state/AppState";
import { Colors } from "@mjt-engine/color";

export const TextEntry = forwardRef(
  ({ treeApi, ...rest }: { treeApi: TreeApi } & TextFieldProps, ref) => {
    const [message, setMessage] = useState("");
    const textFieldRef = useRef<HTMLInputElement>(null);
    const { setTextEntryElement } = useAppState();

    // Expose focus method to the parent component
    useImperativeHandle(ref, () => ({
      focus: () => {
        textFieldRef.current?.focus();
      },
    }));
    useEffect(() => {
      setTextEntryElement(textFieldRef.current ?? undefined);
      return () => {
        setTextEntryElement(undefined);
      };
    }, []);

    return (
      <TextField
        label="Text Entry"
        autoFocus
        inputRef={textFieldRef}
        value={message}
        onChange={(evt) => setMessage(evt.target.value)}
        onKeyDown={(evt) => {
          if (evt.key === "Enter" && !evt.shiftKey) {
            evt.preventDefault(); // Prevents adding a new line
            handleTextEntry({ text: message, treeApi });
            setMessage("");
          }
        }}
        sx={{
          width: "100%",
          backgroundColor: Colors.from("grey").darken(0.65).toString(),
          marginTop: "1.8em",
          "& .MuiOutlinedInput-root": {
            borderRadius: "0.5em",
          },
        }}
        multiline
        maxRows={10}
        {...rest}
      />
    );
  }
);
