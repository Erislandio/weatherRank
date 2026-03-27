import type { City, WeatherData } from '../types/weather';

const GRAPHQL_URL = 'http://localhost:3000/graphql';

async function gql<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = (await res.json()) as { data: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
}

export async function searchCities(city: string): Promise<City[]> {
  const data = await gql<{ cities: City[] }>(
    `query SearchCities($city: String!) {
      cities(city: $city) {
        id name state country countryCode latitude longitude elevation
      }
    }`,
    { city },
  );
  return data.cities ?? [];
}

export async function getWeather(
  latitude: number,
  longitude: number,
): Promise<WeatherData> {
  const data = await gql<{ weather: WeatherData }>(
    `query GetWeather($latitude: Float!, $longitude: Float!) {
      weather(latitude: $latitude, longitude: $longitude) {
        latitude longitude timezone timezoneAbbreviation elevation
        weather {
          time temperature relativeHumidity rain windSpeed snowfall snowDepth
        }
      }
    }`,
    { latitude, longitude },
  );
  return data.weather;
}
