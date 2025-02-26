import { Errors } from "@mjt-engine/message";
import { Daimons } from "../../daimon/Daimons";
import type { TreeApi } from "../common/tree/TreeApi";
import type { TreeNode } from "../common/tree/TreeNode";

export const loadDaimons: TreeApi["loadChildren"] = async (parentId, query) => {
  try {
    const daimons = await Daimons.listDaimons("values(@)");
    const treeNodes: TreeNode[] = daimons.map((daimon) => ({
      id: daimon.id,
      content: <>{daimon.chara.data.name ?? daimon.id}</>,
    }));
    return treeNodes;
  } catch (error) {
    console.log(Errors.errorToText(error));
    throw error;
  }
};
