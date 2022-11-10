import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import GameMonsters from "../data/game monsters";

const router = Router();

router.get("/", async (req: Request, res: Response, next: Function) => {
  try {
    const gameUsers = await GameMonsters.index();
    res.status(200).json(gameUsers);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const user = await GameMonsters.detail({
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

router.use((req: Request, res: Response, next: Function) => {
  if (req.currentUser.role !== "admin") {
    res.status(401).json({ message: "You cannot access this resource." });
    return;
  }
  next();
});

router.post("/", async (req: Request, res: Response, next: Function) => {
  try {
    const user = await GameMonsters.create(req.body);
    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
});

router.patch("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const gameMonster = await GameMonsters.update(
      Number(req.params.id),
      req.body
    );
    res.status(200).json(gameMonster);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const user = await GameMonsters.delete(Number(req.params.id));
    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
});

export default router;
