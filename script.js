  const buttons = document.querySelectorAll(".button");
  const parkingNumber = document.getElementById("parking-number");
  const roof = document.querySelector(".roof");
  const walls = document.querySelector(".walls");
  const house = document.querySelector(".house");

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

    } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
      return [];
      // parkingNumber.textContent = "Fehler";
      // setColors("gray");
    }
  }

  function showData(parkingData) {
    const freeSpaces = parkingData.results[0].shortfree; 
    const occupancy = parkingData.results[0].belegung_prozent; // z. B. 73.5 (%)
    console.log(occupancy);

    parkingNumber.textContent = freeSpaces;    
    setHouseColorByOccupancy(occupancy); // neue Version nutzt nur die Zahl
    //console.log(freeSpaces);
  }

  function setHouseColorByOccupancy(belegung_prozent) {
 
    if (belegung_prozent <= 20) {
      //color = "#FA0505"; // grün
      house.classList.remove("orange");
      house.classList.remove("red");
      house.classList.add("green");
    } else if (belegung_prozent <= 80) {
      //color = "#FDB100"; // orange
      house.classList.add("orange");
      house.classList.remove("green");
      house.classList.remove("red");
    } else {
      //color = "#20CA10"; // rot
      house.classList.remove("orange");
      house.classList.add("red");
      house.classList.remove("green");
    }
  
  }
  


       