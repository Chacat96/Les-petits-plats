//Récupérer l'image 
const imagePath = "asset/recette";

function getImagePath(imageName) {
    return `${imagePath}/${imageName}`;
}

//Fonction des filtres
export function filter(ingredient, ustensils, appliance, recipe) {
    const filterContent = document.querySelector('.filter-content');
    const li = document.createElement ('li');


  // Ouvrir / fermer les filtres de recherches
  document.querySelectorAll('.filter-button').forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.closest('.filter');
        const filterContent = filter.querySelector('.filter-content');
        const icon = button.querySelector('i');
        
        // Basculer l'affichage du contenu du filtre
        filter.classList.toggle('active');

        // Basculer l'icône (flèche haut / bas)
        if (filter.classList.contains('active')) {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
            filterContent.style.display = 'block';
        } else {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
            filterContent.style.display = 'none';
        }
    });
});
}

export function displayFilters(data) {
    const ingredientList = document.querySelector('.filter-ingredient .filter-list');
    const applianceList = document.querySelector('.filter-appareils .filter-list');
    const ustensilList = document.querySelector('.filter-ustensiles .filter-list');

    // Collecte des données en supprimant les doublons avec set
    const ingredients = new Set();
    const appliances = new Set();
    const ustensils = new Set();

    data.forEach(recipe => {
        // Ajout des ingrédients
        recipe.ingredients.forEach(ing => ingredients.add(ing.ingredient.toLowerCase()));

        // Ajout des appareils
        appliances.add(recipe.appliance.toLowerCase());

        // Ajout des ustensiles
        recipe.ustensils.forEach(ust => ustensils.add(ust.toLowerCase()));
    });

    // Fonction pour afficher les items dans une liste
    const appendToList = (list, items) => {
        list.innerHTML = ''; 
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = capitalizeFirstLetter(item); 
            li.classList.add('filter-item');
            list.appendChild(li);
        });
    };

    // Afficher les données dans chaque liste
    appendToList(ingredientList, [...ingredients]);
    appendToList(applianceList, [...appliances]);
    appendToList(ustensilList, [...ustensils]);
}
//Ajouter une majuscule à la première lettre
function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}


//Fonction pour afficher les cartes de recettes
export function displayRecipes(recipes) {
    const container = document.getElementById('recipes-container');
    const template = document.getElementById('recipes-template');
    
    // Vider le container avant d'ajouter les nouvelles recettes
    container.innerHTML = '';

    recipes.forEach(recipe => {
        //CloneNode permet de recréer les templates avec des données différente
        const recipeElement = template.content.cloneNode(true);
        
        // Remplir les données avec les data-attributes
        recipeElement.querySelector('[data-image]').src = getImagePath(recipe.image);
        recipeElement.querySelector('[data-time]').textContent = `${recipe.time} min`;
        recipeElement.querySelector('[data-title]').textContent = recipe.name;
        recipeElement.querySelector('[data-description]').textContent = recipe.description;

        // Gestion des ingrédients
        const ingredientContainer = recipeElement.querySelector('.ingredient-container');

        recipe.ingredients.forEach(ing => {

            const ingredientElement = ingredientContainer.cloneNode(true);

            ingredientElement.querySelector('[data-ingredient]').textContent = ing.ingredient;
            ingredientElement.querySelector('[data-quantite]').textContent = ing.quantity || '';
            ingredientElement.querySelector('[data-mesure]').textContent = ing.unit || '';
            ingredientContainer.parentNode.appendChild(ingredientElement);
        });
        // Supprimer le template original des ingrédients
        ingredientContainer.remove();

        container.appendChild(recipeElement);
    });

    updateRecipeCount();
}

export function filterSelect(data) {
    const filterContainer = document.querySelector('.selected-filters'); // Conteneur pour les `span`

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-item')) {
            // Récupérer le texte de l'élément cliqué
            const filterText = e.target.textContent.toLowerCase();

            // Vérifie si le `span` existe déjà
            const existingSpan = filterContainer.querySelector(`.selected-span[data-value="${filterText}"]`);
            if (!existingSpan) {
                addSelectedSpan(filterText, filterContainer, data); // Passer `data` ici
            }

            // Recalcul des recettes
            updateRecipesBasedOnFilters(data, filterContainer);
        }
    });
}

// Fonction pour ajouter un span
function addSelectedSpan(text, container, data) {
    const span = document.createElement('span');
    span.classList.add('selected-span');
    span.setAttribute('data-value', text);
    span.textContent = capitalizeFirstLetter(text);

    // Bouton pour supprimer le `span`
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'x';
    closeBtn.classList.add('close-btn');
    span.appendChild(closeBtn);

    container.appendChild(span);

    // Événement pour retirer le `span` et mettre à jour les recettes
    closeBtn.addEventListener('click', () => {
        span.remove();
        updateRecipesBasedOnFilters(data, container); 
    });
}

// Fonction pour recalculer les recettes
function updateRecipesBasedOnFilters(data, container) {
    // Récupérer tous les filtres actifs
    const activeFilters = Array.from(container.querySelectorAll('.selected-span'))
        .map(span => span.getAttribute('data-value'));

    // Filtrer les recettes en fonction des filtres actifs
    const filteredRecipes = data.filter(recipe => {
        return activeFilters.every(filterText => {
            const ingredientMatch = recipe.ingredients.some(ing => ing.ingredient.toLowerCase() === filterText);
            const applianceMatch = recipe.appliance.toLowerCase() === filterText;
            const ustensilMatch = recipe.ustensils.some(ust => ust.toLowerCase() === filterText);
            return ingredientMatch || applianceMatch || ustensilMatch;
        });
    });

    // Afficher les recettes filtrées
    displayRecipes(filteredRecipes);
}

//Afficher le nombre de recette disponible
export function updateRecipeCount() {
    const recipeCards = document.querySelectorAll('.recipe-card');
    const visibleRecipes = Array.from(recipeCards).filter(card => card.style.display !== 'none');
    const count = visibleRecipes.length;

    const recipeCountElement = document.querySelector('.nomber-recipe');
    recipeCountElement.textContent = count > 0
        ? `${count} recette${count > 1 ? 's' : ''}`
        : 'Aucune recette disponible.';
}





//Faire une fonction pour les evenement que j'appel dans main ou faire un autre fichier uniquement pour les fonction devenement