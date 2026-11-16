import { useEffect, useState } from 'react';
import { checkInsApi } from '../services/api';

// Today's date in the athlete's local timezone (YYYY-MM-DD).
const localToday = () => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

const EMPTY = { sleepHours: '', soreness: '', energy: '' };

export default function CheckInForm() {
  const [form, setForm] = useState(EMPTY);
  const [hasToday, setHasToday] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Prefill with today's check-in if the athlete already submitted one.
  useEffect(() => {
    checkInsApi
      .list()
      .then(({ checkIns }) => {
        const today = checkIns.find((c) => c.date === localToday());
        if (today) {
          setForm({ sleepHours: today.sleepHours, soreness: today.soreness, energy: today.energy });
          setHasToday(true);
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const sleep = Number(form.sleepHours);
    if (form.sleepHours === '' || Number.isNaN(sleep) || sleep < 0 || sleep > 24) {
      setError('Sleep must be between 0 and 24 hours');
      return;
    }
    for (const field of ['soreness', 'energy']) {
      const n = Number(form[field]);
      if (form[field] === '' || !Number.isInteger(n) || n < 1 || n > 10) {
        setError(`${field.charAt(0).toUpperCase() + field.slice(1)} must be a whole number between 1 and 10`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const { updated } = await checkInsApi.save({ ...form, date: localToday() });
      setHasToday(true);
      setMessage(updated ? 'Today\'s check-in updated.' : 'Check-in saved.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Daily check-in</h2>
      {hasToday && !message && <p className="muted">You already checked in today. Saving will update it.</p>}
      {message && <p className="success" role="status">{message}</p>}
      {error && <p className="error" role="alert">{error}</p>}
      <label>
        Sleep (hours)
        <input type="number" name="sleepHours" min="0" max="24" step="0.5" value={form.sleepHours} onChange={handleChange} />
      </label>
      <label>
        Soreness (1 = none, 10 = severe)
        <input type="number" name="soreness" min="1" max="10" value={form.soreness} onChange={handleChange} />
      </label>
      <label>
        Energy (1 = drained, 10 = great)
        <input type="number" name="energy" min="1" max="10" value={form.energy} onChange={handleChange} />
      </label>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : hasToday ? 'Update check-in' : 'Save check-in'}
      </button>
    </form>
  );
}
