import { Response, Router } from "express";
import { HttpError } from "../classes/error";
import { FileManager } from "../manager/file-manager";
import { FileNodeObject, ModelObject, ModelPathInfoObject } from "../types";

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
MAP_SUBROUTER.get<"/preview.png", {}, string, undefined, {}, { mapName: string }>( "/preview.png", (req, res, next) => {
    res.sendFile(fileManager.getMapImagePath(res.locals.mapName), err => err && next(err));
});

// get all models of map
MAP_SUBROUTER.get<"/models", {}, FileNodeObject[], undefined, {}, { mapName: string }>( "/models", (req, res, next) => {
    fileManager.getModelsInMap(res.locals.mapName).then(res.send.bind(res)).catch(next);
});

// add model to map
MAP_SUBROUTER.post<"/models", {}, ModelPathInfoObject, ModelPathInfoObject, {}, { mapName: string }>( "/models", (req, res, next) => {
    fileManager.addModel( res.locals.mapName, req.body ).then(res.send.bind(res)).catch(next);
});

// remove model from map
MAP_SUBROUTER.delete<"/models/:model", { model: string }, undefined, undefined, {}, { mapName: string }>( "/models/:model", (req, res, next) => {
    fileManager.removeModel(
        res.locals.mapName,
        req.params.model
    ).then(() => res.end()).catch(next);
});