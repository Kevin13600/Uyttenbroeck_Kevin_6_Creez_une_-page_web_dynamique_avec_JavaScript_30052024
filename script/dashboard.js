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