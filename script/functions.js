// Fonctions pour mettre à jour l'interface utilisateur
export function updateUI(isAdmin, showAdminUI, showRegularUserUI) {
  if (isAdmin()) {
    showAdminUI();
  } else {
    showRegularUserUI();
  }
}

export function showAdminUI(logoutBtn, loginBtn, modifyBtn, blockTitle) {
  logoutBtn.classList.remove("displayNone");
  loginBtn.classList.add("displayNone");
  modifyBtn.classList.remove("displayNone");
  blockTitle.classList.add("marginCenter");
}

export function showRegularUserUI(logoutBtn, loginBtn, modifyBtn) {
  logoutBtn.classList.add("displayNone");
  loginBtn.classList.remove("displayNone");
  modifyBtn.classList.add("displayNone");
}


// Fonctions pour gérer la galerie et les filtres
export function populateGallery(works, gallery) {
    gallery.innerHTML = "";
  
    works.forEach(({ id, imageUrl, title }) => {
      const figure = document.createElement("figure");
      figure.classList.add("gallery-item");
  
      const image = document.createElement("img");
      image.src = imageUrl;
      image.alt = title;
      image.classList.add("gallery-image");

      const caption = document.createElement("figcaption");
      caption.textContent = title;
      caption.classList.add("gallery-caption");
  
      figure.appendChild(image);
      figure.appendChild(caption);
      gallery.appendChild(figure);
    });
  }
  
  export function filterGallery(filter, allItems, populateGallery, gallery) {
    let filteredItems;
  
    if (filter === "Tous") {
      filteredItems = allItems;
    } else {
      filteredItems = allItems.filter((item) => item.category.name === filter);
    }
  
    populateGallery(filteredItems, gallery);
  }
  
  export async function createFilterButtons(
    isAdmin,
    fetchCategories,
    filterGallery,
    filterContainer,
    allItems,
    gallery
  ) {
    if (!isAdmin()) {
      filterContainer.innerHTML = "";
  
      try {
        const categories = await fetchCategories();
        const filterarray = [
          "Tous",
          ...categories.map((category) => category.name),
        ];
  
        filterarray.forEach((filter, index) => {
          const filterbutton = document.createElement("button");
          filterbutton.classList.add("filter-btn");
          filterbutton.textContent = filter;
  
          filterbutton.addEventListener("click", () => {
            filterGallery(filter, allItems, populateGallery, gallery);
            document
              .querySelectorAll(".filter-btn")
              .forEach((btn) => btn.classList.remove("filter-btn-selected"));
            filterbutton.classList.add("filter-btn-selected");
          });
  
          if (index === 0) {
            filterbutton.classList.add("filter-btn-selected");
          }
  
          filterContainer.appendChild(filterbutton);
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
      }
    }
  }


// Fonctions pour gérer la modale
export function showModal(modal, modalContainer, content) {
  modalContainer.innerHTML = content;
  modal.classList.remove("displayNone");
}

export function hideModal(modal, modalContainer) {
  modal.classList.add("displayNone");
  modalContainer.innerHTML = "";
}

export async function generateGalleryView(fetchData, allItems) {
    let galleryItems = "";
    allItems.forEach((work) => {
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
}

export function generateAddPhotoForm() {
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
export async function deletePhoto(photoId, photoDiv, allItems, gallery) {
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
        if (Array.isArray(allItems)) { // Vérifie si allItems est un tableau
          if (photoDiv) {
            // Supprimer l'élément visuel immédiatement dans la modale
            photoDiv.remove();
            console.log('Photo supprimée avec succès de la modale');

            // Mise à jour de la liste d'éléments
            allItems = allItems.filter(item => item.id != photoId);

            // Mise à jour de la galerie en temps réel
            populateGallery(allItems, gallery);
            console.log('Photo supprimée avec succès de la galerie');
            return allItems;
          } else {
            console.warn('Élément DOM photoDiv est null ou non défini.');
          }
        } else {
          console.error('allItems n\'est pas un tableau.');
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


  
export function extractPhotoIdFromElement(photoElement) {
  return photoElement.getAttribute("data-photo-id");
}




