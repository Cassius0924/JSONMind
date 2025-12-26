export * from './node';
export * from './graph';

// Global state interface
export interface AppState {
  jsonText: string;              // Original JSON text
  isValid: boolean;              // Whether JSON format is legal
  rootNode: TreeNode | null;     // Data model tree root node
  selectedNodeId: string | null; // Currently selected node ID
  errorMessage: string | null;   // Error message
}

// Import TreeNode for use in AppState
import type { TreeNode } from './node';
