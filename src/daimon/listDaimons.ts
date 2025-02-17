import {
  DAIMON_OBJECT_STORE,
  type Daimon,
} from "@mjt-services/daimon-common-2025";
import { getConnection } from "../connection/Connections";
import { Datas } from "@mjt-services/data-common-2025";
export const listDaimons = async (query?: string) => {
  const connection = await getConnection();
  const daimons = (await Datas.search(await getConnection())({
    from: DAIMON_OBJECT_STORE,
    // query: query ? `values(@) and ${query}` : "values(@)",
    query: query,
    // query: "values(@)",
    // next: isDefined(query)
    //   ? {
    //       query,
    //     }
    //   : undefined,
  })) as Daimon[];
  return daimons;
  // return connection.request({
  //   subject: "daimon.list",
  //   request: {
  //     body: {
  //       query,
  //     },
  //   },
  // });
};
