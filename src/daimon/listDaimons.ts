import {
  DAIMON_OBJECT_STORE,
  type Daimon,
} from "@mjt-services/daimon-common-2025";
import { getConnection } from "../connection/Connections";
import { Datas } from "@mjt-services/data-common-2025";
import { sortDaimonsByLastUsed } from "./sortDaimonsByLastUsed";

export const listDaimons = async (query = "values(@)") => {
  const daimons = (await Datas.search(await getConnection())({
    from: DAIMON_OBJECT_STORE,
    query,
  })) as Daimon[];
  return daimons.toSorted(sortDaimonsByLastUsed);
};
