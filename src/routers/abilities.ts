import { Router, Request, Response } from "express";
import Abilities from "../data/ability";

const router = Router();

router.get("/", async (_req: Request, res: Response, next: Function) => {
  try {
    const abilities = await Abilities.index();
    res.status(200).json(abilities);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const ability = await Abilities.detail({
      id: Number(req.params.id),
    });
    res.status(200).json(ability);
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

router.post("", async (req: Request, res: Response, next: Function) => {
  try {
    const ability = await Abilities.create({
      ...req.body,
    });
    res.status(200).json(ability);
  } catch (e) {
    next(e);
  }
});

router.patch("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const ability = await Abilities.update(Number(req.params.id), req.body);
    res.status(200).json(ability);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const ability = await Abilities.delete(Number(req.params.id));
    res.status(200).json(ability);
  } catch (e) {
    next(e);
  }
});

export default router;
