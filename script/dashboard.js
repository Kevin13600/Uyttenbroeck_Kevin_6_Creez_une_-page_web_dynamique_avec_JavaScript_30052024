import { fetchData } from '../script/api.js';

document.addEventListener('DOMContentLoaded', async () => {
        try {
            const works = await fetchData('works');
            allItems = works;
            populateGallery(allItems);
        } catch (error) {
    document.getElementById('error').textContent = 'Erreur : ' + error.message;
    }
});

    let allItems = [];

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

// Sélectionner l'élément "Modifier"
const modifyButton = document.querySelector(".header-fa");

// Sélectionner la modale
const modal = document.getElementById("modal");
const closeModal = document.querySelector(".close");

// Fonction pour ouvrir la modale
function openModal() {
    modal.classList.add("show");
    modal.style.display = "block";
}

// Fonction pour fermer la modale
function closeModalHandler() {
    modal.classList.remove("show");
    setTimeout(() => {
        modal.style.display = "none";
    }, 300); // Correspond à la durée de la transition
}

// Fonction pour fermer la modale en cliquant en dehors
function outsideClickHandler(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// Ajouter des événements
modifyButton.addEventListener("click", openModal);
closeModal.addEventListener("click", closeModalHandler);
window.addEventListener("click", outsideClickHandler);

function displayWorksInModal(works) {
    const galleryContainer = document.getElementById('modal-gallery');
    galleryContainer.innerHTML = ''; // Clear previous content

    works.forEach(work => {
        const workElement = document.createElement('div');
        workElement.className = 'gallery-item';
        workElement.id = `work-${work.id}`;

        workElement.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <h3>${work.title}</h3>
            <p>${work.description}</p>
            <button onclick="deleteWork(${work.id})">Supprimer</button>
        `;

        galleryContainer.appendChild(workElement);
    });
}

// Récupérer les travaux et les afficher dans la modale
fetchData('works')
    .then(displayWorksInModal)
    .catch(error => console.error('Erreur lors de l\'affichage des travaux :', error));

