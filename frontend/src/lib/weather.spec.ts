import { describe, expect, it } from "vitest";
import type { WeatherUnit } from "../types/weather";
import { groupByDay, rankActivities } from "./weather";

describe("weather library", () => {
  const mockWeather: WeatherUnit[] = [
    {
      time: "2024-01-01T00:00:00Z",
      temperature: "10",
      relativeHumidity: "80",
      rain: "0",
      windSpeed: "5",
      snowfall: "0",
      snowDepth: "0",
    },
    {
      time: "2024-01-01T01:00:00Z",
      temperature: "12",
      relativeHumidity: "75",
      rain: "2",
      windSpeed: "10",
      snowfall: "0",
      snowDepth: "0",
    },
    {
      time: "2024-01-02T00:00:00Z",
      temperature: "5",
      relativeHumidity: "90",
      rain: "10",
      windSpeed: "15",
      snowfall: "0",
      snowDepth: "0",
    },
  ];

  it("groupByDay should group hourly data into daily forecasts", () => {
    const daily = groupByDay(mockWeather);
    expect(daily).toHaveLength(2);
    expect(daily[0].dateLabel).toBe("1 Jan");
    expect(daily[1].dateLabel).toBe("2 Jan");
  });

  it("groupByDay should calculate min/max/avg temps correctly", () => {
    const daily = groupByDay(mockWeather);
    const day1 = daily[0];
    expect(day1.minTemp).toBe(10);
    expect(day1.maxTemp).toBe(12);
    expect(day1.avgTemp).toBe(11);
    expect(day1.totalRain).toBe(2);
  });

  it("rankActivities should return a sorted list of activities", () => {
    const daily = groupByDay(mockWeather);
    const activities = rankActivities(daily);
    expect(activities).toHaveLength(4);
    expect(activities[0].score).toBeGreaterThanOrEqual(activities[1].score);
    expect(activities[1].score).toBeGreaterThanOrEqual(activities[2].score);
  });
});
