//fonction de recherche
export function searchLetter () {
    const searchBar = document.getElementById('search-bar');

searchBar.addEventListener('keyup', (e) => {
    const searchLetter = e.target.value.toLowerCase();
    const card = document.querySelectorAll('.recipe-card');
    filterLetter(searchLetter, card);
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