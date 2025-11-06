// src/tests/usecases.spec.ts
import test from "node:test";
import assert from "node:assert/strict";

/**
 * Ces tests ne touchent ni Express, ni le FS, uniquement le domaine + in-memory.
 * C’est exactement l’esprit “hexagonal” : le cœur reste testable sans infra.
 */
import { PublierAnnonce } from "../domain/usecases/PublierAnnonce";
import { ConsulterAnnonce } from "../domain/usecases/ConsulterAnnonce";
import { MettreAJourAnnonce } from "../domain/usecases/MettreAJourAnnonce";
import { AnnonceRepositoryInMemory } from "../infrastructure/repositories/AnnonceRepositoryInMemory";

// utilitaire : crée un repo + UC prêts à l’emploi
function makeFixture() {
  const repo = new AnnonceRepositoryInMemory();
  const publier = new PublierAnnonce(repo);
  const consulter = new ConsulterAnnonce(repo);
  const maj = new MettreAJourAnnonce(repo);
  return { repo, publier, consulter, maj };
}

test("PublierAnnonce crée une annonce valide et retourne un id", async () => {
  const { publier, repo } = makeFixture();

  const { id } = await publier.execute({
    titre: "Vélo route",
    description: "Bon état",
    prix: 350,
  });

  assert.ok(id, "devrait retourner un id");
  const saved = await repo.getById(id);
  assert.ok(saved);
  assert.equal(saved?.titre, "Vélo route");
  assert.equal(saved?.prix, 350);
});

test("PublierAnnonce rejette un prix <= 0", async () => {
  const { publier } = makeFixture();

  await assert.rejects(
    () =>
      publier.execute({
        titre: "X",
        description: "Y",
        prix: 0,
      }),
    /Le prix doit être > 0|Le prix doit être supérieur à 0/
  );
});

test("ConsulterAnnonce renvoie l'annonce par id", async () => {
  const { publier, consulter } = makeFixture();
  const { id } = await publier.execute({
    titre: "Chaise",
    description: "Bois",
    prix: 50,
  });

  const a = await consulter.execute(id);
  assert.equal(a.id, id);
  assert.equal(a.titre, "Chaise");
  assert.equal(a.description, "Bois");
  assert.equal(a.prix, 50);
});

test("ConsulterAnnonce lève une erreur si id inconnu", async () => {
  const { consulter } = makeFixture();
  await assert.rejects(() => consulter.execute("inexistant"), /introuvable/i);
});

test("MettreAJourAnnonce modifie partiellement (prix)", async () => {
  const { publier, maj, consulter } = makeFixture();
  const { id } = await publier.execute({
    titre: "Souris",
    description: "USB",
    prix: 20,
  });

  const updated = await maj.execute({ id, prix: 25 });
  assert.equal(updated.prix, 25);
  const reread = await consulter.execute(id);
  assert.equal(reread.prix, 25);
});

test("MettreAJourAnnonce valide les champs", async () => {
  const { publier, maj } = makeFixture();
  const { id } = await publier.execute({
    titre: "Casque",
    description: "Audio",
    prix: 80,
  });

  await assert.rejects(() => maj.execute({ id, prix: -1 }), /prix/i);
  await assert.rejects(() => maj.execute({ id, titre: "" }), /titre/i);
  await assert.rejects(() => maj.execute({ id, description: "" }), /description/i);
});

test("MettreAJourAnnonce renvoie erreur si id inconnu", async () => {
  const { maj } = makeFixture();
  await assert.rejects(() => maj.execute({ id: "nope", prix: 10 }), /introuvable/i);
});
