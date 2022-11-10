import { Application, Router } from "express";
import defineCurrentUser from "./defineCurrentUser";
import routeLog from "./routeLog";

export default (app: Application) => {
  app.use(routeLog);
  app.use(defineCurrentUser);
};
