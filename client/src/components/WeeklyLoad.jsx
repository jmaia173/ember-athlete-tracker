import { useEffect, useState } from 'react';
import { loadApi } from '../services/api';
import { localToday } from '../utils/date';

export default function WeeklyLoad({ refreshKey }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  // Re-fetch whenever refreshKey changes (e.g. after a new session is saved).
  useEffect(() => {
    loadApi
      .weekly({ today: localToday(), tzOffset: new Date().getTimezoneOffset() })
      .then(setData)
      .catch((err) => setError(err.message));
  }, [refreshKey]);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <section className="card"><p className="muted">Loading weekly load...</p></section>;

  return (
    <section className="card">
      <h2>Weekly load</h2>
      <div className="stat-row">
        <div className="stat">
          <span className="stat-value">{data.thisWeek}</span>
          <span className="muted">This week</span>
        </div>
        <div className="stat">
          <span className="stat-value">{data.lastWeek}</span>
          <span className="muted">Last week</span>
        </div>
      </div>
      <p className="muted">Load = duration (min) × effort (1-10), summed Monday to Sunday.</p>
    </section>
  );
}
