import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBolt } from 'react-icons/fa';

export default function Navbar() {
  const { user, logout, isAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const dashLink = user?.role === 'admin' ? '/admin' : user?.role === 'worker' ? '/worker' : '/customer';

  return (
    <nav className="navbar-dark-glass">
      <div className="container d-flex align-items-center justify-content-between">
        <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
          <FaBolt className="gradient-text" size={24} />
          <span className="fw-bold fs-5 gradient-text">SmartHome</span>
        </Link>

        <div className="d-flex align-items-center gap-3">
          <Link to="/services" className="text-decoration-none" style={{ color: 'var(--text-secondary)' }}>Services</Link>
          <Link to="/about" className="text-decoration-none" style={{ color: 'var(--text-secondary)' }}>About</Link>
          <Link to="/contact" className="text-decoration-none" style={{ color: 'var(--text-secondary)' }}>Contact</Link>
          {isAuth ? (
            <>
              <Link to={dashLink} className="btn-gradient btn">Dashboard</Link>
              <button onClick={handleLogout} className="btn-outline-glass btn btn-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline-glass btn">Login</Link>
              <Link to="/register" className="btn-gradient btn">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
