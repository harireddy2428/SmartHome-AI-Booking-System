import { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import API from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: '👋 Hi! I\'m your Smart Home AI Assistant. How can I help you today?', from: 'bot' }]);
  const [input, setInput] = useState('');
  const { isAuth } = useAuth();
  const endRef = useRef();

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  if (!isAuth) return null;

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(m => [...m, { text: userMsg, from: 'user' }]);
    setInput('');
    try {
      const { data } = await API.post('/ai/chat', { message: userMsg });
      setMessages(m => [...m, { text: data.reply, from: 'bot' }]);
    } catch {
      setMessages(m => [...m, { text: 'Sorry, I\'m having trouble connecting. Please try again.', from: 'bot' }]);
    }
  };

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-box mb-3">
          <div className="d-flex align-items-center justify-content-between p-3" style={{ borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }}>
            <div className="d-flex align-items-center gap-2">
              <FaRobot size={20} />
              <span className="fw-bold">AI Assistant</span>
            </div>
            <FaTimes style={{ cursor: 'pointer' }} onClick={() => setOpen(false)} />
          </div>
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.from}`}>{m.text}</div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="d-flex gap-2 p-3" style={{ borderTop: '1px solid var(--border)' }}>
            <input
              className="form-control-dark"
              placeholder="Ask about services..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              style={{ flex: 1 }}
            />
            <button className="btn-gradient btn" onClick={send}><FaPaperPlane size={14} /></button>
          </div>
        </div>
      )}
      <div className="chat-bubble d-flex align-items-center justify-content-center" onClick={() => setOpen(!open)}>
        {open ? <FaTimes size={22} color="white" /> : <FaRobot size={22} color="white" />}
      </div>
    </div>
  );
}
