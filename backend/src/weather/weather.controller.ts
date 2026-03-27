import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('search')
  async search(@Query('city') city: string) {
    return this.weatherService.search(city);
  }
}
