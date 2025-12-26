import { memo, useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import clsx from 'clsx';
import { useJsonStore } from '../../store/useJsonStore';
import { Trash2, Type, Hash, ToggleLeft, Ban } from 'lucide-react';
import { TYPE_COLORS, NODE_STYLES } from '../../config/constants';

export const SplitNode = memo(({ data }: NodeProps) => {
  const { label, value, type, path } = data;
  const { updateNodeValue, renameNodeKey, deleteNode, selectedPath } = useJsonStore();
  const isSelected = selectedPath?.join('.') === path?.join('.');
  
  const [isEditingKey, setIsEditingKey] = useState(false);
  const [isEditingValue, setIsEditingValue] = useState(false);
  const [localKey, setLocalKey] = useState(label);
  const [localValue, setLocalValue] = useState(String(value));
  const [showActions, setShowActions] = useState(false);
  const [keyEditWidth, setKeyEditWidth] = useState<number | null>(null);
  const [valueEditWidth, setValueEditWidth] = useState<number | null>(null);

  const keyInputRef = useRef<HTMLTextAreaElement>(null);
  const valueInputRef = useRef<HTMLTextAreaElement>(null);
  const keyDisplayRef = useRef<HTMLDivElement>(null);
  const valueDisplayRef = useRef<HTMLDivElement>(null);

  const valueColorClass = TYPE_COLORS[type as keyof typeof TYPE_COLORS] || TYPE_COLORS.object;

  useEffect(() => {
    setLocalKey(label);
  }, [label]);

  useEffect(() => {
    setLocalValue(String(value));
  }, [value]);

  const startEditingKey = useCallback(() => {
    if (keyDisplayRef.current) {
      setKeyEditWidth(keyDisplayRef.current.offsetWidth);
    }
    setIsEditingKey(true);
  }, []);

  const startEditingValue = useCallback(() => {
    if (type === 'boolean') return;
    if (valueDisplayRef.current) {
      setValueEditWidth(valueDisplayRef.current.offsetWidth);
    }
    setIsEditingValue(true);
  }, [type]);

  useLayoutEffect(() => {
    if (isEditingKey && keyInputRef.current) {
      keyInputRef.current.focus();
      keyInputRef.current.select();
      keyInputRef.current.style.height = 'auto';
      keyInputRef.current.style.height = Math.max(keyInputRef.current.scrollHeight, 20) + 'px';
    }
  }, [isEditingKey]);

  useLayoutEffect(() => {
    if (isEditingKey && keyInputRef.current) {
      keyInputRef.current.style.height = 'auto';
      keyInputRef.current.style.height = Math.max(keyInputRef.current.scrollHeight, 20) + 'px';
    }
  }, [localKey, isEditingKey]);

  useLayoutEffect(() => {
    if (isEditingValue && valueInputRef.current) {
      valueInputRef.current.focus();
      valueInputRef.current.select();
      valueInputRef.current.style.height = 'auto';
      valueInputRef.current.style.height = Math.max(valueInputRef.current.scrollHeight, 20) + 'px';
    }
  }, [isEditingValue]);

  useLayoutEffect(() => {
    if (isEditingValue && valueInputRef.current) {
      valueInputRef.current.style.height = 'auto';
      valueInputRef.current.style.height = Math.max(valueInputRef.current.scrollHeight, 20) + 'px';
    }
  }, [localValue, isEditingValue]);

  const handleKeySubmit = () => {
    setIsEditingKey(false);
    setKeyEditWidth(null);
    if (localKey !== label && localKey.trim()) {
      renameNodeKey(path, localKey);
    } else {
      setLocalKey(label);
    }
  };

  const handleValueSubmit = () => {
    setIsEditingValue(false);
    setValueEditWidth(null);
    let newValue: any = localValue;
    
    // Simple type inference
    if (type === 'number') {
      newValue = Number(localValue);
      if (isNaN(newValue)) {
        newValue = value;
        setLocalValue(String(value));
      }
    } else if (type === 'boolean') {
      newValue = localValue === 'true';
    } else if (type === 'null') {
      // Allow converting null to other types
      if (localValue === 'null' || localValue === '') {
        newValue = null;
      } else if (localValue === 'true' || localValue === 'false') {
        newValue = localValue === 'true';
      } else if (!isNaN(Number(localValue))) {
        newValue = Number(localValue);
      } else {
        // String value
        newValue = localValue;
      }
    }

    if (newValue !== value) {
      updateNodeValue(path, newValue);
    }
  };

  const handleBooleanToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeValue(path, e.target.checked);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(path);
  };

  const renderTypeIcon = () => {
    switch (type) {
      case 'string': return <Type size={12} className="text-green-600 opacity-50" />;
      case 'number': return <Hash size={12} className="text-blue-600 opacity-50" />;
      case 'boolean': return <ToggleLeft size={12} className="text-orange-600 opacity-50" />;
      case 'null': return <Ban size={12} className="text-gray-500 opacity-50" />;
      default: return null;
    }
  };

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Action Buttons */}
      {showActions && (
        <div className="absolute -top-8 right-0 flex gap-1 bg-white border border-gray-200 rounded shadow-sm p-1 z-10">
          <button 
            onClick={handleDelete}
            className="p-1 hover:bg-red-50 text-red-500 rounded"
            title="Delete Node"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      <div className={clsx(
        "flex items-stretch border rounded shadow-sm bg-white overflow-hidden text-sm transition-all",
        NODE_STYLES.maxWidthSplit,
        isSelected ? "border-blue-500 border-2 shadow-lg ring-2 ring-blue-200" : "border-gray-300"
      )}>
        <Handle type="target" position={Position.Left} className="!bg-gray-400" />
        
        {/* Key Section */}
        <div 
          ref={keyDisplayRef}
          className={clsx("px-3 py-2 bg-gray-50 border-r border-gray-200 font-medium text-gray-700 flex items-center cursor-text nodrag nopan break-words whitespace-normal transition-all duration-150", NODE_STYLES.minWidthKey)}
          style={keyEditWidth ? { minWidth: keyEditWidth, width: keyEditWidth } : undefined}
          onDoubleClick={(e) => { 
            e.stopPropagation(); 
            startEditingKey(); 
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {isEditingKey ? (
            <textarea
              ref={keyInputRef}
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
              onBlur={handleKeySubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleKeySubmit();
                }
                if (e.key === 'Escape') {
                  setLocalKey(label);
                  setIsEditingKey(false);
                  setKeyEditWidth(null);
                }
              }}
              className="w-full bg-transparent outline-none border-b-2 border-blue-400 nodrag nopan resize-none overflow-hidden"
              rows={1}
              onMouseDown={(e) => e.stopPropagation()}
            />
          ) : (
            label
          )}
        </div>
        
        {/* Value Section */}
        <div 
          ref={valueDisplayRef}
          className={clsx("px-3 py-2 flex-1 font-mono flex items-center gap-2 cursor-text nodrag nopan break-words whitespace-normal transition-all duration-150", NODE_STYLES.minWidthValue, valueColorClass)}
          style={valueEditWidth ? { minWidth: valueEditWidth, width: valueEditWidth } : undefined}
          onDoubleClick={(e) => {
            e.stopPropagation();
            startEditingValue();
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Type Icon */}
          <div className="shrink-0 select-none flex items-center justify-center" title={type}>
             {renderTypeIcon()}
          </div>

          {isEditingValue ? (
            <textarea
              ref={valueInputRef}
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onBlur={handleValueSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleValueSubmit();
                }
                if (e.key === 'Escape') {
                  setLocalValue(String(value));
                  setIsEditingValue(false);
                  setValueEditWidth(null);
                }
              }}
              className="w-full bg-transparent outline-none border-b-2 border-blue-400 nodrag nopan resize-none overflow-hidden"
              rows={1}
              onMouseDown={(e) => e.stopPropagation()}
              placeholder={type === 'null' ? 'Enter value (auto-detect type)' : ''}
            />
          ) : (
            type === 'boolean' ? (
                <div className="flex items-center gap-2">
                    <input 
                        type="checkbox" 
                        checked={value} 
                        onChange={handleBooleanToggle}
                        className="nodrag nopan cursor-pointer w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                        onMouseDown={(e) => e.stopPropagation()}
                    />
                    <span>{String(value)}</span>
                </div>
            ) : type === 'null' ? (
                <span className="break-all italic text-gray-400">{String(value)} <span className="text-xs">(double-click to edit)</span></span>
            ) : (
                <span className="break-all">{String(value)}</span>
            )
          )}
        </div>

        <Handle type="source" position={Position.Right} className="!bg-gray-400" />
      </div>
    </div>
  );
});
