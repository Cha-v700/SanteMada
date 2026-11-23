# SantéMada : frontend React

## Lancer le projet
```
npm install
npm run dev
```
Ouvrir l'adresse affichée (souvent http://localhost:5173).

## Comptes de test
- Patient : 0340000001 / patient123
- Médecin : 0340000010 / medecin123 (voit les rendez-vous du Dr Rasoamanana)

## Structure
```
src/
├── main.jsx              point d'entrée : affiche <App /> dans la page
├── App.jsx               l'état "qui est connecté" + les routes (les pages)
├── index.css             tout le style du site
├── data/
│   ├── medecins.js       la liste des médecins
│   └── stockage.js       lire et écrire dans le localStorage
├── components/           les morceaux réutilisables
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── CarteMedecin.jsx
│   ├── Message.jsx
│   └── StatutBadge.jsx
└── pages/                une page = une adresse
    ├── Accueil.jsx            /
    ├── Connexion.jsx          /connexion
    ├── Inscription.jsx        /inscription
    ├── RendezVous.jsx         /rendez-vous/:id
    ├── MesRendezVous.jsx      /mes-rendez-vous   (patient)
    └── Agenda.jsx             /agenda            (médecin)
```
