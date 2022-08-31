import { Router } from "express";
import path from "path";
import { HttpError } from "../classes/error";
import { FileManager } from "../manager/file-manager";
import { ModelFolderObject } from "../types";

export const MODEL_ROUTER = Router();
const MAP_SUBROUTER = Router();

const fileManager = FileManager.instance;

// extract model directory from URL query
MODEL_ROUTER.use<{}, undefined, undefined, { modelDirectory: string }, { modelDirectory: string }>((req, res, next) => {
    if (typeof req.query.modelDirectory !== "string" || req.query.modelDirectory === "") throw new HttpError("Missing model directory in URL query!", 400);
    res.locals.modelDirectory = req.query.modelDirectory;
    next();
});

// get all models
MODEL_ROUTER.get<"/", {}, ModelFolderObject, undefined, {}, { modelDirectory: string }>( "/", async (req, res) => {
    res.send( await fileManager.getModelsInDirectory(res.locals.modelDirectory) );
});

// get mesh
MODEL_ROUTER.get<"/mesh", {}, ModelFolderObject, undefined, { modelPath: string }, { modelDirectory: string }>( "/mesh", (req, res) => {
    if (req.query.modelPath === undefined) throw new HttpError("Missing model path query!", 400);
    const filepath = path.join(res.locals.modelDirectory, ...req.query.modelPath.split(":"))+".fbx";
    res.sendFile(filepath);
});

// get texture
MODEL_ROUTER.get<"/texture", {}, ModelFolderObject, undefined, { modelPath: string }, { modelDirectory: string }>( "/texture", (req, res) => {
    if (req.query.modelPath === undefined) throw new HttpError("Missing texture path query!", 400);
    const filepath = path.join(res.locals.modelDirectory, ...req.query.modelPath.split(":"))+".png";
    res.sendFile(filepath);
});