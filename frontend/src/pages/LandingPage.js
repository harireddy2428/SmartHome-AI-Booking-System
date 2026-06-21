import { Link } from 'react-router-dom';
import { FaBolt, FaShieldAlt, FaStar, FaClock, FaRobot, FaWrench, FaTint, FaHammer, FaBroom, FaPaintRoller, FaPlug, FaArrowRight, FaUsers, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';

const services = [
  { icon: FaBolt, label: 'Electrician', color: '#f59e0b', desc: 'Wiring, repairs & installations' },
  { icon: FaTint, label: 'Plumber', color: '#00d4ff', desc: 'Pipe repairs & drain cleaning' },
  { icon: FaHammer, label: 'Carpenter', color: '#10b981', desc: 'Furniture & woodwork' },
  { icon: FaBroom, label: 'Cleaner', color: '#6c63ff', desc: 'Deep home cleaning' },
  { icon: FaPaintRoller, label: 'Painter', color: '#f472b6', desc: 'Interior & exterior painting' },
  { icon: FaPlug, label: 'Appliance Repair', color: '#ef4444', desc: 'AC, washing machine & more' },
];

const stats = [
  { icon: FaUsers, val: '5,000+', label: 'Happy Customers' },
  { icon: FaWrench, val: '500+', label: 'Verified Professionals' },
  { icon: FaCheckCircle, val: '12,000+', label: 'Jobs Completed' },
  { icon: FaStar, val: '4.8/5', label: 'Average Rating' },
];

const steps = [
  { num: '01', title: 'Search Service', desc: 'Browse or search for the service you need from our wide range of categories.' },
  { num: '02', title: 'AI Matches Best Pro', desc: 'Our AI recommends the best available professional based on your location and ratings.' },
  { num: '03', title: 'Book & Confirm', desc: 'Pick a date and time that works for you. Get instant confirmation.' },
  { num: '04', title: 'Job Done!', desc: 'Professional arrives, completes the work, and you rate your experience.' },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="hero-section">
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-6 fade-in-up">
              <div className="section-label mb-3">🤖 AI-Powered Platform</div>
              <h1 className="fw-bold mb-4" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', lineHeight: 1.2 }}>
                Smart Home Services,<br />
                <span className="gradient-text">Powered by AI</span>
              </h1>
              <p className="mb-5" style={{ color: 'var(--text-secondary)', fontSize: 18, maxWidth: 480, lineHeight: 1.8 }}>
                Connect with verified electricians, plumbers, carpenters, and more. 
                Our AI finds the perfect professional for your home needs.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/register" className="btn-gradient btn btn-lg">
                  Book a Service <FaArrowRight className="ms-2" />
                </Link>
                <Link to="/services" className="btn-outline-glass btn btn-lg">Explore Services</Link>
              </div>
              <div className="d-flex gap-4 mt-5">
                {[{ icon: FaShieldAlt, text: 'Verified Pros' }, { icon: FaClock, text: '30-min Response' }, { icon: FaRobot, text: 'AI Matched' }].map(({ icon: Icon, text }) => (
                  <div key={text} className="d-flex align-items-center gap-2">
                    <Icon style={{ color: 'var(--accent)' }} />
                    <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-flex justify-content-center">
              <div className="position-relative">
                <div className="glass pulse-glow d-flex align-items-center justify-content-center" style={{ width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.1), rgba(0,212,255,0.05))' }}>
                  <div className="text-center">
                    <FaRobot size={80} className="gradient-text mb-3" />
                    <div className="gradient-text fw-bold fs-4">AI Assistant</div>
                    <div style={{ color: 'var(--text-secondary)' }}>Ready to help 24/7</div>
                  </div>
                </div>
                {services.slice(0, 4).map((s, i) => {
                  const positions = [{ top: 0, left: -30 }, { top: 0, right: -30 }, { bottom: 60, left: -40 }, { bottom: 60, right: -40 }];
                  return (
                    <div key={i} className="glass d-flex align-items-center gap-2 px-3 py-2 position-absolute" style={{ ...positions[i], borderRadius: 12, fontSize: 13 }}>
                      <s.icon color={s.color} />
                      <span>{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--bg-secondary)', padding: '50px 0' }}>
        <div className="container">
          <div className="row g-4">
            {stats.map(({ icon: Icon, val, label }) => (
              <div key={label} className="col-6 col-md-3 text-center">
                <Icon size={30} className="gradient-text mb-2" />
                <div className="fw-bold fs-3 gradient-text">{val}</div>
                <div style={{ color: 'var(--text-secondary)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-dark">
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-label mb-2">What We Offer</div>
            <h2 className="fw-bold fs-1">Our <span className="gradient-text">Services</span></h2>
            <p style={{ color: 'var(--text-secondary)' }}>Professional home services at your doorstep</p>
          </div>
          <div className="row g-4">
            {services.map(({ icon: Icon, label, color, desc }) => (
              <div key={label} className="col-6 col-md-4 col-lg-2">
                <Link to="/services" className="text-decoration-none">
                  <div className="service-card h-100">
                    <div className="mb-3 d-flex justify-content-center">
                      <div style={{ width: 60, height: 60, borderRadius: '50%', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={26} color={color} />
                      </div>
                    </div>
                    <div className="fw-semibold mb-1">{label}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{desc}</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-dark" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-label mb-2">Process</div>
            <h2 className="fw-bold fs-1">How It <span className="gradient-text">Works</span></h2>
          </div>
          <div className="row g-4">
            {steps.map(({ num, title, desc }) => (
              <div key={num} className="col-md-3">
                <div className="glass p-4 h-100 text-center">
                  <div className="gradient-text fw-bold fs-1 mb-2">{num}</div>
                  <h5 className="fw-bold mb-2">{title}</h5>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-dark">
        <div className="container">
          <div className="glass p-5 text-center" style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(0,212,255,0.1))' }}>
            <FaMapMarkerAlt size={40} className="gradient-text mb-3" />
            <h2 className="fw-bold mb-3">Available Across <span className="gradient-text">Major Cities</span></h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 30 }}>Mumbai • Delhi • Bangalore • Hyderabad • Chennai • Pune • Kolkata</p>
            <Link to="/register" className="btn-gradient btn btn-lg">
              Get Started Today <FaArrowRight className="ms-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
