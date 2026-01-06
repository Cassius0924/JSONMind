import dagre from 'dagre';
import { Node, Edge, Position } from 'reactflow';

// Dagre needs a rough size hint to avoid node/edge overlap. The actual React
// nodes are wider/taller than the previous 200x40 guess, so we estimate a more
// realistic bounding box based on node type and value length.
const MIN_NODE_WIDTH = 180;
const CONTAINER_NODE_WIDTH = 260;
const SPLIT_NODE_WIDTH = 340;
const MAX_NODE_WIDTH = 420;
const BASE_NODE_HEIGHT = 56;
const PER_LINE_HEIGHT = 18;
const AVG_CHARS_PER_LINE = 28;
const MAX_NODE_HEIGHT = 140;

const estimateNodeSize = (node: Node) => {
  const isContainer = node.type === 'container';
  const width = Math.max(
    MIN_NODE_WIDTH,
    Math.min(MAX_NODE_WIDTH, isContainer ? CONTAINER_NODE_WIDTH : SPLIT_NODE_WIDTH)
  );

  // Split nodes render the value and can grow vertically when wrapped. Use a
  // simple character-based heuristic to give Dagre extra vertical space.
  let height = BASE_NODE_HEIGHT;
  if (!isContainer) {
    const rawValue = node.data?.value;
    const serialized = rawValue === null ? 'null' : typeof rawValue === 'string' ? rawValue : JSON.stringify(rawValue);
    const estimatedLines = Math.max(1, Math.ceil(serialized.length / AVG_CHARS_PER_LINE));
    height = Math.min(MAX_NODE_HEIGHT, BASE_NODE_HEIGHT + (estimatedLines - 1) * PER_LINE_HEIGHT);
  }

  return { width, height };
};

export const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({ 
    rankdir: direction,
    ranksep: 80, 
    nodesep: 60   
  });

  nodes.forEach((node) => {
    const { width, height } = estimateNodeSize(node);
    dagreGraph.setNode(node.id, { width, height });
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
      x: nodeWithPosition.x - (estimateNodeSize(node).width / 2),
      y: nodeWithPosition.y - (estimateNodeSize(node).height / 2),
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
