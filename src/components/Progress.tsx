import React, { useState, useEffect } from 'react';
import { DailyProgress, getDailyCompletionRate, loadDailyProgress } from '../utils/progressUtils';
import Mascot from './Mascot';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  category: 'games' | 'quiz' | 'help' | 'general' | 'workout';
}

interface UserStats {
  totalPoints: number;
  level: number;
  gamesPlayed: number;
  quizScore: number;
  helpQuestions: number;
  memoryGames: number;
  numberGames: number;
  wordGames: number;
  reactionGames: number;
  workoutsCompleted: number;
  achievements: Achievement[];
}

const Progress: React.FC = () => {
  const [stats, setStats] = useState<UserStats>({
    totalPoints: 0,
    level: 1,
    gamesPlayed: 0,
    quizScore: 0,
    helpQuestions: 0,
    memoryGames: 0,
    numberGames: 0,
    wordGames: 0,
    reactionGames: 0,
    workoutsCompleted: 0,
    achievements: []
  });
  const [daily, setDaily] = useState<DailyProgress>({
    date: '',
    streak: 0,
    lastStreakDate: null,
    lastVisitDate: null,
    visitBonusClaimed: false,
    allTasksBonusClaimed: false,
    tasks: []
  });

  useEffect(() => {
    loadStats();
    setDaily(loadDailyProgress());
  }, []);

  const loadStats = () => {
    const savedStats = localStorage.getItem('rentnerApp_stats');
    if (savedStats) {
      const parsedStats = JSON.parse(savedStats);
      parsedStats.totalPoints = parsedStats.totalPoints ?? 0;
      parsedStats.level = parsedStats.level ?? 1;
      parsedStats.gamesPlayed = parsedStats.gamesPlayed ?? 0;
      parsedStats.quizScore = parsedStats.quizScore ?? 0;
      parsedStats.helpQuestions = parsedStats.helpQuestions ?? 0;
      parsedStats.memoryGames = parsedStats.memoryGames ?? 0;
      parsedStats.numberGames = parsedStats.numberGames ?? 0;
      parsedStats.wordGames = parsedStats.wordGames ?? 0;
      parsedStats.reactionGames = parsedStats.reactionGames ?? 0;
      parsedStats.workoutsCompleted = parsedStats.workoutsCompleted ?? 0;

      const defaultAchievements: Achievement[] = [
        { id: 'first_game', name: 'Erster Spieler', description: 'Spielen Sie Ihr erstes Gedächtnisspiel', icon: '🎮', points: 10, unlocked: false, category: 'games' },
        { id: 'memory_master', name: 'Memory-Meister', description: 'Schließen Sie 5 Memory-Spiele ab', icon: '🧠', points: 50, unlocked: false, category: 'games' },
        { id: 'number_ninja', name: 'Zahlen-Ninja', description: 'Erreichen Sie Level 5 im Zahlen-Spiel', icon: '🔢', points: 30, unlocked: false, category: 'games' },
        { id: 'word_wizard', name: 'Wort-Zauberer', description: 'Beantworten Sie 50 Fragen im Wort-Spiel', icon: '📝', points: 40, unlocked: false, category: 'games' },
        { id: 'reaction_hero', name: 'Reaktions-Held', description: 'Erzielen Sie unter 300ms Durchschnitt', icon: '⚡', points: 35, unlocked: false, category: 'games' },
        { id: 'quiz_champion', name: 'Quiz-Champion', description: 'Erreichen Sie 80% im Quiz', icon: '🎯', points: 45, unlocked: false, category: 'quiz' },
        { id: 'help_seeker', name: 'Hilfesucher', description: 'Stellen Sie 10 Fragen an die KI', icon: '🤖', points: 25, unlocked: false, category: 'help' },
        { id: 'first_workout', name: 'Erstes Workout', description: 'Schließen Sie Ihr erstes Workout ab', icon: '🏁', points: 15, unlocked: false, category: 'workout' },
        { id: 'workout_warrior', name: 'Workout-Warrior', description: 'Schließen Sie 5 Workouts ab', icon: '🔥', points: 40, unlocked: false, category: 'workout' },
        { id: 'dedicated_learner', name: 'Engagierter Lerner', description: 'Sammeln Sie 200 Punkte', icon: '📚', points: 60, unlocked: false, category: 'general' },
        { id: 'senior_star', name: 'Senioren-Star', description: 'Erreichen Sie Level 10', icon: '⭐', points: 100, unlocked: false, category: 'general' },
        { id: 'tech_master', name: 'Tech-Meister', description: 'Lösen Sie 50 technische Probleme', icon: '💻', points: 75, unlocked: false, category: 'help' }
      ];

      const loadedAchievements: Achievement[] = Array.isArray(parsedStats.achievements) ? parsedStats.achievements : [];
      const achievementsById = new Map<string, Achievement>();
      loadedAchievements.forEach((achievement: Achievement) => achievementsById.set(achievement.id, achievement));
      defaultAchievements.forEach(defaultAchievement => {
        if (!achievementsById.has(defaultAchievement.id)) {
          achievementsById.set(defaultAchievement.id, defaultAchievement);
        }
      });

      parsedStats.achievements = Array.from(achievementsById.values());
      setStats(parsedStats);
      localStorage.setItem('rentnerApp_stats', JSON.stringify(parsedStats));
    } else {
      // Initialize with default achievements
      const defaultAchievements: Achievement[] = [
        { id: 'first_game', name: 'Erster Spieler', description: 'Spielen Sie Ihr erstes Gedächtnisspiel', icon: '🎮', points: 10, unlocked: false, category: 'games' },
        { id: 'memory_master', name: 'Memory-Meister', description: 'Schließen Sie 5 Memory-Spiele ab', icon: '🧠', points: 50, unlocked: false, category: 'games' },
        { id: 'number_ninja', name: 'Zahlen-Ninja', description: 'Erreichen Sie Level 5 im Zahlen-Spiel', icon: '🔢', points: 30, unlocked: false, category: 'games' },
        { id: 'word_wizard', name: 'Wort-Zauberer', description: 'Beantworten Sie 50 Fragen im Wort-Spiel', icon: '📝', points: 40, unlocked: false, category: 'games' },
        { id: 'reaction_hero', name: 'Reaktions-Held', description: 'Erzielen Sie unter 300ms Durchschnitt', icon: '⚡', points: 35, unlocked: false, category: 'games' },
        { id: 'quiz_champion', name: 'Quiz-Champion', description: 'Erreichen Sie 80% im Quiz', icon: '🎯', points: 45, unlocked: false, category: 'quiz' },
        { id: 'help_seeker', name: 'Hilfesucher', description: 'Stellen Sie 10 Fragen an die KI', icon: '🤖', points: 25, unlocked: false, category: 'help' },
        { id: 'first_workout', name: 'Erstes Workout', description: 'Schließen Sie Ihr erstes Workout ab', icon: '🏁', points: 15, unlocked: false, category: 'workout' },
        { id: 'workout_warrior', name: 'Workout-Warrior', description: 'Schließen Sie 5 Workouts ab', icon: '🔥', points: 40, unlocked: false, category: 'workout' },
        { id: 'dedicated_learner', name: 'Engagierter Lerner', description: 'Sammeln Sie 200 Punkte', icon: '📚', points: 60, unlocked: false, category: 'general' },
        { id: 'senior_star', name: 'Senioren-Star', description: 'Erreichen Sie Level 10', icon: '⭐', points: 100, unlocked: false, category: 'general' },
        { id: 'tech_master', name: 'Tech-Meister', description: 'Lösen Sie 50 technische Probleme', icon: '💻', points: 75, unlocked: false, category: 'help' }
      ];

      const initialStats: UserStats = {
        totalPoints: 0,
        level: 1,
        gamesPlayed: 0,
        quizScore: 0,
        helpQuestions: 0,
        memoryGames: 0,
        numberGames: 0,
        wordGames: 0,
        reactionGames: 0,
        workoutsCompleted: 0,
        achievements: defaultAchievements
      };

      setStats(initialStats);
      localStorage.setItem('rentnerApp_stats', JSON.stringify(initialStats));
    }
  };

  const getLevelProgress = () => {
    const pointsForCurrentLevel = (stats.level - 1) * 100;
    const pointsForNextLevel = stats.level * 100;
    const progress = ((stats.totalPoints - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100;
    return Math.max(0, Math.min(100, progress));
  };

  const getPointsToNextLevel = () => {
    const pointsForNextLevel = stats.level * 100;
    return Math.max(0, pointsForNextLevel - stats.totalPoints);
  };

  const getLevelName = (level: number) => {
    const levelNames = [
      'Anfänger', 'Lernender', 'Fortgeschrittener', 'Experte', 'Meister',
      'Champion', 'Legende', 'Superstar', 'Guru', 'Genie'
    ];
    return levelNames[Math.min(level - 1, levelNames.length - 1)] || 'Genie';
  };

  const resetStats = () => {
    if (window.confirm('Möchten Sie wirklich alle Statistiken zurücksetzen?')) {
      localStorage.removeItem('rentnerApp_stats');
      localStorage.removeItem('rentnerApp_daily');
      loadStats();
      setDaily(loadDailyProgress());
    }
  };

  const dailyCompleted = daily.tasks.filter(task => task.completed).length;
  const dailyCompletionRate = getDailyCompletionRate(daily);
  const allDailyTasksCompleted = daily.tasks.length > 0 && daily.tasks.every(task => task.completed);

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#2196f3', marginBottom: '2rem', fontSize: '2.8rem' }}>
        🏆 Aktiv Punkte & Fortschritt
      </h1>

      {/* Aktiv Punkte Übersicht */}
      <div style={{
        backgroundColor: '#e8f5ff',
        border: '4px solid #1976d2',
        borderRadius: '25px',
        padding: '2.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ minWidth: '250px' }}>
            <h2 style={{ color: '#1976d2', marginBottom: '0.75rem', fontSize: '2rem' }}>Aktiv Punkte sammeln</h2>
            <p style={{ color: '#0f3057', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Hier sehen Sie sofort, wie gut Sie heute trainiert haben. Sammeln Sie Punkte, steigen Sie im Level auf und schalten Sie neue Erfolge frei.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', width: '100%' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '1.5rem', border: '2px solid #90caf9' }}>
              <div style={{ color: '#1976d2', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Punkte</div>
              <div style={{ fontSize: '2.6rem', fontWeight: 'bold', color: '#0d47a1' }}>{stats.totalPoints}</div>
            </div>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '1.5rem', border: '2px solid #90caf9' }}>
              <div style={{ color: '#1976d2', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Level</div>
              <div style={{ fontSize: '2.6rem', fontWeight: 'bold', color: '#0d47a1' }}>{stats.level}</div>
              <div style={{ marginTop: '0.25rem', color: '#333' }}>{getLevelName(stats.level)}</div>
            </div>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '1.5rem', border: '2px solid #90caf9' }}>
              <div style={{ color: '#1976d2', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Erfolge</div>
              <div style={{ fontSize: '2.6rem', fontWeight: 'bold', color: '#0d47a1' }}>{stats.achievements.filter(a => a.unlocked).length}/{stats.achievements.length}</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <div style={{ height: '22px', borderRadius: '12px', backgroundColor: '#dbe9ff', overflow: 'hidden' }}>
            <div style={{ width: `${getLevelProgress()}%`, height: '100%', backgroundColor: '#1976d2', transition: 'width 0.3s ease' }} />
          </div>
          <p style={{ margin: '0.75rem 0 0 0', color: '#0f3057', fontSize: '1rem' }}>
            Noch {getPointsToNextLevel()} Punkte bis Level {stats.level + 1}.
          </p>
        </div>
      </div>

      {/* Tägliche Motivation */}
      <div style={{
        background: 'linear-gradient(135deg, #fffdf3 0%, #fff7dc 100%)',
        border: '3px solid #ffca28',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ color: '#b26a00', marginBottom: '0.6rem' }}>🔥 Tägliche Motivation</h2>
        <p style={{ color: '#6b5a1f', marginTop: 0, lineHeight: '1.6' }}>
          Kommen Sie jeden Tag kurz zurück: ein bisschen lernen, spielen oder trainieren hält fit und bringt Extra-Punkte.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '1rem', border: '2px solid #ffe082' }}>
            <div style={{ color: '#b26a00', fontSize: '0.95rem' }}>Tagesserie</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8a5a00' }}>{daily.streak}</div>
          </div>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '1rem', border: '2px solid #ffe082' }}>
            <div style={{ color: '#b26a00', fontSize: '0.95rem' }}>Heute geschafft</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8a5a00' }}>{dailyCompleted}/{daily.tasks.length}</div>
          </div>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '1rem', border: '2px solid #ffe082' }}>
            <div style={{ color: '#b26a00', fontSize: '0.95rem' }}>Tagesbonus</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#8a5a00' }}>
              {allDailyTasksCompleted ? '✅ +30 gesichert' : '🎁 +30 bei allen Aufgaben'}
            </div>
          </div>
        </div>

        <div style={{ height: '16px', borderRadius: '999px', backgroundColor: '#f5e6ad', overflow: 'hidden', marginBottom: '1rem' }}>
          <div style={{ width: `${dailyCompletionRate}%`, height: '100%', background: 'linear-gradient(135deg, #ffb300, #fb8c00)', transition: 'width 0.3s ease' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {daily.tasks.map((task) => (
            <div
              key={task.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                padding: '1rem',
                border: `2px solid ${task.completed ? '#66bb6a' : '#ffe082'}`
              }}
            >
              <div style={{ fontSize: '1.7rem', marginBottom: '0.35rem' }}>{task.icon}</div>
              <h3 style={{ margin: '0 0 0.4rem 0', color: '#5c4600', fontSize: '1.05rem' }}>{task.title}</h3>
              <p style={{ margin: '0 0 0.6rem 0', color: '#6b5a1f', lineHeight: '1.5', fontSize: '0.95rem' }}>{task.description}</p>
              <strong style={{ color: task.completed ? '#2e7d32' : '#8a5a00' }}>
                {task.completed ? 'Erledigt' : `Fortschritt: ${task.progress}/${task.target}`}
              </strong>
            </div>
          ))}
        </div>
      </div>

      {/* Level und Punkte Übersicht */}
      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '15px',
        padding: '2rem',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#2196f3', marginBottom: '1rem' }}>
          Level {stats.level}: {getLevelName(stats.level)}
        </h2>
        <div style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#4caf50',
          marginBottom: '1rem'
        }}>
          {stats.totalPoints} Punkte
        </div>

        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: '20px',
          backgroundColor: '#e0e0e0',
          borderRadius: '10px',
          marginBottom: '1rem'
        }}>
          <div style={{
            width: `${getLevelProgress()}%`,
            height: '100%',
            backgroundColor: '#2196f3',
            borderRadius: '10px',
            transition: 'width 0.3s ease'
          }}></div>
        </div>

        <p style={{ color: '#666' }}>
          {stats.level * 100} / {(stats.level + 1) * 100} Punkte bis Level {stats.level + 1}
        </p>
      </div>

      {/* Statistiken Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: '#e8f5e9',
          border: '2px solid #4caf50',
          borderRadius: '10px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎮</div>
          <h3 style={{ color: '#4caf50', margin: '0.5rem 0' }}>Spiele gespielt</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.gamesPlayed}</div>
        </div>

        <div style={{
          backgroundColor: '#fff3e0',
          border: '2px solid #ff9800',
          borderRadius: '10px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
          <h3 style={{ color: '#ff9800', margin: '0.5rem 0' }}>Quiz Punkte</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.quizScore}</div>
        </div>

        <div style={{
          backgroundColor: '#e3f2fd',
          border: '2px solid #2196f3',
          borderRadius: '10px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤖</div>
          <h3 style={{ color: '#2196f3', margin: '0.5rem 0' }}>KI-Fragen</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.helpQuestions}</div>
        </div>

        <div style={{
          backgroundColor: '#e8f5e9',
          border: '2px solid #4caf50',
          borderRadius: '10px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💪</div>
          <h3 style={{ color: '#4caf50', margin: '0.5rem 0' }}>Workouts</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.workoutsCompleted}</div>
        </div>

        <div style={{
          backgroundColor: '#f3e5f5',
          border: '2px solid #9c27b0',
          borderRadius: '10px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
          <h3 style={{ color: '#9c27b0', margin: '0.5rem 0' }}>Errungenschaften</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            {stats.achievements.filter(a => a.unlocked).length}/{stats.achievements.length}
          </div>
        </div>
      </div>

      {/* Detaillierte Spiel-Statistiken */}
      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '15px',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ color: '#2196f3', marginBottom: '1rem' }}>📊 Gedächtnisspiele Details</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🧠</div>
            <div style={{ fontWeight: 'bold' }}>{stats.memoryGames}</div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Memory-Spiele</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔢</div>
            <div style={{ fontWeight: 'bold' }}>{stats.numberGames}</div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Zahlen-Spiele</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📝</div>
            <div style={{ fontWeight: 'bold' }}>{stats.wordGames}</div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Wort-Spiele</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚡</div>
            <div style={{ fontWeight: 'bold' }}>{stats.reactionGames}</div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Reaktions-Spiele</div>
          </div>
        </div>
      </div>

      {/* Errungenschaften */}
      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '15px',
        padding: '2rem'
      }}>
        <h2 style={{ color: '#2196f3', marginBottom: '1rem' }}>🏆 Errungenschaften</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          {stats.achievements.map((achievement) => (
            <div
              key={achievement.id}
              style={{
                backgroundColor: achievement.unlocked ? '#e8f5e9' : '#f5f5f5',
                border: `2px solid ${achievement.unlocked ? '#4caf50' : '#ddd'}`,
                borderRadius: '10px',
                padding: '1rem',
                opacity: achievement.unlocked ? 1 : 0.6
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{achievement.icon}</div>
              <h4 style={{
                color: achievement.unlocked ? '#4caf50' : '#666',
                margin: '0.5rem 0'
              }}>
                {achievement.name}
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.5rem 0' }}>
                {achievement.description}
              </p>
              <div style={{
                fontSize: '0.8rem',
                color: achievement.unlocked ? '#4caf50' : '#999',
                fontWeight: 'bold'
              }}>
                {achievement.unlocked ? '✅ Freigeschaltet' : `🔒 ${achievement.points} Punkte`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button
          onClick={resetStats}
          style={{
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.8rem 1.5rem',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          🔄 Statistiken zurücksetzen
        </button>
      </div>

      <Mascot context="progress" size="small" />
    </div>
  );
};

export default Progress;