export interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

export interface TextConfig {
  title: string;
  subtitle: string;
  date: string;
}

export interface StyleConfig {
  starColor: string;
  backgroundColor: string;
  constellationLines: boolean;
  starSize: 'small' | 'medium' | 'large';
  showGrid: boolean;
  magnitudeLimit: number;
}

export interface StarMapConfig {
  location: Location;
  date: Date;
  text: TextConfig;
  style: StyleConfig;
}

export interface Star {
  x: number;
  y: number;
  magnitude: number;
  name?: string;
}

export interface Constellation {
  name: string;
  stars: Star[];
  lines: [number, number][];
} 