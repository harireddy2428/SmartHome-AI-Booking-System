import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBolt, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState('customer');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      const redirect = data.user.role === 'admin' ? '/admin' : data.user.role === 'worker' ? '/worker' : '/customer';
      navigate(redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (email, password, role) => {
    setActiveRole(role);
    setForm({ email, password });
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      login(data.user, data.token);
      toast.success(`Welcome, ${data.user.name}!`);
      const redirect = data.user.role === 'admin' ? '/admin' : data.user.role === 'worker' ? '/worker' : '/customer';
      navigate(redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { label: '🏠 Customer', email: 'customer@test.com', pwd: 'customer123', role: 'customer', color: '#6c63ff' },
    { label: '🔧 Worker', email: 'rajesh@worker.com', pwd: 'worker123', role: 'worker', color: '#00d4ff' },
    { label: '🛡️ Admin', email: 'admin@smarthome.com', pwd: 'admin123', role: 'admin', color: '#10b981' },
  ];

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center px-3" style={{ background: 'linear-gradient(135deg, #0a0e1a, #1a1040)' }}>
      <div className="glass p-5" style={{ width: '100%', maxWidth: 440 }}>
        <div className="text-center mb-4">
          <FaBolt size={36} className="gradient-text mb-2" />
          <h2 className="fw-bold gradient-text">Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Sign in to your account</p>
        </div>

        {/* Role Tabs */}
        <div className="d-flex gap-2 mb-4 p-1 glass-dark" style={{ borderRadius: 12 }}>
          {demoAccounts.map(({ label, role, color }) => (
            <button key={role} type="button"
              onClick={() => { setActiveRole(role); setForm({ email: '', password: '' }); }}
              className="flex-1 btn py-2 fw-semibold" style={{ borderRadius: 10, fontSize: 13, border: 'none', background: activeRole === role ? `linear-gradient(135deg, ${color}, ${color}cc)` : 'transparent', color: activeRole === role ? 'white' : 'var(--text-secondary)' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Admin notice */}
        {activeRole === 'admin' && (
          <div className="d-flex align-items-center gap-2 p-3 rounded mb-3" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <FaShieldAlt style={{ color: '#10b981', flexShrink: 0 }} />
            <span style={{ color: '#10b981', fontSize: 13 }}>Admin portal — restricted access only</span>
          </div>
        )}

        {/* Quick Demo */}
        <div className="mb-4">
          <p style={{ color: 'var(--text-secondary)', fontSize: 12, textAlign: 'center', marginBottom: 8 }}>Quick Demo Login:</p>
          <div className="d-flex gap-2 justify-content-center">
            {demoAccounts.map(({ label, email, pwd, role, color }) => (
              <button key={role} onClick={() => demoLogin(email, pwd, role)}
                className="btn btn-sm" style={{ background: `${color}20`, border: `1px solid ${color}`, color, borderRadius: 8, fontSize: 12 }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input className="form-control-dark" type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <div className="position-relative">
              <input className="form-control-dark" type={showPwd ? 'text' : 'password'} placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
              <button type="button" className="position-absolute top-50 end-0 translate-middle-y me-3 btn p-0 border-0 bg-transparent"
                onClick={() => setShowPwd(!showPwd)} style={{ color: 'var(--text-secondary)' }}>
                {showPwd ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-gradient btn w-100 py-3" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center mt-4" style={{ color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" className="gradient-text fw-semibold text-decoration-none">Register</Link>
        </p>
      </div>
    </div>
  );
}
