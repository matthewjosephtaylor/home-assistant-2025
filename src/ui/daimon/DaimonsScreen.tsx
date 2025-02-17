import { useEffect, useState } from "react";
import { GenericCrud, type CrudSchema } from "../crud/GenericCrud";

import { DaimonCharaCard } from "@mjt-services/daimon-common-2025";
import { getConnection } from "../../connection/Connections";
import { Errors } from "@mjt-engine/message";

export const DaimonsScreen = () => {
  type DaimonCrud = DaimonCharaCard["data"] & { id: string };
  const schema: CrudSchema<DaimonCrud> = {
    id: { label: "ID" },
    name: {
      label: "Name",
    },
    description: {
      label: "Description",
    },
  };
  const [daimonCruds, setDaimonCruds] = useState<DaimonCrud[]>([]);
  useEffect(() => {
    getConnection().then(async (connection) => {
      const daimons = await connection.request({
        subject: "daimon.list",
        request: { body: {} },
      });
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
          const resp = await con.request({
            subject: "daimon.update",
            request: {
              body: {
                id,
                chara: {
                  data: rest,
                  spec: "chara_card_v2",
                  spec_version: "2",
                },
              },
            },
          });
          if (resp.success) {
            setDaimonCruds((prev) => {
              const copy = [...prev];
              copy[index] = item;
              return copy;
            });
          }
        }}
        onCreate={async (item) => {
          console.log("Created item", item);
          const con = await getConnection();
          try {
            const resp = await con.request({
              request: {
                body: {
                  data: item,
                  spec: "chara_card_v2",
                  spec_version: "2",
                },
              },
              subject: "daimon.create",
            });
            const { id } = resp;
            const daimonCrud: DaimonCrud = { ...item, id };
            setDaimonCruds((prev) => [...prev, daimonCrud]);
          } catch (error) {
            // console.
            console.log(Errors.errorToText(error));
            console.log("Error creating daimon", error);
            console.log("Error creating daimon cause", error["cause"]);
          }
        }}
        onDelete={async (index) => {
          console.log("Deleted item at index", index);
          const target = daimonCruds[index];
          const con = await getConnection();
          const resp = await con.request({
            subject: "daimon.remove",
            request: {
              body: {
                id: target.id,
              },
            },
          });
          if (resp.success) {
            setDaimonCruds((prev) => {
              const copy = [...prev];
              copy.splice(index, 1);
              return copy;
            });
          }
        }}
      />
    </>
  );
};
