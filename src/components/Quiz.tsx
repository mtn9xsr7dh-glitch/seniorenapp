import { useState, useEffect } from 'react';
import { addQuizPoints } from '../utils/progressUtils';
import { speakGermanText } from '../utils/speechUtils';
import Mascot from './Mascot';

interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  audio: string;
  hint: string;
}

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const questions: QuizQuestion[] = [
    {
      id: 1,
      category: '🛡️ Betrug vermeiden',
      question: 'Was sollten Sie tun, wenn ein unbekannter Anrufer nach Ihrem PIN fragt?',
      options: [
        'Auflegen und nicht antworten',
        'Die PIN sofort nennen',
        'Die Nummer an Freunde weitergeben',
        'Zurückrufen, um den Anrufer zu prüfen'
      ],
      correctIndex: 0,
      audio: 'Frage: Was sollten Sie tun, wenn ein unbekannter Anrufer nach Ihrem PIN fragt? Seriöse Anrufer fragen niemals nach Ihrer PIN.',
      hint: 'Seriöse Anrufer fragen niemals nach sensiblen Daten wie PIN oder TAN-Nummern.'
    },
    {
      id: 2,
      category: '🛡️ Betrug vermeiden',
      question: 'Was bedeutet ein durchgestrichenes Schloss-Symbol in der Browser-Adresse?',
      options: [
        'Die Verbindung ist nicht sicher',
        'Die Seite lädt schneller',
        'Die Website ist beliebt',
        'Es gibt neue Nachrichten'
      ],
      correctIndex: 0,
      audio: 'Frage: Was bedeutet ein durchgestrichenes Schloss-Symbol in der Browser-Adresse? Dies ist ein Warnzeichen.',
      hint: 'Ein durchgestrichenes Schloss bedeutet, dass die Website nicht sicher ist.'
    },
    {
      id: 3,
      category: '🛡️ Betrug vermeiden',
      question: 'Was sollten Sie bei einer verdächtigen E-Mail tun?',
      options: [
        'Löschen und nicht auf Links klicken',
        'Alle Anhänge öffnen',
        'Sofort antworten',
        'Die E-Mail speichern und später prüfen'
      ],
      correctIndex: 0,
      audio: 'Frage: Was sollten Sie bei einer verdächtigen E-Mail tun? Seien Sie vorsichtig mit Links und Anhängen.',
      hint: 'Bei verdächtigen E-Mails sollten Sie keine Anhänge öffnen und keine Links klicken.'
    },
    {
      id: 4,
      category: '📱 Symbole',
      question: 'Was bedeutet das Zahnrad-Symbol (⚙️)?',
      options: [
        'Einstellungen öffnen',
        'WLAN verbinden',
        'Die Kamera starten',
        'Die Lautstärke ändern'
      ],
      correctIndex: 0,
      audio: 'Frage: Was bedeutet das Zahnrad-Symbol? Es öffnet die Einstellungen.',
      hint: 'Das Zahnrad-Symbol öffnet die Einstellungen Ihres Smartphones.'
    },
    {
      id: 5,
      category: '📱 Symbole',
      question: 'Was zeigt das Batterie-Symbol (🔋) an?',
      options: [
        'Den Akkustand',
        'Die Uhrzeit',
        'Die Lautstärke',
        'Die Signalstärke'
      ],
      correctIndex: 0,
      audio: 'Frage: Was zeigt das Batterie-Symbol an? Das sollten Sie immer im Blick haben.',
      hint: 'Das Batterie-Symbol zeigt den aktuellen Ladestand Ihres Smartphone-Akkus an.'
    },
    {
      id: 6,
      category: '📱 Symbole',
      question: 'Was macht das Haus-Symbol (🏠)?',
      options: [
        'Zur Startseite zurückkehren',
        'Die App schließen',
        'Die Lautstärke erhöhen',
        'Den Akku aufladen'
      ],
      correctIndex: 0,
      audio: 'Frage: Was macht das Haus-Symbol? Es ist nützlich für die Navigation.',
      hint: 'Das Haus-Symbol bringt Sie zurück zur Startseite oder zum Hauptbildschirm.'
    },
    {
      id: 7,
      category: '🤖 Smartphone Hilfe',
      question: 'Was sollten Sie tun, wenn Ihr Smartphone sehr langsam ist?',
      options: [
        'Neustarten',
        'Viele Apps öffnen',
        'Den Bildschirm dunkler machen',
        'Es mit Wasser reinigen'
      ],
      correctIndex: 0,
      audio: 'Frage: Was sollten Sie tun, wenn Ihr Smartphone sehr langsam ist? Ein Neustart hilft oft.',
      hint: 'Wenn Ihr Smartphone langsam ist, hilft oft ein Neustart.'
    },
    {
      id: 8,
      category: '🤖 Smartphone Hilfe',
      question: 'Wie verbinden Sie sich mit WLAN?',
      options: [
        'Im WLAN-Menü das Netzwerk wählen und Passwort eingeben',
        'Den Flugmodus aktivieren',
        'Die Kamera-App öffnen',
        'Das Telefon ausschalten'
      ],
      correctIndex: 0,
      audio: 'Frage: Wie verbinden Sie sich mit WLAN? Das ist wichtig für Internetzugang.',
      hint: 'Gehen Sie zu Einstellungen, tippen Sie auf WLAN und wählen Sie Ihr Netzwerk aus.'
    },
    {
      id: 9,
      category: '🤖 Smartphone Hilfe',
      question: 'Was bedeutet “Cache löschen” bei einer App?',
      options: [
        'Temporäre Dateien entfernen',
        'Die App deinstallieren',
        'Das Gerät neu starten',
        'Die App bewerten'
      ],
      correctIndex: 0,
      audio: 'Frage: Was bedeutet Cache löschen? Das kann bei Problemen helfen.',
      hint: 'Cache löschen entfernt temporäre Dateien, die die App gespeichert hat.'
    },
    {
      id: 10,
      category: '🛡️ Betrug vermeiden',
      question: 'Was ist ein Phishing-Angriff?',
      options: [
        'Betrug mit falschen E-Mails oder Websites',
        'Ein Virus auf dem Smartphone',
        'Ein Anruf vom Telekommunikationsanbieter',
        'Ein unbekannter Anrufer ohne Stimme'
      ],
      correctIndex: 0,
      audio: 'Frage: Was ist ein Phishing-Angriff? Das ist eine Betrugsmasche.',
      hint: 'Phishing ist, wenn Betrüger versuchen, über gefälschte E-Mails oder Websites an Ihre Daten zu kommen.'
    },
    {
      id: 11,
      category: '📱 Symbole',
      question: 'Was bedeutet das Flugzeug-Symbol (✈️)?',
      options: [
        'Flugmodus aktiviert',
        'Flugdaten werden angezeigt',
        'WLAN ist verbunden',
        'Die Kamera ist an'
      ],
      correctIndex: 0,
      audio: 'Frage: Was bedeutet das Flugzeug-Symbol? Das sehen Sie oft beim Fliegen.',
      hint: 'Das Flugzeug-Symbol zeigt an, dass der Flugmodus aktiviert ist.'
    },
    {
      id: 12,
      category: '🤖 Smartphone Hilfe',
      question: 'Wie machen Sie ein Foto mit Ihrem Smartphone?',
      options: [
        'Kamera-App öffnen und auf den Auslöser tippen',
        'Die Lautstärke-Taste drücken',
        'Den Bildschirm sauber wischen',
        'Das Telefon in den Flugmodus setzen'
      ],
      correctIndex: 0,
      audio: 'Frage: Wie machen Sie ein Foto mit Ihrem Smartphone? Das ist ganz einfach.',
      hint: 'Öffnen Sie die Kamera-App und tippen Sie auf den Auslöser.'
    },
    {
      id: 13,
      category: '🛡️ Betrug vermeiden',
      question: 'Was sollten Sie tun, wenn jemand behauptet, Ihr Enkel zu sein und Geld braucht?',
      options: [
        'Auflegen und Verwandte selbst anrufen',
        'Sofort Geld überweisen',
        'Die Nachricht teilen',
        'Den Anrufer um eine TAN bitten'
      ],
      correctIndex: 0,
      audio: 'Frage: Was sollten Sie beim Enkeltrick tun? Das ist gefährlich.',
      hint: 'Beim Enkeltrick geben Betrüger vor, ein Verwandter zu sein.'
    },
    {
      id: 14,
      category: '🛡️ Betrug vermeiden',
      question: 'Was sollten Sie bei Gewinnmitteilungen per E-Mail tun?',
      options: [
        'Die E-Mail löschen',
        'Den Gewinn bestätigen',
        'Eine Telefonnummer anrufen',
        'Ein Formular ausfüllen'
      ],
      correctIndex: 0,
      audio: 'Frage: Was sollten Sie bei Gewinnmitteilungen per E-Mail tun? Seien Sie skeptisch.',
      hint: 'Seriöse Firmen senden keine unerwarteten Gewinne per E-Mail.'
    },
    {
      id: 15,
      category: '📱 Symbole',
      question: 'Was bedeutet das Schloss-Symbol (🔒) neben einer Website-Adresse?',
      options: [
        'Die Verbindung ist sicher',
        'Die Seite ist gesperrt',
        'Der Akku ist voll',
        'Das Handy ist lautlos'
      ],
      correctIndex: 0,
      audio: 'Frage: Was bedeutet das Schloss-Symbol? Es zeigt eine sichere Verbindung.',
      hint: 'Das Schloss-Symbol zeigt an, dass die Website sicher verschlüsselt ist.'
    },
    {
      id: 16,
      category: '📱 Symbole',
      question: 'Was zeigt das Signal-Symbol (📶) an?',
      options: [
        'Die Netzstärke',
        'Die Akkulaufzeit',
        'Die Lautstärke',
        'Die Bildschirmhelligkeit'
      ],
      correctIndex: 0,
      audio: 'Frage: Was zeigt das Signal-Symbol an? Es ist wichtig für Anrufe.',
      hint: 'Das Signal-Symbol zeigt die Stärke des Mobilfunkempfangs an.'
    },
    {
      id: 17,
      category: '🤖 Smartphone Hilfe',
      question: 'Wie erkennen Sie, ob eine App sicher ist?',
      options: [
        'Positive Bewertungen und bekannte Entwickler prüfen',
        'Die App sofort installieren',
        'Die App ohne Passwort öffnen',
        'Die App auf einen anderen Bildschirm ziehen'
      ],
      correctIndex: 0,
      audio: 'Frage: Wie erkennen Sie sichere Apps? Das ist wichtig vor der Installation.',
      hint: 'Sichere Apps haben gute Bewertungen und bekannte Entwickler.'
    },
    {
      id: 18,
      category: '🤖 Smartphone Hilfe',
      question: 'Was sollten Sie tun, wenn Ihr Smartphone verloren geht?',
      options: [
        'Ortung aktivieren und Passwörter ändern',
        'Weiter nutzen wie zuvor',
        'Den Bildschirm heller machen',
        'Neue Fotos machen'
      ],
      correctIndex: 0,
      audio: 'Frage: Was tun, wenn Ihr Smartphone verloren geht? Das ist ein Notfall.',
      hint: 'Aktivieren Sie die Ortung und ändern Sie alle Passwörter.'
    },
    {
      id: 19,
      category: '🛡️ Betrug vermeiden',
      question: 'Warum sollten Sie niemals Ihre PIN per SMS schicken?',
      options: [
        'Betrüger könnten die SMS lesen',
        'SMS sind kostenlos',
        'Der Empfänger merkt sich die PIN besser',
        'SMS gehen schneller an'
      ],
      correctIndex: 0,
      audio: 'Frage: Warum sollten Sie keine PIN per SMS schicken? Das ist gefährlich.',
      hint: 'Betrüger können Ihre SMS abfangen oder missbrauchen.'
    },
    {
      id: 20,
      category: '📱 Symbole',
      question: 'Was bedeutet das Nicht-stören-Symbol (🌙)?',
      options: [
        'Benachrichtigungen sind stummgeschaltet',
        'Der Akku lädt',
        'Die Kamera ist aktiv',
        'Der Bildschirm ist gesperrt'
      ],
      correctIndex: 0,
      audio: 'Frage: Was bedeutet das Nicht-stören-Symbol? Es ist praktisch für Ruhezeiten.',
      hint: 'Das Symbol bedeutet, dass Anrufe und Benachrichtigungen stummgeschaltet sind.'
    }
  ];

  useEffect(() => {
    if (showResult && !quizCompleted) {
      addQuizPoints(score, questions.length);
      setQuizCompleted(true);
    }
  }, [showResult, quizCompleted, score, questions.length]);

  const speakText = (text: string) => {
    speakGermanText(text, { rate: 0.91, pitch: 0.98, volume: 1 });
  };

  const currentQ = questions[currentQuestion];

  const submitAnswer = () => {
    if (selectedOption === null || answered) return;

    const isCorrect = selectedOption === currentQ.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      setFeedback('✅ Richtig! Gute Antwort.');
    } else {
      setFeedback(`❌ Falsch. Die richtige Antwort ist: ${currentQ.options[currentQ.correctIndex]}.`);
    }

    setAnswered(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
      setAnswered(false);
      setFeedback('');
      setShowHint(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setAnswered(false);
    setFeedback('');
    setShowHint(false);
    setQuizCompleted(false);
  };

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#333', marginBottom: '2rem', fontSize: '2.5rem' }}>🎯 Quiz beendet!</h1>

        <div style={{
          backgroundColor: percentage >= 70 ? '#e8f5e8' : percentage >= 50 ? '#fff3e0' : '#ffebee',
          border: `3px solid ${percentage >= 70 ? '#4caf50' : percentage >= 50 ? '#ff9800' : '#f44336'}`,
          borderRadius: '15px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            color: percentage >= 70 ? '#4caf50' : percentage >= 50 ? '#ff9800' : '#f44336',
            margin: '0 0 1rem 0',
            fontSize: '2rem'
          }}>
            {percentage >= 70 ? 'Ausgezeichnet!' : percentage >= 50 ? 'Gut gemacht!' : 'Üben Sie weiter!'}
          </h2>
          <p style={{ fontSize: '1.5rem', margin: '0 0 1rem 0' }}>
            Sie haben {score} von {questions.length} Fragen richtig beantwortet.
          </p>
          <p style={{ fontSize: '1.2rem', margin: '0' }}>
            Das sind {percentage}% richtige Antworten.
          </p>
        </div>

        <button
          onClick={resetQuiz}
          style={{
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          🔄 Quiz erneut starten
        </button>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#f5f5f5',
        borderRadius: '15px',
        padding: '1.5rem',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#333', margin: '0 0 0.5rem 0', fontSize: '2rem' }}>🧠 Wissens-Quiz</h1>
        <p style={{ color: '#666', margin: '0', fontSize: '1.1rem' }}>
          Frage {currentQuestion + 1} von {questions.length}
        </p>
        <div style={{
          backgroundColor: '#e0e0e0',
          height: '8px',
          borderRadius: '4px',
          marginTop: '1rem',
          overflow: 'hidden'
        }}>
          <div style={{
            backgroundColor: '#4caf50',
            height: '100%',
            width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      <div style={{
        backgroundColor: '#fff',
        border: '3px solid #ddd',
        borderRadius: '15px',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: currentQ.category.includes('🛡️') ? '#ffebee' :
                          currentQ.category.includes('📱') ? '#fff3e0' : '#f3e5f5',
          border: `2px solid ${currentQ.category.includes('🛡️') ? '#f44336' :
                              currentQ.category.includes('📱') ? '#ff9800' : '#9c27b0'}`,
          borderRadius: '10px',
          padding: '1rem',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          <h3 style={{
            color: currentQ.category.includes('🛡️') ? '#f44336' :
                   currentQ.category.includes('📱') ? '#ff9800' : '#9c27b0',
            margin: '0',
            fontSize: '1.2rem'
          }}>
            {currentQ.category}
          </h3>
        </div>

        <h2 style={{
          color: '#333',
          margin: '0 0 1.5rem 0',
          fontSize: '1.4rem',
          lineHeight: '1.4'
        }}>
          {currentQ.question}
        </h2>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => speakText(currentQ.audio)}
            style={{
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '0.8rem 1.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            🔊 Frage vorlesen
          </button>

          <button
            onClick={() => setShowHint((prev) => !prev)}
            style={{
              backgroundColor: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '0.8rem 1.5rem',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            💡 {showHint ? 'Tipp ausblenden' : 'Tipp anzeigen'}
          </button>
        </div>

        {showHint && (
          <div style={{
            backgroundColor: '#fff3e0',
            border: '2px solid #ff9800',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <p style={{ margin: '0', color: '#e65100', fontSize: '1.1rem' }}>
              💡 {currentQ.hint}
            </p>
          </div>
        )}

        <div style={{
          display: 'grid',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          {currentQ.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = answered && index === currentQ.correctIndex;
            const isWrong = answered && isSelected && index !== currentQ.correctIndex;

            return (
              <button
                key={option}
                onClick={() => setSelectedOption(index)}
                disabled={answered}
                style={{
                  textAlign: 'left',
                  backgroundColor: isCorrect ? '#e8f5e8' : isWrong ? '#ffebee' : isSelected ? '#bbdefb' : '#f5f5f5',
                  border: `2px solid ${isCorrect ? '#4caf50' : isWrong ? '#f44336' : '#ddd'}`,
                  color: '#333',
                  padding: '1rem',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  cursor: answered ? 'default' : 'pointer',
                  opacity: answered && !isCorrect && !isWrong ? 0.75 : 1
                }}
              >
                {option}
              </button>
            );
          })}
        </div>

        <button
          onClick={submitAnswer}
          disabled={selectedOption === null || answered}
          style={{
            backgroundColor: selectedOption !== null && !answered ? '#4caf50' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            cursor: selectedOption !== null && !answered ? 'pointer' : 'not-allowed',
            width: '100%',
            marginBottom: '1rem'
          }}
        >
          ✅ Antwort bestätigen
        </button>

        {feedback && (
          <div style={{
            backgroundColor: '#e8f5e8',
            border: '2px solid #4caf50',
            borderRadius: '10px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ color: '#2e7d32', margin: '0 0 1rem 0' }}>📝 Rückmeldung</h3>
            <p style={{ margin: '0', color: '#333', lineHeight: '1.5', fontSize: '1.1rem' }}>
              {feedback}
            </p>
          </div>
        )}

        {answered && (
          <button
            onClick={nextQuestion}
            style={{
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            {currentQuestion < questions.length - 1 ? '➡️ Nächste Frage' : '🏁 Quiz beenden'}
          </button>
        )}
      </div>

      <Mascot context="quiz" size="small" />
    </div>
  );
};

export default Quiz;
