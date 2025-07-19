import { Colors } from "@mjt-engine/color";
import {
  CONTENT_OBJECT_STORE,
  Daimon,
  Daimons,
  type Content,
} from "@mjt-services/daimon-common-2025";
import { Ids } from "@mjt-services/data-common-2025";
import {
  AutoFixHigh,
  Ballot,
  Image,
  MyLocation,
  RecordVoiceOver,
  Send,
} from "@mui/icons-material";
import {
  IconButton,
  InputAdornment,
  Stack,
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

import { IncompleteJsonParser } from "incomplete-json-parser";
import { useData } from "../../state/useData";
import { MarkdownJsonExtractor } from "../common/MarkdownJsonExtractor";
import { addRandomGreeting } from "./addRandomGreeting";
import IMAGE_PROMPT from "./prompt.txt?raw";
import { RpgChoice, RpgChoiceSelect } from "./RpgChoiceSelect";
import { RpgLocation, RpgLocationSelect } from "./RpgLocationSelect";

export const TextEntry = forwardRef(({ ...rest }: TextFieldProps, ref) => {
  const [message, setMessage] = useState("");
  const textFieldRef = useRef<HTMLInputElement>(null);
  const { setTextEntryElement } = useAppState();
  const [openGenerateImage, setOpenGenerateImage] = useState(false);
  const [imageGenPrompt, setImageGenPrompt] = useState("");
  const [imageContent, setImageContent] = useState<Content>();

  const { activeRoomId, userDaimonId, activeAssistantId } = useAppState();
  const userDaimon = useData<Daimon>(userDaimonId);
  const charaDaimon = useData<Daimon>(activeAssistantId);
  const [expanded, setExpanded] = useState(false);
  const [rpgChoices, setRpgChoices] = useState<RpgChoice[]>([]);
  const [rpgLocations, setRpgLocations] = useState<RpgLocation[]>([]);

  useEffect(() => {
    const el = textFieldRef.current;
    if (!el) return;

    const style = getComputedStyle(el);
    const lineHeight = parseFloat(style.lineHeight || "24"); // fallback
    const lines = Math.round(el.scrollHeight / lineHeight);

    setExpanded(lines > 3);
  }, [message]);

  const positiveImagePrompt = Daimons.renderTemplate(IMAGE_PROMPT, {
    user: userDaimon?.chara.data.name ?? "User",
    chara: charaDaimon?.chara.data.name ?? "Assistant",
  });
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
    <Stack direction="column" sx={{ width: "100%" }}>
      <RpgLocationSelect choices={rpgLocations} onSelect={(choice) => {}} />
      <RpgChoiceSelect
        choices={rpgChoices}
        onSelect={async (choice) => {
          console.log("Selected choice:", choice);
          const userName = userDaimon?.chara.data.name ?? "User";
          // const checkResult = `CRITICAL FAILURE`;
          const outcome = choiceToOutcome(choice);
          console.log("Outcome:", outcome);
          await askDaimon(
            [
              `${userName} chose action: ${choice.action}: ${choice.why}`,
              `RPG Action Check Outcome: ${outcome}}`,
              `What would ${userName} do and/or say for the action? Just give the response only. use the same tone and style as ${userName}. use *to indicate actions* and take into account the request and what the RPG action check result was`,
            ].join("\n"),
            {
              onUpdate: (content) => {
                const { value = "" } = content;
                setMessage(String(value));
              },
            }
          );
        }}
      />
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
            position: expanded ? "fixed" : "relative",
            bottom: expanded ? 0 : "auto",
            left: expanded ? 0 : "auto",
            right: expanded ? 0 : "auto",
            zIndex: expanded ? 1300 : "auto", // above most content
            backgroundColor: Colors.from("grey").darken(0.65).toString(),
            marginTop: expanded ? 0 : "1.8em",
            transition: "all 0.3s ease",
            maxHeight: expanded ? "60vh" : "auto",
            // overflow: "auto",
            padding: expanded ? "1em" : 0,
            "& .MuiOutlinedInput-root": {
              borderRadius: "0.5em",
            },
          }}
          multiline
          minRows={3}
          maxRows={20}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    handleTextEntry({ text: message });
                    setMessage("");
                    setRpgChoices([]);
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
                <IconButton
                  onClick={async () => {
                    const userName = userDaimon?.chara.data.name ?? "User";
                    const extractor = new MarkdownJsonExtractor();
                    const result = await askDaimon(
                      [
                        "type Choice {action: string, successChanceOutOf100: number, why?: string, relevantStats?: string[]}",
                        `MARKDOWN JSON Choice ARRAY RESPONSE ONLY. Generate 3-5 one or two word actions that the user can take next in the CYOA RPG. Use the same tone and style as ${userName}.`,
                      ].join("\n"),
                      {
                        assistantId: activeAssistantId,
                        onUpdate: (content) => {
                          const { value = "" } = content;
                          // setMessage(String(value));
                          // console.log("Received value", value);
                          try {
                            const candidates = extractor.write(value as string);
                            // console.log("Candidates", candidates);
                            const incompleteJsonParser =
                              new IncompleteJsonParser();
                            candidates.forEach((candidate, i) => {
                              incompleteJsonParser.write(candidate);
                            });
                            const objects = incompleteJsonParser.getObjects();
                            setRpgChoices(objects as RpgChoice[]);
                          } catch (e) {
                            // console.error("Error parsing JSON", e);
                          }
                        },
                      }
                    );
                  }}
                >
                  <Ballot />
                </IconButton>
                <IconButton
                  onClick={async () => {
                    const userName = userDaimon?.chara.data.name ?? "User";
                    const extractor = new MarkdownJsonExtractor();
                    const result = await askDaimon(
                      [
                        "type LocationChoice {name: string, travelTimeMinutes: number, description?: string}",
                        `MARKDOWN JSON Choice ARRAY RESPONSE ONLY. Generate 3-5 one or two word location names that the user can travel to in the CYOA RPG. Use the same tone and style as the theme.`,
                      ].join("\n"),
                      {
                        assistantId: activeAssistantId,
                        onUpdate: (content) => {
                          const { value = "" } = content;
                          // setMessage(String(value));
                          // console.log("Received value", value);
                          try {
                            const candidates = extractor.write(value as string);
                            // console.log("Candidates", candidates);
                            const incompleteJsonParser =
                              new IncompleteJsonParser();
                            candidates.forEach((candidate, i) => {
                              incompleteJsonParser.write(candidate);
                            });
                            const objects = incompleteJsonParser.getObjects();
                            setRpgLocations(objects as RpgLocation[]);
                          } catch (e) {
                            // console.error("Error parsing JSON", e);
                          }
                        },
                      }
                    );
                  }}
                >
                  <MyLocation />
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
          await putContent(value);
          await putRoom({
            contentId: value.id,
            parentId: useAppState.getState().activeRoomId,
          });
          setOpenGenerateImage(false);
        }}
      />
    </Stack>
  );
});

export const choiceToOutcome = (choice: RpgChoice) => {
  const { action, why, successChanceOutOf100, relevantStats } = choice;

  // Generate a random number to determine success
  const randomValue = Math.random() * 100;
  const isSuccess = randomValue < successChanceOutOf100;
  const outcome = isSuccess
    ? `Success! ${action} was successful.`
    : `Failure! ${action} failed.`;

  return outcome;
};
