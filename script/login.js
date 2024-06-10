import { fetchData } from '../script/api.js';

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
            window.location.href = 'Portfolio-architecte-sophie-bluel/FrontEnd/index.html'; // Rediriger vers la page d'accueil
  
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