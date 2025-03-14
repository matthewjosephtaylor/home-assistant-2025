import ContextMenu from "../common/ContextMenu";
import { putContent } from "../common/putContent";
import { ContentView } from "../content/ContentView";
import type { CrudSchema } from "../crud/GenericCrud";
import type { DaimonCrud } from "./DaimonCrud";
import { startChatWith } from "./startChatWith";

export const DAIMON_CRUD_SCHEMA: CrudSchema<DaimonCrud> = {
  image: {
    label: "Image",
    renderEditor: (contentId, onChange, item) => {
      return (
        <ContentView
          defaultImagegenRequest={{ prompt: item.description }}
          contentType="image/png"
          contentId={contentId}
          onUpdate={async (value) => {
            await putContent(value);
            onChange?.(value.id);
          }}
          imgProps={{ style: { maxHeight: "8em" } }}
        />
      );
    },
    renderCell: (contentId, item) => {
      return (
        <ContextMenu actions={{ Chat: () => startChatWith(item.id) }}>
          <ContentView
            contentId={contentId}
            imgProps={{ style: { maxHeight: "4em" } }}
          />
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
          }}
        />
      );
    },
  },
};
