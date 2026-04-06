import React from 'react';
import { Link } from 'react-router-dom';
import Mascot from './Mascot';

const steps = [
  {
    number: '1',
    title: 'Startseite öffnen',
    text: 'Auf der Startseite sehen Sie alle Bereiche als große, gut erkennbare Kacheln.'
  },
  {
    number: '2',
    title: 'Bereich antippen',
    text: 'Tippen Sie einfach auf Quiz, Spiele, Fitness oder einen anderen gewünschten Bereich.'
  },
  {
    number: '3',
    title: 'In Ruhe lesen oder vorlesen lassen',
    text: 'Viele Inhalte können Sie direkt lesen oder sich bequem vorlesen lassen.'
  },
  {
    number: '4',
    title: 'Täglich kurz zurückkommen',
    text: 'Mit Punkten, Tageszielen und einfachen Übungen bleiben Sie jeden Tag aktiv.'
  }
];

const tutorialCards = [
  {
    icon: '🧭',
    title: 'Obere Navigation',
    text: 'Ganz oben finden Sie die wichtigsten Bereiche der App als große Schaltflächen.'
  },
  {
    icon: '👆',
    title: 'Einmal tippen reicht',
    text: 'Zum Öffnen genügt ein einzelner Tipp auf eine Kachel oder Schaltfläche.'
  },
  {
    icon: '🔊',
    title: 'Vorlesen nutzen',
    text: 'Bei vielen Themen können Sie sich Texte anhören, wenn Lesen anstrengend ist.'
  },
  {
    icon: '🏠',
    title: 'Zur Startseite zurück',
    text: 'Über „Start“ in der Navigation kommen Sie jederzeit wieder zur Übersicht.'
  }
];

const Tutorial: React.FC = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #eef7ff 100%)',
        borderRadius: '26px',
        padding: '2rem',
        border: '1px solid #dbe8f6',
        boxShadow: '0 18px 40px rgba(15, 48, 87, 0.08)',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'inline-flex', backgroundColor: '#e8f2ff', color: '#155b8e', borderRadius: '999px', padding: '0.45rem 0.9rem', fontWeight: 700, marginBottom: '1rem' }}>
          🧭 Bedienungs-Tutorial
        </div>
        <h1 style={{ color: '#12395b', fontSize: '2.5rem', marginBottom: '0.75rem' }}>So bedienen Sie die App ganz einfach</h1>
        <p style={{ color: '#5b6d7e', lineHeight: '1.7', maxWidth: '760px', marginBottom: '1rem' }}>
          Diese App wurde so aufgebaut, dass sie für Senioren klar, ruhig und leicht verständlich bleibt. Folgen Sie einfach den vier Schritten unten.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/" style={{ textDecoration: 'none', backgroundColor: '#2196f3', color: '#fff', padding: '0.8rem 1rem', borderRadius: '12px', fontWeight: 700 }}>
            🏠 Zur Startseite
          </Link>
          <Link to="/quiz" style={{ textDecoration: 'none', backgroundColor: '#fff', color: '#17456e', border: '1px solid #cfe0f3', padding: '0.8rem 1rem', borderRadius: '12px', fontWeight: 700 }}>
            🎯 Quiz öffnen
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {steps.map((step) => (
          <div
            key={step.number}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '1.2rem',
              border: '1px solid #dbe8f6',
              boxShadow: '0 10px 24px rgba(15, 48, 87, 0.05)'
            }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#e3f2fd', color: '#1565c0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '0.8rem' }}>
              {step.number}
            </div>
            <h2 style={{ color: '#17324d', fontSize: '1.15rem', marginBottom: '0.45rem' }}>{step.title}</h2>
            <p style={{ color: '#5b6d7e', lineHeight: '1.6', margin: 0 }}>{step.text}</p>
          </div>
        ))}
      </div>

      <div style={{
        backgroundColor: '#fffdf3',
        border: '2px solid #ffe082',
        borderRadius: '22px',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{ color: '#8a5a00', marginBottom: '0.9rem' }}>✨ Woran Sie sich orientieren können</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {tutorialCards.map((card) => (
            <div key={card.title} style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '1rem', border: '1px solid #f5d778' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.45rem' }}>{card.icon}</div>
              <h3 style={{ margin: '0 0 0.35rem 0', color: '#5c4600' }}>{card.title}</h3>
              <p style={{ margin: 0, color: '#6d5b27', lineHeight: '1.55' }}>{card.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #f4fbff 0%, #eefaf5 100%)',
        borderRadius: '22px',
        padding: '1.5rem',
        border: '1px solid #dbe8f6'
      }}>
        <h2 style={{ color: '#12395b', marginBottom: '0.8rem' }}>🚀 Empfohlener Einstieg</h2>
        <ol style={{ color: '#52687b', lineHeight: '1.8', paddingLeft: '1.2rem', marginBottom: '1rem' }}>
          <li>Zuerst <strong>Betrug vermeiden</strong> oder die <strong>Anleitung</strong> öffnen</li>
          <li>Danach ein <strong>Quiz</strong> oder <strong>Spiel</strong> ausprobieren</li>
          <li>Zum Schluss in <strong>Fitness</strong> oder <strong>Lesestube</strong> schauen</li>
        </ol>
        <p style={{ margin: 0, color: '#5b6d7e' }}>
          Sie können nichts kaputt machen – tippen Sie sich einfach in Ruhe durch die App.
        </p>
      </div>

      <Mascot context="home" size="small" />
    </div>
  );
};

export default Tutorial;
