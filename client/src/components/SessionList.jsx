export default function SessionList({ sessions }) {
  if (sessions.length === 0) {
    return (
      <section className="card">
        <h2>Your sessions</h2>
        <p className="muted">No sessions yet. Log your first one above.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>Your sessions</h2>
      <ul className="session-list">
        {sessions.map((s) => (
          <li key={s.id}>
            <div>
              <strong>{s.type.charAt(0).toUpperCase() + s.type.slice(1)}</strong>
              <span className="muted"> · {new Date(s.performedAt).toLocaleDateString()}</span>
            </div>
            <div className="muted">{s.durationMinutes} min · effort {s.effort}/10</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
