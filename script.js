import { getData } from "./js/service.js";
import { displayRecipes, filter, displayFilters,setupFilterSearch, filterSelect, searchLetter } from "./js/fonction.js";

async function main() {
    try {
        const data = await getData();
        displayRecipes(data);
        searchLetter(data, document.querySelector('.selected-filters'));
        filterSelect(data);
        filter(); 
        setupFilterSearch();
        displayFilters(data);    
    } catch (error) {
        console.error('Erreur de chargement des recettes', error); 
    }
}

main();
