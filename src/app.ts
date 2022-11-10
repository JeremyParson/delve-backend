require("dotenv").config();
import express, { Request, Response } from "express";
import cors from "cors";
import useMiddleware from "./middleware";
import errorHandler from "./middleware/errorHandler";
import routers from "./routers";
import bodyParser from "body-parser";

const app: express.Application = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cors());
useMiddleware(app);
app.get("/", async (req: Request, res: Response) => {
  res.json({ message: "conceptiverse api" }).status(200);
});
app.use("/api/v1/", routers);
app.use(errorHandler);

export default app;
