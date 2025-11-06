// src/domain/ports/AnnonceRepository.ts
import { Annonce } from "../entities/Annonce";

export interface AnnonceRepository {
  save(annonce: Annonce): Promise<void>;
  getById(id: string): Promise<Annonce | null>;
}
