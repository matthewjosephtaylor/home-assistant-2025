import {
  type Content,
  CONTENT_OBJECT_STORE,
} from "@mjt-services/daimon-common-2025";
import { getConnection } from "../../connection/Connections";
import { putEntity } from "./putEntity";

export const putContent = async (draft: Partial<Content> = {}) => {
  return putEntity(await getConnection())(CONTENT_OBJECT_STORE)(draft);
};
