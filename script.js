async function fetchParkingData() {
    try {
      const response = await fetch('https://daten.stadt.sg.ch/api/explore/v2.1/catalog/datasets/freie-parkplatze-in-der-stadt-stgallen-pls/records?limit=20');
      const data = await response.json();
  
      // Wähle das gewünschte Parkhaus
      const parkhausName = "Bahnhof";
      const record = data.results.find(item => item.fields.phname === parkhausName);
  
      if (record) {
        const freiePlaetze = record.fields.free;
        document.getElementById('parking-count').textContent = freiePlaetze;
      } else {
        document.getElementById('parking-count').textContent = "N/A";
      }
    } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
      document.getElementById('parking-count').textContent = "Fehler";
    }
  }
  
  // Initialer Abruf
  fetchParkingData();
  
  // Aktualisiere alle 60 Sekunden
  setInterval(fetchParkingData, 60000);