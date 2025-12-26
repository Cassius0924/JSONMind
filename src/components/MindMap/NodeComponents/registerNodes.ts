import { Graph } from '@antv/x6';
import { NodeType } from '../../../types/node';
import { getColorByType, getIconByType } from '../../../core/transformer';

export function registerCustomNodes() {
  // Register Container Node (Object/Array)
  Graph.registerNode(
    'container-node',
    {
      inherit: 'rect',
      width: 120,
      height: 40,
      attrs: {
        body: {
          stroke: '#5F95FF',
          strokeWidth: 2,
          fill: '#EFF4FF',
          rx: 6,
          ry: 6
        },
        label: {
          fontSize: 14,
          fill: '#262626',
          refX: 0.5,
          refY: 0.5,
          textAnchor: 'middle',
          textVerticalAnchor: 'middle'
        }
      },
      markup: [
        {
          tagName: 'rect',
          selector: 'body'
        },
        {
          tagName: 'text',
          selector: 'label'
        }
      ]
    },
    true
  );

  // Register Split Node (Primitive values)
  Graph.registerNode(
    'split-node',
    {
      inherit: 'rect',
      width: 220,
      height: 40,
      attrs: {
        body: {
          stroke: '#d9d9d9',
          strokeWidth: 1,
          fill: '#ffffff',
          rx: 6,
          ry: 6
        }
      },
      markup: [
        {
          tagName: 'rect',
          selector: 'body'
        },
        {
          tagName: 'rect',
          selector: 'key-bg'
        },
        {
          tagName: 'rect',
          selector: 'value-bg'
        },
        {
          tagName: 'line',
          selector: 'divider'
        },
        {
          tagName: 'text',
          selector: 'key-text'
        },
        {
          tagName: 'text',
          selector: 'value-text'
        }
      ]
    },
    true
  );
}

// Helper function to update node content after creation
export function updateNodeContent(node: any) {
  const data = node.getData();
  
  if (node.shape === 'container-node') {
    const icon = getIconByType(data.type);
    const label = `${icon} ${data.key}`;
    node.attr('label/text', label);
    
    // Color for container nodes
    if (data.type === NodeType.OBJECT) {
      node.attr('body/fill', '#FFF7E6');
      node.attr('body/stroke', '#FA8C16');
    } else if (data.type === NodeType.ARRAY) {
      node.attr('body/fill', '#E6F7FF');
      node.attr('body/stroke', '#1890FF');
    }
  } else if (node.shape === 'split-node') {
    const color = getColorByType(data.type);
    const icon = getIconByType(data.type, data.value);
    const valueText = String(data.value);
    
    // Main body border
    node.attr('body/stroke', '#d9d9d9');
    node.attr('body/strokeWidth', 1);
    node.attr('body/fill', '#ffffff');
    
    // Left background (key side) - grey
    node.attr('key-bg', {
      x: 1,
      y: 1,
      width: 108,
      height: 38,
      fill: '#f5f5f5',
      stroke: 'none',
      pointerEvents: 'none'
    });
    
    // Right background (value side) - colored
    node.attr('value-bg', {
      x: 110,
      y: 1,
      width: 109,
      height: 38,
      fill: color,
      opacity: 0.15,
      stroke: 'none',
      pointerEvents: 'none'
    });
    
    // Divider line between key and value
    node.attr('divider', {
      x1: 110,
      y1: 0,
      x2: 110,
      y2: 40,
      stroke: '#d9d9d9',
      strokeWidth: 1,
      pointerEvents: 'none'
    });
    
    // Key text - left side
    node.attr('key-text', {
      x: 55,
      y: 20,
      text: data.key,
      fontSize: 12,
      fill: '#595959',
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
      fontWeight: '500',
      pointerEvents: 'none'
    });
    
    // Value text with icon - right side
    const displayValue = valueText.length > 12 ? valueText.substring(0, 12) + '...' : valueText;
    node.attr('value-text', {
      x: 165,
      y: 20,
      text: `${icon} ${displayValue}`,
      fontSize: 12,
      fill: '#262626',
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
      fontWeight: '500',
      pointerEvents: 'none'
    });
  }
}
