import * as path from "path";
import * as fsSync from "fs";
import * as fs from "fs/promises";
import { MapObject } from "../types";
import { HttpError } from "../classes/error";

if (!process.env.APPDATA) throw new Error("APP_DATA directory not found!");

const DIRECTORIES = {
    MAP_DIR: path.join(process.env.APPDATA, "../", "Local", "PerfectHeist2", "Saved", "LevelEditor")
};

/**
 * Checks if the given path exists
 * @param pathLike The path to check
 * @returns True if exists
 */
async function exits( pathLike : fsSync.PathLike ) {
    try { await fs.stat(pathLike); } catch(e) { return false; }
    return true;
}

/**
 * Singleton class to manage file related tasks
 */
export class FileManager {

    private static _instance : FileManager|undefined;

    static get instance() {
        if (FileManager._instance === undefined) FileManager._instance = new FileManager();
        return FileManager._instance;
    }

    private constructor() {}

    /**
     * Lists all level editor maps
     * @returns An array of map name and image
     */
    async getMaps() {
        try {
            const dirs = (await fs.readdir(DIRECTORIES.MAP_DIR, { withFileTypes: true })).filter( d => d.isDirectory() );
            return await Promise.all(dirs.map( async d => {
                return {
                    name: d.name,
                    image: await fs.readFile(path.join(DIRECTORIES.MAP_DIR, d.name, "preview.png"))
                } as MapObject;
            }));
        } catch(e) {
            console.error("Could not read map directory:", e);
            return [];
        }
    }

    /**
     * Gets info about a specific map
     * @param name The name of the map
     * @returns The map info or null
     */
    async getMapByName( name: string ) {
        try {
            return {
                name,
                image: await fs.readFile(path.join(DIRECTORIES.MAP_DIR, name, "preview.png"))
            } as MapObject;
        } catch(e) {
            console.error("Could not read map directory:", e);
            throw new HttpError("Could not read map directory!");
        }
    }

    /**
     * Copies the given model (.fbx model and .png texture) to the currently
     * selected map
     * @param map The map to copy it to
     * @param modelPath The filepath to the model
     * @param texturePath The filepath to the texture
     */
    async addModel( map: string, modelPath: string, texturePath: string ) {        
        try {
            const file = path.parse(modelPath);
            await fs.symlink(modelPath, path.join(DIRECTORIES.MAP_DIR, map, file.base));
            await fs.symlink(texturePath, path.join(DIRECTORIES.MAP_DIR, map, file.name+".png"));
        } catch(e) {
            console.error("Could not create symlinks:", e);
            throw new HttpError("Could not copy model objects!");
        }
    }
    
    /**
     * Removes a custom object (model and texture) from the current map
     * @param map The map to remove it from
     * @param name The name of the custom object used in the currently selected
     * map
     */
    async removeModel( map: string, name: string ) {
        try {
            await fs.unlink(path.join(DIRECTORIES.MAP_DIR, map, name+".fbx"));
            await fs.unlink(path.join(DIRECTORIES.MAP_DIR, map, name+".png"));
        } catch(e) {
            console.error("Could not remove model:", e);
            throw new HttpError("Could not remove model objects!");
        }
    }
    
    /**
     * Returns all custom models in the current map
     * @param map The map to get the models from
     */
    async getModelsInMap( map: string ) {
        const files = await fs.readdir(path.join(DIRECTORIES.MAP_DIR, map), { withFileTypes: true });
        return files.filter( f => f.isFile() && f.name.endsWith(".fbx") ).map( f => path.parse(f.name).name );
    }

}
