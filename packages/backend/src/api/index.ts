import { Router } from "express";
import { router as userRoutes } from "./user";

const api = Router();

api.use("/users", userRoutes);

export { api };
