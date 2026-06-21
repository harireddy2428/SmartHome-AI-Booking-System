import { FaBolt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', padding: '60px 0 30px' }}>
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <FaBolt className="gradient-text" size={22} />
              <span className="fw-bold fs-5 gradient-text">SmartHome</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              AI-powered platform connecting you with verified home service professionals. Quality service, guaranteed satisfaction.
            </p>
            <div className="d-flex gap-3 mt-3">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                <Icon key={i} size={20} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} className="hover-accent" />
              ))}
            </div>
          </div>
          <div className="col-md-2">
            <h6 className="fw-bold mb-3">Services</h6>
            {['Electrician', 'Plumber', 'Carpenter', 'Cleaner', 'Painter'].map(s => (
              <div key={s}><Link to="/services" className="text-decoration-none" style={{ color: 'var(--text-secondary)', lineHeight: 2 }}>{s}</Link></div>
            ))}
          </div>
          <div className="col-md-2">
            <h6 className="fw-bold mb-3">Company</h6>
            {['About Us', 'Contact', 'Privacy Policy', 'Terms'].map(l => (
              <div key={l}><span style={{ color: 'var(--text-secondary)', lineHeight: 2, cursor: 'pointer' }}>{l}</span></div>
            ))}
          </div>
          <div className="col-md-4">
            <h6 className="fw-bold mb-3">Newsletter</h6>
            <p style={{ color: 'var(--text-secondary)' }}>Get updates on new services and offers.</p>
            <div className="d-flex gap-2 mt-2">
              <input className="form-control-dark flex-1" placeholder="Your email" style={{ flex: 1 }} />
              <button className="btn-gradient btn btn-sm">Subscribe</button>
            </div>
          </div>
        </div>
        <hr style={{ borderColor: 'var(--border)', marginTop: '40px' }} />
        <p className="text-center mb-0" style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          © 2024 SmartHome Services. Built with ❤️ for Hackathon.
        </p>
      </div>
    </footer>
  );
}
