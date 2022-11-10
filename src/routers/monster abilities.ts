import { Router, Request, Response } from "express";
import MonsterAbilities from "../data/monster abilities";

const router = Router();

router.get("/", async (req: Request, res: Response, next: Function) => {
  try {
    const monsterAbilities = await MonsterAbilities.index();
    res.status(200).json(monsterAbilities);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const monsterAbility = await MonsterAbilities.detail({
      id: Number(req.params.id),
    });
    res.status(200).json(monsterAbility);
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
    const monsterAbility = await MonsterAbilities.create(req.body);
    res.status(200).json(monsterAbility);
  } catch (e) {
    next(e);
  }
});

router.patch("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const monsterAbility = await MonsterAbilities.update(
      Number(req.params.id),
      req.body
    );
    res.status(200).json(monsterAbility);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const monsterAbility = await MonsterAbilities.delete(Number(req.params.id));
    res.status(200).json(monsterAbility);
  } catch (e) {
    next(e);
  }
});

export default router;
