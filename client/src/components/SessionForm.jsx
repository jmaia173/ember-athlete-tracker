import { useState } from 'react';

const TYPES = ['practice', 'game', 'lifting', 'conditioning', 'other'];
const EMPTY = { type: 'practice', durationMinutes: '', effort: '' };

export default function SessionForm({ onCreate }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const effort = Number(form.effort);
    const duration = Number(form.durationMinutes);
    if (!form.durationMinutes || !form.effort) {
      setError('Duration and effort are required');
      return;
    }
    if (!Number.isInteger(effort) || effort < 1 || effort > 10) {
      setError('Effort must be a whole number between 1 and 10');
      return;
    }
    if (!Number.isInteger(duration) || duration < 1 || duration > 600) {
      setError('Duration must be between 1 and 600 minutes');
      return;
    }

    setSubmitting(true);
    try {
      await onCreate(form);
      setForm(EMPTY);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Log a session</h2>
      {error && <p className="error" role="alert">{error}</p>}
      <label>
        Type
        <select name="type" value={form.type} onChange={handleChange}>
          {TYPES.map((t) => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
      </label>
      <label>
        Duration (minutes)
        <input type="number" name="durationMinutes" min="1" max="600" value={form.durationMinutes} onChange={handleChange} />
      </label>
      <label>
        Effort (1-10)
        <input type="number" name="effort" min="1" max="10" value={form.effort} onChange={handleChange} />
      </label>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : 'Save session'}
      </button>
    </form>
  );
}
