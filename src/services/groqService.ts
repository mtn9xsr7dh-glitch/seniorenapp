import Groq from 'groq-sdk';

const browserApiKey = import.meta.env.VITE_GROQ_API_KEY?.trim();

if (!browserApiKey) {
  console.warn('Kein Browser-Groq-Key gesetzt – die App nutzt bevorzugt die sichere Vercel-API.');
}

const groq = browserApiKey
  ? new Groq({
      apiKey: browserApiKey,
      dangerouslyAllowBrowser: true
    })
  : null;

const chatSystemPrompt = 'Du bist ein freundlicher KI-Assistent für Smartphone- und Handy-Nutzung. Antworte immer nur aus Sicht eines Handys oder Smartphones, niemals aus Sicht von Computer, PC oder Laptop. Antworte auf Deutsch kurz, konkret und leicht verständlich. Bei Problemen gib 3 bis 5 klare nummerierte Schritte. Wenn etwas unklar ist, stelle genau eine kurze Rückfrage statt zu raten. Keine langen Einleitungen, keine Halluzinationen und keine unnötigen Zusatzinfos.';
const storySystemPrompt = 'Du bist ein freundlicher Erzähler für Senioren. Schreibe warme, gut verständliche, positive und angenehm vorlesbare Geschichten auf Deutsch. Die Geschichten sollen ruhig, schön und leicht lesbar sein.';

const offlineHelpResponses = [
  {
    keywords: ['wlan', 'wifi', 'internet'],
    text: '1. Öffnen Sie die Einstellungen auf Ihrem Smartphone.\n2. Tippen Sie auf WLAN oder Internet.\n3. Wählen Sie Ihr Netzwerk aus.\n4. Geben Sie das Passwort ein und tippen Sie auf Verbinden.'
  },
  {
    keywords: ['foto', 'kamera', 'bild'],
    text: '1. Öffnen Sie die Kamera-App.\n2. Halten Sie das Handy ruhig auf das Motiv.\n3. Tippen Sie auf den runden Auslöser.\n4. Das Foto wird automatisch gespeichert.'
  },
  {
    keywords: ['anruf', 'telefonieren', 'telefon'],
    text: '1. Öffnen Sie die Telefon-App.\n2. Geben Sie eine Nummer ein oder wählen Sie einen Kontakt.\n3. Tippen Sie auf den grünen Hörer.\n4. Zum Beenden tippen Sie auf den roten Hörer.'
  },
  {
    keywords: ['lautstärke', 'lauter', 'leiser', 'ton'],
    text: '1. Drücken Sie die Lautstärketasten an der Seite des Handys.\n2. Nach oben bedeutet lauter, nach unten leiser.\n3. Prüfen Sie danach kurz den Ton.'
  },
  {
    keywords: ['bluetooth', 'kopfhörer', 'lautsprecher'],
    text: '1. Öffnen Sie die Einstellungen.\n2. Tippen Sie auf Bluetooth.\n3. Schalten Sie Bluetooth ein.\n4. Wählen Sie das gewünschte Gerät aus der Liste aus.'
  },
  {
    keywords: ['akku', 'laden', 'aufladen'],
    text: '1. Schließen Sie das Ladekabel an das Handy an.\n2. Stecken Sie das Netzteil in die Steckdose.\n3. Warten Sie, bis das Ladesymbol erscheint.\n4. Lassen Sie das Handy einige Zeit laden.'
  }
];

function getOfflineHelpResponse(question: string): string {
  const lowerQuestion = question.toLowerCase();
  const matchedResponse = offlineHelpResponses.find((entry) =>
    entry.keywords.some((keyword) => lowerQuestion.includes(keyword))
  );

  if (matchedResponse) {
    return matchedResponse.text;
  }

  return 'Bitte stellen Sie die Frage noch etwas genauer, zum Beispiel: „Wie verbinde ich WLAN?“, „Wie mache ich ein Foto?“ oder „Wie ändere ich die Lautstärke?“. Dann kann ich gezielter und richtiger helfen.';
}

