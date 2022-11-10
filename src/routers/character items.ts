import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import CharacterItems from "../data/character items";
import Characters from "../data/characters";

const router = Router();

router.get("/", async (_req: Request, res: Response, next: Function) => {
  try {
    const characterItems = await CharacterItems.index();
    res.status(200).json(characterItems);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const user = await CharacterItems.detail({
      id: Number(req.params.id),
    });
    res.status(200).json(user);
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
    const user = await CharacterItems.create(req.body);
    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
});

router.use("/:id", async (req: Request, res: Response, next: Function) => {
  if (req.currentUser.role == "admin") return next();
  const character = await Characters.detail({
    id: Number(req.params.id),
    userid: req.currentUser.id,
  });

  if (!character) {
    res.status(401).json({ message: "You cannot access this resource." });
    return;
  }

  next();
});

router.patch("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const characterAbility = await CharacterItems.update(
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
    const user = await CharacterItems.delete(Number(req.params.id));
    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
});

export default router;
