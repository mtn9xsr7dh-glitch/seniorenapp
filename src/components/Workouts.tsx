import React, { useState } from 'react';
import Mascot from './Mascot';
import { addWorkoutPoints } from '../utils/progressUtils';
import { speakGermanText } from '../utils/speechUtils';

interface Workout {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: number; // in Minuten
  difficulty: 'Leicht' | 'Mittel' | 'Fortgeschritten';
  exercises: Exercise[];
  icon: string;
}

interface Exercise {
  name: string;
  description: string;
  details?: string;
  repetitions?: string;
  duration?: string;
  tips: string[];
}

const Workouts: React.FC = () => {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [currentExercise, setCurrentExercise] = useState(0);

  const workouts: Workout[] = [
    {
      id: 'warmup',
      name: 'Aufwärmen',
      category: 'Grundlagen',
      description: 'Sanfte Übungen zur Vorbereitung des Körpers',
      duration: 10,
      difficulty: 'Leicht',
      icon: '🌅',
      exercises: [
        {
          name: 'Kopf drehen',
          description: 'Setzen Sie sich bequem hin. Drehen Sie den Kopf langsam nach links und rechts.',
          details: 'Atmen Sie gleichmäßig, drehen Sie den Kopf kontrolliert und halten Sie kurz auf jeder Seite.',
          repetitions: '10 Mal pro Seite',
          tips: ['Bewegen Sie sich langsam', 'Atmen Sie ruhig', 'Stoppen Sie bei Schmerzen']
        },
        {
          name: 'Schulterkreisen',
          description: 'Heben Sie die Schultern an und kreisen Sie sie langsam vorwärts und rückwärts.',
          details: 'Kreise langsam ausführen, Schultern entspannt halten und jede Richtung gleich viele Wiederholungen machen.',
          repetitions: '10 Kreise pro Richtung',
          tips: ['Halten Sie den Rücken gerade', 'Machen Sie kleine Kreise', 'Entspannen Sie die Schultern']
        },
        {
          name: 'Arme schwingen',
          description: 'Schwingen Sie die Arme locker vor und zurück wie beim Gehen.',
          details: 'Lassen Sie die Arme locker hängen und schwingen Sie sie sanft bis Schulterhöhe.',
          duration: '1 Minute',
          tips: ['Lassen Sie die Arme natürlich schwingen', 'Halten Sie den Oberkörper ruhig']
        }
      ]
    },
    {
      id: 'strength',
      name: 'Krafttraining',
      category: 'Kraft',
      description: 'Übungen zur Stärkung der Muskulatur',
      duration: 15,
      difficulty: 'Mittel',
      icon: '💪',
      exercises: [
        {
          name: 'Wandstütz',
          description: 'Stützen Sie sich mit den Händen an einer Wand ab. Beugen Sie die Ellenbogen und kommen Sie wieder hoch.',
          details: 'Die Füße stehen hüftbreit, der Körper bleibt gerade und Sie drücken sich kontrolliert wieder nach oben.',
          repetitions: '8-10 Mal',
          tips: ['Halten Sie den Körper gerade', 'Atmen Sie beim Beugen aus', 'Machen Sie Pausen bei Bedarf']
        },
        {
          name: 'Beinheben im Sitzen',
          description: 'Setzen Sie sich auf einen Stuhl. Heben Sie ein Bein langsam an und senken Sie es wieder.',
          details: 'Drücken Sie den Rücken leicht an die Lehne, halten Sie das Bein gestreckt und senken Sie es langsam ab.',
          repetitions: '10 Mal pro Bein',
          tips: ['Halten Sie den Rücken gerade', 'Heben Sie langsam', 'Wechseln Sie die Beine ab']
        },
        {
          name: 'Arme heben',
          description: 'Stehen oder sitzen Sie bequem. Heben Sie beide Arme langsam nach vorne oben.',
          details: 'Strecken Sie die Arme gerade nach oben und lassen Sie sie wieder kontrolliert herunter.',
          repetitions: '10-12 Mal',
          tips: ['Bewegen Sie sich kontrolliert', 'Atmen Sie gleichmäßig', 'Stoppen Sie bei Schmerzen']
        }
      ]
    },
    {
      id: 'balance',
      name: 'Balance & Gleichgewicht',
      category: 'Balance',
      description: 'Übungen zur Verbesserung des Gleichgewichts',
      duration: 12,
      difficulty: 'Mittel',
      icon: '⚖️',
      exercises: [
        {
          name: 'Einbeinstand',
          description: 'Stellen Sie sich neben einen Stuhl. Heben Sie ein Bein leicht an und halten Sie die Balance.',
          details: 'Stützen Sie sich mit einer Hand am Stuhl ab und halten Sie das Gewicht auf dem Standbein.',
          duration: '10-20 Sekunden pro Bein',
          tips: ['Halten Sie sich am Stuhl fest', 'Schauen Sie geradeaus', 'Atmen Sie ruhig']
        },
        {
          name: 'Ferse zu Zehe',
          description: 'Stellen Sie einen Fuß direkt hinter den anderen. Halten Sie die Balance.',
          details: 'Setzen Sie einen Fuß direkt vor den anderen, Augen nach vorn gerichtet und Körper aufrecht.',
          duration: '10-20 Sekunden',
          tips: ['Stellen Sie sich neben einen Halt', 'Schauen Sie nach vorne', 'Machen Sie kleine Schritte']
        },
        {
          name: 'Tandem-Gang',
          description: 'Gehen Sie langsam, indem Sie einen Fuß direkt vor den anderen setzen.',
          details: 'Führen Sie die Schritte langsam aus, halten Sie den Blick nach vorne und nutzen Sie eine Stütze bei Bedarf.',
          duration: '1 Minute',
          tips: ['Gehen Sie langsam', 'Halten Sie sich fest wenn nötig', 'Konzentrieren Sie sich auf jeden Schritt']
        }
      ]
    },
    {
      id: 'stretching',
      name: 'Dehnübungen',
      category: 'Flexibilität',
      description: 'Übungen zur Verbesserung der Beweglichkeit',
      duration: 10,
      difficulty: 'Leicht',
      icon: '🧘',
      exercises: [
        {
          name: 'Nackendehnung',
          description: 'Neigen Sie den Kopf langsam zur Seite und halten Sie die Dehnung.',
          details: 'Führen Sie den Kopf langsam zur Schulter, halten Sie sanften Druck und atmen Sie dabei tief.',
          duration: '15-20 Sekunden pro Seite',
          tips: ['Ziehen Sie nicht zu stark', 'Atmen Sie ruhig', 'Halten Sie die Schultern entspannt']
        },
        {
          name: 'Schulterdehnung',
          description: 'Führen Sie einen Arm über die Brust und ziehen Sie ihn sanft mit dem anderen Arm.',
          details: 'Halten Sie den Arms gestreckt und ziehen Sie ihn vorsichtig zur Brust, ohne die Schulter hochzuziehen.',
          duration: '15-20 Sekunden pro Arm',
          tips: ['Ziehen Sie sanft', 'Halten Sie den Rücken gerade', 'Atmen Sie in die Dehnung']
        },
        {
          name: 'Beindehnung',
          description: 'Setzen Sie sich hin und ziehen Sie ein Bein langsam zur Brust.',
          details: 'Halten Sie den Rücken gerade, greifen Sie das Bein und ziehen Sie es ruhig zur Brust.',
          duration: '15-20 Sekunden pro Bein',
          tips: ['Ziehen Sie nicht zu stark', 'Halten Sie den Rücken gerade', 'Wechseln Sie die Beine']
        }
      ]
    },
    {
      id: 'relaxation',
      name: 'Entspannung',
      category: 'Ruhe',
      description: 'Übungen zur Stressreduktion und Entspannung',
      duration: 8,
      difficulty: 'Leicht',
      icon: '😌',
      exercises: [
        {
          name: 'Atemübung',
          description: 'Setzen Sie sich bequem hin. Atmen Sie tief ein und langsam aus.',
          details: 'Atmen Sie durch die Nase ein, spüren Sie wie sich der Bauch hebt und atmen Sie langsam wieder aus.',
          duration: '2 Minuten',
          tips: ['Legen Sie eine Hand auf den Bauch', 'Atmen Sie durch die Nase', 'Lassen Sie los']
        },
        {
          name: 'Progressive Muskelentspannung',
          description: 'Spannen Sie eine Muskelgruppe an und lassen Sie dann los.',
          details: 'Spannen Sie jede Muskelgruppe 5 Sekunden an und entspannen Sie sie danach bewusst wieder.',
          duration: '3 Minuten',
          tips: ['Beginnen Sie mit den Füßen', 'Spannen Sie 5 Sekunden an', 'Lassen Sie bewusst los']
        },
        {
          name: 'Ruheposition',
          description: 'Legen Sie sich bequem hin oder setzen Sie sich entspannt hin.',
          details: 'Schließen Sie die Augen, atmen Sie tief und lassen Sie den Körper vollständig ruhen.',
          duration: '3 Minuten',
          tips: ['Schließen Sie die Augen', 'Atmen Sie ruhig', 'Lassen Sie Gedanken ziehen']
        }
      ]
    },
    {
      id: 'chair-fitness',
      name: 'Stuhl-Fitness',
      category: 'Kraft',
      description: 'Sanfte Kraftübungen im Sitzen',
      duration: 14,
      difficulty: 'Leicht',
      icon: '🪑',
      exercises: [
        {
          name: 'Stuhl-Knieheben',
          description: 'Heben Sie im Sitzen ein Knie langsam an und senken Sie es wieder.',
          details: 'Halten Sie den Rücken gerade und führen Sie das Knie langsam zur Brust, dann kontrolliert wieder nach unten.',
          repetitions: '10 Mal pro Bein',
          tips: ['Halten Sie den Rücken gerade', 'Bewegen Sie langsam', 'Wechseln Sie die Beine']
        },
        {
          name: 'Sitzende Seitendrehung',
          description: 'Drehen Sie den Oberkörper langsam zur Seite, halten Sie den Stuhl mit den Händen.',
          details: 'Drehen Sie sich aus der Taille, nicht aus dem Nacken, und halten Sie die Beine gerade nach vorne.',
          repetitions: '8-10 Mal pro Seite',
          tips: ['Drehen Sie langsam', 'Halten Sie die Schultern entspannt', 'Atmen Sie gleichmäßig']
        },
        {
          name: 'Armkreisen im Sitzen',
          description: 'Kreisen Sie die Arme vorwärts und rückwärts, um Schultern und Arme zu mobilisieren.',
          details: 'Führen Sie kleine, kontrollierte Kreise mit entspannten Schultern aus, erst vorwärts dann rückwärts.',
          repetitions: '10 Kreise pro Richtung',
          tips: ['Halten Sie den Rücken gerade', 'Bewegen Sie die Arme locker', 'Atmen Sie ruhig']
        }
      ]
    },
    {
      id: 'core-posture',
      name: 'Kern & Haltung',
      category: 'Stabilität',
      description: 'Stärken Sie Bauch, Rücken und Haltung',
      duration: 14,
      difficulty: 'Mittel',
      icon: '🏋️‍♀️',
      exercises: [
        {
          name: 'Sitzende Bauchspannung',
          description: 'Spannen Sie die Bauchmuskeln an, halten Sie den Rücken gerade.',
          details: 'Atmen Sie aus, spannen Sie den Bauch an und halten Sie die Spannung für einige Sekunden.',
          repetitions: '8-10 Mal',
          tips: ['Halten Sie den Rücken gerade', 'Atmen Sie ruhig', 'Spannen Sie den Bauch bewusst an']
        },
        {
          name: 'Rückenstrecker',
          description: 'Strecken Sie den Oberkörper sanft nach hinten, wenn Sie sicher sitzen.',
          details: 'Schieben Sie die Schultern zurück und halten Sie die Brust geöffnet, ohne den Nacken zu überstrecken.',
          repetitions: '8-10 Mal',
          tips: ['Bewegen Sie kontrolliert', 'Halten Sie den Kopf gerade', 'Atmen Sie ruhig']
        },
        {
          name: 'Stehender Hüftöffner',
          description: 'Heben Sie ein Knie zur Seite und öffnen Sie dabei gleichzeitig die Hüfte.',
          details: 'Stellen Sie sich aufrecht hin, heben Sie das Knie seitlich an und senken Sie es langsam wieder ab.',
          repetitions: '8-10 Mal pro Seite',
          tips: ['Halten Sie den Oberkörper gerade', 'Stützen Sie sich wenn nötig', 'Atmen Sie gleichmäßig']
        }
      ]
    },
    {
      id: 'mobility',
      name: 'Mobilität',
      category: 'Bewegung',
      description: 'Flüssige Bewegungen für mehr Gelenkigkeit',
      duration: 12,
      difficulty: 'Leicht',
      icon: '🔄',
      exercises: [
        {
          name: 'Hüftkreisen',
          description: 'Kreisen Sie die Hüfte langsam in beide Richtungen.',
          details: 'Stellen Sie die Füße hüftbreit, bewegen Sie die Hüfte langsam und gleichmäßig durch den Kreis.',
          repetitions: '10 Kreise pro Richtung',
          tips: ['Halten Sie den Rücken gerade', 'Bewegen Sie langsam', 'Atmen Sie ruhig']
        },
        {
          name: 'Fußgelenk-Kreisen',
          description: 'Kreisen Sie ein Fußgelenk nach dem anderen.',
          details: 'Heben Sie den Fuß leicht an und machen Sie kreisende Bewegungen mit dem Fußgelenk.',
          repetitions: '10 Kreise pro Richtung und Fuß',
          tips: ['Bewegen Sie gleichmäßig', 'Halten Sie das Bein leicht angehoben', 'Machen Sie beide Seiten']
        },
        {
          name: 'Wirbelsäulenrollung',
          description: 'Rollen Sie die Wirbelsäule langsam von oben nach unten.',
          details: 'Beginnen Sie im Stehen, lassen Sie Kopf, Schulter und Wirbelsäule langsam nach unten sinken.',
          repetitions: '5 Mal',
          tips: ['Bewegen Sie langsam', 'Halten Sie die Knie leicht gebeugt', 'Atmen Sie tief']
        }
      ]
    },
    {
      id: 'cardio',
      name: 'Herz & Ausdauer',
      category: 'Cardio',
      description: 'Leichte Herz-Kreislauf-Übungen',
      duration: 10,
      difficulty: 'Leicht',
      icon: '❤️',
      exercises: [
        {
          name: 'Sitzender March',
          description: 'Marschieren Sie auf der Stelle im Sitzen.',
          details: 'Heben Sie abwechselnd die Beine an und bewegen Sie die Arme leicht mit.',
          duration: '1 Minute',
          tips: ['Machen Sie kleine Schritte', 'Atmen Sie regelmäßig', 'Bleiben Sie entspannt']
        },
        {
          name: 'Schulterklopfen',
          description: 'Klopfen Sie sich abwechselnd auf die Schultern.',
          details: 'Berühren Sie die Schultern nacheinander mit den Händen und halten Sie den Oberkörper ruhig.',
          duration: '1 Minute',
          tips: ['Bewegen Sie sich ruhig', 'Lassen Sie die Schultern locker', 'Atmen Sie normal']
        },
        {
          name: 'Schaukelnde Schritte',
          description: 'Machen Sie kleine seitliche Schritte und wiegen Sie den Oberkörper leicht.',
          details: 'Treten Sie seitwärts, halten Sie die Knie leicht gebeugt und verlagern Sie das Gewicht behutsam.',
          duration: '1 Minute',
          tips: ['Gehen Sie langsam', 'Halten Sie den Oberkörper stabil', 'Atmen Sie ruhig']
        }
      ]
    },
    {
      id: 'joint-care',
      name: 'Gelenkpflege',
      category: 'Flexibilität',
      description: 'Sanfte Bewegungen für Gelenke und Mobilität',
      duration: 12,
      difficulty: 'Leicht',
      icon: '🦴',
      exercises: [
        {
          name: 'Handgelenk-Kreisen',
          description: 'Kreisen Sie die Handgelenke langsam in beide Richtungen.',
          details: 'Strecken Sie die Arme vor sich aus und drehen Sie die Handgelenke mit gleichmäßigem Tempo.',
          repetitions: '10 Kreise pro Richtung',
          tips: ['Bewegen Sie langsam', 'Halten Sie die Hände entspannt', 'Atmen Sie ruhig']
        },
        {
          name: 'Knöchel anziehen',
          description: 'Ziehen Sie die Füße abwechselnd an und drücken Sie sie wieder nach unten.',
          details: 'Führen Sie die Bewegung kontrolliert aus und spüren Sie, wie sich die Knöchel mobilisieren.',
          repetitions: '10 Mal pro Fuß',
          tips: ['Halten Sie das Bein stabil', 'Bewegen Sie sanft', 'Atmen Sie ruhig']
        },
        {
          name: 'Schulterrollung',
          description: 'Heben und senken Sie die Schultern langsam.',
          details: 'Lassen Sie die Schultern nach oben wachsen und rollen Sie sie dann entspannt nach hinten.',
          repetitions: '10 Mal',
          tips: ['Halten Sie den Nacken locker', 'Atmen Sie tief', 'Bewegen Sie langsam']
        }
      ]
    },
    {
      id: 'coordination',
      name: 'Koordination',
      category: 'Balance',
      description: 'Übungen für besseres Gleichgewicht und Körpergefühl',
      duration: 12,
      difficulty: 'Mittel',
      icon: '🤹',
      exercises: [
        {
          name: 'Ball in den Händen',
          description: 'Halten Sie einen kleinen Ball oder befüllte Flasche und bewegen Sie ihn langsam vor und zurück.',
          details: 'Fokussieren Sie den Blick auf den Ball und bewegen Sie ihn gleichmäßig mit beiden Händen.',
          repetitions: '10 Mal',
          tips: ['Halten Sie den Oberkörper stabil', 'Atmen Sie gleichmäßig', 'Nutzen Sie einen sicheren Sitz']
        },
        {
          name: 'Kreuzschritte',
          description: 'Kreuzen Sie die Beine abwechselnd vor und hintereinander.',
          details: 'Achten Sie auf einen ruhigen Rhythmus und halten Sie die Knie nur leicht gebeugt.',
          repetitions: '10 Mal pro Seite',
          tips: ['Bewegen Sie langsam', 'Halten Sie den Blick nach vorne', 'Nutzen Sie eine Handstütze bei Bedarf']
        },
        {
          name: 'Blickwechsel',
          description: 'Schauen Sie abwechselnd nach rechts und links, während Sie ruhig stehen oder sitzen.',
          details: 'Bewegen Sie nur die Augen und den Kopf leicht, ohne den Körper zu drehen.',
          repetitions: '10 Mal pro Seite',
          tips: ['Atmen Sie ruhig', 'Halten Sie den Rücken gerade', 'Bewegen Sie langsam']
        }
      ]
    },
    {
      id: 'back-strength',
      name: 'Rückenstärkung',
      category: 'Kraft',
      description: 'Sanfte Übungen für einen stärkeren Rücken',
      duration: 15,
      difficulty: 'Mittel',
      icon: '🧍‍♂️',
      exercises: [
        {
          name: 'Schulterblatt-Pressen',
          description: 'Ziehen Sie die Schulterblätter langsam zusammen und lösen Sie sie wieder.',
          details: 'Halten Sie die Arme entspannt und drücken Sie die Schulterblätter sanft nach hinten zueinander.',
          repetitions: '10-12 Mal',
          tips: ['Atmen Sie ruhig', 'Vermeiden Sie das Hochziehen der Schultern', 'Führen Sie die Bewegung langsam aus']
        },
        {
          name: 'Brustöffnung',
          description: 'Heben Sie die Arme seitlich an und öffnen Sie die Brust.',
          details: 'Ziehen Sie die Schulterblätter nach unten und halten Sie die Brust offen, ohne den Nacken zu verspannen.',
          repetitions: '8-10 Mal',
          tips: ['Halten Sie den Rücken gerade', 'Atmen Sie tief', 'Bewegen Sie kontrolliert']
        },
        {
          name: 'Sitzender Rückenstrecker',
          description: 'Strecken Sie den Oberkörper sanft nach oben und halten Sie kurz.',
          details: 'Drücken Sie die Brust nach vorn und heben Sie den Kopf leicht an, während der Rücken gestreckt bleibt.',
          repetitions: '8-10 Mal',
          tips: ['Halten Sie den Bauch leicht angespannt', 'Atmen Sie gleichmäßig', 'Bewegen Sie langsam']
        }
      ]
    },
    {
      id: 'chair-yoga',
      name: 'Stuhl-Yoga',
      category: 'Entspannung',
      description: 'Yoga-ähnliche Dehnungen für sanfte Entspannung',
      duration: 12,
      difficulty: 'Leicht',
      icon: '🧘‍♂️',
      exercises: [
        {
          name: 'Katze-Kuh im Sitzen',
          description: 'Runden und senken Sie den Rücken im Wechsel.',
          details: 'Atmen Sie ein, heben Sie die Brust, atmen Sie aus und runden Sie den Rücken nach innen.',
          repetitions: '8-10 Mal',
          tips: ['Bewegen Sie langsam', 'Halten Sie den Bauch leicht angespannt', 'Atmen Sie bewusst']
        },
        {
          name: 'Seitneigung',
          description: 'Neigen Sie den Oberkörper zur Seite und dehnen Sie die Flanke.',
          details: 'Heben Sie einen Arm über den Kopf und neigen Sie sich sanft zur Seite, ohne die Schultern hochzuziehen.',
          repetitions: '5-6 Mal pro Seite',
          tips: ['Halten Sie den Rücken gerade', 'Atmen Sie tief', 'Bewegen Sie sanft']
        },
        {
          name: 'Nackenweich',
          description: 'Lassen Sie den Kopf sanft nach vorne und zur Seite sinken.',
          details: 'Bewegen Sie den Kopf langsam, spüren Sie die Dehnung und entspannen Sie den Nacken.',
          repetitions: '5 Mal pro Richtung',
          tips: ['Bewegen Sie vorsichtig', 'Atmen Sie ruhig', 'Halten Sie den Kiefer locker']
        }
      ]
    },
    {
      id: 'sit-stand',
      name: 'Sitzen & Aufstehen',
      category: 'Vitalität',
      description: 'Übungen zum sicheren Aufstehen und Hinsetzen',
      duration: 14,
      difficulty: 'Leicht',
      icon: '🚶',
      exercises: [
        {
          name: 'Stuhl aufstehen',
          description: 'Gehen Sie vom Sitzen ins Stehen und zurück.',
          details: 'Schieben Sie das Gesäß nach vorn, stellen Sie die Füße fest auf und drücken Sie sich langsam hoch.',
          repetitions: '8-10 Mal',
          tips: ['Nutzen Sie ggf. die Armlehnen', 'Halten Sie den Blick nach vorne', 'Atmen Sie aus beim Aufstehen']
        },
        {
          name: 'Fersen heben',
          description: 'Heben Sie die Fersen an, während Sie stehen.',
          details: 'Stehen Sie stabil und heben Sie die Fersen langsam an, um die Waden zu aktivieren.',
          repetitions: '10-12 Mal',
          tips: ['Halten Sie sich fest', 'Bewegen Sie ruhig', 'Atmen Sie gleichmäßig']
        },
        {
          name: 'Armstütz am Stuhl',
          description: 'Stützen Sie sich mit den Händen am Stuhl ab und entlasten Sie die Beine.',
          details: 'Lassen Sie den Oberkörper leicht nach vorne kommen und stützen Sie sich ruhig am Stuhl.',
          repetitions: '8-10 Mal',
          tips: ['Halten Sie den Rücken gerade', 'Bewegen Sie kontrolliert', 'Atmen Sie ruhig']
        }
      ]
    },
    {
      id: 'full-body',
      name: 'Ganzkörper',
      category: 'Fitness',
      description: 'Sanfte Übungen für den gesamten Körper',
      duration: 15,
      difficulty: 'Mittel',
      icon: '💥',
      exercises: [
        {
          name: 'Schulterheben',
          description: 'Heben Sie die Schultern langsam nach oben und senken Sie sie wieder ab.',
          details: 'Heben Sie die Schultern bewusst, halten Sie kurz oben und lassen Sie sie dann entspannt sinken.',
          repetitions: '10-12 Mal',
          tips: ['Atmen Sie ruhig', 'Vermeiden Sie ein Verkrampfen im Nacken', 'Bewegen Sie langsam']
        },
        {
          name: 'Halbe Kniebeuge',
          description: 'Beugen Sie die Knie leicht, als ob Sie sich auf einen Stuhl setzen.',
          details: 'Halten Sie die Füße hüftbreit, gehen Sie nur so tief wie bequem und kommen Sie kontrolliert wieder nach oben.',
          repetitions: '8-10 Mal',
          tips: ['Halten Sie den Rücken gerade', 'Spannen Sie den Bauch leicht an', 'Atmen Sie beim Aufstehen aus']
        },
        {
          name: 'Hüftsenker',
          description: 'Senken Sie ein Bein leicht zur Seite und heben Sie es wieder an.',
          details: 'Bewegen Sie das Bein langsam seitlich nach unten und wieder hoch, ohne den Oberkörper zu verdrehen.',
          repetitions: '8-10 Mal pro Seite',
          tips: ['Halten Sie den Oberkörper stabil', 'Bewegen Sie kontrolliert', 'Atmen Sie ruhig']
        }
      ]
    }
  ];

  const speakExercise = (exercise: Exercise, exact = false) => {
    const detailText = exact && exercise.details ? `Genau so geht die Übung: ${exercise.details}.` : '';
    const fullText = `${exercise.name}. ${exercise.description}. ${exercise.repetitions || exercise.duration || ''}. ${detailText} Tipps: ${exercise.tips.join('. ')}.`;
    speakGermanText(fullText, { rate: 0.9, pitch: 0.98, volume: 1 });
  };

  const renderExerciseIllustration = (exercise: Exercise) => {
    const commonStyle = {
      width: '100%',
      height: '100%',
      display: 'block'
    };

    switch (exercise.name) {
      case 'Kopf drehen':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Kopf drehen">
            <rect x="0" y="0" width="220" height="150" fill="#e3f2fd" rx="20" />
            <circle cx="110" cy="45" r="24" fill="#fdd835" />
            <path d="M110 70 L110 100" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 100 L95 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 100 L125 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M40 80 C60 40 100 30 110 45" stroke="#1976d2" strokeWidth="8" fill="none" />
            <path d="M180 80 C160 40 120 30 110 45" stroke="#1976d2" strokeWidth="8" fill="none" />
            <path d="M105 18 L130 18" stroke="#1976d2" strokeWidth="6" strokeLinecap="round" />
            <path d="M81 16 L56 16" stroke="#1976d2" strokeWidth="6" strokeLinecap="round" />
          </svg>
        );
      case 'Schulterkreisen':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Schulterkreisen">
            <rect x="0" y="0" width="220" height="150" fill="#e8f5e9" rx="20" />
            <circle cx="110" cy="45" r="22" fill="#fdd835" />
            <path d="M110 67 L110 105" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 105 L90 138 M110 105 L130 138" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <circle cx="80" cy="80" r="12" fill="#1976d2" />
            <circle cx="140" cy="80" r="12" fill="#1976d2" />
            <path d="M80 60 A16 16 0 0 1 140 60" fill="none" stroke="#1976d2" strokeWidth="6" />
            <path d="M80 100 A16 16 0 0 0 140 100" fill="none" stroke="#1976d2" strokeWidth="6" />
            <path d="M86 38 L76 28" fill="none" stroke="#1976d2" strokeWidth="5" />
            <path d="M134 38 L144 28" fill="none" stroke="#1976d2" strokeWidth="5" />
          </svg>
        );
      case 'Arme schwingen':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Arme schwingen">
            <rect x="0" y="0" width="220" height="150" fill="#fff3e0" rx="20" />
            <circle cx="110" cy="35" r="22" fill="#fdd835" />
            <path d="M110 57 L110 105" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 105 L90 135 M110 105 L130 135" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 60 L60 95" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
            <path d="M110 60 L160 95" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
            <path d="M55 90 L45 80" stroke="#1976d2" strokeWidth="6" strokeLinecap="round" />
            <path d="M165 90 L175 80" stroke="#1976d2" strokeWidth="6" strokeLinecap="round" />
          </svg>
        );
      case 'Wandstütz':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Wandstütz">
            <rect x="0" y="0" width="220" height="150" fill="#e3f2fd" rx="20" />
            <rect x="20" y="20" width="30" height="110" fill="#cfd8dc" />
            <circle cx="120" cy="40" r="20" fill="#fdd835" />
            <path d="M120 60 L120 90" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M120 90 L95 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M120 90 L145 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M50 90 L115 90" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
            <path d="M115 90 L130 85" stroke="#1976d2" strokeWidth="6" fill="none" />
          </svg>
        );
      case 'Beinheben im Sitzen':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Beinheben im Sitzen">
            <rect x="0" y="0" width="220" height="150" fill="#f3e5f5" rx="20" />
            <rect x="65" y="95" width="90" height="20" fill="#8d6e63" rx="8" />
            <circle cx="110" cy="45" r="20" fill="#fdd835" />
            <path d="M110 65 L110 95" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 95 L95 120" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 95 L145 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M95 120 L80 120" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
          </svg>
        );
      case 'Arme heben':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Arme heben">
            <rect x="0" y="0" width="220" height="150" fill="#e8f5e9" rx="20" />
            <circle cx="110" cy="35" r="20" fill="#fdd835" />
            <path d="M110 55 L110 95" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 95 L90 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 95 L130 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 55 L60 15" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
            <path d="M110 55 L160 15" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
          </svg>
        );
      case 'Einbeinstand':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Einbeinstand">
            <rect x="0" y="0" width="220" height="150" fill="#fff3e0" rx="20" />
            <circle cx="110" cy="35" r="20" fill="#fdd835" />
            <path d="M110 55 L110 90" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 90 L90 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 90 L130 115" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M130 115 L145 115" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
            <path d="M70 90 L50 90" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
          </svg>
        );
      case 'Ferse zu Zehe':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Ferse zu Zehe">
            <rect x="0" y="0" width="220" height="150" fill="#e3f2fd" rx="20" />
            <circle cx="110" cy="35" r="20" fill="#fdd835" />
            <path d="M110 55 L110 90" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 90 L90 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M90 130 L70 130" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
            <path d="M110 90 L130 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M130 130 L150 130" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
            <line x1="110" y1="32" x2="135" y2="20" stroke="#1976d2" strokeWidth="5" markerEnd="url(#arrowhead)" />
          </svg>
        );
      case 'Tandem-Gang':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Tandem-Gang">
            <rect x="0" y="0" width="220" height="150" fill="#f3e5f5" rx="20" />
            <circle cx="90" cy="38" r="18" fill="#fdd835" />
            <circle cx="140" cy="38" r="18" fill="#fdd835" />
            <path d="M90 56 L90 90" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M90 90 L70 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M140 56 L140 90" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M140 90 L160 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M70 130 L50 130" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
            <path d="M160 130 L180 130" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
            <path d="M160 80 C170 70 180 70 190 80" fill="none" stroke="#1976d2" strokeWidth="4" />
          </svg>
        );
      case 'Nackendehnung':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Nackendehnung">
            <rect x="0" y="0" width="220" height="150" fill="#e8f5e9" rx="20" />
            <circle cx="110" cy="40" r="20" fill="#fdd835" />
            <path d="M110 60 L110 95" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 95 L90 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 60 L130 30" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
            <path d="M132 28 L138 24" stroke="#1976d2" strokeWidth="5" strokeLinecap="round" />
          </svg>
        );
      case 'Schulterdehnung':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Schulterdehnung">
            <rect x="0" y="0" width="220" height="150" fill="#fff3e0" rx="20" />
            <circle cx="110" cy="40" r="20" fill="#fdd835" />
            <path d="M110 60 L110 95" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 95 L90 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 60 L75 60" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
            <path d="M75 60 L65 50" stroke="#1976d2" strokeWidth="6" strokeLinecap="round" />
          </svg>
        );
      case 'Beindehnung':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Beindehnung">
            <rect x="0" y="0" width="220" height="150" fill="#f3e5f5" rx="20" />
            <circle cx="110" cy="40" r="20" fill="#fdd835" />
            <path d="M110 60 L110 95" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 95 L90 120" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 95 L130 120" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M90 120 L70 105" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
          </svg>
        );
      case 'Atemübung':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Atemübung">
            <rect x="0" y="0" width="220" height="150" fill="#e3f2fd" rx="20" />
            <circle cx="110" cy="40" r="20" fill="#fdd835" />
            <path d="M110 60 L110 95" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 95 L90 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M60 90 C90 70 130 70 160 90" stroke="#1976d2" strokeWidth="8" fill="none" />
            <circle cx="80" cy="115" r="8" fill="#1976d2" />
            <circle cx="140" cy="115" r="8" fill="#1976d2" />
          </svg>
        );
      case 'Progressive Muskelentspannung':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Progressive Muskelentspannung">
            <rect x="0" y="0" width="220" height="150" fill="#fff3e0" rx="20" />
            <circle cx="110" cy="40" r="20" fill="#fdd835" />
            <path d="M110 60 L110 95" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 95 L90 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 95 L130 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <rect x="70" y="95" width="80" height="30" rx="10" fill="#1976d2" opacity="0.2" />
            <path d="M88 110 L132 110" stroke="#1976d2" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );
      case 'Ruheposition':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Ruheposition">
            <rect x="0" y="0" width="220" height="150" fill="#e8f5e9" rx="20" />
            <circle cx="110" cy="40" r="20" fill="#fdd835" />
            <path d="M110 60 L110 95" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 95 L85 125" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M85 125 L130 125" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
            <path d="M130 125 L150 125" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
          </svg>
        );
      default:
        return renderExerciseIllustration(exercise);
    }
  };

  const renderExerciseIllustration2 = (exercise: Exercise) => {
    const commonStyle = {
      width: '100%',
      height: '100%',
      display: 'block'
    };

    const background = (fill: string) => (
      <rect x="0" y="0" width="220" height="150" fill={fill} rx="20" />
    );

    switch (exercise.name) {
      case 'Kopf drehen':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Kopf drehen">
            {background('#e3f2fd')}
            <circle cx="110" cy="45" r="24" fill="#fdd835" />
            <path d="M110 70 L110 100" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 100 L95 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 100 L125 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M54 75 C78 28 92 30 110 45" stroke="#1976d2" strokeWidth="8" fill="none" />
            <path d="M166 75 C142 28 128 30 110 45" stroke="#1976d2" strokeWidth="8" fill="none" />
            <path d="M72 24 L62 16" stroke="#1976d2" strokeWidth="5" strokeLinecap="round" />
            <path d="M148 24 L158 16" stroke="#1976d2" strokeWidth="5" strokeLinecap="round" />
          </svg>
        );
      case 'Schulterkreisen':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Schulterkreisen">
            {background('#e8f5e9')}
            <circle cx="110" cy="45" r="22" fill="#fdd835" />
            <path d="M110 67 L110 100" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 100 L95 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 100 L125 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M70 72 C70 62 69 52 73 44" fill="none" stroke="#1976d2" strokeWidth="6" />
            <path d="M150 72 C150 62 151 52 147 44" fill="none" stroke="#1976d2" strokeWidth="6" />
            <circle cx="75" cy="80" r="10" fill="#1976d2" />
            <circle cx="145" cy="80" r="10" fill="#1976d2" />
          </svg>
        );
      case 'Arme schwingen':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Arme schwingen">
            {background('#fff3e0')}
            <circle cx="110" cy="35" r="22" fill="#fdd835" />
            <path d="M110 57 L110 105" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 105 L92 136" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 105 L128 136" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 60 L68 90" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
            <path d="M110 60 L152 90" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
            <path d="M68 90 L60 82" stroke="#1976d2" strokeWidth="6" strokeLinecap="round" />
            <path d="M152 90 L160 82" stroke="#1976d2" strokeWidth="6" strokeLinecap="round" />
          </svg>
        );
      case 'Wandstütz':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Wandstütz">
            {background('#e3f2fd')}
            <rect x="18" y="18" width="32" height="110" fill="#cfd8dc" />
            <circle cx="128" cy="35" r="20" fill="#fdd835" />
            <path d="M128 57 L128 95" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M128 95 L108 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M128 95 L148 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M63 85 L123 85" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
          </svg>
        );
      case 'Beinheben im Sitzen':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Beinheben im Sitzen">
            {background('#f3e5f5')}
            <rect x="64" y="95" width="92" height="22" fill="#8d6e63" rx="8" />
            <circle cx="110" cy="45" r="20" fill="#fdd835" />
            <path d="M110 65 L110 95" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 95 L94 118" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 95 L145 118" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M94 118 L79 118" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
          </svg>
        );
      case 'Arme heben':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Arme heben">
            {background('#e8f5e9')}
            <circle cx="110" cy="35" r="20" fill="#fdd835" />
            <path d="M110 55 L110 95" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 95 L92 128" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 95 L128 128" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 55 L74 15" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
            <path d="M110 55 L146 15" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
          </svg>
        );
      case 'Einbeinstand':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Einbeinstand">
            {background('#fff3e0')}
            <circle cx="110" cy="35" r="20" fill="#fdd835" />
            <path d="M110 55 L110 90" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 90 L92 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 90 L132 120" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M132 120 L145 120" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
          </svg>
        );
      case 'Ferse zu Zehe':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Ferse zu Zehe">
            {background('#e3f2fd')}
            <circle cx="110" cy="35" r="20" fill="#fdd835" />
            <path d="M110 55 L110 90" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 90 L92 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M92 130 L72 130" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
            <path d="M110 90 L128 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M128 130 L148 130" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
          </svg>
        );
      case 'Tandem-Gang':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Tandem-Gang">
            {background('#f3e5f5')}
            <circle cx="90" cy="38" r="18" fill="#fdd835" />
            <circle cx="140" cy="38" r="18" fill="#fdd835" />
            <path d="M90 56 L90 90" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M90 90 L70 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M140 56 L140 90" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M140 90 L160 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M70 130 L50 130" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
            <path d="M160 130 L180 130" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
          </svg>
        );
      case 'Nackendehnung':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Nackendehnung">
            {background('#e8f5e9')}
            <circle cx="110" cy="40" r="20" fill="#fdd835" />
            <path d="M110 60 L110 95" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 95 L92 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 60 L132 30" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
          </svg>
        );
      case 'Schulterdehnung':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Schulterdehnung">
            {background('#fff3e0')}
            <circle cx="110" cy="40" r="20" fill="#fdd835" />
            <path d="M110 60 L110 95" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 95 L92 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 60 L76 60" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
            <path d="M76 60 L62 50" stroke="#1976d2" strokeWidth="6" strokeLinecap="round" />
          </svg>
        );
      case 'Beindehnung':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Beindehnung">
            {background('#f3e5f5')}
            <circle cx="110" cy="40" r="20" fill="#fdd835" />
            <path d="M110 60 L110 95" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 95 L92 118" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 95 L132 118" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M92 118 L76 108" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
          </svg>
        );
      case 'Atemübung':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Atemübung">
            {background('#e3f2fd')}
            <circle cx="110" cy="40" r="20" fill="#fdd835" />
            <path d="M110 60 L110 95" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 95 L90 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M60 90 C90 70 130 70 160 90" stroke="#1976d2" strokeWidth="8" fill="none" />
            <path d="M70 115 C90 105 130 105 150 115" stroke="#1976d2" strokeWidth="5" fill="none" />
          </svg>
        );
      case 'Progressive Muskelentspannung':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Progressive Muskelentspannung">
            {background('#fff3e0')}
            <circle cx="110" cy="40" r="20" fill="#fdd835" />
            <path d="M110 60 L110 95" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 95 L92 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 95 L128 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <rect x="72" y="95" width="76" height="28" rx="10" fill="#1976d2" opacity="0.2" />
          </svg>
        );
      case 'Ruheposition':
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Ruheposition">
            {background('#e8f5e9')}
            <circle cx="110" cy="40" r="20" fill="#fdd835" />
            <path d="M110 60 L110 95" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 95 L85 125" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M85 125 L130 125" stroke="#1976d2" strokeWidth="10" strokeLinecap="round" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 220 150" style={commonStyle} role="img" aria-label="Übung">
            {background('#f5f5f5')}
            <circle cx="110" cy="40" r="20" fill="#fdd835" />
            <path d="M110 60 L110 95" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 95 L90 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 95 L130 130" stroke="#555" strokeWidth="8" strokeLinecap="round" />
          </svg>
        );
    }
  };

  const startWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setCurrentExercise(0);
  };

  const nextExercise = () => {
    if (selectedWorkout && currentExercise < selectedWorkout.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    }
  };

  const previousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
    }
  };

  const finishWorkout = () => {
    if (selectedWorkout) {
      const points = addWorkoutPoints(selectedWorkout.duration, selectedWorkout.difficulty);
      alert(`Workout beendet! Sie haben ${points} Aktiv Punkte erhalten.`);
    }

    setSelectedWorkout(null);
    setCurrentExercise(0);
  };

  const categories = [...new Set(workouts.map(w => w.category))];

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#2196f3', marginBottom: '1rem', fontSize: '2.5rem' }}>
        🏃‍♂️ Fitness für Senioren
      </h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem', fontSize: '1.1rem' }}>
        Sanfte Übungen für mehr Vitalität und Wohlbefinden im Alter.
      </p>

      {!selectedWorkout ? (
        <>
          {/* Kategorien */}
          {categories.map(category => (
            <div key={category} style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '15px',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{ color: '#2196f3', marginBottom: '1rem', borderBottom: '2px solid #2196f3', paddingBottom: '0.5rem' }}>
                {category}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {workouts.filter(w => w.category === category).map(workout => (
                  <div key={workout.id} style={{
                    backgroundColor: 'white',
                    border: '2px solid #ddd',
                    borderRadius: '10px',
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }} onClick={() => startWorkout(workout)}>
                    <div style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '0.5rem' }}>{workout.icon}</div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#333', textAlign: 'center' }}>{workout.name}</h3>
                    <p style={{ fontSize: '0.9rem', color: '#666', margin: '0 0 0.5rem 0', textAlign: 'center' }}>{workout.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#888' }}>
                      <span>⏱️ {workout.duration} Min</span>
                      <span>📊 {workout.difficulty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      ) : (
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '15px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#2196f3', marginBottom: '0.5rem' }}>{selectedWorkout.name}</h2>
            <p style={{ color: '#666', margin: 0 }}>{selectedWorkout.description}</p>
            <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '0.5rem' }}>
              Übung {currentExercise + 1} von {selectedWorkout.exercises.length} • ⏱️ {selectedWorkout.duration} Minuten
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ color: '#333', marginBottom: '1rem' }}>
              {selectedWorkout.exercises[currentExercise].name}
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '220px', height: '150px', borderRadius: '15px', overflow: 'hidden', backgroundColor: '#f1f8ff', border: '1px solid #90caf9' }}>
                  {renderExerciseIllustration2(selectedWorkout.exercises[currentExercise])}
              </div>
            </div>
            <p style={{ color: '#666', marginBottom: '1rem', lineHeight: '1.6' }}>
              {selectedWorkout.exercises[currentExercise].description}
            </p>
            {(selectedWorkout.exercises[currentExercise].repetitions || selectedWorkout.exercises[currentExercise].duration) && (
              <div style={{ backgroundColor: '#e3f2fd', padding: '0.5rem', borderRadius: '5px', marginBottom: '1rem' }}>
                <strong>{selectedWorkout.exercises[currentExercise].repetitions || selectedWorkout.exercises[currentExercise].duration}</strong>
              </div>
            )}
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ color: '#2196f3', marginBottom: '0.5rem' }}>💡 Tipps:</h4>
              <ul style={{ color: '#666', paddingLeft: '1.5rem' }}>
                {selectedWorkout.exercises[currentExercise].tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              <button
                onClick={() => speakExercise(selectedWorkout.exercises[currentExercise])}
                style={{
                  backgroundColor: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.8rem 1.5rem',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                🔊 Kurzanleitung vorlesen
              </button>
              <button
                onClick={() => speakExercise(selectedWorkout.exercises[currentExercise], true)}
                style={{
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.8rem 1.5rem',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                📖 Genaue Anleitung vorlesen
              </button>
            </div>
            {selectedWorkout.exercises[currentExercise].details && (
              <div style={{ backgroundColor: '#eef6ff', padding: '1rem', borderRadius: '10px', marginBottom: '1rem' }}>
                <h4 style={{ color: '#1565c0', marginBottom: '0.5rem' }}>So geht die Übung genau:</h4>
                <p style={{ color: '#333', margin: 0, lineHeight: '1.6' }}>
                  {selectedWorkout.exercises[currentExercise].details}
                </p>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={previousExercise}
              disabled={currentExercise === 0}
              style={{
                backgroundColor: currentExercise === 0 ? '#ccc' : '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.8rem 1.5rem',
                fontSize: '1rem',
                cursor: currentExercise === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              ⬅️ Vorherige
            </button>

            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              Fortschritt: {Math.round(((currentExercise + 1) / selectedWorkout.exercises.length) * 100)}%
            </div>

            {currentExercise < selectedWorkout.exercises.length - 1 ? (
              <button
                onClick={nextExercise}
                style={{
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.8rem 1.5rem',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                Nächste ➡️
              </button>
            ) : (
              <button
                onClick={finishWorkout}
                style={{
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.8rem 1.5rem',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                ✅ Beenden
              </button>
            )}
          </div>
        </div>
      )}

      {/* Hinweis */}
      <div style={{
        backgroundColor: '#fff3e0',
        border: '2px solid #ff9800',
        borderRadius: '10px',
        padding: '1.5rem',
        textAlign: 'center',
        marginTop: '2rem'
      }}>
        <h3 style={{ color: '#e65100', marginBottom: '1rem' }}>⚠️ Wichtige Hinweise</h3>
        <p style={{ color: '#bf360c', margin: 0, lineHeight: '1.6' }}>
          Konsultieren Sie vor Beginn Ihres Trainingsprogramms Ihren Arzt.
          Hören Sie auf Ihren Körper und machen Sie Pausen bei Erschöpfung oder Schmerzen.
          Die Übungen sind für gesunde Senioren konzipiert - passen Sie sie an Ihre Bedürfnisse an.
        </p>
      </div>

      <Mascot context="help" size="small" />
    </div>
  );
};

export default Workouts;