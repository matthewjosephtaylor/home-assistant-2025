import { DAIMON_OBJECT_STORE, type Daimon } from "@mjt-services/daimon-common-2025";
import { Datas } from "@mjt-services/data-common-2025";
import { getConnection } from "../../connection/Connections";


export const nameToDaimons = async (name: string) => {
  const query = `values(@) | [?contains(chara.data.name, '${name}')]`;
  return Datas.search(await getConnection())({
    from: DAIMON_OBJECT_STORE,
    query: query,
  }) as unknown as Daimon[];
};
