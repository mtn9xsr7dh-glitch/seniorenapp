import { FormEvent, useEffect, useState } from 'react';
import { getGeminiResponse } from '../services/groqService';
import { addHelpQuestionPoints } from '../utils/progressUtils';
import { speakGermanText } from '../utils/speechUtils';
import Mascot from './Mascot';

interface ChatMessage {
  id: number;
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface HelpTopic {
  keywords: string[];
  title: string;
  steps: string[];
  alternative?: string[];
}

interface SubscriptionState {
  isActive: boolean;
  plan: 'monthly' | 'yearly' | null;
  startedAt?: string;
  trialEndsAt?: string;
}

const SUBSCRIPTION_KEY = 'rentnerApp_subscription';

const helpTopics: HelpTopic[] = [
  {
    keywords: ['wlan', 'wifi', 'internet', 'verbinden', 'netzwerk'],
    title: 'WLAN verbinden',
    steps: [
      '1. Öffnen Sie die Einstellungen auf Ihrem Smartphone',
      '2. Tippen Sie auf "WLAN" oder "WLAN & Internet"',
      '3. Schalten Sie WLAN ein (Schalter sollte blau/grün sein)',
      '4. Warten Sie, bis verfügbare Netzwerke angezeigt werden',
      '5. Tippen Sie auf Ihr WLAN-Netzwerk',
      '6. Geben Sie das WLAN-Passwort ein',
      '7. Tippen Sie auf "Verbinden"'
    ],
    alternative: [
      'Falls das nicht funktioniert:',
      '• Starten Sie Ihr Smartphone neu',
      '• Vergessen Sie das Netzwerk und verbinden Sie es neu',
      '• Überprüfen Sie das Passwort bei Ihrem Router',
      '• Stellen Sie sicher, dass Sie in WLAN-Reichweite sind'
    ]
  },
  {
    keywords: ['foto', 'bild', 'kamera', 'fotografieren', 'aufnahme'],
    title: 'Foto machen',
    steps: [
      '1. Öffnen Sie die Kamera-App auf Ihrem Smartphone',
      '2. Richten Sie die Kamera auf das Motiv',
      '3. Drücken Sie den Auslöser-Knopf (normalerweise ein Kreis)',
      '4. Warten Sie auf das Klick-Geräusch oder den Blitz',
      '5. Das Foto wird automatisch gespeichert'
    ],
    alternative: [
      'Falls das nicht funktioniert:',
      '• Überprüfen Sie, ob die Kamera-App installiert ist',
      '• Reinigen Sie die Kameralinse',
      '• Starten Sie die Kamera-App neu',
      '• Überprüfen Sie den Speicherplatz auf Ihrem Gerät'
    ]
  },
  {
    keywords: ['anruf', 'telefonieren', 'anrufen', 'telefon'],
    title: 'Telefonanruf machen',
    steps: [
      '1. Öffnen Sie die Telefon-App',
      '2. Tippen Sie auf die Tasten, um die Telefonnummer einzugeben',
      '3. Oder tippen Sie auf einen Kontakt aus Ihrer Kontaktliste',
      '4. Tippen Sie auf den grünen Hörer-Knopf',
      '5. Sprechen Sie in das Mikrofon',
      '6. Zum Auflegen tippen Sie auf den roten Hörer-Knopf'
    ],
    alternative: [
      'Falls das nicht funktioniert:',
      '• Überprüfen Sie, ob Sie Netzempfang haben',
      '• Starten Sie Ihr Smartphone neu',
      '• Überprüfen Sie die Telefon-App',
      '• Testen Sie mit einer anderen Nummer'
    ]
  },
  {
    keywords: ['sms', 'nachricht', 'text', 'schreiben', 'senden'],
    title: 'SMS/Nachricht senden',
    steps: [
      '1. Öffnen Sie die Nachrichten-App',
      '2. Tippen Sie auf das "+" oder "Neue Nachricht" Symbol',
      '3. Geben Sie den Namen oder die Nummer des Empfängers ein',
      '4. Schreiben Sie Ihre Nachricht in das Textfeld',
      '5. Tippen Sie auf "Senden" (normalerweise ein Pfeil-Symbol)'
    ],
    alternative: [
      'Falls das nicht funktioniert:',
      '• Überprüfen Sie die Telefonnummer',
      '• Stellen Sie sicher, dass Sie SMS-Guthaben haben',
      '• Starten Sie die Nachrichten-App neu',
      '• Verwenden Sie eine andere Nachrichten-App'
    ]
  },
  {
    keywords: ['app', 'anwendung', 'programm', 'öffnen', 'starten'],
    title: 'App öffnen',
    steps: [
      '1. Gehen Sie zum Startbildschirm Ihres Smartphones',
      '2. Suchen Sie das App-Symbol',
      '3. Tippen Sie auf das App-Symbol',
      '4. Warten Sie, bis die App geladen ist'
    ],
    alternative: [
      'Falls das nicht funktioniert:',
      '• Suchen Sie die App in der App-Übersicht (wischen Sie nach oben)',
      '• Starten Sie Ihr Smartphone neu',
      '• Überprüfen Sie, ob die App installiert ist',
      '• Löschen und installieren Sie die App neu'
    ]
  },
  {
    keywords: ['lautstärke', 'lauter', 'leiser', 'ton', 'sound'],
    title: 'Lautstärke ändern',
    steps: [
      '1. Drücken Sie die Lautstärke-Tasten an der Seite Ihres Smartphones',
      '2. Obere Taste = lauter, untere Taste = leiser',
      '3. Oder öffnen Sie die Schnelleinstellungen (von oben nach unten wischen)',
      '4. Tippen Sie auf das Lautstärke-Symbol',
      '5. Ziehen Sie den Schieberegler'
    ],
    alternative: [
      'Falls das nicht funktioniert:',
      '• Überprüfen Sie die Tasten an Ihrem Smartphone',
      '• Starten Sie Ihr Smartphone neu',
      '• Überprüfen Sie die App-spezifischen Einstellungen',
      '• Testen Sie mit Kopfhörern'
    ]
  },
  {
    keywords: ['akku', 'batterie', 'aufladen', 'laden', 'strom'],
    title: 'Smartphone aufladen',
    steps: [
      '1. Nehmen Sie das Ladekabel',
      '2. Stecken Sie das USB-Ende in den Ladeadapter',
      '3. Stecken Sie das andere Ende in Ihr Smartphone',
      '4. Stecken Sie den Ladeadapter in eine Steckdose',
      '5. Warten Sie, bis das Ladesymbol erscheint'
    ],
    alternative: [
      'Falls das nicht funktioniert:',
      '• Verwenden Sie ein anderes Ladekabel',
      '• Testen Sie eine andere Steckdose',
      '• Reinigen Sie die Ladebuchse',
      '• Starten Sie Ihr Smartphone neu',
      '• Verwenden Sie einen anderen Ladeadapter'
    ]
  },
  {
    keywords: ['zoom', 'vergrößern', 'größer', 'schrift', 'text'],
    title: 'Bildschirm vergrößern',
    steps: [
      '1. Öffnen Sie die Einstellungen',
      '2. Suchen Sie nach "Bedienungshilfen" oder "Zugänglichkeit"',
      '3. Tippen Sie auf "Anzeige" oder "Bildschirm"',
      '4. Suchen Sie nach "Zoomen" oder "Vergrößern"',
      '5. Schalten Sie die Zoom-Funktion ein'
    ],
    alternative: [
      'Falls das nicht funktioniert:',
      '• Verwenden Sie die Pinch-to-Zoom Geste (zwei Finger auseinander/zusammen)',
      '• Ändern Sie die Schriftgröße in den Anzeigeeinstellungen',
      '• Verwenden Sie eine Lupe-App aus dem App Store',
      '• Bitten Sie jemanden um Hilfe bei der Einstellung'
    ]
  },
  {
    keywords: ['flugmodus', 'flug', 'flugzeug', 'airplane', 'offline'],
    title: 'Flugmodus aktivieren',
    steps: [
      '1. Wischen Sie von oben auf dem Bildschirm nach unten, um die Schnelleinstellungen zu öffnen',
      '2. Suchen Sie das Flugzeug-Symbol',
      '3. Tippen Sie auf das Flugzeug-Symbol, um den Flugmodus einzuschalten',
      '4. Das Symbol sollte farbig werden und der Flugmodus ist aktiviert',
      '5. Zum Ausschalten erneut darauf tippen'
    ],
    alternative: [
      'Falls das nicht funktioniert:',
      '• Öffnen Sie die Einstellungen und suchen Sie nach "Flugmodus"',
      '• Starten Sie Ihr Smartphone neu',
      '• Überprüfen Sie, ob das Symbol gesperrt ist',
      '• Bitten Sie jemanden um Hilfe, falls Sie das Symbol nicht sehen'
    ]
  },
  {
    keywords: ['neustart', 'neu starten', 'starten', 'reset', 'aus- und einschalten'],
    title: 'Smartphone neu starten',
    steps: [
      '1. Halten Sie den Ein-/Ausschalter an der Seite gedrückt',
      '2. Warten Sie, bis das Menü erscheint',
      '3. Tippen Sie auf "Neustart" oder "Neu starten"',
      '4. Bestätigen Sie falls nötig',
      '5. Warten Sie, bis das Smartphone wieder hochgefahren ist'
    ],
    alternative: [
      'Falls das nicht funktioniert:',
      '• Schalten Sie das Smartphone zuerst aus und dann wieder an',
      '• Entfernen Sie den Akku nur bei älteren Modellen',
      '• Drücken Sie den Ein-/Ausschalter länger',
      '• Bitten Sie jemanden um Hilfe'
    ]
  },
  {
    keywords: ['helligkeit', 'bildschirmhelligkeit', 'dunkel', 'hell', 'licht'],
    title: 'Bildschirmhelligkeit einstellen',
    steps: [
      '1. Wischen Sie von oben nach unten, um die Schnelleinstellungen zu öffnen',
      '2. Suchen Sie den Helligkeits-Schieberegler',
      '3. Ziehen Sie den Regler nach rechts für mehr Helligkeit',
      '4. Ziehen Sie den Regler nach links für weniger Helligkeit',
      '5. Schließen Sie das Menü, wenn Sie zufrieden sind'
    ],
    alternative: [
      'Falls das nicht funktioniert:',
      '• Öffnen Sie die Einstellungen und suchen Sie nach "Display" oder "Anzeige"',
      '• Deaktivieren Sie den Nachtmodus',
      '• Starten Sie das Smartphone neu',
      '• Bitten Sie jemanden um Hilfe'
    ]
  },
  {
    keywords: ['bluetooth', 'kopfhörer', 'lautsprecher', 'verbinden', 'kabellos'],
    title: 'Bluetooth verbinden',
    steps: [
      '1. Öffnen Sie die Einstellungen auf Ihrem Smartphone',
      '2. Tippen Sie auf "Bluetooth"',
      '3. Schalten Sie Bluetooth ein',
      '4. Wählen Sie das Gerät aus der Liste der verfügbaren Geräte aus',
      '5. Bestätigen Sie die Verbindung mit "Koppeln" oder "Verbinden"'
    ],
    alternative: [
      'Falls das nicht funktioniert:',
      '• Stellen Sie sicher, dass das Gerät eingeschaltet ist',
      '• Entfernen Sie das Gerät aus Bluetooth und koppeln Sie es neu',
      '• Starten Sie Bluetooth auf beiden Geräten neu',
      '• Halten Sie für einige Sekunden gedrückt, um den Kopplungsmodus zu aktivieren'
    ]
  },
  {
    keywords: ['kontakt', 'speichern', 'nummer', 'telefonbuch', 'neuer kontakt'],
    title: 'Kontakt speichern',
    steps: [
      '1. Öffnen Sie die Kontakte-App',
      '2. Tippen Sie auf "Neuer Kontakt" oder das + Symbol',
      '3. Geben Sie den Namen ein',
      '4. Geben Sie die Telefonnummer ein',
      '5. Tippen Sie auf "Speichern"'
    ],
    alternative: [
      'Falls das nicht funktioniert:',
      '• Überprüfen Sie, ob Sie die Kontakte-App richtig geöffnet haben',
      '• Verwenden Sie stattdessen die Telefon-App, um einen Kontakt hinzuzufügen',
      '• Starten Sie Ihr Smartphone neu',
      '• Bitten Sie jemanden um Hilfe'
    ]
  },
  {
    keywords: ['app aktualisieren', 'update', 'aktualisieren', 'store', 'play store', 'app store'],
    title: 'App aktualisieren',
    steps: [
      '1. Öffnen Sie den Play Store oder App Store',
      '2. Tippen Sie auf Ihr Profilbild oder Menü',
      '3. Tippen Sie auf "Meine Apps" oder "Apps und Spiele"',
      '4. Suchen Sie die App in der Liste',
      '5. Tippen Sie auf "Aktualisieren"'
    ],
    alternative: [
      'Falls das nicht funktioniert:',
      '• Überprüfen Sie Ihre Internetverbindung',
      '• Starten Sie den Store neu',
      '• Löschen Sie den Cache der Store-App',
      '• Starten Sie das Smartphone neu'
    ]
  },
  {
    keywords: ['entsperren', 'sperre', 'pin', 'muster', 'fingerabdruck'],
    title: 'Bildschirm entsperren',
    steps: [
      '1. Drücken Sie kurz die Ein-/Aus-Taste',
      '2. Wischen Sie den Bildschirm nach oben',
      '3. Geben Sie den PIN oder das Muster ein',
      '4. Nutzen Sie den Fingerabdrucksensor, wenn Sie ihn eingerichtet haben',
      '5. Der Bildschirm wird entsperrt'
    ],
    alternative: [
      'Falls das nicht funktioniert:',
      '• Achten Sie darauf, dass Ihre Finger sauber sind',
      '• Geben Sie den PIN langsam ein',
      '• Starten Sie das Smartphone neu',
      '• Bitten Sie jemanden um Hilfe'
    ]
  },
  {
    keywords: ['app löschen', 'deinstallieren', 'löschen', 'entfernen'],
    title: 'App löschen',
    steps: [
      '1. Suchen Sie die App auf dem Startbildschirm oder in der App-Übersicht',
      '2. Halten Sie das App-Symbol gedrückt',
      '3. Tippen Sie auf "Deinstallieren" oder "Entfernen"',
      '4. Bestätigen Sie die Abfrage',
      '5. Die App wird von Ihrem Smartphone entfernt'
    ],
    alternative: [
      'Falls das nicht funktioniert:',
      '• Öffnen Sie die Einstellungen und wählen Sie "Apps"',
      '• Suchen Sie die App in der Liste',
      '• Tippen Sie auf "Deinstallieren"',
      '• Starten Sie Ihr Smartphone neu'
    ]
  }
];

const Help = () => {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([
    {
      id: 0,
      role: 'system',
      content:
        'Du bist ein freundlicher KI-Assistent für Handy- und Smartphone-Nutzung. Antworte immer bezogen auf das Smartphone, nicht auf Computer oder Laptop. Antworte auf Deutsch möglichst kurz, konkret und verständlich. Schweife nicht ab. Wenn nötig, erkläre es in wenigen klaren Schritten.',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recording, setRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [messageId, setMessageId] = useState(1);
  const [subscription, setSubscription] = useState<SubscriptionState>({
    isActive: false,
    plan: null,
  });

  useEffect(() => {
    const savedSubscription = localStorage.getItem(SUBSCRIPTION_KEY);
    if (savedSubscription) {
      try {
        const parsedSubscription = JSON.parse(savedSubscription) as SubscriptionState;
        setSubscription(parsedSubscription);
      } catch (err) {
        console.error('Abo-Status konnte nicht geladen werden', err);
      }
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.lang = 'de-DE';
    recognitionInstance.interimResults = false;
    recognitionInstance.maxAlternatives = 1;

    recognitionInstance.onresult = (event: any) => {
      const transcript = event.results[0][0]?.transcript;
      if (transcript) {
        setInput(transcript);
        sendPrompt(transcript);
      }
    };

    recognitionInstance.onerror = (event: any) => {
      console.error('Spracherkennung-Fehler', event);
      setError('Spracherkennung ist nicht verfügbar oder hat einen Fehler ausgelöst. Bitte tippen Sie Ihre Frage ein.');
      setRecording(false);
    };

    recognitionInstance.onend = () => {
      setRecording(false);
    };

    setRecognition(recognitionInstance);
  }, []);

  const addMessage = (content: string, role: ChatMessage['role']) => {
    setChat(prev => [...prev, { id: messageId, role, content }]);
    setMessageId(prev => prev + 1);
  };

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

    setSubscription(nextSubscription);
    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(nextSubscription));
  };

  const resetSubscriptionDemo = () => {
    const defaultSubscription = { isActive: false, plan: null } as SubscriptionState;
    setSubscription(defaultSubscription);
    localStorage.removeItem(SUBSCRIPTION_KEY);
  };

  const getPlanLabel = () => {
    if (subscription.plan === 'yearly') return 'Jahresabo · 4,99 € / Monat';
    if (subscription.plan === 'monthly') return 'Monatsabo · 7,99 € / Monat';
    return 'Kein Abo aktiv';
  };

  const formatTrialDate = () => {
    if (!subscription.trialEndsAt) return '';
    return new Date(subscription.trialEndsAt).toLocaleDateString('de-DE');
  };

  const speakText = (text: string) => {
    speakGermanText(text, { rate: 0.91, pitch: 0.98, volume: 1 });
  };

  const buildTopicResponse = (topic: HelpTopic, exact: boolean) => {
    const title = `📱 ${topic.title}`;
    const steps = topic.steps.join('\n');
    const alternatives = topic.alternative?.length
      ? `\n\nFalls es noch nicht klappt:\n${topic.alternative.join('\n')}`
      : '';

    if (exact) {
      return `${title}\n\n${steps}${alternatives}`;
    }

    return `${title}\n\n${topic.steps.slice(0, 4).join('\n')}${alternatives}`;
  };

  const sendPrompt = async (text: string) => {
    const trimmed = text.trim().toLowerCase();
    if (!trimmed) return;

    setError('');
    setLoading(true);
    addMessage(text, 'user');
    setInput('');

    try {
      const matchingTopic = helpTopics.find(topic =>
        topic.keywords.some(keyword => trimmed.includes(keyword)) || trimmed.includes(topic.title.toLowerCase())
      );

      const needsStepByStep = /(wie|problem|fehler|hilfe|geht nicht|funktioniert nicht|klappt nicht|kann nicht|einrichten|installieren|verbinden|aktivieren|deaktivieren|ändern|öffnen|speichern|löschen)/i.test(trimmed);

      if (matchingTopic) {
        const directResponse = buildTopicResponse(matchingTopic, needsStepByStep);
        addMessage(directResponse, 'assistant');
        speakText(directResponse);
      } else {
        let aiPrompt = `Nutzerfrage: "${text}"\n\nAntworte ausschließlich zur Nutzung eines Smartphones oder Handys. Antworte kurz, konkret und leicht verständlich auf Deutsch. Wenn es ein Problem ist, gib 3 bis 5 nummerierte Schritte. Wenn die Frage unklar ist, stelle genau eine kurze Rückfrage statt zu raten. Keine Hinweise zu Computer, PC oder Laptop.`;

        if (trimmed.includes('klappt nicht') || trimmed.includes('funktioniert nicht') || trimmed.includes('geht nicht')) {
          const lastAssistantMessage = chat.filter(msg => msg.role === 'assistant').pop();
          aiPrompt = `Die bisherige Hilfe war nicht passend. Gib bitte eine bessere, kurze Alternative auf Deutsch mit wenigen klaren nummerierten Schritten – nur für Handy oder Smartphone. ${lastAssistantMessage ? `Bisherige Antwort: "${lastAssistantMessage.content}".` : ''} Nutzerproblem: "${text}"`;
        }

        const response = await getGeminiResponse(aiPrompt);
        addMessage(response, 'assistant');
        speakText(response);
      }
    } catch (err) {
      console.error(err);
      const fallbackResponse = 'Die KI konnte gerade nicht antworten. Bitte versuchen Sie es gleich noch einmal oder formulieren Sie die Frage etwas anders.';
      addMessage(fallbackResponse, 'assistant');
      speakText(fallbackResponse);
    }

    addHelpQuestionPoints();
    setLoading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await sendPrompt(input);
  };

  const handleQuickQuestion = async (question: string) => {
    await sendPrompt(question);
  };

  const toggleRecording = () => {
    if (!recognition) {
      setError('Spracherkennung wird von Ihrem Browser nicht unterstützt.');
      return;
    }

    if (recording) {
      recognition.stop();
      setRecording(false);
    } else {
      setError('');
      setRecording(true);
      recognition.start();
    }
  };

  if (!subscription.isActive) {
    return (
      <div style={{ padding: '2rem', maxWidth: '920px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #eef7ff 100%)',
          borderRadius: '24px',
          padding: '2rem',
          border: '1px solid #dbe8f6',
          boxShadow: '0 18px 40px rgba(15, 48, 87, 0.08)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#12395b' }}>💎 KI-Hilfe Premium</h1>
            <p style={{ fontSize: '1.1rem', color: '#55697d', margin: 0 }}>
              Für die Nutzung der KI-Hilfe ist ein Abo erforderlich – inklusive <strong>7 Tage kostenlos testen</strong>.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ backgroundColor: '#fff', border: '2px solid #2196f3', borderRadius: '18px', padding: '1.5rem' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1565c0', marginBottom: '0.5rem' }}>Monatsabo</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#12395b', marginBottom: '0.4rem' }}>7,99 €</div>
              <div style={{ color: '#607285', marginBottom: '1rem' }}>pro Monat</div>
              <ul style={{ color: '#4f6375', lineHeight: '1.7', paddingLeft: '1.2rem' }}>
                <li>7 Tage kostenlos testen</li>
                <li>volle KI-Hilfe</li>
                <li>Schritt-für-Schritt-Anleitungen</li>
              </ul>
              <button
                onClick={() => activateSubscription('monthly')}
                style={{
                  width: '100%',
                  backgroundColor: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.9rem 1rem',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                7 Tage kostenlos starten
              </button>
            </div>

            <div style={{ backgroundColor: '#fff', border: '2px solid #4caf50', borderRadius: '18px', padding: '1.5rem', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-12px', right: '16px', backgroundColor: '#4caf50', color: 'white', padding: '0.3rem 0.7rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700 }}>Beliebt</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2e7d32', marginBottom: '0.5rem' }}>12 Monate</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#12395b', marginBottom: '0.4rem' }}>4,99 €</div>
              <div style={{ color: '#607285', marginBottom: '1rem' }}>pro Monat · jährliche Abrechnung</div>
              <ul style={{ color: '#4f6375', lineHeight: '1.7', paddingLeft: '1.2rem' }}>
                <li>7 Tage kostenlos testen</li>
                <li>günstiger Langzeitpreis</li>
                <li>volle KI-Hilfe inklusive</li>
              </ul>
              <button
                onClick={() => activateSubscription('yearly')}
                style={{
                  width: '100%',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.9rem 1rem',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                Jahresabo mit Testphase wählen
              </button>
            </div>
          </div>

          <p style={{ textAlign: 'center', color: '#74879a', fontSize: '0.95rem', marginBottom: 0 }}>
            Demo-Hinweis: Dies ist aktuell eine lokale Abo-Sperre. Für echte Zahlungen bräuchte man später z. B. Stripe, Google Play oder Apple In-App-Käufe.
          </p>
        </div>

        <Mascot context="help" size="small" />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '840px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <div style={{
        backgroundColor: '#eef7ff',
        border: '1px solid #cfe0f3',
        borderRadius: '14px',
        padding: '0.9rem 1rem',
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div>
          <strong style={{ color: '#12395b' }}>💎 {getPlanLabel()}</strong>
          <div style={{ color: '#5f7488', fontSize: '0.92rem' }}>7 Tage kostenlos bis: {formatTrialDate()}</div>
        </div>
        <button
          onClick={resetSubscriptionDemo}
          style={{
            backgroundColor: '#ffffff',
            color: '#1565c0',
            border: '1px solid #b7d3ee',
            borderRadius: '10px',
            padding: '0.55rem 0.9rem',
            cursor: 'pointer'
          }}
        >
          Demo-Abo zurücksetzen
        </button>
      </div>

      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🆘 KI-Hilfe - direkt & Schritt für Schritt</h1>
      <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '1.8rem' }}>
        Stellen Sie jede beliebige Frage. Die KI antwortet allgemein und konkret – und bei Fragen oder Problemen automatisch Schritt für Schritt.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="z. B. 'WLAN verbinden', 'Foto machen', 'Was ist WhatsApp?' oder jede andere Frage"
            disabled={loading}
            style={{
              flex: 1,
              minWidth: '220px',
              padding: '1rem',
              fontSize: '1rem',
              border: '2px solid #4CAF50',
              borderRadius: '10px',
              outline: 'none'
            }}
          />
          <button
            type="button"
            onClick={toggleRecording}
            disabled={loading}
            style={{
              padding: '1rem 1.2rem',
              fontSize: '1rem',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: recording ? '#f44336' : '#2196f3',
              color: 'white',
              cursor: 'pointer',
              minWidth: '160px'
            }}
          >
            {recording ? '⏹️ Stoppen' : '🎙️ Spracheingabe'}
          </button>
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              padding: '1rem 1.2rem',
              fontSize: '1rem',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: loading || !input.trim() ? '#ccc' : '#4CAF50',
              color: 'white',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              minWidth: '160px'
            }}
          >
            {loading ? '⏳ Senden...' : '📩 Senden'}
          </button>
        </div>
      </form>

      {error && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            borderRadius: '10px',
            backgroundColor: '#ffebee',
            border: '1px solid #f44336',
            color: '#b71c1c'
          }}
        >
          {error}
        </div>
      )}

      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {chat
          .filter(message => message.role !== 'system')
          .map(message => (
            <div
              key={message.id}
              style={{
                alignSelf: message.role === 'assistant' ? 'flex-start' : 'flex-end',
                backgroundColor: message.role === 'assistant' ? '#f1f8ff' : '#e8f5e9',
                color: '#222',
                border: `1px solid ${message.role === 'assistant' ? '#90caf9' : '#a5d6a7'}`,
                borderRadius: '20px',
                padding: '1rem 1.2rem',
                maxWidth: '92%',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
              }}
            >
              <div style={{ marginBottom: '0.5rem', fontWeight: 700, color: '#333' }}>
                {message.role === 'assistant' ? 'KI' : 'Sie'}
              </div>
              <div style={{ whiteSpace: 'pre-line', lineHeight: '1.7', fontSize: '1rem' }}>{message.content}</div>
              {message.role === 'assistant' && (
                <button
                  onClick={() => speakText(message.content)}
                  style={{
                    marginTop: '0.8rem',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.6rem 1rem',
                    backgroundColor: '#2196f3',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.95rem'
                  }}
                >
                  🔊 Vorlesen
                </button>
              )}
            </div>
          ))}
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '16px', backgroundColor: '#fafafa', border: '1px solid #ddd' }}>
        <h2 style={{ marginTop: 0 }}>15 häufige Fragen</h2>
        <p style={{ color: '#555', marginBottom: '1rem' }}>
          Tippen Sie auf eine Frage, um die vorgefertigte Schritt-für-Schritt-Anleitung zu erhalten. Sie können die Antwort anschließend auch vorlesen lassen.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {helpTopics.map(topic => (
            <button
              key={topic.title}
              onClick={() => handleQuickQuestion(topic.title)}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                border: '1px solid #ccc',
                backgroundColor: '#ffffff',
                textAlign: 'left',
                cursor: 'pointer',
                color: '#333'
              }}
            >
              {topic.title}
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '16px', backgroundColor: '#ffffff', border: '1px solid #ddd' }}>
        <h2 style={{ marginTop: 0 }}>Schritt-für-Schritt-Anleitungen</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {helpTopics.map(topic => (
            <details key={topic.title} style={{ padding: '1rem', borderRadius: '12px', backgroundColor: '#f5f5f5', border: '1px solid #eee' }}>
              <summary style={{ fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }}>{topic.title}</summary>
              <ol style={{ marginTop: '0.75rem', color: '#444', lineHeight: '1.7' }}>
                {topic.steps.map(step => (
                  <li key={step} style={{ marginBottom: '0.5rem' }}>{step}</li>
                ))}
              </ol>
            </details>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '2rem', borderTop: '1px solid #ddd', paddingTop: '1.5rem', textAlign: 'center' }}>
        <a href="/" style={{ color: '#4CAF50', textDecoration: 'none', fontWeight: 'bold' }}>← Zurück zur Startseite</a>
      </div>

      <Mascot context="help" size="small" />
    </div>
  );
};

export default Help;
