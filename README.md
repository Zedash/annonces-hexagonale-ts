# annonces-hexagonale-ts

Mini-API REST **TypeScript/Express** illustrant l’**architecture hexagonale (Ports & Adapters)** pour un site de petites annonces. **Aucune base externe requise** : la persistance se fait dans un simple fichier JSON.

## ✨ Caractéristiques

* Domaine pur (entités, ports, use cases) sans dépendances framework/DB
* Adaptateur entrant HTTP (Express)
* Adaptateur sortant **document** basé fichier JSON (fs)
* Endpoints : `POST /annonces`, `GET /annonces/:id`, `PATCH /annonces/:id`
* Zod pour les validations

## 🚀 Démarrage rapide

```bash
# 1) Cloner
git clone https://github.com/<ton-user>/annonces-hexagonale-ts.git
cd annonces-hexagonale-ts

# 2) Installer
npm i

# 3) Lancer en dev
npm run dev
# Le serveur écoute sur http://localhost:3000
```

> Par défaut, les données sont stockées dans `data/annonces.json`. Le fichier est créé automatiquement au premier write.

## 🔌 Endpoints & exemples

### Créer une annonce

```
POST http://localhost:3000/annonces
Content-Type: application/json

{
  "titre": "Vélo route",
  "description": "Bon état",
  "prix": 350
}
```

**Réponse 201**

```json
{ "id": "<uuid>" }
```

### Consulter une annonce

```
GET http://localhost:3000/annonces/<id>
```

**Réponse 200**

```json
{
  "id": "<id>",
  "titre": "Vélo route",
  "description": "Bon état",
  "prix": 350,
  "createdAt": "2025-11-06T10:00:00.000Z"
}
```

### Mettre à jour partiellement (PATCH)

```
PATCH http://localhost:3000/annonces/<id>
Content-Type: application/json

{ "prix": 320 }
```

**Réponse 200**: l’annonce mise à jour.

## 🗂 Arborescence

```
src/
├─ domain/
│  ├─ entities/Annonce.ts
│  ├─ ports/AnnonceRepository.ts
│  └─ usecases/{PublierAnnonce.ts, ConsulterAnnonce.ts, MettreAJourAnnonce.ts}
├─ app/
│  └─ http/AnnonceController.ts
├─ infrastructure/
│  └─ repositories/AnnonceRepositoryJsonFs.ts
└─ main.ts
```

## ⚙️ Scripts NPM

```json
{
  "dev": "ts-node-dev --respawn src/main.ts",
  "build": "tsc -p .",
  "start": "node dist/main.js"
}
```

## 🔒 Notes

* Le repo JSON n’est **pas concurrent-safe** (usage démo/dev). Pour la prod, remplacer par un adaptateur DB réel (RDS, DynamoDB, etc.) sans toucher au domaine.

## 🧪 Tests (optionnel)

* Tester les use cases avec un dépôt InMemory pour éviter l’I/O.

## 📝 Licence

MIT
