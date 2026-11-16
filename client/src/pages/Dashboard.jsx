import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <main className="page">
      <header className="topbar">
        <h1 className="brand">Ember</h1>
        <button className="secondary" onClick={logout}>Log out</button>
      </header>
      <section className="card">
        <h2>Welcome, {user.name}</h2>
        <p className="muted">Your training dashboard will appear here.</p>
      </section>
    </main>
  );
}
