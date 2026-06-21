import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBolt, FaShieldAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';

const categories = ['Electrician', 'Plumber', 'Carpenter', 'Cleaner', 'Painter', 'Appliance Repair'];

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', address: '', city: '', role: 'customer', category: '', experience: '', hourlyRate: '', adminKey: '' });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', form);
      login(data.user, data.token);
      toast.success('Account created successfully!');
      const redirect = data.user.role === 'admin' ? '/admin' : data.user.role === 'worker' ? '/worker' : '/customer';
      navigate(redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center px-3 py-5" style={{ background: 'linear-gradient(135deg, #0a0e1a, #1a1040)' }}>
      <div className="glass p-5" style={{ width: '100%', maxWidth: 520 }}>
        <div className="text-center mb-4">
          <FaBolt size={36} className="gradient-text mb-2" />
          <h2 className="fw-bold gradient-text">Create Account</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Join thousands of satisfied users</p>
        </div>

        {/* Role Toggle */}
        <div className="d-flex gap-2 mb-4 p-1 glass-dark" style={{ borderRadius: 12 }}>
          {[{ val: 'customer', label: '🏠 Customer' }, { val: 'worker', label: '🔧 Worker' }, { val: 'admin', label: '🛡️ Admin' }].map(({ val, label }) => (
            <button key={val} type="button" onClick={() => set('role', val)}
              className="flex-1 btn py-2 fw-semibold" style={{ borderRadius: 10, background: form.role === val ? 'linear-gradient(135deg, var(--accent), var(--accent2))' : 'transparent', color: form.role === val ? 'white' : 'var(--text-secondary)', border: 'none', fontSize: 13 }}>
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <input className="form-control-dark" placeholder="Full Name" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div className="col-md-6">
              <input className="form-control-dark" type="email" placeholder="Email" value={form.email} onChange={e => set('email', e.target.value)} required />
            </div>
            <div className="col-md-6">
              <input className="form-control-dark" placeholder="Phone Number" value={form.phone} onChange={e => set('phone', e.target.value)} required />
            </div>
            <div className="col-md-6">
              <input className="form-control-dark" placeholder="City" value={form.city} onChange={e => set('city', e.target.value)} required />
            </div>
            <div className="col-md-6">
              <input className="form-control-dark" placeholder="Address" value={form.address} onChange={e => set('address', e.target.value)} />
            </div>
            {form.role === 'worker' && (
              <>
                <div className="col-md-6">
                  <select className="form-control-dark" value={form.category} onChange={e => set('category', e.target.value)} required>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-md-3">
                  <input className="form-control-dark" type="number" placeholder="Experience (yrs)" value={form.experience} onChange={e => set('experience', e.target.value)} />
                </div>
                <div className="col-md-3">
                  <input className="form-control-dark" type="number" placeholder="Rate (₹/hr)" value={form.hourlyRate} onChange={e => set('hourlyRate', e.target.value)} />
                </div>
              </>
            )}
            {form.role === 'admin' && (
              <div className="col-12">
                <div className="p-3 rounded mb-1" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <FaShieldAlt style={{ color: '#10b981' }} />
                    <span style={{ color: '#10b981', fontSize: 13, fontWeight: 600 }}>Admin Access Required</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 12, margin: 0 }}>Enter the admin secret key to create an admin account. Contact your system administrator for the key.</p>
                </div>
                <div className="position-relative mt-2">
                  <input className="form-control-dark" type={showAdminKey ? 'text' : 'password'} placeholder="Admin Secret Key" value={form.adminKey} onChange={e => set('adminKey', e.target.value)} required />
                  <button type="button" className="position-absolute top-50 end-0 translate-middle-y me-3 btn p-0 border-0 bg-transparent"
                    onClick={() => setShowAdminKey(!showAdminKey)} style={{ color: 'var(--text-secondary)' }}>
                    {showAdminKey ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            )}
            <div className="col-12">
              <div className="position-relative">
                <input className="form-control-dark" type={showPwd ? 'text' : 'password'} placeholder="Password (min 6 chars)" value={form.password} onChange={e => set('password', e.target.value)} required minLength={6} />
                <button type="button" className="position-absolute top-50 end-0 translate-middle-y me-3 btn p-0 border-0 bg-transparent"
                  onClick={() => setShowPwd(!showPwd)} style={{ color: 'var(--text-secondary)' }}>
                  {showPwd ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>
          <button type="submit" className="btn-gradient btn w-100 py-3 mt-4" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center mt-3" style={{ color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" className="gradient-text fw-semibold text-decoration-none">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
