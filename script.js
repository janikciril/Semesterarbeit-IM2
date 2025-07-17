const buttons = document.querySelectorAll(".button");
const parkingStatus = document.getElementById("parking-status");
const carsContainer = document.getElementById("cars-container");
const svgContainer = document.getElementById("svg-container");

const carImages = ["assets/car1.svg", "assets/car2.svg", "assets/car3.svg"];

buttons.forEach((button) => {
  button.addEventListener("click", async () => {
    buttons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const parkingName = button.getAttribute("data-parking");

    try {
      const parkingData = await fetchParkingData(parkingName);
      showData(parkingData);
    } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
      parkingStatus.textContent = "Fehler";
      svgContainer.innerHTML = "";
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
  console.log(parkingData);
  const freeSpaces = parkingData.results[0].shortfree;
  const occupancy = parkingData.results[0].belegung_prozent;

  updateSVGByOccupancy(occupancy, freeSpaces);

  let carCount = 0;
  if (occupancy <= 20) {
    carCount = 5;
  } else if (occupancy <= 80) {
    carCount = 10;
  } else {
    carCount = 20;
  }

  for (let i = 0; i < carCount; i++) {
    setTimeout(() => createAndAnimateCar(), i * 300);
  }
}

async function updateSVGByOccupancy(occupancy, freeSpaces) {
  let svgFile = "";

  if (occupancy === null || occupancy === undefined) {
    svgContainer.innerHTML = "";
    return;
  }

  if (occupancy <= 20) {
    svgFile = "assets/parkhaus_lte_20.svg";
  } else if (occupancy <= 80) {
    svgFile = "assets/parkhaus_lte_80.svg";
  } else {
    svgFile = "assets/parkhaus_voll.svg";
  }

  await updateSVG(svgFile, `freie Parkplätze`, freeSpaces);
}

function createAndAnimateCar() {
  const img = document.createElement("img");
  img.src = carImages[Math.floor(Math.random() * carImages.length)];
  img.classList.add("car");

  const startY =
    window.innerHeight * 0.5 + Math.random() * window.innerHeight * 0.5;
  const direction = Math.random() > 0.5 ? 1 : -1;
  const startX = direction === 1 ? -100 : window.innerWidth + 100;

  img.style.top = `${startY}px`;
  img.style.left = `${startX}px`;
  img.style.transform = `scaleX(${direction})`;
  img.style.position = "absolute";

  carsContainer.appendChild(img);

  const travelDistance = window.innerWidth + 200;
  const duration = 5000 + Math.random() * 3000;

  img.animate(
    [
      { transform: `translateX(0) scaleX(${direction})` },
      {
        transform: `translateX(${
          direction * travelDistance
        }px) scaleX(${direction})`,
      },
    ],
    {
      duration,
      easing: "linear",
      fill: "forwards",
    }
  );

  setTimeout(() => {
    img.remove();
  }, duration);
}

// Leeres Parkhaus beim ersten Laden anzeigen
updateSVG("assets/parkhaus_leer.svg", "Wähle ein Parkhaus", "");

async function updateSVG(filePath, textContent = "", zahlContent = "") {
  try {
    const response = await fetch(filePath);
    const svgText = await response.text();
    svgContainer.innerHTML = svgText;

    const svgDoc = svgContainer.querySelector("svg");
    const textElement = svgDoc?.getElementById("Text");
    const zahlElement = svgDoc?.getElementById("Zahl");

    if (textElement) {
      textElement.textContent = textContent;
    }
    if (zahlElement) {
      zahlElement.textContent = zahlContent;
    }
  } catch (error) {
    console.error("Fehler beim Laden des SVG:", error);
    svgContainer.innerHTML = "";
  }
}
