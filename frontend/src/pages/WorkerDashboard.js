import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaDollarSign, FaStar, FaUser, FaToggleOn, FaToggleOff, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

export default function WorkerDashboard() {
  const { user } = useAuth();
  const [worker, setWorker] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('bookings');
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    Promise.all([API.get('/workers/profile'), API.get('/bookings/worker')])
      .then(([w, b]) => {
        setWorker(w.data);
        setEditForm({
          category: w.data.category,
          skills: w.data.skills?.join(', '),
          bio: w.data.bio,
          hourlyRate: w.data.hourlyRate,
          experience: w.data.experience,
        });
        setBookings(b.data);
      })
      .catch(() => setError('Failed to load dashboard data. Please refresh.'))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/bookings/${id}/status`, { status });
      setBookings(b => b.map(x => x._id === id ? { ...x, status } : x));
      toast.success(`Booking ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const toggleAvailability = async () => {
    try {
      const { data } = await API.put('/workers/profile', { availability: !worker.availability });
      setWorker(data);
      toast.success(`You are now ${data.availability ? 'Available' : 'Unavailable'}`);
    } catch {
      toast.error('Failed to update availability');
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!editForm.hourlyRate || editForm.hourlyRate < 0) {
      toast.error('Please enter a valid hourly rate');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...editForm,
        skills: editForm.skills?.split(',').map(s => s.trim()).filter(Boolean),
      };
      const { data } = await API.put('/workers/profile', payload);
      setWorker(data);
      toast.success('Profile updated!');
    } catch {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const statusClass = {
    pending: 'badge-pending',
    accepted: 'badge-accepted',
    completed: 'badge-completed',
    cancelled: 'badge-cancelled',
    rejected: 'badge-rejected',
  };

  const stats = [
    { icon: FaCalendarAlt, label: 'Total Jobs', val: bookings.length, color: 'var(--accent)' },
    { icon: FaCheckCircle, label: 'Completed', val: worker?.completedJobs || 0, color: 'var(--success)' },
    { icon: FaDollarSign, label: 'Earnings', val: `₹${worker?.totalEarnings || 0}`, color: '#10b981' },
    { icon: FaStar, label: 'Rating', val: worker?.rating || 0, color: '#f59e0b' },
  ];

  const navLinks = [
    { id: 'bookings', icon: FaCalendarAlt, label: 'Bookings' },
    { id: 'profile', icon: FaUser, label: 'My Profile' },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  if (loading) return <Loader text="Loading dashboard..." />;

  return (
    <div className="dashboard-wrapper">
      {/* Mobile hamburger */}
      <button
        className="hamburger-btn d-md-none"
        onClick={() => setSidebarOpen(o => !o)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay d-md-none" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="p-3">
          <div className="glass p-3 text-center mb-4">
            <div
              style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 'bold', margin: '0 auto 8px',
              }}
            >
              {user?.name?.[0]}
            </div>
            <div className="fw-bold">{user?.name}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{worker?.category}</div>
            {worker?.isVerified && (
              <span className="badge-status badge-accepted mt-1" style={{ display: 'inline-block', fontSize: 11 }}>
                ✓ Verified
              </span>
            )}
          </div>

          {/* Availability toggle */}
          <div className="px-2 mb-3">
            <div
              className="d-flex align-items-center justify-content-between p-3 glass"
              style={{ borderRadius: 10 }}
            >
              <span style={{ fontSize: 14 }}>Availability</span>
              <div
                onClick={toggleAvailability}
                style={{ cursor: 'pointer', color: worker?.availability ? 'var(--success)' : 'var(--danger)' }}
              >
                {worker?.availability ? <FaToggleOn size={28} /> : <FaToggleOff size={28} />}
              </div>
            </div>
          </div>

          {navLinks.map(({ id, icon: Icon, label }) => (
            <div
              key={id}
              className={`sidebar-link ${activeTab === id ? 'active' : ''}`}
              onClick={() => handleNavClick(id)}
              style={{ cursor: 'pointer' }}
            >
              <Icon size={16} />{label}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* Error banner */}
        {error && (
          <div
            className="p-3 mb-4 rounded"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger)', color: 'var(--danger)' }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Stats */}
        <div className="row g-3 mb-4">
          {stats.map(({ icon: Icon, label, val, color }) => (
            <div key={label} className="col-6 col-md-3">
              <div className="stat-card d-flex align-items-center gap-3">
                <div
                  style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `${color}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <div>
                  <div className="fw-bold fs-4" style={{ color }}>{val}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <h4 className="fw-bold mb-4">Booking Requests</h4>
            {bookings.length === 0 ? (
              <div className="glass p-5 text-center">
                <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                <p style={{ color: 'var(--text-secondary)' }}>No bookings yet.</p>
              </div>
            ) : (
              bookings.map(b => (
                <div key={b._id} className="glass p-4 mb-3">
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                    <div>
                      <div className="fw-bold">{b.serviceId?.title || 'Service'}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                        Customer: {b.customerId?.name || 'N/A'}
                        {b.customerId?.phone ? ` · ${b.customerId.phone}` : ''}
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                        📅 {b.date} at {b.time} · 📍 {b.address}, {b.city}
                      </div>
                      {b.notes && (
                        <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 4 }}>
                          📝 {b.notes}
                        </div>
                      )}
                    </div>
                    <span className={`badge-status ${statusClass[b.status] || 'badge-pending'}`}>
                      {b.status?.toUpperCase()}
                    </span>
                  </div>

                  {b.status === 'pending' && (
                    <div className="d-flex gap-2 mt-3">
                      <button
                        className="btn btn-sm"
                        style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid var(--success)', color: 'var(--success)', borderRadius: 8 }}
                        onClick={() => updateStatus(b._id, 'accepted')}
                      >
                        <FaCheckCircle className="me-1" />Accept
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: 8 }}
                        onClick={() => updateStatus(b._id, 'rejected')}
                      >
                        <FaTimesCircle className="me-1" />Reject
                      </button>
                    </div>
                  )}
                  {b.status === 'accepted' && (
                    <button
                      className="btn-gradient btn btn-sm mt-3"
                      onClick={() => updateStatus(b._id, 'completed')}
                    >
                      ✓ Mark Completed
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="glass p-4" style={{ maxWidth: 550 }}>
            <h4 className="fw-bold mb-4">Worker Profile</h4>
            <form onSubmit={saveProfile}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Category</label>
                  <input
                    className="form-control-dark"
                    value={editForm.category || ''}
                    onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Experience (years)</label>
                  <input
                    className="form-control-dark"
                    type="number"
                    min="0"
                    value={editForm.experience || ''}
                    onChange={e => setEditForm(f => ({ ...f, experience: e.target.value }))}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Hourly Rate (₹)</label>
                  <input
                    className="form-control-dark"
                    type="number"
                    min="0"
                    value={editForm.hourlyRate || ''}
                    onChange={e => setEditForm(f => ({ ...f, hourlyRate: e.target.value }))}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Skills (comma separated)</label>
                  <input
                    className="form-control-dark"
                    placeholder="e.g. Wiring, MCB, Fan Installation"
                    value={editForm.skills || ''}
                    onChange={e => setEditForm(f => ({ ...f, skills: e.target.value }))}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Bio</label>
                  <textarea
                    className="form-control-dark"
                    rows={3}
                    placeholder="Describe your experience and expertise..."
                    value={editForm.bio || ''}
                    onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))}
                  />
                </div>
              </div>
              <button className="btn-gradient btn w-100 mt-3" type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
