import type {
  ActivityScore,
  City,
  DayForecast,
  WeatherUnit,
} from "../types/weather";

const avg = (arr: number[]) =>
  arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

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

export function rankActivities(
  days: DayForecast[],
  city: City,
): ActivityScore[] {
  const avgTemp = avg(days.map((d) => d.avgTemp));
  const totalRain = sum(days.map((d) => d.totalRain));
  const totalSnow = sum(days.map((d) => d.totalSnowfall));

  const isCoastal = city.elevation <= 30;

  const scores = [
    {
      name: "Skiing" as const,
      emoji: "🎿",
      score: totalSnow > 5 ? 90 : totalSnow > 0 ? 60 : 0,
      description: totalSnow > 0 ? "Good snow conditions" : "No snow forecast",
      gradient: "from-sky-400 to-blue-600",
      bgGradient: "from-sky-950/60 to-blue-950/60",
    },
    {
      name: "Surfing" as const,
      emoji: "🏄",
      score:
        isCoastal && avgTemp > 18 && totalRain < 5
          ? 85
          : isCoastal && avgTemp > 15
            ? 60
            : 0,
      description: isCoastal
        ? "Coastal city with warm water"
        : "Not a coastal city",
      gradient: "from-teal-400 to-emerald-600",
      bgGradient: "from-teal-950/60 to-emerald-950/60",
    },
    {
      name: "Outdoor Sightseeing" as const,
      emoji: "🗺️",
      score: totalRain < 2 && avgTemp > 10 ? 95 : 50,
      description: totalRain < 2 ? "Perfect for walking" : "Better stay dry",
      gradient: "from-amber-400 to-orange-600",
      bgGradient: "from-amber-950/60 to-orange-950/60",
    },
    {
      name: "Indoor Sightseeing" as const,
      emoji: "🏛️",
      score: totalRain > 10 || avgTemp < 5 ? 90 : 50,
      description: "Always a great choice",
      gradient: "from-violet-400 to-purple-600",
      bgGradient: "from-violet-950/60 to-purple-950/60",
    },
  ];

  return scores
    .sort((a, b) => b.score - a.score)
    .map((s, i) => ({ ...s, rank: i + 1 }));
}
