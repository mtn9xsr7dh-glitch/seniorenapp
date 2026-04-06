import React, { useState } from 'react';
import { getStoryResponse } from '../services/geminiService';
import { speakGermanText } from '../utils/speechUtils';
import Mascot from './Mascot';

interface StoryCategory {
  id: string;
  name: string;
  description: string;
}

const storyCategories: StoryCategory[] = [
  { id: 'warm', name: 'Herzenswärme', description: 'liebevolle und positive Geschichten' },
  { id: 'memory', name: 'Erinnerungen', description: 'nostalgische kleine Erzählungen' },
  { id: 'happy', name: 'Heiter', description: 'leichte und fröhliche Geschichten' },
  { id: 'calm', name: 'Abendruhe', description: 'ruhige Geschichten zum Entspannen' },
  { id: 'courage', name: 'Mutmacher', description: 'aufbauende Geschichten mit Hoffnung' },
];

const fallbackStories: Record<string, { title: string; text: string }> = {
  warm: {
    title: 'Ein freundlicher Morgen',
    text: 'Als Frau Sommer an diesem Morgen das Fenster öffnete, fiel warmes Licht in die Küche. Auf dem Tisch stand schon ihre Lieblingstasse. Während der Tee zog, hörte sie draußen einen Vogel singen. Es war einer dieser stillen Augenblicke, in denen alles leicht wirkte.\n\nSpäter klingelte ihre Nachbarin und brachte frische Brötchen vorbei. Sie setzten sich zusammen, lachten über eine kleine Erinnerung von früher und freuten sich über den neuen Tag. Frau Sommer dachte bei sich: Manchmal sind es gerade die kleinen Dinge, die ein Herz ganz still glücklich machen.'
  },
  memory: {
    title: 'Der Duft von Apfelkuchen',
    text: 'Herr Weber blieb vor einer Bäckerei stehen, als ihm der Duft von warmem Apfelkuchen entgegenkam. Sofort musste er an Sonntage von früher denken. Damals stand seine Mutter in der Küche, und im ganzen Haus roch es nach Zimt und Geborgenheit.\n\nMit einem Lächeln kaufte er sich ein Stück Kuchen und setzte sich auf eine Bank in die Sonne. Während er langsam aß, fühlte sich die Erinnerung nicht traurig an, sondern wohlig und nah. Es war, als würde ein kleines Stück Vergangenheit ihn freundlich grüßen.'
  },
  happy: {
    title: 'Die rote Mütze',
    text: 'Im Park saß ein kleiner Hund mit einer roten Mütze auf der Bank und schaute sehr ernst in die Welt. Als seine Besitzerin kurz wegsah, sprang er auf, tappte zu einem Blatt und versuchte es mit der Nase einzufangen. Dabei stolperte er so lustig, dass alle in der Nähe lachen mussten.\n\nSogar Frau Klein, die eigentlich einen ruhigen Tag hatte, musste herzlich schmunzeln. Manchmal reicht ein kleiner komischer Moment, und der ganze Tag wird ein bisschen heller.'
  },
  calm: {
    title: 'Abendlicht am Fenster',
    text: 'Es war still geworden in der Wohnung, und das Abendlicht legte sich weich auf den Boden. Frau Berger setzte sich in ihren Sessel, deckte sich eine leichte Decke über die Knie und hörte dem leisen Ticken der Uhr zu.\n\nDraußen fuhr noch vereinzelt ein Auto vorbei, doch in ihrem Zimmer war Ruhe. Sie atmete tief ein und aus, sah dem Himmel beim Dunklerwerden zu und spürte, wie der Tag langsam freundlich zur Ruhe kam.'
  },
  courage: {
    title: 'Ein kleiner Schritt',
    text: 'Herr Lenz hatte sich lange nicht getraut, allein zum neuen Café an der Ecke zu gehen. An diesem Nachmittag zog er dennoch seine Jacke an und machte sich auf den Weg. Sein Herz klopfte ein wenig schneller, aber er ging weiter.\n\nIm Café wurde er freundlich begrüßt, bekam einen Platz am Fenster und bestellte sich einen Kaffee. Auf dem Heimweg dachte er stolz: Ein kleiner Schritt kann manchmal mehr verändern, als man vorher glaubt.'
  }
};

