import express from "express";
import morgan from "morgan";
import cors from "cors";
import apiRouter from "./routers/noteController";
import userApi from "./routers/userController";

const APIPORT = 8000;

const apiApp = express();
const corsOptions = {
    origin: [/localhost:3500/],
};

const appSetting = (app) => {
    app.use(morgan("dev"));
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());
    app.use("/node_modules", express.static("node_modules"));
};

appSetting(apiApp);

apiApp.use("/api", cors(corsOptions), apiRouter);
apiApp.use("/api/users", cors(corsOptions), userApi);

const handleApiListen = () => console.log(`Api Listening: http://localhost:${APIPORT}`);
apiApp.listen(APIPORT,handleApiListen);
