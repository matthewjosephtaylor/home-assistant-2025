import type React from "react";
import type { TreeNode } from "./TreeNode";

/**
 * Our "Tree API" includes all the needed CRUD methods
 * plus special methods for notes.
 */

export type TreeApi = {
  /**
   * Load the child nodes of a given parent.
   */
  loadChildren: (parentId?: string, query?: string) => Promise<TreeNode[]>;

  /**
   * Add a child under a given parent.
   */
  addChild: (parentId: string, data: any) => Promise<TreeNode>;

  /**
   * Update a node by ID.
   */
  updateNode: (nodeId: string, data: any) => Promise<TreeNode>;

  /**
   * Remove a node by ID.
   */
  removeNode: (nodeId: string) => Promise<void>;

  /**
   * Return the editor form for adding or updating a node.
   * This function must accept enough info to know what form to render
   * and also handle OK/Cancel.
   */
  getEditorForm: (options: {
    parentId?: string;
    nodeId?: string;
    mode: "add" | "edit";
    onCancel: () => void;
    onOk: (formData: any) => void;
  }) => React.ReactNode;

  /**
   * Which note (by parentId) is currently selected / active?
   */
  getActiveNoteParentId: () => string | undefined;

  /**
   * Set which note (by parentId) is currently selected / active.
   */
  setActiveNoteParentId: (pid?: string) => void;

  /**
   * Render the note’s content for a particular parentId.
   * This is a React component you provide (could be a text field, etc.).
   */
  renderNoteContent: (parentId?: string) => React.ReactNode;
};
