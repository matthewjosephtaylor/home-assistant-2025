import { putContent } from "../common/putContent";
import { ContentView } from "../content/ContentView";
import type { CrudSchema } from "../crud/GenericCrud";
import type { DaimonCrud } from "./DaimonCrud";
import { DaimonMenuAvatar } from "./DaimonMenuAvatar";

export const DAIMON_CRUD_SCHEMA: CrudSchema<DaimonCrud> = {
  image: {
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
  id: { label: "ID", renderCell: (value) => value.slice(-8) },
  name: {},
  description: {
    renderCell: (value) => {
      return value?.slice(0, 100);
    },
  },
  personality: {
    renderCell: (value) => {
      return value?.slice(0, 100);
    },
  },
  scenario: {
    renderCell: (value) => {
      return value?.slice(0, 100);
    },
  },
  first_mes: {
    renderCell: (value) => {
      return value?.slice(0, 100);
    },
  },
  mes_example: {
    renderCell: (value) => {
      return value?.slice(0, 100);
    },
  },
  system_prompt: {
    renderCell: (value) => {
      return value?.slice(0, 100);
    },
  },
  creator_notes: {
    renderCell: (value) => {
      return value?.slice(0, 100);
    },
  },
  creator: {},
  model: {
    label: "Model",
    renderCell: (value) => {
      return value ?? "";
    },
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
