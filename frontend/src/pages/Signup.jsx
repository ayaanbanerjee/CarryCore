import { useState, useEffect } from 'react'
import api from '../api/axios'
import { Link, useNavigate } from 'react-router'
import { Alert } from '../components/ui';
import signupBg from '../images/signup background.jpg';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('error');
  const [loading, setLoading] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [zoomOut, setZoomOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setZoomed(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/signup', form);
      setMsgType('success');
      setMsg(response.data.message || 'Account created successfully!');
      setZoomOut(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setMsgType('error');
      setMsg(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  const bgScale = zoomOut ? 'scale(1.15)' : zoomed ? 'scale(1.15)' : 'scale(1)';

  return (
    <div className="relative flex items-center justify-center min-h-[calc(100vh-4rem)] overflow-hidden">

      {/* Background with zoom effect */}
      <div
        className="absolute inset-0 transition-transform duration-[1500ms] ease-in-out"
        style={{
          backgroundImage: `url(${signupBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: bgScale,
        }}
      />

      {/* Dark overlay tinted toward forest for brand consistency */}
      <div className="absolute inset-0 bg-forest-900/60" />

      {/* Glassmorphism Card */}
      <div
        className="relative z-10 w-full max-w-sm p-8 rounded-2xl border border-white/20 shadow-2xl mx-4 my-12"
        style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        <p className="text-center text-brass-300 text-xs font-semibold uppercase tracking-[0.2em] mb-2">CarryCore</p>
        <h2 className="font-display text-3xl font-bold mb-6 text-center text-white">Create Account</h2>

        {msg && (
          <Alert tone={msgType === 'success' ? 'success' : 'error'} className="mb-4 !bg-white/15 !text-white !border-white/25">
            {msg}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            placeholder="Full Name"
            value={form.name}
            name="name"
            type="text"
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-brass-300 text-sm"
            required
          />
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
            placeholder="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-brass-300 text-sm"
            required
          />

          <p className="text-white/50 text-xs px-1">
            By signing up, you agree to our{' '}
            <span className="text-white/80 underline cursor-pointer">Terms</span> and{' '}
            <span className="text-white/80 underline cursor-pointer">Privacy Policy</span>.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brass-500 hover:bg-brass-600 active:bg-brass-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-brass-900/30 mt-1 cursor-pointer"
          >
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-white/60 text-sm mt-4">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-brass-300 font-semibold hover:text-brass-200 hover:underline transition-colors"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
