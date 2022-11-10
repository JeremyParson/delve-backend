import { Router, Request, Response } from "express";
import GameUsers from "../data/game users";

const router = Router();

router.get("/", async (req: Request, res: Response, next: Function) => {
  try {
    const gameUsers = await GameUsers.index();
    res.status(200).json(gameUsers);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const user = await GameUsers.detail({
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
    const user = await GameUsers.create(req.body);
    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
});

router.use(async (req: Request, res: Response, next: Function) => {
  if (req.currentUser.role === "admin") return next();
  const gameUser = await GameUsers.detail({
    gameId: Number(req.params.id),
    userId: req.currentUser.id,
  });

  if (!gameUser) {
    res.status(401).json({ message: "You cannot access this resource." });
    return;
  }

  next();
});

router.patch("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const gameUser = await GameUsers.update(Number(req.params.id), req.body);
    res.status(200).json(gameUser);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const user = await GameUsers.delete(Number(req.params.id));
    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
});

export default router;
