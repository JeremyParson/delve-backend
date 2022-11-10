import { Router, Request, Response } from "express";
import CharacterAbilities from "../data/character abilities";
import Character from "../data/characters";

const router = Router();

router.get("/", async (_req: Request, res: Response, next: Function) => {
  try {
    const characterAbilities = await CharacterAbilities.index();

    res.status(200).json(characterAbilities);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const characterAbilities = await CharacterAbilities.detail({
      id: Number(req.params.id),
    });

    res.status(200).json(characterAbilities);
  } catch (e) {
    next(e);
  }
});

router.use((req: Request, res: Response, next: Function) => {
  if (!req.currentUser) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }
  next();
});

router.post("/", async (req: Request, res: Response, next: Function) => {
  try {
    const characterAbilities = await CharacterAbilities.create(req.body);

    res.status(200).json(characterAbilities);
  } catch (e) {
    next(e);
  }
});

router.use("/:id", async (req: Request, res: Response, next: Function) => {
  if (req.currentUser.role == "admin") return next();
  const character = await Character.detail({
    userid: req.currentUser.id,
    characterAbilities: {
      some: {
        id: Number(req.params.id),
      },
    },
  });
  if (!character) {
    res.status(401).json({ message: "You cannot access this resource." });
    return;
  }
  next();
});

router.patch("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const characterAbility = await CharacterAbilities.update(
      Number(req.params.id),
      req.body
    );

    res.status(200).json(characterAbility);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const characterAbilities = await CharacterAbilities.delete(
      Number(req.params.id)
    );

    res.status(200).json(characterAbilities);
  } catch (e) {
    next(e);
  }
});

export default router;
