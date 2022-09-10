import { Router } from "express";
import { HttpError } from "../classes/error";
import { FileManager } from "../manager/file-manager";
import { TextureConfigObject, ModelFolderObject } from "../types";

export const MODEL_ROUTER = Router();

const fileManager = FileManager.instance;

// extract model directory from URL query
MODEL_ROUTER.use<{}, undefined, undefined, { modelDirectory: string }, { modelDirectory: string }>( (req, res, next) => {
    if (typeof req.query.modelDirectory !== "string" || req.query.modelDirectory === "") throw new HttpError("Missing model directory in URL query!", 400);
    res.locals.modelDirectory = req.query.modelDirectory;
    next();
});

// list all models
MODEL_ROUTER.get<"/", {}, ModelFolderObject, undefined, {}, { modelDirectory: string }>( "/", (req, res, next) => {
    fileManager.getModelsInDirectory(res.locals.modelDirectory).then(res.send.bind(res)).catch(next);
});

// get custom textures
MODEL_ROUTER.get<"/textures", {}, TextureConfigObject, undefined, {}, { modelDirectory: string }>( "/textures", (req, res, next) => {
    fileManager.getTextureConfig(res.locals.modelDirectory).then(res.send.bind(res)).catch(next);
});

// set custom texture
MODEL_ROUTER.post<"/textures", {}, undefined, undefined, { texturePath: string; modelPath: string }, { modelDirectory: string }>( "/textures", (req, res, next) => {
    fileManager.getTextureConfig(res.locals.modelDirectory)
        .then( c => { c[req.query.modelPath] = req.query.texturePath; return fileManager.setTextureConfig(res.locals.modelDirectory, c); })
        .then( () => res.end() )
        .catch(next);
});