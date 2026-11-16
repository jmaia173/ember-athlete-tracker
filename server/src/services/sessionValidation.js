// Business logic: validates a training session before it is saved.
const SESSION_TYPES = ['practice', 'game', 'lifting', 'conditioning', 'other'];

function validateSession({ type, durationMinutes, effort } = {}) {
  if (!type || !SESSION_TYPES.includes(type)) {
    return `Type must be one of: ${SESSION_TYPES.join(', ')}`;
  }
  const duration = Number(durationMinutes);
  if (durationMinutes === undefined || durationMinutes === '' || !Number.isInteger(duration) || duration < 1 || duration > 600) {
    return 'Duration must be a whole number of minutes between 1 and 600';
  }
  const effortValue = Number(effort);
  if (effort === undefined || effort === '' || !Number.isInteger(effortValue) || effortValue < 1 || effortValue > 10) {
    return 'Effort must be a whole number between 1 and 10';
  }
  return null;
}

module.exports = { validateSession, SESSION_TYPES };
