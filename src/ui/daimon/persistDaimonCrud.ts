import { isEmpty } from "@mjt-engine/object";
import { DAIMON_OBJECT_STORE, type Daimon } from "@mjt-services/daimon-common-2025";
import { Ids, Datas } from "@mjt-services/data-common-2025";
import { getConnection } from "../../connection/Connections";
import type { DaimonCrud } from "./DaimonCrud";


export const persistDaimonCrud = async (
  value: DaimonCrud
): Promise<DaimonCrud> => {
  const con = await getConnection();
  const { id: _id, image, model, isUser, ...rest } = value;
  const id = Ids.fromObjectStore(DAIMON_OBJECT_STORE);
  const daimon: Daimon = {
    id,
    chara: {
      data: {
        ...rest,
        extensions: {
          ...(value.extensions ?? {}),
          avatar: image,
          isUser,
          lastUsed: Date.now(),
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
  return { ...value, id };
};
