import type { DayForecast } from "@/types/weather";
import { Droplets, Snowflake, Wind } from "lucide-react";

interface WeatherForecastProps {
  days: DayForecast[];
}

export function WeatherForecast({ days }: WeatherForecastProps) {
  const today = days[0];

  return (
    <div className="w-full space-y-6">
      {/* Today highlight */}
      <div
        className="
        relative overflow-hidden rounded-3xl border border-white/10
        bg-gradient-to-br from-sky-950/70 to-slate-900/70 backdrop-blur-sm p-6
      "
      >
        <div className="absolute bg-gradient-to-br from-sky-500/5 to-transparent pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex items-center gap-5">
            <span className="text-7xl leading-none">{today.weatherIcon}</span>
            <div>
              <p className="text-sky-300 text-sm font-medium uppercase tracking-widest mb-1">
                Today
              </p>
              <p className="text-white text-5xl font-light">
                {Math.round(today.avgTemp)}°
                <span className="text-white/40 text-2xl">C</span>
              </p>
              <p className="text-white/60 mt-1">{today.condition}</p>
            </div>
          </div>

          <div className="sm:ml-auto grid grid-cols-3 gap-4">
            <Stat
              icon={<Droplets className="w-4 h-4" />}
              label="Rain"
              value={`${today.totalRain.toFixed(1)} mm`}
              color="text-blue-300"
            />
            <Stat
              icon={<Wind className="w-4 h-4" />}
              label="Wind"
              value={`${Math.round(today.avgWindSpeed)} km/h`}
              color="text-teal-300"
            />
            <Stat
              icon={<Snowflake className="w-4 h-4" />}
              label="Snow"
              value={`${today.totalSnowfall.toFixed(1)} cm`}
              color="text-indigo-300"
            />
          </div>
        </div>
      </div>

      {/* 7-day grid */}
      <div>
        <h2 className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3 px-1">
          7-Day Forecast
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {days.map((day) => (
            <DayCard key={day.dateLabel} day={day} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DayCard({ day }: { day: DayForecast }) {
  return (
    <div
      className={`
      rounded-2xl border p-3 text-center flex flex-col items-center gap-2
      transition-all duration-200 hover:scale-105 hover:border-white/20
      ${
        day.isToday
          ? "bg-sky-500/15 border-sky-400/30"
          : "bg-white/4 border-white/8 hover:bg-white/8"
      }
    `}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-wider ${
          day.isToday ? "text-sky-300" : "text-white/50"
        }`}
      >
        {day.dayLabel}
      </p>
      <p className="text-white/30 text-xs">{day.dateLabel}</p>
      <span className="text-3xl leading-none my-1">{day.weatherIcon}</span>
      <p className="text-white/60 text-xs">{day.condition}</p>
      <div className="flex items-center gap-1.5 mt-1">
        <span className="text-white font-semibold text-sm">
          {Math.round(day.maxTemp)}°
        </span>
        <span className="text-white/35 text-sm">
          {Math.round(day.minTemp)}°
        </span>
      </div>
      {day.totalRain > 0.5 && (
        <div className="flex items-center gap-1 text-blue-300/70 text-xs">
          <Droplets className="w-3 h-3" />
          {day.totalRain.toFixed(1)}mm
        </div>
      )}
      {day.totalSnowfall > 0.5 && (
        <div className="flex items-center gap-1 text-indigo-300/70 text-xs">
          <Snowflake className="w-3 h-3" />
          {day.totalSnowfall.toFixed(1)}cm
        </div>
      )}
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`${color} opacity-70`}>{icon}</div>
      <p className="text-white/40 text-xs">{label}</p>
      <p className="text-white text-sm font-medium">{value}</p>
    </div>
  );
}
