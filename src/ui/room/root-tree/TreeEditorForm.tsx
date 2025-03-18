import type { Content, Room } from "@mjt-services/daimon-common-2025";
import { useData } from "../../../state/useData";
import { putContent } from "../../common/putContent";
import { TextDialog } from "../../crud/TextDialog";

export const TreeEditorForm = ({
  nodeId,
  open,
  onClose,
}: {
  nodeId?: string;
  open: boolean;
  onClose: () => void;
}) => {
  const room = useData<Room>(nodeId);
  const content = useData<Content>(room?.contentId);

  return (
    <>
      <TextDialog
        open={open}
        value={String(content?.value) || ""}
        onClose={onClose}
        onSave={(value: string) => {
          putContent({
            id: content?.id,
            value,
          });
          onClose();
        }}
      />
    </>
  );
};
