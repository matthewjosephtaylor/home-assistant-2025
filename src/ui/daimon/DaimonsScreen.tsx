import { useEffect, useState } from "react";
import { GenericCrud, type CrudSchema } from "../crud/GenericCrud";

import { Idbs } from "@mjt-engine/idb";
import { Errors } from "@mjt-engine/message";
import { isEmpty, isUndefined } from "@mjt-engine/object";
import {
  DAIMON_OBJECT_STORE,
  DaimonCharaCard,
  type Daimon,
} from "@mjt-services/daimon-common-2025";
import { Datas, Ids } from "@mjt-services/data-common-2025";
import { Stack } from "@mui/system";
import { AppConfig } from "../../AppConfig";
import { getConnection } from "../../connection/Connections";
import { listDaimons } from "../../daimon/listDaimons";
import { useAppState } from "../../state/AppState";
import { FileUpload } from "../common/FileUpload";
import { ContentView } from "../ContentView";
import { ImageUpdateContentView } from "./ImageUpdateContentView";
import { bytesToDecodedPng } from "../../png/decodePng";
import { bytesToDaimon } from "../../png/bytesToDaimon";

export const DaimonsScreen = () => {
  const { userDaimonId, setUserDaimonId } = useAppState();
  type DaimonCrud = DaimonCharaCard["data"] & {
    id: string;
    image?: string;
    model?: string;
    isUser?: boolean;
  };
  const schema: CrudSchema<DaimonCrud> = {
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

    image: {
      label: "Image",
      renderEditor: (value, onChange) => {
        return <ImageUpdateContentView contentId={value} onChange={onChange} />;
      },
      renderCell: (contentId) => {
        return (
          <ContentView
            contentId={contentId}
            imgProps={{ style: { maxHeight: "4em" } }}
          />
        );
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
  const [daimonCruds, setDaimonCruds] = useState<DaimonCrud[]>([]);
  const updateDaimons = () => {
    listDaimons().then((daimons) => {
      const daimonCruds: DaimonCrud[] = daimons.map((daimon) => ({
        id: daimon.id,
        isUser: daimon.id === userDaimonId,
        image: daimon.chara.data.extensions?.avatar,
        model: daimon.chara.data.extensions?.llm,
        ...daimon.chara.data,
      }));
      setDaimonCruds(daimonCruds);
    });
  };
  useEffect(() => {
    updateDaimons();
  }, [userDaimonId]);
  return (
    <Stack alignContent={"center"} spacing={"2em"} padding={"2em"}>
      <Stack justifyContent={"center"} direction={"row"}>
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
      </Stack>
      <GenericCrud
        items={daimonCruds}
        schema={schema}
        onUpdate={async (item, index) => {
          console.log("Updated item", item, "at index", index);
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
