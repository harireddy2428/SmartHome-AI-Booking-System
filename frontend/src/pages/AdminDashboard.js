import { useState, useEffect } from 'react';
import { FaUsers, FaWrench, FaCalendarAlt, FaStar, FaCheckCircle, FaToggleOn, FaToggleOff, FaChartBar, FaTrash, FaPhone, FaMapMarkerAlt, FaEnvelope, FaClock } from 'react-icons/fa';
import API from '../utils/api';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const statusClass = { pending: 'badge-pending', accepted: 'badge-accepted', completed: 'badge-completed', cancelled: 'badge-cancelled', rejected: 'badge-rejected' };
const STATUSES = ['pending', 'accepted', 'completed', 'cancelled', 'rejected'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingFilter, setBookingFilter] = useState('all');

  useEffect(() => {
    Promise.all([API.get('/admin/dashboard'), API.get('/admin/users'), API.get('/admin/workers'), API.get('/bookings/all')])
      .then(([s, u, w, b]) => { setStats(s.data); setUsers(u.data); setWorkers(w.data); setBookings(b.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const toggleUser = async (id) => {
    try {
      const { data } = await API.put(`/admin/users/${id}/toggle`);
      setUsers(u => u.map(x => x._id === id ? { ...x, isActive: data.isActive } : x));
      if (selectedUser?._id === id) setSelectedUser(u => ({ ...u, isActive: data.isActive }));
      toast.success(data.message);
    } catch { toast.error('Failed'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(u => u.filter(x => x._id !== id));
      setSelectedUser(null);
      toast.success('User deleted');
    } catch { toast.error('Failed'); }
  };

  const verifyWorker = async (id) => {
    try {
      await API.put(`/admin/workers/${id}/verify`);
      setWorkers(w => w.map(x => x._id === id ? { ...x, isVerified: true } : x));
      toast.success('Worker verified!');
    } catch { toast.error('Failed'); }
  };

  const deleteWorker = async (id) => {
    if (!window.confirm('Delete this worker permanently?')) return;
    try {
      await API.delete(`/admin/workers/${id}`);
      setWorkers(w => w.filter(x => x._id !== id));
      toast.success('Worker deleted');
    } catch { toast.error('Failed'); }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      const { data } = await API.put(`/admin/bookings/${id}/status`, { status });
      setBookings(b => b.map(x => x._id === id ? { ...x, status: data.status } : x));
      if (selectedBooking?._id === id) setSelectedBooking(s => ({ ...s, status: data.status }));
      toast.success(`Booking marked as ${status}`);
    } catch { toast.error('Failed'); }
  };

  if (loading) return <Loader />;

  const statCards = [
    { icon: FaUsers, label: 'Customers', val: stats?.users || 0, color: 'var(--accent)' },
    { icon: FaWrench, label: 'Workers', val: stats?.workers || 0, color: '#00d4ff' },
    { icon: FaCalendarAlt, label: 'Total Bookings', val: stats?.bookings || 0, color: 'var(--success)' },
    { icon: FaStar, label: 'Reviews', val: stats?.reviews || 0, color: '#f59e0b' },
  ];

  const tabs = [
    { id: 'dashboard', icon: FaChartBar, label: 'Dashboard' },
    { id: 'users', icon: FaUsers, label: 'Customers' },
    { id: 'workers', icon: FaWrench, label: 'Workers' },
    { id: 'bookings', icon: FaCalendarAlt, label: 'Bookings' },
  ];

  const filteredBookings = bookingFilter === 'all' ? bookings : bookings.filter(b => b.status === bookingFilter);

  return (
    <div className="main-content">
      <div className="sidebar">
        <div className="p-3">
          <div className="glass p-3 text-center mb-4">
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 'bold', margin: '0 auto 8px' }}>A</div>
            <div className="fw-bold">Admin</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Super Admin</div>
          </div>
          {tabs.map(({ id, icon: Icon, label }) => (
            <div key={id} className={`sidebar-link ${activeTab === id ? 'active' : ''}`} onClick={() => { setActiveTab(id); setSelectedUser(null); setSelectedBooking(null); }} style={{ cursor: 'pointer' }}>
              <Icon size={16} />{label}
            </div>
          ))}
        </div>
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div>
          <h4 className="fw-bold mb-4">📊 Admin Dashboard</h4>
          <div className="row g-3 mb-5">
            {statCards.map(({ icon: Icon, label, val, color }) => (
              <div key={label} className="col-6 col-md-3">
                <div className="stat-card d-flex align-items-center gap-3">
                  <div style={{ width: 50, height: 50, borderRadius: 14, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={22} style={{ color }} />
                  </div>
                  <div>
                    <div className="fw-bold fs-3" style={{ color }}>{val}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="glass p-4">
                <h5 className="fw-bold mb-4">Booking Status Overview</h5>
                {stats?.bookingStats?.map(({ _id, count }) => {
                  const colors = { pending: 'var(--warning)', accepted: 'var(--accent)', completed: 'var(--success)', cancelled: 'var(--danger)', rejected: 'var(--danger)' };
                  const pct = stats.bookings > 0 ? ((count / stats.bookings) * 100).toFixed(0) : 0;
                  return (
                    <div key={_id} className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-capitalize fw-semibold">{_id}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{count} ({pct}%)</span>
                      </div>
                      <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: colors[_id] || 'var(--accent)', borderRadius: 4, transition: 'width 0.6s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="col-md-6">
              <div className="glass p-4">
                <h5 className="fw-bold mb-4">Recent Bookings</h5>
                {bookings.slice(0, 5).map(b => (
                  <div key={b._id} className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                    onClick={() => { setSelectedBooking(b); setActiveTab('bookings'); }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{b.customerId?.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{b.serviceId?.title} · {b.date}</div>
                    </div>
                    <span className={`badge-status ${statusClass[b.status]}`}>{b.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMERS TAB */}
      {activeTab === 'users' && (
        <div className="row g-4">
          <div className={selectedUser ? 'col-md-7' : 'col-12'}>
            <h4 className="fw-bold mb-4">Manage Customers ({users.filter(u => u.role === 'customer').length})</h4>
            <div className="glass overflow-hidden">
              <div className="table-responsive">
                <table className="table table-dark table-hover mb-0">
                  <thead style={{ background: 'rgba(108,99,255,0.15)' }}>
                    <tr><th>Name</th><th>Email</th><th>Phone</th><th>City</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {users.filter(u => u.role === 'customer').map(u => (
                      <tr key={u._id} style={{ borderColor: 'var(--border)', cursor: 'pointer', background: selectedUser?._id === u._id ? 'rgba(108,99,255,0.08)' : '' }}
                        onClick={() => setSelectedUser(u)}>
                        <td className="align-middle fw-semibold">{u.name}</td>
                        <td className="align-middle" style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{u.email}</td>
                        <td className="align-middle" style={{ fontSize: 13 }}>{u.phone || '-'}</td>
                        <td className="align-middle" style={{ color: 'var(--text-secondary)' }}>{u.city || '-'}</td>
                        <td className="align-middle">
                          <span style={{ color: u.isActive ? 'var(--success)' : 'var(--danger)', fontSize: 13 }}>{u.isActive ? '● Active' : '● Suspended'}</span>
                        </td>
                        <td className="align-middle" onClick={e => e.stopPropagation()}>
                          <div className="d-flex gap-2">
                            <button className="btn btn-sm" style={{ background: u.isActive ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)', border: `1px solid ${u.isActive ? 'var(--danger)' : 'var(--success)'}`, color: u.isActive ? 'var(--danger)' : 'var(--success)', borderRadius: 6, fontSize: 11 }}
                              onClick={() => toggleUser(u._id)}>
                              {u.isActive ? <FaToggleOff className="me-1" /> : <FaToggleOn className="me-1" />}
                              {u.isActive ? 'Suspend' : 'Activate'}
                            </button>
                            <button className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: 6, fontSize: 11 }}
                              onClick={() => deleteUser(u._id)}><FaTrash /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {selectedUser && (
            <div className="col-md-5">
              <div className="glass p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold mb-0">Customer Details</h5>
                  <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 6 }} onClick={() => setSelectedUser(null)}>✕</button>
                </div>
                <div className="text-center mb-4">
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 'bold', margin: '0 auto 10px' }}>{selectedUser.name?.[0]}</div>
                  <div className="fw-bold fs-5">{selectedUser.name}</div>
                  <span className={`badge-status ${selectedUser.isActive ? 'badge-accepted' : 'badge-rejected'}`}>{selectedUser.isActive ? 'Active' : 'Suspended'}</span>
                </div>
                <div className="d-flex flex-column gap-3" style={{ fontSize: 14 }}>
                  <div className="d-flex align-items-center gap-2"><FaEnvelope style={{ color: 'var(--accent)' }} /><span>{selectedUser.email}</span></div>
                  <div className="d-flex align-items-center gap-2"><FaPhone style={{ color: 'var(--accent)' }} /><span>{selectedUser.phone || 'Not provided'}</span></div>
                  <div className="d-flex align-items-center gap-2"><FaMapMarkerAlt style={{ color: 'var(--accent)' }} /><span>{selectedUser.city || 'Not provided'}{selectedUser.address ? ` · ${selectedUser.address}` : ''}</span></div>
                  <div className="d-flex align-items-center gap-2"><FaClock style={{ color: 'var(--accent)' }} /><span>Joined {new Date(selectedUser.createdAt).toLocaleDateString()}</span></div>
                </div>
                <div className="mt-4 p-3 rounded" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Bookings by this customer</div>
                  <div className="fw-bold fs-5">{bookings.filter(b => b.customerId?._id === selectedUser._id).length}</div>
                </div>
                <div className="d-flex gap-2 mt-4">
                  <button className="btn btn-sm flex-fill" style={{ background: selectedUser.isActive ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)', border: `1px solid ${selectedUser.isActive ? 'var(--danger)' : 'var(--success)'}`, color: selectedUser.isActive ? 'var(--danger)' : 'var(--success)', borderRadius: 8 }}
                    onClick={() => toggleUser(selectedUser._id)}>
                    {selectedUser.isActive ? 'Suspend Account' : 'Activate Account'}
                  </button>
                  <button className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: 8 }}
                    onClick={() => deleteUser(selectedUser._id)}><FaTrash /></button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* WORKERS TAB */}
      {activeTab === 'workers' && (
        <div>
          <h4 className="fw-bold mb-4">Manage Workers ({workers.length})</h4>
          <div className="row g-3">
            {workers.map(w => (
              <div key={w._id} className="col-md-6 col-lg-4">
                <div className="glass p-4">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {w.userId?.name?.[0]}
                    </div>
                    <div>
                      <div className="fw-bold">{w.userId?.name}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{w.category} · {w.city}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, marginBottom: 8 }} className="d-flex flex-column gap-1">
                    <span><FaEnvelope size={11} className="me-1" style={{ color: 'var(--text-secondary)' }} />{w.userId?.email}</span>
                    <span><FaPhone size={11} className="me-1" style={{ color: 'var(--text-secondary)' }} />{w.userId?.phone || 'N/A'}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>⭐ {w.rating} · {w.experience} yrs exp · ₹{w.hourlyRate}/hr</span>
                    <span style={{ color: 'var(--text-secondary)' }}>✅ {w.completedJobs} jobs · 💰 ₹{w.totalEarnings} earned</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span style={{ color: w.userId?.isActive ? 'var(--success)' : 'var(--danger)', fontSize: 12 }}>{w.userId?.isActive ? '● Active' : '● Suspended'}</span>
                    <div className="d-flex gap-2 align-items-center">
                      {w.isVerified ? (
                        <span className="badge-status badge-accepted"><FaCheckCircle className="me-1" size={10} />Verified</span>
                      ) : (
                        <button className="btn btn-sm py-0" style={{ background: 'rgba(108,99,255,0.15)', border: '1px solid var(--accent)', color: 'var(--accent)', borderRadius: 6, fontSize: 11 }}
                          onClick={() => verifyWorker(w._id)}>Verify</button>
                      )}
                      {w.userId && (
                        <button className="btn btn-sm py-0" style={{ background: w.userId.isActive ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', border: `1px solid ${w.userId.isActive ? 'var(--danger)' : 'var(--success)'}`, color: w.userId.isActive ? 'var(--danger)' : 'var(--success)', borderRadius: 6, fontSize: 11 }}
                          onClick={() => toggleUser(w.userId._id)}>
                          {w.userId.isActive ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                      <button className="btn btn-sm py-0" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: 6, fontSize: 11 }}
                        onClick={() => deleteWorker(w._id)}><FaTrash /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOOKINGS TAB */}
      {activeTab === 'bookings' && (
        <div className="row g-4">
          <div className={selectedBooking ? 'col-md-7' : 'col-12'}>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <h4 className="fw-bold mb-0">All Bookings ({filteredBookings.length})</h4>
              <div className="d-flex gap-2 flex-wrap">
                {['all', ...STATUSES].map(s => (
                  <button key={s} className="btn btn-sm" style={{ background: bookingFilter === s ? 'var(--accent)' : 'rgba(255,255,255,0.05)', border: `1px solid ${bookingFilter === s ? 'var(--accent)' : 'var(--border)'}`, color: bookingFilter === s ? '#fff' : 'var(--text-secondary)', borderRadius: 6, fontSize: 12, textTransform: 'capitalize' }}
                    onClick={() => setBookingFilter(s)}>{s}</button>
                ))}
              </div>
            </div>
            <div className="glass overflow-hidden">
              <div className="table-responsive">
                <table className="table table-dark table-hover mb-0">
                  <thead style={{ background: 'rgba(108,99,255,0.15)' }}>
                    <tr><th>Customer</th><th>Worker</th><th>Service</th><th>Date & Time</th><th>Amount</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(b => (
                      <tr key={b._id} style={{ borderColor: 'var(--border)', cursor: 'pointer', background: selectedBooking?._id === b._id ? 'rgba(108,99,255,0.08)' : '' }}
                        onClick={() => setSelectedBooking(b)}>
                        <td className="align-middle fw-semibold">{b.customerId?.name}</td>
                        <td className="align-middle">{b.workerId?.userId?.name || '-'}</td>
                        <td className="align-middle" style={{ fontSize: 13 }}>{b.serviceId?.title}</td>
                        <td className="align-middle" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{b.date} {b.time}</td>
                        <td className="align-middle fw-bold gradient-text">₹{b.totalAmount}</td>
                        <td className="align-middle"><span className={`badge-status ${statusClass[b.status]}`}>{b.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {selectedBooking && (
            <div className="col-md-5">
              <div className="glass p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold mb-0">Booking Details</h5>
                  <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 6 }} onClick={() => setSelectedBooking(null)}>✕</button>
                </div>
                <div className="d-flex flex-column gap-3" style={{ fontSize: 14 }}>
                  <div className="p-3 rounded" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginBottom: 4 }}>Customer</div>
                    <div className="fw-bold">{selectedBooking.customerId?.name}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{selectedBooking.customerId?.email}</div>
                  </div>
                  <div className="p-3 rounded" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginBottom: 4 }}>Worker</div>
                    <div className="fw-bold">{selectedBooking.workerId?.userId?.name || 'Unassigned'}</div>
                  </div>
                  <div className="row g-2">
                    <div className="col-6 p-3 rounded" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Service</div>
                      <div className="fw-semibold">{selectedBooking.serviceId?.title}</div>
                    </div>
                    <div className="col-6 p-3 rounded" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Amount</div>
                      <div className="fw-bold gradient-text">₹{selectedBooking.totalAmount}</div>
                    </div>
                    <div className="col-6 p-3 rounded" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Date & Time</div>
                      <div className="fw-semibold">{selectedBooking.date} {selectedBooking.time}</div>
                    </div>
                    <div className="col-6 p-3 rounded" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Payment</div>
                      <div className="fw-semibold" style={{ color: selectedBooking.isPaid ? 'var(--success)' : 'var(--warning)' }}>{selectedBooking.isPaid ? 'Paid' : 'Pending'}</div>
                    </div>
                  </div>
                  <div className="p-3 rounded" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginBottom: 4 }}>Address</div>
                    <div>{selectedBooking.address}, {selectedBooking.city}</div>
                  </div>
                  {selectedBooking.notes && (
                    <div className="p-3 rounded" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginBottom: 4 }}>Notes</div>
                      <div>{selectedBooking.notes}</div>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8 }}>Update Status</div>
                  <div className="d-flex flex-wrap gap-2">
                    {STATUSES.map(s => (
                      <button key={s} className="btn btn-sm" style={{ background: selectedBooking.status === s ? 'var(--accent)' : 'rgba(255,255,255,0.05)', border: `1px solid ${selectedBooking.status === s ? 'var(--accent)' : 'var(--border)'}`, color: selectedBooking.status === s ? '#fff' : 'var(--text-secondary)', borderRadius: 6, fontSize: 12, textTransform: 'capitalize' }}
                        onClick={() => updateBookingStatus(selectedBooking._id, s)}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
