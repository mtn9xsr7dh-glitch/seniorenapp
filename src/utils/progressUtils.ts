// Utility functions for the progress/achievement system

export interface UserStats {
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

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  category: 'games' | 'quiz' | 'help' | 'general' | 'workout';
}

export type DailyTaskType = 'games' | 'quiz' | 'help' | 'workout';

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: DailyTaskType;
  target: number;
  progress: number;
  completed: boolean;
}

export interface DailyProgress {
  date: string;
  streak: number;
  lastStreakDate: string | null;
  lastVisitDate: string | null;
  visitBonusClaimed: boolean;
  allTasksBonusClaimed: boolean;
  tasks: DailyTask[];
}

const STORAGE_KEY = 'rentnerApp_stats';
const DAILY_STORAGE_KEY = 'rentnerApp_daily';

const getTodayKey = (): string => new Date().toISOString().split('T')[0];

const getYesterdayKey = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};

// Get default achievements
const getDefaultAchievements = (): Achievement[] => [
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

const getDefaultStats = (): UserStats => ({
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
  achievements: getDefaultAchievements()
});

const getDefaultDailyTasks = (): DailyTask[] => [
  {
    id: 'daily_game',
    title: '1 Spiel spielen',
    description: 'Trainieren Sie heute kurz Gedächtnis und Aufmerksamkeit.',
    icon: '🎮',
    type: 'games',
    target: 1,
    progress: 0,
    completed: false
  },
  {
    id: 'daily_quiz',
    title: '1 Quiz-Runde lösen',
    description: 'Frischen Sie Ihr Wissen mit einer kurzen Runde auf.',
    icon: '🎯',
    type: 'quiz',
    target: 1,
    progress: 0,
    completed: false
  },
  {
    id: 'daily_workout',
    title: '1 Bewegungseinheit machen',
    description: 'Bleiben Sie mit einem sanften Workout täglich aktiv.',
    icon: '💪',
    type: 'workout',
    target: 1,
    progress: 0,
    completed: false
  }
];

const normalizeStats = (savedStats: Partial<UserStats>): UserStats => {
  const mergedAchievements = new Map<string, Achievement>();

  getDefaultAchievements().forEach((achievement) => {
    mergedAchievements.set(achievement.id, achievement);
  });

  if (Array.isArray(savedStats.achievements)) {
    savedStats.achievements.forEach((achievement) => {
      const baseAchievement = mergedAchievements.get(achievement.id);
      mergedAchievements.set(achievement.id, {
        ...(baseAchievement ?? {}),
        ...achievement
      } as Achievement);
    });
  }

  return {
    ...getDefaultStats(),
    ...savedStats,
    achievements: Array.from(mergedAchievements.values())
  };
};

const normalizeDailyProgress = (savedDaily?: Partial<DailyProgress>): DailyProgress => {
  const defaultTasks = getDefaultDailyTasks();
  const savedTaskMap = new Map((savedDaily?.tasks ?? []).map(task => [task.id, task]));

  return {
    date: savedDaily?.date ?? getTodayKey(),
    streak: savedDaily?.streak ?? 0,
    lastStreakDate: savedDaily?.lastStreakDate ?? null,
    lastVisitDate: savedDaily?.lastVisitDate ?? null,
    visitBonusClaimed: savedDaily?.visitBonusClaimed ?? false,
    allTasksBonusClaimed: savedDaily?.allTasksBonusClaimed ?? false,
    tasks: defaultTasks.map((task) => {
      const savedTask = savedTaskMap.get(task.id);
      const progress = Math.min(task.target, savedTask?.progress ?? 0);

      return {
        ...task,
        progress,
        completed: savedTask?.completed ?? progress >= task.target
      };
    })
  };
};

// Load stats from localStorage
export const loadStats = (): UserStats => {
  const savedStats = localStorage.getItem(STORAGE_KEY);

  if (savedStats) {
    try {
      const normalizedStats = normalizeStats(JSON.parse(savedStats));
      saveStats(normalizedStats);
      return normalizedStats;
    } catch {
      return getDefaultStats();
    }
  }

  return getDefaultStats();
};

// Save stats to localStorage
export const saveStats = (stats: UserStats): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

const saveDailyProgress = (daily: DailyProgress): void => {
  localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(daily));
};

