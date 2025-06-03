import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { StarMapConfig, Star } from '../types';
import { calculateStarPositions, generateBackgroundStars } from '../utils/astronomy';
import { drawStarMap, generateSVGStarMap } from '../utils/canvas';

interface StarMapCanvasProps {
  config: StarMapConfig;
}

export interface StarMapCanvasRef {
  exportSVG: () => void;
  exportPNG: () => void;
}

const StarMapCanvas = forwardRef<StarMapCanvasRef, StarMapCanvasProps>(({ config }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stars, setStars] = useState<Star[]>([]);
  const [backgroundStars, setBackgroundStars] = useState<Star[]>([]);

  // 导出SVG函数
  const exportSVG = () => {
    const svgContent = generateSVGStarMap(stars, backgroundStars, config);
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `星图-${config.location.name}-${config.date.toISOString().split('T')[0]}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 导出PNG函数
  const exportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `星图-${config.location.name}-${config.date.toISOString().split('T')[0]}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 暴露导出功能给父组件
  useImperativeHandle(ref, () => ({
    exportSVG,
    exportPNG
  }), [stars, config]);

  // 只有位置和时间变化时才重新计算星星位置
  useEffect(() => {
    console.log('🌟 触发星星位置重新计算:', {
      latitude: config.location.latitude,
      longitude: config.location.longitude,
      date: config.date,
      reason: 'location or date changed'
    });
    
    setIsLoading(true);
    
    const newStars = calculateStarPositions(
      config.location.latitude,
      config.location.longitude,
      config.date,
      config.style.magnitudeLimit
    );
    
    // 生成固定的背景星星（基于位置，确保一致性）
    const newBackgroundStars = generateBackgroundStars(
      200, 
      config.location.latitude, 
      config.location.longitude,
      config.date
    );
    
    setStars(newStars);
    setBackgroundStars(newBackgroundStars);
    setIsLoading(false);
  }, [
    config.location.latitude,
    config.location.longitude, 
    config.date.getTime() // 使用getTime()确保日期对象的变化被正确检测
  ]);

  // 重绘星图（只有星星位置或样式变化时）
  useEffect(() => {
    console.log('🎨 触发星图重新绘制:', {
      starCount: stars.length,
      style: {
        starColor: config.style.starColor,
        backgroundColor: config.style.backgroundColor,
        constellationLines: config.style.constellationLines,
        starSize: config.style.starSize,
        showGrid: config.style.showGrid
      },
      reason: 'stars or style changed'
    });
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 绘制星图
    drawStarMap(ctx, stars, backgroundStars, config);
  }, [
    stars, 
    config.style.starColor,
    config.style.backgroundColor,
    config.style.constellationLines,
    config.style.starSize,
    config.style.showGrid
  ]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="rounded-full shadow-inner"
        style={{ backgroundColor: config.style.backgroundColor }}
      />
      
      {/* 文字覆盖层 */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 pointer-events-none">
        <h2 className="text-3xl font-serif mb-2" style={{ color: config.style.starColor }}>
          {config.text.title || 'Your Special Moment'}
        </h2>
        <p className="text-lg mb-1" style={{ color: config.style.starColor }}>
          {config.text.subtitle || config.date.toLocaleDateString('zh-CN')}
        </p>
        <p className="text-sm opacity-75" style={{ color: config.style.starColor }}>
          {config.text.date || config.location.name}
        </p>
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
});

export default StarMapCanvas; 