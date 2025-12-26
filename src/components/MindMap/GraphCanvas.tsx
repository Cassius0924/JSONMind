import React, { useEffect, useRef } from 'react';
import { Graph } from '@antv/x6';
import { useAppStore } from '../../store/appStore';
import { treeToGraphData } from '../../core/transformer';
import { registerCustomNodes, updateNodeContent } from './NodeComponents/registerNodes';
import './GraphCanvas.css';

// Register nodes once at module level
let nodesRegistered = false;
if (!nodesRegistered) {
  registerCustomNodes();
  nodesRegistered = true;
}

const GraphCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);
  const { rootNode, setSelectedNodeId } = useAppStore();

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize graph
    const graph = new Graph({
      container: containerRef.current,
      autoResize: true,
      panning: true,
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],
        minScale: 0.5,
        maxScale: 2
      },
      background: {
        color: '#f5f5f5'
      },
      grid: {
        visible: true,
        type: 'dot',
        size: 10,
        args: {
          color: '#e0e0e0',
          thickness: 1
        }
      }
    });

    // Handle node selection
    graph.on('node:click', ({ node }) => {
      const nodeData = node.getData();
      setSelectedNodeId(nodeData.id);
    });

    // Handle blank canvas click
    graph.on('blank:click', () => {
      setSelectedNodeId(null);
    });

    graphRef.current = graph;

    return () => {
      graph.dispose();
    };
  }, [setSelectedNodeId]);

  useEffect(() => {
    if (!graphRef.current || !rootNode) return;

    const graph = graphRef.current;
    
    // Convert tree to graph data
    const { nodes, edges } = treeToGraphData(rootNode, 3);

    // Clear existing cells
    graph.clearCells();

    // Add nodes and edges
    nodes.forEach(nodeData => {
      const node = graph.addNode(nodeData);
      updateNodeContent(node);
    });
    
    graph.addEdges(edges);

    // Calculate and apply layout
    const cellsMap = new Map<string, any>();
    graph.getNodes().forEach((node: any) => {
      cellsMap.set(node.id, node);
    });

    // Position nodes in layers from left to right
    const visited = new Set<string>();
    const levelMap = new Map<string, number>();
    
    const calculateLevels = (nodeId: string, level: number) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      levelMap.set(nodeId, level);
      
      // Find children
      edges.forEach((edge: any) => {
        if (edge.source === nodeId) {
          calculateLevels(edge.target, level + 1);
        }
      });
    };

    // Start from root
    if (nodes.length > 0) {
      calculateLevels(nodes[0].id, 0);
    }

    // Position nodes by level
    const levelNodes = new Map<number, string[]>();
    levelMap.forEach((level, nodeId) => {
      if (!levelNodes.has(level)) {
        levelNodes.set(level, []);
      }
      levelNodes.get(level)!.push(nodeId);
    });

    levelNodes.forEach((nodeIds, level) => {
      const xPos = level * 280;
      nodeIds.forEach((nodeId, index) => {
        const node = cellsMap.get(nodeId);
        if (node) {
          const yPos = index * 80 + 50;
          node.setPosition(xPos, yPos);
        }
      });
    });

    // Use requestAnimationFrame for smooth rendering
    requestAnimationFrame(() => {
      graph.centerContent();
    });
  }, [rootNode]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        padding: '10px', 
        borderBottom: '1px solid #d9d9d9',
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
      }}>
        <button 
          onClick={() => graphRef.current?.zoom(0.1)}
          aria-label="Zoom in"
          style={{
            padding: '6px 12px',
            cursor: 'pointer',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            backgroundColor: '#fff'
          }}
        >
          Zoom In
        </button>
        <button 
          onClick={() => graphRef.current?.zoom(-0.1)}
          aria-label="Zoom out"
          style={{
            padding: '6px 12px',
            cursor: 'pointer',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            backgroundColor: '#fff'
          }}
        >
          Zoom Out
        </button>
        <button 
          onClick={() => graphRef.current?.centerContent()}
          aria-label="Fit view to content"
          style={{
            padding: '6px 12px',
            cursor: 'pointer',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            backgroundColor: '#fff'
          }}
        >
          Fit View
        </button>
      </div>
      <div ref={containerRef} style={{ flex: 1, position: 'relative' }} />
    </div>
  );
};

export default GraphCanvas;
