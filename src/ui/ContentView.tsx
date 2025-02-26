import { Datas } from "@mjt-services/data-common-2025";
import { useEffect, useState } from "react";
import { getConnection } from "../connection/Connections";
import type { Content } from "@mjt-services/daimon-common-2025";
import { isUndefined } from "@mjt-engine/object";

export const useData = <T extends object>({ id }: { id?: string }) => {
  const [data, setData] = useState<T | undefined>(undefined);

  const update = async (id?: string) => {
    if (isUndefined(id)) {
      setData(undefined);
      return;
    }
    const result = await Datas.get(await getConnection())<T>({ key: id });
    setData(result);
  };

  useEffect(() => {
    update(id);
  }, [id]);

  return data;
};

export const ContentView = ({
  contentId,
}: {
  contentId: string | undefined;
}) => {
  const content = useData<Content>({ id: contentId });
  if (isUndefined(content)) {
    return <div>Loading...</div>;
  }
  if (typeof content.value === "string") {
    return <>{content.value}</>;
  }
  return (
    <>
      type:{content.contentType} creator:{content.creatorId}
    </>
  );
};
