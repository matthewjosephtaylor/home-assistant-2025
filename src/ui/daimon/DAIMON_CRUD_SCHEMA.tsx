import ContextMenu from "../common/ContextMenu";
import { ContentView } from "../ContentView";
import type { CrudSchema } from "../crud/GenericCrud";
import type { DaimonCrud } from "./DaimonCrud";
import { ImageUpdateContentView } from "./ImageUpdateContentView";
import { startChatWith } from "./startChatWith";


export const DAIMON_CRUD_SCHEMA: CrudSchema<DaimonCrud> = {
  image: {
    label: "Image",
    renderEditor: (value, onChange) => {
      return <ImageUpdateContentView contentId={value} onChange={onChange} />;
    },
    renderCell: (contentId, item) => {
      return (
        <ContextMenu actions={{ Chat: () => startChatWith(item.id) }}>
          <ContentView
            contentId={contentId}
            imgProps={{ style: { maxHeight: "4em" } }} />
        </ContextMenu>
      );
    },
  },
  id: { label: "ID" },
  name: {
    label: "Name",
  },
  description: {
    label: "Description",
  },
  model: {
    label: "Model",
  },

  isUser: {
    label: "User",
    renderCell: (value) => {
      return value ? "Yes" : "No";
    },
    renderEditor: (value, onChange) => {
      return (
        <input
          type="checkbox"
          checked={value ?? false}
          onChange={(event) => {
            onChange(event.target.checked);
          }} />
      );
    },
  },
};
