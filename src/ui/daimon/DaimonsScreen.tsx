import { useEffect, useState } from "react";
import { GenericCrud } from "../crud/GenericCrud";

import { Idbs } from "@mjt-engine/idb";
import { isEmpty } from "@mjt-engine/object";
import {
  DAIMON_OBJECT_STORE,
  type Daimon,
} from "@mjt-services/daimon-common-2025";
import { Datas } from "@mjt-services/data-common-2025";
import { Stack } from "@mui/system";
import { AppConfig } from "../../AppConfig";
import { getConnection } from "../../connection/Connections";
import { listDaimons } from "../../daimon/listDaimons";
import { useAppState } from "../../state/AppState";
import { TagSelector } from "../common/TagSelector";
import { DAIMON_CRUD_SCHEMA } from "./DAIMON_CRUD_SCHEMA";
import type { DaimonCrud } from "./DaimonCrud";
import { daimonToDaimonCrud } from "./daimonToDaimonCrud";
import { DaimonUpload } from "./DaimonUpload";
import { persistDaimonCrud } from "./persistDaimonCrud";

export const DaimonsScreen = () => {
  const { userDaimonId, setUserDaimonId } = useAppState();

  const [daimonCruds, setDaimonCruds] = useState<DaimonCrud[]>([]);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [narrowTags, setNarrowTags] = useState<string[]>([]);
  const updateDaimonCruds = async () => {
    const daimons = await listDaimons();
    const allTagsSet = new Set<string>();
    daimons.forEach((d) => {
      d.chara.data.tags?.forEach((tag) => allTagsSet.add(tag));
    });
    setAllTags(Array.from(allTagsSet));

    const filteredDaimons = daimons.filter(
      (d) =>
        filterTags.length === 0 ||
        filterTags.every((tag) => d.chara.data.tags?.includes(tag))
    );
    console.log("Filtered Daimons", filteredDaimons);
    const narrowTagsSet = new Set<string>();
    filteredDaimons.forEach((d) => {
      d.chara.data.tags?.forEach((tag) => narrowTagsSet.add(tag));
    });
    setNarrowTags(Array.from(narrowTagsSet));

    const toDaimonCrud = daimonToDaimonCrud(userDaimonId);
    const daimonCruds: DaimonCrud[] = filteredDaimons.map(toDaimonCrud);
    setDaimonCruds(daimonCruds);
  };
  useEffect(() => {
    updateDaimonCruds();
  }, [userDaimonId, filterTags]);
  const tools = (
    <Stack>
      <DaimonUpload onUpload={updateDaimonCruds} />
      <TagSelector
        allTags={allTags.toSorted()}
        selected={filterTags}
        narrowTags={narrowTags}
        onChange={(newSelected) => {
          setFilterTags(newSelected);
        }}
      />
    </Stack>
  );
  return (
    <Stack alignContent={"center"} spacing={"2em"} padding={"2em"}>
      <GenericCrud
        itemName="Daimon"
        tools={tools}
        items={daimonCruds}
        schema={DAIMON_CRUD_SCHEMA}
        onUpdate={async (item, index) => {
          console.log("Updating item at index", index, item);
          const con = await getConnection();
          const { id, image, model, isUser, ...rest } = item;
          if (isUser) {
            setUserDaimonId(id);
            Idbs.update(AppConfig, "config", (cur) => {
              return { ...cur, userDaimonId: id };
            });
          }
          const daimon: Daimon = {
            id,
            chara: {
              data: {
                ...rest,
                extensions: {
                  ...(rest.extensions ?? {}),
                  avatar: image,
                  isUser,
                  lastUsed: Date.now(),
                  llm: isEmpty(model) ? undefined : model,
                },
              },
              spec: "chara_card_v2",
              spec_version: "2",
            },
          };
          await Datas.put(con)({
            value: daimon,
          });
          setDaimonCruds((prev) => {
            const copy = [...prev];
            copy[index] = item;
            return copy;
          });
        }}
        onCreate={async (item) => {
          const persisted = await persistDaimonCrud(item);
          setDaimonCruds((prev) => [...prev, persisted]);
        }}
        onDelete={async (index) => {
          console.log("Deleted item at index", index);
          const target = daimonCruds[index];
          const con = await getConnection();
          Datas.remove(con)({
            objectStore: DAIMON_OBJECT_STORE,
            query: target.id,
          });
          setDaimonCruds((prev) => {
            const copy = [...prev];
            copy.splice(index, 1);
            return copy;
          });
        }}
      />
    </Stack>
  );
};
