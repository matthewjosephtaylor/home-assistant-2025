import { Errors } from "@mjt-engine/message";
import { Daimons } from "../../daimon/Daimons";
import type { TreeApi, TreeNode } from "../common/tree/Tree";


export const loadDaimons: TreeApi["loadChildren"] = async (parentId, query) => {
  try {
    const daimons = await Daimons.listDaimons("values(@)");
    const treeNodes: TreeNode[] = daimons.map((daimon) => ({
      id: daimon.id,
      label: daimon.chara.data.name ?? "",
    }));
    return treeNodes;
  } catch (error) {
    console.log(Errors.errorToText(error));
    throw error;
  }
};
