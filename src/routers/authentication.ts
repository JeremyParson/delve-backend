import { Router, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import Users from "../data/user";

const router = Router();

router.post("/", async (req: Request, res: Response, next: Function) => {
  try {
    let user = await Users.detail({ email: req.body.email });
    if (!user || !bcrypt.compareSync(req.body.password, user.password_digest)) {
      res.status(404).json({
        message: `Could not find a user with the provided username and password`,
      });
      return;
    }
    const result = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.status(200).json({ user: user, token: result });
  } catch (e) {
    next(e);
  }
});

router.get("/profile", async (req: Request, res: Response, next: Function) => {
  try {
    res.json(req.currentUser);
  } catch (e) {
    next(e);
  }
});

export default router;
