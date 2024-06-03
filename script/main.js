import { fetchData } from '../script/api.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Récupérer les travaux depuis l'API
    const works = await fetchData('works');
    // Appeler la fonction pour afficher les travaux dans la galerie
    populateGallery(works);
  } catch (error) {
    // Afficher un message d'erreur en cas de problème avec la requête
    document.getElementById('error').textContent = 'Erreur : ' + error.message;
  }
});

// Fonction pour remplir la galerie avec les travaux
function populateGallery(works) {
  const gallery = document.getElementById('gallery');
  // Vider la galerie avant d'ajouter de nouveaux éléments
  gallery.innerHTML = '';

  // Pour chaque travail, créer les éléments nécessaires et les ajouter à la galerie
  works.forEach(work => {
    const figure = document.createElement('figure');

    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;

    const figcaption = document.createElement('figcaption');
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}