const Stories: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<StoryCategory>(storyCategories[0]);
  const [storyTitle, setStoryTitle] = useState(fallbackStories.warm.title);
  const [storyText, setStoryText] = useState(fallbackStories.warm.text);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const speakText = (text: string) => {
    speakGermanText(text, { rate: 0.9, pitch: 0.98, volume: 1 });
  };

  const generateStory = async (category: StoryCategory) => {
    setSelectedCategory(category);
    setLoading(true);
    setError('');

    try {
      const response = await getStoryResponse(category.name);
      const cleaned = response.trim();
      const lines = cleaned.split('\n').filter(line => line.trim());

      if (lines.length > 1 && lines[0].length < 90) {
        setStoryTitle(lines[0].replace(/^#+\s*/, '').trim());
        setStoryText(lines.slice(1).join('\n\n').trim());
      } else {
        setStoryTitle(`Neue Geschichte: ${category.name}`);
        setStoryText(cleaned);
      }
    } catch (err) {
      console.error(err);
      setError('Die KI konnte gerade keine neue Geschichte laden. Es wird eine schöne Ersatzgeschichte angezeigt.');
      setStoryTitle(fallbackStories[category.id].title);
      setStoryText(fallbackStories[category.id].text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '980px', margin: '0 auto' }}>
      <div style={{
        background: 'linear-gradient(135deg, #fffdf7 0%, #eef7ff 100%)',
        borderRadius: '24px',
        padding: '2rem',
        border: '1px solid #dbe8f6',
        boxShadow: '0 18px 40px rgba(15, 48, 87, 0.08)',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem', color: '#12395b' }}>📚 Lesestube</h1>
            <p style={{ fontSize: '1.08rem', color: '#5c7286', margin: 0, lineHeight: '1.6' }}>
              Schöne kleine Geschichten – immer wieder neu mit derselben KI erzeugt. Ideal zum Lesen, Entspannen und Vorlesen.
            </p>
          </div>
          <button
            onClick={() => generateStory(selectedCategory)}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#b0bec5' : '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '0.9rem 1.2rem',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '⏳ Geschichte entsteht…' : '✨ Neue Geschichte'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {storyCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => generateStory(category)}
            disabled={loading}
            style={{
              textAlign: 'left',
              backgroundColor: selectedCategory.id === category.id ? '#e3f2fd' : '#fff',
              color: '#17324d',
              border: `2px solid ${selectedCategory.id === category.id ? '#2196f3' : '#dbe8f6'}`,
              borderRadius: '14px',
              padding: '0.9rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 18px rgba(15, 48, 87, 0.05)'
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{category.name}</div>
            <div style={{ fontSize: '0.9rem', color: '#607285' }}>{category.description}</div>
          </button>
        ))}
      </div>

      {error && (
        <div style={{ marginBottom: '1rem', backgroundColor: '#fff3e0', color: '#a85c00', border: '1px solid #ffcc80', borderRadius: '12px', padding: '0.9rem 1rem' }}>
          {error}
        </div>
      )}

      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #dbe8f6',
        borderRadius: '22px',
        padding: '1.6rem',
        boxShadow: '0 14px 30px rgba(15, 48, 87, 0.07)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div>
            <div style={{ color: '#1976d2', fontWeight: 700, marginBottom: '0.3rem' }}>Neue KI-Geschichte</div>
            <h2 style={{ color: '#12395b', margin: 0 }}>{storyTitle}</h2>
          </div>
          <button
            onClick={() => speakText(`${storyTitle}. ${storyText}`)}
            style={{
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '0.8rem 1.1rem',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            🔊 Vorlesen
          </button>
        </div>

        <div style={{ color: '#44586b', fontSize: '1.08rem', lineHeight: '1.9', whiteSpace: 'pre-line' }}>
          {storyText}
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', backgroundColor: '#f8fbff', border: '1px solid #dbe8f6', borderRadius: '16px', padding: '1rem 1.2rem' }}>
        <strong style={{ color: '#12395b' }}>💡 Hinweis:</strong>
        <span style={{ color: '#5f7488' }}> Diese Geschichten werden mit derselben KI erzeugt wie die anderen Premium-Funktionen – nur in einer ruhigen, angenehmen Erzählform.</span>
      </div>

      <Mascot context="stories" size="small" />
    </div>
  );
};

export default Stories;
