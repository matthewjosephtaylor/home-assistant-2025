import { Colors } from "@mjt-engine/color";
import {
  IconButton,
  InputAdornment,
  TextField,
  type TextFieldProps,
} from "@mui/material";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useAppState } from "../../state/AppState";
import { ContextMenu } from "../common/ContextMenu";
import type { TreeApi } from "../common/tree/TreeApi";
import { handleTextEntry } from "./handleTextEntry";
import { Send, AutoFixHigh, Image } from "@mui/icons-material";
import { askDaimon } from "../daimon/askDaimon";
import { putContent } from "../common/putContent";
import { putRoom } from "../common/putRoom";
import { generateImage } from "../../image/generateImage";
import { Datas } from "@mjt-services/data-common-2025";
import { getConnection } from "../../connection/Connections";
import type { Content } from "@mjt-services/daimon-common-2025";

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
      <ContextMenu
        actions={{
          Clear: () => setMessage(""),
          Submit: () => {
            handleTextEntry({ text: message, treeApi });
            setMessage("");
          },
        }}
      >
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
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    handleTextEntry({ text: message, treeApi });
                    setMessage("");
                  }}
                >
                  <Send />
                </IconButton>
                <IconButton
                  onClick={async () => {
                    const imageGenPrompt = await askDaimon(
                      "use short keywords, and other image generation prompt techniques. Give a brief description of the current state of the scene as an image generation prompt with no propernames and no quotes. start with the actors descriptions, then the actions they are performing, be specific and detailed here, then a few words on the environment",
                    );
                    console.log(imageGenPrompt.value);
                    const imageContentId = await putContent({
                      source: imageGenPrompt.value,
                    });
                    const imageRoom = putRoom({
                      contentId: imageContentId,
                      parentId: treeApi.getActiveNoteParentId(),
                    });
                    const draft = (await Datas.get(await getConnection())({
                      key: imageContentId,
                    })) as Content;
                    generateImage({
                      draft,
                      request: {
                        prompt:"8k, realistic, masterpiece, " + String(imageGenPrompt.value),
                        negative_prompt: "boring, bad composition, bad anatomy, bad lighting, weird eyes, weird hands. low detail, poor quality, cartoon, cgi, render, unity, unreal",
                        steps: 40,
                        width: 800,
                        height: 600,
                        cfg_scale: 9,
                      },
                      onUpdate(content) {
                        putContent(content);
                      },
                    });
                  }}
                >
                  <Image />
                </IconButton>
                <IconButton
                  onClick={async () => {
                    await askDaimon(
                      "What would the user say next? Just give the response only",
                      (content) => {
                        const { value = "" } = content;
                        setMessage(String(value));
                      }
                    );
                  }}
                >
                  <AutoFixHigh />
                </IconButton>
              </InputAdornment>
            ),
          }}
          {...rest}
        />
      </ContextMenu>
    );
  }
);
