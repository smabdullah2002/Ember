import { format, subDays } from "date-fns";

const MOOD_COLORS = {
  none: "bg-gray-200",
  negative: "bg-red-300",
  neutral: "bg-yellow-300",
  positive: "bg-green-400",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const NEGATIVE_MOODS = new Set(["angry", "sad", "anxious"]);
const NEUTRAL_MOODS = new Set(["surprised", "calm"]);

function getMoodBucket(moodId) {
  if (!moodId) return "none";
  if (NEGATIVE_MOODS.has(moodId)) return "negative";
  if (NEUTRAL_MOODS.has(moodId)) return "neutral";
  return "positive";
}

function buildMoodByDate(entries = []) {
  const sorted = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
  const result = {};

  sorted.forEach((entry) => {
    if (!entry?.date) return;
    const key = format(new Date(entry.date), "yyyy-MM-dd");
    result[key] = getMoodBucket(entry.moodId);
  });

  return result;
}

export default function MoodHeatmap({ entries = [], daysToShow = 30 }) {
  const today = new Date();
  const days = Array.from({ length: daysToShow }, (_, i) =>
    subDays(today, daysToShow - 1 - i)
  );

  const moodByDate = buildMoodByDate(entries);
  const filledDays = days.filter((day) => moodByDate[format(day, "yyyy-MM-dd")]).length;
  const completionPct = days.length ? Math.round((filledDays / days.length) * 100) : 0;

  // group days into weeks
  const weeks = [];
  let week = [];

  days.forEach((day) => {
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
    week.push(day);
  });
  if (week.length) weeks.push(week);

  return (
    <div className="rounded-2xl border border-purple-200/50 bg-white p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 text-purple-600 font-semibold">
        📅 Mood Calendar (Past {daysToShow} Days)
      </div>

      <div className="flex gap-3">
        {/* Weekday labels */}
        <div className="flex flex-col gap-2 text-xs text-gray-500">
          {DAYS.map((d, i) => (
            <div key={i} className="h-4 flex items-center">
              {i % 2 === 1 && d}
            </div>
          ))}
        </div>

        {/* Heatmap */}
        <div className="flex gap-2">
          {weeks.map((week, w) => (
            <div key={w} className="flex flex-col gap-2">
              {week.map((day, i) => {
                const key = format(day, "yyyy-MM-dd");
                const mood = moodByDate[key] || "none";

                return (
                  <div
                    key={i}
                    title={`${format(day, "dd MMM")} • ${mood}`}
                    className={`w-4 h-4 rounded-sm ${MOOD_COLORS[mood]}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
        Less
        <span className="w-3 h-3 bg-gray-200 rounded-sm" />
        <span className="w-3 h-3 bg-red-300 rounded-sm" />
        <span className="w-3 h-3 bg-yellow-300 rounded-sm" />
        <span className="w-3 h-3 bg-green-400 rounded-sm" />
        More
      </div>

      {/* Footer */}
      <div className="mt-3 text-center text-xs text-gray-400">
        Track your daily mood patterns · Each square represents a day
      </div>

      <div className="mt-2 text-center text-xs text-purple-600 font-medium">
        Logged on {filledDays}/{days.length} days ({completionPct}%)
      </div>

      {/* Scale */}
      <div className="mt-4 rounded-xl bg-gray-50 p-3 text-xs text-gray-600 flex justify-center gap-4">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-gray-200 rounded-sm" /> No Entry
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-red-300 rounded-sm" /> Negative
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-yellow-300 rounded-sm" /> Neutral
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-green-400 rounded-sm" /> Positive
        </span>
      </div>
    </div>
  );
}
