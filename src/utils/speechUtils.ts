export interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
}

const normalizeSpeechText = (text: string): string => {
  return text
    .replace(/\*\*/g, '')
    .replace(/[•●▪]/g, ', ')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, '. ')
    .replace(/\s+/g, ' ')
    .trim();
};

const splitTextIntoChunks = (text: string, maxLength = 220): string[] => {
  const sentences = text.match(/[^.!?]+[.!?]?/g) || [text];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (!trimmedSentence) continue;

    if (`${currentChunk} ${trimmedSentence}`.trim().length > maxLength && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = trimmedSentence;
    } else {
      currentChunk = `${currentChunk} ${trimmedSentence}`.trim();
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks.length > 0 ? chunks : [text];
};

const scoreGermanVoice = (voice: SpeechSynthesisVoice): number => {
  const name = voice.name.toLowerCase();
  const lang = voice.lang.toLowerCase();
  let score = 0;

  if (lang === 'de-de') score += 80;
  else if (lang.startsWith('de')) score += 60;

  if (/microsoft|google/.test(name)) score += 18;
  if (/katja|stefan|anna|hedda|hortense|petra|vicki/.test(name)) score += 18;
  if (/natural|online|desktop|premium/.test(name)) score += 10;
  if (voice.localService) score += 6;

  return score;
};

export const getBestGermanVoice = (): SpeechSynthesisVoice | null => {
  if (!('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const germanVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith('de'));
  if (!germanVoices.length) return voices[0] || null;

  return [...germanVoices].sort((a, b) => scoreGermanVoice(b) - scoreGermanVoice(a))[0] || null;
};

export const applyNaturalGermanVoice = (
  utterance: SpeechSynthesisUtterance,
  options: SpeechOptions = {}
): SpeechSynthesisUtterance => {
  const bestVoice = getBestGermanVoice();
  const cleanedText = normalizeSpeechText(utterance.text || '');

  utterance.text = cleanedText;
  utterance.lang = bestVoice?.lang || 'de-DE';
  utterance.rate = options.rate ?? 0.92;
  utterance.pitch = options.pitch ?? 0.98;
  utterance.volume = options.volume ?? 1;

  if (bestVoice) {
    utterance.voice = bestVoice;
  }

  return utterance;
};

export const speakGermanText = (text: string, options: SpeechOptions = {}): void => {
  if (!('speechSynthesis' in window)) return;

  const cleanedText = normalizeSpeechText(text);
  const chunks = splitTextIntoChunks(cleanedText);
  const bestVoice = getBestGermanVoice();

  window.speechSynthesis.cancel();

  const speakChunk = (index: number) => {
    if (index >= chunks.length) return;

    const utterance = new SpeechSynthesisUtterance(chunks[index]);
    utterance.lang = bestVoice?.lang || 'de-DE';
    utterance.rate = options.rate ?? 0.92;
    utterance.pitch = options.pitch ?? 0.98;
    utterance.volume = options.volume ?? 1;

    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    utterance.onend = () => speakChunk(index + 1);
    window.speechSynthesis.speak(utterance);
  };

  speakChunk(0);
};
