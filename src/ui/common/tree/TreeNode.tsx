import type React from "react";

/**
 * Minimal node structure for the tree.
 */

export type TreeNode = {
  id: string;
  content?: React.ReactNode;
};
