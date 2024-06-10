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


document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('.login-form');
  const submitButton = loginForm.querySelector('button[type="submit"]');
  const errorMessage = document.querySelector('.error-message');

  submitButton.addEventListener('click', async (event) => {
      event.preventDefault(); // Empêche le comportement par défaut du formulaire

      // Récupérer les valeurs des champs email et password
      const email = loginForm.querySelector('#email').value.trim();
      const password = loginForm.querySelector('#pass').value.trim();

      // Vérification des champs
      if (!email || !password) {
          displayError('Tous les champs sont obligatoires.');
          return;
      }

      if (!validateEmail(email)) {
          displayError('Veuillez entrer un email valide.');
          return;
      }

      try {
          // Envoi des données de connexion à l'API
          const userData = await login(email, password);

          // Vérifier si le token est présent
          if (!userData.token) {
              throw new Error('Token manquant dans la réponse.');
          }

          // Stocker le token d'authentification
          localStorage.setItem('authToken', userData.token);

          // Rediriger vers la page d'accueil ou afficher un message de bienvenue
          window.location.href = 'index.html'; // Rediriger vers la page d'accueil

      } catch (error) {
          console.error('Erreur lors de l\'authentification:', error);
          displayError('Échec de la connexion. Vérifiez vos informations de connexion.');
      }
  });

  // Fonction pour afficher les messages d'erreur
  function displayError(message) {
      errorMessage.textContent = message;
      errorMessage.style.display = 'block';
  }

  // Fonction pour valider le format de l'email
  function validateEmail(email) {
      const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      return re.test(email);
  }
});

// Fonction pour envoyer les informations de connexion à l'API
async function login(email, password) {
  const url = 'http://localhost:5678/api/users/login';

  const credentials = {
      email: email,
      password: password
  };

  const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
  };

  try {
      const response = await fetch(url, options);
      if (!response.ok) {
          throw new Error('Erreur HTTP ' + response.status);
      }
      const data = await response.json();
      return data;
  } catch (error) {
      throw error;
  }
}