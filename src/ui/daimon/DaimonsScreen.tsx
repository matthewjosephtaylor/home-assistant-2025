import { useEffect, useState, type ReactNode } from "react";
import { GenericCrud, type CrudSchema } from "../crud/GenericCrud";

import { Errors } from "@mjt-engine/message";
import { isUndefined } from "@mjt-engine/object";
import {
  CONTENT_OBJECT_STORE,
  DAIMON_OBJECT_STORE,
  DaimonCharaCard,
  type Content,
  type Daimon,
} from "@mjt-services/daimon-common-2025";
import { Datas, Ids } from "@mjt-services/data-common-2025";
import { getConnection } from "../../connection/Connections";
import { listDaimons } from "../../daimon/listDaimons";
import { FileUpload } from "../common/FileUpload";
import { ContentView } from "../ContentView";
import { Box } from "@mui/system";

export const fileToContentId = async (file: File, creatorId?: string) => {
  const ab = await file.arrayBuffer();
  const content: Content = {
    id: Ids.fromObjectStore(CONTENT_OBJECT_STORE),
    contentType: file.type ?? "application/octet-stream",
    value: ab,
    createdAt: Date.now(),
    creatorId,
    finalized: true,
  };
  await Datas.put(await getConnection())({
    value: content,
  });
  return content.id;
};

export const ImageUpdateContentView = ({
  contentId,
  onChange,
}: {
  contentId: string | undefined;
  onChange?: (newValue: string) => void;
}) => {
  if (isUndefined(contentId)) {
    // return <div>Upload button go here</div>;
    return (
      <FileUpload
        onChange={async function (file): Promise<void> {
          console.log("File uploaded", file);
          if (isUndefined(file)) {
            return;
          }
          const contentId = await fileToContentId(file);
          console.log("Content ID", contentId);
          onChange?.(contentId);
        }}
        renderFile={function (file: File): ReactNode {
          return (
            <ContentView
              contentId={contentId}
              imgProps={{ style: { maxHeight: "8em" } }}
            />
          );
        }}
      />
    );
  }
  return (
    <ContentView
      contentId={contentId}
      imgProps={{ style: { maxHeight: "8em" } }}
    />
  );
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
        return (
          <ContentView
            contentId={contentId}
            imgProps={{ style: { maxHeight: "4em" } }}
          />
        );
      },
    },
  };
  const [daimonCruds, setDaimonCruds] = useState<DaimonCrud[]>([]);
  useEffect(() => {
    listDaimons().then((daimons) => {
      const daimonCruds: DaimonCrud[] = daimons.map((daimon) => ({
        id: daimon.id,
        image: daimon.chara.data.extensions?.avatar,
        ...daimon.chara.data,
      }));
      setDaimonCruds(daimonCruds);
    });
  }, []);
  return (
    <Box>
      Daimon section
      <GenericCrud
        items={daimonCruds}
        schema={schema}
        onUpdate={async (item, index) => {
          console.log("Updated item", item, "at index", index);
          const con = await getConnection();
          const { id, image, ...rest } = item;
          const daimon: Daimon = {
            id,
            chara: {
              data: {
                ...rest,
                extensions: { ...(rest.extensions ?? {}), avatar: image },
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
          const { id: _id, image, ...rest } = item;
          try {
            const id = Ids.fromObjectStore(DAIMON_OBJECT_STORE);
            const daimon: Daimon = {
              id,
              chara: {
                data: {
                  ...rest,
                  extensions: { ...(item.extensions ?? {}), avatar: image },
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
    </Box>
  );
};
