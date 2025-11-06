// src/app/http/AnnonceController.ts
import { Router } from "express";
import { z } from "zod";
import { PublierAnnonce } from "../../domain/usecases/PublierAnnonce";
import { ConsulterAnnonce } from "../../domain/usecases/ConsulterAnnonce";
import { MettreAJourAnnonce } from "../../domain/usecases/MettreAJourAnnonce";

export function createAnnonceRouter(deps: {
  publierAnnonce: PublierAnnonce;
  consulterAnnonce: ConsulterAnnonce;
  mettreAJourAnnonce: MettreAJourAnnonce;
}) {
  const router = Router();

  const publierSchema = z.object({
    titre: z.string().min(1),
    description: z.string().min(1),
    prix: z.number().positive(),
  });

  router.post("/", async (req, res) => {
    try {
      const parsed = publierSchema.parse(req.body);
      const result = await deps.publierAnnonce.execute(parsed);
      res.status(201).json({ id: result.id });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const a = await deps.consulterAnnonce.execute(req.params.id);
      res.json({
        id: a.id,
        titre: a.titre,
        description: a.description,
        prix: a.prix,
        createdAt: a.createdAt.toISOString(),
      });
    } catch (e: any) {
      res.status(404).json({ error: e.message });
    }
  });

  const patchSchema = z.object({
    titre: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    prix: z.number().positive().optional(),
  }).refine((o) => Object.keys(o).length > 0, { message: "Payload vide" });

  router.patch("/:id", async (req, res) => {
    try {
      const update = patchSchema.parse(req.body);
      const a = await deps.mettreAJourAnnonce.execute({ id: req.params.id, ...update });
      res.json({
        id: a.id,
        titre: a.titre,
        description: a.description,
        prix: a.prix,
        createdAt: a.createdAt.toISOString(),
      });
    } catch (e: any) {
      const code = e.message.includes("introuvable") ? 404 : 400;
      res.status(code).json({ error: e.message });
    }
  });

  return router;
}
