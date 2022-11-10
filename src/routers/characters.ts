import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import Characters from "../data/characters";

const router = Router();

router.get("/", async (req: Request, res: Response, next: Function) => {
  try {
    const characters = await Characters.index();
    res.status(200).json(characters);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const character = await Characters.detail({
      id: Number(req.params.id),
    });
    res.status(200).json(character);
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
    const character = await Characters.create(req.body);
    res.status(200).json(character);
  } catch (e) {
    next(e);
  }
});

router.use(async (req: Request, res: Response, next: Function) => {
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
    const character = await Characters.update(Number(req.params.id), req.body);
    res.status(200).json(character);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const character = await Characters.delete(Number(req.params.id));
    res.status(200).json(character);
  } catch (e) {
    next(e);
  }
});

export default router;
