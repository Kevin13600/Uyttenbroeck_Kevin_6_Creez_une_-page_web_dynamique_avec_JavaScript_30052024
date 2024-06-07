// fetch('http://localhost:5678/api/works'): Envoie une requête GET à l'API pour obtenir des données à l'URL spécifiée.
// .then(response => {...}): Vérifie si la réponse est correcte (statut HTTP 200-299). Si ce n'est pas le cas, une erreur est lancée.
// .then(data => {...}): Si la réponse est correcte, les données JSON sont extraites et affichées dans la console.
// .catch(error => {...}): Si une erreur survient à n'importe quel point dans la chaîne de promesses, elle est capturée et affichée dans la console.

fetch('http://localhost:5678/api/works')
.then(response => {
    if (!response.ok) {
        throw new Error('Erreur HTTP ! statut : ' + response.status);
    }
    return response.json(); // Traiter les données reçu
})
.then(data => {
    console.log(data); // Traiter les données reçues
})
.catch(error => {
    console.error('Il y a eu un problème avec la requête fetch :', error);
})

const API_BASE_URL = 'http://localhost:5678/api';

// fetchData(endpoint): Fonction asynchrone qui prend un endpoint (chemin de l'API après le domaine de base) en paramètre.
// response.ok: Vérifie si la réponse est correcte (statut HTTP 200-299). Si ce n'est pas le cas, une erreur est lancée.
// await response.json(): Extrait les données JSON de la réponse.
// catch (error) {...}: Capture toute erreur survenue pendant la requête et l'affiche dans la console. Ensuite, elle relance l'erreur pour que l'appelant puisse la gérer.
export async function fetchData(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`);
    if (!response.ok) {
      throw new Error('Erreur HTTP ! statut : ' + response.status);
    }
    return await response.json();
  } catch (error) {
    console.error('Il y a eu un problème avec la requête fetch :', error);
    throw error; // Relancer l'erreur pour être gérée par l'appelant
  }
}


// Fonction pour récupérer les catégories depuis l'API
export async function fetchCategories() {
  try {
    return await fetchData('categories');
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories :', error);
    return []; // Retourne un tableau vide en cas d'erreur
  }
}

