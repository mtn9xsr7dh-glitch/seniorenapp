import { ReactNode, useEffect, useState } from 'react';
import { BrowserRouter as Router, NavLink, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Scams from './components/Scams';
import Help from './components/Help';
import Symbols from './components/Symbols';
import Quiz from './components/Quiz';
import Games from './components/Games';
import Progress from './components/Progress';
import ImportantNumbers from './components/ImportantNumbers';
import Workouts from './components/Workouts';
import Stories from './components/Stories';
import Apps from './components/Apps';
import Tutorial from './components/Tutorial';
import './App.css';

interface SubscriptionState {
  isActive: boolean;
  plan: 'monthly' | 'yearly' | null;
  startedAt?: string;
  trialEndsAt?: string;
}

const SUBSCRIPTION_KEY = 'rentnerApp_subscription';

function SubscriptionGate({ children }: { children: ReactNode }) {
  const [subscription, setSubscription] = useState<SubscriptionState>({ isActive: false, plan: null });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedSubscription = localStorage.getItem(SUBSCRIPTION_KEY);
    if (savedSubscription) {
      try {
        setSubscription(JSON.parse(savedSubscription) as SubscriptionState);
      } catch (err) {
        console.error('Abo-Status konnte nicht geladen werden', err);
      }
    }
    setLoaded(true);
  }, []);

  const activateSubscription = (plan: 'monthly' | 'yearly') => {
    const startedAt = new Date();
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 7);

    const nextSubscription: SubscriptionState = {
      isActive: true,
      plan,
      startedAt: startedAt.toISOString(),
      trialEndsAt: trialEndsAt.toISOString(),
    };

    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(nextSubscription));
    setSubscription(nextSubscription);
  };

  if (!loaded) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#456' }}>Lade Premium-Zugang…</div>;
  }

  if (subscription.isActive) {
    return <>{children}</>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '920px', margin: '0 auto' }}>
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #eef7ff 100%)',
        borderRadius: '24px',
        padding: '2rem',
        border: '1px solid #dbe8f6',
        boxShadow: '0 18px 40px rgba(15, 48, 87, 0.08)',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem', color: '#12395b' }}>💎 Premium-Abo für alle Funktionen</h1>
        <p style={{ fontSize: '1.08rem', color: '#55697d', marginBottom: '1.5rem' }}>
          Alle Bereiche der App sind im Premium-Abo enthalten – inklusive <strong>7 Tage kostenlos testen</strong>.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          <div style={{ backgroundColor: '#fff', border: '2px solid #2196f3', borderRadius: '18px', padding: '1.5rem', textAlign: 'left' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1565c0', marginBottom: '0.5rem' }}>Monatsabo</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#12395b' }}>7,99 €</div>
            <div style={{ color: '#607285', marginBottom: '1rem' }}>pro Monat</div>
            <ul style={{ color: '#4f6375', lineHeight: '1.7', paddingLeft: '1.2rem' }}>
              <li>7 Tage kostenlos</li>
              <li>KI-Hilfe & Schritt-für-Schritt-Hilfe</li>
              <li>Spiele, Workouts, Fortschritt & alle Bereiche</li>
            </ul>
            <button
              onClick={() => activateSubscription('monthly')}
              style={{ width: '100%', backgroundColor: '#2196f3', color: 'white', border: 'none', borderRadius: '12px', padding: '0.9rem 1rem', fontSize: '1rem', cursor: 'pointer' }}
            >
              7 Tage kostenlos starten
            </button>
          </div>

          <div style={{ backgroundColor: '#fff', border: '2px solid #4caf50', borderRadius: '18px', padding: '1.5rem', textAlign: 'left', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', right: '16px', backgroundColor: '#4caf50', color: 'white', padding: '0.3rem 0.7rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700 }}>Beliebt</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2e7d32', marginBottom: '0.5rem' }}>12 Monate</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#12395b' }}>4,99 €</div>
            <div style={{ color: '#607285', marginBottom: '1rem' }}>pro Monat · jährliche Abrechnung</div>
            <ul style={{ color: '#4f6375', lineHeight: '1.7', paddingLeft: '1.2rem' }}>
              <li>7 Tage kostenlos</li>
              <li>bester Preis für alle Funktionen</li>
              <li>voller Zugang zur kompletten App</li>
            </ul>
            <button
              onClick={() => activateSubscription('yearly')}
              style={{ width: '100%', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '12px', padding: '0.9rem 1rem', fontSize: '1rem', cursor: 'pointer' }}
            >
              Jahresabo mit Testphase wählen
            </button>
          </div>
        </div>

        <p style={{ marginTop: '1rem', color: '#74879a', fontSize: '0.92rem' }}>
          Demo-Hinweis: Aktuell ist dies eine lokale Abo-Demo ohne echte Zahlungsabwicklung.
        </p>
      </div>
    </div>
  );
}

function App() {
  const withSubscription = (element: ReactNode) => (
    <SubscriptionGate>{element}</SubscriptionGate>
  );

  const navigationItems = [
    { to: '/', label: 'Start', icon: '🏠' },
    { to: '/tutorial', label: 'Anleitung', icon: '🧭' },
    { to: '/help', label: 'Hilfe', icon: '🤖' },
    { to: '/scams', label: 'Sicherheit', icon: '🛡️' },
    { to: '/quiz', label: 'Quiz', icon: '🎯' },
    { to: '/games', label: 'Spiele', icon: '🎮' },
    { to: '/apps', label: 'Apps', icon: '📲' },
    { to: '/numbers', label: 'Nummern', icon: '📞' },
    { to: '/workouts', label: 'Fitness', icon: '🏃‍♂️' },
    { to: '/stories', label: 'Lesestube', icon: '📚' },
    { to: '/progress', label: 'Fortschritt', icon: '🏆' },
  ];

  return (
    <Router>
      <div className="app-shell">
        <header className="app-header">
          <div className="app-header-inner">
            <div>
              <div className="app-brand-badge">👴 Senioren Portal</div>
              <h1 className="app-brand-title">Gut lesbar und leicht zu bedienen</h1>
              <p className="app-brand-text">Alle Bereiche sind groß beschriftet und bewusst einfach aufgebaut.</p>
            </div>
            <div className="app-header-tip">🧭 Wenn Sie neu sind, beginnen Sie mit „Anleitung“.</div>
          </div>

          <nav className="app-nav" aria-label="Hauptnavigation">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `app-nav-link${isActive ? ' active' : ''}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tutorial" element={<Tutorial />} />
            <Route path="/scams" element={withSubscription(<Scams />)} />
            <Route path="/help" element={withSubscription(<Help />)} />
            <Route path="/symbols" element={withSubscription(<Symbols />)} />
            <Route path="/quiz" element={withSubscription(<Quiz />)} />
            <Route path="/games" element={withSubscription(<Games />)} />
            <Route path="/progress" element={withSubscription(<Progress />)} />
            <Route path="/numbers" element={withSubscription(<ImportantNumbers />)} />
            <Route path="/apps" element={withSubscription(<Apps />)} />
            <Route path="/workouts" element={withSubscription(<Workouts />)} />
            <Route path="/stories" element={withSubscription(<Stories />)} />
          </Routes>
        </main>

        <footer className="app-footer">
          <strong>💡 Tipp:</strong> Alles funktioniert per einfachem Antippen – Sie können nichts kaputt machen.
        </footer>
      </div>
    </Router>
  );
}

export default App;