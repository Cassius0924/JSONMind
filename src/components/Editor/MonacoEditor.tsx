import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { debounce } from '../../utils/debounce';

const MonacoEditor: React.FC = () => {
  const { jsonText, isValid, errorMessage, updateFromJson } = useAppStore();
  const [localText, setLocalText] = useState(jsonText);

  useEffect(() => {
    // Initialize with default JSON
    updateFromJson(jsonText);
  }, []);

  useEffect(() => {
    setLocalText(jsonText);
  }, [jsonText]);

  const debouncedUpdate = React.useRef(debounce(updateFromJson, 300)).current;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setLocalText(value);
    debouncedUpdate(value);
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(localText);
      const formatted = JSON.stringify(parsed, null, 2);
      setLocalText(formatted);
      updateFromJson(formatted);
    } catch (error) {
      console.error('Cannot format invalid JSON');
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
          onClick={handleFormat}
          disabled={!isValid}
          style={{
            padding: '6px 12px',
            cursor: isValid ? 'pointer' : 'not-allowed',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            backgroundColor: isValid ? '#fff' : '#f5f5f5'
          }}
        >
          Format JSON
        </button>
        {!isValid && errorMessage && (
          <span style={{ color: '#ff4d4f', fontSize: '12px' }}>
            {errorMessage}
          </span>
        )}
        {isValid && (
          <span style={{ color: '#52c41a', fontSize: '12px' }}>
            ✓ Valid JSON
          </span>
        )}
      </div>
      <div style={{ flex: 1, padding: '10px' }}>
        <textarea
          value={localText}
          onChange={handleTextChange}
          style={{
            width: '100%',
            height: '100%',
            fontFamily: 'monospace',
            fontSize: '14px',
            padding: '10px',
            border: `1px solid ${isValid ? '#d9d9d9' : '#ff4d4f'}`,
            borderRadius: '4px',
            resize: 'none',
            outline: 'none'
          }}
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default MonacoEditor;
