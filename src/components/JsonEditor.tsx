import React, { useRef, useEffect } from 'react';
import Editor, { OnMount, useMonaco } from '@monaco-editor/react';
import { useJsonStore } from '../store/useJsonStore';
import { Braces, AlertCircle } from 'lucide-react';
import { findPathRange } from '../utils/jsonParser';

export const JsonEditor: React.FC = () => {
  const { jsonText, setJsonText, isValid, error, hoveredPath, selectedPath } = useJsonStore();
  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);
  const monaco = useMonaco();

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  useEffect(() => {
    if (!editorRef.current || !monaco || !isValid) return;

    const model = editorRef.current.getModel();
    if (!model) return;

    // Prioritize selectedPath over hoveredPath
    const activePath = selectedPath || hoveredPath;

    if (activePath) {
      try {
        const range = findPathRange(jsonText, activePath);
        if (range) {
          const startPos = model.getPositionAt(range.start);
          const endPos = model.getPositionAt(range.end);
          
          const newDecorations = [
            {
              range: new monaco.Range(startPos.lineNumber, startPos.column, endPos.lineNumber, endPos.column),
              options: {
                isWholeLine: false,
                className: 'bg-yellow-100 border border-yellow-300 rounded',
                inlineClassName: 'bg-yellow-100',
              },
            },
          ];
          
          decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, newDecorations);
          editorRef.current.revealRangeInCenter(newDecorations[0].range);
        } else {
          decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
        }
      } catch (e) {
        console.error("Failed to highlight path", e);
        decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
      }
    } else {
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
    }
  }, [hoveredPath, jsonText, isValid, monaco]);

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  return (
    <div className="flex flex-col h-full border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">JSON Input</span>
          {!isValid && (
            <span className="flex items-center text-xs text-red-500 gap-1 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
              <AlertCircle size={12} />
              Invalid JSON
            </span>
          )}
        </div>
        <button
          onClick={handleFormat}
          className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors"
          title="Format JSON"
        >
          <Braces size={18} />
        </button>
      </div>
      
      <div className="flex-1 relative">
        <Editor
          height="100%"
          defaultLanguage="json"
          value={jsonText}
          onChange={(value) => setJsonText(value || '')}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>
      
      {!isValid && error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-100 text-xs text-red-600 truncate">
          {error}
        </div>
      )}
    </div>
  );
};
