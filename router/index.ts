import { Router } from "express";
import { MAP_ROUTER } from "./map-router";
import { MODEL_ROUTER } from "./model-router";

export const API_ROUTER = Router();

API_ROUTER.use("/maps", MAP_ROUTER);
API_ROUTER.use("/models", MODEL_ROUTER);
API_ROUTER.get<"/file", {}, any, undefined, { path: string }>("/file", (req, res, next) => res.sendFile(req.query.path, err => err && next(err)) );
API_ROUTER.use( (req, res) => res.status(404).send("No API or page under this path!") ); // default route handler