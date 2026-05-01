// read URL params from PlantNet redirect
const params = new URLSearchParams(window.location.search);
const commonName = params.get("name") || "Unknown Plant";
const latinName = params.get("latin") || "";
const score = params.get("score") || "0";

// fill in what we already have from PlantNet
document.getElementById("common-name").textContent = commonName;
document.getElementById("latin-name").textContent = latinName;
document.getElementById("confidence").textContent = `${score}% confidence`;

// this is , placeholder until plant data API is wired up....
function displayPlant(plantData) {
  const edibleClass = plantData.isEdible ? "edible" : "not-edible";
  const edibleText = plantData.isEdible ? "Edible" : "Not Edible";

  document.getElementById("edibility-info").innerHTML = `
        <span class="${edibleClass}">${edibleText}</span>
        <p>${plantData.description || "No description available"}</p>
    `;

  document.getElementById("how-to-info").textContent =
    plantData.servingSuggestion || "No preparation info available";

  document.getElementById("hazard-info").textContent =
    plantData.hazards || "No hazard info available";

  if (plantData.image) {
    const img = document.getElementById("plant-image");
    img.src = plantData.image;
    img.style.display = "block";
  }
}

// just some mock data .
const mockData = {
  isEdible: true,
  description: "Common edible plant found in urban areas.",
  servingSuggestion: "Wash thoroughly before eating.",
  hazards: "None known.",
  image: null,
};

displayPlant(mockData);
