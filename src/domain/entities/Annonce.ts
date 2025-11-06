// src/domain/entities/Annonce.ts
export class Annonce {
  constructor(
    public readonly id: string,
    public titre: string,
    public description: string,
    public prix: number,
    public readonly createdAt: Date = new Date()
  ) {
    if (!titre?.trim()) throw new Error("Titre requis");
    if (!description?.trim()) throw new Error("Description requise");
    if (prix <= 0) throw new Error("Le prix doit être > 0");
  }
}