export const loadDailyProgress = (): DailyProgress => {
  const today = getTodayKey();
  const savedDaily = localStorage.getItem(DAILY_STORAGE_KEY);

  if (savedDaily) {
    try {
      const normalizedDaily = normalizeDailyProgress(JSON.parse(savedDaily));

      if (normalizedDaily.date !== today) {
        const refreshedDaily: DailyProgress = {
          ...normalizedDaily,
          date: today,
          visitBonusClaimed: false,
          allTasksBonusClaimed: false,
          tasks: getDefaultDailyTasks()
        };

        saveDailyProgress(refreshedDaily);
        return refreshedDaily;
      }

      saveDailyProgress(normalizedDaily);
      return normalizedDaily;
    } catch {
      // Use a fresh state below when daily progress cannot be parsed.
    }
  }

  const initialDaily = normalizeDailyProgress({ date: today });
  saveDailyProgress(initialDaily);
  return initialDaily;
};

const awardBonusPoints = (points: number): void => {
  const stats = loadStats();
  stats.totalPoints += points;
  stats.level = Math.floor(stats.totalPoints / 100) + 1;
  stats.achievements = checkAchievements(stats);
  saveStats(stats);
};

export const getDailyCompletedCount = (daily: DailyProgress): number => {
  return daily.tasks.filter(task => task.completed).length;
};

export const getDailyCompletionRate = (daily: DailyProgress): number => {
  if (daily.tasks.length === 0) return 0;
  return Math.round((getDailyCompletedCount(daily) / daily.tasks.length) * 100);
};

export const claimDailyVisitBonus = (): number => {
  const today = getTodayKey();
  const daily = loadDailyProgress();

  if (daily.lastVisitDate === today && daily.visitBonusClaimed) {
    return 0;
  }

  daily.lastVisitDate = today;
  daily.visitBonusClaimed = true;
  saveDailyProgress(daily);
  awardBonusPoints(15);

  return 15;
};

export const trackDailyActivity = (type: DailyTaskType): DailyProgress => {
  const today = getTodayKey();
  const yesterday = getYesterdayKey();
  const daily = loadDailyProgress();
  let completedNow = false;

  daily.lastVisitDate = today;
  daily.tasks = daily.tasks.map((task) => {
    if (task.type !== type || task.completed) {
      return task;
    }

    const progress = Math.min(task.target, task.progress + 1);
    const completed = progress >= task.target;

    if (completed && !task.completed) {
      completedNow = true;
    }

    return {
      ...task,
      progress,
      completed
    };
  });

  if (completedNow && daily.lastStreakDate !== today) {
    daily.streak = daily.lastStreakDate === yesterday ? daily.streak + 1 : 1;
    daily.lastStreakDate = today;
  }

  const allTasksCompleted = daily.tasks.every(task => task.completed);
  if (allTasksCompleted && !daily.allTasksBonusClaimed) {
    daily.allTasksBonusClaimed = true;
    awardBonusPoints(30);
  }

  saveDailyProgress(daily);
  return daily;
};

// Add points and update achievements
export const addPoints = (points: number, category: 'games' | 'quiz' | 'help' | 'general' | 'workout' = 'general'): void => {
  const stats = loadStats();

  stats.totalPoints += points;

  // Update level based on total points
  stats.level = Math.floor(stats.totalPoints / 100) + 1;

  // Update category-specific stats
  switch (category) {
    case 'games':
      stats.gamesPlayed += 1;
      break;
    case 'quiz':
      stats.quizScore += points;
      break;
    case 'help':
      stats.helpQuestions += 1;
      break;
    case 'workout':
      stats.workoutsCompleted += 1;
      break;
  }

  // Check for new achievements
  stats.achievements = checkAchievements(stats);

  saveStats(stats);

  if (category !== 'general') {
    trackDailyActivity(category);
  }
};

// Specific functions for different activities
export const addMemoryGamePoints = (moves: number): void => {
  const stats = loadStats();
  stats.memoryGames += 1;

  // Points based on efficiency (fewer moves = more points)
  const basePoints = 20;
  const efficiencyBonus = Math.max(0, 12 - moves); // Max 12 moves for full bonus
  const points = basePoints + efficiencyBonus;

  stats.totalPoints += points;
  stats.level = Math.floor(stats.totalPoints / 100) + 1;
  stats.gamesPlayed += 1;

  stats.achievements = checkAchievements(stats);
  saveStats(stats);
  trackDailyActivity('games');
};

