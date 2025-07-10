import { useEffect, useState } from "react";
import { GenericCrud } from "../crud/GenericCrud";

import { Idbs } from "@mjt-engine/idb";
import { Errors } from "@mjt-engine/error";
import { isEmpty, isUndefined } from "@mjt-engine/object";
import {
  DAIMON_OBJECT_STORE,
  type Daimon,
} from "@mjt-services/daimon-common-2025";
import { Datas, Ids } from "@mjt-services/data-common-2025";
import { Stack } from "@mui/system";
import { AppConfig } from "../../AppConfig";
import { getConnection } from "../../connection/Connections";
import { listDaimons } from "../../daimon/listDaimons";
import { bytesToDaimon } from "../../png/bytesToDaimon";
import { useAppState } from "../../state/AppState";
import { FileUpload } from "../common/FileUpload";
import { DAIMON_CRUD_SCHEMA } from "./DAIMON_CRUD_SCHEMA";
import type { DaimonCrud } from "./DaimonCrud";
import { ImportCharaJson } from "./ImportCharaCard";

export const DaimonsScreen = () => {
  const { userDaimonId, setUserDaimonId } = useAppState();
  const [daimonCruds, setDaimonCruds] = useState<DaimonCrud[]>([]);
  const updateDaimons = () => {
    listDaimons().then((daimons) => {
      console.log("daimons", daimons);
      const daimonCruds: DaimonCrud[] = daimons.map(
        (daimon) =>
          ({
            id: daimon.id,
            isUser: daimon.id === userDaimonId,
            image: daimon.chara.data.extensions?.avatar,
            model: daimon.chara.data.extensions?.llm,
            ...daimon.chara.data,
          }) satisfies DaimonCrud
      );
      setDaimonCruds(daimonCruds);
    });
  };
  useEffect(() => {
    updateDaimons();
  }, [userDaimonId]);
  return (
    <Stack alignContent={"center"} spacing={"2em"} padding={"2em"}>
      <Stack justifyContent={"center"} direction={"row"} gap={"5em"}>
        <FileUpload
          onChange={async (file) => {
            console.log("File uploaded", file);
            if (isUndefined(file)) {
              return;
            }
            const daimon = await bytesToDaimon(file);
            console.log(daimon);
            updateDaimons();
          }}
        />
        <ImportCharaJson onImport={() => updateDaimons()} />
      </Stack>
      <GenericCrud
        items={daimonCruds}
        schema={DAIMON_CRUD_SCHEMA}
        onUpdate={async (item, index) => {
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
          console.log("Created item", item);
          const con = await getConnection();
          const { id: _id, image, model, isUser, ...rest } = item;
          try {
            const id = Ids.fromObjectStore(DAIMON_OBJECT_STORE);
            const daimon: Daimon = {
              id,
              chara: {
                data: {
                  ...rest,
                  extensions: {
                    ...(item.extensions ?? {}),
                    avatar: image,
                    isUser,
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

            const daimonCrud: DaimonCrud = { ...item, id };
            setDaimonCruds((prev) => [...prev, daimonCrud]);
          } catch (error) {
            console.log(Errors.errorToText(error));
          }
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
