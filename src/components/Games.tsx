import React, { useState, useEffect } from 'react';
import { addMemoryGamePoints, addNumberGamePoints, addWordGamePoints, addReactionGamePoints, addPoints } from '../utils/progressUtils';
import Mascot from './Mascot';

interface Game {
  id: string;
  name: string;
  description: string;
  icon: string;
  component: React.ComponentType;
}

const Games: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const games: Game[] = [
    {
      id: 'memory',
      name: '🧠 Memory-Spiel',
      description: 'Finden Sie die passenden Kartenpaare und trainieren Sie Ihr Gedächtnis.',
      icon: '🧠',
      component: MemoryGame
    },
    {
      id: 'numbers',
      name: '🔢 Zahlen merken',
      description: 'Merken Sie sich Zahlenfolgen und geben Sie sie in der richtigen Reihenfolge ein.',
      icon: '🔢',
      component: NumbersGame
    },
    {
      id: 'words',
      name: '📝 Wort-Assoziationen',
      description: 'Verbinden Sie Wörter mit passenden Kategorien.',
      icon: '📝',
      component: WordsGame
    },
    {
      id: 'reaction',
      name: '⚡ Reaktionsspiel',
      description: 'Testen Sie Ihre Reaktionszeit und Konzentration.',
      icon: '⚡',
      component: ReactionGame
    },
    {
      id: 'colors',
      name: '🎨 Farben erkennen',
      description: 'Erkennen Sie Farben und trainieren Sie Aufmerksamkeit und Wahrnehmung.',
      icon: '🎨',
      component: ColorsGame
    },
    {
      id: 'logic',
      name: '🧩 Was passt nicht?',
      description: 'Finden Sie den Begriff, der nicht in die Gruppe gehört.',
      icon: '🧩',
      component: LogicGame
    }
  ];

  const SelectedGameComponent = selectedGame ? games.find(game => game.id === selectedGame)?.component : null;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#2196f3', marginBottom: '2rem', fontSize: '2.5rem' }}>
        🎮 Spiele & Gedächtnistraining
      </h1>

      {!selectedGame ? (
        <>
          <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666', marginBottom: '3rem', lineHeight: '1.6' }}>
            Trainieren Sie Ihr Gedächtnis und Ihre Konzentration mit verschiedenen Spielen.
            Wählen Sie ein Spiel aus und starten Sie Ihr Gehirntraining!
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {games.map((game) => (
              <div
                key={game.id}
                onClick={() => setSelectedGame(game.id)}
                style={{
                  backgroundColor: '#f8f9fa',
                  border: '3px solid #2196f3',
                  borderRadius: '15px',
                  padding: '2rem',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, boxShadow 0.2s',
                  textAlign: 'center',
                  minHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{game.icon}</div>
                <h3 style={{ color: '#2196f3', margin: '0.5rem 0', fontSize: '1.3rem' }}>{game.name}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.4' }}>{game.description}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>
          <button
            onClick={() => setSelectedGame(null)}
            style={{
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.8rem 1.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              marginBottom: '2rem'
            }}
          >
            ← Zurück zu den Spielen
          </button>
          {SelectedGameComponent && <SelectedGameComponent />}
        </div>
      )}
    </div>
  );
};

// Memory-Spiel Komponente
const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<Array<{id: number, value: string, isFlipped: boolean, isMatched: boolean}>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const symbols = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐸'];

  const initializeGame = () => {
    const gameCards = symbols.slice(0, 6).flatMap((symbol, index) => [
      { id: index * 2, value: symbol, isFlipped: false, isMatched: false },
      { id: index * 2 + 1, value: symbol, isFlipped: false, isMatched: false }
    ]);
    setCards(gameCards.sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameStarted(false);
  };

  const handleCardClick = (cardId: number) => {
    if (!gameStarted) setGameStarted(true);
    if (flippedCards.length === 2 || cards.find(c => c.id === cardId)?.isFlipped || cards.find(c => c.id === cardId)?.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    const newCards = cards.map(card =>
      card.id === cardId ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstCardId);
      const secondCard = cards.find(c => c.id === secondCardId);

      if (firstCard && secondCard && firstCard.value === secondCard.value) {
        // Match gefunden
        setTimeout(() => {
          setCards(prevCards => prevCards.map(card =>
            card.id === firstCardId || card.id === secondCardId
              ? { ...card, isMatched: true }
              : card
          ));
          setMatches(matches + 1);
          setFlippedCards([]);
          // Check if game is complete after this match
          if (matches + 1 === 6) {
            addMemoryGamePoints(moves + 1);
          }
        }, 1000);
      } else {
        // Kein Match
        setTimeout(() => {
          setCards(prevCards => prevCards.map(card =>
            card.id === firstCardId || card.id === secondCardId
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const isGameComplete = matches === 6;

  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ color: '#2196f3', marginBottom: '1rem' }}>🧠 Memory-Spiel</h2>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '1.1rem', color: '#666' }}>
          Züge: {moves} | Gefunden: {matches}/6
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: card.isFlipped || card.isMatched ? '#fff' : '#2196f3',
              border: '3px solid #2196f3',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s, transform 0.3s',
              transform: card.isFlipped || card.isMatched ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            {card.isFlipped || card.isMatched ? card.value : '❓'}
          </div>
        ))}
      </div>

      {isGameComplete && (
        <div style={{
          marginTop: '2rem',
          padding: '2rem',
          backgroundColor: '#e8f5e9',
          borderRadius: '10px',
          border: '2px solid #4caf50'
        }}>
          <h3 style={{ color: '#4caf50' }}>🎉 Herzlichen Glückwunsch!</h3>
          <p>Sie haben das Spiel in {moves} Zügen abgeschlossen!</p>
          <p style={{ fontSize: '1.1rem', marginTop: '1rem' }}>
            Punkte erhalten: {20 + Math.max(0, 12 - moves)}
          </p>
        </div>
      )}

      <button
        onClick={initializeGame}
        style={{
          backgroundColor: '#2196f3',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '0.8rem 1.5rem',
          fontSize: '1rem',
          cursor: 'pointer',
          marginTop: '2rem'
        }}
      >
        🔄 Neues Spiel
      </button>
    </div>
  );
};

// Zahlen merken Spiel
const NumbersGame: React.FC = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [gameState, setGameState] = useState<'showing' | 'input' | 'result'>('showing');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);

  useEffect(() => {
    startNewRound();
  }, [level]);

  const startNewRound = () => {
    const newSequence = Array.from({ length: level + 2 }, () => Math.floor(Math.random() * 10));
    setSequence(newSequence);
    setUserInput('');
    setGameState('showing');
    showSequence(newSequence);
  };

  const showSequence = (seq: number[]) => {
    seq.forEach((num, index) => {
      setTimeout(() => {
        console.log(`Zahl: ${num}`);
      }, index * 1000);
    });

    setTimeout(() => {
      setGameState('input');
    }, seq.length * 1000 + 500);
  };

  const handleSubmit = () => {
    const userSequence = userInput.split('').map(n => parseInt(n));
    const isCorrect = userSequence.length === sequence.length &&
      userSequence.every((num, index) => num === sequence[index]);

    if (isCorrect) {
      setScore(score + level * 10);
      addNumberGamePoints(level);
      setLevel(level + 1);
      setGameState('result');
      setTimeout(() => startNewRound(), 2000);
    } else {
      setGameState('result');
    }
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setSequence([]);
    setUserInput('');
    setGameState('showing');
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ color: '#2196f3', marginBottom: '1rem' }}>🔢 Zahlen merken</h2>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '1.1rem', color: '#666' }}>
          Level: {level} | Punkte: {score}
        </p>
      </div>

      {gameState === 'showing' && (
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>
            Merken Sie sich die Zahlenfolge...
          </p>
          <div style={{ fontSize: '2rem', margin: '2rem 0' }}>
            {sequence.map((num, index) => (
              <span key={index} style={{ margin: '0 0.5rem' }}>{num}</span>
            ))}
          </div>
        </div>
      )}

      {gameState === 'input' && (
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '1rem' }}>
            Geben Sie die Zahlenfolge ein:
          </p>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value.replace(/[^0-9]/g, ''))}
            style={{
              fontSize: '1.5rem',
              padding: '0.5rem',
              textAlign: 'center',
              width: '200px',
              marginBottom: '1rem'
            }}
            placeholder="z.B. 12345"
          />
          <br />
          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.8rem 1.5rem',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            ✓ Überprüfen
          </button>
        </div>
      )}

      {gameState === 'result' && (
        <div style={{
          marginBottom: '2rem',
          padding: '2rem',
          backgroundColor: userInput.split('').map(n => parseInt(n)).length === sequence.length &&
            userInput.split('').map(n => parseInt(n)).every((num, index) => num === sequence[index])
            ? '#e8f5e9' : '#ffebee',
          borderRadius: '10px',
          border: `2px solid ${userInput.split('').map(n => parseInt(n)).length === sequence.length &&
            userInput.split('').map(n => parseInt(n)).every((num, index) => num === sequence[index])
            ? '#4caf50' : '#f44336'}`
        }}>
          <h3 style={{
            color: userInput.split('').map(n => parseInt(n)).length === sequence.length &&
              userInput.split('').map(n => parseInt(n)).every((num, index) => num === sequence[index])
              ? '#4caf50' : '#f44336'
          }}>
            {userInput.split('').map(n => parseInt(n)).length === sequence.length &&
              userInput.split('').map(n => parseInt(n)).every((num, index) => num === sequence[index])
              ? '🎉 Richtig!' : '❌ Leider falsch'}
          </h3>
          <p>Richtige Folge: {sequence.join('')}</p>
          <p>Ihre Eingabe: {userInput}</p>
        </div>
      )}

      <button
        onClick={resetGame}
        style={{
          backgroundColor: '#ff9800',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '0.8rem 1.5rem',
          fontSize: '1rem',
          cursor: 'pointer',
          marginTop: '1rem'
        }}
      >
        🔄 Neustart
      </button>
    </div>
  );
};

