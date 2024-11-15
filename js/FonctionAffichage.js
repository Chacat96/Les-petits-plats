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
}

//Faire une fonction pour les evenement que j'appel dans main ou faire un autre fichier uniquement pour les fonction devenement