// src/infrastructure/repositories/AnnonceRepositoryInMemory.ts
import { Annonce } from "../../domain/entities/Annonce";
import { AnnonceRepository } from "../../domain/ports/AnnonceRepository";

// NB : ce repo est uniquement pour les tests/dev (pas de persistance disque).
export class AnnonceRepositoryInMemory implements AnnonceRepository {
  public store = new Map<string, Annonce>();

  async save(a: Annonce): Promise<void> {
    this.store.set(a.id, a);
  }

  async getById(id: string): Promise<Annonce | null> {
    return this.store.get(id) ?? null;
  }
}
