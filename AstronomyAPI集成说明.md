# AstronomyAPI 集成说明

## 概述

我已经成功将AstronomyAPI集成到您的星图设计工具中，现在您可以使用专业的天文数据API来生成更加精确的星图。

## 新增功能

### 1. 双模式星图生成
- **本地星图模式**：使用本地天文计算算法，支持高度自定义
- **AstronomyAPI模式**：使用专业天文数据API，精度更高

### 2. AstronomyAPI功能特性

#### 支持的星图类型：
- **天区视图 (Area View)**：显示指定赤经赤纬的天区
- **星座视图 (Constellation View)**：显示特定星座

#### 支持的样式：
- `default`：默认样式
- `inverted`：反色样式 
- `navy`：深蓝样式
- `red`：红色样式

#### 支持的星座：
- 猎户座 (Orion) - `ori`
- 大熊座 (Ursa Major) - `uma`
- 仙后座 (Cassiopeia) - `cas`
- 天鹅座 (Cygnus) - `cyg`
- 天鹰座 (Aquila) - `aql`
- 天琴座 (Lyra) - `lyr`
- 狮子座 (Leo) - `leo`
- 室女座 (Virgo) - `vir`
- 双子座 (Gemini) - `gem`
- 金牛座 (Taurus) - `tau`
- 天蝎座 (Scorpius) - `sco`
- 人马座 (Sagittarius) - `sgr`

## 使用步骤

### 1. 获取AstronomyAPI凭据

1. 访问 [AstronomyAPI官网](https://astronomyapi.com)
2. 注册账号并登录
3. 创建新的Application
4. 获取 Application ID 和 Application Secret

### 2. 配置API凭据

1. 在应用中点击 "AstronomyAPI" 标签
2. 点击右上角的 "设置" 按钮
3. 输入您的 Application ID 和 Application Secret
4. 点击 "保存配置"

### 3. 生成星图

1. 选择星图样式（默认、反色、深蓝、红色）
2. 选择视图类型：
   - **天区视图**：可调整赤经、赤纬、缩放等参数
   - **星座视图**：选择要显示的星座
3. 系统会自动根据您在左侧面板设置的位置和时间生成星图
4. 点击 "重新生成" 按钮可手动刷新
5. 点击 "下载星图" 保存图片

## 技术特点

### AstronomyAPI vs 本地计算

| 特性 | 本地计算 | AstronomyAPI |
|------|----------|-------------|
| 数据精度 | 中等 (77颗恒星) | 专业级 (完整星表) |
| 自定义性 | 高 | 中等 |
| 网络依赖 | 无 | 需要 |
| 计算速度 | 快 | 较慢 |
| 成本 | 免费 | API调用费用 |

### 代码架构

```
src/
├── services/
│   └── astronomyAPI.ts          # AstronomyAPI服务类
├── components/
│   └── AstronomyAPIChart.tsx    # AstronomyAPI星图组件
└── App.tsx                      # 集成标签页功能
```

## API配置管理

- API凭据自动保存在浏览器 localStorage 中
- 支持显示/隐藏 Application Secret
- 配置错误时会显示友好的错误提示

## 错误处理

系统包含完善的错误处理机制：
- API认证失败提示
- 网络请求超时处理
- 参数验证错误提示
- 友好的用户界面反馈

## 注意事项

1. **API限制**：AstronomyAPI可能有请求频率限制，请适度使用
2. **网络连接**：AstronomyAPI模式需要稳定的网络连接
3. **CORS配置**：确保在AstronomyAPI后台设置正确的域名白名单
4. **数据缓存**：API生成的图片URL会有过期时间

## 开发者信息

### 新增的服务类

```typescript
// src/services/astronomyAPI.ts
class AstronomyAPIService {
  // 生成天区星图
  async generateAreaStarChart(
    latitude: number,
    longitude: number, 
    date: Date,
    rightAscension: number,
    declination: number,
    zoom: number,
    style: 'default' | 'inverted' | 'navy' | 'red'
  ): Promise<string>

  // 生成星座星图  
  async generateConstellationStarChart(
    latitude: number,
    longitude: number,
    date: Date, 
    constellation: string,
    style: 'default' | 'inverted' | 'navy' | 'red'
  ): Promise<string>
}
```

### 组件接口

```typescript
// AstronomyAPIChart组件接受StarMapConfig作为props
interface AstronomyAPIChartProps {
  config: StarMapConfig;
}
```

## 未来扩展

可以考虑的功能扩展：
1. 支持更多星图类型（月相图、行星图等）
2. 批量生成不同时间点的星图
3. 星图动画功能
4. 更多自定义参数
5. 离线缓存机制

## 支持与反馈

如有问题或建议，请查看：
- [AstronomyAPI官方文档](https://docs.astronomyapi.com/)
- [项目GitHub仓库](您的仓库地址)

---

*此文档会随着功能更新而持续维护* 