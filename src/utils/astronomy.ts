import * as Astronomy from 'astronomy-engine';
import { Star } from '../types';

// 主要恒星数据（包括亮度和位置）- 扩展版本
const BRIGHT_STARS = [
  // 大熊座 (Ursa Major) - 北斗七星
  { name: 'Dubhe', ra: 165.932, dec: 61.751, mag: 1.79, constellation: 'UrsaMajor' },
  { name: 'Merak', ra: 165.460, dec: 56.382, mag: 2.37, constellation: 'UrsaMajor' },
  { name: 'Phecda', ra: 178.458, dec: 53.695, mag: 2.44, constellation: 'UrsaMajor' },
  { name: 'Megrez', ra: 183.857, dec: 57.033, mag: 3.31, constellation: 'UrsaMajor' },
  { name: 'Alioth', ra: 193.507, dec: 55.960, mag: 1.77, constellation: 'UrsaMajor' },
  { name: 'Mizar', ra: 200.981, dec: 54.925, mag: 2.27, constellation: 'UrsaMajor' },
  { name: 'Alkaid', ra: 206.885, dec: 49.313, mag: 1.86, constellation: 'UrsaMajor' },
  
  // 猎户座 (Orion)
  { name: 'Betelgeuse', ra: 88.793, dec: 7.407, mag: 0.50, constellation: 'Orion' },
  { name: 'Rigel', ra: 78.634, dec: -8.202, mag: 0.13, constellation: 'Orion' },
  { name: 'Bellatrix', ra: 81.283, dec: 6.350, mag: 1.64, constellation: 'Orion' },
  { name: 'Mintaka', ra: 83.002, dec: -0.299, mag: 2.23, constellation: 'Orion' },
  { name: 'Alnilam', ra: 84.053, dec: -1.202, mag: 1.70, constellation: 'Orion' },
  { name: 'Alnitak', ra: 85.190, dec: -1.943, mag: 2.05, constellation: 'Orion' },
  { name: 'Saiph', ra: 86.939, dec: -9.670, mag: 2.06, constellation: 'Orion' },
  
  // 仙女座 (Andromeda)
  { name: 'Alpheratz', ra: 2.097, dec: 29.090, mag: 2.06, constellation: 'Andromeda' },
  { name: 'Mirach', ra: 17.433, dec: 35.621, mag: 2.01, constellation: 'Andromeda' },
  { name: 'Almach', ra: 30.975, dec: 42.330, mag: 2.26, constellation: 'Andromeda' },
  
  // 仙后座 (Cassiopeia)
  { name: 'Schedar', ra: 10.127, dec: 56.537, mag: 2.23, constellation: 'Cassiopeia' },
  { name: 'Caph', ra: 2.295, dec: 59.150, mag: 2.27, constellation: 'Cassiopeia' },
  { name: 'Gamma Cas', ra: 14.177, dec: 60.717, mag: 2.47, constellation: 'Cassiopeia' },
  { name: 'Ruchbah', ra: 22.818, dec: 55.045, mag: 2.66, constellation: 'Cassiopeia' },
  { name: 'Segin', ra: 25.655, dec: 63.670, mag: 3.38, constellation: 'Cassiopeia' },
  
  // 御夫座 (Auriga)
  { name: 'Capella', ra: 79.172, dec: 45.998, mag: 0.08, constellation: 'Auriga' },
  { name: 'Menkalinan', ra: 89.882, dec: 44.947, mag: 1.90, constellation: 'Auriga' },
  { name: 'Mahasim', ra: 84.411, dec: 33.166, mag: 2.69, constellation: 'Auriga' },
  
  // 双子座 (Gemini)
  { name: 'Pollux', ra: 116.329, dec: 28.026, mag: 1.14, constellation: 'Gemini' },
  { name: 'Castor', ra: 113.650, dec: 31.888, mag: 1.57, constellation: 'Gemini' },
  { name: 'Alhena', ra: 99.428, dec: 16.399, mag: 1.93, constellation: 'Gemini' },
  { name: 'Wasat', ra: 109.273, dec: 22.514, mag: 3.53, constellation: 'Gemini' },
  
  // 狮子座 (Leo)
  { name: 'Regulus', ra: 152.093, dec: 11.967, mag: 1.35, constellation: 'Leo' },
  { name: 'Denebola', ra: 177.265, dec: 14.572, mag: 2.13, constellation: 'Leo' },
  { name: 'Algieba', ra: 154.993, dec: 19.842, mag: 2.37, constellation: 'Leo' },
  { name: 'Zosma', ra: 168.527, dec: 20.524, mag: 2.56, constellation: 'Leo' },
  
  // 室女座 (Virgo)
  { name: 'Spica', ra: 201.298, dec: -11.161, mag: 0.97, constellation: 'Virgo' },
  { name: 'Zavijava', ra: 188.597, dec: 1.764, mag: 3.38, constellation: 'Virgo' },
  { name: 'Porrima', ra: 190.415, dec: -1.449, mag: 2.74, constellation: 'Virgo' },
  
  // 天蝎座 (Scorpius)
  { name: 'Antares', ra: 247.352, dec: -26.432, mag: 1.09, constellation: 'Scorpius' },
  { name: 'Shaula', ra: 263.402, dec: -37.104, mag: 1.63, constellation: 'Scorpius' },
  { name: 'Sargas', ra: 265.622, dec: -42.999, mag: 1.87, constellation: 'Scorpius' },
  { name: 'Dschubba', ra: 240.083, dec: -22.622, mag: 2.29, constellation: 'Scorpius' },
  
  // 人马座 (Sagittarius)
  { name: 'Kaus Australis', ra: 276.043, dec: -34.385, mag: 1.85, constellation: 'Sagittarius' },
  { name: 'Nunki', ra: 283.816, dec: -26.297, mag: 2.02, constellation: 'Sagittarius' },
  { name: 'Kaus Media', ra: 274.407, dec: -29.828, mag: 2.70, constellation: 'Sagittarius' },
  { name: 'Kaus Borealis', ra: 271.452, dec: -25.421, mag: 2.81, constellation: 'Sagittarius' },
  
  // 天鹅座 (Cygnus)
  { name: 'Deneb', ra: 310.358, dec: 45.280, mag: 1.25, constellation: 'Cygnus' },
  { name: 'Sadr', ra: 305.557, dec: 40.257, mag: 2.20, constellation: 'Cygnus' },
  { name: 'Gienah', ra: 304.970, dec: 33.970, mag: 2.46, constellation: 'Cygnus' },
  { name: 'Delta Cyg', ra: 292.680, dec: 45.131, mag: 2.87, constellation: 'Cygnus' },
  { name: 'Albireo', ra: 292.863, dec: 27.960, mag: 3.18, constellation: 'Cygnus' },
  
  // 天琴座 (Lyra)
  { name: 'Vega', ra: 279.234, dec: 38.784, mag: 0.03, constellation: 'Lyra' },
  { name: 'Sheliak', ra: 284.736, dec: 33.363, mag: 3.45, constellation: 'Lyra' },
  { name: 'Sulafat', ra: 284.056, dec: 32.690, mag: 3.24, constellation: 'Lyra' },
  
  // 天鹰座 (Aquila)
  { name: 'Altair', ra: 297.696, dec: 8.868, mag: 0.77, constellation: 'Aquila' },
  { name: 'Tarazed', ra: 296.565, dec: 10.613, mag: 2.72, constellation: 'Aquila' },
  { name: 'Alshain', ra: 298.564, dec: 6.407, mag: 3.71, constellation: 'Aquila' },
  
  // 牧夫座 (Bootes)
  { name: 'Arcturus', ra: 213.915, dec: 19.182, mag: -0.05, constellation: 'Bootes' },
  { name: 'Nekkar', ra: 213.300, dec: 40.390, mag: 3.49, constellation: 'Bootes' },
  { name: 'Seginus', ra: 221.247, dec: 38.308, mag: 3.03, constellation: 'Bootes' },
  
  // 小熊座 (Ursa Minor)
  { name: 'Polaris', ra: 37.946, dec: 89.264, mag: 1.98, constellation: 'UrsaMinor' },
  { name: 'Kochab', ra: 222.676, dec: 74.156, mag: 2.08, constellation: 'UrsaMinor' },
  { name: 'Pherkad', ra: 230.182, dec: 71.834, mag: 3.05, constellation: 'UrsaMinor' },
  
  // 英仙座 (Perseus)
  { name: 'Mirfak', ra: 51.081, dec: 49.861, mag: 1.79, constellation: 'Perseus' },
  { name: 'Algol', ra: 47.042, dec: 40.956, mag: 2.12, constellation: 'Perseus' },
  { name: 'Atik', ra: 55.895, dec: 50.687, mag: 2.85, constellation: 'Perseus' },
  
  // 大犬座 (Canis Major)
  { name: 'Sirius', ra: 101.287, dec: -16.716, mag: -1.46, constellation: 'CanisMajor' },
  { name: 'Adhara', ra: 104.656, dec: -28.972, mag: 1.50, constellation: 'CanisMajor' },
  { name: 'Wezen', ra: 107.098, dec: -26.393, mag: 1.84, constellation: 'CanisMajor' },
  
  // 小犬座 (Canis Minor)
  { name: 'Procyon', ra: 114.825, dec: 5.225, mag: 0.34, constellation: 'CanisMinor' },
  { name: 'Gomeisa', ra: 115.787, dec: 8.289, mag: 2.84, constellation: 'CanisMinor' },
  
  // 金牛座 (Taurus)
  { name: 'Aldebaran', ra: 68.980, dec: 16.509, mag: 0.85, constellation: 'Taurus' },
  { name: 'Elnath', ra: 81.573, dec: 28.608, mag: 1.68, constellation: 'Taurus' },
  { name: 'Alcyone', ra: 56.871, dec: 24.105, mag: 2.87, constellation: 'Taurus' },
  
  // 南鱼座 (Piscis Austrinus)
  { name: 'Fomalhaut', ra: 344.413, dec: -29.622, mag: 1.16, constellation: 'PiscisAustrinus' },
  
  // 白羊座 (Aries)
  { name: 'Hamal', ra: 31.793, dec: 23.462, mag: 2.00, constellation: 'Aries' },
  { name: 'Sheratan', ra: 28.660, dec: 20.808, mag: 2.64, constellation: 'Aries' },
  
  // 天秤座 (Libra)
  { name: 'Zubeneschamali', ra: 229.252, dec: -9.383, mag: 2.61, constellation: 'Libra' },
  { name: 'Zubenelgenubi', ra: 222.720, dec: -16.042, mag: 2.75, constellation: 'Libra' },
  
  // === 南半球星座 ===
  
  // 南十字座 (Crux) - 南半球最著名的星座
  { name: 'Acrux', ra: 186.650, dec: -63.099, mag: 0.77, constellation: 'Crux' },
  { name: 'Gacrux', ra: 187.791, dec: -57.113, mag: 1.63, constellation: 'Crux' },
  { name: 'Imai', ra: 191.930, dec: -59.689, mag: 1.25, constellation: 'Crux' },
  { name: 'Mimosa', ra: 183.786, dec: -59.689, mag: 1.30, constellation: 'Crux' },
  
  // 半人马座 (Centaurus) - 包含离太阳最近的恒星系统
  { name: 'Rigil Kent', ra: 219.902, dec: -60.834, mag: -0.27, constellation: 'Centaurus' },
  { name: 'Hadar', ra: 210.956, dec: -60.373, mag: 0.61, constellation: 'Centaurus' },
  { name: 'Muhlifain', ra: 190.379, dec: -48.960, mag: 2.20, constellation: 'Centaurus' },
  { name: 'Menkent', ra: 211.670, dec: -36.370, mag: 2.06, constellation: 'Centaurus' },
  
  // 船底座 (Carina) - 包含老人星（全天第二亮星）
  { name: 'Canopus', ra: 95.988, dec: -52.696, mag: -0.74, constellation: 'Carina' },
  { name: 'Miaplacidus', ra: 138.300, dec: -69.717, mag: 1.68, constellation: 'Carina' },
  { name: 'Avior', ra: 125.628, dec: -59.509, mag: 1.86, constellation: 'Carina' },
  { name: 'Aspidiske', ra: 140.528, dec: -64.394, mag: 2.76, constellation: 'Carina' },
  
  // 船帆座 (Vela) - 原船座的一部分
  { name: 'Suhail', ra: 136.999, dec: -43.433, mag: 2.21, constellation: 'Vela' },
  { name: 'Regor', ra: 128.446, dec: -47.337, mag: 1.75, constellation: 'Vela' },
  { name: 'Markeb', ra: 140.528, dec: -55.011, mag: 2.47, constellation: 'Vela' },
  
  // 凤凰座 (Phoenix)
  { name: 'Ankaa', ra: 6.571, dec: -42.306, mag: 2.39, constellation: 'Phoenix' },
  { name: 'Beta Phe', ra: 16.962, dec: -46.718, mag: 3.31, constellation: 'Phoenix' },
  
  // 天鹤座 (Grus)
  { name: 'Alnair', ra: 332.058, dec: -46.961, mag: 1.74, constellation: 'Grus' },
  { name: 'Beta Gru', ra: 340.667, dec: -46.885, mag: 2.11, constellation: 'Grus' },
  { name: 'Gamma Gru', ra: 331.378, dec: -37.365, mag: 3.01, constellation: 'Grus' },
  
  // 孔雀座 (Pavo)
  { name: 'Peacock', ra: 306.412, dec: -56.735, mag: 1.94, constellation: 'Pavo' },
  { name: 'Beta Pav', ra: 315.161, dec: -66.203, mag: 3.42, constellation: 'Pavo' },
  
  // 杜鹃座 (Tucana) - 包含小麦哲伦云附近
  { name: 'Alpha Tuc', ra: 337.137, dec: -60.261, mag: 2.86, constellation: 'Tucana' },
  { name: 'Gamma Tuc', ra: 364.397, dec: -58.236, mag: 3.99, constellation: 'Tucana' },
  
  // 南冕座 (Corona Australis)
  { name: 'Meridiana', ra: 287.368, dec: -37.904, mag: 4.11, constellation: 'CoronaAustralis' },
  { name: 'Beta CrA', ra: 288.139, dec: -39.341, mag: 4.11, constellation: 'CoronaAustralis' },
  
  // 天坛座 (Ara)
  { name: 'Beta Ara', ra: 264.325, dec: -55.530, mag: 2.85, constellation: 'Ara' },
  { name: 'Alpha Ara', ra: 262.960, dec: -49.876, mag: 2.95, constellation: 'Ara' },
  
  // 南三角座 (Triangulum Australe)
  { name: 'Atria', ra: 252.166, dec: -69.028, mag: 1.91, constellation: 'TriangulumAustrale' },
  { name: 'Beta TrA', ra: 249.418, dec: -63.431, mag: 2.85, constellation: 'TriangulumAustrale' },
  { name: 'Gamma TrA', ra: 244.970, dec: -68.680, mag: 2.89, constellation: 'TriangulumAustrale' },
];

