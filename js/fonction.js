//fonction de recherche
export function searchLetter() {
    const searchBar = document.getElementById('search-bar');
    const recipesContainer = document.getElementById('recipes-container');

    searchBar.addEventListener('keyup', (e) => {
        const searchLetter = e.target.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.recipe-card');

        // Filtrer les recettes selon la recherche
        const matchingCards = Array.from(cards).filter(card => {
            const title = card.querySelector('.recipe-title').textContent.toLowerCase();
            return title.includes(searchLetter);
        });

        // Afficher ou masquer les cartes selon les résultats
        cards.forEach(card => card.style.display = 'none'); 
        matchingCards.forEach(card => card.style.display = 'block'); 

        // Afficher un message si aucune recette ne correspond
        const message = document.getElementById('no-results-message');
        if (!matchingCards.length && searchLetter.length >= 3) {
            if (!message) {
                const noResultsMessage = document.createElement('p');
                noResultsMessage.id = 'no-results-message';
                noResultsMessage.textContent = `Aucune recette ne contient ‘${e.target.value}’. Vous pouvez chercher « tarte aux pommes », « poisson », etc.`;
                recipesContainer.appendChild(noResultsMessage);
            }
        } else if (message) {
            // Supprimer le message si des résultats sont trouvés ou si la saisie est courte
            message.remove();
        }
        updateRecipeCount();
    });
}


function filterLetter(searchText, elements) {
    if (searchText.length > 2) { // Vérifie si le texte recherché contient plus de 2 caractères
        elements.forEach(element => {
            if (element.textContent.toLowerCase().includes(searchText)) {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });
    } else {
        elements.forEach(element => element.style.display = 'block'); // Réinitialise l'affichage si moins de 3 caractères
    }
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