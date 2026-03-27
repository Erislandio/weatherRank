import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

describe('WeatherController', () => {
  let controller: WeatherController;
  let service: WeatherService;

  const mockWeatherService = {
    search: jest.fn(),
    getWeather: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [
        {
          provide: WeatherService,
          useValue: mockWeatherService,
        },
      ],
    }).compile();

    controller = module.get<WeatherController>(WeatherController);
    service = module.get<WeatherService>(WeatherService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('search', () => {
    it('should call service.search with the provided city', async () => {
      const city = 'New York';
      const mockResult = [{ id: 1, name: 'New York' }];
      mockWeatherService.search.mockResolvedValue(mockResult);

      const result = await controller.search(city);

      expect(service.search).toHaveBeenCalledWith(city);
      expect(result).toBe(mockResult);
    });
  });

  describe('getWeather', () => {
    it('should call service.getWeather with the provided coordinates', async () => {
      const lat = 40.7128, lon = -74.0060;
      const mockResult = { latitude: lat, longitude: lon };
      mockWeatherService.getWeather.mockResolvedValue(mockResult);

      const result = await controller.getWeather(lat, lon);

      expect(service.getWeather).toHaveBeenCalledWith(lat, lon);
      expect(result).toBe(mockResult);
    });
  });
});
