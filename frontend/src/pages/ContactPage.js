import { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you within 24 hours. 📧');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const info = [
    { icon: FaEnvelope, label: 'Email', val: 'support@smarthome.com', color: 'var(--accent)' },
    { icon: FaPhone, label: 'Phone', val: '+91 98765 43210', color: '#00d4ff' },
    { icon: FaMapMarkerAlt, label: 'Address', val: 'Mumbai, Maharashtra, India', color: '#10b981' },
    { icon: FaClock, label: 'Support Hours', val: 'Mon–Sat: 8AM–8PM', color: '#f59e0b' },
  ];

  return (
    <div className="section-dark">
      <div className="container">
        <div className="text-center mb-5">
          <div className="section-label mb-2">Get In Touch</div>
          <h2 className="fw-bold fs-1">Contact <span className="gradient-text">Us</span></h2>
          <p style={{ color: 'var(--text-secondary)' }}>We're here to help. Reach out anytime.</p>
        </div>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="d-flex flex-column gap-3">
              {info.map(({ icon: Icon, label, val, color }) => (
                <div key={label} className="glass p-4 d-flex align-items-center gap-3">
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} style={{ color }} />
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{label}</div>
                    <div className="fw-semibold">{val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-8">
            <div className="glass p-5">
              <h4 className="fw-bold mb-4">Send a Message</h4>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input className="form-control-dark" placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <input className="form-control-dark" type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div className="col-12">
                    <input className="form-control-dark" placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
                  </div>
                  <div className="col-12">
                    <textarea className="form-control-dark" rows={5} placeholder="Your message..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn-gradient btn w-100 py-3">Send Message 🚀</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
