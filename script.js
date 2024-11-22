import { getData } from "./js/service.js";
import { displayRecipes, filter, displayFilters} from "./js/FonctionAffichage.js"
import { searchLetter } from "./js/fonction.js";


async function main() {
    // Récupère les données JSON
    try {
        const data = await getData();
        displayRecipes(data);
        filter();
        displayFilters(data);
        searchLetter();
    } catch (error) {
        console.error('Erreur de chargement des recettes', error); 
    }
}

main();
