import { Graph } from '@antv/x6';
import { NodeType } from '../../../types/node';
import { getColorByType, getIconByType } from '../../../core/transformer';

const MAX_VALUE_DISPLAY_LENGTH = 12;

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
        },
        keyBg: {
          refX: 0,
          refY: 0,
          refWidth: '50%',
          refHeight: '100%',
          fill: '#f5f5f5',
          stroke: 'none'
        },
        valueBg: {
          refX: '50%',
          refY: 0,
          refWidth: '50%',
          refHeight: '100%',
          fill: '#52c41a',
          fillOpacity: 0.15,
          stroke: 'none'
        },
        divider: {
          refX: '50%',
          refY: 0,
          refY2: '100%',
          stroke: '#d9d9d9',
          strokeWidth: 1
        },
        keyText: {
          refX: '25%',
          refY: '50%',
          textAnchor: 'middle',
          textVerticalAnchor: 'middle',
          fontSize: 12,
          fill: '#595959',
          fontWeight: '500'
        },
        valueText: {
          refX: '75%',
          refY: '50%',
          textAnchor: 'middle',
          textVerticalAnchor: 'middle',
          fontSize: 12,
          fill: '#262626',
          fontWeight: '500'
        }
      },
      markup: [
        {
          tagName: 'rect',
          selector: 'body'
        },
        {
          tagName: 'rect',
          selector: 'keyBg'
        },
        {
          tagName: 'rect',
          selector: 'valueBg'
        },
        {
          tagName: 'line',
          selector: 'divider'
        },
        {
          tagName: 'text',
          selector: 'keyText'
        },
        {
          tagName: 'text',
          selector: 'valueText'
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
    
    // Update value background color
    node.attr('valueBg/fill', color);
    
    // Update key text
    const keyDisplay = data.key.length > 10 ? data.key.substring(0, 10) + '...' : data.key;
    node.attr('keyText/text', keyDisplay);
    
    // Update value text with icon
    const displayValue = valueText.length > MAX_VALUE_DISPLAY_LENGTH 
      ? valueText.substring(0, MAX_VALUE_DISPLAY_LENGTH) + '...' 
      : valueText;
    node.attr('valueText/text', `${icon} ${displayValue}` );
  }
}
