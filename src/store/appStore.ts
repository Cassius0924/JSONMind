import { create } from 'zustand';
import type { TreeNode, ContainerNode, PrimitiveNode } from '../types/node';
import { isContainerNode } from '../types/node';
import { parseJsonToTree } from '../core/parser';
import { treeToJson } from '../core/transformer';

export interface AppState {
  jsonText: string;
  isValid: boolean;
  rootNode: TreeNode | null;
  selectedNodeId: string | null;
  errorMessage: string | null;
}

export interface AppActions {
  updateFromJson: (text: string) => void;
  syncToJson: () => void;
  setRootNode: (node: TreeNode | null) => void;
  setSelectedNodeId: (id: string | null) => void;
  updateNode: (nodeId: string, updates: Partial<TreeNode>) => void;
}

let isUpdatingFromEditor = false;
let isUpdatingFromGraph = false;

export const useAppStore = create<AppState & AppActions>((set, get) => ({
  // State
  jsonText: '{\n  "name": "JSONMind",\n  "version": "1.0.0",\n  "features": ["visualization", "editing"]\n}',
  isValid: true,
  rootNode: null,
  selectedNodeId: null,
  errorMessage: null,

  // Actions: Update tree from JSON text
  updateFromJson: (text: string) => {
    if (isUpdatingFromGraph) return;
    isUpdatingFromEditor = true;

    const result = parseJsonToTree(text);
    if (result.success && result.root) {
      set({
        jsonText: text,
        rootNode: result.root,
        isValid: true,
        errorMessage: null
      });
    } else {
      set({
        isValid: false,
        errorMessage: result.error || 'Invalid JSON'
      });
    }

    isUpdatingFromEditor = false;
  },

  // Actions: Sync tree to JSON text
  syncToJson: () => {
    if (isUpdatingFromEditor) return;
    isUpdatingFromGraph = true;

    const { rootNode } = get();
    if (rootNode) {
      const json = treeToJson(rootNode);
      const text = JSON.stringify(json, null, 2);
      set({ jsonText: text, isValid: true, errorMessage: null });
    }

    isUpdatingFromGraph = false;
  },

  // Actions: Set root node
  setRootNode: (node: TreeNode | null) => {
    set({ rootNode: node });
  },

  // Actions: Set selected node ID
  setSelectedNodeId: (id: string | null) => {
    set({ selectedNodeId: id });
  },

  // Actions: Update node
  updateNode: (nodeId: string, updates: Partial<TreeNode>) => {
    const { rootNode } = get();
    if (!rootNode) return;

    const updateNodeRecursive = (node: TreeNode): TreeNode => {
      if (node.id === nodeId) {
        if (isContainerNode(node)) {
          return { ...node, ...updates } as ContainerNode;
        } else {
          return { ...node, ...updates } as PrimitiveNode;
        }
      }
      if (isContainerNode(node)) {
        return {
          ...node,
          children: node.children.map(updateNodeRecursive)
        };
      }
      return node;
    };

    const updatedRoot = updateNodeRecursive(rootNode);
    set({ rootNode: updatedRoot });
    get().syncToJson();
  }
}));
