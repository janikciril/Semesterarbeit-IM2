const buttons = document.querySelectorAll(".button");
const parkingNumber = document.getElementById("parking-number");
const roof = document.querySelector(".roof");
const walls = document.querySelector(".walls");
const house = document.querySelector(".house");

buttons.forEach(button => {
  button.addEventListener('click', async () => {
    // Alle Buttons zuerst "deaktivieren"
    buttons.forEach(btn => btn.classList.remove('active'));

    // Geklickten Button aktiv setzen
    button.classList.add('active');

    // Daten abrufen und anzeigen
    const parkingName = button.getAttribute("data-parking");
    try {
      const parkingData = await fetchParkingData(parkingName);
      showData(parkingData);
    } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
      parkingNumber.textContent = "Fehler";
      setHouseColorByOccupancy(null); // oder setColors("gray");
    }
  });
});

async function fetchParkingData(parkingName) {
  const response = await fetch(
    `https://daten.stadt.sg.ch/api/explore/v2.1/catalog/datasets/freie-parkplatze-in-der-stadt-stgallen-pls/records?limit=20&refine=phname%3A${parkingName}`
  );
  const data = await response.json();
  return data;
}

function showData(parkingData) {
  const freeSpaces = parkingData.results[0].shortfree;
  const occupancy = parkingData.results[0].belegung_prozent;

  parkingNumber.textContent = freeSpaces;
  setHouseColorByOccupancy(occupancy);
}

function setHouseColorByOccupancy(occupancy) {
  house.classList.remove("green", "orange", "red");

  if (occupancy === null || occupancy === undefined) {
    return; // oder setze eine Standardfarbe
  }

  if (occupancy <= 20) {
    house.classList.add("green");
  } else if (occupancy <= 80) {
    house.classList.add("orange");
  } else {
    house.classList.add("red");
  }
}
