import { Box } from "@mui/material";
import { Daimons } from "../../daimon/Daimons";
import {
  type LoadChildrenFn,
  type TreeNode,
  TreeView,
} from "../common/tree/Tree";
import { ChatBox } from "./ChatBox";

export const daimonsToTree: LoadChildrenFn = async (parentId, query) => {
  console.log("daimonsToTree", { parentId, query });
  // const resp =
  const daimons = await Daimons.listDaimons("values(@)");
  const treeNodes: TreeNode[] = daimons.map((daimon) => ({
    id: daimon.id,
    label: daimon.chara.data.name ?? "",
    hasChildren: false,
  }));
  return treeNodes;
};

// Example data: each node has a `parentId` so we can figure out the hierarchy.
type RawNode = {
  id: string;
  parentId?: string;
  label: string;
  hasChildren?: boolean;
};

const ALL_NODES: RawNode[] = [
  { id: "r1", label: "Root 1", hasChildren: true },
  { id: "r2", label: "Root 2", hasChildren: true },
  // Children of Root 1
  { id: "c1-1", parentId: "r1", label: "Child 1-1", hasChildren: true },
  { id: "c1-2", parentId: "r1", label: "Child 1-2" },
  // Grandchildren of Child 1-1
  { id: "g1-1-1", parentId: "c1-1", label: "Grandchild 1-1-1" },
  { id: "g1-1-2", parentId: "c1-1", label: "Grandchild 1-1-2" },
  // Children of Root 2
  { id: "c2-1", parentId: "r2", label: "Child 2-1" },
  { id: "c2-2", parentId: "r2", label: "Child 2-2", hasChildren: true },
  // Grandchildren of Child 2-2
  { id: "g2-2-1", parentId: "c2-2", label: "Grandchild 2-2-1" },
];

export const fakeLoadChildren: LoadChildrenFn = async (parentId, query) => {
  const lowerQuery = query?.toLowerCase() ?? "";

  // Filter down to children of the specified parentId
  const filtered = ALL_NODES.filter((node) => node.parentId === parentId);

  // Further filter by the search term
  const finalList = filtered.filter((node) =>
    node.label.toLowerCase().includes(lowerQuery)
  );

  // Convert RawNode -> TreeNode
  return finalList.map((node) => ({
    id: node.id,
    label: node.label,
    hasChildren: node.hasChildren,
  }));
};

export const RoomScreen = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      {/* <TreeView loadChildren={fakeLoadChildren} /> */}
      <TreeView loadChildren={daimonsToTree} />
      <ChatBox />
    </Box>
  );
};
