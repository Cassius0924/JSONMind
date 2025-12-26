import dagre from 'dagre';
import { Node, Edge, Position } from 'reactflow';

const NODE_WIDTH = 200; 
const NODE_HEIGHT = 40;

export const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({ 
    rankdir: direction,
    ranksep: 120, 
    nodesep: 50   
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = Position.Left;
    node.sourcePosition = Position.Right;

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - NODE_WIDTH / 2,
      y: nodeWithPosition.y - NODE_HEIGHT / 2,
    };

    return node;
  });

  return { nodes: layoutedNodes, edges };
};

export const jsonToGraph = (data: any, onAddChild?: (e: React.MouseEvent, nodeData: any, rect: DOMRect) => void) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  const traverse = (currentData: any, parentId: string | null, key: string) => {
    const id = parentId ? `${parentId}.${key}` : 'root';
    const type = Array.isArray(currentData) ? 'array' : typeof currentData;
    
    // Determine Node Type
    let nodeType = 'split'; // Default to primitive
    if (currentData !== null && (type === 'object' || type === 'array')) {
      nodeType = 'container';
    }

    // Create Node
    const node: Node = {
      id,
      type: nodeType,
      position: { x: 0, y: 0 }, // Will be set by layout
      data: {
        label: key,
        value: nodeType === 'split' ? currentData : null,
        type: currentData === null ? 'null' : type,
        isArray: type === 'array',
        path: id.split('.'), // Pass path for easier updates
        onAddChild // Pass callback
      }
    };
    
    nodes.push(node);

    // Create Edge if parent exists
    if (parentId) {
      edges.push({
        id: `e_${parentId}-${id}`,
        source: parentId,
        target: id,
        type: 'default', // Bezier curve
        animated: false,
        style: { stroke: '#b1b1b7', strokeWidth: 2 },
      });
    }

    // Recurse if container
    if (nodeType === 'container') {
      Object.keys(currentData).forEach((childKey) => {
        traverse(currentData[childKey], id, childKey);
      });
    }
  };

  // Start traversal
  // If root is object/array, key is "Root"
  // If root is primitive, key is "Value"
  traverse(data, null, 'Root');

  return getLayoutedElements(nodes, edges);
};
