import React, { useState, useRef } from 'react';
import StarMapCanvas, { StarMapCanvasRef } from './components/StarMapCanvas';
import AstronomyAPIChart from './components/AstronomyAPIChart';
import ControlPanel from './components/ControlPanel';
import { StarMapConfig } from './types';
import { Palette, Globe } from 'lucide-react';

type TabType = 'local' | 'api';

const App: React.FC = () => {
  const starMapRef = useRef<StarMapCanvasRef>(null);
  const [activeTab, setActiveTab] = useState<TabType>('local');
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

  const tabs = [
    { id: 'local' as TabType, label: '本地星图', icon: Palette, description: '自定义设计的星图' },
    { id: 'api' as TabType, label: 'AstronomyAPI', icon: Globe, description: '专业天文数据星图' }
  ];

  return (
    <div className="min-h-screen bg-night-blue flex">
      {/* 控制面板 */}
      <div className="w-96 bg-slate-900 shadow-xl overflow-y-auto">
        <ControlPanel 
          config={config} 
          updateConfig={updateConfig}
          onExportPNG={handleExportPNG}
          onExportSVG={handleExportSVG}
          showExportButtons={activeTab === 'local'}
        />
      </div>
      
      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col">
        {/* 标签选择器 */}
        <div className="bg-slate-800 border-b border-slate-700">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-400 bg-slate-700 text-white'
                      : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-750'
                  }`}
                >
                  <Icon size={20} />
                  <div className="text-left">
                    <div className="font-semibold">{tab.label}</div>
                    <div className="text-xs opacity-75">{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* 内容区域 */}
        <div className="flex-1 p-8">
          {activeTab === 'local' ? (
            <div className="flex items-center justify-center h-full">
              <div className="bg-white rounded-lg shadow-2xl p-8">
                <StarMapCanvas ref={starMapRef} config={config} />
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <AstronomyAPIChart config={config} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App; 