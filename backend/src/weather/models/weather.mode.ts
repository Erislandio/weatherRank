import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class WeatherUnit {
  @Field()
  time: string;

  @Field()
  temperature: string;

  @Field()
  relativeHumidity: string;

  @Field()
  rain: string;

  @Field()
  windSpeed: string;

  @Field()
  snowfall: string;

  @Field()
  snowDepth: string;
}

@ObjectType()
export class Weather {
  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;

  @Field(() => Float)
  generationtime: number;

  @Field()
  utcOffsetSeconds: number;

  @Field()
  timezone: string;

  @Field()
  timezoneAbbreviation: string;

  @Field(() => Float)
  elevation: number;

  @Field(() => WeatherUnit)
  hourlyUnits: WeatherUnit;

  @Field(() => [WeatherUnit])
  weather: WeatherUnit[];
}