function getOfflineSteps(problem: string): string[] {
  return getOfflineHelpResponse(problem)
    .split('\n')
    .map((line) => line.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean);
}

async function callHostedAi<T>(payload: Record<string, unknown>): Promise<T | null> {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.warn('Hosted AI request failed with status', response.status);
      return null;
    }

    return await response.json() as T;
  } catch (error) {
    console.warn('Hosted AI request could not be reached:', error);
    return null;
  }
}

export async function getGeminiResponse(question: string): Promise<string> {
  const hosted = await callHostedAi<{ text?: string }>({ type: 'chat', question });
  if (hosted?.text) {
    return hosted.text;
  }

  if (!groq) {
    return getOfflineHelpResponse(question);
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: chatSystemPrompt
        },
        { role: 'user', content: question }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.3,
      max_tokens: 420,
    });
    return chatCompletion.choices[0]?.message?.content || 'Keine Antwort erhalten';
  } catch (error) {
    console.error('Error calling Groq API:', error);
    throw new Error('Fehler beim Abrufen der Antwort von der KI');
  }
}

export async function getStoryResponse(category: string): Promise<string> {
  const hosted = await callHostedAi<{ text?: string }>({ type: 'story', category });
  if (hosted?.text) {
    return hosted.text;
  }

  if (!groq) {
    return `Kleine Geschichte: ${category}\n\nAn einem ruhigen Morgen öffnete sich das Fenster, und die Sonne schien freundlich in den Tag. Es war einer dieser Augenblicke, in denen alles etwas leichter wirkte. Mit einer Tasse Tee in der Hand wurde aus einem gewöhnlichen Moment ein schöner kleiner Anfang.\n\nSo darf auch ein einfacher Tag etwas Gutes bereithalten – ein freundliches Wort, ein stiller Augenblick oder eine schöne Erinnerung.`;
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: storySystemPrompt
        },
        {
          role: 'user',
          content: `Schreibe eine neue, schöne Geschichte für die Kategorie "${category}". Sie soll positiv, leicht verständlich und angenehm zu lesen sein. Länge: ungefähr 4 bis 8 kurze Absätze. Gib nur die Geschichte mit einem kurzen Titel aus.`
        }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.8,
      max_tokens: 900,
    });

    return chatCompletion.choices[0]?.message?.content || 'Keine Geschichte erhalten';
  } catch (error) {
    console.error('Error calling Groq API for story generation:', error);
    throw new Error('Fehler beim Erstellen der Geschichte');
  }
}

export async function getGeminiSteps(problem: string): Promise<string[]> {
  const prompt = `Du bist ein hilfreicher Assistent für ältere Menschen, die Hilfe mit ihrem Smartphone brauchen.

Die Person möchte folgendes Problem lösen:
"${problem}"

Gib eine klare, einfache Schritt-für-Schritt-Anleitung in deutscher Sprache. Jeder Schritt sollte:
- Kurz und verständlich sein
- Mit einfachen Worten geschrieben sein
- Genau erklären, was zu tun ist

Antworte NUR mit den Schritten, nummeriert wie folgt:
1. [Schritt 1]
2. [Schritt 2]
usw.

Vermeide zusätzliche Erklärungen oder Einleitungen.`;

  const hosted = await callHostedAi<{ steps?: string[] }>({ type: 'steps', problem });
  if (hosted?.steps?.length) {
    return hosted.steps;
  }

  if (!groq) {
    return getOfflineSteps(problem);
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
    });

    const text = chatCompletion.choices[0]?.message?.content || '';

    const steps = text
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(line => line.length > 0);

    return steps.length > 0 ? steps : ['Fehler bei der Verarbeitung der Antwort'];
  } catch (error) {
    console.error('Error calling Groq API:', error);
    if (error instanceof Error) {
      throw new Error(`API-Fehler: ${error.message}`);
    }
    throw new Error('Fehler beim Abrufen der Anleitung von der KI');
  }
}