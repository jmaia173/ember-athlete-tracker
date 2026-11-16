// Business logic: validates a daily check-in before it is saved.
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isWholeNumberInRange(value, min, max) {
  if (value === undefined || value === null || value === '') return false;
  const n = Number(value);
  return Number.isInteger(n) && n >= min && n <= max;
}

function validateCheckIn({ date, sleepHours, soreness, energy } = {}) {
  if (date !== undefined && !DATE_REGEX.test(date)) {
    return 'Date must be in YYYY-MM-DD format';
  }
  const sleep = Number(sleepHours);
  if (sleepHours === undefined || sleepHours === null || sleepHours === '' || Number.isNaN(sleep) || sleep < 0 || sleep > 24) {
    return 'Sleep must be between 0 and 24 hours';
  }
  if (!isWholeNumberInRange(soreness, 1, 10)) {
    return 'Soreness must be a whole number between 1 and 10';
  }
  if (!isWholeNumberInRange(energy, 1, 10)) {
    return 'Energy must be a whole number between 1 and 10';
  }
  return null;
}

module.exports = { validateCheckIn };
