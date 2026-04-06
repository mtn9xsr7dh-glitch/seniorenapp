import Groq from 'groq-sdk';

const apiKey = import.meta.env.VITE_GROQ_API_KEY;

if (!apiKey) {
  console.error('Groq API Key nicht gefunden!');
}

const groq = new Groq({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true // Nur für Demo-Zwecke!
});

export async function getGeminiResponse(question: string): Promise<string> {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Du bist ein freundlicher KI-Assistent für Smartphone- und Handy-Nutzung. Antworte immer aus Sicht eines Handys oder Smartphones, niemals aus Sicht von Computer, PC oder Laptop. Antworte auf Deutsch kurz, konkret und direkt. Für normale Fragen antworte klar in wenigen Sätzen. Bei Problemen, Hilferufen oder "Wie geht das?"-Fragen gib eine einfache nummerierte Schritt-für-Schritt-Anleitung mit wenigen klaren Schritten. Keine langen Einleitungen und kein Abschweifen.'
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
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Du bist ein freundlicher Erzähler für Senioren. Schreibe warme, gut verständliche, positive und angenehm vorlesbare Geschichten auf Deutsch. Die Geschichten sollen ruhig, schön und leicht lesbar sein.'
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

  try {
    console.log('Calling Groq API with prompt:', prompt.substring(0, 100) + '...');
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
    });

    const text = chatCompletion.choices[0]?.message?.content || '';
    console.log('Groq response:', text);

    // Parse the response into steps
    const steps = text
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        // Remove numbering if present
        return line.replace(/^\d+\.\s*/, '').trim();
      })
      .filter(line => line.length > 0);

    console.log('Parsed steps:', steps);
    return steps.length > 0 ? steps : ['Fehler bei der Verarbeitung der Antwort'];
  } catch (error) {
    console.error('Error calling Groq API:', error);
    // More detailed error message
    if (error instanceof Error) {
      throw new Error(`API-Fehler: ${error.message}`);
    }
    throw new Error('Fehler beim Abrufen der Anleitung von der KI');
  }
}