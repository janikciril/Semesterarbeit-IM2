  const buttons = document.querySelectorAll(".button");
  const parkingNumber = document.getElementById("parking-number");
  const roof = document.querySelector(".roof");
  const walls = document.querySelector(".walls");

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      const parkingName = button.getAttribute("data-parking");
      let parkingData = await fetchParkingData(parkingName);
      showData(parkingData);
    });
  });

  async function fetchParkingData(parkingName) {
    try {
      const response = await fetch(
        `https://daten.stadt.sg.ch/api/explore/v2.1/catalog/datasets/freie-parkplatze-in-der-stadt-stgallen-pls/records?limit=20&refine=phname%3A${parkingName}`
      );
      const data = await response.json();
      return data;
      // if (record && record.fields.free_spaces !== undefined && record.fields.max_capacity !== undefined) {
      //   const free = record.fields.free_spaces;
      //   const capacity = record.fields.max_capacity;
      //   const occupancy = 100 - (free / capacity) * 100;

      //   parkingNumber.textContent = free;

      //   // Farbe basierend auf Auslastung
      //   if (occupancy <= 20) {
      //     setColors("green");
      //   } else if (occupancy <= 60) {
      //     setColors("orange");
      //   } else {
      //     setColors("red");
      //   }
      // } else {
      //   parkingNumber.textContent = "N/A";
      //   console.warn(`Parkhaus "${parkingName}" nicht gefunden oder unvollständige Daten.`);
      //   setColors("gray");
      // }
    } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
      return [];
      // parkingNumber.textContent = "Fehler";
      // setColors("gray");
    }
  }

  function showData(parkingData) {
    console.log(parkingData.results[0].shortfree);
    const container = document.querySelector("#number").value 
  }



  function setColors(color) {
    roof.style.borderBottomColor = color;
    walls.style.backgroundColor = color;
  }
