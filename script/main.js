// Importation des fonctions depuis api.js
import { fetchData, fetchCategories, isAdmin, logOut } from "./api.js";

// Sélection des éléments du DOM
const logoutBtn = document.getElementById("logoutBtn");
const loginBtn = document.getElementById("loginBtn");
const modifyBtn = document.querySelector('.modifyBtn');
const blockTitle = document.querySelector('.container-center h2');

let allItems = []; // Déclaration globale
let initialModalContent = ""; // Contenu initial de la modale

// Ajout d'un écouteur pour le bouton "Déconnexion"
logoutBtn.addEventListener("click", () => {
  logOut();
});

// Gestion de l'affichage des éléments selon le statut de l'utilisateur
updateUI();

// Fonction pour mettre à jour l'interface utilisateur en fonction du statut de l'utilisateur
function updateUI() {
  if (isAdmin()) {
    showAdminUI();
  } else {
    showRegularUserUI();
  }
}

// Afficher les éléments pour un administrateur
function showAdminUI() {
  logoutBtn.classList.remove("displayNone");
  loginBtn.classList.add("displayNone");
  modifyBtn.classList.remove('displayNone');
  blockTitle.classList.add("marginCenter");
}

// Afficher les éléments pour un utilisateur régulier
function showRegularUserUI() {
  logoutBtn.classList.add("displayNone");
  loginBtn.classList.remove("displayNone");
  modifyBtn.classList.add('displayNone');
}

// Gestion de la fenêtre modale et de la galerie
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const modalContainer = document.getElementById("modal-container");

  // Écouteur pour le clic sur le bouton "Modifier"
  modifyBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const content = await generateGalleryView();
    showModal(content);
  });

  // Écouteur pour les clics dans la modale
  document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("close")) {
      hideModal();
    } else if (event.target.classList.contains("modal-btn") && event.target.innerText === "Ajouter une photo") {
      const content = generateAddPhotoForm();
      showModal(content);
    } else if (event.target.classList.contains("arrow-left")) {
      // Retour à la première modale et régénération de la galerie
      const content = await generateGalleryView();
      showModal(content);
    } else if (event.target.classList.contains("delete-icon")) {
      const photoDiv = event.target.closest(".modal-photo");
      const photoId = extractPhotoIdFromElement(photoDiv); // Implémentez cette fonction pour extraire l'ID
      deletePhoto(photoId, photoDiv);
    }
  });

  // Fonction pour afficher la modale
  function showModal(content) {
    modalContainer.innerHTML = content;
    modal.classList.remove("displayNone");
  }

  // Fonction pour cacher la modale
  function hideModal() {
    modal.classList.add("displayNone");
    modalContainer.innerHTML = "";
  }

  // Fonction pour générer la vue de la galerie
  async function generateGalleryView() {
    try {
      const response = await fetch('http://localhost:5678/api/works');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des images');
      }
      const data = await response.json();

      let galleryItems = '';
      data.forEach(work => {
        if (work.imageUrl) {
          galleryItems += `
            <div class="modal-photo" data-photo-id="${work.id}" style="position: relative;">
              <img src="${work.imageUrl}" alt="Image" class="work-image">
              <i class="fa-solid fa-trash-can delete-icon"></i>
            </div>`;
        }
      });

      return `
        <span class="close">&times;</span>
        <h2>Galerie photo</h2>
        <div id="modal-gallery" class="modal-gallery">
          ${galleryItems}
        </div>
        <hr>
        <button type="button" class="modal-btn">Ajouter une photo</button>
      `;
    } catch (error) {
      console.error('Erreur:', error);
      return `
        <span class="close">&times;</span>
        <h2>Galerie photo</h2>
        <div id="modal-gallery" class="modal-gallery">
          <p>Erreur lors de la récupération des images.</p>
        </div>
        <hr>
        <button type="button" class="modal-btn">Ajouter une photo</button>
      `;
    }
  }

  // Fonction pour générer le formulaire d'ajout de photo
  function generateAddPhotoForm() {
    return `
      <i class="fa-solid fa-arrow-left arrow-left"></i>
      <span class="close">&times;</span>
      <h2>Ajout photo</h2>
      <div class="add-file-container">
        <i class="fa-regular fa-image"></i>
        <label for="form-file">+ Ajouter photo</label>
        <input type="file" id="form-file" name="form-file" accept=".jpg, .png" class="displayNone" required>
        <span>jpg, png : 4mo max</span>
      </div>
      <form id="add-photo-form">
        <label for="form-title">Titre</label>
        <input type="text" id="form-title" name="form-title" required>
        <label for="form-category">Catégorie</label>
        <input type="text" id="form-category" name="form-category" required>
      </form>
      <hr>
      <button type="submit" class="modal-btn modal-btn-last">Valider</button>
    `;
  }

  

  // Fonction pour supprimer une photo de la galerie
  async function deletePhoto(photoId, photoDiv) {
    console.log("ID de la photo à supprimer:", photoId);

    try {
      const userConfirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette photo ?");
      if (userConfirmed) {
        const response = await fetch(`http://localhost:5678/api/works/${photoId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
          }
        });

        if (response.ok) {
          if (photoDiv) {
            photoDiv.remove(); // Supprime l'élément visuel immédiatement
            console.log('Photo supprimée avec succès');
          } else {
            console.warn('Élément DOM photoDiv est null ou non défini.');
          }
        } else {
          console.error('Erreur lors de la suppression de la photo:', response.status, response.statusText);
        }
      } else {
        console.log('Suppression annulée par l\'utilisateur');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  }

  // Fonction pour extraire l'ID de la photo à partir de l'élément DOM
  function extractPhotoIdFromElement(photoElement) {
    return photoElement.getAttribute('data-photo-id');
  }
});

// Récupération initiale des travaux et affichage
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const works = await fetchData("works");
    allItems = works; // Assigner les données récupérées à la variable globale
    populateGallery(allItems);
    createFilterButtons();
  } catch (error) {
    document.getElementById("error").textContent = "Erreur : " + error.message;
  }
});

// Fonction pour créer les boutons de filtre
async function createFilterButtons() {
  if (!isAdmin()) {
    const filterContainer = document.querySelector(".filter");
    filterContainer.innerHTML = "";

    try {
      const categories = await fetchCategories();
      const filterarray = ["Tous", ...categories.map(category => category.name)];

      filterarray.forEach((filter, index) => {
        const filterbutton = document.createElement("button");
        filterbutton.classList.add("filter-btn");
        filterbutton.textContent = filter;

        filterbutton.addEventListener("click", () => {
          filterGallery(filter);
          document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("filter-btn-selected"));
          filterbutton.classList.add("filter-btn-selected");
        });

        if (index === 0) {
          filterbutton.classList.add("filter-btn-selected");
        }

        filterContainer.appendChild(filterbutton);
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
    }
  }
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
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  works.forEach(({ id, imageUrl, title }) => {
    const figure = document.createElement("figure");
    figure.classList.add("gallery-item");

    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = title;
    image.classList.add("gallery-image");

    figure.appendChild(image);
    gallery.appendChild(figure);
  });
}
