import { Link } from 'react-router-dom';
import { FaHome, FaSearch } from 'react-icons/fa';

export default function NotFoundPage() {
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center px-3"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="glass p-5 text-center" style={{ maxWidth: 480, width: '100%' }}>
        <div
          className="gradient-text fw-bold mb-3"
          style={{ fontSize: 'clamp(5rem, 15vw, 8rem)', lineHeight: 1 }}
        >
          404
        </div>
        <h2 className="fw-bold mb-2">Page Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 32 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Link to="/" className="btn-gradient btn d-inline-flex align-items-center gap-2">
            <FaHome size={14} /> Go Home
          </Link>
          <Link to="/services" className="btn-outline-glass btn d-inline-flex align-items-center gap-2">
            <FaSearch size={14} /> Browse Services
          </Link>
        </div>
      </div>
    </div>
  );
}
