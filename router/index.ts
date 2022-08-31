import { Router } from "express";
import { MAP_ROUTER } from "./map-router";
import { MODEL_ROUTER } from "./model-router";

export const API_ROUTER = Router();

API_ROUTER.use("/maps", MAP_ROUTER);
API_ROUTER.use("/models", MODEL_ROUTER);