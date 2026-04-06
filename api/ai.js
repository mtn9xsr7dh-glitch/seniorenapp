import Groq from 'groq-sdk';

const chatSystemPrompt = 'Du bist ein freundlicher KI-Assistent für Smartphone- und Handy-Nutzung. Antworte immer aus Sicht eines Handys oder Smartphones, niemals aus Sicht von Computer, PC oder Laptop. Antworte auf Deutsch kurz, konkret und direkt. Für normale Fragen antworte klar in wenigen Sätzen. Bei Problemen, Hilferufen oder "Wie geht das?"-Fragen gib eine einfache nummerierte Schritt-für-Schritt-Anleitung mit wenigen klaren Schritten. Keine langen Einleitungen und kein Abschweifen.';

const storySystemPrompt = 'Du bist ein freundlicher Erzähler für Senioren. Schreibe warme, gut verständliche, positive und angenehm vorlesbare Geschichten auf Deutsch. Die Geschichten sollen ruhig, schön und leicht lesbar sein.';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured' });
  }

  const groq = new Groq({ apiKey });
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const { type, question, category, problem } = body;

  try {
    if (type === 'chat') {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: chatSystemPrompt },
          { role: 'user', content: question || '' }
        ],
        model: 'llama-3.1-8b-instant',
        temperature: 0.3,
        max_tokens: 420,
      });

      return res.status(200).json({
        text: chatCompletion.choices[0]?.message?.content || 'Keine Antwort erhalten'
      });
    }

    if (type === 'story') {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: storySystemPrompt },
          {
            role: 'user',
            content: `Schreibe eine neue, schöne Geschichte für die Kategorie "${category}". Sie soll positiv, leicht verständlich und angenehm zu lesen sein. Länge: ungefähr 4 bis 8 kurze Absätze. Gib nur die Geschichte mit einem kurzen Titel aus.`
          }
        ],
        model: 'llama-3.1-8b-instant',
        temperature: 0.8,
        max_tokens: 900,
      });

      return res.status(200).json({
        text: chatCompletion.choices[0]?.message?.content || 'Keine Geschichte erhalten'
      });
    }

    if (type === 'steps') {
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

      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
      });

      const text = chatCompletion.choices[0]?.message?.content || '';
      const steps = text
        .split('\n')
        .filter((line) => line.trim())
        .map((line) => line.replace(/^\d+\.\s*/, '').trim())
        .filter((line) => line.length > 0);

      return res.status(200).json({
        steps: steps.length > 0 ? steps : ['Fehler bei der Verarbeitung der Antwort']
      });
    }

    return res.status(400).json({ error: 'Unknown AI request type' });
  } catch (error) {
    console.error('Groq API server error:', error);
    return res.status(500).json({ error: 'Fehler bei der KI-Anfrage' });
  }
}
