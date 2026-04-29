//all plantData and .anything are placeholders for real data tags.

function displayPlant(plantData) {
    const container = document.getElementById('plant-container');
    
    //edible class will change class name so the tag can be eaily customized with css red/green
    const edibleClass = plantData.isEdible ? 'edible' : 'not-edible';
    //edibleText will change the text in the tag to either edible or not edible
    const edibleText = plantData.isEdible ? 'Edible' : 'Not Edible';

    container.innerHTML = `
      <div class="plant-card">
        <div class="plant-header">
          <h1>${plantData.name}</h1>
          <p class="latin-name">${plantData.latinName}</p>
        </div>

        <div class="status">
          <span class="tag ${edibleClass}">${edibleText}</span>
        </div>

        <div class="description">
          <p>${plantData.description}</p>
        </div>

        <div class="serving-suggestion">
          <h4>Best Way to Serve</h4>
          <p>${plantData.servingSuggestion}</p>
        </div>
      </div>
    `;
}