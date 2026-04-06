import React, { useState, useEffect } from 'react';
import { speakGermanText } from '../utils/speechUtils';
import Mascot from './Mascot';

interface Contact {
  id: string;
  category: string;
  name: string;
  number: string;
  description: string;
  icon: string;
  emergency?: boolean;
  editable?: boolean;
}

interface PersonalContact {
  id: string;
  name: string;
  number: string;
  relationship: string;
}

const ImportantNumbers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [personalContacts, setPersonalContacts] = useState<PersonalContact[]>([]);
  const [editingContact, setEditingContact] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editNumber, setEditNumber] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('personalContacts');
    if (saved) {
      setPersonalContacts(JSON.parse(saved));
    } else {
      // Standard persönliche Kontakte initialisieren
      const defaultContacts: PersonalContact[] = [
        { id: 'son', name: 'Sohn', number: '', relationship: 'Familie' },
        { id: 'daughter', name: 'Tochter', number: '', relationship: 'Familie' },
        { id: 'family_doctor', name: 'Hausarzt', number: '', relationship: 'Medizin' },
        { id: 'neighbor', name: 'Nachbar', number: '', relationship: 'Hilfe' }
      ];
      setPersonalContacts(defaultContacts);
      localStorage.setItem('personalContacts', JSON.stringify(defaultContacts));
    }
  }, []);

  const contacts: Contact[] = [
    // Notfallnummern
    {
      id: 'emergency',
      category: '🚨 Notfall',
      name: 'Notruf',
      number: '112',
      description: 'Europäischer Notruf - für alle Notfälle',
      icon: '🚨',
      emergency: true
    },
    {
      id: 'police',
      category: '🚔 Polizei',
      name: 'Polizei',
      number: '110',
      description: 'Für polizeiliche Hilfe und Anzeigen',
      icon: '🚔',
      emergency: true
    },
    {
      id: 'fire',
      category: '🚒 Feuerwehr',
      name: 'Feuerwehr',
      number: '112',
      description: 'Für Brände und technische Hilfe',
      icon: '🚒',
      emergency: true
    },
    {
      id: 'ambulance',
      category: '🚑 Rettungsdienst',
      name: 'Rettungsdienst',
      number: '112',
      description: 'Für medizinische Notfälle',
      icon: '🚑',
      emergency: true
    },

    // Behörden
    {
      id: 'social_services',
      category: '🏛️ Behörden',
      name: 'Sozialamt',
      number: '115',
      description: 'Städtische Service-Hotline für alle Behörden',
      icon: '🏛️'
    },
    {
      id: 'pension_office',
      category: '🏛️ Behörden',
      name: 'Rentenversicherung',
      number: '0800 1000 4800',
      description: 'Deutsche Rentenversicherung - kostenlos',
      icon: '📋'
    },
    {
      id: 'health_insurance',
      category: '🏛️ Behörden',
      name: 'Krankenkasse',
      number: 'Ihre Krankenkasse anrufen',
      description: 'Die Nummer Ihrer Krankenkasse',
      icon: '🏥'
    },

    // Medizinische Hilfe
    {
      id: 'poison_control',
      category: '🏥 Medizin',
      name: 'Giftnotruf',
      number: '030 19240',
      description: 'Beratung bei Vergiftungen',
      icon: '☠️'
    },
    {
      id: 'pharmacy_emergency',
      category: '🏥 Medizin',
      name: 'Apotheken-Notdienst',
      number: '0800 0022833',
      description: 'Bundesweiter Apotheken-Notdienst',
      icon: '💊'
    },
    {
      id: 'doctor_emergency',
      category: '🏥 Medizin',
      name: 'Ärztlicher Bereitschaftsdienst',
      number: '116117',
      description: 'Außerhalb der Praxiszeiten',
      icon: '👨‍⚕️'
    },

    // Technische Hilfe
    {
      id: 'tech_support',
      category: '🔧 Technik',
      name: 'Computer-Hilfe',
      number: '0800 6645444',
      description: 'Microsoft Support (kostenlos)',
      icon: '💻'
    },
    {
      id: 'internet_provider',
      category: '🔧 Technik',
      name: 'Internet-Provider',
      number: 'Ihre Provider-Hotline',
      description: 'Die Hotline Ihres Internet-Anbieters',
      icon: '🌐'
    },

    // Banken & Finanzen
    {
      id: 'bank_emergency',
      category: '💳 Finanzen',
      name: 'Bank-Notfall',
      number: 'Sperr-Notruf Ihrer Bank',
      description: 'Für verlorene Karten - auf Bankkarte notiert',
      icon: '💳'
    },
    {
      id: 'consumer_advice',
      category: '💳 Finanzen',
      name: 'Verbraucherzentrale',
      number: '01805 007070',
      description: 'Beratung bei Verbraucherfragen',
      icon: '📞'
    },

    // Familie & Freunde werden dynamisch hinzugefügt
  ];

  // Persönliche Kontakte zur Liste hinzufügen
  const allContacts = [
    ...contacts,
    ...personalContacts.map(pc => ({
      id: pc.id,
      category: '👨‍👩‍👧‍👦 Persönlich',
      name: pc.name,
      number: pc.number || 'Nummer eingeben',
      description: pc.relationship,
      icon: '👤',
      editable: true
    }))
  ];

  const categories = [...new Set(allContacts.map(contact => contact.category))];

  const filteredContacts = allContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const speakNumber = (contact: Contact) => {
    speakGermanText(
      `${contact.name}. Telefonnummer: ${contact.number}. ${contact.description}`,
      { rate: 0.9, pitch: 0.98, volume: 1 }
    );
  };

  const callNumber = (number: string) => {
    if (number.includes('Ihre') || number.includes('Sperr-Notruf') || !number.trim()) {
      alert('Bitte tragen Sie Ihre persönliche Nummer ein.');
      return;
    }
    window.location.href = `tel:${number.replace(/\s/g, '')}`;
  };

  const startEditing = (contact: PersonalContact) => {
    setEditingContact(contact.id);
    setEditName(contact.name);
    setEditNumber(contact.number);
  };

  const saveContact = () => {
    if (!editName.trim() || !editNumber.trim()) {
      alert('Bitte geben Sie Name und Nummer ein.');
      return;
    }
    const updatedContacts = personalContacts.map(contact =>
      contact.id === editingContact
        ? { ...contact, name: editName.trim(), number: editNumber.trim() }
        : contact
    );
    setPersonalContacts(updatedContacts);
    localStorage.setItem('personalContacts', JSON.stringify(updatedContacts));
    setEditingContact(null);
    setEditName('');
    setEditNumber('');
  };

  const cancelEditing = () => {
    setEditingContact(null);
    setEditName('');
    setEditNumber('');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#2196f3', marginBottom: '1rem', fontSize: '2.5rem' }}>
        📞 Wichtige Nummern
      </h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem', fontSize: '1.1rem' }}>
        Alle wichtigen Telefonnummern an einem Ort - für Notfälle und den Alltag.
      </p>

      {/* Suchfeld */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <input
          type="text"
          placeholder="Suchen Sie nach Nummern..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '0.8rem',
            fontSize: '1rem',
            border: '2px solid #2196f3',
            borderRadius: '10px',
            width: '100%',
            maxWidth: '400px',
            outline: 'none'
          }}
        />
      </div>

      {/* Notfall-Box */}
      <div style={{
        backgroundColor: '#ffebee',
        border: '3px solid #f44336',
        borderRadius: '15px',
        padding: '1.5rem',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#f44336', marginBottom: '1rem' }}>🚨 Notfall-Nummern</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {contacts.filter(c => c.emergency).map(contact => (
            <div key={contact.id} style={{
              backgroundColor: 'white',
              border: '2px solid #f44336',
              borderRadius: '10px',
              padding: '1rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{contact.icon}</div>
              <h3 style={{ color: '#f44336', margin: '0.5rem 0' }}>{contact.name}</h3>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f44336', margin: '0.5rem 0' }}>
                {contact.number}
              </div>
              <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.5rem 0' }}>{contact.description}</p>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
                <button
                  onClick={() => callNumber(contact.number)}
                  style={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  📞 Anrufen
                </button>
                <button
                  onClick={() => speakNumber(contact)}
                  style={{
                    backgroundColor: '#2196f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  🔊
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kategorien */}
      {categories.filter(cat => !cat.includes('Notfall') && !cat.includes('Persönlich')).map(category => {
        const categoryContacts = filteredContacts.filter(contact => contact.category === category);
        if (categoryContacts.length === 0) return null;

        return (
          <div key={category} style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '15px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h2 style={{ color: '#2196f3', marginBottom: '1rem', borderBottom: '2px solid #2196f3', paddingBottom: '0.5rem' }}>
              {category}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              {categoryContacts.map(contact => (
                <div key={contact.id} style={{
                  backgroundColor: 'white',
                  border: '2px solid #ddd',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{ fontSize: '2rem' }}>{contact.icon}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.25rem 0', color: '#333' }}>{contact.name}</h3>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2196f3', marginBottom: '0.25rem' }}>
                      {contact.number}
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>{contact.description}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <button
                      onClick={() => callNumber(contact.number)}
                      style={{
                        backgroundColor: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      📞
                    </button>
                    <button
                      onClick={() => speakNumber(contact)}
                      style={{
                        backgroundColor: '#2196f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      🔊
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Persönliche Kontakte */}
      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '15px',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{ color: '#2196f3', marginBottom: '1rem', borderBottom: '2px solid #2196f3', paddingBottom: '0.5rem' }}>
          👨‍👩‍👧‍👦 Persönliche Kontakte
        </h2>
        <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
          Hier können Sie Ihre persönlichen Kontakte bearbeiten und anrufen.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {personalContacts.map(contact => (
            <div key={contact.id} style={{
              backgroundColor: 'white',
              border: '2px solid #ddd',
              borderRadius: '10px',
              padding: '1rem'
            }}>
              {editingContact === contact.id ? (
                <div>
                  <input
                    type="text"
                    placeholder="Name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      marginBottom: '0.5rem',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  />
                  <input
                    type="tel"
                    placeholder="Telefonnummer"
                    value={editNumber}
                    onChange={(e) => setEditNumber(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      marginBottom: '0.5rem',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={saveContact}
                      style={{
                        backgroundColor: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.5rem 1rem',
                        cursor: 'pointer'
                      }}
                    >
                      Speichern
                    </button>
                    <button
                      onClick={cancelEditing}
                      style={{
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.5rem 1rem',
                        cursor: 'pointer'
                      }}
                    >
                      Abbrechen
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '2rem' }}>👤</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.25rem 0', color: '#333' }}>{contact.name}</h3>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: contact.number ? '#2196f3' : '#ff9800', marginBottom: '0.25rem' }}>
                      {contact.number || 'Nummer fehlt'}
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>{contact.relationship}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <button
                      onClick={() => callNumber(contact.number)}
                      disabled={!contact.number}
                      style={{
                        backgroundColor: contact.number ? '#4caf50' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.8rem',
                        cursor: contact.number ? 'pointer' : 'not-allowed'
                      }}
                    >
                      📞
                    </button>
                    <button
                      onClick={() => startEditing(contact)}
                      style={{
                        backgroundColor: '#ff9800',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      ✏️
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Hinweis */}
      <div style={{
        backgroundColor: '#fff3e0',
        border: '2px solid #ff9800',
        borderRadius: '10px',
        padding: '1.5rem',
        textAlign: 'center',
        marginTop: '2rem'
      }}>
        <h3 style={{ color: '#e65100', marginBottom: '1rem' }}>💡 Tipp</h3>
        <p style={{ color: '#bf360c', margin: 0, lineHeight: '1.6' }}>
          Klicken Sie auf das ✏️ Symbol, um Ihre persönlichen Kontakte zu bearbeiten.
          Nach dem Speichern können Sie direkt über 📞 anrufen.
          Speichern Sie diese Seite als Lesezeichen für schnellen Zugriff im Notfall.
        </p>
      </div>

      <Mascot context="help" size="small" />
    </div>
  );
};

export default ImportantNumbers;