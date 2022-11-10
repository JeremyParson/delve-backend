import { Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

export default function errorHandler(err: Error, req: Request, res: Response, next: Function) {
  if (res.headersSent) return next(err);
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code == "P2019") {
      res
        .status(400)
        .json({ message: `An input error occurred: ${err.message}` });
    } else if (err.code == "P2025") {
      res
        .status(400)
        .json({ message: "The records you referenced do not exist." });
    } else if (err.code == "P1008") {
      res.status(400).json({ message: "A timeout occurred." });
    } else {
      res.status(500).json({ message: "An error occurred." });;
    }
  }
  next(err);
}
