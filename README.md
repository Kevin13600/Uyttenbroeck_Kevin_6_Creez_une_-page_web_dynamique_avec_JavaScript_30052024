# Portfolio Sophie Bluel - Architecte d'intérieur

## Structure du projet
```
Portfolio-architecte-sophie-bluel/
│
├── Backend/
├── FrontEnd/
│   ├── assets/
│   │   ├── icons/
│   │   ├── images/
│   │   └── style.css
│   ├── pages/
│   │   └── login.html
│   ├── script/
│   │   ├── api.js
│   │   ├── functions.js
│   │   ├── login.js
│   │   └── main.js
│   └── index.html
└── README.md
```

## Fonctionnalités
- Affichage dynamique des projets via l'API
- Filtrage des projets par catégorie
- Interface d'administration sécurisée
- Gestion des projets (ajout/suppression)
- Modale d'upload de nouveaux projets

## Technologies
- HTML5
- CSS3
- JavaScript vanilla
- Node.js/Express (Backend)

## Installation

### Backend
```bash
cd Backend
npm install
npm start
```

### Frontend
Ouvrir index.html dans un navigateur

## Connexion administrateur
- Email: sophie.bluel@test.tld
- Password: S0phie 

## API Endpoints
- GET /api/works - Récupérer tous les projets
- POST /api/works - Ajouter un projet
- DELETE /api/works/:id - Supprimer un projet
- POST /api/users/login - Connexion administrateur

## Validation
- HTML/CSS W3C
- JavaScript ES6+
