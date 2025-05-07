// Parkhäuser, die angezeigt werden sollen
const parkhausNamen = ['P21 Neumarkt', 'P22 Rathaus', 'P42 Burggraben'];

// IDs in HTML entsprechend formatieren
function nameZuId(name) {
  return name.toLowerCase().replace(/\s+/g, '');
}

// Lade und zeige Live-Daten an
async function ladeParkplatzDaten() {
  try {
    const response = await fetch(
      'https://daten.stadt.sg.ch/api/explore/v2.1/catalog/datasets/freie-parkplatze-in-der-stadt-stgallen-pls/records?limit=100'
    );
    const data = await response.json();

    parkhausNamen.forEach(name => {
      const eintrag = data.results.find(e => e.phname === name);
      if (eintrag) {
        const id = nameZuId(name);
        const element = document.querySelector(`#${id} .free-spots`);
        if (element) {
          element.textContent = eintrag.freieanzahlparkplatze;
        }
      }
    });
  } catch (error) {
    console.error('Fehler beim Laden der Parkplatzdaten:', error);
  }
}

// Beim Laden der Seite ausführen
document.addEventListener('DOMContentLoaded', () => {
  ladeParkplatzDaten();

  // Optional: alle 5 Minuten aktualisieren
  setInterval(ladeParkplatzDaten, 300000); // 300.000 ms = 5 Minuten
});