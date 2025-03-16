import type { Content } from "@mjt-services/daimon-common-2025";
import { getConnection } from "../../connection/Connections";
import { useAppState } from "../../state/AppState";

export const askDaimon = async (
  query: string,
  onUpdate?: (content: Partial<Content>) => void
) => {
  const con = await getConnection();
  const { activeNoteParentId, userDaimonId } = useAppState.getState();
  return await new Promise<Partial<Content>>((resolve, reject) => {
    con.requestMany({
      subject: "daimon.ask",
      onResponse: (response) => {
        onUpdate?.(response);
        if (response.finalized) {
          resolve(response);
        }
      },
      request: {
        body: {
          roomId: activeNoteParentId,
          userId: userDaimonId,
          query,
        },
      },
    });
  });
};
