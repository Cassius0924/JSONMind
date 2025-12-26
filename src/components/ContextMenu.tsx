import React from 'react';
import { Type, Hash, ToggleLeft, Braces, Brackets, Copy, Ban, Trash2 } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onAddNode: (type: 'string' | 'number' | 'boolean' | 'object' | 'array') => void;
  onDelete?: () => void;
  onSetNull?: () => void;
  onCopyPath?: () => void;
  targetType: 'canvas' | 'node';
  nodeType?: string;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, onAddNode, onDelete, onSetNull, onCopyPath, targetType, nodeType }) => {
  const canAddChild = targetType === 'canvas' || nodeType === 'object' || nodeType === 'array';

  return (
    <div 
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-auto"
      style={{ top: y, left: x }}
      onMouseLeave={onClose}
    >
      {canAddChild && (
        <>
          <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Add {targetType === 'canvas' ? 'to Root' : 'Child'}
          </div>
          <button 
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 whitespace-nowrap"
            onClick={() => onAddNode('string')}
          >
            <Type size={14} className="text-green-600" /> String
          </button>
          <button 
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 whitespace-nowrap"
            onClick={() => onAddNode('number')}
          >
            <Hash size={14} className="text-blue-600" /> Number
          </button>
          <button 
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 whitespace-nowrap"
            onClick={() => onAddNode('boolean')}
          >
            <ToggleLeft size={14} className="text-orange-600" /> Boolean
          </button>
          <div className="border-t border-gray-100 my-1"></div>
          <button 
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 whitespace-nowrap"
            onClick={() => onAddNode('object')}
          >
            <Braces size={14} className="text-purple-600" /> Object
          </button>
          <button 
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 whitespace-nowrap"
            onClick={() => onAddNode('array')}
          >
            <Brackets size={14} className="text-indigo-600" /> Array
          </button>
        </>
      )}
      
      {targetType === 'node' && (
        <>
          <div className="border-t border-gray-100 my-1"></div>
          {onCopyPath && (
            <button 
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 whitespace-nowrap"
              onClick={onCopyPath}
            >
              <Copy size={14} className="text-gray-500" /> Copy JSON Path
            </button>
          )}
          {onSetNull && (
            <button 
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 whitespace-nowrap"
              onClick={onSetNull}
            >
              <Ban size={14} className="text-gray-500" /> Set to Null
            </button>
          )}
          {onDelete && (
            <button 
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 whitespace-nowrap"
              onClick={onDelete}
            >
              <Trash2 size={14} /> Delete Node
            </button>
          )}
        </>
      )}
    </div>
  );
};
