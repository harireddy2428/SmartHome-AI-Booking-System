import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaBriefcase, FaStar, FaCheck, FaArrowLeft, FaClock } from 'react-icons/fa';
import API from '../utils/api';
import StarRating from '../components/common/StarRating';
import Loader from '../components/common/Loader';

export default function WorkerProfilePage() {
  const { id } = useParams();
  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      API.get(`/workers/${id}`),
      API.get(`/reviews/worker/${id}`)
    ])
      .then(([w, r]) => {
        setWorker(w.data);
        setReviews(r.data);
      })
      .catch(() => setError('Failed to load worker profile. Please try again.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader text="Loading profile..." />;

  if (error) return (
    <div className="section-dark">
      <div className="container text-center py-5">
        <div className="glass p-5" style={{ maxWidth: 400, margin: '0 auto' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <p style={{ color: 'var(--danger)' }}>{error}</p>
          <Link to="/services" className="btn-gradient btn mt-3">Back to Services</Link>
        </div>
      </div>
    </div>
  );

  if (!worker) return (
    <div className="section-dark">
      <div className="container text-center py-5">
        <div className="glass p-5" style={{ maxWidth: 400, margin: '0 auto' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <p style={{ color: 'var(--text-secondary)' }}>Worker not found.</p>
          <Link to="/services" className="btn-gradient btn mt-3">Back to Services</Link>
        </div>
      </div>
    </div>
  );

  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : worker.rating;

  return (
    <div className="section-dark">
      <div className="container" style={{ maxWidth: 860 }}>
        <Link
          to="/services"
          className="d-inline-flex align-items-center gap-2 mb-4 text-decoration-none"
          style={{ color: 'var(--text-secondary)' }}
        >
          <FaArrowLeft size={13} /> Back to Services
        </Link>

        {/* Profile Card */}
        <div className="glass p-4 mb-4">
          <div className="d-flex align-items-start gap-4 flex-wrap">
            <div
              style={{
                width: 84, height: 84, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 30, fontWeight: 'bold', flexShrink: 0
              }}
            >
              {worker.userId?.name?.[0] || 'W'}
            </div>

            <div className="flex-1">
              <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                <h3 className="fw-bold mb-0">{worker.userId?.name}</h3>
                {worker.isVerified && (
                  <span className="badge-status badge-accepted" style={{ fontSize: 11 }}>
                    <FaCheck size={10} className="me-1" />Verified
                  </span>
                )}
              </div>
              <div className="mb-2">
                <span className="badge-status badge-accepted">{worker.category}</span>
              </div>
              <div className="d-flex flex-wrap gap-3" style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                <span><FaMapMarkerAlt size={12} className="me-1" />{worker.city}</span>
                <span><FaBriefcase size={12} className="me-1" />{worker.experience} yrs experience</span>
                <span><FaStar size={12} className="me-1" style={{ color: '#f59e0b' }} />{avgRating} ({reviews.length} reviews)</span>
                <span><FaClock size={12} className="me-1" />₹{worker.hourlyRate}/hr</span>
              </div>
              {worker.bio && (
                <p className="mt-3 mb-0" style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
                  {worker.bio}
                </p>
              )}
            </div>

            <div className="d-flex flex-column gap-2" style={{ flexShrink: 0 }}>
              <span style={{
                fontSize: 12,
                color: worker.availability ? 'var(--success)' : 'var(--danger)'
              }}>
                ● {worker.availability ? 'Available Now' : 'Unavailable'}
              </span>
              <Link to={`/book/${worker._id}`} className="btn-gradient btn">
                Book Now
              </Link>
            </div>
          </div>

          {/* Skills */}
          {worker.skills?.length > 0 && (
            <div className="mt-4">
              <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8 }}>Skills</div>
              <div className="d-flex flex-wrap gap-2">
                {worker.skills.map(s => (
                  <span
                    key={s}
                    style={{
                      background: 'rgba(108,99,255,0.15)',
                      border: '1px solid rgba(108,99,255,0.3)',
                      color: 'var(--accent)', borderRadius: 6,
                      padding: '3px 10px', fontSize: 12
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats Row */}
          <div className="row g-3 mt-3">
            {[
              { label: 'Rating', val: avgRating, color: '#f59e0b' },
              { label: 'Jobs Done', val: worker.completedJobs || 0, color: 'var(--success)' },
              { label: 'Reviews', val: reviews.length, color: 'var(--accent)' },
              { label: 'Experience', val: `${worker.experience}y`, color: '#00d4ff' },
            ].map(({ label, val, color }) => (
              <div key={label} className="col-6 col-md-3">
                <div className="glass p-3 text-center">
                  <div className="fw-bold fs-4" style={{ color }}>{val}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="glass p-4">
          <h5 className="fw-bold mb-4">
            Customer Reviews
            <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: 14 }} className="ms-2">
              ({reviews.length})
            </span>
          </h5>

          {reviews.length === 0 ? (
            <div className="text-center py-4">
              <div style={{ fontSize: 36, marginBottom: 8 }}>💬</div>
              <p style={{ color: 'var(--text-secondary)' }}>No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            reviews.map((r, i) => (
              <div
                key={r._id}
                className="py-3"
                style={{ borderBottom: i < reviews.length - 1 ? '1px solid var(--border)' : 'none' }}
              >
                <div className="d-flex align-items-center gap-3 mb-2">
                  <div
                    style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 'bold', fontSize: 14, flexShrink: 0
                    }}
                  >
                    {r.customerId?.name?.[0] || 'U'}
                  </div>
                  <div>
                    <div className="fw-semibold" style={{ fontSize: 14 }}>
                      {r.customerId?.name || 'Anonymous'}
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <StarRating rating={r.rating} size={12} />
                      <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0, paddingLeft: 48 }}>
                  {r.review}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
