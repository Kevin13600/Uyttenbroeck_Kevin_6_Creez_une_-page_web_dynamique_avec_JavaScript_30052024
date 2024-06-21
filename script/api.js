const API_BASE_URL = 'http://localhost:5678/api';

// Fonction générique pour récupérer des données de l'API
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

// Fonction pour vérifier si l'utilisateur est administrateur
export function isAdmin() {
  return sessionStorage.getItem('authToken') ? true : false;
}

// Fonction pour déconnecter l'utilisateur
export function logOut() {
  sessionStorage.clear();
  location.href = './pages/login.html';
}
