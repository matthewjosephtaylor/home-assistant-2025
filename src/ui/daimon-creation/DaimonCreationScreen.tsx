import { Objects } from "@mjt-engine/object";
import { Stack } from "@mui/system";
import { useState } from "react";
import { TagSelector } from "../common/TagSelector";
import { CrudSchemaValueEditor } from "../crud/CrudSchemaValueEditor";
import { CrudSchema } from "../crud/GenericCrud";
import { DAIMON_CRUD_SCHEMA } from "../daimon/DAIMON_CRUD_SCHEMA";
import { DaimonCrud } from "../daimon/DaimonCrud";

export const DaimonCreationScreen = () => {
  const allParts = Objects.keys(DAIMON_CRUD_SCHEMA);
  const [selectedParts, setSelectedParts] = useState<string[]>([
    "name",
    "description",
  ]);
  const [draft, setDraft] = useState<Partial<DaimonCrud>>({});

  return (
    <Stack
      sx={{
        marginTop: "2em",
        marginLeft: "5ch",
        marginRight: "5ch",
        height: "calc(99.9vh - 1em)",
      }}
    >
      <Stack direction="column" gap="2ch" sx={{ height: "100%" }}>
        <Stack>
          <TagSelector
            allTags={allParts}
            selected={selectedParts}
            narrowTags={selectedParts}
            onChange={setSelectedParts}
          />
        </Stack>
        <Stack spacing={2} direction={"column"}>
          {selectedParts.map((key) => (
            <CrudSchemaValueEditor
              draftKey={key as keyof DaimonCrud}
              key={String(key)}
              draft={draft}
              schema={DAIMON_CRUD_SCHEMA as CrudSchema<Partial<DaimonCrud>>}
              onChange={(key, value) => {
                setDraft((prev) => ({
                  ...prev,
                  [key]: value,
                }));
              }}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};
