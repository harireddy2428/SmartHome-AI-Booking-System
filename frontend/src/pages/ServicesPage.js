import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaBriefcase, FaCheck } from 'react-icons/fa';
import API from '../utils/api';
import Loader from '../components/common/Loader';
import StarRating from '../components/common/StarRating';

const categories = ['All', 'Electrician', 'Plumber', 'Carpenter', 'Cleaner', 'Painter', 'Appliance Repair'];

export default function ServicesPage() {
  const [workers, setWorkers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [city, setCity] = useState('');

  useEffect(() => {
    API.get('/workers').then(({ data }) => { setWorkers(data); setFiltered(data); setLoading(false); });
  }, []);

  useEffect(() => {
    let result = workers;
    if (category !== 'All') result = result.filter(w => w.category === category);
    if (city) result = result.filter(w => w.city?.toLowerCase().includes(city.toLowerCase()));
    if (search) result = result.filter(w => w.userId?.name?.toLowerCase().includes(search.toLowerCase()) || w.category?.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [search, category, city, workers]);

  if (loading) return <Loader text="Loading service providers..." />;

  return (
    <div className="section-dark">
      <div className="container">
        <div className="text-center mb-5">
          <div className="section-label mb-2">Find Professionals</div>
          <h2 className="fw-bold fs-1">Browse <span className="gradient-text">Services</span></h2>
        </div>

        {/* Search & Filter */}
        <div className="glass p-4 mb-5">
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <div className="position-relative">
                <FaSearch className="position-absolute" style={{ top: '50%', left: 14, transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input className="form-control-dark" placeholder="Search by name or service..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40 }} />
              </div>
            </div>
            <div className="col-md-4">
              <div className="position-relative">
                <FaMapMarkerAlt className="position-absolute" style={{ top: '50%', left: 14, transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input className="form-control-dark" placeholder="Filter by city..." value={city} onChange={e => setCity(e.target.value)} style={{ paddingLeft: 40 }} />
              </div>
            </div>
            <div className="col-md-4">
              <select className="form-control-dark" value={category} onChange={e => setCategory(e.target.value)}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="d-flex flex-wrap gap-2 mt-3">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className="btn btn-sm" style={{ borderRadius: 20, background: category === c ? 'linear-gradient(135deg, var(--accent), var(--accent2))' : 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: category === c ? 'white' : 'var(--text-secondary)', fontSize: 13 }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>{filtered.length} professionals found</p>

        <div className="row g-4">
          {filtered.map(worker => (
            <div key={worker._id} className="col-md-6 col-lg-4">
              <div className="worker-card h-100">
                <div className="p-4">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 'bold', flexShrink: 0 }}>
                      {worker.userId?.name?.[0] || 'W'}
                    </div>
                    <div className="flex-1 min-width-0">
                      <div className="fw-bold d-flex align-items-center gap-2">
                        {worker.userId?.name}
                        {worker.isVerified && <FaCheck size={12} style={{ color: 'var(--success)' }} title="Verified" />}
                      </div>
                      <div className="badge-status badge-accepted" style={{ display: 'inline-block', fontSize: 11, marginTop: 2 }}>{worker.category}</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="d-flex align-items-center gap-1">
                      <StarRating rating={worker.rating} />
                      <span className="fw-bold" style={{ fontSize: 14 }}>{worker.rating}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>({worker.totalReviews})</span>
                    </div>
                  </div>
                  <div className="d-flex flex-wrap gap-3 mb-3">
                    <div className="d-flex align-items-center gap-1" style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                      <FaMapMarkerAlt size={12} />
                      {worker.city}
                    </div>
                    <div className="d-flex align-items-center gap-1" style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                      <FaBriefcase size={12} />
                      {worker.experience} yrs exp
                    </div>
                  </div>
                  <div className="d-flex flex-wrap gap-1 mb-3">
                    {worker.skills?.slice(0, 3).map(s => (
                      <span key={s} style={{ background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', color: 'var(--accent)', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>{s}</span>
                    ))}
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="fw-bold fs-5 gradient-text">₹{worker.hourlyRate}/hr</span>
                    <div className="d-flex gap-2">
                      <Link to={`/worker-profile/${worker._id}`} className="btn-outline-glass btn btn-sm">View</Link>
                      <Link to={`/book/${worker._id}`} className="btn-gradient btn btn-sm">Book Now</Link>
                    </div>
                  </div>
                </div>
                {worker.availability && (
                  <div className="text-center py-2" style={{ background: 'rgba(16,185,129,0.1)', borderTop: '1px solid rgba(16,185,129,0.2)', fontSize: 12, color: 'var(--success)' }}>
                    ● Available Now
                  </div>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-12 text-center py-5">
              <p style={{ color: 'var(--text-secondary)' }}>No professionals found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