// 星座连线定义 - 扩展版本
export const CONSTELLATION_LINES = {
  'UrsaMajor': [ // 大熊座（北斗七星）
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]
  ],
  'Orion': [ // 猎户座
    [7, 9], [9, 11], [11, 12], [12, 13], [13, 14], [14, 8], [8, 10], [10, 7],
    [10, 11], [12, 14]
  ],
  'Andromeda': [ // 仙女座
    [14, 15], [15, 16]
  ],
  'Cassiopeia': [ // 仙后座
    [17, 18], [18, 19], [19, 20], [20, 21]
  ],
  'Auriga': [ // 御夫座
    [22, 23], [23, 24], [24, 22]
  ],
  'Gemini': [ // 双子座
    [25, 26], [25, 27], [26, 28], [27, 28]
  ],
  'Leo': [ // 狮子座
    [29, 30], [29, 31], [31, 32], [32, 30]
  ],
  'Virgo': [ // 室女座
    [33, 34], [34, 35]
  ],
  'Scorpius': [ // 天蝎座
    [36, 37], [36, 38], [36, 39], [37, 38]
  ],
  'Sagittarius': [ // 人马座
    [40, 41], [40, 42], [42, 43], [43, 41]
  ],
  'Cygnus': [ // 天鹅座
    [44, 45], [45, 46], [45, 47], [47, 48], [46, 48]
  ],
  'Lyra': [ // 天琴座
    [49, 50], [49, 51], [50, 51]
  ],
  'Aquila': [ // 天鹰座
    [52, 53], [52, 54]
  ],
  'Bootes': [ // 牧夫座
    [55, 56], [55, 57]
  ],
  'UrsaMinor': [ // 小熊座
    [58, 59], [59, 60], [60, 58]
  ],
  'Perseus': [ // 英仙座
    [61, 62], [61, 63]
  ],
  'CanisMajor': [ // 大犬座
    [64, 65], [64, 66], [65, 66]
  ],
  'CanisMinor': [ // 小犬座
    [67, 68]
  ],
  'Taurus': [ // 金牛座
    [69, 70], [69, 71]
  ],
  'Aries': [ // 白羊座
    [73, 74]
  ],
  'Libra': [ // 天秤座
    [75, 76]
  ],
  
  // === 南半球星座连线 ===
  
  'Crux': [ // 南十字座 - 南半球最重要的星座
    [77, 78], [78, 79], [79, 80], [80, 77], // 连成十字形
    [78, 80] // 对角线
  ],
  'Centaurus': [ // 半人马座
    [81, 82], [81, 83], [83, 84], // 主要连线
    [82, 84] // 连接其他恒星
  ],
  'Carina': [ // 船底座
    [85, 86], [85, 87], [86, 88], [87, 88] // 连成船的形状
  ],
  'Vela': [ // 船帆座
    [89, 90], [90, 91], [91, 89] // 三角形连线
  ],
  'Phoenix': [ // 凤凰座
    [92, 93] // 简单连线
  ],
  'Grus': [ // 天鹤座
    [94, 95], [94, 96], [95, 96] // 连成鹤的形状
  ],
  'Pavo': [ // 孔雀座
    [97, 98] // 简单连线
  ],
  'Tucana': [ // 杜鹃座
    [99, 100] // 简单连线
  ],
  'CoronaAustralis': [ // 南冕座
    [101, 102] // 简单连线
  ],
  'Ara': [ // 天坛座
    [103, 104] // 简单连线
  ],
  'TriangulumAustrale': [ // 南三角座
    [105, 106], [106, 107], [107, 105] // 三角形
  ],
};

