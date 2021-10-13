import express from "express";
import morgan from "morgan";
import cors from "cors";
import apiRouter from "./routers/controllers";

const APIPORT = 8000;

const apiApp = express();
const corsOptions = {
    origin: [/localhost:3000/],
};

const appSetting = (app) => {
    app.use(morgan("dev"));
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());
    app.use("/node_modules", express.static("node_modules"));
};

appSetting(apiApp);

apiApp.use("/api", cors(corsOptions), apiRouter);

const handleApiListen = () => console.log(`Api Listening: http://localhost:${APIPORT}`);
apiApp.listen(APIPORT,handleApiListen);
