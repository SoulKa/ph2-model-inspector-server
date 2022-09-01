import path from "path";
import { Response, Router } from "express";
import { HttpError } from "../classes/error";
import { FileManager } from "../manager/file-manager";
import { ModelFolderObject, ModelObject } from "../types";

export const MAP_ROUTER = Router();
const MAP_SUBROUTER = Router();

const fileManager = FileManager.instance;

// get all maps
MAP_ROUTER.get<"/", {}, string[], undefined>( "/", (req, res, next) => {
    fileManager.getMaps().then(res.send.bind(res)).catch(next);
});



/* WORKING ON SPECIFIC MAP AT "/map/:name/..." */
MAP_ROUTER.use( "/:name", (req, res: Response<any, { mapName: string }>, next) => {
    const name = req.params.name;
    if (typeof name !== "string") throw new HttpError("Invalid map name in request!", 400);
    res.locals.mapName = name;
    MAP_SUBROUTER(req, res, next);
});

// get map info
MAP_SUBROUTER.get<"/preview.png", {}, string, undefined, {}, { mapName: string }>( "/preview.png", (req, res) => {
    res.sendFile(fileManager.getMapImagePath(res.locals.mapName));
});

// get all models in map
MAP_SUBROUTER.get<"/models", {}, ModelFolderObject, undefined, {}, { mapName: string }>( "/models", (req, res, next) => {
    fileManager.getModelsInMap(res.locals.mapName).then(res.send.bind(res)).catch(next);
});

// add models in map
MAP_SUBROUTER.post<"/models", {}, undefined, ModelObject, { modelDirectory: string }, { mapName: string }>( "/models", (req, res, next) => {
    if (req.query.modelDirectory === undefined) throw new HttpError("Missing model directory in URL query!");
    fileManager.addModel(
        res.locals.mapName,
        path.join(req.query.modelDirectory, ...req.body.modelPath.split(":")),
        req.body.texturePath !== undefined ? path.join(req.query.modelDirectory, ...req.body.texturePath.split(":")) : undefined
    ).then(() => res.send()).catch(next);
});