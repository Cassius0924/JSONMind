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
          selector: 'key-part'
        },
        {
          tagName: 'text',
          selector: 'key-text'
        },
        {
          tagName: 'rect',
          selector: 'value-part'
        },
        {
          tagName: 'text',
          selector: 'value-icon'
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
    
    // Key part (left side)
    node.attr('key-part', {
      x: 0,
      y: 0,
      width: 110,
      height: 40,
      fill: '#f5f5f5',
      stroke: 'none'
    });
    
    node.attr('key-text', {
      x: 55,
      y: 20,
      text: data.key,
      fontSize: 13,
      fill: '#595959',
      textAnchor: 'middle',
      textVerticalAnchor: 'middle'
    });
    
    // Value part (right side)
    node.attr('value-part', {
      x: 110,
      y: 0,
      width: 110,
      height: 40,
      fill: color,
      stroke: 'none',
      opacity: 0.3
    });
    
    node.attr('value-icon', {
      x: 120,
      y: 20,
      text: icon,
      fontSize: 12,
      fill: '#262626',
      textAnchor: 'start',
      textVerticalAnchor: 'middle'
    });
    
    node.attr('value-text', {
      x: 140,
      y: 20,
      text: String(data.value),
      fontSize: 13,
      fill: '#262626',
      textAnchor: 'start',
      textVerticalAnchor: 'middle'
    });
  }
}
