import { Response, Router, Request } from "express";
import { HttpError } from "../classes/error";
import { FileManager } from "../manager/file-manager";
import { ModelObject } from "../types";

export const MAP_ROUTER = Router();
const MAP_SUBROUTER = Router();

const fileManager = FileManager.instance;

// get all maps
MAP_ROUTER.get<"/", {}, string[], undefined>( "/", async (req, res) => {
    res.send( await fileManager.getMaps() );
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
MAP_SUBROUTER.get<"/models", {}, string[], undefined, {}, { mapName: string }>( "/models", async (req, res) => {
    res.send( await fileManager.getModelsInMap(res.locals.mapName) );
});

// add models in map
MAP_SUBROUTER.post<"/models", {}, undefined, ModelObject[], {}, { mapName: string }>( "/models", async (req, res) => {
    if (!Array.isArray(req.body)) throw new HttpError("Expecting an array of model objects!", 400);
    for (const m of req.body) {
        await fileManager.addModel(res.locals.mapName, m.modelPath, m.texturePath);
    }
    res.send();
});