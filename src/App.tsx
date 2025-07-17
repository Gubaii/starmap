import React, { useState, useRef } from 'react';
import StarMapCanvas, { StarMapCanvasRef } from './components/StarMapCanvas';
import ControlPanel from './components/ControlPanel';
import { StarMapConfig } from './types';

const App: React.FC = () => {
  const starMapRef = useRef<StarMapCanvasRef>(null);
  const [config, setConfig] = useState<StarMapConfig>({
    location: {
      name: 'New York, USA',
      latitude: 40.7128,
      longitude: -74.0060
    },
    date: new Date(),
    text: {
      title: 'Our Special Day',
      subtitle: '',
      date: ''
    },
    style: {
      starColor: '#FFFFFF',
      backgroundColor: '#0F172A',
      constellationLines: true,
      starSize: 'medium',
      showGrid: false,
      magnitudeLimit: 3.0
    }
  });

  const updateConfig = (updates: Partial<StarMapConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleExportPNG = () => {
    starMapRef.current?.exportPNG();
  };

  const handleExportSVG = () => {
    starMapRef.current?.exportSVG();
  };

  return (
    <div className="h-screen bg-night-blue flex overflow-hidden">
      {/* 控制面板 */}
      <div className="w-96 h-full bg-slate-900 shadow-xl flex flex-col">
        <ControlPanel 
          config={config} 
          updateConfig={updateConfig}
          onExportPNG={handleExportPNG}
          onExportSVG={handleExportSVG}
          showExportButtons={true}
        />
      </div>
      
      {/* 主内容区域 */}
      <div className="flex-1 h-full flex flex-col">
        {/* 内容区域 */}
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-full">
            <div className="bg-white rounded-lg shadow-2xl p-8">
              <StarMapCanvas ref={starMapRef} config={config} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App; 