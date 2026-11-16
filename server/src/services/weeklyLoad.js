// Business logic: groups sessions into weeks (Monday-Sunday) and totals their load.
const { DurationEffortStrategy } = require('./loadStrategies');

// Converts a timestamp to the athlete's local YYYY-MM-DD.
// tzOffsetMinutes follows JavaScript's Date.getTimezoneOffset() (e.g. 480 for UTC-8).
function toDateString(date, tzOffsetMinutes = 0) {
  const shifted = new Date(new Date(date).getTime() - tzOffsetMinutes * 60000);
  return shifted.toISOString().slice(0, 10);
}

function addDays(dateStr, days) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// Weeks start on Monday.
function startOfWeek(dateStr) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  const daysSinceMonday = (d.getUTCDay() + 6) % 7;
  return addDays(dateStr, -daysSinceMonday);
}

function calculateWeeklyLoad(
  sessions,
  { today, tzOffsetMinutes = 0, strategy = new DurationEffortStrategy() } = {}
) {
  const todayStr = today || toDateString(new Date(), tzOffsetMinutes);
  const thisWeekStart = startOfWeek(todayStr);
  const lastWeekStart = addDays(thisWeekStart, -7);
  const nextWeekStart = addDays(thisWeekStart, 7);

  let thisWeek = 0;
  let lastWeek = 0;

  for (const session of sessions) {
    const day = toDateString(session.performedAt, tzOffsetMinutes);
    const load = strategy.calculate(session);

    if (day >= thisWeekStart && day < nextWeekStart) {
      thisWeek += load;
    } else if (day >= lastWeekStart && day < thisWeekStart) {
      lastWeek += load;
    }
  }

  return { thisWeek, lastWeek, thisWeekStart, lastWeekStart };
}

module.exports = { calculateWeeklyLoad, startOfWeek, addDays, toDateString };
