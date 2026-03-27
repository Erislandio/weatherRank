import type { ActivityScore, DayForecast, WeatherUnit } from "../types/weather";

const avg = (arr: number[]) =>
  arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

function getCondition(
  rain: number,
  snowfall: number,
  windSpeed: number,
  temp: number,
): { icon: string; condition: string } {
  if (snowfall > 2) return { icon: "❄️", condition: "Heavy Snow" };
  if (snowfall > 0) return { icon: "🌨️", condition: "Light Snow" };
  if (rain > 8) return { icon: "⛈️", condition: "Stormy" };
  if (rain > 3) return { icon: "🌧️", condition: "Rainy" };
  if (rain > 0.5) return { icon: "🌦️", condition: "Showers" };
  if (windSpeed > 40) return { icon: "🌬️", condition: "Very Windy" };
  if (temp > 28) return { icon: "☀️", condition: "Hot & Sunny" };
  if (temp > 18) return { icon: "🌤️", condition: "Mostly Sunny" };
  if (temp > 8) return { icon: "⛅", condition: "Partly Cloudy" };
  return { icon: "☁️", condition: "Overcast" };
}

export function groupByDay(weather: WeatherUnit[]): DayForecast[] {
  const days = new Map<string, WeatherUnit[]>();
  for (const unit of weather) {
    const dateStr = unit.time.split("T")[0];
    if (!days.has(dateStr)) days.set(dateStr, []);
    days.get(dateStr)!.push(unit);
  }

  const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTH_NAMES = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const todayStr = new Date().toISOString().split("T")[0];

  return Array.from(days.entries())
    .slice(0, 7)
    .map(([dateStr, hours]) => {
      const temps = hours.map((h) => parseFloat(h.temperature));
      const rains = hours.map((h) => parseFloat(h.rain));
      const winds = hours.map((h) => parseFloat(h.windSpeed));
      const snowfalls = hours.map((h) => parseFloat(h.snowfall));
      const snowDepths = hours.map((h) => parseFloat(h.snowDepth));
      const humidities = hours.map((h) => parseFloat(h.relativeHumidity));

      const totalRain = sum(rains);
      const totalSnowfall = sum(snowfalls);
      const avgWindSpeed = avg(winds);
      const avgTemp = avg(temps);

      const date = new Date(dateStr + "T12:00:00");
      const { icon, condition } = getCondition(
        totalRain,
        totalSnowfall,
        avgWindSpeed,
        avgTemp,
      );

      return {
        date,
        dateLabel: `${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`,
        dayLabel: dateStr === todayStr ? "Today" : DAY_NAMES[date.getDay()],
        isToday: dateStr === todayStr,
        minTemp: Math.min(...temps),
        maxTemp: Math.max(...temps),
        avgTemp,
        totalRain,
        avgWindSpeed,
        totalSnowfall,
        avgSnowDepth: avg(snowDepths),
        avgHumidity: avg(humidities),
        weatherIcon: icon,
        condition,
      };
    });
}

function scoreSkiing(days: DayForecast[]): number {
  return avg(
    days.map((d) => {
      let s = 20;
      if (d.avgTemp < -8) s += 40;
      else if (d.avgTemp < -3) s += 30;
      else if (d.avgTemp < 0) s += 20;
      else if (d.avgTemp < 5) s += 5;
      else s -= 30;
      s += Math.min(d.totalSnowfall * 5, 35);
      s += Math.min(d.avgSnowDepth * 15, 15);
      s -= Math.min(d.totalRain * 6, 25);
      return clamp(s, 0, 100);
    }),
  );
}

function scoreSurfing(days: DayForecast[]): number {
  return avg(
    days.map((d) => {
      let s = 20;
      if (d.avgTemp >= 22 && d.avgTemp <= 30) s += 35;
      else if (d.avgTemp >= 16) s += 22;
      else if (d.avgTemp >= 10) s += 10;
      if (d.avgWindSpeed >= 15 && d.avgWindSpeed <= 35) s += 32;
      else if (d.avgWindSpeed >= 10) s += 18;
      else if (d.avgWindSpeed > 45) s -= 15;
      if (d.totalSnowfall === 0) s += 8;
      s -= Math.min(d.totalRain * 2, 18);
      return clamp(s, 0, 100);
    }),
  );
}