export const addNumberGamePoints = (level: number): void => {
  const stats = loadStats();
  stats.numberGames += 1;

  const points = level * 5; // 5 points per level reached

  stats.totalPoints += points;
  stats.level = Math.floor(stats.totalPoints / 100) + 1;
  stats.gamesPlayed += 1;

  stats.achievements = checkAchievements(stats);
  saveStats(stats);
  trackDailyActivity('games');
};

export const addWordGamePoints = (correctAnswers: number): void => {
  const stats = loadStats();
  stats.wordGames += 1;

  const points = correctAnswers * 2; // 2 points per correct answer

  stats.totalPoints += points;
  stats.level = Math.floor(stats.totalPoints / 100) + 1;
  stats.gamesPlayed += 1;

  stats.achievements = checkAchievements(stats);
  saveStats(stats);
  trackDailyActivity('games');
};

export const addReactionGamePoints = (averageTime: number): void => {
  const stats = loadStats();
  stats.reactionGames += 1;

  // Points based on reaction time (faster = more points)
  let points = 10;
  if (averageTime < 300) points = 25; // Excellent
  else if (averageTime < 400) points = 20; // Good
  else if (averageTime < 500) points = 15; // Average

  stats.totalPoints += points;
  stats.level = Math.floor(stats.totalPoints / 100) + 1;
  stats.gamesPlayed += 1;

  stats.achievements = checkAchievements(stats);
  saveStats(stats);
  trackDailyActivity('games');
};

export const addQuizPoints = (score: number, totalQuestions: number): void => {
  const stats = loadStats();

  const percentage = (score / totalQuestions) * 100;
  const points = Math.round(percentage / 2); // Max 50 points for perfect score

  stats.quizScore += points;
  stats.totalPoints += points;
  stats.level = Math.floor(stats.totalPoints / 100) + 1;

  stats.achievements = checkAchievements(stats);
  saveStats(stats);
  trackDailyActivity('quiz');
};

export const addHelpQuestionPoints = (): void => {
  const stats = loadStats();
  stats.helpQuestions += 1;

  const points = 5; // 5 points per question asked

  stats.totalPoints += points;
  stats.level = Math.floor(stats.totalPoints / 100) + 1;

  stats.achievements = checkAchievements(stats);
  saveStats(stats);
  trackDailyActivity('help');
};

export const addWorkoutPoints = (duration: number, difficulty: 'Leicht' | 'Mittel' | 'Fortgeschritten'): number => {
  const pointsByDifficulty = difficulty === 'Leicht' ? 10 : difficulty === 'Mittel' ? 15 : 20;
  const durationBonus = Math.round(duration * 1.5);
  const points = pointsByDifficulty + durationBonus;

  addPoints(points, 'workout');
  return points;
};

// Check and unlock achievements
const checkAchievements = (stats: UserStats): Achievement[] => {
  return stats.achievements.map(achievement => {
    if (achievement.unlocked) return achievement;

    let shouldUnlock = false;

    switch (achievement.id) {
      case 'first_game':
        shouldUnlock = stats.gamesPlayed >= 1;
        break;
      case 'memory_master':
        shouldUnlock = stats.memoryGames >= 5;
        break;
      case 'number_ninja':
        shouldUnlock = stats.numberGames >= 5;
        break;
      case 'word_wizard':
        shouldUnlock = stats.wordGames >= 10;
        break;
      case 'reaction_hero':
        shouldUnlock = stats.reactionGames >= 3;
        break;
      case 'quiz_champion':
        shouldUnlock = stats.quizScore >= 40;
        break;
      case 'help_seeker':
        shouldUnlock = stats.helpQuestions >= 10;
        break;
      case 'first_workout':
        shouldUnlock = stats.workoutsCompleted >= 1;
        break;
      case 'workout_warrior':
        shouldUnlock = stats.workoutsCompleted >= 5;
        break;
      case 'dedicated_learner':
        shouldUnlock = stats.totalPoints >= 200;
        break;
      case 'senior_star':
        shouldUnlock = stats.level >= 10;
        break;
      case 'tech_master':
        shouldUnlock = stats.helpQuestions >= 50;
        break;
    }

    if (shouldUnlock) {
      stats.totalPoints += achievement.points;
      stats.level = Math.floor(stats.totalPoints / 100) + 1;
      return { ...achievement, unlocked: true };
    }

    return achievement;
  });
};

// Reset all stats
export const resetStats = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(DAILY_STORAGE_KEY);
};