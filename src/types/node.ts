// Node type constants
export const NodeType = {
  OBJECT: 'object',
  ARRAY: 'array',
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  NULL: 'null'
} as const;

export type NodeType = typeof NodeType[keyof typeof NodeType];

// Base node interface
export interface BaseNode {
  id: string;                    // Unique identifier (UUID)
  type: NodeType;                // Node type
  key: string;                   // Key name (Object property name or Array index)
  path: string[];                // JSON path (e.g., ['data', 'users', '0'])
}

// Container node (Object/Array)
export interface ContainerNode extends BaseNode {
  type: typeof NodeType.OBJECT | typeof NodeType.ARRAY;
  children: TreeNode[];          // Child node list
}

// Basic value node (Primitive)
export interface PrimitiveNode extends BaseNode {
  type: typeof NodeType.STRING | typeof NodeType.NUMBER | typeof NodeType.BOOLEAN | typeof NodeType.NULL;
  value: string | number | boolean | null;
}

// Union type
export type TreeNode = ContainerNode | PrimitiveNode;

// Type guards
export function isContainerNode(node: TreeNode): node is ContainerNode {
  return node.type === NodeType.OBJECT || node.type === NodeType.ARRAY;
}

export function isPrimitiveNode(node: TreeNode): node is PrimitiveNode {
  return node.type === NodeType.STRING || 
         node.type === NodeType.NUMBER || 
         node.type === NodeType.BOOLEAN || 
         node.type === NodeType.NULL;
}
