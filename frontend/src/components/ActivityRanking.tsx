import type { ActivityScore } from '@/types/weather';

const MEDALS = ['🥇', '🥈', '🥉', '4️⃣'];

interface ActivityRankingProps {
  activities: ActivityScore[];
}

export function ActivityRanking({ activities }: ActivityRankingProps) {
  return (
    <div className="w-full space-y-3">
      <h2 className="text-white/50 text-xs font-semibold uppercase tracking-widest px-1">
        Activity Rankings · Next 7 Days
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {activities.map((activity) => (
          <ActivityCard key={activity.name} activity={activity} />
        ))}
      </div>
    </div>
  );
}

function ActivityCard({ activity }: { activity: ActivityScore }) {
  const scoreColor =
    activity.score >= 75
      ? 'text-emerald-400'
      : activity.score >= 50
        ? 'text-amber-400'
        : activity.score >= 25
          ? 'text-orange-400'
          : 'text-red-400';

  const scoreLabel =
    activity.score >= 75
      ? 'Excellent'
      : activity.score >= 55
        ? 'Good'
        : activity.score >= 35
          ? 'Fair'
          : 'Poor';

  return (
    <div className={`
      relative overflow-hidden rounded-2xl border border-white/10
      bg-gradient-to-br ${activity.bgGradient} backdrop-blur-sm
      p-5 flex flex-col gap-4
      transition-all duration-300 hover:border-white/20 hover:scale-[1.02]
    `}>
      {/* Subtle gradient overlay */}
      <div className={`
        absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10
        bg-gradient-to-br ${activity.gradient}
        pointer-events-none
      `} />

      {/* Header */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{MEDALS[activity.rank - 1]}</span>
          <div>
            <p className="text-white font-semibold leading-tight">{activity.name}</p>
            <p className="text-white/45 text-xs mt-0.5">{activity.description}</p>
          </div>
        </div>
        <span className="text-3xl">{activity.emoji}</span>
      </div>

      {/* Score bar */}
      <div className="relative space-y-1.5">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium ${scoreColor}`}>{scoreLabel}</span>
          <span className={`text-lg font-bold tabular-nums ${scoreColor}`}>
            {activity.score}
            <span className="text-sm font-normal opacity-60">/100</span>
          </span>
        </div>
        <div className="h-2 bg-white/8 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${activity.gradient} transition-all duration-700`}
            style={{ width: `${activity.score}%` }}
          />
        </div>
      </div>
    </div>
  );
}
