const PARKHAUSER = [
  { name: "Bahnhof", countId: "bahnhof-count", boxId: "bahnhof-box" },
  { name: "Manor", countId: "manor-count", boxId: "manor-box" },
  { name: "Neumarkt", countId: "neumarkt-count", boxId: "neumarkt-box" }
];

async function fetchParkingData() {
  try {
    const response = await fetch('https://daten.stadt.sg.ch/api/explore/v2.1/catalog/datasets/freie-parkplatze-in-der-stadt-stgallen-pls/records?limit=50');
    const data = await response.json();

    PARKHAUSER.forEach(({ name, countId, boxId }) => {
      const record = data.results.find(item => item.fields.phname === name);
      if (record) {
        const frei = record.fields.free;
        const gesamt = record.fields.max;
        const prozent = Math.round((frei / gesamt) * 100);

        document.getElementById(countId).textContent = frei;

        const color = getColorForCapacity(prozent);
        const houseBody = document.querySelector(`#${boxId} .body`);
        houseBody.style.backgroundColor = color;
      } else {
        document.getElementById(countId).textContent = "N/A";
      }
    });

  } catch (error) {
    console.error("Fehler beim Abrufen:", error);
    PARKHAUSER.forEach(({ countId }) => {
      document.getElementById(countId).textContent = "Fehler";
    });
  }
}

function getColorForCapacity(percent) {
  if (percent <= 20) return "#d32f2f";     // Rot
  if (percent <= 60) return "#f9a825";     // Orange
  return "#388e3c";                        // Grün
}

fetchParkingData();
setInterval(fetchParkingData, 60000);