const imagePath = "asset/recette";

function getImagePath(imageName) {
    return `${imagePath}/${imageName}`;
}

// Fonction pour les majuscules
function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// État global pour gérer les filtres et la recherche
const filterState = {
    searchText: '',
    activeTags: [],
}

// Fonctions liées aux événements de filtres
export function filter() {
    // Gérer l'ouverture/fermeture des filtres de recherche
    document.querySelectorAll('.filter-button').forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.closest('.filter');
            const filterContent = filter.querySelector('.filter-content');
            const icon = button.querySelector('i');
            
            // Basculer l'affichage et l'icône du filtre
            filter.classList.toggle('active');
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

export function setupFilterSearch() {
    // Recherche dans les filtres
    const searchInputs = document.querySelectorAll('.search');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const searchText = e.target.value.toLowerCase().trim();
            const filterList = input.closest('.filter').querySelector('.filter-list');
            const filterItems = filterList.querySelectorAll('.filter-item');

            // Filtre les éléments par la première lettre
            filterItems.forEach(item => {
                const itemText = item.textContent.toLowerCase();
                item.style.display = (itemText.startsWith(searchText) || searchText === '') ? 'block' : 'none';
            });
        });
    });
}

// Fonction d'affichage
export function displayFilters(data) {
    // Collecte et affiche les filtres tag
    const ingredientList = document.querySelector('.filter-ingredient .filter-list');
    const applianceList = document.querySelector('.filter-appareils .filter-list');
    const ustensilList = document.querySelector('.filter-ustensiles .filter-list');

    // Extraction des données
    const ingredients = new Set(data.flatMap(recipe => 
        recipe.ingredients.map(ing => ing.ingredient.toLowerCase())
    ));
    const appliances = new Set(data.map(recipe => recipe.appliance.toLowerCase()));
    const ustensils = new Set(data.flatMap(recipe => 
        recipe.ustensils.map(ust => ust.toLowerCase())
    ));

    // Fonction pour remplir les listes de filtres
    const appendToList = (list, items) => {
        list.innerHTML = ''; 
        [...items].sort().forEach(item => {
            const li = document.createElement('li');
            li.textContent = capitalizeFirstLetter(item);
            li.classList.add('filter-item');
            list.appendChild(li);
        });
    };

    // Afficher les données triées
    appendToList(ingredientList, ingredients);
    appendToList(applianceList, appliances);
    appendToList(ustensilList, ustensils);
}

//Fonction affichage des recettes
export function displayRecipes(recipes) {
    // Afficher les cartes de recettes
    const container = document.getElementById('recipes-container');
    const template = document.getElementById('recipes-template');
    
    container.innerHTML = '';

    recipes.forEach(recipe => {
        const recipeElement = template.content.cloneNode(true);
        
        // Remplir les données de la recette
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
        ingredientContainer.remove();

        container.appendChild(recipeElement);
    });

    updateRecipeCount();
}

// Fonctions de filtrage et de recherche
export function filterSelect(data) {
    // Gestion de la sélection des filtres
    const filterContainer = document.querySelector('.selected-filters'); 

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-item')) {
            const filterText = e.target.textContent.toLowerCase();
           const sanitizer = sanitizeInput(filterText);
            const existingSpan = filterContainer.querySelector(`.selected-span[data-value="${filterText}"]`);
            
            if (!existingSpan) {
                addSelectedSpan(filterText, filterContainer, data, sanitizer);
                console.log(filterContainer);

            }

            updateRecipesBasedOnFilters(data, filterContainer);
        }
    });
}

function addSelectedSpan(text, container, data) {
    // Créer un span pour le filtre sélectionné
    const span = document.createElement('span');
    span.classList.add('selected-span');
    span.setAttribute('data-value', text);
    span.textContent = capitalizeFirstLetter(text);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'x';
    closeBtn.classList.add('close-btn');
    span.appendChild(closeBtn);

    container.appendChild(span);

    // Événement pour supprimer le filtre
    closeBtn.addEventListener('click', () => {
        span.remove();
        updateRecipesBasedOnFilters(data, container);
    });
}

function updateRecipesBasedOnFilters(data, container) {
    // Filtrer les recettes selon les tags et la recherche
    const activeTags = Array.from(container.querySelectorAll('.selected-span'))
        .map(span => span.getAttribute('data-value').toLowerCase());
    filterState.activeTags = activeTags;

    const filteredRecipes = data.filter(recipe => {
        const matchesTags = activeTags.every(tag => {
            const ingredientMatch = recipe.ingredients.some(ing => ing.ingredient.toLowerCase() === tag);
            const applianceMatch = recipe.appliance.toLowerCase() === tag;
            const ustensilMatch = recipe.ustensils.some(ust => ust.toLowerCase() === tag);
            return ingredientMatch || applianceMatch || ustensilMatch;
        });

        const matchesSearchText = recipe.name.toLowerCase().includes(filterState.searchText) ||
                                   recipe.description.toLowerCase().includes(filterState.searchText) ||
                                   recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(filterState.searchText));

        return matchesTags && matchesSearchText;
    });

    displayRecipes(filteredRecipes);
}

