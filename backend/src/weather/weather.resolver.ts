import { Args, Query, Resolver } from '@nestjs/graphql';
import { City } from './models/city.model';
import { Weather } from './models/weather.mode';
import { WeatherService } from './weather.service';

@Resolver()
export class WeatherResolver {
  constructor(private readonly weatherService: WeatherService) {}

  @Query(() => [City], { name: 'cities' })
  async search(@Args('city') city: string) {
    return this.weatherService.search(city);
  }

  @Query(() => Weather, { name: 'weather' })
  async getWeather(
    @Args('latitude') latitude: number,
    @Args('longitude') longitude: number,
  ) {
    return this.weatherService.getWeather(latitude, longitude);
  }
}
