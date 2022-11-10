import { Router, Request, Response } from "express";
import Users from "../data/user";
import * as bcrypt from "bcrypt";

const router = Router();

router.get("/", async (req: Request, res: Response, next: Function) => {
  try {
    const users = await Users.index();
    res.status(200).json(users);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const user = await Users.detail({
      id: Number(req.params.id),
    })
    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req: Request, res: Response, next: Function) => {
  try {
    const passwordDigest = bcrypt.hashSync(req.body.password, 10);
    const user = await Users.create({
      username: req.body.username,
      email: req.body.email,
      password_digest: passwordDigest,
      role: "user",
    });
    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
});

router.use((req: Request, res: Response, next: Function) => {
  if (!req.currentUser) {
    res.status(401).json({ message: "You must be logged." });
    return;
  }
  next();
});

router.use("/:id", (req: Request, res: Response, next: Function) => {
  if (req.currentUser.role == "admin") return next();
  if (req.currentUser.id !== Number(req.params.id)) {
    res.status(401).json({ message: "You cannot access this resource." });
    return;
  }
  next();
});

router.patch("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const lobby = await Users.update(Number(req.params.id), req.body);
    res.status(200).json(lobby);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const user = await Users.delete(Number(req.params.id));
    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
});

export default router;
