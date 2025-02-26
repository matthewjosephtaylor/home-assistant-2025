import { useEffect, useState } from "react";
import { GenericCrud, type CrudSchema } from "../crud/GenericCrud";

import { Errors } from "@mjt-engine/message";
import {
  DAIMON_OBJECT_STORE,
  DaimonCharaCard,
  type Daimon,
} from "@mjt-services/daimon-common-2025";
import { Datas, Ids } from "@mjt-services/data-common-2025";
import { getConnection } from "../../connection/Connections";
import { listDaimons } from "../../daimon/listDaimons";
import { ContentView } from "../ContentView";
import { isUndefined } from "@mjt-engine/object";

export const ImageUpdateContentView = ({
  contentId,
  onChange,
}: {
  contentId: string | undefined;

  onChange?: (newValue: string) => void;
}) => {
  if (isUndefined(contentId)) {
    return <div>Upload button go here</div>;
  }
  return <ContentView contentId={contentId} />;
};

export const DaimonsScreen = () => {
  type DaimonCrud = DaimonCharaCard["data"] & { id: string; image?: string };
  const schema: CrudSchema<DaimonCrud> = {
    id: { label: "ID" },
    name: {
      label: "Name",
    },
    description: {
      label: "Description",
    },
    image: {
      label: "Image",
      renderEditor: (value, onChange) => {
        return <ImageUpdateContentView contentId={value} onChange={onChange} />;
      },
      renderCell: (contentId) => {
        console.log("Image contentId", contentId);
        return <ImageUpdateContentView contentId={contentId} />;
      },
    },
  };
  const [daimonCruds, setDaimonCruds] = useState<DaimonCrud[]>([]);
  useEffect(() => {
    listDaimons().then((daimons) => {
      const daimonCruds: DaimonCrud[] = daimons.map((daimon) => ({
        id: daimon.id,
        ...daimon.chara.data,
      }));
      setDaimonCruds(daimonCruds);
    });
  }, []);
  return (
    <>
      Daimon section
      <GenericCrud
        items={daimonCruds}
        schema={schema}
        onUpdate={async (item, index) => {
          console.log("Updated item", item, "at index", index);
          const con = await getConnection();
          const { id, ...rest } = item;
          const daimon: Daimon = {
            id,
            chara: {
              data: rest,
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
          try {
            const id = Ids.fromObjectStore(DAIMON_OBJECT_STORE);
            const daimon: Daimon = {
              id,
              chara: {
                data: item,
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
    </>
  );
};
