import { Test, TestingModule } from '@nestjs/testing';
import { WeatherResolver } from './weather.resolver';
import { WeatherService } from './weather.service';

describe('WeatherResolver', () => {
  let resolver: WeatherResolver;
  let service: WeatherService;

  const mockWeatherService = {
    search: jest.fn(),
    getWeather: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherResolver,
        {
          provide: WeatherService,
          useValue: mockWeatherService,
        },
      ],
    }).compile();

    resolver = module.get<WeatherResolver>(WeatherResolver);
    service = module.get<WeatherService>(WeatherService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('search', () => {
    it('should call service.search for city search query', async () => {
      const city = 'Tokyo';
      const mockResult = [{ id: 1, name: 'Tokyo' }];
      mockWeatherService.search.mockResolvedValue(mockResult);

      const result = await resolver.search(city);

      expect(service.search).toHaveBeenCalledWith(city);
      expect(result).toBe(mockResult);
    });
  });

  describe('getWeather', () => {
    it('should call service.getWeather for weather query', async () => {
      const lat = 35.6895, lon = 139.6917;
      const mockResult = { latitude: lat, longitude: lon, elevation: 0 };
      mockWeatherService.getWeather.mockResolvedValue(mockResult);

      const result = await resolver.getWeather(lat, lon);

      expect(service.getWeather).toHaveBeenCalledWith(lat, lon);
      expect(result).toBe(mockResult);
    });
  });
});