// 辅助函数：日期转朱利安日
function dateToJulianDay(date: Date): number {
  const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
  const y = date.getFullYear() + 4800 - a;
  const m = (date.getMonth() + 1) + 12 * a - 3;
  
  return date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + 
         Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045 +
         (date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600) / 24;
}

// 辅助函数：计算本地恒星时
function localSiderealTime(jd: number, longitude: number): number {
  const t = (jd - 2451545.0) / 36525;
  const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 
               t * t * (0.000387933 - t / 38710000);
  const lst = gmst + longitude;
  return ((lst % 360) + 360) % 360;
}

// 辅助函数：赤道坐标转地平坐标
function equatorialToHorizontal(
  ra: number, 
  dec: number, 
  hourAngle: number, 
  latitude: number
): { altitude: number; azimuth: number } {
  const raRad = ra * Math.PI / 180;
  const decRad = dec * Math.PI / 180;
  const haRad = hourAngle * Math.PI / 180;
  const latRad = latitude * Math.PI / 180;
  
  const sinAlt = Math.sin(decRad) * Math.sin(latRad) + 
                 Math.cos(decRad) * Math.cos(latRad) * Math.cos(haRad);
  const altitude = Math.asin(sinAlt) * 180 / Math.PI;
  
  const cosAz = (Math.sin(decRad) - Math.sin(latRad) * sinAlt) / 
                (Math.cos(latRad) * Math.cos(Math.asin(sinAlt)));
  const sinAz = -Math.sin(haRad) * Math.cos(decRad) / Math.cos(Math.asin(sinAlt));
  
  let azimuth = Math.atan2(sinAz, cosAz) * 180 / Math.PI;
  azimuth = (azimuth + 360) % 360;
  
  return { altitude, azimuth };
}

