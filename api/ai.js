import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const modelName = 'gemini-2.0-flash';

const chatSystemPrompt = 'Du bist ein hilfreicher KI-Assistent. Antworte auf Deutsch natürlich, freundlich, klar und direkt. Wenn jemand ein Problem lösen will, erkläre es verständlich und bei Bedarf Schritt für Schritt.';
const storySystemPrompt = 'Du bist ein freundlicher Erzähler für Senioren. Schreibe warme, gut verständliche, positive und angenehm vorlesbare Geschichten auf Deutsch. Die Geschichten sollen ruhig, schön und leicht lesbar sein.';

function normalizeHistory(history) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter(
      (entry) =>
        entry &&
        (entry.role === 'user' || entry.role === 'assistant') &&
        typeof entry.content === 'string' &&
        entry.content.trim()
    )
    .slice(-8)
    .map((entry) => ({ role: entry.role, content: entry.content.trim() }));
}

function toGeminiContents(history, latestUserText = '') {
  const contents = history.map((entry) => ({
    role: entry.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: entry.content }]
  }));

  if (latestUserText.trim()) {
    contents.push({
      role: 'user',
      parts: [{ text: latestUserText.trim() }]
    });
  }

  return contents;
}

function extractText(data) {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) {
    return '';
  }

  return parts
    .map((part) => (typeof part?.text === 'string' ? part.text : ''))
    .join('')
    .trim();
}

async function callGemini({ systemInstruction, contents, temperature = 0.7, maxOutputTokens = 700 }) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        contents,
        generationConfig: {
          temperature,
          maxOutputTokens
        }
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini request failed (${response.status}): ${errorText}`);
  }

  return await response.json();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const { type, question, category, problem, history } = body;
  const safeHistory = normalizeHistory(history);

  try {
    if (type === 'chat') {
      const data = await callGemini({
        systemInstruction: chatSystemPrompt,
        contents: toGeminiContents(safeHistory, question || ''),
        temperature: 0.7,
        maxOutputTokens: 700
      });

      return res.status(200).json({
        text: extractText(data) || 'Keine Antwort erhalten'
      });
    }

    if (type === 'story') {
      const data = await callGemini({
        systemInstruction: storySystemPrompt,
        contents: [
          {
            role: 'user',
            parts: [{ text: `Schreibe eine neue, schöne Geschichte für die Kategorie "${category}". Sie soll positiv, leicht verständlich und angenehm zu lesen sein. Länge: ungefähr 4 bis 8 kurze Absätze. Gib nur die Geschichte mit einem kurzen Titel aus.` }]
          }
        ],
        temperature: 0.85,
        maxOutputTokens: 900
      });

      return res.status(200).json({
        text: extractText(data) || 'Keine Geschichte erhalten'
      });
    }

    if (type === 'steps') {
      const stepPrompt = `Erkläre das folgende Problem auf Deutsch in klaren, einfachen, nummerierten Schritten:\n\n${problem}`;
      const data = await callGemini({
        systemInstruction: 'Du erklärst technische Hilfe ruhig, freundlich und leicht verständlich. Antworte nur mit nummerierten Schritten.',
        contents: [{ role: 'user', parts: [{ text: stepPrompt }] }],
        temperature: 0.4,
        maxOutputTokens: 500
      });

      const text = extractText(data);
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
    console.error('Gemini API server error:', error);
    return res.status(500).json({ error: 'Fehler bei der KI-Anfrage' });
  }
}
