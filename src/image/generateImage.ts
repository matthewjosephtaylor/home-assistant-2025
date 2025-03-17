import { first } from "@mjt-engine/object";
import {
  type Content,
  CONTENT_OBJECT_STORE,
} from "@mjt-services/daimon-common-2025";
import { Ids } from "@mjt-services/data-common-2025";
import type { TextToImageRequest } from "@mjt-services/imagegen-common-2025";
import { getConnection } from "../connection/Connections";
import { useAppState } from "../state/AppState";

export const generateImage = async ({
  draft = {},
  request,
  onUpdate,
}: {
  draft?: Partial<Content>;
  request: Partial<TextToImageRequest>;
  onUpdate?: (content: Content) => void;
}) => {
  console.log("Generating image...", request);
  const con = await getConnection();
  const abortController = new AbortController();
  const { setAbortController } = useAppState.getState();
  setAbortController(abortController);
  abortController.signal.addEventListener("abort", () => {
    console.log("Got Abort signal!!!!");
  });

  return new Promise(async (resolve, reject) => {
    await con.requestMany({
      signal: abortController.signal,

      onResponse: (response) => {
        console.log("Got response", response);
        const updatedContent: Content = {
          id: draft.id ?? Ids.fromObjectStore(CONTENT_OBJECT_STORE),
          createdAt: draft.createdAt ?? Date.now(),
          ...(draft ?? {}),
          finalized: response.aborted ? true : response.finalized,
          contentType: "image/png",
          value: first(response.images),
          updatedAt: Date.now(),
          source: request,
          progress: {
            current: (response.progress ?? 0) * 100,
            total: 100,
            etaSeconds: response.etaSeconds,
          },
        };
        onUpdate?.(updatedContent);
        if (updatedContent.finalized) {
          // setAbortController(undefined);
          resolve(updatedContent);
        }
      },
      subject: "imagegen.txt2img",
      request: {
        body: {
          prompt: request.prompt ?? "",
          ...request,
        },
      },
    });
  });
};
