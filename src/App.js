import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_CHARACTERS = gql`
  query GetCharacters($page: Int, $status: String, $species: String) {
  characters(page: $page, filter:{ status: $status, species: $species}) {
    info {
      pages
    }
    results {
      id
      name
      status
      species
      gender
      origin {
        name
      }
      image
    }
  }
}
`;

const translations = {
  en: {
    title: "Rick and Morty Characters",
    name: "Name",
    status: "Status",
    species: "Species",
    gender: "Gender",
    origin: "Origin",
    allStatuses: "All Statuses",
    alive: "Alive",
    dead: "Dead",
    unknown: "Unknown",
    allSpecies: "All Species",
    human: "Human",
    alien: "Alien",
    noSorting: "No Sorting",
    sortByName: "Sort by Name",
    sortByOrigin: "Sort by Origin",
    previous: "Previous",
    next: "Next",
    page: "Page"
  },
  de: {
    title: "Rick und Morty Charaktere",
    name: "Name",
    status: "Status",
    species: "Spezies",
    gender: "Geschlecht",
    origin: "Herkunft",
    allStatuses: "Alle Status",
    alive: "Lebendig",
    dead: "Tot",
    unknown: "Unbekannt",
    allSpecies: "Alle Spezies",
    human: "Mensch",
    alien: "Außerirdisch",
    noSorting: "Keine Sortierung",
    sortByName: "Nach Name sortieren",
    sortByOrigin: "Nach Herkunft sortieren",
    previous: "Zurück",
    next: "Weiter",
    page: "Seite"
  }
};

function App() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [species, setSpecies] = useState('');
  const [sort, setSort] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [language, setLanguage] = useState('en');

  const t = translations[language];

  const { data, loading, error } = useQuery(GET_CHARACTERS, {
    variables: {
      page,
      status: status || undefined,
      species: species || undefined,
    },
  });

  useEffect(() => {
    if (data && data.characters && data.characters.results) {
      let result = [...data.characters.results]; 
  
      if (status) {
        result = result.filter(char => char.status.toLowerCase() === status.toLowerCase());
      }
      if (species) {
        result = result.filter(char => char.species.toLowerCase() === species.toLowerCase());
      }
  
      if (sort === 'name') {
        result.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sort === 'origin') {
        result.sort((a, b) => a.origin.name.localeCompare(b.origin.name));
      }
  
      setFiltered(result);
    } 
  }, [data, status, species, sort]);
  

  useEffect(() => {
    setPage(1);
  }, [status, species,sort]);
  

  if (loading) return <p>Loading characters...</p>;
  if (error) return <p>Something went wrong!</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{t.title}</h2>

      <div style={{ marginBottom: 20 }}>
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">{t.allStatuses}</option>
          <option value="Alive">{t.alive}</option>
          <option value="Dead">{t.dead}</option>
          <option value="Unknown">{t.unknown}</option>
        </select>

        <select value={species} onChange={e => setSpecies(e.target.value)} style={{ marginLeft: 10 }}>
          <option value="">{t.allSpecies}</option>
          <option value="Human">{t.human}</option>
          <option value="Alien">{t.alien}</option>
        </select>

        <select value={sort} onChange={e => setSort(e.target.value)} style={{ marginLeft: 10 }}>
          <option value="">{t.noSorting}</option>
          <option value="name">{t.sortByName}</option>
          <option value="origin">{t.sortByOrigin}</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
        {filtered.map(char => (
          <div
            key={char.id}
            style={{
              padding: '10px',
              boxShadow: '0 2px 5px rgb(255, 255, 255)'
            }}
          >
            <img src={char.image} alt={char.name} style={{ width: '100%' }} />
            <p style={{ fontSize: 20 }}>{t.name}: {char.name}</p>
            <p>{t.status}: {char.status}</p>
            <p>{t.species}: {char.species}</p>
            <p>{t.gender}: {char.gender}</p>
            <p>{t.origin}: {char.origin.name}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          {t.previous}
        </button>

        <span style={{ padding: 10 }}>{t.page} {page}</span>

        <button onClick={() => setPage(page + 1)} disabled={page === data.characters.info.pages}>
          {t.next}
        </button>
      </div>

      <footer style={{ marginTop: 40, textAlign: 'center' }}>
        <button onClick={() => setLanguage('en')}>English</button>
        <button onClick={() => setLanguage('de')} style={{ marginLeft: 10 }}> Deutsch</button>
      </footer>
    </div>
  );
}

export default App;
