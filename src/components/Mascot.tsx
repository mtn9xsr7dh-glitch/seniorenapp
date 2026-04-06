import React, { useState, useEffect } from 'react';

interface MascotProps {
  context?: 'home' | 'games' | 'quiz' | 'progress' | 'help' | 'stories';
  size?: 'small' | 'medium' | 'large';
}

const Mascot: React.FC<MascotProps> = ({ context = 'home', size = 'small' }) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  const messages = {
    home: [
      'Willkommen zurück! Bereit für neue Abenteuer? 🎉',
      'Du machst das großartig! Weiter so! 🌟',
      'Jeder kleine Schritt zählt! 🚀',
      'Lernen macht Spaß mit dir! 😊',
      'Dein Wissen wächst jeden Tag! 📚'
    ],
    games: [
      'Spielen macht schlau! 🧠',
      'Du bist ein Gedächtnis-Champion! 🏆',
      'Toll gespielt! Mach weiter so! 🎮',
      'Dein Gehirn wird jeden Tag stärker! 💪',
      'Spaß und Lernen gleichzeitig! 🎯'
    ],
    quiz: [
      'Du weißt schon so viel! 🧠',
      'Jede Frage bringt dich weiter! 📝',
      'Sei stolz auf dein Wissen! 🌟',
      'Lernen ist dein Superhelden-Kraft! 🦸',
      'Du bist ein echter Wissensheld! 🎓'
    ],
    progress: [
      'Schau mal, wie weit du gekommen bist! 📈',
      'Deine Punkte wachsen wie ein Baum! 🌳',
      'Du bist ein echter Champion! 🏆',
      'Jeder Punkt ist ein Sieg! 🎉',
      'Dein Fortschritt macht mich stolz! 😊'
    ],
    help: [
      'Fragen stellen ist klug! 🤔',
      'Du findest immer die richtigen Antworten! 💡',
      'Hilfe holen ist keine Schwäche! 🌟',
      'Gemeinsam lösen wir jedes Problem! 🤝',
      'Du bist auf dem besten Weg! 🚀'
    ],
    stories: [
      'Eine schöne Geschichte tut der Seele gut! 📚',
      'Zeit für eine kleine Lesepause! ☕',
      'Geschichten machen den Tag wärmer! 🌞',
      'Lass dich von einer Erzählung begleiten! ✨',
      'Heute wartet wieder eine neue Geschichte! 🌷'
    ]
  };

  useEffect(() => {
    const contextMessages = messages[context];
    const randomMessage = contextMessages[Math.floor(Math.random() * contextMessages.length)];
    setCurrentMessage(randomMessage);

    // Change message every 30 seconds
    const interval = setInterval(() => {
      const newMessage = contextMessages[Math.floor(Math.random() * contextMessages.length)];
      setCurrentMessage(newMessage);
    }, 30000);

    return () => clearInterval(interval);
  }, [context]);

  const sizeStyles = {
    small: { fontSize: '2rem', padding: '0.5rem' },
    medium: { fontSize: '3rem', padding: '1rem' },
    large: { fontSize: '4rem', padding: '1.5rem' }
  };

  const handleClick = () => {
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 5000); // Reappear after 5 seconds
  };

  if (!isVisible) return null;

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#fff3e0',
        border: '3px solid #ff9800',
        borderRadius: '50%',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
        transition: 'transform 0.2s ease',
        ...sizeStyles[size]
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      title="Klick mich für eine Überraschung!"
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: size === 'small' ? '2rem' : size === 'medium' ? '3rem' : '4rem', marginBottom: '0.25rem' }}>
          🐻
        </div>
        {size !== 'small' && (
          <div style={{
            fontSize: size === 'medium' ? '0.8rem' : '1rem',
            color: '#e65100',
            fontWeight: 'bold',
            maxWidth: '120px',
            lineHeight: '1.2'
          }}>
            {currentMessage}
          </div>
        )}
      </div>

      {/* Speech bubble for small size */}
      {size === 'small' && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          right: '10px',
          backgroundColor: 'white',
          border: '2px solid #ff9800',
          borderRadius: '15px',
          padding: '0.5rem',
          maxWidth: '200px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          fontSize: '0.8rem',
          color: '#333',
          marginBottom: '10px'
        }}>
          <div style={{
            position: 'absolute',
            top: '100%',
            right: '20px',
            width: '0',
            height: '0',
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '10px solid #ff9800'
          }}></div>
          <div style={{
            position: 'absolute',
            top: '100%',
            right: '22px',
            width: '0',
            height: '0',
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '8px solid white'
          }}></div>
          {currentMessage}
        </div>
      )}
    </div>
  );
};

export default Mascot;