import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "../styles/datepicker.css";
import { MapPin, Type, Palette, Download, FileImage } from 'lucide-react';
import { StarMapConfig } from '../types';
import LocationSearch from './LocationSearch';
import StyleEditor from './StyleEditor';
import TextEditor from './TextEditor';

interface ControlPanelProps {
  config: StarMapConfig;
  updateConfig: (updates: Partial<StarMapConfig>) => void;
  onExportPNG: () => void;
  onExportSVG: () => void;
  showExportButtons?: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ config, updateConfig, onExportPNG, onExportSVG, showExportButtons = true }) => {
  const [activeTab, setActiveTab] = useState<'location' | 'text' | 'style'>('location');

  const tabs = [
    { id: 'location', label: '位置与时间', icon: MapPin },
    { id: 'text', label: '文字设置', icon: Type },
    { id: 'style', label: '样式设置', icon: Palette },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-white mb-2">星图设计工具</h1>
        <p className="text-slate-400 text-sm">创建您的专属星空纪念</p>
      </div>

      {/* 标签导航 */}
      <div className="flex border-b border-slate-700">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 transition-colors ${
                activeTab === tab.id 
                  ? 'bg-slate-800 text-white border-b-2 border-blue-500' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'location' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                选择地点
              </label>
              <LocationSearch 
                value={config.location}
                onChange={(location) => updateConfig({ location })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                选择日期时间
              </label>
              <DatePicker
                selected={config.date}
                onChange={(date) => date && updateConfig({ date })}
                showTimeSelect
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                yearDropdownItemNumber={100}
                dateFormat="yyyy年MM月dd日 HH:mm"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                calendarClassName="star-map-calendar"
              />
            </div>

            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-2">当前设置</h3>
              <div className="space-y-1 text-sm text-slate-400">
                <p>位置：{config.location.name}</p>
                <p>坐标：{config.location.latitude.toFixed(4)}, {config.location.longitude.toFixed(4)}</p>
                <p>时间：{config.date.toLocaleString('zh-CN')}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'text' && (
          <TextEditor 
            text={config.text}
            location={config.location}
            date={config.date}
            onChange={(text) => updateConfig({ text })}
          />
        )}

        {activeTab === 'style' && (
          <StyleEditor 
            style={config.style}
            onChange={(style) => updateConfig({ style })}
          />
        )}
      </div>

      {/* 导出按钮 */}
      {showExportButtons && (
        <div className="p-6 border-t border-slate-700">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onExportPNG}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Download size={18} />
              导出PNG
            </button>
            <button
              onClick={onExportSVG}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <FileImage size={18} />
              导出SVG
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel; 