// Wort-Assoziationen Spiel
const WordsGame: React.FC = () => {
  const [currentWord, setCurrentWord] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const wordCategories = {
    'Obst': ['Apfel', 'Banane', 'Orange', 'Erdbeere', 'Traube'],
    'Gemüse': ['Karotte', 'Tomate', 'Gurke', 'Broccoli', 'Kartoffel'],
    'Tiere': ['Hund', 'Katze', 'Vogel', 'Fisch', 'Pferd'],
    'Farben': ['Rot', 'Blau', 'Grün', 'Gelb', 'Violett'],
    'Berufe': ['Lehrer', 'Arzt', 'Polizist', 'Koch', 'Feuerwehrmann']
  };

  const categories = Object.keys(wordCategories);

  useEffect(() => {
    startNewQuestion();
  }, []);

  const startNewQuestion = () => {
    if (questionCount >= 10) {
      setGameComplete(true);
      return;
    }

    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const categoryWords = wordCategories[randomCategory as keyof typeof wordCategories];
    const correctWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];

    const wrongOptions = categories
      .filter(cat => cat !== randomCategory)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const allOptions = [randomCategory, ...wrongOptions].sort(() => Math.random() - 0.5);

    setCurrentWord(correctWord);
    setOptions(allOptions);
  };

  const handleAnswer = (selectedCategory: string) => {
    const correctCategory = categories.find(cat =>
      wordCategories[cat as keyof typeof wordCategories].includes(currentWord)
    );

    if (selectedCategory === correctCategory) {
      setScore(score + 10);
      addWordGamePoints(1); // 1 correct answer
    }

    setQuestionCount(questionCount + 1);
    setTimeout(() => startNewQuestion(), 1000);
  };

  const resetGame = () => {
    setScore(0);
    setQuestionCount(0);
    setGameComplete(false);
    startNewQuestion();
  };

  if (gameComplete) {
    return (
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#2196f3', marginBottom: '1rem' }}>📝 Wort-Assoziationen</h2>
        <div style={{
          marginBottom: '2rem',
          padding: '2rem',
          backgroundColor: '#e8f5e9',
          borderRadius: '10px',
          border: '2px solid #4caf50'
        }}>
          <h3 style={{ color: '#4caf50' }}>🎉 Spiel beendet!</h3>
          <p style={{ fontSize: '1.2rem' }}>Ihre Gesamtpunktzahl: {score}/100</p>
          <p>
            {score >= 80 ? 'Ausgezeichnet!' :
             score >= 60 ? 'Gut gemacht!' :
             score >= 40 ? 'Nicht schlecht!' : 'Üben Sie weiter!'}
          </p>
        </div>
        <button
          onClick={resetGame}
          style={{
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.8rem 1.5rem',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          🔄 Neues Spiel
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ color: '#2196f3', marginBottom: '1rem' }}>📝 Wort-Assoziationen</h2>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '1.1rem', color: '#666' }}>
          Frage {questionCount + 1}/10 | Punkte: {score}
        </p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '2rem', color: '#333', marginBottom: '2rem' }}>
          Zu welcher Kategorie gehört "{currentWord}"?
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', maxWidth: '400px', margin: '0 auto' }}>
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              style={{
                backgroundColor: '#f8f9fa',
                border: '2px solid #2196f3',
                borderRadius: '10px',
                padding: '1rem',
                fontSize: '1.1rem',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e3f2fd';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Reaktionsspiel Komponente
const ReactionGame: React.FC = () => {
  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'click' | 'result'>('waiting');
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionTime, setReactionTime] = useState<number>(0);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [pointsAwarded, setPointsAwarded] = useState(false);

  const maxAttempts = 5;

  useEffect(() => {
    if (currentAttempt === maxAttempts && !pointsAwarded && attempts.length > 0) {
      const averageTime = getAverageTime();
      addReactionGamePoints(averageTime);
      setPointsAwarded(true);
    }
  }, [currentAttempt, attempts, pointsAwarded]);

  const startGame = () => {
    setGameState('ready');
    setAttempts([]);
    setCurrentAttempt(0);
    setReactionTime(0);

    const delay = Math.random() * 3000 + 1000;

    setTimeout(() => {
      setGameState('click');
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (gameState === 'waiting') {
      startGame();
    } else if (gameState === 'ready') {
      setGameState('result');
      setReactionTime(-1);
      setCurrentAttempt(currentAttempt + 1);
    } else if (gameState === 'click') {
      const time = Date.now() - startTime;
      setReactionTime(time);
      setAttempts([...attempts, time]);
      setGameState('result');
      setCurrentAttempt(currentAttempt + 1);
    }
  };

  const nextAttempt = () => {
    if (currentAttempt < maxAttempts) {
      setGameState('ready');
      setReactionTime(0);

      const delay = Math.random() * 3000 + 1000;

      setTimeout(() => {
        setGameState('click');
        setStartTime(Date.now());
      }, delay);
    }
  };

  const getAverageTime = () => {
    const validAttempts = attempts.filter(time => time > 0);
    if (validAttempts.length === 0) return 0;
    return Math.round(validAttempts.reduce((a, b) => a + b, 0) / validAttempts.length);
  };

  const resetGame = () => {
    setGameState('waiting');
    setAttempts([]);
    setCurrentAttempt(0);
    setReactionTime(0);
    setPointsAwarded(false);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ color: '#2196f3', marginBottom: '1rem' }}>⚡ Reaktionsspiel</h2>

      {gameState === 'waiting' && (
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
            Testen Sie Ihre Reaktionszeit! Klicken Sie auf "Start" und warten Sie,
            bis der Bildschirm grün wird. Klicken Sie dann so schnell wie möglich!
          </p>
          <button
            onClick={handleClick}
            style={{
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '1rem 2rem',
              fontSize: '1.2rem',
              cursor: 'pointer'
            }}
          >
            ▶️ Start
          </button>
        </div>
      )}

      {gameState === 'ready' && (
        <div style={{
          marginBottom: '2rem',
          padding: '3rem',
          backgroundColor: '#ff9800',
          borderRadius: '15px',
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          Bereit halten... Warten Sie auf GRÜN!
        </div>
      )}

      {gameState === 'click' && (
        <div
          onClick={handleClick}
          style={{
            marginBottom: '2rem',
            padding: '3rem',
            backgroundColor: '#4caf50',
            borderRadius: '15px',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          KLICK JETZT!
        </div>
      )}

      {gameState === 'result' && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            padding: '2rem',
            backgroundColor: reactionTime === -1 ? '#ffebee' : '#e8f5e9',
            borderRadius: '10px',
            border: `2px solid ${reactionTime === -1 ? '#f44336' : '#4caf50'}`,
            marginBottom: '2rem'
          }}>
            <h3 style={{ color: reactionTime === -1 ? '#f44336' : '#4caf50' }}>
              {reactionTime === -1 ? '❌ Zu früh!' : '🎯 Ergebnis'}
            </h3>
            {reactionTime === -1 ? (
              <p>Sie haben zu früh geklickt! Versuchen Sie es nochmal.</p>
            ) : (
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                Reaktionszeit: {reactionTime} ms
              </p>
            )}
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h4>Versuche: {currentAttempt}/{maxAttempts}</h4>
            {attempts.length > 0 && (
              <div>
                <p>Durchschnitt: {getAverageTime()} ms</p>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  {attempts.map((time, index) => (
                    <span key={index} style={{ margin: '0 0.5rem' }}>
                      {index + 1}: {time > 0 ? `${time}ms` : 'Zu früh'}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {currentAttempt < maxAttempts ? (
            <button
              onClick={nextAttempt}
              style={{
                backgroundColor: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.8rem 1.5rem',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              ➡️ Nächster Versuch
            </button>
          ) : (
            <div>
              <h4>🎉 Alle Versuche abgeschlossen!</h4>
              <p>Durchschnittszeit: {getAverageTime()} ms</p>
              <button
                onClick={resetGame}
                style={{
                  backgroundColor: '#ff9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.8rem 1.5rem',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
              >
                🔄 Neues Spiel
              </button>
            </div>
          )}
        </div>
      )}

      <Mascot context="games" size="small" />
    </div>
  );
};

const ColorsGame: React.FC = () => {
  const colorPool = [
    { name: 'Rot', hex: '#e53935' },
    { name: 'Blau', hex: '#1e88e5' },
    { name: 'Grün', hex: '#43a047' },
    { name: 'Gelb', hex: '#fdd835' },
    { name: 'Lila', hex: '#8e24aa' },
    { name: 'Orange', hex: '#fb8c00' }
  ];

  const [currentColor, setCurrentColor] = useState(colorPool[0]);
  const [options, setOptions] = useState<string[]>([]);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gameComplete, setGameComplete] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(false);

  const maxRounds = 8;

  useEffect(() => {
    if (!gameComplete) {
      startRound();
    }
  }, []);

  useEffect(() => {
    if (gameComplete && !pointsAwarded) {
      addPoints(10 + Math.round(score / 4), 'games');
      setPointsAwarded(true);
    }
  }, [gameComplete, pointsAwarded, score]);

  const startRound = () => {
    const selected = colorPool[Math.floor(Math.random() * colorPool.length)];
    const wrong = colorPool
      .filter(color => color.name !== selected.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(color => color.name);

    setCurrentColor(selected);
    setOptions([selected.name, ...wrong].sort(() => Math.random() - 0.5));
    setFeedback('');
  };

  const handleAnswer = (answer: string) => {
    const isCorrect = answer === currentColor.name;
    if (isCorrect) {
      setScore(prev => prev + 10);
      setFeedback('✅ Richtig!');
    } else {
      setFeedback(`❌ Richtig wäre: ${currentColor.name}`);
    }

    if (round >= maxRounds) {
      setTimeout(() => setGameComplete(true), 700);
    } else {
      setTimeout(() => {
        setRound(prev => prev + 1);
        startRound();
      }, 700);
    }
  };

  const resetGame = () => {
    setRound(1);
    setScore(0);
    setFeedback('');
    setGameComplete(false);
    setPointsAwarded(false);
    startRound();
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ color: '#2196f3', marginBottom: '1rem' }}>🎨 Farben erkennen</h2>
      <p style={{ fontSize: '1.1rem', color: '#666' }}>Runde {round}/{maxRounds} | Punkte: {score}</p>

      {!gameComplete ? (
        <>
          <p style={{ fontSize: '1.2rem', color: '#555', marginTop: '1.5rem' }}>Welche Farbe sehen Sie?</p>
          <div style={{ width: '160px', height: '160px', backgroundColor: currentColor.hex, borderRadius: '20px', margin: '1.5rem auto', border: '4px solid #ddd' }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(140px, 1fr))', gap: '1rem', maxWidth: '420px', margin: '0 auto' }}>
            {options.map(option => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                style={{
                  backgroundColor: '#fff',
                  border: '2px solid #2196f3',
                  borderRadius: '10px',
                  padding: '1rem',
                  fontSize: '1.05rem',
                  cursor: 'pointer'
                }}
              >
                {option}
              </button>
            ))}
          </div>

          {feedback && <p style={{ marginTop: '1rem', fontWeight: 'bold', color: feedback.includes('Richtig!') ? '#2e7d32' : '#c62828' }}>{feedback}</p>}
        </>
      ) : (
        <div style={{ marginTop: '2rem', padding: '2rem', backgroundColor: '#e8f5e9', borderRadius: '12px', border: '2px solid #4caf50' }}>
          <h3 style={{ color: '#2e7d32' }}>🎉 Spiel beendet!</h3>
          <p>Sie haben {score} von {maxRounds * 10} Punkten erreicht.</p>
          <button
            onClick={resetGame}
            style={{
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.8rem 1.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            🔄 Neues Spiel
          </button>
        </div>
      )}
    </div>
  );
};

const LogicGame: React.FC = () => {
  const questions = [
    { items: ['Apfel', 'Banane', 'Orange', 'Auto'], odd: 'Auto' },
    { items: ['Hund', 'Katze', 'Pferd', 'Tisch'], odd: 'Tisch' },
    { items: ['Rot', 'Blau', 'Gelb', 'Kartoffel'], odd: 'Kartoffel' },
    { items: ['Löffel', 'Gabel', 'Messer', 'Fenster'], odd: 'Fenster' },
    { items: ['Montag', 'Dienstag', 'Freitag', 'Brot'], odd: 'Brot' },
    { items: ['Rose', 'Tulpe', 'Lilie', 'Lampe'], odd: 'Lampe' },
    { items: ['Bus', 'Zug', 'Fahrrad', 'Suppe'], odd: 'Suppe' },
    { items: ['Milch', 'Wasser', 'Saft', 'Schuh'], odd: 'Schuh' }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gameComplete, setGameComplete] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(false);

  useEffect(() => {
    if (gameComplete && !pointsAwarded) {
      addPoints(12 + Math.round(score / 5), 'games');
      setPointsAwarded(true);
    }
  }, [gameComplete, pointsAwarded, score]);

  const handleChoice = (choice: string) => {
    const currentQuestion = questions[currentIndex];
    const isCorrect = choice === currentQuestion.odd;

    if (isCorrect) {
      setScore(prev => prev + 10);
      setFeedback('✅ Genau richtig!');
    } else {
      setFeedback(`❌ Nicht ganz. Richtig ist: ${currentQuestion.odd}`);
    }

    setTimeout(() => {
      if (currentIndex >= questions.length - 1) {
        setGameComplete(true);
      } else {
        setCurrentIndex(prev => prev + 1);
        setFeedback('');
      }
    }, 800);
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setFeedback('');
    setGameComplete(false);
    setPointsAwarded(false);
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ color: '#2196f3', marginBottom: '1rem' }}>🧩 Was passt nicht?</h2>
      {!gameComplete ? (
        <>
          <p style={{ fontSize: '1.1rem', color: '#666' }}>Frage {currentIndex + 1}/{questions.length} | Punkte: {score}</p>
          <p style={{ fontSize: '1.25rem', color: '#444', margin: '1.5rem 0' }}>Welcher Begriff passt nicht zu den anderen?</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(160px, 1fr))', gap: '1rem', maxWidth: '480px', margin: '0 auto' }}>
            {currentQuestion.items.map(item => (
              <button
                key={item}
                onClick={() => handleChoice(item)}
                style={{
                  backgroundColor: '#fffdf7',
                  border: '2px solid #ff9800',
                  borderRadius: '10px',
                  padding: '1rem',
                  fontSize: '1.05rem',
                  cursor: 'pointer'
                }}
              >
                {item}
              </button>
            ))}
          </div>
          {feedback && <p style={{ marginTop: '1rem', fontWeight: 'bold', color: feedback.includes('Genau') ? '#2e7d32' : '#c62828' }}>{feedback}</p>}
        </>
      ) : (
        <div style={{ marginTop: '2rem', padding: '2rem', backgroundColor: '#fff3e0', borderRadius: '12px', border: '2px solid #ff9800' }}>
          <h3 style={{ color: '#ef6c00' }}>🎉 Gut gemacht!</h3>
          <p>Sie haben {score} von {questions.length * 10} Punkten erreicht.</p>
          <button
            onClick={resetGame}
            style={{
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.8rem 1.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            🔄 Neues Spiel
          </button>
        </div>
      )}
    </div>
  );
};

export default Games;