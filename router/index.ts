import { Router } from "express";
import { MAP_ROUTER } from "./map-router";

export const API_ROUTER = Router();

API_ROUTER.use("/maps", MAP_ROUTER);