export function calculateStarPositions(
  latitude: number,
  longitude: number,
  date: Date,
  magnitudeLimit: number = 4.0
): Star[] {
  const stars: Star[] = [];
  
  // 改进的天文算法（基于真实的天文学原理）
  const julianDay = dateToJulianDay(date);
  const lst = localSiderealTime(julianDay, longitude); // 本地恒星时
  
  BRIGHT_STARS.forEach((star) => {
    // 只处理比星等限制更亮的星星
    if (star.mag <= magnitudeLimit) {
      // 计算时角
      const hourAngle = lst - star.ra;
      
      // 将赤道坐标转换为地平坐标
      const coordinates = equatorialToHorizontal(
        star.ra,
        star.dec,
        hourAngle,
        latitude
      );
      
      // 只显示地平线以上的星星
      if (coordinates.altitude > 0) {
        // 使用立体投影将地平坐标转换为画布坐标
        const r = 280 * (90 - coordinates.altitude) / 90;
        const theta = (coordinates.azimuth - 180) * Math.PI / 180;
        
        const x = 300 + r * Math.sin(theta);
        const y = 300 - r * Math.cos(theta);
        
        stars.push({
          x,
          y,
          magnitude: star.mag,
          name: star.name
        });
      }
    }
  });
  
  return stars;
}

