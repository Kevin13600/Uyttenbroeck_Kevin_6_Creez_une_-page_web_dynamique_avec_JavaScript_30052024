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
  handleFormSubmit
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

let allItems = [];
let initialModalContent = "";

logoutBtn.addEventListener("click", () => {
  logOut();
});

updateUI(isAdmin, () => showAdminUI(logoutBtn, loginBtn, modifyBtn, blockTitle), () => showRegularUserUI(logoutBtn, loginBtn, modifyBtn));

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
      const photoDiv = event.target.closest(".modal-photo");
      const photoId = extractPhotoIdFromElement(photoDiv);
      deletePhoto(photoId, photoDiv, allItems, gallery)
      .then((newItems) => allItems = newItems);
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