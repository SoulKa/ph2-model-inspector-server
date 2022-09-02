import path from "path";
import fsSync from "fs";
import fs from "fs/promises";
import { HttpError } from "../classes/error";
import { DirectoryObject, FileNodeObject, FileNodeType, ModelFolderObject, ModelObject } from "../types";

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

    static get DIRECTORIES() { return DIRECTORIES; }

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
     * @param model The model
     */
    async addModel( map: string, model: ModelObject ) {        
        try {
            const modelPath = path.join(DIRECTORIES.MAP_DIR, map, path.parse(model.modelPath).base);
            const texturePath = model.texturePath === undefined ? undefined : path.join(DIRECTORIES.MAP_DIR, map, path.parse(model.texturePath).base);
            await fs.copyFile(model.modelPath, modelPath);
            if (texturePath !== undefined) await fs.copyFile(model.texturePath!, texturePath);
            model.modelPath = modelPath;
            model.texturePath = texturePath;
            return model;
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
            try {
                await fs.unlink(path.join(DIRECTORIES.MAP_DIR, map, name+".png"))
            } catch(e) {
                if ((e as Error & { errno: number, code: string, syscall: string, path: string })?.errno === -4058) return
                throw e;
            };
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
        return await this.getModelsInDirectory(path.join(DIRECTORIES.MAP_DIR, map));
    }

    /**
     * Deep-searches all 3D FBX models in the given directory
     * @param dir The directory to search
     * @returns The filepaths relative to the given directory
     */
    async getModelsInDirectory( dir: string ) {

        async function listFiles( cwd: string ) {
            const res = [] as ModelFolderObject;

            let count = 0;
            for (const file of await fs.readdir(cwd, { withFileTypes: true })) {
                const filepath = path.join(cwd, file.name);
                const obj = {
                    name: file.name
                } as FileNodeObject;

                // check type of file/dir
                if (file.isDirectory()) {
                    const subfiles = await listFiles(filepath);
                    if (subfiles === undefined) continue;
                    obj.type = FileNodeType.DIRECTORY;
                    (obj as DirectoryObject).children = subfiles;
                } else if (file.isFile() && file.name.endsWith(".fbx")) {
                    const texturePath = filepath.slice(0, -4)+".png";
                    obj.type = FileNodeType.MODEL;
                    obj.name = obj.name.slice(0, -4); // remove ".fbx"
                    (obj as ModelObject).modelPath = filepath;                    
                    if (fsSync.existsSync(texturePath)) (obj as ModelObject).texturePath = texturePath;
                } else {
                    continue;
                }
                
                // add to files/directories
                res.push(obj);
                count++;
            }
            return count === 0 ? undefined : res;
        }
        
        return (await listFiles(dir)) || [];
    }

}
