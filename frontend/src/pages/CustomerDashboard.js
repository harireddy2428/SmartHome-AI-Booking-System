import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaStar, FaRobot, FaUser, FaMapMarkerAlt, FaBriefcase, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import Loader from '../components/common/Loader';
import StarRating from '../components/common/StarRating';
import toast from 'react-hot-toast';

function BookingCard({ booking, onCancel, onReview }) {
  const statusClass = {
    pending: 'badge-pending',
    accepted: 'badge-accepted',
    completed: 'badge-completed',
    cancelled: 'badge-cancelled',
    rejected: 'badge-rejected',
  };

  return (
    <div className="glass p-4 mb-3">
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
        <div>
          <div className="fw-bold fs-5">{booking.serviceId?.title || 'Service'}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Worker: {booking.workerId?.userId?.name || 'N/A'}
            {booking.workerId?.userId?.phone ? ` · ${booking.workerId.userId.phone}` : ''}
          </div>
        </div>
        <span className={`badge-status ${statusClass[booking.status] || 'badge-pending'}`}>
          {booking.status?.toUpperCase()}
        </span>
      </div>
      <div className="d-flex flex-wrap gap-3 mt-2" style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
        <span><FaCalendarAlt size={12} className="me-1" />{booking.date} at {booking.time}</span>
        <span><FaMapMarkerAlt size={12} className="me-1" />{booking.city}</span>
        <span className="fw-bold gradient-text">₹{booking.totalAmount}</span>
      </div>
      {booking.notes && (
        <div className="mt-2" style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          📝 {booking.notes}
        </div>
      )}
      <div className="d-flex gap-2 mt-3">
        {booking.status === 'pending' && (
          <button
            className="btn btn-sm"
            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: 8 }}
            onClick={() => onCancel(booking._id)}
          >
            Cancel
          </button>
        )}
        {booking.status === 'completed' && booking.workerId?._id && (
          <button className="btn-gradient btn btn-sm" onClick={() => onReview(booking)}>
            ⭐ Rate Service
          </button>
        )}
      </div>
    </div>
  );
}

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('bookings');
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, review: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    API.get('/bookings/my')
      .then(({ data }) => setBookings(data))
      .catch(() => setError('Failed to load bookings. Please refresh.'))
      .finally(() => setLoading(false));
  }, []);

  const cancelBooking = async (id) => {
    try {
      await API.put(`/bookings/${id}/cancel`);
      setBookings(b => b.map(x => x._id === id ? { ...x, status: 'cancelled' } : x));
      toast.success('Booking cancelled');
    } catch {
      toast.error('Failed to cancel booking');
    }
  };

  const submitReview = async () => {
    if (!reviewModal?.workerId?._id) {
      toast.error('Cannot submit review: worker data missing');
      return;
    }
    if (!reviewForm.review.trim()) {
      toast.error('Please write a review');
      return;
    }
    try {
      await API.post('/reviews', {
        workerId: reviewModal.workerId._id,
        bookingId: reviewModal._id,
        ...reviewForm,
      });
      toast.success('Review submitted! ⭐');
      setReviewModal(null);
      setReviewForm({ rating: 5, review: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const navLinks = [
    { id: 'bookings', icon: FaCalendarAlt, label: 'My Bookings' },
    { id: 'profile', icon: FaUser, label: 'Profile' },
    { id: 'ai', icon: FaRobot, label: 'AI Recommendations' },
  ];

  const stats = [
    { label: 'Total Bookings', val: bookings.length, color: 'var(--accent)' },
    { label: 'Completed', val: bookings.filter(b => b.status === 'completed').length, color: 'var(--success)' },
    { label: 'Pending', val: bookings.filter(b => b.status === 'pending').length, color: 'var(--warning)' },
    { label: 'Cancelled', val: bookings.filter(b => b.status === 'cancelled').length, color: 'var(--danger)' },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

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
        <div
          className="sidebar-overlay d-md-none"
          onClick={() => setSidebarOpen(false)}
        />
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
            <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{user?.email}</div>
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
          <div
            className="sidebar-link"
            onClick={() => { navigate('/services'); setSidebarOpen(false); }}
            style={{ cursor: 'pointer' }}
          >
            <FaBriefcase size={16} />Browse Services
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* Stats */}
        <div className="row g-3 mb-4">
          {stats.map(({ label, val, color }) => (
            <div key={label} className="col-6 col-md-3">
              <div className="stat-card text-center">
                <div className="fw-bold fs-2" style={{ color }}>{val}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Error banner */}
        {error && (
          <div
            className="p-3 mb-4 rounded"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger)', color: 'var(--danger)' }}
          >
            ⚠️ {error}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <h4 className="fw-bold mb-0">My Bookings</h4>
              <Link to="/services" className="btn-gradient btn">+ New Booking</Link>
            </div>
            {loading ? (
              <Loader text="Loading bookings..." />
            ) : bookings.length === 0 ? (
              <div className="glass p-5 text-center">
                <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                <p style={{ color: 'var(--text-secondary)' }}>No bookings yet.</p>
                <Link to="/services" className="btn-gradient btn mt-2">Book a Service</Link>
              </div>
            ) : (
              bookings.map(b => (
                <BookingCard key={b._id} booking={b} onCancel={cancelBooking} onReview={setReviewModal} />
              ))
            )}
          </div>
        )}

        {activeTab === 'profile' && <ProfileTab user={user} />}
        {activeTab === 'ai' && <AIRecommendationsTab city={user?.city} />}
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: 'rgba(0,0,0,0.75)', zIndex: 9999 }}
          onClick={e => e.target === e.currentTarget && setReviewModal(null)}
        >
          <div className="glass p-4" style={{ maxWidth: 440, width: '90%' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Rate Your Experience</h5>
              <button
                className="btn btn-sm p-0 border-0 bg-transparent"
                style={{ color: 'var(--text-secondary)', fontSize: 18 }}
                onClick={() => setReviewModal(null)}
              >
                <FaTimes />
              </button>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              {reviewModal.serviceId?.title || 'Service'}
              {reviewModal.workerId?.userId?.name ? ` · ${reviewModal.workerId.userId.name}` : ''}
            </p>
            <div className="d-flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map(r => (
                <FaStar
                  key={r}
                  size={28}
                  style={{ cursor: 'pointer', color: r <= reviewForm.rating ? '#f59e0b' : '#334155' }}
                  onClick={() => setReviewForm(f => ({ ...f, rating: r }))}
                />
              ))}
            </div>
            <textarea
              className="form-control-dark mb-3"
              rows={3}
              placeholder="Write your review..."
              value={reviewForm.review}
              onChange={e => setReviewForm(f => ({ ...f, review: e.target.value }))}
            />
            <div className="d-flex gap-2">
              <button className="btn-gradient btn flex-1" onClick={submitReview}>
                Submit Review
              </button>
              <button className="btn-outline-glass btn flex-1" onClick={() => setReviewModal(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileTab({ user }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.name.trim() || form.name.trim().length < 2) {
      setFormError('Name must be at least 2 characters');
      return;
    }
    if (form.phone && !/^[0-9]{10}$/.test(form.phone)) {
      setFormError('Phone must be a 10-digit number');
      return;
    }
    setSaving(true);
    try {
      await API.put('/auth/profile', form);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass p-4" style={{ maxWidth: 500 }}>
      <h4 className="fw-bold mb-4">Edit Profile</h4>
      {formError && (
        <div
          className="p-3 mb-3 rounded"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', fontSize: 14 }}
        >
          {formError}
        </div>
      )}
      <form onSubmit={handleUpdate}>
        {[
          ['Full Name', 'name', 'text', true],
          ['Phone (10 digits)', 'phone', 'tel', false],
          ['Address', 'address', 'text', false],
          ['City', 'city', 'text', false],
        ].map(([label, key, type, required]) => (
          <div className="mb-3" key={key}>
            <label className="form-label fw-semibold">{label}</label>
            <input
              className="form-control-dark"
              type={type}
              value={form[key]}
              required={required}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
            />
          </div>
        ))}
        <button className="btn-gradient btn w-100" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

function AIRecommendationsTab({ city }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  const fetchRecs = async () => {
    setLoading(true);
    setError('');
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (city) params.append('city', city);
    try {
      const { data } = await API.get(`/ai/recommend?${params}`);
      setRecommendations(data.recommendations);
      setFetched(true);
    } catch {
      setError('Failed to fetch recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <FaRobot size={28} className="gradient-text" />
        <div>
          <h4 className="fw-bold mb-0">AI Recommendations</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 0 }}>
            Personalized worker suggestions based on your history &amp; location
          </p>
        </div>
      </div>

      <div className="d-flex gap-3 mb-4 flex-wrap">
        <select
          className="form-control-dark"
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{ maxWidth: 200 }}
        >
          <option value="">All Categories</option>
          {['Electrician', 'Plumber', 'Carpenter', 'Cleaner', 'Painter', 'Appliance Repair'].map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <button className="btn-gradient btn" onClick={fetchRecs} disabled={loading}>
          {loading ? 'Analyzing...' : '🤖 Get Recommendations'}
        </button>
      </div>

      {error && (
        <div
          className="p-3 mb-4 rounded"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', fontSize: 14 }}
        >
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <Loader text="AI is analyzing your preferences..." />
      ) : (
        <div className="row g-3">
          {recommendations.map((w, idx) => (
            <div key={w._id} className="col-md-6">
              <div className="glass p-4">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                      }}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <div className="fw-bold">{w.userId?.name}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{w.category}</div>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold gradient-text">{w.score?.toFixed(0)}pts</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 11 }}>AI Score</div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <StarRating rating={w.rating} />
                  <span style={{ fontSize: 13 }}>{w.rating} · {w.city}</span>
                </div>
                <Link to={`/book/${w._id}`} className="btn-gradient btn btn-sm w-100">Book Now</Link>
              </div>
            </div>
          ))}

          {fetched && !loading && recommendations.length === 0 && (
            <div className="col-12 text-center py-4">
              <div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div>
              <p style={{ color: 'var(--text-secondary)' }}>
                No workers found for this category in your city. Try "All Categories".
              </p>
            </div>
          )}

          {!fetched && !loading && (
            <div className="col-12 text-center py-4">
              <p style={{ color: 'var(--text-secondary)' }}>
                Click "Get Recommendations" to see AI-matched professionals
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
