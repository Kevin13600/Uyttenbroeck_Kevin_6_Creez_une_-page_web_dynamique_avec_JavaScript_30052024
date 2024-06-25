const API_BASE_URL = 'http://localhost:5678/api';

// Fonction générique pour interagir avec l'API
export async function fetchData(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
    
    // Si la réponse n'est pas OK, lever une erreur avec le statut
    if (!response.ok) {
      throw new Error('Erreur HTTP ! statut : ' + response.status);
    }

    // Vérification si la réponse a un contenu ou non
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await response.json(); // Retourner la réponse au format JSON si la requête est réussie
    } else {
      // Si le type de contenu n'est pas JSON, retourner la réponse brute
      return null;
    }
  } catch (error) {
    // En cas d'erreur, loguer l'erreur et la relancer
    console.error('Il y a eu un problème avec la requête fetch :', error);
    throw error;
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

// Fonction pour vérifier si l'utilisateur est administrateur
export function isAdmin() {
  return sessionStorage.getItem('authToken') ? true : false;
}

// Fonction pour déconnecter l'utilisateur
export function logOut() {
  sessionStorage.clear();
  location.href = './pages/login.html';
}
