import { Router, Request, Response } from "express";
import Items from "../data/items";

const router = Router();

router.get("/", async (req: Request, res: Response, next: Function) => {
  try {
    const items = await Items.index();
    res.status(200).json(items);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const user = await Items.detail({
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
    const user = await Items.create(req.body);
    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
});

router.patch("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const item = await Items.update(Number(req.params.id), req.body);
    res.status(200).json(item);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const user = await Items.delete(Number(req.params.id));
    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
});

export default router;
