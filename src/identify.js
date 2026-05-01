async function identifyAndFetchDetails(imageData) {
  // 1. Identify with PlantNet
  const formData = new FormData();
  formData.append("image", imageData);

  const identifyRes = await fetch("/api/identify", {
    method: "POST",
    body: formData,
  });

  const identifyData = await identifyRes.json();
  const scientificName = identifyData.scientificName;
  const commonName = identifyData.commonName;

  // 2. Search PermaPeople (POST, JSON body)
  const searchRes = await fetch("/api/permapeople/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q: scientificName || commonName }),
  });

  const searchData = await searchRes.json();
  const first = searchData.plants?.[0];

  let permaData = {};

  // 3. If a plant was found, fetch full details
  if (first) {
    const plantRes = await fetch(`/api/permapeople/plants/${first.id}`);
    permaData = await plantRes.json();
  }

  // 4. Parse PermaPeople data
  const plant = parsePerma(permaData);

  // 5. Display in UI
  displayPlant(plant);
}

// async function identifyAndFetchDetails(imageData) {
//   // 1. Send image to PlantNet
//   const formData = new FormData();
//   formData.append("image", imageData);

//   const identifyRes = await fetch("/api/identify", {
//     method: "POST",
//     body: formData,
//   });

//   const identifyData = await identifyRes.json();
//   const scientificName = identifyData.scientificName;

//   // 2. Fetch Trefle details
//   const rawDetails = await fetch(
//     `/api/plant-details?name=${encodeURIComponent(scientificName)}`,
//   ).then((res) => res.json());

//   // 3. Parse the Trefle data using the new helper
//   const parsed = parsePlant(rawDetails);

//   // 4. Determine edibility
//   const edible = isEdible(parsed);

//   // 5. Display in your UI
//   displayPlant({
//     name: parsed.commonName,
//     latinName: parsed.scientificName,
//     family: parsed.family,
//     image: parsed.image,
//     edible: edible,
//     edibleParts: parsed.edibleParts,
//   });
// }

// function parsePlant(data) {
//   return {
//     commonName: data.common_name || "Unknown",
//     scientificName: data.scientific_name,
//     family: data.family_common_name || data.family,
//     genus: data.genus,
//     image: data.image_url,
//     edibleParts: data.edible_part || [],
//     isVegetable: data.vegetable === true,
//     distributions: data.distributions || [],
//   };
// }

function parsePerma(data) {
  return {
    commonName: data.common_name || "Unknown",
    scientificName: data.scientific_name || "Unknown",
    family: data.family || "Unknown",
    image: data.image || "",
    edible: data.edible || false,
    edibleParts: data.edible_parts || [],
    uses: data.uses || [],
    toxicity: data.toxicity || "unknown",
  };
}

function isEdible(plant) {
  if (plant.isVegetable) return true;
  if (plant.edibleParts.length > 0) return true;
  return false;
}

function displayPlant(plant) {
  document.getElementById("name").textContent = plant.name || "Unknown";
  document.getElementById("latinName").textContent =
    plant.latinName || "Unknown";
  document.getElementById("family").textContent = plant.family || "Unknown";

  if (plant.image) {
    document.getElementById("image").src = plant.image;
  }

  document.getElementById("edible").textContent = plant.edible
    ? "Edible"
    : "Not edible";

  document.getElementById("edibleParts").textContent =
    plant.edibleParts.length > 0 ? plant.edibleParts.join(", ") : "None listed";
}
