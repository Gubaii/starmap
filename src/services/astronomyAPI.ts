import axios from 'axios';

// AstronomyAPI配置接口
export interface AstronomyAPIConfig {
  apiId: string;
  apiSecret: string;
}

// 观察者位置信息
export interface Observer {
  latitude: number;
  longitude: number;
  date: string; // YYYY-MM-DD format
}

// 星图视图类型
export interface StarChartView {
  type: 'area' | 'constellation';
  parameters: {
    position?: {
      equatorial: {
        rightAscension: number;
        declination: number;
      };
    };
    zoom?: number;
    constellation?: string;
  };
}

// AstronomyAPI请求体
export interface StarChartRequest {
  style?: 'default' | 'inverted' | 'navy' | 'red';
  observer: Observer;
  view: StarChartView;
}

// AstronomyAPI响应
export interface StarChartResponse {
  data: {
    imageUrl: string;
  };
}

class AstronomyAPIService {
  private apiId: string;
  private apiSecret: string;
  private baseURL = 'https://api.astronomyapi.com/api/v2';

  constructor(config: AstronomyAPIConfig) {
    this.apiId = config.apiId;
    this.apiSecret = config.apiSecret;
  }

  // 生成认证字符串
  private getAuthString(): string {
    const credentials = `${this.apiId}:${this.apiSecret}`;
    return btoa(credentials);
  }

  // 生成指定区域的星图
  async generateAreaStarChart(
    latitude: number,
    longitude: number,
    date: Date,
    rightAscension: number = 12.0,
    declination: number = 0.0,
    zoom: number = 1,
    style: 'default' | 'inverted' | 'navy' | 'red' = 'default'
  ): Promise<string> {
    const request: StarChartRequest = {
      style,
      observer: {
        latitude,
        longitude,
        date: date.toISOString().split('T')[0]
      },
      view: {
        type: 'area',
        parameters: {
          position: {
            equatorial: {
              rightAscension,
              declination
            }
          },
          zoom
        }
      }
    };

    try {
      const response = await axios.post<StarChartResponse>(
        `${this.baseURL}/studio/star-chart`,
        request,
        {
          headers: {
            'Authorization': `Basic ${this.getAuthString()}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.data.imageUrl;
    } catch (error) {
      console.error('AstronomyAPI请求失败:', error);
      throw new Error('生成星图失败，请检查API配置和网络连接');
    }
  }

  // 生成指定星座的星图
  async generateConstellationStarChart(
    latitude: number,
    longitude: number,
    date: Date,
    constellation: string,
    style: 'default' | 'inverted' | 'navy' | 'red' = 'default'
  ): Promise<string> {
    const request: StarChartRequest = {
      style,
      observer: {
        latitude,
        longitude,
        date: date.toISOString().split('T')[0]
      },
      view: {
        type: 'constellation',
        parameters: {
          constellation: constellation.toLowerCase()
        }
      }
    };

    try {
      const response = await axios.post<StarChartResponse>(
        `${this.baseURL}/studio/star-chart`,
        request,
        {
          headers: {
            'Authorization': `Basic ${this.getAuthString()}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.data.imageUrl;
    } catch (error) {
      console.error('AstronomyAPI请求失败:', error);
      throw new Error('生成星图失败，请检查API配置和网络连接');
    }
  }

  // 生成多个视角的星图（用于创建完整的天空视图）
  async generateMultipleStarCharts(
    latitude: number,
    longitude: number,
    date: Date,
    style: 'default' | 'inverted' | 'navy' | 'red' = 'default'
  ): Promise<string[]> {
    const viewPoints = [
      { ra: 0, dec: 0 },     // 天赤道
      { ra: 6, dec: 30 },    // 北天
      { ra: 12, dec: 0 },    // 对面天赤道
      { ra: 18, dec: -30 }   // 南天
    ];

    const promises = viewPoints.map(point => 
      this.generateAreaStarChart(latitude, longitude, date, point.ra, point.dec, 2, style)
    );

    try {
      return await Promise.all(promises);
    } catch (error) {
      console.error('批量生成星图失败:', error);
      throw new Error('批量生成星图失败');
    }
  }
}

// 常用星座列表
export const CONSTELLATION_LIST = [
  { code: 'ori', name: '猎户座 (Orion)', nameEn: 'Orion' },
  { code: 'uma', name: '大熊座 (Ursa Major)', nameEn: 'Ursa Major' },
  { code: 'cas', name: '仙后座 (Cassiopeia)', nameEn: 'Cassiopeia' },
  { code: 'cyg', name: '天鹅座 (Cygnus)', nameEn: 'Cygnus' },
  { code: 'aql', name: '天鹰座 (Aquila)', nameEn: 'Aquila' },
  { code: 'lyr', name: '天琴座 (Lyra)', nameEn: 'Lyra' },
  { code: 'leo', name: '狮子座 (Leo)', nameEn: 'Leo' },
  { code: 'vir', name: '室女座 (Virgo)', nameEn: 'Virgo' },
  { code: 'gem', name: '双子座 (Gemini)', nameEn: 'Gemini' },
  { code: 'tau', name: '金牛座 (Taurus)', nameEn: 'Taurus' },
  { code: 'sco', name: '天蝎座 (Scorpius)', nameEn: 'Scorpius' },
  { code: 'sgr', name: '人马座 (Sagittarius)', nameEn: 'Sagittarius' }
];

export default AstronomyAPIService; 