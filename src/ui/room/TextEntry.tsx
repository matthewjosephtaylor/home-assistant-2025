import { Colors } from "@mjt-engine/color";
import {
  CONTENT_OBJECT_STORE,
  Daimon,
  Daimons,
  type Content,
} from "@mjt-services/daimon-common-2025";
import { Ids } from "@mjt-services/data-common-2025";
import { AutoFixHigh, Image, RecordVoiceOver, Send } from "@mui/icons-material";
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
import { GenerateImageDialog } from "../common/GenerateImageDialog";
import { putContent } from "../common/putContent";
import { putRoom } from "../common/putRoom";
import { askDaimon } from "../daimon/askDaimon";
import { handleTextEntry } from "./handleTextEntry";

import { useData } from "../../state/useData";
import { addRandomGreeting } from "./addRandomGreeting";
import IMAGE_PROMPT from "./prompt.txt?raw";

console.log("IMAGE_PROMPT", IMAGE_PROMPT);

export const TextEntry = forwardRef(({ ...rest }: TextFieldProps, ref) => {
  const [message, setMessage] = useState("");
  const textFieldRef = useRef<HTMLInputElement>(null);
  const { setTextEntryElement } = useAppState();
  const [openGenerateImage, setOpenGenerateImage] = useState(false);
  const [imageGenPrompt, setImageGenPrompt] = useState("");
  const [imageContent, setImageContent] = useState<Content>();

  const { activeRoomId, userDaimonId, activeAssistantId } = useAppState();
  // const daimons = useDatas({ from: DAIMON_OBJECT_STORE });
  const userDaimon = useData<Daimon>(userDaimonId);
  const charaDaimon = useData<Daimon>(activeAssistantId);

  const positiveImagePrompt = Daimons.renderTemplate(IMAGE_PROMPT, {
    user: userDaimon?.chara.data.name ?? "User",
    chara: charaDaimon?.chara.data.name ?? "Assistant",
  });
  console.log("positiveImagePrompt", positiveImagePrompt);
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
    <>
      <ContextMenu
        actions={{
          Clear: () => setMessage(""),
          Submit: () => {
            handleTextEntry({ text: message });
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
              handleTextEntry({ text: message });
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
                    handleTextEntry({ text: message });
                    setMessage("");
                  }}
                >
                  <Send />
                </IconButton>
                <IconButton
                  onClick={async () => {
                    await addRandomGreeting(activeRoomId);
                  }}
                >
                  <RecordVoiceOver />
                </IconButton>
                <IconButton
                  onClick={async () => {
                    setImageContent({
                      id: Ids.fromObjectStore(CONTENT_OBJECT_STORE),
                      createdAt: Date.now(),
                      updatedAt: Date.now(),
                      contentType: "image/png",
                      value: undefined,
                    });
                    setOpenGenerateImage(true);
                    const imageGenPrompt = await askDaimon(
                      String(positiveImagePrompt),
                      {
                        onUpdate: (content) => {
                          setImageGenPrompt(String(content.value));
                        },
                      }
                    );
                    setImageGenPrompt(String(imageGenPrompt.value));
                  }}
                >
                  <Image />
                </IconButton>
                <IconButton
                  onClick={async () => {
                    const userName = userDaimon?.chara.data.name ?? "User";
                    await askDaimon(
                      `What would ${userName} do and/or say next? Just give the response only. use the same tone and style as ${userName}. use *to indicate actions*`,
                      {
                        onUpdate: (content) => {
                          const { value = "" } = content;
                          setMessage(String(value));
                        },
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
      <GenerateImageDialog
        open={openGenerateImage}
        value={imageContent}
        defaultRequest={{
          // prompt: positiveImagePrompt,
          prompt: String(imageGenPrompt),
          negative_prompt:
            "boring, bad composition, bad anatomy, bad lighting, weird eyes, weird hands. low detail, poor quality, cartoon, cgi, render, unity, unreal",
          steps: 50,
          width: 800,
          height: 600,
          cfg_scale: 5,
        }}
        onClose={() => setOpenGenerateImage(false)}
        onSave={async (value) => {
          // onUpdate?.(value);
          await putContent(value);
          await putRoom({
            contentId: value.id,
            parentId: useAppState.getState().activeRoomId,
          });
          setOpenGenerateImage(false);
        }}
      />
    </>
  );
});
