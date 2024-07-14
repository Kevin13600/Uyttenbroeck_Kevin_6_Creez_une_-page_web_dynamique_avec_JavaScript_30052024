const API_BASE_URL = 'http://localhost:5678/api';

// Fonction générique pour interagir avec l'API
export async function fetchData(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);

    if (!response.ok) {
      throw new Error(`Erreur HTTP ! statut : ${response.status}`);
    }

    const contentType = response.headers.get("content-type");

    // Vérification plus directe du type de contenu pour JSON
    if (contentType?.includes("application/json")) {
      return await response.json();
    }

    // Si ce n'est pas du JSON, on retourne null pour indiquer l'absence de contenu JSON exploitable
    return null;
  } catch (error) {
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
