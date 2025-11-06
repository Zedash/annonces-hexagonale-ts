// src/main.ts
import express from "express";
import bodyParser from "body-parser";
import { AnnonceRepositoryJsonFs } from "./infrastructure/repositories/AnnonceRepositoryJsonFs";
import { PublierAnnonce } from "./domain/usecases/PublierAnnonce";
import { ConsulterAnnonce } from "./domain/usecases/ConsulterAnnonce";
import { MettreAJourAnnonce } from "./domain/usecases/MettreAJourAnnonce";
import { createAnnonceRouter } from "./app/http/AnnonceController";

const app = express();
app.use(bodyParser.json());

const repo = new AnnonceRepositoryJsonFs();

const publierAnnonce = new PublierAnnonce(repo);
const consulterAnnonce = new ConsulterAnnonce(repo);
const mettreAJourAnnonce = new MettreAJourAnnonce(repo);

app.use("/annonces", createAnnonceRouter({ publierAnnonce, consulterAnnonce, mettreAJourAnnonce }));

app.get("/health", (_req, res) => res.send("OK"));
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`HTTP server on http://localhost:${PORT}`));
