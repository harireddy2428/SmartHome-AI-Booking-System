export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="spinner-border" style={{ color: 'var(--accent)', width: 40, height: 40 }} />
      <p className="mt-3" style={{ color: 'var(--text-secondary)' }}>{text}</p>
    </div>
  );
}
