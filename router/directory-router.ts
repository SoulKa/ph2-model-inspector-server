import path from "path";
import { Router } from "express";
import { FileManager } from "../manager/file-manager";

export const DIRECTORY_ROUTER = Router();

const fileManager = FileManager.instance;

// get a file or list a directory
DIRECTORY_ROUTER.get<"/", {}, any|string[], undefined, { path: string }>("/", (req, res, next) => {
    fileManager.listFiles(req.query.path)
        .then( files => {
            if (files === null) res.sendFile(req.query.path, err => err && next(err));
            else res.send(files);
        }).catch(next);
});

// gets the OS specific file path delimiter
DIRECTORY_ROUTER.get<"/delimiter">("/delimiter", (req, res) => res.send({ delimiter: path.sep }));