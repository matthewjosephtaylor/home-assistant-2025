import { CheckboxWithLabel } from "../common/CheckboxWithLabel";
import { putContent } from "../common/putContent";
import { StringArrayEditor } from "../common/StringArrayEditor";
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
  tags: {
    label: "Tags",
    renderEditor: (value, onChange) => {
      return (
        <StringArrayEditor
          direction="row"
          spacing={1}
          useFlexGap
          flexWrap="wrap"
          alignItems="flex-start"
          sx={{ width: "fit-content" }}
          value={value ?? []}
          label={"Tags"}
          onChange={(value) => {
            onChange(value as string[]);
          }}
        />
      );
    },
    renderCell: (value) => {
      if (!value || value.length === 0) {
        return "None";
      }
      return value
        .map((greeting) => greeting.slice(0, 100))
        .join(", ")
        .slice(0, 100);
    },
  },
  alternate_greetings: {
    label: "Alternate Greetings",
    renderEditor: (value, onChange) => {
      return (
        <StringArrayEditor
          direction="row"
          spacing={1}
          useFlexGap
          flexWrap="wrap"
          alignItems="flex-start"
          sx={{ width: "fit-content" }}
          value={value ?? []}
          label={"Alternate Greetings"}
          onChange={(value) => {
            onChange(value as string[]);
          }}
        />
      );
    },
    renderCell: (value) => {
      if (!value) {
        return "None";
      }
      if (Array.isArray(value)) {
        return value
          .map((greeting) => greeting.slice(0, 100))
          .join(", ")
          .slice(0, 100);
      }
      if (typeof value === "string") {
        // @ts-ignore there is a bad value in some chara cards
        return value.slice(0, 100);
      }
      return "Invalid type";
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

  id: { label: "ID", renderCell: (value) => value.slice(-8) },
  isUser: {
    label: "User",
    renderCell: (value) => {
      return value ? "Yes" : "No";
    },
    renderEditor: (value, onChange) => {
      return (
        <CheckboxWithLabel
          label="Is User"
          checked={value ?? false}
          onChange={(e) => onChange(e.target.checked)}
        />
      );
    },
  },
};
