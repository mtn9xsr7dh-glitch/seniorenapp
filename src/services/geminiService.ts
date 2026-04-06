type AiChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

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

  return 'Bitte stellen Sie die Frage noch etwas genauer, zum Beispiel: „Wie verbinde ich WLAN?“, „Wie mache ich ein Foto?“ oder „Wie ändere ich die Lautstärke?“. Dann kann ich gezielter helfen.';
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
      console.warn('Gemini request failed with status', response.status);
      return null;
    }

    return await response.json() as T;
  } catch (error) {
    console.warn('Gemini request could not be reached:', error);
    return null;
  }
}

export async function getGeminiResponse(question: string, history: AiChatMessage[] = []): Promise<string> {
  const hosted = await callHostedAi<{ text?: string }>({ type: 'chat', question, history });
  if (hosted?.text?.trim()) {
    return hosted.text.trim();
  }

  return getOfflineHelpResponse(question);
}

export async function getStoryResponse(category: string): Promise<string> {
  const hosted = await callHostedAi<{ text?: string }>({ type: 'story', category });
  if (hosted?.text?.trim()) {
    return hosted.text.trim();
  }

  return `Kleine Geschichte: ${category}\n\nAn einem ruhigen Morgen öffnete sich das Fenster, und die Sonne schien freundlich in den Tag. Es war einer dieser Augenblicke, in denen alles etwas leichter wirkte. Mit einer Tasse Tee in der Hand wurde aus einem gewöhnlichen Moment ein schöner kleiner Anfang.\n\nSo darf auch ein einfacher Tag etwas Gutes bereithalten – ein freundliches Wort, ein stiller Augenblick oder eine schöne Erinnerung.`;
}

export async function getGeminiSteps(problem: string): Promise<string[]> {
  const hosted = await callHostedAi<{ steps?: string[] }>({ type: 'steps', problem });
  if (hosted?.steps?.length) {
    return hosted.steps;
  }

  return getOfflineSteps(problem);
}
