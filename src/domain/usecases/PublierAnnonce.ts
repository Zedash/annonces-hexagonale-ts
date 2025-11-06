// src/domain/usecases/PublierAnnonce.ts
import { randomUUID } from "crypto";
import { Annonce } from "../entities/Annonce";
import { AnnonceRepository } from "../ports/AnnonceRepository";

export type PublierAnnonceInput = {
  titre: string;
  description: string;
  prix: number;
};

export class PublierAnnonce {
  constructor(private readonly repo: AnnonceRepository) {}

  async execute(input: PublierAnnonceInput): Promise<{ id: string }> {
    const annonce = new Annonce(
      randomUUID(),
      input.titre,
      input.description,
      input.prix
    );
    await this.repo.save(annonce);
    return { id: annonce.id };
  }
}
