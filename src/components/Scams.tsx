import { useState } from 'react';
import { applyNaturalGermanVoice } from '../utils/speechUtils';

const Scams = () => {
  const [playing, setPlaying] = useState<string | null>(null);
  const [playingAll, setPlayingAll] = useState(false);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);

  const topics = [
    {
      title: '📧 E-Mail Betrug (Phishing)',
      danger: 'Hoch',
      description: 'Betrüger verschicken gefälschte E-Mails, die aussehen wie von Banken, Behörden oder bekannten Firmen.',
      warningSigns: [
        'Unbekannte Absender',
        'Dringliche Aufforderungen ("Handeln Sie sofort!")',
        'Verdächtige Links oder Anhänge',
        'Rechtschreibfehler',
        'Bitte um persönliche Daten'
      ],
      howToRecognize: 'Überprüfen Sie immer die E-Mail-Adresse des Absenders. Seriöse Firmen verwenden keine kostenlosen E-Mail-Dienste.',
      whatToDo: [
        'Klicken Sie NIEMALS auf verdächtige Links',
        'Öffnen Sie keine unbekannten Anhänge',
        'Melden Sie verdächtige E-Mails',
        'Rufen Sie die offizielle Nummer an, um zu überprüfen'
      ],
      audio: 'E-Mail Betrug, auch Phishing genannt, ist sehr häufig. Betrüger verschicken gefälschte E-Mails, die aussehen wie von Ihrer Bank oder Behörden. Warnzeichen sind unbekannte Absender, dringliche Aufforderungen, verdächtige Links oder Rechtschreibfehler. Klicken Sie niemals auf verdächtige Links und öffnen Sie keine unbekannten Anhänge. Melden Sie solche E-Mails und rufen Sie die offizielle Nummer an, um zu überprüfen.'
    },
    {
      title: '📞 Telefon-Betrug (Vishing)',
      danger: 'Hoch',
      description: 'Betrüger rufen an und geben sich als Polizei, Bank oder Microsoft aus.',
      warningSigns: [
        'Anrufe von unbekannten Nummern',
        'Drohungen ("Ihr Konto wird gesperrt!")',
        'Bitte um PIN, Passwort oder TAN',
        'Angebliche technische Probleme',
        'Zu gute Angebote'
      ],
      howToRecognize: 'Seröse Anrufer fragen niemals nach Ihren Passwörtern oder TAN-Nummern am Telefon.',
      whatToDo: [
        'Legen Sie einfach auf',
        'Rufen Sie die offizielle Nummer zurück',
        'Geben Sie NIEMALS persönliche Daten preis',
        'Informieren Sie Familie und Freunde',
        'Melden Sie den Anruf bei der Polizei'
      ],
      audio: 'Telefon-Betrug ist sehr gefährlich. Betrüger rufen an und geben sich als Polizei oder Bank aus. Sie drohen oft oder versprechen Hilfe. Seriöse Anrufer fragen niemals nach Ihren Passwörtern. Legen Sie einfach auf und rufen Sie die offizielle Nummer zurück. Geben Sie niemals persönliche Daten preis.'
    },
    {
      title: '💻 Technischer Support Betrug',
      danger: 'Sehr Hoch',
      description: 'Falsche Techniker bieten Hilfe an und wollen sich Zugriff auf Ihren Computer verschaffen.',
      warningSigns: [
        'Unangemeldete Anrufe mit Hilfsangeboten',
        'Druck zum schnellen Handeln',
        'Bitte um Fernzugriff',
        'Angebliche Viren oder Probleme',
        'Forderung nach Vorauszahlung'
      ],
      howToRecognize: 'Microsoft, Google oder andere Firmen rufen niemals unangemeldet an, um Hilfe anzubieten.',
      whatToDo: [
        'Legen Sie sofort auf',
        'Installieren Sie KEINE Fremdsoftware',
        'Ändern Sie alle Passwörter',
        'Scannen Sie Ihren Computer mit Antivirus',
        'Melden Sie den Vorfall'
      ],
      audio: 'Technischer Support Betrug ist sehr gefährlich. Falsche Techniker rufen an und behaupten, Ihr Computer hätte Viren. Sie wollen Fernzugriff oder Vorauszahlung. Microsoft ruft niemals unangemeldet an. Legen Sie auf und ändern Sie Ihre Passwörter.'
    },
    {
      title: '🏠 Haustür-Betrug',
      danger: 'Mittel',
      description: 'Betrüger kommen unangemeldet zur Tür und bieten Dienstleistungen an.',
      warningSigns: [
        'Unangemeldete Besuche',
        'Druck zum schnellen Abschluss',
        'Zu günstige Angebote',
        'Mangelnde Ausweise',
        'Sofortige Barzahlung gefordert'
      ],
      howToRecognize: 'Seröse Handwerker vereinbaren Termine im Voraus und haben ordentliche Ausweise.',
      whatToDo: [
        'Bitten Sie um Ausweis und Firmenunterlagen',
        'Vereinbaren Sie einen neuen Termin',
        'Lassen Sie sich Angebote schriftlich geben',
        'Zahlen Sie niemals bar im Voraus',
        'Rufen Sie die Firma selbst an'
      ],
      audio: 'Haustür-Betrug passiert an der Wohnungstür. Betrüger kommen unangemeldet und bieten Dienstleistungen an. Bitten Sie immer um Ausweis und Firmenunterlagen. Vereinbaren Sie einen neuen Termin und lassen Sie sich Angebote schriftlich geben. Zahlen Sie niemals bar im Voraus.'
    },
    {
      title: '💰 Online-Shopping Betrug',
      danger: 'Mittel',
      description: 'Gefälschte Shops oder zu gute Angebote im Internet.',
      warningSigns: [
        'Zu günstige Preise',
        'Keine Bewertungen oder schlechte Bewertungen',
        'Keine gültige Adresse',
        'Nur Barzahlung oder Vorauszahlung',
        'Druck zum schnellen Kauf'
      ],
      howToRecognize: 'Überprüfen Sie Bewertungen und die Seriosität des Shops. Nutzen Sie bekannte Zahlungsmethoden.',
      whatToDo: [
        'Kaufen Sie nur bei vertrauten Shops',
        'Nutzen Sie PayPal oder Kreditkarte',
        'Überprüfen Sie Bewertungen',
        'Bei Problemen: Geld zurückfordern',
        'Melden Sie betrügerische Shops'
      ],
      audio: 'Online-Shopping Betrug passiert bei gefälschten Internet-Shops. Achten Sie auf zu günstige Preise und fehlende Bewertungen. Kaufen Sie nur bei vertrauten Shops und nutzen Sie sichere Zahlungsmethoden wie PayPal oder Kreditkarte.'
    },
    {
      title: '👴 Enkel-Trick',
      danger: 'Sehr Hoch',
      description: 'Betrüger geben sich als Verwandte aus und bitten um Geld in Notlagen.',
      warningSigns: [
        'Anrufe von angeblichen Verwandten',
        'Geschichten über Unfälle oder Krankheiten',
        'Bitte um schnelle Geldüberweisung',
        'Geheimhaltung gefordert',
        'Ungewöhnliche Uhrzeit'
      ],
      howToRecognize: 'Rufen Sie Ihre Familie selbst an, um die Geschichte zu überprüfen.',
      whatToDo: [
        'Rufen Sie die Familie selbst an',
        'Überweisen Sie niemals Geld',
        'Informieren Sie die Polizei',
        'Sprechen Sie mit Vertrauten',
        'Blockieren Sie die Nummer'
      ],
      audio: 'Der Enkel-Trick ist besonders gemein. Betrüger geben sich als Ihre Enkel oder Kinder aus und bitten um Geld. Rufen Sie immer Ihre Familie selbst an, um die Geschichte zu überprüfen. Überweisen Sie niemals Geld an Unbekannte.'
    },
    {
      title: '🔒 Passwort-Sicherheit',
      danger: 'Hoch',
      description: 'Schwache Passwörter machen Sie anfällig für Hacker.',
      warningSigns: [
        'Gleiche Passwörter für mehrere Konten',
        'Einfache Passwörter (Geburtstag, Name)',
        'Keine Zwei-Faktor-Authentifizierung',
        'Passwörter auf Zettel notiert',
        'Öffentliche WLANs für wichtige Dinge'
      ],
      howToRecognize: 'Starke Passwörter haben mindestens 12 Zeichen und verschiedene Zeichenarten.',
      whatToDo: [
        'Verwenden Sie einen Passwort-Manager',
        'Aktivieren Sie Zwei-Faktor-Authentifizierung',
        'Ändern Sie Passwörter regelmäßig',
        'Nutzen Sie sichere WLANs',
        'Überwachen Sie Ihre Konten'
      ],
      audio: 'Passwort-Sicherheit ist sehr wichtig. Verwenden Sie verschiedene, starke Passwörter für jedes Konto. Aktivieren Sie Zwei-Faktor-Authentifizierung. Nutzen Sie einen Passwort-Manager und ändern Sie Passwörter regelmäßig.'
    },
    {
      title: '📱 Smartphone-Sicherheit',
      danger: 'Hoch',
      description: 'Ihr Smartphone enthält viele persönliche Daten.',
      warningSigns: [
        'Unbekannte Apps installiert',
        'Verdächtige SMS oder Anrufe',
        'Plötzlicher Batterieverlust',
        'Ungewöhnliche Datenverbrauch',
        'Verdächtige Berechtigungen'
      ],
      howToRecognize: 'Überprüfen Sie regelmäßig Ihre installierten Apps und Berechtigungen.',
      whatToDo: [
        'Installieren Sie nur Apps aus offiziellen Stores',
        'Überprüfen Sie App-Berechtigungen',
        'Halten Sie das System aktuell',
        'Nutzen Sie Antivirus-Apps',
        'Sichern Sie Ihre Daten regelmäßig'
      ],
      audio: 'Ihr Smartphone braucht Schutz. Installieren Sie nur Apps aus offiziellen Stores. Überprüfen Sie App-Berechtigungen und halten Sie das System aktuell. Nutzen Sie Antivirus-Apps und sichern Sie Ihre Daten regelmäßig.'
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

  const speakAllTopics = () => {
    if (playingAll) {
      speechSynthesis.cancel();
      setPlayingAll(false);
      setCurrentTopicIndex(0);
      return;
    }

    if (topics.length === 0) return;

    setPlayingAll(true);
    setCurrentTopicIndex(0);

    const playNextTopic = (index: number) => {
      if (index >= topics.length) {
        setPlayingAll(false);
        setCurrentTopicIndex(0);
        return;
      }

      const topic = topics[index];
      const topicText = `${topic.title}. ${topic.audio}`;
      const utterance = new SpeechSynthesisUtterance(topicText);
      applyNaturalGermanVoice(utterance, { rate: 0.9, pitch: 0.98, volume: 1 });

      utterance.onend = () => {
        setCurrentTopicIndex(index + 1);
        // 10-15 Sekunden Pause zwischen Themen (länger als bei Schritten)
        const pauseTime = 10000 + Math.random() * 5000; // 10-15 Sekunden
        setTimeout(() => {
          playNextTopic(index + 1);
        }, pauseTime);
      };

      speechSynthesis.speak(utterance);
    };

    playNextTopic(0);
  };

  const getDangerColor = (danger: string) => {
    switch (danger) {
      case 'Sehr Hoch': return '#d32f2f';
      case 'Hoch': return '#f57c00';
      case 'Mittel': return '#fbc02d';
      default: return '#4caf50';
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>🛡️ Betrug vermeiden - Sicherheitstipps</h1>
      <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
        Lernen Sie die häufigsten Betrugsmaschen kennen und wie Sie sich schützen können.
        Hören Sie sich die Tipps auch als Audio an.
      </p>

      {/* Button für gesamte Betrugsschutz-Anleitung */}
      <div style={{ marginBottom: '2rem', textAlign: 'center', padding: '1.5rem', backgroundColor: '#f0f8ff', borderRadius: '10px', border: '2px solid #2196f3' }}>
        <button
          onClick={speakAllTopics}
          style={{
            padding: '1.2rem 2.5rem',
            backgroundColor: playingAll ? '#ff5722' : '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            boxShadow: '0 3px 6px rgba(0,0,0,0.2)'
          }}
        >
          {playingAll ? `⏹️ Stop Gesamt-Anleitung (${currentTopicIndex + 1}/${topics.length})` : '🎧 Gesamte Betrugsschutz-Anleitung anhören'}
        </button>
        <p style={{ fontSize: '1rem', color: '#1976d2', marginTop: '0.8rem', fontWeight: 'bold' }}>
          {playingAll ? 'Automatische Wiedergabe aller Betrugstipps mit 10-15 Sekunden Pause' : 'Alle 8 Betrugstipps nacheinander anhören mit Pausen dazwischen'}
        </p>
      </div>

      {topics.map((topic, index) => (
        <div
          key={index}
          style={{
            marginBottom: '2rem',
            border: `2px solid ${playingAll && currentTopicIndex === index ? '#2196f3' : '#e0e0e0'}`,
            borderRadius: '10px',
            padding: '1.5rem',
            backgroundColor: playingAll && currentTopicIndex === index ? '#e3f2fd' : '#fafafa',
            boxShadow: playingAll && currentTopicIndex === index ? '0 0 10px rgba(33, 150, 243, 0.3)' : 'none'
          }}
        >
          <h2 style={{ color: '#2e7d32', marginBottom: '1rem' }}>{topic.title}</h2>

          <div style={{
            display: 'inline-block',
            padding: '0.3rem 0.8rem',
            backgroundColor: getDangerColor(topic.danger),
            color: 'white',
            borderRadius: '15px',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            ⚠️ Gefahr: {topic.danger}
          </div>

          <p style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
            <strong>Beschreibung:</strong> {topic.description}
          </p>

          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ color: '#f57c00' }}>🚨 Warnzeichen:</h3>
            <ul style={{ paddingLeft: '1.5rem' }}>
              {topic.warningSigns.map((sign, i) => (
                <li key={i} style={{ marginBottom: '0.3rem' }}>{sign}</li>
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ color: '#1976d2' }}>🔍 Wie erkennen:</h3>
            <p style={{ fontStyle: 'italic', color: '#555' }}>{topic.howToRecognize}</p>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ color: '#388e3c' }}>✅ Was tun:</h3>
            <ul style={{ paddingLeft: '1.5rem' }}>
              {topic.whatToDo.map((action, i) => (
                <li key={i} style={{ marginBottom: '0.3rem' }}>{action}</li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => speak(topic.audio, `scam-${index}`)}
            style={{
              marginTop: '1rem',
              padding: '0.8rem 1.5rem',
              backgroundColor: playing === `scam-${index}` ? '#ff9800' : '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            {playing === `scam-${index}` ? '⏹️ Stop Audio' : '🔊 Audio abspielen'}
          </button>
        </div>
      ))}

      <div style={{
        marginTop: '3rem',
        padding: '2rem',
        backgroundColor: '#e8f5e9',
        borderRadius: '10px',
        border: '2px solid #4caf50'
      }}>
        <h2 style={{ color: '#2e7d32', marginBottom: '1rem' }}>📞 Notfall-Hilfe</h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
          Wenn Sie Opfer eines Betrugs geworden sind oder Verdacht haben:
        </p>
        <ul style={{ fontSize: '1rem', lineHeight: '1.8' }}>
          <li><strong>Polizei:</strong> 110 (sofort anrufen)</li>
          <li><strong>Betrugs-Hotline:</strong> 01805 123456</li>
          <li><strong>Bank:</strong> Sperren Sie Ihre Konten/Karten</li>
          <li><strong>Familie:</strong> Informieren Sie nahe Angehörige</li>
        </ul>
      </div>

      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #ddd' }}>
        <a
          href="/"
          style={{
            color: '#4caf50',
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

export default Scams;