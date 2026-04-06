import { useState } from 'react';
import { applyNaturalGermanVoice } from '../utils/speechUtils';

const Symbols = () => {
  const [playing, setPlaying] = useState<string | null>(null);
  const [playingAll, setPlayingAll] = useState(false);
  const [currentSymbolIndex, setCurrentSymbolIndex] = useState(0);

  const symbols = [
    {
      icon: '📶',
      name: 'WLAN / WiFi',
      description: 'Verbindung zum Internet über WLAN. Grün = verbunden, Grau = ausgeschaltet.',
      explanation: 'Mit diesem Symbol können Sie sich mit WLAN-Netzwerken verbinden. Tippen Sie darauf, um verfügbare Netzwerke zu sehen.',
      audio: 'WLAN oder WiFi Symbol. Dieses Symbol zeigt Ihre Internetverbindung über WLAN an. Wenn es grün ist, sind Sie mit dem Internet verbunden. Tippen Sie darauf, um sich mit einem WLAN-Netzwerk zu verbinden.'
    },
    {
      icon: '📶',
      name: 'Mobile Daten',
      description: 'Internet über Mobilfunk. Erscheint neben WLAN-Symbol.',
      explanation: 'Wenn kein WLAN verfügbar ist, nutzt Ihr Smartphone mobile Daten für Internet.',
      audio: 'Mobile Daten Symbol. Dieses Symbol erscheint, wenn Sie Internet über Ihren Mobilfunkvertrag nutzen. Es zeigt die Signalstärke an.'
    },
    {
      icon: '🔋',
      name: 'Batterie',
      description: 'Akkustand Ihres Smartphones. Grün = voll, Rot = fast leer.',
      explanation: 'Zeigt an, wie viel Strom noch im Akku ist. Bei weniger als 20% sollten Sie laden.',
      audio: 'Batterie Symbol. Dieses Symbol zeigt den Ladestand Ihres Akkus an. Grün bedeutet viel Strom, rot bedeutet wenig Strom. Laden Sie Ihr Smartphone, wenn es unter 20 Prozent ist.'
    },
    {
      icon: '✈️',
      name: 'Flugmodus',
      description: 'Schaltet alle Verbindungen aus. Orange = aktiviert.',
      explanation: 'Im Flugmodus sind WLAN, Bluetooth und Mobilfunk ausgeschaltet.',
      audio: 'Flugmodus Symbol. Dieses orangefarbene Flugzeug schaltet alle Verbindungen aus. WLAN, Bluetooth und Mobilfunk werden deaktiviert. Perfekt für Flugreisen.'
    },
    {
      icon: '🔇',
      name: 'Lautlos / Stumm',
      description: 'Schaltet Töne aus. Durchgestrichener Lautsprecher = stumm.',
      explanation: 'Tippen Sie darauf, um Ihr Smartphone stumm zu schalten.',
      audio: 'Lautlos Symbol. Der durchgestrichene Lautsprecher bedeutet, dass Ihr Smartphone stumm geschaltet ist. Sie hören keine Klingeltöne oder Benachrichtigungen.'
    },
    {
      icon: '📍',
      name: 'Standort / GPS',
      description: 'Zeigt an, dass Apps Ihren Standort nutzen.',
      explanation: 'Viele Apps brauchen Ihren Standort für Karten oder Wetter.',
      audio: 'Standort Symbol. Dieses Symbol erscheint, wenn eine App Ihren Standort verwendet. Zum Beispiel für Karten-Apps oder Wetter-Apps.'
    },
    {
      icon: '📷',
      name: 'Kamera',
      description: 'Öffnet die Kamera-App zum Fotografieren.',
      explanation: 'Tippen Sie darauf, um Fotos oder Videos aufzunehmen.',
      audio: 'Kamera Symbol. Mit diesem Symbol öffnen Sie die Kamera. Tippen Sie darauf, um Fotos zu machen oder Videos aufzunehmen.'
    },
    {
      icon: '🖼️',
      name: 'Galerie / Fotos',
      description: 'Zeigt alle Ihre Fotos und Videos.',
      explanation: 'Hier finden Sie alle gespeicherten Bilder und Videos.',
      audio: 'Galerie Symbol. Dieses Symbol öffnet Ihre Foto-Galerie. Hier sehen Sie alle Ihre gespeicherten Fotos und Videos.'
    },
    {
      icon: '⚙️',
      name: 'Einstellungen',
      description: 'Zahnrad-Symbol für alle Einstellungen.',
      explanation: 'Hier ändern Sie WLAN, Ton, Display und andere Einstellungen.',
      audio: 'Einstellungen Symbol. Das Zahnrad öffnet die Einstellungen Ihres Smartphones. Hier können Sie WLAN, Ton, Helligkeit und viele andere Dinge ändern.'
    },
    {
      icon: '📞',
      name: 'Telefon',
      description: 'Grüner Hörer für Anrufe und Kontakte.',
      explanation: 'Tippen Sie darauf, um jemanden anzurufen oder Kontakte zu verwalten.',
      audio: 'Telefon Symbol. Der grüne Hörer öffnet die Telefon-App. Hier können Sie Anrufe tätigen und Ihre Kontakte verwalten.'
    },
    {
      icon: '💬',
      name: 'Nachrichten',
      description: 'Sprechblase für SMS und Nachrichten.',
      explanation: 'Hier schreiben und lesen Sie Textnachrichten.',
      audio: 'Nachrichten Symbol. Die Sprechblase öffnet Ihre Nachrichten-App. Hier können Sie SMS schreiben und lesen.'
    },
    {
      icon: '🌐',
      name: 'Browser / Internet',
      description: 'Öffnet den Internet-Browser.',
      explanation: 'Surfen Sie im Internet und besuchen Sie Websites.',
      audio: 'Browser Symbol. Dieses Symbol öffnet Ihren Internet-Browser. Hier können Sie im Internet surfen und Websites besuchen.'
    },
    {
      icon: '📱',
      name: 'App Store / Play Store',
      description: 'Laden Sie neue Apps herunter.',
      explanation: 'Hier finden Sie Tausende von Apps für Ihr Smartphone.',
      audio: 'App Store Symbol. Hier laden Sie neue Apps für Ihr Smartphone herunter. Es gibt kostenlose und kostenpflichtige Apps.'
    },
    {
      icon: '📅',
      name: 'Kalender',
      description: 'Verwalten Sie Termine und Ereignisse.',
      explanation: 'Planen Sie Ihre Termine und sehen Sie wichtige Daten.',
      audio: 'Kalender Symbol. Der Kalender hilft Ihnen, Termine zu planen und wichtige Daten im Auge zu behalten.'
    },
    {
      icon: '⏰',
      name: 'Uhr / Wecker',
      description: 'Zeit, Wecker und Timer funktionen.',
      explanation: 'Stellen Sie Wecker, Timer oder sehen Sie die Uhrzeit.',
      audio: 'Uhr Symbol. Hier stellen Sie Wecker, Timer und sehen die aktuelle Uhrzeit.'
    },
    {
      icon: '🎵',
      name: 'Musik / Media',
      description: 'Spielen Sie Musik und Videos ab.',
      explanation: 'Hören Sie Musik oder sehen Sie Videos.',
      audio: 'Musik Symbol. Dieses Symbol öffnet Ihre Musik-App. Hier können Sie Musik hören und Videos ansehen.'
    },
    {
      icon: '🔒',
      name: 'Sperrbildschirm',
      description: 'Smartphone ist gesperrt.',
      explanation: 'Wischen Sie, um zu entsperren.',
      audio: 'Sperrbildschirm. Ihr Smartphone ist gesperrt. Wischen Sie über den Bildschirm, um es zu entsperren.'
    },
    {
      icon: '📧',
      name: 'E-Mail',
      description: 'E-Mail-App für elektronische Post.',
      explanation: 'Lesen und schreiben Sie E-Mails.',
      audio: 'E-Mail Symbol. Hier lesen und schreiben Sie Ihre elektronischen Briefe.'
    },
    {
      icon: '🔔',
      name: 'Benachrichtigungen',
      description: 'Zeigt neue Nachrichten oder Updates.',
      explanation: 'Wischen Sie nach unten, um alle Benachrichtigungen zu sehen.',
      audio: 'Benachrichtigungen Symbol. Dieses Symbol zeigt an, dass Sie neue Nachrichten oder Updates haben. Wischen Sie von oben nach unten, um sie zu sehen.'
    },
    {
      icon: '�',
      name: 'Suche / Lupe',
      description: 'Suchfunktion zum Finden von Apps, Kontakten oder Informationen.',
      explanation: 'Tippen Sie darauf, um nach Apps, Kontakten, E-Mails oder im Internet zu suchen.',
      audio: 'Suche Symbol, die Lupe. Mit diesem Symbol können Sie nach Apps, Kontakten, E-Mails oder im Internet suchen. Tippen Sie darauf und geben Sie ein, was Sie suchen.'
    },
    {
      icon: '⭐',
      name: 'Favoriten / Stern',
      description: 'Markiert wichtige Apps oder Websites als Favoriten.',
      explanation: 'Speichern Sie Ihre Lieblings-Apps oder Websites für schnellen Zugriff.',
      audio: 'Favoriten Symbol, der Stern. Hiermit markieren Sie wichtige Apps oder Websites als Favoriten. So finden Sie sie schneller wieder.'
    },
    {
      icon: '📎',
      name: 'Anhang / Büroklammer',
      description: 'Fügt Dateien oder Bilder zu Nachrichten hinzu.',
      explanation: 'In Nachrichten-Apps können Sie damit Fotos, Videos oder Dokumente anhängen.',
      audio: 'Anhang Symbol, die Büroklammer. Damit fügen Sie Dateien, Fotos oder Videos zu Ihren Nachrichten hinzu.'
    },
    {
      icon: '↩️',
      name: 'Zurück / Pfeil links',
      description: 'Geht zur vorherigen Seite oder App zurück.',
      explanation: 'Tippen Sie darauf, um einen Schritt zurückzugehen.',
      audio: 'Zurück Pfeil. Dieser Pfeil nach links bringt Sie zur vorherigen Seite oder App zurück. Wie ein Rückwärts-Knopf.'
    },
    {
      icon: '🏠',
      name: 'Home / Startseite',
      description: 'Bringt Sie zurück zur Startseite oder zum Hauptbildschirm.',
      explanation: 'Der Kreis mit dem Haus-Symbol führt Sie immer zur Hauptseite.',
      audio: 'Home Symbol, das Haus. Dieses Symbol bringt Sie zurück zur Startseite oder zum Hauptbildschirm Ihres Smartphones.'
    },
    {
      icon: '📂',
      name: 'Ordner',
      description: 'Organisiert Apps in Gruppen.',
      explanation: 'Ziehen Sie Apps in Ordner, um Ihren Bildschirm aufzuräumen.',
      audio: 'Ordner Symbol. Hier können Sie Apps in Gruppen organisieren. Ziehen Sie ähnliche Apps zusammen in einen Ordner.'
    },
    {
      icon: '🔗',
      name: 'Link / Kette',
      description: 'Teilt Links zu Websites oder Apps.',
      explanation: 'Kopiert oder teilt Internet-Adressen.',
      audio: 'Link Symbol, die Kette. Damit können Sie Internet-Adressen kopieren oder teilen.'
    },
    {
      icon: '📤',
      name: 'Senden / Papierflieger',
      description: 'Versendet Nachrichten, E-Mails oder Dateien.',
      explanation: 'Tippen Sie darauf, um Ihre Nachricht abzuschicken.',
      audio: 'Senden Symbol, der Papierflieger. Hiermit versenden Sie Nachrichten, E-Mails oder Dateien.'
    },
    {
      icon: '❤️',
      name: 'Herz / Like',
      description: 'Markiert Inhalte als Favorit oder gefällt mir.',
      explanation: 'In sozialen Netzwerken oder Apps drücken Sie das Herz für Likes.',
      audio: 'Herz Symbol. Damit markieren Sie Inhalte als Favorit oder drücken Like in sozialen Netzwerken.'
    },
    {
      icon: '🔄',
      name: 'Teilen / Pfeile',
      description: 'Teilt Inhalte mit anderen Apps oder Personen.',
      explanation: 'Sendet Fotos, Links oder Texte an Freunde oder andere Apps.',
      audio: 'Teilen Symbol, die Pfeile. Hiermit können Sie Fotos, Links oder Texte mit anderen teilen.'
    },
    {
      icon: '🗑️',
      name: 'Papierkorb / Löschen',
      description: 'Löscht Dateien, Nachrichten oder Apps.',
      explanation: 'Tippen Sie darauf, um etwas zu entfernen. Seien Sie vorsichtig!',
      audio: 'Papierkorb Symbol. Damit löschen Sie Dateien, Nachrichten oder Apps. Seien Sie vorsichtig beim Löschen.'
    },
    {
      icon: '📝',
      name: 'Bearbeiten / Stift',
      description: 'Bearbeitet Texte, Kontakte oder Einstellungen.',
      explanation: 'Öffnet den Bearbeitungsmodus zum Ändern von Inhalten.',
      audio: 'Bearbeiten Symbol, der Stift. Hiermit können Sie Texte, Kontakte oder Einstellungen bearbeiten und ändern.'
    },
    {
      icon: '📊',
      name: 'Statistiken / Balken',
      description: 'Zeigt Nutzungsstatistiken oder Datenverbrauch.',
      explanation: 'In Einstellungen sehen Sie, wie viel Speicher oder Daten Sie verbrauchen.',
      audio: 'Statistiken Symbol, die Balken. Hier sehen Sie Statistiken über Ihren Speicherverbrauch oder Datenverbrauch.'
    },
    {
      icon: '🔐',
      name: 'Sicherheit / Schloss',
      description: 'Sicherheitseinstellungen und Passwörter.',
      explanation: 'Verwaltet Passwörter, Fingerabdruck oder Gesichtserkennung.',
      audio: 'Sicherheit Symbol, das Schloss. Hier verwalten Sie Passwörter, Fingerabdruck oder Gesichtserkennung für Sicherheit.'
    },
    {
      icon: '🌙',
      name: 'Nachtmodus / Mond',
      description: 'Schaltet dunkles Design ein für weniger Augenbelastung.',
      explanation: 'Bei Dunkelheit oder zum Stromsparen dunkles Design aktivieren.',
      audio: 'Nachtmodus Symbol, der Mond. Schaltet das dunkle Design ein, das schonender für die Augen ist und Strom spart.'
    },
    {
      icon: '🔊',
      name: 'Lautstärke / Lautsprecher',
      description: 'Regelt die Lautstärke von Ton und Musik.',
      explanation: 'Ziehen Sie den Schieber, um lauter oder leiser zu stellen.',
      audio: 'Lautstärke Symbol, der Lautsprecher. Hiermit regeln Sie die Lautstärke Ihres Smartphones.'
    },
    {
      icon: '📺',
      name: 'Video / Film',
      description: 'Spielt Videos ab oder zeichnet Videos auf.',
      explanation: 'Für Video-Apps, YouTube oder Video-Aufnahmen.',
      audio: 'Video Symbol, der Filmstreifen. Damit spielen Sie Videos ab oder zeichnen Videos auf.'
    },
    {
      icon: '🔔',
      name: 'Erinnerung / Glocke',
      description: 'Stellt Erinnerungen oder Benachrichtigungen ein.',
      explanation: 'Für Kalender-Erinnerungen oder App-Benachrichtigungen.',
      audio: 'Erinnerung Symbol, die Glocke. Hiermit stellen Sie Erinnerungen oder Benachrichtigungen ein.'
    },
    {
      icon: '💾',
      name: 'Speichern / Diskette',
      description: 'Speichert Dateien, Fotos oder Einstellungen.',
      explanation: 'Tippen Sie darauf, um Änderungen zu speichern.',
      audio: 'Speichern Symbol, die Diskette. Damit speichern Sie Dateien, Fotos oder Ihre Änderungen.'
    },
    {
      icon: '🔄',
      name: 'Synchronisieren / Kreise',
      description: 'Synchronisiert Daten mit der Cloud.',
      explanation: 'Lädt Ihre Daten in die Cloud oder holt sie herunter.',
      audio: 'Synchronisieren Symbol, die Kreise. Damit synchronisieren Sie Ihre Daten mit der Cloud.'
    }
  ];

  const speak = (text: string, id: string) => {
    if (playing === id) {
      speechSynthesis.cancel();
      setPlaying(null);
    } else {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      applyNaturalGermanVoice(utterance, { rate: 0.9, pitch: 0.98, volume: 1 });
      utterance.onend = () => setPlaying(null);
      speechSynthesis.speak(utterance);
      setPlaying(id);
    }
  };

  const speakAllSymbols = () => {
    if (playingAll) {
      speechSynthesis.cancel();
      setPlayingAll(false);
      setCurrentSymbolIndex(0);
      return;
    }

    if (symbols.length === 0) return;

    setPlayingAll(true);
    setCurrentSymbolIndex(0);

    const playNextSymbol = (index: number) => {
      if (index >= symbols.length) {
        setPlayingAll(false);
        setCurrentSymbolIndex(0);
        return;
      }

      const symbol = symbols[index];
      const symbolText = `${symbol.icon} ${symbol.name}. ${symbol.audio}`;
      const utterance = new SpeechSynthesisUtterance(symbolText);
      applyNaturalGermanVoice(utterance, { rate: 0.9, pitch: 0.98, volume: 1 });

      utterance.onend = () => {
        setCurrentSymbolIndex(index + 1);
        // 8-12 Sekunden Pause zwischen Symbolen
        const pauseTime = 8000 + Math.random() * 4000;
        setTimeout(() => {
          playNextSymbol(index + 1);
        }, pauseTime);
      };

      speechSynthesis.speak(utterance);
    };

    playNextSymbol(0);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>📱 Smartphone Symbole erklärt</h1>
      <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
        Lernen Sie die wichtigsten Symbole auf Ihrem Smartphone kennen.
        Jedes Symbol hat eine Bedeutung und Funktion.
      </p>

      {/* Button für gesamte Symbol-Erklärung */}
      <div style={{ marginBottom: '2rem', textAlign: 'center', padding: '1.5rem', backgroundColor: '#fff3e0', borderRadius: '10px', border: '2px solid #ff9800' }}>
        <button
          onClick={speakAllSymbols}
          style={{
            padding: '1.2rem 2.5rem',
            backgroundColor: playingAll ? '#ff5722' : '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            boxShadow: '0 3px 6px rgba(0,0,0,0.2)'
          }}
        >
          {playingAll ? `⏹️ Stop Symbol-Erklärung (${currentSymbolIndex + 1}/${symbols.length})` : '🎧 Alle Symbole erklärt anhören'}
        </button>
        <p style={{ fontSize: '1rem', color: '#e65100', marginTop: '0.8rem', fontWeight: 'bold' }}>
          {playingAll ? 'Automatische Erklärung aller 30 Symbole mit 8-12 Sekunden Pause' : 'Alle wichtigen Smartphone-Symbole nacheinander erklärt'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {symbols.map((symbol, index) => (
          <div
            key={index}
            style={{
              border: `2px solid ${playingAll && currentSymbolIndex === index ? '#ff9800' : '#e0e0e0'}`,
              borderRadius: '10px',
              padding: '1.5rem',
              backgroundColor: playingAll && currentSymbolIndex === index ? '#fff3e0' : '#fafafa',
              boxShadow: playingAll && currentSymbolIndex === index ? '0 0 10px rgba(255, 152, 0, 0.3)' : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{symbol.icon}</div>
              <h3 style={{ color: '#e65100', margin: '0.5rem 0' }}>{symbol.name}</h3>
            </div>

            <p style={{ fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1rem', color: '#333' }}>
              <strong>Bedeutung:</strong> {symbol.description}
            </p>

            <p style={{ fontSize: '0.9rem', lineHeight: '1.4', marginBottom: '1rem', color: '#555', fontStyle: 'italic' }}>
              {symbol.explanation}
            </p>

            <button
              onClick={() => speak(symbol.audio, `symbol-${index}`)}
              style={{
                width: '100%',
                padding: '0.8rem',
                backgroundColor: playing === `symbol-${index}` ? '#ff9800' : '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: 'bold'
              }}
            >
              {playing === `symbol-${index}` ? '⏹️ Stop' : '🔊 Erklärung anhören'}
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #ddd' }}>
        <a
          href="/"
          style={{
            color: '#ff9800',
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }}
        >
          ← Zurück zur Startseite
        </a>
      </div>
    </div>
  );
};

export default Symbols;