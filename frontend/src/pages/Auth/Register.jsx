import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, isLoading, error, clearError } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '', displayName: '' });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  useEffect(() => () => clearError(), []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (fieldErrors[e.target.name]) setFieldErrors((fe) => ({ ...fe, [e.target.name]: null }));
    if (error) clearError();
  };

  const validate = () => {
    const errs = {};
    if (form.username.length < 3) errs.username = 'Must be at least 3 characters';
    if (!/^[a-zA-Z0-9]+$/.test(form.username)) errs.username = 'Only letters and numbers';
    if (form.password.length < 8) errs.password = 'Must be at least 8 characters';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await register(form);
    if (!result.error) navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-display font-bold text-4xl text-brand-500 tracking-tight">pulse</h1>
          <p className="text-zinc-500 text-sm mt-2">Join the conversation</p>
        </div>

        <div className="card p-8">
          <h2 className="font-display font-bold text-xl text-zinc-100 mb-6">Create account</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-5 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Display name"
              type="text"
              name="displayName"
              value={form.displayName}
              onChange={handleChange}
              placeholder="Your name"
              maxLength={50}
            />
            <Input
              label="Username"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="yourhandle"
              error={fieldErrors.username}
              maxLength={30}
              required
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min 8 characters"
              error={fieldErrors.password}
              autoComplete="new-password"
              required
            />
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={!form.username || !form.email || !form.password}
              className="w-full mt-2"
              size="lg"
            >
              Create account
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;