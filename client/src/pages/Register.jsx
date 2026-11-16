import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'athlete' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setSubmitting(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <h1 className="brand">Ember</h1>
      <form className="card" onSubmit={handleSubmit}>
        <h2>Create account</h2>
        {error && <p className="error" role="alert">{error}</p>}
        <label>
          Name
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password (min 8 characters)
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        <label>
          I am a
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="athlete">Athlete</option>
            <option value="coach">Coach</option>
          </select>
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating...' : 'Register'}
        </button>
        <p className="muted">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </main>
  );
}
