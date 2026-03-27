import { ActivityRanking } from "@/components/ActivityRanking";
import { SearchBar } from "@/components/SearchBar";
import { WeatherForecast } from "@/components/WeatherForecast";
import { getWeather } from "@/lib/graphql";
import { groupByDay, rankActivities } from "@/lib/weather";
import type { ActivityScore, City, DayForecast } from "@/types/weather";
import { AlertCircle, CloudSun, Loader2, MapPin } from "lucide-react";
import { useState } from "react";

export default function App() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [days, setDays] = useState<DayForecast[]>([]);
  const [activities, setActivities] = useState<ActivityScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCitySelect(city: City) {
    if (!city) {
      setSelectedCity(null);
      setDays([]);
      setActivities([]);
      setError(null);
      return;
    }

    setSelectedCity(city);
    setLoading(true);
    setError(null);

    try {
      const weather = await getWeather(city.latitude, city.longitude);
      const grouped = groupByDay(weather.weather);
      const ranked = rankActivities(grouped, city);
      setDays(grouped);
      setActivities(ranked);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load weather data",
      );
    } finally {
      setLoading(false);
    }
  }

  const hasResults = days.length > 0 && !loading;

  return (
    <div className="min-h-screen bg-[#070b14] text-white relative overflow-x-hidden">
      <div className="fixed pointer-events-none select-none">
        {STARS.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: s.size,
              height: s.size,
              top: s.top,
              left: s.left,
              opacity: s.opacity,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 pb-20">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CloudSun className="w-8 h-8 text-sky-400" />
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-sky-300 via-white to-indigo-300 bg-clip-text text-transparent">
              WeatherRank
            </h1>
          </div>
        </header>

        <div className="mb-10">
          <SearchBar onSelect={handleCitySelect} selectedCity={selectedCity} />
        </div>

        {selectedCity && (
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-4 h-4 text-sky-400" />
            <span className="text-white font-semibold">
              {selectedCity.name}
            </span>
            <span className="text-white/40">
              {[selectedCity.state, selectedCity.country]
                .filter(Boolean)
                .join(", ")}
            </span>
            <span className="ml-auto text-white/25 text-xs tabular-nums">
              {selectedCity.latitude.toFixed(2)}°N,{" "}
              {selectedCity.longitude.toFixed(2)}°E
            </span>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
            <p className="text-white/40 text-sm">Loading forecast…</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-950/30 px-5 py-4 text-red-300">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {hasResults && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <WeatherForecast days={days} />
            <ActivityRanking activities={activities} />
          </div>
        )}

        {!selectedCity && !loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <span className="text-5xl mb-2">🌍</span>
            <p className="text-white/50 font-medium">
              Search for a city to get started
            </p>
            <p className="text-white/25 text-sm max-w-xs">
              We'll show you the 7-day forecast and rank the best activities for
              your trip
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const STARS = Array.from({ length: 60 }, (_, i) => ({
  size: i % 5 === 0 ? "2px" : "1px",
  top: `${((i * 137.508) % 100).toFixed(2)}%`,
  left: `${((i * 97.631) % 100).toFixed(2)}%`,
  opacity: 0.1 + (i % 4) * 0.08,
  delay: (i % 7) * 0.8,
  duration: 2 + (i % 5),
}));
