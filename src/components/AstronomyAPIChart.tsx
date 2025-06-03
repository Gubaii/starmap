import React, { useState, useEffect } from 'react';
import { StarMapConfig } from '../types';
import AstronomyAPIService, { CONSTELLATION_LIST } from '../services/astronomyAPI';
import { Download, RefreshCw, Settings, Eye, EyeOff } from 'lucide-react';

interface AstronomyAPIChartProps {
  config: StarMapConfig;
}

interface APICredentials {
  apiId: string;
  apiSecret: string;
}

const AstronomyAPIChart: React.FC<AstronomyAPIChartProps> = ({ config }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [apiService, setApiService] = useState<AstronomyAPIService | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<APICredentials>({
    apiId: '',
    apiSecret: ''
  });
  const [showCredentials, setShowCredentials] = useState<boolean>(false);
  
  // 星图样式选项
  const [apiStyle, setApiStyle] = useState<'default' | 'inverted' | 'navy' | 'red'>('default');
  
  // 视图类型选项
  const [viewType, setViewType] = useState<'area' | 'constellation'>('area');
  const [selectedConstellation, setSelectedConstellation] = useState<string>('ori');
  const [rightAscension, setRightAscension] = useState<number>(12.0);
  const [declination, setDeclination] = useState<number>(0.0);
  const [zoom, setZoom] = useState<number>(1);

  // 从localStorage加载API凭据
  useEffect(() => {
    const savedApiId = localStorage.getItem('astronomyapi_id');
    const savedApiSecret = localStorage.getItem('astronomyapi_secret');
    
    if (savedApiId && savedApiSecret) {
      setCredentials({
        apiId: savedApiId,
        apiSecret: savedApiSecret
      });
      
      const service = new AstronomyAPIService({
        apiId: savedApiId,
        apiSecret: savedApiSecret
      });
      setApiService(service);
    }
  }, []);

  // 保存API凭据
  const saveCredentials = () => {
    if (credentials.apiId && credentials.apiSecret) {
      localStorage.setItem('astronomyapi_id', credentials.apiId);
      localStorage.setItem('astronomyapi_secret', credentials.apiSecret);
      
      const service = new AstronomyAPIService(credentials);
      setApiService(service);
      setShowSettings(false);
      setError('');
    }
  };

  // 生成星图
  const generateStarChart = async () => {
    if (!apiService) {
      setError('请先配置AstronomyAPI凭据');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      let url: string;
      
      if (viewType === 'constellation') {
        url = await apiService.generateConstellationStarChart(
          config.location.latitude,
          config.location.longitude,
          config.date,
          selectedConstellation,
          apiStyle
        );
      } else {
        url = await apiService.generateAreaStarChart(
          config.location.latitude,
          config.location.longitude,
          config.date,
          rightAscension,
          declination,
          zoom,
          apiStyle
        );
      }
      
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成星图失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 下载星图
  const downloadImage = async () => {
    if (!imageUrl) return;
    
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `AstronomyAPI-星图-${config.location.name}-${config.date.toISOString().split('T')[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('下载失败:', error);
    }
  };

  // 自动生成星图（当配置改变时）
  useEffect(() => {
    if (apiService) {
      generateStarChart();
    }
  }, [config.location, config.date, apiService, apiStyle, viewType, selectedConstellation, rightAscension, declination, zoom]);

  return (
    <div className="w-full space-y-4">
      {/* 标题和设置按钮 */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">AstronomyAPI 专业星图</h3>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Settings size={16} />
          设置
        </button>
      </div>

      {/* API设置面板 */}
      {showSettings && (
        <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
          <h4 className="font-semibold text-gray-700 mb-3">AstronomyAPI 配置</h4>
          
          {/* API凭据设置 */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Application ID
              </label>
              <input
                type="text"
                value={credentials.apiId}
                onChange={(e) => setCredentials(prev => ({ ...prev, apiId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入您的AstronomyAPI Application ID"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Application Secret
              </label>
              <div className="relative">
                <input
                  type={showCredentials ? "text" : "password"}
                  value={credentials.apiSecret}
                  onChange={(e) => setCredentials(prev => ({ ...prev, apiSecret: e.target.value }))}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入您的AstronomyAPI Application Secret"
                />
                <button
                  type="button"
                  onClick={() => setShowCredentials(!showCredentials)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showCredentials ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <button
              onClick={saveCredentials}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              保存配置
            </button>
          </div>

          {/* 星图样式选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              星图样式
            </label>
            <select
              value={apiStyle}
              onChange={(e) => setApiStyle(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">默认</option>
              <option value="inverted">反色</option>
              <option value="navy">深蓝</option>
              <option value="red">红色</option>
            </select>
          </div>

          {/* 视图类型选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              视图类型
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="area"
                  checked={viewType === 'area'}
                  onChange={(e) => setViewType(e.target.value as any)}
                  className="mr-2"
                />
                天区视图
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="constellation"
                  checked={viewType === 'constellation'}
                  onChange={(e) => setViewType(e.target.value as any)}
                  className="mr-2"
                />
                星座视图
              </label>
            </div>
          </div>

          {/* 星座选择 */}
          {viewType === 'constellation' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择星座
              </label>
              <select
                value={selectedConstellation}
                onChange={(e) => setSelectedConstellation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CONSTELLATION_LIST.map(constellation => (
                  <option key={constellation.code} value={constellation.code}>
                    {constellation.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 天区视图参数 */}
          {viewType === 'area' && (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  赤经 (小时)
                </label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  step="0.1"
                  value={rightAscension}
                  onChange={(e) => setRightAscension(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  赤纬 (度)
                </label>
                <input
                  type="number"
                  min="-90"
                  max="90"
                  step="1"
                  value={declination}
                  onChange={(e) => setDeclination(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  缩放
                </label>
                <input
                  type="number"
                  min="0.5"
                  max="5"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 控制按钮 */}
      <div className="flex gap-3">
        <button
          onClick={generateStarChart}
          disabled={isLoading || !apiService}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          {isLoading ? '生成中...' : '重新生成'}
        </button>
        
        {imageUrl && (
          <button
            onClick={downloadImage}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download size={16} />
            下载星图
          </button>
        )}
      </div>

      {/* 错误显示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          {error.includes('API配置') && (
            <p className="text-sm text-red-600 mt-1">
              请访问 <a href="https://astronomyapi.com" target="_blank" rel="noopener noreferrer" className="underline">AstronomyAPI官网</a> 获取API凭据
            </p>
          )}
        </div>
      )}

      {/* 星图显示 */}
      <div className="relative bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 min-h-96 flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-600">正在生成专业星图...</p>
          </div>
        ) : imageUrl ? (
          <div className="relative w-full">
            <img
              src={imageUrl}
              alt="AstronomyAPI生成的星图"
              className="w-full h-auto rounded-lg shadow-lg"
              style={{ maxHeight: '600px', objectFit: 'contain' }}
            />
            
            {/* 文字覆盖层 */}
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <div className="bg-black bg-opacity-50 rounded-lg p-3 text-white">
                <h3 className="text-lg font-serif mb-1">
                  {config.text.title || 'Your Special Moment'}
                </h3>
                <p className="text-sm mb-1">
                  {config.text.subtitle || config.date.toLocaleDateString('zh-CN')}
                </p>
                <p className="text-xs opacity-75">
                  {config.text.date || config.location.name} • 由AstronomyAPI生成
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-500 mb-2">点击上方按钮生成专业星图</p>
            <p className="text-sm text-gray-400">需要AstronomyAPI凭据</p>
          </div>
        )}
      </div>

      {/* 说明信息 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">关于AstronomyAPI</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 提供专业级别的天文星图生成服务</li>
          <li>• 基于真实的天文数据和计算</li>
          <li>• 支持多种视图类型和样式</li>
          <li>• 数据精度远超本地计算</li>
          <li>• 需要注册账号获取API凭据</li>
        </ul>
      </div>
    </div>
  );
};

export default AstronomyAPIChart; 