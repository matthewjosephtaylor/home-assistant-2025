import { isUndefined } from "@mjt-engine/object";
import { Datas } from "@mjt-services/data-common-2025";
import { useState, useEffect } from "react";
import { getConnection } from "../connection/Connections";

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
