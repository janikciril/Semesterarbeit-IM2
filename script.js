const buttons = document.querySelectorAll(".button");
const parkingNumber = document.getElementById("parking-number");
const house = document.querySelector(".house");
const carsContainer = document.getElementById("cars-container");

const carImages = [
  "assets/car1.svg",
  "assets/car2.svg",
  "assets/car3.svg"
];

buttons.forEach(button => {
  button.addEventListener('click', async () => {
    // Aktive Klasse setzen
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Daten abrufen
    const parkingName = button.getAttribute("data-parking");
    try {
      const parkingData = await fetchParkingData(parkingName);
      showData(parkingData);
    } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
      parkingNumber.textContent = "Fehler";
      setHouseColorByOccupancy(null); // z. B. Farbe nicht setzen
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

  let carCount = 0;

  if (occupancy === null || occupancy === undefined) {
    return;
  }

  if (occupancy <= 20) {
    house.classList.add("green");
    carCount = 5;
  } else if (occupancy <= 80) {
    house.classList.add("orange");
    carCount = 10;
  } else {
    house.classList.add("red");
    carCount = 15;
  }

  // Autos losfahren lassen
  for (let i = 0; i < carCount; i++) {
    setTimeout(() => createAndAnimateCar(), i * 300);
  }
}

function createAndAnimateCar() {
  const img = document.createElement("img");
  img.src = carImages[Math.floor(Math.random() * carImages.length)];
  img.classList.add("car");

  const startY = Math.random() * window.innerHeight * 0.8;
  const direction = Math.random() > 0.5 ? 1 : -1;
  const startX = direction === 1 ? -100 : window.innerWidth + 100;

  img.style.top = `${startY}px`;
  img.style.left = `${startX}px`;
  img.style.transform = `scaleX(${direction})`;
  img.style.position = "absolute";
  img.style.width = "100px"; // grössere Autos

  carsContainer.appendChild(img);

  const travelDistance = window.innerWidth + 200;
  const duration = 5000 + Math.random() * 3000;

  img.animate(
    [
      { transform: `translateX(0) scaleX(${direction})` },
      { transform: `translateX(${direction * travelDistance}px) scaleX(${direction})` }
    ],
    {
      duration,
      easing: "linear",
      fill: "forwards"
    }
  );

  setTimeout(() => {
    img.remove();
  }, duration);
}