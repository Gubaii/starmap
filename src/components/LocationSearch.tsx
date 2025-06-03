import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Location } from '../types';

interface LocationSearchProps {
  value: Location;
  onChange: (location: Location) => void;
}

// 预设的欧美热门城市
const popularCities = [
  { name: 'New York, USA', latitude: 40.7128, longitude: -74.0060 },
  { name: 'London, UK', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Paris, France', latitude: 48.8566, longitude: 2.3522 },
  { name: 'Berlin, Germany', latitude: 52.5200, longitude: 13.4050 },
  { name: 'Rome, Italy', latitude: 41.9028, longitude: 12.4964 },
  { name: 'Madrid, Spain', latitude: 40.4168, longitude: -3.7038 },
  { name: 'Amsterdam, Netherlands', latitude: 52.3676, longitude: 4.9041 },
  { name: 'Vienna, Austria', latitude: 48.2082, longitude: 16.3738 },
  { name: 'Stockholm, Sweden', latitude: 59.3293, longitude: 18.0686 },
  { name: 'Copenhagen, Denmark', latitude: 55.6761, longitude: 12.5683 },
  { name: 'Los Angeles, USA', latitude: 34.0522, longitude: -118.2437 },
  { name: 'Toronto, Canada', latitude: 43.6532, longitude: -79.3832 },
  { name: 'Sydney, Australia', latitude: -33.8688, longitude: 151.2093 },
  { name: 'Tokyo, Japan', latitude: 35.6762, longitude: 139.6503 },
];

// Nominatim API搜索结果类型
interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  class: string;
  type: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ value, onChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customLat, setCustomLat] = useState(value.latitude.toString());
  const [customLng, setCustomLng] = useState(value.longitude.toString());
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 搜索API函数
  const searchLocations = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=8&q=${encodeURIComponent(query)}&accept-language=en`
      );
      const data: NominatimResult[] = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('搜索位置失败:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 处理搜索输入变化
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    
    // 清除之前的搜索
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // 如果查询为空，显示热门城市
    if (query.trim() === '') {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    // 延迟搜索以避免过多API调用
    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(query);
    }, 300);
  };

  const handleCitySelect = (city: typeof popularCities[0]) => {
    onChange(city);
    setSearchQuery('');
    setShowResults(false);
  };

  const handleSearchResultSelect = (result: NominatimResult) => {
    const location: Location = {
      name: result.display_name,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon)
    };
    onChange(location);
    setSearchQuery('');
    setShowResults(false);
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleCustomLocation = () => {
    const lat = parseFloat(customLat);
    const lng = parseFloat(customLng);
    
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      onChange({
        name: `Custom location (${lat.toFixed(2)}, ${lng.toFixed(2)})`,
        latitude: lat,
        longitude: lng
      });
      setShowCustomInput(false);
    }
  };

  const filteredCities = popularCities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search cities worldwide..."
          className="w-full px-4 py-2 pl-10 pr-10 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
        {isSearching && (
          <Loader2 className="absolute right-3 top-2.5 text-slate-400 animate-spin" size={18} />
        )}
      </div>

      {/* 搜索结果 */}
      {showResults && searchResults.length > 0 && (
        <div className="bg-slate-800 border border-slate-600 rounded-lg overflow-hidden max-h-60 overflow-y-auto">
          {searchResults.map((result) => (
            <button
              key={result.place_id}
              onClick={() => handleSearchResultSelect(result)}
              className="w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              <MapPin size={16} className="text-slate-400" />
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm truncate">{result.display_name}</div>
                <div className="text-xs text-slate-400">
                  {parseFloat(result.lat).toFixed(4)}, {parseFloat(result.lon).toFixed(4)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* 热门城市搜索结果 */}
      {searchQuery && !showResults && !isSearching && (
        <div className="bg-slate-800 border border-slate-600 rounded-lg overflow-hidden">
          {popularCities
            .filter(city => city.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((city) => (
            <button
              key={city.name}
              onClick={() => handleCitySelect(city)}
              className="w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              <MapPin size={16} className="text-slate-400" />
              <span className="text-white">{city.name}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setShowCustomInput(!showCustomInput)}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          Use custom coordinates
        </button>
      </div>

      {showCustomInput && (
        <div className="space-y-3 p-4 bg-slate-800 rounded-lg">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Latitude (-90 to 90)</label>
            <input
              type="number"
              value={customLat}
              onChange={(e) => setCustomLat(e.target.value)}
              step="0.0001"
              min="-90"
              max="90"
              className="w-full px-3 py-1 bg-slate-700 border border-slate-600 rounded text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Longitude (-180 to 180)</label>
            <input
              type="number"
              value={customLng}
              onChange={(e) => setCustomLng(e.target.value)}
              step="0.0001"
              min="-180"
              max="180"
              className="w-full px-3 py-1 bg-slate-700 border border-slate-600 rounded text-white"
            />
          </div>
          <button
            onClick={handleCustomLocation}
            className="w-full px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
          >
            Confirm coordinates
          </button>
        </div>
      )}

      {/* 热门城市快速选择 */}
      {!searchQuery && (
        <div>
          <p className="text-sm text-slate-400 mb-2">Popular Cities</p>
          <div className="grid grid-cols-2 gap-2">
            {popularCities.slice(0, 8).map((city) => (
              <button
                key={city.name}
                onClick={() => handleCitySelect(city)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-sm text-white transition-colors text-left"
              >
                {city.name.split(',')[0]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSearch; 