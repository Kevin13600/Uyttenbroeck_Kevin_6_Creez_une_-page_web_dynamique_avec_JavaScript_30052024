import { fetchData, fetchCategories, isAdmin, logOut } from "./api.js";
import {
  updateUI,
  showAdminUI,
  showRegularUserUI,
  showModal,
  hideModal,
  generateGalleryView,
  generateAddPhotoForm,
  deletePhoto,
  extractPhotoIdFromElement,
  populateGallery,
  filterGallery,
  createFilterButtons,
  handleFormSubmit,
  checkFormValidity
} from "./functions.js";

// Sélection des éléments du DOM
const logoutBtn = document.getElementById("logoutBtn");
const loginBtn = document.getElementById("loginBtn");
const modifyBtn = document.querySelector('.modifyBtn');
const blockTitle = document.querySelector('.container-center h2');
const modal = document.getElementById("modal");
const modalContainer = document.getElementById("modal-container");
const gallery = document.getElementById("gallery");
const filterContainer = document.querySelector(".filter");
const editBar = document.querySelector(".edit-bar");
const header = document.querySelector('header');

let allItems = [];
let initialModalContent = "";

logoutBtn.addEventListener("click", () => {
  logOut();
});

updateUI(isAdmin, () => showAdminUI(logoutBtn, loginBtn, modifyBtn, blockTitle, editBar, header), () => showRegularUserUI(logoutBtn, loginBtn, modifyBtn, editBar, header));

document.addEventListener("DOMContentLoaded", () => {
  modifyBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const content = await generateGalleryView(fetchData, allItems);
    showModal(modal, modalContainer, content);
  });

  document.addEventListener("click", async (event) => {
    if ((event.target.classList.contains("close")) || (event.target.classList.contains("modal"))) {
      hideModal(modal, modalContainer);
    } else if (event.target.classList.contains("modal-btn") && event.target.innerText === "Ajouter une photo") {
      const categories = await fetchCategories();
      const content = generateAddPhotoForm(categories);
      showModal(modal, modalContainer, content);
    } else if (event.target.classList.contains("arrow-left")) {
      const content = await generateGalleryView(fetchData, allItems);
      showModal(modal, modalContainer, content);
    } else if (event.target.classList.contains("delete-icon")) {
      const userConfirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette photo ?");
      if (userConfirmed) {
      const photoDiv = event.target.closest(".modal-photo");
      const photoId = extractPhotoIdFromElement(photoDiv);
      deletePhoto(photoId, photoDiv, allItems, gallery)
      .then((newItems) => allItems = newItems);
    } else {
      console.log('Suppression annulée par l\'utilisateur');
    }
    } else if (event.target.classList.contains("modal-btn") && event.target.innerText === "Valider") {
      handleFormSubmit(event, modal, modalContainer, allItems, gallery, fetchData);
    }
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const works = await fetchData("works");
    allItems = works;
    populateGallery(allItems, gallery);
    createFilterButtons(isAdmin, fetchCategories, filterGallery, filterContainer, allItems, gallery);
  } catch (error) {
    document.getElementById("error").textContent = "Erreur : " + error.message;
  }
});


document.addEventListener('DOMContentLoaded', function() {
  // Fonction pour gérer le changement de fichier
  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
      // Créer un élément img
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.style.maxWidth = '129px';
      img.style.maxHeight = '193px';

      // Remplacer le contenu de add-file-container par l'image
      const container = event.target.closest('.add-file-container');
      container.innerHTML = '';
      container.appendChild(img);
    }
  }

  // Ajouter l'écouteur d'événements au document
  document.addEventListener('change', function(event) {
    if (event.target && event.target.id === 'form-file') {
      handleFileSelect(event);
    }
  });
});

// Ajout des écouteurs d'événements après l'insertion du formulaire
document.addEventListener('DOMContentLoaded', function() {
  document.body.addEventListener('input', function(event) {
    if (event.target.matches('#form-file, #form-title, #form-category')) {
      checkFormValidity();
    }
  });
  document.body.addEventListener('change', function(event) {
    if (event.target.matches('#form-file, #form-title, #form-category')) {
      checkFormValidity();
    }
  });
});

