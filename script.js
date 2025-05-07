document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".button");
  const parkingNumber = document.getElementById("parking-number");
  const roof = document.querySelector(".roof");
  const walls = document.querySelector(".walls");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const parkingName = button.getAttribute("data-parking");
      fetchParkingData(parkingName);
    });
  });

  async function fetchParkingData(parkingName) {
    try {
      const response = await fetch(
        "https://daten.stadt.sg.ch/api/explore/v2.1/catalog/datasets/freie-parkplatze-in-der-stadt-stgallen-pls/records?limit=100"
      );
      const data = await response.json();

      const record = data.results.find((item) =>
        item.fields.name.toLowerCase().includes(parkingName.toLowerCase())
      );

      if (record && record.fields.free_spaces !== undefined && record.fields.max_capacity !== undefined) {
        const free = record.fields.free_spaces;
        const capacity = record.fields.max_capacity;
        const occupancy = 100 - (free / capacity) * 100;

        parkingNumber.textContent = free;

        // Farbe basierend auf Auslastung
        if (occupancy <= 20) {
          setColors("green");
        } else if (occupancy <= 60) {
          setColors("orange");
        } else {
          setColors("red");
        }
      } else {
        parkingNumber.textContent = "N/A";
        console.warn(`Parkhaus "${parkingName}" nicht gefunden oder unvollständige Daten.`);
        setColors("gray");
      }
    } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
      parkingNumber.textContent = "Fehler";
      setColors("gray");
    }
  }

  function setColors(color) {
    roof.style.borderBottomColor = color;
    walls.style.backgroundColor = color;
  }
});