// 在浏览器控制台中运行此脚本来监控useEffect触发

console.log('开始监控星图重新计算...');

// 保存原始的console.log
const originalLog = console.log;

// 创建一个包装函数来监控特定的日志
window.monitorStarCalculation = function() {
    // 监控calculateStarPositions函数的调用
    if (window.calculateStarPositions) {
        const original = window.calculateStarPositions;
        window.calculateStarPositions = function(lat, lng, date) {
            console.log('🌟 星图重新计算:', {
                latitude: lat,
                longitude: lng,
                date: date,
                timestamp: new Date().toISOString()
            });
            return original.apply(this, arguments);
        };
    }
    
    // 监控Canvas绘制
    const originalDrawStarMap = window.drawStarMap;
    if (originalDrawStarMap) {
        window.drawStarMap = function(ctx, stars, config) {
            console.log('🎨 星图重新绘制:', {
                starCount: stars?.length,
                style: config?.style,
                timestamp: new Date().toISOString()
            });
            return originalDrawStarMap.apply(this, arguments);
        };
    }
};

// 监控React组件重新渲染
window.logRender = function(componentName, dependencies) {
    console.log(`🔄 ${componentName} 重新渲染:`, {
        dependencies,
        timestamp: new Date().toISOString()
    });
};

console.log('调试监控已设置。在React组件中添加 window.logRender("StarMapCanvas", deps) 来监控依赖变化。'); 