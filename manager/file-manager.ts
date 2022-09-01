import * as path from "path";
import * as fsSync from "fs";
import * as fs from "fs/promises";
import { HttpError } from "../classes/error";
import { ModelFolderObject } from "../types";

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
     * @returns An array of map name
     */
    async getMaps() {
        try {
            const dirs = (await fs.readdir(DIRECTORIES.MAP_DIR, { withFileTypes: true })).filter( d => d.isDirectory() );
            return dirs.map( d => d.name );
        } catch(e) {
            console.error("Could not read map directory:", e);
            return [];
        }
    }

    /**
     * Gets image filepath of a specific map
     * @param name The name of the map
     */
    getMapImagePath( name: string ) {
        return path.join(DIRECTORIES.MAP_DIR, name, "preview.png");
    }

    /**
     * Copies the given model (.fbx model and .png texture) to the currently
     * selected map
     * @param map The map to copy it to
     * @param modelPath The filepath to the model
     * @param texturePath The filepath to the texture
     */
    async addModel( map: string, modelPath: string, texturePath?: string ) {        
        try {
            await fs.copyFile(modelPath+".fbx", path.join(DIRECTORIES.MAP_DIR, map, path.parse(modelPath).name+".fbx"));
            if (texturePath !== undefined) await fs.copyFile(texturePath+".png", path.join(DIRECTORIES.MAP_DIR, map, path.parse(texturePath).name+".png"));
        } catch(e) {
            console.error("Could copy files:", e);
            throw new HttpError("Could not copy model object(s)! Make sure the path is correct.");
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
        const m = {} as ModelFolderObject;
        for (const f of await fs.readdir(path.join(DIRECTORIES.MAP_DIR, map), { withFileTypes: true })) {
            if (f.isFile() && f.name.endsWith(".fbx")) {
                const name = f.name.slice(0, -4);
                m[name] = fsSync.existsSync(name+".png");
            }
        }
        return m;
    }

    /**
     * Deep-searches all 3D FBX models in the given directory
     * @param dir The directory to search
     * @returns The filepaths relative to the given directory
     */
    async getModelsInDirectory( dir: string ) {

        async function listFiles( cwd: string ) {
            const m = {} as ModelFolderObject;

            let count = 0;
            for (const node of await fs.readdir(cwd, { withFileTypes: true })) {
                const filepath = path.join(cwd, node.name);
                if (node.isDirectory()) {
                    const subdir = await listFiles(filepath);
                    if (subdir !== undefined) {
                        m[node.name] = subdir;
                        count++;
                    }
                } else if (node.isFile() && node.name.endsWith(".fbx")) {
                    m[node.name.slice(0, -4)] = fsSync.existsSync(filepath.slice(0, -4)+".png");
                    count++;
                }
            }
            return count === 0 ? undefined : m;
        }
        
        return listFiles(dir) || {};
    }

}
