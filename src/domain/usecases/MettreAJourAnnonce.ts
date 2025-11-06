// src/domain/usecases/MettreAJourAnnonce.ts
import { AnnonceRepository } from "../ports/AnnonceRepository";
import { Annonce } from "../entities/Annonce";

type Input = {
  id: string;
  titre?: string;
  description?: string;
  prix?: number;
};

export class MettreAJourAnnonce {
  constructor(private readonly repo: AnnonceRepository) {}

  async execute(input: Input): Promise<Annonce> {
    const a = await this.repo.getById(input.id);
    if (!a) throw new Error("Annonce introuvable");

    if (input.titre !== undefined) {
      if (!input.titre.trim()) throw new Error("Titre invalide");
      a.titre = input.titre;
    }
    if (input.description !== undefined) {
      if (!input.description.trim()) throw new Error("Description invalide");
      a.description = input.description;
    }
    if (input.prix !== undefined) {
      if (input.prix <= 0) throw new Error("Le prix doit être > 0");
      a.prix = input.prix;
    }
    await this.repo.save(a);
    return a;
  }
}
