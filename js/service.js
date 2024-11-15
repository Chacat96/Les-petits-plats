//Fonction fetch pour les recettes

export async function getData  () {
    const url = "data/data.json";
    try {
        const response = await fetch (url)
        if (!response.ok) {
            throw new Error (`Reponse du statut`)
        }

        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error.message);
    }
}