import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { sessionsApi } from '../services/api';
import CheckInForm from '../components/CheckInForm';
import SessionForm from '../components/SessionForm';
import SessionList from '../components/SessionList';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (user.role !== 'athlete') return;
    sessionsApi
      .list()
      .then(({ sessions: list }) => setSessions(list))
      .catch((err) => setLoadError(err.message));
  }, [user.role]);

  // New session appears in the list immediately after saving.
  const handleCreate = async (payload) => {
    const { session } = await sessionsApi.create(payload);
    setSessions((prev) => [session, ...prev]);
  };

  return (
    <main className="page">
      <header className="topbar">
        <h1 className="brand">Ember</h1>
        <button className="secondary" onClick={logout}>Log out</button>
      </header>

      <section className="card">
        <h2>Welcome, {user.name}</h2>
        {user.role !== 'athlete' && (
          <p className="muted">The coach dashboard is coming in a later sprint.</p>
        )}
      </section>

      {user.role === 'athlete' && (
        <div className="stack">
          <CheckInForm />
          <SessionForm onCreate={handleCreate} />
          {loadError && <p className="error">{loadError}</p>}
          <SessionList sessions={sessions} />
        </div>
      )}
    </main>
  );
}
