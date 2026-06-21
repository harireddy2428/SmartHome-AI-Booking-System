import { FaRocket, FaStar, FaShieldAlt, FaLightbulb, FaHeart } from 'react-icons/fa';

const team = [
  { name: 'Arjun Mehta', role: 'Full Stack Developer', emoji: '💻' },
  { name: 'Priya Sharma', role: 'UI/UX Designer', emoji: '🎨' },
  { name: 'Rahul Verma', role: 'AI/ML Engineer', emoji: '🤖' },
  { name: 'Kavita Singh', role: 'Backend Engineer', emoji: '⚙️' },
];

const values = [
  { icon: FaShieldAlt, title: 'Verified Professionals', desc: 'Every worker goes through background verification before joining.', color: '#6c63ff' },
  { icon: FaStar, title: 'Quality Assurance', desc: 'Rating system ensures consistent service quality.', color: '#f59e0b' },
  { icon: FaLightbulb, title: 'AI-Powered Matching', desc: 'Smart algorithms match you with the best professional.', color: '#00d4ff' },
  { icon: FaHeart, title: 'Customer First', desc: 'Satisfaction guaranteed or we make it right.', color: '#ef4444' },
];

export default function AboutPage() {
  return (
    <div>
      <section className="section-dark" style={{ background: 'linear-gradient(135deg, #0a0e1a, #1a1040)' }}>
        <div className="container text-center">
          <div className="section-label mb-3">About Us</div>
          <h1 className="fw-bold fs-1 mb-4">Building the <span className="gradient-text">Future of Home Services</span></h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 18, maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.8 }}>
            SmartHome is an AI-powered platform connecting homeowners with trusted, verified service professionals — built for the modern home.
          </p>
          <div className="d-flex justify-content-center gap-4 flex-wrap">
            {[['5000+', 'Happy Customers'], ['500+', 'Verified Pros'], ['15+', 'Cities'], ['4.8★', 'Avg Rating']].map(([val, label]) => (
              <div key={label} className="glass px-4 py-3 text-center">
                <div className="fw-bold fs-3 gradient-text">{val}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-dark" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold fs-2">Our <span className="gradient-text">Values</span></h2>
          </div>
          <div className="row g-4">
            {values.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="col-md-6 col-lg-3">
                <div className="glass p-4 h-100 text-center">
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <Icon size={26} style={{ color }} />
                  </div>
                  <h5 className="fw-bold mb-2">{title}</h5>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-dark">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold fs-2">Meet the <span className="gradient-text">Team</span></h2>
            <p style={{ color: 'var(--text-secondary)' }}>The hackathon team behind SmartHome</p>
          </div>
          <div className="row g-4 justify-content-center">
            {team.map(({ name, role, emoji }) => (
              <div key={name} className="col-md-6 col-lg-3">
                <div className="glass p-4 text-center">
                  <div className="fs-1 mb-3">{emoji}</div>
                  <h5 className="fw-bold mb-1">{name}</h5>
                  <div style={{ color: 'var(--accent)', fontSize: 13 }}>{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-dark" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="glass p-5 text-center" style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(0,212,255,0.1))' }}>
            <FaRocket size={40} className="gradient-text mb-3" />
            <h2 className="fw-bold mb-3">Our <span className="gradient-text">Mission</span></h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 600, margin: '0 auto', lineHeight: 1.8 }}>
              To democratize access to quality home services by leveraging AI technology — making it effortless for every homeowner to find, book, and trust skilled professionals.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
