import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class City {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  state: string;

  @Field()
  country: string;

  @Field()
  countryCode: string;

  @Field()
  latitude: number;

  @Field()
  longitude: number;
}
