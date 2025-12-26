import type { TreeNode, NodeType } from './node';

// X6 Node data interface
export interface X6NodeData {
  id: string;
  type: NodeType;
  key: string;
  path: string[];
  collapsed?: boolean;
  childCount?: number;
  value?: string | number | boolean | null;
  children?: TreeNode[];
}

// X6 Node interface
export interface X6Node {
  id: string;
  shape: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  data: X6NodeData;
  ports?: any;
  attrs?: any;
}

// X6 Edge interface
export interface X6Edge {
  id: string;
  source: string;
  target: string;
  attrs?: {
    line?: {
      stroke?: string;
      strokeWidth?: number;
    };
  };
}

// Graph data structure
export interface GraphData {
  nodes: X6Node[];
  edges: X6Edge[];
}
