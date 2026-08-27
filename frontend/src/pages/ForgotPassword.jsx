import { useState } from 'react'
import { Link } from 'react-router'
import api from '../api/axios.js'
import { Button, Input, Alert } from '../components/ui';

export default function ForgotPassword() {

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('info');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMsgType('success');
      setMessage(res.data.message);
    }
    catch (err) {
      setMsgType('error');
      setMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-cream px-4 py-12">
      <form
        className="w-full max-w-md bg-paper border border-border rounded-2xl shadow-sm p-8 flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <h2 className="font-display text-2xl font-bold text-center text-ink mb-1">Forgot Password</h2>
        <p className="text-sm text-muted text-center mb-2">
          Enter your email and we'll send you a link to reset your password.
        </p>

        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          label="Email Address"
          required
        />

        <Button type="submit" size="lg" disabled={loading} className="w-full mt-1">
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>

        {message && (
          <Alert tone={msgType === 'success' ? 'success' : 'error'}>{message}</Alert>
        )}

        <p className="text-center text-sm text-muted mt-1">
          Remembered it?{' '}
          <Link to="/login" className="text-brass-600 font-semibold hover:underline">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  )
}
