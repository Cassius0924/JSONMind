import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useAppStore } from '../../store/appStore';
import { debounce } from '../../utils/debounce';

const MonacoEditor: React.FC = () => {
  const { jsonText, isValid, errorMessage, updateFromJson } = useAppStore();
  const debouncedUpdateRef = useRef(debounce(updateFromJson, 300));

  useEffect(() => {
    // Initialize with default JSON
    updateFromJson(jsonText);
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      debouncedUpdateRef.current(value);
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const formatted = JSON.stringify(parsed, null, 2);
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
      </div>
      <div style={{ flex: 1 }}>
        <Editor
          height="100%"
          defaultLanguage="json"
          value={jsonText}
          onChange={handleEditorChange}
          theme="vs-light"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            formatOnPaste: true,
            formatOnType: true
          }}
        />
      </div>
    </div>
  );
};

export default MonacoEditor;