// 简单的随机数生成器（基于种子）
function seededRandom(seed: number): () => number {
  let x = Math.sin(seed) * 10000;
  return function() {
    x = Math.sin(x) * 10000;
    return x - Math.floor(x);
  };
}

// 生成基于位置和时间的背景星星
export function generateBackgroundStars(
  count: number = 200, 
  latitude: number = 0, 
  longitude: number = 0,
  date?: Date
): Star[] {
  const stars: Star[] = [];
  
  // 基于位置创建种子，确保相同位置总是生成相同的背景星星
  const seed = Math.abs(latitude * 1000 + longitude * 1000) % 10000;
  const random = seededRandom(seed);
  
  // 如果提供了日期，计算天空旋转角度
  let skyRotation = 0;
  if (date) {
    const julianDay = dateToJulianDay(date);
    const lst = localSiderealTime(julianDay, longitude);
    // 将本地恒星时转换为旋转角度（以小时为单位转换为度数）
    skyRotation = (lst * Math.PI) / 180;
  }
  
  for (let i = 0; i < count; i++) {
    const r = random() * 280;
    let theta = random() * 2 * Math.PI;
    
    // 根据天空旋转调整角度
    theta += skyRotation;
    
    stars.push({
      x: 300 + r * Math.cos(theta),
      y: 300 + r * Math.sin(theta),
      magnitude: 3 + random() * 3, // 较暗的背景星
    });
  }
  
  return stars;
} 