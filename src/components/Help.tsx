import React, { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGeminiResponse } from '../services/geminiService';
import { addHelpQuestionPoints } from '../utils/progressUtils';
import { speakGermanText } from '../utils/speechUtils';

interface ChatMessage {
  id: number;
  role: 'assistant' | 'user';
  content: string;
}

const infoCards = [
  {
    icon: '⚡',
    title: 'Sofort fragen',
    text: 'Im Hilfecenter rechts unten können jetzt freie Fragen direkt beantwortet werden.'
  },
  {
    icon: '🧭',
    title: 'Leicht verständlich',
    text: 'Antworten sollen klar, ruhig und gut lesbar sein – passend für alltägliche Hilfe.'
  },
  {
    icon: '🔧',
    title: 'Gemeinsam ausbauen',
    text: 'Diesen Bereich können wir als Nächstes noch mit weiteren Themen und Schnellhilfen ergänzen.'
  }
];

const quickQuestions = [
  'Wie verbinde ich WLAN?',
  'Wie mache ich ein Foto?',
  'Was ist WhatsApp?',
  'Wie erkenne ich Betrug?',
  'Wie speichere ich einen Kontakt?',
  'Wie ändere ich die Lautstärke?'
];

const createMessage = (role: ChatMessage['role'], content: string): ChatMessage => ({
  id: Date.now() + Math.floor(Math.random() * 10000),
  role,
  content,
});

