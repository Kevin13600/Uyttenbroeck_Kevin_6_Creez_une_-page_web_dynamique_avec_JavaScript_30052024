import { fetchData, fetchCategories } from '../script/api.js';
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

let allItems = [];

// Fonction pour créer les boutons de filtre
async function createFilterButtons() {
  const filterContainer = document.querySelector(".filter");
  filterContainer.innerHTML = ''; // Vider les filtres existants s'il y en a

  const categories = await fetchCategories();
  const filterarray = ["Tous", ...categories.map(category => category.name)];

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
function populateGallery(works) {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';

  // Pour chaque travail, créer les éléments nécessaires et les ajouter à la galerie
  works.forEach(({ imageUrl, title }) => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = title;
    const figcaption = document.createElement('figcaption');
    figcaption.textContent = title;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

// Appel initial pour créer les boutons de filtre et récupérer les travaux
createFilterButtons();