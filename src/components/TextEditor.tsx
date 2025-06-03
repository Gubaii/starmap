import React from 'react';
import { TextConfig } from '../types';

interface TextEditorProps {
  text: TextConfig;
  onChange: (text: TextConfig) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ text, onChange }) => {
  const handleChange = (field: keyof TextConfig, value: string) => {
    onChange({ ...text, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          主标题
        </label>
        <input
          type="text"
          value={text.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Our Special Day"
          className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          副标题
        </label>
        <input
          type="text"
          value={text.subtitle}
          onChange={(e) => handleChange('subtitle', e.target.value)}
          placeholder="留空则显示日期"
          className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          底部文字
        </label>
        <input
          type="text"
          value={text.date}
          onChange={(e) => handleChange('date', e.target.value)}
          placeholder="留空则显示地点"
          className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-slate-300 mb-3">预览</h3>
        <div className="text-center space-y-1">
          <p className="text-lg font-serif text-white">
            {text.title || 'Your Special Moment'}
          </p>
          <p className="text-sm text-slate-300">
            {text.subtitle || '2024年1月1日'}
          </p>
          <p className="text-xs text-slate-400">
            {text.date || '北京'}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-slate-400">快速填充模板：</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onChange({
              title: 'Forever & Always',
              subtitle: 'The day we said I do',
              date: ''
            })}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-sm text-white transition-colors"
          >
            婚礼纪念
          </button>
          <button
            onClick={() => onChange({
              title: 'Welcome to the World',
              subtitle: 'Our little miracle',
              date: ''
            })}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-sm text-white transition-colors"
          >
            宝宝诞生
          </button>
          <button
            onClick={() => onChange({
              title: 'First Date',
              subtitle: 'Where it all began',
              date: ''
            })}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-sm text-white transition-colors"
          >
            初次约会
          </button>
          <button
            onClick={() => onChange({
              title: 'Happy Anniversary',
              subtitle: 'Another year of love',
              date: ''
            })}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-sm text-white transition-colors"
          >
            周年纪念
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextEditor; 