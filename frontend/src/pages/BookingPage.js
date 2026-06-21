import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/common/StarRating';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

export default function BookingPage() {
  const { workerId } = useParams();
  const { user, isAuth } = useAuth();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ serviceId: '', date: '', time: '', address: '', city: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuth) { navigate('/login'); return; }
    Promise.all([API.get(`/workers/${workerId}`), API.get('/services')]).then(([w, s]) => {
      setWorker(w.data);
      setServices(s.data);
      setForm(f => ({ ...f, address: user?.address || '', city: user?.city || '' }));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [workerId, isAuth, navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.serviceId || !form.date || !form.time) return toast.error('Please fill all required fields');
    setSubmitting(true);
    try {
      const service = services.find(s => s._id === form.serviceId);
      await API.post('/bookings', {
        ...form,
        workerId: worker._id,
        totalAmount: (service?.basePrice || 0) * 2
      });
      toast.success('Booking confirmed! 🎉');
      navigate('/customer');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  const times = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'];
  const minDate = new Date().toISOString().split('T')[0];

  if (loading) return <Loader />;
  if (!worker) return <div className="container py-5 text-center"><p>Worker not found</p></div>;

  return (
    <div className="section-dark">
      <div className="container" style={{ maxWidth: 900 }}>
        <Link to="/services" className="d-flex align-items-center gap-2 mb-4 text-decoration-none" style={{ color: 'var(--text-secondary)' }}>
          <FaArrowLeft size={14} /> Back to Services
        </Link>

        <div className="row g-4">
          {/* Worker Info */}
          <div className="col-md-4">
            <div className="glass p-4">
              <div className="text-center mb-3">
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 'bold', margin: '0 auto 12px' }}>
                  {worker.userId?.name?.[0]}
                </div>
                <div className="fw-bold fs-5">{worker.userId?.name}</div>
                <div className="badge-status badge-accepted" style={{ display: 'inline-block', marginTop: 4 }}>{worker.category}</div>
              </div>
              <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                <StarRating rating={worker.rating} />
                <span className="fw-bold">{worker.rating}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>({worker.totalReviews})</span>
              </div>
              <hr style={{ borderColor: 'var(--border)' }} />
              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Hourly Rate</span>
                  <span className="fw-bold gradient-text">₹{worker.hourlyRate}/hr</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Experience</span>
                  <span>{worker.experience} years</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Location</span>
                  <span><FaMapMarkerAlt size={12} /> {worker.city}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Status</span>
                  <span style={{ color: worker.availability ? 'var(--success)' : 'var(--danger)' }}>
                    {worker.availability ? '● Available' : '● Unavailable'}
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 6 }}>Skills</div>
                <div className="d-flex flex-wrap gap-1">
                  {worker.skills?.map(s => (
                    <span key={s} style={{ background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', color: 'var(--accent)', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="col-md-8">
            <div className="glass p-4">
              <h4 className="fw-bold mb-4">📅 Book Service</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Select Service *</label>
                  <select className="form-control-dark" value={form.serviceId} onChange={e => setForm({ ...form, serviceId: e.target.value })} required>
                    <option value="">Choose a service</option>
                    {services.filter(s => s.category === worker.category).map(s => (
                      <option key={s._id} value={s._id}>{s.title} - ₹{s.basePrice} base</option>
                    ))}
                  </select>
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold"><FaCalendarAlt className="me-2" />Date *</label>
                    <input className="form-control-dark" type="date" min={minDate} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold"><FaClock className="me-2" />Time *</label>
                    <select className="form-control-dark" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required>
                      <option value="">Select time</option>
                      {times.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-md-8">
                    <label className="form-label fw-semibold">Address *</label>
                    <input className="form-control-dark" placeholder="Full address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">City *</label>
                    <input className="form-control-dark" placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Additional Notes</label>
                  <textarea className="form-control-dark" rows={3} placeholder="Describe the issue or any special requirements..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                </div>
                <button type="submit" className="btn-gradient btn w-100 py-3 fw-bold" disabled={submitting || !worker.availability}>
                  {submitting ? 'Confirming...' : worker.availability ? '✓ Confirm Booking' : 'Worker Unavailable'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
