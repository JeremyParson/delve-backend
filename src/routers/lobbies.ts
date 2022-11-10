import { Router, Request, Response } from "express";
import Lobbies from "../data/lobbies";
const router = Router();

router.get("/", async (req: Request, res: Response, next: Function) => {
  try {
    const lobbies = await Lobbies.index();
    res.status(200).json(lobbies);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const user = await Lobbies.detail({
      id: Number(req.params.id),
    });
    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
});

router.use("/:id", (req: Request, res: Response, next: Function) => {
  if (!req.currentUser) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }
  next();
});

router.post("/", async (req: Request, res: Response, next: Function) => {
  try {
    const user = await Lobbies.create(req.body);
    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
});

router.use("/:id", (req: Request, res: Response, next: Function) => {
  const lobby = Lobbies.detail({
    id: Number(req.params.id),
    userLobbies: {
      some: {
        userId: req.currentUser.id,
      },
    },
  });
  if (!lobby) {
    res.status(401).json({ message: "You cannot access this resource." });
    return;
  }
  next();
});

router.patch("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const lobby = await Lobbies.update(Number(req.params.id), req.body);
    res.status(200).json(lobby);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const user = await Lobbies.delete(Number(req.params.id));
    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
});

export default router;