function scoreOutdoor(days: DayForecast[]): number {
  return avg(
    days.map((d) => {
      let s = 45;
      if (d.avgTemp >= 15 && d.avgTemp <= 25) s += 38;
      else if (d.avgTemp >= 10 && d.avgTemp < 15) s += 22;
      else if (d.avgTemp > 25 && d.avgTemp <= 32) s += 18;
      else if (d.avgTemp < 3 || d.avgTemp > 35) s -= 30;
      s -= Math.min(d.totalRain * 9, 55);
      if (d.avgWindSpeed > 35) s -= 25;
      else if (d.avgWindSpeed > 25) s -= 12;
      if (d.totalSnowfall > 0) s -= 15;
      return clamp(s, 0, 100);
    }),
  );
}

function scoreIndoor(days: DayForecast[]): number {
  const outdoor = scoreOutdoor(days);
  return clamp(92 - outdoor * 0.32, 52, 92);
}

function skiDesc(days: DayForecast[]): string {
  const snow = avg(days.map((d) => d.totalSnowfall));
  const temp = avg(days.map((d) => d.avgTemp));
  if (snow > 3 && temp < -2) return "Excellent powder conditions";
  if (snow > 1 && temp < 2) return "Good snow expected";
  if (temp < 0) return "Cold but limited snowfall";
  return "Poor skiing conditions";
}

function surfDesc(days: DayForecast[]): string {
  const wind = avg(days.map((d) => d.avgWindSpeed));
  const temp = avg(days.map((d) => d.avgTemp));
  if (wind >= 15 && wind <= 35 && temp >= 18) return "Great surf conditions";
  if (wind >= 10 && temp >= 12) return "Moderate surf expected";
  if (temp < 10) return "Too cold for surfing";
  return "Light surf, check local reports";
}

function outdoorDesc(days: DayForecast[]): string {
  const rain = avg(days.map((d) => d.totalRain));
  const temp = avg(days.map((d) => d.avgTemp));
  if (rain < 1 && temp >= 15 && temp <= 26) return "Perfect outdoor weather";
  if (rain < 3 && temp >= 10) return "Mostly pleasant conditions";
  if (rain > 6) return "Expect frequent showers";
  return "Mixed conditions ahead";
}

function indoorDesc(days: DayForecast[]): string {
  const rain = avg(days.map((d) => d.totalRain));
  const temp = avg(days.map((d) => d.avgTemp));
  if (rain > 5) return "Perfect time to explore indoors";
  if (temp < 2 || temp > 35) return "Ideal escape from extreme weather";
  return "Always a wonderful option";
}

export function rankActivities(days: DayForecast[]): ActivityScore[] {
  const raw = [
    {
      name: "Skiing" as const,
      emoji: "🎿",
      score: Math.round(scoreSkiing(days)),
      description: skiDesc(days),
      gradient: "from-sky-400 to-blue-600",
      bgGradient: "from-sky-950/60 to-blue-950/60",
    },
    {
      name: "Surfing" as const,
      emoji: "🏄",
      score: Math.round(scoreSurfing(days)),
      description: surfDesc(days),
      gradient: "from-teal-400 to-emerald-600",
      bgGradient: "from-teal-950/60 to-emerald-950/60",
    },
    {
      name: "Outdoor Sightseeing" as const,
      emoji: "🗺️",
      score: Math.round(scoreOutdoor(days)),
      description: outdoorDesc(days),
      gradient: "from-amber-400 to-orange-600",
      bgGradient: "from-amber-950/60 to-orange-950/60",
    },
    {
      name: "Indoor Sightseeing" as const,
      emoji: "🏛️",
      score: Math.round(scoreIndoor(days)),
      description: indoorDesc(days),
      gradient: "from-violet-400 to-purple-600",
      bgGradient: "from-violet-950/60 to-purple-950/60",
    },
  ];

  return raw
    .sort((a, b) => b.score - a.score)
    .map((a, i) => ({ ...a, rank: i + 1 }));
}
