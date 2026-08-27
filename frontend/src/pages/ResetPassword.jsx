import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router';
import api from '../api/axios.js'
import { Button, Input, Alert } from '../components/ui';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [msgType, setMsgType] = useState('info');
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    if (password !== confirmPassword) {
      setMsgType('error');
      setMessage('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password })
      setMsgType('success');
      setMessage(res.data.message)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setMsgType('error');
      setMessage(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-cream px-4 py-12">
      <form
        className="w-full max-w-md bg-paper border border-border rounded-2xl shadow-sm p-8 flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <h2 className="font-display text-2xl font-bold text-center text-ink mb-2">Reset Password</h2>

        <Input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="New Password"
          required
        />
        <Input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          label="Confirm New Password"
          required
        />

        <Button type="submit" size="lg" disabled={loading} className="w-full mt-1">
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>

        {message && (
          <Alert tone={msgType === 'success' ? 'success' : 'error'}>{message}</Alert>
        )}

        <p className="text-center text-sm text-muted mt-1">
          <Link to="/login" className="text-brass-600 font-semibold hover:underline">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  )
}
