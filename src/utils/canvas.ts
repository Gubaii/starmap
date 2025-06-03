import { Star, StarMapConfig } from '../types';
import { generateBackgroundStars, CONSTELLATION_LINES } from './astronomy';

export function drawStarMap(
  ctx: CanvasRenderingContext2D,
  stars: Star[],
  backgroundStars: Star[],
  config: StarMapConfig
) {
  const { width, height } = ctx.canvas;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 20;

  // 清空画布
  ctx.clearRect(0, 0, width, height);

  // 绘制背景
  ctx.fillStyle = config.style.backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // 创建圆形裁剪区域
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();

  // 绘制渐变边缘
  const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.7, centerX, centerY, radius);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // 绘制网格（如果启用）
  if (config.style.showGrid) {
    drawGrid(ctx, centerX, centerY, radius, config.style.starColor);
  }

  // 绘制背景星星
  drawStars(ctx, backgroundStars, config, 0.3);

  // 绘制主要星星
  drawStars(ctx, stars, config, 1);

  // 绘制星座连线（如果启用）
  if (config.style.constellationLines) {
    drawConstellationLines(ctx, stars, config.style.starColor);
  }

  ctx.restore();

  // 绘制边框
  ctx.strokeStyle = config.style.starColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function drawStars(
  ctx: CanvasRenderingContext2D,
  stars: Star[],
  config: StarMapConfig,
  opacity: number
) {
  const sizeMap = {
    small: { min: 0.5, max: 2 },
    medium: { min: 1, max: 3 },
    large: { min: 1.5, max: 4 }
  };

  const sizes = sizeMap[config.style.starSize];

  stars.forEach(star => {
    // 根据星等计算大小
    const magnitude = star.magnitude || 3;
    const normalizedMag = Math.max(0, Math.min(6, magnitude + 2)) / 8;
    const size = sizes.max - (normalizedMag * (sizes.max - sizes.min));

    // 绘制星星
    ctx.fillStyle = config.style.starColor + Math.floor(opacity * 255).toString(16).padStart(2, '0');
    ctx.beginPath();
    ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
    ctx.fill();

    // 为亮星添加光晕效果
    if (magnitude < 2 && opacity > 0.5) {
      const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, size * 3);
      gradient.addColorStop(0, config.style.starColor + '40');
      gradient.addColorStop(1, config.style.starColor + '00');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(star.x, star.y, size * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function drawConstellationLines(
  ctx: CanvasRenderingContext2D,
  stars: Star[],
  color: string
) {
  ctx.strokeStyle = color + '70'; // 70% opacity
  ctx.lineWidth = 1;

  // 绘制所有定义的星座连线
  Object.values(CONSTELLATION_LINES).forEach(lines => {
    lines.forEach(([start, end]) => {
      if (stars[start] && stars[end]) {
        ctx.beginPath();
        ctx.moveTo(stars[start].x, stars[start].y);
        ctx.lineTo(stars[end].x, stars[end].y);
        ctx.stroke();
      }
    });
  });
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  color: string
) {
  ctx.strokeStyle = color + '50'; // 50% opacity
  ctx.lineWidth = 0.5;

  // 绘制同心圆
  for (let r = radius / 4; r < radius; r += radius / 4) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 绘制放射线
  for (let angle = 0; angle < 360; angle += 30) {
    const rad = angle * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + radius * Math.cos(rad),
      centerY + radius * Math.sin(rad)
    );
    ctx.stroke();
  }
}

// SVG导出功能
export function generateSVGStarMap(
  stars: Star[],
  backgroundStars: Star[],
  config: StarMapConfig,
  width: number = 600,
  height: number = 600
): string {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 20;

  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  
  // 定义渐变和特效（保留光晕效果）
  svg += `
    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <clipPath id="circleClip">
        <circle cx="${centerX}" cy="${centerY}" r="${radius}"/>
      </clipPath>
    </defs>
  `;

  // 无背景 - SVG导出时保持透明
  
  // 圆形裁剪区域内的内容
  svg += `<g clip-path="url(#circleClip)">`;
  
  // 绘制网格（如果启用）
  if (config.style.showGrid) {
    svg += generateSVGGrid(centerX, centerY, radius, config.style.starColor);
  }
  
  // 绘制背景星星
  svg += generateSVGStars(backgroundStars, config, 0.3);
  
  // 绘制主要星星
  svg += generateSVGStars(stars, config, 1);
  
  // 绘制星座连线（如果启用）
  if (config.style.constellationLines) {
    svg += generateSVGConstellationLines(stars, config.style.starColor);
  }
  
  svg += `</g>`;
  
  // 边框
  svg += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" 
           fill="none" stroke="${config.style.starColor}" stroke-width="2"/>`;
  
  // 文字
  svg += generateSVGText(config, centerX, centerY, radius);
  
  svg += `</svg>`;
  
  return svg;
}

function generateSVGStars(stars: Star[], config: StarMapConfig, opacity: number): string {
  const sizeMap = {
    small: { min: 0.5, max: 2 },
    medium: { min: 1, max: 3 },
    large: { min: 1.5, max: 4 }
  };

  const sizes = sizeMap[config.style.starSize];
  let svg = '';

  stars.forEach(star => {
    const magnitude = star.magnitude || 3;
    const normalizedMag = Math.max(0, Math.min(6, magnitude + 2)) / 8;
    const size = sizes.max - (normalizedMag * (sizes.max - sizes.min));
    
    const starOpacity = opacity.toFixed(2);
    
    // 为亮星添加光晕效果
    if (magnitude < 2 && opacity > 0.5) {
      svg += `<circle cx="${star.x}" cy="${star.y}" r="${size * 3}" 
               fill="${config.style.starColor}" opacity="0.25" filter="url(#glow)"/>`;
    }
    
    // 绘制星星
    svg += `<circle cx="${star.x}" cy="${star.y}" r="${size}" 
             fill="${config.style.starColor}" opacity="${starOpacity}"/>`;
  });

  return svg;
}

function generateSVGConstellationLines(stars: Star[], color: string): string {
  let svg = '';
  
  Object.values(CONSTELLATION_LINES).forEach(lines => {
    lines.forEach(([start, end]) => {
      if (stars[start] && stars[end]) {
        svg += `<line x1="${stars[start].x}" y1="${stars[start].y}" 
                 x2="${stars[end].x}" y2="${stars[end].y}" 
                 stroke="${color}" stroke-opacity="0.7" stroke-width="1"/>`;
      }
    });
  });
  
  return svg;
}

function generateSVGGrid(centerX: number, centerY: number, radius: number, color: string): string {
  let svg = '';
  
  // 同心圆
  for (let r = radius / 4; r < radius; r += radius / 4) {
    svg += `<circle cx="${centerX}" cy="${centerY}" r="${r}" 
             fill="none" stroke="${color}" stroke-opacity="0.5" stroke-width="0.5"/>`;
  }
  
  // 放射线
  for (let angle = 0; angle < 360; angle += 30) {
    const rad = angle * Math.PI / 180;
    const x2 = centerX + radius * Math.cos(rad);
    const y2 = centerY + radius * Math.sin(rad);
    svg += `<line x1="${centerX}" y1="${centerY}" x2="${x2}" y2="${y2}" 
             stroke="${color}" stroke-opacity="0.5" stroke-width="0.5"/>`;
  }
  
  return svg;
}

function generateSVGText(config: StarMapConfig, centerX: number, centerY: number, radius: number): string {
  const textY = centerY + radius - 80;
  
  let svg = '';
  
  // 主标题（添加描边以增强可读性）
  svg += `<text x="${centerX}" y="${textY}" text-anchor="middle" 
           font-family="Playfair Display, serif" font-size="24" font-weight="bold" 
           fill="${config.style.starColor}" stroke="#000" stroke-width="0.5" stroke-opacity="0.3">
           ${config.text.title || 'Your Special Moment'}
         </text>`;
  
  // 副标题
  svg += `<text x="${centerX}" y="${textY + 30}" text-anchor="middle" 
           font-family="Inter, sans-serif" font-size="16" 
           fill="${config.style.starColor}" stroke="#000" stroke-width="0.3" stroke-opacity="0.3">
           ${config.text.subtitle || config.date.toLocaleDateString('zh-CN')}
         </text>`;
  
  // 底部文字
  svg += `<text x="${centerX}" y="${textY + 50}" text-anchor="middle" 
           font-family="Inter, sans-serif" font-size="12" opacity="0.75" 
           fill="${config.style.starColor}" stroke="#000" stroke-width="0.2" stroke-opacity="0.3">
           ${config.text.date || config.location.name}
         </text>`;
  
  return svg;
} 