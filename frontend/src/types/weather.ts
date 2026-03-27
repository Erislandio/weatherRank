export interface City {
  id: number;
  name: string;
  state: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  elevation: number;
}

export interface WeatherUnit {
  time: string;
  temperature: string;
  relativeHumidity: string;
  rain: string;
  windSpeed: string;
  snowfall: string;
  snowDepth: string;
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  timezoneAbbreviation: string;
  elevation: number;
  weather: WeatherUnit[];
}

export interface DayForecast {
  date: Date;
  dateLabel: string;
  dayLabel: string;
  isToday: boolean;
  minTemp: number;
  maxTemp: number;
  avgTemp: number;
  totalRain: number;
  avgWindSpeed: number;
  totalSnowfall: number;
  avgSnowDepth: number;
  avgHumidity: number;
  weatherIcon: string;
  condition: string;
}

export type ActivityName =
  | 'Skiing'
  | 'Surfing'
  | 'Outdoor Sightseeing'
  | 'Indoor Sightseeing';

export interface ActivityScore {
  name: ActivityName;
  emoji: string;
  score: number;
  rank: number;
  description: string;
  gradient: string;
  bgGradient: string;
}
