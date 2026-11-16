const { validateSession } = require('../src/services/sessionValidation');

describe('validateSession', () => {
  const valid = { type: 'practice', durationMinutes: 60, effort: 7 };

  test('accepts a valid session', () => {
    expect(validateSession(valid)).toBeNull();
  });

  test('accepts numeric strings from form input', () => {
    expect(validateSession({ type: 'game', durationMinutes: '90', effort: '8' })).toBeNull();
  });

  test.each([0, 11, -1, 5.5, 'abc', undefined, ''])('rejects effort %p', (effort) => {
    expect(validateSession({ ...valid, effort })).toMatch(/Effort/);
  });

  test.each([0, 601, -5, 30.5, 'abc', undefined, ''])('rejects duration %p', (durationMinutes) => {
    expect(validateSession({ ...valid, durationMinutes })).toMatch(/Duration/);
  });

  test('rejects an unknown or missing type', () => {
    expect(validateSession({ ...valid, type: 'napping' })).toMatch(/Type/);
    expect(validateSession({ ...valid, type: undefined })).toMatch(/Type/);
  });

  test('rejects an empty body', () => {
    expect(validateSession()).toMatch(/Type/);
  });
});
