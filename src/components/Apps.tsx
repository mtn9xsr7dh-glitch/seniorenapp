import React from 'react';
import Mascot from './Mascot';

interface AppItem {
  name: string;
  icon: string;
  description: string;
  purpose: string;
}

interface AppCategory {
  title: string;
  subtitle: string;
  color: string;
  background: string;
  apps: AppItem[];
}

const appCategories: AppCategory[] = [
  {
    title: 'Kommunikation',
    subtitle: 'Für Nachrichten, Anrufe und Kontakt mit Familie.',
    color: '#2e7d32',
    background: 'linear-gradient(135deg, #f1fff5 0%, #e2f6e8 100%)',
    apps: [
      {
        name: 'WhatsApp',
        icon: '💬',
        description: 'Nachrichten schreiben, Bilder senden und Videoanrufe führen.',
        purpose: 'Ideal, um mit Familie und Freunden in Kontakt zu bleiben.'
      },
      {
        name: 'Signal',
        icon: '🔐',
        description: 'Sichere Alternative für Nachrichten und Anrufe.',
        purpose: 'Gut für mehr Datenschutz bei der Kommunikation.'
      },
      {
        name: 'Skype / Zoom',
        icon: '🎥',
        description: 'Einfache Videoanrufe für Gespräche von zuhause aus.',
        purpose: 'Praktisch für Familienrunden oder Arztgespräche per Video.'
      }
    ]
  },
  {
    title: 'Navigation & Reisen',
    subtitle: 'Hilft unterwegs beim Finden von Wegen und Verbindungen.',
    color: '#1565c0',
    background: 'linear-gradient(135deg, #eef7ff 0%, #dff0ff 100%)',
    apps: [
      {
        name: 'Google Maps',
        icon: '🗺️',
        description: 'Zeigt Wege zu Fuß, mit dem Auto oder Bus und Bahn.',
        purpose: 'Hilft sicher ans Ziel zu kommen.'
      },
      {
        name: 'DB Navigator',
        icon: '🚆',
        description: 'Fahrpläne, Verbindungen und Tickets für die Bahn.',
        purpose: 'Nützlich für Reisen und Ausflüge in Deutschland.'
      },
      {
        name: 'ÖPNV-App der Stadt',
        icon: '🚌',
        description: 'Aktuelle Abfahrten und Nahverkehr in Ihrer Region.',
        purpose: 'Sehr praktisch für Bus und Straßenbahn im Alltag.'
      }
    ]
  },


  {
    title: 'Unterhaltung',
    subtitle: 'Für Lesen, Musik, Videos und Entspannung.',
    color: '#6a1b9a',
    background: 'linear-gradient(135deg, #faf2ff 0%, #f1e2ff 100%)',
    apps: [
      {
        name: 'YouTube',
        icon: '▶️',
        description: 'Videos zu Musik, Nachrichten, Anleitungen und Hobbys.',
        purpose: 'Ideal zum Lernen und Unterhalten.'
      },
      {
        name: 'Spotify / Radio-App',
        icon: '🎵',
        description: 'Musik, Hörspiele und Radiosender anhören.',
        purpose: 'Schön für Entspannung zuhause oder unterwegs.'
      },
      {
        name: 'Kindle / eBook-App',
        icon: '📖',
        description: 'Digitale Bücher auf dem Smartphone lesen.',
        purpose: 'Praktisch für Lesefreunde mit großer Schrift.'
      }
    ]
  }
];

const Apps: React.FC = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#1976d2', marginBottom: '0.8rem', fontSize: '2.7rem' }}>
        📲 Wichtige Apps
      </h1>
      <p style={{ textAlign: 'center', color: '#587086', maxWidth: '760px', margin: '0 auto 2rem', lineHeight: '1.7' }}>
        Hier finden Sie nützliche Apps in verschiedenen Kategorien – einfach erklärt und passend für den Alltag.
      </p>

      <div style={{ display: 'grid', gap: '1.25rem' }}>
        {appCategories.map((category) => (
          <section
            key={category.title}
            style={{
              background: category.background,
              borderRadius: '22px',
              padding: '1.5rem',
              border: `2px solid ${category.color}22`,
              boxShadow: '0 12px 28px rgba(15, 48, 87, 0.06)'
            }}
          >
            <div style={{ marginBottom: '1rem' }}>
              <h2 style={{ margin: '0 0 0.35rem 0', color: category.color, fontSize: '1.6rem' }}>
                {category.title}
              </h2>
              <p style={{ margin: 0, color: '#52687b' }}>{category.subtitle}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {category.apps.map((app) => (
                <div
                  key={app.name}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '18px',
                    padding: '1rem',
                    border: '1px solid #d8e6f3'
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{app.icon}</div>
                  <h3 style={{ margin: '0 0 0.45rem 0', color: '#17324d' }}>{app.name}</h3>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#5a6f82', lineHeight: '1.55' }}>{app.description}</p>
                  <div style={{ color: '#2f4d68', fontWeight: 600 }}>{app.purpose}</div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div style={{ marginTop: '1.5rem', backgroundColor: '#fff8e1', border: '2px solid #ffcc80', borderRadius: '18px', padding: '1rem 1.2rem', color: '#7a5200' }}>
        <strong>💡 Tipp:</strong> Installieren Sie nur Apps aus dem offiziellen <strong>App Store</strong> oder <strong>Google Play Store</strong>.
      </div>

      <Mascot context="home" size="small" />
    </div>
  );
};

export default Apps;
