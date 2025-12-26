import { NodeType, type TreeNode, type ContainerNode, type PrimitiveNode, isContainerNode } from '../types/node';

/**
 * Convert data model tree to standard JSON
 */
export function treeToJson(node: TreeNode): any {
  if (node.type === NodeType.OBJECT) {
    const obj: Record<string, any> = {};
    (node as ContainerNode).children.forEach(child => {
      obj[child.key] = treeToJson(child);
    });
    return obj;
  }

  if (node.type === NodeType.ARRAY) {
    return (node as ContainerNode).children.map(child => treeToJson(child));
  }

  return (node as PrimitiveNode).value;
}

/**
 * Convert internal data model to X6 graph data format
 */
export function treeToGraphData(
  node: TreeNode,
  maxDepth: number = 3
): { nodes: any[]; edges: any[] } {
  const nodes: any[] = [];
  const edges: any[] = [];

  function traverse(current: TreeNode, depth: number, parentId?: string) {
    // Create graph node
    const graphNode = createGraphNode(current, depth >= maxDepth);
    nodes.push(graphNode);

    // Create edge to parent node
    if (parentId) {
      edges.push({
        id: `edge-${parentId}-${current.id}`,
        source: parentId,
        target: current.id,
        attrs: {
          line: {
            stroke: '#C2C8D5',
            strokeWidth: 2
          }
        }
      });
    }

    // Recursively process child nodes
    if (isContainerNode(current) && depth < maxDepth) {
      current.children.forEach(child => traverse(child, depth + 1, current.id));
    }
  }

  traverse(node, 0);
  return { nodes, edges };
}

/**
 * Create graph node from tree node
 */
function createGraphNode(node: TreeNode, collapsed: boolean = false): any {
  const isContainer = isContainerNode(node);
  
  return {
    id: node.id,
    shape: isContainer ? 'container-node' : 'split-node',
    width: isContainer ? 120 : 220,
    height: isContainer ? 40 : 40,
    data: {
      ...node,
      collapsed,
      childCount: isContainer ? node.children.length : 0
    }
  };
}

/**
 * Get color by node type
 */
export function getColorByType(type: NodeType): string {
  const colorMap: Record<NodeType, string> = {
    [NodeType.STRING]: '#52c41a',   // Green
    [NodeType.NUMBER]: '#1890ff',   // Blue
    [NodeType.BOOLEAN]: '#fa8c16',  // Orange
    [NodeType.NULL]: '#8c8c8c',     // Grey
    [NodeType.OBJECT]: '#d9d9d9',   // Default grey
    [NodeType.ARRAY]: '#d9d9d9'     // Default grey
  };
  return colorMap[type];
}

/**
 * Get icon by node type
 */
export function getIconByType(type: NodeType, value?: any): string {
  const iconMap: Record<NodeType, string> = {
    [NodeType.STRING]: '📝',
    [NodeType.NUMBER]: '#',
    [NodeType.BOOLEAN]: value ? '✓' : '✗',
    [NodeType.NULL]: '∅',
    [NodeType.OBJECT]: '{}',
    [NodeType.ARRAY]: '[]'
  };
  return iconMap[type];
}
