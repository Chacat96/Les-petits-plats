import { getData } from "./js/service.js";
import { displayRecipes, filter} from "./js/FonctionAffichage.js"
import { searchLetter } from "./js/fonction.js";


async function main() {
    // Récupère les données JSON
    try {
        const data = await getData();
        displayRecipes(data);
        filter();
        searchLetter();
    } catch (error) {
        console.error('Erreur de chargement des recettes', error); 
    }
}

main();
