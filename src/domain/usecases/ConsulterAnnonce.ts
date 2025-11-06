// src/domain/usecases/ConsulterAnnonce.ts
import { AnnonceRepository } from "../ports/AnnonceRepository";
import { Annonce } from "../entities/Annonce";

export class ConsulterAnnonce {
  constructor(private readonly repo: AnnonceRepository) {}

  async execute(id: string): Promise<Annonce> {
    const annonce = await this.repo.getById(id);
    if (!annonce) throw new Error("Annonce introuvable");
    return annonce;
  }
}
