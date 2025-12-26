import React from 'react';
import MonacoEditor from '../Editor/MonacoEditor';
import GraphCanvas from '../MindMap/GraphCanvas';
import './MainLayout.css';

const MainLayout: React.FC = () => {
  return (
    <div className="main-layout">
      <div className="header">
        <h1>JSONMind - JSON Visualization Tool</h1>
        <p>Transform JSON data into interactive mind maps</p>
      </div>
      <div className="content">
        <div className="editor-panel">
          <h3 className="panel-title">JSON Editor</h3>
          <MonacoEditor />
        </div>
        <div className="divider" />
        <div className="canvas-panel">
          <h3 className="panel-title">Mind Map Visualization</h3>
          <GraphCanvas />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
