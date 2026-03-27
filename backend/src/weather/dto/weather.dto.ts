export interface WeatherResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: HourlyUnits;
  hourly: Hourly;
}

export interface HourlyUnits {
  time: string[];
  temperature_2m: string;
  relative_humidity_2m: string;
  rain: string;
  wind_speed_10m: string;
  snowfall: string;
  snow_depth: string;
}

export interface Hourly {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  rain: number[];
  wind_speed_10m: number[];
  snowfall: number[];
  snow_depth: number[];
}
