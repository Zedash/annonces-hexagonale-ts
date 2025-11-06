// src/infrastructure/repositories/AnnonceRepositoryJsonFs.ts
import { promises as fs } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { Annonce } from "../../domain/entities/Annonce";
import { AnnonceRepository } from "../../domain/ports/AnnonceRepository";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = resolve(__dirname, "../../../data/annonces.json");

async function readAll(): Promise<Record<string, any>> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (e: any) {
    if (e.code === "ENOENT") return {};
    throw e;
  }
}
async function writeAll(db: Record<string, any>) {
  await fs.mkdir(dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export class AnnonceRepositoryJsonFs implements AnnonceRepository {
  async save(a: Annonce): Promise<void> {
    const db = await readAll();
    db[a.id] = {
      id: a.id,
      titre: a.titre,
      description: a.description,
      prix: a.prix,
      createdAt: a.createdAt.toISOString(),
    };
    await writeAll(db);
  }

  async getById(id: string): Promise<Annonce | null> {
    const db = await readAll();
    const r = db[id];
    if (!r) return null;
    return new Annonce(r.id, r.titre, r.description, Number(r.prix), new Date(r.createdAt));
  }
}
