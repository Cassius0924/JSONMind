import React, { useEffect, useRef, useState } from 'react';
import { Graph } from '@antv/x6';
import { useAppStore } from '../../store/appStore';
import { treeToGraphData } from '../../core/transformer';
import { registerCustomNodes, updateNodeContent } from './NodeComponents/registerNodes';
import EditNodeDialog from '../Dialogs/EditNodeDialog';
import AddNodeDialog from '../Dialogs/AddNodeDialog';
import { NodeType, type TreeNode, type ContainerNode, type PrimitiveNode } from '../../types/node';
import { generateUUID } from '../../utils/uuid';
import { inferType } from '../../core/parser';
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
  const { rootNode, setSelectedNodeId, updateNode, addChildNode, deleteNode } = useAppStore();
  const [editDialog, setEditDialog] = useState<{ id: string; key: string; value: any; type: string } | null>(null);
  const [addDialog, setAddDialog] = useState<{ parentId: string; parentType: 'object' | 'array' } | null>(null);


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

    // Handle double-click to edit
    graph.on('node:dblclick', ({ node }) => {
      const nodeData = node.getData();
      if (nodeData.shape === 'split-node') {
        setEditDialog({
          id: nodeData.id,
          key: nodeData.key,
          value: nodeData.value,
          type: nodeData.type
        });
      }
    });

    // Handle right-click context menu
    graph.on('node:contextmenu', ({ e, node }) => {
      e.preventDefault();
      const nodeData = node.getData();
      
      // Create custom context menu
      const menu = document.createElement('div');
      menu.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        background: white;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        z-index: 1000;
        min-width: 150px;
      `;

      const menuItems = [];

      // Edit option for primitive nodes
      if (nodeData.shape === 'split-node') {
        menuItems.push({
          label: 'Edit',
          action: () => {
            setEditDialog({
              id: nodeData.id,
              key: nodeData.key,
              value: nodeData.value,
              type: nodeData.type
            });
          }
        });
      }

      // Add child option for container nodes
      if (nodeData.shape === 'container-node') {
        menuItems.push({
          label: 'Add Child',
          action: () => {
            setAddDialog({
              parentId: nodeData.id,
              parentType: nodeData.type === NodeType.OBJECT ? 'object' : 'array'
            });
          }
        });
      }

      // Delete option (not for root)
      if (nodeData.key !== 'root') {
        menuItems.push({
          label: 'Delete',
          action: () => {
            if (confirm(`Delete "${nodeData.key}"?`)) {
              deleteNode(nodeData.id);
            }
          },
          danger: true
        });
      }

      menuItems.forEach((item, index) => {
        const menuItem = document.createElement('div');
        menuItem.textContent = item.label;
        menuItem.style.cssText = `
          padding: 8px 16px;
          cursor: pointer;
          font-size: 14px;
          color: ${item.danger ? '#ff4d4f' : '#262626'};
          ${index > 0 ? 'border-top: 1px solid #f0f0f0;' : ''}
        `;
        menuItem.onmouseenter = () => {
          menuItem.style.backgroundColor = '#f5f5f5';
        };
        menuItem.onmouseleave = () => {
          menuItem.style.backgroundColor = 'white';
        };
        menuItem.onclick = () => {
          item.action();
          document.body.removeChild(menu);
        };
        menu.appendChild(menuItem);
      });

      document.body.appendChild(menu);

      // Remove menu on any click elsewhere
      const removeMenu = () => {
        if (document.body.contains(menu)) {
          document.body.removeChild(menu);
        }
        document.removeEventListener('click', removeMenu);
      };
      setTimeout(() => document.addEventListener('click', removeMenu), 0);
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

  const handleEditSave = (key: string, value: string) => {
    if (editDialog) {
      const inferred = inferType(value);
      updateNode(editDialog.id, { 
        key, 
        value: inferred.value,
        type: inferred.type
      });
      setEditDialog(null);
    }
  };

  const handleAddSave = (key: string, value: string, valueType: string) => {
    if (addDialog) {
      const newId = generateUUID();
      const path: string[] = []; // Path will be updated by store
      
      let newNode: TreeNode;
      if (valueType === 'object') {
        newNode = {
          id: newId,
          type: NodeType.OBJECT,
          key: key || `item${Date.now()}`,
          path,
          children: []
        } as ContainerNode;
      } else if (valueType === 'array') {
        newNode = {
          id: newId,
          type: NodeType.ARRAY,
          key: key || `item${Date.now()}`,
          path,
          children: []
        } as ContainerNode;
      } else {
        const inferred = inferType(value);
        newNode = {
          id: newId,
          type: inferred.type as any,
          key: key || `item${Date.now()}`,
          path,
          value: inferred.value
        } as PrimitiveNode;
      }
      
      addChildNode(addDialog.parentId, newNode);
      setAddDialog(null);
    }
  };

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
      
      {editDialog && (
        <EditNodeDialog
          nodeData={editDialog}
          onSave={handleEditSave}
          onCancel={() => setEditDialog(null)}
        />
      )}
      
      {addDialog && (
        <AddNodeDialog
          parentType={addDialog.parentType}
          onSave={handleAddSave}
          onCancel={() => setAddDialog(null)}
        />
      )}
    </div>
  );
};

export default GraphCanvas;
