import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import UserLobbies from "../data/user lobbies";

const router = Router();

router.get("/", async (req: Request, res: Response, next: Function) => {
  try {
    const userLobbies = await UserLobbies.index();
    res.status(200).json(userLobbies);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const user = await UserLobbies.detail({
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
    const user = await UserLobbies.create(req.body);
    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
});

router.use(async (req: Request, res: Response, next: Function) => {
  if (req.currentUser.role === "admin") return next();
  const userLobby = await UserLobbies.detail({
    id: Number(req.params.id),
    userId: req.currentUser.id,
  });

  if (!userLobby) {
    res.status(401).json({ message: "You cannot access this resource." });
    return;
  }

  next();
});

router.patch("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const character = await UserLobbies.update(Number(req.params.id), req.body);
    res.status(200).json(character);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const user = await UserLobbies.delete(Number(req.params.id));
    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
});

export default router;
