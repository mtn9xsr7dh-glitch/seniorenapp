import React from 'react';
import { Link } from 'react-router-dom';

const infoCards = [
  {
    icon: '💬',
    title: 'Fragen sammeln',
    text: 'Hier können wir als Nächstes gemeinsam festlegen, welche Hilfe-Themen wichtig sind.'
  },
  {
    icon: '🪜',
    title: 'Schritt für Schritt',
    text: 'Später können wir diesen Bereich mit einfachen Anleitungen und klaren Erklärungen ausbauen.'
  },
  {
    icon: '🛠️',
    title: 'Gemeinsam erweitern',
    text: 'Design, Inhalte und Funktionen können wir jetzt ganz gezielt zusammen ergänzen.'
  }
];

const Help: React.FC = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
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
          🆘 Hilfe-Bereich
        </div>

        <h1 style={{ color: '#12395b', fontSize: '2.3rem', marginBottom: '0.75rem' }}>
          Hilfe wird jetzt neu integriert
        </h1>
        <p style={{ color: '#5b6d7e', lineHeight: '1.7', maxWidth: '760px', marginBottom: '1rem' }}>
          Dieser Bereich ist als fester dritter Reiter vorbereitet. Als Nächstes können wir ihn gemeinsam mit den genauen
          Funktionen, Fragen und Hilfen füllen.
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
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
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
    </div>
  );
};

export default Help;
