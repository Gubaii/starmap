import React from 'react';
import { StyleConfig } from '../types';
import { Palette } from 'lucide-react';
import '../styles/datepicker.css';

interface StyleEditorProps {
  style: StyleConfig;
  onChange: (style: StyleConfig) => void;
}

const presetThemes = [
  {
    name: '经典夜空',
    config: {
      starColor: '#FFFFFF',
      backgroundColor: '#0F172A',
      constellationLines: true,
    }
  },
  {
    name: '金色星辰',
    config: {
      starColor: '#FFD700',
      backgroundColor: '#1E1B4B',
      constellationLines: true,
    }
  },
  {
    name: '玫瑰星河',
    config: {
      starColor: '#F472B6',
      backgroundColor: '#1F2937',
      constellationLines: false,
    }
  },
  {
    name: '极简白',
    config: {
      starColor: '#1F2937',
      backgroundColor: '#FFFFFF',
      constellationLines: false,
    }
  },
];

const StyleEditor: React.FC<StyleEditorProps> = ({ style, onChange }) => {
  const handleChange = (field: keyof StyleConfig, value: any) => {
    onChange({ ...style, [field]: value });
  };

  const applyTheme = (theme: typeof presetThemes[0]) => {
    onChange({
      ...style,
      ...theme.config,
    });
  };

  // 检查当前样式是否匹配某个预设主题
  const isThemeActive = (theme: typeof presetThemes[0]) => {
    return (
      style.starColor === theme.config.starColor &&
      style.backgroundColor === theme.config.backgroundColor &&
      style.constellationLines === theme.config.constellationLines
    );
  };

  return (
    <div className="space-y-4">
      {/* 预设主题 */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          预设主题
        </label>
        <div className="grid grid-cols-2 gap-2">
          {presetThemes.map((theme) => {
            const isActive = isThemeActive(theme);
            return (
              <button
                key={theme.name}
                onClick={() => applyTheme(theme)}
                className={`px-3 py-2 border rounded text-sm transition-colors flex items-center gap-2 ${
                  isActive
                    ? 'bg-blue-600 hover:bg-blue-700 border-blue-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-white'
                }`}
              >
                <Palette size={14} />
                {theme.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 星星颜色 */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          星星颜色
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={style.starColor}
            onChange={(e) => handleChange('starColor', e.target.value)}
            className="h-10 w-20 bg-slate-800 border border-slate-600 rounded cursor-pointer"
          />
          <input
            type="text"
            value={style.starColor}
            onChange={(e) => handleChange('starColor', e.target.value)}
            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white"
          />
        </div>
      </div>

      {/* 背景颜色 */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          背景颜色
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={style.backgroundColor}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
            className="h-10 w-20 bg-slate-800 border border-slate-600 rounded cursor-pointer"
          />
          <input
            type="text"
            value={style.backgroundColor}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white"
          />
        </div>
      </div>

      {/* 星星大小 */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          星星大小
        </label>
        <select
          value={style.starSize}
          onChange={(e) => handleChange('starSize', e.target.value)}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white"
        >
          <option value="small">小</option>
          <option value="medium">中</option>
          <option value="large">大</option>
        </select>
      </div>

      {/* 星等限制 */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          星等限制: {style.magnitudeLimit?.toFixed(1)} ({
            style.magnitudeLimit <= 1.5 ? '只显示最亮的星' :
            style.magnitudeLimit <= 2.5 ? '显示较亮的星' :
            style.magnitudeLimit <= 3.5 ? '显示中等亮度的星' :
            '显示所有星座'
          })
        </label>
        <input
          type="range"
          min="0.5"
          max="4.0"
          step="0.5"
          value={style.magnitudeLimit || 3.0}
          onChange={(e) => handleChange('magnitudeLimit', parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>最亮</span>
          <span>中等</span>
          <span>全部</span>
        </div>
      </div>

      {/* 显示选项 */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={style.constellationLines}
            onChange={(e) => handleChange('constellationLines', e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-slate-300">显示星座连线</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={style.showGrid}
            onChange={(e) => handleChange('showGrid', e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-slate-300">显示坐标网格</span>
        </label>
      </div>

      {/* 样式预览 */}
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-slate-300 mb-3">样式预览</h3>
        <div 
          className="h-32 rounded-lg flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor: style.backgroundColor }}
        >
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`rounded-full ${
                  style.starSize === 'small' ? 'w-1 h-1' :
                  style.starSize === 'medium' ? 'w-2 h-2' :
                  'w-3 h-3'
                }`}
                style={{ backgroundColor: style.starColor }}
              />
            ))}
          </div>
          {style.constellationLines && (
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: `linear-gradient(45deg, ${style.starColor} 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StyleEditor; 