const Help: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage(
      'assistant',
      'Hallo 👋 Ich bin Ihr Hilfecenter. Stellen Sie unten jede beliebige Frage – zum Smartphone, zu Apps, zum Internet oder allgemein zum Alltag.'
    )
  ]);

  const sendPrompt = async (rawText: string) => {
    const text = rawText.trim();
    if (!text || loading) return;

    const history = messages.slice(-6).map(({ role, content }) => ({ role, content }));
    const userMessage = createMessage('user', text);

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setIsOpen(true);

    try {
      const response = await getGeminiResponse(text, history);
      setMessages((prev) => [...prev, createMessage('assistant', response)]);
      addHelpQuestionPoints();
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        createMessage('assistant', 'Im Moment gibt es ein kleines Problem. Bitte versuchen Sie die Frage gleich noch einmal.')
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await sendPrompt(input);
  };

  return (
    <div style={{ padding: '2rem 1rem 8rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #eef7ff 100%)',
          borderRadius: '24px',
          padding: '2rem',
          border: '1px solid #dbe8f6',
          boxShadow: '0 18px 40px rgba(15, 48, 87, 0.08)',
          marginBottom: '1.5rem'
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: '#e8f2ff',
            color: '#155b8e',
            borderRadius: '999px',
            padding: '0.45rem 0.9rem',
            fontWeight: 700,
            marginBottom: '1rem'
          }}
        >
          🆘 Hilfecenter · API aktiv
        </div>

        <h1 style={{ color: '#12395b', fontSize: '2.3rem', marginBottom: '0.75rem' }}>
          Schönes Hilfecenter für jede Frage
        </h1>
        <p style={{ color: '#5b6d7e', lineHeight: '1.7', maxWidth: '760px', marginBottom: '1rem' }}>
          Rechts unten finden Sie jetzt ein festes Hilfecenter. Dort können beliebige Fragen direkt gestellt und über die API beantwortet werden.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link
            to="/"
            style={{ textDecoration: 'none', backgroundColor: '#2196f3', color: '#fff', padding: '0.8rem 1rem', borderRadius: '12px', fontWeight: 700 }}
          >
            🏠 Home
          </Link>
          <Link
            to="/progress"
            style={{ textDecoration: 'none', backgroundColor: '#fff', color: '#17456e', border: '1px solid #cfe0f3', padding: '0.8rem 1rem', borderRadius: '12px', fontWeight: 700 }}
          >
            🏆 Fortschritt
          </Link>
          <button
            onClick={() => setIsOpen(true)}
            style={{ backgroundColor: '#0f7b6c', color: '#fff', border: 'none', padding: '0.8rem 1rem', borderRadius: '12px', cursor: 'pointer' }}
          >
            💬 Hilfecenter öffnen
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {infoCards.map((card) => (
          <div
            key={card.title}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '18px',
              padding: '1.2rem',
              border: '1px solid #dbe8f6',
              boxShadow: '0 10px 24px rgba(15, 48, 87, 0.05)'
            }}
          >
            <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{card.icon}</div>
            <h2 style={{ color: '#17324d', fontSize: '1.1rem', marginBottom: '0.45rem' }}>{card.title}</h2>
            <p style={{ color: '#5b6d7e', lineHeight: '1.6', margin: 0 }}>{card.text}</p>
          </div>
        ))}
      </div>

      <div
        style={{
          backgroundColor: '#fffdf7',
          border: '1px solid #f0dfad',
          borderRadius: '18px',
          padding: '1rem 1rem 0.8rem',
          marginBottom: '1rem'
        }}
      >
        <h2 style={{ marginTop: 0, color: '#7a5200' }}>Beliebte Fragen</h2>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {quickQuestions.map((question) => (
            <button
              key={question}
              onClick={() => sendPrompt(question)}
              style={{
                backgroundColor: '#ffffff',
                color: '#17324d',
                border: '1px solid #d8e2eb',
                borderRadius: '999px',
                padding: '0.65rem 0.9rem',
                cursor: 'pointer'
              }}
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          position: 'fixed',
          right: '16px',
          bottom: 'calc(92px + env(safe-area-inset-bottom) + 12px)',
          zIndex: 1200,
          width: 'min(380px, calc(100vw - 1rem))'
        }}
      >
        {isOpen ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #d7e4ef',
              boxShadow: '0 18px 35px rgba(15, 48, 87, 0.18)',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #1f7ae0 0%, #0f7b6c 100%)',
                color: '#ffffff',
                padding: '0.9rem 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <div>
                <div style={{ fontWeight: 800 }}>💬 Hilfecenter</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Fragen Sie einfach los</div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.18)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  minHeight: '40px',
                  padding: '0.45rem 0.7rem',
                  cursor: 'pointer'
                }}
              >
                −
              </button>
            </div>

            <div style={{ maxHeight: 'min(360px, calc(100vh - 280px))', overflowY: 'auto', padding: '1rem', display: 'grid', gap: '0.75rem', backgroundColor: '#f8fbfe' }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    justifySelf: message.role === 'user' ? 'end' : 'start',
                    maxWidth: '88%',
                    backgroundColor: message.role === 'user' ? '#dff3ff' : '#ffffff',
                    border: `1px solid ${message.role === 'user' ? '#b5ddf7' : '#dde8f1'}`,
                    borderRadius: '16px',
                    padding: '0.8rem 0.9rem',
                    color: '#17324d',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-line'
                  }}
                >
                  {message.content}
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => speakGermanText(message.content, { rate: 0.92, pitch: 1, volume: 1 })}
                      style={{
                        display: 'block',
                        marginTop: '0.55rem',
                        backgroundColor: '#eef5fb',
                        color: '#17456e',
                        border: '1px solid #cfe0f3',
                        borderRadius: '10px',
                        padding: '0.45rem 0.7rem',
                        cursor: 'pointer',
                        minHeight: '38px'
                      }}
                    >
                      🔊 Vorlesen
                    </button>
                  )}
                </div>
              ))}

              {loading && (
                <div
                  style={{
                    justifySelf: 'start',
                    maxWidth: '88%',
                    backgroundColor: '#ffffff',
                    border: '1px solid #dde8f1',
                    borderRadius: '16px',
                    padding: '0.8rem 0.9rem',
                    color: '#5b6d7e'
                  }}
                >
                  ⏳ Antwort wird vorbereitet...
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.6rem', padding: '0.9rem', borderTop: '1px solid #e3edf6', backgroundColor: '#ffffff' }}>
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Frage eingeben..."
                disabled={loading}
                style={{ flex: 1, padding: '0.8rem 0.9rem', fontSize: '0.95rem' }}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                style={{
                  backgroundColor: loading || !input.trim() ? '#b7c7d8' : '#1f7ae0',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.8rem 0.95rem',
                  cursor: loading || !input.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                Senden
              </button>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #1f7ae0 0%, #0f7b6c 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '18px',
              padding: '0.9rem 1rem',
              boxShadow: '0 14px 26px rgba(15, 48, 87, 0.2)',
              cursor: 'pointer'
            }}
          >
            💬 Hilfecenter öffnen
          </button>
        )}
      </div>
    </div>
  );
};

export default Help;
