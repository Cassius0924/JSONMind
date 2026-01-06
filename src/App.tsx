import { JsonEditor } from './components/JsonEditor';
import { MindMap } from './components/MindMap';
import { ReactFlowProvider } from 'reactflow';
import { useState } from 'react';

function App() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden">
      {!isFullscreen && (
        <div className="w-1/3 h-full border-r border-slate-200 p-4 flex flex-col bg-white shadow-sm">
          <JsonEditor />
        </div>
      )}
      <div className={isFullscreen ? "w-full h-full relative" : "w-2/3 h-full relative"}>
        <ReactFlowProvider>
          <MindMap isFullscreen={isFullscreen} setIsFullscreen={setIsFullscreen} />
        </ReactFlowProvider>
      </div>
    </div>
  );
}

export default App;
