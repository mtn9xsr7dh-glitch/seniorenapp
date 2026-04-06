import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config({ path: '.env.local' });
dotenv.config();

const modelName = 'gemini-2.0-flash';
const groqModel = 'llama-3.1-8b-instant';

const chatSystemPrompt = 'Du bist ein hilfreicher KI-Assistent. Antworte auf Deutsch natürlich, freundlich, klar und direkt. Wenn jemand ein Problem lösen will, erkläre es verständlich und bei Bedarf Schritt für Schritt.';
const storySystemPrompt = 'Du bist ein freundlicher Erzähler für Senioren. Schreibe warme, gut verständliche, positive und angenehm vorlesbare Geschichten auf Deutsch. Die Geschichten sollen ruhig, schön und leicht lesbar sein.';

const offlineChatFallback = 'Ich helfe Ihnen gern. Versuchen Sie es bitte in einfachen Schritten: Öffnen Sie zuerst die passende App oder die Einstellungen auf Ihrem Smartphone und beschreiben Sie dann kurz, was nicht klappt.';

function getTrimmedEnvValue(...keys) {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return '';
}

function getOfflineChatResponse(question = '') {
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes('wlan') || lowerQuestion.includes('wifi') || lowerQuestion.includes('internet')) {
    return '1. Öffnen Sie die Einstellungen auf Ihrem Smartphone.\n2. Tippen Sie auf WLAN oder Internet.\n3. Wählen Sie Ihr Netzwerk aus.\n4. Geben Sie das Passwort ein und tippen Sie auf Verbinden.';
  }

  if (lowerQuestion.includes('foto') || lowerQuestion.includes('kamera') || lowerQuestion.includes('bild')) {
    return '1. Öffnen Sie die Kamera-App.\n2. Halten Sie das Handy ruhig auf das Motiv.\n3. Tippen Sie auf den runden Auslöser.\n4. Das Foto wird automatisch gespeichert.';
  }

  if (lowerQuestion.includes('laut') || lowerQuestion.includes('ton')) {
    return '1. Drücken Sie die Lautstärketasten an der Seite des Handys.\n2. Nach oben bedeutet lauter, nach unten leiser.\n3. Prüfen Sie danach kurz den Ton.';
  }

  return offlineChatFallback;
}

function getOfflineSteps(problem = '') {
  return getOfflineChatResponse(problem)
    .split('\n')
    .map((line) => line.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean);
}

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
  const apiKey = getTrimmedEnvValue('GEMINI_API_KEY', 'GOOGLE_API_KEY', 'VITE_GEMINI_API_KEY');

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

async function callGroq({ messages, temperature = 0.7, maxTokens = 700 }) {
  const apiKey = getTrimmedEnvValue('GROQ_API_KEY', 'VITE_GROQ_API_KEY');

  if (!apiKey) {
    throw new Error('GROQ_API_KEY not configured');
  }

  const groq = new Groq({ apiKey });
  const completion = await groq.chat.completions.create({
    model: groqModel,
    messages,
    temperature,
    max_tokens: maxTokens,
  });

  return completion.choices[0]?.message?.content?.trim() || '';
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
      try {
        const data = await callGemini({
          systemInstruction: chatSystemPrompt,
          contents: toGeminiContents(safeHistory, question || ''),
          temperature: 0.7,
          maxOutputTokens: 700
        });

        return res.status(200).json({
          text: extractText(data) || 'Keine Antwort erhalten'
        });
      } catch (geminiError) {
        console.error('Gemini chat failed, using fallback:', geminiError);

        try {
          const groqText = await callGroq({
            messages: [
              { role: 'system', content: chatSystemPrompt },
              ...safeHistory,
              { role: 'user', content: question || '' }
            ],
            temperature: 0.7,
            maxTokens: 700
          });

          return res.status(200).json({
            text: groqText || getOfflineChatResponse(question || '')
          });
        } catch (groqError) {
          console.error('Groq chat fallback failed:', groqError);
          return res.status(200).json({
            text: getOfflineChatResponse(question || '')
          });
        }
      }
    }

    if (type === 'story') {
      try {
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
      } catch (geminiError) {
        console.error('Gemini story failed, using fallback:', geminiError);

        try {
          const groqText = await callGroq({
            messages: [
              { role: 'system', content: storySystemPrompt },
              { role: 'user', content: `Schreibe eine neue, schöne Geschichte für die Kategorie "${category}".` }
            ],
            temperature: 0.85,
            maxTokens: 900
          });

          return res.status(200).json({
            text: groqText || `Kleine Geschichte: ${category}\n\nEs ist ein ruhiger, freundlicher Moment, an dem ein einfacher Tag etwas Schönes bereithält.`
          });
        } catch (groqError) {
          console.error('Groq story fallback failed:', groqError);
          return res.status(200).json({
            text: `Kleine Geschichte: ${category}\n\nEs ist ein ruhiger, freundlicher Moment, an dem ein einfacher Tag etwas Schönes bereithält.`
          });
        }
      }
    }

    if (type === 'steps') {
      const stepPrompt = `Erkläre das folgende Problem auf Deutsch in klaren, einfachen, nummerierten Schritten:\n\n${problem}`;

      try {
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
      } catch (geminiError) {
        console.error('Gemini steps failed, using fallback:', geminiError);

        try {
          const groqText = await callGroq({
            messages: [
              { role: 'system', content: 'Erkläre technische Hilfe ruhig, freundlich und nur in nummerierten Schritten.' },
              { role: 'user', content: stepPrompt }
            ],
            temperature: 0.4,
            maxTokens: 500
          });

          const steps = groqText
            .split('\n')
            .filter((line) => line.trim())
            .map((line) => line.replace(/^\d+\.\s*/, '').trim())
            .filter((line) => line.length > 0);

          return res.status(200).json({
            steps: steps.length > 0 ? steps : getOfflineSteps(problem || '')
          });
        } catch (groqError) {
          console.error('Groq steps fallback failed:', groqError);
          return res.status(200).json({
            steps: getOfflineSteps(problem || '')
          });
        }
      }
    }

    return res.status(400).json({ error: 'Unknown AI request type' });
  } catch (error) {
    console.error('AI server error:', error);
    return res.status(200).json({
      text: offlineChatFallback,
      steps: getOfflineSteps(problem || '')
    });
  }
}
