const { validateCheckIn } = require('../src/services/checkinValidation');

describe('validateCheckIn', () => {
  const valid = { sleepHours: 7.5, soreness: 4, energy: 6 };

  test('accepts a valid check-in', () => {
    expect(validateCheckIn(valid)).toBeNull();
  });

  test('accepts a valid date', () => {
    expect(validateCheckIn({ ...valid, date: '2026-11-16' })).toBeNull();
  });

  test('accepts boundary values', () => {
    expect(validateCheckIn({ sleepHours: 0, soreness: 1, energy: 10 })).toBeNull();
    expect(validateCheckIn({ sleepHours: 24, soreness: 10, energy: 1 })).toBeNull();
  });

  test.each([-1, 25, 'abc', undefined, ''])('rejects sleep %p', (sleepHours) => {
    expect(validateCheckIn({ ...valid, sleepHours })).toMatch(/Sleep/);
  });

  test.each([0, 11, 3.5, undefined, ''])('rejects soreness %p', (soreness) => {
    expect(validateCheckIn({ ...valid, soreness })).toMatch(/Soreness/);
  });

  test.each([0, 11, 3.5, undefined, ''])('rejects energy %p', (energy) => {
    expect(validateCheckIn({ ...valid, energy })).toMatch(/Energy/);
  });

  test('rejects a badly formatted date', () => {
    expect(validateCheckIn({ ...valid, date: '11/16/2026' })).toMatch(/Date/);
  });
});
