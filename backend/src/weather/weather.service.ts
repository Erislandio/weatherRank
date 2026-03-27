import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { SearchResponse } from './dto/city.dto';

@Injectable()
export class WeatherService {
  constructor(private readonly httpService: HttpService) {}
  private baseUrl = 'https://geocoding-api.open-meteo.com';

  async getWeather(city: string) {
    const response = await this.httpService.get(
      `${this.baseUrl}/2.5/weather?q=${city}&appid=YOUR_API_KEY`,
    );
    return response;
  }

  async search(city: string) {
    const response = await this.httpService.get<SearchResponse>(
      `${this.baseUrl}/v1/search?name=${city}`,
    );
    return response;
  }
}
