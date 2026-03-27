import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { SearchResponse } from './dto/city.dto';
import { WeatherResponse } from './dto/weather.dto';

@Injectable()
export class WeatherService {
  constructor(private readonly httpService: HttpService) {}
  private searchBaseUrl = 'https://geocoding-api.open-meteo.com/v1';
  private weatherBaseUrl = 'https://api.open-meteo.com/v1';

  async getWeather(latitude: number, longitude: number) {
    const { data } = await firstValueFrom(
      this.httpService.get<WeatherResponse>(
        `${this.weatherBaseUrl}/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,rain,wind_speed_10m,snowfall,snow_depth`,
      ),
    );

    return {
      latitude: data.latitude,
      longitude: data.longitude,
      generationtime: data.generationtime_ms,
      utcOffsetSeconds: data.utc_offset_seconds,
      timezone: data.timezone,
      timezoneAbbreviation: data.timezone_abbreviation,
      elevation: data.elevation,
      hourly_units: {
        time: data.hourly_units.time,
        temperature: data.hourly_units.temperature_2m,
        relativeHumidity: data.hourly_units.relative_humidity_2m,
        rain: data.hourly_units.rain,
        windSpeed: data.hourly_units.wind_speed_10m,
        snowfall: data.hourly_units.snowfall,
        snowDepth: data.hourly_units.snow_depth,
      },
      weather: data.hourly.time.map((time, index) => {
        return {
          time,
          temperature: data.hourly.temperature_2m[index],
          relativeHumidity: data.hourly.relative_humidity_2m[index],
          rain: data.hourly.rain[index],
          windSpeed: data.hourly.wind_speed_10m[index],
          snowfall: data.hourly.snowfall[index],
          snowDepth: data.hourly.snow_depth[index],
        };
      }),
    };
  }

  async search(city: string) {
    const { data } = await firstValueFrom(
      this.httpService.get<SearchResponse>(
        `${this.searchBaseUrl}/search?name=${city}`,
      ),
    );

    return data.results.map((result) => ({
      id: result.id,
      name: result.name,
      state: result?.admin1 ?? '',
      country: result.country,
      countryCode: result.country_code,
      latitude: result.latitude,
      longitude: result.longitude,
    }));
  }
}
