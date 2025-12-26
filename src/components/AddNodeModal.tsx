import React, { useState, useEffect, useRef } from 'react';
import { Braces, Brackets, Type, Hash, ToggleLeft } from 'lucide-react';
import clsx from 'clsx';
import { TYPE_COLORS } from '../config/constants';

// Store last used type in localStorage
const LAST_TYPE_KEY = 'jsonmind_last_node_type';

interface AddNodeModalProps {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  parentType?: 'array' | 'object'; // To know if we need a key
  useMemory?: boolean; // Whether to use localStorage memory
  onConfirm: (key: string, value: any) => void;
  onCancel: () => void;
}

export const AddNodeModal: React.FC<AddNodeModalProps> = ({ type: initialType, parentType, useMemory = true, onConfirm, onCancel }) => {
  const [type, setType] = useState<'string' | 'number' | 'boolean' | 'object' | 'array'>(() => {
    // Only use memory if useMemory is true
    if (useMemory) {
      const lastType = localStorage.getItem(LAST_TYPE_KEY);
      return (lastType as any) || initialType;
    }
    return initialType;
  });
  const [key, setKey] = useState('');
  const [value, setValue] = useState(() => type === 'boolean' ? 'true' : '');
  const keyInputRef = useRef<HTMLInputElement>(null);
  const valueInputRef = useRef<HTMLInputElement>(null);

  const isContainer = type === 'object' || type === 'array';
  const needsKey = parentType !== 'array'; // Arrays auto-generate keys (indices)

  // Update value when type changes
  useEffect(() => {
    if (type === 'boolean') {
      setValue('true');
    } else if (type === 'object' || type === 'array') {
      setValue('');
    } else {
      setValue('');
    }
  }, [type]);

  useEffect(() => {
    if (needsKey) {
      keyInputRef.current?.focus();
    } else if (!isContainer) {
      valueInputRef.current?.focus();
    }
  }, [needsKey, isContainer]);

  const handleKeyEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isContainer) {
        handleSubmit();
      } else {
        valueInputRef.current?.focus();
      }
    }
  };

  const handleValueEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    let finalValue: any = value;
    if (type === 'number') finalValue = Number(value);
    if (type === 'boolean') finalValue = value === 'true';
    if (type === 'object') finalValue = {};
    if (type === 'array') finalValue = [];

    // Save last used type
    localStorage.setItem(LAST_TYPE_KEY, type);

    onConfirm(key, finalValue);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl p-6 w-[450px] animate-in fade-in zoom-in duration-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Add New Node</h3>
        
        {/* Type Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setType('string')}
              className={clsx(
                "flex items-center gap-1 px-3 py-1.5 rounded border text-sm transition-all",
                type === 'string'
                  ? "bg-green-100 border-green-400 text-green-800 font-semibold"
                  : "bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
              )}
            >
              <Type size={14} /> String
            </button>
            <button
              onClick={() => setType('number')}
              className={clsx(
                "flex items-center gap-1 px-3 py-1.5 rounded border text-sm transition-all",
                type === 'number'
                  ? "bg-blue-100 border-blue-400 text-blue-800 font-semibold"
                  : "bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
              )}
            >
              <Hash size={14} /> Number
            </button>
            <button
              onClick={() => setType('boolean')}
              className={clsx(
                "flex items-center gap-1 px-3 py-1.5 rounded border text-sm transition-all",
                type === 'boolean'
                  ? "bg-orange-100 border-orange-400 text-orange-800 font-semibold"
                  : "bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
              )}
            >
              <ToggleLeft size={14} /> Boolean
            </button>
            <button
              onClick={() => setType('object')}
              className={clsx(
                "flex items-center gap-1 px-3 py-1.5 rounded border text-sm transition-all",
                type === 'object'
                  ? "bg-purple-100 border-purple-400 text-purple-800 font-semibold"
                  : "bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
              )}
            >
              <Braces size={14} /> Object
            </button>
            <button
              onClick={() => setType('array')}
              className={clsx(
                "flex items-center gap-1 px-3 py-1.5 rounded border text-sm transition-all",
                type === 'array'
                  ? "bg-indigo-100 border-indigo-400 text-indigo-800 font-semibold"
                  : "bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
              )}
            >
              <Brackets size={14} /> Array
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-center mb-6">
          <div className={clsx("flex items-center border rounded shadow-sm px-4 py-3 min-w-[200px]", TYPE_COLORS[type])}>
            {/* Icon for Container */}
            {(type === 'object' || type === 'array') && (
              <div className="mr-2 text-gray-500">
                {type === 'array' ? <Brackets size={16} /> : <Braces size={16} />}
              </div>
            )}

            {/* Key Input */}
            {needsKey ? (
              <div className="flex-1 mr-2">
                <input
                  ref={keyInputRef}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  onKeyDown={handleKeyEnter}
                  placeholder="Key"
                  className="w-full bg-transparent outline-none border-b border-gray-400 placeholder-gray-400 text-gray-800 font-medium"
                />
              </div>
            ) : (
              <div className="flex-1 mr-2 text-gray-500 italic">
                [Auto Index]
              </div>
            )}

            {/* Separator */}
            {!isContainer && <div className="mx-2 text-gray-400">:</div>}

            {/* Value Input */}
            {!isContainer && (
              <div className="flex-1">
                {type === 'boolean' ? (
                  <select
                    ref={valueInputRef as any}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleValueEnter}
                    className="w-full bg-transparent outline-none border-b border-gray-400 font-mono"
                  >
                    <option value="" disabled>Select...</option>
                    <option value="true">true</option>
                    <option value="false">false</option>
                  </select>
                ) : (
                  <input
                    ref={valueInputRef}
                    type={type === 'number' ? 'number' : 'text'}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleValueEnter}
                    placeholder="Value"
                    className="w-full bg-transparent outline-none border-b border-gray-400 placeholder-gray-400 font-mono"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button 
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded shadow-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