// Fonction de recherche
export function searchLetter(data, container) {
    const searchBar = document.getElementById('search-bar');
    const recipesContainer = document.getElementById('recipes-container');

    searchBar.addEventListener('input', (e) => {
    const rawInput = e.target.value; // Texte brut saisi par l'utilisateur
    const sanitized = sanitizeInput(rawInput); // Nettoyage du texte
    console.log(`Entrée brute : "${rawInput}" → Nettoyée : "${sanitized}"`);
});

    searchBar.addEventListener('keyup', (e) => {
        const searchLetter = sanitizeInput (e.target.value.toLowerCase().trim());

        // Lancer la recherche uniquement à partir de 3 lettres
        if (searchLetter.length < 3) {
            filterState.searchText = '';
            updateRecipesBasedOnFilters(data, container);
            updateFilterLists(data); // Met à jour les listes avec toutes les recettes
            return;
        }

        filterState.searchText = searchLetter;

        // Filtrage avec boucles natives
        const filteredRecipes = [];
        for (let i = 0; i < data.length; i++) {
            const recipe = data[i];

            let matchesSearchText = false;

            // Vérifier si le nom ou la description contient le texte recherché
            if (
                recipe.name.toLowerCase().includes(searchLetter) ||
                recipe.description.toLowerCase().includes(searchLetter)
            ) {
                matchesSearchText = true;
            }

            // Vérifier si un des ingrédients contient le texte recherché
            for (let j = 0; j < recipe.ingredients.length; j++) {
                if (recipe.ingredients[j].ingredient.toLowerCase().includes(searchLetter)) {
                    matchesSearchText = true;
                    break; // Arrêter la boucle si une correspondance est trouvée
                }
            }

            if (matchesSearchText) {
                filteredRecipes.push(recipe);
            }
        }

        // Afficher les recettes filtrées
        displayRecipes(filteredRecipes);

        // Mettre à jour les listes des filtres en fonction des résultats
        updateFilterLists(filteredRecipes);

        // Gestion du message "aucun résultat"
        const message = document.getElementById('no-results-message');
        const matchingCards = document.querySelectorAll('.recipe-card:not([style*="display: none"])');

        if (!matchingCards.length) {
            if (!message) {
                const noResultsMessage = document.createElement('p');
                noResultsMessage.id = 'no-results-message';
                noResultsMessage.textContent = `Aucune recette ne contient '${e.target.value}'. Vous pouvez chercher « tarte aux pommes », « poisson », etc.`;
                recipesContainer.appendChild(noResultsMessage);
            }
        } else if (message) {
            message.remove();
        }
    });
}

// Fonction pour neutraliser les caractères spéciaux
export function sanitizeInput(input) {
    const tempDiv = document.createElement('div');
    tempDiv.textContent = input; // Cette méthode textContent neutralise les caractères spéciaux
    return tempDiv.innerHTML; // Retourne le contenu sécurisé
}


function updateFilterLists(recipes) {
    // Référence des listes
    const ingredientList = document.querySelector('.filter-ingredient .filter-list');
    const applianceList = document.querySelector('.filter-appareils .filter-list');
    const ustensilList = document.querySelector('.filter-ustensiles .filter-list');

    // Extraction des données des recettes filtrées
    const ingredients = new Set(
        recipes.flatMap(recipe => recipe.ingredients.map(ing => ing.ingredient.toLowerCase()))
    );
    const appliances = new Set(
        recipes.map(recipe => recipe.appliance.toLowerCase())
    );
    const ustensils = new Set(
        recipes.flatMap(recipe => recipe.ustensils.map(ust => ust.toLowerCase()))
    );

    // Fonction pour mettre à jour les listes
    const updateList = (list, items) => {
        list.innerHTML = ''; // Vider la liste actuelle
        [...items].sort().forEach(item => {
            const li = document.createElement('li');
            li.textContent = capitalizeFirstLetter(item);
            li.classList.add('filter-item');
            list.appendChild(li);
        });
    };

    // Mettre à jour chaque liste
    updateList(ingredientList, ingredients);
    updateList(applianceList, appliances);
    updateList(ustensilList, ustensils);
}

function getFilteredRecipes(data) {
    const activeTags = filterState.activeTags;
    const searchText = filterState.searchText;

    return data.filter(recipe => {
        const matchesTags = activeTags.every(tag => {
            const ingredientMatch = recipe.ingredients.some(ing => ing.ingredient.toLowerCase() === tag);
            const applianceMatch = recipe.appliance.toLowerCase() === tag;
            const ustensilMatch = recipe.ustensils.some(ust => ust.toLowerCase() === tag);
            return ingredientMatch || applianceMatch || ustensilMatch;
        });

        const matchesSearchText = recipe.name.toLowerCase().includes(searchText) ||
                                   recipe.description.toLowerCase().includes(searchText) ||
                                   recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(searchText));

        return matchesTags && matchesSearchText;
    });
}

//Fonction d'affichage du nombre de recette présente
export function updateRecipeCount() {
    // Mettre à jour le nombre de recettes affichées
    const recipeCards = document.querySelectorAll('.recipe-card');
    const visibleRecipes = Array.from(recipeCards).filter(card => card.style.display !== 'none');
    const count = visibleRecipes.length;

    const recipeCountElement = document.querySelector('.nomber-recipe');
    recipeCountElement.textContent = count > 0
        ? `${count} recette${count > 1 ? 's' : ''}`
        : 'Aucune recette disponible.';
}