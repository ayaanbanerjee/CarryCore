import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import api from '../api/axios';
import { Alert } from '../components/ui';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('error');
  const [loading, setLoading] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setZoomed(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      const { user } = res.data;
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user.id);
      localStorage.setItem('role', res.data.user.role);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userName', user.name || user.email);

      setMsgType('success');
      setMsg('Welcome back! Redirecting…');

      setTimeout(() => {
        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }, 700);
    }
    catch (error) {
      setMsgType('error');
      setMsg(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const bgScale = zoomed ? 'scale(1)' : 'scale(1.15)';

  return (
    <div className="relative flex items-center justify-center min-h-[calc(100vh-4rem)] overflow-hidden">

      {/* Background with zoom effect */}
      <div
        className="absolute inset-0 transition-transform duration-[1500ms] ease-in-out"
        style={{
          backgroundImage: `url('/src/images/signup background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: bgScale,
        }}
      />

      {/* Dark overlay tinted toward forest for brand consistency */}
      <div className="absolute inset-0 bg-forest-900/55" />

      {/* Glassmorphism Card */}
      <div
        className="relative z-10 w-full max-w-sm mx-4 my-12 p-8 rounded-2xl border border-white/20 shadow-2xl"
        style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        <p className="text-center text-brass-300 text-xs font-semibold uppercase tracking-[0.2em] mb-2">Packverse</p>
        <h2 className="font-display text-3xl font-bold mb-2 text-center text-white">Welcome Back</h2>
        <p className="text-center text-white/70 text-sm mb-6">Login to your account</p>

        {msg && (
          <Alert tone={msgType === 'success' ? 'success' : 'error'} className="mb-4 !bg-white/15 !text-white !border-white/25">
            {msg}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-brass-300 text-sm"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-brass-300 text-sm"
            required
          />
          <Link to="/forgot-password" className="text-white/70 text-[13px] text-end hover:text-brass-300 transition-colors">
            Forgot Password?
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brass-500 hover:bg-brass-600 active:bg-brass-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-brass-900/30 mt-1 cursor-pointer"
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <p className="text-center text-white/60 text-sm mt-5">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-brass-300 font-semibold hover:text-brass-200 hover:underline transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
