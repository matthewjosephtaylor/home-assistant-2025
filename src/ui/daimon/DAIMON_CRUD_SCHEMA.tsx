import { putContent } from "../common/putContent";
import { ContentView } from "../content/ContentView";
import type { CrudSchema } from "../crud/GenericCrud";
import type { DaimonCrud } from "./DaimonCrud";
import { DaimonMenuAvatar } from "./DaimonMenuAvatar";

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
        <DaimonMenuAvatar
          imageContentId={contentId}
          daimonId={item.id}
        ></DaimonMenuAvatar>
      );
    },
  },
  id: { label: "ID" },
  name: {
    label: "Name",
  },
  description: {
    label: "Description",
    renderCell: (value) => {
      return value?.slice(0, 100);
    },
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
