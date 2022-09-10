import path from "path";
import open from "open";
import express, { NextFunction, Request, Response } from "express";
import { HttpError } from "./classes/error";
import { API_ROUTER } from "./router";

const PORT = 8080;

async function run() {
    try {

        // setup web server
        const app = express();
        app.use(express.json()); // automatic JSON body parsing
        app.use("/api", API_ROUTER); // api to work on files
        app.use( async (err: HttpError, req: Request, res: Response, next: NextFunction) => { // error handler
            if (!err) return next();
            console.error(err);
            if (err instanceof Error) err = new HttpError(err.message);
            res.status(err.statusCode).send(err.message);
        });

        // static web app
        app.use(express.static(path.join(__dirname, "public")));
        app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

        // start server
        app.listen(PORT, "localhost", async () => {
            const url = "http://localhost:"+PORT;
            console.log(`Server running at "${url}"...`);
            try {
                if (!process.argv.includes("--no-open")) await open(url);
            } catch(e) {
                console.error("Could not open browser tab:", e);
            }
        });

    } catch(e) {
        console.error("Could not setup webserver:", e);
        process.exit(1);
    }
}
setImmediate(run);