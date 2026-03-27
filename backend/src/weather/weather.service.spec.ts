import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { WeatherService } from './weather.service';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpService: HttpService;

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('search', () => {
    it('should return a list of cities', async () => {
      const mockResult = {
        data: {
          results: [
            {
              id: 1,
              name: 'London',
              admin1: 'England',
              country: 'United Kingdom',
              country_code: 'GB',
              latitude: 51.5,
              longitude: -0.1,
            },
          ],
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResult) as any);

      const result = await service.search('London');

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('London');
      expect(result[0].state).toBe('England');
      expect(httpService.get).toHaveBeenCalledWith(
        expect.stringContaining('name=London'),
      );
    });

    it('should handle undefined state (admin1)', async () => {
      const mockResult = {
        data: {
          results: [
            {
              id: 2,
              name: 'Nowhere',
              country: 'Ghostland',
              country_code: 'GH',
              latitude: 0,
              longitude: 0,
            },
          ],
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResult) as any);

      const result = await service.search('Nowhere');

      expect(result[0].state).toBe('');
    });
  });

  describe('getWeather', () => {
    it('should return weather data formatted correctly', async () => {
      const mockWeatherResponse = {
        data: {
          latitude: 51.5,
          longitude: -0.1,
          generationtime_ms: 0.1,
          utc_offset_seconds: 0,
          timezone: 'GMT',
          timezone_abbreviation: 'GMT',
          elevation: 10,
          hourly_units: {
            time: 'iso8601',
            temperature_2m: '°C',
            relative_humidity_2m: '%',
            rain: 'mm',
            wind_speed_10m: 'km/h',
            snowfall: 'cm',
            snow_depth: 'm',
          },
          hourly: {
            time: ['2024-01-01T00:00'],
            temperature_2m: [10],
            relative_humidity_2m: [80],
            rain: [0],
            wind_speed_10m: [5],
            snowfall: [0],
            snow_depth: [0],
          },
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockWeatherResponse) as any);

      const result = await service.getWeather(51.5, -0.1);

      expect(result.latitude).toBe(51.5);
      expect(result.hourly_units.temperature).toBe('°C');
      expect(result.weather).toHaveLength(1);
      expect(result.weather[0]).toEqual({
        time: '2024-01-01T00:00',
        temperature: 10,
        relativeHumidity: 80,
        rain: 0,
        windSpeed: 5,
        snowfall: 0,
        snowDepth: 0,
      });
    });
  });
});
