# 📚 LireMonde

Une application web de gestion de bibliothèque personnelle — parcourez des livres, gérez votre liste de lecture et administrez le catalogue.

---

## ✨ Fonctionnalités

- 🏠 **Accueil** — Parcourir tous les livres avec filtres par genre et recherche en temps réel
- 📖 **À lire** — Gérer sa liste de lecture personnelle (ajouter / retirer)
- 🛠️ **Admin** — Ajouter, modifier et supprimer des livres via un tableau de bord

---

## 🗂️ Structure du projet

```
Lire-monde/
├── index.html        # Page d'accueil — catalogue des livres
├── alire.html        # Page liste de lecture personnelle
├── admin.html        # Page d'administration du catalogue
├── script.js         # Logique JavaScript (API + pages)
├── style.css         # Styles de l'application
├── db.json           # Base de données JSON (JSON Server)
├── package.json      # Dépendances Node.js
└── .gitignore
```

---

## 🚀 Installation & Lancement

### Prérequis
- [Node.js](https://nodejs.org/) installé sur votre machine

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/taoufikx-star/Lire-monde.git
cd Lire-monde

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur JSON
npm start
```

L'application sera accessible sur **http://localhost:3000**

---

## 🛠️ Technologies utilisées

| Technologie | Rôle |
|---|---|
| HTML5 | Structure des pages |
| CSS3 | Mise en forme et design |
| JavaScript (ES6+) | Logique métier et appels API |
| JSON Server | Fausse API REST locale |

---

## 📡 API Endpoints

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/livres` | Récupérer tous les livres |
| `GET` | `/livres/:id` | Récupérer un livre par id |
| `POST` | `/livres` | Ajouter un nouveau livre |
| `PUT` | `/livres/:id` | Modifier un livre entier |
| `PATCH` | `/livres/:id` | Modifier un champ (ex: aLire) |
| `DELETE` | `/livres/:id` | Supprimer un livre |

---

## 👤 Auteur

**T. Belamri** — [@taoufikx-star](https://github.com/taoufikx-star)

---

## 📄 Licence

Ce projet est open source — libre d'utilisation et de modification.
