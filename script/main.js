import { fetchData } from '../script/api.js';
// Récupérer les travaux depuis l'API
// Stocker les travaux dans allItems
// Appeler la fonction pour afficher les travaux dans la galerie
// Créer les boutons de filtre après avoir récupéré les données
// Afficher un message d'erreur en cas de problème avec la requête

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const works = await fetchData('works');
    allItems = works;
    populateGallery(allItems);
    createFilterButtons();
  } catch (error) {
    document.getElementById('error').textContent = 'Erreur : ' + error.message;
  }
});

const filterarray = ["Tous", "Objets", "Appartements", "Hotels & restaurants"];
let allItems = [];

// Fonction pour créer les boutons de filtre
function createFilterButtons() {
  const filterContainer = document.querySelector(".filter");
  filterContainer.innerHTML = ''; // Vider les filtres existants s'il y en a

  filterarray.forEach((filter, index) => {
    const filterbutton = document.createElement("button");
    filterbutton.classList.add('filter-btn');
    filterbutton.innerHTML = filter;

    filterbutton.addEventListener('click', () => {
      filterGallery(filter);
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('filter-btn-selected'));
      filterbutton.classList.add('filter-btn-selected');
    });

    if (index === 0) {
      filterbutton.classList.add('filter-btn-selected');
    }

    filterContainer.appendChild(filterbutton);
  });
}

// Fonction pour filtrer la galerie
function filterGallery(filter) {
  let filteredItems;

  if (filter === "Tous") {
    filteredItems = allItems;
  } else {
    filteredItems = allItems.filter(item => item.category.name === filter);
  }
  populateGallery(filteredItems);
}




// Fonction pour remplir la galerie avec les travaux
// Vider la galerie avant d'ajouter de nouveaux éléments
function populateGallery(works) {
  const gallery = document.getElementById('gallery');
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
