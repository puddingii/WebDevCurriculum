import express from "express";
import morgan from "morgan";
import cors from "cors";
import apiRouter from "./routers/apiRouter";
import homeRouter from "./routers/homeRouter";

const APIPORT = 8000;
const CLIENTPORT = 3000;

const clientApp = express();
const apiApp = express();

const appSetting = (app) => {
    app.use("/static", express.static("public"));
    app.use(morgan("dev"));
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    app.use("/node_modules", express.static("node_modules"));
};

clientApp.set("views", `${process.cwd()}/src/views`);
clientApp.set("view engine", "ejs");
clientApp.engine("html", require("ejs").renderFile);
appSetting(clientApp);
appSetting(apiApp);

clientApp.use("/", homeRouter);
apiApp.use("/api", cors(), apiRouter);

const handleListen = () => console.log(`Listening: http://localhost:${CLIENTPORT}`);
const handleApiListen = () => console.log(`Listening: http://localhost:${APIPORT}`);
clientApp.listen(CLIENTPORT, handleListen);
apiApp.listen(APIPORT,handleApiListen);
