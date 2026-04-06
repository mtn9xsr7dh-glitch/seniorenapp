import { CSSProperties, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DailyTask, claimDailyVisitBonus, loadDailyProgress, loadStats } from '../utils/progressUtils';
import Mascot from './Mascot';

interface HomeStats {
  totalPoints: number;
  level: number;
  unlockedCount: number;
  achievementCount: number;
  levelName: string;
  pointsToNext: number;
  dailyStreak: number;
  dailyCompleted: number;
  dailyTotal: number;
  dailyTasks: DailyTask[];
  visitBonus: number;
}

const taskLinks: Record<DailyTask['type'], string> = {
  games: '/games',
  help: '/help',
  quiz: '/quiz',
  workout: '/workouts'
};

const Home = () => {
  const [stats, setStats] = useState<HomeStats>({
    totalPoints: 0,
    level: 1,
    unlockedCount: 0,
    achievementCount: 0,
    levelName: 'Anfänger',
    pointsToNext: 100,
    dailyStreak: 0,
    dailyCompleted: 0,
    dailyTotal: 0,
    dailyTasks: [],
    visitBonus: 0
  });

  useEffect(() => {
    const visitBonus = claimDailyVisitBonus();
    const savedStats = loadStats();
    const daily = loadDailyProgress();
    const unlockedCount = savedStats.achievements.filter(a => a.unlocked).length;
    const nextLevelThreshold = savedStats.level * 100;
    const pointsToNext = Math.max(0, nextLevelThreshold - savedStats.totalPoints);

    const levelNames = [
      'Anfänger', 'Lernender', 'Fortgeschrittener', 'Experte', 'Meister',
      'Champion', 'Legende', 'Superstar', 'Guru', 'Genie'
    ];

    setStats({
      totalPoints: savedStats.totalPoints,
      level: savedStats.level,
      unlockedCount,
      achievementCount: savedStats.achievements.length,
      levelName: levelNames[Math.min(savedStats.level - 1, levelNames.length - 1)] || 'Genie',
      pointsToNext,
      dailyStreak: daily.streak,
      dailyCompleted: daily.tasks.filter(task => task.completed).length,
      dailyTotal: daily.tasks.length,
      dailyTasks: daily.tasks,
      visitBonus
    });
  }, []);

  const dailyProgress = stats.dailyTotal > 0 ? Math.round((stats.dailyCompleted / stats.dailyTotal) * 100) : 0;
  const dailyHeadline = stats.dailyCompleted === stats.dailyTotal && stats.dailyTotal > 0
    ? 'Perfekt – heute ist schon alles geschafft.'
    : stats.dailyCompleted > 0
      ? 'Sehr gut – bleiben Sie heute weiter dran.'
      : 'Ein kleiner Schritt heute reicht schon für einen guten Start.';

  const quickGuide = [
    {
      step: '1',
      title: 'Bereich wählen',
      text: 'Tippen Sie oben oder auf der Startseite auf das Thema, das Sie brauchen.'
    },
    {
      step: '2',
      title: 'In Ruhe lesen',
      text: 'Alle Inhalte sind einfach erklärt und mit großen Bereichen aufgebaut.'
    },
    {
      step: '3',
      title: 'Vorlesen nutzen',
      text: 'Bei vielen Themen können Sie sich Texte direkt anhören lassen.'
    }
  ];

  const featureCards = [
    {
      to: '/tutorial',
      icon: '🧭',
      title: 'App-Anleitung',
      description: 'Eine einfache Einführung, wie Sie sich sicher und entspannt durch die App bewegen.',
      accent: '#3949ab',
      background: 'linear-gradient(135deg, #f2f4ff 0%, #e4e8ff 100%)'
    },
    {
      to: '/scams',
      icon: '🛡️',
      title: 'Betrug vermeiden',
      description: 'Erkennen Sie gefährliche Nachrichten und schützen Sie sich vor typischen Betrugsmaschen.',
      accent: '#e53935',
      background: 'linear-gradient(135deg, #fff4f5 0%, #ffe6ea 100%)'
    },
    {
      to: '/help',
      icon: '🤖',
      title: 'Smartphone Hilfe',
      description: 'Die KI erklärt technische Fragen kurz, konkret und leicht verständlich.',
      accent: '#43a047',
      background: 'linear-gradient(135deg, #f1fff5 0%, #e3f6e8 100%)'
    },
    {
      to: '/symbols',
      icon: '📱',
      title: 'Symbole erklärt',
      description: 'Verstehen Sie wichtige Zeichen und Anzeigen auf Ihrem Smartphone sofort besser.',
      accent: '#fb8c00',
      background: 'linear-gradient(135deg, #fff8ef 0%, #ffeccf 100%)'
    },
    {
      to: '/quiz',
      icon: '🎯',
      title: 'Wissens-Quiz',
      description: 'Prüfen Sie Ihr Wissen zu Sicherheit und Smartphone-Nutzung auf spielerische Weise.',
      accent: '#8e24aa',
      background: 'linear-gradient(135deg, #faf1ff 0%, #f1defb 100%)'
    },
    {
      to: '/games',
      icon: '🎮',
      title: 'Spiele & Gedächtnis',
      description: 'Trainieren Sie Aufmerksamkeit, Reaktion und Gedächtnis mit einfachen Spielen.',
      accent: '#f4511e',
      background: 'linear-gradient(135deg, #fff5ef 0%, #ffe4d8 100%)'
    },
    {
      to: '/stories',
      icon: '📚',
      title: 'Lesestube',
      description: 'Entdecken Sie immer neue schöne Geschichten zum Lesen, Entspannen und Vorlesen.',
      accent: '#6a1b9a',
      background: 'linear-gradient(135deg, #faf2ff 0%, #f1e2ff 100%)'
    },
    {
      to: '/progress',
      icon: '🏆',
      title: 'Mein Fortschritt',
      description: 'Sehen Sie Punkte, Level und freigeschaltete Erfolge auf einen Blick.',
      accent: '#2e7d32',
      background: 'linear-gradient(135deg, #f2fff4 0%, #def3e3 100%)'
    },
    {
      to: '/numbers',
      icon: '📞',
      title: 'Wichtige Nummern',
      description: 'Notruf, Behörden und wichtige Kontakte sind schnell erreichbar an einem Ort.',
      accent: '#1e88e5',
      background: 'linear-gradient(135deg, #eef7ff 0%, #dff0ff 100%)'
    },
    {
      to: '/apps',
      icon: '📲',
      title: 'Wichtige Apps',
      description: 'Die nützlichsten Handy-Apps übersichtlich nach Kategorien erklärt.',
      accent: '#00897b',
      background: 'linear-gradient(135deg, #effffb 0%, #daf5ee 100%)'
    },
    {
      to: '/workouts',
      icon: '🏃‍♂️',
      title: 'Fitness für Senioren',
      description: 'Sanfte Übungen für Balance, Beweglichkeit und mehr Wohlbefinden im Alltag.',
      accent: '#039be5',
      background: 'linear-gradient(135deg, #eef9ff 0%, #dff2ff 100%)'
    }
  ];

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-layout">
          <div>
            <div className="home-badge">✨ Einfach • Sicher • Seniorengerecht</div>
            <h1 className="home-title">👴 Senioren Portal</h1>
            <p className="home-subtitle">
              Hier finden Sie alle Funktionen ruhig, gut lesbar und ohne unnötige Ablenkung an einem Ort.
            </p>
          </div>

          <div className="home-hero-callout">
            <h3>🧭 So starten Sie</h3>
            <ul>
              <li>Einen Bereich oben auswählen</li>
              <li>Alles Schritt für Schritt in Ruhe ansehen</li>
              <li>Mit „Start“ jederzeit zurückkehren</li>
            </ul>
            <Link to="/tutorial" className="home-hero-link">Anleitung ansehen →</Link>
          </div>
        </div>

        <div className="home-shortcut-section">
          <div className="home-shortcut-title">⚡ Schnellzugriff auf alle Bereiche</div>
          <div className="home-shortcut-grid">
            {featureCards.map((card) => (
              <Link key={`shortcut-${card.to}`} to={card.to} className="home-shortcut-chip">
                <span>{card.icon}</span>
                <span>{card.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-guide-panel">
        <div className="home-stats-header">
          <div>
            <h2>So nutzen Sie die App</h2>
            <p>In wenigen Schritten finden Sie sich sicher und entspannt zurecht.</p>
          </div>
          <div className="home-progress-pill">📘 Tutorial inklusive</div>
        </div>

        <div className="home-guide-grid">
          {quickGuide.map((item) => (
            <div key={item.step} className="home-guide-card">
              <div className="home-guide-step">{item.step}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-stats-panel">
        <div className="home-stats-header">
          <div>
            <h2>Ihr Überblick</h2>
            <p>Behalten Sie Punkte, Level und Erfolge jederzeit im Blick.</p>
          </div>
          <div className="home-progress-pill">
            Noch {stats.pointsToNext} Punkte bis Level {stats.level + 1}
          </div>
        </div>

        <div className="home-stat-grid">
          <div className="home-stat-card">
            <div className="home-stat-label">Aktiv Punkte</div>
            <div className="home-stat-value">{stats.totalPoints}</div>
          </div>
          <div className="home-stat-card">
            <div className="home-stat-label">Level</div>
            <div className="home-stat-value">{stats.level}</div>
            <div className="home-stat-subtext">{stats.levelName}</div>
          </div>
          <div className="home-stat-card">
            <div className="home-stat-label">Erfolge</div>
            <div className="home-stat-value">{stats.unlockedCount}/{stats.achievementCount}</div>
          </div>
        </div>

        <p className="home-progress-link">
          Mehr Details im <Link to="/progress" style={{ color: '#1976d2', textDecoration: 'underline' }}>Aktiv Punkte Bereich</Link>
        </p>
      </section>

      <section className="home-stats-panel" style={{ background: 'linear-gradient(135deg, #fffdf3 0%, #fff7dc 100%)', border: '1px solid #f1d98a' }}>
        <div className="home-stats-header">
          <div>
            <h2>🔥 Tägliche Motivation</h2>
            <p>{dailyHeadline} Kommen Sie jeden Tag kurz zurück und sammeln Sie Extra-Punkte.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <div className="home-progress-pill">🔥 Serie: {stats.dailyStreak} Tage</div>
            <div className="home-progress-pill">✅ Heute: {stats.dailyCompleted}/{stats.dailyTotal}</div>
          </div>
        </div>

        {stats.visitBonus > 0 && (
          <div style={{
            backgroundColor: '#ffffff',
            border: '2px solid #ffca28',
            color: '#8a5a00',
            borderRadius: '16px',
            padding: '0.9rem 1rem',
            marginBottom: '1rem',
            fontWeight: 700
          }}>
            🎁 Tagesbonus gesichert: +{stats.visitBonus} Punkte fürs Wiederkommen heute.
          </div>
        )}

        <div style={{ height: '14px', backgroundColor: '#efe2b2', borderRadius: '999px', overflow: 'hidden', marginBottom: '1.25rem' }}>
          <div style={{ width: `${dailyProgress}%`, height: '100%', background: 'linear-gradient(135deg, #ffb300, #fb8c00)', transition: 'width 0.3s ease' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {stats.dailyTasks.map((task) => (
            <div
              key={task.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '18px',
                padding: '1rem',
                border: `2px solid ${task.completed ? '#66bb6a' : '#d7e6f5'}`,
                boxShadow: '0 8px 18px rgba(15, 48, 87, 0.05)'
              }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{task.icon}</div>
              <h3 style={{ margin: '0 0 0.4rem 0', color: '#17324d', fontSize: '1.05rem' }}>{task.title}</h3>
              <p style={{ margin: 0, color: '#5f7488', lineHeight: 1.5, minHeight: '48px' }}>{task.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginTop: '0.9rem' }}>
                <strong style={{ color: task.completed ? '#2e7d32' : '#17456e' }}>{task.progress}/{task.target}</strong>
                <Link
                  to={taskLinks[task.type]}
                  style={{
                    textDecoration: 'none',
                    color: task.completed ? '#2e7d32' : '#1976d2',
                    fontWeight: 700
                  }}
                >
                  {task.completed ? 'Nochmal öffnen →' : 'Jetzt starten →'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="home-feature-grid">
        {featureCards.map((card) => (
          <Link key={card.to} to={card.to} className="home-feature-link">
            <div
              className="home-feature-card"
              style={{
                '--card-accent': card.accent,
                '--card-bg': card.background,
              } as CSSProperties}
            >
              <div className="home-feature-icon">{card.icon}</div>
              <h2 className="home-feature-title">{card.title}</h2>
              <p className="home-feature-desc">{card.description}</p>
              <span className="home-feature-arrow">Jetzt öffnen →</span>
            </div>
          </Link>
        ))}
      </section>

      <div className="home-tip-box">
        <h3>💡 Tipp des Tages</h3>
        <p>
          Starten Sie mit <strong>„Betrug vermeiden“</strong>, nutzen Sie danach die <strong>KI-Hilfe</strong> für Alltagsfragen und sammeln Sie Punkte mit Spielen und Workouts.
        </p>
      </div>

      <Mascot context="home" size="small" />
    </div>
  );
};

export default Home;